import React, { useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { auth } from '../firebase';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back to login',
    });
  }, [navigation]);

  const signup = async () => {
    try {
      const data = await auth.createUserWithEmailAndPassword(email, password);
      await data.user.updateProfile({
        displayName: name,
        photoURL:
          imgUrl ||
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Signal account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          type="text"
          placeholder="Full Name"
          autoFocus
          value={name}
          onChangeText={text => setName(text)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Input
          type="password"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Input
          type="text"
          placeholder="Profile picture url (optional)"
          value={imgUrl}
          onChangeText={text => setImgUrl(text)}
          onSubmitEditing={signup}
        />
      </View>
      <Button
        title="Create account"
        onPress={signup}
        raised
        containerStyle={styles.button}
      />
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
