import React, { useState, useContext } from 'react';
import { KeyboardAvoidingView, TouchableOpacity, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, handleSignUp, handleLogin } from '../../firebase';
//import auth from "@react-native-firebase/auth";
import { UserContext } from '../assets/UserContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('Garrett@test.com');
  const [password, setPassword] = useState('password');
  const { userID, setUserID } = useContext(UserContext);

  const handleLoginPress = () => {
    handleLogin(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('User logged in:', user.email, user.uid);
        setUserID(user.uid);
        navigation.navigate('Main');
      })
      .catch(error => {
        // Handle Firebase login errors
        switch (error.code) {
          case 'auth/user-not-found':
            alert('User not found. Please register.');
            break;
          case 'auth/wrong-password':
            alert('Invalid password. Please try again.');
            break;
          default:
            alert('Login failed. Please try again later.');
      }
    });
  };

  // Register a new user and validate credentials
  const handleSignUpPress = () => {

    // Email and Password validation
    if (!isEmailValid(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid(password)) {
      alert('Password should be at least 6 characters long');
      return;
    }

    handleSignUp(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log('User registered:', user.email, user.uid);
          setUserID(user.uid);
          navigation.navigate('Main');
        })
        .catch((error) => {
          // Handle Firebase registration errors
          switch (error.code) {
            case 'auth/email-already-in-use':
              alert('Email address is already in use');
              break;
            case 'auth/invalid-email':
              alert('Invalid email address');
              break;
            case 'auth/weak-password':
              alert('Password is too weak');
              break;
            default:
              alert('Registration failed. Please try again later.');
          }
        });
  }

  // Email validation using regex
  const isEmailValid = (email) => {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return emailPattern.test(email);
  };

  // Password validation for minimum length
  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      //behavior="padding"
    >
        <Text style={styles.headerText}>RealWages</Text>
        <View style={styles.inputContainer}>

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleLoginPress}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSignUpPress}
                style={styles.buttonOutline}
            >
                <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>


        </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginBottom: 50,
    color: 'black',
    fontWeight: '700',
    fontSize: 30,
  },
  inputContainer: {
    width: '80%',
    //backgroundColor: 'grey',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    height: 40,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    height: 50,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default LoginScreen;