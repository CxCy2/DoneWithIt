// Screen/SearchScreen.js

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { dataSearch } from '../assets/searchDataDummy'; // Adjust the import path as needed

const SearchScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const refRBSheet = useRef();

  const handleClear = () => {
    setTitle('');
    setLocation('');
    console.log('Title:', title);
    console.log('Location:', location);
    navigation.goBack();
  };

  const handleSearchTitle = () => {
    console.log('Search Title:', title);
  };

  const handleDone = () => {
    refRBSheet.current.open();
  };

  const renderItem = ({ item }) => (
    <Image source={item.src} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearchTitle}>
          <Text style={styles.text}>Title</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={{ flex: 1 }}>
        <RBSheet
          ref={refRBSheet}
          draggable={true}
          dragOnContent={false}
          height={800}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              elevation: 20,
              shadowOffset: { width: 10, height: 10 },
              shadowColor: 'black',
              shadowOpacity: 1,
            },
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: 'grey',
              borderColor: 'black',
              width: 80,
            },
          }}
          customAvoidingViewProps={{
            enabled: false,
          }}
        >
          <View style={styles.sheetContent}>
            <Text style={styles.sheetText}>{dataSearch[0].name}</Text>
            <FlatList
              data={dataSearch[0].images}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2} // Adjust the number of columns as needed
              style={styles.flatList}
            />
          </View>
        </RBSheet>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 20,
  },
  clearButton: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 20,
  },
  doneButton: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
  },
  inputContainer: {
    marginTop: 80, // Adds space between the buttons and the inputs
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 25,
  },
  sheetContent: {
    flex: 1,
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 24,
    marginBottom: 16,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: '45%',
    height: 150,
    margin: 5,
  },
});

export default SearchScreen;
