// SettingsScreen.js - Gelişmiş Ayarlar Sayfası (Siyah Arka Plan)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Switch,
  TouchableOpacity, TextInput, ScrollView, Alert
} from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [username, setUsername] = useState('Captain Jack');
  const [email, setEmail] = useState('jack@piratebay.com');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Pirate');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.header}>⚙️ Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>👤 Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

        <Text style={styles.label}>📧 Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>🔊 Game Sound</Text>
        <Switch value={isSoundOn} onValueChange={setIsSoundOn} />

        <Text style={styles.label}>🎵 Music</Text>
        <Switch value={isMusicOn} onValueChange={setIsMusicOn} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>🎨 Theme</Text>
        <Text style={styles.button} onPress={() => setSelectedTheme('Pirate')}>🏴‍☠️ Pirate</Text>
        <Text style={styles.button} onPress={() => setSelectedTheme('Classic')}>🌊 Classic</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>🌐 Language</Text>
        <Text style={styles.button} onPress={() => setSelectedLanguage('English')}>🇬🇧 English</Text>
        <Text style={styles.button} onPress={() => setSelectedLanguage('Türkçe')}>🇹🇷 Türkçe</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>📱 App Version</Text>
        <Text style={styles.info}>v1.0.0</Text>

        <Text style={styles.label}>📨 Contact</Text>
        <Text style={styles.info}>support@perudoapp.com</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Log Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gold',
    alignSelf: 'center',
    marginVertical: 20,
    textShadowColor: '#333',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'rgba(30,30,30,0.9)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'gold',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    color: '#00ffff',
    paddingVertical: 5,
    fontSize: 16,
  },
  info: {
    color: '#ccc',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});