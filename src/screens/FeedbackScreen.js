import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const feedbackTemplates = [
  "🚨 Aracınıza çarptım, acelem vardı iletişime geçin.",
  "🔇 Lütfen parkta korna çalmayın.",
  "💬 Bilginiz olsun lastiğiniz patlak görünüyor.",
  "🚧 Aracınız park çizgisini aşıyor, lütfen dikkat edin.",
  "⚠️ Farlarınız açık kalmış olabilir, bilginiz olsun."
];

const FeedbackScreen = ({ navigation }) => {
  const [plate, setPlate] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleSubmit = async () => {
    if (!plate.trim() || !selectedMessage.trim()) {
      Alert.alert("Eksik Bilgi", "Plaka ve mesaj seçmelisiniz.");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      plate,
      message: selectedMessage,
      date: new Date().toLocaleString()
    };

    const existing = await AsyncStorage.getItem("feedbacks");
    let feedbacks = existing ? JSON.parse(existing) : [];

    feedbacks.push(newFeedback);

    await AsyncStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    Alert.alert("Gönderildi", "Geri bildirim kaydedildi!");

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerBackground} />

      <View style={styles.card}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

          <Text style={styles.title}>💬 Geri Bildirim Gönder</Text>
          <Text style={styles.subtitle}>
            Plakaya özel mesaj göndererek iletişim sağlayabilirsiniz.
          </Text>

          <Text style={styles.label}>Plaka</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 34ABC123"
            placeholderTextColor="#888"
            value={plate}
            onChangeText={setPlate}
            autoCapitalize="characters"
          />

          <Text style={styles.subLabel}>Mesaj Şablonu Seç:</Text>

          {feedbackTemplates.map((msg) => (
            <TouchableOpacity
              key={msg}
              style={[
                styles.templateOption,
                selectedMessage === msg && styles.templateSelected
              ]}
              onPress={() => setSelectedMessage(msg)}
            >
              <Text style={styles.optionText}>{msg}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>📨 Gönder</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Arka plan – ComplaintListScreen ile aynı stil yaklaşımı
  root: {
    flex: 1,
    backgroundColor: "#f5ecff",
    alignItems: "center",
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

  // Kart
  card: {
    width: "92%",
    marginTop: 40,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 28,
    paddingVertical: 26,
    paddingHorizontal: 18,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
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
    marginBottom: 20,
    marginTop: 6
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2b2340",
    marginBottom: 6,
  },

  subLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#61557f",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: "#ddb8ff",
    marginBottom: 14,
    fontWeight: "600",
    fontSize: 15
  },

  templateOption: {
    padding: 12,
    marginTop: 10,
    backgroundColor: "#fbf7ff",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ccc",

    shadowColor: "#d3c3ff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },

  templateSelected: {
    backgroundColor: "#f3dbff",
    borderColor: "#a06bff",
  },

  optionText: {
    fontSize: 14,
    color: "#2b2340",
  },

  btn: {
    backgroundColor: "#a06bff",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 28,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default FeedbackScreen;
