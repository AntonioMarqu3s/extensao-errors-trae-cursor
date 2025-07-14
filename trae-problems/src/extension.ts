// Módulo 'vscode' contém a API de extensibilidade do VS Code
import * as vscode from 'vscode';

// Interface para representar um problema
interface Problem {
	file: string;
	line: number;
	column: number;
	message: string;
	severity: vscode.DiagnosticSeverity;
	source?: string;
	code?: string | number;
}

// Interface para agrupar problemas por arquivo
interface ProblemsGroup {
	file: string;
	problems: Problem[];
	errorCount: number;
	warningCount: number;
	infoCount: number;
	hintCount: number;
}

// Classe principal do visualizador de problemas
class ProblemsViewer {
	private panel: vscode.WebviewPanel | undefined;
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	// Coleta todos os diagnósticos do workspace
	private collectProblems(): ProblemsGroup[] {
		const problemsMap = new Map<string, Problem[]>();

		// Obter todos os diagnósticos
		vscode.languages.getDiagnostics().forEach(([uri, diagnostics]) => {
			const filePath = uri.fsPath;
			const problems: Problem[] = diagnostics.map(diagnostic => ({
				file: filePath,
				line: diagnostic.range.start.line + 1,
				column: diagnostic.range.start.character + 1,
				message: diagnostic.message,
				severity: diagnostic.severity || vscode.DiagnosticSeverity.Error,
				source: diagnostic.source,
				code: diagnostic.code?.toString()
			}));

			if (problems.length > 0) {
				problemsMap.set(filePath, problems);
			}
		});

		// Converter para array de grupos
		return Array.from(problemsMap.entries()).map(([file, problems]) => {
			const group: ProblemsGroup = {
				file,
				problems,
				errorCount: problems.filter(p => p.severity === vscode.DiagnosticSeverity.Error).length,
				warningCount: problems.filter(p => p.severity === vscode.DiagnosticSeverity.Warning).length,
				infoCount: problems.filter(p => p.severity === vscode.DiagnosticSeverity.Information).length,
				hintCount: problems.filter(p => p.severity === vscode.DiagnosticSeverity.Hint).length
			};
			return group;
		}).sort((a, b) => {
			// Ordenar por número de erros (decrescente), depois por nome do arquivo
			if (a.errorCount !== b.errorCount) {
				return b.errorCount - a.errorCount;
			}
			return a.file.localeCompare(b.file);
		});
	}

	// Gera o HTML para a interface do webview
	private generateHtml(problemsGroups: ProblemsGroup[]): string {
		const totalErrors = problemsGroups.reduce((sum, group) => sum + group.errorCount, 0);
		const totalWarnings = problemsGroups.reduce((sum, group) => sum + group.warningCount, 0);
		const totalInfo = problemsGroups.reduce((sum, group) => sum + group.infoCount, 0);
		const totalHints = problemsGroups.reduce((sum, group) => sum + group.hintCount, 0);

		const problemsHtml = problemsGroups.map(group => {
			const fileName = group.file.split('\\').pop() || group.file;
			const problemsListHtml = group.problems.map(problem => {
				const severityClass = this.getSeverityClass(problem.severity);
				const severityIcon = this.getSeverityIcon(problem.severity);
				return `
					<div class="problem-item severity-${severityClass}">
						<div class="problem-line">
							<input type="checkbox" class="problem-checkbox"> ${severityIcon} ${this.escapeHtml(problem.message)} - <span class="problem-location">[Ln ${problem.line}, Col ${problem.column}]</span>
						</div>
					</div>
				`;
			}).join('');

			return `
				<div class="file-group">
					<div class="file-header">
						<h3 class="file-name">${this.escapeHtml(fileName)}</h3>
						<div class="file-stats">
							${group.errorCount > 0 ? `<span class="stat-error">${group.errorCount} erro${group.errorCount !== 1 ? 's' : ''}</span>` : ''}
							${group.warningCount > 0 ? `<span class="stat-warning">${group.warningCount} aviso${group.warningCount !== 1 ? 's' : ''}</span>` : ''}
							${group.infoCount > 0 ? `<span class="stat-info">${group.infoCount} info${group.infoCount !== 1 ? 's' : ''}</span>` : ''}
							${group.hintCount > 0 ? `<span class="stat-hint">${group.hintCount} dica${group.hintCount !== 1 ? 's' : ''}</span>` : ''}
						</div>
					</div>
					<div class="problems-list">
						${problemsListHtml}
					</div>
				</div>
			`;
		}).join('');

		return `
			<!DOCTYPE html>
			<html lang="pt-BR">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
				<title>Visualizador de Problemas - Trae</title>
				<style>
					body {
						font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
						margin: 0;
						padding: 20px;
						background-color: var(--vscode-editor-background);
						color: var(--vscode-editor-foreground);
						line-height: 1.6;
					}

					.header {
						margin-bottom: 20px;
						padding: 15px;
						background-color: var(--vscode-panel-background);
						border-radius: 8px;
						border: 1px solid var(--vscode-panel-border);
						display: flex;
						flex-direction: column;
						gap: 15px;
					}

					.header-left {
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
					}

					.header-actions {
						display: flex;
						gap: 12px;
						align-items: center;
					}

					.action-btn {
						display: flex;
						align-items: center;
						gap: 8px;
						padding: 10px 16px;
						border: none;
						border-radius: 8px;
						font-size: 13px;
						font-weight: 500;
						cursor: pointer;
						transition: all 0.2s ease;
						position: relative;
						overflow: hidden;
					}

					.action-btn::before {
						content: '';
						position: absolute;
						top: 0;
						left: -100%;
						width: 100%;
						height: 100%;
						background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
						transition: left 0.5s ease;
					}

					.action-btn:hover::before {
						left: 100%;
					}

					.refresh-btn {
						background: linear-gradient(135deg, #4CAF50, #45a049);
						color: white;
						box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
					}

					.refresh-btn:hover {
						background: linear-gradient(135deg, #45a049, #4CAF50);
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
					}

					.refresh-btn:active {
						transform: translateY(0);
						box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
					}

					.copy-btn {
						background: linear-gradient(135deg, #2196F3, #1976D2);
						color: white;
						box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
					}

					.copy-btn:hover {
						background: linear-gradient(135deg, #1976D2, #2196F3);
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
					}

					.copy-btn:active {
						transform: translateY(0);
						box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
					}

					.copy-errors-btn {
						background: linear-gradient(135deg, #f44336, #d32f2f);
						color: white;
						box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
					}

					.copy-errors-btn:hover {
						background: linear-gradient(135deg, #d32f2f, #f44336);
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
					}

					.copy-errors-btn:active {
						transform: translateY(0);
						box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);
					}

					.copy-warnings-btn {
						background: linear-gradient(135deg, #ff9800, #f57c00);
						color: white;
						box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
					}

					.copy-warnings-btn:hover {
						background: linear-gradient(135deg, #f57c00, #ff9800);
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
					}

					.copy-warnings-btn:active {
						transform: translateY(0);
						box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
					}

					.copy-hints-btn {
						background: linear-gradient(135deg, #9c27b0, #7b1fa2);
						color: white;
						box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
					}

					.copy-hints-btn:hover {
						background: linear-gradient(135deg, #7b1fa2, #9c27b0);
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
					}

					.copy-hints-btn:active {
						transform: translateY(0);
						box-shadow: 0 2px 6px rgba(156, 39, 176, 0.3);
					}

					.action-btn svg {
						transition: transform 0.2s ease;
					}

					.refresh-btn:hover svg {
						transform: rotate(180deg);
					}

					.copy-btn:hover svg {
						transform: scale(1.1);
					}



					.header h1 {
						margin: 0 0 10px 0;
						color: var(--vscode-titleBar-activeForeground);
						font-size: 24px;
					}

					.summary {
						display: flex;
						gap: 15px;
						align-items: center;
						flex-wrap: wrap;
					}

					.summary-item {
						padding: 8px 12px;
						border-radius: 6px;
						font-weight: 600;
						font-size: 14px;
					}

					.summary-item.errors {
						background-color: var(--vscode-errorForeground);
						color: white;
					}

					.summary-item.warnings {
						background-color: var(--vscode-warningForeground);
						color: white;
					}

					.summary-item.info {
						background-color: var(--vscode-notificationsInfoIcon-foreground);
						color: white;
					}

					.summary-item.hints {
						background-color: var(--vscode-editorHint-foreground);
						color: white;
					}

					.file-group {
						margin-bottom: 20px;
						border: 1px solid var(--vscode-panel-border);
						border-radius: 8px;
						overflow: hidden;
						background-color: var(--vscode-panel-background);
					}

					.file-header {
						padding: 12px 16px;
						background-color: var(--vscode-titleBar-activeBackground);
						border-bottom: 1px solid var(--vscode-panel-border);
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.file-header h3.file-name {
						margin: 0;
						font-size: 14px;
						font-weight: 600;
						color: var(--vscode-titleBar-activeForeground);
					}

					.file-stats {
						display: flex;
						gap: 8px;
						flex-wrap: wrap;
					}

					.file-stats span {
						padding: 2px 6px;
						border-radius: 4px;
						font-size: 11px;
						font-weight: 500;
						color: white;
					}

					.stat-error {
						background-color: var(--vscode-errorForeground) !important;
					}

					.stat-warning {
						background-color: var(--vscode-warningForeground) !important;
					}

					.stat-info {
						background-color: var(--vscode-notificationsInfoIcon-foreground) !important;
					}

					.stat-hint {
						background-color: var(--vscode-editorHint-foreground) !important;
					}

					.problems-list {
						padding: 8px;
					}

					.problem-item {
						padding: 6px 8px;
						border-bottom: 1px solid var(--vscode-panel-border);
						font-size: 12px;
						line-height: 1.4;
						display: flex;
						align-items: flex-start;
						gap: 8px;
					}

					.problem-item:last-child {
						border-bottom: none;
					}

					.problem-checkbox {
						margin: 0;
						margin-top: 2px;
						flex-shrink: 0;
					}

					.problem-line {
						color: var(--vscode-editor-foreground);
						flex: 1;
					}

					.problem-location {
						color: var(--vscode-descriptionForeground);
						font-family: var(--vscode-editor-font-family);
					}

					.severity-error .problem-line {
						border-left: 2px solid var(--vscode-errorForeground);
						padding-left: 6px;
					}

					.severity-warning .problem-line {
						border-left: 2px solid var(--vscode-warningForeground);
						padding-left: 6px;
					}

					.severity-info .problem-line {
						border-left: 2px solid var(--vscode-infoForeground);
						padding-left: 6px;
					}

					.severity-hint .problem-line {
						border-left: 2px solid var(--vscode-hintForeground);
						padding-left: 6px;
					}

					.no-problems {
						text-align: center;
						padding: 40px 20px;
						color: var(--vscode-descriptionForeground);
						font-size: 16px;
					}

					.no-problems .icon {
						font-size: 48px;
						margin-bottom: 10px;
						display: block;
					}
				</style>
			</head>
			<body>
				<div class="header">
					<div class="header-left">
						<h1>🔍 Visualizador de Problemas - Trae</h1>
					</div>
					<div class="header-actions">
						<button id="refreshBtn" class="action-btn refresh-btn" title="Atualizar problemas">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
							</svg>
							<span>Atualizar</span>
						</button>
						<button id="copyAllBtn" class="action-btn copy-btn" title="Copiar todos os problemas em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>📋 Copiar Tudo MD</span>
						</button>
						<button id="copyErrorsBtn" class="action-btn copy-errors-btn" title="Copiar apenas erros em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>❌ Copiar Erros MD</span>
						</button>
						<button id="copyWarningsBtn" class="action-btn copy-warnings-btn" title="Copiar apenas avisos em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>⚠️ Copiar Avisos MD</span>
						</button>
						<button id="copyHintsBtn" class="action-btn copy-hints-btn" title="Copiar apenas dicas em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>💡 Copiar Dicas MD</span>
						</button>
					</div>
					<div class="summary">
						${totalErrors > 0 ? `<div class="summary-item errors">❌ ${totalErrors} Erro${totalErrors !== 1 ? 's' : ''}</div>` : ''}
						${totalWarnings > 0 ? `<div class="summary-item warnings">⚠️ ${totalWarnings} Aviso${totalWarnings !== 1 ? 's' : ''}</div>` : ''}
						${totalInfo > 0 ? `<div class="summary-item info">ℹ️ ${totalInfo} Informação${totalInfo !== 1 ? 'ões' : ''}</div>` : ''}
						${totalHints > 0 ? `<div class="summary-item hints">💡 ${totalHints} Dica${totalHints !== 1 ? 's' : ''}</div>` : ''}
					</div>
				</div>

				<div class="problems-container">
					${problemsGroups.length > 0 ? problemsHtml : `
						<div class="no-problems">
							<span class="icon">✅</span>
							<div>Nenhum problema encontrado!</div>
							<div style="font-size: 14px; margin-top: 10px;">Seu código está limpo e sem erros detectados.</div>
						</div>
					`}
				</div>

				<script>
					const vscode = acquireVsCodeApi();

					// Botão de atualizar
					document.getElementById('refreshBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'refresh' });
					});

					// Botão de copiar todos
					document.getElementById('copyAllBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyAll' });
					});

					// Botão de copiar erros
					document.getElementById('copyErrorsBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyErrors' });
					});

					// Botão de copiar avisos
					document.getElementById('copyWarningsBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyWarnings' });
					});

					// Botão de copiar dicas
					document.getElementById('copyHintsBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyHints' });
					});
				</script>
			</body>
			</html>
		`;
	}

	// Utilitários para HTML
	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	private getSeverityClass(severity: vscode.DiagnosticSeverity): string {
		switch (severity) {
			case vscode.DiagnosticSeverity.Error:
				return 'error';
			case vscode.DiagnosticSeverity.Warning:
				return 'warning';
			case vscode.DiagnosticSeverity.Information:
				return 'info';
			case vscode.DiagnosticSeverity.Hint:
				return 'hint';
			default:
				return 'error';
		}
	}

	private getSeverityIcon(severity: vscode.DiagnosticSeverity): string {
		switch (severity) {
			case vscode.DiagnosticSeverity.Error:
				return '❌';
			case vscode.DiagnosticSeverity.Warning:
				return '⚠️';
			case vscode.DiagnosticSeverity.Information:
				return 'ℹ️';
			case vscode.DiagnosticSeverity.Hint:
				return '💡';
			default:
				return '❌';
		}
	}



	// Mostrar o painel de problemas
	public show(): void {
		if (this.panel) {
			this.panel.reveal(vscode.ViewColumn.One);
			return;
		}

		this.panel = vscode.window.createWebviewPanel(
			'traeProblems',
			'🔍 Visualizador de Problemas - Trae',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: []
			}
		);

		// Configurar CSP mais permissivo para permitir scripts inline
		this.panel.webview.options = {
			enableScripts: true,
			localResourceRoots: []
		};

		this.updateContent();

			// Lidar com mensagens do webview
		this.panel.webview.onDidReceiveMessage(
			message => {
					switch (message.command) {
						case 'refresh':
							this.updateContent();
							vscode.window.showInformationMessage('🔄 Problemas atualizados!');
							break;
						case 'copyAll':
							this.copyAllProblems();
							break;
						case 'copyErrors':
							this.copyErrorsOnly();
							break;
						case 'copyWarnings':
							this.copyWarningsOnly();
							break;
						case 'copyHints':
							this.copyHintsOnly();
							break;
					}
				},
			undefined,
			this.context.subscriptions
		);

		// Limpar quando o painel for fechado
		this.panel.onDidDispose(
			() => {
				this.panel = undefined;
			},
			undefined,
			this.context.subscriptions
		);
	}

	// Atualizar o conteúdo do painel
	public updateContent(): void {
		if (!this.panel) {
			return;
		}

		const problemsGroups = this.collectProblems();
		this.panel.webview.html = this.generateHtml(problemsGroups);
	}

	// Copiar todos os problemas
	private copyAllProblems() {
		const problemsGroups = this.collectProblems();
		let allText = '# 📋 Relatório de Problemas - Trae\n\n';

		const totalErrors = problemsGroups.reduce((sum, group) => sum + group.errorCount, 0);
		const totalWarnings = problemsGroups.reduce((sum, group) => sum + group.warningCount, 0);
		const totalInfo = problemsGroups.reduce((sum, group) => sum + group.infoCount, 0);
		const totalHints = problemsGroups.reduce((sum, group) => sum + group.hintCount, 0);

		allText += `## 📊 Resumo Geral\n\n`;
		allText += `- 🔴 **Erros:** ${totalErrors}\n`;
		allText += `- ⚠️ **Avisos:** ${totalWarnings}\n`;
		allText += `- ℹ️ **Informações:** ${totalInfo}\n`;
		allText += `- 💡 **Dicas:** ${totalHints}\n`;
		allText += `- 📁 **Arquivos com problemas:** ${problemsGroups.length}\n\n`;

		problemsGroups.forEach((group, groupIndex) => {
			const fileName = group.file.split('\\').pop() || group.file;
			allText += `## 📁 ${fileName}\n\n`;
			allText += `**Caminho:** \`${group.file}\`\n\n`;
			allText += `**Estatísticas:** 🔴 ${group.errorCount} | ⚠️ ${group.warningCount} | ℹ️ ${group.infoCount} | 💡 ${group.hintCount}\n\n`;

			group.problems.forEach((problem) => {
				const severityIcon = this.getSeverityIcon(problem.severity);
				allText += `- [ ] ${severityIcon} ${problem.message} - **Linha ${problem.line}, Coluna ${problem.column}**`;
				if (problem.source) {
					allText += ` [${problem.source}]`;
				}
				if (problem.code) {
					allText += ` (${problem.code})`;
				}
				allText += '\n';
			});

			allText += '\n';
		});

		allText += '---\n\n';
		allText += `**📅 Gerado em:** ${new Date().toLocaleString('pt-BR')}\n\n`;
		allText += '**🔧 Extensão:** Trae Problems Viewer\n\n';
		allText += '**📋 Formato:** Checklist Markdown para correção de problemas';

		vscode.env.clipboard.writeText(allText).then(() => {
			vscode.window.showInformationMessage('📋 Todos os problemas copiados em formato Markdown!');
		});
	}

	// Copiar apenas erros
	private copyErrorsOnly() {
		const problemsGroups = this.collectProblems();
		let errorsText = '# ❌ Relatório de Erros - Trae\n\n';

		const totalErrors = problemsGroups.reduce((sum, group) => sum + group.errorCount, 0);

		if (totalErrors === 0) {
			vscode.window.showInformationMessage('✅ Nenhum erro encontrado!');
			return;
		}

		errorsText += `## 📊 Resumo de Erros\n\n`;
		errorsText += `- 🔴 **Total de Erros:** ${totalErrors}\n`;
		errorsText += `- 📁 **Arquivos com erros:** ${problemsGroups.filter(g => g.errorCount > 0).length}\n\n`;

		problemsGroups.forEach((group) => {
			if (group.errorCount === 0) return;

			const fileName = group.file.split('\\').pop() || group.file;
			errorsText += `## 📁 ${fileName}\n\n`;
			errorsText += `**Caminho:** \`${group.file}\`\n\n`;
			errorsText += `**Erros encontrados:** 🔴 ${group.errorCount}\n\n`;

			group.problems.forEach((problem) => {
				if (problem.severity === vscode.DiagnosticSeverity.Error) {
					errorsText += `- [ ] ❌ ${problem.message} - **Linha ${problem.line}, Coluna ${problem.column}**`;
					if (problem.source) {
						errorsText += ` [${problem.source}]`;
					}
					if (problem.code) {
						errorsText += ` (${problem.code})`;
					}
					errorsText += '\n';
				}
			});

			errorsText += '\n';
		});

		errorsText += '---\n\n';
		errorsText += `**📅 Gerado em:** ${new Date().toLocaleString('pt-BR')}\n\n`;
		errorsText += '**🔧 Extensão:** Trae Problems Viewer\n\n';
		errorsText += '**📋 Formato:** Checklist Markdown - Apenas Erros';

		vscode.env.clipboard.writeText(errorsText).then(() => {
			vscode.window.showInformationMessage('❌ Erros copiados em formato Markdown!');
		});
	}

	// Copiar apenas avisos
	private copyWarningsOnly() {
		const problemsGroups = this.collectProblems();
		let warningsText = '# ⚠️ Relatório de Avisos - Trae\n\n';

		const totalWarnings = problemsGroups.reduce((sum, group) => sum + group.warningCount, 0);

		if (totalWarnings === 0) {
			vscode.window.showInformationMessage('✅ Nenhum aviso encontrado!');
			return;
		}

		warningsText += `## 📊 Resumo de Avisos\n\n`;
		warningsText += `- ⚠️ **Total de Avisos:** ${totalWarnings}\n`;
		warningsText += `- 📁 **Arquivos com avisos:** ${problemsGroups.filter(g => g.warningCount > 0).length}\n\n`;

		problemsGroups.forEach((group) => {
			if (group.warningCount === 0) return;

			const fileName = group.file.split('\\').pop() || group.file;
			warningsText += `## 📁 ${fileName}\n\n`;
			warningsText += `**Caminho:** \`${group.file}\`\n\n`;
			warningsText += `**Avisos encontrados:** ⚠️ ${group.warningCount}\n\n`;

			group.problems.forEach((problem) => {
				if (problem.severity === vscode.DiagnosticSeverity.Warning) {
					warningsText += `- [ ] ⚠️ ${problem.message} - **Linha ${problem.line}, Coluna ${problem.column}**`;
					if (problem.source) {
						warningsText += ` [${problem.source}]`;
					}
					if (problem.code) {
						warningsText += ` (${problem.code})`;
					}
					warningsText += '\n';
				}
			});

			warningsText += '\n';
		});

		warningsText += '---\n\n';
		warningsText += `**📅 Gerado em:** ${new Date().toLocaleString('pt-BR')}\n\n`;
		warningsText += '**🔧 Extensão:** Trae Problems Viewer\n\n';
		warningsText += '**📋 Formato:** Checklist Markdown - Apenas Avisos';

		vscode.env.clipboard.writeText(warningsText).then(() => {
			vscode.window.showInformationMessage('⚠️ Avisos copiados em formato Markdown!');
		});
	}

	// Copiar apenas dicas
	private copyHintsOnly() {
		const problemsGroups = this.collectProblems();
		let hintsText = '# 💡 Relatório de Dicas - Trae\n\n';

		const totalHints = problemsGroups.reduce((sum, group) => sum + group.hintCount, 0);
		const totalInfo = problemsGroups.reduce((sum, group) => sum + group.infoCount, 0);
		const totalSuggestions = totalHints + totalInfo;

		if (totalSuggestions === 0) {
			vscode.window.showInformationMessage('✅ Nenhuma dica encontrada!');
			return;
		}

		hintsText += `## 📊 Resumo de Dicas\n\n`;
		hintsText += `- 💡 **Total de Dicas:** ${totalHints}\n`;
		hintsText += `- ℹ️ **Total de Informações:** ${totalInfo}\n`;
		hintsText += `- 📁 **Arquivos com sugestões:** ${problemsGroups.filter(g => g.hintCount > 0 || g.infoCount > 0).length}\n\n`;

		problemsGroups.forEach((group) => {
			if (group.hintCount === 0 && group.infoCount === 0) return;

			const fileName = group.file.split('\\').pop() || group.file;
			hintsText += `## 📁 ${fileName}\n\n`;
			hintsText += `**Caminho:** \`${group.file}\`\n\n`;
			hintsText += `**Sugestões encontradas:** 💡 ${group.hintCount} | ℹ️ ${group.infoCount}\n\n`;

			group.problems.forEach((problem) => {
				if (problem.severity === vscode.DiagnosticSeverity.Hint || problem.severity === vscode.DiagnosticSeverity.Information) {
					const icon = problem.severity === vscode.DiagnosticSeverity.Hint ? '💡' : 'ℹ️';
					hintsText += `- [ ] ${icon} ${problem.message} - **Linha ${problem.line}, Coluna ${problem.column}**`;
					if (problem.source) {
						hintsText += ` [${problem.source}]`;
					}
					if (problem.code) {
						hintsText += ` (${problem.code})`;
					}
					hintsText += '\n';
				}
			});

			hintsText += '\n';
		});

		hintsText += '---\n\n';
		hintsText += `**📅 Gerado em:** ${new Date().toLocaleString('pt-BR')}\n\n`;
		hintsText += '**🔧 Extensão:** Trae Problems Viewer\n\n';
		hintsText += '**📋 Formato:** Checklist Markdown - Apenas Dicas e Informações';

		vscode.env.clipboard.writeText(hintsText).then(() => {
			vscode.window.showInformationMessage('💡 Dicas copiadas em formato Markdown!');
		});
	}

}

// Instância global do visualizador
let problemsViewer: ProblemsViewer;

// Método chamado quando a extensão é ativada
export function activate(context: vscode.ExtensionContext) {
	console.log('🚀 Extensão "TraeCursor Problems" ativada!');
	console.log('📋 Context subscriptions length:', context.subscriptions.length);
	console.log('📁 Extension path:', context.extensionPath);

	// Criar instância do visualizador
	problemsViewer = new ProblemsViewer(context);
	console.log('✅ ProblemsViewer criado com sucesso');

	// Registrar comando para mostrar problemas
	console.log('📝 Registrando comando: trae-problems.showProblems');
	const showProblemsCommand = vscode.commands.registerCommand('trae-problems.showProblems', () => {
		console.log('🎯 Comando showProblems executado!');
		problemsViewer.show();
	});

	// Registrar comando para atualizar problemas
	console.log('📝 Registrando comando: trae-problems.refreshProblems');
	const refreshProblemsCommand = vscode.commands.registerCommand('trae-problems.refreshProblems', () => {
		console.log('🔄 Comando refreshProblems executado!');
		problemsViewer.updateContent();
		vscode.window.showInformationMessage('🔄 Problemas atualizados!');
	});

	// Registrar comando para copiar todos os problemas
	console.log('📝 Registrando comando: trae-problems.copyAllProblems');
	const copyAllProblemsCommand = vscode.commands.registerCommand('trae-problems.copyAllProblems', () => {
		console.log('📋 Comando copyAllProblems executado!');
		(problemsViewer as any).copyAllProblems();
	});



	// Adicionar comandos às subscrições
	console.log('📌 Adicionando comandos às subscrições...');
	context.subscriptions.push(showProblemsCommand);
	context.subscriptions.push(refreshProblemsCommand);
	context.subscriptions.push(copyAllProblemsCommand);
	console.log('✅ Comandos adicionados. Total de subscrições:', context.subscriptions.length);

	// Listener para mudanças nos diagnósticos
	const diagnosticsListener = vscode.languages.onDidChangeDiagnostics(() => {
		// Atualizar automaticamente se o painel estiver aberto
		if (problemsViewer && problemsViewer['panel']) {
			problemsViewer.updateContent();
		}
	});

	context.subscriptions.push(diagnosticsListener);

	vscode.window.showInformationMessage('✅ TraeCursor Problems Viewer está pronto! Use Ctrl+Shift+T para mostrar problemas ou Ctrl+Shift+P e digite "TraeCursor"');
}

// Método chamado quando a extensão é desativada
export function deactivate() {
	console.log('👋 Extensão "TraeCursor Problems" desativada!');
}
