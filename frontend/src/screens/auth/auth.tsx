import { StyleSheet, TextInput, TouchableOpacity, View} from "react-native"
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../@generics/components/text"
import { ProjectColors } from "../../../@generics/enums/colors";
import { Button } from "../../../@generics/components/Button";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export const SignUp = (props: any) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();
    const [hidePassoword, setHidePassword] = useState<boolean>(true);
    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: ProjectColors.Primary }}>
            <View style={styles.heading}>
                <Text fontWeight={700} style={{ color: ProjectColors.Secondary, fontSize: 36 }}>ScoreCard</Text>
                <Text style={{ color: ProjectColors.Secondary, fontSize: 15 }}>Create a new account</Text>
            </View>
            <View style={styles.loginDetails}>
                <View style={styles.inputFields}>
                    <View style={styles.email}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Full Name</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChange={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="name"
                            rules={{ required: true }}
                        />
                    </View>
                    <View style={styles.email}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Email</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChange={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="email"
                            rules={{ required: true }}
                        />
                    </View>
                    <View style={styles.password}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Password</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.passwordInputField}>
                                    <TextInput
                                        secureTextEntry={hidePassoword}
                                        style={[styles.input, {flex: 0.88}]}
                                        onBlur={onBlur}
                                        onChange={value => onChange(value)}
                                        value={value}
                                    />
                                    {
                                        hidePassoword ? 
                                        <Ionicons onPress={() => setHidePassword((prev) => !prev)} style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }}  name="eye" size={24} color="black" /> :
                                        <Ionicons onPress={() => setHidePassword((prev) => !prev)} style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }} name="eye-off" size={24} color="black" />
                                    }
                                </View>
                            )}
                            name="password"
                            rules={{ required: true }}
                        />
                        <TouchableOpacity onPress={() => props.setSignIn((prev) => !prev)}>
                            <Text style={styles.alreadyHaveAccount}>already have an account?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Button
                    style={styles.btn}
                    text={"Sign Up"}
                    color={ProjectColors.Secondary}
                    fontSize={24}
                    fontWeight={700}
                    backgroundColor={ProjectColors.Primary}
                />
            </View>
        </SafeAreaView>
    )
}

export const SignIn = (props: any) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();
    const [hidePassoword, setHidePassword] = useState<boolean>(true);
    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: ProjectColors.Primary }}>
            <View style={styles.heading}>
                <Text fontWeight={700} style={{ color: ProjectColors.Secondary, fontSize: 36 }}>ScoreCard</Text>
                <Text style={{ color: ProjectColors.Secondary, fontSize: 15 }}>Login to your account</Text>
            </View>
            <View style={styles.loginDetails}>
                <View style={styles.inputFields}>
                    <View style={styles.email}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Email</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChange={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="email"
                            rules={{ required: true }}
                        />
                    </View>
                    <View style={styles.password}>
                        <Text fontWeight={700} style={{ fontSize: 16 }}>Password</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.passwordInputField}>
                                    <TextInput
                                        secureTextEntry={hidePassoword}
                                        style={[styles.input, { flex: 0.88 }]}
                                        onBlur={onBlur}
                                        onChange={value => onChange(value)}
                                        value={value}
                                    />
                                    {
                                        hidePassoword ?
                                            <Ionicons onPress={() => setHidePassword((prev) => !prev)} style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }} name="eye" size={24} color="black" /> :
                                            <Ionicons onPress={() => setHidePassword((prev) => !prev)} style={{ flex: 0.12, justifyContent: "center", alignItems: "center" }} name="eye-off" size={24} color="black" />
                                    }
                                </View>
                            )}
                            name="password"
                            rules={{ required: true }}
                        />
                        <TouchableOpacity onPress={() => props.setSignIn((prev) => !prev)}>
                            <Text style={styles.alreadyHaveAccount}>create a new account?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Button
                    style={styles.btn}
                    text={"Sign In"}
                    color={ProjectColors.Secondary}
                    fontSize={24}
                    fontWeight={700}
                    backgroundColor={ProjectColors.Primary}
                />
            </View>
        </SafeAreaView>
    )
}

export const AuthPage = () => {
    const [signIn, setSignIn] = useState<boolean>(false);
    if (signIn) return <SignIn setSignIn={setSignIn} />
    return <SignUp setSignIn={setSignIn} />
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