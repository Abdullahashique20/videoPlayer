import React from "react";
import { StatusBar, Text, View } from "react-native";
import Video from "react-native-video";

export default function HomeScreen(){

    return(
        <View style={{flex:1}}>
            <View style={{height:StatusBar.currentHeight,backgroundColor:'black'}}>
            <StatusBar barStyle={'light-content'}/>
            </View>
            <View>
                <Video
                source={require('../')}
                />
            </View>
            <Text>Home Screen </Text>
        </View>
    )
}