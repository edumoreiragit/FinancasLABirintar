export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string; // Original description from statement
  value: number;
  
  // Accounting Fields
  historico: string; // Description for the "Diário"
  aplicacao: string; // Débito (Destination/Expense/Asset)
  fonte: string; // Crédito (Origin/Income/Liability)
  
  status: 'pending' | 'verified' | 'exported';
}

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
}

export enum AccountType {
  ASSET = 'Ativo',
  LIABILITY = 'Passivo',
  INCOME = 'Receita',
  EXPENSE = 'Despesa'
}

// Simplified Chart of Accounts for dropdowns
export const PLANO_DE_CONTAS_SUGESTAO = [
  "Banco Inter",
  "Banco do Brasil",
  "Caixa",
  "Clientes a Receber",
  "Fornecedores a Pagar",
  "Despesas Administrativas",
  "Despesas com Pessoal",
  "Receita de Serviços",
  "Impostos a Recolher",
  "Sócios - Capital Social",
  "Sócios - Conta Corrente"
];