import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text } from "../../../@generics/components/text";
import { ProjectColors } from "../../../@generics/enums/colors";

export const AuthPage = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={{ color: '#fff' }}>Hello World</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: "row",
        backgroundColor: ProjectColors.Primary,
    }
})