import { StyleSheet, View } from "react-native";
import { Header } from "../../../components/header";
import { useEffect, useState } from "react";
import { ProjectColors } from "../../../constants/colors";
import { Dropdown } from "../../../components/dropdown";
import { Text } from "../../../components/text";
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../../../components/button";
import { toast } from "../../../utils/toast";
import { BadmintonMatchType, Team } from "../../../constants/enum";
import { badmintonMatchType, badmintonGameSets, badmintonGamePoints } from "../../../constants/match-data";
import { useAuth } from "../../../contexts/auth";
import { createMatch } from "../../../services/badminton.service";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function CreateMatch() {
    const { authData } = useAuth();
    const [matchType, setMatchType] = useState(null);
    const [numberOfSets, setNumberOfSets] = useState(null);
    const [gamePoint, setGamePoint] = useState(null);
    const [selectTeam, setSelectedTeam] = useState(null);
    const navigation: NavigationProp<any> = useNavigation();

    const [team, setTeam] = useState(null);
    const [teamA, setTeamA] = useState({
        name: '', 
        playerOne: '', 
        playerTwo: ''
    })
    const [teamB, setTeamB] = useState({
        name: '',
        playerOne: '',
        playerTwo: ''
    });

    useEffect(() => {
        selectTeam == Team.TEAM_A ? setTeam(teamA) : setTeam(teamB);
    }, [selectTeam])

    const saveTeamDetails = () => {
        selectTeam == Team.TEAM_A ? setTeamA(team) : setTeamB(team);
        setSelectedTeam(null);
    }

    const startGame = async () => {
        if(!matchType) {
            toast.error("Match type cannot be empty!");
            return;
        } 
        if(!numberOfSets) {
            toast.error("Number of sets cannot be empty!");
            return;
        }
        if(!gamePoint) {
            toast.error("Game point cannot be empty!");
            return;
        }
        if (!teamA.name || !teamA.playerOne || (matchType == BadmintonMatchType.DOUBLES && !teamA.playerTwo)) {
            toast.error("Fill all the fields of Team A");
            return;
        }
        if (!teamB.name || !teamB.playerOne || (matchType == BadmintonMatchType.DOUBLES && !teamB.playerTwo)) {
            toast.error("Fill all the fields of Team B");
            return;
        }

        await createMatch({
            gameType: matchType,
            sets: numberOfSets,
            gamePoints: gamePoint,
            teamA,
            teamB,
            user: authData._id
        });

        navigation.goBack();
    }

    if(selectTeam) {
        return (
            <View style={{ flex: 1 }}>
                <Header title={'New Match'} setBack={setSelectedTeam} /> 
                <View style={styles.container}>
                  <View style={styles.groupInputField}>
                    <View style={styles.inputField}>
                        <Text>Team Name</Text>
                        <TextInput style={styles.textInput} value={team.name} onChangeText={(data) => setTeam({...team, name: data })}/>
                    </View>
                    <View style={styles.inputField}>
                        <Text>Player 1</Text>
                        <TextInput style={styles.textInput} value={team.playerOne} onChangeText={(data) => setTeam({...team, playerOne: data})} />
                    </View>
                    {
                        matchType == BadmintonMatchType.DOUBLES ? <View style={styles.inputField}>
                            <Text>Player 2</Text>
                            <TextInput style={styles.textInput} value={team.playerTwo} onChangeText={(data) => setTeam({...team, playerTwo: data})} />
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
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Header title={'New Match'}  />
            <View style={styles.container}>
                <View style={styles.groupInputField}>
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
                    <TouchableOpacity onPress={() => {
                        if(!matchType) {
                            toast.error("Match type cannot be empty!");
                            return;
                        } 
                        setSelectedTeam(Team.TEAM_A);
                    }}>
                        <View style={styles.teamInputField}>
                            <Text>Team A</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>{ 
                        if(!matchType) {
                            toast.error("Match type cannot be empty!");
                            return;
                        }
                        setSelectedTeam(Team.TEAM_B);
                    }}>
                        <View style={styles.teamInputField}>
                            <Text>Team B</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
                <Button 
                 onPress={startGame}
                 text={'Start Game'} 
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
    teamInputField: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ProjectColors.Secondary,
        padding: 15, 
        borderRadius: 10
    },
    textInput: {
        backgroundColor: ProjectColors.Secondary, 
        padding: 15,
        borderRadius: 10
    }
});