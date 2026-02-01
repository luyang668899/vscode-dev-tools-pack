# DevOps Tools Extension

CI/CD integration and deployment management tools for Visual Studio Code, providing streamlined development workflows, pipeline management, and deployment monitoring capabilities.

## 🚀 Features

- **Pipeline Management**: Run and monitor CI/CD pipelines
- **Application Deployment**: Deploy applications to various environments
- **Deployment Rollback**: Rollback failed deployments
- **Environment Management**: Manage development, staging, and production environments
- **Deployment Monitoring**: Monitor deployment status and performance

## 📦 Installation

1. Download the `devops-tools-1.0.0.vsix` file
2. In VS Code, go to Extensions → More Actions → Install from VSIX...
3. Select the downloaded VSIX file
4. Reload VS Code to activate the extension

## 🛠️ Usage

### Command Palette

Open the Command Palette (`Ctrl+Shift+P`) and search for "DevOps" to see all available commands:

- **DevOps: Run Pipeline** - Run a CI/CD pipeline
- **DevOps: View Pipeline Status** - View pipeline execution status
- **DevOps: Deploy Application** - Deploy an application
- **DevOps: Rollback Deployment** - Rollback a deployment
- **DevOps: Manage Environments** - Manage environments
- **DevOps: Monitor Deployments** - Monitor deployments

### Context Menu

Right-click in the editor to access DevOps Tools commands from the context menu.

### Keyboard Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| Run Pipeline | `Ctrl+Shift+R` | Run CI/CD pipeline |
| View Pipeline Status | `Ctrl+Shift+S` | View pipeline status |
| Deploy Application | `Ctrl+Shift+D` | Deploy application |

## 📝 Examples

### Running Pipelines

1. Press `Ctrl+Shift+R` or run "DevOps: Run Pipeline" from the Command Palette
2. Select a pipeline from the list
3. Enter the branch name (default: main)
4. Click "Run" to start the pipeline
5. The pipeline execution will be monitored in real-time
6. View the pipeline stages and jobs as they execute

### Viewing Pipeline Status

1. Press `Ctrl+Shift+S` or run "DevOps: View Pipeline Status" from the Command Palette
2. Select a pipeline from the list of recent pipelines
3. A webview will open showing the pipeline details
4. View the status of each stage and job
5. Check execution times and logs

### Deploying Applications

1. Press `Ctrl+Shift+D` or run "DevOps: Deploy Application" from the Command Palette
2. Select an application from the list
3. Select the target environment (Development, Staging, Production)
4. Enter the version to deploy
5. Select the deployment strategy:
   - **Rolling**: Gradual deployment with zero downtime
   - **Blue-Green**: Complete environment switch
   - **Canary**: Deploy to a subset of instances first
6. Click "Deploy" to start the deployment
7. Monitor the deployment progress in real-time

### Rolling Back Deployments

1. Run "DevOps: Rollback Deployment" from the Command Palette
2. Select a deployed application from the list
3. Select the environment to rollback
4. Confirm the rollback operation
5. The extension will initiate the rollback
6. Monitor the rollback progress

### Managing Environments

1. Run "DevOps: Manage Environments" from the Command Palette
2. Select an action:
   - **View Environments**: List all environments
   - **Add Environment**: Create a new environment
   - **Edit Environment**: Modify an existing environment
   - **Delete Environment**: Remove an environment
   - **Restart Environment**: Restart services in an environment
3. Follow the prompts to complete the action

### Monitoring Deployments

1. Run "DevOps: Monitor Deployments" from the Command Palette
2. A webview will open showing all recent deployments
3. View deployment status, versions, and timestamps
4. Filter deployments by application or environment
5. Click on a deployment to view detailed information

## 🔧 Configuration

The DevOps Tools extension doesn't require any specific configuration. It works out of the box with sensible defaults.

## 🐛 Troubleshooting

### Common Issues

- **Pipeline failed**: Check pipeline configuration and logs
- **Deployment failed**: Verify environment connectivity and application compatibility
- **Environment not found**: Ensure environments are properly configured

### Supported CI/CD Systems

- Jenkins
- GitHub Actions
- GitLab CI
- Azure DevOps
- CircleCI
- Travis CI

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
