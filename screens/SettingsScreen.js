// SettingsScreen.js - Gelişmiş Ayarlar Sayfası (Siyah Arka Planlı)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, Switch,
  TouchableOpacity, TextInput, ScrollView, Alert, ImageBackground
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
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.header}>⚙️ Settings</Text>

        {/* Kullanıcı Bilgileri */}
        <View style={styles.section}>
          <Text style={styles.label}>👤 Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} />

          <Text style={styles.label}>📧 Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        </View>

        {/* Ses Ayarları */}
        <View style={styles.section}>
          <Text style={styles.label}>🔊 Game Sound</Text>
          <Switch value={isSoundOn} onValueChange={setIsSoundOn} />

          <Text style={styles.label}>🎵 Music</Text>
          <Switch value={isMusicOn} onValueChange={setIsMusicOn} />
        </View>

        {/* Tema Seçimi */}
        <View style={styles.section}>
          <Text style={styles.label}>🎨 Theme</Text>
          <Text style={styles.button} onPress={() => setSelectedTheme('Pirate')}>🏴‍☠️ Pirate</Text>
          <Text style={styles.button} onPress={() => setSelectedTheme('Classic')}>🌊 Classic</Text>
        </View>

        {/* Koyu Mod */}
        <View style={styles.section}>
          <Text style={styles.label}>🌙 Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        {/* Dil Seçimi */}
        <View style={styles.section}>
          <Text style={styles.label}>🌐 Language</Text>
          <Text style={styles.button} onPress={() => setSelectedLanguage('English')}>🇬🇧 English</Text>
          <Text style={styles.button} onPress={() => setSelectedLanguage('Türkçe')}>🇹🇷 Türkçe</Text>
        </View>

        {/* Hakkında & Destek */}
        <View style={styles.section}>
          <Text style={styles.label}>📱 App Version</Text>
          <Text style={styles.info}>v1.0.0</Text>

          <Text style={styles.label}>📨 Contact</Text>
          <Text style={styles.info}>support@perudoapp.com</Text>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gold',
    alignSelf: 'center',
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
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
  },
  info: {
    color: '#fff',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});