# Plano de Desenvolvimento - Extensão VS Code: Visualizador de Problemas

## Visão Geral
Criar uma extensão para o VS Code que permita visualizar os erros, avisos e sugestões da aba Problems de forma organizada e amigável, com funcionalidades de cópia e organização por arquivos.

## Objetivos
- ✅ Criar interface amigável para visualizar problemas
- ✅ Organizar por tipo: erros, avisos e sugestões
- ✅ Separar por arquivos
- ✅ Permitir cópia dos erros
- ✅ Interface em português brasileiro
- ✅ Comando simples para abrir a extensão

## Tecnologias Escolhidas

### Linguagem Principal: TypeScript
**Justificativa:** <mcreference link="https://code.visualstudio.com/api/get-started/your-first-extension" index="3">3</mcreference>
- Linguagem recomendada pela Microsoft para extensões VS Code
- Melhor experiência de desenvolvimento com tipagem forte
- Suporte nativo e completo às APIs do VS Code
- Facilita debugging e manutenção

### API Principal: vscode.languages.getDiagnostics()
**Justificativa:** <mcreference link="https://code.visualstudio.com/api/language-extensions/programmatic-language-features" index="3">3</mcreference>
- API oficial para acessar diagnósticos (erros, avisos, sugestões)
- Permite obter todos os diagnósticos de um URI específico
- Integração direta com o sistema de Problems do VS Code

### Interface: Webview Panel
**Justificativa:** <mcreference link="https://code.visualstudio.com/api/extension-guides/webview" index="5">5</mcreference>
- Permite criar interfaces customizadas e complexas
- Suporte completo a HTML, CSS e JavaScript
- Ideal para visualizações organizadas e interativas
- Comunicação bidirecional com a extensão

## Estrutura do Projeto

```
extensao/
├── src/
│   ├── extension.ts          # Ponto de entrada da extensão
│   ├── diagnosticsProvider.ts # Lógica para obter diagnósticos
│   ├── webviewProvider.ts     # Gerenciamento do webview
│   └── utils.ts              # Utilitários e helpers
├── media/
│   ├── styles.css            # Estilos da interface
│   ├── script.js             # JavaScript do webview
│   └── icons/                # Ícones da interface
├── package.json              # Configuração da extensão
├── tsconfig.json             # Configuração TypeScript
└── README.md                 # Documentação
```

## Funcionalidades Detalhadas

### 1. Comando Principal
- **ID:** `problemsViewer.show`
- **Título:** "Visualizador de Problemas: Abrir"
- **Atalho:** Configurável pelo usuário
- **Ação:** Abre o painel webview com os problemas

### 2. Coleta de Diagnósticos
```typescript
// Função principal para obter todos os diagnósticos
vscode.languages.getDiagnostics() // Todos os diagnósticos
vscode.languages.getDiagnostics(uri) // Diagnósticos de um arquivo específico
```

### 3. Organização dos Dados
- **Por Severidade:**
  - Erros (DiagnosticSeverity.Error)
  - Avisos (DiagnosticSeverity.Warning)
  - Informações (DiagnosticSeverity.Information)
  - Dicas (DiagnosticSeverity.Hint)

- **Por Arquivo:**
  - Agrupamento por URI do arquivo
  - Exibição do caminho relativo
  - Contadores por tipo

### 4. Interface do Usuário

#### Layout Principal
```
┌─────────────────────────────────────────┐
│ 🔍 Visualizador de Problemas            │
├─────────────────────────────────────────┤
│ 📊 Resumo: 5 erros, 3 avisos, 2 dicas  │
├─────────────────────────────────────────┤
│ 📁 src/main.ts (3 problemas)           │
│   ❌ Erro: Variável não declarada      │
│   ⚠️  Aviso: Função não utilizada       │
│   💡 Dica: Pode ser const              │
├─────────────────────────────────────────┤
│ 📁 src/utils.ts (2 problemas)          │
│   ❌ Erro: Tipo incompatível           │
│   ⚠️  Aviso: Import não utilizado       │
└─────────────────────────────────────────┘
```

#### Funcionalidades da Interface
- **Filtros:** Por tipo de problema
- **Busca:** Filtro por texto
- **Cópia:** Botão para copiar problemas selecionados
- **Navegação:** Click para ir ao arquivo/linha
- **Atualização:** Botão de refresh manual
- **Auto-refresh:** Atualização automática quando problemas mudam

### 5. Recursos de Cópia
- **Formato Texto Simples:**
```
ERROS (2):
- src/main.ts:15:5 - Variável 'x' não declarada
- src/utils.ts:8:12 - Tipo 'string' não compatível com 'number'

AVISOS (1):
- src/main.ts:22:1 - Função 'helper' não utilizada
```

- **Formato Markdown:**
```markdown
## Problemas Encontrados

### ❌ Erros (2)
- **src/main.ts:15:5** - Variável 'x' não declarada
- **src/utils.ts:8:12** - Tipo 'string' não compatível com 'number'

### ⚠️ Avisos (1)
- **src/main.ts:22:1** - Função 'helper' não utilizada
```

## Configurações da Extensão

### package.json - Contribuições
```json
{
  "contributes": {
    "commands": [
      {
        "command": "problemsViewer.show",
        "title": "Abrir Visualizador",
        "category": "Problemas"
      }
    ],
    "configuration": {
      "title": "Visualizador de Problemas",
      "properties": {
        "problemsViewer.autoRefresh": {
          "type": "boolean",
          "default": true,
          "description": "Atualizar automaticamente quando problemas mudarem"
        },
        "problemsViewer.showLineNumbers": {
          "type": "boolean",
          "default": true,
          "description": "Mostrar números das linhas"
        }
      }
    }
  }
}
```

## Fluxo de Desenvolvimento

### Fase 1: Estrutura Básica
1. ✅ Configurar projeto TypeScript
2. ✅ Criar comando básico
3. ✅ Implementar webview simples
4. ✅ Testar coleta de diagnósticos

### Fase 2: Interface Principal
1. ✅ Desenvolver layout HTML/CSS
2. ✅ Implementar organização por arquivos
3. ✅ Adicionar filtros por tipo
4. ✅ Implementar busca

### Fase 3: Funcionalidades Avançadas
1. ✅ Sistema de cópia
2. ✅ Navegação para arquivos
3. ✅ Auto-refresh
4. ✅ Configurações

### Fase 4: Polimento
1. ✅ Tradução completa para PT-BR
2. ✅ Testes
3. ✅ Documentação
4. ✅ Otimizações de performance

## APIs Principais Utilizadas

### Diagnósticos
```typescript
// Obter todos os diagnósticos
const allDiagnostics = vscode.languages.getDiagnostics();

// Obter diagnósticos de um arquivo
const fileDiagnostics = vscode.languages.getDiagnostics(fileUri);

// Escutar mudanças nos diagnósticos
vscode.languages.onDidChangeDiagnostics((event) => {
  // Atualizar interface
});
```

### Webview
```typescript
// Criar painel webview
const panel = vscode.window.createWebviewPanel(
  'problemsViewer',
  'Visualizador de Problemas',
  vscode.ViewColumn.One,
  {
    enableScripts: true,
    retainContextWhenHidden: true
  }
);
```

### Comandos
```typescript
// Registrar comando
vscode.commands.registerCommand('problemsViewer.show', () => {
  // Lógica para abrir o visualizador
});
```

## Considerações Técnicas

### Performance
- Cache de diagnósticos para evitar consultas desnecessárias
- Debounce para atualizações automáticas
- Virtualização para listas grandes

### Usabilidade
- Interface responsiva
- Atalhos de teclado
- Estados de loading
- Mensagens de erro amigáveis

### Compatibilidade
- VS Code versão mínima: 1.74.0
- Suporte a todos os tipos de diagnósticos
- Compatível com extensões de linguagem

## Próximos Passos
1. Configurar ambiente de desenvolvimento
2. Criar estrutura básica do projeto
3. Implementar coleta de diagnósticos
4. Desenvolver interface webview
5. Adicionar funcionalidades de cópia
6. Testes e refinamentos

---

**Estimativa de Desenvolvimento:** 2-3 dias
**Complexidade:** Média
**Benefícios:** Alta produtividade para desenvolvedores que trabalham com muitos arquivos e precisam gerenciar problemas de código de forma organizada.