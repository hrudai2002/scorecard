import { StyleSheet } from "react-native";
import { ProjectColors } from "../../enums/colors";
import { Dropdown as NativeDropdown } from "react-native-element-dropdown";
import { Dispatch, SetStateAction, useState } from "react";

interface IDropdownProps {
    data: {
      label: string, 
      value: string  
    }[], 
    placeholder: string,
    value: string, 
    setValue: Dispatch<SetStateAction<any>>
}

export function Dropdown(props: IDropdownProps) {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const font = `OpenSans_400Regular`;
    return (
        <NativeDropdown
            style={[styles.dropDown, isFocus && { borderColor: ProjectColors.Primary, borderWidth: 1 }]}
            data={props.data}
            labelField={'label'}
            valueField={'value'}
            placeholder={props.placeholder}
            placeholderStyle={{ fontFamily: font }}
            selectedTextStyle={{ fontFamily: font }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            value={props.value}
            onChange={item => {
                props.setValue(item.value);
                setIsFocus(false);
            }}
        />
    )
}

const styles = StyleSheet.create({
    dropDown: {
        backgroundColor: ProjectColors.Secondary,
        padding: 8,
        borderRadius: 10,
        paddingHorizontal: 15
    }
})