import React, { useState, createContext, useEffect, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList, Modal, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { globalStyles } from "../styles/global";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Colors,
  Divider,
  Text,
  FAB,
  Provider,
  Portal,
  Appbar,
} from "react-native-paper";
import { app } from "../src/firebase/config";
import {
  doc,
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  arrayRemove,
  update,
  updateDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import AddEntry from "../screens/addEntry";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

{
  /*--------------------------------------------------------------------------------------------*/
}

export default function Home({ navigation }) {
  const [entries, setEntries] = useState("");
  const [visible, setVisible] = useState(false);
  const [reload, setReload] = useState(true);
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const hideModal = () => setVisible(false);

  async function getDbUsers() {
    console.log("getDbUsers Trigger");
    let entry = [];
    const db = getFirestore();
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const userEntry = collection(db, "entries");
    const userRelated = query(userEntry, where("member", "array-contains", uid));
    const sortedDate = query(userRelated, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(sortedDate);
    const storage = getStorage();
    let i = 0;
    querySnapshot.forEach((doc) => {
      //console.log(url);
      i += 1;
      let newEntry = {
        caption: doc.data().caption,
        docId: doc.id,
        key: i,
        image: null,
        member: doc.data().member,
      };
      entry.push(newEntry);
      //console.log("Entries for user :", uid, entry);
      //console.log(entry);
    });

    return [entry, uid];
  }
  async function getImg(entries) {
    console.log("getImg Trigger");
    let entryBuffer = entries;
    const storage = getStorage();
    for (let i = 0; i < entryBuffer.length; i++) {
      const gsReference = ref(storage, "gs://hackathon-be340.appspot.com/" + entryBuffer[i].docId);
      try {
        await getDownloadURL(gsReference).then((url) => {
          //console.log("URL Retrived =>" + url);
          entryBuffer[i].image = url;
        });
      } catch {
        console.log("Img not found");
      }
    }
    //console.log(entryBuffer);
    return entryBuffer;
  }
  async function deleteDb(entries, key, uid) {
    console.log("deleteDb Trigger");
    const db = getFirestore();
    const docId = entries[key - 1].docId;
    const toBeDelete = doc(db, "entries", docId);
    ///console.log(toBeDelete);
    updateDoc(toBeDelete, { member: arrayRemove(uid) }).then(() => {
      console.log("Remove user id: ", uid, " from entries id: ", docId);
    });
    // toBeDelete.update({
    //   member: arrayRemove(uid),
    // });
    // await updateDoc(toBeDelete, {
    //   capital: true,
    // });
    //console.log(collection(db, "entries").doc(docId));
    //collection(db, "entries").document(docId).FieldValue("members").update(arrayRemove(uid));
  }

  useFocusEffect(
    useCallback(() => {
      getDbUsers().then(async (res) => {
        const [entry, uid] = res;
        //console.log(uid);
        let entryWithImg = await getImg(entry);
        setEntries(entryWithImg);
        setUsername(uid);
        //console.log(entries);
        //console.log(reload);
        console.log("Updated");
      });
      return () => {
        console.log("cleaned up");
        console.log("---------------------------");
      };
    }, [visible, reload])
  );

  return (
    <View style={globalStyles.container}>
      <Provider>
        <Appbar.Header style={{ backgroundColor: "#442C2E" }}>
          {/* <Appbar.BackAction /> */}
          <Appbar.Action icon="account-circle" />
          <Appbar.Content title={username} subtitle="Subtitle" />
          <Appbar.Action icon="magnify" />
          <Appbar.Action icon="dots-vertical" />
        </Appbar.Header>
        <FlatList
          //keyExtractor={(item) => item.id}
          data={entries}
          renderItem={({ item }) => (
            <Card mode="outlined" style={{ marginVertical: 5, color: "#000" }}>
              <Card.Title
                title={item.caption}
                style={globalStyles.primary}
                titleStyle={globalStyles.cardTitle}
              />
              <Divider style={{ height: 1, marginLeft: 10, marginRight: 50 }} />
              <Card.Content style={globalStyles.secondary}>
                <Title style={{ fontFamily: "Athiti-Regular" }}>{item.docId}</Title>
              </Card.Content>
              <Card.Cover source={{ uri: item.image }} />
              <Card.Actions>
                <Button
                  onPress={() => {
                    //deleteHandler(item.id);
                    //console.log("deleting : " + item.key);
                    deleteDb(entries, item.key, username);
                    setReload(!reload);
                  }}
                >
                  Delete
                </Button>
              </Card.Actions>
              <Divider />
            </Card>
          )}
          style={{ margin: 10 }}
        />
        <Portal>
          <Modal
            visible={visible}
            animationType="slide"
            onDismiss={hideModal}
            contentContainerStyle={homeStyles.modal}
          >
            <AddEntry setModalVisible={setVisible} />
          </Modal>
        </Portal>
        <FAB
          style={homeStyles.fab}
          icon="plus"
          onPress={() => {
            // console.log("Pressed");
            // navigation.navigate("AddEntry");
            //console.log(entries[0]);
            setVisible(true);
          }}
        />
        <FAB
          style={homeStyles.fabLogout}
          icon="minus"
          label="Logout"
          onPress={() => {
            const auth = getAuth();
            const uid = auth.currentUser.uid;
            //console.log(uid);
            signOut(auth).then((res) => {
              console.log("logged out");
              navigation.navigate("Login");
            });
          }}
        />
      </Provider>
    </View>
  );
}

const homeStyles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    marginTop: "10%",
    flex: 1,
    marginHorizontal: 0,
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  fabLogout: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "#442C2E",
    fontFamily: "Athiti-Regular",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#442C2E",
    fontFamily: "Athiti-Regular",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    paddingTop: "10%",
  },
  item: {
    fontFamily: "Athiti-Regular",
    flex: 1,
    marginHorizontal: 10,
    marginTop: 24,
    padding: 30,
    backgroundColor: "lightgrey",
    fontSize: 36,
  },
});
