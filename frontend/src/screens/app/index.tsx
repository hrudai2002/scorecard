import { StyleSheet,View, Image, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../../@generics/enums/colors";
import { Entypo } from '@expo/vector-icons';
import { Text } from "../../../@generics/components/text";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";



export const HomePage = () => {
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
    const [selectedSportId, setSelectedSportId] = useState<number>(1);

    const SportsIcon = (props) => {
        return (
            <TouchableOpacity onPress={() => setSelectedSportId(props.sport._id)}>
                <View style={{ marginRight: 15, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.circle, { backgroundColor: props.sport._id === selectedSportId ? ProjectColors.Primary : ProjectColors.Secondary }]}>
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
                <View style={styles.profile}>
                    <Image source={require('../../../assets/profile-dp.png')} style={styles.profileImg} />
                    <View style={styles.profileText}>
                       <Text fontWeight={700} style={{fontSize: 18, color: ProjectColors.Secondary}}>Welcome, Greg!</Text> 
                       <Text fontWeight={300} style={{fontSize: 10, color: ProjectColors.Secondary}}>What are you playing today?</Text>
                    </View>
                </View>
                <Entypo name="dots-three-vertical" size={18} color={ProjectColors.Secondary} />
            </View>
            <View style={styles.sportsSlider}>
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
            <View style={styles.container}></View>
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
        paddingHorizontal: 10,
    }, 
    profile: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10
    },
    profileImg: {
        width: 50, 
        height: 50,
        borderRadius: 25, 
        backgroundColor: ProjectColors.Grey
    },  
    profileText: {
        flexDirection: 'column', 
        alignItems: 'flex-start'
    } , 
    container: {
        flex: 0.8,
    },
    sportsSlider: {
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
})