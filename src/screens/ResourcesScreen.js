import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Linking } from 'react-native';

const ResourcesScreen = () => {

  return (
    <View style={styles.container}>
      <Text onPress={() => Linking.openURL('https://www.ziprecruiter.com')}>
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

      <Text onPress={() => Linking.openURL('https://www.indeed.com/career-advice/pay-salary/guide-how-to-ask-for-a-raise')}>
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

      <Text onPress={() => Linking.openURL('https://www.nerdwallet.com/article/finance/how-to-save-money')}>
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

      <Text onPress={() => Linking.openURL('https://play.google.com/store/search?q=budgeting+apps+free&c=apps&hl=en_US&gl=US')}>
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