import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Animated, Easing } from 'react-native';

const diceFaces = [
  require('../assets/dice/1.png'),
  require('../assets/dice/2.png'),
  require('../assets/dice/3.png'),
  require('../assets/dice/4.png'),
  require('../assets/dice/5.png'),
  require('../assets/dice/6.png'),
];

export default function AnimatedDiceRoll({ onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [currentFaces, setCurrentFaces] = useState([0, 0, 0, 0, 0]);
  const intervalRef = useRef(null);
  const rollCountRef = useRef(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startShakeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 100, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 100, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    ).start();
  };

  const startRoll = () => {
    if (rolling) return;

    setRolling(true);
    rollCountRef.current = 0;
    startShakeAnimation();

    intervalRef.current = setInterval(() => {
      setCurrentFaces([
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6),
      ]);
      rollCountRef.current++;

      if (rollCountRef.current >= 20) {
        clearInterval(intervalRef.current);
        setRolling(false);
        shakeAnim.stopAnimation();

        const finalFaces = [
          Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 6),
        ];
        setCurrentFaces(finalFaces);
        if (onRollComplete) onRollComplete(finalFaces.map(f => f + 1));
      }
    }, 50);
  };

  const rotate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shaker, { transform: [{ rotate }] }]}>
        <View style={styles.glass}>
          <View style={styles.diceRow}>
            {currentFaces.map((face, i) => (
              <TouchableOpacity
                key={i}
                onPress={startRoll}
                disabled={rolling}
                activeOpacity={0.8}
              >
                <Image source={diceFaces[face]} style={styles.diceImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
      <Text style={styles.infoText}>{rolling ? 'Rolling...' : 'Tap any dice to roll'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  shaker: {},
  glass: {
    backgroundColor: '#5DADE2',
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: 380,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  diceImage: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
  },
  infoText: {
    color: '#f0e6c8',
    marginTop: 6,
    fontWeight: '600',
    fontSize: 16,
  },
});
