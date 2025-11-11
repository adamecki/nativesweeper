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
        aspectRatio: 1/1,
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
});
