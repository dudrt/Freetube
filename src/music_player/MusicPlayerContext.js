import React, { createContext, useContext, useState, useEffect } from 'react';
import TrackPlayer, { State, useProgress, Event, Capability, RepeatMode } from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';





const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {

  const [playing, SetPlaying] = useState(false)
  const [nomeMusicaAtual, SetNomeMusica] = useState("")
  const [TrackElements, SetTrackElements] = useState([])
  const [Playlist, setPlaylist] = useState("")
  const [PlaylistAtual, setPlaylistAtual] = useState("")
  const [MenuTelaInicial, setTelaInicial] = useState(true)
  const [Replay, setReplay] = useState("NO")


  useEffect(() => {
    global.id = 0
    // return () => {
    //   try { TrackPlayer.reset() } catch(e){};
    // };
  }, []);


  // TrackPlayer.addEventListener('playback-state', async (data) => {
  //   if (data.state === TrackPlayer.STATE_PLAYING) {
  //     // A música começou a tocar
  //     console.log('A música começou a tocar');
  //     // Faça o que você precisa fazer quando uma música começa a tocar
  //   } else if (data.state === TrackPlayer.STATE_STOPPED) {
  //     // A música terminou de tocar
  //     console.log('A música terminou de tocar');
  //     // Faça o que você precisa fazer quando uma música termina de tocar
  //   }
  // });
  // TrackPlayer.addEventListener('playback-track-changed', async (data) => {
  //   data.position
  //   const tracks = await TrackPlayer.getQueue();
  //   SetNomeMusica(tracks[data.position].title)
  //   console.log(data)

  //   console.log(tracks)
  // });


  const PlayPlaylist = async (posicao) => {
    await TrackPlayer.reset()
    setPlaylistAtual(Playlist)
    var musicas = await AsyncStorage.getItem(Playlist);
    musicas = musicas.split("&¨%#]")
    for (var i = 0; i < musicas.length; i++) {
      var file_name = musicas[i].replace(/[^a-zA-Z0-9.\-@/._]/g, "");
      var suporte = file_name.split(" ");
      file_name = suporte[0];
      for (var j = 1; j < suporte.length; j++) {
        file_name += "_" + suporte[j];
      }
      file_name += ".mp3";
      console.log(file_name)
      await TrackPlayer.add({
        artist:"",
        artwork: "file:///data/user/0/com.freetube/files/" + musicas[i].replace(/[^a-zA-Z0-9.\-@/._]/g, "").replace(" ", "_") + ".jpg",
        url: 'file:///data/user/0/com.freetube/files/' + file_name,
        title: musicas[i],
        duration: 0,

      }).then(() => {
        if (playing == false) {
          SetPlaying(true)
          IniciarNotifi()
        }
      })
    }
    const track = await TrackPlayer.getQueue()
    SetTrackElements(track)
    console.log(TrackElements)
    await TrackPlayer.skip(posicao)
    TrackPlayer.play()

  }

  const FuncReplay = async () => {
    if (Replay == "NO") {
      setReplay("ALL")
      await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    } else if (Replay == "ALL") {
      setReplay("MSC")
      await TrackPlayer.setRepeatMode(RepeatMode.Track)

    } else {
      setReplay("NO")
      await TrackPlayer.setRepeatMode(RepeatMode.Off)
    }
  }




    

  const IniciarNotifi = async () => {
   





    // TrackPlayer.updateOptions({
    //   // Media controls capabilities
    //   capabilities: [
    //       // Capability.Play,
    //       // Capability.Pause,
    //       // Capability.SkipToNext,
    //       // Capability.SkipToPrevious,
    //       // Capability.Stop,
    //   ],
  
    //   // Capabilities that will show up when the notification is in the compact form on Android
    //   compactCapabilities: [],
    //   })


    
  }
  componentWillUnmount = async () => {
    AppState.removeEventListener('change', this._handleStateChange);
    await TrackPlayer.reset();
    await TrackPlayer.stop();
  };


  // const RepMusica = async (position) => {
  //   var musicas = await AsyncStorage.getItem('nome_musica');
  //   musicas = musicas.split("&¨%#]")
  //   var nome_musica = musicas[position]
  //   var file_name = nome_musica.replaceAll(/[^a-zA-Z0-9.\-@/._]/g, "");
  //   var suporte = file_name.split(" ");
  //   file_name = suporte[0];
  //   for (var i = 1; i < suporte.length; i++) {
  //     file_name += "_" + suporte[i];
  //   }
  //   file_name += ".mp3";

  //   await TrackPlayer.add({
  //     title: musicas[position],
  //     url: 'file:///data/user/0/com.freetube/files/' + file_name,

  //   }).then(() => {
  //     console.log('Nova música adicionada à lista de reprodução com sucesso.' + id);
  //     SetPlaying(true)
  //     var array = TrackElements
  //     array.push(musicas[position])
  //     SetTrackElements(array)
  //     console.log(TrackElements)
  //   })
  //     .catch((error) => {
  //       console.error('Erro ao adicionar nova música à lista de reprodução:', error);
  //     });
  //   global.id += 1

  //   const state = await TrackPlayer.getState();
  //   if (state !== State.Playing) {
  //     TrackPlayer.play()
  //   }

  // }














  const PlayStop = async () => {
        
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      TrackPlayer.pause()
    } else {
      TrackPlayer.play()
    }
  };

  const start = async () => {

    TrackPlayer.setupPlayer().then(() => {
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (data) => {
          // A música atual terminou de tocar
          SetPlaying(false)
      });
      TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {


        if (data.nextTrack === null) {
          console.log('A música terminou de tocar:', data.track);
          
        } else {
          console.log(data.position)
          let trackIndex = await TrackPlayer.getCurrentTrack();
          let trackObject = await TrackPlayer.getTrack(trackIndex);
          console.log(trackObject.title)
          SetNomeMusica(trackObject.title)

        }
      });
    });
  }


  const RemoveTrack = async (index) => {
    //TrackPlayer.remove(index)
    var tracks = await TrackPlayer.getQueue();
    console.log(tracks)
    TrackPlayer.remove([index])
    var array = TrackElements
    array.splice(index, 1)
    SetTrackElements(array)
    console.log(TrackElements)
    tracks = await TrackPlayer.getQueue();
    console.log(tracks)
  }

  const PreviousMusic = async () => {
    try {
      await TrackPlayer.skipToPrevious()
    } catch {
      //Inicia a musica novamente
    }
  }

  const NextMusic = async () => {
    try {
      await TrackPlayer.skipToNext()
    } catch {
      console.log("tentando")
    }
  }



  // TrackPlayer.updateOptions({
  //   // Media controls capabilities

  //   capabilities: [
  //       Capability.Play,
  //       Capability.Pause,
  //       Capability.SkipToNext,
  //       Capability.SkipToPrevious,
  //       Capability.Stop,
  //   ],

  //   // Capabilities that will show up when the notification is in the compact form on Android
  //   compactCapabilities: [Capability.Play, Capability.Pause,Capability.SkipToNext,
  //     Capability.SkipToPrevious,],


  // });




  return (
    <MusicPlayerContext.Provider value={{
      start,
      PlayStop,
      playing,
      nomeMusicaAtual,
      TrackElements,
      RemoveTrack,
      setPlaylist,
      Playlist,
      PlayPlaylist,
      PlaylistAtual,
      PreviousMusic,
      NextMusic,
      MenuTelaInicial,
      setTelaInicial,
      Replay,
      FuncReplay
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};
