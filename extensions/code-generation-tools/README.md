# Code Generation Tools Extension

AI-driven code generation and template management tools for Visual Studio Code, providing accelerated development workflows and intelligent code generation capabilities.

## 🚀 Features

- **AI Code Generation**: Generate code from natural language prompts
- **Template Management**: Create, edit, and manage code templates
- **Template-Based Generation**: Generate code from predefined templates
- **Documentation Generation**: Automatically generate code documentation
- **Template Import/Export**: Share templates across projects and teams

## 📦 Installation

1. Download the `code-generation-tools-1.0.0.vsix` file
2. In VS Code, go to Extensions → More Actions → Install from VSIX...
3. Select the downloaded VSIX file
4. Reload VS Code to activate the extension

## 🛠️ Usage

### Command Palette

Open the Command Palette (`Ctrl+Shift+P`) and search for "Code Generation" to see all available commands:

- **Code Generation: Generate Code from Prompt** - Generate code from a prompt
- **Code Generation: Generate from Template** - Generate code from a template
- **Code Generation: Save as Template** - Save code as a template
- **Code Generation: Manage Templates** - Manage code templates
- **Code Generation: Generate Documentation** - Generate code documentation

### Context Menu

Right-click in the editor to access Code Generation Tools commands from the context menu.

### Keyboard Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| Generate Code from Prompt | `Ctrl+Shift+G` | Generate code from prompt |
| Generate from Template | `Ctrl+Shift+T` | Generate from template |
| Generate Documentation | `Ctrl+Shift+D` | Generate documentation |

## 📝 Examples

### Generating Code from Prompts

1. Press `Ctrl+Shift+G` or run "Code Generation: Generate Code from Prompt" from the Command Palette
2. Enter a detailed prompt describing what you want to generate:
   - Example: "Create a TypeScript function that calculates the factorial of a number with error handling"
   - Example: "Create a React component for a login form with validation"
   - Example: "Create a Python class for a binary search tree with insert and search methods"
3. The extension will generate the code based on your prompt
4. The generated code will be inserted into your editor

### Using Templates

1. Run "Code Generation: Generate from Template" from the Command Palette
2. Select a template from the list
3. The template content will be inserted into your editor
4. Customize the generated code as needed

### Saving Templates

1. Select code you want to save as a template
2. Press `Right-click` and select "Code Generation: Save as Template" from the context menu
3. Enter a name for the template
4. Enter a description (optional)
5. Enter tags for easy searching (optional, comma-separated)
6. Click "Save" to store the template

### Managing Templates

1. Run "Code Generation: Manage Templates" from the Command Palette
2. Select an action:
   - **View All Templates**: List all saved templates
   - **Edit Template**: Modify an existing template
   - **Delete Template**: Remove a template
   - **Import Template**: Import a template from a JSON file
   - **Export Template**: Export a template to a JSON file
3. Follow the prompts to complete the action

### Generating Documentation

1. Open a file with code you want to document
2. Press `Ctrl+Shift+D` or run "Code Generation: Generate Documentation" from the Command Palette
3. The extension will analyze the code and generate documentation
4. A new document with the generated documentation will open
5. Review and customize the documentation as needed

## 🔧 Configuration

The Code Generation Tools extension doesn't require any specific configuration. It works out of the box with sensible defaults.

## 🐛 Troubleshooting

### Common Issues

- **Template not found**: Ensure templates are saved correctly
- **Generation failed**: Check your prompt clarity and specificity
- **Import failed**: Ensure the template file is in the correct JSON format

### Template Format

Templates are stored as JSON files with the following structure:

```json
{
  "id": "template-unique-id",
  "name": "Template Name",
  "description": "Template description",
  "content": "Template code content",
  "language": "typescript",
  "tags": ["react", "component"],
  "createdAt": "2026-02-01T12:00:00Z"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Version**: 1.0.0
**Publisher**: vscode
**Last Updated**: 2026-02-01
