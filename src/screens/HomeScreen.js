import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity, SizedBox } from 'react-native';
import Graph from '../components/Graph';

const HomeScreen = () => {
  const [visibleIndex, setVisibleIndex] = useState(null);

  const buttons = [
    { label: "What is Inflation?", definition: "Inflation is the rate at which the general level of prices for goods and services is rising, and consequently, the value of your money is eroding. In simpler terms, when there is inflation, each dollar you have buys you less than it did before, making it harder to afford the same things you could with the same amount of money in the past." },
    { label: "An Example of Inflation", definition: "Imagine you have $100 today, and the inflation rate is 2%. If there is 2% inflation over the next year, you would need $102 to purchase the same goods and services that $100 could buy you the previous year. This means that the value of your money has decreased because prices have gone up." },
    { label: "Why does Inflation happen?", definition: "Inflation happens when the overall demand for goods and services outpaces their supply, leading to a sustained increase in prices. Factors such as increased consumer demand, rising production costs, and disruptions to supply chains contribute to inflation. Additionally, monetary policies, wage-price dynamics, and global influences play significant roles in shaping inflationary trends in an economy." },
    { label: "How is inflation Measured?", definition: "Inflation is measured by various indices, with the Consumer Price Index (CPI) being a common one. CPI tracks the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services." },
    { label: "Problems with measuring inflation", definition: "Measuring inflation faces challenges due to the static nature of the basket of goods and services, potentially overlooking shifts in consumer spending habits. Quality changes in products, globalization, and the rapid introduction of new technologies can lead to inaccuracies in tracking price changes over time. Additionally, the fixed weights assigned to items in the inflation basket and the timing of price data collection pose limitations, impacting the precision of inflation measurements." },
    { label: "How can YOU beat inflation", definition: "If you're living paycheck to paycheck, prioritize building a modest emergency fund to cushion against unexpected expenses. Create a budget focused on essential needs, cutting down on discretionary spending. Explore additional income sources, consider government assistance programs, and manage debt to improve your financial resilience over time." },
    { label: "Historical Inflation rate for the US", definition: "Since 2008, the United States has generally experienced moderate inflation, with rates staying below 2% for much of the 2010s. The COVID-19 pandemic in 2020 caused fluctuations, and in 2021, inflation temporarily exceeded 5% due to factors like supply chain disruptions. In 2022, inflation remained a monitored concern, with central banks adjusting policies based on economic conditions." },
  ];

  const handleButtonPress = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 5, fontWeight: "bold", color: "black" }}>
          Wage vs. Inflation
        </Text>
        <Graph/>
        <View style={styles.buttonView}>
          {buttons.map((button, index) => (
            <View key={index} style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleButtonPress(index)}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
              {visibleIndex === index && (
                <View style={styles.definitionContainer}>
                  <Text style={styles.definitonText}>{button.definition}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    color: "black",
  },
  definitionText: {
    color: "black",
  },
  buttonView: {
    width: "100%",
    marginTop: 25,
  },
  titleUnderline: {
    height: 1,
    backgroundColor: "grey",
    width: "100%",
    marginBottom: 15,
  },
  buttonContainer: {
    //marginBottom: 5, // Add margin to separate each button and the definitions
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "black",
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomColor: "grey",
    borderRadius: 10,
    width: '100%',
    alignItems: "center",
  },
  definitionContainer: {
    padding: 10,
    margin: 5,
    border: "1px solid #CCCCCC",
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default HomeScreen;
