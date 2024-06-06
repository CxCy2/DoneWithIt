import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalendarScreen from './Screen/CalendarScreen';
import Map from './Screen/Map';

const Stack = createStackNavigator();

export default function App() {
<<<<<<< Updated upstream
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);// Reference to the MapView  
  const [isModalVisible, setModalVisible] = useState(false);// State to control the visibility of the bottom sheet
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

  // Function to handle scroll view post press
  const onPostPress = (index) => {
    setModalVisible(true);
    Alert.alert('Image Clicked', `You clicked image ${index + 1}`)
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
       
      <View style={styles.topContainer}>
        <View><Text style={styles.Header1}>Location</Text></View>
        <View><Text style={styles.Header2} >Details</Text></View>
        
        
      </View>
      

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

          
          {/* Flatlist to enable display scroll content for multiple post */}
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
                  onPress={() => onPostPress(index)}
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

          {/* Modal to display the selected marker's name */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{selectedMarkerName}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

          {/* <Button title="Close" onPress={() => refRBSheet.current.close()} /> */}
        </View>
      </RBSheet>
    </View>
      {/* Status bar */}
      <StatusBar style="auto" />
    </View>
=======
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
