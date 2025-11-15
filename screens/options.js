import { View, Text, ImageBackground, TouchableHighlight } from 'react-native';

import { GestureHandlerRootView, GestureDetector, Gesture, TextInput } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { appStyleSheet } from '../styles';
import meadowBackground from '../assets/meadow-1x1.jpg';

const initial_size = 50; // 0 to 5
const slider_width = 300;

const BoardSizeView = Animated.createAnimatedComponent(TextInput);

const optionsView = () => {
    const navigation = useNavigation();

    const saveBoardSize = async () => {
        try {
            await AsyncStorage.setItem("BoardSize", `${dynamicLabelUpdateOffset.value}`);
        } catch(err) {
            alert(err);
        }

        navigation.navigate('Gra', { refresh: Date.now() });
    };

    const fetchBoardSize = async () => {
        try {
            let value = await AsyncStorage.getItem("BoardSize");

            if (value == null) {
                dynamicLabelUpdateOffset.value = 8;
                try {
                    await AsyncStorage.setItem("BoardSize", '8');
                } catch(err_set) {
                    alert(err_set);
                }
            } else {
                dynamicLabelUpdateOffset.value = Number(value);
            }

            offset.value = (await AsyncStorage.getItem("BoardSize") - 8) * 62;
        } catch(err) {
            alert(err);
        }
    }

    const offset = useSharedValue(0);
    const dynamicLabelUpdateOffset = useSharedValue(8);
    fetchBoardSize();
    const max_value = slider_width - initial_size;

    const pan = Gesture.Pan().onChange((event) => {
        offset.value = Math.abs(offset.value) <= max_value
            ? offset.value + event.changeX <= 0
                ? 0
                : offset.value + event.changeX >= max_value
                    ? max_value
                    : offset.value + event.changeX
            : offset.value;
        
        const newSize = Math.round(offset.value / 62);
        dynamicLabelUpdateOffset.value = newSize + 8;
    }).onEnd(() => {
        const newSize = Math.round(offset.value / 62);
        offset.value = newSize * 62;
        dynamicLabelUpdateOffset.value = newSize + 8;
    });

    const sliderStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        }
    });

    const boardSizeDescriptor = useAnimatedProps(() => {
        return {
            text: `${dynamicLabelUpdateOffset.value} na ${dynamicLabelUpdateOffset.value}`,
            defaultValue: `${dynamicLabelUpdateOffset.value} na ${dynamicLabelUpdateOffset.value}`
        };
    });

    return (
        <ImageBackground source={meadowBackground} resizeMode='cover' style={appStyleSheet.appBackground}>
            <GestureHandlerRootView style={appStyleSheet.container}>
                <View style={appStyleSheet.settingsContainer}>
                    <View>
                        <Text style={appStyleSheet.optionHeader}>Rozmiar planszy</Text>
                    </View>
                    <View style={appStyleSheet.sliderTrack}>
                        <GestureDetector gesture={pan}>
                            <Animated.View style={[appStyleSheet.sliderHandle, sliderStyle]} />
                        </GestureDetector>
                    </View>
                    <BoardSizeView animatedProps={boardSizeDescriptor} style={appStyleSheet.optionDescriptor} editable={false}/>
                    <TouchableHighlight style={appStyleSheet.saveButton} onPress={saveBoardSize}>
                        <View>
                            <Text style={appStyleSheet.optionDescriptor}>Zapisz (zrestartuje grę!)</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </GestureHandlerRootView>
            <View style={appStyleSheet.footerSignature}>
                <Text style={appStyleSheet.optionDescriptor}>2025 | Nativesweeper by Adam Łukasik</Text>
            </View>
        </ImageBackground>
    );
};

export default optionsView;
