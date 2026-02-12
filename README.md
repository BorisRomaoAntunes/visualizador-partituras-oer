# Visualizador de Partituras OER

Este é um site simples e moderno para visualização de partituras em PDF, otimizado para músicos da Orquestra Experimental de Repertório.

🌐 **Acesse em:** [https://borisromaoantunes.github.io/visualizador-partituras-oer/](https://borisromaoantunes.github.io/visualizador-partituras-oer/)

## 🚀 Como Atualizar os PDFs

Para trocar a partitura ou agenda no site:

1.  Coloque o novo arquivo PDF na pasta `assets/files/`.
2.  O nome deve terminar com a versão, ex: `Arquivo_v2.pdf`.
3.  Abra o arquivo `pdf-config.json` e atualize o nome do arquivo correspondente.
4.  Faça o **commit** e **push** para o GitHub.
5.  O site atualizará automaticamente em 1 minuto!

## 🛠 Estrutura

-   **index.html**: Interface principal.
-   **pdf-config.json**: Configuração dinâmica de quais arquivos exibir.
-   **assets/js/version-tracker.js**: Sistema inteligente que avisa músicos sobre novas versões ("NOVO").
