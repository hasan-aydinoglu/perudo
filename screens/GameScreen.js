import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ImageBackground,
} from 'react-native';

const players = [
  { id: 1, name: 'Alice', avatar: require('../assets/avatar1.png') },
  { id: 2, name: 'Bob', avatar: require('../assets/avatar2.png') },
  { id: 3, name: 'Eve', avatar: require('../assets/avatar3.png') },
];

function rollFiveDice() {
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }
  return results;
}

function countDice(results) {
  const counts = {};
  for (let i = 1; i <= 6; i++) counts[i] = 0;
  results.forEach(num => {
    counts[num]++;
  });
  return counts;
}

function checkBidValidity(bid, allDice) {
  let total = 0;
  Object.values(allDice).forEach(arr => {
    arr.forEach(d => {
      if (d === bid.face) total++;
    });
  });
  return total >= bid.quantity;
}

export default function GameScreen() {
  const [diceData, setDiceData] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(players[0].id);
  const [currentBid, setCurrentBid] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidQuantity, setBidQuantity] = useState('');
  const [bidFace, setBidFace] = useState('');
  const [showChat, setShowChat] = useState(false);

  const rollDice = () => {
    const result = rollFiveDice();
    setDiceData(prev => ({
      ...prev,
      [currentPlayerId]: result,
    }));
    Alert.alert('Dice Rolled', `You rolled: ${result.join(', ')}`);
  };

  const nextPlayer = () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayerId(players[nextIndex].id);
  };

  const submitBid = () => {
    if (!bidQuantity || !bidFace) return;
    setCurrentBid({
      quantity: parseInt(bidQuantity),
      face: parseInt(bidFace),
      playerId: currentPlayerId,
    });
    setShowBidModal(false);
    nextPlayer();
  };

  const callLiar = () => {
    if (!currentBid) return;
    const isValid = checkBidValidity(currentBid, diceData);
    const bidder = players.find(p => p.id === currentBid.playerId);
    const caller = players.find(p => p.id === currentPlayerId);

    Alert.alert(
      'Liar Called!',
      isValid
        ? `${caller.name} was wrong! ${bidder.name}'s bid is valid.`
        : `${caller.name} was right! ${bidder.name}'s bid was a lie.`
    );

    // Yeni tur başlat
    setCurrentBid(null);
    setDiceData({});
    setCurrentPlayerId(players[0].id);
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
    >
      <TouchableOpacity style={styles.chatButton} onPress={() => setShowChat(!showChat)}>
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>

      <View style={styles.table}>
        {currentBid && (
          <Text style={styles.currentBid}>
            {players.find(p => p.id === currentBid.playerId).name} bids {currentBid.quantity} × {currentBid.face}
          </Text>
        )}
      </View>

      <View style={styles.playerRow}>
        {players.map(player => (
          <View key={player.id} style={styles.playerBox}>
            <Image source={player.avatar} style={styles.avatar} />
            <Text style={[
              styles.playerName,
              currentPlayerId === player.id && styles.currentTurn
            ]}>
              {player.name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={rollDice}>
          <Text style={styles.buttonText}>🎲 Roll Dice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowBidModal(true)}>
          <Text style={styles.buttonText}>📣 Bid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={callLiar}>
          <Text style={styles.buttonText}>❗ Liar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showBidModal} transparent>
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Place Your Bid</Text>
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={bidQuantity}
              onChangeText={setBidQuantity}
              style={styles.input}
            />
            <TextInput
              placeholder="Dice Face (1-6)"
              keyboardType="numeric"
              value={bidFace}
              onChangeText={setBidFace}
              style={styles.input}
            />
            <TouchableOpacity onPress={submitBid} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  chatButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ffffffaa',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  chatButtonText: {
    fontSize: 18,
  },
  table: {
    marginTop: 100,
    backgroundColor: '#ffffffcc',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  currentBid: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 60,
  },
  playerBox: {
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  playerName: {
    color: '#333',
  },
  currentTurn: {
    color: '#0077cc',
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#3399ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#3399ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});