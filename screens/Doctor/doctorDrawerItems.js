import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import DashboardDoctorScreen from "./DashboardDoctorScreen";
import ConsultationRequestScreen from "./ConsulationRequestScreen";
import ForumScreen from "./ForumScreen";
import IaScanScreen from "./IaScanScreen";
import SettingsScreen from "./SettingsScreen";

export const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 15,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const doctorDrawerItems = [
  {
    name: "Dashboard",
    component: DashboardDoctorScreen,
    icon: ({ color, size }) => (
      <View style={styles.iconContainer}>
        <Ionicons name="grid-outline" size={size} color={color} />
      </View>
    ),
  },
  {
    name: "Demandes",
    component: ConsultationRequestScreen,
    icon: ({ color, size }) => (
      <View style={styles.iconContainer}>
        <Ionicons name="time-outline" size={size} color={color} />
      </View>
    ),
  },
  {
    name: "Forum",
    component: ForumScreen,
    icon: ({ color, size }) => (
      <View style={styles.iconContainer}>
        <Ionicons name="chatbox-outline" size={size} color={color} />
      </View>
    ),
  },
  {
    name: "Scan With IA",
    component: IaScanScreen,
    icon: ({ color, size }) => (
      <View style={styles.iconContainer}>
        <Ionicons name="print-outline" size={size} color={color} />
      </View>
    ),
  },
  {
    name: "Settings",
    component: SettingsScreen,
    icon: ({ color, size }) => (
      <View style={styles.iconContainer}>
        <Ionicons name="settings-outline" size={size} color={color} />
      </View>
    ),
  }
];
