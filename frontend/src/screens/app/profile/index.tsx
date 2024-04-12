import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../../@generics/components/text";
import { Image, StyleSheet, View } from "react-native";
import { ProjectColors } from "../../../../@generics/enums/colors";
import { Button } from "../../../../@generics/components/button";
import { AuthContext, useAuth } from "../../../contexts/auth";
import { useContext } from "react";
import { Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function Profile () {
    const context = useAuth();
    const { navigate }: NavigationProp<any> = useNavigation();
    const { signOut } = useContext(AuthContext)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1}}>
                <View style={styles.profileView}>
                    <Feather style={{ alignSelf: 'flex-start', }} name="arrow-left" size={24} color={ProjectColors.LightBlack} onPress={() => navigate('Home')}/>
                    <Image source={require('../../../../assets/profile-dp.png')} style={styles.profileImg} />
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                    <View style={{ backgroundColor: ProjectColors.Secondary, padding: 15, gap: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Name: </Text>
                            <Text>{context.authData.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Email: </Text>
                            <Text>{context.authData.email}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <Button
                                onPress={() => signOut()}
                                style={styles.btn}
                                text={"Logout"}
                                color={ProjectColors.Secondary}
                                fontSize={14}
                                fontWeight={700}
                                backgroundColor={ProjectColors.Primary}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profileView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    profileImg:{
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: ProjectColors.Grey,
    },
    btn: {
        opacity: 0.8, 
        width: '40%'
    },
})