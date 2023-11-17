import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ResourcesScreen = () => {

  return (
    <View style={styles.container}>
      <Text>
        <Text style={styles.header}>
          Jobs in Your Area{"\n"}
        </Text>

        <Text style={styles.body}>
          Direct Link to job site{"\n"}
        </Text>

        <Text style={styles.description}>
          Short description of job site{"\n"}
        </Text>
      </Text>
      
      <View style={styles.line}></View>

      <Text>
        <Text style={styles.header}>
          How To Ask For a Raise{"\n"}
        </Text>

        <Text style={styles.body}>
          Direct Link to job site{"\n"}
        </Text>

        <Text style={styles.description}>
          Short description of job site{"\n"}
        </Text>
      </Text>
      
      <View style={styles.line}></View>

      <Text>
        <Text style={styles.header}>
          Ways to Save Money{"\n"}
        </Text>

        <Text style={styles.body}>
          Direct Link to job site{"\n"}
        </Text>

        <Text style={styles.description}>
          Short description of job site{"\n"}
        </Text>
      </Text>
      
      <View style={styles.line}></View>

      <Text>
        <Text style={styles.header}>
          Budgeting Apps{"\n"}
        </Text>

        <Text style={styles.body}>
          Direct Link to job site{"\n"}
        </Text>

        <Text style={styles.description}>
          Short description of job site{"\n"}
        </Text>
      </Text>
      
      <View style={styles.line}></View>

      <Text>
        <Text style={styles.header}>
          Header{"\n"}
        </Text>

        <Text style={styles.body}>
          Direct Link to job site{"\n"}
        </Text>

        <Text style={styles.description}>
          Short description of job site{"\n"}
        </Text>
      </Text>
      
      <View style={styles.line}></View>

      <Text>
        <Text style={styles.header}>
          Header{"\n"}
        </Text>

        <Text style={styles.body}>
          Direct Link to job site{"\n"}
        </Text>

        <Text style={styles.description}>
          Short description of job site{"\n"}
        </Text>
      </Text>
      
      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'left',
    padding: 15,
  },
  header: {
    color: "red",
    fontSize: 20,
  },
  body: {
    color: "blue",
  },
  description: {
    color: "green",
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ResourcesScreen;