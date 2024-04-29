import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/header";
import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getMatchDetails } from "../../../services/badminton.service";
import { MatchCard } from "../../../components/match-card";
import { Text } from "../../../components/text";
import { ProjectColors } from "../../../constants/colors";
import { Tabs } from "../../../constants/enum";

export function ScoreScreen() {
    const router: RouteProp<any> = useRoute();
    const [matchData, setMatchData] = useState(null);
    const [selectedTab, setSelectedTab] = useState(Tabs.SUMMARY);

    const fetchData = async (matchId) => {
        const data = await getMatchDetails(matchId); 
        setMatchData(data);
    }

    useEffect(() => {
        fetchData(router.params._id);
    }, [router.params])

    return (
       <View style={{ flex: 1 }}>
           <Header title={`Match - ${router.params.matchNo < 10 ? '0' : ''}${router.params.matchNo}`} subTitle={matchData ? `Badmintion ${matchData.matchType}` : ''} /> 
           <View style={{ padding: 10 }}>
                {
                    matchData && 
                    <MatchCard data={matchData} live={true} matchNo={Number((router.params.matchNo < 10 ? '0' : '') + router.params?.matchNo)} />
                }
           </View>
           <View style={{ flex: 1, padding: 15 }}>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                 <TouchableOpacity onPress={() => setSelectedTab(Tabs.SUMMARY)}>
                    <View style={[ selectedTab == Tabs.SUMMARY && { borderBottomWidth: 1.5, borderColor: ProjectColors.Primary}, { padding: 10 }]}>
                        <Text fontWeight={400} style={{ fontSize: 16, color: selectedTab == Tabs.SUMMARY ? ProjectColors.Primary : ProjectColors.LightBlack }}>Summary</Text>
                    </View>
                 </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab(Tabs.RULES)}>
                    <View style={[selectedTab == Tabs.RULES && { borderBottomWidth: 1.5, borderColor: ProjectColors.Primary}, { padding: 10 }]}>
                        <Text fontWeight={400} style={{ fontSize: 16, color: selectedTab == Tabs.RULES ? ProjectColors.Primary : ProjectColors.LightBlack }}>Rules</Text>  
                    </View>
                </TouchableOpacity>
              </View>
              <ScrollView style={{ paddingVertical: 15,  }}>
                 <View style={{ flexDirection: 'column', gap: 10 }}>
                    <View style={styles.card}>
                        <Text>Set 2 , Team A is leading the score,Serve holds by TEAM - AServe from left side of the court</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>Set 2 , Team A is leading the score,Serve holds by TEAM - AServe from left side of the court</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>Set 2 , Team A is leading the score,Serve holds by TEAM - AServe from left side of the court</Text>
                    </View>
                </View>
              </ScrollView>
           </View>
       </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 15, 
        backgroundColor: ProjectColors.Secondary,
        borderRadius: 10
    }
});