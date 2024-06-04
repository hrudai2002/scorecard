import { StyleSheet,View, Image, ScrollView, FlatList, Dimensions } from "react-native";
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
import { getBadmintonLiveMatches, getBadmintonFinishedMatches } from "../../services/badminton.service";
import { useAuth } from "../../contexts/auth";

export function HomePage() {
    const { width } = useDimensions();
    const [liveMatchData, setLiveMatchData] = useState(null); 
    const [finishedMatchesData, setFinishedMatchesData] = useState(null);
    const [selectedSportId, setSelectedSportId] = useState<number>(1);
    const { navigate }: NavigationProp<any> = useNavigation();
    const { authData } = useAuth();
    
    const fetchLiveMatchesData = async () => {
        let data = [];
        switch(selectedSportId) {
            case 1: 
                data = await getBadmintonLiveMatches({ user: authData._id, limit: true });
                setLiveMatchData(data);
                break;
            case 2: 
                setLiveMatchData([]);
                break;
        }
    }

    const fetchFinishedMatchesData = async () => {
        let data = [];
        switch(selectedSportId) {
            case 1: 
                data = await getBadmintonFinishedMatches({ user: authData._id, limit: true });
                setFinishedMatchesData(data);
                break;
            case 2: 
                setFinishedMatchesData([])
                break;
        }
    }
    useEffect(() => {
        fetchLiveMatchesData();
        fetchFinishedMatchesData();
    }, [selectedSportId]);

    useFocusEffect(
        useCallback(() => {
            fetchLiveMatchesData();
            fetchFinishedMatchesData();
        }, [])
    )

    const SportsIcon = (props) => {
        return (
            <TouchableOpacity onPress={() => setSelectedSportId(props.sport._id)}>
                <View style={styles.sportsSlider}>
                    <View style={[
                        styles.circle, 
                        { backgroundColor: props.sport._id === selectedSportId ? ProjectColors.Primary : ProjectColors.Secondary },
                        { opacity: props.sport._id === selectedSportId ? 0.8 : 1 }
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
                <View style={{ flexDirection: 'row' }}>
                    <FlatList 
                      horizontal 
                      data={sports} 
                      renderItem={({ item }) => <SportsIcon sport={item} />}
                      showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>


            <ScrollView style={styles.container}>

                {/* Live Matches */}
                <View style={{ flex: 1, flexDirection: 'column', gap: 15, paddingLeft: 15, marginBottom: 30 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                        <Text fontWeight={600} style={{ fontSize: 16 }}>Live Matches</Text>
                        <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: 'Live' })} />
                    </View>
                    {
                        liveMatchData?.length ? (<FlatList
                            horizontal
                            data={liveMatchData}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ width: width / 1.4 }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                    <MatchCard data={item} live={true} matchNo={index + 1} showBtn={false} />
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{ width: 10 }} />
                            )}
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
                        <AntDesign name="arrowright" size={24} color="black" onPress={() => navigate("Matches", { status: 'Finished' })} />
                    </View>
                    {
                        finishedMatchesData?.length ? (<FlatList
                            horizontal
                            data={finishedMatchesData}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ width: width / 1.4 }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                                    <MatchCard data={item} live={false} matchNo={index + 1} showBtn={false}  />
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{ width: 10 }} />
                            )}
                            showsHorizontalScrollIndicator={false}
                        />) : (<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                                <Image style={styles.noData} source={require('../../../assets/no-data.png')} />
                                <Text>No Finished Matches</Text>
                            </View>)
                    }
                  
                </View>
            </ScrollView>
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
    }
})