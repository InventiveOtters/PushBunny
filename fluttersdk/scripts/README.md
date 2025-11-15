# PushBunny Flutter SDK Build Scripts

This directory contains scripts for building and integrating the Kotlin Multiplatform (KMPP) SDK with the Flutter plugin.

## Prerequisites

### macOS/Linux
- Java 11 or higher (OpenJDK recommended)
- Gradle (included via wrapper)
- Xcode (for iOS builds on macOS)

### Windows
- Java 11 or higher (OpenJDK recommended)
- Gradle (included via wrapper)
- Note: iOS builds require macOS

## Scripts

### `build_kmpp_sdk.sh` (macOS/Linux)

Builds both Android (AAR) and iOS (XCFramework) artifacts from the KMPP SDK and copies them to the Flutter plugin directories.

**Usage:**
```bash
cd fluttersdk
bash scripts/build_kmpp_sdk.sh
```

Or using Make:
```bash
cd fluttersdk
make build-kmpp
```

### `build_kmpp_sdk.bat` (Windows)

Windows version of the build script. Builds Android AAR (iOS requires macOS).

**Usage:**
```cmd
cd fluttersdk
scripts\build_kmpp_sdk.bat
```

## Makefile Commands

The `fluttersdk/Makefile` provides convenient shortcuts:

- `make build-kmpp` - Build both Android and iOS
- `make build-android` - Build Android AAR only
- `make build-ios` - Build iOS XCFramework only
- `make clean` - Clean all build artifacts
- `make test` - Run Flutter tests

## Build Output

After a successful build, the following artifacts will be created:

### Android
- **Source:** `sdk/library/build/outputs/aar/library.aar`
- **Destination:** `fluttersdk/android/libs/library.aar`

### iOS
- **Source:** `sdk/library/build/XCFrameworks/release/library.xcframework`
- **Destination:** `fluttersdk/ios/Frameworks/library.xcframework`

## Troubleshooting

### Java Not Found

If you see "Java is not installed or not in PATH":

**macOS (Homebrew):**
```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

**Linux:**
```bash
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

**Windows:**
Set environment variables in System Properties or use:
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-11
set PATH=%JAVA_HOME%\bin;%PATH%
```

### Build Failures

1. **Clean the build:**
   ```bash
   cd sdk
   ./gradlew clean
   ```

2. **Check Gradle version:**
   ```bash
   cd sdk
   ./gradlew --version
   ```

3. **Verify Java version:**
   ```bash
   java -version
   ```

### iOS Build Issues

- Ensure you're on macOS
- Xcode must be installed
- Accept Xcode license: `sudo xcodebuild -license accept`

## Integration Testing

After building, test the integration:

```bash
cd fluttersdk/example
flutter pub get
flutter run
```

## Continuous Integration

For CI/CD pipelines, use the build script with appropriate environment variables:

```bash
export JAVA_HOME=/path/to/java
export PATH=$JAVA_HOME/bin:$PATH
cd fluttersdk
bash scripts/build_kmpp_sdk.sh
```

## Notes

- The build script automatically detects and sets JAVA_HOME on macOS if using Homebrew OpenJDK
- iOS builds take longer due to multiple architecture compilation (arm64, x86_64, simulator)
- The XCFramework includes both device and simulator slices
- Build artifacts are not committed to version control; rebuild when needed

