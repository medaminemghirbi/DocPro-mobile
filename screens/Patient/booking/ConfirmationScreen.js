// ConfirmationScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ConfirmationScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Confirmation</Text>
            {/* Example Button to go back to Home */}
            <Button title="Confirm and Go Back" onPress={() => navigation.navigate("Home")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default ConfirmationScreen;
