import { StyleSheet,View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../../@generics/enums/colors";
import { Entypo } from '@expo/vector-icons';
import { Text } from "../../../@generics/components/text";

export const HomePage = () => {
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
        flex: 0.9,
    },
})