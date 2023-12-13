import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity, SizedBox } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { UserContext } from '../assets/UserContext';
import { firestore } from '../../firebase';
import { doc, getDoc, setDoc, addDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const Graph2 = () => {
    const [data, setData] = useState([]); // State to hold the user data
    const [wageDataArray, setWageDataArray] = useState([]);
    const [chartData, setChartData] = useState(null); // State for LineChart data
    const [runNextFunc, setRunNextFunc] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const { userID } = useContext(UserContext);

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
                    data: wageDataArray,
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                    strokeWidth: 2,
                },
            ],
        };

        // Set the LineChart data
        setChartData(newChartData);
        // Check if wageDataArray has data (non-empty array)
        if (wageDataArray && wageDataArray.length > 0) {
            setDataFetched(true);
        }
    }, [data, runNextFunc]);


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