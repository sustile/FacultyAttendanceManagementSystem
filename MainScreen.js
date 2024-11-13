import {
  ScrollView,
  StyleSheet,
  View,
  PermissionsAndroid,
  TouchableHighlight,
  Linking,
  Platform,
} from 'react-native';

import {Icon, Text} from 'react-native-paper';
import {useEffect, useRef, useState} from 'react';
import GeoTag from './GeoTag';
import {useSelector} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {FilterDataAdvanced} from 'filter-data-advanced/dist/FilterDataAdvanced';
import Maps from './Maps';
import * as turf from '@turf/turf';

import Geolocation from 'react-native-geolocation-service';
import BackgroundActions from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';

let obj = new FilterDataAdvanced();

const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'default-channel-id',
      channelName: 'Attendance Notifications',
      channelDescription:
        'A channel to notify users about their attendance status',
      playSound: true,
      sound: 'default',
      importance: PushNotification.Importance.HIGH,
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`),
  );
};

let turfCoords = [
  [12.84077, 80.153226],
  [12.841316, 80.1535],
  [12.841776, 80.153457],
  [12.842104, 80.152963],
  [12.842772, 80.152645],
  [12.84334, 80.1527],
  [12.843563, 80.151115],
  [12.84531, 80.15128],
  [12.845171, 80.152723],
  [12.844756, 80.153351],
  [12.844376, 80.155175],
  [12.843956, 80.1561],
  [12.843581, 80.156508],
  [12.843335, 80.15731],
  [12.843581, 80.157535],
  [12.843232, 80.158282],
  [12.841418, 80.157338],
  [12.841539, 80.157012],
  [12.840619, 80.156499],
  [12.841182, 80.154542],
  [12.840109, 80.154808],
  [12.839694, 80.155743],
  [12.839158, 80.155431],
  [12.839502, 80.154689],
  [12.838966, 80.154538],
  [12.839109, 80.154171],
  [12.83972, 80.154335],
  [12.8398, 80.153642],
  [12.840181, 80.1532],
  [12.840654, 80.153354],
  [12.84077, 80.153226],
];

const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('always');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  const hasPermission2 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );

  if (hasPermission && hasPermission2) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  const status2 = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );

  if (
    status === PermissionsAndroid.RESULTS.GRANTED &&
    status2 === PermissionsAndroid.RESULTS.GRANTED
  ) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

export default function ({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [tags, setTags] = useState([]);
  const CONSTANTS = useSelector(state => state.CONSTANTS);
  const tagRef = useRef(null);
  let [user, setUser] = useState(null);
  let [displayTag, setDisplayTag] = useState([]);
  const [inside, setInside] = useState(false);

  useEffect(() => {
    tagRef.current = tags;
    useRef.current = user;
  }, [tags, user]);

  function isWithinISTWorkingHours() {
    const now = getCurrentISTDate();

    const hours = now.getHours();
    const minutes = now.getMinutes();

    return (
      (hours > 8 || (hours === 8 && minutes >= 0)) &&
      (hours < 19 || (hours === 19 && minutes <= 30))
    );
  }

  function getCurrentISTDate() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const istDate = new Date(utcTime + istOffset);

    return istDate;
  }

  function isSameDateInIST(dateString) {
    const inputDate = new Date(dateString);

    const currentIST = getCurrentISTDate();

    return (
      inputDate.getFullYear() === currentIST.getFullYear() &&
      inputDate.getMonth() === currentIST.getMonth() &&
      inputDate.getDate() === currentIST.getDate()
    );
  }

  function convertToIST(dateString) {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    const istDate = new Date(utcTime + istOffset);

    return istDate;
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayTag(tags);
    } else {
      let found = obj.filterByValue(tags, searchQuery);
      setDisplayTag(found);
    }
  }, [searchQuery, tags]);

  useEffect(() => {
    (async () => {
      let status = await hasLocationPermission();

      PushNotification.configure({
        onNotification: function (notification) {
          console.log('Notification:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
      });

      if (Platform.OS === 'android') {
        createNotificationChannel();
      }

      if (!status) {
        showMessage({
          message: 'Location Permission denied',
          type: 'danger',
        });
        navigation.replace('Login');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showMessage({
          message: 'No user found',
          type: 'danger',
        });
        navigation.replace('Login');
      } else {
        try {
          let {data} = await axios.post(`${CONSTANTS.ip}/api/getBasicData`, {
            token,
          });
          if (data.status === 'ok') {
            setUser(data.user);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

            let data2 = await axios.post(
              `${CONSTANTS.ip}/api/getLatestAttendance`,
              {
                token,
              },
            );

            if (!data2.data.latestRecord) {
              await AsyncStorage.setItem(
                'latestAttendance',
                JSON.stringify(data2.data.latestRecord),
              );
            } else {
              let cDate = convertToIST(data2.data.latestRecord);

              await AsyncStorage.setItem(
                'latestAttendance',
                JSON.stringify(cDate),
              );
            }

            await AsyncStorage.setItem('previousState', 'outside');

            // if (BackgroundActions.isRunning()) {
            await BackgroundActions.stop();
            startBackgroundTracking();
            // }
          } else {
            showMessage({
              message: "Couldn't get user data",
              type: 'danger',
            });
            navigation.replace('Login');
          }
        } catch (err) {
          showMessage({
            message: 'Something went wrong' + err.message,
            type: 'danger',
          });
          navigation.replace('Login');
        }
      }

      return async () => {
        await BackgroundActions.stop();
      };
    })();
  }, []);

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
    for (let i = 0; BackgroundActions.isRunning(); i++) {
      Geolocation.getCurrentPosition(
        async position => {
          setLocation(position);

          if (position.coords.accuracy > 20) return;

          if (position) {
            if (!isWithinISTWorkingHours()) {
              console.log('not withing woring hours');
              return;
            }

            const polygon = turf.polygon([turfCoords]);

            const point = turf.point([
              position.coords.latitude,
              position.coords.longitude,
            ]);

            const isInside = turf.booleanPointInPolygon(point, polygon, {
              ignoreBoundary: true,
            });
            setInside(isInside);
            let date = JSON.parse(
              await AsyncStorage.getItem('latestAttendance'),
            );
            if (isInside) {
              //2 conditions -> previous state inside or outside
              let prevState = await AsyncStorage.getItem('previousState');

              if (prevState === 'outside') {
                //outside
                if (date === null) {
                  markAttendance(position);
                } else {
                  let isInInterval = isSameDateInIST(date);

                  if (!isInInterval) {
                    markAttendance(position);
                  } else {
                    updateLocationStatus(position, 'inside');
                    //update location array in db
                  }
                }
                await AsyncStorage.setItem('previousState', 'inside');
              }
            } else {
              //2 conditions -> previous state inside or outside
              let prevState = await AsyncStorage.getItem('previousState');

              if (prevState === 'inside') {
                //user exited campus
                updateLocationStatus(position, 'outside');
                await AsyncStorage.setItem('previousState', 'outside');
              }
            }
          }
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
          accuracy: {
            android: 'high',
            ios: 'bestForNavigation',
          },
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );

      await sleep(delay);
    }
  };

  const updateLocationStatus = async (location, type) => {
    //mark attendance

    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');

      if (!user.facultyId || !token) {
        //no user or no token
        showMessage({
          message: 'No user found',
          type: 'danger',
        });
        navigation.replace('Login');
        return;
      }

      try {
        let {data} = await axios.post(
          `${CONSTANTS.ip}/api/checkAttendanceStatus`,
          {
            token,
          },
        );
        if (data.status === 'ok') {
          if (!data.attendanceStatus) {
            let body = {
              facultyId: user.facultyId,
              location: location.coords,
              token,
              type,
            };

            let data2 = await axios.post(
              `${CONSTANTS.ip}/api/updateLocationStatus`,
              body,
            );

            data2 = data2.data;

            if (data2.status === 'ok') {
              console.log('success update');
            }
          }
        } else {
          throw new Error('');
        }
      } catch (err) {
        console.log(err.message);
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Something went wrong',
        type: 'danger',
      });
    }
  };

  const markAttendance = async location => {
    //mark attendance

    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');

      if (!user.facultyId || !token) {
        //no user or no token
        showMessage({
          message: 'No user found',
          type: 'danger',
        });
        navigation.replace('Login');
        return;
      }

      try {
        let {data} = await axios.post(
          `${CONSTANTS.ip}/api/checkAttendanceStatus`,
          {
            token,
          },
        );
        if (data.status === 'ok') {
          if (data.attendanceStatus) {
            let body = {
              facultyId: user.facultyId,
              location: location.coords,
              token,
            };

            let data2 = await axios.post(
              `${CONSTANTS.ip}/api/markAttendance`,
              body,
            );

            data2 = data2.data;

            if (data2.status === 'ok') {
              console.log('success');
              showMessage({
                message: 'Successfully marked attendance',
                type: 'success',
              });

              PushNotification.localNotification({
                channelId: 'default-channel-id',
                title: 'Attendance Status',
                message: 'Attendance Marked Successfully for the day!',
              });
              await AsyncStorage.setItem(
                'latestAttendance',
                JSON.stringify(getCurrentISTDate()),
              );
            } else {
              PushNotification.localNotification({
                channelId: 'default-channel-id',
                title: 'Attendance Status',
                message: "Something Went Wrong. Couldn't Mark your Attendance!",
              });
              showMessage({
                message: "Couldn't Mark Attendance. Something went wrong",
                type: 'danger',
              });
            }
          } else {
            showMessage({
              message: 'Already Marked Attendance for the Day',
              type: 'danger',
            });
          }
        } else {
          throw new Error('');
        }
      } catch (err) {
        console.log(err.message);
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Something went wrong',
        type: 'danger',
      });
    }
  };

  // Foreground options for the task
  const options = {
    taskName: 'Location Tracking',
    taskTitle: 'Location tracking in progress',
    taskDesc: 'Tracking your location continuously.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourapp://home',
    parameters: {
      delay: 30000,
    },
  };

  const startBackgroundTracking = async () => {
    await BackgroundActions.start(veryIntensiveTask, options);
  };

  async function logout() {
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('user', '');
    showMessage({
      message: `Successfully Logged Out`,
      type: 'success',
    });
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollCont}>
        <View style={styles.header}>
          <View style={styles.header.main}>
            <Text variant={'titleLarge'}>Welcome, {user?.name}</Text>
            <TouchableHighlight onPress={logout} underlayColor="white">
              <Icon source="logout" color={'#ef233c'} size={25} />
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.mainCont}>
          <View style={styles.mainCont.wrapper}>
            <GeoTag inside={inside} location={location} />
          </View>
          <Maps location={location} />
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
      rowGap: 8,
    },
  },

  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    rowGap: 15,

    main: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
  },
});
