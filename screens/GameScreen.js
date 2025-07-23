import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
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
    { id: 1, name: 'Alice', avatar: defaultAvatars[0] },
    { id: 2, name: 'Bob', avatar: defaultAvatars[1] },
    { id: 3, name: 'Charlie', avatar: defaultAvatars[2] },
    { id: 4, name: 'Diana', avatar: defaultAvatars[3] },
  ]);
  const [diceData, setDiceData] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(players[0].id);
  const [currentBid, setCurrentBid] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidQuantity, setBidQuantity] = useState('');
  const [bidFace, setBidFace] = useState('');

  const pickAvatar = async (playerId) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      const updated = players.map(p => p.id === playerId ? { ...p, avatar: result.assets[0].uri } : p);
      setPlayers(updated);
    }
  };

  const rollDiceForCurrentPlayer = () => {
    const result = rollDice();
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
    <ImageBackground
      source={require('../assets/dice/bg_map.png')}
      style={styles.background}
    >
      <TouchableOpacity style={styles.chatButton} onPress={() => setShowChat(!showChat)}>
        <Text style={styles.chatText}>💬</Text>
      </TouchableOpacity>

      {showChat && <ChatBox />}

      <View style={styles.table}>
        <Image source={require('../assets/dice/dice-cup.png')} style={styles.cup} />

        {currentPlayerId === players[0].id && (
          <>
            <TouchableOpacity style={styles.bgBidArea} onPress={() => setBidModalVisible(true)} />
            <TouchableOpacity style={styles.bgLiarArea} onPress={callLiar} />
            <TouchableOpacity style={styles.rollDiceButton} onPress={rollDiceForCurrentPlayer}>
              <Text style={styles.rollDiceText}>Roll Dice</Text>
            </TouchableOpacity>
          </>
        )}

        {players.map((player, i) => (
          <View key={player.id} style={[styles.playerContainer, avatarPositions[i]]}>
            <TouchableOpacity onPress={() => pickAvatar(player.id)}>
              <Image source={{ uri: player.avatar }} style={styles.avatar} />
            </TouchableOpacity>
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

      <Modal transparent={true} visible={bidModalVisible} animationType="slide" onRequestClose={() => setBidModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Bid</Text>
            <TextInput placeholder="Quantity" style={styles.input} keyboardType="number-pad" value={bidQuantity} onChangeText={setBidQuantity} />
            <TextInput placeholder="Face (1-6)" style={styles.input} keyboardType="number-pad" value={bidFace} onChangeText={setBidFace} />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalBtn} onPress={submitBid}><Text style={styles.buttonText}>Submit</Text></Pressable>
              <Pressable style={styles.modalBtn} onPress={() => setBidModalVisible(false)}><Text style={styles.buttonText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#222', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%' },
  navButton: { padding: 10 },
  navText: { fontSize: 20, color: '#fff' },
  bgBidArea: { position: 'absolute', bottom: -40, left: '8%', width: 90, height: 45, zIndex: 10, backgroundColor: 'rgba(0,255,0,0.3)' },
  bgLiarArea: { position: 'absolute', bottom: -40, right: '8%', width: 90, height: 45, zIndex: 10, backgroundColor: 'rgba(255,0,0,0.3)' },
  rollDiceButton: { position: 'absolute', bottom: -10, left: '50%', transform: [{ translateX: -45 }], width: 90, height: 45, backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 8, zIndex: 10 },
  rollDiceText: { fontWeight: 'bold', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { backgroundColor: '#0a3d62', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center', marginHorizontal: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
