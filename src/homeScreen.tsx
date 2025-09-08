import React, { useRef, useState } from "react";
import { FlatList, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Video from "react-native-video";
import VideoPlayer from 'react-native-video-controls';
import { Button, Card, Icon, Input } from 'react-native-elements'
import { SketchCanvas } from '@sourcetoad/react-native-sketch-canvas';
import DocumentPicker from 'react-native-document-picker';

export default function HomeScreen() {
    const videoRef = useRef(null)
    const currentTimeRef = useRef(0)
    const [comment, setComment] = useState('')
    const [strokeWidth, setStrokeWidth] = useState(false);
    const [strokeColor, setStrokeColor] = useState('')
    const drawRef = useRef(null);
    const [sketch, setSketch] = useState(false)
    const [file, setFile] = useState(null);
    const [data, setData] = useState
        ([{
            time: "03.03",
            comment: 'hello Hi buding'
        }
        ])
    const [timer, setTimer] = useState(true)

    const handleProgress = ({ currentTime }: { currentTime: number }) => {
        currentTimeRef.current = currentTime;
        // setTimer(currentTime)
    };

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


    const pickFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles], // you can restrict to images/docs if needed
            });
            console.log("Picked file:", res[0]);
            setFile(res[0]); // store file info
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled file picker");
            } else {
                throw err;
            }
        }
    };


    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: StatusBar.currentHeight, backgroundColor: 'black' }}>
                <StatusBar barStyle={'light-content'} />
            </View>
            <SketchCanvas
                ref={drawRef}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth ? 5 : 0}
            />
            <View style={{ backgroundColor: 'black', height: '30%', width: '100%' }}>
                <VideoPlayer
                    ref={videoRef}
                    source={require('./assests/bike.mp4')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='contain'

                    onProgress={handleProgress}
                    seekColor={"#007BFF"}
                    tapAnywhereToPause={true}
                />
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
                        onChange={() => setComment}
                        placeholder="Leave your comment..."
                        inputContainerStyle={{ borderBottomWidth: 0, width: '91%', borderRadius: 10 }}
                    // style={{ backgroundColor: "red" }}
                    />
                </View>
                {!sketch ?
                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                setTimer(prev => !prev)

                            }}>
                                <Icon color={timer ? 'black' : '#ffc500cc'} name="timer-outline" type='ionicon' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSketch(true)}>
                                <Icon name="draw" type='material' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={pickFile}>
                                <Icon name="attachment" type='entypo' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }}>
                                <Icon name="smiley" type='octicon' size={25} />
                            </TouchableOpacity>
                        </View>
                        <View>

                        </View>
                    </View>
                    :
                    <View style={{}}>



                        {/* Controls */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setSketch(false)}>
                                <Icon name="chevron-back-sharp" type='ionicon' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStrokeWidth(prev => !prev)}>
                                <Icon color={strokeWidth ? '#ffc500cc' : 'black'} name="pencil-sharp" type='ionicon' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                setStrokeColor((prev) => (prev === "red" ? "" : "red"));
                            }}>
                                <Icon name={strokeColor === "red" ? "circle-slice-8" : "circle"} color={"red"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                setStrokeColor((prev) => (prev === "pink" ? "" : "pink"));

                            }}>
                                <Icon name={strokeColor === "pink" ? "circle-slice-8" : "circle"} color={"pink"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                setStrokeColor((prev) => (prev === "yellow" ? "" : "yellow"))

                            }}>
                                <Icon name={strokeColor === "yellow" ? "circle-slice-8" : "circle"} color={"yellow"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                setStrokeColor((prev) => (prev === "blue" ? "" : "blue"))

                            }}>
                                <Icon name={strokeColor === "blue" ? "circle-slice-8" : "circle"} color={"blue"} type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => drawRef.current?.undo()}>
                                <Icon name="undo-variant" type='material-community' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => drawRef.current?.undo()}>
                                <Icon name="redo-variant" type='material-community' size={25} />
                            </TouchableOpacity>
                            <Button title="Clear" onPress={() => drawRef.current?.redo()} />

                            {/* Colors */}
                            <Button title="Red" onPress={() => setStrokeColor("red")} />
                            <Button title="Blue" onPress={() => setStrokeColor("blue")} />
                            <Button title="Green" onPress={() => setStrokeColor("green")} />

                        </View>

                    </View>}
            </View>
        </View>
    )
}