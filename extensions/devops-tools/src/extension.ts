import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface Pipeline {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  branch: string;
  commit: string;
  startedAt: string;
  completedAt?: string;
  stages: PipelineStage[];
}

interface PipelineStage {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  startedAt: string;
  completedAt?: string;
  jobs: PipelineJob[];
}

interface PipelineJob {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

interface Deployment {
  id: string;
  application: string;
  environment: string;
  version: string;
  status: 'deploying' | 'deployed' | 'failed' | 'rolling-back' | 'rolled-back';
  strategy: 'rolling' | 'blue-green' | 'canary';
  startedAt: string;
  completedAt?: string;
  deployer: string;
  commit: string;
}

interface Environment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  lastDeployment?: string;
  resources: {
    cpu: number;
    memory: number;
    instances: number;
  };
}

class DevOpsTools {
  private pipelines: Pipeline[] = [];
  private deployments: Deployment[] = [];
  private environments: Environment[] = [];
  private webViewPanels: Map<string, vscode.WebviewPanel> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample pipelines
    this.pipelines = [
      {
        id: 'pipeline-1',
        name: 'Main Pipeline',
        status: 'success',
        branch: 'main',
        commit: 'abc123',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3000000).toISOString(),
        stages: [
          {
            id: 'stage-1',
            name: 'Build',
            status: 'success',
            startedAt: new Date(Date.now() - 3600000).toISOString(),
            completedAt: new Date(Date.now() - 3500000).toISOString(),
            jobs: [
              {
                id: 'job-1',
                name: 'Compile',
                status: 'success',
                startedAt: new Date(Date.now() - 3600000).toISOString(),
                completedAt: new Date(Date.now() - 3550000).toISOString(),
                duration: 30
              },
              {
                id: 'job-2',
                name: 'Test',
                status: 'success',
                startedAt: new Date(Date.now() - 3550000).toISOString(),
                completedAt: new Date(Date.now() - 3500000).toISOString(),
                duration: 30
              }
            ]
          },
          {
            id: 'stage-2',
            name: 'Deploy',
            status: 'success',
            startedAt: new Date(Date.now() - 3500000).toISOString(),
            completedAt: new Date(Date.now() - 3000000).toISOString(),
            jobs: [
              {
                id: 'job-3',
                name: 'Staging',
                status: 'success',
                startedAt: new Date(Date.now() - 3500000).toISOString(),
                completedAt: new Date(Date.now() - 3200000).toISOString(),
                duration: 180
              },
              {
                id: 'job-4',
                name: 'Production',
                status: 'success',
                startedAt: new Date(Date.now() - 3200000).toISOString(),
                completedAt: new Date(Date.now() - 3000000).toISOString(),
                duration: 120
              }
            ]
          }
        ]
      },
      {
        id: 'pipeline-2',
        name: 'Feature Pipeline',
        status: 'running',
        branch: 'feature-branch',
        commit: 'def456',
        startedAt: new Date(Date.now() - 600000).toISOString(),
        stages: [
          {
            id: 'stage-3',
            name: 'Build',
            status: 'success',
            startedAt: new Date(Date.now() - 600000).toISOString(),
            completedAt: new Date(Date.now() - 500000).toISOString(),
            jobs: [
              {
                id: 'job-5',
                name: 'Compile',
                status: 'success',
                startedAt: new Date(Date.now() - 600000).toISOString(),
                completedAt: new Date(Date.now() - 550000).toISOString(),
                duration: 30
              },
              {
                id: 'job-6',
                name: 'Test',
                status: 'success',
                startedAt: new Date(Date.now() - 550000).toISOString(),
                completedAt: new Date(Date.now() - 500000).toISOString(),
                duration: 30
              }
            ]
          },
          {
            id: 'stage-4',
            name: 'Deploy',
            status: 'running',
            startedAt: new Date(Date.now() - 500000).toISOString(),
            jobs: [
              {
                id: 'job-7',
                name: 'Staging',
                status: 'running',
                startedAt: new Date(Date.now() - 500000).toISOString(),
                duration: 60
              }
            ]
          }
        ]
      }
    ];

    // Sample deployments
    this.deployments = [
      {
        id: 'deploy-1',
        application: 'Web App',
        environment: 'Production',
        version: 'v1.2.0',
        status: 'deployed',
        strategy: 'rolling',
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 6900000).toISOString(),
        deployer: 'John Doe',
        commit: 'abc123'
      },
      {
        id: 'deploy-2',
        application: 'API Service',
        environment: 'Staging',
        version: 'v2.1.0',
        status: 'deploying',
        strategy: 'blue-green',
        startedAt: new Date(Date.now() - 300000).toISOString(),
        deployer: 'Jane Smith',
        commit: 'def456'
      }
    ];

    // Sample environments
    this.environments = [
      {
        id: 'env-1',
        name: 'Development',
        type: 'development',
        url: 'http://dev.example.com',
        status: 'online',
        lastDeployment: '2024-01-15T10:00:00Z',
        resources: {
          cpu: 2,
          memory: 4,
          instances: 1
        }
      },
      {
        id: 'env-2',
        name: 'Staging',
        type: 'staging',
        url: 'http://staging.example.com',
        status: 'online',
        lastDeployment: '2024-01-15T14:30:00Z',
        resources: {
          cpu: 4,
          memory: 8,
          instances: 2
        }
      },
      {
        id: 'env-3',
        name: 'Production',
        type: 'production',
        url: 'https://example.com',
        status: 'online',
        lastDeployment: '2024-01-15T16:00:00Z',
        resources: {
          cpu: 8,
          memory: 16,
          instances: 4
        }
      }
    ];
  }

  async runPipeline() {
    const pipelineNames = this.pipelines.map(p => p.name);
    const selectedPipeline = await vscode.window.showQuickPick(pipelineNames, {
      title: 'Select Pipeline to Run',
      placeHolder: 'Choose a pipeline'
    });

    if (selectedPipeline) {
      const branch = await vscode.window.showInputBox({
        prompt: 'Enter Branch Name',
        placeHolder: 'e.g., main',
        value: 'main',
        ignoreFocusOut: true
      });

      if (branch) {
        vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Running Pipeline...',
          cancellable: true
        }, async (progress) => {
          progress.report({ increment: 0 });

          // Simulate pipeline execution
          await new Promise(resolve => setTimeout(resolve, 1000));
          progress.report({ increment: 25 });

          const newPipeline: Pipeline = {
            id: `pipeline-${Date.now()}`,
            name: selectedPipeline,
            status: 'running',
            branch,
            commit: Math.random().toString(36).substring(2, 8),
            startedAt: new Date().toISOString(),
            stages: [
              {
                id: `stage-${Date.now()}-1`,
                name: 'Build',
                status: 'running',
                startedAt: new Date().toISOString(),
                jobs: [
                  {
                    id: `job-${Date.now()}-1`,
                    name: 'Compile',
                    status: 'running',
                    startedAt: new Date().toISOString()
                  },
                  {
                    id: `job-${Date.now()}-2`,
                    name: 'Test',
                    status: 'pending',
                    startedAt: new Date().toISOString()
                  }
                ]
              },
              {
                id: `stage-${Date.now()}-2`,
                name: 'Deploy',
                status: 'pending',
                startedAt: new Date().toISOString(),
                jobs: [
                  {
                    id: `job-${Date.now()}-3`,
                    name: 'Staging',
                    status: 'pending',
                    startedAt: new Date().toISOString()
                  },
                  {
                    id: `job-${Date.now()}-4`,
                    name: 'Production',
                    status: 'pending',
                    startedAt: new Date().toISOString()
                  }
                ]
              }
            ]
          };

          this.pipelines.unshift(newPipeline);

          await new Promise(resolve => setTimeout(resolve, 2000));
          progress.report({ increment: 75 });

          // Update pipeline status
          newPipeline.status = 'success';
          newPipeline.completedAt = new Date().toISOString();
          newPipeline.stages.forEach(stage => {
            stage.status = 'success';
            stage.completedAt = new Date().toISOString();
            stage.jobs.forEach(job => {
              job.status = 'success';
              job.completedAt = new Date().toISOString();
              job.duration = Math.floor(Math.random() * 120) + 30;
            });
          });

          progress.report({ increment: 100 });

          vscode.window.showInformationMessage(`Pipeline "${selectedPipeline}" started successfully!`);
          this.viewPipelineStatus();
        });
      }
    }
  }

  async viewPipelineStatus() {
    const pipelineItems = this.pipelines.map(pipeline => ({
      label: pipeline.name,
      description: `${pipeline.status} | ${pipeline.branch} | ${pipeline.commit.substring(0, 7)}`,
      detail: `Started: ${new Date(pipeline.startedAt).toLocaleString()}`,
      pipeline
    }));

    const selected = await vscode.window.showQuickPick(pipelineItems, {
      title: 'Select Pipeline',
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (selected) {
      this.showPipelineDetails(selected.pipeline);
    }
  }

  private showPipelineDetails(pipeline: Pipeline) {
    const panelId = `pipeline-${pipeline.id}`;
    let panel = this.webViewPanels.get(panelId);

    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'pipelineDetails',
        `Pipeline: ${pipeline.name}`,
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      this.webViewPanels.set(panelId, panel);

      panel.onDidDispose(() => {
        this.webViewPanels.delete(panelId);
      });
    } else {
      panel.reveal(vscode.ViewColumn.Beside);
    }

    panel.webview.html = this.getPipelineDetailsHtml(pipeline);
  }

  private getPipelineDetailsHtml(pipeline: Pipeline): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pipeline Details</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
          h1 { color: #333; margin-top: 0; }
          .info { margin-bottom: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 4px; }
          .info-item { margin: 5px 0; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .status.running { background-color: #e6f7ff; color: #1890ff; }
          .status.success { background-color: #f6ffed; color: #52c41a; }
          .status.failed { background-color: #fff2f0; color: #ff4d4f; }
          .status.pending { background-color: #fff7e6; color: #faad14; }
          .stage { margin: 20px 0; border: 1px solid #e8e8e8; border-radius: 4px; overflow: hidden; }
          .stage-header { padding: 10px 15px; background-color: #fafafa; border-bottom: 1px solid #e8e8e8; display: flex; justify-content: space-between; align-items: center; }
          .stage-name { font-weight: 500; }
          .job { padding: 10px 15px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
          .job-name { flex: 1; }
          .job-duration { font-size: 12px; color: #666; margin: 0 10px; }
          .timestamps { font-size: 12px; color: #999; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${pipeline.name}</h1>
          <div class="info">
            <div class="info-item">
              <strong>Status:</strong> <span class="status ${pipeline.status}">${pipeline.status}</span>
            </div>
            <div class="info-item">
              <strong>Branch:</strong> ${pipeline.branch}
            </div>
            <div class="info-item">
              <strong>Commit:</strong> ${pipeline.commit}
            </div>
            <div class="info-item timestamps">
              <strong>Started:</strong> ${new Date(pipeline.startedAt).toLocaleString()}
              ${pipeline.completedAt ? ` | <strong>Completed:</strong> ${new Date(pipeline.completedAt).toLocaleString()}` : ''}
            </div>
          </div>

          ${pipeline.stages.map(stage => `
            <div class="stage">
              <div class="stage-header">
                <span class="stage-name">${stage.name}</span>
                <span class="status ${stage.status}">${stage.status}</span>
              </div>
              ${stage.jobs.map(job => `
                <div class="job">
                  <span class="job-name">${job.name}</span>
                  <span class="job-duration">${job.duration ? `${job.duration}s` : ''}</span>
                  <span class="status ${job.status}">${job.status}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  }

  async deployApplication() {
    const applications = ['Web App', 'API Service', 'Mobile Backend', 'Analytics Service'];
    const application = await vscode.window.showQuickPick(applications, {
      title: 'Select Application to Deploy',
      placeHolder: 'Choose an application'
    });

    if (application) {
      const environments = ['Development', 'Staging', 'Production'];
      const environment = await vscode.window.showQuickPick(environments, {
        title: 'Select Environment',
        placeHolder: 'Choose a deployment environment'
      });

      if (environment) {
        const version = await vscode.window.showInputBox({
          prompt: 'Enter Version Number',
          placeHolder: 'e.g., v1.0.0',
          ignoreFocusOut: true
        });

        if (version) {
          const strategies = ['rolling', 'blue-green', 'canary'];
          const strategy = await vscode.window.showQuickPick(strategies, {
            title: 'Select Deployment Strategy',
            placeHolder: 'Choose a deployment strategy'
          });

          if (strategy) {
            vscode.window.withProgress({
              location: vscode.ProgressLocation.Notification,
              title: 'Deploying Application...',
              cancellable: true
            }, async (progress) => {
              progress.report({ increment: 0 });

              // Simulate deployment process
              await new Promise(resolve => setTimeout(resolve, 1000));
              progress.report({ increment: 25 });

              const newDeployment: Deployment = {
                id: `deploy-${Date.now()}`,
                application,
                environment,
                version,
                status: 'deploying',
                strategy: strategy as 'rolling' | 'blue-green' | 'canary',
                startedAt: new Date().toISOString(),
                deployer: 'Current User',
                commit: Math.random().toString(36).substring(2, 8)
              };

              this.deployments.unshift(newDeployment);

              await new Promise(resolve => setTimeout(resolve, 2000));
              progress.report({ increment: 75 });

              // Update deployment status
              newDeployment.status = 'deployed';
              newDeployment.completedAt = new Date().toISOString();

              // Update environment last deployment
              const env = this.environments.find(e => e.name === environment);
              if (env) {
                env.lastDeployment = new Date().toISOString();
              }

              progress.report({ increment: 100 });

              vscode.window.showInformationMessage(`Application "${application}" deployed successfully to ${environment}!`);
              this.monitorDeployments();
            });
          }
        }
      }
    }
  }

  async rollbackDeployment() {
    if (this.deployments.length === 0) {
      vscode.window.showInformationMessage('No deployments available to rollback.');
      return;
    }

    const deploymentItems = this.deployments
      .filter(d => d.status === 'deployed')
      .map(deployment => ({
        label: `${deployment.application} (${deployment.environment})`,
        description: `Version: ${deployment.version} | Deployed: ${new Date(deployment.completedAt || deployment.startedAt).toLocaleString()}`,
        deployment
      }));

    if (deploymentItems.length === 0) {
      vscode.window.showInformationMessage('No successful deployments available to rollback.');
      return;
    }

    const selected = await vscode.window.showQuickPick(deploymentItems, {
      title: 'Select Deployment to Rollback',
      matchOnDescription: true
    });

    if (selected) {
      const confirmed = await vscode.window.showInformationMessage(
        `Are you sure you want to rollback the deployment of ${selected.deployment.application} to ${selected.deployment.environment}?`,
        { modal: true },
        'Rollback',
        'Cancel'
      );

      if (confirmed === 'Rollback') {
        vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: 'Rolling Back Deployment...',
          cancellable: true
        }, async (progress) => {
          progress.report({ increment: 0 });

          // Simulate rollback process
          await new Promise(resolve => setTimeout(resolve, 1500));
          progress.report({ increment: 50 });

          // Update deployment status
          const deployment = selected.deployment;
          deployment.status = 'rolled-back';
          deployment.completedAt = new Date().toISOString();

          progress.report({ increment: 100 });

          vscode.window.showInformationMessage(`Deployment rolled back successfully!`);
          this.monitorDeployments();
        });
      }
    }
  }

  async manageEnvironments() {
    const actions = [
      { label: 'View Environments', description: 'List all environments' },
      { label: 'Add Environment', description: 'Create a new environment' },
      { label: 'Edit Environment', description: 'Modify an existing environment' },
      { label: 'Delete Environment', description: 'Remove an environment' },
      { label: 'Restart Environment', description: 'Restart services in an environment' }
    ];

    const selectedAction = await vscode.window.showQuickPick(actions, {
      title: 'Manage Environments',
      matchOnDescription: true
    });

    if (selectedAction) {
      switch (selectedAction.label) {
        case 'View Environments':
          this.viewEnvironments();
          break;
        case 'Add Environment':
          await this.addEnvironment();
          break;
        case 'Edit Environment':
          await this.editEnvironment();
          break;
        case 'Delete Environment':
          await this.deleteEnvironment();
          break;
        case 'Restart Environment':
          await this.restartEnvironment();
          break;
      }
    }
  }

  private viewEnvironments() {
    const panelId = 'environments-view';
    let panel = this.webViewPanels.get(panelId);

    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'environmentsView',
        'Environments',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      this.webViewPanels.set(panelId, panel);

      panel.onDidDispose(() => {
        this.webViewPanels.delete(panelId);
      });
    } else {
      panel.reveal(vscode.ViewColumn.Beside);
    }

    panel.webview.html = this.getEnvironmentsHtml();
  }

  private getEnvironmentsHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Environments</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #333; margin-top: 0; }
          .environment-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
          .environment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .environment-name { font-size: 18px; font-weight: 500; color: #333; }
          .environment-type { font-size: 14px; color: #666; background-color: #f0f0f0; padding: 2px 8px; border-radius: 12px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .status.online { background-color: #f6ffed; color: #52c41a; }
          .status.offline { background-color: #fff2f0; color: #ff4d4f; }
          .status.maintenance { background-color: #fff7e6; color: #faad14; }
          .environment-details { margin: 10px 0; }
          .detail-item { margin: 5px 0; font-size: 14px; }
          .detail-label { display: inline-block; width: 120px; color: #666; }
          .resources { margin-top: 15px; padding-top: 15px; border-top: 1px solid #f0f0f0; }
          .resource-item { margin: 5px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Environments</h1>
          ${this.environments.map(env => `
            <div class="environment-card">
              <div class="environment-header">
                <div>
                  <div class="environment-name">${env.name}</div>
                  <div class="environment-type">${env.type}</div>
                </div>
                <span class="status ${env.status}">${env.status}</span>
              </div>
              <div class="environment-details">
                <div class="detail-item">
                  <span class="detail-label">URL:</span>
                  <a href="${env.url}" target="_blank">${env.url}</a>
                </div>
                ${env.lastDeployment ? `
                  <div class="detail-item">
                    <span class="detail-label">Last Deploy:</span>
                    ${new Date(env.lastDeployment).toLocaleString()}
                  </div>
                ` : ''}
              </div>
              <div class="resources">
                <h3>Resources</h3>
                <div class="resource-item">
                  <span class="detail-label">CPU:</span>
                  ${env.resources.cpu} cores
                </div>
                <div class="resource-item">
                  <span class="detail-label">Memory:</span>
                  ${env.resources.memory} GB
                </div>
                <div class="resource-item">
                  <span class="detail-label">Instances:</span>
                  ${env.resources.instances}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  }

  private async addEnvironment() {
    const name = await vscode.window.showInputBox({
      prompt: 'Environment Name',
      placeHolder: 'e.g., Staging US',
      ignoreFocusOut: true
    });

    if (name) {
      const types = ['development', 'staging', 'production'];
      const type = await vscode.window.showQuickPick(types, {
        title: 'Environment Type',
        placeHolder: 'Choose environment type'
      });

      if (type) {
        const url = await vscode.window.showInputBox({
          prompt: 'Environment URL',
          placeHolder: 'e.g., http://staging-us.example.com',
          ignoreFocusOut: true
        });

        if (url) {
          const newEnvironment: Environment = {
            id: `env-${Date.now()}`,
            name,
            type: type as 'development' | 'staging' | 'production',
            url,
            status: 'online',
            resources: {
              cpu: 2,
              memory: 4,
              instances: 1
            }
          };

          this.environments.push(newEnvironment);
          vscode.window.showInformationMessage(`Environment "${name}" added successfully!`);
          this.viewEnvironments();
        }
      }
    }
  }

  private async editEnvironment() {
    if (this.environments.length === 0) {
      vscode.window.showInformationMessage('No environments available to edit.');
      return;
    }

    const envItems = this.environments.map(env => ({
      label: env.name,
      description: `${env.type} | ${env.status}`,
      env
    }));

    const selected = await vscode.window.showQuickPick(envItems, {
      title: 'Select Environment to Edit',
      matchOnDescription: true
    });

    if (selected) {
      const newName = await vscode.window.showInputBox({
        prompt: 'Environment Name',
        value: selected.env.name,
        ignoreFocusOut: true
      });

      if (newName) {
        const newUrl = await vscode.window.showInputBox({
          prompt: 'Environment URL',
          value: selected.env.url,
          ignoreFocusOut: true
        });

        if (newUrl) {
          selected.env.name = newName;
          selected.env.url = newUrl;
          vscode.window.showInformationMessage(`Environment "${newName}" updated successfully!`);
          this.viewEnvironments();
        }
      }
    }
  }

  private async deleteEnvironment() {
    if (this.environments.length === 0) {
      vscode.window.showInformationMessage('No environments available to delete.');
      return;
    }

    const envItems = this.environments.map(env => ({
      label: env.name,
      description: `${env.type} | ${env.status}`,
      env
    }));

    const selected = await vscode.window.showQuickPick(envItems, {
      title: 'Select Environment to Delete',
      matchOnDescription: true
    });

    if (selected) {
      const confirmed = await vscode.window.showInformationMessage(
        `Are you sure you want to delete environment "${selected.env.name}"?`,
        { modal: true },
        'Delete',
        'Cancel'
      );

      if (confirmed === 'Delete') {
        this.environments = this.environments.filter(env => env.id !== selected.env.id);
        vscode.window.showInformationMessage(`Environment "${selected.env.name}" deleted successfully!`);
        this.viewEnvironments();
      }
    }
  }

  private async restartEnvironment() {
    if (this.environments.length === 0) {
      vscode.window.showInformationMessage('No environments available to restart.');
      return;
    }

    const envItems = this.environments.map(env => ({
      label: env.name,
      description: `${env.type} | ${env.status}`,
      env
    }));

    const selected = await vscode.window.showQuickPick(envItems, {
      title: 'Select Environment to Restart',
      matchOnDescription: true
    });

    if (selected) {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Restarting Environment...',
        cancellable: true
      }, async (progress) => {
        progress.report({ increment: 0 });

        // Simulate restart process
        selected.env.status = 'maintenance';
        await new Promise(resolve => setTimeout(resolve, 2000));
        progress.report({ increment: 50 });

        selected.env.status = 'online';
        await new Promise(resolve => setTimeout(resolve, 1000));
        progress.report({ increment: 100 });

        vscode.window.showInformationMessage(`Environment "${selected.env.name}" restarted successfully!`);
        this.viewEnvironments();
      });
    }
  }

  async monitorDeployments() {
    const panelId = 'deployments-monitor';
    let panel = this.webViewPanels.get(panelId);

    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'deploymentsMonitor',
        'Deployments Monitor',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      this.webViewPanels.set(panelId, panel);

      panel.onDidDispose(() => {
        this.webViewPanels.delete(panelId);
      });
    } else {
      panel.reveal(vscode.ViewColumn.Beside);
    }

    panel.webview.html = this.getDeploymentsHtml();
  }

  private getDeploymentsHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deployments Monitor</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #333; margin-top: 0; }
          .deployment-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
          .deployment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .deployment-app { font-size: 16px; font-weight: 500; color: #333; }
          .deployment-env { font-size: 14px; color: #666; background-color: #f0f0f0; padding: 2px 8px; border-radius: 12px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .status.deploying { background-color: #e6f7ff; color: #1890ff; }
          .status.deployed { background-color: #f6ffed; color: #52c41a; }
          .status.failed { background-color: #fff2f0; color: #ff4d4f; }
          .status.rolling-back { background-color: #fff7e6; color: #faad14; }
          .status.rolled-back { background-color: #f0f5ff; color: #722ed1; }
          .deployment-details { margin: 10px 0; }
          .detail-item { margin: 5px 0; font-size: 14px; }
          .detail-label { display: inline-block; width: 120px; color: #666; }
          .timestamps { margin-top: 15px; padding-top: 15px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Deployments Monitor</h1>
          ${this.deployments.map(deploy => `
            <div class="deployment-card">
              <div class="deployment-header">
                <div>
                  <div class="deployment-app">${deploy.application}</div>
                  <div class="deployment-env">${deploy.environment}</div>
                </div>
                <span class="status ${deploy.status}">${deploy.status}</span>
              </div>
              <div class="deployment-details">
                <div class="detail-item">
                  <span class="detail-label">Version:</span>
                  ${deploy.version}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Strategy:</span>
                  ${deploy.strategy}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Commit:</span>
                  ${deploy.commit}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Deployer:</span>
                  ${deploy.deployer}
                </div>
              </div>
              <div class="timestamps">
                <div>Started: ${new Date(deploy.startedAt).toLocaleString()}</div>
                ${deploy.completedAt ? `<div>Completed: ${new Date(deploy.completedAt).toLocaleString()}</div>` : ''}
              </div>
            </div>
          `).join('')}
          ${this.deployments.length === 0 ? '<p>No deployments found.</p>' : ''}
        </div>
      </body>
      </html>
    `;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('DevOps Tools extension activated');

  const devOpsTools = new DevOpsTools();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('devops-tools.runPipeline', () => devOpsTools.runPipeline()),
    vscode.commands.registerCommand('devops-tools.viewPipelineStatus', () => devOpsTools.viewPipelineStatus()),
    vscode.commands.registerCommand('devops-tools.deployApplication', () => devOpsTools.deployApplication()),
    vscode.commands.registerCommand('devops-tools.rollbackDeployment', () => devOpsTools.rollbackDeployment()),
    vscode.commands.registerCommand('devops-tools.manageEnvironments', () => devOpsTools.manageEnvironments()),
    vscode.commands.registerCommand('devops-tools.monitorDeployments', () => devOpsTools.monitorDeployments())
  );
}

export function deactivate() {
  console.log('DevOps Tools extension deactivated');
}
