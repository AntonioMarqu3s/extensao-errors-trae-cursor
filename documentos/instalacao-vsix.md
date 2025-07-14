# 📦 Como Instalar a Extensão via VSIX

## 🎯 Visão Geral

Este guia mostra como gerar um arquivo VSIX da extensão Trae Problems e instalá-lo no VS Code.

## 📋 Pré-requisitos

### Instalar o VSCE (VS Code Extension Manager)
```bash
npm install -g @vscode/vsce
```

### Verificar Instalação
```bash
vsce --version
```

## 🔨 Gerando o Arquivo VSIX

### 1. Preparar o Projeto

#### Compilar a Extensão
```bash
# Navegar para a pasta da extensão
cd c:\Users\Anton\Documents\extensao\trae-problems

# Instalar dependências (se necessário)
npm install

# Compilar o código
npm run compile
```

#### Verificar package.json
Certifique-se de que o `package.json` está configurado corretamente:

```json
{
  "name": "trae-problems",
  "displayName": "Trae Problems Viewer",
  "description": "Localiza os problems e errors do seu projeto e lista para você enviar ao TRAE ou Cursor corrigir.",
  "version": "0.0.1",
  "publisher": "trae",
  "engines": {
    "vscode": "^1.74.0"
  },
  "main": "./dist/extension.js"
}
```

### 2. Gerar o VSIX

#### Comando Principal
```bash
vsce package
```

#### Com Versão Específica (Opcional)
```bash
vsce package --out trae-problems-v0.0.1.vsix
```

#### Resultado Esperado
```
📦 Packaging extension...
📦 Extension packaged: trae-problems-0.0.1.vsix
```

## 🚀 Instalando a Extensão

### Método 1: Via Linha de Comando

#### Instalar VSIX
```bash
code --install-extension trae-problems-0.0.1.vsix
```

#### Verificar Instalação
```bash
code --list-extensions | findstr trae
```

### Método 2: Via Interface do VS Code

#### Passos na Interface
1. **Abrir VS Code**
2. **Ir para Extensions** (`Ctrl+Shift+X`)
3. **Clicar no menu "..."** (três pontos) no topo da aba Extensions
4. **Selecionar "Install from VSIX..."**
5. **Navegar e selecionar** o arquivo `trae-problems-0.0.1.vsix`
6. **Aguardar instalação** e reiniciar se solicitado

### Método 3: Arrastar e Soltar

#### Processo Simples
1. **Abrir VS Code**
2. **Arrastar o arquivo VSIX** para a janela do VS Code
3. **Confirmar instalação** quando solicitado

## ✅ Verificando a Instalação

### 1. Verificar na Lista de Extensões
- Abrir Extensions (`Ctrl+Shift+X`)
- Procurar por "Trae Problems Viewer"
- Deve aparecer como instalada

### 2. Testar Comandos
- Pressionar `Ctrl+Shift+P`
- Digitar "Trae" - deve mostrar os comandos:
  - `Trae: Mostrar Problemas`
  - `Trae: Atualizar Problemas`
  - `Trae: Copiar Todos os Problemas`

### 3. Testar Funcionalidade
- Executar `Trae: Mostrar Problemas`
- Verificar se o painel abre corretamente

## 🎉 Arquivo VSIX Gerado

O arquivo `trae-problems-0.0.1.vsix` foi gerado com sucesso e está pronto para instalação!

### 📦 Conteúdo do Pacote
- **Tamanho**: ~15KB (extensão compilada)
- **Arquivos incluídos**:
  - `extension.js` (código principal minificado)
  - `package.json` (configurações da extensão)
  - `README.md` (documentação)
  - Pasta `documentos/` (documentação técnica completa)

### ⚠️ Avisos Durante a Geração
- **Repository**: Campo repository ausente (normal para extensões internas)
- **License**: Arquivo de licença ausente (normal para uso interno)

## 🔄 Atualizando a Extensão

### Para Nova Versão
1. **Atualizar versão** no `package.json`
2. **Recompilar**: `npm run compile`
3. **Gerar novo VSIX**: `vsce package`
4. **Desinstalar versão anterior**:
   ```bash
   code --uninstall-extension trae.trae-problems
   ```
5. **Instalar nova versão**:
   ```bash
   code --install-extension trae-problems-0.0.2.vsix
   ```

## 🗑️ Desinstalando a Extensão

### Via Linha de Comando
```bash
code --uninstall-extension trae.trae-problems
```

### Via Interface
1. **Ir para Extensions** (`Ctrl+Shift+X`)
2. **Encontrar "Trae Problems Viewer"**
3. **Clicar no ícone de engrenagem**
4. **Selecionar "Uninstall"**

## 🐛 Solução de Problemas

### Erro: "Publisher is required"
**Solução**: Adicionar publisher no `package.json`:
```json
{
  "publisher": "trae"
}
```

### Erro: "Extension not found"
**Soluções**:
1. Verificar se o arquivo VSIX existe
2. Usar caminho absoluto para o arquivo
3. Verificar permissões do arquivo

### Erro: "Invalid extension"
**Soluções**:
1. Recompilar: `npm run compile`
2. Verificar se `dist/extension.js` existe
3. Verificar `package.json` está válido

### Extensão não aparece nos comandos
**Soluções**:
1. Reiniciar VS Code completamente
2. Verificar se foi instalada: `code --list-extensions`
3. Verificar logs: `Help > Toggle Developer Tools > Console`

## 📋 Checklist de Instalação

### Antes de Gerar VSIX
- [ ] Código compilado sem erros
- [ ] `package.json` configurado corretamente
- [ ] Arquivo `dist/extension.js` existe
- [ ] Dependências instaladas
- [ ] VSCE instalado globalmente

### Após Gerar VSIX
- [ ] Arquivo `.vsix` criado com sucesso
- [ ] Tamanho do arquivo razoável (< 10MB)
- [ ] Nome do arquivo correto

### Após Instalar
- [ ] Extensão aparece na lista
- [ ] Comandos disponíveis na paleta
- [ ] Funcionalidade básica funciona
- [ ] Atalhos de teclado funcionam

## 📊 Informações do Package

### Conteúdo do VSIX
O arquivo VSIX contém:
- Código compilado (`dist/`)
- Manifesto (`package.json`)
- README e documentação
- Assets (se houver)

### Tamanho Esperado
- **Extensão Trae Problems**: ~50-100KB
- **Com documentação**: ~200-300KB

## 🚀 Distribuição

### Para Uso Pessoal
- Gerar VSIX e instalar localmente
- Compartilhar arquivo VSIX diretamente

### Para Equipe
- Compartilhar VSIX via rede/email
- Instruir instalação via `code --install-extension`

### Para Marketplace (Futuro)
- Configurar publisher verificado
- Usar `vsce publish`
- Seguir guidelines do VS Code Marketplace

---

## 🎯 Resumo dos Comandos

```bash
# Instalar VSCE
npm install -g @vscode/vsce

# Compilar extensão
npm run compile

# Gerar VSIX
vsce package

# Instalar extensão
code --install-extension trae-problems-0.0.1.vsix

# Verificar instalação
code --list-extensions | findstr trae

# Desinstalar
code --uninstall-extension trae.trae-problems
```

**Próximo Passo**: Após seguir este guia, a extensão estará instalada e pronta para uso no VS Code! 🎉