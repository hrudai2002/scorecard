import { Image, StyleSheet, View } from "react-native";
import { ProjectColors } from "../../constants/colors";
import { Text } from "../text";

interface ILoading {
    loading: boolean, 
    text?: string
}

export function LoadingComponent(props: ILoading) {
    if(!props.loading) return null; 

    return (
        <View style={styles.loadingComponent}>
            <Image style={{ width: '25%', height: '25%' }} source={require('../../../assets/loading.gif')} />
            <Text style={{ fontSize: 16 }}>{ props.text }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingComponent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: ProjectColors.Secondary
    },
})