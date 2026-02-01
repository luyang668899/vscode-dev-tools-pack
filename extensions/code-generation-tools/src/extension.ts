import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  language: string;
  tags: string[];
  createdAt: string;
}

class CodeGenerationTools {
  private templatesPath: string;
  private templates: Template[] = [];

  constructor() {
    this.templatesPath = path.join(vscode.extensions.getExtension('vscode.code-generation-tools')?.extensionPath || '', 'templates');
    this.loadTemplates();
  }

  private loadTemplates() {
    try {
      if (!fs.existsSync(this.templatesPath)) {
        fs.mkdirSync(this.templatesPath, { recursive: true });
      }

      const files = fs.readdirSync(this.templatesPath);
      this.templates = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(this.templatesPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(content) as Template;
        });
    } catch (error) {
      console.error('Error loading templates:', error);
      this.templates = [];
    }
  }

  private _saveTemplate(template: Template) {
    try {
      const filePath = path.join(this.templatesPath, `${template.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
      this.templates.push(template);
    } catch (error) {
      console.error('Error saving template:', error);
      vscode.window.showErrorMessage('Failed to save template');
    }
  }

  async generateCode() {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter code generation prompt',
      placeHolder: 'e.g., Create a TypeScript function that calculates Fibonacci numbers',
      ignoreFocusOut: true
    });

    if (!prompt) return;

    const language = vscode.window.activeTextEditor?.document.languageId || 'typescript';

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Generating code...',
      cancellable: true
    }, async (progress, token) => {
      progress.report({ increment: 0 });

      // Simulate AI code generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      progress.report({ increment: 50 });

      let generatedCode = '';

      // Generate code based on prompt and language
      if (language === 'typescript' || language === 'javascript') {
        if (prompt.includes('fibonacci')) {
          generatedCode = `/**
 * Calculates Fibonacci numbers
 * @param n The position in the Fibonacci sequence
 * @returns The Fibonacci number at position n
 */
export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

/**
 * Calculates Fibonacci numbers iteratively (more efficient)
 * @param n The position in the Fibonacci sequence
 * @returns The Fibonacci number at position n
 */
export function fibonacciIterative(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`;
        } else if (prompt.includes('sort')) {
          generatedCode = `/**
 * Sorts an array of numbers using merge sort algorithm
 * @param arr The array to sort
 * @returns A new sorted array
 */
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

/**
 * Merges two sorted arrays
 * @param left First sorted array
 * @param right Second sorted array
 * @returns Merged sorted array
 */
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}`;
        } else {
          generatedCode = `// Generated code based on your prompt:
// ${prompt}

/**
 * Your generated code here
 */
`;
        }
      } else if (language === 'python') {
        generatedCode = `"""
Generated code based on your prompt:
${prompt}
"""

# Your generated Python code here
`;
      } else if (language === 'java') {
        generatedCode = `/**
 * Generated code based on your prompt:
 * ${prompt}
 */
public class GeneratedCode {
    // Your generated Java code here
}
`;
      } else {
        generatedCode = `// Generated code based on your prompt:
// ${prompt}

// Your generated code here
`;
      }

      progress.report({ increment: 100 });

      // Insert generated code into active editor
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit(editBuilder => {
          const selection = editor.selection;
          if (selection.isEmpty) {
            editBuilder.insert(selection.start, generatedCode);
          } else {
            editBuilder.replace(selection, generatedCode);
          }
        });
      } else {
        // Create new file if no active editor
        const document = await vscode.workspace.openTextDocument({
          language,
          content: generatedCode
        });
        await vscode.window.showTextDocument(document);
      }

      vscode.window.showInformationMessage('Code generated successfully!');
    });
  }

  async generateFromTemplate() {
    if (this.templates.length === 0) {
      vscode.window.showInformationMessage('No templates available. Save some code as templates first.');
      return;
    }

    const templateItems = this.templates.map(template => ({
      label: template.name,
      description: template.description,
      detail: `${template.language} | ${template.tags.join(', ')}`,
      template
    }));

    const selected = await vscode.window.showQuickPick(templateItems, {
      title: 'Select Template',
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (selected) {
      const template = selected.template;

      // Insert template content into active editor
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit(editBuilder => {
          const selection = editor.selection;
          if (selection.isEmpty) {
            editBuilder.insert(selection.start, template.content);
          } else {
            editBuilder.replace(selection, template.content);
          }
        });
      } else {
        // Create new file if no active editor
        const document = await vscode.workspace.openTextDocument({
          language: template.language,
          content: template.content
        });
        await vscode.window.showTextDocument(document);
      }

      vscode.window.showInformationMessage(`Template "${template.name}" applied successfully!`);
    }
  }

  async saveTemplate() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found. Open a file to save as template.');
      return;
    }

    const selection = editor.selection;
    const content = selection.isEmpty
      ? editor.document.getText()
      : editor.document.getText(selection);

    if (!content.trim()) {
      vscode.window.showErrorMessage('No content selected. Please select code to save as template.');
      return;
    }

    const name = await vscode.window.showInputBox({
      prompt: 'Template Name',
      placeHolder: 'e.g., React Component',
      ignoreFocusOut: true
    });

    if (!name) return;

    const description = await vscode.window.showInputBox({
      prompt: 'Template Description',
      placeHolder: 'e.g., A basic React functional component',
      ignoreFocusOut: true
    });

    const tagsInput = await vscode.window.showInputBox({
      prompt: 'Tags (comma separated)',
      placeHolder: 'e.g., react, component, typescript',
      ignoreFocusOut: true
    });

    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    const template: Template = {
      id: `template-${Date.now()}`,
      name,
      description: description || '',
      content,
      language: editor.document.languageId,
      tags,
      createdAt: new Date().toISOString()
    };

    this._saveTemplate(template);
    vscode.window.showInformationMessage(`Template "${name}" saved successfully!`);
  }

  async manageTemplates() {
    const actions = [
      { label: 'View All Templates', description: 'List all saved templates' },
      { label: 'Edit Template', description: 'Modify an existing template' },
      { label: 'Delete Template', description: 'Remove a template' },
      { label: 'Import Template', description: 'Import template from file' },
      { label: 'Export Template', description: 'Export template to file' }
    ];

    const selectedAction = await vscode.window.showQuickPick(actions, {
      title: 'Manage Templates',
      matchOnDescription: true
    });

    if (!selectedAction) return;

    switch (selectedAction.label) {
      case 'View All Templates':
        await this.viewTemplates();
        break;
      case 'Edit Template':
        await this.editTemplate();
        break;
      case 'Delete Template':
        await this.deleteTemplate();
        break;
      case 'Import Template':
        await this.importTemplate();
        break;
      case 'Export Template':
        await this.exportTemplate();
        break;
    }
  }

  private async viewTemplates() {
    if (this.templates.length === 0) {
      vscode.window.showInformationMessage('No templates available.');
      return;
    }

    const templateItems = this.templates.map(template => ({
      label: template.name,
      description: template.description,
      detail: `${template.language} | ${template.tags.join(', ')} | Created: ${new Date(template.createdAt).toLocaleString()}`,
      template
    }));

    const selected = await vscode.window.showQuickPick(templateItems, {
      title: 'Templates',
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (selected) {
      // Show template content in a new editor
      const document = await vscode.workspace.openTextDocument({
        language: selected.template.language,
        content: selected.template.content
      });
      await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Beside });
    }
  }

  private async editTemplate() {
    if (this.templates.length === 0) {
      vscode.window.showInformationMessage('No templates available.');
      return;
    }

    const templateItems = this.templates.map(template => ({
      label: template.name,
      description: template.description,
      template
    }));

    const selected = await vscode.window.showQuickPick(templateItems, {
      title: 'Select Template to Edit',
      matchOnDescription: true
    });

    if (selected) {
      const template = selected.template;

      // Show template content in editor for editing
      const document = await vscode.workspace.openTextDocument({
        language: template.language,
        content: template.content
      });
      const editor = await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Beside });

      // Wait for user to edit and save
      const saved = await new Promise<boolean>(resolve => {
        const disposable = vscode.workspace.onDidSaveTextDocument(doc => {
          if (doc === document) {
            resolve(true);
            disposable.dispose();
          }
        });

        // Timeout after 5 minutes
        setTimeout(() => {
          resolve(false);
          disposable.dispose();
        }, 5 * 60 * 1000);
      });

      if (saved) {
        // Update template content
        const updatedTemplate = {
          ...template,
          content: document.getText()
        };

        // Save updated template
        const filePath = path.join(this.templatesPath, `${template.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(updatedTemplate, null, 2));

        // Reload templates
        this.loadTemplates();
        vscode.window.showInformationMessage(`Template "${template.name}" updated successfully!`);
      }
    }
  }

  private async deleteTemplate() {
    if (this.templates.length === 0) {
      vscode.window.showInformationMessage('No templates available.');
      return;
    }

    const templateItems = this.templates.map(template => ({
      label: template.name,
      description: template.description,
      template
    }));

    const selected = await vscode.window.showQuickPick(templateItems, {
      title: 'Select Template to Delete',
      matchOnDescription: true
    });

    if (selected) {
      const template = selected.template;
      const confirmed = await vscode.window.showInformationMessage(
        `Are you sure you want to delete template "${template.name}"?`,
        { modal: true },
        'Delete',
        'Cancel'
      );

      if (confirmed === 'Delete') {
        const filePath = path.join(this.templatesPath, `${template.id}.json`);
        fs.unlinkSync(filePath);

        // Reload templates
        this.loadTemplates();
        vscode.window.showInformationMessage(`Template "${template.name}" deleted successfully!`);
      }
    }
  }

  private async importTemplate() {
    const fileUri = await vscode.window.showOpenDialog({
      filters: { 'JSON Files': ['json'] },
      canSelectMany: false,
      title: 'Select Template JSON File'
    });

    if (fileUri && fileUri[0]) {
      try {
        const content = fs.readFileSync(fileUri[0].fsPath, 'utf8');
        const template = JSON.parse(content) as Template;

        // Validate template structure
        if (!template.id || !template.name || !template.content) {
          throw new Error('Invalid template structure');
        }

        // Generate new ID to avoid conflicts
        template.id = `template-${Date.now()}`;
        template.createdAt = new Date().toISOString();

        this._saveTemplate(template);
        vscode.window.showInformationMessage(`Template "${template.name}" imported successfully!`);
      } catch (error) {
        vscode.window.showErrorMessage('Failed to import template: Invalid JSON file');
      }
    }
  }

  private async exportTemplate() {
    if (this.templates.length === 0) {
      vscode.window.showInformationMessage('No templates available.');
      return;
    }

    const templateItems = this.templates.map(template => ({
      label: template.name,
      description: template.description,
      template
    }));

    const selected = await vscode.window.showQuickPick(templateItems, {
      title: 'Select Template to Export',
      matchOnDescription: true
    });

    if (selected) {
      const template = selected.template;
      const fileUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(vscode.workspace.rootPath || '', `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`)),
        filters: { 'JSON Files': ['json'] },
        title: 'Export Template'
      });

      if (fileUri) {
        fs.writeFileSync(fileUri.fsPath, JSON.stringify(template, null, 2));
        vscode.window.showInformationMessage(`Template "${template.name}" exported successfully!`);
      }
    }
  }

  async generateDocumentation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found. Open a file to generate documentation for.');
      return;
    }

    const content = editor.document.getText();
    const language = editor.document.languageId;

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Generating documentation...',
      cancellable: true
    }, async (progress) => {
      progress.report({ increment: 0 });

      // Simulate documentation generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      progress.report({ increment: 50 });

      let documentation = '';

      if (language === 'typescript' || language === 'javascript') {
        documentation = `/**
 * File: ${path.basename(editor.document.fileName)}
 * Generated Documentation
 * Date: ${new Date().toISOString()}
 */

/**
 * Overview
 * This file contains ${this.extractFunctionNames(content).length} functions and ${this.extractClassNames(content).length} classes.
 */

${this.generateTypeScriptDocumentation(content)}
`;
      } else if (language === 'python') {
        documentation = `"""
File: ${path.basename(editor.document.fileName)}
Generated Documentation
Date: ${new Date().toISOString()}
"""

"""
Overview
This file contains Python code that may include functions, classes, and variables.
"""

`;
      } else if (language === 'java') {
        documentation = '/**\n' +
          ' * File: ' + path.basename(editor.document.fileName) + '\n' +
          ' * Generated Documentation\n' +
          ' * Date: ' + new Date().toISOString() + '\n' +
          ' */\n\n' +
          '/**\n' +
          ' * Overview\n' +
          ' * This file contains Java code with classes and methods.\n' +
          ' */\n\n';
      } else {
        documentation = `// File: ${path.basename(editor.document.fileName)}
// Generated Documentation
// Date: ${new Date().toISOString()}

// Overview
// This file contains code in ${language}.

`;
      }

      progress.report({ increment: 100 });

      // Create new document with documentation
      const doc = await vscode.workspace.openTextDocument({
        language: language === 'python' ? 'python' : 'markdown',
        content: documentation
      });
      await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });

      vscode.window.showInformationMessage('Documentation generated successfully!');
    });
  }

  private extractFunctionNames(content: string): string[] {
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(|const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(.*?\)\s*=>|export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(|export\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(.*?\)\s*=>/g;
    const functions: string[] = [];
    let match;

    while ((match = functionRegex.exec(content)) !== null) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          functions.push(match[i]);
          break;
        }
      }
    }

    return [...new Set(functions)];
  }

  private extractClassNames(content: string): string[] {
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*{|export\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*{|interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*{|type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
    const classes: string[] = [];
    let match;

    while ((match = classRegex.exec(content)) !== null) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          classes.push(match[i]);
          break;
        }
      }
    }

    return [...new Set(classes)];
  }

  private generateTypeScriptDocumentation(content: string): string {
    const functions = this.extractFunctionNames(content);
    const classes = this.extractClassNames(content);
    let docs = '';

    if (functions.length > 0) {
      docs += `/**
 * Functions
 */

`;
      functions.forEach(func => {
        docs += `/**
 * ${func} function
 * @description Generated documentation for ${func}
 * @param {any} params - Function parameters
 * @returns {any} - Return value
 */
`;
      });
    }

    if (classes.length > 0) {
      docs += `/**
 * Classes and Interfaces
 */

`;
      classes.forEach(cls => {
        docs += `/**
 * ${cls} ${cls.match(/^I[A-Z]/) ? 'Interface' : 'Class'}
 * @description Generated documentation for ${cls}
 */
`;
      });
    }

    return docs;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Code Generation Tools extension activated');

  const codeGenTools = new CodeGenerationTools();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('code-generation.generateCode', () => codeGenTools.generateCode()),
    vscode.commands.registerCommand('code-generation.generateFromTemplate', () => codeGenTools.generateFromTemplate()),
    vscode.commands.registerCommand('code-generation.saveTemplate', () => codeGenTools.saveTemplate()),
    vscode.commands.registerCommand('code-generation.manageTemplates', () => codeGenTools.manageTemplates()),
    vscode.commands.registerCommand('code-generation.generateDocumentation', () => codeGenTools.generateDocumentation())
  );
}

export function deactivate() {
  console.log('Code Generation Tools extension deactivated');
}
