import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "../../../components/text"
import { useState } from "react"
import { Header } from "../../../components/header";
import { LoadingComponent } from "../../../components/loading";
import { Button } from "../../../components/button";
import { ProjectColors } from "../../../constants/colors";
import { Dropdown } from "../../../components/dropdown";
import { badmintonGamePoints, badmintonGameSets, badmintonMatchType, schedule, sportTypes } from "../../../constants/match-data";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { BadmintonMatchType } from "../../../constants/enum";
import { toast } from "../../../utils/toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { createTournament } from "../../../services/tournament.service";
import { useAuth } from "../../../contexts/auth";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function Tournament() {
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(null);
    const [sportType, setSportType] = useState(null);
    const [matchType, setMatchType] = useState(null);
    const [numberOfSets, setNumberOfSets] = useState(null);
    const [gamePoint, setGamePoint] = useState(null);
    const [scheduleMode, setScheduleMode] = useState<string>(null);
    const [selectedTeam, setSelectedTeam] = useState<{
        _id: number
        name: string,
        playerOne: string,
        playerTwo: string
    }>(null);
    const [teams, setTeams] = useState<{
        name: string, 
        playerOne: string, 
        playerTwo: string
    }[]>([]);
    const { authData } = useAuth();
    const navigation: NavigationProp<any> = useNavigation();

    const addTeam = () => {
        setTeams(
            [...teams, {
            name: '', 
            playerOne: '', 
            playerTwo: ''
        }])
    }

    const teamSelect = (team, index) => {
        if(!matchType) {
            toast.error('GameType cannot be empty!');
            return;
        }
        setSelectedTeam({
            ...team,
            _id: index
        }); 
    }

    const saveTeamDetails = () => {
        // Validations
        if(!selectedTeam.name) {
            toast.error('Team name cannot be empty');
            return;
        }
        if(!selectedTeam.playerOne) {
            toast.error('Player one name cannot be empty');
            return;
        }
        if(matchType == BadmintonMatchType.DOUBLES && !selectedTeam.playerTwo) {
            toast.error('Player two name cannot be empty');
            return;
        }
        if(teams.find((item) => item.name == selectedTeam.name)) {
            toast.error('duplicate team name!');
            return;
        }
        const newTeams = teams.map((item, index) => {
            if(index == selectedTeam._id) {
                return {
                    name: selectedTeam.name, 
                    playerOne: selectedTeam.playerOne, 
                    playerTwo: selectedTeam.playerTwo
                }
            } 
            return item;
        });
        setTeams([...newTeams]);
        setSelectedTeam(null);
    }

    const createNewTournament = async () => {
        // validations
        if(!sportType) {
            toast.error('Sport cannot be empty!');
            return;
        }
        if(!name) {
            toast.error('tournament name cannot be empty!');
            return;
        }
        if (!matchType) {
            toast.error("Game type cannot be empty!");
            return;
        }
        if (!numberOfSets) {
            toast.error("Number of sets cannot be empty!");
            return;
        }
        if (!gamePoint) {
            toast.error("Game points cannot be empty!");
            return;
        }
        if (!scheduleMode) {
            toast.error("Schedule cannot be empty!");
            return;
        }
        if(!teams.length || teams.length == 1) {
            toast.error('Teams cannot be empty or one');
            return;
        }

        if((teams.some((item) => {
                if(matchType == BadmintonMatchType.SINGLES) {
                    return !item.name.length || !item.playerOne.length;
                }
                return !item.name.length || !item.playerOne.length || !item.playerTwo.length;
        }))) {
            toast.error('Teams cannot contain empty fields!');
            return;
        }
        const res = await createTournament({
            name,
            teams,  
            sport: sportType, 
            gameType: matchType, 
            user: authData._id, 
            sets: numberOfSets, 
            gamePoints: gamePoint, 
            scheduleType: scheduleMode
        });

        if (res) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                navigation.goBack();
            }, 2000);
        }
    }

    if(selectedTeam) {
        return (
            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <View style={{ flex: 1 }}>
                    <Header title={'New Match'} setBack={setSelectedTeam} />
                    <View style={[styles.container, { paddingBottom: 0 }]}>
                        <View style={styles.groupInputField}>
                            <View style={styles.inputField}>
                                <Text>Team Name</Text>
                                <TextInput style={styles.textInput} value={selectedTeam.name} onChangeText={(data) => setSelectedTeam({ ...selectedTeam, name: data })} />
                            </View>
                            <View style={styles.inputField}>
                                <Text>Player 1</Text>
                                <TextInput style={styles.textInput} value={selectedTeam.playerOne} onChangeText={(data) => setSelectedTeam({ ...selectedTeam, playerOne: data })} />
                            </View>
                            {
                                matchType == BadmintonMatchType.DOUBLES ? <View style={styles.inputField}>
                                    <Text>Player 2</Text>
                                    <TextInput style={styles.textInput} value={selectedTeam.playerTwo} onChangeText={(data) => setSelectedTeam({ ...selectedTeam, playerTwo: data })} />
                                </View> : null
                            }

                        </View>
                        <Button
                            onPress={saveTeamDetails}
                            text={'Save Details'}
                            color={ProjectColors.Secondary}
                            backgroundColor={ProjectColors.Primary}
                            fontSize={24}
                            fontWeight={700}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <View style={{ flex: 1 }}>
                <Header title="New Tournament" />
                <LoadingComponent loading={loading} />
                <ScrollView style={styles.container}>
                    <View style={styles.groupInputField}>
                        <View style={styles.inputField}>
                            <Text fontWeight={400}>Sport</Text>
                            <Dropdown
                                data={sportTypes}
                                value={sportType}
                                setValue={setSportType}
                                placeholder={"Select Sport"}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text fontWeight={400}>Tournament Name</Text>
                            <TextInput
                                autoCapitalize="none"
                                style={styles.textInput}
                                onChangeText={value => setName(value)}
                                value={name}
                                placeholder="Enter the tournament name"
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text fontWeight={400}>Game Type</Text>
                            <Dropdown
                                data={badmintonMatchType}
                                value={matchType}
                                setValue={setMatchType}
                                placeholder={"Select game type"}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text fontWeight={400}>Number of Sets</Text>
                            <Dropdown
                                data={badmintonGameSets}
                                value={numberOfSets}
                                setValue={setNumberOfSets}
                                placeholder={"Select number of sets"}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text fontWeight={400}>Game Points</Text>
                            <Dropdown
                                data={badmintonGamePoints}
                                value={gamePoint}
                                setValue={setGamePoint}
                                placeholder={"Select game points"}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text fontWeight={400}>Schedule</Text>
                            <Dropdown
                                data={schedule}
                                value={scheduleMode}
                                setValue={setScheduleMode}
                                placeholder={"Select schedule"}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', gap: 10, marginBottom: 25 }}>
                            <View style={styles.teamHeader}>
                                <Text fontWeight={400}>Teams</Text>
                                <Text fontWeight={400} style={{ color: ProjectColors.Primary }} onPress={addTeam}> + Add Team </Text>
                            </View>
                            <View style={{ flexDirection: 'column', gap: 10 }}>
                                {
                                    teams?.map((item, index) => (
                                        <TouchableOpacity key={index} onPress={() => teamSelect(item, index)}>
                                            <View style={styles.teamInputField}>
                                                <Text>{item.name ? item.name : 'Team'}</Text>
                                                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={{ padding: 10, flex: 0.09, paddingBottom: 0 }}>
                    <Button
                        onPress={createNewTournament}
                        text={'Create Tournament'}
                        color={ProjectColors.Secondary}
                        backgroundColor={ProjectColors.Primary}
                        fontSize={24}
                        fontWeight={700}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    groupInputField: {
        flexDirection: 'column',
        flex: 1,
        gap: 30,
    },
    inputField: {
        flexDirection: 'column',
        gap: 10,
    },
    teamInputField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ProjectColors.Secondary,
        padding: 15,
        borderRadius: 10
    },
    teamHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 10
    },
    textInput: {
        backgroundColor: ProjectColors.Secondary,
        padding: 15,
        borderRadius: 10
    },
})