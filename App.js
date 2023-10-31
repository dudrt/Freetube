import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Routes from './src/routes'
import { MusicPlayerProvider } from './src/music_player/MusicPlayerContext';




export default function App() {
  return (
    <MusicPlayerProvider>
<NavigationContainer>
  <StatusBar backgroundColor="#484DFF" barStyle="dark-content"/>
  <Routes/>
</NavigationContainer>
</MusicPlayerProvider>
  );
}

