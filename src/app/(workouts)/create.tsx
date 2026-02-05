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
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as AC from "@bacons/apple-colors";
import { useWorkoutStore, WorkoutType } from "@/store/workout-store";
import { workoutTypeConfig } from "@/components/workout-card";

const workoutTypes: WorkoutType[] = ["run", "ruck", "hike", "track"];

export default function CreateWorkoutScreen() {
  const { addWorkout } = useWorkoutStore();
  const [type, setType] = useState<WorkoutType>("run");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const formatTime = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleCreate = () => {
    if (!title.trim() || !location.trim()) {
      return;
    }

    const mapCoordinates =
      latitude && longitude
        ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
        : undefined;

    addWorkout({
      type,
      title: title.trim(),
      location: location.trim(),
      date,
      time: formatTime(time),
      description: description.trim() || undefined,
      mapCoordinates,
    });

    router.back();
  };

  const canCreate = title.trim() && location.trim();

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
        {/* Workout Type */}
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel as string, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Workout Type
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {workoutTypes.map((wType) => {
              const config = workoutTypeConfig[wType];
              const isSelected = type === wType;
              return (
                <Pressable
                  key={wType}
                  onPress={() => setType(wType)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderCurve: "continuous",
                    backgroundColor: isSelected
                      ? config.color + "20"
                      : (AC.tertiarySystemFill as string),
                    borderWidth: 2,
                    borderColor: isSelected ? config.color : "transparent",
                  }}
                >
                  <SymbolView
                    name={config.icon as any}
                    size={24}
                    tintColor={isSelected ? config.color : (AC.secondaryLabel as string)}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      marginTop: 6,
                      color: isSelected ? config.color : (AC.secondaryLabel as string),
                    }}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Title */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel as string, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Saturday Morning Run"
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

        {/* Location */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel as string, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Location
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Central Park, NYC"
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

        {/* Date & Time */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel as string, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Date & Time
          </Text>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: AC.tertiarySystemFill as string,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 8,
              gap: 8,
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <DateTimePicker
                value={date}
                mode="date"
                display="compact"
                onChange={(_, selectedDate) => selectedDate && setDate(selectedDate)}
                minimumDate={new Date()}
              />
            </View>
            <View
              style={{
                width: 1,
                backgroundColor: AC.separator as string,
              }}
            />
            <View style={{ flex: 1, alignItems: "center" }}>
              <DateTimePicker
                value={time}
                mode="time"
                display="compact"
                onChange={(_, selectedTime) => selectedTime && setTime(selectedTime)}
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel as string, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Description (optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about the workout..."
            placeholderTextColor={AC.placeholderText as string}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: AC.tertiarySystemFill as string,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 14,
              fontSize: 16,
              color: AC.label as string,
              minHeight: 80,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Map Coordinates */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel as string, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Map Coordinates (optional)
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <TextInput
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                placeholderTextColor={AC.placeholderText as string}
                keyboardType="decimal-pad"
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
            <View style={{ flex: 1 }}>
              <TextInput
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                placeholderTextColor={AC.placeholderText as string}
                keyboardType="decimal-pad"
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
          </View>
        </View>

        {/* Create Button */}
        <Pressable
          onPress={handleCreate}
          disabled={!canCreate}
          style={({ pressed }) => ({
            backgroundColor: canCreate
              ? (AC.systemBlue as string)
              : (AC.tertiarySystemFill as string),
            borderRadius: 14,
            borderCurve: "continuous",
            padding: 16,
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
            marginTop: 8,
          })}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: canCreate ? "white" : (AC.tertiaryLabel as string),
            }}
          >
            Create Workout
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
