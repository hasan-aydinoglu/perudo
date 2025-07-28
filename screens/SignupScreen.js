// SignupScreen.js (Pirate-style Signup with background image)
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Hesap oluşturma işlemleri
    navigation.navigate('Lobby');
  };

  return (
    <ImageBackground
      source={require('../assets/dice/signup.png')}
      style={styles.background}
    >
      <View style={styles.containerWrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#c4a87b"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#c4a87b"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#c4a87b"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  containerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 260
  },
  container: {
    width: '85%',
    padding: 20,
    backgroundColor: 'rgba(77, 51, 25, 0.85)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#a97c50',
    alignItems: 'center'
  },
  title: {
    fontSize: 36,
    color: '#e0c38c',
    fontWeight: 'bold',
    marginBottom: 30
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#2c1a0f',
    borderColor: '#a97c50',
    borderWidth: 2,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#4a2e13',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#c9a367',
    borderWidth: 2
  },
  buttonText: {
    color: '#f5e1b3',
    fontSize: 18,
    fontWeight: 'bold'
  },
  linkText: {
    color: '#e0c38c',
    fontSize: 16,
    textDecorationLine: 'underline'
  }
});
