import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { auth } from '../../firebase.js';
//import { HeaderButtons, Item } from 'react-navigation-header-buttons';
//import { Icons } from '../assets/Icons.js';

const ProfileScreen = ({ navigation }) => {

  const handleSignOut = () => {
    // Perform the sign-out action
    auth.signOut()
      .then(() => {
        // Successfully signed out, navigate to the login screen or perform other actions
        navigation.navigate('Login');
        console.log('Signed out user');
      })
      .catch(error => {
        // Handle sign-out errors
        console.error('Sign-out error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

// This should display a sign out button in the top right but it doesn't work yet
ProfileScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <Button title="Sign Out" onPress={() => handleSignOut()} />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
  signOutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;