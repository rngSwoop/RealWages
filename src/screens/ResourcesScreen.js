import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';

const ResourcesScreen = () => {

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => Linking.openURL('https://www.ziprecruiter.com')}>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>
            Jobs in Your Area
          </Text>

          <Text style={styles.body}>
            Click here for job site
          </Text>

          <Text style={styles.description}>
            ZipRecruiter: Online job marketplace connecting employers and seekers with algorithm-based matching. Job seekers can upload resumes for visibility.
          </Text>
        </View>
      </TouchableOpacity>
        
      <View style={styles.line}></View>

      <TouchableOpacity onPress={() => Linking.openURL('https://www.indeed.com/career-advice/pay-salary/guide-how-to-ask-for-a-raise')}>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>
          How To Ask For a Raise
          </Text>

          <Text style={styles.body}>
            Click here for tips to asking for a raise
          </Text>

          <Text style={styles.description}>
            In this video, we explain how to ask for a raise, how to calculate your ask, measure your contributions and help you earn what you deserve.
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.line}></View>

      <TouchableOpacity onPress={() => Linking.openURL('https://www.nerdwallet.com/article/finance/how-to-save-money')}>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>
          Ways to Save Money
          </Text>

          <Text style={styles.body}>
            Click here for tips to save money
          </Text>

          <Text style={styles.description}>
            Money-saving tips include shopping smart, bundling services, canceling subscriptions and more.
          </Text>        
        </View>
      </TouchableOpacity>
      
      <View style={styles.line}></View>

      <TouchableOpacity onPress={() => Linking.openURL('https://play.google.com/store/search?q=budgeting+apps+free&c=apps&hl=en_US&gl=US')}>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>
          Budgeting Apps
          </Text>

          <Text style={styles.body}>
            Click here for budgeting apps on the Google Play Store
          </Text>

          <Text style={styles.description}>
            Discover top-rated budgeting apps on Google Play. Easily manage expenses, track income, and set savings goals for financial success.
          </Text>
        </View>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: "#535c79",
    padding: 15
  },
  header: {
    color: "#dad873",
    fontSize: 20,
    fontWeight: '600',
  },
  sectionContainer: {
    padding: 5,
    paddingRight: 40,
    width: '100%',
    margin: 10
  },
  body: {
    color: "#58b368",
  },
  description: {
    // color: "#309975",
    color: "white"
  },
  line: {
    borderBottomColor: '#efeeb4',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ResourcesScreen;