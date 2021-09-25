import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import CustomListItem from '../components/CustomListItem';

const Home = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(err => alert(err));
  };

  useEffect(() => {
    const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
      setChats(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: { backgroundColor: 'white' },
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={styles.leftHeader}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={styles.rightHeader}>
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}>
            <SimpleLineIcons
              name="pencil"
              size={24}
              color="black"
              onPress={() => navigation.navigate('AddChat')}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}>
            <SimpleLineIcons
              name="logout"
              size={24}
              color="black"
              onPress={signOut}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  leftHeader: { marginLeft: 10 },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110,
    marginRight: 10,
  },
  container: {
    height: '100%',
  },
});
