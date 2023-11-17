import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { styles } from "./styles/styles";

const db = SQLite.openDatabase("App.db");

export default function App() {
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState("https://via.placeholder.com/150");
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { statusCamera } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { statusLibrary } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (statusCamera !== "granted" || statusLibrary !== "granted") {
        alert(
          "Sorry, we need camera and media library permissions!"
        );
      }
    })();

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT, image TEXT);"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM data ORDER BY id DESC LIMIT 1;",
        [],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            setQuote(_array[0].quote);
            setImage(_array[0].image);
            setIsSaved(true);
          }
        }
      );
    });
    checkSavedData();
  }, []);

  const checkSavedData = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM data ORDER BY id DESC LIMIT 1;', [], (_, { rows: { _array } }) => {
        if (_array.length > 0) {
          setQuote(_array[0].quote);
          setImage(_array[0].image);
          setIsSaved(true);
        }
      });
    });
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
      setModalVisible(false);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const takenPhoto = result.assets[0];
      setImage(takenPhoto.uri);
      setModalVisible(false);
    }
  };

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const saveData = async () => {
    try {
      const timestamp = new Date().getTime();
      const profilePictureFilename = `picture_${timestamp}.jpg`;
      const documentDirectory =
        FileSystem.documentDirectory + profilePictureFilename;

      await FileSystem.moveAsync({
        from: image,
        to: documentDirectory,
      });

      db.transaction(
        (tx) => {
          tx.executeSql("INSERT INTO data (quote, image) VALUES (?, ?)", [
            quote,
            documentDirectory,
          ]);
        },
        null,
        null
      );

      setIsSaved(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const clearData = () => {
  //   db.transaction((tx) => {
  //     tx.executeSql("DELETE FROM data;");
  //   });

  //   setQuote("");
  //   setImage("https://via.placeholder.com/150");
  //   setIsSaved(false);
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorite Moment!!</Text>
      <Text style={styles.subtitle}>LAB7 - DIEGO VELASQUEZ</Text>
      {isSaved && <Text style={styles.dataSavedText}>Data Saved!!</Text>}

      <TouchableOpacity onPress={handleImagePress}>
        <Image style={styles.image} source={{ uri: image }} />
      </TouchableOpacity>

      {!isSaved ? (
        <TextInput
          style={styles.input}
          onChangeText={setQuote}
          value={quote}
          placeholder="Enter a quote"
        />
      ) : (
        <Text style={styles.quoteText}>{quote}</Text>
      )}

      {!isSaved && (
        <Button style={styles.button} title="Save Data" onPress={saveData} />
      )}
      {/* <Button title="Clear Data" onPress={clearData} /> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={selectImage}>
              <Text style={styles.linkText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto}>
              <Text style={styles.linkText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.linkText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
