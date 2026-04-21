#!/bin/bash
# Generates a recursive screenshot for the albertxu.com project card.
# Requires: dev server running on localhost:3000, npx playwright available.
# Usage: ./scripts/recursive-screenshot.sh [levels]

LEVELS=${1:-5}
PUBLIC_DIR="$(dirname "$0")/../public"
BASE_URL="http://localhost:3000/projects"

echo "Taking $LEVELS levels of recursive screenshots..."

for i in $(seq 0 $((LEVELS - 1))); do
  echo "Level $((i + 1))/$LEVELS"
  npx @anthropic-ai/claude-code --print \
    "Navigate to $BASE_URL, scroll to the bottom of the page, take a viewport screenshot (not fullPage) and save it to $PUBLIC_DIR/albertxu-com.png. Use the playwright MCP tools. Do not output anything else." \
    2>/dev/null
done

echo "Done. Final screenshot saved to public/albertxu-com.png"
