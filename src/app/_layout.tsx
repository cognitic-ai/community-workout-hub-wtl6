import { ThemeProvider } from "@/components/theme-provider";
import { WorkoutProvider } from "@/store/workout-store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <TabsLayout />
      </WorkoutProvider>
    </ThemeProvider>
  );
}

function TabsLayout() {
  if (process.env.EXPO_OS === "web") {
    return <WebTabsLayout />;
  } else {
    return <NativeTabsLayout />;
  }
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : {
              tabBarPosition: "bottom",
            }),
      }}
    >
      <WebTabs.Screen
        name="(workouts)"
        options={{
          title: "Workouts",
          tabBarIcon: (props) => <MaterialIcons {...props} name="fitness-center" />,
        }}
      />
      <WebTabs.Screen
        name="(activity)"
        options={{
          title: "Activity",
          tabBarIcon: (props) => <MaterialIcons {...props} name="people" />,
        }}
      />
      <WebTabs.Screen
        name="workout"
        options={{
          href: null,
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(workouts)">
        <NativeTabs.Trigger.Label>Workouts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "figure.run", selected: "figure.run" } },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="fitness-center" />,
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(activity)">
        <NativeTabs.Trigger.Label>Activity</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "person.2", selected: "person.2.fill" } },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="people" />,
            },
          })}
        />
      </NativeTabs.Trigger>
      {/* workout route is hidden from tabs but accessible via navigation */}
    </NativeTabs>
  );
}
