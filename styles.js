import { StyleSheet } from 'react-native';
import { DefaultTheme } from '@react-navigation/native';

export const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        card: 'rgb(206, 240, 241)',
    }
};

export const appStyleSheet = StyleSheet.create({
    // Global styles
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgb(8, 152, 189)',
    },
    appBackground: {
        height: '100%',
        width: '100%',
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // App.js - navigation icons
    bottomNavigationIconContainer: {
        display: 'flex',
        width: '100%',
        aspectRatio: 1 / 1,
    },
    bottomNavigationIcon: {
        flex: 1,
        width: '100%',
    },

    // Game screen
    logoContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logo: {
        flex: 1,
        resizeMode: 'contain',
        width: 400,
    },
    board: {
        width: '100%',
        aspectRatio: 1 / 1,
        padding: '3%',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    // -
    field: {
        flex: 1,
        aspectRatio: 1 / 1,
        backgroundColor: '#EEEEEE',
        margin: '0.5%',
        boxShadow: '2px 2px blue',
    },
    fieldWithMine: {
        backgroundColor: '#DD0000',
    },
    svgContainer: {
        position: 'relative',
    },
    cover: {
        position: 'absolute',
        flex: '1',
        width: '100%',
        aspectRatio: 1 / 1,
        backgroundColor: 'rgba(47, 95, 255, 1)',
    },
    restartcontainer: {
        width: '100%',
        height: '10%',
        padding: '3%',
    },
    restartbutton: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(47, 95, 255)',
        boxShadow: '2px 2px blue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    restarttext: {
        color: 'white',
        fontSize: 28,
    },

    // Options screen
    settingsContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 16,
        paddingTop: 32,
    },
    optionHeader: {
        color: 'white',
        fontSize: 28,
    },
    optionDescriptor: {
        width: '100%',
        color: 'white',
        fontSize: 18,
    },
    footerSignature: {
        bottom: 16,
    },

    // Board size slider
    sliderTrack: {
        width: 300,
        height: 50,
        backgroundColor: 'rgb(47, 95, 255)',
        boxShadow: '2px 2px blue',
        justifyContent: 'center',
        padding: 5,
    },
    sliderHandle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgb(8, 152, 189)',
        boxShadow: '2px 2px blue',
        position: 'absolute',
        left: 5,
    },
    saveButton: {
        width: 300,
        height: 50,
        backgroundColor: 'rgb(47, 95, 255)',
        boxShadow: '2px 2px blue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // HowTo screen
    instructionsScrollView: {
        width: '100%',
        height: '100%',
    },
    instructionsContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    instructionsBackground: {
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: 'rgba(47, 95, 255, 0.5)',
        boxShadow: '2px 2px blue',
        width: '90%',
        display: 'flex',
        alignItems: 'center',
        padding: 4,
    },
    instructionSection: {
        width: '100%',
        padding: 8,
    },
    instructionDescriptor: {
        color: 'white',
    },
    instructionDescriptorList: {
        color: 'white',
        marginLeft: 16,
        marginTop: 4,
        marginBottom: 4,
    },
    instructionImage: {
        width: '100%',
        height: null,
        aspectRatio: 1 / 1,
    },
    smallImage: {
        width: '25%',
    },
    sideBySideFlex: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
        gap: 16,
    },
});
