import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthData = {
    token: string,
    email: string,
    name: string
}

type AuthContextData = {
    authData?: AuthData, 
    loading: boolean, 
    signIn(): Promise<void>, 
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>(null); 

const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            // await signIn();
            await signOut();
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

    const signIn = async () => {
        const _authData = { 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikx1Y2FzIEdhcmNleiIsImlhdCI6MTUxNjIzOTAyMn0.oK5FZPULfF-nfZmiumDGiufxf10Fe2KiGe9G5Njoa64", 
            name: "hrudai", 
            email: "hrudai2002@gmail.com"
         };
        setAuthData(_authData);
        AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));
    };

    const signOut = async () => {
        setAuthData(undefined);
        await AsyncStorage.removeItem('@AuthData');
    };

    return (
        <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
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

