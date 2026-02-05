import { View, ScrollView, Text } from "react-native";
import { SymbolView } from "expo-symbols";
import * as AC from "@bacons/apple-colors";
import { useWorkoutStore } from "@/store/workout-store";
import ActivityItemCard from "@/components/activity-item";

export default function ActivityScreen() {
  const { activity } = useWorkoutStore();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: process.env.EXPO_OS === "web" ? 80 : 16,
        gap: 10,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {activity.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 60,
            gap: 12,
          }}
        >
          <SymbolView
            name="bell.slash"
            size={48}
            tintColor={AC.tertiaryLabel as string}
          />
          <Text style={{ fontSize: 17, color: AC.secondaryLabel as string }}>
            No activity yet
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: AC.tertiaryLabel as string,
              textAlign: "center",
              maxWidth: 260,
            }}
          >
            When people sign up for workouts or post results, you'll see it here
          </Text>
        </View>
      ) : (
        activity.map((item) => <ActivityItemCard key={item.id} activity={item} />)
      )}
    </ScrollView>
  );
}
