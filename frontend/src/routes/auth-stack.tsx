import { createStackNavigator } from "@react-navigation/stack"
import { SplashScreen } from "../screens/auth";
import { AuthPage } from "../screens/auth/auth";

const Stack = createStackNavigator();

export function AuthStack() {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="Splash Screen" component={SplashScreen} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Auth" component={AuthPage} options={{ headerShown: false }}  />
        </Stack.Navigator>
    )
}