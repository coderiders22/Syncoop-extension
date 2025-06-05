const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Extension "syncoop-extension" is now active!');

  let disposable = vscode.commands.registerCommand('syncoop-extension.show', () => {
    console.log('Show Syncloop Webview command triggered');

    try {
      const panel = vscode.window.createWebviewPanel(
        'syncloopWebview',
        'Syncloop Embedded SDK',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      panel.webview.onDidReceiveMessage(
        message => {
          if (message.command === 'save') {
            console.log('Received save message from webview:', message.data);
            vscode.window.showInformationMessage('Service saved! Data: ' + JSON.stringify(message.data));
          }
        },
        undefined,
        context.subscriptions
      );

      panel.webview.html = getWebviewContent();
    } catch (error) {
      console.error('Error in Show Syncloop Webview command:', error);
      vscode.window.showErrorMessage('Failed to open Syncloop Webview: ' + error.message);
    }
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self' http://localhost:8080; script-src 'self' 'unsafe-inline' http://localhost:8080; style-src 'self' 'unsafe-inline' http://localhost:8080; frame-src http://localhost:8080;">
      <title>Syncloop Embedded SDK</title>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
      </style>
    </head>
    <body>
      <iframe src="http://localhost:8080/index.html" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
      <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener('message', event => {
          if (event.origin === 'http://localhost:8080' && event.data.command === 'save') {
            console.log('Received save message from iframe:', event.data);
            vscode.postMessage({ command: 'save', data: event.data.data });
          }
        });
      </script>
    </body>
    </html>
  `;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};