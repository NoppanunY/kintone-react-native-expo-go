import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { createRecord } from "../kintone";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { DemoService } from "@/apps/demo/service";

type Props = NativeStackScreenProps<RootStackParamList, "Create">;

export default function CreateScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!title.trim()) return Alert.alert("Please enter Title");
    try {
      setSaving(true);
      await DemoService.create({ Text: title, Text_area: note })
      Alert.alert("Sucess", "Create Success");
      navigation.replace("List");
    } catch (e: any) {
      Alert.alert("Create error", e?.response?.data?.message ?? e?.message ?? "unknown");
      console.log("Create error:", e?.response?.data ?? e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, padding: 16, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Title"
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }} />

        <Text style={{ fontSize: 16, fontWeight: "600" }}>Note</Text>
        <TextInput value={note} onChangeText={setNote} placeholder="Note" multiline
          style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 80 }} />

        <Button title={saving ? "Saving..." : "Save"} onPress={onSave} disabled={saving} />
      </View>
    </KeyboardAvoidingView>
  );
}
