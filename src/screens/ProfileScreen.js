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
import { doc, getDoc, setDoc, addDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const ProfileScreen = ({navigation}) => {
    // Customizing the header
    const navigationOptions = {
      title: 'Profile', // Set the title of the header
      headerStyle: {
        backgroundColor: '#3e455b', // Set the background color of the header
      },
      headerTintColor: '#efeeb4', // Set the text color of the header
      headerTitleStyle: {
        fontWeight: 'bold', // Set the font weight of the title
      },
      headerTitleAlign: 'left',
    };

    // Apply the navigation options
    React.useLayoutEffect(() => {
      navigation.setOptions(navigationOptions);
    }, [navigation]);


  const [data, setData] = useState([]); // State to hold the list of entries
  const [modalVisible, setModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newWage, setNewWage] = useState('');
  const { userID } = useContext(UserContext); // grab current userID from our context

  // Function to sort data based on date
  const sortDataByDate = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(`20${a.date.slice(-2)}-${a.date.slice(0, 2)}-${a.date.slice(3, 5)}`);
      const dateB = new Date(`20${b.date.slice(-2)}-${b.date.slice(0, 2)}-${b.date.slice(3, 5)}`);
      return dateA - dateB;
    });
  };

  // Function to fetch user-specific wage data from Firestore
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

        setData(userWageData);
      } catch (error) {
        console.error('Error fetching user wage data:', error);
      }
    };

    useEffect(() => {
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
      // Add the new entry to Firestore
      const { documentId } = await addEntryToFirestore(newDate, newWage);

      // Add new entry to the list
      setData([...data, { documentId, date: newDate, wage: newWage }]);

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

      const docRef = await addDoc(wageDataCollection, {
        userID: userID,
        date: date,
        wage: wage,
      });

      // Get the ID of the added document from the reference
      const documentId = docRef.id;

      return { documentId, docRef }; // Return the document ID and reference
    } catch (error) {
      console.error('Error adding user wage data:', error);
      throw error; // Propagate the error upwards
    }
  };

  const deleteItem = async item => {
    try {

        // Delete the document from the 'wageData' collection
        const docRef = doc(collection(firestore, 'wageData'), item.documentId);
        await deleteDoc(docRef);

        // Update the local state to reflect the deletion
        const filteredData = data.filter(entry => entry !== item);
        setData(filteredData);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
  };

  const editItem = async (item) => {
    try {
      // Set the input fields to the values of the edited item
      setNewDate(item.date);
      setNewWage(item.wage);
      setModalVisible(true);

      // Handle editing
      const handleEdit = async () => {
        const wageDataCollection = collection(firestore, 'wageData');
        const docRef = doc(wageDataCollection, item.documentId);

        await setDoc(docRef, {
          date: newDate,
          wage: newWage,
        });

        // Update the local state with the edited item
        const updatedData = data.map((entry) => {
          if (entry.documentId === item.documentId) {
            return {
              ...entry,
              date: newDate,
              wage: newWage,
            };
          }
          return entry;
        });
        setData (updatedData);

        // Close the modal after editing
        setModalVisible(false);

        // Fetch updated data after editing
        await fetchUserWageData();
      };

      // Delete the previous item
      deleteItem(item);

      // Return the function to perform editing
      return handleEdit;
    } catch (error) {
      console.error('Error editing item:', error);
    }
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
          <Text style={styles.buttonText}>Add Entry</Text>
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
    //borderWidth: 1,
  },
  listItemContainer: {
    alignItems: 'center',
    width: '65%',
    flexDirection: 'row',
    borderColor: 'blue',
    //borderWidth: 1,
  },
  listItem: {
    marginVertical: 10,
    width: '100%',
    borderColor: 'red',
    //borderWidth: 1,
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
