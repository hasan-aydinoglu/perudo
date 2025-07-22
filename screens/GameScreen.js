import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import ChatBox from '../components/ChatBox';

const players = [
  { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 4, name: 'Diana', avatar: 'https://i.pravatar.cc/100?img=4' },
];

const rollDice = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);

export default function GameScreen({ navigation }) {
  const [diceData, setDiceData] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(players[0].id);
  const [currentBid, setCurrentBid] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const rollDiceForCurrentPlayer = () => {
    const result = rollDice();
    setDiceData(prev => ({ ...prev, [currentPlayerId]: result }));
    Alert.alert('Dice Rolled', `You rolled: ${result.join(', ')}`);
  };

  const submitBid = () => {
    const quantity = Math.floor(Math.random() * 5) + 1;
    const face = Math.floor(Math.random() * 6) + 1;
    setCurrentBid({ quantity, face, playerId: currentPlayerId });
    nextPlayer();
  };

  const callLiar = () => {
    if (!currentBid) return;
    const total = Object.values(diceData)
      .flat()
      .filter(d => d === currentBid.face).length;
    const bidder = players.find(p => p.id === currentBid.playerId);
    const caller = players.find(p => p.id === currentPlayerId);

    Alert.alert(
      'Liar Called!',
      total >= currentBid.quantity
        ? `${caller.name} was wrong! ${bidder.name}'s bid is valid.`
        : `${caller.name} was right! ${bidder.name}'s bid was a lie.`
    );
  };

  const nextPlayer = () => {
    const index = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (index + 1) % players.length;
    setCurrentPlayerId(players[nextIndex].id);
  };

  const renderDice = (playerId) => {
    const dice = diceData[playerId] || [];
    return (
      <View style={styles.diceRow}>
        {dice.map((d, i) => (
          <View key={i} style={styles.dice}>
            <Text style={styles.diceText}>{d}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
    >
      <TouchableOpacity style={styles.chatButton} onPress={() => setShowChat(!showChat)}>
        <Text style={styles.chatText}>💬</Text>
      </TouchableOpacity>

      {showChat && <ChatBox />}

      <View style={styles.table}>
        {players.map((player, i) => (
          <View key={player.id} style={[styles.playerContainer, positions[i]]}>
            <Image source={{ uri: player.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{player.name}</Text>
            {currentPlayerId === player.id && renderDice(player.id)}
          </View>
        ))}

        {currentBid && (
          <View style={styles.bidBox}>
            <Text style={styles.bidText}>
              Bid: {currentBid.quantity} of {currentBid.face}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        {currentPlayerId === players[0].id && (
          <>
            <TouchableOpacity onPress={rollDiceForCurrentPlayer} style={styles.button}>
              <Text style={styles.buttonText}>Roll Dice</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submitBid} style={styles.button}>
              <Text style={styles.buttonText}>Submit Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={callLiar} style={styles.button}>
              <Text style={styles.buttonText}>Liar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navText}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.navText}>🎮</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const positions = [
  { top: 10, left: '40%' },
  { top: '40%', right: 10 },
  { bottom: 50, right: 30 },
  { top: '40%', left: 10 },
];

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    height: '70%',
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
    borderColor: 'gold',
    borderWidth: 2,
  },
  name: {
    color: '#fff',
    marginTop: 5,
  },
  diceRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  dice: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  diceText: {
    fontWeight: 'bold',
  },
  bidBox: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 10,
  },
  bidText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttons: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0a3d62',
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
  },
  chatText: {
    fontSize: 24,
    color: '#fff',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 20,
    color: '#fff',
  },
});