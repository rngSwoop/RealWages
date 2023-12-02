import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const wageData = [
    { wage: 50000, date: '2020-01-01' },
    { wage: 55000, date: '2021-06-15' },
    { wage: 60000, date: '2022-03-10' },
    // Add more entries as needed
];

// const processData = (data) => {
//     let datasets = [];
//     for (let i = 0; i < data.length - 1; i++) {
//         datasets.push({
//             data: [data[i].wage, data[i].wage]
//         });
//     }
//     // Add the last wage as a flat line
//     datasets.push({
//         data: [data[data.length - 1].wage, data[data.length - 1].wage]
//     });
//     return datasets;
// };

const processData = (data) => {
    let processedData = [];
    data.forEach((item, index) => {
        processedData.push(item.wage); // Start of the wage level
        if (index < data.length - 1) {
            // Extend the same wage level until the next one starts
            processedData.push(item.wage);
        }
    });
    return [{ data: processedData }];
};

// const processData = (data) => {
//     let processedData = [];
//     data.forEach((item) => {
//         processedData.push({})
//     });
//     return processedData;
// };

const getUniqueYears = (data) => {
    const years = data.map(item => new Date(item.date).getFullYear().toString());
    return [...new Set(years)]; // Removing duplicates
};

const addEndDateToWageData = (data) => {
    return data.map((item, index) => {
        let endDate = index < data.length - 1 ? data[index + 1].date : new Date().toISOString().split('T')[0];
        return { ...item, endDate };
    });
};

const modifiedWageData = addEndDateToWageData(wageData);
const uniqueYears = getUniqueYears(wageData);

const chartData = {
    labels: uniqueYears,
    datasets: processData(modifiedWageData)
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
            data={chartData}
            width={Dimensions.get('window').width}
            height={220}
            yAxisLabel="$"
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier={false}
            style={{
                marginVertical: 8,
                borderRadius: 16,
                margin: 15
            }}
        />
    );
};

export default Graph;