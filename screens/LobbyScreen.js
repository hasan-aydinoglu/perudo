import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LobbyScreen({ navigation, route }) {
  const { playerName } = route.params;

  const handleStartGame = () => {
    navigation.navigate('Game', { playerName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {playerName}!</Text>

      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#121212',
    paddingHorizontal:30,
  },
  title: {
    fontSize:28,
    color:'#f0e6c8',
    marginBottom:30,
  },
  button: {
    backgroundColor:'#8b6f2f',
    paddingVertical:14,
    paddingHorizontal:40,
    borderRadius:25,
  },
  buttonText: {
    color:'#f0e6c8',
    fontSize:18,
    fontWeight:'600',
  },
});
