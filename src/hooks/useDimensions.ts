import { Dimensions } from "react-native";

export function useDimensions() {
    const { width, height } = Dimensions.get('window');
    return { width, height };
}