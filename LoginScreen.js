import {ScrollView, StyleSheet, View, StatusBar} from 'react-native';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import BackgroundActions from 'react-native-background-actions';

import {Text} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {Button} from 'react-native-paper';

export default function App({navigation}) {
  let [regNo, setRegNo] = useState('');
  let [pass, setPass] = useState('');
  const CONSTANTS = useSelector(state => state.CONSTANTS);

  useEffect(() => {
    (async () => {
      await BackgroundActions.stop();
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          let {data} = await axios.post(
            `http://13.202.224.218:5001/api/getBasicData`,
            {
              token,
            },
          );

          if (data.status === 'ok') {
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            showMessage({
              message: `Logged In as ${data.user.name}`,
              type: 'success',
            });
            navigation.replace('Home');
          } else {
            showMessage({
              message: "Couldn't get user data. Please Login Again.",
              type: 'danger',
            });
          }
        } catch (err) {
          showMessage({
            message: 'Session Timed Out. Please Login again.',
            type: 'danger',
          });
        }
      }
    })();
  }, []);

  async function submitHandler() {
    if (regNo.trim() !== '' && pass.trim() !== '') {
      try {
        let {data} = await axios.post(`${CONSTANTS.ip}/api/login`, {
          regNo,
          password: pass,
        });

        if (data.status === 'ok') {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          showMessage({
            message: `Logged In as ${data.user.name}`,
            type: 'success',
          });
          navigation.replace('Home');
        } else {
          showMessage({
            message: 'Invalid Username or Password',
            type: 'danger',
          });
          //error or no user found or invalid username/ pass
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollCont}>
        <View style={styles.header}>
          <Text variant={'headlineLarge'}>Attendance App</Text>
          <Text variant={'headlineSmall'}>Login</Text>
        </View>
        <View style={styles.mainCont}>
          <TextInput
            mode={'outlined'}
            label="Registration Number"
            value={regNo}
            onChangeText={text => setRegNo(text)}
          />
          <TextInput
            mode={'outlined'}
            label={'Password'}
            value={pass}
            secureTextEntry
            onChangeText={text => setPass(text)}
          />
          <Button
            mode="contained"
            style={{borderRadius: 3, marginTop: 30}}
            onPress={submitHandler}>
            Login
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 30,
    paddingRight: 30,
  },

  scrollCont: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    rowGap: 40,
  },

  mainCont: {
    rowGap: 10,
  },

  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    rowGap: 0,
  },
});
