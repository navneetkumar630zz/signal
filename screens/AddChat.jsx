import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase';

const AddChat = ({ navigation }) => {
  const [input, setInput] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create a new Chat',
      headerBackText: 'Chat',
    });
  }, [navigation]);

  const createChat = async () => {
    if (!input) return;
    await db
      .collection('chats')
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch(err => alert(err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Input
          placeholder="Enter a chat name"
          value={input}
          onChangeText={text => setInput(text)}
          leftIcon={
            <Icon name="wechat" type="antdesign" size={24} color="grey" />
          }
          autoFocus
          onSubmitEditing={createChat}
          containerStyle={styles.input}
        />
        <Button title="Create" onPress={createChat} />
      </View>
    </View>
  );
};

export default AddChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    width: 250,
  },
  input: {
    marginBottom: 20,
  },
});
