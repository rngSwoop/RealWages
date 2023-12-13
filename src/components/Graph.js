import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity, SizedBox } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { UserContext } from '../assets/UserContext';
import { firestore } from '../../firebase';
import { doc, getDoc, setDoc, addDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const Graph = () => {
    const [data, setData] = useState([]); // State to hold the user data
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

            console.log(userWageData);
            setData(userWageData);
        } catch (error) {
            console.error('Error fetching user wage data:', error);
        }
    };

    useEffect(() => {
        fetchUserWageData();
    }, [userID]);

    const wages = [
        { amount: 50000, startPeriod: 0, endPeriod: 12 }, // Wage for 12 months
        { amount: 52000, startPeriod: 12, endPeriod: 24 }, // Next wage for the following 12 months
        // ... more wages as needed
    ];
    // console.log("calling calculatewageperiods");
    // const calculateWagePeriods = (userWageData) => {
    //     if (!userWageData || userWageData.length === 0) {
    //         console.log("userwagedata dont exist");
    //         return []; // Return an empty array if there's no data
    //     }
    //     const wagesWithPeriods = userWageData.map((wage, index) => {
    //         // Ensure that the date is in a valid format
    //         // Example: Assuming the date format is 'YYYY-MM-DD'
    //         const startDate = new Date(wage.date);
    //         let endDate;
    //         console.log("made it here");
    
    //         if (index < userWageData.length - 1) {
    //             endDate = new Date(userWageData[index + 1].date);
    //         } else {
    //             endDate = new Date(); // Current date for the last item
    //         }
    
    //         // Here, startDate and endDate are valid Date objects
    //         const startPeriod = (startDate.getFullYear() - userWageData[0].date.getFullYear()) * 12 + startDate.getMonth();
    //         const endPeriod = (endDate.getFullYear() - userWageData[0].date.getFullYear()) * 12 + endDate.getMonth();
    
    //         return {
    //             amount: wage.wage,
    //             startPeriod,
    //             endPeriod
    //         };
    //     });
    
    //     return wagesWithPeriods;
    // };
    
    // const wages = calculateWagePeriods(data);
    

    const inflationRate = 0.02;

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
    console.log("wageData: ", wageData);

    return (

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
    )
}

export default Graph;