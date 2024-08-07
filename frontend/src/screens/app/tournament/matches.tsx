import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/text";
import { Header } from "../../../components/header";
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { getTournamentMatches, moveMatchToLive } from "../../../services/tournament.service";
import { useAuth } from "../../../contexts/auth";
import { FlatList } from "react-native-gesture-handler";
import { MatchCard } from "../../../components/match-card";
import { MatchStatus } from "../../../constants/enum";
import Dialog from "react-native-dialog"
import { Dropdown } from "../../../components/dropdown";
import { toast } from "../../../utils/toast";


export default function Matches() {
    const [matches, setMatches] = useState(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState(null);
    const [serveFirst, setServeFirst] = useState(null);
    const { authData } = useAuth();
    const { navigate }: NavigationProp<any> = useNavigation();
    const route: RouteProp<any> = useRoute(); 

    const fetchTournamentMatches = async (id) => {
        const res = await getTournamentMatches({user: authData._id}, id);
        setMatches(res);
    }

    useEffect(() => {
        fetchTournamentMatches(route?.params?.tournament);
    }, [route.params]);

    useFocusEffect(
        useCallback(() => {
            fetchTournamentMatches(route?.params?.tournament);
        }, [])
    )


    const closeDialog = () => {
        setServeFirst(null);
        setShowDialog(false);
    }

    const onSave = async () => {
        if(!serveFirst) {
            toast.error('serve first cannot empty!');
            return;
        }
        await moveMatchToLive({ matchId: dialogData._id, team: serveFirst });
        setShowDialog(false);
        navigate('Score', { _id: dialogData._id, matchNo: dialogData.matchNo })
    }

    const onMatchClick = async (item) => {
        if(item.status == MatchStatus.NOT_STARTED) {
            return;
        }
        else if(item.status == MatchStatus.READY) {
            setDialogData(item);
            setServeFirst(null);
            setShowDialog(true);
            return;
        }
        else {
            navigate('Score', { _id: item._id, matchNo: item.matchNo })
        }
    }
    
    return (
        <View style={{ flex: 1 }}>
            <Header title="Tournament" />
            <View style={styles.viewMatches}>
                <Dialog.Container visible={showDialog}>
                    <Dialog.Title>Serve First</Dialog.Title>
                    <View style={{ padding: 15 }}>
                        <Dropdown
                            width={240}
                            data={[
                                { label: dialogData?.teamA?.name, value: dialogData?.teamA?._id },
                                { label: dialogData?.teamB?.name, value: dialogData?.teamB?._id }
                            ]}
                            value={serveFirst}
                            setValue={setServeFirst}
                            placeholder={"Select Team"}
                        />
                    </View>
                    <Dialog.Button label='Cancel' onPress={closeDialog} />
                    <Dialog.Button label='Save' onPress={onSave} />
                </Dialog.Container>
                <FlatList
                    data={matches}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity key={index} style={{ marginBottom: 10 }} onPress={() => onMatchClick(item)}>
                            <MatchCard data={item} status={item.status} matchNo={item.matchNo} showBtn={false} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewMatches: {
        flex: 1,
        padding: 10,
        marginBottom: 15
    },
})