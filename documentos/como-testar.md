# 🧪 Como Testar a Extensão Trae Problems

## 🚀 Iniciando os Testes

### 1. Preparação do Ambiente

#### Abrir VS Code para Desenvolvimento
```bash
# No terminal, dentro da pasta da extensão:
code --extensionDevelopmentPath=. --new-window
```

Ou use o atalho:
- Pressione `F5` no VS Code (com a pasta da extensão aberta)
- Isso abrirá uma nova janela do VS Code com a extensão carregada

### 2. Verificação da Instalação

#### Confirmar que a Extensão foi Carregada
1. Na nova janela do VS Code, pressione `Ctrl+Shift+P`
2. Digite "Trae" - você deve ver os comandos:
   - `Trae: Mostrar Problemas`
   - `Trae: Atualizar Problemas`
   - `Trae: Copiar Todos os Problemas`

## 📋 Roteiro de Testes

### Teste 1: Verificar Coleta de Problemas

#### Criar Arquivo com Erros
1. Crie um novo arquivo TypeScript: `teste.ts`
2. Adicione código com erros intencionais:

```typescript
// Arquivo de teste com erros propositais
let variavel_sem_tipo;
const numero: string = 123; // Erro de tipo
function funcaoSemRetorno() {
    return // Erro de sintaxe
}

// Variável não utilizada
const naoUsada = "teste";

// Função sem implementação
function semImplementacao(): void;
```

3. Salve o arquivo e aguarde o TypeScript processar
4. Verifique se aparecem problemas na aba "Problems" do VS Code

### Teste 2: Comando Principal

#### Abrir o Visualizador
1. Pressione `Ctrl+Shift+P`
2. Digite "Trae: Mostrar Problemas" e execute
3. **Resultado Esperado**: 
   - Painel lateral abre com título "🔍 Visualizador de Problemas - Trae"
   - Problemas aparecem organizados por arquivo
   - Contadores mostram totais por tipo

### Teste 3: Interface do Usuário

#### Verificar Layout
1. **Resumo no Topo**:
   - Contadores de erros (❌), avisos (⚠️), informações (ℹ️), dicas (💡)
   - Números devem corresponder aos problemas reais

2. **Grupos por Arquivo**:
   - Cada arquivo com problemas deve ter sua própria seção
   - Cabeçalho mostra nome do arquivo e contadores
   - Botão "📁 Copiar Arquivo" deve estar visível

3. **Problemas Individuais**:
   - Cada problema mostra ícone, linha/coluna, mensagem
   - Botão "📋" para copiar problema individual
   - Cores diferentes por tipo de problema

### Teste 4: Funcionalidades de Cópia

#### Copiar Problema Individual
1. Clique no botão "📋" ao lado de um problema
2. **Verificar**: Área de transferência deve conter:
```
Arquivo: teste.ts
Linha: X, Coluna: Y
Problema: [mensagem do erro]
```

#### Copiar Problemas de um Arquivo
1. Clique no botão "📁 Copiar Arquivo" no cabeçalho do grupo
2. **Verificar**: Área de transferência deve conter todos os problemas do arquivo

#### Copiar Todos os Problemas
1. Use o atalho `Ctrl+Shift+C` ou
2. Clique no botão "📋 Copiar Todos" no topo
3. **Verificar**: Relatório completo formatado na área de transferência

### Teste 5: Atalhos de Teclado

#### Testar Todos os Atalhos
1. **`Ctrl+Shift+R`**: Deve atualizar o conteúdo
2. **`Ctrl+Shift+C`**: Deve copiar relatório completo
3. **`Ctrl+Shift+P` → "Trae"**: Deve mostrar comandos

### Teste 6: Atualização de Conteúdo

#### Teste de Sincronização
1. Com o visualizador aberto, modifique o arquivo de teste
2. Adicione ou corrija erros
3. Use `Ctrl+Shift+R` para atualizar
4. **Verificar**: Problemas devem refletir as mudanças

### Teste 7: Navegação

#### Ir para Problema
1. Clique na localização (linha/coluna) de um problema
2. **Resultado Esperado**: Editor deve navegar para a linha/coluna exata

### Teste 8: Grupos Expansíveis

#### Expandir/Recolher
1. Clique no cabeçalho de um grupo de arquivo
2. **Verificar**: Grupo deve expandir/recolher
3. Estado deve ser mantido durante atualizações

## 🎯 Cenários de Teste Específicos

### Cenário 1: Projeto sem Problemas
1. Abra um projeto limpo (sem erros)
2. Execute "Mostrar Problemas"
3. **Esperado**: Mensagem "Nenhum problema encontrado" ou painel vazio

### Cenário 2: Muitos Problemas
1. Crie arquivo com 20+ erros
2. Teste performance do visualizador
3. **Verificar**: Interface permanece responsiva

### Cenário 3: Diferentes Tipos de Arquivo
1. Teste com arquivos `.js`, `.ts`, `.json`, `.md`
2. **Verificar**: Todos os tipos são suportados

### Cenário 4: Temas Claro/Escuro
1. Alterne entre temas do VS Code
2. **Verificar**: Interface se adapta corretamente

## 🐛 Problemas Conhecidos para Verificar

### Checklist de Validação
- [ ] Template strings foram corrigidas (não devem causar erro de build)
- [ ] esbuild compila sem erros
- [ ] Todos os comandos aparecem na paleta
- [ ] Atalhos funcionam corretamente
- [ ] Cópia para clipboard funciona
- [ ] Interface é responsiva
- [ ] Cores estão corretas por tipo
- [ ] Navegação para código funciona

## 📊 Critérios de Aprovação

### ✅ Teste Aprovado Se:
1. **Funcionalidade Core**: Coleta e exibe problemas corretamente
2. **Interface**: Layout responsivo e intuitivo
3. **Cópia**: Todas as opções de cópia funcionam
4. **Navegação**: Clique leva ao local correto no código
5. **Performance**: Resposta rápida mesmo com muitos problemas
6. **Atalhos**: Todos os atalhos de teclado funcionam
7. **Atualização**: Sincronização com aba Problems funciona

### ❌ Teste Reprovado Se:
1. Extensão não carrega
2. Comandos não aparecem
3. Interface não exibe problemas
4. Cópia não funciona
5. Erros no console do VS Code
6. Performance muito lenta

## 🔧 Solução de Problemas

### Se a Extensão Não Carregar
1. Verifique se o build foi bem-sucedido: `npm run compile`
2. Reinicie a janela de desenvolvimento: `Ctrl+R`
3. Verifique o console de desenvolvimento: `Help > Toggle Developer Tools`

### Se Problemas Não Aparecem
1. Verifique se há problemas na aba "Problems" nativa
2. Use o comando "Atualizar Problemas"
3. Teste com arquivo que certamente tem erros

### Se Cópia Não Funciona
1. Verifique permissões da área de transferência
2. Teste colando em editor de texto externo
3. Verifique console para erros JavaScript

## 📝 Relatório de Teste

Após completar os testes, documente:

```markdown
# Relatório de Teste - Extensão Trae Problems

**Data**: [data do teste]
**Testador**: [nome]
**Versão**: 0.0.1

## Resultados

### Funcionalidades Testadas
- [ ] ✅/❌ Coleta de problemas
- [ ] ✅/❌ Interface do usuário
- [ ] ✅/❌ Cópia individual
- [ ] ✅/❌ Cópia por arquivo
- [ ] ✅/❌ Cópia completa
- [ ] ✅/❌ Atalhos de teclado
- [ ] ✅/❌ Navegação
- [ ] ✅/❌ Atualização

### Problemas Encontrados
[Listar problemas encontrados]

### Sugestões de Melhoria
[Listar sugestões]

### Status Final
- [ ] ✅ Aprovado para uso
- [ ] ❌ Necessita correções
```

---

**Próximo Passo**: Após aprovação nos testes, a extensão estará pronta para uso e distribuição.