import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environments } from "../../environments/environments";
import axios from "axios";
import Toast from "react-native-toast-message";

type AuthData = {
    token: string,
    email: string,
    name: string
}

type AuthContextData = {
    authData?: AuthData, 
    loading: boolean, 
    signIn(data): Promise<void>, 
    register(data): Promise<void>,
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>(null); 

function AuthProvider({ children }) {
    const [authData, setAuthData] = useState<AuthData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            // await signIn();
            // await signOut();
            await loadStorageData();
        })()
    }, []);

    async function loadStorageData(): Promise<void> {
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized) {
                const _authData: AuthData = JSON.parse(authDataSerialized);
                setAuthData(_authData);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    const register = async (authData) => {
        axios.post(environments.apiUrl + '/user/register', {
            name: authData.name, 
            email: authData.email, 
            password: authData.password
        }).then((res: any) => {
            if(res.data.success) {
                setAuthData(res.data.data); 
                AsyncStorage.setItem('@AuthData', JSON.stringify(res.data.data));
                Toast.show({ type: 'success', text1: 'Welcome to ScoreCard!', swipeable: true })
            } else {
                Toast.show({ type: 'error', text1: res.data.error });
                console.log(res.data);
            }
        }).catch(err => console.log(err));
    }

    const signIn = async (authData) => {
        axios.put(environments.apiUrl + '/user/login', {
            email: authData.email, 
            password: authData.password
        }).then((res: any) => {
            if(res.data.success) {
                setAuthData(res.data.data);
                AsyncStorage.setItem('@AuthData', JSON.stringify(res.data.data));
                Toast.show({ type: 'success', text1: 'Logged In Successfully', swipeable: true })
            }
        }).catch(err => console.log(err));
    };

    const signOut = async () => {
        setAuthData(undefined);
        await AsyncStorage.removeItem('@AuthData');
    };

    return (
        <AuthContext.Provider value={{ authData, loading, register, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext); 
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthContext, AuthProvider, useAuth }

