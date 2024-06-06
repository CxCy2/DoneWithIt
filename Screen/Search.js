// Screen/SearchScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const SearchScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleClear = () => {
    setTitle('');
    setLocation('');
  };

  const handleSearchTitle = () => {
    console.log('Search Title:', title);
  };

  const handleDone = () => {
    console.log('Title:', title);
    console.log('Location:', location);
    navigation.goBack();
  };

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
});

export default SearchScreen;
