import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.navigate('Login'); // LoginScreen'e döner
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>🎵 Music</Text>
        <Switch value={isMusicOn} onValueChange={setIsMusicOn} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>🔊 Sound Effects</Text>
        <Switch value={isSoundOn} onValueChange={setIsSoundOn} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#f0f0f0',
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 60,
    backgroundColor: '#d63031',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});