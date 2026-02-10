import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  MediaDetail: { mediaId: number; mediaType: "movie" | "tv" };
  PersonProfile: { personId: number };
  Search: undefined;
};

// Define the specific props for the PersonProfile screen
export type PersonProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "PersonProfile"
>;