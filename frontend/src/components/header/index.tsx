import { BackHandler, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProjectColors } from "../../constants/colors";
import { AntDesign, Feather } from '@expo/vector-icons';
import { Text } from "../text";
import { useNavigation } from "@react-navigation/native";

interface IHeaderProps {
    title: string,
    share?: boolean,
    subTitle?: string,
    setBack?: any
}

export function Header(props: IHeaderProps) {    
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: ProjectColors.Primary }}>
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
                        {
                            props.subTitle ? <Text fontWeight={400} style={{ color: ProjectColors.Secondary }}>{props.subTitle}</Text> : null
                        }
                    </View>
                    {props?.share ? <Feather name="share-2" size={24} color={ProjectColors.Secondary} /> : null }
                    
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
        justifyContent: 'space-evenly',
        backgroundColor: ProjectColors.Primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    headerContext: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 20
    }
})