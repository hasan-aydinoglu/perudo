import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
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

  const handleRollComplete = rollResults => {
    const counted = countDice(rollResults);
    setDiceData(prev => ({
      ...prev,
      [currentPlayerId]: { rollResults, counted },
    }));
    Alert.alert('Dice Rolled', `You rolled: ${rollResults.join(', ')}`);
  };

  const nextPlayer = () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayerId(players[nextIndex].id);
  };

  const placeBid = () => {
    setCurrentBid({ quantity: bidQuantity, face: bidFace, playerId: currentPlayerId });
    nextPlayer();
  };

  const callLiar = () => {
    Alert.alert('Liar Called!', 'Checking the bid...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <Text style={styles.tableText}>Perudo Game Table</Text>
      </View>

      {players.map((player, index) => {
        const isCurrent = player.id === currentPlayerId;
        const diceInfo = diceData[player.id];

        return (
          <View key={player.id} style={[styles.playerContainer, playerPositions[index]]}>
            <Image source={{ uri: player.avatar }} style={styles.avatar} />
            <Text style={[styles.playerName, isCurrent && styles.currentPlayer]}>
              {player.name} {isCurrent ? '(Your Turn)' : ''}
            </Text>

            {isCurrent && diceInfo && (
              <View style={styles.diceResults}>
                <Text style={styles.diceText}>Rolls: {diceInfo.rollResults.join(', ')}</Text>
                <Text style={styles.diceText}>
                  Counts: {Object.entries(diceInfo.counted)
                    .filter(([_, count]) => count > 0)
                    .map(([num, count]) => `${num} x${count}`)}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.diceRoller}>
        <AnimatedDiceRoll
          disabled={currentPlayerId !== players[0].id}
          onRollComplete={handleRollComplete}
        />
      </View>

      {currentPlayerId === players[0].id && (
        <View style={styles.bidArea}>
          <Text style={styles.bidText}>Place Your Bid</Text>
          <Picker
            selectedValue={bidQuantity}
            style={styles.picker}
            onValueChange={(itemValue) => setBidQuantity(itemValue)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>

          <Picker
            selectedValue={bidFace}
            style={styles.picker}
            onValueChange={(itemValue) => setBidFace(itemValue)}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.placeBidButton} onPress={placeBid}>
            <Text style={styles.buttonText}>Place Bid</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentBid && currentPlayerId !== currentBid.playerId && (
        <TouchableOpacity style={styles.liarButton} onPress={callLiar}>
          <Text style={styles.buttonText}>Liar!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const playerPositions = [
  { top: 20, left: '45%' },
  { top: '40%', right: 20 },
  { bottom: 80, right: 40 },
  { bottom: 80, left: 40 },
  { top: '40%', left: 20 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c2b3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#145374',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 0,
  },
  tableText: {
    color: '#e0f7fa',
    fontWeight: 'bold',
    fontSize: 22,
  },
  playerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
    maxWidth: 120,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 6,
  },
  playerName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  currentPlayer: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  diceResults: {
    marginTop: 6,
    alignItems: 'center',
  },
  diceText: {
    color: '#e0f7fa',
    fontSize: 12,
  },
  diceRoller: {
    position: 'absolute',
    top: 50,
  },
  bidArea: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
  },
  bidText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: 150,
    color: '#fff',
    backgroundColor: '#2c3e50',
    marginVertical: 5,
  },
  placeBidButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  liarButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
