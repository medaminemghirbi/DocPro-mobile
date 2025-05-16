import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FirstScreen() {
      const navigation = useNavigation();
      useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const token = await AsyncStorage.getItem('authToken');
            const user = await AsyncStorage.getItem('currentUser');
    
            if (token && user) {
              const parsedUser = JSON.parse(user);
              const userRole = parsedUser.type || (await AsyncStorage.getItem('userRole'));
    
              if (userRole === "Doctor") {
                navigation.replace("Doctor");
                setTimeout(() => {
                  Toast.show({
                    type: 'success',
                    text1: 'You are already logged in!!',
                    text2: 'Welcome back 👋',
                  });
                }, 100);
              } else {
                navigation.replace("Patient");
                setTimeout(() => {
                  Toast.show({
                    type: 'success',
                    text1: 'You are already logged in!!',
                    text2: 'Welcome back sir 👋',
                  });
                }, 100);
              }
            }
          } catch (error) {
            console.error("Failed to check login status:", error);
          }
        };
    
        checkLoginStatus();
      }, []);
    const goToRegister = () => {
        navigation.navigate('Register');
      };
      const goToLogin = () => {
        navigation.navigate('Login');
      };
  return (
    <>
    <LinearGradient colors={["#045482", "#00f2fe"]} style={styles.container}>        
      <View style={styles.header}>
        <Text style={styles.title}>
          BOOK <Text style={styles.highlight}> THE BEST DOCTOR</Text>
        </Text>
        <Text style={styles.subtitle}>
          Find expert doctors near to you & book an appointment.
        </Text>
      </View>

      {/* Doctor Illustration */}
      <Image source={require("../../DocPro-mobile/assets/images/morning-img-02.png")} style={styles.image} />

      {/* Buttons */}
      <TouchableOpacity   onPress={goToLogin} style={styles.button}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity  onPress={goToRegister} style={[styles.button, styles.signupButton]}>
        <Text style={[styles.buttonText, styles.signupText]}>SIGN UP</Text>
      </TouchableOpacity>
    </LinearGradient>
    <Toast />

    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  highlight: {
    color: "#ffeb3b",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4facfe",
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
  },
  signupText: {
    color: "#fff",
  },
});
