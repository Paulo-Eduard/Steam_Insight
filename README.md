# 🎮 Steam Insight

O Steam Insight é uma plataforma de análise de dados desenvolvida para explorar informações da Steam de forma simples e intuitiva. O projeto surgiu da união entre desenvolvimento de software e análise de dados, com o objetivo de transformar grandes volumes de informações em visualizações claras e úteis.

A aplicação permite analisar jogos, gêneros, avaliações e tendências do mercado gamer através de dashboards interativos, gráficos e ferramentas de pesquisa.

## 🚀 Funcionalidades

* Dashboard com métricas gerais da plataforma
* Lista dos jogos mais populares
* Jogos com maior tempo médio de jogo
* Análise de gêneros
* Busca de jogos
* Visualização de dados através de gráficos interativos
* Interface responsiva para diferentes dispositivos

## 🛠️ Tecnologias Utilizadas

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* FastAPI
* Python
* Pandas

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/Paulo-Eduard/Steam_Insight.git
cd Steam_Insight
```

### Backend

```bash
cd backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

A API ficará disponível em:

```bash
http://127.0.0.1:8000
```

Documentação da API:

```bash
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

A aplicação ficará disponível em:

```bash
http://localhost:5173
```

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para praticar conceitos de desenvolvimento Full Stack, integração entre frontend e backend, análise de dados e visualização de informações.

Além do aprendizado técnico, o Steam Insight também faz parte do nosso portfólio como demonstração das habilidades adquiridas durante o desenvolvimento.

## 📂 Dataset

Os arquivos de dados utilizados no projeto não estão incluídos neste repositório devido ao limite de armazenamento do GitHub.

Após clonar o projeto, adicione os arquivos:

* games.csv
* games.json

na pasta:

```text
backend/data/raw/
```

Caso não possua os arquivos, entre em contato com a equipe do projeto para obter uma cópia do dataset utilizado durante o desenvolvimento.

## 🔮 Próximas Melhorias

* Novos dashboards e visualizações
* Filtros avançados
* Comparação entre jogos
* Recomendações mais inteligentes
* Melhorias na experiência do usuário
* Otimizações de desempenho

## 👥 Equipe

* Paulo Eduardo
* Yahona
* Ysaac
* Henrique

Estudantes e desenvolvedores apaixonados por tecnologia, programação, análise de dados e pelo universo dos games.

---

⭐ Se gostou do projeto, considere deixar uma estrela no repositório.
