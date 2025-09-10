import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, View } from "react-native";

export default function SplashScreen() {

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    const loopAnimation = Animated.loop(
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ])
    );

    useEffect(() => {
        loopAnimation.start();

        // Stop after 5 seconds
        const timer = setTimeout(() => {
            loopAnimation.stop();
            navigation.navigate('HomeScreen')
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <ImageBackground source={require('../assets/splashScreen.jpeg')} style={{ width: '100%', height: '100%' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.Text style={{ opacity: fadeAnim, fontSize: 24, fontWeight: "bold", color: 'white' }}>Loading...</Animated.Text>
                </View>

            </ImageBackground>
        </View>
    )
}