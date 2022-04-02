import React, { useState, createContext, useEffect, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
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
} from "react-native-paper";
import { app } from "../src/firebase/config";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
const LeftContent = (props) => <ActivityIndicator animating={true} color={Colors.red800} />;

const addEntryHandler = (newEntry) => {
  setEntries((prevEntry) => {
    return prevEntry.join(newEntry);
  });
};

async function getDb() {
  const db = getFirestore();
  let entry = [];
  const querySnapshot = await getDocs(collection(db, "entries"));
  querySnapshot.forEach((doc) => {
    let newEntry = {
      tag: doc.data().tag,
      caption: doc.data().caption,
    };
    entry.push(newEntry);
  });
  return entry;
}

async function getDbUsers() {
  const db = getFirestore();
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  let entry = [];
  const userEntry = collection(db, "entries");

  const userRelated = query(userEntry, where("member", "array-contains", uid));

  const sortedDate = query(userRelated, orderBy("timestamp", "desc"));

  const querySnapshot = await getDocs(sortedDate);
  querySnapshot.forEach((doc) => {
    let newEntry = {
      tag: doc.data().tag,
      caption: doc.data().caption,
    };
    entry.push(newEntry);
  });
  console.log(entry);
  return entry;
}

async function deleteDb() {
  const db = getFirestore();
  await deleteDoc(doc(db, "cities", "DC"));
}
export default function Home({ navigation }) {
  const [entries, setEntries] = useState("");
  useFocusEffect(
    useCallback(() => {
      getDbUsers().then((res) => {
        setEntries(res);
      });
    }, [])
  );

  return (
    <View style={globalStyles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={entries}
        renderItem={({ item }) => (
          <Card mode="outlined" style={{ marginVertical: 5, color: "#000" }}>
            <Card.Title
              title={item.tag}
              style={globalStyles.primary}
              titleStyle={globalStyles.cardTitle}
            />
            <Divider style={{ height: 1, marginLeft: 10, marginRight: 50 }} />
            <Card.Content style={globalStyles.secondary}>
              <Title style={{ fontFamily: "Athiti-Regular" }}>{item.caption}</Title>
            </Card.Content>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
            <Card.Actions>
              <Button
                onPress={() => {
                  deleteHandler(item.id);
                  console.log("deleting : " + item.id);
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
      <FAB
        style={homeStyles.fab}
        icon="plus"
        onPress={() => {
          console.log("Pressed");
          navigation.navigate("AddEntry");
        }}
      />
      <FAB
        style={homeStyles.fabLogout}
        icon="minus"
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
    </View>
  );
}

const homeStyles = StyleSheet.create({
  fabLogout: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: "purple",
    fontFamily: "Athiti-Regular",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "purple",
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
