import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
// import Geolocation from "@react-native-community/geolocation";

const Maps = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Get the current position once when the component mounts
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       setLocation({ latitude, longitude });
  //     },
  //     (error) => setError(error.message),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   );
  // }, []); // Run only once
  
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Text>Mapss</Text>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          // initialRegion={{
          //   latitude: location.latitude,
          //   longitude: location.longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
        />
		{/* <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} /> */}
      </View>
    </View>
  );
};

export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 350,
  },
});
