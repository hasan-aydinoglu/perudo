import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    // Burada login işlemini yapacağız
    Alert.alert('Success', `Welcome ${email}!`);
    navigation.replace('Home'); // Login başarılıysa Home sayfasına geç
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login not implemented yet.');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login not implemented yet.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
          onPress={handleFacebookLogin}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
            }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: '#db4437' }]}
          onPress={handleGoogleLogin}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
            }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    paddingHorizontal:30,
    backgroundColor:'#121212',
  },
  title: {
    fontSize:32,
    fontWeight:'bold',
    color:'#f0e6c8',
    marginBottom:40,
    alignSelf:'center',
  },
  input: {
    height:50,
    backgroundColor:'#222',
    borderRadius:10,
    paddingHorizontal:15,
    color:'#fff',
    marginBottom:20,
    fontSize:16,
  },
  loginButton: {
    backgroundColor:'#8b6f2f',
    paddingVertical:15,
    borderRadius:25,
    alignItems:'center',
    marginTop:10,
  },
  loginButtonText: {
    color:'#f0e6c8',
    fontSize:18,
    fontWeight:'600',
  },
  orText: {
    textAlign:'center',
    color:'#888',
    marginVertical:15,
    fontSize:16,
  },
  socialButtonsContainer: {
    flexDirection:'row',
    justifyContent:'space-around',
  },
  socialButton: {
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:25,
  },
  socialIcon: {
    width:24,
    height:24,
    marginRight:10,
  },
  socialButtonText: {
    color:'#fff',
    fontWeight:'600',
    fontSize:16,
  },
});
