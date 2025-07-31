// GameScreen.js - Kazanan belirleme + alt menü görünürlüğü
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground,
  TouchableOpacity, Alert, Modal, TextInput, Pressable
} from 'react-native';
import ChatBox from '../components/ChatBox';
import * as ImagePicker from 'expo-image-picker';

const defaultAvatars = [
  'https://i.pravatar.cc/100?img=1',
  'https://i.pravatar.cc/100?img=2',
  'https://i.pravatar.cc/100?img=3',
  'https://i.pravatar.cc/100?img=4'
];

const rollDice = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);

const diceImages = {
  1: require('../assets/dice/dice1.png'),
  2: require('../assets/dice/dice2.png'),
  3: require('../assets/dice/dice3.png'),
  4: require('../assets/dice/dice4.png'),
  5: require('../assets/dice/dice5.png'),
  6: require('../assets/dice/dice6.png'),
};

const getDiceImage = (value) => diceImages[value];

export default function GameScreen({ navigation }) {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Alice', avatar: defaultAvatars[0], dice: rollDice(), isEliminated: false, lastMessage: '' },
    { id: 2, name: 'Bob', avatar: defaultAvatars[1], dice: rollDice(), isEliminated: false, lastMessage: '' },
    { id: 3, name: 'Charlie', avatar: defaultAvatars[2], dice: rollDice(), isEliminated: false, lastMessage: '' },
    { id: 4, name: 'Diana', avatar: defaultAvatars[3], dice: rollDice(), isEliminated: false, lastMessage: '' },
  ]);

  const [diceData, setDiceData] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(players[0].id);
  const [currentBid, setCurrentBid] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidQuantity, setBidQuantity] = useState('');
  const [bidFace, setBidFace] = useState('');
  const [winner, setWinner] = useState(null);

  const handleSendMessage = ({ senderId, text }) => {
    setMessages(prev => [...prev, { senderId, text }]);
    setPlayers(prevPlayers => prevPlayers.map(p =>
      p.id === senderId ? { ...p, lastMessage: text } : p
    ));
    setTimeout(() => {
      setPlayers(prevPlayers => prevPlayers.map(p =>
        p.id === senderId ? { ...p, lastMessage: '' } : p
      ));
    }, 3000);
  };

  const pickAvatar = async (playerId) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });
    if (!result.canceled) {
      const updated = players.map(p => p.id === playerId ? { ...p, avatar: result.assets[0].uri } : p);
      setPlayers(updated);
    }
  };

  const checkWinner = (updatedPlayers) => {
    const alivePlayers = updatedPlayers.filter(p => !p.isEliminated);
    if (alivePlayers.length === 1) {
      setWinner(alivePlayers[0]);
    }
  };

  const rollDiceForCurrentPlayer = () => {
    const result = rollDice();
    const updatedPlayers = players.map(p =>
      p.id === currentPlayerId
        ? { ...p, dice: result, isEliminated: result.length === 0 }
        : p
    );
    setPlayers(updatedPlayers);
    checkWinner(updatedPlayers);
    setDiceData(prev => ({ ...prev, [currentPlayerId]: result }));
    Alert.alert('Dice Rolled', `You rolled: ${result.join(', ')}`);
  };

  const submitBid = () => {
    const quantity = parseInt(bidQuantity);
    const face = parseInt(bidFace);
    if (!isNaN(quantity) && !isNaN(face) && face >= 1 && face <= 6) {
      setCurrentBid({ quantity, face, playerId: currentPlayerId });
      setBidModalVisible(false);
      setBidQuantity('');
      setBidFace('');
      nextPlayer();
    } else {
      Alert.alert('Invalid Input', 'Enter valid numbers. Face must be 1-6.');
    }
  };

  const callLiar = () => {
    if (!currentBid) return;
    const total = Object.values(diceData).flat().filter(d => d === currentBid.face).length;
    const bidder = players.find(p => p.id === currentBid.playerId);
    const caller = players.find(p => p.id === currentPlayerId);

    const wasLie = total < currentBid.quantity;
    let updatedPlayers = [...players];

    if (wasLie) {
      updatedPlayers = updatedPlayers.map(p =>
        p.id === bidder.id
          ? { ...p, dice: p.dice.slice(0, -1), isEliminated: p.dice.length - 1 === 0 }
          : p
      );
    } else {
      updatedPlayers = updatedPlayers.map(p =>
        p.id === caller.id
          ? { ...p, dice: p.dice.slice(0, -1), isEliminated: p.dice.length - 1 === 0 }
          : p
      );
    }

    setPlayers(updatedPlayers);
    checkWinner(updatedPlayers);
    setCurrentBid(null);
    nextPlayer();

    Alert.alert(
      'Liar Called!',
      wasLie
        ? `${caller.name} was right! ${bidder.name}'s bid was a lie.`
        : `${caller.name} was wrong! ${bidder.name}'s bid is valid.`
    );
  };

  const nextPlayer = () => {
    const total = players.length;
    let nextIndex = players.findIndex(p => p.id === currentPlayerId);
    do {
      nextIndex = (nextIndex + 1) % total;
    } while (players[nextIndex].isEliminated && players.some(p => !p.isEliminated));
    setCurrentPlayerId(players[nextIndex].id);
  };

  const renderDice = (playerId) => {
    const player = players.find(p => p.id === playerId);
    const dice = player?.dice || [];
    return (
      <View style={styles.diceRow}>
        {dice.map((d, i) => (
          <Image key={i} source={getDiceImage(d)} style={styles.diceImage} />
        ))}
      </View>
    );
  };

  const avatarPositions = [
    { top: 30, left: '43%' },
    { top: '33%', right: 20 },
    { bottom: 150, right: 30 },
    { top: '33%', left: 20 },
  ];

  return (
    <ImageBackground source={require('../assets/dice/bg_map.png')} style={styles.background}>
      <TouchableOpacity style={styles.chatButton} onPress={() => setShowChat(!showChat)}>
        <Text style={styles.chatText}>💬</Text>
      </TouchableOpacity>

      {showChat && (
        <ChatBox
          messages={messages}
          onSend={handleSendMessage}
          currentPlayerId={currentPlayerId}
        />
      )}

      <View style={styles.table}>
        <Image source={require('../assets/dice/dice-cup.png')} style={styles.cup} />

        {winner && (
          <View style={styles.winnerBox}>
            <Text style={styles.winnerText}>🏆 Winner: {winner.name} 🏆</Text>
          </View>
        )}

        {currentPlayerId === players[0].id && !players[0].isEliminated && !winner && (
          <>
            <TouchableOpacity style={styles.bgBidArea} onPress={() => setBidModalVisible(true)}>
              <Text style={styles.actionText}>🎲 Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bgLiarArea} onPress={callLiar}>
              <Text style={styles.actionText}>❌ Liar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rollDiceButton} onPress={rollDiceForCurrentPlayer}>
              <Text style={styles.rollDiceText}>Roll Dice</Text>
            </TouchableOpacity>
          </>
        )}

        {players.map((player, i) => (
          <View key={player.id} style={[styles.playerContainer, avatarPositions[i]]}>
            <TouchableOpacity onPress={() => pickAvatar(player.id)}>
              <Image
                source={{ uri: player.avatar }}
                style={[styles.avatar, player.isEliminated && { tintColor: 'gray', opacity: 0.5 }]}
              />
            </TouchableOpacity>
            <Text style={styles.name}>{player.name}</Text>
            {player.lastMessage !== '' && (
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{player.lastMessage}</Text>
              </View>
            )}
            {currentPlayerId === player.id && !player.isEliminated && renderDice(player.id)}
          </View>
        ))}

        {currentBid && (
          <View style={styles.bidBox}>
            <Text style={styles.bidText}>Bid: {currentBid.quantity} of {currentBid.face}</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>👤</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Game')}><Text style={styles.navText}>🎮</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}><Text style={styles.navText}>⚙️</Text></TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  table: { width: '100%', height: '70%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  playerContainer: { position: 'absolute', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#ffcc00' },
  name: { color: '#fff', marginTop: 4, fontWeight: 'bold' },
  diceRow: { flexDirection: 'row', marginTop: 5 },
  diceImage: { width: 32, height: 32, margin: 2 },
  cup: { width: 60, height: 60, position: 'absolute', top: '45%', zIndex: 1 },
  bidBox: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 10, top: '48%' },
  bidText: { fontSize: 16, fontWeight: 'bold' },
  chatButton: { position: 'absolute', top: 40, right: 20, zIndex: 999 },
  chatText: { fontSize: 24, color: '#fff' },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: -25,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 }
  },
  messageText: { color: '#000', fontSize: 12, fontWeight: '600' },
  winnerBox: {
    position: 'absolute',
    top: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    zIndex: 999
  },
  winnerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
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
    zIndex: 999
  },
  navButton: { padding: 10 },
  navText: { fontSize: 20, color: '#fff' },
  bgBidArea: {
    position: 'absolute',
    bottom: 60,
    left: '8%',
    width: 90,
    height: 45,
    backgroundColor: 'rgba(0,255,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10
  },
  bgLiarArea: {
    position: 'absolute',
    bottom: 60,
    right: '8%',
    width: 90,
    height: 45,
    backgroundColor: 'rgba(255,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10
  },
  rollDiceButton: {
    position: 'absolute',
    bottom: 60,
    left: '50%',
    transform: [{ translateX: -45 }],
    width: 90,
    height: 45,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 10
  },
  rollDiceText: { fontWeight: 'bold', color: '#000' },
  actionText: { fontWeight: 'bold', color: '#fff' }
});