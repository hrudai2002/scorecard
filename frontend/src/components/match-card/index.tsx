import { StyleSheet, View } from "react-native"
import { ProjectColors } from "../../constants/colors"
import { Text } from "../text"
import { month, Team } from "../../constants/enum"
import { Entypo } from '@expo/vector-icons'

interface IMatchDetailsProps {
    data: {
        date: Date, 
        teamA: {
            name: string, 
            score: number, 
            winner?: boolean
        }, 
        teamB: {
            name: string, 
            score: number,
            winner?: boolean
        },
        winner?: string,
        totalSets: number,
        matchType: string,
        currentSet: number,
        _id: string,
    },
    live: boolean, 
    matchNo: number
    showBtn: boolean,
    updateScore?: (data: any) => void,
}

export function MatchCard(props: IMatchDetailsProps) {
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <View style={styles.matchDetails}>
                        <Text fontWeight={600} style={{ color: ProjectColors.LightBlack, fontSize: 12 }}>Match - { props.matchNo }</Text>
                        <Text fontWeight={400} style={{ color: ProjectColors.LightBlack, opacity: 0.6, fontSize: 12 }}>{(new Date(props.data.date).getDate())} {month[new Date(props.data.date).getMonth()]} {new Date(props.data.date).getFullYear()}</Text>
                    </View>
                    {
                        props.live ? <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                            <View style={styles.circle}></View>
                            <Text fontWeight={400} style={{ color: ProjectColors.Red, fontSize: 12 }}>Live</Text>
                        </View> : <Text fontWeight={400} style={{ color: ProjectColors.LightBlack, fontSize: 12 }}>{props.data.matchType}</Text>
                    }
                  
                </View>
                <View style={styles.middleSection}>
                    <View style={{ flexDirection: 'column', gap: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text fontWeight={400} style={{ fontSize: 16, color: ProjectColors.LightBlack }}>{props.data.teamA.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                {props.live && props.showBtn ? <Entypo name="minus" size={20} color={ProjectColors.LightBlack} onPress={() => props.updateScore({ matchId: props.data._id, teamAScore: props.data.teamA.score - 1, teamBScore: props.data.teamB.score, whoScored: '' })} /> : null }
                                <Text fontWeight={700} style={{ fontSize: 20, color: props.data.teamA.score >= props.data.teamB.score ?  ProjectColors.Primary : ProjectColors.LightBlack }}>{ !props.live && props.data.teamA?.score && "🏆"} {props.data.teamA.score} </Text>
                                {props.live && props.showBtn ? <Entypo name="plus" size={20} color={ProjectColors.LightBlack} onPress={() => props.updateScore({ matchId: props.data._id, teamAScore: props.data.teamA.score + 1, teamBScore: props.data.teamB.score, whoScored: Team.TEAM_A })} /> : null }
                                
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text fontWeight={400} style={{ fontSize: 16, color: ProjectColors.LightBlack }}>{props.data.teamB.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                {props.live && props.showBtn ? <Entypo name="minus" size={20} color={ProjectColors.LightBlack} onPress={() => props.updateScore({ matchId: props.data._id, teamAScore: props.data.teamA.score, teamBScore: props.data.teamB.score - 1, whoScored: '' })} /> : null}
                                <Text fontWeight={700} style={{ fontSize: 20, color: props.data.teamA.score <= props.data.teamB.score ? ProjectColors.Primary : ProjectColors.LightBlack }}>{ !props.live && props.data.teamB?.winner && "🏆"} {props.data.teamB.score } </Text>
                                {props.live && props.showBtn ? <Entypo name="plus" size={20} color={ProjectColors.LightBlack} onPress={() => props.updateScore({ matchId: props.data._id, teamAScore: props.data.teamA.score, teamBScore: props.data.teamB.score + 1, whoScored: Team.TEAM_B })} /> : null}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                         <Text fontWeight={400} style={{ fontSize: 12 }}>{ props.live ? props.data.matchType + ` (${props.data.currentSet} / ${props.data.totalSets}) ` : `${props.data.winner} wins` }</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ProjectColors.Secondary,
        borderColor: ProjectColors.Border, 
        borderWidth: 0.5, 
        borderRadius: 10,
        padding: 15,
        gap: 15
    }, 
    matchDetails: {
        flexDirection: 'column',
    },
    circle: {
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        backgroundColor: ProjectColors.Red
    },
    topSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    middleSection: {
        marginBottom: 20
    },
    playCirlcle: {
        position: 'relative',
        zIndex: 100,
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        bottom: '50%',
        backgroundColor: ProjectColors.Primary,
        left: '44%',
        justifyContent: 'center', 
        alignItems: 'center'
    },
})

