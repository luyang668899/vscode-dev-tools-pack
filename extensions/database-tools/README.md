# Database Tools Extension

Database management tools for Visual Studio Code, providing database connection, query execution, query optimization, and data import/export capabilities.

## 🚀 Features

- **Database Connection**: Connect to various database systems
- **Query Execution**: Run SQL queries and view results
- **Query Optimization**: Optimize SQL queries for better performance
- **Data Import/Export**: Import and export data in various formats
- **Database Explorer**: Browse database schemas and objects

## 📦 Installation

1. Download the `database-tools-1.0.0.vsix` file
2. In VS Code, go to Extensions → More Actions → Install from VSIX...
3. Select the downloaded VSIX file
4. Reload VS Code to activate the extension

## 🛠️ Usage

### Command Palette

Open the Command Palette (`Ctrl+Shift+P`) and search for "Database Tools" to see all available commands:

- **Database Tools: Connect to Database** - Connect to a database
- **Database Tools: Run Query** - Run SQL query
- **Database Tools: Optimize Query** - Optimize SQL query
- **Database Tools: Export Data** - Export data from database
- **Database Tools: Import Data** - Import data into database

### Context Menu

Right-click in the editor to access Database Tools commands from the context menu.

### Keyboard Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| Run Query | `Ctrl+Shift+Q` | Run SQL query |
| Optimize Query | `Ctrl+Shift+O` | Optimize SQL query |

## 📝 Examples

### Connecting to Database

1. Run "Database Tools: Connect to Database" from the Command Palette
2. Select the database type (MySQL, PostgreSQL, SQL Server, etc.)
3. Enter connection details (host, port, username, password, database name)
4. Click "Connect" to establish the connection

### Running Queries

1. Open a SQL file or create a new one
2. Write your SQL query
3. Press `Ctrl+Shift+Q` or run "Database Tools: Run Query"
4. The results will be displayed in a webview

### Optimizing Queries

1. Select a SQL query you want to optimize
2. Press `Ctrl+Shift+O` or run "Database Tools: Optimize Query"
3. The extension will analyze the query and suggest optimizations
4. Apply the suggested optimizations if desired

### Exporting Data

1. Run "Database Tools: Export Data" from the Command Palette
2. Select the table or query results to export
3. Choose the export format (CSV, JSON, Excel, etc.)
4. Specify the output location
5. Click "Export" to save the data

### Importing Data

1. Run "Database Tools: Import Data" from the Command Palette
2. Select the import format (CSV, JSON, Excel, etc.)
3. Specify the input file location
4. Select the target table
5. Map columns if necessary
6. Click "Import" to load the data

## 🔧 Configuration

The Database Tools extension doesn't require any specific configuration. It works out of the box with sensible defaults.

## 🐛 Troubleshooting

### Common Issues

- **Connection failed**: Check your connection details and network connectivity
- **Query execution error**: Verify your SQL syntax and database permissions
- **Import/export failed**: Check file permissions and format compatibility

### Supported Databases

- MySQL
- PostgreSQL
- SQL Server
- SQLite
- MongoDB (basic support)

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
