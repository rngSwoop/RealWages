import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// will get rid of this once we are pulling from database
class dummyUserEntry {
  constructor(wage, date) {
    this.wage = wage;
    this.date = date;
  }
}

// this will stay, need endDate for each entry
class wageGraphDatapoint {
  constructor(wage, startDate, endDate) {
    this.wage = wage;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

const App = () => {
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

  // // this needs to be pulled from the database, just making a dummy list for now
  // let userWageData = [];
  // // pushing dummy data
  // userWageData.push(new dummyUserEntry(35000, '2023-01-01'));
  // userWageData.push(new dummyUserEntry(37500, '2023-06-01'));

  // let wageData = [];
  // for (let i = 0; i < userWageData.length; i++) {
  //   let wage = userWageData[i].wage;
  //   let startDate = userWageData[i].date;
  //   let endDate;

  //   if (i + 1 < userWageData.length) {
  //     // if not the last entry, set endDate to the next entries startDate
  //     endDate = userWageData[i + 1].date;
  //   } else {
  //     // if last entry, set endDate to todays date
  //     endDate = new Date().toISOString().split('T')[0];
  //   }

  //   wageData.push(new wageGraphDatapoint(wage, startDate, endDate));
  // }

  // const inflationRate = 0.02;
  // const inflationAdjustedData = [];

  // userWageData.forEach((wage, wageIndex) => {
  //   for (let month = wage.startDate; month <= wage.endDate; month++) {
  //     let cumulativeInflation = Math.pow(1 + inflationRate, (month - wages[wageIndex].startPeriod) / 12);
  //     let adjustedWage = wage.amount * cumulativeInflation;
  //     inflationAdjustedData.push(adjustedWage);
  //   }
  // })

  const wages = [
    { amount: 50000, startPeriod: 0, endPeriod: 12 }, // Wage for 12 months
    { amount: 52000, startPeriod: 12, endPeriod: 24 }, // Next wage for the following 12 months
    // ... more wages as needed
  ];

  const inflationRate = 0.02; // Annual inflation rate of 2% for simplicity

  // Preparing the wage and inflation-adjusted data
  let wageData = [];
  let inflationAdjustedData = [];

  wages.forEach((wage, wageIndex) => {
    for (let month = wage.startPeriod; month <= wage.endPeriod; month++) {
      wageData.push(wage.amount);

      // Calculate the cumulative inflation since the start of this wage period
      let cumulativeInflation = Math.pow(1 + inflationRate, (month - wages[wageIndex].startPeriod) / 12);
      let adjustedWage = wage.amount * cumulativeInflation;
      inflationAdjustedData.push(adjustedWage);
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10 }}>
          Wage vs. Inflation Over Time
        </Text>
        <LineChart
          data={{
            labels: ['2019', '2020', '2021', '2022'],
            datasets: [
              {
                data: wageData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Color for wage line
                strokeWidth: 5,
              },
              {
                data: inflationAdjustedData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Color for inflation-adjusted line
                strokeWidth: 5,
              }
            ],
          }}
          width={400} // from react-native
          height={220}
          withDots={false}
          yAxisLabel="$"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
          }}
          style={{
            marginVertical: 8,
            margin: 15,
            borderRadius: 16
          }}
        />
        <Text>Graph 1</Text>
        <View style={styles.line}></View>
        <Text>Graph 2</Text>
        <View style={styles.line}></View>
        <Text>Graph 3</Text>
        <View style={styles.line}></View>

        {buttons.map((button, index) => (
          <View key={index} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress(index)}
            >
              <Text>{button.label}</Text>
            </TouchableOpacity>
            {visibleIndex === index && (
              <View style={styles.definitionContainer}>
                <Text>{button.definition}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginBottom: 5, // Add margin to separate each button and the definitions
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: "#DDDDDD",
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

export default App;
