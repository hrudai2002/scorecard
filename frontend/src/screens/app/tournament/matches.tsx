import { View } from "react-native";
import { Text } from "../../../components/text";
import { Header } from "../../../components/header";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";

export default function Matches() {
    const route: RouteProp<any> = useRoute(); 

    useEffect(() => {

    }, [route.params]);
    
    return (
        <View style={{ flex: 1 }}>
            <Header title="Tournament" />
             
        </View>
    )
}