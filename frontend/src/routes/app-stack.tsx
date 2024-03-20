import { createStackNavigator } from "@react-navigation/stack"
import { HomePage } from "../screens/app";

const Stack = createStackNavigator();

export const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}