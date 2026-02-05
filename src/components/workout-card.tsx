import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as AC from "@bacons/apple-colors";
import { Workout, WorkoutType } from "@/store/workout-store";

const workoutTypeConfig: Record<WorkoutType, { icon: string; color: string; label: string }> = {
  run: { icon: "figure.run", color: AC.systemGreen as string, label: "Run" },
  ruck: { icon: "backpack.fill", color: AC.systemOrange as string, label: "Ruck" },
  hike: { icon: "figure.hiking", color: AC.systemTeal as string, label: "Hike" },
  track: { icon: "figure.track.and.field", color: AC.systemPurple as string, label: "Track" },
};

function formatDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

interface WorkoutCardProps {
  workout: Workout;
  signupCount?: number;
}

export default function WorkoutCard({ workout, signupCount = 0 }: WorkoutCardProps) {
  const config = workoutTypeConfig[workout.type];

  return (
    <Link href={`/workout/${workout.id}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: AC.secondarySystemGroupedBackground as string,
          borderRadius: 16,
          borderCurve: "continuous",
          padding: 16,
          opacity: pressed ? 0.8 : 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        })}
      >
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              borderCurve: "continuous",
              backgroundColor: config.color + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={config.icon as any}
              size={26}
              tintColor={config.color}
            />
          </View>

          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: config.color,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {config.label}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: AC.label as string,
              }}
              numberOfLines={1}
            >
              {workout.title}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <SymbolView
                  name="calendar"
                  size={14}
                  tintColor={AC.secondaryLabel as string}
                />
                <Text style={{ fontSize: 13, color: AC.secondaryLabel as string }}>
                  {formatDate(workout.date)}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <SymbolView
                  name="clock"
                  size={14}
                  tintColor={AC.secondaryLabel as string}
                />
                <Text style={{ fontSize: 13, color: AC.secondaryLabel as string }}>
                  {workout.time}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <SymbolView
                name="mappin"
                size={14}
                tintColor={AC.tertiaryLabel as string}
              />
              <Text
                style={{ fontSize: 13, color: AC.tertiaryLabel as string, flex: 1 }}
                numberOfLines={1}
              >
                {workout.location}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: AC.tertiarySystemFill as string,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                borderCurve: "continuous",
              }}
            >
              <SymbolView
                name="person.2.fill"
                size={12}
                tintColor={AC.secondaryLabel as string}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: AC.secondaryLabel as string,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {signupCount}
              </Text>
            </View>

            <SymbolView
              name="chevron.right"
              size={14}
              tintColor={AC.tertiaryLabel as string}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export { workoutTypeConfig };
