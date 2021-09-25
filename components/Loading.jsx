import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-elements';
import signalLogoSrc from '../assets/signal-logo.png';

const Loading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={signalLogoSrc} style={{ width: 200, height: 200 }} />
        <Text>Loading...</Text>
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    alignItems: 'center',
  }
});
