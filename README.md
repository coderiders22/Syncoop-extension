# 🚀 Syncoop Extension for Visual Studio Code

> Seamlessly integrate the **Syncloop UI Editor** into Visual Studio Code for intuitive and powerful API service development — directly within your IDE.

![VS Code](https://img.shields.io/badge/VS%20Code-1.89.0+-007ACC?logo=visualstudiocode) ![Node.js](https://img.shields.io/badge/Node.js-18.x+-3C873A?logo=node.js) ![License](https://img.shields.io/badge/License-MIT-blue)

The **Syncoop Extension** brings the Syncloop UI Editor into Visual Studio Code via a Webview, delivering a robust and user-friendly experience for API development. With features like local data persistence, configurable server endpoints, and secure sandboxing, it’s designed for performance, scalability, and modern workflows.

---

## 📑 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development Setup](#development-setup)
- [Packaging & Distribution](#packaging--distribution)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## ✨ Features

- **Embedded Syncloop UI**: Access the Syncloop Editor directly within a VS Code Webview.
- **Local Data Persistence**: Automatically saves API service configurations to `syncloop-service.json` in your workspace.
- **Dynamic Server Configuration**: Customize Syncloop backend URLs through user settings.
- **Secure Integration**: Enforces strict Content Security Policy (CSP) and iframe sandboxing.
- **Robust Error Handling**: Provides clear error messages and detailed logs in the Extension Host.
- **Extensible Design**: Supports future enhancements like SDK embedding, additional commands, and UI improvements.

---

## 🏗️ Architecture

The extension leverages a client-server model using VS Code’s Webview API for seamless integration.

| Component            | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| **VS Code Webview**  | Embeds the Syncloop UI via an iframe, using `postMessage` for communication. |
| **Syncloop Server**  | Hosts the Syncloop UI Editor (default: `http://localhost:8080`). Configurable. |
| **Extension Logic**  | Manages Webview lifecycle, messaging, and file I/O with VS Code APIs.       |
| **Security Controls**| Implements CSP headers and iframe sandboxing for secure rendering.          |

### Key Highlights
- **Message Bridge**: Facilitates communication between the editor and VS Code via `postMessage`.
- **File I/O**: Uses VS Code’s FileSystem API for local data storage.
- **Diagnostics**: Logs errors to the Extension Host Output Panel for easy debugging.

---

## 🛠️ Prerequisites

Ensure the following are set up before installing:

- **Visual Studio Code**: Version 1.89.0 or later — [Download](https://code.visualstudio.com/)
- **Node.js**: Version 18.x or higher — [Download](https://nodejs.org/)
- **Syncloop Server**: Running locally at `http://localhost:8080` or a custom endpoint. Contact the repository maintainer for setup instructions if needed.

---

## 📦 Installation

### 1. Download the `.vsix` Package
Obtain the latest release from the [Releases](https://github.com/coderiders22/Syncoop-extension/tree/10efb6b84daa8814307282cb2eb0302a7a5f2f29/Releases) section or request it from the maintainer.

### 2. Install in VS Code
1. Open **Extensions** (`Ctrl+Shift+X` or `Cmd+Shift+X`).
2. Click the **⋯** menu and select **Install from VSIX**.
3. Choose `syncoop-extension-0.0.1.vsix`.
4. The extension will appear in your Extensions list once installed.

---

## 🚀 Usage

### Step 1: Start the Syncloop Server
Verify that the Syncloop backend is running at `http://localhost:8080`.

### Step 2: Open a Workspace
Open a folder in VS Code (`File > Open Folder`) to enable configuration saving.

### Step 3: Launch the Syncloop Webview
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Type `Show Syncloop Webview` and press `Enter`.
3. The Syncloop UI Editor will load in a new Webview panel.

### Step 4: Develop API Services
- Use the editor as you normally would.
- Service configurations are automatically saved to `syncloop-service.json` in your workspace root.

---

## ⚙️ Configuration

Customize the extension via VS Code settings.

### Setting: Syncloop Service Base URL
- **Default**: `http://localhost:8080`

### How to Update
1. Open **Settings** (`Ctrl+,` or `Cmd+,`).
2. Search for `Syncoop`.
3. Update the **Syncoop: Service Base Url** field to connect to alternative environments (e.g., staging or production).

---

## 💻 Development Setup

To contribute or explore the source code:

```bash
# Clone the repository
git clone https://github.com/manavrai/Syncoop-extension.git
cd Syncoop-extension

# Install dependencies
npm install

# Open in VS Code
code .

# Launch the Extension Host
# Press F5 to open a development sandbox
```

---

## 📲 Packaging & Distribution

To package the extension for local use or distribution:

```bash
npx @vscode/vsce package
```

This generates: `syncoop-extension-0.0.1.vsix`

---

## 🐞 Troubleshooting

| Issue                     | Resolution                                                                 |
|---------------------------|---------------------------------------------------------------------------|
| **Webview not loading**   | Ensure the Syncloop server is running and the URL is correct. Check logs in the Extension Host Output panel. |
| **Data not saving**       | Verify a workspace folder is open and write permissions are granted.       |
| **CORS/Connection Errors**| Confirm the Syncloop server allows cross-origin requests from VS Code’s origin. |

---

## 🛣️ Roadmap

- [ ] Support for multiple server instances
- [ ] In-editor API testing suite
- [ ] UI for editing `syncloop-service.json`
- [ ] Default SDK embedding
- [ ] Add unit and integration tests

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

For issues or suggestions, [open an issue](https://github.com/coderiders22/Syncoop-extension/issues).

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Manav Rai** — Project Author & Maintainer
- **Syncloop Team** — For the editor framework and SDK

---

For feedback or support, [open an issue](https://github.com/coderiders22/Syncoop-extension/issues) or contact the maintainer at: `manavrai454@gmail.com`

---
3. **Table Formatting**: Aligned tables with consistent padding and clearer column headers.
4. **Code Blocks**: Used proper Markdown code block formatting for commands.
5. **Conciseness**: Streamlined wording where possible without losing clarity.
6. **Visual Hierarchy**: Enhanced section headers with larger emojis and consistent formatting for better navigation.
7. **Contributing Section**: Added a brief contributing guide to encourage collaboration.
8. **Links**: Ensured all links (e.g., Releases, License) are clearly formatted and accessible.

This version maintains all your original content while presenting it in a polished, professional, and visually appealing way. Let me know if you'd like further tweaks or specific additions!
