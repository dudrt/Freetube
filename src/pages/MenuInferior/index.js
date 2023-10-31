import { View, TouchableOpacity, Text, StyleSheet, Image, ScrollView, ProgressBarAndroidBase } from 'react-native';
import { useMusicPlayer } from '../../music_player/MusicPlayerContext';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import { useState, useEffect } from 'react';

import * as Progress from 'react-native-progress';

import Modal from 'react-native-modal';


export default function Menu() {

    const { PlayStop, nomeMusicaAtual, PlaylistAtual, PreviousMusic, NextMusic, Replay, FuncReplay } = useMusicPlayer()
    const progress = useProgress();
    const [showInfo, SetShowInfoTrack] = useState(false)
    const [MusicPlaying, SetMusicPlaying] = useState(false)


    useEffect(() => {
        const state = TrackPlayer.getState()
        if (state == State.Playing) {
            SetMusicPlaying(true)
        } else {
            SetMusicPlaying(false)
        }
    }, [])


    return (
        <View style={style.menu}>
            <TouchableOpacity style={style.botao_track} onPress={() => { SetShowInfoTrack(true) }}>
                <Image style={style.img_musica} source={{ uri: "file:///data/user/0/com.freetube/files/" + nomeMusicaAtual.replaceAll(/[^a-zA-Z0-9.\-@/_]/g, "").replaceAll(" ", "_") + ".jpg" }} />

                <View style={style.view_musica}>
                    <Text style={style.nome_musica} numberOfLines={2}>{nomeMusicaAtual}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.botao_player} onPress={() => { SetMusicPlaying(!MusicPlaying), PlayStop() }}>
                {MusicPlaying === true ?
                    (<Image style={style.img} source={require('../../../contents/play.png')} />) :
                    (<Image style={style.img} source={require('../../../contents/pause.png')} />)}
            </TouchableOpacity>


            <Modal isVisible={showInfo}>
                <View style={style.modal_view}>





                    <TouchableOpacity onPress={() => { SetShowInfoTrack(false) }} style={style.sair_view}>
                        <Image style={style.sair_img} source={require("../../../contents/seta-baixo.png")} />
                    </TouchableOpacity>






                    <View style={style.view_top}>

                        <Text style={style.top_text}>Tocando de</Text>
                        <Text style={style.top_track}>{PlaylistAtual}</Text>
                    </View>

                    <View style={style.view_meio}>
                        <View style={style.view_thumb}>
                            <Image style={style.img_thumb} source={{ uri: "file:///data/user/0/com.freetube/files/" + nomeMusicaAtual.replaceAll(/[^a-zA-Z0-9.\-@/_]/g, "").replaceAll(" ", "_") + ".jpg" }} />
                        </View>
                        <View style={style.view_musica_nome}>
                            <Text style={style.text_musica_nome} numberOfLines={2} >{nomeMusicaAtual}</Text>
                        </View>
                        <View style={style.view_duracao}>
                            <Text style={style.text_progresso}>{(Math.floor(progress.position / 60))}:{progress.position % 60 < 9 ? ("0" + ((progress.position % 60).toFixed(0))) : (progress.position % 60).toFixed(0)}</Text>
                            <View style={style.progress_bar}>
                                <Progress.Bar progress={(progress.position / progress.duration)} color='#EDEDED' width={200} />
                            </View>
                            <Text style={style.text_progresso}>{(Math.floor(progress.duration / 60))}:{progress.duration % 60 < 9 ? ("0" + ((progress.duration % 60).toFixed(0))) : (progress.duration % 60).toFixed(0)}</Text>
                        </View>
                    </View>
                    <View style={style.view_bottom}>
                        <TouchableOpacity style={style.play_option} onPress={() => { PreviousMusic() }}>
                            <Image style={style.img_option} source={require('../../../contents/seta-para-a-esquerda.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.play_option} onPress={() => { SetMusicPlaying(!MusicPlaying), PlayStop() }}>
                            {MusicPlaying === true ?
                                (<Image style={style.img_option} source={require('../../../contents/play.png')} />) :
                                (<Image style={style.img_option} source={require('../../../contents/pause.png')} />)}
                        </TouchableOpacity>
                        <TouchableOpacity style={style.play_option} onPress={() => { NextMusic() }}>
                            <Image style={style.img_option} source={require('../../../contents/seta-para-a-direita.png')} />
                        </TouchableOpacity>
                    </View>
                    



                    <View style={{flexDirection:'row',marginTop:"5%"}}>
                        <View>
                            <Image style={{resizeMode:'center',width:90,height:40}} source={require('../../../contents/tracks.png')} />
                        </View>
                    <TouchableOpacity style={{}} onPress={() => {FuncReplay()}}>
                            {Replay == "NO" ? (<Image style={{resizeMode:'center',width:90,height:40}} source={require('../../../contents/replay_no.png')} />) :
                                Replay == "ALL" ? (
                                    <Image style={{resizeMode:'center',width:90,height:40}} source={require('../../../contents/replay_all.png')} />
                                ) : (
                                    <Image style={{resizeMode:'center',width:90,height:40}} source={require('../../../contents/replay_msc.png')} />
                                )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const style = StyleSheet.create({
    menu: {
        height: 50,
        backgroundColor: "#2F2F2F",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        margin: "5%",
        borderRadius: 12,
    },
    botao_player: {
        width: "30%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    botao_track: {
        marginLeft: "8%",
        width: "65%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

    },
    img: {
        width: "60%",
        height: "60%",
        resizeMode: 'contain'

    },
    view_musica: {
        width: "85%",
        justifyContent: "center",
        alignItems: "center",
    },
    nome_musica: {
        margin: 2,
        color: "#FFFFFF",
        fontSize: 15
    },
    img_musica: {
        left: 0,
        width: "40%",
        height: "80%",
        resizeMode: 'contain'
    },
    // MODAL--------------------
    modal_view: {
        flex: 0.9,
        borderRadius: 60,
        backgroundColor: "#202020",
        justifyContent: 'center',
        alignItems: "center"
    },
    scroll_view: {
        marginBottom: "25%",

    },
    scrollview: {
        width: "100%",
    },
    sair_view: {
        width: 50,
        height: 50,
        position: 'absolute',
        backgroundColor: "#282828",
        borderRadius: 50,
        top: "1%",
        start: "8%",
        alignItems: "flex-start",
        padding: 5,

    },
    sair_img: {
        width: "100%",
        height: "100%",
        resizeMode: "center"
    },
    view_top: {
        width: "60%",
        height: "12%",
        position: "absolute",
        top: "0%",
        justifyContent: "center",
        alignItems: "center"
    },
    top_text: {
        fontSize: 16,
        color: "#656565"
    },
    top_track: {
        fontSize: 16,
        color: "#FFFFFF"
    },
    view_meio: {
        marginTop: "10%",
        width: "80%",
        height: "55%",
        alignItems: "center"

    },
    view_thumb: {
        width: "110%",
        height: "60%",
    },
    img_thumb: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"

    },
    view_musica_nome: {
        width: "110%",
        height: "23%"
    },
    text_musica_nome: {
        color: "#FFFFFF",
        fontSize: 20
    },
    view_duracao: {
        width: "110%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: "3%",
    },
    text_progresso: {
        padding: 10,
        color: "#FFFFFF",
        fontSize: 18
    },
    view_bottom: {
        height: "10%",
        flexDirection: "row",
        width: "80%",
        justifyContent: "center",
    },

    play_option: {
        marginTop: "5%",
        width: "40%",
        height: "30%",
        justifyContent: "center"

    },
    img_option: {
        height: "250%",
        width: "100%",
        resizeMode: "center"
    },
})
