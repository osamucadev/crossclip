cat > docs/decisions.md <<'EOF'
# Decisions

This document tracks decisions made during Crossclip development.

## 01 Backend is intentionally simple

Firestore stores only plain strings.
All interpretation happens on the clients.

## 02 Android first

Clipboard background behavior and notifications are implemented for Android only.
EOF
