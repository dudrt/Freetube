import { Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Image } from "react-native";
import { useState, useEffect } from 'react';
import { useMusicPlayer } from '../../music_player/MusicPlayerContext';
import Modal from 'react-native-modal';
import MenuInferior from '../MenuInferior'
import RNFS from 'react-native-fs';

import Snackbar from 'react-native-snackbar';

import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from "react-native-track-player";

export default function Playlist() {
    const [downloadedClips, setDownloadedClips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [ShowAddPlaylist, setShowAddPlaylist] = useState(false)
    const [selectedClipKey, setSelectedClipKey] = useState();
    const [selectedClipName, setSelectedClipName] = useState();
    const [playlistsExistentes, setPlaylistsExistentes] = useState([]);

    const navigation = useNavigation();


    const { playing, Playlist, PlayPlaylist,PlaylistAtual } = useMusicPlayer()

    useEffect(() => {
        console.log(PlaylistAtual)
        init()
    }, []);

    //Mostra as musicas na playlist
    const init = async () => {
        try {
            let musicas = await GetNomeMusicas()
            try {
                musicas = musicas.split("&¨%#]")
                setDownloadedClips(musicas);
            } catch (e) {
                setDownloadedClips(musicas);

            }
        } catch (error) {
            console.error(error);
        }
        let playlists = await AsyncStorage.getItem('playlists');
        playlists = playlists.split("&¨%#]")
        setPlaylistsExistentes(playlists)
    }

    //Deleta a musica do app
    const Delete = async (posicao) => {

        if (Playlist != "Musicas_Baixadas") {
            DeletarUnicaPlaylist(posicao)
            console.log("Passou pela função e retornou")
            return
        }

        var musicas = await GetNomeMusicas()

        var nome_musica = musicas.split("&¨%#]")
        var musica_retirar_player = nome_musica[posicao]
        var nome_arquivo = nome_musica[posicao]
        nome_musica.splice(posicao, 1)
        // -----------------------------------------------
        // deleta o arquivo
        var file_name = nome_arquivo.replaceAll(/[^a-zA-Z0-9.\-@/._]/g, "");
        var suporte = file_name.split(" ");
        file_name = suporte[0];
        for (var i = 1; i < suporte.length; i++) {
            file_name += "_" + suporte[i];
        }
        file_name += ".mp3";


        if (nome_musica.length === 1) {
            salvar = nome_musica[0]
        } else if (nome_musica.length === 0) {
            salvar = ""
        } else {
            salvar = nome_musica[0]
            for (let t = 1; t < nome_musica.length; t++) {
                salvar += "&¨%#]" + nome_musica[t]
            }
        }
        await AsyncStorage.setItem(Playlist, salvar)


        RNFS.exists("file:///data/user/0/com.freetube/files/" + file_name)
            .then((existe) => {
                if (existe) {
                    RemoverMusicaPlaylists(nome_arquivo)
                    ArrumarTrack(posicao,musica_retirar_player)
                    RNFS.unlink("file:///data/user/0/com.freetube/files/" + file_name);

                } else {
                    Snackbar.show({
                        text: 'Ocorreu um erro inesperado!',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            })
            init()
    }


    const DeletarUnicaPlaylist = async (posicao) => {
        var musicas = await GetNomeMusicas()
        try {
            var array_musicas = musicas.split("&¨%#]")
            if (array_musicas == undefined) {
                await AsyncStorage.setItem(Playlist, "")
            } else {

                var musica_retirar_player = array_musicas[posicao]
                array_musicas.splice(posicao, 1)
                
                var salvar;
                if (array_musicas.length === 1) {
                    salvar = array_musicas[0]
                } else if (array_musicas.length === 0) {
                    salvar = ""
                } else {
                    salvar = array_musicas[0]
                    for (let t = 1; t < array_musicas.length; t++) {
                        salvar += "&¨%#]" + array_musicas[t]
                    }
                }

                await AsyncStorage.setItem(Playlist, salvar)
                ArrumarTrack(posicao,musica_retirar_player)
                init()
                Snackbar.show({
                    text: 'Música apagada!',
                    duration: Snackbar.LENGTH_SHORT,
                });
                
            }
        } catch {
            console.log("Ocorreu um erro inesperado")


        }
    }
    
    const ArrumarTrack = async (posicao,musica_retirar) =>{

        if(!playing){
            return
        }

        if(PlaylistAtual==Playlist){
        let trackObject = await TrackPlayer.getTrack(posicao);
        console.log("Track que será excluída:"+trackObject.title)
            await TrackPlayer.remove([posicao]);

            const tracks_nova = await TrackPlayer.getQueue();
            console.log("Track está assim:"+tracks_nova)
        }else if(Playlist=="Musicas_Baixadas"){
            const tracks = await TrackPlayer.getQueue();
            for(var i=0;i<tracks.length;i++){
                if(tracks[i].title==musica_retirar){
                    console.log("Musica Retirada:"+tracks[i].title)
                    await TrackPlayer.remove([i]);
                    const tracks_nova = await TrackPlayer.getQueue();
                    console.log("Track está assim:"+tracks_nova.toString())
                }
            }
        }
    }


    const RemoverMusicaPlaylists = async (musica_del) => {
        var playlists = await AsyncStorage.getItem('playlists');
        let array_playlist = playlists.split("&¨%#]")
        if (array_playlist == "Musicas_Baixadas") {
        } else {
            for (let i = 1; i < array_playlist.length; i++) {
                let musicas_playlist = await AsyncStorage.getItem(array_playlist[i]);
                try {
                    let musicas = musicas_playlist.split("&¨%#]")
                    if (musicas == null || musicas == "") {

                    } else {
                        for (let j = 0; j < musicas.length; j++) {
                            console.log(musica_del)
                            if (musicas[j] === musica_del) {
                                musicas.splice(j, 1)
                                var salvar;
                                if (musicas.length === 1) {
                                    salvar = musicas[0]
                                } else if (musicas.length === 0) {
                                    salvar = ""
                                } else {
                                    salvar = musicas[0]
                                    for (let t = 1; t < musicas.length; t++) {
                                        salvar += "&¨%#]" + musicas[t]
                                    }
                                }
                                await AsyncStorage.setItem(array_playlist[i], salvar)
                            }
                        }
                    }
                } catch {
                    console.log("242-Musicas da Playlist:" + musicas_playlist)
                    if (musicas_playlist == musica_del) {
                        await AsyncStorage.setItem(array_playlist[i], "")
                    }
                }

            }
        }


    }


    const AddNovaPlaylist = async (playlist_add, musica_nome) => {
        let musicas_playlist = await AsyncStorage.getItem(playlist_add);

        if (musicas_playlist != null) {

            var array_musicas = musicas_playlist.split("&¨%#]")
            if (array_musicas == undefined) {
                if (musicas_playlist == musica_nome) {
                    Snackbar.show({
                        text: 'Esta música já foi adiconada a playlist.',
                        duration: Snackbar.LENGTH_SHORT,
                    });

                    return
                }
            } else {
                for (var i = 0; i < array_musicas.length; i++) {
                    if (array_musicas[i] == musica_nome) {
                        Snackbar.show({
                            text: 'Esta música já foi adiconada a playlist.',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                        return
                    }
                }
            }

        }

        if (musicas_playlist == null) {
            await AsyncStorage.setItem(playlist_add, musica_nome)
        } else {
            musicas_playlist += "&¨%#]" + musica_nome
            await AsyncStorage.setItem(playlist_add, musicas_playlist)
        }
        Snackbar.show({
            text: 'Música adicionada em ' + playlist_add + ".",
            duration: Snackbar.LENGTH_SHORT,
        });
        setShowAddPlaylist(false)
        setShowModal(true)

    }

    async function GetNomeMusicas() {

        return await AsyncStorage.getItem(Playlist);

    }

    return (
        <View style={style.container}>

            <TouchableOpacity style={style.voltar} onPress={() => navigation.navigate('Biblioteca')}>
                <Text style={style.voltar_texto}>Voltar</Text>
            </TouchableOpacity>

            <View style={style.playlist_view}>
                <Text style={style.playlist_text}>
                    {Playlist}
                </Text>
            </View>
            <View style={style.options_view}>
                <TouchableOpacity style={style.play_option} onPress={() => { PlayPlaylist(0) }}>
                    <ImageBackground style={style.img} source={require('../../../contents/play.png')} />
                </TouchableOpacity>
            </View>

            <ScrollView >
                <View style={[scroll_style.no_margin, playing ? scroll_style.margin:scroll_style.no_margin]}>
                {downloadedClips != null ? (downloadedClips.map((clip, index) => (
                    <View style={{ justifyContent: "space-between", flexDirection: "row", marginBottom: "1%" }} key={index}>
                        <TouchableOpacity style={{ justifyContent: "space-between", flexDirection: "row", marginBottom: 10, marginStart: 0, width: "85%" }} onPress={() => PlayPlaylist(index)} >
                            <Image style={{ width: "40%", height: 70, resizeMode: "center" }} source={{ uri: "file:///data/user/0/com.freetube/files/" + clip.replaceAll(/[^a-zA-Z0-9.\-@/._]/g, "").replaceAll(" ", "_") + ".jpg" }} />

                            <Text style={{ width: "65%", color: "#FFFFFF",paddingTop:"2%" }} numberOfLines={2}>{clip}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: "5%", marginEnd: "5%" }}
                            onPress={() => {
                                setSelectedClipKey(index);
                                setSelectedClipName(clip);
                                setShowModal(true);
                            }}>
                            <Image style={{ width: "100%", height: 50, resizeMode: "center" }} source={require("../../../contents/tres_pontos.png")} />
                        </TouchableOpacity>
                    </View>
                ))) : (
                    <View style={style.not_down_view}>
                        <Text style={style.not_down_text}>As musicas baixadas serão mostradas aqui</Text>
                    </View>
                )}
                </View>
            </ScrollView>
            <Modal isVisible={showModal} style={{
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <View style={style.modal_view}>
                    <View style={style.audio_view}>
                        <Text style={style.audio_text} numberOfLines={2}>{selectedClipName}</Text>
                    </View>
                    <TouchableOpacity style={style.deletar_view}
                        onPress={() => {
                            Delete(selectedClipKey)
                            setShowModal(false)
                        }}>

                        <Text style={style.deletar_text}>Deletar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.add_playlist_view}
                        onPress={() => {
                            setShowAddPlaylist(true)
                            setShowModal(false)
                        }}>
                        <Text style={style.add_playlist_text}>Adicionar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.sair_view} onPress={() => setShowModal(false)}>
                        <Text style={style.sair_text}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </Modal>



            <Modal isVisible={ShowAddPlaylist} style={{
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <View style={style.new_playlist_modal}>
                    <View style={style.new_playlist_text_view}>
                        <Text style={style.new_playlist_text}>Escolha a playlist que a musica será adicionada:</Text>
                    </View>
                    <View style={style.new_playlist_scroll_view}>
                        <ScrollView style={style.new_playlist_scrollview}>
                            {(playlistsExistentes.map((playlist, index) => (playlist=="Musicas_Baixadas" || playlist ==Playlist?(""):(
                                <View key={index} style={style.playlist_nome_view}>
                                    <TouchableOpacity onPress={() => {
                                        AddNovaPlaylist(playlist, selectedClipName)
                                    }}>
                                        <Text style={style.playlist_nome_text}>{playlist}</Text>
                                    </TouchableOpacity>
                                </View>))))}
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={style.new_playlist_sair_botao}
                        onPress={() => {
                            setShowAddPlaylist(false)
                            setShowModal(true)
                        }}>
                        <Text style={style.new_playlist_sair_text}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {playing ? (<MenuInferior/>):(<></>)}


        </View>
    );
}
const scroll_style = StyleSheet.create({
   margin:{
        marginBottom:70
   }, 
   no_margin:{

   }
});

const style = StyleSheet.create({
    container: {
        backgroundColor: "#101010",
        flex: 1

    },
    modal_view: {
        width: "100%",
        height: "50%",
        borderRadius: 60,
        backgroundColor: "#202020",
        justifyContent: 'center',
        alignItems: "center"
    },
    audio_view: {
        width: "85%",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#353535",
        height: "20%",
        margin: "5%",
        borderRadius: 60
    },
    audio_text: {
        color: "#FFFFFF",
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    },
    deletar_view: {
        backgroundColor: "#353535",
        width: "40%",
        height: "15%",
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: "5%"
    },
    deletar_text: {
        fontSize: 20,
        color: "#FFFFFF"
    },
    add_playlist_view: {
        backgroundColor: "#353535",
        width: "40%",
        height: "15%",
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: "5%"
    },
    add_playlist_text: {
        fontSize: 20,
        color: "#FFFFFF"
    },
    sair_view: {
        backgroundColor: "#353535",
        width: "40%",
        height: "15%",
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: "center",

    },
    sair_text: {
        fontSize: 20,
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
    playlist_view: {
        marginStart: "6%"
    },
    playlist_text: {
        fontSize: 28,
        color: "#FFFFFF",
    },
    options_view: {
        flexDirection: "row",

    },
    play_option: {
        width: "100%",
        height: "100%",
    },
    img: {
        margin: 20,
        width: 32,
        height: 36,
        resizeMode: 'center',
        marginBottom: "5%"

    },
    new_playlist_modal: {
        flex: 0.7,
        width: "100%",
        borderRadius: 60,
        backgroundColor: "#202020",
        alignItems: "center"
    },
    new_playlist_text_view: {
        width: "80%",
        backgroundColor: "#404040",
        marginTop: "5%",
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 60
    },
    new_playlist_text: {
        color: "#FFFFFF",
        fontSize: 18,
        padding: 6
    },
    new_playlist_scroll_view: {
        marginTop: "8%",
        width: "80%",
        height: "60%"
    },
    new_playlist_scrollview: {
        backgroundColor: "#404040"
    },
    new_playlist_sair_botao: {
        backgroundColor: "#404040",
        width: "35%",
        height: "8%",
        marginTop: "5%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 60

    },
    new_playlist_sair_text: {
        color: "#FFFFFF",
        fontSize: 18
    },
    playlist_nome_view: {
        backgroundColor: "#202020",
        marginTop:1.5

    },
    playlist_nome_text: {
        color: "#FFFFFF",
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 8
    }
})