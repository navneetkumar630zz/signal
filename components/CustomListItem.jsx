import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { db } from '../firebase';

const CustomListItem = ({ id, chatName, navigation }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setChatMessages(snapshot.docs.map(doc => doc.data()))
      );

    return unsubscribe;
  }, []);

  const enterChat = () => {
    navigation.navigate('Chat', { id, chatName });
  };

  return (
    <ListItem key={id} bottomDivider onPress={enterChat}>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages[0]?.photoURL ||
            'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.length !== 0 &&
            `${chatMessages[0].displayName} : ${chatMessages[0].message}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
