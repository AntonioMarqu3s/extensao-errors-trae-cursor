"use strict";var f=Object.create;var m=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var y=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var $=(n,e)=>{for(var o in e)m(n,o,{get:e[o],enumerable:!0})},b=(n,e,o,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of w(e))!C.call(n,a)&&a!==o&&m(n,a,{get:()=>e[a],enumerable:!(s=x(e,a))||s.enumerable});return n};var P=(n,e,o)=>(o=n!=null?f(y(n)):{},b(e||!n||!n.__esModule?m(o,"default",{value:n,enumerable:!0}):o,n)),k=n=>b(m({},"__esModule",{value:!0}),n);var E={};$(E,{activate:()=>S,deactivate:()=>D});module.exports=k(E);var t=P(require("vscode")),u=class{panel;context;constructor(e){this.context=e}collectProblems(){let e=new Map;return t.languages.getDiagnostics().forEach(([o,s])=>{let a=o.fsPath,l=s.map(d=>({file:a,line:d.range.start.line+1,column:d.range.start.character+1,message:d.message,severity:d.severity||t.DiagnosticSeverity.Error,source:d.source,code:d.code?.toString()}));l.length>0&&e.set(a,l)}),Array.from(e.entries()).map(([o,s])=>({file:o,problems:s,errorCount:s.filter(l=>l.severity===t.DiagnosticSeverity.Error).length,warningCount:s.filter(l=>l.severity===t.DiagnosticSeverity.Warning).length,infoCount:s.filter(l=>l.severity===t.DiagnosticSeverity.Information).length,hintCount:s.filter(l=>l.severity===t.DiagnosticSeverity.Hint).length})).sort((o,s)=>o.errorCount!==s.errorCount?s.errorCount-o.errorCount:o.file.localeCompare(s.file))}generateHtml(e){let o=e.reduce((r,i)=>r+i.errorCount,0),s=e.reduce((r,i)=>r+i.warningCount,0),a=e.reduce((r,i)=>r+i.infoCount,0),l=e.reduce((r,i)=>r+i.hintCount,0),d=e.map(r=>{let i=r.file.split("\\").pop()||r.file,v=r.problems.map(c=>{let g=this.getSeverityClass(c.severity),h=this.getSeverityIcon(c.severity);return`
					<div class="problem-item severity-${g}">
						<div class="problem-line">
							<input type="checkbox" class="problem-checkbox"> ${h} ${this.escapeHtml(c.message)} - <span class="problem-location">[Ln ${c.line}, Col ${c.column}]</span>
						</div>
					</div>
				`}).join("");return`
				<div class="file-group">
					<div class="file-header">
						<h3 class="file-name">${this.escapeHtml(i)}</h3>
						<div class="file-stats">
							${r.errorCount>0?`<span class="stat-error">${r.errorCount} erro${r.errorCount!==1?"s":""}</span>`:""}
							${r.warningCount>0?`<span class="stat-warning">${r.warningCount} aviso${r.warningCount!==1?"s":""}</span>`:""}
							${r.infoCount>0?`<span class="stat-info">${r.infoCount} info${r.infoCount!==1?"s":""}</span>`:""}
							${r.hintCount>0?`<span class="stat-hint">${r.hintCount} dica${r.hintCount!==1?"s":""}</span>`:""}
						</div>
					</div>
					<div class="problems-list">
						${v}
					</div>
				</div>
			`}).join("");return`
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
						<h1>\u{1F50D} Visualizador de Problemas - Trae</h1>
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
							<span>Copiar MD</span>
						</button>
					</div>
					<div class="summary">
						${o>0?`<div class="summary-item errors">\u274C ${o} Erro${o!==1?"s":""}</div>`:""}
						${s>0?`<div class="summary-item warnings">\u26A0\uFE0F ${s} Aviso${s!==1?"s":""}</div>`:""}
						${a>0?`<div class="summary-item info">\u2139\uFE0F ${a} Informa\xE7\xE3o${a!==1?"\xF5es":""}</div>`:""}
						${l>0?`<div class="summary-item hints">\u{1F4A1} ${l} Dica${l!==1?"s":""}</div>`:""}
					</div>
				</div>

				<div class="problems-container">
					${e.length>0?d:`
						<div class="no-problems">
							<span class="icon">\u2705</span>
							<div>Nenhum problema encontrado!</div>
							<div style="font-size: 14px; margin-top: 10px;">Seu c\xF3digo est\xE1 limpo e sem erros detectados.</div>
						</div>
					`}
				</div>

				<script>
					const vscode = acquireVsCodeApi();

					// Bot\xE3o de atualizar
					document.getElementById('refreshBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'refresh' });
					});

					// Bot\xE3o de copiar todos
					document.getElementById('copyAllBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyAll' });
					});
				</script>
			</body>
			</html>
		`}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}getSeverityClass(e){switch(e){case t.DiagnosticSeverity.Error:return"error";case t.DiagnosticSeverity.Warning:return"warning";case t.DiagnosticSeverity.Information:return"info";case t.DiagnosticSeverity.Hint:return"hint";default:return"error"}}getSeverityIcon(e){switch(e){case t.DiagnosticSeverity.Error:return"\u274C";case t.DiagnosticSeverity.Warning:return"\u26A0\uFE0F";case t.DiagnosticSeverity.Information:return"\u2139\uFE0F";case t.DiagnosticSeverity.Hint:return"\u{1F4A1}";default:return"\u274C"}}show(){if(this.panel){this.panel.reveal(t.ViewColumn.One);return}this.panel=t.window.createWebviewPanel("traeProblems","\u{1F50D} Visualizador de Problemas - Trae",t.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]}),this.panel.webview.options={enableScripts:!0,localResourceRoots:[]},this.updateContent(),this.panel.webview.onDidReceiveMessage(e=>{switch(e.command){case"refresh":this.updateContent(),t.window.showInformationMessage("\u{1F504} Problemas atualizados!");break;case"copyAll":this.copyAllProblems();break}},void 0,this.context.subscriptions),this.panel.onDidDispose(()=>{this.panel=void 0},void 0,this.context.subscriptions)}updateContent(){if(!this.panel)return;let e=this.collectProblems();this.panel.webview.html=this.generateHtml(e)}copyAllProblems(){let e=this.collectProblems(),o=`# \u{1F4CB} Relat\xF3rio de Problemas - Trae

`,s=e.reduce((r,i)=>r+i.errorCount,0),a=e.reduce((r,i)=>r+i.warningCount,0),l=e.reduce((r,i)=>r+i.infoCount,0),d=e.reduce((r,i)=>r+i.hintCount,0);o+=`## \u{1F4CA} Resumo Geral

`,o+=`- \u{1F534} **Erros:** ${s}
`,o+=`- \u26A0\uFE0F **Avisos:** ${a}
`,o+=`- \u2139\uFE0F **Informa\xE7\xF5es:** ${l}
`,o+=`- \u{1F4A1} **Dicas:** ${d}
`,o+=`- \u{1F4C1} **Arquivos com problemas:** ${e.length}

`,e.forEach((r,i)=>{let v=r.file.split("\\").pop()||r.file;o+=`## \u{1F4C1} ${v}

`,o+=`**Caminho:** \`${r.file}\`

`,o+=`**Estat\xEDsticas:** \u{1F534} ${r.errorCount} | \u26A0\uFE0F ${r.warningCount} | \u2139\uFE0F ${r.infoCount} | \u{1F4A1} ${r.hintCount}

`,r.problems.forEach(c=>{let g=this.getSeverityIcon(c.severity);o+=`- [ ] ${g} ${c.message} - **Linha ${c.line}, Coluna ${c.column}**`,c.source&&(o+=` [${c.source}]`),c.code&&(o+=` (${c.code})`),o+=`
`}),o+=`
`}),o+=`---

`,o+=`**\u{1F4C5} Gerado em:** ${new Date().toLocaleString("pt-BR")}

`,o+=`**\u{1F527} Extens\xE3o:** Trae Problems Viewer

`,o+="**\u{1F4CB} Formato:** Checklist Markdown para corre\xE7\xE3o de problemas",t.env.clipboard.writeText(o).then(()=>{t.window.showInformationMessage("\u{1F4CB} Todos os problemas copiados em formato Markdown!")})}},p;function S(n){console.log('\u{1F680} Extens\xE3o "TraeCursor Problems" ativada!'),console.log("\u{1F4CB} Context subscriptions length:",n.subscriptions.length),console.log("\u{1F4C1} Extension path:",n.extensionPath),p=new u(n),console.log("\u2705 ProblemsViewer criado com sucesso"),console.log("\u{1F4DD} Registrando comando: trae-problems.showProblems");let e=t.commands.registerCommand("trae-problems.showProblems",()=>{console.log("\u{1F3AF} Comando showProblems executado!"),p.show()});console.log("\u{1F4DD} Registrando comando: trae-problems.refreshProblems");let o=t.commands.registerCommand("trae-problems.refreshProblems",()=>{console.log("\u{1F504} Comando refreshProblems executado!"),p.updateContent(),t.window.showInformationMessage("\u{1F504} Problemas atualizados!")});console.log("\u{1F4DD} Registrando comando: trae-problems.copyAllProblems");let s=t.commands.registerCommand("trae-problems.copyAllProblems",()=>{console.log("\u{1F4CB} Comando copyAllProblems executado!"),p.copyAllProblems()});console.log("\u{1F4CC} Adicionando comandos \xE0s subscri\xE7\xF5es..."),n.subscriptions.push(e),n.subscriptions.push(o),n.subscriptions.push(s),console.log("\u2705 Comandos adicionados. Total de subscri\xE7\xF5es:",n.subscriptions.length);let a=t.languages.onDidChangeDiagnostics(()=>{p&&p.panel&&p.updateContent()});n.subscriptions.push(a),t.window.showInformationMessage('\u2705 TraeCursor Problems Viewer est\xE1 pronto! Use Ctrl+Shift+T para mostrar problemas ou Ctrl+Shift+P e digite "TraeCursor"')}function D(){console.log('\u{1F44B} Extens\xE3o "TraeCursor Problems" desativada!')}0&&(module.exports={activate,deactivate});
