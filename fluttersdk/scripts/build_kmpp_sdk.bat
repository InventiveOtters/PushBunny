@echo off
REM Build script for compiling KMPP SDK and integrating with Flutter (Windows)
REM This script builds both Android (AAR) and iOS (XCFramework) artifacts

setlocal enabledelayedexpansion

echo === PushBunny KMPP SDK Build Script ===

REM Get script directory
set SCRIPT_DIR=%~dp0
set FLUTTER_SDK_DIR=%SCRIPT_DIR%..
set PROJECT_ROOT=%FLUTTER_SDK_DIR%\..
set KMPP_SDK_DIR=%PROJECT_ROOT%\sdk

echo Flutter SDK: %FLUTTER_SDK_DIR%
echo KMPP SDK: %KMPP_SDK_DIR%
echo.

REM Check if KMPP SDK directory exists
if not exist "%KMPP_SDK_DIR%" (
    echo Error: KMPP SDK directory not found at %KMPP_SDK_DIR%
    exit /b 1
)

REM Check if Java is available
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Java is not installed or not in PATH
    exit /b 1
)

echo Java version:
java -version

REM Navigate to KMPP SDK directory
cd /d "%KMPP_SDK_DIR%"

REM Clean previous builds
echo.
echo Cleaning previous builds...
call gradlew.bat clean

REM Build Android AAR
echo.
echo === Building Android AAR ===
call gradlew.bat :library:assembleRelease

REM Check if AAR was built successfully
set AAR_PATH=%KMPP_SDK_DIR%\library\build\outputs\aar\library-release.aar
if not exist "%AAR_PATH%" (
    echo Error: Android AAR not found at %AAR_PATH%
    exit /b 1
)

echo [OK] Android AAR built successfully

REM Copy AAR to Flutter SDK
set FLUTTER_ANDROID_LIBS=%FLUTTER_SDK_DIR%\android\libs
if not exist "%FLUTTER_ANDROID_LIBS%" mkdir "%FLUTTER_ANDROID_LIBS%"
copy /Y "%AAR_PATH%" "%FLUTTER_ANDROID_LIBS%\library.aar"
echo [OK] Copied AAR to %FLUTTER_ANDROID_LIBS%\library.aar

REM Build iOS XCFramework (Note: This requires macOS)
echo.
echo === Building iOS XCFramework ===
echo Note: iOS XCFramework build requires macOS
call gradlew.bat :library:assembleXCFramework

REM Check if XCFramework was built successfully
set XCFRAMEWORK_PATH=%KMPP_SDK_DIR%\library\build\XCFrameworks\release\library.xcframework
if not exist "%XCFRAMEWORK_PATH%" (
    echo Warning: iOS XCFramework not found at %XCFRAMEWORK_PATH%
    echo This is expected on Windows. Use macOS to build iOS framework.
    goto :skip_ios
)

echo [OK] iOS XCFramework built successfully

REM Copy XCFramework to Flutter SDK
set FLUTTER_IOS_FRAMEWORKS=%FLUTTER_SDK_DIR%\ios\Frameworks
if not exist "%FLUTTER_IOS_FRAMEWORKS%" mkdir "%FLUTTER_IOS_FRAMEWORKS%"
if exist "%FLUTTER_IOS_FRAMEWORKS%\library.xcframework" rmdir /s /q "%FLUTTER_IOS_FRAMEWORKS%\library.xcframework"
xcopy /E /I /Y "%XCFRAMEWORK_PATH%" "%FLUTTER_IOS_FRAMEWORKS%\library.xcframework"
echo [OK] Copied XCFramework to %FLUTTER_IOS_FRAMEWORKS%\library.xcframework

:skip_ios

REM Print summary
echo.
echo === Build Summary ===
echo [OK] Android AAR: %FLUTTER_ANDROID_LIBS%\library.aar
if exist "%FLUTTER_IOS_FRAMEWORKS%\library.xcframework" (
    echo [OK] iOS XCFramework: %FLUTTER_IOS_FRAMEWORKS%\library.xcframework
)
echo.
echo Build completed successfully!
echo.
echo Next steps:
echo 1. Run 'flutter pub get' in the fluttersdk directory
echo 2. Test the integration with 'cd fluttersdk\example && flutter run'

endlocal

