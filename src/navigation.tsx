import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "./screens/ListScreen";
import CreateScreen from "./screens/CreateScreen";
import EditScreen from "./screens/EditScreen";

export type RootStackParamList = {
  List: undefined;
  Create: undefined;
  Edit: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} options={{ title: "Records" }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ title: "Create" }} />
        <Stack.Screen name="Edit" component={EditScreen} options={{ title: "Edit" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
