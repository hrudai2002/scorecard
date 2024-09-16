import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ProjectColors } from '../../constants/colors';
import { Dispatch, SetStateAction } from 'react';

interface ISearchBarProps {
    placeholder: string, 
    searchString: string,
    width?: any,
    setSearchString: Dispatch<SetStateAction<any>>
}

export function SearchBar(props: ISearchBarProps) {
    return (
        <View style={[styles.container, { width: props.width ? props.width : '100%' }]}>
            <Feather name="search" size={22} color={ProjectColors.LightBlack} />
            <TextInput
             style={styles.textInput}
             placeholder={props.placeholder}
             value={props.searchString}
             onChangeText={(data) =>  props.setSearchString(data)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        gap: 10,
        borderRadius: 10,
        backgroundColor: ProjectColors.Secondary
    },
    textInput: {
        fontSize: 16
    }
})