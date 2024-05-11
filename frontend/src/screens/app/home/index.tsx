import { Text } from "../../../components/text";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/header";
import { ProjectColors } from "../../../constants/colors";
import { SearchBar } from "../../../components/search-bar";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from "react";
import { MatchCard } from "../../../components/match-card";
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { getBadmintonFinishedMatches, getBadmintonLiveMatches } from "../../../services/badminton.service";
import { useAuth } from "../../../contexts/auth";
import { MatchStatus } from "../../../constants/enum";

export function ViewMatches() {
    const [searchString, setSearchString] = useState<string>(null);
    const [matchesData, setMatchesData] = useState(null);
    const { navigate }: NavigationProp<any> = useNavigation();
    const route: RouteProp<any>  = useRoute();
    const { authData } = useAuth();
    
    const fetchData = async (status: string) => {
        let data = [];
        if(status == MatchStatus.LIVE) {
            data = await getBadmintonLiveMatches({ user: authData._id });
        } else {
            data = await getBadmintonFinishedMatches({ user: authData._id })
        }
        setMatchesData(data);
    }
    useEffect(() => {
        fetchData(route.params.status);
    }, []);


    useFocusEffect(
        useCallback(() => {
            fetchData(route.params.status);
        }, [])
    )

    return (
        <View style={{ flex: 1 }}>
            <Header title={`${route?.params?.status} Matches`} />
                <View style={styles.container}>
                   <SearchBar placeholder="Search" setSearchString={setSearchString} width={'75%'} />
                   <TouchableOpacity onPress={() => navigate("Create-Match")}>
                      <View style={styles.createBtn}>
                        <AntDesign name="plus" size={20} color={ProjectColors.Secondary} />
                        <Text fontWeight={600} style={{ color: ProjectColors.Secondary }}>Create</Text>
                      </View>
                   </TouchableOpacity>
                </View>
            <View style={{ padding: 10 }}>
                <FlatList
                    data={matchesData}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => navigate('Score', { _id: item._id, matchNo: index + 1 })}>
                            <MatchCard data={item} live={true} matchNo={index + 1} showBtn={false} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: ProjectColors.Primary, 
        opacity: 0.8, 
        borderRadius: 10, 
        padding: 12
    }
})