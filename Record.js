import {ScrollView, StyleSheet, View, RefreshControl} from 'react-native';
import {Text} from 'react-native-paper';
import {showMessage} from 'react-native-flash-message';
import RecordTag from './RecordTag';
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';

export default function Record() {
  const [records, setRecords] = useState([]);
  const CONSTANTS = useSelector(state => state.CONSTANTS);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showMessage({
          message: 'No user found',
          type: 'danger',
        });
        navigation.replace('Login');
      } else {
        try {
          let {data} = await axios.post(`${CONSTANTS.ip}/api/getRecords`, {
            token,
          });
          if (data.status === 'ok') {
            setRecords(data.records);
          } else {
            showMessage({
              message: "Couldn't get Attendance Record",
              type: 'danger',
            });
            navigation.replace('Login');
          }
        } catch (err) {
          showMessage({
            message: 'Something went wrong',
            type: 'danger',
          });
        }
      }
    })();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showMessage({
          message: 'No user found',
          type: 'danger',
        });
        setRefreshing(false);

        navigation.replace('Login');
      } else {
        try {
          let {data} = await axios.post(`${CONSTANTS.ip}/api/getRecords`, {
            token,
          });
          if (data.status === 'ok') {
            setRecords(data.records);
            setRefreshing(false);
          } else {
            showMessage({
              message: "Couldn't get Attendance Record",
              type: 'danger',
            });
            setRefreshing(false);

            navigation.replace('Login');
          }
        } catch (err) {
          showMessage({
            message: 'Something went wrong',
            type: 'danger',
          });
          setRefreshing(false);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollCont}>
        <View style={styles.mainCont}>
          <View style={styles.mainCont.header}>
            <Text variant="titleLarge" style={{color: '#1b263b'}}>
              Attendance Records
            </Text>
            <Text variant="titleSmall" style={{color: '#778da9'}}>
              View your Attendance Data
            </Text>
          </View>
          <View style={styles.divider}></View>
          <ScrollView
            contentContainerStyle={styles.mainCont.wrapper}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {records.map((el, i) => (
              <RecordTag data={el} key={i} />
            ))}
          </ScrollView>
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
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  divider: {
    backgroundColor: '#dedbd2',
    height: 2,
  },

  scrollCont: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    rowGap: 20,
  },

  mainCont: {
    flex: 1,
    rowGap: 20,

    wrapper: {
      rowGap: 16,
    },
  },

  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    rowGap: 15,
  },
});
