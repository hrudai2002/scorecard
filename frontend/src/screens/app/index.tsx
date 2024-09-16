import { StyleSheet,View, Image, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../constants/colors";
import { AntDesign } from '@expo/vector-icons';
import { Text } from "../../components/text";
import React, { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MatchCard } from "../../components/match-card";
import { sports } from "../../constants/match-data";
import { useDimensions } from "../../hooks/useDimensions";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { getLiveMatches, getFinishedMatches } from "../../services/common.service";
import { useAuth } from "../../contexts/auth";
import { MatchStatus, Sport, Tabs } from "../../constants/enum";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from "../../components/search-bar";
import { getAllTournaments } from "../../services/tournament.service";
import { StatusBar } from "react-native";
import moment from "moment";

export function RenderTab(props: {
    sportType: string, 
    setSportType: React.Dispatch<React.SetStateAction<string>>
}) {
    const { width } = useDimensions();
    const [liveMatchData, setLiveMatchData] = useState([]); 
    const [finishedMatchesData, setFinishedMatchesData] = useState([]);
    const [tournamentsData, setTournamentsData] = useState([]);
    const [searchedTournamentsData, setSearchedTournamentsData] = useState([]);
    const [searchString, setSearchString] = useState<string>(null);
    const [tab, setTab] = useState<Tabs>(Tabs.Home);
    const { navigate }: NavigationProp<any> = useNavigation();
    const { authData } = useAuth();

    // fetches data on the home screen
    useEffect(() => {
        if(tab == Tabs.Home) {
            fetchLiveMatchesData();
            fetchFinishedMatchesData();
        } else {
            fetchTournamentsData();
        }
    }, [props.sportType]);

    useEffect(() => {
        if (tab == Tabs.Home) {
            fetchLiveMatchesData();
            fetchFinishedMatchesData();
        } else {
            fetchTournamentsData();
        }
    }, [tab])

    useEffect(() => {
        searchData();
    }, [searchString])

    useFocusEffect( // called on back btn clicked
        useCallback(() => {
            props.setSportType(Sport.BADMINTON);
            setSearchString(null)
            if(!searchString) {
                if (tab == Tabs.Home) {
                    fetchLiveMatchesData(Sport.BADMINTON);
                    fetchFinishedMatchesData(Sport.BADMINTON);
                } else {
                    fetchTournamentsData(Sport.BADMINTON);
                }
            }
        }, [])
    )

    const formatString = (str: string) => str[0].toUpperCase() + str.slice(1).toLowerCase()
    
    const fetchLiveMatchesData = async (sport?: Sport) => {
      
        let data = await getLiveMatches({ user: authData._id, limit: true, sport: sport ?? props.sportType });
        setLiveMatchData(data);
    }

    const fetchFinishedMatchesData = async (sport?: Sport) => {
        let data = await getFinishedMatches({ user: authData._id, limit: true, sport: sport ?? props.sportType });
        setFinishedMatchesData(data);
    }

    const fetchTournamentsData = async (sport?: Sport) => {
        let data = await getAllTournaments({ user: authData._id, sportType: sport ?? props.sportType }); 
        setTournamentsData(data);
        setSearchedTournamentsData(data);
    }

    const searchData = () => {
        if (!searchString?.length) {
            setSearchedTournamentsData([...tournamentsData]);
            return;
        }
        const result = tournamentsData.filter((doc) =>
            doc.name.toLowerCase().includes(searchString.toLowerCase()) ||
            doc.sport.toLowerCase().includes(searchString.toLowerCase()) || 
            doc.gameType.toLowerCase().includes(searchString.toLowerCase()));
        setSearchedTournamentsData([...result]);
    }

    const renderMatchesData = (data, status) => {
        if(!data?.length) {
            return (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                    <Image style={styles.noData} source={require('../../../assets/nothing-here.png')} />
                    <Text>Nothing here</Text>
                </View>
            )
        }
        if(data?.length == 1) { // for andriod 
            const [ item ] = data;
            return (
                <TouchableOpacity style={{ width: width / 1.4, marginRight: 10 }} onPress={() => navigate('Score', { _id: item._id, matchNo: 1 })}>
                    <MatchCard data={item} status={status} matchNo={1} showBtn={false} />
                </TouchableOpacity>
            )
        }
        return (
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={{ width: width / 1.4, marginRight: 10 }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                        <MatchCard data={item} status={status} matchNo={index + 1} showBtn={false} />
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        )
    }

    const renderTabContent = () => {

        // Renders Home 
        if(tab == Tabs.Home) {
            return (
                <>
                    <ScrollView style={styles.container}>
                        {/* Live Matches */}
                        <View style={styles.liveMatchContainer}>
                            <View style={styles.liveMatchesView}>
                                <Text fontWeight={600} style={{ fontSize: 15 }}>Live Matches</Text>
                                <TouchableOpacity onPress={() => navigate("Matches", { status: MatchStatus.LIVE, sportType: props.sportType })}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                        <Text style={{ fontSize: 10, color: ProjectColors.Primary }}>see more</Text>
                                        <AntDesign name="arrowright" size={18} color={ProjectColors.Primary}  />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {renderMatchesData(liveMatchData, MatchStatus.LIVE)}
                        </View>
                        {/* Finished Matches */}
                        <View style={styles.finishedMatchContainer}>
                            <View style={styles.finishedMatchsView}>
                                <Text fontWeight={600} style={{ fontSize: 15 }}>Finished Matches</Text>
                                <TouchableOpacity onPress={() => navigate("Matches", { status: MatchStatus.COMPLETED, sportType: props.sportType })} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                        <Text style={{ fontSize: 10, color: ProjectColors.Primary }}>see more</Text>
                                        <AntDesign name="arrowright" size={18} color={ProjectColors.Primary} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {renderMatchesData(finishedMatchesData, MatchStatus.COMPLETED)}
                        </View>
                    </ScrollView>
                </>
            )
        }

        // Renders Tournament Page
        return (
            <View style={styles.tournamentContainer}>
                <View style={styles.tournamentHeader}>
                    <SearchBar placeholder="Search Tournament" searchString={searchString} setSearchString={setSearchString} width={'75%'} />
                    <TouchableOpacity onPress={() => navigate('Create-Tournament', { sportType: props.sportType })}>
                        <View style={styles.createBtn}>
                            <AntDesign name="plus" size={20} color={ProjectColors.Secondary} />
                            <Text fontWeight={600} style={{ color: ProjectColors.Secondary }}>Create</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {   searchedTournamentsData.length ? (
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ padding: 10, flexDirection: 'column', gap: 10 }}>
                                { searchedTournamentsData.map((doc, index) => (
                                    <TouchableOpacity key={index} onPress={() => navigate('Tournament-Matches', { tournament: doc._id, sportType: props.sportType})}>
                                        <View style={{ padding: 15, backgroundColor: ProjectColors.Secondary, borderRadius: 10, gap: 10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ opacity: 0.5 }}>{moment(doc.date).format('DD MMM')}</Text>
                                                <Text style={{ fontSize: 13, color: doc.status == 'COMPLETED' ? ProjectColors.Primary : ProjectColors.Red }}>{formatString(doc.status)}</Text>
                                            </View>
                                            <Text style={{ color: ProjectColors.LightBlack }}>{ doc.name }</Text>
                                            <View><Text style={{ fontSize: 12, opacity: 0.7 }}>{doc.sport + " " + formatString(doc.gameType)}</Text></View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>) : (<View style={styles.tournamentView}>
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
        <>
            { renderTabContent() }
            <View style={styles.footer}>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => setTab(Tabs.Home)}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <FontAwesome name="home" size={30} color={tab == Tabs.Home ? ProjectColors.Primary : ProjectColors.Grey} />
                            <Text style={{ color: ProjectColors.LightBlack }} onPress={() => setTab(Tabs.Home)}>Home</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.tab}>
                    <TouchableOpacity onPress={() => setTab(Tabs.Tournament)}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <MaterialIcons name="tour" size={30} color={tab == Tabs.Tournament ? ProjectColors.Primary : ProjectColors.Grey} />
                            <Text style={{ color: ProjectColors.LightBlack }}>Tournament</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View> 
        </>
    )
}

export function HomePage() {
    const [sportType, setSportType] = useState<Sport>(Sport.BADMINTON);
    const { navigate }: NavigationProp<any> = useNavigation();
    const { authData } = useAuth();

    const SportsIcon = (props: any) => {
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
                        <Image style={styles.sportIcon} source={props.sport.src} />
                    </View>
                    <Text style={{ fontSize: 12 }}>{props.sport.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <>
            <SafeAreaView edges={['bottom', 'top']} style={{ flex: 1 }}>
                <StatusBar translucent={false} backgroundColor={ProjectColors.Primary} />
                <View style={styles.profileHeader}>
                    <View style={styles.profileText}>
                        <Text fontWeight={700} style={styles.welcomeText}>Welcome, {authData.name}</Text>
                        <Text fontWeight={300} style={{ fontSize: 10, color: ProjectColors.Secondary }}>What are you playing today?</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigate('Profile')}>
                        <Image source={require('../../../assets/profile-dp.png')} style={styles.profileImg} />
                    </TouchableOpacity>
                </View>
                <View style={styles.sportsContainer}>
                    <Text fontWeight={600} style={{ fontSize: 15 }}>Sports</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {sports.map((item, index) => <SportsIcon key={index} sport={item} />)}
                    </View>
                </View>
                <RenderTab sportType={sportType} setSportType={setSportType} />
            </SafeAreaView>
        </>
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
    welcomeText: {
        fontSize: 18, 
        color: ProjectColors.Secondary, 
        textTransform: 'capitalize'
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
        alignItems: 'center',
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
        alignItems: 'center',
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