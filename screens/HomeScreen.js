import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import Header from "../components/Header";
import Maps from "./Maps";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ setScreen, _username }) => {
  return (
    // Main Area
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, width: "100%" }}>
        <Header setScreenData={setScreen} username={_username} />
        <View style={{ flex: 1 }}>
          <Maps />
        </View>
      </View>
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
    paddingHorizontal: 10,
  },
});
