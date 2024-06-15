import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Drawer,
  Icon,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { getCoords } from "../screens/Maps";

const AddPlace = () => {
  const [active, setActive] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState("");
  const [addedLoc, setAddedLoc] = useState("")
  const data = [
    { key: "1", value: "Restaurant" },
    { key: "2", value: "Mall" },
    { key: "3", value: "Cafe" },
    { key: "4", value: "Internet Cafe" },
    { key: "5", value: "Arcade" },
    { key: "6", value: "Activities" },
    { key: "7", value: "Drinks" },
  ];



  return (
    <SafeAreaView style={styles.centeredView}>
      <View>
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
          }}
        >
          New Place
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <View style={{ padding: 10 }}>
          <TextInput
            mode="outlined"
            label="Location Name"
            dense
            value={addedLoc}
            onChangeText={setAddedLoc}
            style={ { flexGrow: 1 }}
          />
        </View>
        <View style={{ padding: 10 }}>
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddPlace;

export const onAddLoc = () => {
  // const id = new Date()
  //   .getTime()
  //   database.ref('addedLocs/' + id).set({ id: id, locName: addedLoc, locCat: data, locLat:getCoords().latitude , locLon:getCoords().longitude })
  //   .then(
  //     (res) => {
  //       setAddedLoc("");
  //     },
  //     (err) => {
  //       console.log({ err });
  //     }
  //   );
  const debuggi ={
    locName: addedLoc, 
    locCat: data, 
    locLat:getCoords().latitude , 
    locLon:getCoords().longitude 
  }
  console.log("huyy:" + debuggi);

};

const styles = StyleSheet.create({
  safeContainerStyle: {
    justifyContent: "center",
  },
  centeredView: {
    padding: 20,
  },
});
