import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { Text } from "../Text"

interface ButtonProps extends TouchableOpacityProps {
    text: string, 
    backgroundColor: string
    fontSize?: number,
    fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800,
    color: string,
}

export const Button = ({ text, color, fontSize, fontWeight, backgroundColor, ...touchableOpacityProps }: ButtonProps) => {
    return (
        <TouchableOpacity {...touchableOpacityProps} style={[styles.container, { backgroundColor }, touchableOpacityProps.style]}>
            <Text style={{ color, fontSize }} fontWeight={fontWeight}>{ text }</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10, 
        borderRadius: 10
    }
})