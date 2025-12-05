// src/screens/HomeScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const cities = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl",
  "Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır",
  "Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun",
  "Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş",
  "Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir",
  "Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla",
  "Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop",
  "Sivas","Şanlıurfa","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak",
  "Van","Yalova","Yozgat","Zonguldak"
];

const formatPlate = (text) => {
  let cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return cleaned;
};

const HomeScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [manualCity, setManualCity] = useState("");
  const [plate, setPlate] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const complaintTypes = [
    'Hatalı Park',
    'Hatalı Sollama',
    'Kırmızı Işık İhlali',
    'Emniyet Şeridi İhlali',
    'Diğer'
  ];
  const [selectedType, setSelectedType] = useState(complaintTypes[0]);

  const handleChoosePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || galleryPermission.status !== 'granted') {
      Alert.alert("İzin Gerekli", "Fotoğraf eklemek için kamera veya galeri izni vermelisiniz.");
      return;
    }

    Alert.alert(
      "Fotoğraf Kaynağı",
      "Lütfen fotoğrafı nereden almak istediğinizi seçin.",
      [
        {
          text: "Galeriden Seç",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled) {
              setImageUri(result.assets[0].uri);
            }
          }
        },
        {
          text: "Kamera İle Çek",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled) {
              setImageUri(result.assets[0].uri);
            }
          }
        },
        { text: "İptal", style: "cancel" }
      ]
    );
  };

  const handleSubmit = async () => {
    const finalCity = city === "manual" ? manualCity : city;

    if (!finalCity.trim() || !plate.trim() || !description.trim() || !imageUri) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun ve fotoğraf ekleyin.');
      return;
    }

    const newComplaint = {
      id: Date.now(),
      city: finalCity,
      plate: plate.toUpperCase(),
      type: selectedType,
      description,
      imageUri
    };

    try {
      const existing = await AsyncStorage.getItem("complaints");
      let complaints = existing ? JSON.parse(existing) : [];

      complaints.push(newComplaint);

      await AsyncStorage.setItem("complaints", JSON.stringify(complaints));
    } catch (e) {
      console.log("Kaydetme hatası:", e);
    }

    Alert.alert(
      'Şikayet Alındı',
      "Şikayet başarıyla kaydedildi!",
      [{ text: 'Tamam', onPress: () => navigation.navigate("ComplaintList") }]
    );

    setPlate('');
    setDescription('');
    setImageUri(null);
    setSelectedType(complaintTypes[0]);
    setCity("");
    setManualCity("");
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Üstteki pembe/mor arka plan bloğu */}
      <View style={styles.headerBackground} />

      {/* Ortadaki beyaz kart */}
      <View style={styles.card}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.title}>🚨 Yeni Trafik Şikayeti</Text>
            <Text style={styles.subtitle}>
              Olayın detaylarını doldurun, fotoğraf ekleyin ve şikayetinizi kaydedelim.
            </Text>
          </View>

          {/* Şehir */}
          <Text style={styles.label}>Olayın Yaşandığı Şehir</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={city}
              onValueChange={(value) => setCity(value)}
              mode="dropdown"
              style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
            >
              <Picker.Item label="Şehir Seçin" value="" color="#8b82a6" />
              <Picker.Item label="— Kendim Yazacağım —" value="manual" color="#8b82a6" />
              {cities.map((c) => (
                <Picker.Item key={c} label={c} value={c} color="#2b2340" />
              ))}
            </Picker>
          </View>

          {/* Manuel şehir */}
          {city === "manual" && (
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Şehir yazın"
              placeholderTextColor="#b0a6c9"
              value={manualCity}
              onChangeText={setManualCity}
            />
          )}

          {/* Plaka */}
          <Text style={styles.label}>Aracın Plakası (Örn: 34ABC123)</Text>
          <TextInput
            style={styles.input}
            value={plate}
            onChangeText={(text) => setPlate(formatPlate(text))}
            placeholder="Plaka girin"
            placeholderTextColor="#b0a6c9"
            maxLength={10}
            autoCapitalize="characters"
          />

          {/* Tür */}
          <Text style={styles.label}>Şikayet Türü</Text>
          <View style={styles.typeContainer}>
            {complaintTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.selectedTypeButton
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type && styles.selectedTypeText
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fotoğraf */}
          <Text style={styles.label}>Kanıt Fotoğrafı</Text>
          <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhoto}>
            <Text style={styles.photoButtonText}>
              {imageUri ? '🖼️ Fotoğrafı Değiştir' : '📸 Fotoğraf Çek / Seç'}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imagePreviewText}>Fotoğraf Eklendi ✔️</Text>
            </View>
          )}

          {/* Açıklama */}
          <Text style={styles.label}>Olayın Açıklaması</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Olayı kısaca açıklayın..."
            placeholderTextColor="#b0a6c9"
            multiline
          />

          {/* Gönder */}
          <View style={styles.submitWrapper}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Şikayeti Gönder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    height: 260,
    backgroundColor: "#f7b4ff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    opacity: 0.95,
  },

  // Kart
  card: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 18,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  cardHeader: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2b2340",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#8b82a6",
    textAlign: "center",
    lineHeight: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4a3f6b",
    marginTop: 14,
    marginBottom: 6,
  },

  pickerWrapper: {
    backgroundColor: "#fbf7ff",
    borderWidth: 1,
    borderColor: "#e0d3ff",
    borderRadius: 14,
    overflow: "hidden",
  },

  pickerAndroid: {
    height: 48,
    color: "#2b2340",
  },

  pickerIOS: {
    height: 200,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e0d3ff",
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: "400",
    color: "#2b2340",
    backgroundColor: "#fbf7ff",
  },

  textArea: {
    height: 110,
    textAlignVertical: "top",
  },

  photoButton: {
    backgroundColor: "#ff7ab8",
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,

    shadowColor: "#ff7ab8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },

  photoButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#e6ffe6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#34C759",
  },

  imagePreviewText: {
    color: "#1e7a34",
    fontWeight: "600",
  },

  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 6,
  },

  typeButton: {
    backgroundColor: "#f0e9ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
    marginTop: 8,
  },

  selectedTypeButton: {
    backgroundColor: "#7b61ff",
  },

  typeText: {
    color: "#61557f",
    fontWeight: "500",
    fontSize: 13,
  },

  selectedTypeText: {
    color: "#ffffff",
  },

  submitWrapper: {
    marginTop: 20,
    marginBottom: 10,
  },

  submitButton: {
    backgroundColor: "#ff7ab8",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#ff7ab8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default HomeScreen;
