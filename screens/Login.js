import { Alert, Pressable, StyleSheet, Text, View, Modal, DrawerLayoutAndroid } from "react-native";
import React, { useState } from "react";
import { registerRootComponent } from "expo";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  TextInput,
} from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from "../firebase/app/firebaseConfig.js";
import { setCurrentUser } from "../app/slice/currentUserSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = ({ setScreen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [dispName, setDispName] = useState("");
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const login = () => {
    console.log({ email, password });
    // return;
    auth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        console.log({ currentUser: res.user });
        const dbRef = database.ref();
        dbRef
          .child("users")
          .child(res.user.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists()) {
              console.log("snapshot", snapshot.val());
              storeData("CURRENT_USER_ID", res.user.uid);
              dispatch(setCurrentUser(snapshot.val()));
              navigateReset("home-screen");
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (err) => {
        console.log({ errFirebase: err.message, code: err.code });
      }
    );
  };

  const register = () => {
    auth.createUserWithEmailAndPassword(emailReg, passwordReg).then(
      (res) => {
        const userId = res.user.uid;
        database
          .ref("users/" + userId)
          .set({ id: userId, email: emailReg, displayName })
          .then(
            (res) => {
              setDisplayName("");
              setEmailReg("");
              setPasswordReg("");
              Alert.alert("Register", "You have been successfully registered.");
              setModalVisible(!modalVisible);
            },
            (err) => {
              console.log({ err });
            }
          );
      },
      (err) => {
        console.log({ errFirebase: err.message, code: err.code });
        Alert.alert(err.message);
      }
    );
  };

  const storeData = async (key, value) => {
    try {
      // value = JSON.stringify(value);
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  const navigateReset = (name) => {
    navigation.reset({
      index: 0,
      routes: [{ name }],
    });
  };

  const clickForgotPass = () => {
    alert("Forgot Pass");
  };

  const clickReg = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={styles.loginScreen}>
      <Card style={styles.loginContainer}>
        <Text style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}>
          Landmark It!
        </Text>
        <TextInput mode="outlined" onChangeText={setEmail} label="Email" />
        <TextInput
          mode="outlined"
          secureTextEntry={true}
          onChangeText={setPassword}
          label="Password"
        />
        <Pressable style={styles.forgotPass} onPress={clickForgotPass}>
          <Text style={styles.forgotLink}>Forgot Password?</Text>
        </Pressable>
        <Button mode="contained" onPress={() => login()}>
          Login
        </Button>
      </Card>
      <View style={styles.pLink}>
        <Text>Don't have an account? </Text>
        <Pressable onPress={clickReg}>
          <Text style={styles.forgotLink}>Sign up</Text>
        </Pressable>
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>X</Text>
              </Pressable>
              <Card style={styles.loginContainer}>
                <Text
                  style={{
                    fontSize: 30,
                    textAlign: "center",
                    paddingBottom: 10,
                  }}
                >
                  resgister
                </Text>

                <View style={{ padding: 10 }}>
                  <TextInput
                    mode="outlined"
                    onChangeText={setEmailReg}
                    label="Email"
                  />
                  <TextInput
                    mode="outlined"
                    onChangeText={setDisplayName}
                    label="Display Name"
                  />
                  <TextInput
                    mode="outlined"
                    secureTextEntry={true}
                    onChangeText={setPasswordReg}
                    label="Password"
                  />
                </View>
                <Button
                  style={{
                    fontSize: 30,
                    textAlign: "center",
                  }}
                  mode="contained"
                  onPress={() => register()}
                >
                  Register
                </Button>
              </Card>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginScreen: {
    flex: 1,
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#adb7d9",
  },
  loginContainer: {
    borderWidth: 4,
    padding: 40,
    paddingBottom: 50,
    width: 350,
  },
  textBoxLogin: {
    borderBottomWidth: 1,
    borderRadius: 10,
    minWidth: 250,
    minHeight: 20,
    padding: 10,
  },
  pButton: {
    top: 10,
    backgroundColor: "grey",
    padding: 5,
    minWidth: 90,
    minHeight: 30,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  pLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  registerContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
    left: 26,
    paddingTop: 10,
  },
  forgotPass: {
    display: "flex",
    alignItems: "flex-end",
  },
  forgotLink: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
