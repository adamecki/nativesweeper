import { View, Text, ImageBackground } from 'react-native';
import { appStyleSheet } from '../styles';
import meadowBackground from '../assets/meadow-1x1.jpg';

export default function howtoView() {
    return (
        <View style={appStyleSheet.container}>
            <ImageBackground source={meadowBackground} resizeMode='cover' style={appStyleSheet.appBackground}>
                <View style={appStyleSheet.settingsContainer}>
                    <Text style={appStyleSheet.optionHeader}>:)</Text>
                </View>
            </ImageBackground>
        </View>
    );
}
