import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button, Alert, ActivityIndicator, FlatList } from "react-native";
import { getRecords, createRecord, updateRecord } from "./src/kintone";
import type { DemoRecord } from "./src/types";

export default function App() {
  const [items, setItems] = useState<DemoRecord[]>([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const records = await getRecords();
      setItems(records);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "unknown";
      Alert.alert("Load error", msg);
      console.log("Load error detail:", e?.response?.data ?? e);
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async () => {
    if (!title.trim()) return Alert.alert("กรุณากรอก Title");
    try {
      setLoading(true);
      await createRecord({
        Text: { value: title },
        Text_area: { value: note }
      });
      setTitle("");
      setNote("");
      await load();
      Alert.alert("สำเร็จ", "สร้างข้อมูลแล้ว");
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "unknown";
      Alert.alert("Create error", msg);
      console.log("Create error detail:", e?.response?.data ?? e);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async () => {
    if (!items.length) return Alert.alert("ยังไม่มีรายการ");
    const first = items[0];
    try {
      setLoading(true);
      await updateRecord(first.$id.value, { Text_area: { value: "Edited from React Native" } });
      await load();
      Alert.alert("สำเร็จ", `แก้ไขรายการ #${first.$id.value} แล้ว`);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "unknown";
      Alert.alert("Update error", msg);
      console.log("Update error detail:", e?.response?.data ?? e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>kintone CRUD Demo</Text>

      <View style={{ gap: 8, marginBottom: 12 }}>
        <TextInput
          placeholder="Title (Field Code: Title)"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
        />
        <TextInput
          placeholder="Note (Field Code: Note)"
          value={note}
          onChangeText={setNote}
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
        />
        <Button title="สร้างรายการ" onPress={onCreate} />
        <Button title="แก้ไขรายการแรก (Note)" onPress={onEdit} />
        <Button title="ดึงข้อมูลใหม่" onPress={load} />
      </View>

      {loading && <ActivityIndicator />}

      <FlatList
        data={items}
        keyExtractor={(it) => it.$id.value}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ fontWeight: "600" }}>#{item.$id.value} {item?.Text?.value ?? "-"}</Text>
            <Text>{item?.Text_area?.value ?? ""}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
