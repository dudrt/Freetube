import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Principal from '../pages/Principal';
import Biblioteca from '../pages/Biblioteca';
import Playlist from '../pages/Playlist'

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="Principal"
            component={Principal}
            options={{headerShown:false}}/>
            <Stack.Screen
            name="Biblioteca"
            component={Biblioteca}
            options={{headerShown:false}}/>
            <Stack.Screen
            name="Playlist"
            component={Playlist}
            options={{headerShown:false}}/>
        </Stack.Navigator>

    );
}