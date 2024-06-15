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
import UploadScreen from "./UploadScreen";

const Maps = () => {
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value for the Callout
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const mapRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [accDetsVisible, setAccDetsVisible] = useState(false);
  const [markers, setMarkers] = useState([]); // Updated state for storing markers
  const [addingMarker, setAddingMarker] = useState(false); // State to control marker addition

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

  const addMarker = (coordinate, markState) => {
    setMarker(coordinate); // Set the latest marker
    setShowPlusButton(false);
    // Add marker to the array only if plus button is pressed
    if (markState) {
      setMarkers([...markers, coordinate]); // Adding the latest marker to the array
    }
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
    addMarker(location, false);
  };

  const handleMarkerPress = () => {
    setIsCurrent(false);
    setShowPlusButton(true);
    // setAddingMarker(true); // Set to true when the marker is pressed
  };

  const handlePlusButtonPress = () => {
    // Add your functionality here
    console.log("Plus button pressed");
    setShowPlusButton(false);
    setModalVisible(!modalVisible);
  };

  const closeButton = () => {
    setModalVisible(!modalVisible);
    setAddingMarker(false);
  };
  const saveAddedLoc = (coords) => {
    setModalVisible(!modalVisible);
    console.log(coords);
    addMarker(coords, true); // Set to true when the plus button is pressed
    setAddingMarker(false);
  };
  const openAccDets = () => {
    setAccDetsVisible(!accDetsVisible);
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
            <Marker
              coordinate={marker}
              title="Custom Marker"
              onPress={handleMarkerPress}
            >
              <Callout>
                {isCurrent ? (
                  <Text>You are here!</Text>
                ) : (
                  <Text>Add Place?</Text>
                )}
              </Callout>
            </Marker>
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker}
                title={`Marker ${index + 1}`}
              >
                <Callout>
                  <Text>{`Marker ${index + 1}`}</Text>
                </Callout>
              </Marker>
            ))}
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
                onPress={() => handlePlusButtonPress(markers, addingMarker)}
                style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  left: -130,
                }}
              >
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons name="account-details" size={30} />
                  )}
                  size={40} // Adjust the size to prevent cropping
                  onPress={() => openAccDets()}
                  style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
                />
              </View>
              <View
                style={{
                  left: -35,
                }}
              >
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      name="map-marker-circle"
                      size={30}
                    />
                  )}
                  size={40} // Adjust the size to prevent cropping
                  onPress={() => centerMapOnLocation()}
                  style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.centeredView}>
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
              onPress={() => closeButton()}
              // style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
            />
            <AddPlace />
            <Button
              style={{
                fontSize: 30,
                textAlign: "center",
              }}
              mode="contained"
              onPress={() => saveAddedLoc(marker)}
            >
              Add
            </Button>
          </Card>
        </Modal>
      </View>
      <View>
        <Modal
          animationType="slide"
          visible={accDetsVisible}
          onRequestClose={() => {
            setAccDetsVisible(!accDetsVisible);
          }}
        >
          <IconButton
            icon={() => (
              <MaterialCommunityIcons name="close-circle" size={30} />
            )}
            size={20} // Adjust the size to prevent cropping
            onPress={() => setAccDetsVisible(!accDetsVisible)}
            // style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
          />
          <UploadScreen />
        </Modal>
      </View>
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
  centeredView: {
    flex: 1,
    flexDirection: "row",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
