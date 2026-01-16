import { View, Text, StyleSheet } from "react-native";

export default function Placeholder() {
  return (
    <View style={styles.container}>
      <Text>Placehlder, Not Implemented Yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
