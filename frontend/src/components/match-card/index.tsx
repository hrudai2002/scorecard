import { StyleSheet, View } from "react-native"
import { ProjectColors } from "../../constants/colors"
import { Text } from "../text"

interface IMatchDetailsProps {
    data: {
        date: Date, 
        teamA: {
            name: string, 
            score: number
        }, 
        teamB: {
            name: string, 
            score: number
        },
        matchType: string,
    },
    live: boolean
    showPlayButton?: boolean
}

export function MatchCard(props: IMatchDetailsProps) {
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <View style={styles.matchDetails}>
                        <Text fontWeight={600} style={{ color: ProjectColors.LightBlack, fontSize: 12 }}>Match - 01</Text>
                        <Text fontWeight={400} style={{ color: ProjectColors.LightBlack, opacity: 0.6, fontSize: 12 }}>15 March 2023</Text>
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
                            <Text fontWeight={700} style={{ fontSize: 20, color: ProjectColors.Primary }}>{ !props.live && "🏆"} {props.data.teamA.score}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text fontWeight={400} style={{ fontSize: 16, color: ProjectColors.LightBlack }}>{props.data.teamB.name}</Text>
                            <Text fontWeight={700} style={{ fontSize: 20 }}>{props.data.teamB.score}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                         <Text fontWeight={400} style={{ fontSize: 12 }}>{ props.live ? props.data.matchType : "Titans Won" }</Text>
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

