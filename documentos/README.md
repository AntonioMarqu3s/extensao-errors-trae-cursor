# 🔍 Visualizador de Problemas - Trae

Uma extensão para VS Code que visualiza erros, avisos e sugestões da aba "Problems" em uma interface amigável e organizada.

## 📋 Funcionalidades

### ✨ Principais Recursos
- **Visualização Organizada**: Problemas agrupados por arquivo com contadores por tipo
- **Interface Amigável**: Design moderno com cores diferenciadas para cada tipo de problema
- **Cópia Rápida**: Copie problemas individuais, por arquivo ou todos de uma vez
- **Navegação Fácil**: Clique para ir diretamente ao problema no código
- **Atualização Automática**: Refresh manual para sincronizar com a aba Problems

### 🎯 Tipos de Problemas Suportados
- ❌ **Erros** (vermelho)
- ⚠️ **Avisos** (amarelo)
- ℹ️ **Informações** (azul)
- 💡 **Dicas** (verde)

## 🚀 Como Usar

### Comandos Disponíveis

1. **Mostrar Visualizador de Problemas**
   - Comando: `Trae: Mostrar Problemas`
   - Atalho: `Ctrl+Shift+P` → "Trae: Mostrar Problemas"
   - Abre o painel principal da extensão

2. **Atualizar Problemas**
   - Comando: `Trae: Atualizar Problemas`
   - Atalho: `Ctrl+Shift+R`
   - Sincroniza com a aba Problems do VS Code

3. **Copiar Todos os Problemas**
   - Comando: `Trae: Copiar Todos os Problemas`
   - Atalho: `Ctrl+Shift+C`
   - Copia um relatório completo para a área de transferência

### Interface do Usuário

#### Painel Principal
- **Resumo**: Contadores totais por tipo de problema
- **Grupos por Arquivo**: Problemas organizados por arquivo
- **Botões de Ação**: Copiar, navegar e expandir/recolher

#### Ações Disponíveis
- **📋 Copiar**: Copia o problema individual
- **📁 Copiar Arquivo**: Copia todos os problemas do arquivo
- **🔄 Atualizar**: Recarrega os problemas
- **📋 Copiar Todos**: Gera relatório completo

## 📊 Formato do Relatório

Quando você copia os problemas, eles são formatados assim:

```
🔍 RELATÓRIO DE PROBLEMAS - TRAE
==================================================

TOTAL DE PROBLEMAS: X

RESUMO:
- Erros: X
- Avisos: X
- Informações: X
- Dicas: X

📁 ARQUIVO: caminho/do/arquivo.ts

1. [ERRO] Linha 10, Coluna 5
   Descrição do erro aqui
   Fonte: typescript

2. [AVISO] Linha 15, Coluna 12
   Descrição do aviso aqui
   Fonte: eslint

==================================================
Gerado em: DD/MM/AAAA HH:MM:SS
Extensão: Trae Problems Viewer
```

## 🛠️ Desenvolvimento

### Tecnologias Utilizadas
- **TypeScript**: Linguagem principal
- **VS Code API**: `vscode.languages.getDiagnostics()`
- **esbuild**: Bundler para performance
- **Webview Panel**: Interface do usuário

### Scripts Disponíveis
```bash
# Compilar a extensão
npm run compile

# Compilar em modo watch
npm run watch

# Executar testes
npm test

# Fazer package da extensão
npm run package
```

### Estrutura do Projeto
```
trae-problems/
├── src/
│   └── extension.ts          # Código principal
├── dist/                     # Arquivos compilados
├── documentos/              # Documentação
├── package.json             # Configurações da extensão
└── README.md               # Este arquivo
```

## 🎨 Personalização

A extensão usa as cores do tema ativo do VS Code e se adapta automaticamente aos temas claro e escuro.

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Extensão não aparece nos comandos**
   - Verifique se a extensão foi instalada corretamente
   - Reinicie o VS Code

2. **Problemas não aparecem**
   - Use o comando "Atualizar Problemas"
   - Verifique se há problemas na aba Problems do VS Code

3. **Cópia não funciona**
   - Verifique as permissões da área de transferência
   - Tente usar os atalhos de teclado

## 📝 Changelog

### v0.0.1 (Inicial)
- ✅ Visualização de problemas por arquivo
- ✅ Cópia individual e em lote
- ✅ Interface responsiva
- ✅ Atalhos de teclado
- ✅ Relatório formatado

## 🤝 Contribuição

Esta extensão foi desenvolvida para integração com o Trae AI. Para sugestões e melhorias, entre em contato através do Trae.

## 📄 Licença

Este projeto é de uso interno para integração com Trae AI.