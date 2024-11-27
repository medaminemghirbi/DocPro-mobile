import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { theme } from "../core/theme"; // Assuming you have a theme file
import { SelectList } from "react-native-dropdown-select-list"; // Replace with the correct import path

export default function StyledSelectList({
  errorText,
  description,
  data,
  setSelected,
  ...props
}) {
  return (
    <View style={styles.container}>
      <SelectList
        setSelected={setSelected}
        data={data}
        save="value"
        boxStyles={styles.selectBox} // Customize the dropdown box
        inputStyles={styles.inputText} // Customize the text inside the box
        dropdownStyles={styles.dropdownBox} // Customize dropdown options container
        dropdownTextStyles={styles.dropdownText} // Customize dropdown text
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  selectBox: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  inputText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  dropdownBox: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});
