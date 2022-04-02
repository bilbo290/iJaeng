import { StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useState, createContext } from "react";
import { globalStyles } from "./styles/global";
import { useFonts } from "expo-font";
import Home from "./screens/home";
import AddEntry from "./screens/addEntry";
import Login from "./screens/login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    "Athiti-Regular": require("./assets/fonts/Athiti-Regular.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Black": require("./assets/fonts/Montserrat-Black.ttf"),
    "BIZUDPMincho-Regular": require("./assets/fonts/BIZUDPMincho-Regular.ttf"),
  });
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(["Setting a timer"]);
  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddEntry" component={AddEntry} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return <AppLoading />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontFamily: "Athiti-Regular",
    fontSize: 50,
  },
});
