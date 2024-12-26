// UpdateNotificationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";

const UpdateNotificationScreen = ({ navigation, route }) => {
  // State for notification toggles
  const [isSMSable, setIsSMSable] = useState(false); // Replace with user.is_smsable if available
  const [isEmailable, setIsEmailable] = useState(false); // Replace with user.is_emailable if available
  const [isNotifiable, setIsNotifiable] = useState(false); // Replace with user.is_notifiable if available

  // Placeholder handlers for toggles
  const handleNotificationToggle = (type, value) => {
    switch (type) {
      case "sms":
        setIsSMSable(value);
        // Add logic to update backend
        break;
      case "email":
        setIsEmailable(value);
        // Add logic to update backend
        break;
      case "system":
        setIsNotifiable(value);
        // Add logic to update backend
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.itemTitle}>DocPro Notifications</Text>
        <View style={styles.checkboxGroup}>
          {/* SMS Notifications */}
          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>
              Activer les Notifications par SMS
            </Text>
            <Switch
              value={isSMSable}
              onValueChange={(value) =>
                handleNotificationToggle("sms", value)
              }
            />
          </View>
          {/* Email Notifications */}
          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>
              Activer les Notifications par Email
            </Text>
            <Switch
              value={isEmailable}
              onValueChange={(value) =>
                handleNotificationToggle("email", value)
              }
            />
          </View>
          {/* System Notifications */}
          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>
              Activer les Notifications Système
            </Text>
            <Switch
              value={isNotifiable}
              onValueChange={(value) =>
                handleNotificationToggle("system", value)
              }
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkboxGroup: {
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
});

export default UpdateNotificationScreen;
