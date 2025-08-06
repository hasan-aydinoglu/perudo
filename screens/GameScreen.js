import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground,
  TouchableOpacity, Alert, Modal, TextInput, Pressable, Animated
} from 'react-native';
import ChatBox from '../components/ChatBox';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

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
    { id: 1, name: 'Alice', avatar: defaultAvatars[0], dice: rollDice(), isEliminated: false, lastMessage: '', isBot: false },
    { id: 2, name: 'BotJack', avatar: defaultAvatars[1], dice: rollDice(), isEliminated: false, lastMessage: '', isBot: true },
    { id: 3, name: 'Charlie', avatar: defaultAvatars[2], dice: rollDice(), isEliminated: false, lastMessage: '', isBot: false },
    { id: 4, name: 'Diana', avatar: defaultAvatars[3], dice: rollDice(), isEliminated: false, lastMessage: '', isBot: false },
  ]);

  const [diceData, setDiceData] = useState({});
  const [currentPlayerId, setCurrentPlayerId] = useState(1);
  const [currentBid, setCurrentBid] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidQuantity, setBidQuantity] = useState('');
  const [bidFace, setBidFace] = useState('');
  const [winner, setWinner] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;

  const avatarPositions = [
    { top: 30, left: '43%' },
    { top: '33%', right: 20 },
    { bottom: 150, right: 30 },
    { top: '33%', left: 20 },
  ];

  const playSound = async (type) => {
    try {
      const soundMap = {
        roll: require('../assets/sfx/roll.mp3'),
        bid: require('../assets/sfx/bid.mp3'),
        liar: require('../assets/sfx/liar.mp3'),
        win: require('../assets/sfx/win.mp3'),
      };
      const { sound } = await Audio.Sound.createAsync(soundMap[type]);
      await sound.playAsync();
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  const animateWin = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    ).start();
  };

  useEffect(() => {
    if (winner) {
      playSound('win');
      animateWin();
    }
  }, [winner]);

  const handleSendMessage = ({ senderId, text }) => {
    setMessages(prev => [...prev, { senderId, text }]);
    setPlayers(prevPlayers => prevPlayers.map(p => p.id === senderId ? { ...p, lastMessage: text } : p));
    setTimeout(() => {
      setPlayers(prevPlayers => prevPlayers.map(p => p.id === senderId ? { ...p, lastMessage: '' } : p));
    }, 3000);
  };

  const pickAvatar = async (playerId) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      const updated = players.map(p => p.id === playerId ? { ...p, avatar: result.assets[0].uri } : p);
      setPlayers(updated);
    }
  };

  const checkWinner = (updatedPlayers) => {
    const alivePlayers = updatedPlayers.filter(p => !p.isEliminated);
    if (alivePlayers.length === 1) setWinner(alivePlayers[0]);
  };

  const rollDiceForCurrentPlayer = () => {
    if (winner || currentPlayerId !== players[0].id) return;
    playSound('roll');
    const result = rollDice();
    const updatedPlayers = players.map(p => p.id === currentPlayerId ? { ...p, dice: result, isEliminated: result.length === 0 } : p);
    setPlayers(updatedPlayers);
    checkWinner(updatedPlayers);
    setDiceData(prev => ({ ...prev, [currentPlayerId]: result }));
    Alert.alert('Dice Rolled', `You rolled: ${result.join(', ')}`);
  };

  const submitBid = () => {
    if (winner || currentPlayerId !== players[0].id) return;
    playSound('bid');
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
    if (!currentBid || winner || currentPlayerId !== players[0].id) return;
    playSound('liar');
    const total = Object.values(diceData).flat().filter(d => d === currentBid.face).length;
    const bidder = players.find(p => p.id === currentBid.playerId);
    const caller = players.find(p => p.id === currentPlayerId);
    const wasLie = total < currentBid.quantity;

    let updatedPlayers = [...players];
    if (wasLie) {
      updatedPlayers = updatedPlayers.map(p => p.id === bidder.id ? { ...p, dice: p.dice.slice(0, -1), isEliminated: p.dice.length - 1 === 0 } : p);
    } else {
      updatedPlayers = updatedPlayers.map(p => p.id === caller.id ? { ...p, dice: p.dice.slice(0, -1), isEliminated: p.dice.length - 1 === 0 } : p);
    }
    setPlayers(updatedPlayers);
    checkWinner(updatedPlayers);
    setCurrentBid(null);
    nextPlayer();
    Alert.alert('Liar Called!', wasLie ? `${caller.name} was right! ${bidder.name}'s bid was a lie.` : `${caller.name} was wrong! ${bidder.name}'s bid is valid.`);
  };

  useEffect(() => {
    const current = players.find(p => p.id === currentPlayerId);
    if (current?.isBot && !winner) {
      setTimeout(() => {
        const action = Math.random() > 0.5 ? 'bid' : 'liar';
        if (action === 'liar' && currentBid) {
          callLiar();
        } else {
          const randomBid = {
            quantity: Math.floor(Math.random() * 5) + 1,
            face: Math.floor(Math.random() * 6) + 1,
          };
          setCurrentBid({ ...randomBid, playerId: current.id });
          playSound('bid');
          nextPlayer();
        }
      }, 1500);
    }
  }, [currentPlayerId]);

  const renderDice = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return (
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        {player.dice.map((d, i) => (
          <Image key={i} source={getDiceImage(d)} style={{ width: 32, height: 32, margin: 2 }} />
        ))}
      </View>
    );
  };

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  const resetGame = () => {
    setPlayers(prev => prev.map((p, i) => ({ ...p, dice: rollDice(), isEliminated: false })));
    setCurrentPlayerId(1);
    setCurrentBid(null);
    setWinner(null);
    setMessages([]);
    setDiceData({});
  };

  return (
    <ImageBackground source={require('../assets/dice/bg_map.png')} style={{ flex: 1 }}>
      {!winner && (
        <View style={{ position: 'absolute', top: 5, alignSelf: 'center', backgroundColor: '#000a', padding: 6, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🎯 Sıra: {currentPlayer?.name}</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => setShowChat(!showChat)} style={{ position: 'absolute', top: 40, right: 20, zIndex: 999 }}>
        <Text style={{ fontSize: 24, color: '#fff' }}>💬</Text>
      </TouchableOpacity>

      {showChat && (
        <ChatBox
          messages={messages}
          onSend={handleSendMessage}
          currentPlayerId={currentPlayerId}
        />
      )}

      {players.map((player, i) => (
        <View key={player.id} style={[{ position: 'absolute', alignItems: 'center' }, avatarPositions[i]]}>
          <TouchableOpacity onPress={() => pickAvatar(player.id)}>
            <Image source={{ uri: player.avatar }} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#ffcc00', opacity: player.isEliminated ? 0.5 : 1 }} />
          </TouchableOpacity>
          <Text style={{ color: '#fff', marginTop: 4, fontWeight: 'bold' }}>{player.name}</Text>
          {player.lastMessage !== '' && (
            <View style={{ backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, position: 'absolute', top: -25 }}>
              <Text style={{ color: '#000', fontSize: 12, fontWeight: '600' }}>{player.lastMessage}</Text>
            </View>
          )}
          {currentPlayerId === player.id && !player.isEliminated && renderDice(player.id)}
        </View>
      ))}

      <TouchableOpacity onPress={() => setBidModalVisible(true)} style={{ position: 'absolute', bottom: 130, left: 20, backgroundColor: 'green', padding: 10, borderRadius: 10 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Bid</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={callLiar} style={{ position: 'absolute', bottom: 130, right: 20, backgroundColor: 'red', padding: 10, borderRadius: 10 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Liar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={rollDiceForCurrentPlayer} style={{ position: 'absolute', bottom: 130, left: '50%', transform: [{ translateX: -45 }], backgroundColor: '#ffd700', padding: 10, borderRadius: 10 }}>
        <Text style={{ fontWeight: 'bold', color: '#000' }}>Roll Dice</Text>
      </TouchableOpacity>

      <Modal transparent visible={bidModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Enter Your Bid</Text>
            <TextInput placeholder="Quantity" keyboardType="number-pad" value={bidQuantity} onChangeText={setBidQuantity} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
            <TextInput placeholder="Face (1-6)" keyboardType="number-pad" value={bidFace} onChangeText={setBidFace} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
            <Pressable onPress={submitBid} style={{ backgroundColor: '#0a3d62', padding: 10, borderRadius: 8 }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#222', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}><Text style={{ color: '#fff', fontSize: 20 }}>👤</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Game')}><Text style={{ color: '#fff', fontSize: 20 }}>🎮</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Text style={{ color: '#fff', fontSize: 20 }}>⚙️</Text></TouchableOpacity>
      </View>

      {winner && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <Animated.Text style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ['gold', 'white']
            }),
            transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }]
          }}>
            🏆 Winner: {winner.name} 🥳
          </Animated.Text>

          <TouchableOpacity
            onPress={resetGame}
            style={{ marginTop: 20, backgroundColor: '#28a745', padding: 12, borderRadius: 10 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>🔁 Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}