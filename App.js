import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

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
          "Sorry, we need camera and media library permissions to make this work!"
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
  }, []);

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

  const clearData = () => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM data;");
    });

    setQuote("");
    setImage("https://via.placeholder.com/150");
    setIsSaved(false);
  };

  return (
    <View style={styles.container}>
      <Text>My Favorite Moment!!</Text>
      <Text>LAB7 - DIEGO VELASQUEZ</Text>
      {isSaved && <Text> Data Saved!!</Text>}
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
        <Text>{quote}</Text>
      )}

      {!isSaved && <Button title="Save Data" onPress={saveData} />}
      <Button title="Clear Data" onPress={clearData} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Choose from Gallery" onPress={selectImage} />
            <Button title="Take a Photo" onPress={takePhoto} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    marginBottom: 20,
    width: "80%",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
