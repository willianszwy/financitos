# 📱 Protótipos - Financitos PWA

## Visão Geral do Projeto

**Financitos** é um aplicativo PWA (Progressive Web App) de finanças pessoais que permite:
- Gestão mensal de entradas, saídas e investimentos
- Upload de comprovantes para Google Drive
- Notificações automáticas de vencimento
- Lista de compras (App Comprinhas)
- Funcionamento offline
- Sincronização automática com Google Drive

---

## 📱 Tela Principal - Financitos

```
┌─────────────────────────────────────┐
│ 🏦 Financitos                    ≡  │
├─────────────────────────────────────┤
│     ◀ Janeiro 2024 ▶      📅 2024   │
├─────────────────────────────────────┤
│ RESUMO FINANCEIRO                   │
│ ┌─────────────────────────────────┐ │
│ │ 💚 ENTRADAS      R$ 5.200,00   │ │
│ │ ❤️ SAÍDAS        R$ 3.850,00   │ │
│ │   • Fixa         R$ 2.100,00   │ │
│ │   • Única        R$ 1.750,00   │ │
│ │ 💙 INVESTIMENTOS R$ 15.300,00  │ │
│ │   • Poupança     R$ 8.200,00   │ │
│ │   • CDI          R$ 7.100,00   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 💰 ENTRADAS                        │
│ ┌─────────────────────────────────┐ │
│ │ Fonte: [Salário            ▼] │ │
│ │ Data:  [15/01/2024]           │ │
│ │ Valor: [R$ 4.500,00]          │ │
│ │              [+ Adicionar]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Lista de entradas do mês...         │
├─────────────────────────────────────┤
│ 🛒 SAÍDAS                          │
│ ┌─────────────────────────────────┐ │
│ │ Descrição: [Mercado...]         │ │
│ │ Tipo: [Única ▼] Status:[Pago▼] │ │
│ │ Vencto: [20/01] Data:[18/01]   │ │
│ │ ModPag: [PIX ▼] Valor:[R$ 350] │ │
│ │ Comprovante: [📎 Upload]       │ │
│ │              [+ Adicionar]     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📈 Seção Investimentos (continuação da tela)

```
┌─────────────────────────────────────┐
│ 💰 INVESTIMENTOS                   │
│                                     │
│ 🏛️ POUPANÇA                        │
│ ┌─────────────────────────────────┐ │
│ │ Banco: [Itaú]                   │ │
│ │ Valor: [R$ 8.200,00]            │ │
│ │ Crescimento: +R$ 45,60 📈       │ │
│ │ Taxa: [0,5%]                    │ │
│ │ Projeção: R$ 8.241,00           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 CDI                             │
│ ┌─────────────────────────────────┐ │
│ │ Banco: [Nubank]                 │ │
│ │ Valor: [R$ 7.100,00]            │ │
│ │ Crescimento: +R$ 89,30 📈       │ │
│ │ Taxa: [1,2%]                    │ │
│ │ Projeção: R$ 7.185,20           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [💾 Salvar Google Drive]           │
└─────────────────────────────────────┘
```

---

## 🛍️ Tela Comprinhas

```
┌─────────────────────────────────────┐
│ 🛒 Comprinhas                    ≡  │
├─────────────────────────────────────┤
│ [+ Novo Item]                       │
├─────────────────────────────────────┤
│ AGENDA DE COMPRAS                   │
│                                     │
│ ┌─ Item ─────┬─Valor─┬─Pri─┬─Dead─┐ │
│ │ Notebook   │ 2500  │ 🔴  │15/02│ │
│ │ Gamer      │       │     │     │ │
│ │ [🔗 Link]   │       │     │     │ │
│ ├────────────┼───────┼─────┼─────┤ │
│ │ Mesa       │  450  │ 🟡  │28/01│ │
│ │ Escritório │       │     │     │ │
│ │ [🔗 Link]   │       │     │     │ │
│ ├────────────┼───────┼─────┼─────┤ │
│ │ Cadeira    │  320  │ 🔵  │10/03│ │
│ │ Ergonômica │       │     │     │ │
│ │ [🔗 Link]   │       │     │     │ │
│ └────────────┴───────┴─────┴─────┘ │
│                                     │
│ Legenda:                           │
│ 🔴 Alta  🟡 Média  🔵 Baixa        │
└─────────────────────────────────────┘
```

---

## 📋 Modal de Adição (Saídas)

```
┌─────────────────────────────────────┐
│ ➕ Nova Saída               ✖️      │
├─────────────────────────────────────┤
│ Descrição:                          │
│ [Supermercado Extra              ] │
│                                     │
│ Tipo:        Status:                │
│ [Única ▼]    [Pendente ▼]          │
│                                     │
│ Vencimento:  Data da Compra:        │
│ [25/01/2024] [23/01/2024]          │
│                                     │
│ Modo Pagamento:                     │
│ [PIX ▼]                            │
│                                     │
│ Valor:                              │
│ [R$ 287,50]                        │
│                                     │
│ Comprovante:                        │
│ ┌─────────────────────────────────┐ │
│ │ 📎 Arraste aqui ou clique       │ │
│ │    para fazer upload            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💾 Salvar em:                      │
│ ☑️ Local  ☐ Google Drive           │
│                                     │
│        [Cancelar] [Salvar]         │
└─────────────────────────────────────┘
```

---

## 🔔 Notificação de Vencimento

```
┌─────────────────────────────────────┐
│ 🏦 Financitos - Lembrete            │
│                                     │
│ ⏰ Vencimento Hoje!                │
│                                     │
│ • Conta de Luz - R$ 156,78          │
│ • Internet - R$ 99,90               │
│                                     │
│ [Ver Detalhes] [Dispensar]         │
└─────────────────────────────────────┘
```

---

## 📱 Modal de Novo Item (Comprinhas)

```
┌─────────────────────────────────────┐
│ ➕ Novo Item de Compra      ✖️      │
├─────────────────────────────────────┤
│ Item:                               │
│ [Smartphone Samsung Galaxy      ] │
│                                     │
│ Valor:                              │
│ [R$ 1.299,00]                      │
│                                     │
│ Prioridade:                         │
│ ◉ 🔴 Alta                          │
│ ○ 🟡 Média                         │
│ ○ 🔵 Baixa                         │
│                                     │
│ Deadline:                           │
│ [15/03/2024]                       │
│                                     │
│ Link:                               │
│ [https://loja.exemplo.com/...   ] │
│                                     │
│        [Cancelar] [Salvar]         │
└─────────────────────────────────────┘
```

---

## 🎨 Paleta de Cores

### Cores Principais
- **Verde (Entradas)**: #139469ff / #077552ff
- **Vermelho (Saídas)**: #992525ff / #700909ff  
- **Azul (Investimentos)**: #1f498dff / #06173bff
- **Cinza (Neutro)**: #6B7280 / #4B5563

### Cores de Prioridade (Comprinhas)
- **Alta**: 🔴 #a85959ff
- **Média**: 🟡 #ddb56fff
- **Baixa**: 🔵 #5c85c7ff

---

## 📋 Funcionalidades Detalhadas

### 1. Navegação de Meses/Anos
- Setas para navegar entre meses
- Seletor de ano clicável
- Carregamento automático dos dados do mês selecionado

### 2. Card de Resumo Financeiro
- **Entradas**: Soma total de todas as fontes do mês
- **Saídas**: 
  - Total geral
  - Subtotal "Fixa" (contas mensais)  
  - Subtotal "Única" (gastos esporádicos)
- **Investimentos**:
  - Total geral
  - Subtotal "Poupança" 
  - Subtotal "CDI"

### 3. Seção de Entradas
- **Fonte**: Input livre (ex: Salário, Freelancer, Dividendos)
- **Data**: Seletor de data
- **Valor**: Input numérico com formatação de moeda
- **Lista**: Exibe todas as entradas do mês selecionado

### 4. Seção de Saídas
- **Descrição**: Input livre para identificação
- **Tipo**: Dropdown (Fixa/Única)
- **Vencimento**: Data + notificação automática às 10:00
- **Data**: Data da compra/pagamento
- **Status**: Dropdown (Pago/Pendente)
- **ModPag**: Dropdown (Crédito/Débito/PIX)
- **Valor**: Input numérico
- **Comprovante**: Upload para pasta organizada por mês/ano

### 5. Seção de Investimentos

#### Poupança
- **Banco**: Input livre
- **Valor**: Valor atual
- **Crescimento**: Diferença do mês anterior (automático)
- **Taxa**: Input de percentual
- **Projeção**: Cálculo automático (Valor + Valor × Taxa)

#### CDI
- Mesmos campos da Poupança
- Cálculos independentes

### 6. App Comprinhas
- **Item**: Descrição do produto
- **Valor**: Preço estimado
- **Prioridade**: Visual com bolinhas coloridas
- **Deadline**: Data limite para compra
- **Link**: URL editável que abre em nova aba

### 7. Sistema de Notificações
- **Push Notifications** para vencimentos
- **Horário fixo**: 10:00 da manhã
- **Conteúdo**: Nome do item + valor

### 8. Armazenamento Google Drive
- **Autenticação OAuth2**
- **Estrutura de pastas organizadas**:
  ```
  /Financitos/
  ├── dados/
  │   ├── 2024-01.json
  │   ├── 2024-02.json
  │   └── ...
  └── comprovantes/
      ├── 2024-01/
      ├── 2024-02/
      └── ...
  ```
- **Sincronização automática**
- **Backup de segurança**

---

## 🛠️ Tecnologias Propostas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **React Hook Form** para formulários
- **Date-fns** para manipulação de datas
- **Lucide Icons** para ícones

### PWA
- **Service Worker** (Workbox)
- **Web App Manifest**
- **Push API** para notificações
- **Cache API** para offline

### APIs
- **Google Drive API** v3
- **Google OAuth2** para autenticação
- **File System Access API** para uploads

### Armazenamento
- **Local Storage** (offline)
- **Google Drive** (sincronização)
- **IndexedDB** (cache local)

---

## 📐 Estrutura de Pastas Proposta

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis
│   ├── forms/           # Formulários específicos
│   ├── modals/          # Modais
│   └── cards/           # Cards de resumo
├── pages/
│   ├── Financitos/      # Página principal
│   └── Comprinhas/      # Lista de compras
├── hooks/
│   ├── useGoogleDrive/  # Hook para Google Drive
│   ├── useLocalStorage/ # Hook para storage local
│   └── useNotifications/ # Hook para notificações
├── services/
│   ├── googleDrive.ts   # API do Google Drive
│   ├── storage.ts       # Gerenciamento de dados
│   └── notifications.ts # Sistema de notificações
├── utils/
│   ├── calculations.ts  # Cálculos financeiros
│   ├── formatters.ts    # Formatação de dados
│   └── dates.ts         # Manipulação de datas
├── types/
│   ├── financial.ts     # Types para dados financeiros
│   └── shopping.ts      # Types para lista de compras
└── styles/
    └── globals.css      # Estilos globais Tailwind
```

---

## 🚀 Próximos Passos

1. **Setup do projeto PWA**
2. **Configuração do Google Drive API**
3. **Implementação da tela principal**
4. **Sistema de notificações**
5. **Upload de arquivos**
6. **App Comprinhas**
7. **Testes e otimizações**
8. **Deploy e configuração PWA**

---

*Documento criado em: Janeiro 2024*
*Projeto: Financitos PWA - App de Finanças Pessoais*