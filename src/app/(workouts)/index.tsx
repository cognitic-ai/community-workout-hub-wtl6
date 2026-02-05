import { View, ScrollView, Pressable, Text } from "react-native";
import { Link, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { SymbolView } from "expo-symbols";
import * as AC from "@bacons/apple-colors";
import { useWorkoutStore } from "@/store/workout-store";
import WorkoutCard from "@/components/workout-card";

export default function WorkoutsScreen() {
  const { workouts, signups, isAdmin, toggleAdmin } = useWorkoutStore();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isAdmin ? (
          <Link href="/(workouts)/create" asChild>
            <Pressable hitSlop={8}>
              <SymbolView
                name="plus.circle.fill"
                size={28}
                tintColor={AC.systemBlue as string}
              />
            </Pressable>
          </Link>
        ) : null,
    });
  }, [navigation, isAdmin]);

  const sortedWorkouts = [...workouts].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 16,
        paddingTop: process.env.EXPO_OS === "web" ? 80 : 16,
        gap: 12,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Pressable
        onPress={toggleAdmin}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: isAdmin
            ? (AC.systemOrange as string) + "20"
            : (AC.systemBlue as string) + "20",
          padding: 10,
          borderRadius: 10,
          borderCurve: "continuous",
          marginBottom: 4,
        }}
      >
        <SymbolView
          name={isAdmin ? "person.badge.shield.checkmark.fill" : "person.fill"}
          size={16}
          tintColor={isAdmin ? (AC.systemOrange as string) : (AC.systemBlue as string)}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: isAdmin ? (AC.systemOrange as string) : (AC.systemBlue as string),
          }}
        >
          {isAdmin ? "Admin Mode" : "Member Mode"} (tap to toggle)
        </Text>
      </Pressable>

      {sortedWorkouts.length === 0 ? (
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
            name="calendar.badge.plus"
            size={48}
            tintColor={AC.tertiaryLabel as string}
          />
          <Text style={{ fontSize: 17, color: AC.secondaryLabel as string }}>
            No workouts scheduled
          </Text>
          {isAdmin && (
            <Link href="/(workouts)/create" asChild>
              <Pressable
                style={{
                  backgroundColor: AC.systemBlue as string,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  marginTop: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                  Create First Workout
                </Text>
              </Pressable>
            </Link>
          )}
        </View>
      ) : (
        sortedWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            signupCount={signups.filter((s) => s.workoutId === workout.id).length}
          />
        ))
      )}
    </ScrollView>
  );
}
