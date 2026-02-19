# PowerShell Script to Create Marketplace Code Zip
# Run this in PowerShell: .\create-marketplace-zip.ps1

Write-Host "🎯 Creating SmileVision Pro Marketplace Code Package..." -ForegroundColor Cyan

# Get current directory
$sourceDir = Get-Location
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zipName = "SmileVisionPro-Marketplace-$timestamp.zip"
$outputPath = Join-Path $HOME "Downloads\$zipName"

Write-Host "📁 Source: $sourceDir" -ForegroundColor Yellow
Write-Host "📦 Output: $outputPath" -ForegroundColor Yellow

# Items to include
$includeItems = @(
    "components",
    "styles",
    "utils",
    "supabase",
    "App.tsx",
    "App.marketplace.tsx",
    "App.original.tsx",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "index.html",
    "MARKETPLACE_REFACTOR_GUIDE.md",
    "BEFORE_AFTER_MARKETPLACE.md",
    "MARKETPLACE_IMPLEMENTATION.md"
)

Write-Host "`n📋 Including files:" -ForegroundColor Green
$includeItems | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Gray }

# Create temporary directory for staging
$tempDir = Join-Path $env:TEMP "smilevision-marketplace-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "`n📂 Copying files to staging area..." -ForegroundColor Cyan

# Copy items
foreach ($item in $includeItems) {
    $sourcePath = Join-Path $sourceDir $item
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $tempDir $item
        if (Test-Path $sourcePath -PathType Container) {
            Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
            Write-Host "  ✓ Copied directory: $item" -ForegroundColor Green
        } else {
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "  ✓ Copied file: $item" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠ Not found: $item" -ForegroundColor Yellow
    }
}

# Create README in zip
$readmeContent = @"
# SmileVision Pro - GoHighLevel Marketplace Version

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
4. Submit to GHL Marketplace

Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

$readmePath = Join-Path $tempDir "README-MARKETPLACE.txt"
Set-Content -Path $readmePath -Value $readmeContent

Write-Host "`n📝 Created README-MARKETPLACE.txt" -ForegroundColor Green

# Create the zip
Write-Host "`n📦 Creating zip file..." -ForegroundColor Cyan
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -Force

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

# Get file size
$fileSize = (Get-Item $outputPath).Length / 1MB

Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📦 Package created: $zipName" -ForegroundColor Cyan
Write-Host "📍 Location: $outputPath" -ForegroundColor Yellow
Write-Host "📊 Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "`n🎯 Next: Extract and read MARKETPLACE_IMPLEMENTATION.md" -ForegroundColor Green

# Open the downloads folder
Write-Host "`n📂 Opening Downloads folder..." -ForegroundColor Cyan
Start-Process (Split-Path $outputPath -Parent)

Write-Host "`n✨ Done!" -ForegroundColor Magenta
