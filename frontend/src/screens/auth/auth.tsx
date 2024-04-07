import { StyleSheet, TextInput, TouchableOpacity, View} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../@generics/components/Text"
import { ProjectColors } from "../../../@generics/enums/colors";
import { Button } from "../../../@generics/components/Button";
import { useContext, useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/auth";
import Toast from "react-native-toast-message";
interface AuthDetails {
    name: string, 
    email: string, 
    password: string
}

export const AuthPage = ({ navigation }) => {
    const [signIn, setSignIn] = useState<boolean>(true);
    const [hidePassoword, setHidePassword] = useState<boolean>(true);
    const [authDetails, setAuthDetails] = useState<AuthDetails>();
    const { signIn: signInService, register: registerService } = useContext(AuthContext); 
    useEffect(() => {
        setAuthDetails({ 
            name: '', 
            email: '',
            password: '' 
        })
    }, [signIn]);
    const validateFields = (data): boolean => {
        if (!signIn && !data.name) {
            Toast.show({
                type: 'error', 
                text1: 'name canoot be empty!',
                swipeable: true
            });
            return false;
        }
        if (!data.email) {
            Toast.show({
                type: 'error',
                text1: 'email cannot be empty!',
                swipeable: true
            });
            return false;
        }
        if (!data.password) {
            Toast.show({
                type: 'error',
                text1: 'password cannot be empty!',
                swipeable: true
            });
            return false;
        }
        if (!signIn && data.name.length < 3) {
            Toast.show({
                type: 'error',
                text1: 'name cannot be less than 3 characters',
                swipeable: true
            });
            return false;
        }
        if (!/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(data.email)) {
            Toast.show({
                type: 'error',
                text1: 'not valid email',
                swipeable: true
            });
            return false;
        }
        if (data.password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Password cannot be less than 6 characters',
                swipeable: true
            });
            return false;
        }
        return true;
    }
    const onSubmit = async () => {
        if (!validateFields(authDetails)) {
            return;
        }
        if(signIn) {
            await signInService(authDetails);
        } else {
            await registerService(authDetails);
        }
    }
    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: ProjectColors.Primary }}>
            <View style={styles.heading}>
                <Text fontWeight={700} style={{ color: ProjectColors.Secondary, fontSize: 36 }}>ScoreCard</Text>
                {signIn ? <Text style={{ color: ProjectColors.Secondary, fontSize: 15 }}>Login to your account</Text> : 
                <Text style={{ color: ProjectColors.Secondary, fontSize: 15 }}>Create a new account</Text> }
            </View>
            <View style={styles.loginDetails}>
                <View style={styles.inputFields}>
                    { !signIn && <View style={styles.email}>
                            <Text fontWeight={700} style={{ fontSize: 16 }}>Full Name</Text>
                            <TextInput
                                autoCapitalize="none"
                                style={styles.input}
                                onChangeText={value => setAuthDetails((prev) => ({ ...prev, name: value }))}
                                value={authDetails?.name}
                            />
                        </View>
                    }
                    <View style={styles.email}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Email</Text>
                        <TextInput
                            autoCapitalize="none"
                            style={styles.input}
                            onChangeText={value => setAuthDetails((prev) => ({ ...prev, email: value }))}
                            value={authDetails?.email}
                        />
                    </View>
                    <View style={styles.password}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Password</Text>
                        <View style={styles.passwordInputField}>
                            <TextInput
                                autoCapitalize="none"
                                secureTextEntry={hidePassoword}
                                style={[styles.input, { flex: 0.88 }]}
                                onChangeText={value => setAuthDetails((prev) => ({ ...prev, password: value }))}
                                value={authDetails?.password}
                            />
                            { hidePassoword ? <Ionicons onPress={() => setHidePassword((prev) => !prev)} style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }} name="eye" size={24} color="black" /> :
                              <Ionicons onPress={() => setHidePassword((prev) => !prev)} style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }} name="eye-off" size={24} color="black" /> }
                        </View>
                        <TouchableOpacity onPress={() => setSignIn((prev) => !prev)}>
                            { signIn ? <Text style={styles.alreadyHaveAccount}>create a new account?</Text> : 
                             <Text style={styles.alreadyHaveAccount}>already have an account?</Text> }
                        </TouchableOpacity>
                    </View>
                </View>
                <Button
                    onPress={onSubmit}
                    style={styles.btn}
                    text={signIn ? "Sign In" : "Sign Up"}
                    color={ProjectColors.Secondary}
                    fontSize={24}
                    fontWeight={700}
                    backgroundColor={ProjectColors.Primary}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    heading: {
        flex: 1, 
        backgroundColor: ProjectColors.Primary,
        paddingLeft: 30,
        flexDirection: 'column',
        justifyContent: 'center', 
    }, 
    loginDetails: {
        flex: 4.5, 
        flexDirection: 'column',
        gap: 35,
        backgroundColor: ProjectColors.Secondary,
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40,
        paddingLeft: 30,
        paddingTop: 70 
    },
    input: {
        backgroundColor: ProjectColors.Grey, 
        height: 50, 
        width: '90%',
        padding: 10, 
        borderRadius: 10
    },
    email: {
        flexDirection: 'column', 
        gap: 10
    },
    password: {
        flexDirection: 'column',
        gap: 10
    },
    passwordInputField: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: ProjectColors.Grey,
        height: 50,
        width: '90%',
        borderRadius: 10,
    },
    btn: {
        opacity: 0.8, 
        width: '90%'
    },
    alreadyHaveAccount: {
        color: ProjectColors.Primary,
        textAlign: 'right',
        paddingRight: '10%'
    },
    inputFields: {
        gap: 20
    }
})