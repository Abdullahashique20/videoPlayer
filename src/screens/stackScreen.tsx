import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./splashScreen";
import HomeScreen from "./homeScreen";
import NewHomeScreen from "./homeScreen";


export default function StackScreen() {

    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="HomeScreen" component={NewHomeScreen} />
        </Stack.Navigator>
    )
}