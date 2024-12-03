import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const CustomLoader = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000, // 1 second for a full rotation
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loader,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loader: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderRadius: 25,
    borderColor: '#0F9BAE',
    borderTopColor: 'transparent',
    borderStyle: 'solid', // Optional, works for completeness
  },
});

export default CustomLoader;
