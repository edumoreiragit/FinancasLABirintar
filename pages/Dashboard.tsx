import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { COLORS } from '../constants';

const Dashboard: React.FC = () => {
  // Mock data for visualization
  const dataPie = [
    { name: 'Receita Serviços', value: 12500 },
    { name: 'Investimento', value: 5000 },
  ];

  const dataBar = [
    { name: 'Jan', receita: 4000, despesa: 2400 },
    { name: 'Fev', receita: 3000, despesa: 1398 },
    { name: 'Mar', receita: 9800, despesa: 9800 }, // Break even
    { name: 'Abr', receita: 3908, despesa: 4800 },
    { name: 'Mai', receita: 4800, despesa: 3800 },
    { name: 'Jun', receita: 3800, despesa: 4300 },
  ];

  const pieColors = [COLORS.menta, COLORS.laranja];

  return (
    <div className="p-6 max-w-7xl mx-auto">
       <h1 className="text-3xl font-bold text-gray-800 mb-2">Visão Geral</h1>
       <p className="text-gray-500 mb-8">Bem-vindo ao Finanças LABirintar.</p>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-lab-menta">
            <h3 className="text-sm font-semibold text-gray-400 uppercase">Receita (Mês Atual)</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">R$ 17.500,00</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-lab-goiaba">
             <h3 className="text-sm font-semibold text-gray-400 uppercase">Despesas (Mês Atual)</h3>
             <p className="text-2xl font-bold text-gray-800 mt-2">R$ 8.350,20</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-lab-laranja">
             <h3 className="text-sm font-semibold text-gray-400 uppercase">Resultado</h3>
             <p className="text-2xl font-bold text-green-600 mt-2">R$ 9.149,80</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fluxo de Caixa Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Fluxo de Caixa (Semestral)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataBar}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                  <Tooltip 
                    cursor={{fill: COLORS.areia}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="receita" fill={COLORS.menta} radius={[4, 4, 0, 0]} name="Entradas" />
                  <Bar dataKey="despesa" fill={COLORS.goiaba} radius={[4, 4, 0, 0]} name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Composição Receita Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Composição de Receitas</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
       </div>
    </div>
  );
};

export default Dashboard;