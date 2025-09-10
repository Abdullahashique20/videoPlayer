// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import Animated, { useSharedValue } from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon, Image, Input } from "react-native-elements";
import Video, { VideoRef } from "react-native-video";
import Slider from '@react-native-community/slider'
import Popover from "react-native-popover-view";
import { SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import AsyncStorage from "@react-native-async-storage/async-storage";


type commentType = {
    id: number
    name: string,
    profile: string,
    time: string,
    comment: {
        value: string,
        timeStamp?: string | number
        ancherComment?: { x: number, y: number } | null
        drawPath?: any
    }
    replay: commentType[]
}

export default function NewHomeScreen() {
    const currDate = new Date()
    // const offset = useSharedValue(0);
    const newVideoRef = useRef<VideoRef>(null);
    const [isPlay, setIsPlay] = useState(false)
    const [isMute, setIsMute] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const [totalDuration, setTotalDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const [currComment, setCurrComment] = useState("")
    const [timeStamp, setTimeStamp] = useState<number>()
    const [anchorComment, setAnchorComment] = useState(false)
    const [tapPosition, setTapPosition] = useState<{ x: number, y: number } | null>(null);
    const [popoverVisible, setPopoverVisible] = useState(false)

    const drawRef = useRef<SketchCanvas>(null);
    const [strokeColor, setStrokeColor] = useState('')
    const [sketch, setSketch] = useState(false)
    const [pendingPaths, setPendingPaths] = useState<any[]>([]);

    const [commentData, setCommentData] = useState<commentType[]>([{
        id: Number(currDate?.toTimeString()),
        name: "Jhon",
        profile: "https://cdn-icons-png.freepik.com/512/145/145849.png?ga=GA1.1.1730792095.1752725888",
        time: currDate.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }),
        comment: {
            timeStamp: "00.09",
            value: "this is my comment",
        },
        replay: []
    }])

    useEffect(() => {
        if (drawRef.current && pendingPaths.length) {
            requestAnimationFrame(() => {
                drawRef.current?.clear();
                pendingPaths.forEach((path) => drawRef.current?.addPath(path));
                setPendingPaths([]);
            });
        }
    }, [pendingPaths]);


    useEffect(() => {
        const AsyncFunction = async () => {
            const Storage = await AsyncStorage.getItem('comments')
            setCommentData(Storage ? JSON.parse(Storage) : [])
        }
        AsyncFunction()
    }, [])

    const onComment = async (path?: any) => {
        setCommentData((prev) => {
            let data = [...prev]
            const currDate = new Date()
            data.push({
                id: Number(currDate?.toTimeString()),
                name: "Jhon",
                profile: "https://cdn-icons-png.freepik.com/512/145/145849.png?ga=GA1.1.1730792095.1752725888",
                time: currDate.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }),
                comment: {
                    timeStamp: timeStamp != undefined ? timeStamp : "",
                    ancherComment: tapPosition ? { x: tapPosition?.x, y: tapPosition?.y } : null,
                    // editComment?: string,
                    value: currComment,
                    drawPath: path || null
                },
                replay: []
            })
            AsyncStorage.setItem('comments', JSON.stringify(data));
            return data
        })
        setPopoverVisible(false)
        setTapPosition(null)
        setTimeStamp(undefined)
        setCurrComment("")
        setAnchorComment(false)
        setSketch(false)
        drawRef.current?.clear();
    }

    const deleteComment = async (index: number) => {
        setCommentData((prev) => {
            let data = [...prev]
            data = data.filter((_, itemIndex) => itemIndex !== index)
            AsyncStorage.setItem('comments', JSON.stringify(data));
            return data
        })
    }
    const formatTime = (num: number) => {
        let min = Math.floor(num / 60).toString().padStart(2, "0")
        let sec = Math.floor(num % 60).toString().padStart(2, "0")
        return min + ":" + sec
    }

    // const panGesture = Gesture.Pan()
    // 	.minPointers(1)
    // 	.onUpdate((e) => {
    // 		if (e.translationX > 20) {
    // 			newVideoRef.current?.seek(currentTime + 5);
    // 		} else if (e.translationX < -20) {
    // 			newVideoRef.current?.seek(currentTime - 5);
    // 		}
    // 	});
    // const longPressGesture = Gesture.LongPress().onStart(() => {
    // 	console.log("Long press started, now drag to seek");
    // });
    // const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

    return (
        <View style={{ flex: 1 }}>
            <View style={[!isFullScreen ? { height: 290, margin: 10, borderRadius: 15, overflow: "hidden" } :
                { height: "100%", width: "100%", justifyContent: "center", alignItems: "center", }
            ]}>
                {/* <GestureDetector gesture={composedGesture}> */}
                {/* <Animated.View style={{ flex: 1 }}> */}
                <View style={{ width: "100%", height: 250 }}>
                    <Video
                        style={{ width: "100%", height: "100%", }}
                        ref={newVideoRef}
                        muted={isMute}
                        paused={!isPlay}
                        repeat
                        onPlaybackRateChange={(data) => {
                            setIsPlay(data?.playbackRate ? true : false)
                        }}
                        resizeMode="cover"
                        onFullscreenPlayerDidDismiss={() => setIsFullScreen(false)}
                        onLoad={(data) => {
                            setTotalDuration(data?.duration)
                            setIsPlay(true)
                        }
                        }
                        onProgress={(data) => setCurrentTime(data?.currentTime)}
                        source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }}
                    />
                    {(sketch && !anchorComment && !isPlay) && <SketchCanvas
                        ref={drawRef}
                        strokeColor={strokeColor || ''}
                        strokeWidth={5}
                        style={{ height: '100%', width: "100%", position: 'absolute', backgroundColor: 'transparent', borderRadius: 10, zIndex: 1000 }}
                    />}
                    {/* Transparent touch layer */}
                    <Pressable
                        style={{
                            ...StyleSheet.absoluteFillObject
                        }}
                        onPress={(event) => {
                            if (anchorComment) {
                                const { locationX, locationY } = event.nativeEvent;
                                setCurrComment("")
                                setTapPosition({ x: locationX, y: locationY });
                                setTimeStamp(currentTime)
                                setPopoverVisible(true)
                            }
                        }}
                    />
                    {tapPosition && (
                        <Popover
                            isVisible={popoverVisible}
                            arrowSize={{ width: 0, height: 0 }}
                            popoverStyle={[
                                {
                                    backgroundColor: "white"
                                },
                                {
                                    borderStyle: "solid",
                                    borderLeftWidth: 8,
                                    borderRightWidth: 8,
                                    borderTopWidth: 4,
                                    borderBottomWidth: 4,
                                    borderLeftColor: "transparent",
                                    borderRightColor: "transparent",
                                    borderBottomColor: "white",
                                    borderTopColor: "white",
                                    borderRadius: 8,
                                    right: -20,
                                    marginTop: 10
                                }
                            ]}
                            onRequestClose={() => setPopoverVisible(false)}
                            backgroundStyle={[{ backgroundColor: "transparent" }]}
                            from={
                                <View
                                    style={{
                                        position: "absolute",
                                        left: tapPosition.x - 15, // center adjust
                                        top: tapPosition.y - 15,
                                    }}
                                >
                                    <Icon name={"location-outline"} type="ionicon" color={"blue"} onPress={() => setPopoverVisible(true)} />
                                </View>
                            }
                        >
                            <View style={{ width: "100%" }}>
                                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                                    <Image source={{ uri: "https://cdn-icons-png.freepik.com/512/145/145849.png?ga=GA1.1.1730792095.1752725888" }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode="contain" />
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}>
                                        {tapPosition ?
                                            <Icon name={"location-outline"} style={{ paddingTop: 10 }} type="ionicon" color={"blue"} />
                                            : <></>}
                                        <Text style={{ color: "blue", top: 7, borderRadius: 5, padding: 5, backgroundColor: "white" }}>{formatTime(Number(currentTime))}</Text>
                                        <Input
                                            placeholder="Write your comment here"
                                            inputStyle={{}}
                                            value={currComment}
                                            onChangeText={(text) => setCurrComment(text)}
                                            numberOfLines={10}
                                            inputContainerStyle={{ borderBottomWidth: 0, width: "80%", paddingBottom: 15 }}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row", alignItems: "center",
                                            backgroundColor: "white",
                                            gap: 10, borderWidth: 0.5, borderRadius: 10, padding: 7, paddingHorizontal: 10
                                        }}>
                                        <Icon name="clock" type="octicon" />
                                        <Text>{formatTime(currentTime)}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[{ padding: 10, borderRadius: 10 }, currComment?.length ? { backgroundColor: "green", } : { backgroundColor: "grey" }]}
                                        onPress={() => onComment()}
                                    >
                                        <Text style={{ color: "white", fontSize: 16, }}>Comment</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Popover>
                    )}

                </View>
                {/* </Animated.View> */}
                {/* </GestureDetector> */}
                <View style={{ backgroundColor: "#2b0009", width: "100%", position: "absolute", bottom: 0 }}>
                    <Slider
                        style={{ width: "100%" }}
                        minimumValue={0}
                        maximumValue={totalDuration}
                        value={currentTime}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#888888"
                        thumbTintColor="#FFFFFF"
                        onValueChange={(value) => {
                            newVideoRef.current?.seek(value);
                            setCurrentTime(value);
                        }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, paddingHorizontal: 20, }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                            <Icon name={isPlay ? "pause" : "play"} type="font-awesome" color={"white"} onPress={() => setIsPlay((prev) => !prev)} />
                            <Icon name={!isMute ? "volume-up" : "volume-mute"} type="material" size={26} color={"white"} onPress={() => setIsMute((prev) => !prev)} />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <Text style={{ color: "white" }}>{formatTime(currentTime)}</Text>
                            <Text style={{ color: "white" }}>/</Text>
                            <Text style={{ color: "white" }}>{formatTime(totalDuration)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                            <TouchableOpacity onPress={() => { anchorComment && setTapPosition(null); setAnchorComment((prev) => !prev) }}>
                                <Icon name={"location-outline"} type="ionicon" color={anchorComment ? "blue" : "white"} />
                            </TouchableOpacity>
                            <Icon name={"expand"} type="font-awesome" color={"white"} onPress={() => setIsFullScreen((prev) => !prev)} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, gap: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10 }}>
                    <Text style={{ color: "black" }}>Comments</Text>
                    <View style={{ borderWidth: 0.5, borderColor: "grey", borderRadius: 10, padding: 5, paddingHorizontal: 10 }}>
                        <Text>{commentData?.length}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView showsHorizontalScrollIndicator={false}>
                        {
                            commentData?.map((comment, index) => (
                                <View key={index} style={{ gap: 15, backgroundColor: "#f9ffeb", paddingHorizontal: 15, padding: 10, marginVertical: 5 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <Image source={{ uri: comment?.profile }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode="contain" />
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 17, fontWeight: 'bold' }}>{comment?.name}</Text>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                <Text style={{ color: "grey", fontSize: 30, marginTop: -20 }}>.</Text>
                                                <Text style={{ fontSize: 12 }}>{comment?.time}</Text>
                                            </View>
                                        </View>
                                        <Icon name="delete" color={"red"} type="material-community" onPress={() => { deleteComment(index) }} />
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        {comment?.comment?.timeStamp ? <TouchableOpacity
                                            onPress={() => {
                                                newVideoRef?.current?.seek(Number(comment?.comment?.timeStamp));
                                                if (comment?.comment?.ancherComment?.x) {
                                                    setTapPosition({ x: comment?.comment?.ancherComment?.x!!, y: comment?.comment?.ancherComment?.y!! })
                                                } else {
                                                    setTapPosition(null)
                                                }
                                                setCurrComment(comment.comment.value)
                                            }} >
                                            <Text style={{ color: "blue" }}>{formatTime(Number(comment?.comment?.timeStamp))}</Text>
                                        </TouchableOpacity> : <></>}
                                        {comment?.comment?.ancherComment ? <TouchableOpacity
                                            onPress={() => {
                                                newVideoRef?.current?.seek(Number(comment?.comment?.timeStamp));
                                                setTapPosition({ x: comment?.comment?.ancherComment?.x!!, y: comment?.comment?.ancherComment?.y!! })
                                                setCurrComment(comment.comment.value)
                                            }} >
                                            <Icon name={"location-outline"} type="ionicon" color={"blue"} />
                                        </TouchableOpacity> : <></>}

                                        {comment?.comment?.drawPath?.length ?
                                            <TouchableOpacity
                                                onPress={() => {
                                                    newVideoRef?.current?.seek(Number(comment?.comment?.timeStamp));
                                                    if (comment?.comment?.ancherComment?.x) {
                                                        setTapPosition({ x: comment?.comment?.ancherComment?.x!!, y: comment?.comment?.ancherComment?.y!! })
                                                    } else {
                                                        setTapPosition(null)
                                                    }
                                                    setCurrComment(comment.comment.value)
                                                    if (comment?.comment?.drawPath.length) {
                                                        setSketch(true);
                                                        setPendingPaths(comment.comment.drawPath)
                                                    }
                                                }} >
                                                <Icon name="pencil" type="octicon" color={"blue"} />
                                            </TouchableOpacity> : <></>}

                                        <Text>{comment?.comment?.value}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={{ backgroundColor: "#f2f2f2", padding: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                        <Image source={{ uri: "https://cdn-icons-png.freepik.com/512/145/145849.png?ga=GA1.1.1730792095.1752725888" }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode="contain" />
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}>
                            {timeStamp != undefined ?
                                <Text style={{ color: "blue", top: 7, borderRadius: 5, padding: 5, backgroundColor: "white" }}>{formatTime(timeStamp)}</Text>
                                : <></>}
                            <Input
                                placeholder="Write your comment here"
                                inputStyle={{}}
                                value={tapPosition ? "" : currComment}
                                onChangeText={(text) => setCurrComment(text)}
                                numberOfLines={10}
                                inputContainerStyle={{ borderBottomWidth: 0, width: "90%", paddingBottom: 25 }}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => setTimeStamp((prev) => prev != undefined ? undefined : currentTime)}
                            style={{
                                flexDirection: "row", alignItems: "center",
                                backgroundColor: timeStamp != undefined ? "white" : undefined,
                                gap: 10, borderWidth: 0.5, borderRadius: 10, padding: 7, paddingHorizontal: 10
                            }}>
                            <Icon name="clock" type="octicon" />
                            <Text>{formatTime(currentTime)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setSketch((prev) => !prev); setIsPlay(false); setStrokeColor("blue") }}
                            style={[{ borderWidth: 0.5, borderRadius: 10, padding: 7, paddingHorizontal: 10 }, sketch && { backgroundColor: "blue" }]}>
                            <Icon name="pencil" type="octicon" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // disabled={!(currComment?.length && !anchorComment)}
                            style={[{ padding: 10, borderRadius: 10 }, (currComment?.length && !anchorComment) ? { backgroundColor: "green", } : { backgroundColor: "grey" }]}
                            onPress={async () => {
                                const paths = await drawRef.current?.getPaths()
                                if ((currComment?.length && !anchorComment) || paths?.length) {
                                    onComment(paths)
                                }
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 16, }}>Comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </View >
    )
}