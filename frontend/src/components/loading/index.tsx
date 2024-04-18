import { Image, StyleSheet, View } from "react-native";
import { ProjectColors } from "../../constants/colors";

export function LoadingComponent(props: { loading: boolean }) {
    if(!props.loading) return null; 

    return (
        <View style={styles.loadingComponent}>
            <Image style={{ width: '25%', height: '25%' }} source={require('../../../assets/loading.gif')} />
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
        zIndex: 3,
        backgroundColor: ProjectColors.Secondary
    },
})