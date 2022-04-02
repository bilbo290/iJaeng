import React, { useState, createContext } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
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
import { getFirestore, collection, getDocs } from "firebase/firestore";

const LeftContent = (props) => <ActivityIndicator animating={true} color={Colors.red800} />;

const addEntryHandler = (newEntry) => {
  setEntries((prevEntry) => {
    return prevEntry.join(newEntry);
  });
};

async function getDb() {
  const db = getFirestore();

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    console.log(doc.data());
  });
}
export default function Home({ navigation }) {
  getDb();
  const [entries, setEntries] = useState([
    {
      tag: "ฟุตบาท",
      caption: "ฟุตบาทหน้าปากซอย",
      id: "3ac3fe6",
      voteCount: "0",
      status: "open",
    },
    {
      tag: "เสาไฟฟ้า",
      caption: "เสาไฟฟ้าหน้าซอยเมืองเอก",
      id: "59ad3a",
      voteCount: "2",
      status: "closed",
    },
    {
      tag: "ฝาท่อ",
      caption: "ฝาท่อหน้าซอย 12",
      id: "438afd",
      voteCount: "2",
      status: "closed",
    },
    {
      tag: "เสาไฟฟ้า",
      caption: "ซอยไก่",
      id: "e7c45f",
      voteCount: "4",
      status: "closed",
    },
  ]);
  const deleteHandler = (key) => {
    setEntries((prevEntry) => {
      return prevEntry.filter((entry) => entry.id != key);
    });
  };
  return (
    <View style={homeStyles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={entries}
        renderItem={({ item }) => (
          <Card>
            <Card.Title
              title={item.tag}
              subtitle={"Id : " + item.id}
              style={{ fontFamily: "Athiti-Regular" }}
            />
            <Card.Content>
              <Title style={{ fontFamily: "Athiti-Regular" }}>{item.caption}</Title>
            </Card.Content>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
            <Card.Actions>
              <Button>{"Status : " + item.status}</Button>
              <Button>{"Vote :" + item.voteCount}</Button>
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
      />
      <FAB
        style={homeStyles.fab}
        icon="plus"
        onPress={() => {
          console.log("Pressed");
          navigation.navigate("AddEntry");
        }}
      />
    </View>
  );
}

const homeStyles = StyleSheet.create({
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
    paddingTop: "0%",
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
