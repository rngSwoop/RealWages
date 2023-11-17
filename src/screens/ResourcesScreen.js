import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ResourcesScreen = () => {

  return (
    <View style={styles.container}>
      <Text>
        <Text style={styles.header}>Header{"\n"}</Text>
        <Text style={styles.body}>Body</Text>
      </Text>
    </View>
  );
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
  header: {
    color: "red",
  },
  name: {
    color: "blue",
  },
});

export default ResourcesScreen;