// SelectDateScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const SelectDateScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Select a Date</Text>
            {/* Example Button to Navigate */}
            <Button
                title="Proceed to Confirmation"
                onPress={() => navigation.navigate("Confirmation")}
            />
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

export default SelectDateScreen;
