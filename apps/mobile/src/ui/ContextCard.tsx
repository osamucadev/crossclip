import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "./useAppTheme";

type Props = {
  title: string;
  meta?: string;
  children: React.ReactNode;
};

export function ContextCard({ title, meta, children }: Props) {
  const { t } = useAppTheme();

  return (
    <View style={[styles.wrap, { borderLeftColor: t.accent }]}>
      <View
        pointerEvents="none"
        style={[
          styles.topLine,
          {
            borderTopColor: t.accent,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.bottomLine,
          {
            borderBottomColor: t.accent,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.wash,
          {
            backgroundColor: t.accentWash2,
          },
        ]}
      />

      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      {!!meta && (
        <Text style={[styles.meta, { color: t.textSoft }]}>{meta}</Text>
      )}
      <Text style={[styles.body, { color: t.textMuted }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    paddingLeft: 16,
    paddingVertical: 14,

    borderLeftWidth: 2,
    borderLeftColor: "transparent",

    overflow: "hidden",
  },
  topLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    borderTopWidth: 1,
    opacity: 0.55,
  },
  bottomLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 1,
    opacity: 0.4,
  },
  wash: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "62%",
    opacity: 0.9,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 22,
    maxWidth: 320,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  body: {
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 22,
    maxWidth: 520,
  },
});
