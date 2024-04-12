import { StyleSheet, View } from "react-native";
import { Header } from "../../../../@generics/components/header";
import { useEffect, useState } from "react";
import { ProjectColors } from "../../../../@generics/enums/colors";
import { Dropdown } from "../../../../@generics/components/dropdown";
import { Text } from "../../../../@generics/components/text";
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../../../../@generics/components/button";
import { badmintonMatchType, badmintonGameSets, badmintonGamePoints } from "../../../constants/match-data";

export function CreateMatch() {
    const [matchType, setMatchType] = useState(null);
    const [numberOfSets, setNumberOfSets] = useState(null);
    const [gamePoint, setGamePoint] = useState(null);
    const [selectTeam, setSelectedTeam] = useState(null);


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
        selectTeam == "TeamA" ? setTeam(teamA) : setTeam(teamB);
    }, [selectTeam])

    const saveTeamDetails = () => {
        selectTeam == "TeamA" ? setTeamA(team) : setTeamB(team);
        setSelectedTeam(null);
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
                        matchType == 'Doubles' ? <View style={styles.inputField}>
                            <Text>Player 2</Text>
                            <TextInput style={styles.textInput} value={team.playerTwo} onChangeText={(data) => setTeam({...team, playerTwo: data})} />
                        </View> : null
                    }
                    
                  </View>
                    <Button
                        onPress={saveTeamDetails}
                        style={{ marginTop: 'auto' }}
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
                    <TouchableOpacity onPress={() => setSelectedTeam("TeamA")}>
                        <View style={styles.teamInputField}>
                            <Text>Team A</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedTeam("TeamB")}>
                        <View style={styles.teamInputField}>
                            <Text>Team B</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
                <Button 
                 style={{ marginTop: 'auto' }}
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