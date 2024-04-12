import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { Text } from "../../../@generics/components/text";
import { ProjectColors } from "../../../@generics/enums/colors";
import { Button } from "../../../@generics/components/button";
import { useEffect, useState } from "react";
import ImageSlider from 'react-native-image-slider';
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function SplashScreen () {
    const imageSource = [
        require('../../../assets/badminton-boy.png'), 
        require('../../../assets/table-tennis.png'),
        require('../../../assets/bat_ball.png'),
    ]
    const [position, setPosition] = useState<number>(0);
    const { navigate }: NavigationProp<any> = useNavigation();
    
    useEffect(() => {
        const toggle = setInterval(() => {
            setPosition(position === imageSource.length - 1 ? 0 : position + 1);
        }, 2000);
        return () => clearInterval(toggle);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ProjectColors.Primary }}>
            <View style={styles.container}>
                <View style={styles.imageSlider}>
                    <ImageSlider
                        style={{ backgroundColor: ProjectColors.Primary }}
                        autoPlayWithInterval={3000}
                        images={imageSource}
                        customSlide={({ index, item, style, width }) => (
                            <View key={index} style={[style]}>
                                <Image style={[styles.image, { transform: [{ rotate: index == 2 ? '340deg' : '0deg' }] }]} source={item} />
                            </View>
                        )}
                    />
                </View>
                <View style={styles.letsStart}>
                    <View style={{ gap: 5 }}>
                        <View>
                            <Text style={styles.font} fontWeight={700}>Let's Get</Text>
                            <Text style={styles.font} fontWeight={700}>Started</Text>
                        </View>
                        <Text style={styles.subHeading} fontWeight={600}>All sports scorecard, Track all your game scores!</Text>
                    </View>
                    <View>
                        <Button
                            onPress={() => navigate('Auth')}
                            text='Get Started' 
                            backgroundColor={ProjectColors.Secondary}
                            fontWeight={700}
                            fontSize={24}
                            color={ProjectColors.Primary}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: "column",
        backgroundColor: ProjectColors.Primary,
        padding: 15
    },
    imageSlider: {
        flex: 2.5, 
        justifyContent: 'center', 
        alignItems: 'center',
    }, 
    image: {
        width: '90%',
        height: '80%',
    },
    circle: {
        width: 8, 
        height: 8, 
        borderRadius: 4,
        backgroundColor: ProjectColors.Secondary
    },
    slideShow: {
        backgroundColor: ProjectColors.Primary
    },
    letsStart: {
        justifyContent: 'center',
        flex: 1.5,
        gap: 20
    },
    font: {
        fontSize: 36, 
        color: ProjectColors.Secondary
    },
    subHeading: {
        width: '80%', 
        fontSize: 20, 
        color: ProjectColors.Secondary
    }
})