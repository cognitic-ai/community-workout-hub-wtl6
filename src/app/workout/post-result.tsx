import { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as AC from "@bacons/apple-colors";
import { useWorkoutStore } from "@/store/workout-store";

export default function PostResultScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { postResult, getWorkoutById } = useWorkoutStore();

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const workout = getWorkoutById(workoutId);

  const handlePost = () => {
    if (!distance && !duration && !notes) {
      return;
    }

    postResult(workoutId, {
      distance: distance.trim() || undefined,
      duration: duration.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    router.back();
  };

  const canPost = distance.trim() || duration.trim() || notes.trim();

  if (!workout) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <SymbolView
          name="exclamationmark.triangle"
          size={48}
          tintColor={AC.systemOrange as string}
        />
        <Text style={{ fontSize: 17, color: AC.secondaryLabel as string }}>
          Workout not found
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, gap: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Workout Info */}
        <View
          style={{
            backgroundColor: AC.tertiarySystemFill as string,
            borderRadius: 12,
            borderCurve: "continuous",
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <SymbolView
            name="flag.checkered"
            size={24}
            tintColor={AC.systemGreen as string}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                color: AC.secondaryLabel as string,
              }}
            >
              Posting results for
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: AC.label as string,
              }}
            >
              {workout.title}
            </Text>
          </View>
        </View>

        {/* Distance */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: AC.secondaryLabel as string,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Distance
          </Text>
          <TextInput
            value={distance}
            onChangeText={setDistance}
            placeholder="e.g. 5.2 km, 3.1 miles"
            placeholderTextColor={AC.placeholderText as string}
            style={{
              backgroundColor: AC.tertiarySystemFill as string,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 14,
              fontSize: 16,
              color: AC.label as string,
            }}
          />
        </View>

        {/* Duration */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: AC.secondaryLabel as string,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Duration
          </Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 28:45, 1h 15m"
            placeholderTextColor={AC.placeholderText as string}
            style={{
              backgroundColor: AC.tertiarySystemFill as string,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 14,
              fontSize: 16,
              color: AC.label as string,
            }}
          />
        </View>

        {/* Notes */}
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: AC.secondaryLabel as string,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Notes
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="How did it go? Share your experience..."
            placeholderTextColor={AC.placeholderText as string}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: AC.tertiarySystemFill as string,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 14,
              fontSize: 16,
              color: AC.label as string,
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Post Button */}
        <Pressable
          onPress={handlePost}
          disabled={!canPost}
          style={({ pressed }) => ({
            backgroundColor: canPost
              ? (AC.systemGreen as string)
              : (AC.tertiarySystemFill as string),
            borderRadius: 14,
            borderCurve: "continuous",
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: pressed ? 0.8 : 1,
            marginTop: 8,
          })}
        >
          <SymbolView
            name="paperplane.fill"
            size={18}
            tintColor={canPost ? "white" : (AC.tertiaryLabel as string)}
          />
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: canPost ? "white" : (AC.tertiaryLabel as string),
            }}
          >
            Post Results
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
