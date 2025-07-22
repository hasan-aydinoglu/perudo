import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=8' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Hasan Aydın</Text>
      <Text style={styles.email}>hasan@example.com</Text>
      <View style={styles.stats}>
        <Text>Total Games: 42</Text>
        <Text>Wins: 18</Text>
        <Text>Win Rate: 43%</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#f0e6c8',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  email: {
    color: '#ccc',
    marginBottom: 20,
  },
  stats: {
    marginBottom: 30,
    alignItems: 'center',
    gap: 4,
  },
  button: {
    backgroundColor: '#8b6f2f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});