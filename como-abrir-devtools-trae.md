# Como Abrir Developer Tools no Trae AI

## Comando Direto

Para abrir o Developer Tools no Trae AI (em vez do VS Code), use:

```bash
"C:\Program Files\Trae\Trae.exe" --command workbench.action.toggleDevTools
```

## Script Batch (Mais Fácil)

Criamos um script batch para facilitar o uso:

```bash
.\trae-devtools.bat
```

Ou execute diretamente:

```bash
c:\Users\Anton\Documents\extensao\trae-devtools.bat
```

## Como Usar

1. **Abrir Developer Tools:**
   - Execute o script `trae-devtools.bat`
   - Ou use o comando completo acima

2. **Verificar Logs da Extensão:**
   - Após abrir o Developer Tools
   - Vá para a aba "Console"
   - Procure por mensagens com 🚀, 📝, ✅ da extensão TraeCursor

3. **Testar a Extensão:**
   - Use `Ctrl+Shift+T` para mostrar problemas
   - Ou `Ctrl+Shift+P` → digite "TraeCursor"

## Notas

- O comando funciona igual ao VS Code
- O Trae AI é baseado no VS Code/Electron
- O Developer Tools ajuda a debugar extensões
- Use para verificar se a extensão TraeCursor está ativa

## Localização dos Arquivos

- **Executável do Trae:** `C:\Program Files\Trae\Trae.exe`
- **Script Batch:** `c:\Users\Anton\Documents\extensao\trae-devtools.bat`
- **Este Guia:** `c:\Users\Anton\Documents\extensao\como-abrir-devtools-trae.md`