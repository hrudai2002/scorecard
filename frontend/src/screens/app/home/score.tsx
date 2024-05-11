import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/header";
import { useEffect, useState } from "react";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { getMatchDetails, updateScore as updateScoreService, getMatchSummary as getMatchSummaryService } from "../../../services/badminton.service";
import { MatchCard } from "../../../components/match-card";
import { Text } from "../../../components/text";
import { ProjectColors } from "../../../constants/colors";
import { MatchStatus, Tabs } from "../../../constants/enum";
import { formateDate } from "../../../utils/helpers";
import { FlatList } from "react-native-gesture-handler";
import { LoadingComponent } from "../../../components/loading";

export function ScoreScreen() {
    const router: RouteProp<any> = useRoute();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState(Tabs.SUMMARY);
    const [summary, setSummary] = useState(null);
    const [rules, setRules] = useState(null);

    const navigation: NavigationProp<any> = useNavigation();

    const fetchData = async (matchId) => {
        const data = await getMatchDetails(matchId); 
        setMatchData(data);
    }

    const getMatchSummary = async (matchId) => {
        const data = await getMatchSummaryService(matchId);
        setSummary(data);
    }

    const updateScore = async (payload) => {
        const res = await updateScoreService(payload);   
        fetchData(router.params._id);
        getMatchSummary(payload.matchId);

        if(res.status == MatchStatus.COMPLETED) {
            console.log('came here');
            setLoading(true); 
            setText(`${ matchData.teamA._id == matchData.winner ? matchData.teamA.name : matchData.teamB.name } wins`);
            setTimeout(() => {
                setLoading(false);
                navigation.goBack();
            }, 2000);
        }

        // if(res) {
        //     setMatchData({ 
        //         ...matchData, 
        //         teamA: { ...matchData.teamA, score: payload.teamAScore },
        //         teamB: { ...matchData.teamB, score: payload.teamBScore },
        //     });
        //     if(res.status == MatchStatus.FINISHED) {
        //     }
        // }
    }

    useEffect(() => {
        fetchData(router.params._id);
        getMatchSummary(router.params._id);
    }, [router.params]);
    
    // useEffect(() => {
    //     if(selectedTab == Tabs.SUMMARY) {
    //     } else {
    //         getMatchRules();
    //     }
    // }, [selectedTab])

    return (
       <View style={{ flex: 1 }}>
           <LoadingComponent loading={loading} text={text} />
           <Header title={`Match - ${router.params.matchNo < 10 ? '0' : ''}${router.params.matchNo}`} subTitle={matchData ? `Badmintion ${matchData.matchType}` : ''} /> 
           <View style={{ padding: 10 }}>
                {
                    matchData && 
                    <MatchCard data={matchData} live={matchData?.status == MatchStatus.LIVE} matchNo={Number((router.params.matchNo < 10 ? '0' : '') + router.params?.matchNo)} showBtn={true} updateScore={updateScore} />
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
              <ScrollView style={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
                 <View style={{ flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                    {
                        summary?.map((item, index) => (
                            <View key={index} style={styles.card} >
                                <Text>{item.text}</Text>
                                <Text style={styles.cardDate}>{formateDate(item.date)} </Text>
                            </View>
                        ))
                    }
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
        flexDirection: 'column',
        borderRadius: 10
    },

    cardDate: {
        alignSelf: "flex-end", 
        color: ProjectColors.LightBlack
    }
});