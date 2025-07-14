"use strict";var b=Object.create;var v=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var y=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var $=(l,o)=>{for(var e in o)v(l,e,{get:o[e],enumerable:!0})},h=(l,o,e,a)=>{if(o&&typeof o=="object"||typeof o=="function")for(let s of x(o))!C.call(l,s)&&s!==e&&v(l,s,{get:()=>o[s],enumerable:!(a=w(o,s))||a.enumerable});return l};var k=(l,o,e)=>(e=l!=null?b(y(l)):{},h(o||!l||!l.__esModule?v(e,"default",{value:l,enumerable:!0}):e,l)),E=l=>h(v({},"__esModule",{value:!0}),l);var S={};$(S,{activate:()=>P,deactivate:()=>D});module.exports=E(S);var r=k(require("vscode")),u=class{panel;context;constructor(o){this.context=o}collectProblems(){let o=new Map;return r.languages.getDiagnostics().forEach(([e,a])=>{let s=e.fsPath,c=a.map(t=>({file:s,line:t.range.start.line+1,column:t.range.start.character+1,message:t.message,severity:t.severity||r.DiagnosticSeverity.Error,source:t.source,code:t.code?.toString()}));c.length>0&&o.set(s,c)}),Array.from(o.entries()).map(([e,a])=>({file:e,problems:a,errorCount:a.filter(c=>c.severity===r.DiagnosticSeverity.Error).length,warningCount:a.filter(c=>c.severity===r.DiagnosticSeverity.Warning).length,infoCount:a.filter(c=>c.severity===r.DiagnosticSeverity.Information).length,hintCount:a.filter(c=>c.severity===r.DiagnosticSeverity.Hint).length})).sort((e,a)=>e.errorCount!==a.errorCount?a.errorCount-e.errorCount:e.file.localeCompare(a.file))}generateHtml(o){let e=o.reduce((n,i)=>n+i.errorCount,0),a=o.reduce((n,i)=>n+i.warningCount,0),s=o.reduce((n,i)=>n+i.infoCount,0),c=o.reduce((n,i)=>n+i.hintCount,0),t=o.map(n=>{let i=n.file.split("\\").pop()||n.file,m=n.problems.map(d=>{let g=this.getSeverityClass(d.severity),f=this.getSeverityIcon(d.severity);return`
					<div class="problem-item severity-${g}">
						<div class="problem-line">
							<input type="checkbox" class="problem-checkbox"> ${f} ${this.escapeHtml(d.message)} - <span class="problem-location">[Ln ${d.line}, Col ${d.column}]</span>
						</div>
					</div>
				`}).join("");return`
				<div class="file-group">
					<div class="file-header">
						<h3 class="file-name">${this.escapeHtml(i)}</h3>
						<div class="file-stats">
							${n.errorCount>0?`<span class="stat-error">${n.errorCount} erro${n.errorCount!==1?"s":""}</span>`:""}
							${n.warningCount>0?`<span class="stat-warning">${n.warningCount} aviso${n.warningCount!==1?"s":""}</span>`:""}
							${n.infoCount>0?`<span class="stat-info">${n.infoCount} info${n.infoCount!==1?"s":""}</span>`:""}
							${n.hintCount>0?`<span class="stat-hint">${n.hintCount} dica${n.hintCount!==1?"s":""}</span>`:""}
						</div>
					</div>
					<div class="problems-list">
						${m}
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
							<span>\u{1F4CB} Copiar Tudo MD</span>
						</button>
						<button id="copyErrorsBtn" class="action-btn copy-errors-btn" title="Copiar apenas erros em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>\u274C Copiar Erros MD</span>
						</button>
						<button id="copyWarningsBtn" class="action-btn copy-warnings-btn" title="Copiar apenas avisos em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>\u26A0\uFE0F Copiar Avisos MD</span>
						</button>
						<button id="copyHintsBtn" class="action-btn copy-hints-btn" title="Copiar apenas dicas em formato Markdown">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
							</svg>
							<span>\u{1F4A1} Copiar Dicas MD</span>
						</button>
					</div>
					<div class="summary">
						${e>0?`<div class="summary-item errors">\u274C ${e} Erro${e!==1?"s":""}</div>`:""}
						${a>0?`<div class="summary-item warnings">\u26A0\uFE0F ${a} Aviso${a!==1?"s":""}</div>`:""}
						${s>0?`<div class="summary-item info">\u2139\uFE0F ${s} Informa\xE7\xE3o${s!==1?"\xF5es":""}</div>`:""}
						${c>0?`<div class="summary-item hints">\u{1F4A1} ${c} Dica${c!==1?"s":""}</div>`:""}
					</div>
				</div>

				<div class="problems-container">
					${o.length>0?t:`
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

					// Bot\xE3o de copiar erros
					document.getElementById('copyErrorsBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyErrors' });
					});

					// Bot\xE3o de copiar avisos
					document.getElementById('copyWarningsBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyWarnings' });
					});

					// Bot\xE3o de copiar dicas
					document.getElementById('copyHintsBtn')?.addEventListener('click', () => {
						vscode.postMessage({ command: 'copyHints' });
					});
				</script>
			</body>
			</html>
		`}escapeHtml(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}getSeverityClass(o){switch(o){case r.DiagnosticSeverity.Error:return"error";case r.DiagnosticSeverity.Warning:return"warning";case r.DiagnosticSeverity.Information:return"info";case r.DiagnosticSeverity.Hint:return"hint";default:return"error"}}getSeverityIcon(o){switch(o){case r.DiagnosticSeverity.Error:return"\u274C";case r.DiagnosticSeverity.Warning:return"\u26A0\uFE0F";case r.DiagnosticSeverity.Information:return"\u2139\uFE0F";case r.DiagnosticSeverity.Hint:return"\u{1F4A1}";default:return"\u274C"}}show(){if(this.panel){this.panel.reveal(r.ViewColumn.One);return}this.panel=r.window.createWebviewPanel("traeProblems","\u{1F50D} Visualizador de Problemas - Trae",r.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[]}),this.panel.webview.options={enableScripts:!0,localResourceRoots:[]},this.updateContent(),this.panel.webview.onDidReceiveMessage(o=>{switch(o.command){case"refresh":this.updateContent(),r.window.showInformationMessage("\u{1F504} Problemas atualizados!");break;case"copyAll":this.copyAllProblems();break;case"copyErrors":this.copyErrorsOnly();break;case"copyWarnings":this.copyWarningsOnly();break;case"copyHints":this.copyHintsOnly();break}},void 0,this.context.subscriptions),this.panel.onDidDispose(()=>{this.panel=void 0},void 0,this.context.subscriptions)}updateContent(){if(!this.panel)return;let o=this.collectProblems();this.panel.webview.html=this.generateHtml(o)}copyAllProblems(){let o=this.collectProblems(),e=`# \u{1F4CB} Relat\xF3rio de Problemas - Trae

`,a=o.reduce((n,i)=>n+i.errorCount,0),s=o.reduce((n,i)=>n+i.warningCount,0),c=o.reduce((n,i)=>n+i.infoCount,0),t=o.reduce((n,i)=>n+i.hintCount,0);e+=`## \u{1F4CA} Resumo Geral

`,e+=`- \u{1F534} **Erros:** ${a}
`,e+=`- \u26A0\uFE0F **Avisos:** ${s}
`,e+=`- \u2139\uFE0F **Informa\xE7\xF5es:** ${c}
`,e+=`- \u{1F4A1} **Dicas:** ${t}
`,e+=`- \u{1F4C1} **Arquivos com problemas:** ${o.length}

`,o.forEach((n,i)=>{let m=n.file.split("\\").pop()||n.file;e+=`## \u{1F4C1} ${m}

`,e+=`**Caminho:** \`${n.file}\`

`,e+=`**Estat\xEDsticas:** \u{1F534} ${n.errorCount} | \u26A0\uFE0F ${n.warningCount} | \u2139\uFE0F ${n.infoCount} | \u{1F4A1} ${n.hintCount}

`,n.problems.forEach(d=>{let g=this.getSeverityIcon(d.severity);e+=`- [ ] ${g} ${d.message} - **Linha ${d.line}, Coluna ${d.column}**`,d.source&&(e+=` [${d.source}]`),d.code&&(e+=` (${d.code})`),e+=`
`}),e+=`
`}),e+=`---

`,e+=`**\u{1F4C5} Gerado em:** ${new Date().toLocaleString("pt-BR")}

`,e+=`**\u{1F527} Extens\xE3o:** Trae Problems Viewer

`,e+="**\u{1F4CB} Formato:** Checklist Markdown para corre\xE7\xE3o de problemas",r.env.clipboard.writeText(e).then(()=>{r.window.showInformationMessage("\u{1F4CB} Todos os problemas copiados em formato Markdown!")})}copyErrorsOnly(){let o=this.collectProblems(),e=`# \u274C Relat\xF3rio de Erros - Trae

`,a=o.reduce((s,c)=>s+c.errorCount,0);if(a===0){r.window.showInformationMessage("\u2705 Nenhum erro encontrado!");return}e+=`## \u{1F4CA} Resumo de Erros

`,e+=`- \u{1F534} **Total de Erros:** ${a}
`,e+=`- \u{1F4C1} **Arquivos com erros:** ${o.filter(s=>s.errorCount>0).length}

`,o.forEach(s=>{if(s.errorCount===0)return;let c=s.file.split("\\").pop()||s.file;e+=`## \u{1F4C1} ${c}

`,e+=`**Caminho:** \`${s.file}\`

`,e+=`**Erros encontrados:** \u{1F534} ${s.errorCount}

`,s.problems.forEach(t=>{t.severity===r.DiagnosticSeverity.Error&&(e+=`- [ ] \u274C ${t.message} - **Linha ${t.line}, Coluna ${t.column}**`,t.source&&(e+=` [${t.source}]`),t.code&&(e+=` (${t.code})`),e+=`
`)}),e+=`
`}),e+=`---

`,e+=`**\u{1F4C5} Gerado em:** ${new Date().toLocaleString("pt-BR")}

`,e+=`**\u{1F527} Extens\xE3o:** Trae Problems Viewer

`,e+="**\u{1F4CB} Formato:** Checklist Markdown - Apenas Erros",r.env.clipboard.writeText(e).then(()=>{r.window.showInformationMessage("\u274C Erros copiados em formato Markdown!")})}copyWarningsOnly(){let o=this.collectProblems(),e=`# \u26A0\uFE0F Relat\xF3rio de Avisos - Trae

`,a=o.reduce((s,c)=>s+c.warningCount,0);if(a===0){r.window.showInformationMessage("\u2705 Nenhum aviso encontrado!");return}e+=`## \u{1F4CA} Resumo de Avisos

`,e+=`- \u26A0\uFE0F **Total de Avisos:** ${a}
`,e+=`- \u{1F4C1} **Arquivos com avisos:** ${o.filter(s=>s.warningCount>0).length}

`,o.forEach(s=>{if(s.warningCount===0)return;let c=s.file.split("\\").pop()||s.file;e+=`## \u{1F4C1} ${c}

`,e+=`**Caminho:** \`${s.file}\`

`,e+=`**Avisos encontrados:** \u26A0\uFE0F ${s.warningCount}

`,s.problems.forEach(t=>{t.severity===r.DiagnosticSeverity.Warning&&(e+=`- [ ] \u26A0\uFE0F ${t.message} - **Linha ${t.line}, Coluna ${t.column}**`,t.source&&(e+=` [${t.source}]`),t.code&&(e+=` (${t.code})`),e+=`
`)}),e+=`
`}),e+=`---

`,e+=`**\u{1F4C5} Gerado em:** ${new Date().toLocaleString("pt-BR")}

`,e+=`**\u{1F527} Extens\xE3o:** Trae Problems Viewer

`,e+="**\u{1F4CB} Formato:** Checklist Markdown - Apenas Avisos",r.env.clipboard.writeText(e).then(()=>{r.window.showInformationMessage("\u26A0\uFE0F Avisos copiados em formato Markdown!")})}copyHintsOnly(){let o=this.collectProblems(),e=`# \u{1F4A1} Relat\xF3rio de Dicas - Trae

`,a=o.reduce((t,n)=>t+n.hintCount,0),s=o.reduce((t,n)=>t+n.infoCount,0);if(a+s===0){r.window.showInformationMessage("\u2705 Nenhuma dica encontrada!");return}e+=`## \u{1F4CA} Resumo de Dicas

`,e+=`- \u{1F4A1} **Total de Dicas:** ${a}
`,e+=`- \u2139\uFE0F **Total de Informa\xE7\xF5es:** ${s}
`,e+=`- \u{1F4C1} **Arquivos com sugest\xF5es:** ${o.filter(t=>t.hintCount>0||t.infoCount>0).length}

`,o.forEach(t=>{if(t.hintCount===0&&t.infoCount===0)return;let n=t.file.split("\\").pop()||t.file;e+=`## \u{1F4C1} ${n}

`,e+=`**Caminho:** \`${t.file}\`

`,e+=`**Sugest\xF5es encontradas:** \u{1F4A1} ${t.hintCount} | \u2139\uFE0F ${t.infoCount}

`,t.problems.forEach(i=>{if(i.severity===r.DiagnosticSeverity.Hint||i.severity===r.DiagnosticSeverity.Information){let m=i.severity===r.DiagnosticSeverity.Hint?"\u{1F4A1}":"\u2139\uFE0F";e+=`- [ ] ${m} ${i.message} - **Linha ${i.line}, Coluna ${i.column}**`,i.source&&(e+=` [${i.source}]`),i.code&&(e+=` (${i.code})`),e+=`
`}}),e+=`
`}),e+=`---

`,e+=`**\u{1F4C5} Gerado em:** ${new Date().toLocaleString("pt-BR")}

`,e+=`**\u{1F527} Extens\xE3o:** Trae Problems Viewer

`,e+="**\u{1F4CB} Formato:** Checklist Markdown - Apenas Dicas e Informa\xE7\xF5es",r.env.clipboard.writeText(e).then(()=>{r.window.showInformationMessage("\u{1F4A1} Dicas copiadas em formato Markdown!")})}},p;function P(l){console.log('\u{1F680} Extens\xE3o "TraeCursor Problems" ativada!'),console.log("\u{1F4CB} Context subscriptions length:",l.subscriptions.length),console.log("\u{1F4C1} Extension path:",l.extensionPath),p=new u(l),console.log("\u2705 ProblemsViewer criado com sucesso"),console.log("\u{1F4DD} Registrando comando: trae-problems.showProblems");let o=r.commands.registerCommand("trae-problems.showProblems",()=>{console.log("\u{1F3AF} Comando showProblems executado!"),p.show()});console.log("\u{1F4DD} Registrando comando: trae-problems.refreshProblems");let e=r.commands.registerCommand("trae-problems.refreshProblems",()=>{console.log("\u{1F504} Comando refreshProblems executado!"),p.updateContent(),r.window.showInformationMessage("\u{1F504} Problemas atualizados!")});console.log("\u{1F4DD} Registrando comando: trae-problems.copyAllProblems");let a=r.commands.registerCommand("trae-problems.copyAllProblems",()=>{console.log("\u{1F4CB} Comando copyAllProblems executado!"),p.copyAllProblems()});console.log("\u{1F4CC} Adicionando comandos \xE0s subscri\xE7\xF5es..."),l.subscriptions.push(o),l.subscriptions.push(e),l.subscriptions.push(a),console.log("\u2705 Comandos adicionados. Total de subscri\xE7\xF5es:",l.subscriptions.length);let s=r.languages.onDidChangeDiagnostics(()=>{p&&p.panel&&p.updateContent()});l.subscriptions.push(s),r.window.showInformationMessage('\u2705 TraeCursor Problems Viewer est\xE1 pronto! Use Ctrl+Shift+T para mostrar problemas ou Ctrl+Shift+P e digite "TraeCursor"')}function D(){console.log('\u{1F44B} Extens\xE3o "TraeCursor Problems" desativada!')}0&&(module.exports={activate,deactivate});
