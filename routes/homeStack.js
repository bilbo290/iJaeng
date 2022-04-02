import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home";
import AddEntry from "../screens/addEntry";
import Login from "../screens/login";
const screens = {
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login",
      headerStyle: { backgroundColor: "#eee" },
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home",
      //headerStyle: { backgroundColor: '#eee' }
    },
  },
  ReviewDetails: {
    screen: AddEntry,
    navigationOptions: {
      title: "Add Entry",
      //headerStyle: { backgroundColor: '#eee' }
    },
  },
};

// home stack navigator screens
const HomeStack = createNativeStackNavigator();

export default createNativeStackNavigator(HomeStack);
