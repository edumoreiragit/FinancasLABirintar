import React, { useState, useRef } from 'react';
import { parseStatementWithGemini } from '../services/geminiService.js';
import TransactionTable from '../components/TransactionTable.js';
import { COLORS } from '../constants.js';

const ImportEntry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Por favor, selecione um arquivo PDF.");
      return;
    }

    setLoading(true);
    setError(null);
    setTransactions([]);
    setSuccessMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        try {
          const parsedTransactions = await parseStatementWithGemini(base64Data, file.type);
          setTransactions(parsedTransactions);
        } catch (err) {
          setError(err.message || "Erro ao processar arquivo");
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Erro ao ler o arquivo.");
        setLoading(false);
      };
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("Erro inesperado.");
    }
  };

  const handleUpdateTransaction = (id, field, value) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleExportToSheets = () => {
    // In a production environment, this would call the Google Sheets API.
    // For this prototype, we will log the CSV to console and show an alert.
    
    setLoading(true);
    setTimeout(() => {
        console.log("Exporting to Sheets (Simulated):", transactions);
        
        // Generate a CSV for the user to download as fallback since we don't have OAuth backend
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Data,Aplicação,Fonte,Histórico,Valor\n"
            + transactions.map(t => 
                `${t.date},${t.aplicacao},${t.fonte},${t.historico},${t.value}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lancamentos_diario_labirintar.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSuccessMessage("Dados processados! Como não temos conexão OAuth direta configurada, baixamos um CSV formatado para você importar no 'Diário'.");
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Importação de Extrato</h1>
        <p className="text-gray-600 mt-2">
          Carregue o PDF do extrato bancário. A IA irá identificar as contas de Fonte e Aplicação.
        </p>
      </header>

      {/* Upload Area */}
      <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-dashed border-lab-hortencia hover:border-lab-laranja transition-colors text-center">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload} 
          className="hidden" 
          ref={fileInputRef}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-lab-areia rounded-full flex items-center justify-center mb-4 text-lab-goiaba">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <span className="text-lg font-medium text-gray-700">Clique para selecionar o PDF</span>
          <span className="text-sm text-gray-400 mt-1">Extrato bancário (PDF)</span>
        </label>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lab-goiaba mb-4"></div>
            <p className="text-lab-chocolate animate-pulse">Lendo extrato e categorizando lançamentos...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Sucesso! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Results Table */}
      {transactions.length > 0 && !loading && (
        <div className="mt-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Validação dos Lançamentos ({transactions.length})
            </h2>
            <button
              onClick={handleExportToSheets}
              className="bg-lab-goiaba hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Enviar para Diário
            </button>
          </div>
          
          <TransactionTable 
            transactions={transactions} 
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      )}
    </div>
  );
};

export default ImportEntry;