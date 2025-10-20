import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Button } from "react-native";
// import { listRecords, deleteRecord, DemoRecord } from "../kintone";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { DemoService } from "@/apps/demo/service";
import { DemoRecord } from "@/apps/demo/types";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

export default function ListScreen({ navigation }: Props) {
  const [items, setItems] = useState<DemoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const recs = await DemoService.list()
      setItems(recs);
    } catch (e: any) {
      Alert.alert("Load error", e?.response?.data?.message ?? e?.message ?? "unknown");
      console.log("Load error:", e?.response?.data ?? e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  const onDelete = (id: number) => {
    Alert.alert("Confirm delete", `Delete #${id}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await DemoService.remove(id);
            await load();
            Alert.alert("Success", `#${id} Deleted`);
          } catch (e: any) {
            Alert.alert("Delete error", e?.response?.data?.message ?? e?.message ?? "unknown");
            console.log("Delete error:", e?.response?.data ?? e);
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <View style={{ marginBottom: 8 }}>
        <Button title="Create new" onPress={() => navigation.navigate("Create")} />
      </View>

      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.$id.value.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Edit", { id: item.$id.value })}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  #{item.$id.value} {item?.Text?.value ?? "-"}
                </Text>
                <Text>{item?.Text_area?.value ?? ""}</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Button title="Edit" onPress={() => navigation.navigate("Edit", { id: item.$id.value })} />
                <View style={{ width: 8 }} />
                <Button title="Delete" color="#c62828" onPress={() => onDelete(item.$id.value)} />
              </View>
            </View>
          )}
          ListEmptyComponent={!loading ? <Text>ไม่มีข้อมูล</Text> : null}
        />
      )}
    </View>
  );
}
