import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import CalendarScreen from './Screen/CalendarScreen';
import Map from './Screen/Map';
import SearchScreen from './Screen/Search'; // Import the new SearchScreen

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function CustomTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View key={index} style={styles.tabItem}>
              <Text
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  color: isFocused ? 'green' : 'black',
                  fontSize: 16,
                }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Icon name="search" size={25} color="black" style={styles.icon} />
        </TouchableOpacity>
        <Icon name="notifications" size={25} color="black" onPress={() => { /* Handle bell icon press */ }} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {() => (
            <Tab.Navigator
              initialRouteName="Calendar"
              tabBar={(props) => <CustomTabBar {...props} />}
              screenOptions={{
                tabBarLabelStyle: { fontSize: 16 }, // Increase font size
                tabBarStyle: { backgroundColor: '#fff' }, // Customize the tab bar style
                tabBarIndicatorStyle: { backgroundColor: 'green' }, // Set the indicator color to green
                tabBarActiveTintColor: 'green', // Active tab label color
                tabBarInactiveTintColor: 'black', // Inactive tab label color
              }}
            >
              <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
              <Tab.Screen name="Map" component={Map} options={{ tabBarLabel: 'Map' }} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  icon: {
    marginLeft: 15,
    paddingEnd: 10,
  },
}); 