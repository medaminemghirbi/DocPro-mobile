import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const handleLogin = async () => {
    try {
      // Make an API request to your backend to authenticate the user
      const response = await axios.post("http://192.168.1.18:3000/sessions", {
        email,
        password,
      });

      const userRole = response.data.type;
      // Navigate based on the user role
      if (userRole === "Doctor") {
        navigation.navigate("Doctor");
      } else if (userRole === "patient") {
        navigation.navigate("Patient");
      } else {
        // If the role is neither doctor nor patient, show an error or handle it
        alert("Invalid role");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please try again.");
    }
  };
  return (
    <ImageBackground
      source={require("../assets/images/image.png")}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#7ABFCF"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#7ABFCF"
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleLogin}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: "90%",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F9BAE",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#BCE4EA",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#F3FAFB",
    color: "#0F9BAE",
  },
  button: {
    backgroundColor: "#0F9BAE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#0F9BAE",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
