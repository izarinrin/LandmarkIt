import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Searchbar } from "react-native-paper";
import { useSelector } from "react-redux";
import { Fontisto } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = ({ setScreenData }) => {
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();

  const currentUser = useSelector((state) => state.currentUser.value);
  const [searchQuery, setSearchQuery] = React.useState("");

  const navigateReset = (name) => {
    navigation.reset({
      index: 0,
      routes: [{ name }],
    });
  };

  return (
    <SafeAreaView>
      <Card style={styles.headerMain}>
        <View >
          <Text style={styles.txtStyle}>Hi {currentUser.displayName} ! Where to?</Text>
          <Searchbar
            placeholder="※under construction※"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>

        {/* <View style={{ flex: 1, alignSelf: "flex-end" }}>
        {/* <Button
        //   icon="camera"
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
        </Button> */}

        {/* <Pressable
          style={styles.pButton}
          onPress={() => navigateReset("login-screen")}
        >
          <Text>Log out</Text>
        </Pressable> */}
        {/* </View> */}
      </Card>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerMain: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "grey",
    padding:20,
    width: "100%",
  },
  txtStyle: {
    color: "white",
    fontWeight: "600",
  },
  pButton: {
    // flex: 1,
    backgroundColor: "white",
    padding: 5,
    width: "50%",
    minHeight: 30,
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  searchContainer: {
    flex: 1,
    marginTop: 15,
    alignSelf: "stretch",
  },
});
