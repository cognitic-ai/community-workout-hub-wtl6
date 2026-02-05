import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type WorkoutType = "run" | "ruck" | "hike" | "track";

export interface Workout {
  id: string;
  type: WorkoutType;
  title: string;
  location: string;
  date: Date;
  time: string;
  description?: string;
  mapCoordinates?: {
    latitude: number;
    longitude: number;
  };
  createdBy: string;
  createdAt: Date;
}

export interface Signup {
  id: string;
  workoutId: string;
  userName: string;
  userAvatar?: string;
  signedUpAt: Date;
}

export interface WorkoutResult {
  id: string;
  workoutId: string;
  userName: string;
  userAvatar?: string;
  distance?: string;
  duration?: string;
  notes?: string;
  postedAt: Date;
}

export interface ActivityItem {
  id: string;
  type: "signup" | "result" | "workout_created";
  userName: string;
  userAvatar?: string;
  workoutId: string;
  workoutTitle: string;
  workoutType: WorkoutType;
  timestamp: Date;
  result?: WorkoutResult;
}

interface WorkoutStore {
  workouts: Workout[];
  signups: Signup[];
  results: WorkoutResult[];
  activity: ActivityItem[];
  isAdmin: boolean;
  currentUser: string;
  addWorkout: (workout: Omit<Workout, "id" | "createdAt" | "createdBy">) => void;
  signUpForWorkout: (workoutId: string) => void;
  cancelSignup: (workoutId: string) => void;
  postResult: (workoutId: string, result: Omit<WorkoutResult, "id" | "workoutId" | "userName" | "userAvatar" | "postedAt">) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  getSignupsForWorkout: (workoutId: string) => Signup[];
  getResultsForWorkout: (workoutId: string) => WorkoutResult[];
  isSignedUp: (workoutId: string) => boolean;
  toggleAdmin: () => void;
}

const WorkoutContext = createContext<WorkoutStore | null>(null);

// Sample data
const sampleWorkouts: Workout[] = [
  {
    id: "1",
    type: "run",
    title: "Saturday Morning Run",
    location: "Central Park, NYC",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "7:00 AM",
    description: "Easy 5K run around the park. All paces welcome!",
    mapCoordinates: { latitude: 40.7829, longitude: -73.9654 },
    createdBy: "Admin",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "ruck",
    title: "Ruck March Challenge",
    location: "Riverside Trail",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "6:00 AM",
    description: "10 mile ruck with 30lb pack. Bring water and snacks.",
    mapCoordinates: { latitude: 40.8017, longitude: -73.9667 },
    createdBy: "Admin",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "hike",
    title: "Sunday Trail Hike",
    location: "Bear Mountain State Park",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "8:00 AM",
    description: "Moderate difficulty hike with beautiful views.",
    mapCoordinates: { latitude: 41.3123, longitude: -73.9882 },
    createdBy: "Admin",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "track",
    title: "Track Tuesday - Speed Work",
    location: "High School Track",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    time: "6:30 PM",
    description: "400m repeats. Great for building speed!",
    mapCoordinates: { latitude: 40.7580, longitude: -73.9855 },
    createdBy: "Admin",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

const sampleSignups: Signup[] = [
  { id: "s1", workoutId: "1", userName: "Sarah M.", signedUpAt: new Date(Date.now() - 20 * 60 * 60 * 1000) },
  { id: "s2", workoutId: "1", userName: "Mike R.", signedUpAt: new Date(Date.now() - 18 * 60 * 60 * 1000) },
  { id: "s3", workoutId: "1", userName: "Emma L.", signedUpAt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
  { id: "s4", workoutId: "2", userName: "John D.", signedUpAt: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  { id: "s5", workoutId: "3", userName: "Sarah M.", signedUpAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
];

const sampleResults: WorkoutResult[] = [
  {
    id: "r1",
    workoutId: "1",
    userName: "Alex T.",
    distance: "5.2 km",
    duration: "28:45",
    notes: "Great morning! Felt strong the whole way.",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "r2",
    workoutId: "1",
    userName: "Jordan K.",
    distance: "5.0 km",
    duration: "32:10",
    notes: "First time running with the group. Everyone was so welcoming!",
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

function generateActivity(workouts: Workout[], signups: Signup[], results: WorkoutResult[]): ActivityItem[] {
  const activities: ActivityItem[] = [];

  // Add workout creation activities
  workouts.forEach((workout) => {
    activities.push({
      id: `act-w-${workout.id}`,
      type: "workout_created",
      userName: workout.createdBy,
      workoutId: workout.id,
      workoutTitle: workout.title,
      workoutType: workout.type,
      timestamp: workout.createdAt,
    });
  });

  // Add signup activities
  signups.forEach((signup) => {
    const workout = workouts.find((w) => w.id === signup.workoutId);
    if (workout) {
      activities.push({
        id: `act-s-${signup.id}`,
        type: "signup",
        userName: signup.userName,
        workoutId: signup.workoutId,
        workoutTitle: workout.title,
        workoutType: workout.type,
        timestamp: signup.signedUpAt,
      });
    }
  });

  // Add result activities
  results.forEach((result) => {
    const workout = workouts.find((w) => w.id === result.workoutId);
    if (workout) {
      activities.push({
        id: `act-r-${result.id}`,
        type: "result",
        userName: result.userName,
        workoutId: result.workoutId,
        workoutTitle: workout.title,
        workoutType: workout.type,
        timestamp: result.postedAt,
        result,
      });
    }
  });

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [signups, setSignups] = useState<Signup[]>(sampleSignups);
  const [results, setResults] = useState<WorkoutResult[]>(sampleResults);
  const [isAdmin, setIsAdmin] = useState(true);
  const currentUser = "You";

  const activity = useMemo(
    () => generateActivity(workouts, signups, results),
    [workouts, signups, results]
  );

  const addWorkout = useCallback(
    (workout: Omit<Workout, "id" | "createdAt" | "createdBy">) => {
      const newWorkout: Workout = {
        ...workout,
        id: `w-${Date.now()}`,
        createdBy: currentUser,
        createdAt: new Date(),
      };
      setWorkouts((prev) => [newWorkout, ...prev]);
    },
    [currentUser]
  );

  const signUpForWorkout = useCallback(
    (workoutId: string) => {
      const newSignup: Signup = {
        id: `s-${Date.now()}`,
        workoutId,
        userName: currentUser,
        signedUpAt: new Date(),
      };
      setSignups((prev) => [...prev, newSignup]);
    },
    [currentUser]
  );

  const cancelSignup = useCallback(
    (workoutId: string) => {
      setSignups((prev) =>
        prev.filter((s) => !(s.workoutId === workoutId && s.userName === currentUser))
      );
    },
    [currentUser]
  );

  const postResult = useCallback(
    (
      workoutId: string,
      result: Omit<WorkoutResult, "id" | "workoutId" | "userName" | "userAvatar" | "postedAt">
    ) => {
      const newResult: WorkoutResult = {
        ...result,
        id: `r-${Date.now()}`,
        workoutId,
        userName: currentUser,
        postedAt: new Date(),
      };
      setResults((prev) => [newResult, ...prev]);
    },
    [currentUser]
  );

  const getWorkoutById = useCallback(
    (id: string) => workouts.find((w) => w.id === id),
    [workouts]
  );

  const getSignupsForWorkout = useCallback(
    (workoutId: string) => signups.filter((s) => s.workoutId === workoutId),
    [signups]
  );

  const getResultsForWorkout = useCallback(
    (workoutId: string) => results.filter((r) => r.workoutId === workoutId),
    [results]
  );

  const isSignedUp = useCallback(
    (workoutId: string) =>
      signups.some((s) => s.workoutId === workoutId && s.userName === currentUser),
    [signups, currentUser]
  );

  const toggleAdmin = useCallback(() => {
    setIsAdmin((prev) => !prev);
  }, []);

  const value: WorkoutStore = {
    workouts,
    signups,
    results,
    activity,
    isAdmin,
    currentUser,
    addWorkout,
    signUpForWorkout,
    cancelSignup,
    postResult,
    getWorkoutById,
    getSignupsForWorkout,
    getResultsForWorkout,
    isSignedUp,
    toggleAdmin,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

export function useWorkoutStore() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkoutStore must be used within a WorkoutProvider");
  }
  return context;
}
