import { createStackNavigator } from "@react-navigation/stack"
import { AuthPage } from "../screens/auth";

const Stack = createStackNavigator();

export const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Sign in Screen" component={AuthPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}