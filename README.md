Syncoop Extension for VS Code 🚀
Seamlessly integrate the Syncloop UI editor into Visual Studio Code for efficient API service development.

The Syncoop Extension is a powerful Visual Studio Code extension that embeds the Syncloop UI editor into a webview, enabling developers to create, edit, and manage API services directly within their IDE. Designed with extensibility and performance in mind, this extension leverages VS Code’s Webview API, secure communication practices, and configurable settings to provide a seamless development experience for Syncloop users.

📑 Table of Contents

Features
Architecture
Prerequisites
Installation
Usage
Configuration
Development Setup
Packaging and Distribution
Troubleshooting
Roadmap
Contributing
License
Acknowledgments


✨ Features

Syncloop UI Editor Integration: Embeds the Syncloop UI editor in a VS Code webview for creating, editing, and testing API services.
Persistent Storage: Saves API service data to syncloop-service.json in the workspace, ensuring data persistence.
Configurable Server URL: Supports custom Syncloop server URLs via VS Code settings for flexible deployment.
Secure Communication: Implements Content Security Policy (CSP) and iframe sandboxing for enhanced security.
Error Handling: Provides detailed logging and user-friendly error messages for debugging.
Extensibility: Modular architecture supports future enhancements like additional commands or UI customizations.


🏗️ Architecture
The Syncoop Extension follows a client-server architecture, leveraging VS Code’s Webview API for a seamless integration:



Component
Description



VS Code Webview
Renders the Syncloop UI editor via an <iframe> (or optionally the Syncloop SDK). Uses postMessage for communication.


Syncloop Server
Runs at http://localhost:8080 (configurable), serving the UI editor and handling API service operations.


Extension Logic
Manages webview lifecycle, message handling, and data persistence using VS Code APIs.


Security
Enforces CSP and iframe sandboxing to restrict content to trusted origins.


Key Implementation Details:

Webview Communication: Uses postMessage to handle save operations from the Syncloop UI editor.
Data Persistence: Saves service data to the workspace using VS Code’s FileSystem API.
Error Handling: Logs errors to the Extension Host output channel for debugging.


🛠️ Prerequisites
Before using the Syncoop Extension, ensure the following are set up:

Visual Studio Code: Version 1.89.0 or higher. Download here.
Syncloop Server Runtime:
A Syncloop server running at http://localhost:8080 (default) or a custom URL.
Contact the repository maintainer for server setup instructions if unavailable.


Node.js: Version 18.x or higher (required for development). Download here.


📦 Installation
For End Users

Download the .vsix File:

Obtain syncoop-extension-0.0.1.vsix from the Releases page or from the repository maintainer.


Install in VS Code:

Open VS Code.
Go to the Extensions view (Ctrl + Shift + X on Windows/Linux, Cmd + Shift + X on Mac).
Click the ... menu and select Install from VSIX.
Select syncoop-extension-0.0.1.vsix and install.
The extension will appear as Syncoop Extension in your Extensions list.




🚀 Usage

Start the Syncloop Server:

Launch your Syncloop server (e.g., via a Spring Boot application).
Verify it’s running by accessing http://localhost:8080/index.html in a browser.


Open a Workspace:

In VS Code, open a folder (File > Open Folder) to enable saving service data.


Launch the Webview:

Open the Command Palette (Ctrl + Shift + P on Windows/Linux, Cmd + Shift + P on Mac).
Run Show Syncloop Webview.
A webview panel will open with the Syncloop UI editor.


Interact with API Services:

Create, edit, and save API services using the editor.
Saved data will be stored in syncloop-service.json in your workspace folder.




⚙️ Configuration
Customize the extension via VS Code settings:

Syncloop Server URL:
Default: http://localhost:8080.
To change:
Go to VS Code Settings (Ctrl + , on Windows/Linux, Cmd + , on Mac).
Search for Syncoop.
Update Syncoop: Service Base Url to your server URL (e.g., http://localhost:3000).






💻 Development Setup
For developers looking to contribute or modify the extension:

Clone the Repository:
git clone https://github.com/manavrai/Syncoop-extension.git
cd Syncoop-extension


Install Dependencies:
npm install


Open in VS Code:
code .


Run the Extension:

Press F5 to launch the Extension Development Host.
Run Show Syncloop Webview to test the extension.




Advanced: Switch to SDK-Based Embedding

The extension currently uses an <iframe> to load the Syncloop UI editor from the server. To embed the editor directly using the Syncloop SDK (syncloop.min.js):

Update extension.js to use the SDK approach (see code comments for details).
Adjust the Content Security Policy (CSP) to allow loading the SDK.
Test thoroughly, as this approach removes the server dependency but requires additional configuration.




📲 Packaging and Distribution

Package the Extension:
npx @vscode/vsce package


Creates syncoop-extension-0.0.1.vsix.


Publish to VS Code Marketplace (Optional):

Create a publisher account at https://marketplace.visualstudio.com/.
Publish:npx @vscode/vsce publish






🐞 Troubleshooting

Webview Fails to Load:

Ensure the Syncloop server is running at the configured URL.
Check the Output panel (Ctrl + Shift + U, select Extension Host) for errors.
Verify the server URL in settings.


Cannot Save Data:

Ensure a workspace folder is open in VS Code.
Check for write permissions in the workspace directory.


CORS Issues:

If the Syncloop server is on a different domain/port, ensure it allows cross-origin requests from VS Code.




📅 Roadmap

 Add support for multiple Syncloop server instances.
 Implement a command to open and edit saved syncloop-service.json files.
 Provide a UI for testing API services directly in the webview.
 Support Syncloop SDK-based embedding as the default approach.
 Add unit tests for extension functionality.


🤝 Contributing
Contributions are welcome! Follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add YourFeature').
Push to the branch (git push origin feature/YourFeature).
Open a Pull Request.

Please read the Contributing Guidelines for more details.

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

🙏 Acknowledgments

Manav Rai: Creator and maintainer of the Syncoop Extension.
Syncloop Team: For providing the Syncloop UI editor and SDK.
VS Code Team: For the excellent Webview API and documentation.


For questions or support, open an issue on GitHub or contact the maintainer at your-email@example.com.
