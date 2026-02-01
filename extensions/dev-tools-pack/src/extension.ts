import * as vscode from 'vscode';

interface ToolExtension {
  name: string;
  displayName: string;
  description: string;
  commands: Array<{
    command: string;
    title: string;
  }>;
  keybindings: Array<{
    command: string;
    key: string;
  }>;
}

class DeveloperToolsPack {
  private toolExtensions: ToolExtension[] = [
    {
      name: "ai-assistant",
      displayName: "AI Assistant",
      description: "AI-powered coding assistant with code generation, explanation, refactoring, and performance optimization capabilities",
      commands: [
        { command: "ai-assistant.generateCode", title: "Generate Code" },
        { command: "ai-assistant.explainCode", title: "Explain Code" },
        { command: "ai-assistant.refactorCode", title: "Refactor Code" },
        { command: "ai-assistant.generateComments", title: "Generate Comments" },
        { command: "ai-assistant.suggestRefactor", title: "Suggest Refactoring" },
        { command: "ai-assistant.optimizePerformance", title: "Optimize Performance" }
      ],
      keybindings: [
        { command: "ai-assistant.generateCode", key: "Ctrl+Shift+G" },
        { command: "ai-assistant.explainCode", key: "Ctrl+Shift+E" },
        { command: "ai-assistant.refactorCode", key: "Ctrl+Shift+R" },
        { command: "ai-assistant.generateComments", key: "Ctrl+Shift+C" },
        { command: "ai-assistant.suggestRefactor", key: "Ctrl+Shift+F" },
        { command: "ai-assistant.optimizePerformance", key: "Ctrl+Shift+P" }
      ]
    },
    {
      name: "performance-tools",
      displayName: "Performance Tools",
      description: "Performance analysis and optimization tools for code profiling, resource monitoring, and performance reporting",
      commands: [
        { command: "performance-tools.analyzePerformance", title: "Analyze Performance" },
        { command: "performance-tools.optimizeCode", title: "Optimize Code" },
        { command: "performance-tools.monitorResources", title: "Monitor Resources" },
        { command: "performance-tools.generateReport", title: "Generate Report" }
      ],
      keybindings: [
        { command: "performance-tools.analyzePerformance", key: "Ctrl+Shift+P" },
        { command: "performance-tools.optimizeCode", key: "Ctrl+Shift+O" }
      ]
    },
    {
      name: "database-tools",
      displayName: "Database Tools",
      description: "Database management tools for connecting to databases, running queries, optimizing performance, and importing/exporting data",
      commands: [
        { command: "database-tools.connectDatabase", title: "Connect to Database" },
        { command: "database-tools.runQuery", title: "Run Query" },
        { command: "database-tools.optimizeQuery", title: "Optimize Query" },
        { command: "database-tools.exportData", title: "Export Data" },
        { command: "database-tools.importData", title: "Import Data" }
      ],
      keybindings: [
        { command: "database-tools.runQuery", key: "Ctrl+Shift+Q" },
        { command: "database-tools.optimizeQuery", key: "Ctrl+Shift+O" }
      ]
    },
    {
      name: "network-tools",
      displayName: "Network Tools",
      description: "Network analysis tools for sending HTTP requests, monitoring network traffic, analyzing responses, and managing collections",
      commands: [
        { command: "network-tools.sendRequest", title: "Send HTTP Request" },
        { command: "network-tools.monitorNetwork", title: "Monitor Network" },
        { command: "network-tools.analyzeResponse", title: "Analyze Response" },
        { command: "network-tools.importCollection", title: "Import Collection" },
        { command: "network-tools.exportCollection", title: "Export Collection" }
      ],
      keybindings: [
        { command: "network-tools.sendRequest", key: "Ctrl+Shift+R" },
        { command: "network-tools.analyzeResponse", key: "Ctrl+Shift+A" }
      ]
    },
    {
      name: "security-tools",
      displayName: "Security Tools",
      description: "Security scanning tools for code security analysis, dependency vulnerability detection, compliance checking, and dynamic security testing",
      commands: [
        { command: "security-tools.codeSecurityScan", title: "Code Security Scan" },
        { command: "security-tools.dependencyScan", title: "Dependency Vulnerability Scan" },
        { command: "security-tools.complianceCheck", title: "Compliance Check" },
        { command: "security-tools.staticCodeAnalysis", title: "Static Code Analysis" },
        { command: "security-tools.dynamicSecurityTest", title: "Dynamic Security Test" }
      ],
      keybindings: []
    },
    {
      name: "code-generation-tools",
      displayName: "Code Generation Tools",
      description: "AI-driven code generation and template management tools for accelerated development workflows",
      commands: [
        { command: "code-generation.generateCode", title: "Generate Code from Prompt" },
        { command: "code-generation.generateFromTemplate", title: "Generate from Template" },
        { command: "code-generation.saveTemplate", title: "Save as Template" },
        { command: "code-generation.manageTemplates", title: "Manage Templates" },
        { command: "code-generation.generateDocumentation", title: "Generate Documentation" }
      ],
      keybindings: [
        { command: "code-generation.generateCode", key: "Ctrl+Shift+G" },
        { command: "code-generation.generateFromTemplate", key: "Ctrl+Shift+T" },
        { command: "code-generation.generateDocumentation", key: "Ctrl+Shift+D" }
      ]
    },
    {
      name: "devops-tools",
      displayName: "DevOps Tools",
      description: "CI/CD integration and deployment management tools for streamlined development workflows",
      commands: [
        { command: "devops-tools.runPipeline", title: "Run Pipeline" },
        { command: "devops-tools.viewPipelineStatus", title: "View Pipeline Status" },
        { command: "devops-tools.deployApplication", title: "Deploy Application" },
        { command: "devops-tools.rollbackDeployment", title: "Rollback Deployment" },
        { command: "devops-tools.manageEnvironments", title: "Manage Environments" },
        { command: "devops-tools.monitorDeployments", title: "Monitor Deployments" }
      ],
      keybindings: [
        { command: "devops-tools.runPipeline", key: "Ctrl+Shift+R" },
        { command: "devops-tools.viewPipelineStatus", key: "Ctrl+Shift+S" },
        { command: "devops-tools.deployApplication", key: "Ctrl+Shift+D" }
      ]
    }
  ];

  async showOverview() {
    const panel = vscode.window.createWebviewPanel(
      'developerToolsPackOverview',
      'Developer Tools Pack Overview',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    panel.webview.html = this.getOverviewHtml();

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'executeCommand':
            vscode.commands.executeCommand(message.commandId);
            break;
        }
      },
      undefined
    );
  }

  private getOverviewHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Developer Tools Pack Overview</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #444;
            margin-bottom: 20px;
            font-size: 22px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
          }
          .tool-card {
            background: #f9f9f9;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
          }
          .tool-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          .tool-name {
            flex: 1;
          }
          .tool-name h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
          }
          .tool-name .description {
            margin: 8px 0 0;
            font-size: 14px;
            color: #666;
            line-height: 1.4;
          }
          .tool-commands {
            margin-top: 15px;
          }
          .tool-commands h4 {
            margin: 0 0 10px;
            font-size: 14px;
            color: #555;
            font-weight: 500;
          }
          .command-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .command-item {
            margin: 8px 0;
            padding: 8px 12px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .command-title {
            flex: 1;
            font-size: 13px;
          }
          .command-keybinding {
            font-size: 12px;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 3px;
            color: #666;
          }
          .execute-button {
            background: #667eea;
            color: white;
            border: none;
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 10px;
          }
          .execute-button:hover {
            background: #5a6fd8;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
          }
          .badge {
            background: #764ba2;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Developer Tools Pack</h1>
            <p>A comprehensive collection of development tools for Visual Studio Code</p>
          </div>

          <div class="content">
            <div class="section">
              <h2>📦 Included Tools</h2>
              ${this.toolExtensions.map(tool => `
                <div class="tool-card">
                  <div class="tool-header">
                    <div class="tool-name">
                      <h3>${tool.displayName}</h3>
                      <div class="description">${tool.description}</div>
                    </div>
                    <span class="badge">${tool.name}</span>
                  </div>

                  <div class="tool-commands">
                    <h4>Commands</h4>
                    <ul class="command-list">
                      ${tool.commands.map(cmd => {
                        const keybinding = tool.keybindings.find(kb => kb.command === cmd.command);
                        return `
                          <li class="command-item">
                            <span class="command-title">${cmd.title}</span>
                            ${keybinding ? `<span class="command-keybinding">${keybinding.key}</span>` : ''}
                            <button class="execute-button" onclick="executeCommand('${cmd.command}')">Run</button>
                          </li>
                        `;
                      }).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h2>💡 Key Features</h2>
              <ul>
                <li>• AI-powered code generation and assistance</li>
                <li>• Performance analysis and optimization</li>
                <li>• Database management and query optimization</li>
                <li>• Network request analysis and API testing</li>
                <li>• Security scanning and vulnerability detection</li>
                <li>• Template-based code generation</li>
                <li>• CI/CD integration and deployment management</li>
                <li>• Multi-platform support (Windows, macOS, Linux)</li>
              </ul>
            </div>

            <div class="section">
              <h2>⌨️ Keyboard Shortcuts</h2>
              <p>Quick access to frequently used commands:</p>
              <ul>
                <li><strong>Ctrl+Shift+K</strong> - Show this overview</li>
                <li><strong>Ctrl+Shift+G</strong> - Generate code (AI Assistant / Code Generation)</li>
                <li><strong>Ctrl+Shift+E</strong> - Explain code (AI Assistant)</li>
                <li><strong>Ctrl+Shift+R</strong> - Run pipeline / Send request (DevOps / Network)</li>
                <li><strong>Ctrl+Shift+Q</strong> - Run database query</li>
                <li><strong>Ctrl+Shift+P</strong> - Analyze performance</li>
                <li><strong>Ctrl+Shift+D</strong> - Deploy application / Generate documentation</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Developer Tools Pack v1.0.0 | A comprehensive suite for modern development workflows</p>
          </div>
        </div>

        <script>
          function executeCommand(commandId) {
            vscode.postMessage({
              command: 'executeCommand',
              commandId: commandId
            });
          }
        </script>
      </body>
      </html>
    `;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Developer Tools Pack extension activated');

  const devToolsPack = new DeveloperToolsPack();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('dev-tools-pack.showOverview', () => devToolsPack.showOverview())
  );
}

export function deactivate() {
  console.log('Developer Tools Pack extension deactivated');
}
