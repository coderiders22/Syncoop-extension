# 🚀 Syncoop Extension for Visual Studio Code

> Seamlessly embed the **Syncloop UI Editor** into Visual Studio Code for powerful and intuitive API service development — right from your IDE.

The **Syncoop Extension** provides a rich development experience by integrating the Syncloop UI Editor directly into a Visual Studio Code Webview. Designed for modern API workflows, it combines ease of use with advanced features such as persistent local storage, configurable server endpoints, and secure sandboxing — all optimized for performance and scalability.

---

## 📚 Table of Contents

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

- **Embedded Syncloop UI**: Leverages a Webview to display the Syncloop Editor within VS Code.
- **Local Data Persistence**: Automatically stores API service configurations in `syncloop-service.json` within your workspace.
- **Dynamic Server Configuration**: Allows custom Syncloop backend URLs via user settings.
- **Secure Integration**: Implements strict Content Security Policy (CSP) and iframe sandboxing.
- **Robust Error Handling**: Provides developer-friendly error messages and detailed logging via the Extension Host.
- **Extensible Architecture**: Built to accommodate SDK-based embedding, additional commands, and UI enhancements in future versions.

---

## 🧱 Architecture

The extension employs a client-server design centered around VS Code’s Webview API.

| Component            | Description |
|----------------------|-------------|
| **VS Code Webview**  | Embeds the Syncloop UI using an iframe. Communicates via `postMessage`. |
| **Syncloop Server**  | Default: `http://localhost:8080`. Hosts the Syncloop UI Editor. Configurable by the user. |
| **Extension Logic**  | Manages lifecycle, messaging, and file I/O using VS Code APIs. |
| **Security Controls**| Applies CSP headers and iframe sandboxing for controlled, secure rendering. |

### Key Implementation Highlights:
- **Message Bridge**: Communication between the editor and VS Code handled using `postMessage`.
- **File I/O**: Utilizes VS Code's FileSystem API to store data locally.
- **Diagnostics**: Errors are logged to the Extension Host Output Panel for easy debugging.

---

## 🛠️ Prerequisites

Before installation, ensure the following requirements are met:

- **Visual Studio Code**: v1.89.0 or later — [Download](https://code.visualstudio.com/)
- **Node.js**: v18.x or higher — [Download](https://nodejs.org/)
- **Syncloop Server**:
  - Should be running locally (`http://localhost:8080`) or via a custom endpoint.
  - Reach out to the repository maintainer for setup instructions if unavailable.

---

## 📦 Installation

### 1. Download `.vsix` Package

Get the latest release from the [Releases](#) section or request it from the maintainer.

### 2. Install in Visual Studio Code

1. Open **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Click the **⋯** menu and choose **Install from VSIX**
3. Select `syncoop-extension-0.0.1.vsix`
4. Once installed, the extension will appear in your list

---

## 🚀 Usage

### Step 1: Start Syncloop Server

Ensure the Syncloop backend is active at: `http://localhost:8080`

### Step 2: Open a Workspace

To enable saving, open a folder (`File > Open Folder`) in VS Code.

### Step 3: Launch the Syncloop Webview

- Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type: `Show Syncloop Webview`
- Hit `Enter` — the Syncloop UI editor will load within a new Webview panel.

### Step 4: Develop Your API Services

- Interact with the editor as you normally would.
- All service configurations are saved to `syncloop-service.json` in your workspace root.

---

## ⚙️ Configuration

You can customize the extension’s behavior using VS Code settings.

### Setting: Syncloop Service Base URL

- **Default**: `http://localhost:8080`

### To Change:

1. Open **Settings** (`Ctrl+,` / `Cmd+,`)
2. Search for `Syncoop`
3. Modify the **Syncoop: Service Base Url** field as required

This allows connection to alternative environments (e.g., staging or production).

---

## 💻 Development Setup

Want to contribute or explore the source code? Follow these steps:

```bash
# Clone the repository
git clone [https://github.com/manavrai/Syncoop-extension.git](https://github.com/coderiders22/Syncoop-extension)
cd Syncoop-extension

# Install dependencies
npm install

# Open in VS Code
code .

# Launch the Extension Host
# (Press F5 in the IDE to open a development sandbox)

> Tip: Run the `Show Syncloop Webview` command in the sandbox to test the integration.

---

### 🧬 Advanced: SDK-Based Embedding (Optional)

The extension uses an iframe by default. To switch to embedding the Syncloop editor via the SDK (`syncloop.min.js`):

1. Modify the `extension.js` logic to use the SDK.
2. Adjust the Content Security Policy to permit necessary script sources.
3. Test compatibility thoroughly — especially if removing the backend dependency.

---

## 📲 Packaging & Distribution

To package the extension for local installation or distribution:

```bash
npx @vscode/vsce package
```

This generates:
`syncoop-extension-0.0.1.vsix`

### Optional: Publish to the Marketplace

1. Create a publisher at [marketplace.visualstudio.com](https://marketplace.visualstudio.com/)
2. Run:

```bash
npx @vscode/vsce publish
```

---

## 🐞 Troubleshooting

| Issue                     | Resolution                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Webview not loading       | Ensure the Syncloop server is running and the URL is correct. Check logs in the Extension Host Output panel. |
| Data not saving           | Confirm that a workspace folder is open and that write permissions are granted.                              |
| CORS or Connection Errors | Ensure the Syncloop server allows cross-origin requests from VS Code’s origin.                               |

---

## 🛣️ Roadmap

* [ ] Support multiple server instances
* [ ] In-editor testing suite for APIs
* [ ] UI for editing saved service data (`syncloop-service.json`)
* [ ] SDK embedding as the default method
* [ ] Add unit and integration tests

---

## 🤝 Contributing

We welcome contributions from developers of all backgrounds!

### To contribute:

```bash
# Fork this repository
# Create a new branch for your feature
git checkout -b feature/my-new-feature

# Make changes, commit, and push
git commit -m "Add my new feature"
git push origin feature/my-new-feature

# Open a Pull Request on GitHub
```

Please review our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

---

## 📜 License

This project is licensed under the **MIT License**.
Refer to the [LICENSE](LICENSE) file for full terms.

---

## 🙏 Acknowledgments

* **Manav Rai** — Project Author & Maintainer
* **Syncloop Team** — For the editor framework and SDK
* **VS Code Team** — For the exceptional tooling and Webview API

---

For feedback, questions, or support, feel free to [open an issue](https://github.com/coderiders22/Syncoop-extension/issues) or contact the maintainer at: `manavrai454@gmail.com`

> *This repository is intended for professional and educational use. Please refrain from redistributing or republishing without proper authorization.*

```

---


