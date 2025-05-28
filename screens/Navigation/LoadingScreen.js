import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Animated, StyleSheet, Dimensions, Image } from "react-native";

const LoadingScreen = ({ navigation }) => {
  const [rotateAnim] = useState(new Animated.Value(0));
  const { width } = Dimensions.get("window");

  const checkUserAndNavigate = async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');

      if (!user) {
        navigation.replace('First');
      } else {
        const parsedUser = JSON.parse(user);
        const userRole = parsedUser.type;
        if (userRole === 'Doctor') {
          navigation.replace('Doctor');
        } else if (userRole === 'Patient') {
          navigation.replace('Patient');
        } else {
          navigation.replace('First');
        }
      }
    } catch (error) {
      console.error('Error checking user in AsyncStorage:', error);
      navigation.replace('First');
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      checkUserAndNavigate();
    }, 1500);
  }, [navigation, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require("../../assets/images/logo_with_beta_1.png")}
        style={[styles.loadingImage, { width: width * 0.6, height: width * 0.3 }]}
        resizeMode="contain"
      />
      <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingImage: {
    marginBottom: 30,
  },
  loader: {
    width: 50,
    height: 50,
    borderWidth: 10,
    borderRadius: 50,
    borderColor: "#0F9BAE",
    borderTopColor: "transparent",
  },
});
