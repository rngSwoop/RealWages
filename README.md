App that lets users track their hourly wage, cost of living, and mortgage rates as it relates to the world around them.

DOWNLOADING CHOCOLATEY, NODE, JDK:
- Open PowerShell as administrator
- "Set-ExecutionPolicy AllSigned"
- Download Chocolatey: "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
- Type "choco" to verify chocolatey install worked
- If command is not recognized, try restarting PowerShell as an administrator, Type "choco" again to verify installation
- Install Node and JDK 11: "choco install -y nodejs-lts microsoft-openjdk11"

INSTALL LATEST VERSION OF ANDROID STUDIO:

SET ENVIRONMENT VARIABLES FOR Android SDK, NPM SDK, Java SDK, Adb:
- Search for Advanced System Settings
- Click on Environment Variables
- In the bottom box, System variables, You should already see:
  - ChocolateyInstall
  - JAVA_HOME (C:\Program Files\Microsoft\jdk-11.0.20.8-hotspot)
  - If jdk 11 does not appear, "choco install microsoft-openjdk11 --force" and set JAVA_HOME
  - Under Path, you should have paths to nodejs, java sdk, and chocolatey
- On your machine, press WINDOWS KEY + R, type "%appdata%"
- Go up one folder, and click the Local directory, here you should see an Android folder, click it
- Under User Environment Variables (top box) create variables for:
  - ANDROID_HOME: C:\Users\garre\AppData\Local\Android\Sdk    (Your path will be slightly different)
  - ANDROID_SDK_ROOT: C:\Users\garre\AppData\Local\Android\Sdk    (path will be slightly different)
- Now, under System variables (bottom box), double-click Path
  - For adb, add a path here for C:\Users\garre\AppData\Local\Android\Sdk\platform-tools
  - For chocolatey, add a path for C:\ProgramData\chocolatey\bin
  - For nodejs, C:\Program Files\nodejs\
  - Make sure jdk 11 appears here too, C:\Program Files\Microsoft\jdk-11.0.20.8-hotspot\bin

GO TO ANDROID STUDIO:
- Open project location
- File > Settings > Android SDK (Under Languages and Frameworks)
- Under SDK Platforms, click Show Package Details in bottom right, scroll down to see Android 13.0 Tiramisu and select
  - Android SDK Platform 33
  - Intel x86_64 Atom System Image
  - Google APIs Intel x86_64 Atom System Image
  - Google Play Intel x86_64 Atom System Image
  - Click Apply, then stay in the Android SDK window
- Under SDK Tools, click Show Package Details in bottom right
  - Under Android SDK Build-Tools 34, select 33.0.0 to install SDK 33
  - Click Show Package Details again, the 3rd box down should say Android SDK Command-line Tools, select this as well
  - Click Apply
  - After installing, Command-Line tools will still not have a check box, this is fine
- Go to device manager (top-right), create an emulator on Pixel 3a on API 33 (33 is what is compatible with react-native)
- Close and re-open Android Studio, open device manager and run the emulator
- Type "adb devices" into the terminal window, it should show your running emulator

RUN PROJECT:
- Verify you are in the project root directory with emulator running
- In the terminal run "npm install"
- run "npx react-native start"

FOR TROUBLESHOOTING:
https://www.youtube.com/watch?v=DVgtrPCdSCM&ab_channel=JustMalla