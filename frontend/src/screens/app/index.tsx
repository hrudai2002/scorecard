import { StyleSheet,View, Image, ScrollView, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../../@generics/enums/colors";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Text } from "../../../@generics/components/text";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MatchCard } from "../../../@generics/components/match-card";

export function HomePage({ navigation }) {
    const { width } = Dimensions.get('window');
    const sports = [
        {  
            name: 'Football', 
            src: require('../../../assets/icon=Football.png'), 
            _id: 1,
        },
        {
            name: 'Badminton', 
            src: require('../../../assets/Badminton.png'),  
            _id: 2, 
        },
        {
            name: 'Table Tennis', 
            src: require('../../../assets//Table_tennis.png'),
            _id: 3,
        },
        {
            name: 'Rugby', 
            src: require('../../../assets/Rugby.png'),
            _id: 4,
        },
        {
            name: 'BasketBall', 
            src: require('../../../assets/Basketball.png'),
            _id: 5
        }
    ];
    const liveMatchDetails = [
        {
            date: new Date(), 
            teamA: {
                name: 'Titans', 
                score: 21
            },
            teamB: {
                name: 'Patans', 
                score: 18
            },
            matchType: 'Singles', 
        },
        {
            date: new Date(), 
            teamA: {
                name: 'Titans', 
                score: 21
            },
            teamB: {
                name: 'Patans', 
                score: 18
            },
            matchType: 'Singles', 
        },
        {
            date: new Date(), 
            teamA: {
                name: 'Titans', 
                score: 21
            },
            teamB: {
                name: 'Patans', 
                score: 18
            },
            matchType: 'Singles', 
        },
    ];
    const [selectedSportId, setSelectedSportId] = useState<number>(1);

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
                    <Text fontWeight={700} style={{fontSize: 18, color: ProjectColors.Secondary}}>Welcome, Greg!</Text> 
                    <Text fontWeight={300} style={{fontSize: 10, color: ProjectColors.Secondary}}>What are you playing today?</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
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
                        <AntDesign name="arrowright" size={24} color="black" onPress={() => navigation.navigate("Matches")} />
                    </View>
                    {
                        liveMatchDetails.length ? <FlatList
                            horizontal
                            data={liveMatchDetails}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ width: width / 1.4 }}>
                                    <MatchCard data={item} live={true} showPlayButton={true} />
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{ width: 10 }} />
                            )}
                            showsHorizontalScrollIndicator={false}
                        /> : <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={styles.noData} source={require('../../../assets/no-data.png')} /></View>
                    }
                   
                </View>

                {/* Finished Matches */}
                <View style={{ flex: 1, flexDirection: 'column', gap: 15, paddingLeft: 15, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                        <Text fontWeight={600} style={{ fontSize: 16 }}>Finished Matches</Text>
                        <AntDesign name="arrowright" size={24} color="black" />
                    </View>
                    {
                        liveMatchDetails.length ? <FlatList
                            horizontal
                            data={liveMatchDetails}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ width: width / 1.4 }}>
                                    <MatchCard data={item} live={false} showPlayButton={false} />
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{ width: 10 }} />
                            )}
                            showsHorizontalScrollIndicator={false}
                        /> : <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={styles.noData} source={require('../../../assets/no-data.png')} /></View>
                    }
                  
                </View>
               
                {/* Rating  */}
                {/* <TouchableOpacity style={{ flex: 1, marginTop: 20, paddingHorizontal: 15  }}>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: ProjectColors.Secondary, padding: 15, borderRadius: 10
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1, gap: 15 }}>
                            <View style={styles.ratingCircle}>
                                <Image style={{ width: '80%', height: '80%' }} source={ require('../../../assets/star.png') } />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, color: ProjectColors.LightBlack }}>Rate Us</Text>
                                <Text style={{ fontSize: 12, color: ProjectColors.LightBlack, opacity: 0.6 }}>If you love the app, Please rate us on google playstore.</Text>
                            </View>
                        </View>
                        <AntDesign name="right" size={24} color="black" />
                    </View>
                </TouchableOpacity> */}

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
       textAlign: 'center'
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