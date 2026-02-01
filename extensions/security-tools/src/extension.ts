import * as vscode from 'vscode';

class SecurityResourceTreeDataProvider implements vscode.TreeDataProvider<SecurityResource> {
    private _onDidChangeTreeData = new vscode.EventEmitter<SecurityResource | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SecurityResource): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SecurityResource): Promise<SecurityResource[]> {
        if (!element) {
            return Promise.resolve(this.getRootResources());
        }
        return Promise.resolve(this.getChildResources(element));
    }

    private getRootResources(): SecurityResource[] {
        return [
            new SecurityResource('Code Security', 'code-security', vscode.TreeItemCollapsibleState.Collapsed),
            new SecurityResource('Dependency Scan', 'dependency-scan', vscode.TreeItemCollapsibleState.Collapsed),
            new SecurityResource('Compliance Check', 'compliance-check', vscode.TreeItemCollapsibleState.Collapsed),
            new SecurityResource('Security Reports', 'security-reports', vscode.TreeItemCollapsibleState.Collapsed)
        ];
    }

    private getChildResources(parent: SecurityResource): SecurityResource[] {
        switch (parent.id) {
            case 'code-security':
                return [
                    new SecurityResource('SQL Injection', 'code-sql-injection', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('XSS Vulnerabilities', 'code-xss', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('Authentication Issues', 'code-auth', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('Authorization Issues', 'code-authz', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'dependency-scan':
                return [
                    new SecurityResource('NPM Dependencies', 'dep-npm', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('PyPI Dependencies', 'dep-pypi', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('Maven Dependencies', 'dep-maven', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('NuGet Dependencies', 'dep-nuget', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'compliance-check':
                return [
                    new SecurityResource('OWASP Top 10', 'compliance-owasp', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('CWE/SANS Top 25', 'compliance-cwe', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('PCI DSS', 'compliance-pci', vscode.TreeItemCollapsibleState.Collapsed),
                    new SecurityResource('GDPR Compliance', 'compliance-gdpr', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'security-reports':
                return [
                    new SecurityResource('Latest Scan Report', 'report-latest', vscode.TreeItemCollapsibleState.None),
                    new SecurityResource('Weekly Summary', 'report-weekly', vscode.TreeItemCollapsibleState.None),
                    new SecurityResource('Compliance Report', 'report-compliance', vscode.TreeItemCollapsibleState.None)
                ];
            case 'code-sql-injection':
                return [
                    new SecurityResource('High: SQL Injection in login.php', 'sql-injection-1', vscode.TreeItemCollapsibleState.None),
                    new SecurityResource('Medium: SQL Injection in search.php', 'sql-injection-2', vscode.TreeItemCollapsibleState.None)
                ];
            case 'code-xss':
                return [
                    new SecurityResource('High: Stored XSS in comments', 'xss-1', vscode.TreeItemCollapsibleState.None),
                    new SecurityResource('Medium: Reflected XSS in search', 'xss-2', vscode.TreeItemCollapsibleState.None)
                ];
            case 'dep-npm':
                return [
                    new SecurityResource('High: lodash@4.17.11', 'npm-vuln-1', vscode.TreeItemCollapsibleState.None),
                    new SecurityResource('Medium: express@4.17.1', 'npm-vuln-2', vscode.TreeItemCollapsibleState.None),
                    new SecurityResource('Low: body-parser@1.19.0', 'npm-vuln-3', vscode.TreeItemCollapsibleState.None)
                ];
            default:
                return [];
        }
    }
}

class SecurityResource extends vscode.TreeItem {
    tooltip?: string;
    description?: string;

    constructor(
        public readonly label: string,
        public readonly id: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
        this.description = this.id;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Security Tools extension activated');

    // Register tree data provider
    const treeDataProvider = new SecurityResourceTreeDataProvider();
    vscode.window.registerTreeDataProvider('security-tools-explorer', treeDataProvider);

    // Register commands
    const codeSecurityScanDisposable = vscode.commands.registerCommand('security-tools.codeSecurityScan', async () => {
        await codeSecurityScan();
    });

    const dependencyScanDisposable = vscode.commands.registerCommand('security-tools.dependencyScan', async () => {
        await dependencyScan();
    });

    const complianceCheckDisposable = vscode.commands.registerCommand('security-tools.complianceCheck', async () => {
        await complianceCheck();
    });

    const refreshExplorerDisposable = vscode.commands.registerCommand('security-tools.refreshExplorer', () => {
        treeDataProvider.refresh();
        vscode.window.showInformationMessage('Security explorer refreshed');
    });

    const staticCodeAnalysisDisposable = vscode.commands.registerCommand('security-tools.staticCodeAnalysis', async () => {
        await staticCodeAnalysis();
    });

    const dynamicSecurityTestDisposable = vscode.commands.registerCommand('security-tools.dynamicSecurityTest', async () => {
        await dynamicSecurityTest();
    });

    context.subscriptions.push(
        codeSecurityScanDisposable,
        dependencyScanDisposable,
        complianceCheckDisposable,
        staticCodeAnalysisDisposable,
        dynamicSecurityTestDisposable,
        refreshExplorerDisposable
    );
}

export function deactivate() {
    console.log('Security Tools extension deactivated');
}

async function codeSecurityScan() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const scanType = await vscode.window.showQuickPick([
        'Full Scan',
        'Quick Scan',
        'Custom Scan'
    ], {
        placeHolder: 'Select scan type'
    });

    if (!scanType) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running ${scanType}...`,
            cancellable: false
        }, async (progress: vscode.Progress<{ message?: string }>) => {
            progress.report({ message: 'Initializing scan...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Scanning for SQL injection...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Scanning for XSS vulnerabilities...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Scanning for authentication issues...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Generating report...' });
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulate scan results
            const scanResults = generateScanResults();
            showScanResults(scanResults);

            vscode.window.showInformationMessage(`${scanType} completed successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Code security scan failed: ${error}`);
    }
}

async function dependencyScan() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const dependencyType = await vscode.window.showQuickPick([
        'NPM (package.json)',
        'PyPI (requirements.txt)',
        'Maven (pom.xml)',
        'All Dependencies'
    ], {
        placeHolder: 'Select dependency type'
    });

    if (!dependencyType) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Scanning ${dependencyType} dependencies...`,
            cancellable: false
        }, async (progress: vscode.Progress<{ message?: string }>) => {
            progress.report({ message: 'Analyzing dependency files...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Checking for known vulnerabilities...' });
            await new Promise(resolve => setTimeout(resolve, 3000));

            progress.report({ message: 'Assessing vulnerability severity...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Generating dependency report...' });
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulate dependency scan results
            const dependencyResults = generateDependencyResults();
            showDependencyResults(dependencyResults);

            vscode.window.showInformationMessage(`Dependency scan completed successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Dependency scan failed: ${error}`);
    }
}

async function complianceCheck() {
    const complianceStandard = await vscode.window.showQuickPick([
        'OWASP Top 10',
        'CWE/SANS Top 25',
        'PCI DSS',
        'GDPR Compliance',
        'All Standards'
    ], {
        placeHolder: 'Select compliance standard'
    });

    if (!complianceStandard) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Checking ${complianceStandard} compliance...`,
            cancellable: false
        }, async (progress: vscode.Progress<{ message?: string }>) => {
            progress.report({ message: 'Initializing compliance check...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Checking security controls...' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            progress.report({ message: 'Verifying data protection measures...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Generating compliance report...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate compliance check results
            const complianceResults = generateComplianceResults(complianceStandard);
            showComplianceResults(complianceResults);

            vscode.window.showInformationMessage(`Compliance check completed successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Compliance check failed: ${error}`);
    }
}

function generateScanResults() {
    return {
        summary: {
            high: 3,
            medium: 5,
            low: 8,
            total: 16
        },
        vulnerabilities: [
            {
                id: 'VULN-001',
                type: 'SQL Injection',
                severity: 'High',
                file: 'src/login.php',
                line: 45,
                description: 'Unsanitized user input in SQL query',
                recommendation: 'Use prepared statements'
            },
            {
                id: 'VULN-002',
                type: 'Stored XSS',
                severity: 'High',
                file: 'src/comments.php',
                line: 123,
                description: 'User input not sanitized before storage',
                recommendation: 'Implement output encoding'
            },
            {
                id: 'VULN-003',
                type: 'Weak Authentication',
                severity: 'Medium',
                file: 'src/auth.js',
                line: 78,
                description: 'Password not hashed properly',
                recommendation: 'Use bcrypt for password hashing'
            }
        ]
    };
}

function generateDependencyResults() {
    return {
        summary: {
            high: 2,
            medium: 4,
            low: 6,
            total: 12
        },
        vulnerabilities: [
            {
                id: 'DEP-001',
                package: 'lodash',
                version: '4.17.11',
                severity: 'High',
                cve: 'CVE-2019-10744',
                description: 'Prototype pollution vulnerability',
                fixVersion: '4.17.15'
            },
            {
                id: 'DEP-002',
                package: 'express',
                version: '4.17.1',
                severity: 'Medium',
                cve: 'CVE-2020-15095',
                description: 'Open redirect vulnerability',
                fixVersion: '4.17.3'
            },
            {
                id: 'DEP-003',
                package: 'jquery',
                version: '3.4.1',
                severity: 'Low',
                cve: 'CVE-2020-11022',
                description: 'Cross-site scripting vulnerability',
                fixVersion: '3.5.0'
            }
        ]
    };
}

function generateComplianceResults(standard: string) {
    return {
        standard: standard,
        score: Math.floor(Math.random() * 20) + 80,
        status: 'Passing',
        findings: [
            {
                id: 'COMP-001',
                category: 'Authentication',
                status: 'Compliant',
                description: 'Strong authentication mechanisms implemented'
            },
            {
                id: 'COMP-002',
                category: 'Data Protection',
                status: 'Compliant',
                description: 'Encryption used for sensitive data'
            },
            {
                id: 'COMP-003',
                category: 'Access Control',
                status: 'Needs Improvement',
                description: 'Role-based access control partially implemented'
            }
        ]
    };
}

function showScanResults(results: any) {
    const panel = vscode.window.createWebviewPanel(
        'securityScanResults',
        'Code Security Scan Results',
        vscode.ViewColumn.Beside,
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
            <title>Code Security Scan Results</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .summary-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                .summary-item {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 5px 0;
                }
                .summary-label {
                    font-size: 14px;
                    color: #6c757d;
                }
                .high {
                    color: #e74c3c;
                }
                .medium {
                    color: #f39c12;
                }
                .low {
                    color: #3498db;
                }
                .total {
                    color: #27ae60;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .severity-high {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .severity-medium {
                    color: #f39c12;
                    font-weight: bold;
                }
                .severity-low {
                    color: #3498db;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Code Security Scan Results</h1>

            <div class="summary-card">
                <h2>Summary</h2>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">High Severity</div>
                        <div class="summary-value high">${results.summary.high}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Medium Severity</div>
                        <div class="summary-value medium">${results.summary.medium}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Low Severity</div>
                        <div class="summary-value low">${results.summary.low}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Issues</div>
                        <div class="summary-value total">${results.summary.total}</div>
                    </div>
                </div>
            </div>

            <h2>Detailed Findings</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>File</th>
                    <th>Line</th>
                    <th>Description</th>
                    <th>Recommendation</th>
                </tr>
                ${results.vulnerabilities.map((vuln: any) => `
                    <tr>
                        <td>${vuln.id}</td>
                        <td>${vuln.type}</td>
                        <td class="severity-${vuln.severity.toLowerCase()}">${vuln.severity}</td>
                        <td>${vuln.file}</td>
                        <td>${vuln.line}</td>
                        <td>${vuln.description}</td>
                        <td>${vuln.recommendation}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;
}

function showDependencyResults(results: any) {
    const panel = vscode.window.createWebviewPanel(
        'dependencyScanResults',
        'Dependency Vulnerability Results',
        vscode.ViewColumn.Beside,
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
            <title>Dependency Vulnerability Results</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .summary-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                .summary-item {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 5px 0;
                }
                .summary-label {
                    font-size: 14px;
                    color: #6c757d;
                }
                .high {
                    color: #e74c3c;
                }
                .medium {
                    color: #f39c12;
                }
                .low {
                    color: #3498db;
                }
                .total {
                    color: #27ae60;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .severity-high {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .severity-medium {
                    color: #f39c12;
                    font-weight: bold;
                }
                .severity-low {
                    color: #3498db;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Dependency Vulnerability Results</h1>

            <div class="summary-card">
                <h2>Summary</h2>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">High Severity</div>
                        <div class="summary-value high">${results.summary.high}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Medium Severity</div>
                        <div class="summary-value medium">${results.summary.medium}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Low Severity</div>
                        <div class="summary-value low">${results.summary.low}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Issues</div>
                        <div class="summary-value total">${results.summary.total}</div>
                    </div>
                </div>
            </div>

            <h2>Vulnerable Dependencies</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Package</th>
                    <th>Version</th>
                    <th>Severity</th>
                    <th>CVE</th>
                    <th>Description</th>
                    <th>Fix Version</th>
                </tr>
                ${results.vulnerabilities.map((vuln: any) => `
                    <tr>
                        <td>${vuln.id}</td>
                        <td>${vuln.package}</td>
                        <td>${vuln.version}</td>
                        <td class="severity-${vuln.severity.toLowerCase()}">${vuln.severity}</td>
                        <td>${vuln.cve}</td>
                        <td>${vuln.description}</td>
                        <td>${vuln.fixVersion}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;
}

function showComplianceResults(results: any) {
    const panel = vscode.window.createWebviewPanel(
        'complianceResults',
        'Compliance Check Results',
        vscode.ViewColumn.Beside,
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
            <title>Compliance Check Results</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .summary-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .score-card {
                    text-align: center;
                    margin: 20px 0;
                }
                .score-value {
                    font-size: 48px;
                    font-weight: bold;
                    color: #27ae60;
                }
                .score-label {
                    font-size: 18px;
                    color: #6c757d;
                }
                .status-badge {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                    margin-top: 10px;
                }
                .status-passing {
                    background-color: #d4edda;
                    color: #155724;
                }
                .status-warning {
                    background-color: #fff3cd;
                    color: #856404;
                }
                .status-failing {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .status-compliant {
                    color: #27ae60;
                    font-weight: bold;
                }
                .status-needs-improvement {
                    color: #f39c12;
                    font-weight: bold;
                }
                .status-non-compliant {
                    color: #e74c3c;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Compliance Check Results</h1>

            <div class="summary-card">
                <h2>${results.standard}</h2>
                <div class="score-card">
                    <div class="score-value">${results.score}%</div>
                    <div class="score-label">Compliance Score</div>
                    <div class="status-badge status-${results.status.toLowerCase()}">${results.status}</div>
                </div>
            </div>

            <h2>Detailed Findings</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Description</th>
                </tr>
                ${results.findings.map((finding: any) => `
                    <tr>
                        <td>${finding.id}</td>
                        <td>${finding.category}</td>
                        <td class="status-${finding.status.toLowerCase().replace(' ', '-')}">${finding.status}</td>
                        <td>${finding.description}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;
}

async function staticCodeAnalysis() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const analysisType = await vscode.window.showQuickPick([
        'Full Analysis',
        'Security Focused',
        'Performance Focused',
        'Code Quality'
    ], {
        placeHolder: 'Select analysis type'
    });

    if (!analysisType) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running ${analysisType}...`,
            cancellable: false
        }, async (progress: vscode.Progress<{ message?: string }>) => {
            progress.report({ message: 'Initializing static code analysis...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Scanning code structure...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Analyzing code patterns...' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            progress.report({ message: 'Detecting potential issues...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Generating analysis report...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate static code analysis results
            const analysisResults = generateStaticAnalysisResults(analysisType);
            showStaticAnalysisResults(analysisResults);

            vscode.window.showInformationMessage(`${analysisType} completed successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Static code analysis failed: ${error}`);
    }
}

async function dynamicSecurityTest() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const testType = await vscode.window.showQuickPick([
        'API Security Test',
        'Web Application Test',
        'Network Security Test',
        'Authentication Test'
    ], {
        placeHolder: 'Select test type'
    });

    if (!testType) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running ${testType}...`,
            cancellable: false
        }, async (progress: vscode.Progress<{ message?: string }>) => {
            progress.report({ message: 'Initializing dynamic security test...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Setting up test environment...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Executing security tests...' });
            await new Promise(resolve => setTimeout(resolve, 3000));

            progress.report({ message: 'Analyzing test results...' });
            await new Promise(resolve => setTimeout(resolve, 1500));

            progress.report({ message: 'Generating security report...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate dynamic security test results
            const testResults = generateDynamicTestResults(testType);
            showDynamicTestResults(testResults);

            vscode.window.showInformationMessage(`${testType} completed successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Dynamic security test failed: ${error}`);
    }
}

function generateStaticAnalysisResults(analysisType: string) {
    return {
        type: analysisType,
        summary: {
            errors: Math.floor(Math.random() * 5),
            warnings: Math.floor(Math.random() * 10) + 5,
            suggestions: Math.floor(Math.random() * 15) + 10,
            total: 30
        },
        findings: [
            {
                id: 'SA-001',
                type: 'Error',
                category: 'Security',
                file: 'src/auth.js',
                line: 45,
                description: 'Hardcoded API key detected',
                recommendation: 'Move API key to environment variable'
            },
            {
                id: 'SA-002',
                type: 'Warning',
                category: 'Performance',
                file: 'src/data.js',
                line: 123,
                description: 'Inefficient loop detected',
                recommendation: 'Consider using map or filter instead'
            },
            {
                id: 'SA-003',
                type: 'Suggestion',
                category: 'Code Quality',
                file: 'src/utils.js',
                line: 78,
                description: 'Unused variable detected',
                recommendation: 'Remove unused variable'
            }
        ]
    };
}

function generateDynamicTestResults(testType: string) {
    return {
        type: testType,
        summary: {
            high: Math.floor(Math.random() * 3),
            medium: Math.floor(Math.random() * 5) + 2,
            low: Math.floor(Math.random() * 8) + 5,
            total: 15
        },
        vulnerabilities: [
            {
                id: 'DT-001',
                type: 'SQL Injection',
                severity: 'High',
                endpoint: '/api/login',
                method: 'POST',
                description: 'Unsanitized user input in SQL query',
                recommendation: 'Use prepared statements'
            },
            {
                id: 'DT-002',
                type: 'Cross-Site Scripting (XSS)',
                severity: 'Medium',
                endpoint: '/api/comments',
                method: 'POST',
                description: 'User input not properly sanitized',
                recommendation: 'Implement input validation and output encoding'
            },
            {
                id: 'DT-003',
                type: 'Information Disclosure',
                severity: 'Low',
                endpoint: '/api/version',
                method: 'GET',
                description: 'Sensitive version information exposed',
                recommendation: 'Remove or obfuscate version details'
            }
        ]
    };
}

function showStaticAnalysisResults(results: any) {
    const panel = vscode.window.createWebviewPanel(
        'staticAnalysisResults',
        'Static Code Analysis Results',
        vscode.ViewColumn.Beside,
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
            <title>Static Code Analysis Results</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .summary-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                .summary-item {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 5px 0;
                }
                .summary-label {
                    font-size: 14px;
                    color: #6c757d;
                }
                .errors {
                    color: #e74c3c;
                }
                .warnings {
                    color: #f39c12;
                }
                .suggestions {
                    color: #3498db;
                }
                .total {
                    color: #27ae60;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .type-error {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .type-warning {
                    color: #f39c12;
                    font-weight: bold;
                }
                .type-suggestion {
                    color: #3498db;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Static Code Analysis Results</h1>

            <div class="summary-card">
                <h2>${results.type}</h2>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">Errors</div>
                        <div class="summary-value errors">${results.summary.errors}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Warnings</div>
                        <div class="summary-value warnings">${results.summary.warnings}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Suggestions</div>
                        <div class="summary-value suggestions">${results.summary.suggestions}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Findings</div>
                        <div class="summary-value total">${results.summary.total}</div>
                    </div>
                </div>
            </div>

            <h2>Detailed Findings</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>File</th>
                    <th>Line</th>
                    <th>Description</th>
                    <th>Recommendation</th>
                </tr>
                ${results.findings.map((finding: any) => `
                    <tr>
                        <td>${finding.id}</td>
                        <td class="type-${finding.type.toLowerCase()}">${finding.type}</td>
                        <td>${finding.category}</td>
                        <td>${finding.file}</td>
                        <td>${finding.line}</td>
                        <td>${finding.description}</td>
                        <td>${finding.recommendation}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;
}

function showDynamicTestResults(results: any) {
    const panel = vscode.window.createWebviewPanel(
        'dynamicTestResults',
        'Dynamic Security Test Results',
        vscode.ViewColumn.Beside,
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
            <title>Dynamic Security Test Results</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .summary-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                .summary-item {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 5px 0;
                }
                .summary-label {
                    font-size: 14px;
                    color: #6c757d;
                }
                .high {
                    color: #e74c3c;
                }
                .medium {
                    color: #f39c12;
                }
                .low {
                    color: #3498db;
                }
                .total {
                    color: #27ae60;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .severity-high {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .severity-medium {
                    color: #f39c12;
                    font-weight: bold;
                }
                .severity-low {
                    color: #3498db;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Dynamic Security Test Results</h1>

            <div class="summary-card">
                <h2>${results.type}</h2>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">High Severity</div>
                        <div class="summary-value high">${results.summary.high}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Medium Severity</div>
                        <div class="summary-value medium">${results.summary.medium}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Low Severity</div>
                        <div class="summary-value low">${results.summary.low}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Issues</div>
                        <div class="summary-value total">${results.summary.total}</div>
                    </div>
                </div>
            </div>

            <h2>Detected Vulnerabilities</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Description</th>
                    <th>Recommendation</th>
                </tr>
                ${results.vulnerabilities.map((vuln: any) => `
                    <tr>
                        <td>${vuln.id}</td>
                        <td>${vuln.type}</td>
                        <td class="severity-${vuln.severity.toLowerCase()}">${vuln.severity}</td>
                        <td>${vuln.endpoint}</td>
                        <td>${vuln.method}</td>
                        <td>${vuln.description}</td>
                        <td>${vuln.recommendation}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `;
}

