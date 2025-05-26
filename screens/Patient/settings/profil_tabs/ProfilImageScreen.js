import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../../../services/apiConfig";


const ProfilImageScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserId(userData.id);
          setImageUri(userData.image || userData.user_image_url_mobile || null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImageUri(selectedAsset.uri);
        await uploadImage(selectedAsset);
      }
    } catch (error) {
      console.error("Image picking error:", error);
    }
  };

  const uploadImage = async (asset) => {
    if (!userId || !asset.uri) return;
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("avatar", {
      uri: asset.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/mobile/update_settings`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // ✅ No need for response.json(), just use response.data
      const updatedUser = response.data;
      setImageUri(updatedUser.user_image_url_mobile);
  
      // ✅ Save updated user to AsyncStorage
      await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));
  
      Alert.alert("Success", "Profile image updated.");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="large" color="#0F9BAE" />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imageText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, loading && { backgroundColor: "#ccc" }]}
        onPress={pickImage}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "Saving..." : "Save Profile Image"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  imagePicker: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageText: {
    color: "#888",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#0F9BAE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfilImageScreen;
