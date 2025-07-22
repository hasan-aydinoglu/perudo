import React from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

export default function ChatBox({ messages, onSend }) {
  const [text, setText] = React.useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
        keyExtractor={(_, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    maxHeight: 300,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  message: {
    color: '#fff',
    marginVertical: 2,
  },
});