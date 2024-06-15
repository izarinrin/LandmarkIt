import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Card, Drawer, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDown from "react-native-paper-dropdown";
import { useState } from "react";

const AddPlace = () => {
  const [active, setActive] = React.useState("");
  const [category, setCategory] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const locCategory = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
    {
      label: "Others",
      value: "others",
    },
  ];

  return (
    <SafeAreaView style={styles.centeredView}>
      <Text
        style={{
          fontSize: 30,
          textAlign: "center",
          paddingBottom: 10,
        }}
      >
        New Place
      </Text>
      <View style={{ padding: 10 }}>
        <TextInput mode="outlined" label="Location Name" />
        <DropDown
          label={"Category"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={category}
          setValue={setCategory}
          list={locCategory}
        />
      </View>
      <Button
        style={{
          fontSize: 30,
          textAlign: "center",
        }}
        mode="contained"
        onPress={() => alert("debug")}
      >
        Add
      </Button>
    </SafeAreaView>
  );
};

export default AddPlace;

const styles = StyleSheet.create({});
