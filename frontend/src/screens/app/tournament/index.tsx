import { StyleSheet, View } from "react-native"
import { Text } from "../../../components/text"
import { useState } from "react"
import { Header } from "../../../components/header";
import { LoadingComponent } from "../../../components/loading";
import { Button } from "../../../components/button";
import { ProjectColors } from "../../../constants/colors";
import { Dropdown } from "../../../components/dropdown";
import { Sport } from "../../../constants/enum";

export function Tournament() {
    const [loading, setLoading] = useState<boolean>(false);
    return (
       <View style={{ flex: 1 }}>
         <Header title="New Tournament" />
         <LoadingComponent loading={loading} /> 
         <View style={styles.container}>
            <View style={styles.groupInputField}>
                <View style={styles.inputField}>
                    <Text fontWeight={400}>Sport</Text>
                    {/* <Dropdown
                        data={}
                        value={matchType}
                        setValue={setMatchType}
                        placeholder={"Select game type"}
                    /> */}
                </View>
            </View>
            <Button
                // onPress={startGame}
                text={'Create Tournament'}
                color={ProjectColors.Secondary}
                backgroundColor={ProjectColors.Primary}
                fontSize={24}
                fontWeight={700}
            />
         </View>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingVertical: 30,
    },
    groupInputField: {
        flexDirection: 'column',
        flexGrow: 1,
        gap: 30,
    },
    inputField: {
        flexDirection: 'column',
        gap: 10
    },
})