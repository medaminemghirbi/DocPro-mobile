import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet, Image} from "react-native";
const LoadingScreen = ({ navigation }) => {
const [rotateAnim] = useState(new Animated.Value(0));
useEffect(() => {
    Animated.loop(
    Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
    })
    ).start();
    setTimeout(() => {
    navigation.replace("Login");
    }, 1500);
}, [navigation, rotateAnim]);
const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    });
    return (
    <View style={styles.loadingContainer}>
        <Image
        source={require("../../assets/images/logo-loading.png")}
        style={styles.loadingImage}
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
loader: {
    width: 50,
    height: 50,
    borderWidth: 10,
    borderRadius: 50,
    borderColor: "#0F9BAE",
    borderTopColor: "transparent",
    animationDuration: "1s",
    borderStyle: "solid",
},
});
