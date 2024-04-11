import { createStackNavigator } from "@react-navigation/stack"
import { HomePage } from "../screens/app";
import { Profile } from "../screens/app/profile";
import { ViewMatches } from "../screens/app/matches";
import { CreateMatch } from "../screens/app/matches/create-match";

const Stack = createStackNavigator();

export function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Matches" component={ViewMatches} options={{ headerShown: false }} />
            <Stack.Screen name="Create-Match" component={CreateMatch} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}