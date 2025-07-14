import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [playerName, setPlayerName] = useState('');

  const handleGoToLobby = () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    navigation.navigate('Lobby', { playerName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor="#aaa"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <TouchableOpacity style={styles.button} onPress={handleGoToLobby}>
        <Text style={styles.buttonText}>Go to Lobby</Text>
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
    marginBottom:20,
  },
  input: {
    width:'100%',
    height:50,
    backgroundColor:'#222',
    borderRadius:10,
    paddingHorizontal:15,
    fontSize:18,
    color:'#fff',
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
