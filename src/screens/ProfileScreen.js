import React, {useState} from 'react';
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
import {auth} from '../../firebase.js';

const ProfileScreen = ({navigation}) => {
  const [data, setData] = useState([]); // State to hold the list of entries
  const [modalVisible, setModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newWage, setNewWage] = useState('');

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

  const handleAddEntry = () => {
    // Validate input fields before adding to the list
    if (!isValidDate(newDate) || !isValidWage(newWage)) {
      // Display an alert or handle invalid input
      return;
    }

    // Add new entry to the list
    setData([...data, {date: newDate, wage: newWage}]);
    // Reset input fields and close the modal
    setNewDate('');
    setNewWage('');
    setModalVisible(false);
  };

  const isValidDate = date => {
    // You can implement more sophisticated validation here
    return /\d{2}\/\d{2}\/\d{2}/.test(date);
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
              <View style={styles.listItem}>
                <Text style={styles.listText}>Date: {item.date}</Text>
                <Text style={styles.listText}>Wage: {item.wage}</Text>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}>
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
  listItem: {
    marginVertical: 10,
    width: '100%',
  },
  listContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  listText: {
    color: 'white',
    fontSize: 16,
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
