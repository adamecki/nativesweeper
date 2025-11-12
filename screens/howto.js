import { View, Text, ImageBackground, ScrollView, Image } from 'react-native';
import { appStyleSheet } from '../styles';
import meadowBackground from '../assets/meadow-1x1.jpg';

export default function howtoView() {
    return (
        <View style={appStyleSheet.container}>
            <ImageBackground source={meadowBackground} resizeMode='cover' style={appStyleSheet.appBackground}>
                <ScrollView style={appStyleSheet.instructionsScrollView} contentContainerStyle={appStyleSheet.instructionsContainer}>
                    <View style={appStyleSheet.instructionsBackground}>
                        <Text style={appStyleSheet.optionHeader}>Witaj w NativeSweeper!</Text>
                        <View style={appStyleSheet.instructionSection}>
                            <Text style={appStyleSheet.instructionDescriptor}>Zasady gry są takie same jak w kultowej grze „Saper”:</Text>
                            <Text style={appStyleSheet.instructionDescriptorList}>- Plansza składa się z pól "pustych" oraz zawierających miny,</Text>
                            <Text style={appStyleSheet.instructionDescriptorList}>- Po naciśnięciu na puste pole jest ono odkrywane, po naciśnięciu na pole z miną następuje koniec gry,</Text>
                            <Text style={appStyleSheet.instructionDescriptorList}>- Puste pola wyświetlają liczbę "zaminowanych" pól z nimi graniczących,</Text>
                            <Text style={appStyleSheet.instructionDescriptorList}>- Gdy pole nie graniczy z żadnymi minami, przy jego odkryciu odkrywane są wszystkie pola dookoła.</Text>
                        </View>
                        <View style={appStyleSheet.instructionSection}>
                            <Image source={require('../assets/howto/screenshot1.png')} style={appStyleSheet.instructionImage}/>
                        </View>

                        <Text style={appStyleSheet.optionHeader}>Obsługa gry</Text>
                        <View style={appStyleSheet.instructionSection}>
                            <View style={appStyleSheet.sideBySideFlex}>
                                <Image source={require('../assets/howto/screenshot2.png')} style={[appStyleSheet.instructionImage, appStyleSheet.smallImage]}/>
                                <Text style={appStyleSheet.instructionDescriptor}>Aby odkryć pole, dotknij je.</Text>
                            </View>
                            <View style={appStyleSheet.sideBySideFlex}>
                                <Image source={require('../assets/howto/screenshot3.png')} style={[appStyleSheet.instructionImage, appStyleSheet.smallImage]}/>
                                <Text style={appStyleSheet.instructionDescriptor}>Aby oflagować pole, przytrzymaj je.</Text>
                            </View>
                            <View style={appStyleSheet.sideBySideFlex}>
                                <Image source={require('../assets/howto/screenshot4.png')} style={[appStyleSheet.instructionImage, appStyleSheet.smallImage]}/>
                                <Text style={[appStyleSheet.instructionDescriptor, {marginRight: 96}]}>Aby odkryć wszystkie pola dookoła, upewnij się że dookoła znajduje się odpowiednia ilość flag (i że znajdują się w odpowiednim miejscu!), a następnie dotknij odkryte pole z liczbą.</Text>
                            </View>
                        </View>

                        <Text style={appStyleSheet.optionHeader}>Opcje</Text>
                        <View style={appStyleSheet.instructionSection}>
                            <Image source={require('../assets/howto/screenshot5.png')} style={appStyleSheet.instructionImage}/>
                        </View>
                        <View style={appStyleSheet.instructionSection}>
                            <Text style={appStyleSheet.instructionDescriptor}>W opcjach można dostosować rozmiar kwadratowej planszy.</Text>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}
