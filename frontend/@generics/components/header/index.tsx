import { BackHandler, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../enums/colors";
import { AntDesign } from '@expo/vector-icons';
import { Text } from "../text";
import { useEffect } from "react";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";

interface IHeaderProps {
    title: string,
    subTitle?: string,
    setBack?: any
}

export function Header(props: IHeaderProps) {

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", () => {
    //         props.setBack(null);
    //         console.log('came here');
    //         return true;
    //     });
    //     return () => {
    //         BackHandler.removeEventListener("hardwareBackPress", () => {
    //             props.setBack(null)
    //             return true;
    //         });
    //     };
    // }, []);

    useBackHandler(() => {
        props.setBack(null);
        console.log('came here..');
        return true;
    });
    
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']}>
                <View style={styles.headerContainer}>
                  <AntDesign name="arrowleft" size={24} color={ProjectColors.Secondary} onPress={() => {
                        if(props.setBack) {
                            props.setBack(null);
                        } else {
                            navigation.goBack();
                        }
                    }} />
                    <View style={styles.headerContext}>
                    <Text fontWeight={600} style={{ fontSize: 20, color: ProjectColors.Secondary }}>{props.title}</Text>
                  </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
    },
    headerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: ProjectColors.Primary,
        padding: 15, 
    },
    headerContext: {
        position: 'absolute', 
        left: '50%', top: '50%', 
        marginLeft: -50, 
        marginRight: -50
    }
})