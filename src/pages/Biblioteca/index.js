import React from "react";
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MenuRoutes from "../MenuRoutes";

import MenuInferior from '../MenuInferior'

import { useMusicPlayer } from '../../music_player/MusicPlayerContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from 'react-native-modal';

export default function Biblioteca() {
  //chama as funções do MusicPlayerContext para tocar musica
  const {playing, setPlaylist } = useMusicPlayer()


  const [showNewPlaylist, setNewPlaylist] = useState(false)
  const [nameNewPlaylist, setNewPlaylistName] = useState()

  const [playlistShow, setPlaylistShow] = useState([])

  const [showModal, setShowModal] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState("")
  const navigation = useNavigation();

  useEffect(() => {
    init()
  }, []);



  const init = async () => {
    let playlists = await get_nome_playlists()

    try {
      playlists = playlists.split("&¨%#]")
      setPlaylistShow(playlists)
      console.log(playlists)
    } catch {
      setPlaylistShow(playlists)
      console.log(playlists)

    }
  }

  async function get_nome_playlists() {

    const playlist = await AsyncStorage.getItem('playlists');

    if (playlist == null || playlist === "") {
      await AsyncStorage.setItem("playlists", "Musicas Baixadas")
      return await AsyncStorage.getItem('playlists');
    } else {
      console.log(playlist)

      return playlist
    }

  }
  const new_playlist = async (name) => {
    await AsyncStorage.setItem(name, "")
    let playlists = await get_nome_playlists()
    await AsyncStorage.setItem("playlists", playlists + "&¨%#]" + name)
    console.log(await AsyncStorage.getItem('playlists'))
    init()
  }
  const Delete = async (playlist_nome) => {
    const playlists = await AsyncStorage.getItem('playlists');
    let array = playlists.split("&¨%#]")

    for (var i = 0; i < array.length; i++) {
      if (playlist_nome === array[i]) {
        AsyncStorage.removeItem(playlist_nome)
        array.splice(i, 1)
      }
    }
    let nova_playlist
    if (array.length == 1) {
      nova_playlist = array[0]
    }
    else {
      nova_playlist = array[0]
      for (var i = 1; i < array.length; i++) {
        nova_playlist += "&¨%#]"+array[1]
  
      }
    }
    await AsyncStorage.setItem("playlists", nova_playlist)
    init()
  }


  return (

    <View style={style.container}>

      <TouchableOpacity style={style.playlist_view}
        onPress={() => setNewPlaylist(true)}>
        <Text style={style.playlist_text}>Nova Playlist</Text>
      </TouchableOpacity>

      <ScrollView>
        {playlistShow.map((playlist, index) => (playlist != "Musicas Baixadas" ? (
          <View key={index} style={style.list_playlist_view}>
            <TouchableOpacity style={style.list_playlist_button} onPress={() => {
              setPlaylist(playlist)
              navigation.navigate('Playlist')
            }}>
              <Text style={style.list_playlist_text}>{playlist}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width:"10%"}} onPress={() => {
              setShowModal(true);
              setSelectedPlaylist(playlist)
            }}>

            <Image style={{ width: "100%", height: 30, resizeMode: "center" }} source={require("../../../contents/tres_pontos.png")} />
            </TouchableOpacity>
          </View>

        ) : (
          <View key={index} style={style.list_playlist_view}>
            <TouchableOpacity style={style.list_playlist_button} onPress={() => {
              setPlaylist(playlist)
              navigation.navigate('Playlist')
            }}>
              <Text style={style.list_playlist_text}>{playlist}</Text>
            </TouchableOpacity>
          </View>
        )))}
      </ScrollView>

      
      <Modal isVisible={showModal}>
        <View style={style.modal_view}>
          <View style={style.audio_view}>
            <Text style={style.audio_text}>{selectedPlaylist}</Text>
          </View>
          <TouchableOpacity style={style.deletar_view}
            onPress={() => {
              Delete(selectedPlaylist)
              setShowModal(false)
            }}
          >
            <Text style={style.deletar_text}>Deletar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.sair_view} onPress={() => setShowModal(false)}>
            <Text style={style.sair_text}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modal>


      <Modal isVisible={showNewPlaylist} style={{justifyContent:"center",alignItems:"center"}}>
        <View style={style.new_playlist_modal}>
          <View style={style.playlist_name_view}>
            <TextInput
              placeholderTextColor="#AAAAAA"
              style={style.playlist_name_text}
              value={nameNewPlaylist}
              onChangeText={text => setNewPlaylistName(text)}
              placeholder="Nome da Playlist" />
          </View>
          <TouchableOpacity style={style.playlist_new_button_view_criar} onPress={() => { new_playlist(nameNewPlaylist);setNewPlaylist(false);setNewPlaylistName("") }}>
            <Text style={style.playlist_new_button_text}>Criar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNewPlaylist(false)} style={style.playlist_new_button_view_sair}>
            <Text style={style.playlist_new_button_text}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {playing ?(<View style={{bottom:55}}><MenuInferior/></View>):(<></>)}
      <MenuRoutes/>

    </View>
  );
}


const style = StyleSheet.create({
  container: {
    backgroundColor: "#101010",
    flex: 1

  },
  voltar: {
    borderRadius: 40,
    margin: "4%",
    width: "22%",
    height: "6%",
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF",
    backgroundColor: "#404040"
  },
  voltar_texto: {
    fontSize: 20,
    color: "#FFFFFF"
  },
  modal_view: {
    flex: 0.5,
    borderRadius: 60,
    backgroundColor: "#202020",
    justifyContent: 'center',
    alignItems: "center"
  },
  deletar_view: {
    backgroundColor: "#353535",
    width: "40%",
    height: "25%",
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: "10%"
  },
  deletar_text: {
    fontSize: 20,
    color: "#FFFFFF"
  },
  sair_view: {
    backgroundColor: "#353535",
    width: "40%",
    height: "25%",
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: "center",

  },
  sair_text: {
    fontSize: 20,
    color: "#FFFFFF"
  },
  audio_view: {
    backgroundColor: "#353535",
    width: "85%",
    height: 40,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: "5%",
    paddingEnd: 8,
    paddingStart: 8
  },
  audio_text: {
    fontSize: 25,
    color: "#FFFFFF"
  },
  not_down_view: {
    justifyContent: 'center',
    alignItems: "center",
    marginTop: "5%",
  },
  not_down_text: {
    color: "#FFFFFF"
  },
  playlist_view: {
    borderRadius: 40,
    marginLeft: "4%",
    marginBottom: "4%",
    marginTop:"4%",
    width: "40%",
    height: "6%",
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF",
    backgroundColor: "#404040"
  },
  playlist_text: {
    fontSize: 20,
    color: "#FFFFFF"
  },
  new_playlist_modal: {
    width:"100%",
    borderRadius: 60,
    backgroundColor: "#202020",
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlist_name_text: {
    fontSize: 24,
    color: "#FFFFFF",
    
  },
  playlist_name_view: {
    backgroundColor: "#353535",
    margin: "5%",
    width: "80%",
    borderRadius: 40,

  },
  playlist_new_button_view_sair: {
    backgroundColor: "#353535",
    width: "40%",
    height: "15%",
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlist_new_button_view_criar: {
    backgroundColor: "#353535",
    marginBottom: "5%",
    width: "40%",
    height: "15%",
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlist_new_button_text: {
    color: "#FFFFFF",
    fontSize: 20
  },
  list_playlist_view: {
    margin: "2%",
    flexDirection: "row"

  },
  list_playlist_button: {
    backgroundColor: "#353535",
    borderRadius: 20,
    width: "90%",
    padding: 5,
    paddingStart: 8,
  },
  list_playlist_text: {
    fontSize: 20,
    color: "#FFFFFF"
  }

})