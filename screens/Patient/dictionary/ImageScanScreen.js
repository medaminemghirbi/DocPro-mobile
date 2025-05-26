import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Animated,
  Easing,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../../../services/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const ImageScanScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Animated value for scanning bar
  const scanAnimation = useState(new Animated.Value(0))[0];

  // Reset when screen is focused
  useFocusEffect(
    useCallback(() => {
      setScanResult(null);
      setImageUri(null);
      setUploading(false);
    }, [])
  );

  // Start scanning bar animation
  const startScanAnimation = () => {
    scanAnimation.setValue(0);
    Animated.loop(
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access gallery is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  // Launch camera and capture image
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access camera is required!"
      );
      return;
    }

    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (
      !cameraResult.canceled &&
      cameraResult.assets &&
      cameraResult.assets.length > 0
    ) {
      setImageUri(cameraResult.assets[0].uri);
    }
  };

  // Handle scan upload
// Handle scan upload
const handleScan = async () => {
  if (!imageUri) {
    Alert.alert("No image selected", "Please select an image first.");
    return;
  }

  setUploading(true);
  startScanAnimation();

  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    const currentUserStr = await AsyncStorage.getItem("currentUser");
    const currentUser = JSON.parse(currentUserStr);

    const response = await fetch(
      `${API_BASE_URL}/api/mobile/predict/${currentUser.id}`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      // Check if it's a server error
      if (response.status === 500) {
        Alert.alert("image selected not skin", "Please select a skean image.");
        throw new Error("Server error");
      } else {
        throw new Error(`Unexpected error: ${response.status}`);
      }
    }

    const result = await response.json();
    setScanResult(result);
  } catch (error) {
    console.error("Upload failed", error);
    
    Alert.alert("Error", error.message === "Server error" ? "Not Image of a valid skin Please try again later." : "Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};


  // Refresh control handler
  const onRefresh = () => {
    setRefreshing(true);
    setScanResult(null);
    setImageUri(null);
    setUploading(false);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Upload Image to Scan</Text>

      {/* Buttons for picking image or taking photo */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={[styles.pickButton, { flex: 1, marginRight: 10 }]}
          onPress={pickImage}
        >
          <Text style={styles.pickButtonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickButton, { flex: 1, marginLeft: 10 }]}
          onPress={takePhoto}
        >
          <Text style={styles.pickButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          {uploading && (
            <Animated.View
              style={[
                styles.scanOverlay,
                {
                  transform: [
                    {
                      translateY: scanAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 300], // height of imagePreview
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScan}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.scanButtonText}>Scan with AI</Text>
        )}
      </TouchableOpacity>

      {scanResult?.maladie && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Result</Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Name:</Text> {scanResult.predicted_class}
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Probability:</Text>{" "}
            {Number(scanResult.probability).toFixed(2)}%
          </Text>

          <Text style={styles.resultText}>
            <Text style={styles.bold}>Description:</Text>{" "}
            {scanResult.maladie.maladie_description}
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Symptoms:</Text>{" "}
            {scanResult.maladie.symptoms}
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Diagnosis:</Text>{" "}
            {scanResult.maladie.diagnosis}
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Prevention:</Text>{" "}
            {scanResult.maladie.prevention}
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Treatments:</Text>{" "}
            {scanResult.maladie.treatments}
          </Text>
          <Text style={styles.resultText}>
            <Text style={styles.bold}>References:</Text>{" "}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(scanResult.maladie.references)}
            >
              {scanResult.maladie.references}
            </Text>
          </Text>
          <Text style={styles.resultTitle}>Official Disease Image</Text>

          {scanResult?.maladie?.diseas_image_url_mobile && (
            <Image
              source={{ uri: scanResult.maladie.diseas_image_url_mobile }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F9BAE",
    textAlign: "center",
    marginBottom: 30,
  },
  pickButton: {
    backgroundColor: "#0F9BAE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  pickButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  imageWrapper: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    resizeMode: "contain",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#0F9BAE",
    opacity: 0.7,
  },
  scanButton: {
    backgroundColor: "#0F9BAE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 18,
  },
  resultContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F9BAE",
    marginBottom: 10,
    textAlign: "center",
  },
  resultText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  link: {
    color: "#0F9BAE",
    textDecorationLine: "underline",
  },
  profileImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default ImageScanScreen;
