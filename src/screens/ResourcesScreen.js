import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ResourcesScreen = () => {

  return (
    <View style={styles.container}>
      <Text>
        <Text style={styles.header}>Header</Text>
      </Text>
      <Text>
        <Text style={styles.body}>Body a lot of text here cause I need to see what happens</Text>
      </Text>
      <Text>
        This is another text
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
    padding: 15,
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
    fontSize: 30,
  },
  body: {
    color: "blue",
  },
});

export default ResourcesScreen;