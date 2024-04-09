import { createStackNavigator } from "@react-navigation/stack"
import { HomePage } from "../screens/app";
import { Profile } from "../screens/app/profile";

const Stack = createStackNavigator();

export const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}