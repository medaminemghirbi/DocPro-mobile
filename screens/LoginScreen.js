import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/apiConfig';

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mobile/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user:{
            email,
            password,
          }
        }),
      });
      const data = await response.json();
      if (data.status==401) {
        Alert.alert('Login Failed', 'Wrong Email or password.');
      }else if(data.user.email_confirmed == false){
        Alert.alert('Login Failed', 'Your Account is not confirmed Check your email.');
      }else{
        if(data.logged_in){
          const token = data.token;
          const userRole = data.type;
          await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
          await AsyncStorage.setItem('id', data.user.id);
          await AsyncStorage.setItem('authToken', token);

          if (userRole === "Doctor") {
            navigation.navigate("Doctor");
          } else{
            navigation.navigate("Patient");
          } 
        }
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your connection and try again.');
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const requestNewPassword = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/newpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', data.message);
        toggleModal();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message);
      }
    } catch (error) {
      console.error('Error requesting new password:', error);
      Alert.alert('Error', 'An error occurred while requesting a new password. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ImageBackground source={require('../assets/images/image.png')}style={styles.backgroundImage}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToRegister}>
          <Text  style={styles.buttonText}>New Here?</Text>
          </TouchableOpacity>
          <TouchableOpacity >
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={showModal} animationType="slide" transparent>
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Reset Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <TouchableOpacity onPress={requestNewPassword} style={styles.button}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.link}>Back</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F9BAE',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BCE4EA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F3FAFB',
    color: '#0F9BAE',
  },
  button: {
    backgroundColor: '#0F9BAE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#0F9BAE',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default Login;
