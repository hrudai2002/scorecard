import { useAuth } from "../contexts/auth";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./app-stack";
import { AuthStack } from "./auth-stack";

export function Router () {
    const { authData, loading } = useAuth(); 

    if(loading) {} 

    return (
        <NavigationContainer>
            { authData ? <AppStack/> : <AuthStack /> }
        </NavigationContainer>
    )
}