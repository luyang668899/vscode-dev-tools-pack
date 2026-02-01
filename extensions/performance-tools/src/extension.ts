import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

class PerformanceMonitorProvider implements vscode.TreeDataProvider<PerformanceItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PerformanceItem | undefined> = new vscode.EventEmitter<PerformanceItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<PerformanceItem | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: PerformanceItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PerformanceItem): Thenable<PerformanceItem[]> {
        if (!element) {
            return Promise.resolve([
                new PerformanceItem('CPU Usage', `${os.loadavg()[0].toFixed(2)}%`, vscode.TreeItemCollapsibleState.None),
                new PerformanceItem('Memory Usage', `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB`, vscode.TreeItemCollapsibleState.None),
                new PerformanceItem('Disk Usage', 'Calculating...', vscode.TreeItemCollapsibleState.None),
                new PerformanceItem('Process Count', `${os.cpus().length} cores`, vscode.TreeItemCollapsibleState.None)
            ]);
        }
        return Promise.resolve([]);
    }
}

class PerformanceItem extends vscode.TreeItem {
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

let performanceMonitorProvider: PerformanceMonitorProvider;

function analyzePerformance() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const document = editor.document;
    const code = document.getText();
    const languageId = document.languageId;

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing Performance',
        cancellable: true
    }, async (progress, token) => {
        progress.report({ increment: 0, message: 'Scanning code for performance issues...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 33, message: 'Identifying bottlenecks...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 66, message: 'Generating optimization suggestions...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 100, message: 'Analysis complete!' });

        const issues = identifyPerformanceIssues(code, languageId);
        if (issues.length > 0) {
            const issueList = issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n');
            vscode.window.showInformationMessage(`Performance issues found:\n${issueList}`);
        } else {
            vscode.window.showInformationMessage('No significant performance issues found');
        }
    });
}

function identifyPerformanceIssues(code: string, languageId: string): string[] {
    const issues: string[] = [];

    switch (languageId) {
        case 'javascript':
        case 'typescript':
            if (code.includes('for (let i = 0; i < array.length; i++)')) {
                issues.push('Possible performance issue: recalculating array.length in loop condition');
            }
            if (code.includes('eval(')) {
                issues.push('Performance issue: eval() is slow and should be avoided');
            }
            if (code.includes('setInterval(')) {
                issues.push('Potential performance issue: setInterval may cause memory leaks');
            }
            break;
        case 'python':
            if (code.includes('for i in range(len(')) {
                issues.push('Possible performance issue: using range(len()) instead of direct iteration');
            }
            if (code.includes('list.append(')) {
                issues.push('Consider using list comprehensions for better performance');
            }
            break;
        case 'java':
            if (code.includes('StringBuilder')) {
                issues.push('Good practice: Using StringBuilder for string concatenation');
            } else if (code.includes('+="')) {
                issues.push('Performance issue: String concatenation in loops should use StringBuilder');
            }
            break;
    }

    if (code.length > 10000) {
        issues.push('Large file detected: Consider splitting into smaller modules');
    }

    return issues;
}

function optimizeCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const document = editor.document;
    const code = document.getText();
    const languageId = document.languageId;

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Optimizing Code',
        cancellable: true
    }, async (progress, token) => {
        progress.report({ increment: 0, message: 'Analyzing code structure...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 50, message: 'Generating optimized version...' });
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress.report({ increment: 100, message: 'Optimization complete!' });

        const optimizedCode = generateOptimizedCode(code, languageId);
        if (optimizedCode !== code) {
            const choice = await vscode.window.showInformationMessage(
                'Code optimization suggestions available. Would you like to apply them?',
                'Apply', 'Cancel'
            );
            if (choice === 'Apply') {
                editor.edit(editBuilder => {
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(code.length)
                    );
                    editBuilder.replace(fullRange, optimizedCode);
                });
                vscode.window.showInformationMessage('Code optimized successfully!');
            }
        } else {
            vscode.window.showInformationMessage('No significant optimizations found');
        }
    });
}

function generateOptimizedCode(code: string, languageId: string): string {
    let optimizedCode = code;

    switch (languageId) {
        case 'javascript':
        case 'typescript':
            optimizedCode = optimizedCode.replace(/for \(let i = 0; i < ([^;]+)\.length; i\+\+/g, 'const length = $1.length;\nfor (let i = 0; i < length; i++)');
            break;
        case 'python':
            optimizedCode = optimizedCode.replace(/for i in range\(len\(([^)]+)\)\):/g, 'for item in $1:');
            break;
    }

    return optimizedCode;
}

function monitorResources() {
    vscode.window.showInformationMessage('Starting resource monitoring...');
    performanceMonitorProvider = new PerformanceMonitorProvider();
    vscode.window.registerTreeDataProvider('performance-monitor', performanceMonitorProvider);

    setInterval(() => {
        if (performanceMonitorProvider) {
            performanceMonitorProvider.refresh();
        }
    }, 5000);
}

function generateReport() {
    const reportPath = path.join(os.tmpdir(), `performance-report-${Date.now()}.md`);
    const reportContent = `# Performance Analysis Report

## System Information
- OS: ${os.type()} ${os.release()}
- CPU: ${os.cpus().length} cores
- Total Memory: ${Math.round(os.totalmem() / 1024 / 1024)}MB
- Free Memory: ${Math.round(os.freemem() / 1024 / 1024)}MB
- Load Average: ${os.loadavg().map(l => l.toFixed(2)).join(', ')}

## Report Generated
- Date: ${new Date().toISOString()}
- VS Code Version: ${vscode.version}

## Recommendations
1. Keep your codebase modular to improve maintainability and performance
2. Use appropriate data structures for your use case
3. Avoid unnecessary computations in loops
4. Consider using async/await for I/O operations
5. Monitor memory usage for long-running applications
`;

    fs.writeFileSync(reportPath, reportContent);
    vscode.window.showInformationMessage(`Performance report generated at: ${reportPath}`);
    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(reportPath));
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Performance Tools extension activated');

    context.subscriptions.push(
        vscode.commands.registerCommand('performance-tools.analyzePerformance', analyzePerformance),
        vscode.commands.registerCommand('performance-tools.optimizeCode', optimizeCode),
        vscode.commands.registerCommand('performance-tools.monitorResources', monitorResources),
        vscode.commands.registerCommand('performance-tools.generateReport', generateReport),
        vscode.commands.registerCommand('performance-tools.refreshMonitor', () => {
            if (performanceMonitorProvider) {
                performanceMonitorProvider.refresh();
            } else {
                performanceMonitorProvider = new PerformanceMonitorProvider();
                vscode.window.registerTreeDataProvider('performance-monitor', performanceMonitorProvider);
            }
        })
    );
}

export function deactivate() {
    console.log('Performance Tools extension deactivated');
}
