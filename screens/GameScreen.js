import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';

const players = [
  { id: 1, name: 'Alice', avatar: { uri: 'https://i.pravatar.cc/100?img=1' } },
  { id: 2, name: 'Bob', avatar: { uri: 'https://i.pravatar.cc/100?img=2' } },
  { id: 3, name: 'Eve', avatar: { uri: 'https://i.pravatar.cc/100?img=3' } },
];

export default function GameScreen() {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { name: players[currentPlayerIndex].name, text: newMessage }]);
      setNewMessage('');
    }
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <View style={styles.container}>
      {!chatVisible ? (
        <>
          <Text style={styles.title}>It's {currentPlayer.name}'s Turn</Text>
          <Image source={currentPlayer.avatar} style={styles.avatar} />
          <TouchableOpacity style={styles.button} onPress={handleNextPlayer}>
            <Text style={styles.buttonText}>Next Player</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatButton} onPress={() => setChatVisible(true)}>
            <Text style={styles.chatButtonText}>💬 Chat</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.chatTitle}>Game Chat</Text>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.message}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}:</Text> {item.text}
              </Text>
            )}
            style={styles.chatBox}
          />
          <View style={styles.inputRow}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={{ color: '#fff' }}>Send</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => setChatVisible(false)}>
            <Text style={styles.backButtonText}>⬅ Back to Game</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#EEEEEE',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00ADB5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  chatButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#393E46',
    padding: 10,
    borderRadius: 30,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  chatTitle: {
    fontSize: 22,
    color: '#EEEEEE',
    marginBottom: 10,
  },
  chatBox: {
    width: '100%',
    maxHeight: '50%',
    backgroundColor: '#393E46',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  message: {
    color: '#EEEEEE',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00ADB5',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#EEEEEE',
    textDecorationLine: 'underline',
  },
});
