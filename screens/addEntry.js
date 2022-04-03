import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import { Formik } from "formik";
import { globalStyles } from "../styles/global";
import { app } from "../src/firebase/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function updateDb(values, image) {
  const db = getFirestore();
  const auth = getAuth();
  const date = new Date();
  const docRef = await addDoc(collection(db, "entries"), {
    tag: values.tag,
    caption: values.caption,
    timestamp: date,
    member: [auth.currentUser.uid],
  });
  console.log("Document written with ID: ", docRef.id, " by user:", auth.currentUser.uid);
  {
    /* Storage */
  }
  const storage = getStorage();
  const fileRef = ref(storage, docRef.id);
  const img = await fetch(image);
  const imgBytes = await img.blob();

  uploadBytes(fileRef, imgBytes)
    .then((res) => {
      // const gsReference = ref(storage, "gs://hackathon-be340.appspot.com/" + docRef.id);
      // const url = "";
      // const timer = setTimeout(() => {
      //   getDownloadURL(gsReference).then((url) => {
      //     console.log("Upload image success at ", url);
      //     //console.log("URL Retrived =>" + url);
      //   });
      // }, 3000);
      // clearInterval(timer);
      const gsReference = ref(storage, "gs://hackathon-be340.appspot.com/" + docRef.id);

      try {
        let timer = setInterval(() => {
          getDownloadURL(gsReference).then((url) => {
            console.log("URL Retrived =>" + url);
          });
        }, 1000);

        setTimeout(() => {
          clearInterval(timer);
        }, 5000);
      } catch {
        console.log("No url fetch");
      }
      console.log("Succesfully upload");
    })
    .catch((e) => {
      console.log(e);
      console.log("HI");
    });

  {
    /* Storage */
  }
}

export default function AddEntry({ navigation, setModalVisible: setModalVisible }) {
  //const { addEntryHandler } = addEntryHandler;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            console.log("dismiss");
          }}
        >
          <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: "#442C2E" }}>
              {/* <Appbar.BackAction /> */}
              <Appbar.Action
                icon="arrow-left"
                onPress={() => {
                  setModalVisible(false);
                }}
              />
              <Appbar.Content title="Token Remaining" subtitle="Subtitle" />
            </Appbar.Header>
            {/* <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={type}>
          <View style={{ flex: 1 }}>
            <Button
              style={{ backgroundColor: "FFF" }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Button
                style={{ backgroundColor: "FFF" }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              ></Button>
              <Text style={styles.text}> Flip </Text>
            </Button>
          </View>
        </Camera>
      </View> */}
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View style={{ flex: 1, justifyContent: "flex-start", marginBottom: "5%" }}>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: "50%", alignSelf: "center" }}
                  />
                )}
                <View style={globalStyles.gridButton}>
                  <Button
                    icon="camera"
                    mode="text"
                    style={globalStyles.login}
                    color="#442C2E"
                    onPress={() => {
                      console.log("press register");
                      onRegisPress();
                    }}
                  >
                    Camera
                  </Button>
                  <Button
                    icon="login"
                    mode="text"
                    style={globalStyles.login}
                    color="#442C2E"
                    onPress={pickImage}
                  >
                    Attach
                  </Button>
                </View>
                <Formik
                  initialValues={{ tag: "", caption: "" }}
                  onSubmit={(values, actions) => {
                    updateDb(values, image).then(() => {
                      setTimeout(() => {
                        actions.resetForm();
                        setModalVisible(false);
                        console.log("Exiting");
                      }, 5000);
                    });
                  }}
                >
                  {(props) => (
                    <View>
                      <TextInput
                        style={styles.input}
                        mode="outlined"
                        placeholder="Tag"
                        onChangeText={props.handleChange("tag")}
                        value={props.values.tag}
                      />

                      <TextInput
                        multiline
                        style={styles.input}
                        mode="outlined"
                        placeholder="Caption"
                        onChangeText={props.handleChange("caption")}
                        value={props.values.caption}
                      />

                      <Button
                        title="submit"
                        color="#442C2E"
                        mode="contained"
                        onPress={props.handleSubmit}
                        style={styles.button}
                      >
                        Submit
                      </Button>
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 2,
    marginHorizontal: 40,
  },
  button: {
    marginTop: 30,
    marginHorizontal: 40,
  },
  container: {
    flex: 1,
  },
});
