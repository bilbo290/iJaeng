import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import { globalStyles } from "../styles/global";
import { app } from "../src/firebase/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

async function updateDb(values) {
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
  // Alert.alert("Success", "New Entry at " + docRef.id, [
  //   {
  //     text: "OK",
  //     onPress: () => {
  //       console.log("OK Pressed");
  //     },
  //   },
  // ]);
}
export default function AddEntry({ navigation }) {
  //const { addEntryHandler } = addEntryHandler;

  const onSubmit = (values) => {
    try {
      updateDb(values);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ tag: "", caption: "" }}
        onSubmit={(values, actions) => {
          onSubmit(values, navigation);
          actions.resetForm();
          console.log(values);
          navigation.navigate("Home");
        }}
      >
        {(props) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Tag"
              onChangeText={props.handleChange("tag")}
              value={props.values.tag}
            />

            <TextInput
              multiline
              style={styles.input}
              placeholder="Caption"
              onChangeText={props.handleChange("caption")}
              value={props.values.caption}
            />

            <Button
              title="submit"
              color="purple"
              mode="contained"
              onPress={props.handleSubmit}
              style={styles.button}
            >
              Submit
            </Button>
          </View>
        )}
      </Formik>
      {/* <Text>Add Entry Screen</Text>
      <TextInput style={styles.input} onChangeText={onChangeTag} placeholder="Tag" value={tag} />
      <TextInput
        style={styles.input}
        onChangeText={onChangeCaption}
        placeholder="Caption"
        value={caption}
      />
      <TextInput style={styles.input} onChangeText={onChangeId} placeholder="id" value={id} />
      <TextInput
        style={styles.input}
        onChangeText={onChangeVote}
        placeholder="voteCount"
        value={voteCount}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeStatus}
        placeholder="status"
        value={status}
      />

      <Button
        onPress={() => {
          let data = {
            tag: tag,
            caption: caption,
            id: id,
            voteCount: voteCount,
            status: status,
          };
          console.log(data);
          addEntryHandler(data);
        }}
      >
        Test
      </Button> */}
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    marginHorizontal: 40,
  },
  button: {
    marginHorizontal: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
