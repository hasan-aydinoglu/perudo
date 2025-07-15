import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AnimatedDiceRoll from '../components/AnimatedDiceRoll';

const players = [
  { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 4, name: 'Diana', avatar: 'https://i.pravatar.cc/100?img=4' },
  { id: 5, name: 'Eve', avatar: 'https://i.pravatar.cc/100?img=5' },
];

function countDice(results) {
  const counts = {};
  for (let i = 1; i <= 6; i++) counts[i] = 0;
  results.forEach(num => {
    counts[num]++;
  });
  return counts;
}

export default function GameScreen() {
  const [diceData, setDiceData] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(players[0].id);
  const [currentBid, setCurrentBid] = useState(null);
  const [bidQuantity, setBidQuantity] = useState(1);
  const [bidFace, setBidFace] = useState(1);

  const handleRollComplete = (rollResults) => {
    const counted = countDice(rollResults);
    setDiceData(prev => ({
      ...prev,
      [currentPlayerId]: { rollResults, counted },
    }));
  };

  const placeBid = () => {
    setCurrentBid({ quantity: bidQuantity, face: bidFace, player: players.find(p => p.id === currentPlayerId).name });
    nextPlayer();
  };

  const nextPlayer = () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayerId(players[nextIndex].id);
  };

  const callLiar = () => {
    let totalCount = 0;
    Object.values(diceData).forEach(data => {
      if (data) totalCount += data.rollResults.filter(num => num === currentBid.face).length;
    });

    if (totalCount >= currentBid.quantity) {
      Alert.alert("Result", `${currentBid.player}'s bid was correct! Liar loses.`);
    } else {
      Alert.alert("Result", `${currentBid.player}'s bid was false! ${currentBid.player} loses.`);
    }

    // reset game state
    setCurrentBid(null);
    setDiceData({});
    setCurrentPlayerId(players[0].id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perudo Table</Text>

      <AnimatedDiceRoll
        disabled={!currentPlayerId}
        onRollComplete={handleRollComplete}
      />

      {currentBid && (
        <Text style={styles.bidText}>
          Current Bid: {currentBid.quantity} x {currentBid.face} (by {currentBid.player})
        </Text>
      )}

      {currentPlayerId === players[0].id && (
        <View style={styles.bidArea}>
          <Text style={styles.label}>Quantity:</Text>
          <Picker
            selectedValue={bidQuantity}
            style={styles.picker}
            onValueChange={(itemValue) => setBidQuantity(itemValue)}>
            {[1,2,3,4,5,6,7,8].map(num => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>

          <Text style={styles.label}>Face:</Text>
          <Picker
            selectedValue={bidFace}
            style={styles.picker}
            onValueChange={(itemValue) => setBidFace(itemValue)}>
            {[1,2,3,4,5,6].map(num => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.button} onPress={placeBid}>
            <Text style={styles.buttonText}>Place Bid</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.liarButton} onPress={callLiar}>
            <Text style={styles.buttonText}>Liar!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#005f73', paddingTop: 50, alignItems: 'center' },
  title: { fontSize: 26, color: '#ffdd99', marginBottom: 20, fontWeight: 'bold' },
  bidText: { fontSize: 18, color: '#fff', marginVertical: 20 },
  bidArea: { marginTop: 20, alignItems: 'center' },
  label: { fontSize: 16, color: '#fff', marginTop: 10 },
  picker: { width: 100, color: '#fff', backgroundColor: '#003845', marginVertical: 5 },
  button: { backgroundColor: '#ffd166', padding: 10, borderRadius: 10, marginTop: 10 },
  liarButton: { backgroundColor: '#ef476f', padding: 10, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#003845', fontWeight: 'bold' },
});
