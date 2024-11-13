import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-paper';
import {Text} from 'react-native-paper';

export default function RecordTag({data}) {
  return (
    <View style={{...styles.container}}>
      <View
        style={{
          ...styles.mainCont,
        }}>
        <View style={styles.mainCont.header}>
          <Icon source="map-marker" color={'rgba(38, 38, 44, 0.6)'} size={20} />
          <Text variant="titleSmall" style={{color: 'rgba(38, 38, 44, 0.6)'}}>
            {Number(data.location.latitude).toFixed(2)},{' '}
            {Number(data.location.longitude).toFixed(2)}
          </Text>
        </View>
        <Text variant="titleMedium" style={{color: '#08080C'}}>
          {new Date(data.creation).toLocaleString()}
        </Text>
        {data?.updates?.length > 0 && (
          <View style={styles.mainCont.updatesCont}>
            {data.updates.map((el, i) => {
              return (
                <View key={i}>
                  <View style={styles.mainCont.header}>
                    <Icon
                      source="map-marker"
                      color={'rgba(38, 38, 44, 0.6)'}
                      size={20}
                    />
                    <Text
                      variant="titleSmall"
                      style={{color: 'rgba(38, 38, 44, 0.6)'}}>
                      {Number(el.location.latitude).toFixed(2)},{' '}
                      {Number(el.location.longitude).toFixed(2)}
                    </Text>
                    <Text
                      variant="titleSmall"
                      style={{
                        width: '58%',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: el.type === 'inside' ? '#40916c' : '#da2c38',
                      }}>
                      {el.type === 'inside' ? 'Entered' : 'Exited'}
                    </Text>
                  </View>
                  <Text variant="titleSmall" style={{color: '#08080C'}}>
                    {new Date(el.creation).toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 10,
  },
  mainCont: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 4,
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 10,

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      justifyContent: 'flex-start',
    },

    updatesCont: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      rowGap: 20,
      justifyContent: 'center',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 20,
      paddingRight: 20,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: 10,
      marginTop: 5,
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
