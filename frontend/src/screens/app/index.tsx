import { StyleSheet,View, Image, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../constants/colors";
import { AntDesign } from '@expo/vector-icons';
import { Text } from "../../components/text";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MatchCard } from "../../components/match-card";
import { sports } from "../../constants/match-data";
import { useDimensions } from "../../hooks/useDimensions";
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { getLiveMatches, getFinishedMatches } from "../../services/common.service";
import { useAuth } from "../../contexts/auth";
import { BadmintonMatchType, MatchStatus, Sport, Tabs } from "../../constants/enum";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from "../../components/search-bar";
import { getAllTournaments } from "../../services/tournament.service";

export function HomePage() {
    const { width } = useDimensions();
    const [liveMatchData, setLiveMatchData] = useState(null); 
    const [finishedMatchesData, setFinishedMatchesData] = useState(null);
    const [tournamentsData, setTournamentsData] = useState(null);
    const [searchString, setSearchString] = useState<string>(null);
    const [sportType, setSportType] = useState<Sport>(Sport.BADMINTON);
    const [tab, setTab] = useState<Tabs>(Tabs.Home);
    const { navigate }: NavigationProp<any> = useNavigation();
    const route: RouteProp<any> = useRoute();
    const { authData } = useAuth();
    
    const fetchLiveMatchesData = async () => {
        let data = await getLiveMatches({ user: authData._id, limit: true, sport: sportType });
        setLiveMatchData(data);
    }

    const fetchFinishedMatchesData = async () => {
        let data = await getFinishedMatches({ user: authData._id, limit: true, sport: sportType });
        setFinishedMatchesData(data);
    }

    const fetchTournamentsData = async () => {
        let data = await getAllTournaments({ user: authData._id }); 
        setTournamentsData(data);
    }

    useEffect(() => {
        fetchLiveMatchesData();
        fetchFinishedMatchesData();
    }, [sportType]);

    useEffect(() => {
        if(tab == Tabs.Home) {
            fetchLiveMatchesData();
            fetchFinishedMatchesData();
        } else {
            fetchTournamentsData();
        }
    }, [tab])

    useFocusEffect(
        useCallback(() => {
            if (tab == Tabs.Home) {
                fetchLiveMatchesData();
                fetchFinishedMatchesData();
            } else {
                fetchTournamentsData();
            }
        }, [])
    )
 
    const SportsIcon = (props) => {
        return (
            <TouchableOpacity onPress={() => {
                setSportType(props.sport.sportType);
            }}>
                <View style={styles.sportsSlider}>
                    <View style={[
                        styles.circle, 
                        { backgroundColor: props.sport.sportType === sportType ? ProjectColors.Primary : ProjectColors.Secondary },
                        { opacity: props.sport.sportType === sportType ? 0.8 : 1 }
                    ]}>
                        <Image style={styles.sportIcon}  source={props.sport.src} />
                    </View>
                    <Text>{props.sport.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderMatchesData = (data) => {
        if(!data?.length) {
            return (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                    <Image style={styles.noData} source={require('../../../assets/nothing-here.png')} />
                    <Text>Nothing here</Text>
                </View>
            )
        }
        
        if(data?.length == 1) {
            const [ item ] = data;
            return (
                <TouchableOpacity style={{ width: width / 1.4, marginRight: 10 }} onPress={() => navigate('Score', { _id: item._id, matchNo: 1 })}>
                    <MatchCard data={item} live={true} matchNo={1} showBtn={false} />
                </TouchableOpacity>
            )
        }

        return (
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={{ width: width / 1.4, marginRight: 10 }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                        <MatchCard data={item} live={true} matchNo={index + 1} showBtn={false} />
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        )

    }

    const renderTabContent = () => {
        if(tab == Tabs.Home) {
            return (
                <>
                    <View style={styles.sportsContainer}>
                        <Text fontWeight={600} style={{ fontSize: 15 }}>Sports</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {sports.map((item, index) => <SportsIcon key={index} sport={item} />)}
                        </View>
                    </View>


                    <ScrollView style={styles.container}>

                        {/* Live Matches */}
                        <View style={styles.liveMatchContainer}>
                            <View style={styles.liveMatchesView}>
                                <Text fontWeight={600} style={{ fontSize: 15 }}>Live Matches</Text>
                                <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: MatchStatus.LIVE, sportType: sportType })} />
                            </View>
                            {renderMatchesData(liveMatchData)}
                        </View>

                        {/* Finished Matches */}
                        <View style={styles.finishedMatchContainer}>
                            <View style={styles.finishedMatchsView}>
                                <Text fontWeight={600} style={{ fontSize: 15 }}>Finished Matches</Text>
                                <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: MatchStatus.COMPLETED, sportType: sportType })} />
                            </View>
                            {renderMatchesData(finishedMatchesData)}
                        </View>
                    </ScrollView>
                     
                </>
            )
        }
        return (
            <View style={styles.tournamentContainer}>
                <View style={styles.tournamentHeader}>
                    <SearchBar placeholder="Search Tournament" setSearchString={setSearchString} width={'75%'} />
                    <TouchableOpacity onPress={() => navigate('Create-Tournament')}>
                        <View style={styles.createBtn}>
                            <AntDesign name="plus" size={20} color={ProjectColors.Secondary} />
                            <Text fontWeight={600} style={{ color: ProjectColors.Secondary }}>Create</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    tournamentsData?.length ? (
                        <View style={{ padding: 10 }}>
                            { tournamentsData?.map((doc, index) => (
                                <TouchableOpacity onPress={() => navigate('Tournament-Matches')}>
                                    <View key={index} style={{ padding: 15, backgroundColor: ProjectColors.Secondary }}>
                                        <Text style={{ color: ProjectColors.LightBlack }}>{ doc.name }</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>) : (<View style={styles.tournamentView}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image style={styles.noData} source={require('../../../assets/nothing-here.png')} />
                            <Text>Nothing here</Text>
                        </View>
                    </View>)
                }
            </View>
        )
    }

    return (
        <SafeAreaView edges={['bottom', 'top']} style={{ flex: 1, backgroundColor: ProjectColors.Grey}}>
            <View style={styles.profileHeader}>
                <View style={styles.profileText}>
                    <Text fontWeight={700} style={{fontSize: 18, color: ProjectColors.Secondary, textTransform: 'capitalize'}}>Welcome, {authData.name}</Text> 
                    <Text fontWeight={300} style={{fontSize: 10, color: ProjectColors.Secondary}}>What are you playing today?</Text>
                </View>
                <TouchableOpacity onPress={() => navigate('Profile')}>
                    <Image source={require('../../../assets/profile-dp.png')} style={styles.profileImg} />
                </TouchableOpacity>
            </View>
            { renderTabContent() }
            <View style={styles.footer}>
                <View style={styles.tab}>
                    <FontAwesome onPress={() => setTab(Tabs.Home)} name="home" size={30} color={tab == Tabs.Home ? ProjectColors.Primary : ProjectColors.Grey} />
                    <Text style={{ color: ProjectColors.LightBlack }} onPress={() => setTab(Tabs.Home)}>Home</Text>
                </View>
                <View style={styles.tab}>
                    <MaterialIcons onPress={() => setTab(Tabs.Tournament)} name="tour" size={30} color={tab == Tabs.Tournament ? ProjectColors.Primary : ProjectColors.Grey} />
                    <Text style={{ color: ProjectColors.LightBlack }}>Tournament</Text>
                </View>
            </View> 
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profileHeader: {
        backgroundColor: ProjectColors.Primary,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        padding: 15,
    }, 
    profileText: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    profileImg: {
        width: 50, 
        height: 50,
        borderRadius: 25, 
        backgroundColor: ProjectColors.Grey
    }, 
    noData: {
       width: 200,
       height: 200,
    },
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    tournamentContainer: {
        flex: 1,
    },
    sportsContainer: {
        paddingLeft: 15,
        paddingVertical: 20,
        gap: 15,
    },
    liveMatchContainer: {
        flex: 1, 
        flexDirection: 'column', 
        gap: 15, 
        paddingLeft: 15, 
        marginBottom: 30
    },
    liveMatchesView: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingRight: 10
    },
    finishedMatchContainer: {
        flex: 1, 
        flexDirection: 'column', 
        gap: 15, 
        paddingLeft: 15, 
        marginBottom: 20
    },
    finishedMatchsView: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingRight: 10
    },
    circle: {
        width: 74, 
        height: 74, 
        borderRadius: 37,
        borderWidth: 0.3, 
        borderColor: ProjectColors.Grey, 
        backgroundColor: ProjectColors.Secondary,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    sportIcon: {
        width: 60, 
        height: 60
    },
    sportsSlider: {
        marginRight: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10,
    },
    ratingCircle: {
        width: 60, 
        height: 60, 
        borderRadius: 30,
        backgroundColor: ProjectColors.Grey,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        backgroundColor: ProjectColors.Secondary, 
    },
    tab: {
        flex: 1,
        padding: 5,
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    selected: {
        backgroundColor: ProjectColors.Secondary, 
        opacity: 0.5
    },
    tournamentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: ProjectColors.Primary,
        opacity: 0.8,
        borderRadius: 10,
        padding: 12
    },
    tournamentView: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingTop: '30%', 
    }
})