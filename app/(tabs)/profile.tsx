import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useProfile } from "../../hooks/useProfile";
import { COLORS, RADIUS, SPACING } from "../../lib/theme";

export default function ProfileScreen() {
  const { profile, reload, updateProfile } = useProfile();
  const [nickname, setNickname] = useState(profile.nickname);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  useEffect(() => {
    setNickname(profile.nickname);
  }, [profile.nickname]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("需要权限", "请允许访问相册以选择头像。");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      await updateProfile({
        ...profile,
        avatarUri: result.assets[0].uri,
      });
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("需要权限", "请允许访问相机以拍摄头像。");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      await updateProfile({
        ...profile,
        avatarUri: result.assets[0].uri,
      });
    }
  };

  const handleSave = async () => {
    await updateProfile({
      ...profile,
      nickname: nickname.trim() || "你",
    });
    Alert.alert("已保存", "个人信息已更新。");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.header}>
              <Text style={styles.title}>我</Text>
              <Text style={styles.subtitle}>给自己一个名字吧。</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.avatarWrap}>
                {profile.avatarUri ? (
                  <Image
                    source={{ uri: profile.avatarUri }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Feather name="user" size={28} color={COLORS.muted} />
                  </View>
                )}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handlePickImage}
                >
                  <Feather name="image" size={16} color={COLORS.text} />
                  <Text style={styles.actionText}>相册选择</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleTakePhoto}
                >
                  <Feather name="camera" size={16} color={COLORS.text} />
                  <Text style={styles.actionText}>拍照</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>昵称</Text>
                <TextInput
                  style={styles.input}
                  placeholder="比如：懒人代表"
                  placeholderTextColor={COLORS.muted}
                  value={nickname}
                  onChangeText={setNickname}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
              <TouchableOpacity style={styles.save} onPress={handleSave}>
                <Feather name="check" size={16} color={COLORS.text} />
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
  },
  card: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  avatarWrap: {
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    justifyContent: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
  },
  actionText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 13,
  },
  field: {
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
  },
  save: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
  },
  saveText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});
