import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity, SizedBox } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { UserContext } from '../assets/UserContext';
import { firestore } from '../../firebase';
import { doc, getDoc, setDoc, addDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const Graph2 = () => {
    const [data, setData] = useState([]); // State to hold the user data
    const [wageDataArray, setWageDataArray] = useState([]);
    const [adjustedWages, setAdjustedWages] = useState([]);
    const [chartData, setChartData] = useState(null); // State for LineChart data
    const [runNextFunc, setRunNextFunc] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const { userID } = useContext(UserContext);

    const [formattedWages, setFormattedWages] = useState([]);

    const wages = [];

    const fetchUserWageData = async () => {
        try {
            const wageDataCollection = collection(firestore, 'wageData');
            const q = query(wageDataCollection, where('userID', '==', userID));
            const querySnapshot = await getDocs(q);

            const userWageData = [];
            querySnapshot.forEach(doc => {
                const { date, wage } = doc.data();
                const documentId = doc.id; // get the document ID
                userWageData.push({ documentId, date, wage });
            });

            userWageData.sort((a, b) => {
                const dateA = new Date(
                    // Assuming date format is MM/DD/YY
                    `20${a.date.slice(-2)}-${a.date.slice(0, 2)}-${a.date.slice(3, 5)}`
                );
                const dateB = new Date(
                    `20${b.date.slice(-2)}-${b.date.slice(0, 2)}-${b.date.slice(3, 5)}`
                );

                return dateA - dateB;
            });

            // Formatting the wage data into the desired structure
            let previousWage = null;

            userWageData.forEach((dataPoint, index) => {
                const formattedDate = `20${dataPoint.date.slice(-2)}-${dataPoint.date.slice(0, 2)}-${dataPoint.date.slice(3, 5)}`;
                if (index === 0) {
                    previousWage = {
                        startDate: formattedDate,
                        wage: dataPoint.wage,
                    };
                } else {
                    wages.push({
                        startDate: previousWage.startDate,
                        endDate: formattedDate,
                        wage: previousWage.wage,
                    });

                    previousWage = {
                        startDate: formattedDate,
                        wage: dataPoint.wage,
                    };
                }
            });

            // Add the last wage entry (if any)
            if (previousWage !== null) {
                wages.push({
                    startDate: previousWage.startDate,
                    endDate: new Date().toISOString().slice(0, 10), // Set the end date to today's date
                    wage: previousWage.wage,
                });
            }

            console.log('Formatted wages:', wages);
            setFormattedWages(wages);

            //console.log(userWageData);
            setData(userWageData);
            setRunNextFunc(true);
        } catch (error) {
            console.error('Error fetching user wage data:', error);
        }
    };

    useEffect(() => {
        fetchUserWageData();
    }, [userID]);

   // update inflation data
   useEffect(() => {
       if (runNextFunc) {
           const fetchInflationForWages = async () => {
               console.log("Wages state: ", formattedWages);
               if (formattedWages.length === 0) {
                   // Handle empty wages array condition
                   console.log('Wages array is empty');
                   return;
               }

               try {
                   const inflationData = await Promise.all(formattedWages.map(dataPoint => {
                       return fetchInflation({
                           startDate: dataPoint.startDate,
                           endDate: dataPoint.endDate,
                           wage: dataPoint.wage,
                       });
                   }));

                   console.log("Inflation Data: ", inflationData);
                   setAdjustedWages(inflationData);
                   setDataFetched(true);
               } catch (error) {
                   console.error('Error fetching inflation data:', error);
               }
           };

           fetchInflationForWages();
       }
   }, [runNextFunc, formattedWages]);

    const fetchInflation = async ({ startDate, endDate, wage }) => {
        try {
            const response = await fetch(`https://www.statbureau.org/calculate-inflation-price-json?country=united-states&start=${startDate}&end=${endDate}&amount=${wage}&format=true`);
            const data = await response.json();
            return { startDate, endDate, wage: data };
        } catch (error) {
            console.error('Error fetching inflation data:', error);
            throw error;
        }
    };

    // Logic to prepare wageDataArray and set LineChart data
    useEffect(() => {
        if (data.length === 0) return; // Ensure data is available

        const years = data.map(dataPoint => {
            const dateParts = dataPoint.date.split('/'); // Assuming the date format is MM/DD/YY or MM/DD/YYYY
            return parseInt(dateParts[2], 10); // Get the year part
        });

        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);

        // Calculate the number of labels
        const xLabels = [];
        //if the minYear and maxYear are up to 5 years apart, then show every year
        if (maxYear - minYear <= 5) {
            for (let i = minYear; i <= maxYear; i++) {
                xLabels.push((i+2000).toString());
            }
        } else {
            //otherwise, if the difference between minYear and maxYear is even, then show 4 years
            if ((maxYear - minYear) % 2 == 0) {
                xLabels.push((minYear+2000).toString());
                xLabels.push((minYear + Math.floor((maxYear - minYear) / 3))+2000);
                xLabels.push((minYear + Math.floor(2 * (maxYear - minYear) / 3))+2000);
                xLabels.push((maxYear+2000).toString());
            } else {
                xLabels.push((minYear+2000).toString());
                xLabels.push((minYear + Math.floor((maxYear - minYear) / 4))+2000);
                xLabels.push((minYear + Math.floor(2 * (maxYear - minYear) / 4))+2000);
                xLabels.push((minYear + Math.floor(3 * (maxYear - minYear) / 4))+2000);
                xLabels.push((maxYear+2000).toString());
            }
        }
        
        console.log("xLabels: ", xLabels);
        console.log("Number of indices: ", (maxYear - minYear + 1) * 12);

        const tempArray = Array.from({ length: (maxYear - minYear + 1) * 12 }, (_, i) => {
            const currentYear = Math.floor(i / 12) + minYear;
            const currentMonth = (i % 12) + 1;

            let existingWage = 0; // Set a default value for existingWage

            const matchingData = data.find(dataPoint => {
                const year = parseInt(dataPoint.date.slice(-2), 10);
                const month = parseInt(dataPoint.date.split('/')[0], 10);
                return year === currentYear && month === currentMonth;
            });

            if (matchingData) {
                existingWage = parseInt(matchingData.wage, 10); // Update existingWage
                return existingWage;
            } else if (i > 0) {
                return existingWage; // Use the last found wage value
            } else {
                return 0;
            }

            return existingWage;
        });

        for (let i = 0; i < tempArray.length; i++) {
            if (tempArray[i] == 0 && i > 0) {
              tempArray[i] = tempArray[i-1];
            }
        }

        setWageDataArray(tempArray);
        console.log("wageDataArray", wageDataArray);

        // Prepare LineChart data object
        const newChartData = {
            labels: xLabels,
            datasets: [
                {
                    data: [50000, 50000, 50000, 50000, 50000, 50000, 50000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 75000, 90000, 90000, 90000, 90000, 90000, 90000, 90000, 90000],
                    color: () => `rgba(48, 200, 117, 1)`, // Black with opacity 1
                    strokeWidth: 2,
                },
                {
                    data: [50000, 50028, 50056, 50084, 50112, 50140, 50168, 75000, 75156, 75312, 75468, 75624, 75780, 75936, 76092, 76248, 76404, 76560, 76716, 76872, 90000, 90734, 91468, 92202, 92936, 93670, 94404, 95138],
                    color: () => `rgba(255, 0, 0, .7)`, // Red with opacity 0.5
                    strokeWidth: 2,
                }
            ],
        };

        // Set the LineChart data
        setChartData(newChartData);
        // Check if wageDataArray has data (non-empty array)
        if (wageDataArray && wageDataArray.length > 0) {
            setDataFetched(true);
        }
    }, [data, runNextFunc]);

    // When wage data array changes, build inflation array
    useEffect(() => {
        if (adjustedWages.length === 0 || wageDataArray.length === 0) return;

        const inflationArray = Array(wageDataArray.length).fill(0); // Declare array of the size of the wage data array
        let startIndex = 0;

        adjustedWages.forEach((adjustedWage, index) => {
            const adjustedValue = parseFloat(adjustedWage.wage.replace('$', '').replace(',', '')); // Assuming the adjusted wage is in a string format like "$50 198.27"
            const startDate = new Date(adjustedWage.startDate);
            const endDate = new Date(adjustedWage.endDate);
            const intervalBetweenWages = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            console.log("intervalBetweenWages: ", intervalBetweenWages);

            let endIndex = index === adjustedWages.length - 1 ? wageDataArray.length : startIndex + intervalBetweenWages; // Calculate endIndex for each section
            console.log("endIndex: ", endIndex);

            const rateOfChange = adjustedValue - wageDataArray[startIndex]; // Calculate the rate of change
            console.log("rateOfChange: ", rateOfChange);

            for (let i = startIndex; i < endIndex; i++) {
                inflationArray[i] = wageDataArray[i] + (rateOfChange * (i - startIndex + 1) / intervalBetweenWages); // Update values based on rate of change
            }

            startIndex = endIndex;
        });

        // Do something with the inflationArray here, like setting it to state
        console.log("Lets hope this works: ", inflationArray);
    }, [wageDataArray, adjustedWages]);


    return (
        <View style={styles.container}>
            {/* LineChart component to render the processed chart data */}
            {dataFetched ? (
                <LineChart
                  data={chartData}
                  width={400}
                  height={220}
                  withDots={false}
                  yAxisLabel="$"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fff59d", // Lighter shade of yellow
                    backgroundGradientTo: "#e1a025",   // Darker shade of yellow
                    decimalPlaces: 0,
                    color: () => `rgba(70, 70, 70, .3)`, // Adjust the line color
                    labelColor: () => `rgba(70, 70, 70, 1)`, // Adjust the text color and opacity
                    fillShadowGradientOpacity: 0,
                    useShadowColorFromDataset: true
                  }}
                  style={{
                    marginVertical: 8,
                    margin: 15,
                    borderRadius: 16
                  }}
                />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Other styles...
});

export default Graph2;