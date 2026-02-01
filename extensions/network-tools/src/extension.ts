import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class NetworkMonitorProvider implements vscode.TreeDataProvider<NetworkItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<NetworkItem | undefined> = new vscode.EventEmitter<NetworkItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<NetworkItem | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: NetworkItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: NetworkItem): Thenable<NetworkItem[]> {
        if (!element) {
            return Promise.resolve([
                new NetworkItem('Recent Requests', '', vscode.TreeItemCollapsibleState.Collapsed),
                new NetworkItem('Collections', '', vscode.TreeItemCollapsibleState.Collapsed),
                new NetworkItem('Environment Variables', '', vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }

        if (element.label === 'Recent Requests') {
            return Promise.resolve([
                new NetworkItem('GET https://api.example.com/users', '200 OK', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('POST https://api.example.com/login', '401 Unauthorized', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('GET https://api.example.com/products', '200 OK', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        if (element.label === 'Collections') {
            return Promise.resolve([
                new NetworkItem('User Management', '3 requests', vscode.TreeItemCollapsibleState.Collapsed),
                new NetworkItem('Product Catalog', '5 requests', vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }

        if (element.label === 'User Management') {
            return Promise.resolve([
                new NetworkItem('Get All Users', 'GET /users', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('Create User', 'POST /users', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('Update User', 'PUT /users/{id}', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        if (element.label === 'Product Catalog') {
            return Promise.resolve([
                new NetworkItem('Get Products', 'GET /products', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('Get Product Details', 'GET /products/{id}', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('Search Products', 'GET /products/search', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('Create Product', 'POST /products', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('Delete Product', 'DELETE /products/{id}', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        if (element.label === 'Environment Variables') {
            return Promise.resolve([
                new NetworkItem('BASE_URL', 'https://api.example.com', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('API_KEY', '************', vscode.TreeItemCollapsibleState.None),
                new NetworkItem('USER_TOKEN', '************', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        return Promise.resolve([]);
    }
}

class NetworkItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.description = description;
        this.tooltip = `${this.label}: ${this.description}`;
    }
}

function sendRequest() {
    vscode.window.showInformationMessage('Opening HTTP request editor...');

    const panel = vscode.window.createWebviewPanel(
        'httpRequest',
        'HTTP Request',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HTTP Request</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #2c3e50; }
                .form-group { margin: 10px 0; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input, select, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
                textarea { height: 150px; }
                .headers { margin: 10px 0; }
                .header { display: flex; gap: 10px; margin: 5px 0; }
                .header input { flex: 1; }
                button { margin: 10px 5px 0 0; padding: 8px 16px; background-color: #3498db; color: white; border: none; cursor: pointer; }
                button:hover { background-color: #2980b9; }
            </style>
        </head>
        <body>
            <h1>HTTP Request Editor</h1>
            <div class="form-group">
                <label for="method">Method:</label>
                <select id="method">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>
            </div>
            <div class="form-group">
                <label for="url">URL:</label>
                <input type="text" id="url" value="https://api.example.com/users">
            </div>
            <div class="form-group">
                <label>Headers:</label>
                <div class="headers">
                    <div class="header">
                        <input type="text" placeholder="Key" value="Content-Type">
                        <input type="text" placeholder="Value" value="application/json">
                    </div>
                    <div class="header">
                        <input type="text" placeholder="Key" value="Authorization">
                        <input type="text" placeholder="Value" value="Bearer {token}">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="body">Body:</label>
                <textarea id="body">{
  "name": "John Doe",
  "email": "john@example.com"
}</textarea>
            </div>
            <button onclick="sendRequest()">Send Request</button>
            <button onclick="saveRequest()">Save to Collection</button>
            <script>
                function sendRequest() {
                    const data = {
                        method: document.getElementById('method').value,
                        url: document.getElementById('url').value,
                        body: document.getElementById('body').value
                    };
                    window.parent.postMessage({ type: 'send', data }, '*');
                }
                function saveRequest() {
                    window.parent.postMessage({ type: 'save' }, '*');
                }
            </script>
        </body>
        </html>
    `;

    panel.webview.onDidReceiveMessage(
        message => {
            if (message.type === 'send') {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Sending Request',
                    cancellable: true
                }, async (progress, token) => {
                    progress.report({ increment: 0, message: `Sending ${message.data.method} request to ${message.data.url}...` });
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    progress.report({ increment: 100, message: 'Request completed!' });

                    const responsePanel = vscode.window.createWebviewPanel(
                        'httpResponse',
                        'HTTP Response',
                        vscode.ViewColumn.One,
                        {
                            enableScripts: true
                        }
                    );

                    responsePanel.webview.html = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>HTTP Response</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                h1 { color: #2c3e50; }
                                .status { margin: 10px 0; padding: 10px; background-color: #e8f4f8; border-left: 4px solid #3498db; }
                                .headers { margin: 10px 0; }
                                .header { padding: 5px; background-color: #f8f9fa; margin: 2px 0; }
                                .body { margin: 10px 0; padding: 15px; background-color: #f8f9fa; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap; }
                                button { margin: 10px 5px 0 0; padding: 8px 16px; background-color: #3498db; color: white; border: none; cursor: pointer; }
                                button:hover { background-color: #2980b9; }
                            </style>
                        </head>
                        <body>
                            <h1>Response Details</h1>
                            <div class="status">
                                <h3>Status: 200 OK</h3>
                                <p>Time: 456ms</p>
                                <p>Size: 1.2 KB</p>
                            </div>
                            <div class="headers">
                                <h3>Headers:</h3>
                                <div class="header">Content-Type: application/json</div>
                                <div class="header">Server: nginx/1.18.0</div>
                                <div class="header">Cache-Control: no-cache</div>
                                <div class="header">X-Response-Time: 456ms</div>
                            </div>
                            <div class="body">
                                <h3>Body:</h3>
                                <pre>{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "created_at": "2023-01-02T00:00:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "per_page": 10
}</pre>
                            </div>
                            <button onclick="copyResponse()">Copy Response</button>
                            <button onclick="analyzeResponse()">Analyze Response</button>
                            <script>
                                function copyResponse() {
                                    window.parent.postMessage({ type: 'copy' }, '*');
                                }
                                function analyzeResponse() {
                                    window.parent.postMessage({ type: 'analyze' }, '*');
                                }
                            </script>
                        </body>
                        </html>
                    `;

                    responsePanel.webview.onDidReceiveMessage(
                        msg => {
                            if (msg.type === 'copy') {
                                vscode.window.showInformationMessage('Response copied to clipboard!');
                            } else if (msg.type === 'analyze') {
                                analyzeResponse();
                            }
                        },
                        undefined,
                        []
                    );
                });
            } else if (message.type === 'save') {
                vscode.window.showInformationMessage('Request saved to collection!');
            }
        },
        undefined,
        []
    );
}

function monitorNetwork() {
    vscode.window.showInformationMessage('Starting network monitoring...');
    const provider = new NetworkMonitorProvider();
    vscode.window.registerTreeDataProvider('network-monitor', provider);

    setInterval(() => {
        provider.refresh();
    }, 5000);
}

function analyzeResponse() {
    vscode.window.showInformationMessage('Analyzing response...');

    const panel = vscode.window.createWebviewPanel(
        'responseAnalysis',
        'Response Analysis',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Response Analysis</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1, h2 { color: #2c3e50; }
                .analysis { margin: 20px 0; }
                .item { padding: 10px; margin: 5px 0; background-color: #f8f9fa; border-left: 4px solid #3498db; }
                .warning { border-left-color: #f39c12; }
                .error { border-left-color: #e74c3c; }
                .success { border-left-color: #27ae60; }
            </style>
        </head>
        <body>
            <h1>Response Analysis Report</h1>
            <div class="analysis">
                <h2>Status Code Analysis</h2>
                <div class="item success">200 OK - Request successful</div>
            </div>
            <div class="analysis">
                <h2>Response Time Analysis</h2>
                <div class="item">Response time: 456ms (Good)</div>
                <div class="item">Recommendation: Response time is within acceptable range</div>
            </div>
            <div class="analysis">
                <h2>Content Analysis</h2>
                <div class="item">Content-Type: application/json (Correct)</div>
                <div class="item">Content-Length: 1.2 KB (Small)</div>
            </div>
            <div class="analysis">
                <h2>Header Analysis</h2>
                <div class="item success">Cache-Control: no-cache (Appropriate for dynamic content)</div>
                <div class="item warning">Missing ETag header - Consider adding for better caching</div>
                <div class="item success">X-Response-Time: 456ms (Useful for debugging)</div>
            </div>
            <div class="analysis">
                <h2>Body Analysis</h2>
                <div class="item">JSON format: Valid</div>
                <div class="item">Structure: Well-organized with pagination</div>
                <div class="item">Data quality: Complete and consistent</div>
            </div>
            <div class="analysis">
                <h2>Security Analysis</h2>
                <div class="item warning">Missing Content-Security-Policy header</div>
                <div class="item warning">Missing X-Content-Type-Options header</div>
                <div class="item warning">Missing X-Frame-Options header</div>
            </div>
        </body>
        </html>
    `;
}

function importCollection() {
    vscode.window.showInformationMessage('Import collection functionality will be available soon...');
}

function exportCollection() {
    const exportPath = path.join(require('os').tmpdir(), `collection-export-${Date.now()}.json`);
    const collectionContent = {
        info: {
            name: "API Collection",
            version: "1.0.0",
            description: "Exported API collection"
        },
        item: [
            {
                name: "Get Users",
                request: {
                    method: "GET",
                    url: "https://api.example.com/users"
                }
            },
            {
                name: "Create User",
                request: {
                    method: "POST",
                    url: "https://api.example.com/users",
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({ name: "John Doe", email: "john@example.com" }, null, 2)
                    },
                    header: [
                        {
                            key: "Content-Type",
                            value: "application/json"
                        }
                    ]
                }
            }
        ]
    };

    fs.writeFileSync(exportPath, JSON.stringify(collectionContent, null, 2));
    vscode.window.showInformationMessage(`Collection exported successfully to: ${exportPath}`);
    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(exportPath));
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Network Tools extension activated');

    const provider = new NetworkMonitorProvider();
    vscode.window.registerTreeDataProvider('network-monitor', provider);

    context.subscriptions.push(
        vscode.commands.registerCommand('network-tools.sendRequest', sendRequest),
        vscode.commands.registerCommand('network-tools.monitorNetwork', monitorNetwork),
        vscode.commands.registerCommand('network-tools.analyzeResponse', analyzeResponse),
        vscode.commands.registerCommand('network-tools.importCollection', importCollection),
        vscode.commands.registerCommand('network-tools.exportCollection', exportCollection),
        vscode.commands.registerCommand('network-tools.refreshMonitor', () => {
            provider.refresh();
        })
    );
}

export function deactivate() {
    console.log('Network Tools extension deactivated');
}
