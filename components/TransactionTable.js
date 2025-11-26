import React from 'react';
import { PLANO_DE_CONTAS_SUGESTAO } from '../constants.js';

const TransactionTable = ({ transactions, onUpdate, onDelete }) => {
  if (transactions.length === 0) return null;

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6 bg-white">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-white uppercase bg-lab-goiaba">
          <tr>
            <th scope="col" className="px-4 py-3">Data</th>
            <th scope="col" className="px-4 py-3">Descrição Original</th>
            <th scope="col" className="px-4 py-3">Valor</th>
            <th scope="col" className="px-4 py-3">Aplicação (Débito)</th>
            <th scope="col" className="px-4 py-3">Fonte (Crédito)</th>
            <th scope="col" className="px-4 py-3">Histórico</th>
            <th scope="col" className="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-lab-areia/50 transition-colors">
              {/* Date */}
              <td className="px-4 py-3">
                <input 
                  type="date" 
                  value={t.date} 
                  onChange={(e) => onUpdate(t.id, 'date', e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:border-lab-laranja outline-none w-28"
                />
              </td>
              
              {/* Original Description (Read Only) */}
              <td className="px-4 py-3 max-w-xs truncate text-gray-500" title={t.description}>
                {t.description}
              </td>

              {/* Value */}
              <td className={`px-4 py-3 font-semibold ${t.value < 0 ? 'text-lab-goiaba' : 'text-lab-menta'}`}>
                R$ {t.value.toFixed(2)}
              </td>

              {/* Aplicação (Input with Datalist) */}
              <td className="px-4 py-3">
                 <input 
                  list="accounts-list"
                  value={t.aplicacao}
                  onChange={(e) => onUpdate(t.id, 'aplicacao', e.target.value)}
                  className="bg-white border border-gray-200 rounded px-2 py-1 text-xs w-full focus:ring-1 focus:ring-lab-laranja"
                />
              </td>

              {/* Fonte (Input with Datalist) */}
              <td className="px-4 py-3">
                <input 
                  list="accounts-list"
                  value={t.fonte}
                  onChange={(e) => onUpdate(t.id, 'fonte', e.target.value)}
                  className="bg-white border border-gray-200 rounded px-2 py-1 text-xs w-full focus:ring-1 focus:ring-lab-laranja"
                />
              </td>

               {/* Historico */}
               <td className="px-4 py-3">
                <input 
                  type="text"
                  value={t.historico}
                  onChange={(e) => onUpdate(t.id, 'historico', e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:border-lab-laranja outline-none w-full"
                />
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-center">
                <button 
                  onClick={() => onDelete(t.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Remover linha"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Datalist for autocomplete */}
      <datalist id="accounts-list">
        {PLANO_DE_CONTAS_SUGESTAO.map(acc => (
          <option key={acc} value={acc} />
        ))}
      </datalist>
    </div>
  );
};

export default TransactionTable;