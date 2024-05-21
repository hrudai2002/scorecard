import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/header";
import { useEffect, useState } from "react";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { getMatchDetails, updateScore as updateScoreService, getMatchSummary as getMatchSummaryService } from "../../../services/badminton.service";
import { MatchCard } from "../../../components/match-card";
import { Text } from "../../../components/text";
import { ProjectColors } from "../../../constants/colors";
import { MatchStatus, Tabs } from "../../../constants/enum";
import { formateDate } from "../../../utils/helpers";
import { LoadingComponent } from "../../../components/loading";
import { badmintonRules } from "../../../constants/match-data";
import { Dropdown } from "../../../components/dropdown";

export function ScoreScreen() {
    const router: RouteProp<any> = useRoute();
    const [matchDetails, setMatchDetails] = useState(null);
    const [summaryDetails, setSummaryDetails] = useState(null);
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState(Tabs.SUMMARY);
    const [completedSets, setCompletedSets] = useState(null);
    const [set, setValue] = useState(0);
    const [summary, setSummary] = useState(null);

    const navigation: NavigationProp<any> = useNavigation();

    const onSetChange = () => {
            const data = {...matchDetails};
            data.currentSet = data.teamA.sets.length;
            data['winner'] = data?.winner?.name;
            const enableEdit = data.teamA?.sets[set]?.winner || data.teamB?.sets[set]?.winner;
            data['enableEdit'] = !enableEdit;
            data.teamA = { name: data.teamA.name, score: data.teamA.sets[set].score, winner: data.teamA?.sets[set]?.winner },
            data.teamB = { name: data.teamB.name, score: data.teamB.sets[set].score, winner: data.teamB?.sets[set]?.winner  }
            data.matchType = data.gameType;
            setMatchData(data);
            setSummary([...summaryDetails[set]]);
    }

    const fetchData = async (matchId) => {
        const data = await getMatchDetails(matchId); 
        const summary = await getMatchSummaryService(matchId);

        // if (completedSets && data.completedSets == completedSets.length) {
        //     setLoading(true);
        //     setText(`Set - ${data.completedSets} Completed`);
        // } 
        const res = data.teamA.sets.map((_, index) => (
            { label: `Set-${index + 1}`, value: index }
        ));


        setCompletedSets(res);
        setMatchDetails(data);
        setSummaryDetails(summary);

        // console.log(loading);

        // if(loading) {
        //     setTimeout(() => {
        //         setLoading(false);
        //     }, 2000);
        // }
    }

    const getMatchSummary = async (matchId) => {
        const data = await getMatchSummaryService(matchId);
        setSummary([...data[set]]);
    }

    const updateScore = async (payload) => {
        const res = await updateScoreService(payload);   
        fetchData(router.params._id);
        getMatchSummary(payload.matchId);

        if(res.status == MatchStatus.COMPLETED) {
            setLoading(true); 
            setText(`${ matchData.teamA._id == matchData.winner ? matchData.teamA.name : matchData.teamB.name } wins`);
            setTimeout(() => {
                setLoading(false);
                navigation.goBack();
            }, 2000);
        }
    }

    useEffect(() => {
        fetchData(router.params._id);
    }, [router.params]);

    useEffect(() => {
        if(matchDetails && summaryDetails?.length) {
            onSetChange();
        }
    }, [matchDetails, summaryDetails, set])

    return (
       <View style={{ flex: 1 }}>
           <LoadingComponent loading={loading} text={text} />
           <Header title={`Match - ${router.params.matchNo < 10 ? '0' : ''}${router.params.matchNo}`} subTitle={matchData ? `Badmintion ${matchData.matchType}` : ''} share={matchDetails?.status == MatchStatus.LIVE} /> 
           <View style={{ padding: 10 }}>
                {
                    matchData && 
                    <MatchCard data={matchData} set={set + 1} live={matchData?.status == MatchStatus.LIVE} matchNo={Number((router.params.matchNo < 10 ? '0' : '') + router.params?.matchNo)} showBtn={true} updateScore={updateScore} />
                }
           </View>
           <View style={{ flex: 1, padding: 15 }}>
              <View style={styles.tabs}>
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
                {
                        completedSets?.length && <Dropdown
                            width='40%'
                            data={completedSets}
                            value={set}
                            setValue={setValue}
                            placeholder=""
                        />
                }
                
              </View>
              <ScrollView style={{ paddingVertical: 15 }} showsVerticalScrollIndicator={false}>
                { selectedTab == Tabs.SUMMARY ? 
                    <View style={{ flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                        { summary?.map((item, index) => (
                                <View key={index} style={styles.card} >
                                    <Text>{item.text}</Text>
                                    <Text style={styles.cardDate}>{formateDate(item.date)} </Text>
                                </View>
                            ))
                        } 
                    </View> : 
                    <View style={{ flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                        <View style={[styles.card, { flexDirection: 'column', gap: 5 }]}>
                            {
                                badmintonRules?.map((item, index) => (
                                    <Text key={index}>{index + 1}. {item}</Text>
                                ))
                            }
                        </View>
                        <View style={[styles.card, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                            <Image source={require('../../../../assets/rules.png')}/>
                        </View>
                    </View>
                }
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
    },

    tabs: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    }
});