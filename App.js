import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert, Button, Text, Image, FlatList, TouchableHighlight, TouchableOpacity  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';
import { markers } from './assets/markers'; // Adjust the import path as needed
import RBSheet from 'react-native-raw-bottom-sheet';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);// Reference to the MapView
  const [selectedMarkerName, setSelectedMarkerName] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const refRBSheet = useRef();

  //requestion users real time location
  useEffect(() => {
    (async () => 
      {
        //permission request
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      }
    )();
  }, []);

    // Function to focus the map on the user's location
    const focusOnUserLocation = () => {
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005, //zoom level
          longitudeDelta: 0.005, //zoom level
        }, 1000); // Animation duration in milliseconds
      }
      console.log("focusOnUserLocation func state " + ( location.longitude));
    };



  if (errorMsg) {
    Alert.alert('Error', errorMsg);
  }

  const initialRegion = {
    latitude: location ? location.latitude : 4.2105, // Default malaysia latitude if location is not available
    longitude: location ? location.longitude : 101.9758, // Default longitude if location is not available
    latitudeDelta: 10,
    longitudeDelta: 10,
  };


   // Function to handle marker press
   const onMarkerPress = (index, name, marker) => {
    setSelectedMarker(marker);
    setSelectedMarkerName(name);
    setSelectedMarkerIndex(index);
    refRBSheet.current.open();
  };

  return (
    <View style={styles.container}>
      
      <MapView 
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton = {false}
      >
        {markers.map((marker, index) =>(
            <Marker key={index} 
            coordinate={marker}
            style={styles.markersStyle}
            onPress={() => onMarkerPress(index, marker.name, marker)}
            />
          ))}
      </MapView>
       
       <View style={styles.buttonContainer}>
        <Button title="Focus at Me" onPress={focusOnUserLocation} />
      </View>
      
  
      {/* RBsheet to display the selected marker's name */}
      <View style={{flex: 1 }}>
      <Button
        title="OPEN BOTTOM SHEET"
        onPress={() => refRBSheet.current.open()}
      />
      <RBSheet
        ref={refRBSheet}
        
        draggable = {true}
        dragOnContent = {false}
        height={700}

        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: 'blue',
            borderColor: 'black',
            width: 80,
          },
        }}
        
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View style={styles.sheetContent}>
          {/* <Text style={styles.sheetText}>{selectedMarkerName}</Text> */}
          <Text style={styles.sheetText}>{selectedMarker ? selectedMarker.name : ''}</Text>
          {selectedMarker && (
            //flatlist for handling big dataset
            <FlatList
              data={selectedMarker.images}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({ item, index  }) => (
                 <TouchableOpacity
                  style={styles.touchable}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert('Image Clicked', `You clicked image ${index + 1}`)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={item}
                      style={styles.thumbnail}
                    />
                    <Text style={styles.imageText}>Image {index + 1}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          {/* <Button title="Close" onPress={() => refRBSheet.current.close()} /> */}
        </View>
      </RBSheet>
    </View>
      {/* Status bar */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    marginLeft: -75, // Adjust the margin to half of the button width
  },
  sheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 18,
    marginBottom: 20,
  },
  touchable: {
    flex: 1,
    margin: '0%',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    
    borderRadius: '20'
  },
  touchable: {
    width: '48%',
    margin: '1%',
    alignItems: 'center',
    
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageText: {
    width: '100%',
    textAlign: 'left',
    marginTop: 5,
    height: 100,
  },
});
