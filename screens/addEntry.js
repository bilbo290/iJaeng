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
  ScrollView,
  TextInput,
} from "react-native";
import { Button, Appbar, FAB, Portal, Provider } from "react-native-paper";
import { Formik } from "formik";
import { globalStyles } from "../styles/global";
import { app } from "../src/firebase/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useHeaderHeight } from "@react-navigation/elements";

export default function AddEntry({ navigation, setModalVisible: setModalVisible }) {
  //const { addEntryHandler } = addEntryHandler;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const headerHeight = useHeaderHeight();
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  async function updateDb(values, image) {
    const db = getFirestore();
    const auth = getAuth();
    const date = new Date();
    const docRef = await addDoc(collection(db, "entries"), {
      caption: values.caption,
      timestamp: date,
      member: [auth.currentUser.uid],
    });
    //
    //console.log("Document written with ID: ", docRef.id, " by user:", auth.currentUser.uid);
    try {
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
          console.log("Checkpoint 1");
          const gsReference = ref(storage, "gs://hackathon-be340.appspot.com/" + docRef.id);

          console.log("Succesfully upload");
        })
        .catch((e) => {
          console.log(e);
          console.log("HI");
        });
    } catch {
      console.log("oh no");
    }
  }

  const { open } = state;
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
    <Provider>
      <View style={{ flex: 1, paddingTop: "10%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              console.log("dismiss");
            }}
          >
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Formik
                initialValues={{ caption: "" }}
                onSubmit={(values, actions) => {
                  updateDb(values, image).then(() => {
                    setTimeout(() => {
                      actions.resetForm();
                      setModalVisible(false);
                      console.log("Exiting");
                    }, 1000);
                  });
                }}
              >
                {(props) => (
                  <View>
                    <Appbar
                      style={{
                        backgroundColor: "#442C2E",
                      }}
                    >
                      {/* <Appbar.BackAction /> */}
                      <Appbar.Action
                        icon="arrow-left"
                        onPress={() => {
                          setModalVisible(false);
                        }}
                      />
                      <Appbar.Content
                        title="Token Remaining"
                        subtitle="Subtitle"
                        titleStyle={{ alignSelf: "center" }}
                        subtitleStyle={{ alignSelf: "center" }}
                      />
                      <Appbar.Action
                        icon="send"
                        accessibilityLabel="Submit"
                        onPress={props.handleSubmit}
                      />
                    </Appbar>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <Button
                          icon="account-circle"
                          color="#000"
                          labelStyle={{ fontSize: 30 }}
                          style={{ backgroundColor: "#fff" }}
                        ></Button>
                      </View>
                      <View style={{ flex: 6, backgroundColor: "#fff" }}>
                        <TextInput
                          multiline
                          style={styles.input}
                          color="#000"
                          backgroundColor="#FFFFFF"
                          numberOfLines={3}
                          mode="flat"
                          placeholder="  What's happening?"
                          onChangeText={props.handleChange("caption")}
                          value={props.values.caption}
                        />
                      </View>
                    </View>

                    {/* <View style={globalStyles.gridButton}>
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
                    </View> */}
                    {image && (
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: "50%", alignSelf: "center" }}
                      />
                    )}
                  </View>
                )}
              </Formik>

              <Portal>
                <FAB.Group
                  open={open}
                  icon={open ? "calendar-today" : "plus"}
                  backgroundColor="#FFF"
                  fabStyle={{ backgroundColor: "#442C2E" }}
                  actions={[
                    {
                      icon: "camera",
                      label: "CAMERA",
                      onPress: () => console.log("Pressed star"),
                    },
                    {
                      icon: "file-image",
                      label: "PHOTO",
                      onPress: pickImage,
                    },
                    {
                      icon: "login",
                      label: "PHOTO",
                      onPress: pickImage,
                    },
                  ]}
                  onStateChange={onStateChange}
                  onPress={() => {
                    if (open) {
                      // do something if the speed dial is open
                    }
                  }}
                />
              </Portal>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Provider>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 0,
    borderWidth: 0,
    fontSize: 20,
    marginRight: 10,
    fontFamily: "Montserrat-Medium",
  },
  button: {
    marginTop: 30,
    marginHorizontal: 40,
  },
  container: {
    flex: 1,
  },
});
