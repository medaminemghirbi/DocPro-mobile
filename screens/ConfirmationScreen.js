import React, { useState, useEffect, useRef } from "react";
import { Alert, Button, TextInput, View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../services/apiConfig";

const ConfirmationScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(["", "", "", "", "", ""]); // Array for the 6 digits
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 1 minute (60 seconds)
  const [timerRunning, setTimerRunning] = useState(true);

  // Create an array of refs for the TextInputs
  const inputRefs = useRef([]);

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("currentUser");
        if (storedEmail) {
          const user = JSON.parse(storedEmail);
          setEmail(user.email); // Set the email state from AsyncStorage
        }
      } catch (error) {
        console.error("Error fetching email from AsyncStorage:", error);
      }
    };

    getEmailFromStorage();

    // Start the timer countdown
    const timerInterval = setInterval(() => {
      if (timer > 0 && timerRunning) {
        setTimer((prevTimer) => prevTimer - 1); // Decrease timer by 1 second
      } else {
        clearInterval(timerInterval); // Stop the timer if it's 0 or paused
      }
    }, 1000); // 1000 ms (1 second)

    return () => clearInterval(timerInterval); // Cleanup the interval when the component unmounts
  }, [timer, timerRunning]);

  const handleSubmit = async () => {
    const code = confirmationCode.join(""); // Join the array into a string
    if (code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit confirmation code");
      return;
    }

    setLoading(true); // Start the loading spinner

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mobile/registrations/confirm_email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            confirmation_code: code, // Send the entered confirmation code
          }),
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Acoount Confirmed successful!");
        navigation.navigate("Login");
        // const storedUserRole = await AsyncStorage.getItem("userRole");
        // if (storedUserRole === "Doctor") {
        //   navigation.navigate("Doctor");
        // } else {
        //   navigation.navigate("Patient");
        // }
      } else {
        Alert.alert("Error", "Invalid confirmation code. Please try again.");
      }
    } catch (error) {
      console.error("Error during confirmation:", error);
      Alert.alert(
        "Error",
        "There was an issue with the confirmation. Please try again later."
      );
    } finally {
      setLoading(false); // End the loading spinner
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleCodeChange = (text, index) => {
    const newCode = [...confirmationCode]; // Create a copy of the code array
    newCode[index] = text; // Update the specific digit
    setConfirmationCode(newCode);

    // Move focus to next input field if the current one is filled
    if (text && index < 5) {
      inputRefs.current[index + 1].focus(); // Focus next input
    }
  };

  // Function to clear all the code fields
  const handleClearAll = () => {
    setConfirmationCode(["", "", "", "", "", ""]); // Reset the confirmation code array
    inputRefs.current[0].focus(); // Focus the first input after clearing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>6-Digit Code</Text>
      <Text style={styles.emailText}>Code sent to {email}</Text>

      {/* Display the timer */}
      <Text style={styles.timerText}>Resend code in {formatTime(timer)}</Text>

      {/* Input for confirmation code */}
      <View style={styles.codeInputContainer}>
        {confirmationCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)} // Assign ref to each TextInput
            style={styles.codeInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            autoFocus={index === 0} // Auto-focus the first input
          />
        ))}
      </View>

      {/* Submit button with loading spinner */}
      <Button
        title={loading ? "Confirming..." : "Submit"}
        onPress={handleSubmit}
        disabled={loading || timer === 0} // Disable the button if time runs out
      />

      {/* Clear All button */}
      <Button
        title="Clear All"
        onPress={handleClearAll} // Trigger the clear function
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#2c3e50", // Dark background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // White text for header
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 10,
    color: "gray",
  },
  timerText: {
    fontSize: 18,
    color: "#e74c3c", // Red color for timer
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});

export default ConfirmationScreen;
