import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Button
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../services/apiConfig";
import { ActivityIndicator } from "react-native";

const numColumns = 2;
const itemWidth = Dimensions.get("window").width / numColumns - 20;

const DictionaryScreen = () => {
  const [maladies, setMaladies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoadEnd = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const fetchMaladies = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token:", token);
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/mobile/maladies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setMaladies(result);
        } else {
          console.error("Error fetching maladies:", result.message);
        }
      }
    } catch (error) {
      console.error("Error fetching maladies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaladies();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: itemWidth }]}
      onPress={() => navigation.navigate("DiseaseDetailsScreen", { disease: item })}
    >
      <View
        style={{
          width: "100%",
          height: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!loadedImages[item.id] && (
          <ActivityIndicator
            size="small"
            color="#0F9BAE"
            style={StyleSheet.absoluteFill}
          />
        )}
        <Image
          source={{ uri: item.diseas_image_url_mobile }}
          style={styles.image}
          onLoadEnd={() => handleImageLoadEnd(item.id)}
        />
      </View>
      <Text style={styles.title}>{item.maladie_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Skin Cancer Detection(Beta)</Text>
      <View style={{ margin: 20 }}>
      <Button
        title="Try AI Scan"
        color="#0F9BAE"
        onPress={() => navigation.navigate("ImageScanScreen")}
      />
    </View>
      <FlatList
        data={maladies}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F9BAE",
    textAlign: "center",
    marginTop: 70,
    marginBottom: 10,
  },

  list: {
    padding: 10,
  },
  card: {
    margin: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#0F9BAE",
  },
});

export default DictionaryScreen;
