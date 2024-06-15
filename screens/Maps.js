import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Button, IconButton, TextInput, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AddPlace from "../components/AddPlace";

const Maps = () => {
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value for the Callout
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const mapRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeInOut = () => {
    fadeIn();
    setTimeout(() => {
      fadeOut();
    }, 3000); // Fades out after 3 seconds
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setMarker(location.coords); // Set the initial marker to the current location
      setIsCurrent(true);
    })();
  }, []);

  const addMarker = (coordinate) => {
    setMarker(coordinate); // Set the latest marker
    setShowPlusButton(false);
  };

  const centerMapOnLocation = () => {
    setIsCurrent(true);
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15,
      });
      fadeInOut(); // Call fadeInOut when centering on the current location
    }
    addMarker(location);
  };

  const handleMarkerPress = () => {
    setIsCurrent(false);
    setShowPlusButton(true);
  };

  const handlePlusButtonPress = () => {
    // Add your functionality here
    // console.log("Plus button pressed");
    setShowPlusButton(false);
    addLocation();
  };

  const addLocation = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      {location ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => addMarker(e.nativeEvent.coordinate)}
          >
            {marker && ( // Render the custom marker if it exists
              <Marker
                coordinate={marker}
                title="Custom Marker"
                onPress={handleMarkerPress}
              >
                <Callout>
                  {isCurrent ? (
                    <Text>You are here</Text>
                  ) : (
                    <Text>Add Place?</Text>
                  )}
                </Callout>
              </Marker>
            )}
          </MapView>
          {showPlusButton && (
            <View
              style={{
                position: "absolute",
                bottom: 20,
                left: "100%",
                transform: [{ translateX: -75 }],
                alignItems: "",
              }}
            >
              <IconButton
                icon={() => <MaterialCommunityIcons name="plus" size={30} />}
                size={40} // Adjust the size to prevent cropping
                onPress={() => handlePlusButtonPress()}
                style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons name="map-marker-circle" size={30} />
                )}
                size={40} // Adjust the size to prevent cropping
                onPress={() => centerMapOnLocation()}
                style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
              />
            </View>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <Card style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Card style={styles.modalView}>
          <IconButton
                icon={() => (
                  <MaterialCommunityIcons name="close-circle" size={30} />
                )}
                size={20} // Adjust the size to prevent cropping
                onPress={() => setModalVisible(!modalVisible)}
                // style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
              />
            <AddPlace />
          </Card>
        </Modal>
      </Card>
    </SafeAreaView>
  );
};

export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -75 }],
    width: 150,
    alignItems: "center",
  },
  plusButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
