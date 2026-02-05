import { useState, useLayoutEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useNavigation, Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import MapView, { Marker } from "react-native-maps";
import * as AC from "@bacons/apple-colors";
import { useWorkoutStore } from "@/store/workout-store";
import { workoutTypeConfig } from "@/components/workout-card";

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const {
    getWorkoutById,
    getSignupsForWorkout,
    getResultsForWorkout,
    signUpForWorkout,
    cancelSignup,
    isSignedUp,
  } = useWorkoutStore();

  const workout = getWorkoutById(id);
  const signups = getSignupsForWorkout(id);
  const results = getResultsForWorkout(id);
  const userIsSignedUp = isSignedUp(id);

  useLayoutEffect(() => {
    if (workout) {
      navigation.setOptions({
        title: workout.title,
      });
    }
  }, [navigation, workout]);

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

  const config = workoutTypeConfig[workout.type];
  const isPast = workout.date < new Date();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: process.env.EXPO_OS === "web" ? 80 : 16,
        paddingBottom: 40,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Map */}
      {workout.mapCoordinates && process.env.EXPO_OS !== "web" && (
        <View
          style={{
            height: 200,
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 16,
            borderCurve: "continuous",
            overflow: "hidden",
          }}
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: workout.mapCoordinates.latitude,
              longitude: workout.mapCoordinates.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: workout.mapCoordinates.latitude,
                longitude: workout.mapCoordinates.longitude,
              }}
              title={workout.location}
            />
          </MapView>
        </View>
      )}

      {/* Header */}
      <View style={{ paddingHorizontal: 16, gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              borderCurve: "continuous",
              backgroundColor: config.color + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={config.icon as any}
              size={30}
              tintColor={config.color}
            />
          </View>

          <View style={{ flex: 1 }}>
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
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: AC.label as string,
                marginTop: 2,
              }}
            >
              {workout.title}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground as string,
            borderRadius: 14,
            borderCurve: "continuous",
            padding: 16,
            gap: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <SymbolView
              name="calendar"
              size={20}
              tintColor={AC.systemBlue as string}
            />
            <Text style={{ fontSize: 16, color: AC.label as string, flex: 1 }}>
              {formatDate(workout.date)}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <SymbolView
              name="clock"
              size={20}
              tintColor={AC.systemOrange as string}
            />
            <Text style={{ fontSize: 16, color: AC.label as string, flex: 1 }}>
              {workout.time}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <SymbolView
              name="mappin.and.ellipse"
              size={20}
              tintColor={AC.systemRed as string}
            />
            <Text
              style={{ fontSize: 16, color: AC.label as string, flex: 1 }}
              selectable
            >
              {workout.location}
            </Text>
          </View>
        </View>

        {/* Description */}
        {workout.description && (
          <View
            style={{
              backgroundColor: AC.secondarySystemGroupedBackground as string,
              borderRadius: 14,
              borderCurve: "continuous",
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 15, color: AC.label as string, lineHeight: 22 }}>
              {workout.description}
            </Text>
          </View>
        )}

        {/* Sign Up / Cancel Button */}
        {!isPast && (
          <Animated.View layout={LinearTransition}>
            <Pressable
              onPress={() =>
                userIsSignedUp ? cancelSignup(id) : signUpForWorkout(id)
              }
              style={({ pressed }) => ({
                backgroundColor: userIsSignedUp
                  ? (AC.systemRed as string)
                  : (AC.systemGreen as string),
                borderRadius: 14,
                borderCurve: "continuous",
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <SymbolView
                name={userIsSignedUp ? "xmark.circle.fill" : "checkmark.circle.fill"}
                size={20}
                tintColor="white"
              />
              <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
                {userIsSignedUp ? "Cancel Sign Up" : "Sign Up"}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Signed Up Section */}
        <View style={{ gap: 12, marginTop: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: AC.label as string,
              }}
            >
              Signed Up ({signups.length})
            </Text>
          </View>

          {signups.length === 0 ? (
            <View
              style={{
                backgroundColor: AC.secondarySystemGroupedBackground as string,
                borderRadius: 14,
                borderCurve: "continuous",
                padding: 20,
                alignItems: "center",
                gap: 8,
              }}
            >
              <SymbolView
                name="person.2.slash"
                size={32}
                tintColor={AC.tertiaryLabel as string}
              />
              <Text style={{ fontSize: 15, color: AC.secondaryLabel as string }}>
                No one has signed up yet
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: AC.secondarySystemGroupedBackground as string,
                borderRadius: 14,
                borderCurve: "continuous",
                overflow: "hidden",
              }}
            >
              {signups.map((signup, index) => (
                <Animated.View
                  key={signup.id}
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 14,
                    gap: 12,
                    borderTopWidth: index > 0 ? 0.5 : 0,
                    borderTopColor: AC.separator as string,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: AC.systemBlue as string + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: AC.systemBlue as string,
                      }}
                    >
                      {signup.userName.charAt(0)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: AC.label as string, flex: 1 }}>
                    {signup.userName}
                  </Text>
                  <SymbolView
                    name="checkmark.circle.fill"
                    size={20}
                    tintColor={AC.systemGreen as string}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </View>

        {/* Results Section */}
        <View style={{ gap: 12, marginTop: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: AC.label as string,
              }}
            >
              Results ({results.length})
            </Text>
            <Link
              href={{ pathname: "/workout/post-result", params: { workoutId: id } }}
              asChild
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: AC.systemBlue as string + "15",
                  borderRadius: 8,
                  borderCurve: "continuous",
                }}
              >
                <SymbolView
                  name="plus"
                  size={14}
                  tintColor={AC.systemBlue as string}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: AC.systemBlue as string,
                  }}
                >
                  Post
                </Text>
              </Pressable>
            </Link>
          </View>

          {results.length === 0 ? (
            <View
              style={{
                backgroundColor: AC.secondarySystemGroupedBackground as string,
                borderRadius: 14,
                borderCurve: "continuous",
                padding: 20,
                alignItems: "center",
                gap: 8,
              }}
            >
              <SymbolView
                name="flag.checkered"
                size={32}
                tintColor={AC.tertiaryLabel as string}
              />
              <Text style={{ fontSize: 15, color: AC.secondaryLabel as string }}>
                No results posted yet
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {results.map((result) => (
                <Animated.View
                  key={result.id}
                  entering={FadeIn}
                  style={{
                    backgroundColor: AC.secondarySystemGroupedBackground as string,
                    borderRadius: 14,
                    borderCurve: "continuous",
                    padding: 14,
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: AC.systemGreen as string + "20",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: AC.systemGreen as string,
                        }}
                      >
                        {result.userName.charAt(0)}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: AC.label as string,
                        flex: 1,
                      }}
                    >
                      {result.userName}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 16 }}>
                    {result.distance && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                      >
                        <SymbolView
                          name="ruler"
                          size={14}
                          tintColor={AC.secondaryLabel as string}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: AC.label as string,
                          }}
                        >
                          {result.distance}
                        </Text>
                      </View>
                    )}
                    {result.duration && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                      >
                        <SymbolView
                          name="stopwatch"
                          size={14}
                          tintColor={AC.secondaryLabel as string}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: AC.label as string,
                          }}
                        >
                          {result.duration}
                        </Text>
                      </View>
                    )}
                  </View>

                  {result.notes && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: AC.secondaryLabel as string,
                        fontStyle: "italic",
                      }}
                      selectable
                    >
                      "{result.notes}"
                    </Text>
                  )}
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
