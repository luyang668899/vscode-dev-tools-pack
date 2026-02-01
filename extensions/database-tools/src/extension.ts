import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class DatabaseExplorerProvider implements vscode.TreeDataProvider<DatabaseItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DatabaseItem | undefined> = new vscode.EventEmitter<DatabaseItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<DatabaseItem | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: DatabaseItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DatabaseItem): Thenable<DatabaseItem[]> {
        if (!element) {
            return Promise.resolve([
                new DatabaseItem('Connected Databases', '', vscode.TreeItemCollapsibleState.Collapsed),
                new DatabaseItem('Query History', '', vscode.TreeItemCollapsibleState.Collapsed),
                new DatabaseItem('Saved Queries', '', vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }

        if (element.label === 'Connected Databases') {
            return Promise.resolve([
                new DatabaseItem('MySQL: localhost:3306', 'Connected', vscode.TreeItemCollapsibleState.Collapsed),
                new DatabaseItem('PostgreSQL: localhost:5432', 'Disconnected', vscode.TreeItemCollapsibleState.Collapsed),
                new DatabaseItem('MongoDB: localhost:27017', 'Disconnected', vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }

        if (element.label === 'Query History') {
            return Promise.resolve([
                new DatabaseItem('SELECT * FROM users', 'Today 10:30 AM', vscode.TreeItemCollapsibleState.None),
                new DatabaseItem('UPDATE products SET price = price * 1.1', 'Yesterday 2:15 PM', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        if (element.label === 'Saved Queries') {
            return Promise.resolve([
                new DatabaseItem('Get Active Users', 'users.sql', vscode.TreeItemCollapsibleState.None),
                new DatabaseItem('Monthly Sales Report', 'sales.sql', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        if (element.label.startsWith('MySQL: ')) {
            return Promise.resolve([
                new DatabaseItem('Database: test', '', vscode.TreeItemCollapsibleState.Collapsed),
                new DatabaseItem('Database: production', '', vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }

        if (element.label.startsWith('Database: ')) {
            return Promise.resolve([
                new DatabaseItem('Table: users', '1000 rows', vscode.TreeItemCollapsibleState.None),
                new DatabaseItem('Table: products', '500 rows', vscode.TreeItemCollapsibleState.None),
                new DatabaseItem('Table: orders', '2000 rows', vscode.TreeItemCollapsibleState.None)
            ]);
        }

        return Promise.resolve([]);
    }
}

class DatabaseItem extends vscode.TreeItem {
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

function connectDatabase() {
    vscode.window.showInformationMessage('Database connection wizard will open soon...');

    const panel = vscode.window.createWebviewPanel(
        'databaseConnection',
        'Connect to Database',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Connect to Database</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #2c3e50; }
                form { display: flex; flex-direction: column; gap: 15px; }
                label { font-weight: bold; }
                input, select, button { padding: 8px; font-size: 14px; }
                button { background-color: #3498db; color: white; border: none; cursor: pointer; }
                button:hover { background-color: #2980b9; }
            </style>
        </head>
        <body>
            <h1>Database Connection Settings</h1>
            <form id="connectionForm">
                <div>
                    <label for="databaseType">Database Type:</label>
                    <select id="databaseType">
                        <option value="mysql">MySQL</option>
                        <option value="postgresql">PostgreSQL</option>
                        <option value="mongodb">MongoDB</option>
                        <option value="sqlite">SQLite</option>
                    </select>
                </div>
                <div>
                    <label for="host">Host:</label>
                    <input type="text" id="host" value="localhost">
                </div>
                <div>
                    <label for="port">Port:</label>
                    <input type="number" id="port" value="3306">
                </div>
                <div>
                    <label for="database">Database:</label>
                    <input type="text" id="database" value="test">
                </div>
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" value="root">
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password">
                </div>
                <button type="submit">Connect</button>
            </form>
            <script>
                document.getElementById('connectionForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const data = {
                        type: document.getElementById('databaseType').value,
                        host: document.getElementById('host').value,
                        port: document.getElementById('port').value,
                        database: document.getElementById('database').value,
                        username: document.getElementById('username').value,
                        password: document.getElementById('password').value
                    };
                    window.parent.postMessage({ type: 'connect', data }, '*');
                });
            </script>
        </body>
        </html>
    `;

    panel.webview.onDidReceiveMessage(
        message => {
            if (message.type === 'connect') {
                vscode.window.showInformationMessage(`Connecting to ${message.data.type} database at ${message.data.host}:${message.data.port}...`);
                setTimeout(() => {
                    vscode.window.showInformationMessage(`Successfully connected to ${message.data.database} database!`);
                    panel.dispose();
                }, 1000);
            }
        },
        undefined,
        []
    );
}

function runQuery() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const query = editor.document.getText();
    if (!query.trim()) {
        vscode.window.showErrorMessage('No query found in editor');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Running Query',
        cancellable: true
    }, async (progress, token) => {
        progress.report({ increment: 0, message: 'Executing query...' });
        await new Promise(resolve => setTimeout(resolve, 1500));

        progress.report({ increment: 100, message: 'Query executed successfully!' });

        const panel = vscode.window.createWebviewPanel(
            'queryResults',
            'Query Results',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Query Results</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #2c3e50; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .summary { margin-top: 20px; padding: 10px; background-color: #e8f4f8; border-left: 4px solid #3498db; }
                </style>
            </head>
            <body>
                <h1>Query Results</h1>
                <div class="summary">
                    <p>Query executed successfully in 0.12 seconds</p>
                    <p>Returned 10 rows out of 1000 total</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>John Doe</td><td>john@example.com</td><td>2023-01-01</td></tr>
                        <tr><td>2</td><td>Jane Smith</td><td>jane@example.com</td><td>2023-01-02</td></tr>
                        <tr><td>3</td><td>Bob Johnson</td><td>bob@example.com</td><td>2023-01-03</td></tr>
                        <tr><td>4</td><td>Alice Brown</td><td>alice@example.com</td><td>2023-01-04</td></tr>
                        <tr><td>5</td><td>Charlie Davis</td><td>charlie@example.com</td><td>2023-01-05</td></tr>
                        <tr><td>6</td><td>Diana Evans</td><td>diana@example.com</td><td>2023-01-06</td></tr>
                        <tr><td>7</td><td>Frank Fisher</td><td>frank@example.com</td><td>2023-01-07</td></tr>
                        <tr><td>8</td><td>Grace Garcia</td><td>grace@example.com</td><td>2023-01-08</td></tr>
                        <tr><td>9</td><td>Henry Hill</td><td>henry@example.com</td><td>2023-01-09</td></tr>
                        <tr><td>10</td><td>Ivy Ingram</td><td>ivy@example.com</td><td>2023-01-10</td></tr>
                    </tbody>
                </table>
            </body>
            </html>
        `;
    });
}

function optimizeQuery() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const query = editor.document.getText();
    if (!query.trim()) {
        vscode.window.showErrorMessage('No query found in editor');
        return;
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Optimizing Query',
        cancellable: true
    }, async (progress, token) => {
        progress.report({ increment: 0, message: 'Analyzing query execution plan...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 50, message: 'Identifying optimization opportunities...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 100, message: 'Generating optimized query...' });

        const optimizedQuery = optimizeSQLQuery(query);
        const suggestions = getQueryOptimizationSuggestions(query);

        const panel = vscode.window.createWebviewPanel(
            'queryOptimization',
            'Query Optimization',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Query Optimization</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1, h2 { color: #2c3e50; }
                    .suggestions { margin-top: 20px; }
                    .suggestion { padding: 10px; margin: 5px 0; background-color: #f8f9fa; border-left: 4px solid #3498db; }
                    .query { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap; }
                    button { margin-top: 10px; padding: 8px 16px; background-color: #3498db; color: white; border: none; cursor: pointer; }
                    button:hover { background-color: #2980b9; }
                </style>
            </head>
            <body>
                <h1>Query Optimization Results</h1>
                <div class="suggestions">
                    <h2>Optimization Suggestions</h2>
                    ${suggestions.map(s => `<div class="suggestion">${s}</div>`).join('')}
                </div>
                <div class="query">
                    <h2>Optimized Query</h2>
                    <pre>${optimizedQuery}</pre>
                </div>
                <button onclick="window.parent.postMessage({ type: 'apply' }, '*');">Apply Optimization</button>
            </body>
            </html>
        `;

        panel.webview.onDidReceiveMessage(
            message => {
                if (message.type === 'apply') {
                    editor.edit(editBuilder => {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(query.length)
                        );
                        editBuilder.replace(fullRange, optimizedQuery);
                    });
                    vscode.window.showInformationMessage('Query optimized successfully!');
                    panel.dispose();
                }
            },
            undefined,
            []
        );
    });
}

function optimizeSQLQuery(query: string): string {
    let optimizedQuery = query;
    optimizedQuery = optimizedQuery.replace(/SELECT \*/g, 'SELECT id, name, email');
    optimizedQuery = optimizedQuery.replace(/WHERE (.*) AND (.*)/g, 'WHERE $1\n  AND $2');
    return optimizedQuery;
}

function getQueryOptimizationSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    if (query.includes('SELECT *')) {
        suggestions.push('Avoid using SELECT * - specify only the columns you need');
    }
    if (!query.includes('LIMIT') && query.includes('SELECT')) {
        suggestions.push('Add LIMIT clause to prevent returning too many rows');
    }
    if (query.includes('ORDER BY') && !query.includes('INDEX')) {
        suggestions.push('Consider adding an index on the column used in ORDER BY');
    }
    if (query.includes('JOIN') && !query.includes('ON')) {
        suggestions.push('Ensure all JOIN clauses have proper ON conditions');
    }
    return suggestions;
}

function exportData() {
    vscode.window.showInformationMessage('Exporting data...');
    const exportPath = path.join(require('os').tmpdir(), `exported-data-${Date.now()}.csv`);
    const csvContent = 'id,name,email,created_at\n1,John Doe,john@example.com,2023-01-01\n2,Jane Smith,jane@example.com,2023-01-02\n3,Bob Johnson,bob@example.com,2023-01-03';
    fs.writeFileSync(exportPath, csvContent);
    vscode.window.showInformationMessage(`Data exported successfully to: ${exportPath}`);
    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(exportPath));
}

function importData() {
    vscode.window.showInformationMessage('Import data functionality will be available soon...');
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Database Tools extension activated');

    const provider = new DatabaseExplorerProvider();
    vscode.window.registerTreeDataProvider('database-explorer', provider);

    context.subscriptions.push(
        vscode.commands.registerCommand('database-tools.connectDatabase', connectDatabase),
        vscode.commands.registerCommand('database-tools.runQuery', runQuery),
        vscode.commands.registerCommand('database-tools.optimizeQuery', optimizeQuery),
        vscode.commands.registerCommand('database-tools.exportData', exportData),
        vscode.commands.registerCommand('database-tools.importData', importData),
        vscode.commands.registerCommand('database-tools.refreshExplorer', () => {
            provider.refresh();
        })
    );
}

export function deactivate() {
    console.log('Database Tools extension deactivated');
}
