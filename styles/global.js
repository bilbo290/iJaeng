import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#FEEAE6",
  },
  primary: {
    backgroundColor: "#fff",
    fontFamily: "Athiti-Regular",
  },
  secondary: {
    backgroundColor: "#fff",
    fontFamily: "Athiti-Regular",
    color: "#442C2E",
  },
  cardTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 20,
    color: "#442C2E",
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
  login: {
    marginTop: 5,
    marginHorizontal: 0,
    width: "50%",
    fontFamily: "Montserrat-Medium",
  },
});
