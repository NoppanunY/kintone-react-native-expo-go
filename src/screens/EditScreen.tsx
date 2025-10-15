import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { getRecord, updateRecord, deleteRecord } from "../kintone";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Edit">;

export default function EditScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rec = await getRecord(id);
        setTitle(rec?.Text?.value ?? "");
        setNote(rec?.Text_area?.value ?? "");
      } catch (e: any) {
        Alert.alert("Load error", e?.response?.data?.message ?? e?.message ?? "unknown");
        console.log("Edit load error:", e?.response?.data ?? e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSave = async () => {
    if (!title.trim()) return Alert.alert("กรุณากรอก Title");
    try {
      setSaving(true);
      await updateRecord(id, { Title: { value: title }, Note: { value: note } });
      Alert.alert("สำเร็จ", "บันทึกการแก้ไขแล้ว");
      navigation.replace("List");
    } catch (e: any) {
      Alert.alert("Update error", e?.response?.data?.message ?? e?.message ?? "unknown");
      console.log("Update error:", e?.response?.data ?? e);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    Alert.alert("Confirm delete", `ลบรายการ #${id}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteRecord(id);
            Alert.alert("สำเร็จ", `ลบ #${id} แล้ว`);
            navigation.replace("List");
          } catch (e: any) {
            Alert.alert("Delete error", e?.response?.data?.message ?? e?.message ?? "unknown");
            console.log("Delete error:", e?.response?.data ?? e);
          }
        }
      }
    ]);
  };

  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator /></View>;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, padding: 16, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Edit #{id}</Text>

        <Text style={{ fontSize: 16, fontWeight: "600" }}>Title</Text>
        <TextInput value={title} onChangeText={setTitle}
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }} />

        <Text style={{ fontSize: 16, fontWeight: "600" }}>Note</Text>
        <TextInput value={note} onChangeText={setNote} multiline
          style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 80 }} />

        <Button title={saving ? "Saving..." : "Save"} onPress={onSave} disabled={saving} />
        <View style={{ height: 8 }} />
        <Button title="Delete" color="#c62828" onPress={onDelete} />
      </View>
    </KeyboardAvoidingView>
  );
}
