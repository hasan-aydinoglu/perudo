// LoginScreen.js (Pirate-style Sign In with redirect to LobbyScreen)
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const handleSignIn = () => {
    navigation.navigate('Lobby');
  };

  return (
    <ImageBackground
      source={require('../assets/dice/loby.png')}
      style={styles.background}
    >
      <View style={styles.containerWrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign In</Text>

          <TextInput placeholder="Email" placeholderTextColor="#c4a87b" style={styles.input} />
          <TextInput placeholder="Password" placeholderTextColor="#c4a87b" secureTextEntry style={styles.input} />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#db4437' }]}>
            <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.linkText}>Don’t have an account?</Text>
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
    marginTop: 350 // yukarı alındı, çenenin altına
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
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center'
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  icon: {
    marginRight: 10
  },
  linkText: {
    color: '#e0c38c',
    fontSize: 16,
    textDecorationLine: 'underline'
  }
});