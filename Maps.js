import {StyleSheet, View} from 'react-native';
import MapView, {Polygon, PROVIDER_GOOGLE} from 'react-native-maps';
import {ActivityIndicator} from 'react-native-paper';

export default function Maps({location}) {
  let campusBoundary = [
    {
      latitude: 12.84077,
      longitude: 80.153226,
    },
    {
      latitude: 12.841316,
      longitude: 80.1535,
    },
    {
      latitude: 12.841776,
      longitude: 80.153457,
    },
    {
      latitude: 12.842104,
      longitude: 80.152963,
    },
    {
      latitude: 12.842772,
      longitude: 80.152645,
    },
    {
      latitude: 12.84334,
      longitude: 80.1527,
    },
    {
      latitude: 12.843563,
      longitude: 80.151115,
    },
    {
      latitude: 12.84531,
      longitude: 80.15128,
    },
    {
      latitude: 12.845171,
      longitude: 80.152723,
    },
    {
      latitude: 12.844756,
      longitude: 80.153351,
    },
    {
      latitude: 12.844376,
      longitude: 80.155175,
    },
    {
      latitude: 12.843956,
      longitude: 80.1561,
    },
    {
      latitude: 12.843581,
      longitude: 80.156508,
    },
    {
      latitude: 12.843335,
      longitude: 80.15731,
    },
    {
      latitude: 12.843581,
      longitude: 80.157535,
    },
    {
      latitude: 12.843232,
      longitude: 80.158282,
    },
    {
      latitude: 12.841418,
      longitude: 80.157338,
    },
    {
      latitude: 12.841539,
      longitude: 80.157012,
    },
    {
      latitude: 12.840619,
      longitude: 80.156499,
    },
    {
      latitude: 12.841182,
      longitude: 80.154542,
    },
    {
      latitude: 12.840109,
      longitude: 80.154808,
    },
    {
      latitude: 12.839694,
      longitude: 80.155743,
    },
    {
      latitude: 12.839158,
      longitude: 80.155431,
    },
    {
      latitude: 12.839502,
      longitude: 80.154689,
    },
    {
      latitude: 12.838966,
      longitude: 80.154538,
    },
    {
      latitude: 12.839109,
      longitude: 80.154171,
    },
    {
      latitude: 12.83972,
      longitude: 80.154335,
    },
    {
      latitude: 12.8398,
      longitude: 80.153642,
    },
    {
      latitude: 12.840181,
      longitude: 80.1532,
    },
    {
      latitude: 12.840654,
      longitude: 80.153354,
    },
  ];

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: 12.840698,
            longitude: 80.155118,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          zoomEnabled={true}
          zoomTapEnabled={true}
          zoomControlEnabled={true}>
          <Polygon
            coordinates={campusBoundary}
            lineJoin={'round'}
            strokeWidth={2}
            strokeColor={'rgba(239, 35, 60, 1)'}
            fillColor={'rgba(239, 35, 60, 0.3)'}
          />
        </MapView>
      ) : (
        <ActivityIndicator animating={true} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '85%',
    zIndex: -1,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
});
