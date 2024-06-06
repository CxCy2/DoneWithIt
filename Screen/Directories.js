// Directories.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

const images = [
  { id: '1', source: require('../assets/hospital.png') },
  { id: '2', source: require('../assets/police.png') },
  { id: '3', source: require('../assets/report_ic.png') },
  { id: '4', source: require('../assets/police.png') },
  { id: '5', source: require('../assets/report_ic.png') },
  { id: '6', source: require('../assets/hospital.png') },
  { id: '7', source: require('../assets/police.png') },
  { id: '8', source: require('../assets/police.png') },
  { id: '9', source: require('../assets/hospital.png') },
  { id: '10', source: require('../assets/police.png') },
  { id: '11', source: require('../assets/hospital.png') },
  { id: '12', source: require('../assets/police.png') },
  { id: '13', source: require('../assets/hospital.png') },
];

const numColumns = 5;
const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth / numColumns) - 10;

export default function Directories({ navigation }) {
  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Map', {imageId: item.id})}>
      <Image source={item.source} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={images}
      renderItem={renderImage}
      keyExtractor={item => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'left',
    margin: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    margin: 1, // Adjust the margin as needed
  },
});