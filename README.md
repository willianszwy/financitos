# 💰 Financitos - Gestão Financeira

Um Progressive Web App (PWA) moderno para gestão de finanças pessoais com armazenamento local e funcionalidades offline.

## 🚀 Funcionalidades

### 💵 Gestão Financeira
- **Entradas**: Controle de receitas por fonte e data
- **Saídas**: Gerenciamento de gastos com categorização (Fixa/Única)
- **Investimentos**: Acompanhamento de Poupança e CDI com cálculos automáticos
- **Resumo Financeiro**: Dashboard com visão consolidada

### 🛒 Lista de Compras (Comprinhas)
- Sistema de prioridades com cores (🔴 Alta, 🟡 Média, 🔵 Baixa)
- Links para produtos e estimativas de preço
- Controle de prazos e status de compra
- Interface otimizada para mobile

### 📱 Características PWA
- Funciona completamente offline
- Instalável no dispositivo
- Dados salvos localmente no navegador
- Design responsivo mobile-first
- Sem necessidade de conexão com internet

### 🔧 Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Formulários**: React Hook Form
- **Roteamento**: React Router
- **Ícones**: Lucide React
- **Datas**: date-fns
- **PWA**: Vite PWA Plugin
- **Testes**: Vitest + React Testing Library
- **Armazenamento**: Local Storage API

## 📦 Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone git@github.com:willianszwy/financitos.git
cd financitos

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Execute os testes
npm test

# Build para produção
npm run build
```

### 💾 **Armazenamento de Dados**

- **Totalmente Local**: Todos os dados ficam salvos no seu navegador
- **Offline**: Funciona sem internet
- **Privacidade**: Seus dados nunca saem do seu dispositivo
- **Backup Manual**: Use as funcionalidades de exportar/importar (futuras)

## 🎯 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza build de produção localmente
- `npm test` - Executa todos os testes
- `npm run test:ui` - Executa testes com interface visual
- `npm run lint` - Executa linting do código

## 📊 Estrutura do Projeto

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis
│   ├── forms/           # Formulários específicos
│   ├── modals/          # Componentes de modal
│   └── cards/           # Cards de resumo
├── pages/
│   ├── Financitos/      # Página principal de finanças
│   └── Comprinhas/      # Página de lista de compras
├── hooks/
│   ├── useLocalStorage/ # Gerenciamento de storage local
│   ├── useCurrencyMask.ts # Máscara monetária para inputs
│   └── useNotifications/ # Sistema de notificações (futuro)
├── services/
│   ├── storage.ts       # Gerenciamento de dados local
│   └── notifications.ts # Sistema de notificações (futuro)
├── utils/
│   ├── calculations.ts  # Cálculos financeiros
│   ├── formatters.ts    # Formatação de dados
│   ├── dates.ts         # Manipulação de datas
│   └── helpers.ts       # Funções auxiliares
└── types/
    ├── financial.ts     # Types para dados financeiros
    └── shopping.ts      # Types para lista de compras
```

## 🎨 Paleta de Cores

- **Verde (Entradas)**: #139469 / #077552
- **Vermelho (Saídas)**: #992525 / #700909  
- **Azul (Investimentos)**: #1f498d / #06173b
- **Prioridade Alta**: #a85959
- **Prioridade Média**: #ddb56f
- **Prioridade Baixa**: #5c85c7

## 🔮 Próximas Funcionalidades

- [x] **Máscaras monetárias** - Formatação automática R$ 1.234,56
- [x] **Edição de registros** - Modais para editar entradas, saídas e investimentos
- [ ] **Exportação de dados** - Backup em arquivo JSON
- [ ] **Importação de dados** - Restaurar backup de arquivo
- [ ] **Notificações push** para vencimentos
- [ ] **Gráficos e relatórios** avançados
- [ ] **Categorização avançada** de gastos
- [ ] **Metas financeiras**

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) antes de submeter um PR.

---

Desenvolvido com ❤️ usando React e TypeScript