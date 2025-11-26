import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseStatementWithGemini = async (
  base64Pdf: string, 
  mimeType: string
): Promise<Transaction[]> => {
  
  const modelId = "gemini-2.5-flash"; // Optimized for document understanding
  
  const prompt = `
    Você é um assistente contábil experiente para a empresa "LABirintar".
    Analise o extrato bancário fornecido (PDF) e extraia todas as transações financeiras.
    
    Para cada transação, você deve gerar um objeto JSON com os seguintes campos:
    
    1. 'date': Data no formato YYYY-MM-DD.
    2. 'description': A descrição original do extrato.
    3. 'value': O valor numérico (positivo para entradas, negativo para saídas).
    4. 'historico': Um resumo curto e profissional do evento (ex: "Pagamento Fornecedor X", "Recebimento Cliente Y").
    5. 'fonte': A conta de Origem (Crédito). 
       - Se valor < 0 (saída): A fonte é geralmente a conta bancária (ex: "Banco Inter").
       - Se valor > 0 (entrada): A fonte é geralmente uma conta de receita ou cliente (ex: "Cliente a Receber", "Receita de Vendas"). Tente inferir pelo texto.
    6. 'aplicacao': A conta de Destino (Débito).
       - Se valor < 0 (saída): A aplicação é a despesa ou fornecedor (ex: "Despesas Administrativas", "Fornecedores"). Tente inferir pelo texto.
       - Se valor > 0 (entrada): A aplicação é a conta bancária (ex: "Banco Inter").

    Regras Importantes:
    - O valor deve ser float.
    - Tente padronizar os nomes das contas (Fonte/Aplicação) baseado em práticas contábeis comuns.
    - Se não tiver certeza da conta, use "A Classificar".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Pdf
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              description: { type: Type.STRING },
              value: { type: Type.NUMBER },
              historico: { type: Type.STRING },
              fonte: { type: Type.STRING },
              aplicacao: { type: Type.STRING },
            }
          }
        }
      }
    });

    const jsonText = response.text || "[]";
    const rawData = JSON.parse(jsonText);

    // Map to our internal Transaction type with unique IDs
    return rawData.map((item: any, index: number) => ({
      id: `trans_${Date.now()}_${index}`,
      date: item.date,
      description: item.description,
      value: item.value,
      historico: item.historico,
      fonte: item.fonte,
      aplicacao: item.aplicacao,
      status: 'pending'
    }));

  } catch (error) {
    console.error("Error parsing PDF with Gemini:", error);
    throw new Error("Falha ao processar o extrato com Inteligência Artificial.");
  }
};