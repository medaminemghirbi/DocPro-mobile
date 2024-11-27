// SettingsScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BlogScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.greetingText}>Blog Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F9BAE",
  },
});

export default BlogScreen;
