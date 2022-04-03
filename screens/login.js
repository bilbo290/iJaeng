import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { app } from "../src/firebase/config";
import logo from "../assets/splash.png";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { globalStyles } from "../styles/global";

const Login = ({ navigation }) => {
  // Initialize Firebase

  const [userId, setUserId] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const onLoginPress = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, userId, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Login success");
        onAuthStateChanged(auth, (user) => {
          if (user) {
            navigation.navigate("Home");
          } else {
            console.log("logged out");
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        Alert.alert("Error", errorMessage, [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
        // ..
      });
  };

  const onRegisPress = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, userId, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Regis success");
        Alert.alert("Success", "Registeration Succesful", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ..
      });
  };
  const onAnonymousPress = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            // ...}
            //console.log(uid);
            navigation.navigate("Home");
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  };
  const Logo = Image.resolveAssetSource(logo).uri;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        console.log("dismiss");
      }}
    >
      <View style={globalStyles.container}>
        <View style={styles.top}>
          <ActivityIndicator animating={true} color="#FEEAE6" />
          {/* <Image style={{ width: 250, height: 250 }} source={require("../assets/toad.gif")} /> */}
        </View>
        <View style={styles.middle}>
          <Text style={[styles.title, { fontSize: 60, marginBottom: 20 }]}>iJaeng</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            mode="outlined"
            dense={true}
            value={userId}
            onChangeText={(text) => {
              setUserId(text);
            }}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          ></TextInput>

          <TextInput
            style={styles.input}
            mode="outlined"
            dense={true}
            secureTextEntry={true}
            placeholder="Password"
            value={pwd}
            onChangeText={(text) => {
              setPwd(text);
            }}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          ></TextInput>
          <View style={styles.gridButton}>
            <Button
              icon="login"
              mode="text"
              style={styles.login}
              color="#442C2E"
              onPress={() => {
                console.log("press register");
                onRegisPress();
              }}
            >
              Register
            </Button>
            <Button
              icon="login"
              mode="contained"
              style={styles.login}
              color="#FEDBD0"
              onPress={() => {
                console.log("press login", userId, pwd);
                onLoginPress();
              }}
            >
              Login
            </Button>
          </View>

          <Button
            icon="account-off"
            mode="text"
            style={[styles.login, styles.anno]}
            color="#442C2E"
            onPress={() => {
              console.log("press login anonymous");
              onAnonymousPress();
            }}
          >
            Anonymous Mode
          </Button>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.text}>by TOAD Consultant Inc.</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    alignSelf: "center",
    fontFamily: "Montserrat-Black",
    color: "#442C2E",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  middle: {
    flex: 1,
    justifyContent: "flex-start",
  },
  bottom: {
    flex: 0.1,
  },
  gridButton: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    alignSelf: "center",
    marginHorizontal: 80,
    marginTop: 10,
    fontFamily: "Montserrat-Medium",
  },
  anno: {
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 15,
    width: "60%",
    color: "#442C2E",
  },
  marginLogin: {
    marginTop: 15,
  },

  register: {
    marginTop: 5,
  },

  text: {
    justifyContent: "center",
    alignSelf: "center",
    fontFamily: "Montserrat-Medium",
  },
  input: {
    marginHorizontal: 80,
    marginVertical: 0,
    backgroundColor: "#FEEAE6",
  },
});
