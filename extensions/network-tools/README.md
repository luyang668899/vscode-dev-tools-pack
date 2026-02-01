# Network Tools Extension

Network analysis tools for Visual Studio Code, providing HTTP request sending, network monitoring, response analysis, and collection management capabilities.

## 🚀 Features

- **HTTP Request Sending**: Send HTTP requests directly from VS Code
- **Network Monitoring**: Monitor network traffic in real-time
- **Response Analysis**: Analyze HTTP responses in detail
- **Collection Management**: Organize requests into collections
- **Import/Export Collections**: Import and export collections for sharing

## 📦 Installation

1. Download the `network-tools-1.0.0.vsix` file
2. In VS Code, go to Extensions → More Actions → Install from VSIX...
3. Select the downloaded VSIX file
4. Reload VS Code to activate the extension

## 🛠️ Usage

### Command Palette

Open the Command Palette (`Ctrl+Shift+P`) and search for "Network Tools" to see all available commands:

- **Network Tools: Send HTTP Request** - Send an HTTP request
- **Network Tools: Monitor Network** - Monitor network traffic
- **Network Tools: Analyze Response** - Analyze HTTP response
- **Network Tools: Import Collection** - Import request collection
- **Network Tools: Export Collection** - Export request collection

### Context Menu

Right-click in the editor to access Network Tools commands from the context menu.

### Keyboard Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| Send HTTP Request | `Ctrl+Shift+R` | Send HTTP request |
| Analyze Response | `Ctrl+Shift+A` | Analyze HTTP response |

## 📝 Examples

### Sending HTTP Requests

1. Run "Network Tools: Send HTTP Request" from the Command Palette
2. Enter the request details:
   - Method: GET, POST, PUT, DELETE, PATCH, etc.
   - URL: The endpoint URL
   - Headers: Key-value pairs (e.g., Content-Type: application/json)
   - Body: Request body (for POST, PUT, PATCH requests)
3. Click "Send" to execute the request
4. The response will be displayed in a webview

### Monitoring Network

1. Run "Network Tools: Monitor Network" from the Command Palette
2. A network monitor will open in a webview
3. Monitor HTTP/HTTPS requests and responses in real-time
4. View request/response details, headers, and bodies

### Analyzing Responses

1. After sending a request, the response will be displayed
2. For existing response data, select it and press `Ctrl+Shift+A`
3. The extension will analyze the response and provide insights
4. View status codes, headers, body content, and performance metrics

### Managing Collections

1. Create collections to organize related requests
2. Add requests to collections for easy access
3. Use folders to further organize requests
4. Duplicate and modify requests as needed

### Importing Collections

1. Run "Network Tools: Import Collection" from the Command Palette
2. Select the collection file (JSON format)
3. The collection will be added to your workspace

### Exporting Collections

1. Run "Network Tools: Export Collection" from the Command Palette
2. Select the collection you want to export
3. Choose the export format (JSON)
4. Specify the output location
5. Click "Export" to save the collection

## 🔧 Configuration

The Network Tools extension doesn't require any specific configuration. It works out of the box with sensible defaults.

## 🐛 Troubleshooting

### Common Issues

- **Request failed**: Check your URL and network connectivity
- **No response**: Verify the endpoint is reachable
- **Import failed**: Ensure the collection file is in the correct format

### Supported Request Types

- HTTP/HTTPS requests
- All HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, etc.)
- Custom headers and body formats
- Authentication (Basic, Bearer token, API key)

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
