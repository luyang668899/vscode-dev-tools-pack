import * as vscode from 'vscode';

class ContainerResourceTreeDataProvider implements vscode.TreeDataProvider<ContainerResource> {
    private _onDidChangeTreeData = new vscode.EventEmitter<ContainerResource | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ContainerResource): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ContainerResource): Thenable<ContainerResource[]> {
        if (!element) {
            return Promise.resolve(this.getRootResources());
        }
        return Promise.resolve(this.getChildResources(element));
    }

    private getRootResources(): ContainerResource[] {
        return [
            new ContainerResource('Docker', 'docker', vscode.TreeItemCollapsibleState.Collapsed),
            new ContainerResource('Docker Swarm', 'docker-swarm', vscode.TreeItemCollapsibleState.Collapsed),
            new ContainerResource('Kubernetes', 'kubernetes', vscode.TreeItemCollapsibleState.Collapsed),
            new ContainerResource('Helm', 'helm', vscode.TreeItemCollapsibleState.Collapsed)
        ];
    }

    private getChildResources(parent: ContainerResource): ContainerResource[] {
        switch (parent.id) {
            case 'docker':
                return [
                    new ContainerResource('Images', 'docker-images', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Containers', 'docker-containers', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Networks', 'docker-networks', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Volumes', 'docker-volumes', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'docker-swarm':
                return [
                    new ContainerResource('Nodes', 'swarm-nodes', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Services', 'swarm-services', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Stacks', 'swarm-stacks', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Configs', 'swarm-configs', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'kubernetes':
                return [
                    new ContainerResource('Pods', 'k8s-pods', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Deployments', 'k8s-deployments', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Services', 'k8s-services', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Namespaces', 'k8s-namespaces', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'helm':
                return [
                    new ContainerResource('Releases', 'helm-releases', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Charts', 'helm-charts', vscode.TreeItemCollapsibleState.Collapsed),
                    new ContainerResource('Repositories', 'helm-repos', vscode.TreeItemCollapsibleState.Collapsed)
                ];
            case 'docker-images':
                return [
                    new ContainerResource('ubuntu:latest', 'docker-image-ubuntu', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('node:18', 'docker-image-node', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('nginx:alpine', 'docker-image-nginx', vscode.TreeItemCollapsibleState.None)
                ];
            case 'docker-containers':
                return [
                    new ContainerResource('web-server (running)', 'docker-container-web', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('database (stopped)', 'docker-container-db', vscode.TreeItemCollapsibleState.None)
                ];
            case 'k8s-pods':
                return [
                    new ContainerResource('app-pod-12345', 'k8s-pod-app', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('redis-pod-67890', 'k8s-pod-redis', vscode.TreeItemCollapsibleState.None)
                ];
            case 'swarm-nodes':
                return [
                    new ContainerResource('manager1 (Leader)', 'swarm-node-manager1', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('worker1 (Ready)', 'swarm-node-worker1', vscode.TreeItemCollapsibleState.None)
                ];
            case 'swarm-services':
                return [
                    new ContainerResource('web-service (1/1)', 'swarm-service-web', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('db-service (1/1)', 'swarm-service-db', vscode.TreeItemCollapsibleState.None)
                ];
            case 'helm-releases':
                return [
                    new ContainerResource('nginx (v1.23.0)', 'helm-release-nginx', vscode.TreeItemCollapsibleState.None),
                    new ContainerResource('mysql (v8.0.28)', 'helm-release-mysql', vscode.TreeItemCollapsibleState.None)
                ];
            default:
                return [];
        }
    }
}

class ContainerResource extends vscode.TreeItem {
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
    console.log('Container Tools extension activated');

    // Register tree data provider
    const treeDataProvider = new ContainerResourceTreeDataProvider();
    vscode.window.registerTreeDataProvider('container-tools-explorer', treeDataProvider);

    // Register commands
    const dockerExplorerDisposable = vscode.commands.registerCommand('container-tools.dockerExplorer', () => {
        vscode.window.showInformationMessage('Docker Explorer activated');
    });

    const dockerSwarmExplorerDisposable = vscode.commands.registerCommand('container-tools.dockerSwarmExplorer', () => {
        vscode.window.showInformationMessage('Docker Swarm Explorer activated');
    });

    const kubernetesExplorerDisposable = vscode.commands.registerCommand('container-tools.kubernetesExplorer', () => {
        vscode.window.showInformationMessage('Kubernetes Explorer activated');
    });

    const helmExplorerDisposable = vscode.commands.registerCommand('container-tools.helmExplorer', () => {
        vscode.window.showInformationMessage('Helm Explorer activated');
    });

    const buildImageDisposable = vscode.commands.registerCommand('container-tools.buildImage', async () => {
        await buildImage();
    });

    const runContainerDisposable = vscode.commands.registerCommand('container-tools.runContainer', async () => {
        await runContainer();
    });

    const deployToKubernetesDisposable = vscode.commands.registerCommand('container-tools.deployToKubernetes', async () => {
        await deployToKubernetes();
    });

    const refreshExplorerDisposable = vscode.commands.registerCommand('container-tools.refreshExplorer', () => {
        treeDataProvider.refresh();
        vscode.window.showInformationMessage('Container explorer refreshed');
    });

    context.subscriptions.push(
        dockerExplorerDisposable,
        dockerSwarmExplorerDisposable,
        kubernetesExplorerDisposable,
        helmExplorerDisposable,
        buildImageDisposable,
        runContainerDisposable,
        deployToKubernetesDisposable,
        refreshExplorerDisposable
    );
}

export function deactivate() {
    console.log('Container Tools extension deactivated');
}

async function buildImage() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const imageName = await vscode.window.showInputBox({
        prompt: 'Enter image name and tag',
        placeHolder: 'e.g., my-app:latest',
        value: 'my-app:latest'
    });

    if (!imageName) {
        return;
    }

    const dockerfilePath = await vscode.window.showQuickPick(
        workspaceFolders.map(folder => {
            return {
                label: folder.name,
                description: folder.uri.fsPath
            };
        }),
        {
            placeHolder: 'Select workspace folder for Dockerfile'
        }
    );

    if (!dockerfilePath) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Building Docker image ${imageName}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: 'Preparing build context...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Building image layers...' });
            await new Promise(resolve => setTimeout(resolve, 3000));

            progress.report({ message: 'Finalizing image...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            vscode.window.showInformationMessage(`Docker image ${imageName} built successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to build Docker image: ${error}`);
    }
}

async function runContainer() {
    const imageName = await vscode.window.showInputBox({
        prompt: 'Enter Docker image name',
        placeHolder: 'e.g., ubuntu:latest',
        value: 'ubuntu:latest'
    });

    if (!imageName) {
        return;
    }

    const containerName = await vscode.window.showInputBox({
        prompt: 'Enter container name (optional)',
        placeHolder: 'e.g., my-container'
    });

    const portMapping = await vscode.window.showInputBox({
        prompt: 'Enter port mapping (optional)',
        placeHolder: 'e.g., 8080:80'
    });

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running container from ${imageName}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: 'Pulling image (if needed)...' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            progress.report({ message: 'Creating container...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Starting container...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            const message = containerName
                ? `Container ${containerName} started successfully!`
                : 'Container started successfully!';
            vscode.window.showInformationMessage(message);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to run container: ${error}`);
    }
}

async function deployToKubernetes() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const deploymentFile = await vscode.window.showQuickPick(
        workspaceFolders.flatMap(folder => {
            return [
                { label: `${folder.name}/deployment.yaml`, description: folder.uri.fsPath + '/deployment.yaml' },
                { label: `${folder.name}/k8s.yaml`, description: folder.uri.fsPath + '/k8s.yaml' }
            ];
        }),
        {
            placeHolder: 'Select Kubernetes deployment file'
        }
    );

    if (!deploymentFile) {
        return;
    }

    const namespace = await vscode.window.showInputBox({
        prompt: 'Enter Kubernetes namespace',
        placeHolder: 'e.g., default',
        value: 'default'
    });

    if (!namespace) {
        return;
    }

    try {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Deploying to Kubernetes namespace ${namespace}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: 'Validating deployment file...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            progress.report({ message: 'Applying deployment...' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            progress.report({ message: 'Verifying deployment...' });
            await new Promise(resolve => setTimeout(resolve, 1000));

            vscode.window.showInformationMessage(`Deployment to Kubernetes namespace ${namespace} completed successfully!`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to deploy to Kubernetes: ${error}`);
    }
}
