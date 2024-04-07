import { StyleSheet, View } from "react-native"
import { ProjectColors } from "../../enums/colors"
import { Text } from "../Text"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AntDesign } from '@expo/vector-icons';

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

export const MatchCard = (props: IMatchDetailsProps) => {
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
                            <Text fontWeight={400} style={{ color: ProjectColors.LightBlack, fontSize: 12 }}>Live</Text>
                        </View> : null
                    }
                  
                </View>
                <View style={styles.middleSection}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                            <Text fontWeight={700} style={{ fontSize: 24, color: ProjectColors.Primary }}>{props.data.teamA.score}</Text>
                            <Text fontWeight={700} style={{ fontSize: 22 }}>:</Text>
                            <Text fontWeight={700} style={{fontSize: 24}}>{props.data.teamB.score}</Text>
                        </View>
                        <Text>Singles</Text>
                    </View>
                </View>
            </View>
            {
                props.showPlayButton ? <TouchableOpacity>
                    <View style={styles.playCirlcle}>
                        <AntDesign name="caretright" size={26} color={ProjectColors.Secondary} style={{ borderRadius: 20 }} />
                    </View>
                </TouchableOpacity> : null
            }
           
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

