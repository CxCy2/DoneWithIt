import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import CalendarScreen from './Screen/CalendarScreen';
import Map from './Screen/Map';

const Tab = createMaterialTopTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
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
                style={{ color: isFocused ? 'green' : 'black' }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.iconContainer}>
        <Icon name="search" size={25} color="black" style={styles.icon} onPress={() => { /* Handle search icon press */ }} />
        <Icon name="notifications" size={25} color="black" onPress={() => { /* Handle bell icon press */ }} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Calendar"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 }, // Customize the tab label style
          tabBarStyle: { backgroundColor: '#fff' }, // Customize the tab bar style
          tabBarActiveTintColor: 'green', // Active tab label color
          tabBarIndicatorStyle: { backgroundColor: 'green' }, // Set the indicator color to green
          tabBarInactiveTintColor: 'black', // Inactive tab label color
        }}
      >
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
        <Tab.Screen name="Map" component={Map} options={{ tabBarLabel: 'Map' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 40,
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
    paddingEnd: 20,
  },
});
