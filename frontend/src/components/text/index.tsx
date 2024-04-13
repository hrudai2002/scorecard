import { Text as NativeText, TextProps } from "react-native";
import {
    useFonts,
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
    OpenSans_300Light_Italic,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';

enum FontWeights {
    ExtraBold = 'ExtraBold',
    Bold = 'Bold',
    SemiBold = 'SemiBold',
    Regular = 'Regular',
    Light = 'Light',
}

const fontWeights = {
    200: FontWeights.Light,
    300: FontWeights.Light,
    400: FontWeights.Regular,
    500: FontWeights.SemiBold,
    600: FontWeights.SemiBold,
    700: FontWeights.Bold,
    800: FontWeights.ExtraBold,
}

interface Props extends TextProps {
    fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 ,
}

export function Text({ fontWeight, ...textProps }: Props) {
    let [fontsLoaded] = useFonts({
        OpenSans_300Light,
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold,
        OpenSans_700Bold,
        OpenSans_800ExtraBold,
        OpenSans_300Light_Italic,
        OpenSans_400Regular_Italic,
        OpenSans_500Medium_Italic,
        OpenSans_600SemiBold_Italic,
        OpenSans_700Bold_Italic,
        OpenSans_800ExtraBold_Italic,
    });

    if(!fontsLoaded) {
        return;
    }
    const font = `OpenSans_${fontWeight || 400}${fontWeights[fontWeight || 400]}`
    return <NativeText {...textProps} style={[{ fontFamily: font}, textProps.style ]} />
}