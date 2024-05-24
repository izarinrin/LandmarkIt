import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Login from "./screens/Login";
import HomeScreen from "./screens/HomeScreen";
import About from "./screens/About";
import Header from "./components/Header";
import Maps from "./screens/Maps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./app/slice/currentUserSlice";
import TodoScreen from "./screens/TodoScreen";
import UploadScreen from "./screens/UploadScreen";

const AppBase = () => {
  const [screen, setScreen] = useState("Login");
  const [user, setUser] = useState("");
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();

  const currentUser = useSelector((state) => state.currentUser.value);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log({ currentUser });
  }, [currentUser]);

  const navigateReset = (name) => {
    navigation.reset({
      index: 0,
      routes: [{ name }],
    });
  };

  
  const onSetScreen = (data) => {
    setScreen(data);
  };
  const setUsername = (data) => {
    setUser(data);
  };

  return (
    <Stack.Navigator
      initialRouteName="login-screen"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        cardOverlayEnabled: true,
        swipeEnabled: false,
        cardStyle: { backgroundColor: "#F5F6FA" },
      })}
    >
      <Stack.Screen
        name="login-screen"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home-screen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="about-screen"
        component={About}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="todo-screen"
        component={TodoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="upload-screen"
        component={UploadScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppBase;

const styles = StyleSheet.create({
  appBaseContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#3b4773",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
