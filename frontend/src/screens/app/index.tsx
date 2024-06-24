import { StyleSheet,View, Image, ScrollView, FlatList, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../constants/colors";
import { AntDesign } from '@expo/vector-icons';
import { Text } from "../../components/text";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MatchCard } from "../../components/match-card";
import { sports } from "../../constants/match-data";
import { useDimensions } from "../../hooks/useDimensions";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { getLiveMatches, getFinishedMatches } from "../../services/common.service";
import { useAuth } from "../../contexts/auth";
import { Sport, Tabs } from "../../constants/enum";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export function HomePage() {
    const { width } = useDimensions();
    const [liveMatchData, setLiveMatchData] = useState(null); 
    const [finishedMatchesData, setFinishedMatchesData] = useState(null);
    const [sportType, setSportType] = useState<Sport>(Sport.BADMINTON);
    const [tab, setTab] = useState<Tabs>(Tabs.Home);
    const { navigate }: NavigationProp<any> = useNavigation();
    const { authData } = useAuth();
    
    const fetchLiveMatchesData = async () => {
        let data = await getLiveMatches({ user: authData._id, limit: true, sport: sportType });
        setLiveMatchData(data);
    }

    const fetchFinishedMatchesData = async () => {
        let data = await getFinishedMatches({ user: authData._id, limit: true, sport: sportType });
        setFinishedMatchesData(data);

    }
    useEffect(() => {
        fetchLiveMatchesData();
        fetchFinishedMatchesData();
    }, [sportType]);

    useFocusEffect(
        useCallback(() => {
            fetchLiveMatchesData();
            fetchFinishedMatchesData();
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

            <View style={styles.sportsContainer}>
                <Text fontWeight={600} style={{ fontSize: 16 }}>Sports</Text>
                <View>
                    <FlatList 
                        data={sports} 
                        renderItem={({ item }) => <SportsIcon sport={item} />}
                        horizontal
                        showsHorizontalScrollIndicator={true}
                    />
                </View>
            </View>


            <ScrollView style={styles.container}>

                {/* Live Matches */}
                <View style={{ flex: 1, flexDirection: 'column', gap: 15, paddingLeft: 15, marginBottom: 30 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                        <Text fontWeight={600} style={{ fontSize: 16 }}>Live Matches</Text>
                        <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: 'Live', sportType: sportType })} />
                    </View>
                    {
                        liveMatchData?.length ? (<FlatList
                            data={liveMatchData}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ width: width / 1.4, marginRight: 10 }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                    <MatchCard data={item} live={true} matchNo={index + 1} showBtn={false} />
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />) : (<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                              <Image style={styles.noData} source={require('../../../assets/no-data.png')} />
                              <Text>No Live Matches</Text>
                            </View>)
                    }
                   
                </View>

                {/* Finished Matches */}
                <View style={{ flex: 1, flexDirection: 'column', gap: 15, paddingLeft: 15, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                        <Text fontWeight={600} style={{ fontSize: 16 }}>Finished Matches</Text>
                        <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: 'Finished', sportType: sportType })} />
                    </View>
                    {
                        finishedMatchesData?.length ? (
                            <FlatList
                                horizontal
                                data={finishedMatchesData}
                                keyExtractor={item => item._id}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={{ width: width / 1.4, marginRight: 10, }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                        <MatchCard data={item} live={false} matchNo={index + 1} showBtn={false}  />
                                    </TouchableOpacity>
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                                <Image style={styles.noData} source={require('../../../assets/no-data.png')} />
                                <Text>No Finished Matches</Text>
                            </View>)
                    }
                    {/* <ScrollView
                     horizontal 
                     showsHorizontalScrollIndicator={false}
                    >
                        {
                           finishedMatchesData?.map((item, index) => (
                               <TouchableOpacity key={index} style={{ width: width / 1.4, marginRight: 10, }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                   <MatchCard data={item} live={false} matchNo={index + 1} showBtn={false} />
                               </TouchableOpacity>
                           ))
                        }
                    </ScrollView> */} 
                </View>
                <View style={{ flex: 1, flexDirection: 'column', gap: 15, paddingLeft: 15, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                        <Text fontWeight={600} style={{ fontSize: 16 }}>Finished Matches</Text>
                        <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: 'Finished', sportType: sportType })} />
                    </View>
                    {
                        finishedMatchesData?.length ? (
                            <FlatList
                                horizontal
                                data={finishedMatchesData}
                                keyExtractor={item => item._id}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={{ width: width / 1.4, marginRight: 10, }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                        <MatchCard data={item} live={false} matchNo={index + 1} showBtn={false}  />
                                    </TouchableOpacity>
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : (<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                                <Image style={styles.noData} source={require('../../../assets/no-data.png')} />
                                <Text>No Finished Matches</Text>
                            </View>)
                    }
                    {/* <ScrollView
                     horizontal 
                     showsHorizontalScrollIndicator={false}
                    >
                        {
                           finishedMatchesData?.map((item, index) => (
                               <TouchableOpacity key={index} style={{ width: width / 1.4, marginRight: 10, }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                   <MatchCard data={item} live={false} matchNo={index + 1} showBtn={false} />
                               </TouchableOpacity>
                           ))
                        }
                    </ScrollView> */} 
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.tab}>
                    <FontAwesome onPress={() => setTab(Tabs.Home)} name="home" size={30} color={ tab == Tabs.Home ? ProjectColors.Primary : ProjectColors.Grey} />
                    <Text style={{ color:  ProjectColors.LightBlack }} onPress={() => setTab(Tabs.Home)}>Home</Text>
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
        flex: 0.1, 
        backgroundColor: ProjectColors.Primary,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        padding: 15
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
        flex: 0.8,
        marginTop: 20,
        paddingVertical: 10
    },
    sportsContainer: {
        flex: 0.2, 
        paddingLeft: 15,
        paddingVertical: 20,
        gap: 15
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
        gap: 10
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
    }
})