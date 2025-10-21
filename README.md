# 🚀 PathTrack — Sistema Inteligente de Análise de Notas Fiscais

O **PathTrack** é uma aplicação web que utiliza **Inteligência Artificial** para extrair e analisar dados de notas fiscais de forma automática. A solução permite que usuários façam upload de imagens de notas fiscais e recebam análises detalhadas com insights financeiros e visualizações gráficas.

---

## 🎯 Objetivo

Criar uma ferramenta **acessível e intuitiva** que automatize a análise de gastos a partir de notas fiscais, fornecendo insights valiosos sobre padrões de consumo, categorias de produtos e histórico de compras, sem necessidade de digitação manual.

---

## 🧩 Funcionalidades

- ✅ **Autenticação simulada** com login e cadastro (LocalStorage)
- 📤 **Upload de imagens** de notas fiscais (.jpg, .png, .pdf)
- 🤖 **Extração automática de dados** via Google Gemini AI 2.0 Flash
- 📊 **Análise inteligente** com identificação automática de categorias de produtos
- 📈 **Visualizações interativas** com múltiplos gráficos (Chart.js)
- 📋 **Histórico completo** com estatísticas e análise temporal
- 💾 **Exportação de dados** em HTML (para PDF) e CSV
- 🎨 **Interface moderna** com Font Awesome icons e design responsivo

---

## 🧪 Tecnologias Utilizadas

- **HTML5 / CSS3** — Estrutura e estilização
- **JavaScript (Vanilla)** — Lógica da aplicação
- **Google Gemini AI 2.0 Flash** — Extração inteligente de dados
- **Chart.js 4.x** — Geração de gráficos interativos
- **Font Awesome 6.4.2** — Ícones profissionais
- **LocalStorage** — Persistência de dados no cliente
- **Vercel** — Hospedagem e deploy

---

## 📁 Estrutura do Projeto

```
pathtrack/
│
├── index.html           # Página inicial (landing page)
├── login.html           # Autenticação de usuário
├── cadastro.html        # Registro de novo usuário
├── upload.html          # Upload e processamento de notas fiscais
├── analise.html         # Visualização detalhada da última nota
├── historico.html       # Dashboard com histórico e estatísticas
│
├── style.css            # Estilos globais da aplicação
├── script.js            # Lógica de autenticação e navegação
├── historico.js         # Lógica de gráficos, estatísticas e exportação
│
└── assets/              # Recursos visuais (imagens, ícones)
```

---

## 💡 Como Usar

1. **Acesse a aplicação**: [path-track-nine.vercel.app](https://path-track-nine.vercel.app)
2. **Crie uma conta** ou faça login (dados fictícios)
3. **Faça upload** de uma imagem de nota fiscal
4. **Aguarde a análise** da IA (extração automática de dados)
5. **Visualize os insights** com gráficos e estatísticas
6. **Acesse o histórico** para ver todas as notas e análises consolidadas
7. **Exporte os dados** em HTML ou CSV conforme necessário

---

## 🤖 Integração com IA

O sistema utiliza a **API do Google Gemini 2.0 Flash Experimental** para:

- Extrair dados estruturados (loja, CNPJ, data, itens, valores)
- Identificar automaticamente **categorias de produtos** (12 categorias principais)
- Calcular totais e subtotais
- Gerar insights personalizados sobre padrões de consumo

A IA é instruída a **sempre deduzir a categoria** dos produtos, evitando classificações genéricas.

---

## � Recursos de Análise

### Página de Análise Individual
- 📌 Informações da loja e nota fiscal
- 💡 5 insights inteligentes (maior gasto, categoria principal, ticket médio, etc.)
- 📈 Gráfico de distribuição de gastos por produto
- 🗂️ Lista detalhada de itens com categorias

### Página de Histórico
- 📊 **5 gráficos interativos**:
  - Gastos por loja (barras)
  - Evolução temporal (linha)
  - Produtos mais comprados (rosca)
  - Distribuição por faixa de valor (barras)
  - Gastos por categoria (rosca)
- 📈 **Estatísticas gerais**: Total de notas, valor acumulado, ticket médio, lojas únicas
- 💾 **Exportação**: HTML (pronto para impressão/PDF) e CSV com dados detalhados

---

## 📦 Deploy

Aplicação hospedada na **Vercel**:  
🔗 **[path-track-nine.vercel.app](https://path-track-nine.vercel.app)**

---

## �‍💻 Desenvolvimento

Projeto desenvolvido como trabalho acadêmico, demonstrando integração de IA generativa em aplicações web práticas para análise de dados financeiros.


