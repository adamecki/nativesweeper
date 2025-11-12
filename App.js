import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image } from 'react-native';

import gameView from './screens/game';
import optionsView from "./screens/options";
import howtoView from "./screens/howto";

import { navTheme, appStyleSheet } from "./styles";

// import AsyncStorage from "@react-native-async-storage/async-storage"; // only for checking first run

const icons = {
    'Gra': <Image style={appStyleSheet.bottomNavigationIcon} source={require('./assets/icons/tabs/game.png')}/>,
    'Opcje': <Image style={appStyleSheet.bottomNavigationIcon} source={require('./assets/icons/tabs/options.png')}/>,
    'Instrukcja': <Image style={appStyleSheet.bottomNavigationIcon} source={require('./assets/icons/tabs/howto.png')}/>,
};
const icons_focused = {
    'Gra': <Image style={appStyleSheet.bottomNavigationIcon} source={require('./assets/icons/tabs/game-focused.png')}/>,
    'Opcje': <Image style={appStyleSheet.bottomNavigationIcon} source={require('./assets/icons/tabs/options-focused.png')}/>,
    'Instrukcja': <Image style={appStyleSheet.bottomNavigationIcon} source={require('./assets/icons/tabs/howto-focused.png')}/>,
};

const RootStack = createBottomTabNavigator({
    screenOptions: ({ route }) => ({
        tabBarIcon: ({ focused }) => {
            return (
                <View style={appStyleSheet.bottomNavigationIconContainer}>
                    {focused ? 
                        icons_focused[route.name]
                    :  
                        icons[route.name]
                    }
                </View>
            );
        },
    }),
    screens: {
        'Gra': gameView,
        'Opcje': optionsView,
        'Instrukcja': howtoView,
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    // check first run
    // const clear = async() => {
    //     await AsyncStorage.clear();
    //     console.log('cleared');
    // }
    // clear();
    
    return <Navigation theme={navTheme}/>;
}
