import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/header";
import { useEffect, useState } from "react";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { getMatchDetails, updateScore as updateScoreService, getMatchSummary as getMatchSummaryService, getMatchTeamDetails } from "../../../services/common.service";
import { MatchCard } from "../../../components/match-card";
import { Text } from "../../../components/text";
import { ProjectColors } from "../../../constants/colors";
import { MatchStatus, Sport, Tabs } from "../../../constants/enum";
import { formateDate } from "../../../utils/helpers";
import { LoadingComponent } from "../../../components/loading";
import { badmintonRules } from "../../../constants/match-data";
import { Dropdown } from "../../../components/dropdown";

export function ScoreScreen() {
    const router: RouteProp<any> = useRoute();
    const [matchDetails, setMatchDetails] = useState(null);
    const [teams, setTeams] = useState(null);
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
        data.currentSet = data.sets.length;
        data['winner'] = data?.winner?.name;
        const enableEdit = data.sets[set]?.winner;
        data['enableEdit'] = !enableEdit;
        data.teamA = { _id: data.teamA._id, name: data.teamA.name, score: data.sets[set]?.teamAScore, winner: data.sets[set]?.winner?.toString() == data.teamA?._id?.toString() },
        data.teamB = { _id: data.teamB._id,  name: data.teamB.name, score: data.sets[set]?.teamBScore, winner: data.sets[set]?.winner?.toString() == data.teamB?._id?.toString() },
        data.matchType = data.gameType;
        setMatchData(data);
    }

    const fetchData = async (matchId) => {
        setLoading(true);
        const data = await getMatchDetails(matchId); 
        const teamData = await getMatchTeamDetails(matchId);
        const summary = await getMatchSummaryService(matchId);
        setLoading(false);
        const res = data.sets.map((_, index) => (
            { label: `Set-${index + 1}`, value: index }
        ));
        setCompletedSets(res);
        setMatchDetails(data);
        setTeams(teamData);
        setSummaryDetails(summary);
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
            return;
        }

        if('winner' in res.sets[set]) {
            setValue(set + 1);
            setLoading(true);
            setText(`Set - ${res.completedSets} completed..`);
            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }
    }

    useEffect(() => {
        fetchData(router.params._id);
    }, [router.params]);

    useEffect(() => {
        if(matchDetails && summaryDetails?.length) {
            onSetChange();
            getMatchSummary(matchDetails._id);
        }
    }, [matchDetails, summaryDetails, set])

    const tabsData = () => {
        if(selectedTab == Tabs.SUMMARY) {
            return (<View style={{ flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                {summary?.map((item, index) => (
                    <View key={index} style={styles.card} >
                        <Text>{item.text}</Text>
                        <Text style={styles.cardDate}>{formateDate(item.date)} </Text>
                    </View>
                ))
                }
            </View>)
        } else if(selectedTab == Tabs.RULES) {
            return (
                <View style={{ flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                    <View style={[styles.card, { flexDirection: 'column', gap: 5 }]}>
                        {
                            badmintonRules?.map((item, index) => (
                                <Text key={index}>{index + 1}. {item}</Text>
                            ))
                        }
                    </View>
                    <View style={[styles.card, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                        <Image source={require('../../../../assets/rules.png')} />
                    </View>
                </View>
            )   
        }

        return (
            <View style={styles.teams}>
                <View style={styles.card}>
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.cell}>Team</Text>
                            <Text style={styles.cell}>Player - 1</Text>
                            {teams?.teamA?.playerTwo ? <Text style={styles.cell}>Player - 2</Text> : null}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}>{teams?.teamA.name}</Text>
                            <Text style={styles.cell}>{teams?.teamA.playerOne}</Text>
                            {teams?.teamA?.playerTwo ? <Text style={styles.cell}>{teams?.teamA?.playerTwo}</Text> : null}
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}>{teams?.teamB.name}</Text>
                            <Text style={styles.cell}>{teams?.teamB.playerOne}</Text>
                            {teams?.teamB?.playerTwo ? <Text style={styles.cell}>{teams?.teamB?.playerTwo}</Text> : null}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
       <View style={{ flex: 1 }}>
           <LoadingComponent loading={loading} text={text} />
           <Header title={`Match - ${router.params.matchNo < 10 ? '0' : ''}${router.params.matchNo}`} subTitle={matchData ? `${matchData.sport == Sport.BADMINTON ? 'Badminton' : 'Table Tennis'} ${matchData.matchType}` : ''} share={matchDetails?.status == MatchStatus.LIVE} /> 
           <View style={{ padding: 15, backgroundColor: ProjectColors.Primary }}>
                {
                    matchData && 
                    <MatchCard data={matchData} set={set + 1} status={matchData?.status} matchNo={Number((router.params.matchNo < 10 ? '0' : '') + router.params?.matchNo)} showBtn={true} updateScore={updateScore} />
                }
           </View>
           <View style={{ flex: 1, padding: 15 }}>
              <View style={styles.tabs}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 15, paddingRight: 15 }}>
                        <TouchableOpacity onPress={() => setSelectedTab(Tabs.SUMMARY)}>
                            <View style={[ selectedTab == Tabs.SUMMARY && { borderBottomWidth: 1.5, borderColor: ProjectColors.Primary}, { padding: 10 }]}>
                                <Text fontWeight={400} style={{ fontSize: 16, color: selectedTab == Tabs.SUMMARY ? ProjectColors.Primary : ProjectColors.LightBlack }}>Summary</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedTab(Tabs.TEAMS)}>
                                <View style={[selectedTab == Tabs.TEAMS && { borderBottomWidth: 1.5, borderColor: ProjectColors.Primary }, { padding: 10 }]}>
                                    <Text fontWeight={400} style={{ fontSize: 16, color: selectedTab == Tabs.TEAMS ? ProjectColors.Primary : ProjectColors.LightBlack }}>Teams</Text>
                                </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedTab(Tabs.RULES)}>
                            <View style={[selectedTab == Tabs.RULES && { borderBottomWidth: 1.5, borderColor: ProjectColors.Primary}, { padding: 10 }]}>
                                <Text fontWeight={400} style={{ fontSize: 16, color: selectedTab == Tabs.RULES ? ProjectColors.Primary : ProjectColors.LightBlack }}>Rules</Text>  
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {
                        completedSets?.length && <Dropdown
                            width='30%'
                            data={completedSets}
                            value={set}
                            setValue={setValue}
                            placeholder=""
                        />
                }
                
              </View>
              <ScrollView style={{ paddingVertical: 15 }} showsVerticalScrollIndicator={false}>
                { tabsData() }
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
    },

    teams: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: 10
    },

    row: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
    },

    cell: {
        display: 'flex',
        flex: 1,
        borderWidth: 1, 
        padding: 5,
        borderColor: '#c4c4c4',
        textAlign: 'center'
    }
});