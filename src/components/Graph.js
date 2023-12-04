import React from 'react';
import { LineChart } from 'react-native-charts-wrapper';
import { Dimensions } from 'react-native';

const wageData = [
    { wage: 50000, date: '2020-01-01' },
    { wage: 55000, date: '2021-06-15' },
    { wage: 60000, date: '2022-03-10' },
    // Add more entries as needed
];

// const processData = (data) => {
//     let processedData = [];
//     data.forEach((item, index) => {
//         processedData.push(item.wage); // Start of the wage level
//         if (index < data.length - 1) {
//             // Extend the same wage level until the next one starts
//             processedData.push(item.wage);
//         }
//     });
//     return [{ data: processedData }];
// };

const processData = (data) => {
    let chartData = [];

    data.forEach((item, index) => {
        // Convert the date to a format that can be used as an x-value, e.g., timestamp
        const dateAsTimestamp = new Date(item.date).getTime();

        // Add a point for the start of the wage
        chartData.push({ x: dateAsTimestamp, y: item.wage });

        // If this is not the last item, add another point for the end of the wage period
        if (index < data.length - 1) {
            const endDateAsTimestamp = new Date(data[index + 1].date).getTime();
            chartData.push({ x: endDateAsTimestamp, y: item.wage });
        }
        // If it's the last item, use the current date as the end date
        else {
            const currentDateAsTimestamp = new Date().getTime();
            chartData.push({ x: currentDateAsTimestamp, y: item.wage });
        }
    });

    return chartData;
};

// const getUniqueYears = (data) => {
//     const years = data.map(item => new Date(item.date).getFullYear().toString());
//     return [...new Set(years)]; // Removing duplicates
// };

const addEndDateToWageData = (data) => {
    return data.map((item, index) => {
        let endDate = index < data.length - 1 ? data[index + 1].date : new Date().toISOString().split('T')[0];
        return { ...item, endDate };
    });
};

const modifiedWageData = addEndDateToWageData(wageData);
// const uniqueYears = getUniqueYears(wageData);

// const chartData = {
//     labels: uniqueYears,
//     datasets: processData(modifiedWageData)
// };

const chartData = {
    dataSets: [{
        values: processData(modifiedWageData),
        label: 'Wage Data',
        config: {
            color: 'black', // Set the color as needed
            lineWidth: 2,   // Set the line width as needed
        },
    }],
};

const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
};

const Graph = () => {
    return (
        <LineChart
            style={{ flex: 1 }}
            data={chartData}
            width={Dimensions.get('window').width}
            height={220}
            yAxisLabel="$"
            yAxisInterval={1}
            chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier={false}
        />
    );
};


export default Graph;