import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import {
  Button,
  IconButton,
  TextInput,
  Card,
  Searchbar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadScreen from "./UploadScreen";
import axios from "axios";
import { SelectList } from "react-native-dropdown-select-list";
import { database } from "../firebase/app/firebaseConfig";

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
  const [markerAddress, setMarkerAddress] = useState(""); // State to store address of the marker
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [coordsToSet, setCoordsToSet] = useState(null);
  const [selected, setSelected] = useState("");
  const [addedLoc, setAddedLoc] = useState("");
  const [placesVisible, setPlacesVisible] = useState(false);
  const data = [
    { key: "1", value: "Restaurant" },
    { key: "2", value: "Mall" },
    { key: "3", value: "Cafe" },
    { key: "4", value: "Internet Cafe" },
    { key: "5", value: "Arcade" },
    { key: "6", value: "Activities" },
    { key: "7", value: "Drinks" },
  ];
  const [list, setList] = useState([]);

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
    getAllAddedLocs();

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
      fetchAddress(location.coords.latitude, location.coords.longitude); // Fetch address for initial location
    })();
  }, []);

  const addMarker = (coordinate, markState) => {
    setMarker(coordinate); // Set the latest marker
    fetchAddress(coordinate.latitude, coordinate.longitude); // Fetch address for the new marker
    setShowPlusButton(false);
    // Add marker to the array only if plus button is pressed
    if (markState) {
      setMarkers([...markers, coordinate]); // Adding the latest marker to the array
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (response.data && response.data.display_name) {
        const address = response.data.display_name;
        setMarkerAddress(address);
      } else {
        setMarkerAddress("No address found");
      }
    } catch (error) {
      console.error(error);
      setMarkerAddress("Error fetching address");
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
    onAddLoc(coords.latitude, coords.longitude);
    // const tryinghelp = {
    //   locName: addedLoc,
    //   locCat: selected, // Assign the selected category value
    //   latitude: coords.latitude,
    //   longitude: coords.longitude,
    // };

    // console.log(tryinghelp);
  };

  const openAccDets = () => {
    setAccDetsVisible(!accDetsVisible);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const coordinate = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
        setSearchResults([coordinate]);
        setMarker(coordinate);
        fetchAddress(coordinate.latitude, coordinate.longitude);
        mapRef.current.animateCamera({
          center: coordinate,
          zoom: 15,
        });
      } else {
        Alert.alert("No results found", "Please try a different search term.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong with the search.");
    }
  };

  const onAddLoc = (locLat, locLon) => {
    const id = new Date().getTime();
    database
      .ref("addedLocs/" + id)
      .set({
        id: id,
        locName: addedLoc,
        locCat: selected, // Assign the selected category value
        latitude: locLat,
        longitude: locLon,
      })
      .then(
        (res) => {
          setAddedLoc("");
        },
        (err) => {
          console.log({ err });
        }
      );
  };

  const getAllAddedLocs = () => {
    database.ref('addedLocs').on('value', (snapshot) => {
      var dataArray = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        dataArray.push(childData);
      });
      dataArray.reverse(); //to make it descending
      setList(dataArray)
    }, err => {
      console.log({ err });
    })
  }

  const handleItemClick = (item) => {
    console.log("Clicked item:", item);
    // Implement your action here
    goMapLocation(item.latitude, item.longitude);
    const coordinate = {
      latitude: item.latitude,
      longitude: item.longitude,
    };
    addMarker(coordinate, false);
    setPlacesVisible(!placesVisible);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
        <Text>{item.locName}</Text>
        <Text>{item.locCat}</Text>
      </View>
    </TouchableOpacity>
  );

  const goMapLocation = (lat, lon) => {
    mapRef.current.animateCamera({
      center: {
        latitude: lat,
        longitude: lon
      },
      zoom: 15,
    });
    fadeInOut();
  }


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
                  <Text>{markerAddress || "Add Place?"}</Text>
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
          <View
            style={{
              transform: [{ translateY: -30 }],
            }}
          >
            <Card
              style={{
                padding: 5,
              }}
            >
              <Searchbar
                placeholder="Search for a location"
                onChangeText={(query) => setSearchQuery(query)}
                value={searchQuery}
                onSubmitEditing={handleSearch}
                style={styles.searchbar}
              />
            </Card>
          </View>
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
                  left: -80,
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
                  left: -70,
                }}
              >
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      name="exclamation-thick"
                      size={30}
                    />
                  )}
                  size={40} // Adjust the size to prevent cropping
                  onPress={() => setPlacesVisible(true)}
                  style={{ backgroundColor: "#c58fff", borderRadius: 20 }} // Adjust color and borderRadius as needed
                />
              </View>
              <View
                style={{
                  left: -60,
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
                  style={{ flexGrow: 1 }}
                />
              </View>
              <View style={{ padding: 10 }}>
                <SelectList
                  placeholder="Category"
                  setSelected={(val) => setSelected(val)}
                  data={data}
                  save="value"
                />
              </View>
            </View>
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

        <Modal
          animationType="slide"
          visible={placesVisible}
          onRequestClose={() => {
            setPlacesVisible(!placesVisible);
          }}
        >
          <IconButton
            icon={() => (
              <MaterialCommunityIcons name="close-circle" size={30} />
            )}
            size={20} // Adjust the size to prevent cropping
            onPress={() => setPlacesVisible(!placesVisible)}
          />
          <Card>
            <Text
              style={{ fontSize: 30, textAlign: "center", paddingBottom: 10 }}
            >
              Added Places
            </Text>
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={item => item.id} />
          </Card>
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
  searchbar: {
    margin: 10,
  },
});
