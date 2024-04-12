import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

const data = [
  { key: "1", title: "Mobiles", disabled: true },
  { key: "2", title: "Appliances" },
  { key: "3", title: "Cameras" },
  { key: "4", title: "Computers", disabled: true },
  { key: "5", title: "Vegetables" },
  { key: "6", title: "Diary Products" },
  { key: "7", title: "Drinks" },
];

export const Select = () => {
  const [v, setV] = useState();

  return (
    <SelectDropdown
      data={data}
      onSelect={setV}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedItem?.title || "Select your mood"}
            </Text>
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        );
      }}
      dropdownStyle={styles.dropdownMenuStyle}
      dropdownOverlayColor={"transparent"}
    />
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "rgba(243, 245, 247, 1)",
    borderWidth: 1,
    borderColor: "rgba(236, 236, 236, 1);",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Nunito-Regular",
    fontWeight: "500",
    color: "rgba(185, 184, 188, 1)",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
