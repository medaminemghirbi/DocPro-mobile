import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import StyledSelectList from '../components/SelectList';
import { API_BASE_URL } from '../services/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validation functions
const nameValidator = (name) => {
  if (!name.trim()) return 'Name cannot be empty';
  if (!/^[A-Za-z]+$/.test(name)) return 'Name must contain only letters';
  return '';
};

const emailValidator = (email) => {
  if (!email.trim()) return 'Email cannot be empty';
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!regex.test(email)) return 'Please enter a valid email address';
  return '';
};

const passwordValidator = (password) => {
  if (!password.trim()) return 'Password cannot be empty';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return '';
};

const roleValidator = (role) => {
  if (!role) return 'Please select a role';
  return '';
};
const genderValidator = (role) => {
  if (!role) return 'Please select a gender';
  return '';
};

const gouvernementValidator = (gouvernement) => {
  if (!gouvernement) return 'Please select a gouvernement';
  return '';
};

function RegisterScreen({ navigation }) {
  const [firstname, setFirstName] = useState({ value: '', error: '' });
  const [lastname, setLastName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [selectedGender, setSelectedGender] = useState('');

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGouvernement, setSelectedGouvernement] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = [
    { key: 'Doctor', value: 'Doctor' },
    { key: 'Patient', value: 'Patient' },
  ];
  const gender = [
    { key: 'male', value: 'male' },
    { key: 'female', value: 'female' },
  ];
  const location = [
    { key: 'ben-arous', value: 'ben-arous' },
    { key: 'bizerte', value: 'bizerte' },
    { key: 'beja', value: 'beja' },
    { key: 'gabes', value: 'gabes' },
    { key: 'gafsa', value: 'gafsa' },
    { key: 'ariana', value: 'ariana' },
    { key: 'hammamet', value: 'hammamet' },
    { key: 'jendouba', value: 'jendouba' },
    { key: 'kairouan', value: 'kairouan' },
    { key: 'kasserine', value: 'kasserine' },
    { key: 'kebili', value: 'kebili' },
    { key: 'la-manouba', value: 'la-manouba' },
    { key: 'le-kef', value: 'le-kef' },
    { key: 'mahdia', value: 'mahdia' },
    { key: 'medenine', value: 'medenine' },
    { key: 'monastir', value: 'monastir' },
    { key: 'nabeul', value: 'nabeul' },
    { key: 'sfax', value: 'sfax' },
    { key: 'sidi-bou-zid', value: 'sidi-bou-zid' },
    { key: 'siliana', value: 'siliana' },
    { key: 'sousse', value: 'sousse' },
    { key: 'tataouine', value: 'tataouine' },
    { key: 'tozeur', value: 'tozeur' },
    { key: 'tunis', value: 'tunis' },
    { key: 'zaghouan', value: 'zaghouan' },
  ];

  const onSignUpPressed = async () => {
    setLoading(true);
    const firstnameError = nameValidator(firstname.value);
    const lastnameError = nameValidator(lastname.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const roleError = roleValidator(selectedRole);
    const genderError = genderValidator(selectedGender);

    const gouvernementError = gouvernementValidator(selectedGouvernement);

    if (firstnameError || lastnameError || emailError || passwordError || roleError || gouvernementError) {
      setFirstName({ ...firstname, error: firstnameError });
      setLastName({ ...lastname, error: lastnameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setSelectedRole(...selectedRole,roleError);
      setSelectedGender(...selectedGender,genderError);
      setSelectedGouvernement(...selectedGouvernement,gouvernementError);
      setLoading(false);
      return;
    }

      try{
        const response = await fetch(`${API_BASE_URL}/api/mobile/registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registration:{
              lastname: lastname.value,
              firstname: firstname.value,
              email: email.value,
              password: password.value,
              gender: selectedGender,
              type: selectedRole,
              location: selectedGouvernement,
            }
          }),
        });
        const data = await response.json();
        if (data.status==500) {
          const errorMessage = data.errors ? data.errors.join(', ') : 'Something went wrong. Please try again.';
          Alert.alert('Registration Failed', errorMessage);
        }else{
          if(data.status == 200){
            await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
            const userRole = data.type;
            await AsyncStorage.setItem('userRole', userRole);
            navigation.navigate('Confirmation');
          }
        }
      } catch (error) {
      console.error('Error during Registration:', error);
      Alert.alert('Registration Failed', 'Please check your connection and try again.');
    }finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ImageBackground source={require('../assets/images/image.png')} style={styles.backgroundImage}>
        <BackButton goBack={navigation.goBack} />
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome to DocPro</Text>

          {/* First Name */}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#666"
            value={firstname.value}
            onChangeText={(text) => setFirstName({ value: text, error: '' })}
          />
          {firstname.error ? <Text style={styles.errorText}>{firstname.error}</Text> : null}

          {/* Last Name */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#666"
            value={lastname.value}
            onChangeText={(text) => setLastName({ value: text, error: '' })}
          />
          {lastname.error ? <Text style={styles.errorText}>{lastname.error}</Text> : null}

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
          />
          {email.error ? <Text style={styles.errorText}>{email.error}</Text> : null}

          {/* Password */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: '' })}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
            </TouchableOpacity>
          </View>
          {password.error ? <Text style={styles.errorText}>{password.error}</Text> : null}
          {/* Select Gender */}
          <StyledSelectList
            setSelected={(val) => setSelectedGender(val)}
            data={gender}
            save="value"
            placeholder="Select Gender"
          />
          {selectedRole.error ? <Text style={styles.errorText}>{selectedRole.error}</Text> : null}

          {/* Select Role */}
          <StyledSelectList
            setSelected={(val) => setSelectedRole(val)}
            data={data}
            save="value"
            placeholder="Select Role"
          />
          {selectedRole.error ? <Text style={styles.errorText}>{selectedRole.error}</Text> : null}

          {/* Select Gouvernement */}
          <StyledSelectList
            setSelected={(val) => setSelectedGouvernement(val)}
            data={location}
            save="value"
            placeholder="Select Gouvernement"
          />
          {selectedGouvernement.error ? <Text style={styles.errorText}>{selectedGouvernement.error}</Text> : null}

          {/* Sign-Up Button */}
          <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" /> // Show loader when loading
        ) : (
          'Create Account Now'
        )}
      </Button>
        </View>
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
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0F9BAE',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginVertical: 5,
  },
});

export default RegisterScreen;
