import { useMemo, useRef, useState } from "react";
import {
  Animated,
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
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useGiveUps } from "../../hooks/useGiveUps";
import { BadgeDefinition } from "../../types/models";
import { COLORS, RADIUS, SPACING } from "../../lib/theme";

const FEEDBACKS = [
  "太棒了，又省力了。",
  "今天也要对自己温柔。",
  "放弃也是一种选择。",
  "不错，继续躺平。",
];

export default function AddGiveUpScreen() {
  const { addGiveUp } = useGiveUps();
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [plannedAt, setPlannedAt] = useState("");
  const [error, setError] = useState("");
  const [badge, setBadge] = useState<BadgeDefinition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const plannedAtRef = useRef<TextInput>(null);
  const reasonRef = useRef<TextInput>(null);
  const feedbackText = useMemo(
    () => FEEDBACKS[Math.floor(Math.random() * FEEDBACKS.length)],
    []
  );
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const playFeedback = () => {
    feedbackAnim.setValue(0);
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    if (!title.trim()) {
      setError("请写下你打算做但没做成的事。");
      return;
    }
    setError("");
    setIsSubmitting(true);
    const result = await addGiveUp({
      title: title.trim(),
      reason: reason.trim() ? reason.trim() : undefined,
      plannedAt: plannedAt.trim(),
    });
    if (result.newlyUnlocked.length > 0) {
      setBadge(result.newlyUnlocked[0]);
      setTimeout(() => setBadge(null), 1400);
    }
    playFeedback();
    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>放弃一件事</Text>
              <Text style={styles.subtitle}>把压力交给清单，心情交给自己。</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>本来想做什么？</Text>
              <TextInput
                style={styles.input}
                placeholder="例如：去健身房"
                placeholderTextColor={COLORS.muted}
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
                onSubmitEditing={() => plannedAtRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>原本打算什么时候？（可选）</Text>
              <TextInput
                ref={plannedAtRef}
                style={styles.input}
                placeholder="例如：今晚 8 点"
                placeholderTextColor={COLORS.muted}
                value={plannedAt}
                onChangeText={setPlannedAt}
                returnKeyType="next"
                onSubmitEditing={() => reasonRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>为什么放弃？（可选）</Text>
              <TextInput
                ref={reasonRef}
                style={[styles.input, styles.multiline]}
                placeholder="例如：床太舒服了"
                placeholderTextColor={COLORS.muted}
                value={reason}
                onChangeText={setReason}
                multiline
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.submit}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Feather name="cloud-off" size={18} color={COLORS.text} />
              <Text style={styles.submitText}>放弃它</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.feedback,
          {
            opacity: feedbackAnim,
            transform: [
              {
                translateY: feedbackAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -20],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.feedbackText}>{feedbackText}</Text>
      </Animated.View>

      {badge ? (
        <View style={styles.badgeToast}>
          <Feather name={badge.icon} size={20} color={COLORS.text} />
          <View style={styles.badgeText}>
            <Text style={styles.badgeTitle}>{badge.title}</Text>
            <Text style={styles.badgeSubtitle}>{badge.description}</Text>
          </View>
        </View>
      ) : null}
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
  inner: {
    flex: 1,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    gap: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
  },
  field: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  error: {
    color: COLORS.accent,
  },
  submit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  feedback: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 80,
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 18,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  badgeToast: {
    position: "absolute",
    bottom: 32,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: "row",
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },
  badgeText: {
    gap: 4,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  badgeSubtitle: {
    color: COLORS.muted,
  },
});
