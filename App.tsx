import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Ekranlar
import ComplaintListScreen from './src/screens/ComplaintListScreen';
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown:false
        }}
      >

        {/* Giriş Ekranı */}
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: '🚦 Trafik Fısıltısı' }}
          
        />

        {/* Şikayet Gönderme */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '📢 Şikayet Gönder' }}
        />

        {/* Şikayet Listesi */}
        <Stack.Screen
          name="ComplaintList"
          component={ComplaintListScreen}
          options={{ title: '📄 Şikayet Listesi' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
