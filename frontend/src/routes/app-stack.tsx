import { createStackNavigator } from "@react-navigation/stack"
import { HomePage } from "../screens/app";
import { Profile } from "../screens/app/profile";
import { ViewMatches } from "../screens/app/home";
import { CreateMatch } from "../screens/app/home/create-match";
import { ScoreScreen } from "../screens/app/home/score";
import { Tournament } from "../screens/app/tournament";
import Matches from "../screens/app/tournament/matches";

const Stack = createStackNavigator();

export function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Matches" component={ViewMatches} options={{ headerShown: false }} />
            <Stack.Screen name="Create-Match" component={CreateMatch} options={{ headerShown: false }} />
            <Stack.Screen name="Score" component={ScoreScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Tournament-Matches" component={Matches} options={{ headerShown: false }}  />
            <Stack.Screen name='Create-Tournament' component={Tournament} options={{ headerShown: false }}  />
        </Stack.Navigator>
    )
}