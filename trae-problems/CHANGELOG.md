# Change Log

Todas as mudanças notáveis da extensão "trae-problems" serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](http://keepachangelog.com/) e este projeto adere ao [Semantic Versioning](http://semver.org/).

## [0.0.2] - 2024-12-19

### ✨ Adicionado
- **Novos Botões de Cópia Específicos**: Agora você pode copiar problemas por categoria
  - 📋 **Copiar Tudo MD**: Copia todos os problemas (antigo "Copiar MD")
  - ❌ **Copiar Erros MD**: Copia apenas erros em formato Markdown
  - ⚠️ **Copiar Avisos MD**: Copia apenas avisos em formato Markdown
  - 💡 **Copiar Dicas MD**: Copia apenas dicas e informações em formato Markdown
- **Emojis nos Botões**: Melhor identificação visual de cada tipo de problema
- **Estilos Únicos**: Cada botão tem sua própria cor temática (vermelho para erros, laranja para avisos, roxo para dicas)
- **Relatórios Específicos**: Cada tipo gera um relatório focado apenas nos problemas selecionados
- **Validação Inteligente**: Mostra mensagem quando não há problemas do tipo selecionado

### 🎨 Melhorado
- **Interface Mais Intuitiva**: Botões com cores e emojis para fácil identificação
- **Experiência do Usuário**: Feedback específico para cada tipo de cópia
- **Organização Visual**: Layout mais limpo e organizado dos botões de ação

### 🔧 Técnico
- Implementados novos métodos: `copyErrorsOnly()`, `copyWarningsOnly()`, `copyHintsOnly()`
- Adicionados estilos CSS específicos para cada tipo de botão
- Implementados event listeners para os novos botões
- Atualizada versão da extensão para 0.0.2

## [0.0.1] - 2024-12-18

### ✨ Inicial
- **Visualizador de Problemas**: Interface moderna para visualizar erros, avisos e dicas
- **Botão Copiar MD**: Copia todos os problemas em formato Markdown
- **Botão Atualizar**: Atualiza a lista de problemas em tempo real
- **Agrupamento por Arquivo**: Problemas organizados por arquivo
- **Estatísticas Visuais**: Contadores coloridos por tipo de problema
- **Atalhos de Teclado**: 
  - `Ctrl+Shift+T`: Abrir visualizador
  - `Ctrl+Shift+R`: Atualizar problemas
  - `Ctrl+Shift+C`: Copiar em Markdown
- **Interface Responsiva**: Design moderno com gradientes e animações
- **Logo Personalizada**: Identidade visual da extensão
- **Suporte Completo**: Erros, avisos, informações e dicas do VS Code