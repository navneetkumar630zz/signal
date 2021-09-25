import React, { useLayoutEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import { auth, db } from '../firebase';

const Chat = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!input?.trim()) return;

    db.collection('chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input.trim(),
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput('');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoURL ||
                'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
            }}
          />
          <Text style={styles.titleText}>{route.params.chatName}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.leftHeader}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.rightHeader}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
        style={styles.main}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.reciever}>
                    <Text>{data.message}</Text>
                    <Avatar
                      source={{ uri: data.photoURL }}
                      rounded
                      size={25}
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      // For Web
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        right: -5,
                      }}
                    />
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Avatar
                      source={{ uri: data.photoURL }}
                      rounded
                      size={25}
                      position="absolute"
                      bottom={-15}
                      left={-5}
                      // For Web
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        left: -5,
                      }}
                    />
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Type a Message"
                value={input}
                onChangeText={text => setInput(text)}
                onSubmitEditing={sendMessage}
                style={styles.input}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2089dc" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftHeader: {
    marginLeft: 10,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 70,
    marginRight: 10,
  },
  titleText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  input: {
    height: 40,
    flex: 1,
    marginRight: 15,
    padding: 10,
    backgroundColor: '#ececec',
    borderRadius: 20,
  },
  reciever: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#ececec',
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#2b68e6',
    alignSelf: 'flex-start',
    borderRadius: 20,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  senderText: {
    color: '#fff',
  },
  senderName: {
    position: 'absolute',
    bottom: -14,
    left: 22,
    fontSize: 10,
    color: '#777',
    width: 100,
  },
});
