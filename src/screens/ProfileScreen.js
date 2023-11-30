import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../assets/UserContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {auth, firestore } from '../../firebase.js';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const ProfileScreen = ({navigation}) => {
  const [data, setData] = useState([]); // State to hold the list of entries
  const [modalVisible, setModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newWage, setNewWage] = useState('');
  const { userID } = useContext(UserContext); // grab current userID from our context


  // Function to fetch user-specific wage data from Firestore
  // This code works but does not filter to show only docs with the correct userID
//  const fetchUserWageData = async () => {
//    try {
//      const wageDataCollection = collection(firestore, 'wageData');
//      const userWageDataSnapshot = await getDocs(wageDataCollection);
//
//      const userWageData = [];
//      userWageDataSnapshot.forEach(doc => {
//        const { date, wage } = doc.data();
//        userWageData.push({ date, wage });
//      });
//
//      setData(userWageData);
//    } catch (error) {
//      console.error('Error fetching user wage data:', error);
//    }
//  };
//
//  // Fetch user-specific wage data when component mounts
//  useEffect(() => {
//    fetchUserWageData();
//  }, []);

  // Here we are filtering for userID, but it is done locally which could be extremely inefficient
  // Need to find way to filter within the query to the db, but for now this will do
  useEffect(() => {
      const fetchUserWageData = async () => {
        try {
          const wageDataCollection = collection(firestore, 'wageData');
          const querySnapshot = await getDocs(wageDataCollection);

          const userWageData = [];
          querySnapshot.forEach(doc => {
            const { userID: docUserID, date, wage } = doc.data();
            if (docUserID === userID) {
              userWageData.push({ date, wage });
            }
          });

          setData(userWageData);
        } catch (error) {
          console.error('Error fetching user wage data:', error);
        }
      };

      fetchUserWageData();
    }, [userID]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate('Login');
        console.log('Signed out user');
      })
      .catch(error => {
        console.error('Sign-out error:', error);
      });
  };

  const handleAddEntry = async () => {
    // Validate input fields before adding to the list
    if (!isValidDate(newDate) || !isValidWage(newWage)) {
      // Display an alert or handle invalid input
      return;
    }

    try {
      // Add new entry to the list
      setData([...data, { date: newDate, wage: newWage }]);

      // Add the new entry to Firestore
      await addEntryToFirestore(newDate, newWage);

      // Reset input fields and close the modal
      setNewDate('');
      setNewWage('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding user wage data:', error);
    }
  };

  const addEntryToFirestore = async (date, wage) => {
    try {
      const wageDataCollection = collection(firestore, 'wageData');
      const docRef = doc(wageDataCollection);

      await setDoc(docRef, {
        userID: userID,
        date: date,
        wage: wage,
      });
    } catch (error) {
      console.error('Error adding user wage data:', error);
      throw error; // Propagate the error upwards
    }
  };

  const deleteItem = item => {
    // Filter out the item that was deleted
    const filteredData = data.filter(entry => entry !== item);
    setData(filteredData);
  };

  const editItem = item => {
    // Filter out the item that was edited
    const filteredData = data.filter(entry => entry !== item);
    setData(filteredData);
    // Set the input fields to the values of the edited item
    setNewDate(item.date);
    setNewWage(item.wage);
    // Open the modal
    setModalVisible(true);
  };

  const isValidDate = date => {
    // Check if the date matches the format mm/dd/yy
    const regex = /^\d{2}\/\d{2}\/\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }
    // Extract month, day, and year from the date string
    const [month, day, year] = date.split('/').map(Number);
    // Check if the month is between 1 and 12
    if (month < 1 || month > 12) {
      return false;
    }
    // Check if the day is between 1 and 31
    if (day < 1 || day > 31) {
      return false;
    }
    return true;
  };

  const isValidWage = wage => {
    // You can implement more sophisticated validation here
    const wageNumber = parseInt(wage, 10);
    return !isNaN(wageNumber) && wageNumber >= 0 && wageNumber <= 99999999;
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.listItemContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listText}>Date: {item.date}</Text>
                <Text style={styles.listText}>Wage: {item.wage}</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => editItem(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Date: mm/dd/yy"
            value={newDate}
            onChangeText={text => setNewDate(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Wage: 123456"
            value={newWage}
            onChangeText={text => setNewWage(text)}
            keyboardType="numeric" // Allow only numeric input
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddEntry}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

ProfileScreen.navigationOptions = ({navigation}) => {
  return {
    headerRight: () => (
      <Button title="Sign Out" onPress={() => handleSignOut()} />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#454d66',
    width: '100%',
  },
  listContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor: 'green',
    borderWidth: 1,
  },
  listItemContainer: {
    alignItems: 'center',
    width: '65%',
    flexDirection: 'row',
    borderColor: 'blue',
    borderWidth: 1,
  },
  listItem: {
    marginVertical: 10,
    width: '100%',
    borderColor: 'red',
    borderWidth: 1,
  },
  listText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#d11a2a',
    margin: 5,
    padding: 8,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#309975',
    padding: 8,
    borderRadius: 5,
  },
  signOutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  addButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#309975',
    borderRadius: 5,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#efeeb4',
    height: 230,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: '5%',
    borderRadius: 10,
    padding: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#309975',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#dad873',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
  signOutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default ProfileScreen;
