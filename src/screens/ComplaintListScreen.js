import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const ComplaintListScreen = ({ route }) => {
  const [complaints, setComplaints] = useState([]);
  const filterPlate = route.params?.filterPlate || "";

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const data = await AsyncStorage.getItem("complaints");
    let list = data ? JSON.parse(data) : [];

    if (filterPlate !== "") {
      list = list.filter(item => item.plate.includes(filterPlate));
    }

    setComplaints(list.reverse());
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.plate}>{item.plate}</Text>
        <Text style={styles.city}>{item.city} • {item.type}</Text>
        <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* Üstte pembe/mor arka plan bloğu */}
      <View style={styles.headerBackground} />

      {/* Ortadaki beyaz kart */}
      <View style={styles.card}>
        <Text style={styles.title}>📄 Şikayet Listesi</Text>
        <Text style={styles.subtitle}>
          Kaydedilmiş trafik şikayetlerinizi aşağıdan görüntüleyebilirsiniz.
        </Text>

        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Henüz herhangi bir kayıt bulunamadı.
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Arka plan
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5ecff",
  },

  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "#f7b4ff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    opacity: 0.95,
  },

  // Ortadaki ana kart
  card: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 18,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#2b2340",
  },

  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#8b82a6",
    marginTop: 6,
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 20,
  },

  // Liste kartları
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fbf7ff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 18,

    shadowColor: "#d3c3ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 10,
  },

  plate: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2b2340",
    marginBottom: 2,
  },

  city: {
    color: "#8b82a6",
    fontSize: 13,
    marginBottom: 4,
  },

  desc: {
    color: "#61557f",
    fontSize: 13,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#8b82a6",
    fontSize: 14,
  },
});

export default ComplaintListScreen;
