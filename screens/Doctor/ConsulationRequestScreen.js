import { useState } from "react";
import { View, Dimensions } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import PendingScreen from "./requests_tab/PendingScreen";
import AcceptedScreen from "./requests_tab/AcceptedScreen";
import RejectedScreen from "./requests_tab/RejectedScreen";

const ConsultationRequestScreen = ({ navigation }) => {
  const layout = Dimensions.get("window");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "⏳ Pending" },
    { key: "accepted", title: "✅ Accepted" },
    { key: "rejected", title: "⛔ Rejected" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "pending":
        return (
          <PendingScreen/>
        );
      case "accepted":
        return (
          <AcceptedScreen/>
        );
      case "rejected":
        return (
          <RejectedScreen/>
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

export default ConsultationRequestScreen;
