import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

const EventPage = () => {
  const { eventId } = useLocalSearchParams();

  return (
    <View>
      <Text>{eventId}</Text>
    </View>
  );
};

export default EventPage;
