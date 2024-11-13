import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

export default function GeoTag({inside}) {
  return (
    <>
      <TouchableOpacity>
        <View
          style={{
            ...styles.container,
            backgroundColor: inside
              ? 'rgba(153, 217, 140, 0.75)'
              : 'rgba(230, 57, 70, 0.7)',
          }}>
          <View style={styles.mainCont}>
            <Text variant="titleMedium" style={{color: '#08080C'}}>
              VIT Chennai Campus
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    paddingTop: 12,
    paddingBottom: 12,
  },
  mainCont: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 4,
    justifyContent: 'center',

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      justifyContent: 'flex-start',
    },
  },
  distWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 10,
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 6,
  },
  distCont: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 2,
    justifyContent: 'center',
    // backgroundColor : "red",
    width: '100%',
  },

  btnCont: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(153, 217, 140, 1)',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
});
