import React from 'react';

import {BottomNavigation} from 'react-native-paper';
import Record from './Record';
import MainScreen from './MainScreen';

export default function ({navigation}) {
  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState([
    {
      key: 'Record',
      title: 'Records',
      focusedIcon: 'book-variant',
      unfocusedIcon: 'book-outline',
    },
    {
      key: 'Home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
  ]);

  const HomeRoute = () => {
    return <MainScreen navigation={navigation} />;
  };

  const RecordRoute = () => <Record navigation={navigation} />;

  const renderScene = BottomNavigation.SceneMap({
    Home: HomeRoute,
    Record: RecordRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
