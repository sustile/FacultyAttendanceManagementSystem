
# Faculty Attendance App

This is a React Native-based mobile application for managing faculty attendance using geolocation and geofencing.

## Prerequisites

- Node.js
- React Native CLI
- Android Studio (for building Android APK)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sustile/FacultyAttendanceManagementSystem.git
   cd FacultyAttendanceManagementSystem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Google API Key:
   - Open `android/app/src/main/AndroidManifest.xml`.
   - Edit the following inside the `<application>` tag:
     ```xml
     <meta-data
         android:name="com.google.android.geo.API_KEY"
         android:value="YOUR_API_KEY" />
     ```

## Running the App

To run the app on an emulator or physical device:
```bash
npx react-native run-android
```

## Generating an Android Release Build APK

1. Generate a release build APK by running:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. The APK will be located at:
   `android/app/build/outputs/apk/release/app-release.apk`

## License

This project is licensed under the MIT License.
