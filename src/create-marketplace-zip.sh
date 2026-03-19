#!/bin/bash
# Bash Script to Create Marketplace Code Zip (Mac/Linux)
# Run this: bash create-marketplace-zip.sh

echo "🎯 Creating SmileVision Pro Marketplace Code Package..."

# Get current directory
SOURCE_DIR=$(pwd)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="SmileVisionPro-Marketplace-${TIMESTAMP}.zip"
OUTPUT_PATH="$HOME/Downloads/$ZIP_NAME"

echo "📁 Source: $SOURCE_DIR"
echo "📦 Output: $OUTPUT_PATH"

# Items to include
INCLUDE_ITEMS=(
    "components"
    "styles"
    "utils"
    "supabase"
    "App.tsx"
    "App.marketplace.tsx"
    "App.original.tsx"
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "index.html"
    "MARKETPLACE_REFACTOR_GUIDE.md"
    "BEFORE_AFTER_MARKETPLACE.md"
    "MARKETPLACE_IMPLEMENTATION.md"
)

echo ""
echo "📋 Including files:"
for item in "${INCLUDE_ITEMS[@]}"; do
    echo "  ✓ $item"
done

# Create temporary directory
TEMP_DIR=$(mktemp -d)
STAGING_DIR="$TEMP_DIR/smilevision-marketplace"
mkdir -p "$STAGING_DIR"

echo ""
echo "📂 Copying files to staging area..."

# Copy items
for item in "${INCLUDE_ITEMS[@]}"; do
    if [ -e "$SOURCE_DIR/$item" ]; then
        cp -R "$SOURCE_DIR/$item" "$STAGING_DIR/"
        echo "  ✓ Copied: $item"
    else
        echo "  ⚠ Not found: $item"
    fi
done

# Create README
cat > "$STAGING_DIR/README-MARKETPLACE.txt" << 'EOF'
# SmileVision Pro - marketplace portal Version

## 📦 Package Contents

This package contains the marketplace-ready version of SmileVision Pro.

### Key Files:
- **App.marketplace.tsx** - Use this as your App.tsx for marketplace
- **App.original.tsx** - Original version (backup)
- **/components/marketplace/** - New marketplace-optimized components

### Documentation:
- **MARKETPLACE_IMPLEMENTATION.md** - Start here! Deployment checklist
- **MARKETPLACE_REFACTOR_GUIDE.md** - Complete technical guide
- **BEFORE_AFTER_MARKETPLACE.md** - Visual comparison

## 🚀 Quick Start

1. Copy App.marketplace.tsx → App.tsx
2. Install dependencies: npm install
3. Test locally: npm run dev
4. Visit: http://localhost:5173/marketplace/connect
5. Read MARKETPLACE_IMPLEMENTATION.md for deployment steps

## 📁 New Components

- **/components/marketplace/EmbeddedAppLayout.tsx** - iframe container
- **/components/marketplace/MarketplaceContainer.tsx** - spacing wrapper
- **/components/marketplace/MarketplaceCard.tsx** - reusable card
- **/components/marketplace/GHLMarketplaceConnect.tsx** - OAuth UI

## ✅ What's Included

✓ All marketplace components
✓ Updated App entry point
✓ Complete documentation
✓ Original files (backup)
✓ Configuration files

## 🎯 Next Steps

1. Read MARKETPLACE_IMPLEMENTATION.md
2. Test in iframe (see test-iframe.html example in docs)
3. Deploy to production
4. Submit to marketplace portal

Created: $(date +"%Y-%m-%d %H:%M:%S")
EOF

echo ""
echo "📝 Created README-MARKETPLACE.txt"

# Create the zip
echo ""
echo "📦 Creating zip file..."
cd "$TEMP_DIR"
zip -r "$OUTPUT_PATH" "smilevision-marketplace" > /dev/null

# Clean up
rm -rf "$TEMP_DIR"

# Get file size
FILE_SIZE=$(du -h "$OUTPUT_PATH" | cut -f1)

echo ""
echo "✅ SUCCESS!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Package created: $ZIP_NAME"
echo "📍 Location: $OUTPUT_PATH"
echo "📊 Size: $FILE_SIZE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Next: Extract and read MARKETPLACE_IMPLEMENTATION.md"
echo ""
echo "✨ Done!"

# Open Downloads folder
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$HOME/Downloads"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$HOME/Downloads" 2>/dev/null || echo "📂 Check your Downloads folder"
fi
