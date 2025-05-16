import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Dimensions } from "react-native";

const STORAGE_KEY = "user_profile_info";

const PersonalInfoRoute = ({ form, setForm }) => (
  <View style={styles.tabContainer}>
    <TextInput
      placeholder="First Name"
      style={styles.input}
      value={form.firstname}
      onChangeText={(text) => setForm({ ...form, firstname: text })}
    />
    <TextInput
      placeholder="Last Name"
      style={styles.input}
      value={form.lastname}
      onChangeText={(text) => setForm({ ...form, lastname: text })}
    />
    <TextInput
      placeholder="Birthday (YYYY-MM-DD)"
      style={styles.input}
      value={form.birthday}
      onChangeText={(text) => setForm({ ...form, birthday: text })}
    />
  </View>
);

const LocationRoute = ({ form, setForm }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.label}>Select Location:</Text>
    <Picker
      selectedValue={form.location}
      style={styles.picker}
      onValueChange={(itemValue) =>
        setForm({ ...form, location: itemValue })
      }
    >
      <Picker.Item label="Tunis" value="Tunis" />
      <Picker.Item label="Sousse" value="Sousse" />
      <Picker.Item label="Sfax" value="Sfax" />
    </Picker>
  </View>
);

const ImageRoute = ({ form, setForm }) => {
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {form.image ? (
          <Image source={{ uri: form.image }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imageText}>Tap to select image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const MyProfilInformationScreen = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    location: "",
    image: null,
  });

  // Load from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setForm(JSON.parse(stored));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, []);

  // Save to AsyncStorage whenever form changes
  useEffect(() => {
    const saveProfile = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      } catch (err) {
        console.error("Error saving profile:", err);
      }
    };

    saveProfile();
  }, [form]);

  const layout = Dimensions.get("window");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "info", title: "Personal Info" },
    { key: "location", title: "Location" },
    { key: "image", title: "Profile Image" },
  ]);

  const renderScene = SceneMap({
    info: () => <PersonalInfoRoute form={form} setForm={setForm} />,
    location: () => <LocationRoute form={form} setForm={setForm} />,
    image: () => <ImageRoute form={form} setForm={setForm} />,
  });

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

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  picker: {
    height: 50,
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
});

export default MyProfilInformationScreen;
