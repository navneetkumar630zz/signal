import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { Button, Image, Input } from 'react-native-elements';
import signalLogoSrc from '../assets/signal-logo.png';
import { auth } from '../firebase';
import Loading from '../components/Loading';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(data => {
      if (data) navigation.replace('Home');
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password).catch(err => alert(err));
  };

  return isLoading ? <Loading /> : (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image source={signalLogoSrc} style={{ width: 200, height: 200 }} />
      <View style={styles.inputContainer}>
        <Input
          type="email"
          placeholder="Email"
          autoFocus
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Input
          type="password"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button title="Login" containerStyle={styles.button} onPress={signIn} />
      <Button
        title="Register"
        containerStyle={styles.button}
        onPress={() => navigation.navigate('Signup')}
        type="outline"
      />
    </KeyboardAvoidingView>
  );
};

export default Login;

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
