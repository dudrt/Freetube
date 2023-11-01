import React from "react";
import { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView,Keyboard ,ActivityIndicator,AppState} from 'react-native';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Snackbar from 'react-native-snackbar';

//Importa o código que faz toda a parte de lógica por trás do audio
import { useMusicPlayer } from '../../music_player/MusicPlayerContext';
//Importa os menus inferiores
import MenuInferior from '../MenuInferior'
import MenuRoutes from "../MenuRoutes";

//Armazenamento interno
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Principal() {


    const {start , playing} = useMusicPlayer()

    const [nome, setNome] = useState("")

    const [views, setViews] = useState([]);
    const [counter, setCounter] = useState(1);
    const [TecladoVisivel, setTecladoVisivel] = useState(false);
    const [CarregandoRequest, setCarregandoRequest] = useState(false);


    const appState = useRef(AppState.currentState);




    global.info
    useEffect(() => {
        start()

    

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log("Teclado ativado")
        setTecladoVisivel(true); 
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log("Teclado desativado")
        setTecladoVisivel(false);
      }
    );
      }, []); 





    const FazerRequest = () => {
        setViews([]);
        setCarregandoRequest(true)
        axios.get('https://apiyoutube.eduardoroth1.repl.co/' + nome)
            .then(response => {
                MostrarVideos(response.data)
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
    }

    const MostrarVideos = (data) => {
        setCounter(1);
        var parsedVideos = []
        global.info = JSON.stringify(data)

        for(let j =0;j<10;j++){
            const video = data.videos[j]
            const imgURL = video.Thumbnail
            const nomeVideo = video.Titulo
        
            parsedVideos.push(
                <TouchableOpacity key={j} style={{ justifyContent: "space-between", flexDirection: "row", marginBottom: 10 }} onPress={() => {Download(j)}}>
                    <Image source={{ uri: imgURL }} style={{ width: "45%", height: 90 }} />
                    <Text numberOfLines={2} style={{ width: "45%", color: "#FFFFFF", }}>{nomeVideo}</Text>
                </TouchableOpacity>
            )
        }
        
        setViews([parsedVideos]);
        setCarregandoRequest(false)
        setCounter(counter + 1);
    }

    let dirs = ReactNativeBlobUtil.fs.dirs

    const Download = async (id) => {
        const objetoJSON = JSON.parse(global.info);
        const video_info = objetoJSON.videos[id]

        var playlist_root = String(await AsyncStorage.getItem('Musicas Baixadas'))

        console.log( typeof playlist_root)
        if(playlist_root!="Nenhuma musica salva!" || playlist_root!="" || playlist_root!=null || playlist_root!="null"){
            var array = playlist_root.split("&¨%#]")
            for(var j =0;j<array.length;j++){
                if(array[j]===video_info.Titulo){
                    Snackbar.show({
                        text: 'Esta música já foi baixada!',
                        duration: Snackbar.LENGTH_SHORT,        
                      });
                      return
                }
            }
        }




        
        Snackbar.show({
            text: 'Baixando...',
            duration: Snackbar.LENGTH_SHORT,        
          });
        
          console.log("Global info:"+global.info)

        
        const video_id = video_info.VideoId
        const nome_musica = video_info.Titulo
        const img = video_info.Thumbnail
        
        var file_name = nome_musica.replace(/[^a-zA-Z0-9.\-@/._]/g, "");
        console.log(file_name)
        var suporte = file_name.split(" ");
        file_name=suporte[0];
        for(var i =1;i< suporte.length;i++){
            file_name+="_"+suporte[i];
        }
        

        ReactNativeBlobUtil
            .config({
                fileCache: true,
                path: dirs.DocumentDir + '/'+file_name+".mp3",
                appendExt: '.mp3'
            })
            .fetch('GET', 'https://apiyoutube.eduardoroth1.repl.co/downmedio?https://www.youtube.com/watch?v=' + video_id, {
            })
            .then((res) => {
                console.log('Arquivo salvo em:', res.path())
                ReactNativeBlobUtil
            .config({
                fileCache: true,
                path: dirs.DocumentDir + '/'+file_name+".jpg",
                appendExt: '.jpg'
            })
            .fetch('GET', img, {
            })
            .then((res) => {
                console.log('Arquivo salvo em:', res.path())
                Snackbar.show({
                    text: 'Música Salva!',
                    duration: Snackbar.LENGTH_SHORT,        
                  });
                SalvarNome(nome_musica)

            }).catch(()=>{

            })
            }).catch(() =>{
                Snackbar.show({
                    text: 'Erro, entre em contato com o suporte!',
                    duration: Snackbar.LENGTH_SHORT,        
                  });
            })
    }
    
    const SalvarNome = async (NomeMusica) =>{

        var NomeExistente = await GetNomeMusica()
        if(NomeExistente==="Nenhuma musica salva!" || NomeExistente==="" || NomeExistente===null){
            try {
                await AsyncStorage.setItem('Musicas Baixadas', NomeMusica);
                console.log("Salvou")
              } catch (e) {
                console.log("Erro ao salvar o nome da musica.") 
              }
        }else{
            try {
                await AsyncStorage.setItem('Musicas Baixadas',  NomeExistente+ "&¨%#]" +NomeMusica);
                console.log("Salvou")
              } catch (e) {
                console.log("Erro ao salvar o nome da musica.") 
              }
        }
    }

    async function GetNomeMusica (){
        try{
            return await AsyncStorage.getItem('Musicas Baixadas');
        }catch{
            return "Nenhuma musica salva!"
        }
    }

   
    

    return (
        <View style={style.container}>
            <View style={style.top}>
                <View style={style.titulo}>
                    <Text style={style.titulo_texto}>FreeTube</Text>
                </View>
            </View>                

            <View style={style.input_btn_view}>
                <TextInput
                    value={nome}
                    onChangeText={text => setNome(text)}
                    placeholder="Nome do vídeo"
                    placeholderTextColor="#AAAAAA"
                    style={style.input_texto}
                />

                <TouchableOpacity
                    style={style.botao}
                    onPress={FazerRequest}>
                    <Image style={style.img} source={require("../../../contents/lupa_selecionada.png")} />
                </TouchableOpacity>

            </View>

            {CarregandoRequest?(<ActivityIndicator style={{top:"10%"}} size="large" color="#FFFFFF" />
            ):(
            <></>
            )}

            {playing && !TecladoVisivel?(
                 <ScrollView>
                 <View style={{marginBottom:125}}>
                 {views.map((view, index) => (
                     <View key={index}>
                         {view}
                     </View>
                 ))}
                 </View>
             </ScrollView>
            ):!TecladoVisivel?(
                <ScrollView>
                <View style={{marginBottom:70}}>
                {views.map((view, index) => (
                    <View key={index}>
                        {view}
                    </View>
                ))}
                </View>
            </ScrollView>
            ):(
                <ScrollView style={{marginTop:"6%"}}>
                <View>
                {views.map((view, index) => (
                    <View key={index}>
                        {view}
                    </View>
                ))}
                </View>
            </ScrollView>
            )}
            
            {playing && !TecladoVisivel?(<View style={{bottom:55}}><MenuInferior/></View>):(<></>)}
          
            {TecladoVisivel?(<></>):<MenuRoutes/>}

        </View>
    );

}


const style = StyleSheet.create({
    container: {
        backgroundColor: "#101010",
        flex: 1,
    },
    top:{
        alignItems: "center",
        justifyContent: "center",
        height:"12%",
        flexDirection: "row",
        


    },
    titulo: {
        width:"64%",
        minHeight:410,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

    },
    titulo_texto: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 30
    },
    biblioteca_view:{
        marginEnd:10,
        borderRadius:40,
        margin:"4%",
        width:"22%",
        height:"40%",
        justifyContent: 'center',
        alignItems: 'center',
        color:"#FFFFFF",
        backgroundColor:"#404040"

    },
    biblioteca_text:{
        minHeight:30,
        fontSize:20,
        color:"#FFFFFF"
    },
    input_btn_view: {
        
        height: "10%",
        justifyContent: "space-between",
        flexDirection: "row"

    },
    input_texto: {
        marginStart: 8,
        flex: 1,
        fontSize: 20,
        borderBottomWidth: 1,
        height: 50,
        borderColor: "#FFFFFF",
        color: "#FFFFFF",
        

    },
    botao: {
        height: 50,
        width: "30%",
        justifyContent: "center",
        alignItems: "center"
    },
    botao_texto: {
        color: "#FFFFFF",
        fontSize: 20
    },
    videos: {

        flex: 1
    },
    img: {
        marginTop:"10%",
        width: "30%",
        height: "80%",
        resizeMode: "center"
    },
    
})