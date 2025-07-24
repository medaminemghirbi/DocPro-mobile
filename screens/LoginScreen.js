import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/apiConfig';
import BackButton from '../components/BackButton';
import { CameraView, useCameraPermissions } from 'expo-camera';

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email, password },
        }),
      });

      const data = await response.json();

      if (data.status === 401) {
        Alert.alert('Login Failed', 'Wrong Email or password.');
      } else if (!data.user.confirmed_at) {
        Alert.alert('Login Failed', 'Your account is not confirmed. Check your email.');
      } else if (data.logged_in) {
        const token = data.token;
        const userRole = data.type;

        await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
        await AsyncStorage.setItem('id', data.user.id);
        await AsyncStorage.setItem('authToken', token);

        navigation.navigate(userRole === "Doctor" ? "Doctor" : "Patient");
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        toggleModal();
      } else {
        Alert.alert('Error', data.message || 'Request failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Try again later.');
    }
  };

const handleBarcodeScanned = async ({ data }: { data: string }) => {
  if (!scanned) {
    setScanned(true);
    setShowScanner(false);

    try {
      const url = new URL(data);
      const tokenFromQR = url.searchParams.get('token');

      if (!tokenFromQR) {
        Alert.alert('Invalid QR Code', 'No token found in the scanned data.');
        return;
      }

      // Call backend with the token to login
      const response = await fetch(`${API_BASE_URL}/api/mobile/sessions_qr?token=${tokenFromQR}`);
      const result = await response.json();

      if (result.logged_in) {
        // Clear AsyncStorage completely before refilling
        await AsyncStorage.clear();

        // Save new data
        await AsyncStorage.setItem('authToken', result.token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(result.user));
        await AsyncStorage.setItem('id', result.user.id);

        // Navigate based on role
        navigation.navigate(result.type === "Doctor" ? "Doctor" : "Patient");
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid token or user.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to authenticate with the scanned QR code.\n\n${error.message || error}`);
    }
  }
};


  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <BackButton goBack={navigation.goBack} />
      <ImageBackground source={require('../assets/images/image.png')} style={styles.backgroundImage}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowScanner(true)} style={styles.button}>
            <Text style={styles.buttonText}>Login QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={goToRegister}>
            <Text style={styles.buttonText}>New Here?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleModal}>
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
                onChangeText={setEmail}
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

        <Modal visible={showScanner} animationType="fade">
          <View style={styles.container}>
            {permission?.granted ? (
              <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              />
            ) : (
              <View>
                <Text>Camera permission required.</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
              </View>
            )}
            <Button title="Close Scanner" onPress={() => setShowScanner(false)} />
          </View>
        </Modal>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0F9BAE', textAlign: 'center', marginBottom: 20 },
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
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#0F9BAE', textAlign: 'center', marginTop: 10, textDecorationLine: 'underline' },
});

export default Login;
