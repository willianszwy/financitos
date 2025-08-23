# 💰 Financitos - Gestão Financeira

Um Progressive Web App (PWA) moderno para gestão de finanças pessoais com funcionalidades offline e sincronização com Google Drive.

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
- Funciona offline
- Instalável no dispositivo
- Armazenamento local persistente
- Design responsivo mobile-first

### 🔧 Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Formulários**: React Hook Form
- **Roteamento**: React Router
- **Ícones**: Lucide React
- **Datas**: date-fns
- **PWA**: Vite PWA Plugin
- **Testes**: Vitest + React Testing Library
- **API**: Google Drive API v3 para sincronização

## 📦 Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone git@github.com:willianszwy/financitos.git
cd financitos

# Instale as dependências
npm install

# Configure as variáveis de ambiente (opcional para Google Drive)
cp .env.example .env
# Edite o .env com suas credenciais do Google Drive API

# Execute em modo de desenvolvimento
npm run dev

# Execute os testes
npm test

# Build para produção
npm run build
```

### 🔑 Configuração do Google Drive (Opcional)

Para habilitar a sincronização com Google Drive:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Drive API**
4. Crie credenciais:
   - **OAuth 2.0 Client ID** para autenticação
   - **API Key** para acesso à API
5. Configure as origens autorizadas:
   - Development: `http://localhost:5173`
   - Production: `https://willianszwy.github.io`
6. Adicione as credenciais no arquivo `.env`

```env
VITE_GOOGLE_CLIENT_ID=seu-client-id.googleusercontent.com
VITE_GOOGLE_API_KEY=sua-api-key
```

### 🚀 Deploy no GitHub Pages

Para usar a integração Google Drive em produção:

1. **Configurar Secrets no GitHub**:
   - Vá para Settings → Secrets and variables → Actions
   - Adicione as secrets:
     - `VITE_GOOGLE_CLIENT_ID`: seu-client-id.googleusercontent.com
     - `VITE_GOOGLE_API_KEY`: sua-api-key

2. **Configurar Google Cloud Console**:
   - Adicione `https://willianszwy.github.io` nas origens autorizadas
   - O deploy automático injetará as variáveis durante o build

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
│   ├── useGoogleDrive/  # Hook para Google Drive (futuro)
│   ├── useLocalStorage/ # Gerenciamento de storage local
│   └── useNotifications/ # Sistema de notificações (futuro)
├── services/
│   ├── googleDrive.ts   # API do Google Drive (futuro)
│   ├── storage.ts       # Gerenciamento de dados
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

- [x] **Integração com Google Drive API** - Sincronização manual via botão
- [ ] Notificações push para vencimentos
- [ ] Gráficos e relatórios avançados
- [ ] Backup automático na nuvem
- [ ] Categorização avançada de gastos
- [ ] Metas financeiras
- [ ] Sincronização automática em background

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) antes de submeter um PR.

---

Desenvolvido com ❤️ usando React e TypeScript