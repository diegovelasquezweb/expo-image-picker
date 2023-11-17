import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  dataSavedText: {
    fontSize: 20,
    color: "green",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 10,
  },
  input: {
    height: 40,
    width: "80%",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  quoteText: {
    fontSize: 18,
    color: "#444",
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
    color: "#fff",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
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
  linkText: {
    fontSize: 18,
    color: "#007BFF",
    marginBottom: 10,
  },
});

