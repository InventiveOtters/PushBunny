#!/bin/bash

# Build script for compiling KMPP SDK and integrating with Flutter
# This script builds both Android (AAR) and iOS (XCFramework) artifacts

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FLUTTER_SDK_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$FLUTTER_SDK_DIR")"
KMPP_SDK_DIR="$PROJECT_ROOT/sdk"

echo -e "${GREEN}=== PushBunny KMPP SDK Build Script ===${NC}"
echo "Flutter SDK: $FLUTTER_SDK_DIR"
echo "KMPP SDK: $KMPP_SDK_DIR"
echo ""

# Check if KMPP SDK directory exists
if [ ! -d "$KMPP_SDK_DIR" ]; then
    echo -e "${RED}Error: KMPP SDK directory not found at $KMPP_SDK_DIR${NC}"
    exit 1
fi

# Set JAVA_HOME if not already set
if [ -z "$JAVA_HOME" ]; then
    if [ -d "/opt/homebrew/opt/openjdk" ]; then
        export JAVA_HOME="/opt/homebrew/opt/openjdk"
        export PATH="$JAVA_HOME/bin:$PATH"
        echo -e "${YELLOW}Set JAVA_HOME to $JAVA_HOME${NC}"
    elif [ -d "/usr/local/opt/openjdk" ]; then
        export JAVA_HOME="/usr/local/opt/openjdk"
        export PATH="$JAVA_HOME/bin:$PATH"
        echo -e "${YELLOW}Set JAVA_HOME to $JAVA_HOME${NC}"
    fi
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install Java or set JAVA_HOME environment variable${NC}"
    exit 1
fi

echo -e "${YELLOW}Java version:${NC}"
java -version

# Navigate to KMPP SDK directory
cd "$KMPP_SDK_DIR"

# Clean previous builds
echo -e "\n${YELLOW}Cleaning previous builds...${NC}"
./gradlew clean

# Build Android AAR
echo -e "\n${GREEN}=== Building Android AAR ===${NC}"
./gradlew :library:bundleAndroidMainAar

# Check if AAR was built successfully
AAR_PATH="$KMPP_SDK_DIR/library/build/outputs/aar/library.aar"
if [ ! -f "$AAR_PATH" ]; then
    echo -e "${RED}Error: Android AAR not found at $AAR_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Android AAR built successfully${NC}"

# Copy AAR to Flutter SDK
FLUTTER_ANDROID_LIBS="$FLUTTER_SDK_DIR/android/libs"
mkdir -p "$FLUTTER_ANDROID_LIBS"
cp "$AAR_PATH" "$FLUTTER_ANDROID_LIBS/library.aar"
echo -e "${GREEN}✓ Copied AAR to $FLUTTER_ANDROID_LIBS/library.aar${NC}"

# Build iOS XCFramework
echo -e "\n${GREEN}=== Building iOS XCFramework ===${NC}"
./gradlew :library:assembleXCFramework

# Check if XCFramework was built successfully
XCFRAMEWORK_PATH="$KMPP_SDK_DIR/library/build/XCFrameworks/release/library.xcframework"
if [ ! -d "$XCFRAMEWORK_PATH" ]; then
    echo -e "${RED}Error: iOS XCFramework not found at $XCFRAMEWORK_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✓ iOS XCFramework built successfully${NC}"

# Copy XCFramework to Flutter SDK
FLUTTER_IOS_FRAMEWORKS="$FLUTTER_SDK_DIR/ios/Frameworks"
mkdir -p "$FLUTTER_IOS_FRAMEWORKS"
rm -rf "$FLUTTER_IOS_FRAMEWORKS/library.xcframework"
cp -R "$XCFRAMEWORK_PATH" "$FLUTTER_IOS_FRAMEWORKS/library.xcframework"
echo -e "${GREEN}✓ Copied XCFramework to $FLUTTER_IOS_FRAMEWORKS/library.xcframework${NC}"

# Print summary
echo -e "\n${GREEN}=== Build Summary ===${NC}"
echo -e "${GREEN}✓ Android AAR: $FLUTTER_ANDROID_LIBS/library.aar${NC}"
echo -e "${GREEN}✓ iOS XCFramework: $FLUTTER_IOS_FRAMEWORKS/library.xcframework${NC}"
echo -e "\n${GREEN}Build completed successfully!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Run 'flutter pub get' in the fluttersdk directory"
echo "2. Test the integration with 'cd fluttersdk/example && flutter run'"

