import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import Maps from "./Maps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ setScreen, _username }) => {
  const navigation = useNavigation();
  return (
    // Main Area
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <View style={{ display: "flex", width: "100%" }}>
        <Header setScreenData={setScreen} username={_username}></Header>
        <Maps></Maps>
      </View>
      <Text style={{ textAlign: "center" }}>HOMESCREEN</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("todo-screen")}
      >
        Todo
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("upload-screen")}
      >
        Upload
      </Button>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchBar: {
    display: "flex",
    position: "absolute",
    borderWidth: 3,
    width: "100%",
    borderRadius: 20,
    position: "relative",
    paddingHorizontal: 10,
  },
  
});
