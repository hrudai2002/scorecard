import { createStackNavigator } from "@react-navigation/stack"
import { SplashScreen } from "../screens/auth";
import { AuthPage } from "../screens/auth/auth";

const Stack = createStackNavigator();

export const AuthStack = () => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="Splash Screen" component={SplashScreen} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Sign In" component={AuthPage} options={{ headerShown: false }}  />
        </Stack.Navigator>
    )
}