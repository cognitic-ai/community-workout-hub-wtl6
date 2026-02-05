import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as AC from "@bacons/apple-colors";
import { ActivityItem as ActivityItemType, WorkoutType } from "@/store/workout-store";
import { workoutTypeConfig } from "./workout-card";

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

function getActivityIcon(type: ActivityItemType["type"]): string {
  switch (type) {
    case "signup":
      return "person.badge.plus";
    case "result":
      return "flag.checkered";
    case "workout_created":
      return "plus.circle.fill";
  }
}

function getActivityColor(type: ActivityItemType["type"]): string {
  switch (type) {
    case "signup":
      return AC.systemBlue as string;
    case "result":
      return AC.systemGreen as string;
    case "workout_created":
      return AC.systemOrange as string;
  }
}

function getActivityText(activity: ActivityItemType): string {
  switch (activity.type) {
    case "signup":
      return `signed up for`;
    case "result":
      return `posted results for`;
    case "workout_created":
      return `created`;
  }
}

interface ActivityItemProps {
  activity: ActivityItemType;
}

export default function ActivityItemCard({ activity }: ActivityItemProps) {
  const activityColor = getActivityColor(activity.type);
  const activityIcon = getActivityIcon(activity.type);
  const workoutConfig = workoutTypeConfig[activity.workoutType];

  return (
    <Link href={`/workout/${activity.workoutId}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: AC.secondarySystemGroupedBackground as string,
          borderRadius: 14,
          borderCurve: "continuous",
          padding: 14,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: activityColor + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={activityIcon as any}
              size={18}
              tintColor={activityColor}
            />
          </View>

          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontSize: 15, color: AC.label as string }}>
              <Text style={{ fontWeight: "600" }}>{activity.userName}</Text>
              {" "}{getActivityText(activity)}{" "}
              <Text style={{ fontWeight: "600", color: workoutConfig.color }}>
                {activity.workoutTitle}
              </Text>
            </Text>

            {activity.type === "result" && activity.result && (
              <View
                style={{
                  backgroundColor: AC.tertiarySystemFill as string,
                  borderRadius: 10,
                  borderCurve: "continuous",
                  padding: 10,
                  marginTop: 6,
                  gap: 6,
                }}
              >
                <View style={{ flexDirection: "row", gap: 16 }}>
                  {activity.result.distance && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <SymbolView
                        name="ruler"
                        size={12}
                        tintColor={AC.secondaryLabel as string}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: AC.label as string,
                        }}
                      >
                        {activity.result.distance}
                      </Text>
                    </View>
                  )}
                  {activity.result.duration && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <SymbolView
                        name="stopwatch"
                        size={12}
                        tintColor={AC.secondaryLabel as string}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: AC.label as string,
                        }}
                      >
                        {activity.result.duration}
                      </Text>
                    </View>
                  )}
                </View>
                {activity.result.notes && (
                  <Text
                    style={{ fontSize: 13, color: AC.secondaryLabel as string }}
                    numberOfLines={2}
                  >
                    "{activity.result.notes}"
                  </Text>
                )}
              </View>
            )}

            <Text style={{ fontSize: 12, color: AC.tertiaryLabel as string, marginTop: 2 }}>
              {getTimeAgo(activity.timestamp)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
