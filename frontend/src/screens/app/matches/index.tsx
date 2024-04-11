import { Text } from "../../../../@generics/components/text";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Header } from "../../../../@generics/components/header";
import { ProjectColors } from "../../../../@generics/enums/colors";
import { SearchBar } from "../../../../@generics/components/search-bar";
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { MatchCard } from "../../../../@generics/components/match-card";

export function ViewMatches({ navigation }) {
    const [searchString, setSearchString] = useState<string>("");
    const liveMatchDetails = [
        {
            date: new Date(),
            teamA: {
                name: 'Titans',
                score: 21
            },
            teamB: {
                name: 'Patans',
                score: 18
            },
            matchType: 'Singles',
        },
        {
            date: new Date(),
            teamA: {
                name: 'Titans',
                score: 21
            },
            teamB: {
                name: 'Patans',
                score: 18
            },
            matchType: 'Singles',
        },
        {
            date: new Date(),
            teamA: {
                name: 'Titans',
                score: 21
            },
            teamB: {
                name: 'Patans',
                score: 18
            },
            matchType: 'Singles',
        },
    ];
    // useEffect(() => {
    //     console.log(searchString); 
    // }, [searchString])
    return (
        <View style={{ flex: 1 }}>
            <Header title={"Live Matches"} navigation={navigation} />
                <View style={styles.container}>
                   <SearchBar placeholder="Search" setSearchString={setSearchString} width={'75%'} />
                   <TouchableOpacity onPress={() => navigation.navigate("Create-Match")}>
                      <View style={styles.createBtn}>
                        <AntDesign name="plus" size={20} color={ProjectColors.Secondary} />
                        <Text fontWeight={600} style={{ color: ProjectColors.Secondary }}>Create</Text>
                      </View>
                   </TouchableOpacity>
                </View>
            <View style={{ padding: 10 }}>
                <FlatList
                    data={liveMatchDetails}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ marginBottom: 15 }}>
                            <MatchCard data={item} live={true} showPlayButton={true} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: ProjectColors.Primary, 
        opacity: 0.8, 
        borderRadius: 10, 
        padding: 12
    }
})