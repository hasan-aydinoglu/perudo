import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';

const diceImages = {
  1: require('../assets/dice1.png'),
  2: require('../assets/dice2.png'),
  3: require('../assets/dice3.png'),
  4: require('../assets/dice4.png'),
  5: require('../assets/dice5.png'),
  6: require('../assets/dice6.png'),
};

const players = [
  { id: 1, name: 'Alice', avatar: require('../assets/avatar1.png') },
  { id: 2, name: 'Bob', avatar: require('../assets/avatar2.png') },
  { id: 3, name: 'Eve', avatar: require('../assets/avatar3.png') },
];

export default function GameScreen() {
  const [diceValues, setDiceValues] = useState(generateDice());
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidQuantity, setBidQuantity] = useState('');
  const [bidFace, setBidFace] = useState('');

  function generateDice() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
  }

  function rollDice() {
    setDiceValues(generateDice());
  }

  function submitBid() {
    console.log(`Bid: ${bidQuantity} x Face ${bidFace}`);
    setBidModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perudo Game</Text>

      <View style={styles.table}>
        {players.map((player, index) => (
          <View key={player.id} style={[styles.playerContainer, getPlayerPosition(index)]}>
            <Image source={player.avatar} style={styles.avatar} />
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.diceRow}>
        {diceValues.map((d, i) => (
          <Image key={i} source={diceImages[d]} style={styles.dice} />
        ))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.bidButton} onPress={() => setBidModalVisible(true)}>
          <Text style={styles.buttonText}>Bid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.liarButton} onPress={() => alert('Liar called!')}>
          <Text style={styles.buttonText}>Liar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rollButton} onPress={rollDice}>
          <Text style={styles.buttonText}>Roll Dice</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={bidModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Place your Bid</Text>
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={bidQuantity}
              onChangeText={setBidQuantity}
              style={styles.input}
            />
            <TextInput
              placeholder="Face (1-6)"
              keyboardType="numeric"
              value={bidFace}
              onChangeText={setBidFace}
              style={styles.input}
            />
            <TouchableOpacity style={styles.modalButton} onPress={submitBid}>
              <Text style={styles.buttonText}>Submit Bid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getPlayerPosition(index) {
  const positions = [
    { top: 10, left: '40%' },
    { top: '40%', right: 10 },
    { bottom: 10, left: '40%' },
  ];
  return positions[index % positions.length];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },
  table: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
  },
  diceRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dice: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  bidButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  liarButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  rollButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 15,
    fontSize: 16,
    padding: 8,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});
