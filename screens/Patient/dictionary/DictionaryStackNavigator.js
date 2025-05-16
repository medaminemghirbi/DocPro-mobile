import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Booking Flow Screens
import DictionaryScreen from "./DictionaryScreen";
import DiseaseDetailsScreen from "./DiseaseDetailsScreen";
import ImageScanScreen from "./ImageScanScreen";

const Stack = createNativeStackNavigator();

const DictionaryStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DictionaryScreen"
                component={DictionaryScreen}
                options={{ headerShown: false }} 
            />
            <Stack.Screen
            name="DiseaseDetailsScreen"
            component={DiseaseDetailsScreen}
            options={{ headerTitle: "Disease Information" }}
            />
            <Stack.Screen
            name="ImageScanScreen"
            component={ImageScanScreen}
            options={{ headerTitle: "Scan Image with CNN" }}
            />

        </Stack.Navigator>
    );
};

export default DictionaryStackNavigator;
