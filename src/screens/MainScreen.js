import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MainScreen = ({ navigation }) => {
  const [plateQuery, setPlateQuery] = useState("");

  return (
    <SafeAreaView style={styles.root}>
      {/* Üst kısım renkli arka plan */}
      <View style={styles.headerBackground} />

      {/* Ortadaki beyaz kart */}
      <View style={styles.card}>
        {/* Başlık – açıklama */}
        <View style={styles.cardHeader}>
          <Text style={styles.welcomeText}>Hoş Geldiniz 👋</Text>
          <Text style={styles.subtitle}>
            Trafikte gördüğünüz ihlalleri kolayca bildirin ve plakaya göre kayıtları sorgulayın.
          </Text>
        </View>

        {/* Form alanı */}
        <View style={styles.form}>
          <Text style={styles.label}>Plaka Sorgula</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 34ABC123"
            placeholderTextColor="#b0a6c9"
            value={plateQuery}
            onChangeText={setPlateQuery}
          />

          {/* Sorgula butonu */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("ComplaintList", {
                filterPlate: plateQuery.trim().toUpperCase(),
              })
            }
          >
            <Text style={styles.primaryButtonText}>🔍 Sorgula</Text>
          </TouchableOpacity>

          {/* Aradaki boşluk */}
          <View style={{ height: 12 }} />

          {/* Şikayet Gönder butonu */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.secondaryButtonText}>📢 Şikayet Gönder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Feedback")}
          >
            <Text style={styles.secondaryButtonText}>💬 Geri Bildirim Bırak</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Ekran arka planı
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5ecff", // hafif mor-pembe ton
  },

  // Üst tarafta gradient hissi veren renkli blok
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: "#f7b4ff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    opacity: 0.95,
  },

  // Ortadaki beyaz kart
  card: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 22,

    // gölge efekti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  cardHeader: {
    marginBottom: 24,
    alignItems: "center",
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2b2340",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#8b82a6",
    lineHeight: 20,
  },

  form: {
    marginTop: 4,
  },

  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "600",
    color: "#4a3f6b",
  },

  input: {
    backgroundColor: "#fbf7ff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0d3ff",
    color: "#2b2340",
    fontWeight: "400",
  },

  // Ana (pembe) buton
  primaryButton: {
    backgroundColor: "#ff7ab8",
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#ff7ab8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // İkincil (beyaz çerçeveli) buton
  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ff7ab8",
  },

  secondaryButtonText: {
    color: "#ff7ab8",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default MainScreen;
