import AppNavigation from "./screens/Navigation/AppNavigation";
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

var App = function App() {
  NavigationBar.setVisibilityAsync("hidden");
  return (
    <SafeAreaProvider>
    <AppNavigation/>
    </SafeAreaProvider>
    
  )
};

export default App
