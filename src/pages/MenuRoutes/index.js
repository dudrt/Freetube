import { View, TouchableOpacity, Image, StyleSheet,Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useMusicPlayer } from '../../music_player/MusicPlayerContext';



export default function MenuRoutes() {

    const { MenuTelaInicial, setTelaInicial} = useMusicPlayer()

    

    const navigation = useNavigation();


    return (
        <View style={style.container}>
            <View style={style.menu_routes}>
                <TouchableOpacity style={style.pesq} onPress={() =>{setTelaInicial(true);navigation.navigate('Principal');}}>
                    {MenuTelaInicial===true?(<><Image style={style.img} source={require("../../../contents/lupa_selecionada.png")} /><Text style={style.text_selecionado}>Buscar</Text></>):
                    (<><Image style={style.img} source={require("../../../contents/lupa_apagada.png")} /><Text style={style.text_apagado}>Buscar</Text></>)}
                </TouchableOpacity>
                <TouchableOpacity style={style.biblioteca} onPress={() =>{setTelaInicial(false);navigation.navigate('Biblioteca');}}>
                {MenuTelaInicial===true?(<><Image style={style.img} source={require("../../../contents/livro_apagada.png")} /><Text style={style.text_apagado}>Biblioteca</Text></>):
                    (<><Image style={style.img} source={require("../../../contents/livro_selecionada.png")} /><Text style={style.text_selecionado}>Biblioteca</Text></>)}
                </TouchableOpacity>
            </View>
        </View>

    )
}

const style = StyleSheet.create({
    container:{
        width:"100%",
        height:40,
        bottom:0,
        position:"absolute",
        alignItems: "center",
        justifyContent: "center",
        marginBottom:"5%"
    },
    menu_routes: {
        flexDirection:"row",
        height:"100%",
        width: "30%",
        alignItems: "center",
        justifyContent: "center",
        
    },
    pesq: {
        marginEnd:"20%",
        width: "70%",
        alignItems: "center",
        justifyContent: "center",
    },
    biblioteca: {
        width: "70%",
        alignItems: "center",
        justifyContent: "center",
    },
    img: {
        marginTop:"10%",
        width: "30%",
        height: "90%",
        resizeMode: "center"
    },
    text_selecionado:{
        color:"#FFFFFF"
    },
    text_apagado:{
        color:"#B4B4B4"
    }
})