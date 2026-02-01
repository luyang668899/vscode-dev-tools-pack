import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Assistant extension activated');

    // Register commands
    const generateCodeDisposable = vscode.commands.registerCommand('ai-assistant.generateCode', async () => {
        await generateCode();
    });

    const explainCodeDisposable = vscode.commands.registerCommand('ai-assistant.explainCode', async () => {
        await explainCode();
    });

    const refactorCodeDisposable = vscode.commands.registerCommand('ai-assistant.refactorCode', async () => {
        await refactorCode();
    });

    const generateCommentsDisposable = vscode.commands.registerCommand('ai-assistant.generateComments', async () => {
        await generateComments();
    });

    const suggestRefactorDisposable = vscode.commands.registerCommand('ai-assistant.suggestRefactor', async () => {
        await suggestRefactor();
    });

    const optimizePerformanceDisposable = vscode.commands.registerCommand('ai-assistant.optimizePerformance', async () => {
        await optimizePerformance();
    });

    context.subscriptions.push(
        generateCodeDisposable,
        explainCodeDisposable,
        refactorCodeDisposable,
        generateCommentsDisposable,
        suggestRefactorDisposable,
        optimizePerformanceDisposable
    );
}

export function deactivate() {
    console.log('AI Assistant extension deactivated');
}

async function generateCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const prompt = await vscode.window.showInputBox({
        prompt: 'Enter code generation prompt',
        placeHolder: 'e.g., "Create a function that calculates Fibonacci numbers"'
    });

    if (!prompt) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Generating code...',
            cancellable: false
        }, async (progress) => {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const generatedCode = generateSampleCode(prompt, editor.document.languageId);
            const selection = editor.selection;

            editor.edit(editBuilder => {
                if (selection.isEmpty) {
                    editBuilder.insert(selection.active, generatedCode);
                } else {
                    editBuilder.replace(selection, generatedCode);
                }
            });

            vscode.window.showInformationMessage('Code generation completed');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Code generation failed: ${error}`);
    }
}

async function explainCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection.isEmpty ? undefined : selection);

    if (!code) {
        vscode.window.showErrorMessage('No code selected or active editor is empty');
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Explaining code...',
            cancellable: false
        }, async (progress) => {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const explanation = generateCodeExplanation(code, editor.document.languageId);

            // Show explanation in a new window
            const panel = vscode.window.createWebviewPanel(
                'codeExplanation',
                'Code Explanation',
                vscode.ViewColumn.Beside,
                {}
            );

            panel.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Code Explanation</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
                        h1 { color: #2c3e50; }
                        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
                        p { line-height: 1.6; }
                    </style>
                </head>
                <body>
                    <h1>Code Explanation</h1>
                    <pre>${escapeHtml(code)}</pre>
                    <div>${explanation}</div>
                </body>
                </html>
            `;

            vscode.window.showInformationMessage('Code explanation completed');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Code explanation failed: ${error}`);
    }
}

async function refactorCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection.isEmpty ? undefined : selection);

    if (!code) {
        vscode.window.showErrorMessage('No code selected or active editor is empty');
        return;
    }

    const refactorOption = await vscode.window.showQuickPick([
        'Improve readability',
        'Optimize performance',
        'Fix bugs',
        'Add comments'
    ], {
        placeHolder: 'Select refactoring option'
    });

    if (!refactorOption) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Refactoring code...',
            cancellable: false
        }, async (progress) => {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const refactoredCode = refactorSampleCode(code, refactorOption, editor.document.languageId);

            editor.edit(editBuilder => {
                if (selection.isEmpty) {
                    const entireDocument = new vscode.Range(
                        editor.document.positionAt(0),
                        editor.document.positionAt(editor.document.getText().length)
                    );
                    editBuilder.replace(entireDocument, refactoredCode);
                } else {
                    editBuilder.replace(selection, refactoredCode);
                }
            });

            vscode.window.showInformationMessage('Code refactoring completed');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Code refactoring failed: ${error}`);
    }
}

function generateSampleCode(prompt: string, languageId: string): string {
    // Sample code generation based on language
    switch (languageId) {
        case 'javascript':
        case 'typescript':
            return `// Generated code for: ${prompt}\nfunction exampleFunction() {\n    console.log('Hello, world!');\n    return true;\n}\n\nexport default exampleFunction;`;
        case 'python':
            return `# Generated code for: ${prompt}\ndef example_function():\n    print("Hello, world!")\n    return True\n\nif __name__ == "__main__":\n    example_function()`;
        case 'java':
            return `// Generated code for: ${prompt}\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`;
        case 'csharp':
            return `// Generated code for: ${prompt}\nusing System;\n\nclass Program {\n    static void Main(string[] args) {\n        Console.WriteLine("Hello, world!");\n    }\n}`;
        default:
            return `// Generated code for: ${prompt}\n// Sample code in ${languageId}\nconsole.log('Hello, world!');`;
    }
}

function generateCodeExplanation(code: string, languageId: string): string {
    return `<h2>Explanation</h2>
            <p>This code demonstrates a basic example in ${languageId}.</p>
            <p><strong>What it does:</strong></p>
            <ul>
                <li>Defines a function/method</li>
                <li>Prints "Hello, world!" to the console</li>
                <li>Returns a boolean value</li>
            </ul>
            <p><strong>Key concepts:</strong></p>
            <ul>
                <li>Function definition syntax in ${languageId}</li>
                <li>Console output methods</li>
                <li>Return values</li>
            </ul>`;
}

function refactorSampleCode(code: string, refactorOption: string, languageId: string): string {
    switch (refactorOption) {
        case 'Improve readability':
            return `// Refactored for readability\n${code.replace(/\s+/g, ' ').trim()}`;
        case 'Optimize performance':
            return `// Optimized for performance\n${code}`;
        case 'Fix bugs':
            return `// Fixed bugs\n${code}`;
        case 'Add comments':
            return `// Added comments\n${code.split('\n').map(line => `// ${line}`).join('\n')}`;
        default:
            return code;
    }
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function generateComments() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection.isEmpty ? undefined : selection);

    if (!code) {
        vscode.window.showErrorMessage('No code selected or active editor is empty');
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Generating comments...',
            cancellable: false
        }, async (progress) => {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const codeWithComments = generateCodeComments(code, editor.document.languageId);

            editor.edit(editBuilder => {
                if (selection.isEmpty) {
                    const entireDocument = new vscode.Range(
                        editor.document.positionAt(0),
                        editor.document.positionAt(editor.document.getText().length)
                    );
                    editBuilder.replace(entireDocument, codeWithComments);
                } else {
                    editBuilder.replace(selection, codeWithComments);
                }
            });

            vscode.window.showInformationMessage('Code comments generation completed');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Code comments generation failed: ${error}`);
    }
}

function generateCodeComments(code: string, languageId: string): string {
    switch (languageId) {
        case 'javascript':
        case 'typescript':
            return generateJavaScriptComments(code);
        case 'python':
            return generatePythonComments(code);
        case 'java':
            return generateJavaComments(code);
        case 'csharp':
            return generateCSharpComments(code);
        default:
            return `// Generated comments for ${languageId}\n${code}`;
    }
}

function generateJavaScriptComments(code: string): string {
    return `/**
 * Generated by AI Assistant
 * Purpose: Code implementation
 * Language: JavaScript/TypeScript
 */

${code.split('\n').map((line, index, lines) => {
    if (line.match(/^\s*function\s+\w+\s*\(/)) {
        const funcName = line.match(/function\s+(\w+)/)?.[1] || 'function';
        return `/**
 * ${funcName} function
 * @description Performs a specific task
 * @returns {*} Result of the function
 */
${line}`;
    }
    if (line.match(/^\s*class\s+\w+/)) {
        const className = line.match(/class\s+(\w+)/)?.[1] || 'class';
        return `/**
 * ${className} class
 * @description Represents a ${className}
 */
${line}`;
    }
    if (line.match(/^\s*const\s+\w+\s*=/)) {
        const varName = line.match(/const\s+(\w+)/)?.[1] || 'variable';
        return `// ${varName} - Variable declaration
${line}`;
    }
    return line;
}).join('\n')}`;
}

function generatePythonComments(code: string): string {
    return `"""
Generated by AI Assistant
Purpose: Code implementation
Language: Python
"""

${code.split('\n').map((line, index, lines) => {
    if (line.match(/^\s*def\s+\w+\s*\(/)) {
        const funcName = line.match(/def\s+(\w+)/)?.[1] || 'function';
        return `"""
${funcName} function

Description:
    Performs a specific task

Returns:
    * Result of the function
"""
${line}`;
    }
    if (line.match(/^\s*class\s+\w+/)) {
        const className = line.match(/class\s+(\w+)/)?.[1] || 'class';
        return `"""
${className} class

Description:
    Represents a ${className}
"""
${line}`;
    }
    if (line.match(/^\s*\w+\s*=/)) {
        const varName = line.match(/^(\w+)\s*=/)?.[1] || 'variable';
        return `# ${varName} - Variable declaration
${line}`;
    }
    return line;
}).join('\n')}`;
}

function generateJavaComments(code: string): string {
    return `/**
 * Generated by AI Assistant
 * Purpose: Code implementation
 * Language: Java
 */

${code.split('\n').map((line, index, lines) => {
    if (line.match(/^\s*public\s+class\s+\w+/)) {
        const className = line.match(/class\s+(\w+)/)?.[1] || 'class';
        return `/**
 * ${className} class
 * @description Represents a ${className}
 */
${line}`;
    }
    if (line.match(/^\s*public\s+\w+\s+\w+\s*\(/)) {
        const funcName = line.match(/\s+(\w+)\s*\(/)?.[1] || 'method';
        return `/**
 * ${funcName} method
 * @description Performs a specific task
 * @returns Result of the method
 */
${line}`;
    }
    if (line.match(/^\s*private\s+\w+\s+\w+\s*=/)) {
        const varName = line.match(/\s+(\w+)\s*=/)?.[1] || 'variable';
        return `// ${varName} - Variable declaration
${line}`;
    }
    return line;
}).join('\n')}`;
}

function generateCSharpComments(code: string): string {
    return `/// <summary>
/// Generated by AI Assistant
/// Purpose: Code implementation
/// Language: C#
/// </summary>

${code.split('\n').map((line, index, lines) => {
    if (line.match(/^\s*class\s+\w+/)) {
        const className = line.match(/class\s+(\w+)/)?.[1] || 'class';
        return `/// <summary>
/// ${className} class
/// </summary>
/// <remarks>
/// Represents a ${className}
/// </remarks>
${line}`;
    }
    if (line.match(/^\s*public\s+\w+\s+\w+\s*\(/)) {
        const funcName = line.match(/\s+(\w+)\s*\(/)?.[1] || 'method';
        return `/// <summary>
/// ${funcName} method
/// </summary>
/// <returns>
/// Result of the method
/// </returns>
${line}`;
    }
    if (line.match(/^\s*private\s+\w+\s+\w+\s*=/)) {
        const varName = line.match(/\s+(\w+)\s*=/)?.[1] || 'variable';
        return `// ${varName} - Variable declaration
${line}`;
    }
    return line;
}).join('\n')}`;
}

async function suggestRefactor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection.isEmpty ? undefined : selection);

    if (!code) {
        vscode.window.showErrorMessage('No code selected or active editor is empty');
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Generating refactoring suggestions...',
            cancellable: false
        }, async (progress) => {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const suggestions = generateRefactorSuggestions(code, editor.document.languageId);

            // Show suggestions in a new window
            const panel = vscode.window.createWebviewPanel(
                'refactorSuggestions',
                'Refactoring Suggestions',
                vscode.ViewColumn.Beside,
                {}
            );

            panel.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Refactoring Suggestions</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
                        h1 { color: #2c3e50; }
                        h2 { color: #3498db; }
                        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
                        p { line-height: 1.6; }
                        .suggestion { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 10px 0; }
                        .suggestion h3 { margin-top: 0; color: #2c3e50; }
                        .suggestion p { margin-bottom: 0; }
                        button { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
                        button:hover { background: #2980b9; }
                    </style>
                </head>
                <body>
                    <h1>Refactoring Suggestions</h1>
                    <pre>${escapeHtml(code)}</pre>
                    <h2>Suggestions</h2>
                    ${suggestions}
                    <script>
                        function applySuggestion(index) {
                            window.parent.postMessage({ type: 'applySuggestion', index: index }, '*');
                        }
                    </script>
                </body>
                </html>
            `;

            panel.webview.onDidReceiveMessage(
                message => {
                    if (message.type === 'applySuggestion') {
                        vscode.window.showInformationMessage('Suggestion applied!');
                    }
                },
                undefined,
                []
            );

            vscode.window.showInformationMessage('Refactoring suggestions generated');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Refactoring suggestions failed: ${error}`);
    }
}

async function optimizePerformance() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection.isEmpty ? undefined : selection);

    if (!code) {
        vscode.window.showErrorMessage('No code selected or active editor is empty');
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Analyzing performance...',
            cancellable: false
        }, async (progress) => {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const optimizations = generatePerformanceOptimizations(code, editor.document.languageId);

            // Show optimizations in a new window
            const panel = vscode.window.createWebviewPanel(
                'performanceOptimizations',
                'Performance Optimizations',
                vscode.ViewColumn.Beside,
                {}
            );

            panel.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Performance Optimizations</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
                        h1 { color: #2c3e50; }
                        h2 { color: #3498db; }
                        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
                        p { line-height: 1.6; }
                        .optimization { background: #e8f8e8; padding: 15px; border-radius: 5px; margin: 10px 0; }
                        .optimization h3 { margin-top: 0; color: #27ae60; }
                        .optimization p { margin-bottom: 0; }
                        .optimization .impact { font-weight: bold; color: #e67e22; }
                        button { background: #27ae60; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
                        button:hover { background: #229954; }
                    </style>
                </head>
                <body>
                    <h1>Performance Optimizations</h1>
                    <pre>${escapeHtml(code)}</pre>
                    <h2>Optimization Opportunities</h2>
                    ${optimizations}
                    <script>
                        function applyOptimization(index) {
                            window.parent.postMessage({ type: 'applyOptimization', index: index }, '*');
                        }
                    </script>
                </body>
                </html>
            `;

            panel.webview.onDidReceiveMessage(
                message => {
                    if (message.type === 'applyOptimization') {
                        vscode.window.showInformationMessage('Optimization applied!');
                    }
                },
                undefined,
                []
            );

            vscode.window.showInformationMessage('Performance optimization suggestions generated');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Performance analysis failed: ${error}`);
    }
}

function generateRefactorSuggestions(code: string, languageId: string): string {
    let suggestions = '';

    // Common refactoring suggestions
    suggestions += `
        <div class="suggestion">
            <h3>1. Extract Repeated Code</h3>
            <p>Identify and extract repeated code patterns into reusable functions or methods.</p>
            <button onclick="applySuggestion(0)">Apply</button>
        </div>
        <div class="suggestion">
            <h3>2. Improve Variable Naming</h3>
            <p>Use more descriptive and meaningful variable names to enhance code readability.</p>
            <button onclick="applySuggestion(1)">Apply</button>
        </div>
        <div class="suggestion">
            <h3>3. Simplify Complex Conditions</h3>
            <p>Break down complex conditional statements into smaller, more manageable parts.</p>
            <button onclick="applySuggestion(2)">Apply</button>
        </div>
    `;

    // Language-specific suggestions
    switch (languageId) {
        case 'javascript':
        case 'typescript':
            suggestions += `
                <div class="suggestion">
                    <h3>4. Use Arrow Functions</h3>
                    <p>Consider using arrow functions for concise function definitions, especially for callbacks.</p>
                    <button onclick="applySuggestion(3)">Apply</button>
                </div>
                <div class="suggestion">
                    <h3>5. Use Destructuring</h3>
                    <p>Utilize destructuring assignment for cleaner and more concise code.</p>
                    <button onclick="applySuggestion(4)">Apply</button>
                </div>
            `;
            break;
        case 'python':
            suggestions += `
                <div class="suggestion">
                    <h3>4. Use List Comprehensions</h3>
                    <p>Consider using list comprehensions for more concise and readable code when working with lists.</p>
                    <button onclick="applySuggestion(3)">Apply</button>
                </div>
                <div class="suggestion">
                    <h3>5. Use Context Managers</h3>
                    <p>Utilize context managers (with statements) for resource management.</p>
                    <button onclick="applySuggestion(4)">Apply</button>
                </div>
            `;
            break;
        case 'java':
            suggestions += `
                <div class="suggestion">
                    <h3>4. Use StringBuilder for String Concatenation</h3>
                    <p>Use StringBuilder instead of String concatenation in loops for better performance.</p>
                    <button onclick="applySuggestion(3)">Apply</button>
                </div>
                <div class="suggestion">
                    <h3>5. Use Try-With-Resources</h3>
                    <p>Utilize try-with-resources statements for automatic resource management.</p>
                    <button onclick="applySuggestion(4)">Apply</button>
                </div>
            `;
            break;
        case 'csharp':
            suggestions += `
                <div class="suggestion">
                    <h3>4. Use String Interpolation</h3>
                    <p>Consider using string interpolation for more readable string formatting.</p>
                    <button onclick="applySuggestion(3)">Apply</button>
                </div>
                <div class="suggestion">
                    <h3>5. Use Using Statements</h3>
                    <p>Utilize using statements for automatic resource disposal.</p>
                    <button onclick="applySuggestion(4)">Apply</button>
                </div>
            `;
            break;
    }

    return suggestions;
}

function generatePerformanceOptimizations(code: string, languageId: string): string {
    let optimizations = '';

    // Common performance optimizations
    optimizations += `
        <div class="optimization">
            <h3>1. Avoid Repeated Calculations</h3>
            <p>Cache results of expensive calculations instead of recalculating them multiple times.</p>
            <p class="impact">Impact: Medium</p>
            <button onclick="applyOptimization(0)">Apply</button>
        </div>
        <div class="optimization">
            <h3>2. Use Efficient Data Structures</h3>
            <p>Choose the appropriate data structure for your use case to optimize performance.</p>
            <p class="impact">Impact: High</p>
            <button onclick="applyOptimization(1)">Apply</button>
        </div>
        <div class="optimization">
            <h3>3. Minimize I/O Operations</h3>
            <p>Batch I/O operations and use asynchronous methods when possible.</p>
            <p class="impact">Impact: High</p>
            <button onclick="applyOptimization(2)">Apply</button>
        </div>
    `;

    // Language-specific optimizations
    switch (languageId) {
        case 'javascript':
        case 'typescript':
            optimizations += `
                <div class="optimization">
                    <h3>4. Use const and let Appropriately</h3>
                    <p>Use const for values that won't change and let for values that will, to help the JavaScript engine optimize.</p>
                    <p class="impact">Impact: Low</p>
                    <button onclick="applyOptimization(3)">Apply</button>
                </div>
                <div class="optimization">
                    <h3>5. Avoid Using eval()</h3>
                    <p>eval() is slow and can introduce security vulnerabilities. Use alternatives like Function() or direct code instead.</p>
                    <p class="impact">Impact: High</p>
                    <button onclick="applyOptimization(4)">Apply</button>
                </div>
            `;
            break;
        case 'python':
            optimizations += `
                <div class="optimization">
                    <h3>4. Use Generators for Large Data Sets</h3>
                    <p>Use generators instead of lists for large data sets to save memory.</p>
                    <p class="impact">Impact: High</p>
                    <button onclick="applyOptimization(3)">Apply</button>
                </div>
                <div class="optimization">
                    <h3>5. Avoid Using Global Variables</h3>
                    <p>Global variables are slower to access than local variables. Use local variables whenever possible.</p>
                    <p class="impact">Impact: Medium</p>
                    <button onclick="applyOptimization(4)">Apply</button>
                </div>
            `;
            break;
        case 'java':
            optimizations += `
                <div class="optimization">
                    <h3>4. Use Primitive Types</h3>
                    <p>Use primitive types (int, double, etc.) instead of wrapper classes (Integer, Double) when possible for better performance.</p>
                    <p class="impact">Impact: Medium</p>
                    <button onclick="applyOptimization(3)">Apply</button>
                </div>
                <div class="optimization">
                    <h3>5. Use StringBuilder for String Operations</h3>
                    <p>Use StringBuilder instead of String for frequent string concatenations, especially in loops.</p>
                    <p class="impact">Impact: High</p>
                    <button onclick="applyOptimization(4)">Apply</button>
                </div>
            `;
            break;
        case 'csharp':
            optimizations += `
                <div class="optimization">
                    <h3>4. Use Span<T> for Memory Operations</h3>
                    <p>Use Span<T> for efficient memory operations, especially with arrays and strings.</p>
                    <p class="impact">Impact: Medium</p>
                    <button onclick="applyOptimization(3)">Apply</button>
                </div>
                <div class="optimization">
                    <h3>5. Use Async/Await for I/O Operations</h3>
                    <p>Use async/await pattern for I/O-bound operations to improve scalability.</p>
                    <p class="impact">Impact: High</p>
                    <button onclick="applyOptimization(4)">Apply</button>
                </div>
            `;
            break;
    }

    return optimizations;
}

