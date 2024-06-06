import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert, Button, Text, Image, FlatList, TouchableHighlight, TouchableOpacity  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';
import { markers } from '../assets/markers'; // Adjust the import path as needed
import RBSheet from 'react-native-raw-bottom-sheet';
import WebView from 'react-native-webview'; // Import WebView
import { Menu, Provider, Divider } from 'react-native-paper';

export default function Map({ }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);// Reference to the MapView
  const [selectedMarkerName, setSelectedMarkerName] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [webviewVisible, setWebviewVisible] = useState(false); // State to manage WebView visibility
  const refRBSheet = useRef();
  const webViewUrl = 'https://www.qtimeweb.com'; // The URL to be displayed in WebView
  const [menuVisible, setMenuVisible] = useState(false); // State to manage dropdown menu visibility
  //const { Id } = route.params;//suppose to open the location on open

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

  // Function to handle scroll view post press
  const onPostPress = (item) => {
    setSelectedImage(item);
    setModalVisible(true);
  };
  
  // Function to copy the link
  const copyLink = () => {
    Clipboard.setString(webViewUrl);
    Alert.alert('Link Copied', webViewUrl);
    setMenuVisible(false);
  };

  // Function to open the link in the browser
  const openInBrowser = () => {
    Linking.openURL(webViewUrl);
    setMenuVisible(false);
  };
  return (
    <Provider>
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
       
      <View style={styles.topContainer}>
        <View><Text style={styles.Header1}>Location</Text></View>
        <View><Text style={styles.Header2} >Details</Text></View>
        
        
      </View>
      

       <View style={styles.buttonContainer}>
        <Button title="Focus at Me" onPress={focusOnUserLocation} />
      </View>
      
  
      {/* RBsheet to display the selected marker's name */}
      <View style={{flex: 1 }}>
      
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
                  onPress={() => onPostPress(item)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={item}
                      style={styles.thumbnail}
                    />
                    <Text style={styles.imageText} numberOfLines={2}>Post {index + 1}</Text>
                    <Text style={styles.Header3} width = "95%" height={90} numberOfLines={3}>'Hardcoded text... '</Text>
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
      
      {/* Modal to display selected image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        margin = {0} //eliminate the weird pading
        animationType="fade"
        statusBarTranslucent //cover including statusbar
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.topActionBarContainer}>
            <TouchableOpacity style={styles.closeContent} onPress={() => setModalVisible(false)}>
              <Image style={styles.iconContent} source={require('../assets/close_ic.png')}  />
            </TouchableOpacity>
            
            <View style={{flexDirection:"row", width:'35%', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={styles.closeContent} onPress={() => setModalVisible(false)}>
              <Image style={styles.iconContent1} source={require('../assets/report_ic.png')}  />
            </TouchableOpacity>
              <TouchableOpacity style={styles.closeContent} onPress={() => setWebviewVisible(true)}>
                <Image style={styles.iconContent2} source={require('../assets/share_ic.png')}  />
              </TouchableOpacity>
            </View>
          </View>

            <View style={styles.modalContent}>
              <Image source={selectedImage} style={styles.modalImage} />
            </View>
          </View>
      </Modal>
      
      {/* WebView Modal */}
      <Modal
          visible={webviewVisible}
          transparent={false}
          animationType="slide"
          padding = {0}
          statusBarTranslucent
          onRequestClose={() => setWebviewVisible(false)}
        >
          <View style={styles.webviewContainer}>
            <View style={styles.webviewHeader}>
            <TouchableOpacity  style= {{opacity: 0.6}}  onPress={() => setWebviewVisible(false)}>
              <Image style={styles.iconContent} source={require('../assets/close_ic.png')}  />
            </TouchableOpacity> 
              <Text style={styles.webviewUrl}>{webViewUrl}</Text>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button onPress={() => setMenuVisible(true)} title="Options" />
                }
              >
                <Menu.Item onPress={copyLink} title="Copy Link" />
                <Divider />
                <Menu.Item onPress={openInBrowser} title="Open in Browser" />
              </Menu>
            </View>
            <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
          </View>
        </Modal>


    </View>
    </Provider>
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
  topContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  topActionBarContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    top: 20,
    alignSelf: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  Header1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  Header2: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'left',
  },
  Header3: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: '55%',
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
    width: '95%',
    textDecorationStyle: 'bold',
    fontSize: 17,
    textAlign: 'left',
    marginTop: 5,
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%', // Ensure it fits the whole screen
    height: '100%', // Ensure it fits the whole screen
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    marginBottom: 20,
  },
  closeContent: {
    alignSelf: 'top-right',
    position: 'relative',
    padding: 5,
    width: 160,
    color: 'red',
    flex : 1
    
  },
  iconContent: {
    paddingTop: 5,
    marginTop: 10,
    height: 25,
    width: 25,
    resizeMode: 'auto',
  },
  iconContent1: {
    padding: 5,
    height: 35,
    width: 35,
    resizeMode: 'auto',
  },
  iconContent2: {
    padding: 5,
    height: 30,
    width: 30,
    resizeMode: 'auto',
    
  },
  webviewContainer: {
    marginTop: 20,
    flex: 1,
    
  },
  webviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  webviewUrl: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: 'blue',
  },
});


