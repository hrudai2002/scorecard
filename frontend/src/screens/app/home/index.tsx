import { Text } from "../../../components/text";
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/header";
import { ProjectColors } from "../../../constants/colors";
import { SearchBar } from "../../../components/search-bar";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from "react";
import { MatchCard } from "../../../components/match-card";
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { getLiveMatches, getFinishedMatches } from "../../../services/common.service";
import { useAuth } from "../../../contexts/auth";
import { MatchStatus, Sport } from "../../../constants/enum";

export function ViewMatches() {
    const [searchString, setSearchString] = useState<string>(null);
    const [orgMatchesData, setOrgMatchesData] = useState(null);
    const [matchesData, setMatchesData] = useState(null);
    const { navigate }: NavigationProp<any> = useNavigation();
    const route: RouteProp<any>  = useRoute();
    const { authData } = useAuth();
    
    const fetchData = async (status: string, sportType: Sport) => {
        let data = [];
        if(status == MatchStatus.LIVE) {
            data = await getLiveMatches({ user: authData._id, limit: false, sport: sportType });
        } else {
            data = await getFinishedMatches({ user: authData._id, limit: false, sport: sportType });
        }
        setMatchesData(data);
        setOrgMatchesData(data);
    }
    useEffect(() => {
        fetchData(route.params.status, route.params.sportType);
    }, []);

    const searchData = () => {
        if(!searchString?.length) return; 
        const result = orgMatchesData.filter( (doc) => 
                            doc.teamA.name.toLowerCase().includes(searchString.toLowerCase()) || 
                            doc.teamB.name.toLowerCase().includes(searchString.toLowerCase()))
        setMatchesData([...result]);
    }

    useEffect(() => {
        searchData();
    }, [searchString])


    useFocusEffect(
        useCallback(() => {
            fetchData(route.params.status, route.params.sportType);
        }, [])
    )

    return (
        <View style={{ flex: 1 }}>
            <Header title={`${route?.params?.status} Matches`} />
            <View style={styles.container}>
                <SearchBar placeholder="Search Team Name" setSearchString={setSearchString} width={'75%'} />
                <TouchableOpacity onPress={() => navigate("Create-Match", { sportType: route.params.sportType })}>
                    <View style={styles.createBtn}>
                    <AntDesign name="plus" size={20} color={ProjectColors.Secondary} />
                    <Text fontWeight={600} style={{ color: ProjectColors.Secondary }}>Create</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {
                matchesData?.length ? <View style={styles.viewMatches}>
                    <FlatList
                        data={matchesData}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigate('Score', { _id: item._id, matchNo: item.matchNo })}>
                                <MatchCard data={item} live={route.params.status == MatchStatus.LIVE ? true : false} matchNo={item.matchNo} showBtn={false} />
                            </TouchableOpacity>
                        )}
                    />
                </View> :  (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                    <Image style={styles.noData} source={require('../../../../assets/nothing-here.png')} />
                    <Text>{route.params.status == MatchStatus.LIVE ? 'No Live Matches': 'No Finished Matches' } </Text>
                </View>)
            }
            
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
    }, 
    viewMatches: {
        flex: 1, 
        padding: 10, 
        marginBottom: 15
    },
    noData: {
        width: 200,
        height: 200,
    },
})