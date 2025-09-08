import React, { useRef, useState } from "react";
import { FlatList, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Video from "react-native-video";
import VideoPlayer from 'react-native-video-controls';
import { Button, Card, Icon, Input } from 'react-native-elements'
import { SketchCanvas } from '@sourcetoad/react-native-sketch-canvas';
import Fontisto from "react-native-vector-icons/Fontisto"
// import DocumentPicker from 'react-native-document-picker';
import { DocumentPickerResponse, pick, types } from "@react-native-documents/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popover from 'react-native-popover-view';


export default function HomeScreen() {
    const videoRef = useRef(null)
    const currentTimeRef = useRef(0)
    const [comment, setComment] = useState('')
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [strokeColor, setStrokeColor] = useState('')
    const drawRef = useRef(null);
    const [list, setList] = useState([
        { title: 'Public', selected: true },
        { title: 'internal', selected: false }
    ])
    const [sketch, setSketch] = useState(false)
    const [openPop, setOpenPop] = useState(-1)
    const [selected, setSelected] = useState()
    const [file, setFile] = useState(0);
    const [paused, setPaused] = useState(false)

    const [data, setData] = useState
        ([{
            time: "03.03",
            comment: 'hello Hi buding'
        }
        ])
    const [timer, setTimer] = useState(true)

    const handleProgress = ({ currentTime }: { currentTime: number }) => {
        // currentTimeRef.current = currentTime;
        // setFile()
    };

    // const uploadFile = (response: DocumentPickerResponse[]) => {
    //     const size = response[0]?.size ? response[0]?.size / 1024 / 1024 : 0
    //     const index = response[0]?.name ? response[0]?.name.lastIndexOf('.') : -1
    //     const fileName = response[0]?.name ? response[0]?.name.slice(0, index) : ''
    //     if (size <= fileSize?.fileSize) {
    //         const ext = response[0]?.name ? response[0]?.name.substring(response[0]?.name.lastIndexOf('.') + 1) : ''
    //         const extIndex = fileDetails.fileFormat.findIndex(item => item === ext);
    //         if (extIndex === -1) {
    //             Snackbar.show({
    //                 text: response[0]?.name + fileDetails.fileErrorMessage.format,
    //                 duration: Snackbar.LENGTH_LONG,
    //                 fontFamily: appFonts.medium,
    //                 numberOfLines: 4
    //             });
    //         } else {
    //             const indexSize = fileDetails.filesize.filter(item => item.minInd <= extIndex && extIndex <= item.maxInd)
    //             const data = { size: size > 0.009 ? size : 0.01, name: fileName, fileData: { size: size, type: ext }, ext: ext, img: indexSize[0].img, date: new Date() };
    //             const temp = { size: size > 0.009 ? size : 0.01, name: fileName, date: new Date(), ext: ext }
    //             setFileResponse(data);
    //             setFileDatas(temp);
    //             setShowRemoveChip(true)
    //             setButtonDisplay(true);
    //         }
    //     } else {
    //         Snackbar.show({
    //             text: fileDetails.fileErrorMessage.size,
    //             duration: Snackbar.LENGTH_LONG,
    //             fontFamily: appFonts.medium,
    //         });
    //     }
    // }


    const renderItem = ({ item, index }: { item: { time: string; comment: string }; index: number }) => {
        return (
            <Pressable>
                <Card containerStyle={{ borderRadius: 10, elevation: 10 }}>
                    <View>
                        <TouchableOpacity style={{ flexDirection: 'row' }}>
                            <Text style={{ padding: 3, color: '#ffc500cc', backgroundColor: 'rgba(255, 196, 0, 0.2)' }}>{item?.time}</Text>
                            <Text style={{ textAlign: 'center', alignSelf: 'center', marginHorizontal: 5 }}>{item?.comment}</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </Pressable>
        )
    }


    // const pickFile = async () => {
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.allFiles], // you can restrict to images/docs if needed
    //         });
    //         console.log("Picked file:", res[0]);
    //         setFile(res[0]); // store file info
    //     } catch (err) {
    //         if (DocumentPicker.isCancel(err)) {
    //             console.log("User cancelled file picker");
    //         } else {
    //             throw err;
    //         }
    //     }
    // };
    const saveComment = async (commentText: string) => {
        try {
            // Get existing comments
            const existingData = await AsyncStorage.getItem("Comments");
            let comments = existingData ? JSON.parse(existingData) : [];

            // Create new comment object
            const newComment = {
                id: Date.now(),
                comment: commentText,
                time: currentTimeRef.current,
            };

            // Push new comment to array
            comments.push(newComment);

            // Save back to AsyncStorage
            setData(comments)
            await AsyncStorage.setItem("Comments", JSON.stringify(comments));
            setComment('')

            console.log("Comment saved:", newComment);
        } catch (error) {
            console.error("Error saving comment:", error);
        }
    };


    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: StatusBar.currentHeight, backgroundColor: 'black' }}>
                <StatusBar barStyle={'light-content'} />
            </View>

            <View style={{ backgroundColor: 'black', height: '30%', width: '100%' }}>

                <VideoPlayer
                    ref={videoRef}
                    source={require('../assests/bike.mp4')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='contain'
                    paused={paused}
                    onProgress={handleProgress}
                    seekColor={"#007BFF"}
                    tapAnywhereToPause={true}
                />

                {/* Only show SketchCanvas when sketch is true */}
                {sketch && (
                    <SketchCanvas
                        ref={drawRef}
                        strokeColor={strokeColor || ''}
                        strokeWidth={5}
                        style={{ height: '100%', width: "100%", position: 'absolute', backgroundColor: 'transparent', borderRadius: 10 }}
                    />
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <View>
                    <Text>All Comments</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity>
                        <Icon style={{ paddingHorizontal: 5 }} name="filter-list" type="material" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon style={{ paddingHorizontal: 5 }} name="search" type="material" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{ marginBottom: 20, backgroundColor: ' #f0f0f072', marginHorizontal: 5, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', }}>
                    {timer ? <Text style={{ padding: 3, color: '#ffc500cc', backgroundColor: 'rgba(255, 196, 0, 0.2)', alignSelf: 'center' }}>{currentTimeRef.current.toFixed(2)}</Text> : undefined}
                    <Input
                        onChangeText={setComment}
                        placeholder="Leave your comment..."
                        inputContainerStyle={{ borderBottomWidth: 0, width: '91%', borderRadius: 10 }}
                    // style={{ backgroundColor: "red" }}
                    />
                </View>
                {!sketch ?
                    <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                setTimer(prev => !prev)
                            }}>
                                <Icon color={timer ? 'black' : '#ffc500cc'} name="timer-outline" type='ionicon' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSketch(true)}>
                                <Icon name="draw" type='material' size={25} />
                            </TouchableOpacity>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <TouchableOpacity onPress={() => setSelected(true)} style={{ flexDirection: 'row', padding: 10 }}>
                                <Fontisto style={{ paddingHorizontal: 5 }} name="world-o" size={20} />
                                <Text style={{ fontSize: 16, }}>Public</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity disabled={!paused} onPress={() => saveComment(comment)} style={{ paddingHorizontal: 15, marginHorizontal: 10, paddingVertical: 5, backgroundColor: '#007BFF', borderRadius: 4 }}>
                                <Icon name="send" type="font-awesome" color={'white'} size={20} />
                            </TouchableOpacity>
                        </View>

                    </View>
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Controls */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setSketch(false)}>
                                <Icon name="chevron-back-sharp" type='ionicon' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStrokeWidth(prev => !prev)}>
                                <Icon color={strokeWidth ? '#ffc500cc' : 'black'} name="pencil-sharp" type='ionicon' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => setStrokeColor(strokeColor === "red" ? "" : "red")}>
                                <Icon name={strokeColor === "red" ? "circle-slice-8" : "circle"} color={"red"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => setStrokeColor(strokeColor === "pink" ? "" : "pink")}>
                                <Icon name={strokeColor === "pink" ? "circle-slice-8" : "circle"} color={"pink"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => setStrokeColor(strokeColor === "yellow" ? "" : "yellow")}>
                                <Icon name={strokeColor === "yellow" ? "circle-slice-8" : "circle"} color={"yellow"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => setStrokeColor(strokeColor === "blue" ? "" : "blue")}>
                                <Icon name={strokeColor === "blue" ? "circle-slice-8" : "circle"} color={"blue"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => drawRef.current?.undo()}>
                                <Icon name={"undo-variant"} type='material-community' size={25} />
                            </TouchableOpacity>
                        </View>

                    </View>}
            </View>
        </View>
    )
}