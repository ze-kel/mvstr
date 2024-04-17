import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

const EventPage = () => {
  const { eventId } = useLocalSearchParams();

  return (
    <View className="" style={{ zIndex: 1, elevation: 1 }}>
      <Text>{eventId}</Text>
    </View>
  );
};

export default EventPage;
