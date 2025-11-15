.PHONY: help build-kmpp build-android build-ios clean test

help:
	@echo "PushBunny Flutter SDK - Available Commands:"
	@echo ""
	@echo "  make build-kmpp    - Build KMPP SDK for both Android and iOS"
	@echo "  make build-android - Build KMPP SDK for Android only"
	@echo "  make build-ios     - Build KMPP SDK for iOS only"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make test          - Run Flutter tests"
	@echo ""

build-kmpp:
	@echo "Building KMPP SDK for Android and iOS..."
	@bash scripts/build_kmpp_sdk.sh

build-android:
	@echo "Building KMPP SDK for Android..."
	@cd ../sdk && ./gradlew :library:assembleRelease
	@mkdir -p android/libs
	@cp ../sdk/library/build/outputs/aar/library-release.aar android/libs/library.aar
	@echo "✓ Android AAR copied to android/libs/library.aar"

build-ios:
	@echo "Building KMPP SDK for iOS..."
	@cd ../sdk && ./gradlew :library:assembleXCFramework
	@mkdir -p ios/Frameworks
	@rm -rf ios/Frameworks/library.xcframework
	@cp -R ../sdk/library/build/XCFrameworks/release/library.xcframework ios/Frameworks/
	@echo "✓ iOS XCFramework copied to ios/Frameworks/library.xcframework"

clean:
	@echo "Cleaning build artifacts..."
	@cd ../sdk && ./gradlew clean
	@rm -rf build
	@rm -rf example/build
	@flutter clean
	@echo "✓ Clean complete"

test:
	@echo "Running Flutter tests..."
	@flutter test

