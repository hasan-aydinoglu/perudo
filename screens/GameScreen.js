import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
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
  const [diceData, setDiceData] = useState({}); // { playerId: { rollResults:[], counted:{} } }
  const [currentPlayerId, setCurrentPlayerId] = useState(players[0].id);

  const handleRollComplete = (rollResults) => {
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

            {diceInfo && (
              <View style={styles.diceResults}>
                {isCurrent ? (
                  <>
                    <Text style={styles.diceText}>Rolls: {diceInfo.rollResults.join(', ')}</Text>
                    <Text style={styles.diceText}>
                      Counts: {Object.entries(diceInfo.counted)
                        .filter(([num, count]) => count > 0)
                        .map(([num, count]) => `${num} x${count}`)
                        .join(', ')}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.diceText}>
                    Counts: {Object.entries(diceInfo.counted)
                      .filter(([num, count]) => count > 0)
                      .map(([num, count]) => `${num} x${count}`)
                      .join(', ')}
                  </Text>
                )}
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

      {currentPlayerId !== players[0].id && (
        <TouchableOpacity style={styles.buttonNext} onPress={nextPlayer}>
          <Text style={styles.buttonText}>Next Player</Text>
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
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#8b6f2f',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 0,
  },
  tableText: {
    color: '#f0e6c8',
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
    borderColor: '#f0e6c8',
    marginBottom: 6,
  },
  playerName: {
    color: '#f0e6c8',
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
    color: '#f0e6c8',
    fontSize: 12,
  },
  diceRoller: {
    position: 'absolute',
    bottom: 100,
  },
  buttonNext: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#444',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#f0e6c8',
    fontSize: 18,
    fontWeight: '600',
  },
});
