import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image } from 'react-native';

import gameView from './game';

const RootStack = createBottomTabNavigator({
    screenOptions: ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            return (
                <View style={{display: 'flex', width: '100%', aspectRatio: 1/1}}>
                    <Image style={{flex: 1, width: '100%'}} source={require('./assets/icons/png/mine.png')}/>
                </View>
            );
        },
    }),
    screens: {
        Gra: gameView,
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation />;
}
