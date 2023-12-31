import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntdesignIcon from 'react-native-vector-icons/AntDesign';

import LoginScreen from '../screens/LoginScreen.js';
import ResourcesScreen from '../screens/ResourcesScreen.js';
import HomeScreen from '../screens/HomeScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // Use a stack navigator to handle the login screen
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
// Define the main tab navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { fontSize: 16, fontFamily: 'Roboto-Regualar' }, // Font size of the tab labels
        tabBarStyle: { 
          height: 60,
          backgroundColor: "#3b424f",
        },
        tabBarActiveTintColor: "#efeeb4", // Set the active text color
        tabBarActiveBackgroundColor: "#636e83",
        tabBarInactiveTintColor: "#efeeb4", // Set the inactive text color
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'book' : 'book';
          }

          // You can return any component that you like here!
          return <AntdesignIcon name={iconName} size={size} color={color}/>;
        },
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen}/>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;