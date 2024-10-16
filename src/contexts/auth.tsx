import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environments } from "../../environments/environments";
import axios from "axios";
import { toast } from "../utils/toast";
import { loginUser, registerUser } from "../services/auth.service";

type AuthData = {
    token: string,
    email: string,
    name: string,
    _id: string,
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
        const res = await registerUser({
            name: authData.name,
            email: authData.email,
            password: authData.password
        });
        if(res) {
            setAuthData(res);
            AsyncStorage.setItem('@AuthData', JSON.stringify(res));
            toast.success('Welcome to ScoreCard!')
        }
    }

    const signIn = async (authData) => {
        const res = await loginUser({
            email: authData.email,
            password: authData.password
        });
        if(res) {
            setAuthData(res);
            AsyncStorage.setItem('@AuthData', JSON.stringify(res));
            toast.success('Logged In Successfully');
        }
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

