import React, { useState } from "react";
import {
  View, Dimensions
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import PersonalInfoScreen from "./profil_tabs/PersonalInfoScreen";
import LocationScreen from "./profil_tabs/LocationScreen";
import ProfilImageScreen from "./profil_tabs/ProfilImageScreen";

const MyProfilInformationScreen = () => {

  const layout = Dimensions.get("window");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "info", title: "Personal Info" },
    { key: "location", title: "Location" },
    { key: "image", title: "Profile Image" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "info":
        return (
          <PersonalInfoScreen/>
        );
      case "location":
        return (
          <LocationScreen/>
        );
      case "image":
        return (
          <ProfilImageScreen/>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#0F9BAE" }}
            style={{ backgroundColor: "#FFF", elevation: 2 }}
            labelStyle={{
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
            activeColor="#0F9BAE"
            inactiveColor="#999"
          />
        )}
      />
    </View>
  );
};
export default MyProfilInformationScreen;
