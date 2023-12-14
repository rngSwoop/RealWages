import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity, SizedBox } from 'react-native';
import Graph from '../components/Graph';
import Graph2 from '../components/Graph2';

const HomeScreen = ({ navigation }) => {
  const [visibleIndex, setVisibleIndex] = useState(null);

  // Customizing the header
  const navigationOptions = {
    title: 'Home', // Set the title of the header
    headerStyle: {
      backgroundColor: '#3e455b', // Set the background color of the header
    },
    headerTintColor: '#efeeb4', // Set the text color of the header
    headerTitleStyle: {
      fontFamily: 'Roboto-Bold', // Set the font of the title
    },
    headerTitleAlign: 'left',
  };

  // Apply the navigation options
  React.useLayoutEffect(() => {
    navigation.setOptions(navigationOptions);
  }, [navigation]);

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
        <Text style={styles.title}>
          Wage vs. Inflation
        </Text>
        <Graph2/>

        {/* Lines for Actual Wage and Adjusted Wage */}
        <View style={styles.linesContainer}>
          <Text style={[styles.line, { borderColor: 'rgba(48, 200, 117, 1)' }]}>Actual wage</Text>
          <Text style={[styles.line, { borderColor: 'rgba(255, 0, 0, .7)' }]}>Adjusted wage</Text>
        </View>

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
                  <Text style={styles.definitionText}>{button.definition}</Text>
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
  scrollContainer: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    backgroundColor: "#454d66",
  },
  title: {
    color: 'white',
    fontFamily: 'AlegreyaSans-Bold',
    fontSize: 30,
    padding: 6,
  },
  container: {
      //flex: 1,
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
      width: '100%',
      backgroundColor: "#454d66",
    },
  buttonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: "white",
  },
  definitionText: {
    fontFamily: 'Roboto-Regular',
    color: "#efeeb4",
    fontSize: 14,
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
    backgroundColor: "#636e83",
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
  linesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30, // Increased horizontal padding
    marginHorizontal: 10,
    marginTop: 10, // Adjusted top margin for space
  },
  line: {
    color: 'white',
    fontFamily: 'Roboto-Italic',
    borderBottomWidth: 2,
    alignSelf: 'center', // Center the text
    flex: 1,
    textAlign: 'center', // Center text horizontally
    marginHorizontal: 12,
  },
});

export default HomeScreen;
