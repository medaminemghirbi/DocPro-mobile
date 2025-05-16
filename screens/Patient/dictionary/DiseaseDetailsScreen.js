import { Text, Image, ScrollView, StyleSheet, Linking, View } from "react-native";

const DiseaseDetailsScreen = ({ navigation, route }) => {
  const { disease } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: disease.diseas_image_url_mobile }}
        style={styles.image}
      />
      <Text style={styles.title}>{disease.maladie_name}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{disease.maladie_description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Synonyms:</Text>
        <Text style={styles.text}>{disease.synonyms}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Symptoms:</Text>
        <Text style={styles.text}>{disease.symptoms}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Causes:</Text>
        <Text style={styles.text}>{disease.causes}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Treatments:</Text>
        <Text style={styles.text}>{disease.treatments}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Prevention:</Text>
        <Text style={styles.text}>{disease.prevention}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Diagnosis:</Text>
        <Text style={styles.text}>{disease.diagnosis}</Text>
      </View>

      <Text
        style={styles.link}
        onPress={() => Linking.openURL(disease.references)}
      >
        Read more
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    padding: 16,
    paddingBottom: 30,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F9BAE",
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  link: {
    marginTop: 15,
    color: "#0F9BAE",
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 18,
  },
});

export default DiseaseDetailsScreen;
