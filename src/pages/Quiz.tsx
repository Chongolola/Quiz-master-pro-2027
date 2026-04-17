import React, { useState, useEffect } from 'react';
import { Question, Profile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Zap, CheckCircle2, XCircle, Loader2, Award, ArrowRight, HelpCircle, Clock, Lightbulb, SkipForward, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useLives } from '../hooks/useLives';
import { genAI, models } from '../lib/gemini';
import { NURSING_QUESTIONS } from '../data/nursingQuestions';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { AdService } from '../services/adService';
import { NotificationService } from '../services/notificationService';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const CATEGORIES = [
  { id: 'all', name: 'Todas as Categorias', active: true },
  { id: 'enfermagem', name: 'Enfermagem', active: true },
  { id: 'enfer_benguela_2022', name: 'Enfer. Benguela 2022', active: true },
  { id: 'farmacia', name: 'Farmácia', active: true },
  { id: 'analises_clinicas', name: 'Análises Clínicas', active: true },
  { id: 'cultura_geral', name: 'Cultura Geral', active: true },
  { id: 'medicina', name: 'Medicina', active: true },
  { id: 'apoio_hospitalar', name: 'Apoio Hospitalar', active: true },
  { id: 'estomatologia', name: 'Estomatologia', active: true },
  { id: 'outros', name: 'Outros', active: true },
];

export const OFFLINE_QUESTIONS: Question[] = [
  ...NURSING_QUESTIONS,
  // --- ANÁLISES CLÍNICAS ---
  {
    id: 'ac1',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual célula dá origem às plaquetas?',
    correctAnswer: 'Megacariócito',
    options: ['Rubriblastos', 'Megacariócito', 'Reticulócitos', 'Metaribricitos'],
    explanation: 'As plaquetas são fragmentos citoplasmáticos derivados de células gigantes da medula óssea chamadas megacariócitos.',
    createdAt: Date.now()
  },
  {
    id: 'ac2',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual equipamento é utilizado no laboratório clínico para a separação do plasma sanguíneo?',
    correctAnswer: 'Centrífuga',
    options: ['Centrífuga', 'Agitador magnético', 'Banho-Maria', 'Destilador'],
    explanation: 'A centrífuga utiliza a força centrífuga para separar os componentes do sangue por densidade.',
    createdAt: Date.now()
  },
  {
    id: 'ac3',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Este exame consiste na apresentação gráfica do grau de anisocitose eritrocitária. Trata-se de:',
    correctAnswer: 'RDW',
    options: ['VCM', 'RDW', 'HCM', 'Ferritina'],
    explanation: 'O RDW (Red Cell Distribution Width) mede a variação de tamanho entre as hemácias.',
    createdAt: Date.now()
  },
  {
    id: 'ac4',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual índice hematimétrico serve para classificar as anemias em hipocrômicas, normocrômicas e hipercrômicas?',
    correctAnswer: 'HCM',
    options: ['VCM', 'HCM', 'CHCM', 'RDW'],
    explanation: 'O HCM (Hemoglobina Corpuscular Média) indica a massa média de hemoglobina nas hemácias, definindo a cor (cromia).',
    createdAt: Date.now()
  },
  {
    id: 'ac5',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'A hemoglobina fetal é composta por quais cadeias de globina?',
    correctAnswer: 'Duas cadeias alfa e duas cadeias gama',
    options: ['Duas cadeias alfa e duas cadeias beta', 'Duas cadeias alfa e duas cadeias delta', 'Duas cadeias alfa e duas cadeias gama', 'Quatro cadeias gama'],
    explanation: 'A Hemoglobina Fetal (HbF) é o principal transporte de oxigênio no feto, composta por cadeias alfa e gama.',
    createdAt: Date.now()
  },
  {
    id: 'ac6',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Poiquilocitose em que os eritrócitos apresentam-se em forma de alvo denomina-se:',
    correctAnswer: 'Target cells (Codócitos)',
    options: ['Helmet cells', 'Drop cells', 'Drepanócitos', 'Target cells (Codócitos)'],
    explanation: 'Células em alvo ou codócitos são comuns em hemoglobinopatias e doenças hepáticas.',
    createdAt: Date.now()
  },
  {
    id: 'ac7',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'O distúrbio sanguíneo ligado ao "Fator Christmas" refere-se à deficiência de qual fator de coagulação?',
    correctAnswer: 'Fator IX',
    options: ['Fator VIII', 'Fator II', 'Fator IX', 'Fator IV'],
    explanation: 'A deficiência do Fator IX causa a Hemofilia B, também conhecida como doença de Christmas.',
    createdAt: Date.now()
  },
  {
    id: 'ac8',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual método de coloração é indicado para o diagnóstico laboratorial da Tuberculose (TB)?',
    correctAnswer: 'Coloração de Ziehl-Neelsen',
    options: ['Coloração de Gram', 'Coloração de Ziehl-Neelsen', 'Coloração de Lugol', 'Coloração de Giemsa'],
    explanation: 'A coloração de Ziehl-Neelsen é específica para identificar bacilos álcool-ácido resistentes (BAAR) como o M. tuberculosis.',
    createdAt: Date.now()
  },
  {
    id: 'ac9',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O marcador CD4 é utilizado para definir quais tipos de células?',
    correctAnswer: 'Linfócitos T auxiliares infectados pelo HIV',
    options: ['Linfócitos B', 'Linfócitos T auxiliares infectados pelo HIV', 'Monócitos', 'Plaquetas'],
    explanation: 'O vírus HIV infecta preferencialmente linfócitos T que expressam o receptor CD4.',
    createdAt: Date.now()
  },
  {
    id: 'ac10',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual anticorpo está relacionado com a incompatibilidade materno-fetal ABO?',
    correctAnswer: 'IgG',
    options: ['IgA', 'IgE', 'IgM', 'IgG'],
    explanation: 'Apenas anticorpos da classe IgG conseguem atravessar a barreira placentária.',
    createdAt: Date.now()
  },

  // --- ENFERMAGEM ---
  {
    id: 'enf1',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual é o sinal mais seguro no diagnóstico de uma paragem cardiorrespiratória (PCR) em adultos?',
    correctAnswer: 'Ausência do pulso carotídeo',
    options: ['Fibrilação atrial', 'Pulso femoral filiforme', 'Tensão arterial inaudível', 'Ausência do pulso carotídeo'],
    explanation: 'A ausência de pulso central (carotídeo) é o critério definitivo para diagnóstico de PCR.',
    createdAt: Date.now()
  },
  {
    id: 'enf2',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A infecção adquirida pelo paciente durante a hospitalização é denominada:',
    correctAnswer: 'Infecção Nosocomial',
    options: ['Infecção Comunitária', 'Infecção Nosocomial', 'Infecção Crônica', 'Infecção Latente'],
    explanation: 'Infecção nosocomial ou hospitalar é aquela adquirida após a admissão do paciente no hospital.',
    createdAt: Date.now()
  },
  {
    id: 'enf3',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O decúbito do paciente acamado deve ser mudado a cada quantas horas para prevenir úlceras por pressão?',
    correctAnswer: 'A cada 2 horas',
    options: ['A cada 1 hora', 'A cada 2 horas', 'A cada 4 horas', 'A cada 6 horas'],
    explanation: 'O intervalo de 2 horas é o padrão para evitar isquemia tecidual por pressão prolongada.',
    createdAt: Date.now()
  },
  {
    id: 'enf4',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual termo técnico define a diminuição do volume urinário (diurese)?',
    correctAnswer: 'Oligúria',
    options: ['Anúria', 'Poliúria', 'Disúria', 'Oligúria'],
    explanation: 'Oligúria é a redução do volume urinário (geralmente < 400ml/dia em adultos).',
    createdAt: Date.now()
  },
  {
    id: 'enf5',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em uma situação de emergência para entubação endotraqueal, qual a posição ideal do paciente?',
    correctAnswer: 'Horizontal com a cabeça para trás (extensão)',
    options: ['Posição de Fowler', 'Trendelenburg', 'Horizontal com a cabeça para trás (extensão)', 'Lateral esquerda'],
    explanation: 'A extensão do pescoço alinha os eixos faríngeo e laríngeo para facilitar a visualização das cordas vocais.',
    createdAt: Date.now()
  },
  {
    id: 'enf6',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a via de administração de medicamentos que oferece a absorção mais rápida?',
    correctAnswer: 'Endovenosa',
    options: ['Oral', 'Subcutânea', 'Intramuscular', 'Endovenosa'],
    explanation: 'A via endovenosa não possui fase de absorção, pois o fármaco entra direto na circulação.',
    createdAt: Date.now()
  },
  {
    id: 'enf7',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o volume máximo recomendado para aplicação intramuscular no músculo deltóide em adultos?',
    correctAnswer: '2 ml',
    options: ['1 ml', '2 ml', '3 ml', '5 ml'],
    explanation: 'O deltóide é um músculo pequeno e suporta volumes menores, geralmente até 2ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf8',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A perda sanguínea verificada no período do puerpério denomina-se:',
    correctAnswer: 'Lóquios',
    options: ['Menstruação', 'Lóquios', 'Hematúria', 'Melena'],
    explanation: 'Lóquios são as secreções vaginais que ocorrem após o parto durante a involução uterina.',
    createdAt: Date.now()
  },
  {
    id: 'enf9',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a temperatura axial considerada como início de hipertermia (febre)?',
    correctAnswer: '38 ºC',
    options: ['36 ºC', '37 ºC', '37.5 ºC', '38 ºC'],
    explanation: 'Clinicamente, valores a partir de 38ºC são classificados como febre ou hipertermia.',
    createdAt: Date.now()
  },
  {
    id: 'enf10',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a sequência ideal para a verificação dos sinais vitais em crianças para evitar agitação?',
    correctAnswer: 'Respiração, Pulso, Temperatura, Pressão Arterial',
    options: ['Temperatura, Pulso, Respiração', 'Respiração, Pulso, Temperatura, Pressão Arterial', 'Pressão Arterial, Temperatura, Pulso', 'Pulso, Respiração, Temperatura'],
    explanation: 'Deve-se começar pelos procedimentos menos invasivos (respiração) para não assustar a criança.',
    createdAt: Date.now()
  },

  // --- CULTURA GERAL ---
  {
    id: 'cg1',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Quem foi o primeiro presidente da República de Angola?',
    correctAnswer: 'António Agostinho Neto',
    options: ['José Eduardo dos Santos', 'António Agostinho Neto', 'João Lourenço', 'Holden Roberto'],
    explanation: 'António Agostinho Neto proclamou a independência e foi o primeiro presidente (1975-1979).',
    createdAt: Date.now()
  },
  {
    id: 'cg2',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a maior província de Angola em extensão territorial?',
    correctAnswer: 'Moxico',
    options: ['Luanda', 'Uíge', 'Moxico', 'Cuando Cubango'],
    explanation: 'A província do Moxico possui a maior área geográfica de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg3',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em qual província angolana localiza-se a Serra da Leba?',
    correctAnswer: 'Huíla',
    options: ['Namibe', 'Huíla', 'Benguela', 'Cunene'],
    explanation: 'A Serra da Leba situa-se no limite entre as províncias da Huíla e do Namibe, mas pertence à Huíla.',
    createdAt: Date.now()
  },
  {
    id: 'cg4',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a moeda oficial da República de Angola?',
    correctAnswer: 'Kwanza',
    options: ['Dólar', 'Euro', 'Kwanza', 'Real'],
    explanation: 'O Kwanza (AOA) é a unidade monetária oficial de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg5',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual organização internacional foi substituída pela União Africana (UA)?',
    correctAnswer: 'OUA (Organização da Unidade Africana)',
    options: ['SADC', 'OUA (Organização da Unidade Africana)', 'PALOP', 'CPLP'],
    explanation: 'A OUA foi fundada em 1963 e substituída pela UA em 2002.',
    createdAt: Date.now()
  },
  {
    id: 'cg6',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Em que ano foram assinados os Acordos de Paz de Bicesse?',
    correctAnswer: '1991',
    options: ['1975', '1991', '1994', '2002'],
    explanation: 'Os Acordos de Bicesse foram assinados em 31 de maio de 1991 em Portugal.',
    createdAt: Date.now()
  },
  {
    id: 'cg7',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o ponto mais alto de Angola?',
    correctAnswer: 'Morro do Môco',
    options: ['Serra da Leba', 'Morro do Môco', 'Monte Everest', 'Serra da Chela'],
    explanation: 'O Morro do Môco, no Huambo, é o ponto mais elevado com 2.620 metros.',
    createdAt: Date.now()
  },
  {
    id: 'cg8',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o dia da Independência Nacional de Angola?',
    correctAnswer: '11 de Novembro',
    options: ['4 de Fevereiro', '17 de Setembro', '11 de Novembro', '25 de Setembro'],
    explanation: 'Angola tornou-se independente de Portugal em 11 de novembro de 1975.',
    createdAt: Date.now()
  },
  {
    id: 'cg9',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a sede administrativa da SADC?',
    correctAnswer: 'Gaborone (Botswana)',
    options: ['Luanda (Angola)', 'Pretória (África do Sul)', 'Gaborone (Botswana)', 'Lusaka (Zâmbia)'],
    explanation: 'A sede da Comunidade de Desenvolvimento da África Austral fica em Gaborone.',
    createdAt: Date.now()
  },
  {
    id: 'cg10',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual escritor angolano e profissional de saúde foi o primeiro presidente de Angola?',
    correctAnswer: 'António Agostinho Neto',
    options: ['Manuel Rui Monteiro', 'António Agostinho Neto', 'Pepetela', 'Óscar Ribas'],
    explanation: 'Agostinho Neto era médico de profissão e um renomado poeta.',
    createdAt: Date.now()
  },

  // --- FARMÁCIA ---
  {
    id: 'far1',
    category: 'Farmácia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a temperatura ideal para o armazenamento de insulinas e vacinas na "Rede de Frio"?',
    correctAnswer: '2°C a 8°C',
    options: ['-20°C a -10°C', '0°C a 4°C', '2°C a 8°C', '15°C a 25°C'],
    explanation: 'A faixa de +2°C a +8°C é o padrão para conservação da maioria dos termolábeis.',
    createdAt: Date.now()
  },
  {
    id: 'far2',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a Farmacovigilância no contexto hospitalar?',
    correctAnswer: 'Monitoramento de reações adversas e eventos adversos',
    options: ['Controle de custos', 'Venda de medicamentos', 'Monitoramento de reações adversas e eventos adversos', 'Marketing farmacêutico'],
    explanation: 'A farmacovigilância foca na segurança do paciente através da detecção de efeitos indesejados.',
    createdAt: Date.now()
  },
  {
    id: 'far3',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O conceito de "Uso Racional de Medicamentos" visa principalmente:',
    correctAnswer: 'Melhorar a eficácia do tratamento e reduzir desperdícios',
    options: ['Aumentar a venda de remédios', 'Melhorar a eficácia do tratamento e reduzir desperdícios', 'Substituir médicos por farmacêuticos', 'Garantir o lucro das farmácias'],
    explanation: 'O uso racional garante que o paciente receba o medicamento adequado à sua necessidade clínica.',
    createdAt: Date.now()
  },
  {
    id: 'far4',
    category: 'Farmácia',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual o principal fator que afeta a estabilidade química dos medicamentos durante o armazenamento?',
    correctAnswer: 'Temperatura e Umidade',
    options: ['Preço', 'Cor da embalagem', 'Temperatura e Umidade', 'Nome da marca'],
    explanation: 'Calor e umidade aceleram processos de degradação química como a hidrólise.',
    createdAt: Date.now()
  },
  {
    id: 'far5',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Um medicamento "Genérico" deve ser obrigatoriamente:',
    correctAnswer: 'Igual em composição e eficácia ao de referência',
    options: ['Mais caro que o original', 'Ter nome de marca fantasia', 'Igual em composição e eficácia ao de referência', 'Vendido sem receita'],
    explanation: 'O genérico passa por testes de bioequivalência para garantir que age igual ao original.',
    createdAt: Date.now()
  },
  {
    id: 'far6_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de excreção da maioria dos fármacos?',
    correctAnswer: 'Renal',
    options: ['Hepática', 'Renal', 'Pulmonar', 'Cutânea'],
    explanation: 'Os rins são os principais órgãos responsáveis pela eliminação de fármacos e seus metabólitos do organismo.',
    createdAt: Date.now()
  },
  {
    id: 'far7_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que significa a sigla "v.o." em uma prescrição médica?',
    correctAnswer: 'Via oral',
    options: ['Via ocular', 'Via oral', 'Via otológica', 'Volume original'],
    explanation: 'v.o. é a abreviatura latina para "via os", que significa por via oral.',
    createdAt: Date.now()
  },
  {
    id: 'far8_new',
    category: 'Farmácia',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual classe de medicamentos é utilizada para tratar infecções causadas por fungos?',
    correctAnswer: 'Antifúngicos',
    options: ['Antibióticos', 'Antivirais', 'Antifúngicos', 'Antiparasitários'],
    explanation: 'Antifúngicos ou antimicóticos são fármacos que inibem o crescimento ou destroem fungos.',
    createdAt: Date.now()
  },
  {
    id: 'far9_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Meia-vida" de um fármaco?',
    correctAnswer: 'Tempo necessário para que a concentração plasmática se reduza à metade',
    options: ['Tempo total de ação do remédio', 'Tempo necessário para que a concentração plasmática se reduza à metade', 'A metade da dose prescrita', 'O tempo de validade do produto'],
    explanation: 'A meia-vida indica a velocidade de eliminação do fármaco do plasma.',
    createdAt: Date.now()
  },
  {
    id: 'far10_new',
    category: 'Farmácia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o principal objetivo da "Atenção Farmacêutica"?',
    correctAnswer: 'Alcançar resultados definidos que melhorem a qualidade de vida do paciente',
    options: ['Aumentar o lucro da farmácia', 'Alcançar resultados definidos que melhorem a qualidade de vida do paciente', 'Substituir o diagnóstico médico', 'Vender mais suplementos'],
    explanation: 'É a prática profissional onde o farmacêutico colabora com o paciente e outros profissionais de saúde.',
    createdAt: Date.now()
  },
  {
    id: 'far11_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função de um "Excipiente" em uma formulação farmacêutica?',
    correctAnswer: 'Dar forma, volume e estabilidade ao medicamento',
    options: ['É o princípio ativo que cura a doença', 'Dar forma, volume e estabilidade ao medicamento', 'Aumentar a toxicidade do fármaco', 'Apenas dar cor ao remédio'],
    explanation: 'Excipientes são substâncias inertes que auxiliam na fabricação e conservação do fármaco.',
    createdAt: Date.now()
  },
  {
    id: 'far12_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza um medicamento de "Liberação Prolongada"?',
    correctAnswer: 'Libera o princípio ativo de forma gradual por um período maior',
    options: ['Age instantaneamente e para logo', 'Libera o princípio ativo de forma gradual por um período maior', 'Deve ser tomado a cada 1 hora', 'É um medicamento injetável apenas'],
    explanation: 'Essas formulações reduzem a frequência de doses e mantêm níveis plasmáticos mais estáveis.',
    createdAt: Date.now()
  },
  {
    id: 'far13_new',
    category: 'Farmácia',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual o principal órgão responsável pelo metabolismo (biotransformação) de fármacos?',
    correctAnswer: 'Fígado',
    options: ['Rins', 'Fígado', 'Pâncreas', 'Coração'],
    explanation: 'O fígado possui sistemas enzimáticos (como o Citocromo P450) que transformam os fármacos.',
    createdAt: Date.now()
  },
  {
    id: 'far14_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Biodisponibilidade" de um fármaco?',
    correctAnswer: 'Fração da dose que atinge a circulação sistêmica de forma inalterada',
    options: ['A quantidade total de remédio no frasco', 'Fração da dose que atinge a circulação sistêmica de forma inalterada', 'O tempo que o remédio leva para vencer', 'A facilidade de comprar o remédio'],
    explanation: 'A via endovenosa possui 100% de biodisponibilidade por definição.',
    createdAt: Date.now()
  },
  {
    id: 'far15_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal diferença entre um Xarope e um Elixir?',
    correctAnswer: 'O elixir contém álcool em sua composição, o xarope não',
    options: ['A cor do líquido', 'O elixir contém álcool em sua composição, o xarope não', 'O xarope é apenas para tosse', 'O elixir é sempre amargo'],
    explanation: 'Elixires são soluções hidroalcoólicas edulcoradas.',
    createdAt: Date.now()
  },
  {
    id: 'far16_new',
    category: 'Farmácia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que significa a sigla "S.N." em uma prescrição?',
    correctAnswer: 'Se Necessário',
    options: ['Sem Nome', 'Se Necessário', 'Sempre Noite', 'Somente Nutrição'],
    explanation: 'Indica que o medicamento deve ser administrado apenas se o paciente apresentar o sintoma (ex: dor).',
    createdAt: Date.now()
  },
  {
    id: 'far17_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o cuidado principal ao armazenar medicamentos fotossensíveis?',
    correctAnswer: 'Protegê-los da luz direta',
    options: ['Mantê-los no congelador', 'Protegê-los da luz direta', 'Deixá-los fora da embalagem original', 'Aquecê-los antes do uso'],
    explanation: 'A luz pode causar a degradação química de certos princípios ativos.',
    createdAt: Date.now()
  },
  {
    id: 'far18_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é uma "Interação Medicamentosa"?',
    correctAnswer: 'Alteração do efeito de um fármaco pela presença de outro ou de alimentos',
    options: ['A mistura de dois remédios no mesmo copo', 'Alteração do efeito de um fármaco pela presença de outro ou de alimentos', 'A conversa entre o farmacêutico e o paciente', 'O ato de tomar o remédio com água'],
    explanation: 'Interações podem aumentar a toxicidade ou reduzir a eficácia do tratamento.',
    createdAt: Date.now()
  },
  {
    id: 'far19_new',
    category: 'Farmácia',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a função dos "Antagonistas" nos receptores celulares?',
    correctAnswer: 'Bloquear a ação de um agonista ou ligante natural',
    options: ['Ativar o receptor e produzir resposta', 'Bloquear a ação de um agonista ou ligante natural', 'Aumentar a produção de receptores', 'Destruir o receptor permanentemente'],
    explanation: 'Antagonistas se ligam ao receptor mas não o ativam, impedindo a ligação de outras substâncias.',
    createdAt: Date.now()
  },
  {
    id: 'far20_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a via de administração "Sublingual"?',
    correctAnswer: 'Absorção rápida pela mucosa sob a língua, evitando o efeito de primeira passagem hepática',
    options: ['Absorção lenta pelo estômago', 'Absorção rápida pela mucosa sob a língua, evitando o efeito de primeira passagem hepática', 'Uso de agulhas pequenas', 'Aplicação direta no pulmão'],
    explanation: 'A rica vascularização sob a língua permite que o fármaco entre direto na circulação sistêmica.',
    createdAt: Date.now()
  },
  {
    id: 'far21_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal indicação dos medicamentos "Antieméticos"?',
    correctAnswer: 'Prevenir ou tratar náuseas e vômitos',
    options: ['Tratar diarreia', 'Prevenir ou tratar náuseas e vômitos', 'Combater infecções', 'Reduzir a febre'],
    explanation: 'Atuam no centro do vômito ou no trato gastrointestinal.',
    createdAt: Date.now()
  },
  {
    id: 'far22_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Margem Terapêutica" (ou Índice Terapêutico)?',
    correctAnswer: 'Relação entre a dose que causa efeito e a dose que causa toxicidade',
    options: ['O preço máximo do medicamento', 'Relação entre a dose que causa efeito e a dose que causa toxicidade', 'O tempo de duração do efeito', 'A distância entre a farmácia e o hospital'],
    explanation: 'Fármacos com margem estreita exigem monitoramento rigoroso (ex: digoxina).',
    createdAt: Date.now()
  },
  {
    id: 'far23_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Anticoagulantes"?',
    correctAnswer: 'Prevenir a formação de trombos e coágulos no sangue',
    options: ['Aumentar a coagulação em hemorragias', 'Prevenir a formação de trombos e coágulos no sangue', 'Dissolver coágulos já formados', 'Aumentar o número de plaquetas'],
    explanation: 'Atuam nos fatores de coagulação para manter o sangue fluido.',
    createdAt: Date.now()
  },
  {
    id: 'far24_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que significa a sigla "P.R.N." em farmácia?',
    correctAnswer: 'Pro Re Nata (conforme a necessidade)',
    options: ['Para Receber Noite', 'Pro Re Nata (conforme a necessidade)', 'Prescrição Recente Nova', 'Pronto Para Nutrição'],
    explanation: 'É similar ao "S.N." (Se Necessário).',
    createdAt: Date.now()
  },
  {
    id: 'far25_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração para medicamentos de emergência em PCR?',
    correctAnswer: 'Intravenosa (Endovenosa)',
    options: ['Intramuscular', 'Intravenosa (Endovenosa)', 'Subcutânea', 'Oral'],
    explanation: 'A via IV garante efeito imediato e controle total da dose.',
    createdAt: Date.now()
  },
  {
    id: 'far26_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Farmacotécnica"?',
    correctAnswer: 'Estudo da preparação e conservação dos medicamentos em formas farmacêuticas',
    options: ['Estudo dos efeitos colaterais', 'Estudo da preparação e conservação dos medicamentos em formas farmacêuticas', 'Venda de medicamentos', 'Estudo das plantas medicinais'],
    explanation: 'Transforma substâncias ativas em formas seguras e eficazes para uso.',
    createdAt: Date.now()
  },
  {
    id: 'far27_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Diuréticos"?',
    correctAnswer: 'Aumentar a excreção de água e eletrólitos pelos rins',
    options: ['Reduzir a produção de urina', 'Aumentar a excreção de água e eletrólitos pelos rins', 'Tratar infecção urinária', 'Aumentar a pressão arterial'],
    explanation: 'São usados no tratamento de hipertensão e edemas.',
    createdAt: Date.now()
  },
  {
    id: 'far28_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza uma "Suspensão" farmacêutica?',
    correctAnswer: 'Mistura heterogênea onde partículas sólidas estão dispersas em um líquido',
    options: ['Uma solução transparente e límpida', 'Mistura heterogênea onde partículas sólidas estão dispersas em um líquido', 'Um medicamento em pó seco apenas', 'Um tipo de pomada'],
    explanation: 'Deve ser agitada antes do uso para garantir a homogeneidade da dose.',
    createdAt: Date.now()
  },
  {
    id: 'far29_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal diferença entre Farmacocinética e Farmacodinâmica?',
    correctAnswer: 'Cinética estuda o que o corpo faz com o fármaco; Dinâmica o que o fármaco faz com o corpo',
    options: ['Cinética estuda o preço; Dinâmica a venda', 'Cinética estuda o que o corpo faz com o fármaco; Dinâmica o que o fármaco faz com o corpo', 'Não há diferença', 'Dinâmica é para crianças; Cinética para adultos'],
    explanation: 'Farmacocinética envolve absorção, distribuição, metabolismo e excreção.',
    createdAt: Date.now()
  },
  {
    id: 'far30_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o "Efeito de Primeira Passagem"?',
    correctAnswer: 'Metabolismo extenso do fármaco no fígado antes de atingir a circulação sistêmica',
    options: ['O primeiro efeito sentido pelo paciente', 'Metabolismo extenso do fármaco no fígado antes de atingir a circulação sistêmica', 'A primeira dose do tratamento', 'A passagem do remédio pela garganta'],
    explanation: 'Ocorre principalmente com a administração oral.',
    createdAt: Date.now()
  },
  {
    id: 'far31_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Ansiolíticos"?',
    correctAnswer: 'Reduzir a ansiedade e tensão',
    options: ['Aumentar a energia', 'Reduzir a ansiedade e tensão', 'Tratar infecções', 'Aliviar a dor física intensa'],
    explanation: 'Atuam no sistema nervoso central, geralmente potencializando o GABA.',
    createdAt: Date.now()
  },
  {
    id: 'far32_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Tolerância" a um fármaco?',
    correctAnswer: 'Necessidade de doses maiores para obter o mesmo efeito inicial',
    options: ['Alergia ao medicamento', 'Necessidade de doses maiores para obter o mesmo efeito inicial', 'O corpo aceitar bem o remédio', 'O fim do tratamento'],
    explanation: 'Ocorre por adaptação dos receptores ou aumento do metabolismo.',
    createdAt: Date.now()
  },
  {
    id: 'far33_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal indicação dos "Anti-histamínicos"?',
    correctAnswer: 'Tratar reações alérgicas',
    options: ['Combater bactérias', 'Tratar reações alérgicas', 'Reduzir o açúcar no sangue', 'Aumentar a imunidade'],
    explanation: 'Bloqueiam os receptores de histamina, reduzindo sintomas de alergia.',
    createdAt: Date.now()
  },
  {
    id: 'far34_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Farmacognosia"?',
    correctAnswer: 'Estudo das matérias-primas de origem natural (plantas, animais)',
    options: ['Estudo dos preços dos remédios', 'Estudo das matérias-primas de origem natural (plantas, animais)', 'Estudo das farmácias antigas', 'Estudo dos nomes dos remédios'],
    explanation: 'Foca na identificação e propriedades de substâncias naturais com fins medicinais.',
    createdAt: Date.now()
  },
  {
    id: 'far35_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Broncodilatadores"?',
    correctAnswer: 'Dilatar os brônquios para facilitar a respiração',
    options: ['Reduzir a tosse seca', 'Dilatar os brônquios para facilitar a respiração', 'Combater a pneumonia', 'Secar as secreções'],
    explanation: 'Muito usados no tratamento de asma e DPOC.',
    createdAt: Date.now()
  },
  {
    id: 'far36_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza um medicamento "Fitoterápico"?',
    correctAnswer: 'Obtido exclusivamente de matérias-primas vegetais ativas',
    options: ['Qualquer chá caseiro', 'Obtido exclusivamente de matérias-primas vegetais ativas', 'Medicamento sintético com cheiro de planta', 'Medicamento homeopático'],
    explanation: 'Possui eficácia e segurança validadas por estudos.',
    createdAt: Date.now()
  },
  {
    id: 'far37_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração para a Insulina?',
    correctAnswer: 'Subcutânea',
    options: ['Intramuscular', 'Subcutânea', 'Oral', 'Intravenosa'],
    explanation: 'A via SC permite absorção lenta e constante, ideal para o controle glicêmico.',
    createdAt: Date.now()
  },
  {
    id: 'far38_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o "Placebo"?',
    correctAnswer: 'Substância inerte sem efeito farmacológico, usada em estudos ou por efeito psicológico',
    options: ['Um remédio muito forte', 'Substância inerte sem efeito farmacológico, usada em estudos ou por efeito psicológico', 'Um veneno', 'Um tipo de vitamina'],
    explanation: 'Serve como controle em ensaios clínicos.',
    createdAt: Date.now()
  },
  {
    id: 'far39_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Hipoglicemiantes"?',
    correctAnswer: 'Reduzir os níveis de glicose no sangue',
    options: ['Aumentar o açúcar no sangue', 'Reduzir os níveis de glicose no sangue', 'Tratar a pressão alta', 'Melhorar a digestão'],
    explanation: 'Usados no tratamento do Diabetes Mellitus tipo 2.',
    createdAt: Date.now()
  },
  {
    id: 'far40_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Iatrogenia" medicamentosa?',
    correctAnswer: 'Dano causado ao paciente pelo uso de medicamentos ou intervenção profissional',
    options: ['Cura milagrosa', 'Dano causado ao paciente pelo uso de medicamentos ou intervenção profissional', 'Alergia hereditária', 'Falta de remédio'],
    explanation: 'Pode ocorrer por erro de prescrição, dispensação ou administração.',
    createdAt: Date.now()
  },
  {
    id: 'far41_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal recomendação ao tomar antibióticos?',
    correctAnswer: 'Cumprir rigorosamente os horários e o tempo total do tratamento',
    options: ['Parar assim que os sintomas sumirem', 'Cumprir rigorosamente os horários e o tempo total do tratamento', 'Tomar apenas quando sentir dor', 'Dobrar a dose se esquecer uma'],
    explanation: 'O uso incompleto favorece a resistência bacteriana.',
    createdAt: Date.now()
  },
  {
    id: 'far42_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Farmacoepidemiologia"?',
    correctAnswer: 'Estudo do uso e efeitos dos medicamentos em grandes populações',
    options: ['Estudo das epidemias causadas por remédios', 'Estudo do uso e efeitos dos medicamentos em grandes populações', 'Venda de remédios em massa', 'Produção de vacinas'],
    explanation: 'Aplica métodos epidemiológicos para avaliar a terapia medicamentosa na sociedade.',
    createdAt: Date.now()
  },
  {
    id: 'far43_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Corticosteróides"?',
    correctAnswer: 'Potente ação anti-inflamatória e imunossupressora',
    options: ['Combater apenas vírus', 'Potente ação anti-inflamatória e imunossupressora', 'Aumentar a massa muscular apenas', 'Tratar anemia'],
    explanation: 'Mimetizam hormônios produzidos pelas glândulas supra-renais.',
    createdAt: Date.now()
  },
  {
    id: 'far44_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Dispensação" de medicamentos?',
    correctAnswer: 'Ato do farmacêutico de fornecer o medicamento e orientar sobre o uso correto',
    options: ['Apenas entregar a caixa do remédio', 'Ato do farmacêutico de fornecer o medicamento e orientar sobre o uso correto', 'A fabricação do remédio', 'A prescrição médica'],
    explanation: 'Diferente da simples entrega, envolve análise técnica e orientação.',
    createdAt: Date.now()
  },
  {
    id: 'far45_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração para vacinas do PNV (Programa Nacional de Vacinação)?',
    correctAnswer: 'Intramuscular e Subcutânea',
    options: ['Apenas Oral', 'Intramuscular e Subcutânea', 'Apenas Intravenosa', 'Apenas Tópica'],
    explanation: 'A maioria das vacinas é aplicada no músculo ou sob a pele.',
    createdAt: Date.now()
  },
  {
    id: 'far46_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Forma Farmacêutica"?',
    correctAnswer: 'Estado final de apresentação do medicamento (comprimido, xarope, etc.)',
    options: ['A fórmula química do remédio', 'Estado final de apresentação do medicamento (comprimido, xarope, etc.)', 'O tamanho da caixa', 'A marca do laboratório'],
    explanation: 'Facilita a administração e garante a dose correta.',
    createdAt: Date.now()
  },
  {
    id: 'far47_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos medicamentos "Antipiréticos"?',
    correctAnswer: 'Reduzir a febre',
    options: ['Aliviar a dor', 'Reduzir a febre', 'Combater bactérias', 'Tratar vômitos'],
    explanation: 'Também conhecidos como antitérmicos.',
    createdAt: Date.now()
  },
  {
    id: 'far48_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza um medicamento "Homeopático"?',
    correctAnswer: 'Baseado na lei dos semelhantes e em doses infinitesimais (diluídas)',
    options: ['Qualquer remédio natural', 'Baseado na lei dos semelhantes e em doses infinitesimais (diluídas)', 'Medicamento feito apenas de ervas', 'Um tipo de vacina'],
    explanation: 'Utiliza substâncias altamente diluídas para estimular a cura.',
    createdAt: Date.now()
  },
  {
    id: 'far49_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função do farmacêutico na Comissão de Controle de Infecção Hospitalar (CCIH)?',
    correctAnswer: 'Monitorar o uso de antimicrobianos e promover o uso racional',
    options: ['Limpar os quartos dos pacientes', 'Monitorar o uso de antimicrobianos e promover o uso racional', 'Fazer os curativos', 'Decidir quem recebe alta'],
    explanation: 'O controle do uso de antibióticos é vital para prevenir a resistência hospitalar.',
    createdAt: Date.now()
  },
  {
    id: 'far50_new',
    category: 'Farmácia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Farmacopeia"?',
    correctAnswer: 'Código oficial que estabelece os requisitos de qualidade dos medicamentos',
    options: ['Uma farmácia muito grande', 'Código oficial que estabelece os requisitos de qualidade dos medicamentos', 'Um livro de receitas caseiras', 'A história da farmácia'],
    explanation: 'Contém as normas e monografias de insumos e medicamentos de um país.',
    createdAt: Date.now()
  },

  // --- ADICIONAL ANÁLISES CLÍNICAS ---
  {
    id: 'ac11',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Histograma com desvio à esquerda no hemograma representa geralmente:',
    correctAnswer: 'Hipocromia',
    options: ['Macrocitose', 'Hipocromia', 'Leucocitose', 'Policitemia'],
    explanation: 'O desvio à esquerda no histograma de hemácias indica uma população de células com menor conteúdo de hemoglobina.',
    createdAt: Date.now()
  },
  {
    id: 'ac12',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o valor normal de hemoglobina para um adulto saudável?',
    correctAnswer: '15g/dl',
    options: ['5g/dl', '10g/dl', '15g/dl', '20g/dl'],
    explanation: 'Embora varie entre homens e mulheres, 15g/dl é um valor médio de referência para adultos.',
    createdAt: Date.now()
  },
  {
    id: 'ac13',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quais os métodos mais comuns usados na dosagem da glicose?',
    correctAnswer: 'Químicos e enzimáticos',
    options: ['Físicos e manuais', 'Químicos e enzimáticos', 'Apenas visuais', 'Centrifugação'],
    explanation: 'A dosagem de glicose moderna utiliza reações enzimáticas (como a glicose oxidase) para alta precisão.',
    createdAt: Date.now()
  },
  {
    id: 'ac14',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'O método de Westergreen é utilizado para a determinação de qual parâmetro?',
    correctAnswer: 'Velocidade de hemossedimentação (VHS)',
    options: ['Contagem de plaquetas', 'Velocidade de hemossedimentação (VHS)', 'Tempo de protrombina', 'Glicemia'],
    explanation: 'O método de Westergreen mede a velocidade com que os eritrócitos sedimentam em uma hora.',
    createdAt: Date.now()
  },

  // --- ADICIONAL ENFERMAGEM ---
  {
    id: 'enf11',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O medicamento anti-térmico é classificado como uma medicação:',
    correctAnswer: 'Sintomática',
    options: ['Curativa', 'Sintomática', 'Profilática', 'Substitutiva'],
    explanation: 'Medicamentos sintomáticos tratam apenas os sintomas (como a febre) e não a causa da doença.',
    createdAt: Date.now()
  },
  {
    id: 'enf12',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a finalidade principal do banho no leito em pacientes acamados?',
    correctAnswer: 'Limpeza da pele e estímulo à circulação',
    options: ['Apenas estética', 'Limpeza da pele e estímulo à circulação', 'Substituir a fisioterapia', 'Aumentar a temperatura corporal'],
    explanation: 'O banho no leito promove higiene, conforto e melhora a circulação periférica por meio da fricção suave.',
    createdAt: Date.now()
  },
  {
    id: 'enf13',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Na avaliação neurológica, a observação das pupilas e do nível de consciência faz parte de qual etapa?',
    correctAnswer: 'Avaliação do estado neurológico',
    options: ['Sinais vitais básicos', 'Avaliação do estado neurológico', 'Exame físico abdominal', 'Anamnese inicial'],
    explanation: 'O tamanho e a reatividade pupilar são indicadores críticos da função cerebral.',
    createdAt: Date.now()
  },
  {
    id: 'enf14',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual o ângulo correto para a aplicação de uma injeção por via intramuscular na região glútea?',
    correctAnswer: '90º',
    options: ['15º', '45º', '60º', '90º'],
    explanation: 'A agulha deve ser inserida perpendicularmente (90º) para garantir que o medicamento atinja o tecido muscular profundo.',
    createdAt: Date.now()
  },

  // --- ADICIONAL CULTURA GERAL ---
  {
    id: 'cg11',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'De acordo com a nova Divisão Político-Administrativa aprovada em 2024, quantas províncias passará a ter a República de Angola?',
    correctAnswer: '21',
    options: ['18', '20', '21', '25'],
    explanation: 'A Lei da Divisão Político-Administrativa aprovada em 2024 aumenta o número de províncias de 18 para 21 (adicionando Icolo e Bengo, Moxico Leste e Cuando Cubango Leste).',
    createdAt: Date.now()
  },
  {
    id: 'cg12',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Com a nova reforma administrativa de 2024, qual será o número total de municípios em Angola?',
    correctAnswer: '326',
    options: ['164', '172', '326', '500'],
    explanation: 'A nova lei aprovada em 2024 eleva o número de municípios de 164 para 326.',
    createdAt: Date.now()
  },
  {
    id: 'cg13',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o maior rio de África?',
    correctAnswer: 'Rio Nilo',
    options: ['Rio Congo', 'Rio Zambeze', 'Rio Nilo', 'Rio Kwanza'],
    explanation: 'O Rio Nilo é o mais longo do continente africano e um dos maiores do mundo.',
    createdAt: Date.now()
  },
  {
    id: 'cg14',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem escreveu a letra do Hino Nacional de Angola (Angola Avante)?',
    correctAnswer: 'Manuel Rui Monteiro',
    options: ['Agostinho Neto', 'Manuel Rui Monteiro', 'Pepetela', 'Rui Mingas'],
    explanation: 'A letra foi escrita por Manuel Rui Monteiro e a música composta por Rui Mingas.',
    createdAt: Date.now()
  },
  {
    id: 'cg15',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Em que ano foi fundada a ONU (Organização das Nações Unidas)?',
    correctAnswer: '1945',
    options: ['1918', '1945', '1948', '1975'],
    explanation: 'A ONU foi criada em 24 de outubro de 1945, após o fim da Segunda Guerra Mundial.',
    createdAt: Date.now()
  },
  {
    id: 'cg16',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a língua nacional africana mais falada em Angola?',
    correctAnswer: 'Umbundu',
    options: ['Kimbundu', 'Kicongo', 'Umbundu', 'Cokwe'],
    explanation: 'O Umbundu é a língua nacional com o maior número de falantes nativos no país.',
    createdAt: Date.now()
  },
  {
    id: 'cg17',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Onde fica a sede da União Africana (UA)?',
    correctAnswer: 'Adis Abeba (Etiópia)',
    options: ['Luanda (Angola)', 'Pretória (África do Sul)', 'Adis Abeba (Etiópia)', 'Cairo (Egito)'],
    explanation: 'A sede da UA localiza-se em Adis Abeba, na Etiópia.',
    createdAt: Date.now()
  },
  {
    id: 'cg18',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a maior floresta de Angola, situada em Cabinda?',
    correctAnswer: 'Floresta do Maiombe',
    options: ['Floresta da Quissama', 'Floresta do Maiombe', 'Parque da Cameia', 'Mata do Uíge'],
    explanation: 'A Floresta do Maiombe é uma das maiores reservas de biodiversidade do mundo.',
    createdAt: Date.now()
  },
  {
    id: 'cg19',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o dia nacional do trabalhador da saúde em Angola?',
    correctAnswer: '25 de Setembro',
    options: ['12 de Maio', '17 de Setembro', '25 de Setembro', '1 de Dezembro'],
    explanation: 'O dia 25 de setembro homenageia o médico e nacionalista Américo Boavida.',
    createdAt: Date.now()
  },
  {
    id: 'cg20',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o fuso horário oficial de Angola em relação ao meridiano de Greenwich?',
    correctAnswer: 'UTC +1',
    options: ['UTC 0', 'UTC +1', 'UTC +2', 'UTC -1'],
    explanation: 'Angola está no fuso horário da África Ocidental (WAT), que é uma hora à frente do UTC.',
    createdAt: Date.now()
  },

  // --- MAIS QUESTÕES TÉCNICAS ---
  {
    id: 'ac15',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o débito urinário diário médio considerado normal para um indivíduo adulto?',
    correctAnswer: '1200 a 1500 ml',
    options: ['300 a 440 ml', '600 a 800 ml', '1200 a 1500 ml', '2500 a 3000 ml'],
    explanation: 'O volume urinário normal varia entre 1200ml e 1500ml por dia, dependendo da ingestão de líquidos.',
    createdAt: Date.now()
  },
  {
    id: 'ac16',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'O vírus Zica (ZIKV) pertence a qual família viral?',
    correctAnswer: 'Flaviviridae',
    options: ['Retroviridae', 'Flaviviridae', 'Filoviridae', 'Picornaviridae'],
    explanation: 'O Zica vírus é um arbovírus da família Flaviviridae, a mesma dos vírus da Dengue e Febre Amarela.',
    createdAt: Date.now()
  },
  {
    id: 'ac17',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A hipercalcemia é caracterizada por:',
    correctAnswer: 'Aumento do cálcio sérico',
    options: ['Aumento do potássio sérico', 'Diminuição do cálcio sérico', 'Aumento do cálcio sérico', 'Diminuição do sódio sérico'],
    explanation: 'Hipercalcemia é a condição em que o nível de cálcio no sangue está acima do normal.',
    createdAt: Date.now()
  },
  {
    id: 'enf15',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual das seguintes opções NÃO é uma finalidade da colocação de uma sonda nasogástrica (SNG)?',
    correctAnswer: 'Nutrição Parenteral',
    options: ['Drenagem do conteúdo gástrico', 'Lavagem estomacal', 'Administração de medicamentos', 'Nutrição Parenteral'],
    explanation: 'A SNG é usada para nutrição ENTERAL (via trato digestivo). A nutrição parenteral é feita via intravenosa.',
    createdAt: Date.now()
  },
  {
    id: 'enf16',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal medida imediata ao sofrer um acidente com agulha potencialmente contaminada?',
    correctAnswer: 'Lavar o local com água e sabão',
    options: ['Espremer o local', 'Lavar o local com água e sabão', 'Fazer compressa fria', 'Aplicar álcool gel imediatamente'],
    explanation: 'A primeira conduta após exposição percutânea é a lavagem exaustiva do local com água e sabão.',
    createdAt: Date.now()
  },
  {
    id: 'cg21',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o nome oficial do país?',
    correctAnswer: 'República de Angola',
    options: ['Estado de Angola', 'República Popular de Angola', 'República de Angola', 'União de Angola'],
    explanation: 'O nome oficial adotado desde a constituição de 1992 é República de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg22',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o ponto mais baixo do território angolano?',
    correctAnswer: 'Oceano Atlântico (Nível do mar)',
    options: ['Deserto do Namibe', 'Foz do Rio Cunene', 'Oceano Atlântico (Nível do mar)', 'Bacia do Congo'],
    explanation: 'Como em qualquer país costeiro, o ponto mais baixo é o nível do mar no Oceano Atlântico.',
    createdAt: Date.now()
  },
  {
    id: 'cg23',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Em que ano foi criada a UPNA (União dos Povos do Norte de Angola)?',
    correctAnswer: '1954',
    options: ['1954', '1956', '1961', '1975'],
    explanation: 'A UPNA foi fundada em 1954, transformando-se posteriormente na UPA e depois na FNLA.',
    createdAt: Date.now()
  },
  {
    id: 'cg24',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a montanha mais alta do continente africano?',
    correctAnswer: 'Kilimanjaro',
    options: ['Monte Everest', 'Morro do Môco', 'Kilimanjaro', 'Monte Quénia'],
    explanation: 'O Kilimanjaro, na Tanzânia, é o ponto mais alto de África, com 5.895 metros.',
    createdAt: Date.now()
  },
  {
    id: 'cg25',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a capital de Angola?',
    correctAnswer: 'Luanda',
    options: ['Benguela', 'Huambo', 'Luanda', 'Lubango'],
    explanation: 'Luanda é a capital e a maior cidade de Angola, fundada em 1576.',
    createdAt: Date.now()
  },

  // --- LOTE FINAL DE QUESTÕES ---
  {
    id: 'ac18',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual tipo de exame hematológico é utilizado para identificar a presença de blastos e hematozoários?',
    correctAnswer: 'Eritrograma qualitativo (Esfregaço sanguíneo)',
    options: ['Eritrograma quantitativo', 'HCM', 'Eritrograma qualitativo (Esfregaço sanguíneo)', 'VCM'],
    explanation: 'A análise qualitativa via esfregaço permite observar a morfologia celular e parasitas no sangue.',
    createdAt: Date.now()
  },
  {
    id: 'ac19',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O hemograma completo informa sobre várias linhagens, EXCETO:',
    correctAnswer: 'Contagem de Reticulócitos',
    options: ['Leucócitos', 'Hematócrito', 'Plaquetas', 'Contagem de Reticulócitos'],
    explanation: 'A contagem de reticulócitos geralmente é um exame complementar solicitado à parte do hemograma padrão.',
    createdAt: Date.now()
  },
  {
    id: 'enf17',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função do rim que, se alterada, pode levar ao edema?',
    correctAnswer: 'Regulação da composição e do volume dos fluidos corporais',
    options: ['Produção de hormônios', 'Regulação da composição e do volume dos fluidos corporais', 'Eliminação de metabólitos', 'Equilíbrio ácido-base'],
    explanation: 'O rim controla o balanço hídrico; falhas nessa regulação causam retenção de líquidos e edema.',
    createdAt: Date.now()
  },
  {
    id: 'enf18',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O termo "Anúria" refere-se a uma diurese inferior a quantos ml em 24 horas?',
    correctAnswer: '100 ml',
    options: ['100 ml', '400 ml', '600 ml', '1000 ml'],
    explanation: 'Anúria é a ausência ou quase total supressão da urina (menos de 100ml por dia).',
    createdAt: Date.now()
  },
  {
    id: 'cg26',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual batalha histórica ocorreu na província do Cuando Cubango?',
    correctAnswer: 'Batalha do Cuito Cuanavale',
    options: ['Batalha de Quifangondo', 'Batalha do Cuito Cuanavale', 'Batalha de Cassinga', 'Batalha do Ebo'],
    explanation: 'A Batalha do Cuito Cuanavale foi um marco decisivo na história militar de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg27',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Quem foi o rei do Bailundo mencionado nos registros históricos?',
    correctAnswer: 'Ekuikwi II',
    options: ['Mandume', 'Ekuikwi II', 'Mutu-Ya-Kevela', 'Nzinga Mbandi'],
    explanation: 'Ekuikwi II foi um importante soberano do Reino do Bailundo.',
    createdAt: Date.now()
  },
  {
    id: 'cg28',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o sistema político ditatorial que vigorou na Alemanha sob influência de Adolfo Hitler?',
    correctAnswer: 'Nazismo',
    options: ['Fascismo', 'Socialismo', 'Nazismo', 'Comunismo'],
    explanation: 'O Nazismo (Nacional-Socialismo) foi o regime totalitário liderado por Hitler.',
    createdAt: Date.now()
  },
  {
    id: 'cg29',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o sistema político que vigorou na Itália sob influência de Benito Mussolini?',
    correctAnswer: 'Fascismo',
    options: ['Fascismo', 'Nazismo', 'Democracia', 'Monarquia'],
    explanation: 'O Fascismo originou-se na Itália sob a liderança de Mussolini.',
    createdAt: Date.now()
  },
  {
    id: 'cg30',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual das seguintes NÃO faz parte das "Sete Maravilhas de Angola"?',
    correctAnswer: 'Cataratas do Niágara',
    options: ['Quedas de Calandula', 'Floresta do Maiombe', 'Morro do Môco', 'Cataratas do Niágara'],
    explanation: 'As Cataratas do Niágara ficam na América do Norte, não em Angola.',
    createdAt: Date.now()
  },
  {
    id: 'ac20',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Target Cells" (células em alvo) no esfregaço é característica de:',
    correctAnswer: 'Hemoglobinopatias (como a Talassemia)',
    options: ['Anemia Ferropriva aguda', 'Hemoglobinopatias (como a Talassemia)', 'Infecção bacteriana', 'Leucemia mieloide'],
    explanation: 'Codócitos ou células em alvo são marcadores morfológicos de alterações na síntese de hemoglobina.',
    createdAt: Date.now()
  },
  {
    id: 'ac8_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o anticoagulante de escolha para a realização do Hemograma?',
    correctAnswer: 'EDTA',
    options: ['Citrato de Sódio', 'Heparina', 'EDTA', 'Fluoreto de Sódio'],
    explanation: 'O EDTA preserva a morfologia celular e é o padrão para exames hematológicos.',
    createdAt: Date.now()
  },
  {
    id: 'ac9_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o exame utilizado para monitorar a terapia com Warfarina (anticoagulante oral)?',
    correctAnswer: 'TAP (Tempo de Protrombina) / INR',
    options: ['TTPA', 'TAP (Tempo de Protrombina) / INR', 'Tempo de Sangramento', 'Contagem de Plaquetas'],
    explanation: 'O INR é a forma padronizada de relatar o TAP para monitoramento de anticoagulantes orais.',
    createdAt: Date.now()
  },
  {
    id: 'ac10_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Cilindros Hemáticos" no sedimento urinário sugere:',
    correctAnswer: 'Glomerulonefrite',
    options: ['Cistite', 'Cálculo Renal', 'Glomerulonefrite', 'Uretrite'],
    explanation: 'Cilindros hemáticos indicam sangramento de origem glomerular.',
    createdAt: Date.now()
  },
  {
    id: 'ac11_new',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a cor do tubo utilizado para exames de Bioquímica (Soro)?',
    correctAnswer: 'Vermelho ou Amarelo',
    options: ['Roxo', 'Azul', 'Verde', 'Vermelho ou Amarelo'],
    explanation: 'Tubos vermelhos (secos) ou amarelos (com gel separador) são usados para obter soro.',
    createdAt: Date.now()
  },
  {
    id: 'ac12_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O teste de Coombs Direto é utilizado para detectar:',
    correctAnswer: 'Anticorpos ligados às hemácias do paciente',
    options: ['Anticorpos livres no soro', 'Anticorpos ligados às hemácias do paciente', 'Antígenos virais', 'Níveis de hemoglobina'],
    explanation: 'O Coombs direto identifica anemia hemolítica autoimune ou doença hemolítica do recém-nascido.',
    createdAt: Date.now()
  },
  {
    id: 'ac13_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual enzima é considerada o marcador mais sensível para lesão muscular cardíaca (Infarto)?',
    correctAnswer: 'Troponina',
    options: ['TGO', 'CK-MB', 'Troponina', 'Amilase'],
    explanation: 'As troponinas (I ou T) são altamente específicas e sensíveis para o diagnóstico de IAM.',
    createdAt: Date.now()
  },
  {
    id: 'ac14_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal eletrólito intracelular?',
    correctAnswer: 'Potássio',
    options: ['Sódio', 'Cálcio', 'Potássio', 'Cloro'],
    explanation: 'O potássio é o cátion predominante no meio intracelular.',
    createdAt: Date.now()
  },
  {
    id: 'ac15_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O exame de Hemoglobina Glicada (HbA1c) reflete a glicemia média de qual período?',
    correctAnswer: 'Últimos 2 a 3 meses',
    options: ['Últimas 24 horas', 'Última semana', 'Últimos 2 a 3 meses', 'Último ano'],
    explanation: 'A HbA1c avalia o controle glicêmico a longo prazo, baseada na vida média das hemácias.',
    createdAt: Date.now()
  },
  {
    id: 'ac16_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o método de coloração padrão utilizado em Microbiologia para classificar bactérias?',
    correctAnswer: 'Coloração de Gram',
    options: ['Coloração de Ziehl-Neelsen', 'Coloração de Gram', 'Coloração de Giemsa', 'Coloração de Wright'],
    explanation: 'O Gram diferencia bactérias em positivas (roxas) ou negativas (rosas) conforme a parede celular.',
    createdAt: Date.now()
  },
  {
    id: 'ac17_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Corpos de Heinz" nas hemácias está associada a:',
    correctAnswer: 'Deficiência de G6PD',
    options: ['Anemia Falciforme', 'Deficiência de G6PD', 'Anemia Ferropriva', 'Malária'],
    explanation: 'Corpos de Heinz são precipitados de hemoglobina desnaturada.',
    createdAt: Date.now()
  },
  {
    id: 'ac18_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o valor normal de pH do sangue arterial?',
    correctAnswer: '7,35 a 7,45',
    options: ['7,00 a 7,10', '7,35 a 7,45', '7,50 a 7,60', '6,80 a 7,20'],
    explanation: 'O pH sanguíneo é rigorosamente mantido entre 7,35 e 7,45 para o metabolismo celular.',
    createdAt: Date.now()
  },
  {
    id: 'ac19_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal marcador laboratorial para avaliar a função renal?',
    correctAnswer: 'Creatinina',
    options: ['Ureia', 'Ácido Úrico', 'Creatinina', 'Glicose'],
    explanation: 'A creatinina sérica é o marcador mais estável e confiável para a taxa de filtração glomerular.',
    createdAt: Date.now()
  },
  {
    id: 'ac20_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O teste de VDRL é utilizado para o rastreio de qual patologia?',
    correctAnswer: 'Sífilis',
    options: ['HIV', 'Hepatite B', 'Sífilis', 'Gonorreia'],
    explanation: 'O VDRL é um teste não treponêmico usado para triagem e controle de cura da sífilis.',
    createdAt: Date.now()
  },
  {
    id: 'ac21_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual célula é responsável pela produção de anticorpos?',
    correctAnswer: 'Plasmócito',
    options: ['Linfócito T', 'Monócito', 'Plasmócito', 'Neutrófilo'],
    explanation: 'Os plasmócitos são derivados dos linfócitos B e secretam imunoglobulinas.',
    createdAt: Date.now()
  },
  {
    id: 'ac22_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A "Reação de Widal" é utilizada no diagnóstico de:',
    correctAnswer: 'Febre Tifoide',
    options: ['Brucelose', 'Febre Tifoide', 'Leptospirose', 'Tuberculose'],
    explanation: 'A reação de Widal detecta anticorpos contra a Salmonella typhi.',
    createdAt: Date.now()
  },
  {
    id: 'ac23_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal carboidrato encontrado no sangue?',
    correctAnswer: 'Glicose',
    options: ['Frutose', 'Lactose', 'Glicose', 'Sacarose'],
    explanation: 'A glicose é a principal fonte de energia para as células humanas.',
    createdAt: Date.now()
  },
  {
    id: 'ac24_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O exame de "Gota Espessa" é o padrão-ouro para o diagnóstico de:',
    correctAnswer: 'Malária',
    options: ['Doença de Chagas', 'Leishmaniose', 'Malária', 'Filariose'],
    explanation: 'A gota espessa permite a visualização e identificação das espécies de Plasmodium.',
    createdAt: Date.now()
  },
  {
    id: 'ac25_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o anticoagulante presente no tubo de tampa azul (Coagulação)?',
    correctAnswer: 'Citrato de Sódio',
    options: ['EDTA', 'Heparina', 'Citrato de Sódio', 'Fluoreto de Sódio'],
    explanation: 'O citrato de sódio a 3,2% é o anticoagulante para testes de coagulação.',
    createdAt: Date.now()
  },
  {
    id: 'ac26_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Cristais de Oxalato de Cálcio" na urina pode estar associada a:',
    correctAnswer: 'Cálculos Renais',
    options: ['Infecção Urinária', 'Diabetes', 'Cálculos Renais', 'Hepatite'],
    explanation: 'São os cristais mais comuns encontrados no sedimento urinário.',
    createdAt: Date.now()
  },
  {
    id: 'ac27_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal lipídio transportado pela LDL (colesterol "ruim")?',
    correctAnswer: 'Colesterol',
    options: ['Triglicerídeos', 'Fosfolipídios', 'Colesterol', 'Ácidos Graxos'],
    explanation: 'A LDL transporta colesterol do fígado para os tecidos periféricos.',
    createdAt: Date.now()
  },
  {
    id: 'ac28_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O método de Ziehl-Neelsen é utilizado para detectar:',
    correctAnswer: 'Bacilos Álcool-Ácido Resistentes (BAAR)',
    options: ['Bactérias Gram Positivas', 'Fungos', 'Bacilos Álcool-Ácido Resistentes (BAAR)', 'Protozoários'],
    explanation: 'É a coloração usada para o diagnóstico da Tuberculose (Bacilo de Koch).',
    createdAt: Date.now()
  },
  {
    id: 'ac29_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função da Albumina no sangue?',
    correctAnswer: 'Manter a pressão oncótica',
    options: ['Transporte de oxigênio', 'Coagulação', 'Manter a pressão oncótica', 'Defesa imunológica'],
    explanation: 'A albumina é a principal proteína plasmática responsável por manter a água dentro dos vasos.',
    createdAt: Date.now()
  },
  {
    id: 'ac30_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O aumento da Bilirrubina Indireta sugere:',
    correctAnswer: 'Hemólise',
    options: ['Obstrução biliar', 'Hepatite viral', 'Hemólise', 'Cirrose'],
    explanation: 'A bilirrubina indireta (não conjugada) aumenta quando há destruição excessiva de hemácias.',
    createdAt: Date.now()
  },
  {
    id: 'ac31_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal marcador para o diagnóstico de Pancreatite Aguda?',
    correctAnswer: 'Amilase e Lipase',
    options: ['TGO e TGP', 'Amilase e Lipase', 'Glicose', 'Creatinina'],
    explanation: 'A elevação súbita destas enzimas pancreáticas é característica da pancreatite.',
    createdAt: Date.now()
  },
  {
    id: 'ac32_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o grupo sanguíneo considerado "Doador Universal"?',
    correctAnswer: 'O Negativo',
    options: ['AB Positivo', 'O Positivo', 'O Negativo', 'A Negativo'],
    explanation: 'O sangue O negativo não possui antígenos A, B ou Rh, podendo ser transfundido em emergências.',
    createdAt: Date.now()
  },
  {
    id: 'ac33_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o grupo sanguíneo considerado "Recetor Universal"?',
    correctAnswer: 'AB Positivo',
    options: ['O Negativo', 'AB Positivo', 'A Positivo', 'B Negativo'],
    explanation: 'O sangue AB positivo possui todos os antígenos e nenhum anticorpo anti-A, anti-B ou anti-Rh.',
    createdAt: Date.now()
  },
  {
    id: 'ac34_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que indica um "Desvio à Esquerda" no hemograma?',
    correctAnswer: 'Presença de formas jovens de neutrófilos (infecção aguda)',
    options: ['Aumento de linfócitos', 'Presença de formas jovens de neutrófilos (infecção aguda)', 'Diminuição de plaquetas', 'Aumento de eosinófilos'],
    explanation: 'O desvio à esquerda sugere que a medula está liberando células imaturas para combater uma infecção.',
    createdAt: Date.now()
  },
  {
    id: 'ac35_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal exame para diagnóstico de Diabetes Mellitus?',
    correctAnswer: 'Glicemia de Jejum',
    options: ['Ureia', 'Glicemia de Jejum', 'Colesterol', 'Hemograma'],
    explanation: 'A glicemia de jejum é o teste inicial padrão para triagem de diabetes.',
    createdAt: Date.now()
  },
  {
    id: 'ac36_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Cetonúria" (corpos cetônicos na urina) é comum em:',
    correctAnswer: 'Cetoacidose Diabética',
    options: ['Infecção Urinária', 'Cetoacidose Diabética', 'Hepatite', 'Glomerulonefrite'],
    explanation: 'Corpos cetônicos resultam do metabolismo incompleto de gorduras na ausência de insulina.',
    createdAt: Date.now()
  },
  {
    id: 'ac37_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal componente do sedimento urinário na Infecção Urinária?',
    correctAnswer: 'Leucócitos (Piúria)',
    options: ['Hemácias', 'Cristais', 'Leucócitos (Piúria)', 'Cilindros'],
    explanation: 'A piúria (pus na urina) é o achado mais frequente em processos infecciosos do trato urinário.',
    createdAt: Date.now()
  },
  {
    id: 'ac38_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o tempo de jejum recomendado para o Perfil Lipídico (Colesterol e Triglicerídeos)?',
    correctAnswer: '12 horas',
    options: ['4 horas', '8 horas', '12 horas', 'Não precisa de jejum'],
    explanation: 'O jejum de 12 horas é necessário para a estabilização dos níveis de triglicerídeos.',
    createdAt: Date.now()
  },
  {
    id: 'ac39_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que avalia o exame de TTPA (Tempo de Tromboplastina Parcial Ativada)?',
    correctAnswer: 'Via Intrínseca da coagulação',
    options: ['Via Extrínseca', 'Via Intrínseca da coagulação', 'Função Plaquetária', 'Fibrinogênio'],
    explanation: 'O TTPA monitora a via intrínseca e é usado para controle de terapia com heparina não fracionada.',
    createdAt: Date.now()
  },
  {
    id: 'ac40_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de "Lipemia" (soro leitoso) em uma amostra?',
    correctAnswer: 'Níveis elevados de Triglicerídeos',
    options: ['Níveis elevados de Glicose', 'Níveis elevados de Triglicerídeos', 'Hemólise', 'Excesso de Bilirrubina'],
    explanation: 'A presença de quilomícrons ou VLDL em excesso deixa o soro com aspecto esbranquiçado.',
    createdAt: Date.now()
  },
  {
    id: 'ac41_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal parasita causador da Malária em Angola?',
    correctAnswer: 'Plasmodium falciparum',
    options: ['Plasmodium vivax', 'Plasmodium falciparum', 'Plasmodium malariae', 'Plasmodium ovale'],
    explanation: 'O P. falciparum é responsável pela maioria dos casos e pelas formas mais graves de malária no país.',
    createdAt: Date.now()
  },
  {
    id: 'ac42_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O exame de "Sumário de Urina" (EAS) deve ser preferencialmente realizado com:',
    correctAnswer: 'Primeira urina da manhã (jacto médio)',
    options: ['Qualquer urina do dia', 'Primeira urina da manhã (jacto médio)', 'Urina de 24 horas', 'Última urina da noite'],
    explanation: 'A primeira urina da manhã é mais concentrada, facilitando a detecção de elementos anormais.',
    createdAt: Date.now()
  },
  {
    id: 'ac43_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual enzima hepática é mais específica para lesão do hepatócito (fígado)?',
    correctAnswer: 'TGP (ALT)',
    options: ['TGO (AST)', 'TGP (ALT)', 'Fosfatase Alcalina', 'Gama-GT'],
    explanation: 'A TGP localiza-se principalmente no citoplasma dos hepatócitos, sendo mais específica que a TGO.',
    createdAt: Date.now()
  },
  {
    id: 'ac44_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O aumento da Fosfatase Alcalina e Gama-GT sugere:',
    correctAnswer: 'Colestase (obstrução biliar)',
    options: ['Hepatite aguda', 'Colestase (obstrução biliar)', 'Hemólise', 'Pancreatite'],
    explanation: 'Estas enzimas aumentam em processos obstrutivos das vias biliares.',
    createdAt: Date.now()
  },
  {
    id: 'ac45_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal eletrólito extracelular?',
    correctAnswer: 'Sódio',
    options: ['Potássio', 'Sódio', 'Magnésio', 'Fosfato'],
    explanation: 'O sódio é o principal determinante da osmolaridade plasmática.',
    createdAt: Date.now()
  },
  {
    id: 'ac46_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Células em Foice" (Drepanócitos) é característica de:',
    correctAnswer: 'Anemia Falciforme',
    options: ['Talassemia', 'Anemia Falciforme', 'Anemia Ferropriva', 'Anemia Perniciosa'],
    explanation: 'Drepanócitos resultam da polimerização da Hemoglobina S em condições de baixa oxigenação.',
    createdAt: Date.now()
  },
  {
    id: 'ac47_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal componente da Hemoglobina?',
    correctAnswer: 'Ferro',
    options: ['Cálcio', 'Magnésio', 'Ferro', 'Zinco'],
    explanation: 'O ferro no grupo heme é responsável pela ligação com o oxigênio.',
    createdAt: Date.now()
  },
  {
    id: 'ac48_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O exame de "Reticulócitos" avalia:',
    correctAnswer: 'A atividade eritropoiética da medula óssea',
    options: ['A função das plaquetas', 'A atividade eritropoiética da medula óssea', 'A presença de infecção', 'A reserva de ferro'],
    explanation: 'Reticulócitos são hemácias jovens; seu aumento indica que a medula está produzindo mais células vermelhas.',
    createdAt: Date.now()
  },
  {
    id: 'ac49_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal método para diagnóstico laboratorial de Parasitoses Intestinais?',
    correctAnswer: 'Exame Parasitológico de Fezes (EPF)',
    options: ['Hemograma', 'Exame Parasitológico de Fezes (EPF)', 'Urina II', 'Cultura de Sangue'],
    explanation: 'O EPF permite a pesquisa de ovos, cistos ou larvas de parasitas nas fezes.',
    createdAt: Date.now()
  },
  {
    id: 'ac50_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função das Plaquetas?',
    correctAnswer: 'Hemostasia (Coagulação)',
    options: ['Transporte de O2', 'Defesa Imunitária', 'Hemostasia (Coagulação)', 'Produção de Hormônios'],
    explanation: 'As plaquetas formam o tampão plaquetário inicial em locais de lesão vascular.',
    createdAt: Date.now()
  },
  {
    id: 'ac51_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Hemólise" in vitro?',
    correctAnswer: 'Ruptura das hemácias durante ou após a colheita',
    options: ['Aumento das hemácias', 'Ruptura das hemácias durante ou após a colheita', 'Presença de gordura no sangue', 'Sangue coagulado no tubo'],
    explanation: 'A hemólise libera hemoglobina no soro/plasma, podendo interferir em diversos testes bioquímicos.',
    createdAt: Date.now()
  },
  {
    id: 'ac52_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal gás transportado pelas hemácias?',
    correctAnswer: 'Oxigénio',
    options: ['Nitrogénio', 'Dióxido de Carbono', 'Oxigénio', 'Hidrogénio'],
    explanation: 'A hemoglobina liga-se ao oxigênio nos pulmões e o transporta para os tecidos.',
    createdAt: Date.now()
  },
  {
    id: 'ac53_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de "Cilindros Hialinos" na urina pode ser normal após:',
    correctAnswer: 'Exercício físico intenso',
    options: ['Infecção grave', 'Exercício físico intenso', 'Diabetes descompensado', 'Hepatite'],
    explanation: 'Pequenas quantidades de cilindros hialinos podem aparecer após esforço físico ou desidratação leve.',
    createdAt: Date.now()
  },
  {
    id: 'ac54_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal objetivo da "Cultura de Urina" (Urocultura)?',
    correctAnswer: 'Identificar a bactéria causadora da infecção e seu perfil de sensibilidade',
    options: ['Verificar a presença de glicose', 'Identificar a bactéria causadora da infecção e seu perfil de sensibilidade', 'Medir o volume urinário', 'Verificar a cor da urina'],
    explanation: 'A urocultura identifica o patógeno e o antibiograma orienta o tratamento correto.',
    createdAt: Date.now()
  },
  {
    id: 'ac55_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal componente do "Pus"?',
    correctAnswer: 'Neutrófilos mortos e detritos celulares',
    options: ['Hemácias', 'Linfócitos', 'Neutrófilos mortos e detritos celulares', 'Plaquetas'],
    explanation: 'O pus é o resultado da resposta inflamatória aguda contra bactérias piogênicas.',
    createdAt: Date.now()
  },
  {
    id: 'ac56_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que avalia o exame de "Tempo de Sangramento"?',
    correctAnswer: 'A função plaquetária e a integridade vascular',
    options: ['A via intrínseca da coagulação', 'A via extrínseca', 'A função plaquetária e a integridade vascular', 'O nível de fibrinogênio'],
    explanation: 'Avalia a fase primária da hemostasia.',
    createdAt: Date.now()
  },
  {
    id: 'ac57_new',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de eliminação da Bilirrubina?',
    correctAnswer: 'Bile (Fezes)',
    options: ['Urina', 'Suor', 'Bile (Fezes)', 'Respiração'],
    explanation: 'A maior parte da bilirrubina é excretada no intestino através da bile.',
    createdAt: Date.now()
  },

  // --- LOTE EXTRA DE QUESTÕES ---
  {
    id: 'ac21',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual marcador sorológico da Hepatite B indica imunidade à doença?',
    correctAnswer: 'Anti-HBs',
    options: ['HBsAg', 'Anti-HBs', 'Anti-HBc', 'HBeAg'],
    explanation: 'A presença de anticorpos Anti-HBs indica que o indivíduo está imune, seja por vacinação ou por cura de infecção prévia.',
    createdAt: Date.now()
  },
  {
    id: 'ac22',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O tipo sanguíneo AB caracteriza-se por:',
    correctAnswer: 'Não apresentar aglutininas (anticorpos) no soro',
    options: ['Possuir aglutininas Anti-A e Anti-B', 'Não apresentar aglutininas (anticorpos) no soro', 'Não possuir antígenos nas hemácias', 'Ser o doador universal'],
    explanation: 'Indivíduos do grupo AB possuem antígenos A e B nas hemácias e, por isso, não produzem anticorpos contra eles.',
    createdAt: Date.now()
  },
  {
    id: 'enf19',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Ao presenciar um indivíduo consciente engasgando-se, qual manobra deve ser realizada prioritariamente?',
    correctAnswer: 'Manobra de Heimlich',
    options: ['Manobra de Valsalva', 'Manobra de Heimlich', 'Massagem cardíaca', 'Ventilação artificial'],
    explanation: 'A Manobra de Heimlich é a técnica de primeiros socorros para desobstrução de vias aéreas por corpo estranho.',
    createdAt: Date.now()
  },
  {
    id: 'enf20',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Em qual data é comemorado mundialmente o Dia do Enfermeiro?',
    correctAnswer: '12 de Maio',
    options: ['7 de Abril', '1 de Maio', '12 de Maio', '25 de Setembro'],
    explanation: 'O dia 12 de maio homenageia o nascimento de Florence Nightingale, pioneira da enfermagem moderna.',
    createdAt: Date.now()
  },
  {
    id: 'ac23',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'A anemia causada pela deficiência de Vitamina B12 ou Ácido Fólico é classificada como:',
    correctAnswer: 'Anemia Megaloblástica',
    options: ['Anemia Ferropriva', 'Anemia Hemolítica', 'Anemia Megaloblástica', 'Anemia Falciforme'],
    explanation: 'A falta desses nutrientes impede a divisão celular correta, gerando hemácias grandes e imaturas (megaloblastos).',
    createdAt: Date.now()
  },
  {
    id: 'cg31',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual destes países NÃO faz parte da CPLP (Comunidade de Países de Língua Portuguesa)?',
    correctAnswer: 'Guiné Conacri',
    options: ['Angola', 'Brasil', 'Guiné-Bissau', 'Guiné Conacri'],
    explanation: 'A Guiné Conacri é um país de língua oficial francesa. A Guiné-Bissau e a Guiné Equatorial fazem parte da CPLP.',
    createdAt: Date.now()
  },
  {
    id: 'cg32',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a maior cidade do mundo em termos de população urbana?',
    correctAnswer: 'Tóquio',
    options: ['Nova York', 'Pequim', 'Tóquio', 'Londres'],
    explanation: 'Tóquio, no Japão, permanece como a área metropolitana mais populosa do planeta.',
    createdAt: Date.now()
  },
  {
    id: 'cg33',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o maior deserto do mundo (considerando desertos gelados)?',
    correctAnswer: 'Antártida',
    options: ['Saara', 'Gobi', 'Antártida', 'Atacama'],
    explanation: 'Geograficamente, a Antártida é classificada como um deserto e é o maior do mundo em extensão.',
    createdAt: Date.now()
  },
  {
    id: 'ac24',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Para a descontaminação das mãos em virtude de infecção por vírus como o H1N1, recomenda-se o uso de:',
    correctAnswer: 'Álcool gel',
    options: ['Água filtrada apenas', 'Álcool gel', 'Solução salina', 'Éter'],
    explanation: 'O álcool gel a 70% é eficaz na inativação de vírus envelopados como o Influenza (H1N1).',
    createdAt: Date.now()
  },
  {
    id: 'cg34',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o dia mundial da saúde?',
    correctAnswer: '7 de Abril',
    options: ['7 de Abril', '12 de Maio', '1 de Dezembro', '25 de Setembro'],
    explanation: 'O Dia Mundial da Saúde é celebrado em 7 de abril, data da fundação da OMS em 1948.',
    createdAt: Date.now()
  },

  // --- MAIS QUESTÕES DOS MANUAIS ---
  {
    id: 'ac25',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual destes exames NÃO é considerado um marcador cardíaco para diagnóstico de infarto?',
    correctAnswer: 'Hemoglobina',
    options: ['Troponina', 'CK-MB', 'Mioglobina', 'Hemoglobina'],
    explanation: 'A hemoglobina é uma proteína de transporte de oxigênio, não um marcador de lesão miocárdica como a Troponina ou CK-MB.',
    createdAt: Date.now()
  },
  {
    id: 'ac26',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual patologia pode ser transmitida da mãe para o filho através da placenta?',
    correctAnswer: 'Sífilis',
    options: ['Escherichia coli', 'Proteus', 'Sífilis', 'Cistite'],
    explanation: 'A sífilis congênita ocorre pela transmissão transplacentária do Treponema pallidum.',
    createdAt: Date.now()
  },
  {
    id: 'ac27',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quais são as alterações possíveis no volume urinário?',
    correctAnswer: 'Oligúria, poliúria, anúria e nictúria',
    options: ['Apenas oligúria', 'Oligúria, poliúria, anúria e nictúria', 'Apenas disúria', 'Hematúria e piúria'],
    explanation: 'Esses termos descrevem variações quantitativas e de ritmo da eliminação urinária.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_1',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Uma paciente de 28 anos queixa-se de febres intermitentes há seis meses, estado físico normal, dores lombares e irregularidades menstruais. Apresenta desidratação, hemoglobina normal, mas hematócrito alto e eritrocitose. O biomédico suspeita de policitemia vera. Esta conclusão baseia-se num quadro que demonstra:',
    correctAnswer: 'Nenhuma destas',
    options: ['Uma anemia microcítica', 'Uma anemia macrocítica', 'Uma anemia normocítica', 'Nenhuma destas'],
    explanation: 'A policitemia vera caracteriza-se pelo aumento da massa eritrocitária (eritrocitose), não sendo uma forma de anemia.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_2',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual destes índices hematimétricos serve para classificar as anemias em hipercrômicas, hipocrômicas e normocrômicas?',
    correctAnswer: 'Determinação do HCM',
    options: ['Contagem de eritrócitos + Hb', 'Determinação do VCM', 'Cálculo de Hemoglobina + Hto', 'Determinação do HCM'],
    explanation: 'O HCM (Hemoglobina Corpuscular Média) indica a quantidade média de hemoglobina por hemácia, definindo a cor (cromia).',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_4',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O Hemograma completo nos informa sobre todas as alternativas abaixo, EXCETO:',
    correctAnswer: 'Reticulócitos',
    options: ['Reticulócitos', 'Leucócitos', 'Hematócrito', 'Plaquetas'],
    explanation: 'A contagem de reticulócitos geralmente não faz parte do hemograma padrão, devendo ser solicitada à parte.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_5',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A hemoglobina composta por cadeias gama chama-se:',
    correctAnswer: 'Hemoglobina fetal',
    options: ['Hemoglobina embrionária', 'Hemoglobina fetal', 'Hemoglobina adulta (HbA1)', 'Hemoglobina A2'],
    explanation: 'A Hemoglobina Fetal (HbF) é composta por duas cadeias alfa e duas cadeias gama.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_6',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Paciente feminina, 24 anos, com febre, emagrecimento, fadiga e taquicardia. Exames: Hb 9g/dl, Hto 45%, eletroforese com Hb SS. Qual a patologia provável?',
    correctAnswer: 'Drepanocitose',
    options: ['Drepanocitose', 'Hepatite B', 'Talassemia alfa', 'Anemia ferropriva'],
    explanation: 'A presença de Hb SS na eletroforese é característica da anemia falciforme (drepanocitose).',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_7',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A poiquilocitose em que os eritrócitos apresentam-se em forma de alvo denomina-se:',
    correctAnswer: 'Target cells',
    options: ['Helmet cells', 'Drop cells', 'Drepanócitos', 'Target cells'],
    explanation: 'Target cells (codócitos) são hemácias em alvo, comuns em hemoglobinopatias e doenças hepáticas.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_8',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Paciente com respiração superficial, taquicardia, palidez e fraqueza. Exames: neutropenia, monocitose e eosinofilia. Pode-se presumir:',
    correctAnswer: 'Anemia normocítica e parasitoses',
    options: ['Anemia normocítica e parasitoses', 'Microcitose, infecções bacterianas agudas', 'Hemoglobinopatia e parasitoses', 'Microcitose e infecções virais agudas'],
    explanation: 'A eosinofilia é um marcador clássico de infecções parasitárias ou processos alérgicos.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_10',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Paciente com palidez súbita, febre, policromasia, dores abdominais e bilirrubina elevada. Exame: monocitose, neutropenia e linfocitose. Provável diagnóstico:',
    correctAnswer: 'Malária grave ou crónica',
    options: ['Hepatite aguda', 'Febre tifóide crónica', 'Malária grave ou crónica', 'Febre tifóide aguda'],
    explanation: 'A malária pode causar anemia hemolítica (elevando bilirrubina) e alterações leucocitárias significativas.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_11',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Paciente de 36 anos com febre, palidez, sudorese e erupções. Hematologia: Hb 14g/dl, Htc 45%, Linfócitos 55%. Provável diagnóstico:',
    correctAnswer: 'Nenhuma destas',
    options: ['Sífilis crônica', 'Tuberculose aguda', 'Chikungunya', 'Nenhuma destas'],
    explanation: 'Linfocitose (55%) sem anemia sugere processo viral, mas as opções específicas não se encaixam perfeitamente sem mais dados.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_12',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Paciente feminina, 24 anos, febre, fadiga. Quadro: Linfócitos 64%, Hb 12g/dl, eletroforese com Hb A2 elevada. Provável diagnóstico:',
    correctAnswer: 'Talassemia',
    options: ['Tuberculose aguda', 'Brucelose aguda', 'Talassemia', 'Febre tifóide crónica'],
    explanation: 'O aumento da Hb A2 é um marcador laboratorial importante para o diagnóstico de beta-talassemia minor.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_13',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual técnica eritrocitária quantitativa é necessária para o cálculo do VCM?',
    correctAnswer: 'Avaliação do Hematócrito',
    options: ['Contagem de eritrócitos', 'Cálculo de hemoglobina', 'Avaliação do Hematócrito', 'Todas estão erradas'],
    explanation: 'O VCM é calculado pela fórmula: (Hematócrito / Eritrócitos) x 10.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_14',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em qual exame hematológico se observa a presença de blastos, hematozoários e poiquilocitose?',
    correctAnswer: 'Eritrograma qualitativo',
    options: ['Eritrograma quantitativo', 'HCM', 'Eritrograma qualitativo', 'Nenhuma destas'],
    explanation: 'A análise qualitativa (extensão sanguínea) permite observar a morfologia celular e presença de parasitas.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_15',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Um histograma com desvio à esquerda no volume eritrocitário representa:',
    correctAnswer: 'Hipocromia',
    options: ['Poiquilocitose', 'Hipocromia', 'Macrocitose', 'Todas estão erradas'],
    explanation: 'O desvio à esquerda no histograma de volume indica populações de células menores (microcitose), frequentemente associada à hipocromia.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_16',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'A hemoglobinopatia que consiste na deleção genética e alteração estrutural da globina denomina-se:',
    correctAnswer: 'Talassemia alfa',
    options: ['Talassemia beta major', 'Talassemia alfa', 'Talassemia beta minor', 'Nenhuma destas'],
    explanation: 'As talassemias alfa são causadas principalmente por deleções de um ou mais dos quatro genes da globina alfa.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_17',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'A disseminação da malária em Angola poderia ser minimizada com as seguintes medidas, EXCETO:',
    correctAnswer: 'Não há excepto',
    options: ['Tratamento de pessoas doentes', 'Combate às larvas do mosquito', 'Melhoria das habitações', 'Não há excepto'],
    explanation: 'Todas as opções citadas (tratamento, combate ao vetor e melhoria habitacional) são medidas eficazes.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_18',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a dengue, assinale a alternativa correta:',
    correctAnswer: 'Os sintomas incluem dor de cabeça, nas articulações, fadiga e febre',
    options: ['É causada por um parasita acelular transmitido pelo Anopheles', 'Os sintomas incluem dor de cabeça, nas articulações, fadiga e febre', 'O tratamento deve ser feito com aspirina (AAS)', 'Não existe forma de prevenção'],
    explanation: 'A dengue causa dores intensas no corpo e articulações. O uso de AAS é contraindicado pelo risco de hemorragia.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_19',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Marque a alternativa que contém apenas doenças causadas por vírus:',
    correctAnswer: 'Hepatite, Raiva e caxumba',
    options: ['Dengue, herpes e tétano', 'Hepatite, Raiva e caxumba', 'Dengue, cólera, gonorreia', 'Raiva, dengue e gonorreia'],
    explanation: 'Hepatite, raiva e caxumba são todas viroses. Tétano, cólera e gonorreia são bacterianas.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_20',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A coceira após sair de uma lagoa pode indicar a presença de qual parasita?',
    correctAnswer: 'Schistosoma mansoni',
    options: ['Entamoeba histolytica', 'Enterobius vermicularis', 'Schistosoma mansoni', 'Nenhuma destas'],
    explanation: 'A penetração das cercárias do Schistosoma mansoni na pele causa a "dermatite cercariana" ou coceira do nadador.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_21',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em qual opção os vetores de transmissão pertencem à mesma classe animal (insetos)?',
    correctAnswer: 'Leishmaniose / Malária / Filaríase',
    options: ['Esquistossomose / Cisticercose / Malária', 'Doença de Chagas / Leishmaniose / Tuberculose', 'Febre tifóide / Leptospirose / Peste bubônica', 'Leishmaniose / Malária / Filaríase'],
    explanation: 'Leishmaniose (flebotomíneos), Malária (Anopheles) e Filaríase (Culex/outros) são todas transmitidas por insetos.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_22',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alternativa que apresenta parasitoses causadas unicamente por vermes nematelmintos:',
    correctAnswer: 'Ancilostomose, filaríase e oxiurose',
    options: ['Ascaridíase, ancilostomose e teníase', 'Ascaridíase, filaríase e esquistossomose', 'Ancilostomose, filaríase e oxiurose', 'Nenhuma destas'],
    explanation: 'Ancilostomose, filaríase e oxiurose são causadas por vermes cilíndricos (nematelmintos). Teníase e esquistossomose são platelmintos.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_23',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Os parasitas Schistosoma mansoni e Taenia solium apresentam em comum:',
    correctAnswer: 'Dois tipos de hospedeiro, um intermediário e um definitivo',
    options: ['Um único hospedeiro intermediário', 'Dois tipos de hospedeiro, um intermediário e um definitivo', 'Hospedeiros apenas invertebrados', 'Um único tipo de hospedeiro'],
    explanation: 'Ambos são heteroxenos, necessitando de hospedeiros intermediários (caramujo/porco) e definitivos (homem).',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_24',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O parasita que provoca a neurocisticercose infesta o organismo através da:',
    correctAnswer: 'Ingestão de ovos de Taenia solium',
    options: ['Penetração ativa de cercárias na pele', 'Ingestão de ovos de Taenia solium', 'Ingestão de larvas em alimentos', 'Nenhuma destas'],
    explanation: 'A cisticercose humana ocorre pela ingestão de ovos de T. solium, que liberam embriões que migram para tecidos como o cérebro.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_25',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Relacione a doença com seu hospedeiro intermediário. Qual está INCORRETA?',
    correctAnswer: 'Cisticercose: Boi',
    options: ['Doença de Chagas: Barbeiro', 'Cisticercose: Boi', 'Malária: Anopheles', 'Esquistossomose: Caramujo'],
    explanation: 'A cisticercose humana está ligada à Taenia solium (porco). O boi é hospedeiro intermediário da Taenia saginata (teníase).',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_26',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A infestação por Taenia solium (teníase) e a cisticercose ocorrem, respectivamente, por:',
    correctAnswer: 'Comer carne de porco com cisticercos e ingerir ovos da tênia',
    options: ['Comer carne de porco com cisticercos e andar descalço', 'Ser picado por mosquito e beber água não tratada', 'Comer carne de porco com cisticercos e ingerir ovos da tênia', 'Andar descalço e ser picado por mosquito'],
    explanation: 'Teníase: ingestão de cisticercos na carne. Cisticercose: ingestão acidental de ovos do parasita.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_27',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Exame de fezes indica: ovos de T. solium, A. lumbricoides e cistos de E. histolytica. O paciente tem:',
    correctAnswer: 'Teníase, ascaridíase e amebíase',
    options: ['Teníase, ascaridíase e amebíase', 'Cisticercose, ascaridíase e amebíase', 'Teníase, ancilostomíase e amebíase', 'Tênia, ascaridíase e amebíase'],
    explanation: 'A presença de ovos de T. solium nas fezes indica teníase intestinal.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_29',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a sequência correta dos reagentes na coloração de Gram?',
    correctAnswer: 'Violeta, lugol, álcool, fucsina',
    options: ['Violeta, fucsina, álcool, lugol', 'Azul de metileno, fucsina, álcool, lugol', 'Violeta, lugol, álcool, azul de metileno', 'Violeta, lugol, álcool, fucsina'],
    explanation: 'A sequência padrão é: Cristal Violeta (corante), Lugol (mordente), Álcool (descorante) e Fucsina/Safranina (contracorante).',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_30',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a coloração de Gram, é correto afirmar, EXCETO:',
    correctAnswer: 'Não há excepto',
    options: ['Ambos os tipos de bactérias coram com cristal violeta inicialmente', 'Usa-se cristal violeta, safranina, lugol e álcool-acetona', 'Bactérias Gram-negativas perdem o cristal violeta no solvente', 'Não há excepto'],
    explanation: 'Todas as afirmações descrevem corretamente o processo e os resultados da coloração de Gram.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_31',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre o vírus Zika (ZIKV), é correto afirmar:',
    correctAnswer: 'Pode provocar danos cerebrais que comprometem visão e audição',
    options: ['Pode provocar danos cerebrais que comprometem visão e audição', 'É um retrovírus da família Flaviviridae', 'O controle passa por campanhas de vacinação em massa', 'Todas são falsas'],
    explanation: 'O Zika vírus tem tropismo pelo sistema nervoso central, podendo causar microcefalia e outras alterações neurológicas.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_32',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre doenças causadas por protozoários, é correto afirmar:',
    correctAnswer: 'Infecções por E. histolytica e Giardia são diagnosticadas por cistos nas fezes',
    options: ['Esfregaço sanguíneo é o melhor para Leishmaniose visceral', 'Reação de Montenegro é rotina para diagnóstico de malária', 'E. histolytica é identificada pelo coeficiente de sedimentação sanguínea', 'Infecções por E. histolytica e Giardia são diagnosticadas por cistos nas fezes'],
    explanation: 'O exame parasitológico de fezes (EPF) é o padrão para identificar cistos de protozoários intestinais.',
    createdAt: Date.now()
  },
  {
    id: 'ac_m_33',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Sobre métodos diagnósticos para helmintos, é correto afirmar, EXCETO:',
    correctAnswer: 'O melhor exame para Entamoeba é o método da fita gomada',
    options: ['O diagnóstico de esquistossomose busca ovos nas fezes', 'O exame de Baermann-Moraes busca larvas vivas de Strongyloides', 'O melhor exame para Entamoeba é o método da fita gomada', 'O método de sedimentação espontânea serve para teníase'],
    explanation: 'O método da fita gomada (Graham) é específico para Enterobius vermicularis, não para Entamoeba.',
    createdAt: Date.now()
  },
  {
    id: 'ac_u_34',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quais são as alterações possíveis no volume urinário?',
    correctAnswer: 'Oligúria, poliúria, anúria e nictúria',
    options: ['Oligúria, poliúria, distúrbio e nictúria', 'Oligúria, poliúria, disúria, urinúria', 'Hematúria e piúria', 'Anúria e glicosúria'],
    explanation: 'Estes termos referem-se à quantidade e frequência da urina eliminada.',
    createdAt: Date.now()
  },
  {
    id: 'ac_u_35',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a bilirrubina na urina, assinale a INCORRETA:',
    correctAnswer: 'Todas estão incorretas',
    options: ['Provém da destruição de hemácias velhas', 'Tem fonte hepática', 'Provém da destruição de hemácias defeituosas', 'Todas estão incorretas'],
    explanation: 'As opções A, B e C descrevem fatos corretos sobre a origem da bilirrubina.',
    createdAt: Date.now()
  },
  {
    id: 'ac_u_36',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São funções principais do rim, EXCETO:',
    correctAnswer: 'Alteração do equilíbrio ácido-base',
    options: ['Eliminação de metabólitos e produtos tóxicos', 'Alteração do equilíbrio ácido-base', 'Regulação do volume de fluidos corporais', 'Produção de hormônios'],
    explanation: 'O rim REGULA o equilíbrio ácido-base, não causa "alteração" (no sentido de desequilíbrio).',
    createdAt: Date.now()
  },
  {
    id: 'ac_b_37',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre causas de acidentes no laboratório, assinale a INCORRETA:',
    correctAnswer: 'Intoxicação e queimaduras biológicas',
    options: ['Choque elétrico', 'Incêndios', 'Intoxicação e queimaduras biológicas', 'Contaminação por agentes biológicos'],
    explanation: 'Embora existam riscos biológicos, o termo "queimadura biológica" não é padrão; usa-se contaminação ou infecção.',
    createdAt: Date.now()
  },
  {
    id: 'ac_b_38',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São amostras biológicas comuns no laboratório, EXCETO:',
    correctAnswer: 'Hormônios',
    options: ['Urina', 'Fezes', 'Hormônios', 'Líquido pericárdico'],
    explanation: 'Hormônios são analitos medidos DENTRO das amostras (como sangue ou urina), não o tipo de amostra em si.',
    createdAt: Date.now()
  },
  {
    id: 'ac_b_39',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São tipos de riscos de acidente nos laboratórios, EXCETO:',
    correctAnswer: 'Risco econômico',
    options: ['Risco econômico', 'Riscos de acidentes', 'Riscos químicos', 'Riscos biológicos'],
    explanation: 'Os riscos laboratoriais são classificados em: biológicos, químicos, físicos, ergonômicos e de acidentes.',
    createdAt: Date.now()
  },
  {
    id: 'ac_b_40',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre os tipos de análise e amostras, assinale a INCORRETA:',
    correctAnswer: 'Hematologia - sangue parcial com EDTA',
    options: ['Bioquímica/Sorologia - soro ou plasma', 'Parasitologia - fezes recentes', 'Urinálise 24h - urina de um período de 24h', 'Hematologia - sangue parcial com EDTA'],
    explanation: 'Em hematologia, utiliza-se geralmente sangue TOTAL com EDTA, não "sangue parcial".',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_41',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre a ética profissional, assinale a alternativa correta:',
    correctAnswer: 'É o conjunto de normas morais que orientam o comportamento na profissão',
    options: ['É apenas o estudo jurídico da profissão', 'É o conjunto de normas morais que orientam o comportamento na profissão', 'Refere-se apenas ao estatuto da empresa', 'Nenhuma destas é verdadeira'],
    explanation: 'A ética profissional guia a conduta moral do indivíduo no exercício de suas funções.',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_42',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Gêmeas idênticas têm grupo O Rh-. Pais têm Mãe A Rh+ e Pai B Rh+. Qual a atitude ética correta do profissional?',
    correctAnswer: 'Orientar a família a procurar aconselhamento genético',
    options: ['Efetuar de imediato um teste de paternidade', 'Orientar a família a procurar aconselhamento genético', 'Acusar a esposa de traição publicamente', 'Dizer às filhas que são adotadas'],
    explanation: 'Pais A e B podem ter filhos O se forem heterozigotos (Ai e Bi). O aconselhamento genético esclarece estas dúvidas.',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_43',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Paciente inconsciente após incêndio é salvo, mas fica com sequelas graves. Ele processa a equipe. Qual a análise ética?',
    correctAnswer: 'A equipe procedeu corretamente, pois nenhum paciente deve ser desamparado',
    options: ['O paciente tem razão, pois não deu consentimento', 'O médico deve ser preso imediatamente', 'O hospital deve pagar indenização sem questionar', 'A equipe procedeu corretamente, pois nenhum paciente deve ser desamparado'],
    explanation: 'Em situações de emergência com risco de vida e paciente inconsciente, o dever de socorro prevalece sobre o consentimento.',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_44',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Técnica de laboratório vê resultado de HIV positivo de sua própria irmã. O que ela deve fazer?',
    correctAnswer: 'Manter sigilo profissional e encaminhar o resultado ao médico',
    options: ['Reunir a família e contar a todos', 'Aconselhar a irmã a contar ao marido imediatamente', 'Manter sigilo profissional e encaminhar o resultado ao médico', 'Encaminhar a irmã para tratamento sem avisar ninguém'],
    explanation: 'O sigilo profissional é absoluto, independentemente do grau de parentesco.',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_45',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre os princípios da bioética, assinale a INCORRETA:',
    correctAnswer: 'O profissional de saúde pode ocasionalmente causar dano ao paciente',
    options: ['Autonomia refere-se ao direito do indivíduo sobre si', 'O profissional de saúde pode ocasionalmente causar dano ao paciente', 'Beneficência é o dever de promover o bem-estar', 'Justiça garante o direito à saúde para todos'],
    explanation: 'O princípio da Não-Maleficência estabelece que o profissional NUNCA deve causar dano intencional ao paciente.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_46',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São países africanos que fazem fronteira com Angola, EXCETO:',
    correctAnswer: 'África do Sul',
    options: ['África do Sul', 'Zâmbia', 'República do Congo', 'Namíbia'],
    explanation: 'Angola faz fronteira com Namíbia, Zâmbia, RDC e República do Congo. A África do Sul não faz fronteira direta.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_47',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São símbolos da República de Angola, EXCETO:',
    correctAnswer: 'Mapa de Angola',
    options: ['Hino Nacional', 'Insígnia', 'Mapa de Angola', 'Bandeira Nacional'],
    explanation: 'Os símbolos oficiais definidos na Constituição são a Bandeira, a Insígnia e o Hino Nacional.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_48',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São países africanos de língua oficial portuguesa (PALOP), EXCETO:',
    correctAnswer: 'Bissau',
    options: ['Angola', 'Moçambique', 'Bissau', 'Cabo Verde'],
    explanation: 'Bissau é a capital da Guiné-Bissau, não o nome do país.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_49',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São capitais de países da SADC, EXCETO:',
    correctAnswer: 'Adis Abeba',
    options: ['Pretória', 'Kinshasa', 'Antananarivo', 'Adis Abeba'],
    explanation: 'Adis Abeba é a capital da Etiópia, que não faz parte da SADC.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_50',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual destes escritores angolanos foi também um profissional de saúde (médico)?',
    correctAnswer: 'António Agostinho Neto',
    options: ['António Agostinho Neto', 'Manuel Rui Monteiro', 'António Jacinto', 'Óscar Ribas'],
    explanation: 'Agostinho Neto, o primeiro presidente de Angola, era médico de profissão.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_53',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a opção que NÃO faz parte do grupo das doenças renais:',
    correctAnswer: 'Poliúria, infecção urinária e uretrite',
    options: ['Doenças renais crônicas, cálculo renal, nefrite', 'Pielonefrite, nefropatia hipertensiva, insuficiência renal', 'Poliúria, infecção urinária e uretrite', 'Cistite aguda e crônica'],
    explanation: 'Poliúria é um sintoma (aumento do volume urinário), e uretrite/cistite são infecções do trato urinário inferior, não necessariamente doenças intrínsecas do parênquima renal.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_54',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre os exames hematológicos, assinale a verdadeira:',
    correctAnswer: 'Hemograma',
    options: ['Hemograma', 'Glicemia', 'VDRL', 'Urina II'],
    explanation: 'O hemograma é o exame básico da hematologia que avalia as séries vermelha, branca e plaquetária.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_55',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São provas de função hepática todas, EXCETO:',
    correctAnswer: 'Hemograma',
    options: ['Hemograma', 'Transaminases (ALT/AST)', 'Bilirrubina', 'Gama-GT'],
    explanation: 'O hemograma avalia o sangue periférico, enquanto transaminases e bilirrubinas são marcadores diretos da função e integridade hepática.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_57',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Assinale o valor considerado normal de Hemoglobina para um adulto saudável:',
    correctAnswer: '15 g/dl',
    options: ['15 g/dl', '5 g/dl', '19 g/dl', 'Todas são verdadeiras'],
    explanation: 'Valores entre 12 e 16 g/dl para mulheres e 13 a 18 g/dl para homens são geralmente considerados normais.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_58',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quais destas doenças são de notificação obrigatória no contexto da vigilância epidemiológica global?',
    correctAnswer: 'Raiva, febre amarela, Marburg, Ébola',
    options: ['Raiva, febre amarela, Marburg, Ébola', 'Hipertensão, HIV, Tuberculose, Diabetes', 'Infecção urinária, gravidez, abcesso dentário', 'Apenas HIV e Tuberculose'],
    explanation: 'Doenças com alto potencial de disseminação e gravidade, como febres hemorrágicas, exigem notificação imediata.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_59',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Relativamente ao hemograma, assinale a afirmação FALSA:',
    correctAnswer: 'Todas as afirmações são verdadeiras',
    options: ['O componente celular corresponde a aprox. 45% do volume', 'A Hemoglobina é calculada à parte para facilitar índices', 'O hemograma é calculado a partir da taxa de Hemoglobina', 'Todas as afirmações são verdadeiras'],
    explanation: 'O hemograma envolve medições diretas e cálculos baseados nelas para fornecer um quadro completo do sangue.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_60',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São tipos de risco de acidentes no laboratório, EXCETO:',
    correctAnswer: 'Riscos Econômicos',
    options: ['Riscos Econômicos', 'Riscos Químicos', 'Riscos Biológicos', 'Riscos de Acidentes'],
    explanation: 'Os riscos laboratoriais são biológicos, químicos, físicos, ergonômicos e de acidentes. Riscos econômicos não são riscos ocupacionais técnicos do laboratório.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_63',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a bilirrubina na urina, assinale a afirmação FALSA:',
    correctAnswer: 'Todas estão incorretas',
    options: ['Provém da destruição de hemácias velhas', 'Provém de fontes hepáticas', 'Provém da destruição de hemácias defeituosas', 'Todas estão incorretas'],
    explanation: 'A bilirrubina urinária (direta) indica problemas hepáticos ou biliares, sendo derivada do metabolismo do heme.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_67',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual marcador sorológico da hepatite B indica imunidade?',
    correctAnswer: 'Anti-HBs',
    options: ['HBsAg', 'Anti-HBs', 'Anti-HBc', 'HBcAg'],
    explanation: 'O Anti-HBs é o anticorpo que confere imunidade, seja por vacinação ou por cura da infecção.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_75',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre os riscos encontrados em laboratórios hospitalares, assinale a alínea VERDADEIRA:',
    correctAnswer: 'Riscos biológicos, físicos, químicos, ergonômicos e mecânicos/acidentais',
    options: ['Riscos biológicos, químicos, físicos, elétricos, acidentais', 'Riscos biológicos, físicos, ergonômicos e eletroquímicos', 'Riscos biológicos, físicos, químicos, ergonômicos e mecânicos/acidentais', 'Riscos eletrônicos e eletromagnéticos apenas'],
    explanation: 'Esta é a classificação clássica de riscos ocupacionais em ambientes de saúde.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_76',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A análise sumária da urina (Urina II) serve para diagnosticar, EXCETO:',
    correctAnswer: 'Enfarte do Miocárdio',
    options: ['Infecção urinária', 'Diabetes', 'Cálculo Renal', 'Enfarte do Miocárdio'],
    explanation: 'O infarto do miocárdio é diagnosticado por ECG e marcadores cardíacos no sangue, não pela urina.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_77',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre a água no organismo humano, assinale a afirmação FALSA:',
    correctAnswer: 'A água não transporta nutrientes e moléculas orgânicas',
    options: ['É o principal solvente facilitando reações químicas', 'A água não transporta nutrientes e moléculas orgânicas', 'É essencial na digestão, absorção e excreção', 'Facilita o funcionamento de rins e intestinos'],
    explanation: 'A água é o principal meio de transporte de nutrientes, gases e resíduos metabólicos no corpo.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_78',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'No diagnóstico de Diabetes, são considerados valores de glicemia em jejum superiores a:',
    correctAnswer: '126 mg/dl',
    options: ['126 mg/dl', '80 mg/dl', '100 mg/dl', '200 mg/dl'],
    explanation: 'Conforme diretrizes internacionais, glicemia de jejum ≥ 126 mg/dl em duas ocasiões confirma diabetes.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_79',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que define a Hipercalcemia?',
    correctAnswer: 'Aumento do cálcio sérico',
    options: ['Aumento do cálcio sérico', 'Aumento do potássio sérico', 'Diminuição do cálcio sérico', 'Diminuição do potássio sérico'],
    explanation: 'Hipercalcemia é o termo técnico para níveis elevados de cálcio no sangue.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_81',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual marcador da hepatite B está associado à replicação viral ativa e alta infectividade?',
    correctAnswer: 'HBeAg',
    options: ['Anti-HBs', 'HBeAg', 'Anti-HBc', 'HBsAg'],
    explanation: 'O HBeAg (antígeno "e") é um marcador de replicação viral intensa e alta capacidade de transmissão.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_82',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Os anticorpos relacionados com a incompatibilidade materno-fetal ABO são do tipo:',
    correctAnswer: 'IgG e IgM',
    options: ['IgA e IgD', 'IgD e IgM', 'IgA e IgG', 'IgG e IgM'],
    explanation: 'Anticorpos naturais do sistema ABO são predominantemente IgM, mas anticorpos imunes IgG podem atravessar a placenta.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_83',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a determinação dos grupos sanguíneos, é correto afirmar:',
    correctAnswer: 'O grupo AB não apresenta aglutininas (anticorpos) no soro',
    options: ['O grupo AB não apresenta aglutininas no soro', 'O grupo A possui aglutininas Anti-A', 'O grupo O possui aglutinogênios A e B nas hemácias', 'O grupo B possui aglutininas Anti-B'],
    explanation: 'Indivíduos AB possuem antígenos A e B nas hemácias, logo não produzem anticorpos contra eles.',
    createdAt: Date.now()
  },
  {
    id: 'ac_h_84',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre descontaminação no laboratório, assinale a afirmação INCORRETA:',
    correctAnswer: 'Qualquer substância deve ser pipetada com a boca',
    options: ['Amostras devem ser consideradas potencialmente contaminadas', 'Material deve ser descontaminado antes do descarte', 'Qualquer substância deve ser pipetada com a boca', 'Perfurocortantes devem ser descartados em coletores próprios'],
    explanation: 'Pipetar com a boca é uma prática proibida e extremamente perigosa em laboratórios.',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_86',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Nas relações do Biomédico com a coletividade, o que NÃO é permitido?',
    correctAnswer: 'Revelar fatos sigilosos inerentes à profissão ou ao diagnóstico',
    options: ['Praticar atos que promovam a saúde pública', 'Recusar assistência por motivos relevantes', 'Prestar serviços a instituições éticas', 'Revelar fatos sigilosos inerentes à profissão ou ao diagnóstico'],
    explanation: 'O sigilo profissional é um dever ético fundamental; sua quebra só é permitida em casos muito específicos previstos em lei.',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_87',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São deveres e obrigações profissionais do Biomédico, EXCETO:',
    correctAnswer: 'Zelar pelo prestígio e mau conceito da profissão',
    options: ['Respeitar as leis e normas do exercício profissional', 'Guardar sigilo profissional', 'Exercer a profissão com zelo e responsabilidade', 'Zelar pelo prestígio e mau conceito da profissão'],
    explanation: 'O profissional deve zelar pelo BOM conceito e prestígio de sua classe, nunca pelo "mau conceito".',
    createdAt: Date.now()
  },
  {
    id: 'cg_e_88',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a ética profissional, assinale a afirmação INCORRETA:',
    correctAnswer: 'Não constitui violação ética comentar casos de pacientes em público no dia de folga',
    options: ['Não constitui violação ética comentar casos de pacientes em público no dia de folga', 'O profissional deve demonstrar respeito por seus colegas', 'O profissional não deve ter preconceitos de raça ou religião', 'O sigilo deve ser mantido mesmo fora do ambiente de trabalho'],
    explanation: 'Comentar casos de pacientes em público, mesmo fora do horário de trabalho, é uma grave violação do sigilo ético.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_91',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem é o atual Presidente da Associação dos Técnicos de Análises Clínicas e Saúde Pública de Angola?',
    correctAnswer: 'José Bartolomeu Paulo Luvualo',
    options: ['Manuel Simão', 'Castigo Levita', 'José Bartolomeu Paulo Luvualo', 'Silvia Lutucuta'],
    explanation: 'José Bartolomeu Paulo Luvualo lidera a associação que representa os profissionais da área.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_92',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Fazem parte dos países da CPLP os seguintes, EXCETO:',
    correctAnswer: 'Guiné Conacri',
    options: ['Brasil', 'Angola', 'Guiné Conacri', 'Cabo Verde'],
    explanation: 'Guiné Conacri é um país de língua francesa. A Guiné-Bissau e a Guiné Equatorial é que fazem parte da CPLP.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_93',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'A Palanca Negra Gigante é um antílope encontrado exclusivamente na província de:',
    correctAnswer: 'Malanje',
    options: ['Bié', 'Lunda-Sul', 'Bengo', 'Malanje'],
    explanation: 'A Palanca Negra Gigante é um símbolo nacional e habita a Reserva Natural Integral de Luando, em Malanje.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_94',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem ocupa o cargo de Vice-Presidente da Assembleia Nacional de Angola?',
    correctAnswer: 'Emília Carlota Dias',
    options: ['Ana Dias Lourenço', 'Emília Carlota Dias', 'Joana Lina', 'Antonieta Baptista'],
    explanation: 'Emília Carlota Dias é uma das figuras de destaque na liderança do parlamento angolano.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_95',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'A atual Ministra da Saúde da República de Angola é professora e médica. Qual o seu nome?',
    correctAnswer: 'Sílvia Lutucuta',
    options: ['Ângela Bragança', 'Maria Cândida Narciso', 'Filomena Delgado', 'Sílvia Lutucuta'],
    explanation: 'Sílvia Lutucuta é médica cardiologista e tem liderado o setor da saúde em Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_96',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'A Serra da Leba, famosa por suas curvas sinuosas, está localizada na província da:',
    correctAnswer: 'Huíla',
    options: ['Namibe', 'Huíla', 'Moxico', 'Cunene'],
    explanation: 'A Serra da Leba liga as províncias da Huíla e do Namibe, situando-se geograficamente na Huíla.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_97',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual localidade angolana é considerada pela UNESCO como Patrimônio da Humanidade?',
    correctAnswer: 'Mbanza Kongo (Zaire)',
    options: ['Bengo', 'Mbanza Kongo (Zaire)', 'Huíla', 'Cabinda'],
    explanation: 'Mbanza Kongo, a antiga capital do Reino do Congo, foi inscrita na lista da UNESCO em 2017.',
    createdAt: Date.now()
  },
  {
    id: 'cg_c_98',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'De acordo com o código de ética, qual destas NÃO é uma penalização aplicada a infratores?',
    correctAnswer: 'Benevolência',
    options: ['Advertência', 'Repreensão', 'Benevolência', 'Suspensão do exercício profissional'],
    explanation: 'Benevolência significa bondade e não é uma sanção disciplinar prevista em códigos de ética.',
    createdAt: Date.now()
  },
  {
    id: 'enf21',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Assepsia" no ambiente hospitalar?',
    correctAnswer: 'Conjunto de medidas para impedir a entrada de microrganismos em local isento deles',
    options: ['Desinfecção de tecidos vivos', 'Conjunto de medidas para impedir a entrada de microrganismos em local isento deles', 'Uso de antibióticos preventivos', 'Lavagem de roupas cirúrgicas apenas'],
    explanation: 'Assepsia foca em manter a esterilidade de um ambiente ou objeto, evitando a contaminação.',
    createdAt: Date.now()
  },
  {
    id: 'enf22',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A "Antissepsia" refere-se a:',
    correctAnswer: 'Desinfecção de tecidos vivos com antissépticos',
    options: ['Limpeza de superfícies inertes', 'Esterilização em autoclave', 'Desinfecção de tecidos vivos com antissépticos', 'Uso de luvas de procedimento'],
    explanation: 'Antissepsia é o uso de substâncias químicas em tecidos vivos para reduzir a carga microbiana.',
    createdAt: Date.now()
  },
  {
    id: 'cg35',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o sistema político que defende a abolição da propriedade privada e das classes sociais?',
    correctAnswer: 'Comunismo',
    options: ['Capitalismo', 'Fascismo', 'Comunismo', 'Liberalismo'],
    explanation: 'O comunismo busca uma sociedade sem classes e com propriedade comum dos meios de produção.',
    createdAt: Date.now()
  },
  {
    id: 'cg36',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem foi o navegador português que chegou à foz do Rio Zaire em 1482?',
    correctAnswer: 'Diogo Cão',
    options: ['Vasco da Gama', 'Diogo Cão', 'Pedro Álvares Cabral', 'Bartolomeu Dias'],
    explanation: 'Diogo Cão foi o primeiro europeu a explorar a costa de Angola e a foz do Rio Zaire.',
    createdAt: Date.now()
  },
  {
    id: 'cg37',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem é a actual Vice-Presidente da República de Angola (eleita em 2022)?',
    correctAnswer: 'Esperança da Costa',
    options: ['Bornito de Sousa', 'Esperança da Costa', 'Carolina Cerqueira', 'Ana Dias Lourenço'],
    explanation: 'Esperança da Costa é a primeira mulher a ocupar o cargo de Vice-Presidente em Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg38',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem exerce actualmente o cargo de Presidente da Assembleia Nacional de Angola?',
    correctAnswer: 'Carolina Cerqueira',
    options: ['Fernando da Piedade Dias dos Santos', 'Carolina Cerqueira', 'Adalberto Costa Júnior', 'Abel Chivukuvuku'],
    explanation: 'Carolina Cerqueira foi eleita Presidente da Assembleia Nacional após as eleições de 2022.',
    createdAt: Date.now()
  },
  {
    id: 'cg39',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Em que ano João Lourenço assumiu o seu primeiro mandato como Presidente da República?',
    correctAnswer: '2017',
    options: ['2012', '2017', '2022', '2015'],
    explanation: 'João Lourenço foi eleito pela primeira vez em 2017, sucedendo a José Eduardo dos Santos.',
    createdAt: Date.now()
  },
  {
    id: 'cg41',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que se comemora em Angola no dia 4 de Abril?',
    correctAnswer: 'Dia da Paz e da Reconciliação Nacional',
    options: ['Dia da Independência', 'Dia da Paz e da Reconciliação Nacional', 'Dia do Herói Nacional', 'Dia da Mulher Angolana'],
    explanation: 'O dia 4 de abril marca a assinatura do Memorando de Entendimento de Luena em 2002, pondo fim à guerra civil.',
    createdAt: Date.now()
  },
  {
    id: 'cg42',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O dia 17 de Setembro é feriado nacional em Angola em honra a:',
    correctAnswer: 'António Agostinho Neto (Dia do Herói Nacional)',
    options: ['José Eduardo dos Santos', 'Holden Roberto', 'António Agostinho Neto (Dia do Herói Nacional)', 'Jonas Savimbi'],
    explanation: 'Celebra-se o nascimento do primeiro presidente de Angola, o Dr. António Agostinho Neto.',
    createdAt: Date.now()
  },
  {
    id: 'cg43',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a data em que se celebra o Dia da Mulher Angolana?',
    correctAnswer: '2 de Março',
    options: ['8 de Março', '2 de Março', '31 de Julho', '25 de Setembro'],
    explanation: 'O dia 2 de março homenageia a contribuição das mulheres na luta de libertação nacional.',
    createdAt: Date.now()
  },
  {
    id: 'cg44',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O dia 4 de Fevereiro de 1961 marca o início de quê?',
    correctAnswer: 'Luta Armada de Libertação Nacional',
    options: ['Independência de Angola', 'Luta Armada de Libertação Nacional', 'Acordos de Alvor', 'Fundação do MPLA'],
    explanation: 'Nesta data, patriotas angolanos atacaram as prisões de Luanda, iniciando a luta contra o colonialismo português.',
    createdAt: Date.now()
  },
  {
    id: 'cg46',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual foi o último país a tornar-se membro de pleno direito da CPLP (em 2014)?',
    correctAnswer: 'Guiné Equatorial',
    options: ['Timor-Leste', 'Guiné Equatorial', 'Maurícia', 'Senegal'],
    explanation: 'A Guiné Equatorial foi admitida como o nono Estado-membro da CPLP na Cimeira de Díli em 2014.',
    createdAt: Date.now()
  },
  {
    id: 'cg47',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual país assumiu a presidência rotativa da SADC na 44ª Cimeira realizada em Agosto de 2024?',
    correctAnswer: 'Zimbabué',
    options: ['Angola', 'Zimbabué', 'Namíbia', 'Botswana'],
    explanation: 'O Zimbabué assumiu a presidência da SADC em Agosto de 2024, sucedendo a Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg49',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o rio mais longo de Angola?',
    correctAnswer: 'Rio Kwanza',
    options: ['Rio Cunene', 'Rio Kwanza', 'Rio Cubango', 'Rio Zaire'],
    explanation: 'O Rio Kwanza é o maior rio inteiramente angolano e dá nome à moeda nacional.',
    createdAt: Date.now()
  },
  {
    id: 'cg50',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em que ano Angola foi admitida como membro da Organização das Nações Unidas (ONU)?',
    correctAnswer: '1976',
    options: ['1975', '1976', '1980', '2002'],
    explanation: 'Angola tornou-se o 146º membro da ONU em 1 de Dezembro de 1976.',
    createdAt: Date.now()
  },
  {
    id: 'cg52',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a principal reserva de animais selvagens localizada na província do Cuando Cubango?',
    correctAnswer: 'Parque Nacional de Luengue-Luiana',
    options: ['Parque da Kissama', 'Parque de Cangandala', 'Parque Nacional de Luengue-Luiana', 'Parque do Iona'],
    explanation: 'Luengue-Luiana é um dos maiores parques nacionais de Angola, parte da iniciativa KAZA.',
    createdAt: Date.now()
  },
  {
    id: 'cg54',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome da planta endémica do deserto do Namibe que pode viver mais de mil anos?',
    correctAnswer: 'Welwitschia mirabilis',
    options: ['Imbondeiro', 'Welwitschia mirabilis', 'Palmeira Real', 'Acácia Rubra'],
    explanation: 'A Welwitschia mirabilis é um "fóssil vivo" único do deserto do Namibe.',
    createdAt: Date.now()
  },
  {
    id: 'cg56',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual província angolana é conhecida como a "Terra da Felicidade"?',
    correctAnswer: 'Huambo',
    options: ['Huíla', 'Huambo', 'Bié', 'Malanje'],
    explanation: 'A cidade do Huambo foi historicamente apelidada de Nova Lisboa e é o coração do planalto central.',
    createdAt: Date.now()
  },
  {
    id: 'cg57',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Em que data foi assinado o Protocolo de Lusaka?',
    correctAnswer: '20 de Novembro de 1994',
    options: ['31 de Maio de 1991', '20 de Novembro de 1994', '4 de Abril de 2002', '11 de Novembro de 1975'],
    explanation: 'O Protocolo de Lusaka foi uma tentativa de paz entre o Governo e a UNITA na Zâmbia.',
    createdAt: Date.now()
  },
  {
    id: 'cg58',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o principal porto comercial de Angola?',
    correctAnswer: 'Porto de Luanda',
    options: ['Porto do Lobito', 'Porto de Namibe', 'Porto de Luanda', 'Porto de Cabinda'],
    explanation: 'O Porto de Luanda é a principal porta de entrada de mercadorias no país.',
    createdAt: Date.now()
  },
  {
    id: 'cg59',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o animal símbolo da fauna angolana, presente na cauda dos aviões da TAAG?',
    correctAnswer: 'Palanca Negra Gigante',
    options: ['Leão', 'Elefante', 'Palanca Negra Gigante', 'Girafa'],
    explanation: 'A Palanca Negra Gigante é um antílope raro que só existe em Angola (Malanje).',
    createdAt: Date.now()
  },
  {
    id: 'cg60',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a língua nacional mais falada em Angola?',
    correctAnswer: 'Umbundu',
    options: ['Kimbundu', 'Umbundu', 'Kikongo', 'Cokwe'],
    explanation: 'O Umbundu é a língua nacional com maior número de falantes nativos no país.',
    createdAt: Date.now()
  },
  {
    id: 'cg61',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província angolana que faz fronteira exclusiva com a República Democrática do Congo e o Oceano Atlântico, sendo um enclave?',
    correctAnswer: 'Cabinda',
    options: ['Zaire', 'Lunda Norte', 'Cabinda', 'Uíge'],
    explanation: 'Cabinda é uma província descontínua do resto do território angolano.',
    createdAt: Date.now()
  },
  {
    id: 'cg62',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Quem foi o primeiro Presidente de Angola?',
    correctAnswer: 'António Agostinho Neto',
    options: ['José Eduardo dos Santos', 'António Agostinho Neto', 'Holden Roberto', 'Jonas Savimbi'],
    explanation: 'Dr. António Agostinho Neto proclamou a independência e foi o primeiro chefe de estado.',
    createdAt: Date.now()
  },
  {
    id: 'cg64',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a maior queda de água de Angola?',
    correctAnswer: 'Quedas de Kalandula',
    options: ['Quedas do Ruacaná', 'Quedas de Kalandula', 'Quedas do Binga', 'Quedas do Musselele'],
    explanation: 'As Quedas de Kalandula, em Malanje, são as maiores do país e uma das maiores de África.',
    createdAt: Date.now()
  },
  {
    id: 'cg65',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a capital da província da Huíla?',
    correctAnswer: 'Lubango',
    options: ['Namibe', 'Lubango', 'Menongue', 'Caxito'],
    explanation: 'Lubango é a capital da Huíla, famosa pela Serra da Leba e pelo Cristo Rei.',
    createdAt: Date.now()
  },
  {
    id: 'cg66',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome do deserto que se estende pelo sul de Angola?',
    correctAnswer: 'Deserto do Namibe',
    options: ['Deserto do Saara', 'Deserto do Kalahari', 'Deserto do Namibe', 'Deserto de Atacama'],
    explanation: 'O Deserto do Namibe é um dos mais antigos do mundo e situa-se no sudoeste de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg67',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a principal riqueza mineral exportada por Angola depois do petróleo?',
    correctAnswer: 'Diamantes',
    options: ['Ouro', 'Ferro', 'Diamantes', 'Cobre'],
    explanation: 'Angola é um dos maiores produtores mundiais de diamantes, especialmente nas Lundas.',
    createdAt: Date.now()
  },
  {
    id: 'cg68',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome da barragem hidroeléctrica mais potente de Angola?',
    correctAnswer: 'Barragem de Laúca',
    options: ['Barragem de Capanda', 'Barragem de Cambambe', 'Barragem de Laúca', 'Barragem do Gove'],
    explanation: 'Laúca é a maior central hidroeléctrica do país, localizada no Rio Kwanza.',
    createdAt: Date.now()
  },
  {
    id: 'cg69',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a cor da estrela presente na bandeira nacional de Angola?',
    correctAnswer: 'Amarela',
    options: ['Branca', 'Vermelha', 'Amarela', 'Preta'],
    explanation: 'A estrela amarela simboliza a solidariedade internacional e o progresso.',
    createdAt: Date.now()
  },
  {
    id: 'cg71',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província conhecida como o "Celeiro de Angola"?',
    correctAnswer: 'Huambo',
    options: ['Bié', 'Huambo', 'Uíge', 'Cuanza Sul'],
    explanation: 'Devido à sua fertilidade e tradição agrícola, o Huambo é historicamente chamado de celeiro do país.',
    createdAt: Date.now()
  },
  {
    id: 'cg72',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o oceano que banha a costa de Angola?',
    correctAnswer: 'Oceano Atlântico',
    options: ['Oceano Índico', 'Oceano Pacífico', 'Oceano Atlântico', 'Oceano Glacial'],
    explanation: 'Angola possui uma extensa costa banhada pelo Oceano Atlântico a oeste.',
    createdAt: Date.now()
  },
  {
    id: 'cg73',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a árvore nacional de Angola?',
    correctAnswer: 'Imbondeiro',
    options: ['Acácia', 'Imbondeiro', 'Palmeira', 'Eucalipto'],
    explanation: 'O Imbondeiro (Baobá) é uma árvore sagrada e símbolo de resistência em Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg74',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em que ano foi assinado o Acordo de Alvor?',
    correctAnswer: '1975',
    options: ['1974', '1975', '1976', '1991'],
    explanation: 'O Acordo de Alvor estabeleceu os parâmetros para a independência de Angola em Janeiro de 1975.',
    createdAt: Date.now()
  },
  {
    id: 'cg75',
    category: 'Cultura Geral',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual é o nome do primeiro romance escrito por um angolano (José da Silva Maia Ferreira) em 1849?',
    correctAnswer: 'Espontaneidades da Minha Alma',
    options: ['Terra Morta', 'Espontaneidades da Minha Alma', 'Mayombe', 'A Geração da Utopia'],
    explanation: 'É considerada a primeira obra literária publicada por um autor angolano.',
    createdAt: Date.now()
  },
  {
    id: 'cg76',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província onde se localiza a famosa Fenda da Tundavala?',
    correctAnswer: 'Huíla',
    options: ['Namibe', 'Huíla', 'Benguela', 'Cuanza Sul'],
    explanation: 'A Tundavala é um enorme abismo na Serra da Chela, perto do Lubango.',
    createdAt: Date.now()
  },
  {
    id: 'cg77',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a cor que simboliza o sangue derramado pelos angolanos na bandeira nacional?',
    correctAnswer: 'Vermelho',
    options: ['Preto', 'Vermelho', 'Amarelo', 'Azul'],
    explanation: 'A metade superior vermelha da bandeira representa o sangue vertido durante a opressão colonial e a luta de libertação.',
    createdAt: Date.now()
  },
  {
    id: 'cg78',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a principal festa cultural da província da Huíla que se celebra em Agosto?',
    correctAnswer: 'Festas da Nossa Senhora do Monte',
    options: ['Carnaval da Vitória', 'Festas do Mar', 'Festas da Nossa Senhora do Monte', 'Festas do Sumbe'],
    explanation: 'As festas da Senhora do Monte atraem milhares de visitantes ao Lubango anualmente.',
    createdAt: Date.now()
  },
  {
    id: 'cg79',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quem é o autor da famosa obra "Mayombe"?',
    correctAnswer: 'Pepetela',
    options: ['José Luandino Vieira', 'Pepetela', 'Agostinho Neto', 'Ondjaki'],
    explanation: 'Pepetela (Artur Carlos Maurício Pestana dos Santos) escreveu Mayombe durante a luta de libertação.',
    createdAt: Date.now()
  },
  {
    id: 'cg80',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a capital da província de Benguela?',
    correctAnswer: 'Benguela',
    options: ['Lobito', 'Benguela', 'Baía Farta', 'Catumbela'],
    explanation: 'A cidade de Benguela é a capital da província, embora o Lobito seja o principal centro económico.',
    createdAt: Date.now()
  },
  {
    id: 'cg81',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome do estádio nacional localizado em Luanda, construído para o CAN 2010?',
    correctAnswer: 'Estádio 11 de Novembro',
    options: ['Estádio da Cidadela', 'Estádio dos Coqueiros', 'Estádio 11 de Novembro', 'Estádio de Ombaka'],
    explanation: 'O Estádio 11 de Novembro é o maior estádio de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg82',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província angolana com maior produção de café?',
    correctAnswer: 'Uíge',
    options: ['Cuanza Norte', 'Uíge', 'Cuanza Sul', 'Bengo'],
    explanation: 'O Uíge é historicamente a capital do café em Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg83',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o prefixo telefónico internacional de Angola?',
    correctAnswer: '+244',
    options: ['+234', '+244', '+254', '+258'],
    explanation: 'O código de país para chamadas internacionais para Angola é 244.',
    createdAt: Date.now()
  },
  {
    id: 'cg84',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome da serra famosa pelas suas curvas sinuosas na província da Huíla?',
    correctAnswer: 'Serra da Leba',
    options: ['Serra da Chela', 'Serra da Leba', 'Serra do Lundungo', 'Serra da Neve'],
    explanation: 'A estrada da Serra da Leba é um dos postais ilustrados mais famosos de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg85',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a principal religião praticada em Angola?',
    correctAnswer: 'Cristianismo',
    options: ['Islamismo', 'Cristianismo', 'Animismo', 'Budismo'],
    explanation: 'A maioria da população angolana identifica-se como cristã (católicos e protestantes).',
    createdAt: Date.now()
  },
  {
    id: 'cg86',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o nome da ilha localizada em frente à cidade de Luanda, famosa pela sua gastronomia?',
    correctAnswer: 'Ilha do Cabo',
    options: ['Ilha do Mussulo', 'Ilha do Cabo', 'Ilha de Luanda', 'Ilha de Cazanga'],
    explanation: 'A Ilha do Cabo (ou Ilha de Luanda) é um cordão litoral com praias e restaurantes.',
    createdAt: Date.now()
  },
  {
    id: 'cg87',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome do actual Governador da Província de Luanda (em 2024)?',
    correctAnswer: 'Manuel Homem',
    options: ['Bento Bento', 'Manuel Homem', 'Joana Lina', 'Graciano Domingos'],
    explanation: 'Manuel Homem exerce actualmente o cargo de Governador de Luanda.',
    createdAt: Date.now()
  },
  {
    id: 'cg88',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província angolana onde se localiza o Parque Nacional do Iona?',
    correctAnswer: 'Namibe',
    options: ['Cunene', 'Namibe', 'Benguela', 'Huíla'],
    explanation: 'O Parque Nacional do Iona localiza-se no extremo sudoeste de Angola, no Namibe.',
    createdAt: Date.now()
  },
  {
    id: 'cg89',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a cor que representa o continente africano na bandeira de Angola?',
    correctAnswer: 'Preto',
    options: ['Vermelho', 'Amarelo', 'Preto', 'Verde'],
    explanation: 'A metade inferior preta da bandeira representa o continente africano.',
    createdAt: Date.now()
  },
  {
    id: 'cg90',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome da organização que reúne os países de língua oficial portuguesa?',
    correctAnswer: 'CPLP',
    options: ['PALOP', 'CPLP', 'SADC', 'UA'],
    explanation: 'A Comunidade dos Países de Língua Portuguesa (CPLP) foi fundada em 1996.',
    createdAt: Date.now()
  },
  {
    id: 'cg91',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a principal exportação de Angola?',
    correctAnswer: 'Petróleo',
    options: ['Diamantes', 'Café', 'Petróleo', 'Gás Natural'],
    explanation: 'O petróleo bruto é a principal fonte de receitas e exportações de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg92',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o nome da companhia aérea de bandeira de Angola?',
    correctAnswer: 'TAAG',
    options: ['Fly Angola', 'TAAG', 'SonAir', 'Air Connection'],
    explanation: 'TAAG - Linhas Aéreas de Angola é a transportadora nacional.',
    createdAt: Date.now()
  },
  {
    id: 'cg93',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome do rio que faz fronteira natural entre Angola e a Namíbia a sul?',
    correctAnswer: 'Rio Cunene',
    options: ['Rio Kwanza', 'Rio Cubango', 'Rio Cunene', 'Rio Zaire'],
    explanation: 'O Rio Cunene define grande parte da fronteira sul de Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg94',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província angolana onde se localiza a Serra da Chela?',
    correctAnswer: 'Huíla',
    options: ['Namibe', 'Huíla', 'Cunene', 'Benguela'],
    explanation: 'A Serra da Chela é um grande escarpamento que separa o planalto da Huíla do deserto do Namibe.',
    createdAt: Date.now()
  },
  {
    id: 'cg95',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a capital da província do Zaire?',
    correctAnswer: 'Mbanza Kongo',
    options: ['Soyo', 'Mbanza Kongo', 'Uíge', 'Cabinda'],
    explanation: 'Mbanza Kongo é a capital do Zaire e Património Mundial da UNESCO.',
    createdAt: Date.now()
  },
  {
    id: 'cg97',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província angolana com maior extensão territorial?',
    correctAnswer: 'Cuando Cubango',
    options: ['Moxico', 'Cuando Cubango', 'Lunda Sul', 'Malanje'],
    explanation: 'O Moxico é a maior província em área, mas o Cuando Cubango é frequentemente citado pela sua vasta extensão e baixa densidade.',
    createdAt: Date.now()
  },
  {
    id: 'cg98',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a capital da província do Moxico?',
    correctAnswer: 'Luena',
    options: ['Saurimo', 'Luena', 'Menongue', 'Cuito'],
    explanation: 'Luena é a capital da maior província de Angola em termos de área.',
    createdAt: Date.now()
  },
  {
    id: 'cg99',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome do festival de música e dança tradicional que se realiza anualmente na província da Lunda Sul?',
    correctAnswer: 'Festival de Música e Dança da Lunda Sul',
    options: ['Festival do Sumbe', 'Festival de Música e Dança da Lunda Sul', 'I Love Angola', 'Unitel Festa da Música'],
    explanation: 'A cultura Cokwe é celebrada intensamente na região leste.',
    createdAt: Date.now()
  },
  {
    id: 'cg100',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a província angolana onde se localiza o Miradouro da Lua?',
    correctAnswer: 'Luanda',
    options: ['Bengo', 'Luanda', 'Cuanza Sul', 'Namibe'],
    explanation: 'O Miradouro da Lua localiza-se a sul de Luanda, no município da Belas.',
    createdAt: Date.now()
  },
  {
    id: 'enf23',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo técnico para a presença de pus na urina?',
    correctAnswer: 'Piúria',
    options: ['Hematúria', 'Piúria', 'Glicosúria', 'Proteinúria'],
    explanation: 'Piúria indica a presença de leucócitos (pus) na urina, geralmente sinal de infecção urinária.',
    createdAt: Date.now()
  },
  {
    id: 'cg37',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o maior país do mundo em extensão territorial?',
    correctAnswer: 'Rússia',
    options: ['Canadá', 'China', 'Rússia', 'EUA'],
    explanation: 'A Rússia é o maior país do planeta, abrangendo parte da Europa e da Ásia.',
    createdAt: Date.now()
  },

  // --- LOTE MASSIVO DE ENFERMAGEM (MANUAIS E PROVAS) ---
  {
    id: 'enf24',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao presenciar um indivíduo engasgado, consciente e tossindo?',
    correctAnswer: 'Estimular a tosse e observar',
    options: ['Realizar manobra de Heimlich imediatamente', 'Estimular a tosse e observar', 'Dar pancadas nas costas', 'Oferecer água'],
    explanation: 'Se o paciente consegue tossir, a obstrução é parcial. Deve-se apenas estimular a tosse.',
    createdAt: Date.now()
  },
  {
    id: 'enf25',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a dosagem correta de Dipirona para uma criança de 24 kg, considerando a regra de 1 gota por kg?',
    correctAnswer: '24 gotas',
    options: ['12 gotas', '24 gotas', '48 gotas', '1.2 ml'],
    explanation: 'A prescrição padrão de dipirona em gotas para crianças costuma seguir a relação de 1 gota por quilograma de peso.',
    createdAt: Date.now()
  },
  {
    id: 'enf26',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Foi prescrito 150mg de ampicilina. O frasco disponível é de 1g para diluir em 10ml. Quantos ml devem ser aspirados?',
    correctAnswer: '1,5 ml',
    options: ['0,5 ml', '1 ml', '1,5 ml', '2,5 ml'],
    explanation: 'Cálculo: (150mg * 10ml) / 1000mg = 1,5ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf27',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quais são os sinais clássicos da Diabetes Tipo 1?',
    correctAnswer: 'Polifagia, polidipsia, poliúria e perda de peso',
    options: ['Febre e tosse', 'Polifagia, polidipsia, poliúria e perda de peso', 'Hipertensão e edema', 'Cefaleia e tontura'],
    explanation: 'Os "4 Ps" (Polifagia, Polidipsia, Poliúria e Perda de peso) são os sintomas cardinais da hiperglicemia severa.',
    createdAt: Date.now()
  },
  {
    id: 'enf28',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que deve ser oferecido a um paciente queimado e consciente na fase imediata?',
    correctAnswer: 'Água em grande quantidade (se não houver contraindicação)',
    options: ['Refeição pesada', 'Bebida alcoólica', 'Água em grande quantidade (se não houver contraindicação)', 'Apenas gelo na boca'],
    explanation: 'A hidratação oral é fundamental para repor perdas volêmicas em queimados conscientes sem lesão digestiva.',
    createdAt: Date.now()
  },
  {
    id: 'enf29',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Na Ressuscitação Cardiopulmonar (RCP) em adultos, qual a recomendação correta para compressões?',
    correctAnswer: 'Minimizar as interrupções nas compressões',
    options: ['Realizar compressões lentas', 'Minimizar as interrupções nas compressões', 'Interromper para checar pulso a cada minuto', 'Comprimir apenas 2 cm de profundidade'],
    explanation: 'A alta qualidade da RCP exige compressões contínuas e profundas, com o mínimo de interrupções possível.',
    createdAt: Date.now()
  },
  {
    id: 'enf30',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual vacina é obrigatoriamente administrada ao recém-nascido para prevenir a Tuberculose?',
    correctAnswer: 'BCG',
    options: ['Pentavalente', 'VOP', 'BCG', 'Hepatite B'],
    explanation: 'A vacina BCG (Bacilo Calmette-Guérin) protege contra as formas graves de tuberculose e deve ser dada ao nascer.',
    createdAt: Date.now()
  },
  {
    id: 'enf31',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo técnico para a inflamação da língua?',
    correctAnswer: 'Glossite',
    options: ['Estomatite', 'Gengivite', 'Glossite', 'Rinite'],
    explanation: 'Glossite é o termo médico específico para a inflamação da língua.',
    createdAt: Date.now()
  },
  {
    id: 'enf32',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A escala de Apgar é utilizada para avaliar o quê?',
    correctAnswer: 'A adaptação do recém-nascido ao mundo extrauterino',
    options: ['O nível de consciência do adulto', 'O risco de quedas', 'A adaptação do recém-nascido ao mundo extrauterino', 'A profundidade de queimaduras'],
    explanation: 'O Apgar avalia frequência cardíaca, respiração, tônus, irritabilidade e cor no 1º e 5º minutos de vida.',
    createdAt: Date.now()
  },
  {
    id: 'enf33',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão do vírus HIV no ambiente hospitalar para profissionais?',
    correctAnswer: 'Sangue (através de acidentes perfurocortantes)',
    options: ['Ar', 'Saliva', 'Sangue (através de acidentes perfurocortantes)', 'Suor'],
    explanation: 'O contato com sangue contaminado via agulhas ou lâminas é o maior risco ocupacional para HIV.',
    createdAt: Date.now()
  },
  {
    id: 'enf34',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que define a "Sistematização da Assistência de Enfermagem" (SAE)?',
    correctAnswer: 'Um processo sistemático e organizado de prestação de cuidados',
    options: ['Apenas o registro no prontuário', 'Um processo sistemático e organizado de prestação de cuidados', 'A limpeza da unidade do paciente', 'A hierarquia entre enfermeiros'],
    explanation: 'A SAE organiza o trabalho profissional quanto ao método, pessoal e instrumentos.',
    createdAt: Date.now()
  },
  {
    id: 'enf35',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a profundidade recomendada para compressões torácicas em adultos durante a RCP?',
    correctAnswer: 'Pelo menos 5 cm (mas não mais que 6 cm)',
    options: ['2 a 3 cm', 'Pelo menos 5 cm (mas não mais que 6 cm)', '7 a 8 cm', 'O máximo possível'],
    explanation: 'Compressões eficazes devem ter profundidade suficiente para ejetar o sangue do coração.',
    createdAt: Date.now()
  },
  {
    id: 'enf36',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o tempo de permanência recomendado para uma sonda nasogástrica de silicone?',
    correctAnswer: 'Até 3 meses',
    options: ['7 dias', '15 dias', '30 dias', 'Até 3 meses'],
    explanation: 'Sondas de silicone são mais duráveis e biocompatíveis, podendo permanecer por períodos longos.',
    createdAt: Date.now()
  },
  {
    id: 'enf37',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo técnico para a dificuldade de respirar em posição deitada?',
    correctAnswer: 'Ortopneia',
    options: ['Dispneia', 'Apneia', 'Ortopneia', 'Taquipneia'],
    explanation: 'Ortopneia é a dispneia que melhora quando o paciente se senta ou fica de pé.',
    createdAt: Date.now()
  },
  {
    id: 'enf38',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a cor utilizada no prontuário para registrar a temperatura do paciente?',
    correctAnswer: 'Vermelha',
    options: ['Azul', 'Preta', 'Verde', 'Vermelha'],
    explanation: 'Tradicionalmente, a curva térmica é desenhada com caneta vermelha no gráfico de sinais vitais.',
    createdAt: Date.now()
  },
  {
    id: 'enf39',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza uma ferida "Limpa-Contaminada"?',
    correctAnswer: 'Ferida cirúrgica em tecidos com flora bacteriana normal, mas sob controle',
    options: ['Ferida com pus evidente', 'Ferida acidental suja', 'Ferida cirúrgica em tecidos com flora bacteriana normal, mas sob controle', 'Ferida isenta de microrganismos'],
    explanation: 'São cirurgias em tratos (digestivo, respiratório, urinário) que possuem flora própria, mas sem infecção prévia.',
    createdAt: Date.now()
  },
  {
    id: 'enf40',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a principal complicação imediata da hemodiálise relacionada ao uso de anticoagulantes?',
    correctAnswer: 'Hemorragia',
    options: ['Febre', 'Hemorragia', 'Hipertensão', 'Cãibras'],
    explanation: 'O uso de heparina durante a sessão aumenta significativamente o risco de sangramentos.',
    createdAt: Date.now()
  },
  {
    id: 'enf41',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que são cuidados paliativos?',
    correctAnswer: 'Cuidados para melhorar a qualidade de vida de pacientes com doenças terminais',
    options: ['Cuidados para curar doenças raras', 'Cuidados para melhorar a qualidade de vida de pacientes com doenças terminais', 'Cuidados apenas para idosos', 'Cuidados realizados apenas em casa'],
    explanation: 'Cuidados paliativos focam no alívio do sofrimento e na qualidade de vida, não na cura.',
    createdAt: Date.now()
  },
  {
    id: 'enf42',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a primeira etapa do Processo de Enfermagem?',
    correctAnswer: 'Investigação (Coleta de Dados)',
    options: ['Diagnóstico', 'Planejamento', 'Implementação', 'Investigação (Coleta de Dados)'],
    explanation: 'A coleta de dados (anamnese e exame físico) é a base para todas as outras etapas.',
    createdAt: Date.now()
  },
  {
    id: 'enf43',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O diagnóstico de enfermagem é baseado em quê?',
    correctAnswer: 'Nas respostas humanas a problemas de saúde ou processos vitais',
    options: ['Apenas em exames laboratoriais', 'Nas respostas humanas a problemas de saúde ou processos vitais', 'Na prescrição médica', 'Na vontade do paciente'],
    explanation: 'Diferente do diagnóstico médico, o de enfermagem foca em como o paciente reage à sua condição.',
    createdAt: Date.now()
  },
  {
    id: 'enf44',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a sequência correta do exame físico?',
    correctAnswer: 'Inspeção, Palpação, Percussão e Ausculta',
    options: ['Ausculta, Inspeção, Palpação, Percussão', 'Inspeção, Palpação, Percussão e Ausculta', 'Palpação, Inspeção, Ausculta, Percussão', 'Percussão, Ausculta, Inspeção, Palpação'],
    explanation: 'Esta é a ordem lógica para não interferir nos achados (exceto no abdome, onde a ausculta vem antes da palpação).',
    createdAt: Date.now()
  },
  {
    id: 'enf45',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração da vacina contra o Sarampo?',
    correctAnswer: 'Subcutânea',
    options: ['Intramuscular', 'Subcutânea', 'Intradérmica', 'Oral'],
    explanation: 'A vacina tríplice viral (sarampo, caxumba e rubéola) é administrada por via subcutânea.',
    createdAt: Date.now()
  },
  {
    id: 'enf46',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza o "Choque Hipovolêmico"?',
    correctAnswer: 'Perda excessiva de líquidos ou sangue',
    options: ['Reação alérgica grave', 'Falha súbita do coração', 'Perda excessiva de líquidos ou sangue', 'Infecção generalizada'],
    explanation: 'A redução do volume intravascular impede a perfusão adequada dos tecidos.',
    createdAt: Date.now()
  },
  {
    id: 'enf47',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal cuidado com o coto umbilical do recém-nascido?',
    correctAnswer: 'Limpeza com álcool a 70% a cada troca de fralda',
    options: ['Cobrir com faixa apertada', 'Limpeza com álcool a 70% a cada troca de fralda', 'Aplicar pomadas cicatrizantes', 'Não molhar durante o banho'],
    explanation: 'O álcool a 70% promove a desidratação e assepsia do coto, prevenindo infecções.',
    createdAt: Date.now()
  },
  {
    id: 'enf48',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o valor de glicemia capilar que define hipoglicemia no recém-nascido?',
    correctAnswer: 'Abaixo de 40 mg/dL',
    options: ['Abaixo de 70 mg/dL', 'Abaixo de 60 mg/dL', 'Abaixo de 40 mg/dL', 'Abaixo de 20 mg/dL'],
    explanation: 'Valores abaixo de 40 mg/dL em RNs exigem intervenção imediata para evitar danos neurológicos.',
    createdAt: Date.now()
  },
  {
    id: 'enf49',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o Partograma?',
    correctAnswer: 'Representação gráfica da evolução do trabalho de parto',
    options: ['Um exame de sangue da gestante', 'Representação gráfica da evolução do trabalho de parto', 'O registro das vacinas da criança', 'Um tipo de ultrassonografia'],
    explanation: 'O partograma permite monitorar a dilatação cervical e a descida da apresentação fetal ao longo do tempo.',
    createdAt: Date.now()
  },
  {
    id: 'enf50',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal recomendação para uma paciente mastectomizada no braço do lado da cirurgia?',
    correctAnswer: 'Não verificar pressão arterial nem puncionar veias',
    options: ['Fazer exercícios pesados', 'Não verificar pressão arterial nem puncionar veias', 'Manter o braço sempre abaixado', 'Usar roupas apertadas'],
    explanation: 'Isso evita o linfedema, devido à retirada dos linfonodos axilares durante a cirurgia.',
    createdAt: Date.now()
  },
  {
    id: 'enf51',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o Consentimento Livre e Esclarecido?',
    correctAnswer: 'A autorização do paciente após receber informações sobre o procedimento',
    options: ['A assinatura do médico apenas', 'A autorização do paciente após receber informações sobre o procedimento', 'Uma regra apenas para cirurgias', 'A vontade da família sobre o paciente'],
    explanation: 'É um direito do paciente e um dever ético do profissional informar riscos e benefícios antes de qualquer ação.',
    createdAt: Date.now()
  },
  {
    id: 'enf52',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o princípio ético que garante ao paciente o direito de decidir sobre si mesmo?',
    correctAnswer: 'Autonomia',
    options: ['Beneficência', 'Não-maleficência', 'Justiça', 'Autonomia'],
    explanation: 'A autonomia respeita a capacidade de autodeterminação do indivíduo.',
    createdAt: Date.now()
  },
  {
    id: 'enf53',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Negligência" profissional?',
    correctAnswer: 'Omissão ou falta de cuidado em uma ação que deveria ser realizada',
    options: ['Falta de conhecimento técnico', 'Agir com imprudência', 'Omissão ou falta de cuidado em uma ação que deveria ser realizada', 'Intenção de causar dano'],
    explanation: 'Negligência é o "deixar de fazer" ou fazer sem a atenção devida.',
    createdAt: Date.now()
  },
  {
    id: 'enf54',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Imperícia" profissional?',
    correctAnswer: 'Falta de conhecimento técnico ou habilidade para realizar uma tarefa',
    options: ['Falta de atenção', 'Agir com pressa excessiva', 'Falta de conhecimento técnico ou habilidade para realizar uma tarefa', 'Desobediência a ordens'],
    explanation: 'Imperícia ocorre quando o profissional realiza algo para o qual não está devidamente capacitado.',
    createdAt: Date.now()
  },
  {
    id: 'enf55',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o dever do enfermeiro em relação ao sigilo profissional?',
    correctAnswer: 'Manter sigilo sobre fatos que tenha conhecimento em razão da profissão',
    options: ['Contar apenas para a família do paciente', 'Manter sigilo sobre fatos que tenha conhecimento em razão da profissão', 'Divulgar em redes sociais sem nomes', 'Contar para outros pacientes'],
    explanation: 'O sigilo é fundamental para a confiança na relação profissional-paciente, salvo em casos previstos em lei.',
    createdAt: Date.now()
  },
  {
    id: 'enf56',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função da Comissão de Ética de Enfermagem nas instituições?',
    correctAnswer: 'Educativa, consultiva e de orientação sobre o exercício ético',
    options: ['Apenas punir os profissionais', 'Educativa, consultiva e de orientação sobre o exercício ético', 'Contratar novos funcionários', 'Definir salários'],
    explanation: 'A comissão atua prevenindo infrações e orientando a equipe sobre dilemas éticos.',
    createdAt: Date.now()
  },
  {
    id: 'enf57',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é Bioética?',
    correctAnswer: 'Estudo dos problemas éticos surgidos com o avanço da biologia e medicina',
    options: ['Apenas o estudo das leis de saúde', 'Estudo dos problemas éticos surgidos com o avanço da biologia e medicina', 'A ética aplicada apenas aos animais', 'O estudo da religião na saúde'],
    explanation: 'A bioética busca equilibrar o progresso científico com o respeito à dignidade humana.',
    createdAt: Date.now()
  },
  {
    id: 'enf58',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a respiração rápida e superficial?',
    correctAnswer: 'Taquipneia',
    options: ['Bradipneia', 'Taquipneia', 'Eupneia', 'Apneia'],
    explanation: 'Taquipneia é o aumento da frequência respiratória acima dos valores normais.',
    createdAt: Date.now()
  },
  {
    id: 'enf59',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a posição recomendada para lavagem gástrica?',
    correctAnswer: 'Decúbito lateral esquerdo',
    options: ['Posição de Fowler', 'Decúbito lateral esquerdo', 'Decúbito dorsal', 'Posição de Trendelenburg'],
    explanation: 'O decúbito lateral esquerdo facilita o acesso ao estômago e previne a aspiração pulmonar.',
    createdAt: Date.now()
  },
  {
    id: 'enf60',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Glicosúria"?',
    correctAnswer: 'Presença de glicose na urina',
    options: ['Presença de sangue na urina', 'Presença de glicose na urina', 'Presença de pus na urina', 'Presença de proteínas na urina'],
    explanation: 'A glicosúria ocorre quando os níveis de açúcar no sangue excedem o limiar renal de reabsorção.',
    createdAt: Date.now()
  },
  {
    id: 'enf61',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Foi prescrito 300mg de ampicilina. O frasco disponível é de 1g para diluir em 10ml. Quantos ml devem ser aspirados?',
    correctAnswer: '3 ml',
    options: ['1,5 ml', '3 ml', '4,5 ml', '6 ml'],
    explanation: 'Cálculo: (300mg * 10ml) / 1000mg = 3ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf62',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quais são os principais sinais da Diabetes Gestacional?',
    correctAnswer: 'Visão turva, sede excessiva e fadiga',
    options: ['Febre alta', 'Visão turva, sede excessiva e fadiga', 'Perda de cabelo', 'Dores nas articulações'],
    explanation: 'A diabetes gestacional pode ser assintomática ou apresentar sintomas leves de hiperglicemia.',
    createdAt: Date.now()
  },
  {
    id: 'enf63',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o valor de Pressão Arterial considerado como Hipertensão Estágio 1?',
    correctAnswer: '140/90 mmHg',
    options: ['120/80 mmHg', '130/85 mmHg', '140/90 mmHg', '160/100 mmHg'],
    explanation: 'Valores a partir de 140/90 mmHg são geralmente classificados como hipertensão em adultos.',
    createdAt: Date.now()
  },
  {
    id: 'enf64',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a finalidade das pomadas de ação protetora?',
    correctAnswer: 'Formar uma camada sobre a pele para evitar irritações',
    options: ['Matar bactérias profundamente', 'Formar uma camada sobre a pele para evitar irritações', 'Aumentar a temperatura local', 'Substituir o banho'],
    explanation: 'Pomadas protetoras criam uma barreira física contra agentes externos (como urina e fezes).',
    createdAt: Date.now()
  },
  {
    id: 'enf65',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Foi prescrito 4mg de Dexametasona. O frasco disponível é de 10mg/2,5ml. Quantos ml devem ser aspirados?',
    correctAnswer: '1 ml',
    options: ['0,4 ml', '1 ml', '2 ml', '2,5 ml'],
    explanation: 'Cálculo: (4mg * 2,5ml) / 10mg = 1ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf66',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza uma "Urgência Hipertensiva"?',
    correctAnswer: 'Elevação brusca da PA sem lesão aguda de órgão-alvo',
    options: ['PA alta com infarto agudo', 'Elevação brusca da PA sem lesão aguda de órgão-alvo', 'PA baixa com desmaio', 'PA normal com dor de cabeça'],
    explanation: 'Na urgência, a PA está muito alta, mas não há risco imediato de morte ou lesão grave em órgãos como cérebro ou coração.',
    createdAt: Date.now()
  },
  {
    id: 'enf67',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração da Nutrição Parenteral Total (NPT)?',
    correctAnswer: 'Via Intravenosa (Acesso Central)',
    options: ['Sonda Nasogástrica', 'Via Oral', 'Via Intravenosa (Acesso Central)', 'Via Intramuscular'],
    explanation: 'A NPT é uma solução hipertônica que deve ser administrada em veias de grande calibre.',
    createdAt: Date.now()
  },
  {
    id: 'enf68',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Cistocele"?',
    correctAnswer: 'Herniação da bexiga para dentro da vagina',
    options: ['Herniação do reto', 'Herniação da bexiga para dentro da vagina', 'Inflamação do útero', 'Presença de cálculos renais'],
    explanation: 'Também conhecida como "bexiga caída", ocorre pelo enfraquecimento dos tecidos de suporte.',
    createdAt: Date.now()
  },
  {
    id: 'enf69',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal cuidado ao administrar medicamentos por via sublingual?',
    correctAnswer: 'Orientar o paciente a não engolir o comprimido',
    options: ['Pedir para o paciente mastigar', 'Orientar o paciente a não engolir o comprimido', 'Oferecer água gelada junto', 'Aplicar apenas se o paciente estiver dormindo'],
    explanation: 'A absorção ocorre pela mucosa sob a língua; engolir o fármaco altera sua farmacocinética.',
    createdAt: Date.now()
  },
  {
    id: 'enf70',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Hematêmese"?',
    correctAnswer: 'Vômito com sangue',
    options: ['Sangue nas fezes', 'Vômito com sangue', 'Sangue na urina', 'Sangue no escarro'],
    explanation: 'Hematêmese indica sangramento no trato digestivo superior.',
    createdAt: Date.now()
  },
  {
    id: 'enf71',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a eliminação de sangue vivo pelo ânus?',
    correctAnswer: 'Enterorragia',
    options: ['Melena', 'Enterorragia', 'Hematúria', 'Hemoptise'],
    explanation: 'Enterorragia é a eliminação de sangue rutilante, geralmente de origem no trato digestivo baixo.',
    createdAt: Date.now()
  },
  {
    id: 'enf72',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Melena"?',
    correctAnswer: 'Fezes negras, pastosas e fétidas (sangue digerido)',
    options: ['Fezes com sangue vivo', 'Fezes negras, pastosas e fétidas (sangue digerido)', 'Fezes muito claras', 'Fezes com muco'],
    explanation: 'Melena indica sangramento alto, onde o sangue foi digerido pelas enzimas gástricas.',
    createdAt: Date.now()
  },
  {
    id: 'enf73',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a posição de "Litotomia" é utilizada para qual finalidade?',
    correctAnswer: 'Exames ginecológicos e partos',
    options: ['Cirurgias de coluna', 'Exames ginecológicos e partos', 'Lavagem gástrica', 'Melhorar a respiração'],
    explanation: 'Também chamada de posição ginecológica, facilita o acesso à região perineal.',
    createdAt: Date.now()
  },
  {
    id: 'enf74',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Hemoptise"?',
    correctAnswer: 'Eliminação de sangue pela boca através da tosse (origem pulmonar)',
    options: ['Vômito com sangue', 'Eliminação de sangue pela boca através da tosse (origem pulmonar)', 'Sangue no nariz', 'Sangue na urina'],
    explanation: 'Hemoptise é o sangramento proveniente das vias aéreas inferiores.',
    createdAt: Date.now()
  },
  {
    id: 'enf75',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a dor ao urinar?',
    correctAnswer: 'Disúria',
    options: ['Poliúria', 'Anúria', 'Disúria', 'Nictúria'],
    explanation: 'Disúria é o desconforto ou dor durante a micção, comum em infecções urinárias.',
    createdAt: Date.now()
  },
  {
    id: 'enf76',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Nictúria"?',
    correctAnswer: 'Necessidade de urinar várias vezes durante a noite',
    options: ['Incontinência urinária', 'Necessidade de urinar várias vezes durante a noite', 'Ausência de urina', 'Sangue na urina'],
    explanation: 'Nictúria altera o padrão de sono do paciente devido à frequência urinária noturna.',
    createdAt: Date.now()
  },
  {
    id: 'enf77',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a presença de sangue na urina?',
    correctAnswer: 'Hematúria',
    options: ['Glicosúria', 'Proteinúria', 'Hematúria', 'Piúria'],
    explanation: 'A hematúria pode ser macroscópica (visível) ou microscópica.',
    createdAt: Date.now()
  },
  {
    id: 'enf78',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Bradipneia"?',
    correctAnswer: 'Frequência respiratória abaixo do normal',
    options: ['Respiração rápida', 'Frequência respiratória abaixo do normal', 'Ausência de respiração', 'Dificuldade de respirar'],
    explanation: 'Bradipneia é a lentidão do ritmo respiratório.',
    createdAt: Date.now()
  },
  {
    id: 'enf79',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a frequência cardíaca acima de 100 batimentos por minuto em adultos?',
    correctAnswer: 'Taquicardia',
    options: ['Bradicardia', 'Taquicardia', 'Arritmia', 'Normocardia'],
    explanation: 'Taquicardia é o aumento da frequência cardíaca basal.',
    createdAt: Date.now()
  },
  {
    id: 'enf80',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a frequência cardíaca abaixo de 60 batimentos por minuto em adultos?',
    correctAnswer: 'Bradicardia',
    options: ['Taquicardia', 'Bradicardia', 'Sístole', 'Diástole'],
    explanation: 'Bradicardia é a lentidão dos batimentos cardíacos.',
    createdAt: Date.now()
  },
  {
    id: 'enf81',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Gengivorragia"?',
    correctAnswer: 'Sangramento das gengivas',
    options: ['Inflamação da gengiva', 'Sangramento das gengivas', 'Presença de pus na gengiva', 'Perda de dentes'],
    explanation: 'Gengivorragia é o sangramento gengival, comum em casos de gengivite ou distúrbios de coagulação.',
    createdAt: Date.now()
  },
  {
    id: 'enf82',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a eliminação de sangue pelo nariz?',
    correctAnswer: 'Epistaxe',
    options: ['Hemoptise', 'Epistaxe', 'Rinite', 'Sinusite'],
    explanation: 'Epistaxe é o sangramento nasal.',
    createdAt: Date.now()
  },
  {
    id: 'enf83',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Poliúria"?',
    correctAnswer: 'Aumento excessivo do volume urinário',
    options: ['Dor ao urinar', 'Aumento excessivo do volume urinário', 'Ausência de urina', 'Urinar sangue'],
    explanation: 'Poliúria é a eliminação de grandes volumes de urina (geralmente > 2500ml/dia).',
    createdAt: Date.now()
  },
  {
    id: 'enf84',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a posição de "Trendelenburg" e para que serve?',
    correctAnswer: 'Corpo inclinado com a cabeça mais baixa que os pés; melhora o retorno venoso',
    options: ['Sentado; melhora a respiração', 'Corpo inclinado com a cabeça mais baixa que os pés; melhora o retorno venoso', 'Deitado de lado; para exames', 'De bruços; para cirurgias'],
    explanation: 'Trendelenburg é usada em casos de choque hipovolêmico ou cirurgias pélvicas.',
    createdAt: Date.now()
  },
  {
    id: 'enf85',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Anasarca"?',
    correctAnswer: 'Edema generalizado',
    options: ['Edema apenas nas pernas', 'Edema generalizado', 'Inflamação do fígado', 'Dificuldade de engolir'],
    explanation: 'Anasarca é o acúmulo massivo de líquido no tecido subcutâneo e cavidades do corpo.',
    createdAt: Date.now()
  },
  {
    id: 'enf86',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a dificuldade de deglutição (engolir)?',
    correctAnswer: 'Disfagia',
    options: ['Afasia', 'Disfagia', 'Dislexia', 'Disartria'],
    explanation: 'Disfagia pode ser causada por problemas neurológicos ou obstrutivos no esôfago.',
    createdAt: Date.now()
  },
  {
    id: 'enf87',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Síncope"?',
    correctAnswer: 'Perda súbita e transitória da consciência (desmaio)',
    options: ['Parada cardíaca', 'Perda súbita e transitória da consciência (desmaio)', 'Crise convulsiva', 'Dificuldade de falar'],
    explanation: 'A síncope ocorre por uma redução temporária do fluxo sanguíneo cerebral.',
    createdAt: Date.now()
  },
  {
    id: 'enf88',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a coloração amarelada da pele e mucosas?',
    correctAnswer: 'Icterícia',
    options: ['Cianose', 'Icterícia', 'Palidez', 'Eritema'],
    explanation: 'A icterícia é causada pelo acúmulo de bilirrubina no sangue.',
    createdAt: Date.now()
  },
  {
    id: 'enf89',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Cianose"?',
    correctAnswer: 'Coloração azulada da pele devido à falta de oxigenação',
    options: ['Coloração avermelhada', 'Coloração azulada da pele devido à falta de oxigenação', 'Coloração amarela', 'Coloração pálida'],
    explanation: 'A cianose indica hipóxia tecidual (falta de oxigênio nos tecidos).',
    createdAt: Date.now()
  },
  {
    id: 'enf90',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal finalidade da "Lavagem das Mãos" na saúde?',
    correctAnswer: 'Prevenir a transmissão cruzada de microrganismos',
    options: ['Apenas por estética', 'Prevenir a transmissão cruzada de microrganismos', 'Para gastar sabão', 'Para hidratar a pele'],
    explanation: 'A higienização das mãos é a medida isolada mais importante para prevenir infecções hospitalares.',
    createdAt: Date.now()
  },
  {
    id: 'enf91',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Esterilização"?',
    correctAnswer: 'Destruição de todas as formas de vida microbiana, incluindo esporos',
    options: ['Limpeza com água e sabão', 'Destruição de todas as formas de vida microbiana, incluindo esporos', 'Redução apenas de bactérias patogênicas', 'Uso de álcool 70%'],
    explanation: 'A esterilização garante a ausência total de microrganismos em um objeto.',
    createdAt: Date.now()
  },
  {
    id: 'enf92',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o método físico de esterilização mais utilizado em hospitais?',
    correctAnswer: 'Autoclave (Calor Úmido)',
    options: ['Forno (Calor Seco)', 'Autoclave (Calor Úmido)', 'Radiação', 'Filtração'],
    explanation: 'A autoclave utiliza vapor sob pressão para esterilizar materiais de forma rápida e eficaz.',
    createdAt: Date.now()
  },
  {
    id: 'enf93',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza o "Isolamento de Contato"?',
    correctAnswer: 'Uso de luvas e avental para entrar no quarto do paciente',
    options: ['Uso de máscara N95', 'Uso de luvas e avental para entrar no quarto do paciente', 'Manter a porta sempre fechada', 'Proibir visitas'],
    explanation: 'O isolamento de contato previne a transmissão por toque direto ou superfícies contaminadas.',
    createdAt: Date.now()
  },
  {
    id: 'enf94',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal cuidado ao manusear materiais perfurocortantes?',
    correctAnswer: 'Nunca reencapar agulhas usadas',
    options: ['Reencapar com as duas mãos', 'Nunca reencapar agulhas usadas', 'Descartar no lixo comum', 'Lavar a agulha para reutilizar'],
    explanation: 'Reencapar agulhas é a principal causa de acidentes ocupacionais com sangue.',
    createdAt: Date.now()
  },
  {
    id: 'enf95',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Anamnese"?',
    correctAnswer: 'Entrevista realizada para obter o histórico de saúde do paciente',
    options: ['O exame físico completo', 'Entrevista realizada para obter o histórico de saúde do paciente', 'A prescrição de medicamentos', 'O banho do paciente'],
    explanation: 'A anamnese é a primeira parte da investigação no processo de enfermagem.',
    createdAt: Date.now()
  },
  {
    id: 'enf96',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a dor muscular?',
    correctAnswer: 'Mialgia',
    options: ['Artralgia', 'Mialgia', 'Cefaleia', 'Otalgia'],
    explanation: 'Mialgia é a dor localizada ou generalizada nos músculos.',
    createdAt: Date.now()
  },
  {
    id: 'enf97',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a dor nas articulações?',
    correctAnswer: 'Artralgia',
    options: ['Mialgia', 'Artralgia', 'Nevralgia', 'Gastralgia'],
    explanation: 'Artralgia é o sintoma de dor em uma ou mais articulações.',
    createdAt: Date.now()
  },
  {
    id: 'enf98',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Prurido"?',
    correctAnswer: 'Sensação de coceira na pele',
    options: ['Dor de cabeça', 'Sensação de coceira na pele', 'Vermelhidão', 'Inchaço'],
    explanation: 'Prurido é o termo técnico para a coceira.',
    createdAt: Date.now()
  },
  {
    id: 'enf99',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função da "Enfermeira Obstetra"?',
    correctAnswer: 'Assistência ao pré-natal, parto normal e puerpério',
    options: ['Realizar cirurgias complexas', 'Assistência ao pré-natal, parto normal e puerpério', 'Apenas cuidar de crianças', 'Administrar o hospital'],
    explanation: 'A enfermeira obstetra é capacitada para acompanhar a gestação e o parto de baixo risco.',
    createdAt: Date.now()
  },
  {
    id: 'enf100',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Puericultura"?',
    correctAnswer: 'Acompanhamento do crescimento e desenvolvimento da criança',
    options: ['O cuidado com idosos', 'Acompanhamento do crescimento e desenvolvimento da criança', 'O estudo das doenças mentais', 'A cirurgia plástica em crianças'],
    explanation: 'A puericultura foca na prevenção e promoção da saúde infantil.',
    createdAt: Date.now()
  },
  {
    id: 'enf101_new',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Prescrição: 500mg de um medicamento. Disponível: frasco de 1g/10ml. Quantos ml administrar?',
    correctAnswer: '5 ml',
    options: ['2 ml', '5 ml', '10 ml', '1 ml'],
    explanation: 'Cálculo: 1g = 1000mg. Se 1000mg estão em 10ml, 500mg estão em 5ml (regra de três).',
    createdAt: Date.now()
  },
  {
    id: 'enf102_new',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Para administrar 1000ml de Soro Fisiológico em 8 horas, qual deve ser o gotejamento em gotas/minuto?',
    correctAnswer: '42 gotas/min',
    options: ['21 gotas/min', '42 gotas/min', '63 gotas/min', '30 gotas/min'],
    explanation: 'Fórmula: Volume / (Tempo x 3). 1000 / (8 x 3) = 1000 / 24 ≈ 41.6, arredondando para 42.',
    createdAt: Date.now()
  },
  {
    id: 'enf103_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o ângulo correto para a aplicação de uma injeção Intramuscular (IM)?',
    correctAnswer: '90 graus',
    options: ['15 graus', '45 graus', '90 graus', '10 a 15 graus'],
    explanation: 'A injeção IM deve atingir o tecido muscular profundo, exigindo um ângulo perpendicular à pele.',
    createdAt: Date.now()
  },
  {
    id: 'enf104_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o ângulo recomendado para a via Intradérmica (ID)?',
    correctAnswer: '10 a 15 graus',
    options: ['10 a 15 graus', '45 graus', '90 graus', '30 graus'],
    explanation: 'A via ID é aplicada na derme, exigindo um ângulo quase paralelo à pele.',
    createdAt: Date.now()
  },
  {
    id: 'enf105_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o local de escolha para aplicação de vacinas em lactentes (bebês)?',
    correctAnswer: 'Vasto lateral da coxa',
    options: ['Deltóide', 'Glúteo', 'Vasto lateral da coxa', 'Ventro-glúteo'],
    explanation: 'O vasto lateral é o músculo mais desenvolvido e seguro em bebês que ainda não andam.',
    createdAt: Date.now()
  },
  {
    id: 'enf106_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Ao verificar o pulso radial, o que significa um pulso "Dicrótico"?',
    correctAnswer: 'Um pulso com dois batimentos para cada sístole',
    options: ['Pulso muito rápido', 'Pulso muito fraco', 'Um pulso com dois batimentos para cada sístole', 'Ausência de pulso'],
    explanation: 'É uma alteração rítmica onde se percebe uma dupla onda de pulsação.',
    createdAt: Date.now()
  },
  {
    id: 'enf107_new',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o valor de referência para a frequência respiratória normal (Eupneia) em adultos?',
    correctAnswer: '12 a 20 incursões por minuto',
    options: ['8 a 12 ipm', '12 a 20 ipm', '20 a 30 ipm', '60 a 100 ipm'],
    explanation: 'Valores entre 12 e 20 respirações por minuto são considerados normais para repouso.',
    createdAt: Date.now()
  },
  {
    id: 'enf108_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que define a "Hipertensão Arterial Estágio 1"?',
    correctAnswer: 'PA Sistólica entre 130-139 ou Diastólica entre 80-89 mmHg',
    options: ['PA 120/80 mmHg', 'PA Sistólica entre 130-139 ou Diastólica entre 80-89 mmHg', 'PA acima de 180/120 mmHg', 'PA 110/70 mmHg'],
    explanation: 'Conforme diretrizes atuais, esses valores já indicam hipertensão inicial.',
    createdAt: Date.now()
  },
  {
    id: 'enf109_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o cuidado imediato após uma picada de agulha acidental?',
    correctAnswer: 'Lavar exaustivamente com água e sabão',
    options: ['Espremer o local para sair sangue', 'Lavar exaustivamente com água e sabão', 'Passar álcool 70% apenas', 'Colocar um curativo e ignorar'],
    explanation: 'A lavagem reduz a carga viral/bacteriana no local do ferimento.',
    createdAt: Date.now()
  },
  {
    id: 'enf110_new',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Prescrição: 250mg de Amoxicilina. Disponível: suspensão de 125mg/5ml. Quantos ml administrar?',
    correctAnswer: '10 ml',
    options: ['5 ml', '7.5 ml', '10 ml', '15 ml'],
    explanation: 'Se 125mg estão em 5ml, 250mg (o dobro) estarão em 10ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf111_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via para administração de vacina BCG?',
    correctAnswer: 'Intradérmica',
    options: ['Subcutânea', 'Intramuscular', 'Intradérmica', 'Oral'],
    explanation: 'A BCG deve ser aplicada na derme, geralmente no braço direito.',
    createdAt: Date.now()
  },
  {
    id: 'enf112_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Bradicardia"?',
    correctAnswer: 'Frequência cardíaca abaixo de 60 batimentos por minuto',
    options: ['FC acima de 100 bpm', 'FC abaixo de 60 batimentos por minuto', 'Pulso irregular', 'Pressão baixa'],
    explanation: 'Bradicardia é o termo para o ritmo cardíaco lento.',
    createdAt: Date.now()
  },
  {
    id: 'enf113_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo técnico para a respiração rápida e superficial?',
    correctAnswer: 'Taquipneia',
    options: ['Bradipneia', 'Taquipneia', 'Dispneia', 'Apneia'],
    explanation: 'Taquipneia é o aumento da frequência respiratória.',
    createdAt: Date.now()
  },
  {
    id: 'enf114_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a posição recomendada para realizar a lavagem intestinal (enema)?',
    correctAnswer: 'Posição de Sims (lateral esquerda)',
    options: ['Posição de Fowler', 'Posição de Sims (lateral esquerda)', 'Ginecológica', 'Trendelenburg'],
    explanation: 'A posição de Sims facilita a progressão do líquido pelo cólon sigmóide.',
    createdAt: Date.now()
  },
  {
    id: 'enf115_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o volume máximo para aplicação via Subcutânea?',
    correctAnswer: '1.5 ml',
    options: ['0.5 ml', '1.5 ml', '3 ml', '5 ml'],
    explanation: 'O tecido subcutâneo suporta volumes pequenos, geralmente até 1.5ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf116_new',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Para administrar 500ml de soro em 12 horas, qual o gotejamento em microgotas/minuto?',
    correctAnswer: '42 microgotas/min',
    options: ['14 microgotas/min', '42 microgotas/min', '21 microgotas/min', '60 microgotas/min'],
    explanation: 'Fórmula microgotas: Volume / Tempo. 500 / 12 ≈ 41.6, arredondando para 42.',
    createdAt: Date.now()
  },
  {
    id: 'enf117_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal finalidade da técnica asséptica?',
    correctAnswer: 'Prevenir a introdução de microrganismos em locais estéreis',
    options: ['Limpar o chão do hospital', 'Prevenir a introdução de microrganismos em locais estéreis', 'Apenas lavar as mãos', 'Economizar material'],
    explanation: 'A assepsia visa manter a esterilidade de procedimentos e materiais.',
    createdAt: Date.now()
  },
  {
    id: 'enf118_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que significa um paciente "Afebril"?',
    correctAnswer: 'Paciente sem febre, com temperatura normal',
    options: ['Paciente com febre alta', 'Paciente sem febre, com temperatura normal', 'Paciente com calafrios', 'Paciente suando muito'],
    explanation: 'O prefixo "a-" indica negação ou ausência.',
    createdAt: Date.now()
  },
  {
    id: 'enf119_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o local correto para verificar o pulso Apical?',
    correctAnswer: 'No 5º espaço intercostal esquerdo, na linha hemiclavicular',
    options: ['No pescoço', 'No pulso', 'No 5º espaço intercostal esquerdo, na linha hemiclavicular', 'Na virilha'],
    explanation: 'O pulso apical é verificado diretamente sobre o ápice do coração.',
    createdAt: Date.now()
  },
  {
    id: 'enf120_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Hipotensão Ortostática"?',
    correctAnswer: 'Queda da pressão arterial ao mudar da posição deitado para em pé',
    options: ['Pressão alta constante', 'Queda da pressão arterial ao mudar da posição deitado para em pé', 'Aumento da frequência cardíaca', 'Desmaio por calor'],
    explanation: 'É comum em idosos ou pacientes desidratados.',
    createdAt: Date.now()
  },
  {
    id: 'enf121_new',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Quantas gotas equivalem a 1 ml?',
    correctAnswer: '20 gotas',
    options: ['10 gotas', '20 gotas', '60 gotas', '100 gotas'],
    explanation: 'No padrão hospitalar, 1ml = 20 gotas = 60 microgotas.',
    createdAt: Date.now()
  },
  {
    id: 'enf122_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a via de administração da vacina contra a Poliomielite (VOP)?',
    correctAnswer: 'Oral',
    options: ['Intramuscular', 'Subcutânea', 'Oral', 'Intradérmica'],
    explanation: 'A VOP é a famosa "gotinha", administrada por via oral.',
    createdAt: Date.now()
  },
  {
    id: 'enf123_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Glicemia de Jejum"?',
    correctAnswer: 'Nível de açúcar no sangue após pelo menos 8 horas sem comer',
    options: ['Glicose medida logo após o almoço', 'Nível de açúcar no sangue após pelo menos 8 horas sem comer', 'O açúcar na urina', 'A quantidade de insulina no corpo'],
    explanation: 'É o exame padrão para triagem de diabetes.',
    createdAt: Date.now()
  },
  {
    id: 'enf124_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a coloração azulada da pele por falta de oxigênio?',
    correctAnswer: 'Cianose',
    options: ['Icterícia', 'Palidez', 'Cianose', 'Eritema'],
    explanation: 'A cianose indica hipóxia tecidual.',
    createdAt: Date.now()
  },
  {
    id: 'enf125_new',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função do dreno de Penrose?',
    correctAnswer: 'Facilitar a saída de secreções e fluidos de uma ferida cirúrgica',
    options: ['Administrar soro', 'Facilitar a saída de secreções e fluidos de uma ferida cirúrgica', 'Medir a pressão interna', 'Substituir a sutura'],
    explanation: 'É um dreno de borracha que atua por capilaridade.',
    createdAt: Date.now()
  },

  // --- ENFERMAGEM BENGUELA 2022 (QUESTÕES DO MANUAL E PROVA) ---
  {
    id: 'eb1',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'De acordo com o manual de Benguela, qual a principal medida para evitar a flebite em acessos venosos periféricos?',
    correctAnswer: 'Trocar o sítio do cateter a cada 72-96 horas',
    options: ['Usar apenas veias do pé', 'Trocar o sítio do cateter a cada 72-96 horas', 'Não usar luvas na punção', 'Lavar o local com água oxigenada'],
    explanation: 'A troca periódica do acesso venoso é a recomendação padrão para prevenir processos inflamatórios na veia (flebite).',
    createdAt: Date.now()
  },
  {
    id: 'eb2',
    category: 'Enfer. Benguela 2022',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o termo técnico para a ausência total de respiração?',
    correctAnswer: 'Apneia',
    options: ['Dispneia', 'Apneia', 'Bradipneia', 'Taquipneia'],
    explanation: 'Apneia é a interrupção completa da ventilação pulmonar.',
    createdAt: Date.now()
  },
  {
    id: 'eb3',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Na prova de Benguela 2022, qual a conduta inicial em caso de queimadura química nos olhos?',
    correctAnswer: 'Irrigação abundante com água ou soro fisiológico',
    options: ['Aplicar pomada oftalmológica', 'Irrigação abundante com água ou soro fisiológico', 'Vendar os olhos imediatamente', 'Pingar colírio anestésico'],
    explanation: 'A lavagem imediata e contínua é crucial para remover o agente químico e minimizar danos à córnea.',
    createdAt: Date.now()
  },
  {
    id: 'eb4',
    category: 'Enfer. Benguela 2022',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a dilatação cervical que marca o início da fase ativa do trabalho de parto?',
    correctAnswer: '4 cm',
    options: ['2 cm', '4 cm', '6 cm', '8 cm'],
    explanation: 'Tradicionalmente, a fase ativa começa quando a dilatação atinge 4 cm com contrações regulares.',
    createdAt: Date.now()
  },
  {
    id: 'eb5',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Asepsia"?',
    correctAnswer: 'Conjunto de medidas para impedir a entrada de microrganismos em local que não os tenha',
    options: ['Uso de desinfetantes na pele', 'Conjunto de medidas para impedir a entrada de microrganismos em local que não os tenha', 'Limpeza do chão do hospital', 'Uso de antibióticos'],
    explanation: 'Asepsia foca em manter o ambiente ou objeto livre de contaminação (ex: técnica estéril).',
    createdAt: Date.now()
  },
  {
    id: 'eb6',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Malária Cerebral em crianças?',
    correctAnswer: 'Convulsões e coma',
    options: ['Apenas febre baixa', 'Convulsões e coma', 'Diarreia leve', 'Manchas na pele'],
    explanation: 'A malária grave por P. falciparum pode afetar o sistema nervoso central, levando a quadros neurológicos severos.',
    createdAt: Date.now()
  },
  {
    id: 'eb7',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a via de administração da vacina BCG?',
    correctAnswer: 'Intradérmica',
    options: ['Subcutânea', 'Intramuscular', 'Intradérmica', 'Oral'],
    explanation: 'A BCG é aplicada no braço direito, rigorosamente por via intradérmica.',
    createdAt: Date.now()
  },
  {
    id: 'eb8',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Bradicardia" em um adulto?',
    correctAnswer: 'Pulso inferior a 60 batimentos por minuto',
    options: ['Pulso acima de 100 bpm', 'Pulso inferior a 60 batimentos por minuto', 'Pulso irregular', 'Ausência de pulso'],
    explanation: 'Bradicardia é a frequência cardíaca lenta, abaixo do limite de normalidade para repouso.',
    createdAt: Date.now()
  },
  {
    id: 'eb9',
    category: 'Enfer. Benguela 2022',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Foi prescrito 250mg de um antibiótico. O frasco é de 500mg/5ml. Quanto deve ser administrado?',
    correctAnswer: '2,5 ml',
    options: ['1,25 ml', '2,5 ml', '5 ml', '10 ml'],
    explanation: 'Cálculo: (250mg * 5ml) / 500mg = 2,5ml.',
    createdAt: Date.now()
  },
  {
    id: 'eb10',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a posição ideal para um paciente com insuficiência respiratória aguda?',
    correctAnswer: 'Posição de Fowler (Sentado)',
    options: ['Trendelenburg', 'Decúbito dorsal', 'Posição de Fowler (Sentado)', 'Decúbito lateral'],
    explanation: 'A posição sentada facilita a expansão pulmonar e diminui o esforço respiratório.',
    createdAt: Date.now()
  },
  {
    id: 'eb11',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Glicosúria"?',
    correctAnswer: 'Presença de açúcar na urina',
    options: ['Presença de pus na urina', 'Presença de açúcar na urina', 'Presença de sangue na urina', 'Presença de proteínas na urina'],
    explanation: 'Ocorre quando a glicemia ultrapassa o limiar renal (geralmente > 180mg/dL).',
    createdAt: Date.now()
  },
  {
    id: 'eb12',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal cuidado com o dreno de tórax?',
    correctAnswer: 'Manter o frasco sempre abaixo do nível do tórax',
    options: ['Manter o frasco acima do tórax', 'Manter o frasco sempre abaixo do nível do tórax', 'Clampar o dreno durante o banho', 'Trocar o frasco a cada 1 hora'],
    explanation: 'O sistema funciona por gravidade e selo d\'água; elevar o frasco pode causar refluxo para o pulmão.',
    createdAt: Date.now()
  },
  {
    id: 'eb13',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que define a "Hipertensão Arterial" em termos de valores?',
    correctAnswer: 'PA ≥ 140/90 mmHg',
    options: ['PA 120/80 mmHg', 'PA 130/85 mmHg', 'PA ≥ 140/90 mmHg', 'PA 110/70 mmHg'],
    explanation: 'Valores persistentes iguais ou superiores a 140/90 mmHg caracterizam a hipertensão.',
    createdAt: Date.now()
  },
  {
    id: 'eb14',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a inflamação da veia?',
    correctAnswer: 'Flebite',
    options: ['Arterite', 'Flebite', 'Gastrite', 'Cistite'],
    explanation: 'Flebite é a inflamação da camada íntima da veia, comum em acessos venosos.',
    createdAt: Date.now()
  },
  {
    id: 'eb15',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função da Vitamina K no recém-nascido?',
    correctAnswer: 'Prevenir a doença hemorrágica do recém-nascido',
    options: ['Prevenir a malária', 'Prevenir a doença hemorrágica do recém-nascido', 'Ajudar no crescimento dos ossos', 'Aumentar a imunidade contra gripe'],
    explanation: 'RNs têm baixos níveis de vitamina K; a aplicação ao nascer evita sangramentos graves.',
    createdAt: Date.now()
  },
  {
    id: 'eb16',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Lipotímia"?',
    correctAnswer: 'Sensação de desmaio sem perda total da consciência',
    options: ['Perda total da consciência', 'Sensação de desmaio sem perda total da consciência', 'Parada respiratória', 'Crise de ansiedade'],
    explanation: 'É o "pré-desmaio", onde o paciente sente tontura e fraqueza mas não apaga totalmente.',
    createdAt: Date.now()
  },
  {
    id: 'eb17',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal objetivo da "Triagem" no banco de urgência?',
    correctAnswer: 'Priorizar o atendimento conforme a gravidade',
    options: ['Atender por ordem de chegada', 'Priorizar o atendimento conforme a gravidade', 'Cobrar as taxas hospitalares', 'Fazer o registro administrativo'],
    explanation: 'A triagem garante que os casos mais graves sejam atendidos primeiro, independentemente da chegada.',
    createdAt: Date.now()
  },
  {
    id: 'eb18',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a presença de ar na cavidade pleural?',
    correctAnswer: 'Pneumotórax',
    options: ['Hemotórax', 'Pneumotórax', 'Quilotórax', 'Empiema'],
    explanation: 'Pneumotórax causa colapso pulmonar devido à entrada de ar no espaço pleural.',
    createdAt: Date.now()
  },
  {
    id: 'eb19',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Hemostasia"?',
    correctAnswer: 'Processo que interrompe o sangramento',
    options: ['Aumento do fluxo sanguíneo', 'Processo que interrompe o sangramento', 'Destruição de hemácias', 'Produção de sangue'],
    explanation: 'Hemostasia é o conjunto de mecanismos que o corpo usa para parar uma hemorragia.',
    createdAt: Date.now()
  },
  {
    id: 'eb20',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão da Tuberculose?',
    correctAnswer: 'Via aérea (gotículas e aerossóis)',
    options: ['Contato direto com a pele', 'Via aérea (gotículas e aerossóis)', 'Alimentos contaminados', 'Picada de inseto'],
    explanation: 'O bacilo de Koch é transmitido pela fala, tosse ou espirro de pessoas infectadas.',
    createdAt: Date.now()
  },
  {
    id: 'eb21',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo técnico para a inflamação da mucosa da boca?',
    correctAnswer: 'Estomatite',
    options: ['Glossite', 'Gengivite', 'Estomatite', 'Gastrite'],
    explanation: 'Estomatite é a inflamação generalizada da mucosa bucal.',
    createdAt: Date.now()
  },
  {
    id: 'eb22',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal finalidade da aplicação de compressas frias?',
    correctAnswer: 'Vasoconstrição e alívio da dor em traumas agudos',
    options: ['Vasodilatação', 'Vasoconstrição e alívio da dor em traumas agudos', 'Aumentar o edema', 'Acelerar a supuração'],
    explanation: 'O frio causa vasoconstrição, reduzindo o fluxo sanguíneo, o edema e a dor local.',
    createdAt: Date.now()
  },
  {
    id: 'eb23',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Disfagia"?',
    correctAnswer: 'Dificuldade de deglutição',
    options: ['Dificuldade de falar', 'Dificuldade de deglutição', 'Dificuldade de respirar', 'Dificuldade de enxergar'],
    explanation: 'Disfagia é o termo médico para qualquer dificuldade no processo de engolir.',
    createdAt: Date.now()
  },
  {
    id: 'eb24',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal cuidado com o paciente em uso de sonda vesical de demora?',
    correctAnswer: 'Manter o sistema de drenagem fechado e abaixo do nível da bexiga',
    options: ['Manter a bolsa acima da cintura', 'Manter o sistema de drenagem fechado e abaixo do nível da bexiga', 'Desconectar a sonda para o banho', 'Trocar a bolsa a cada 4 horas'],
    explanation: 'Isso evita o refluxo de urina contaminada para a bexiga, prevenindo infecções urinárias.',
    createdAt: Date.now()
  },
  {
    id: 'eb25',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a presença de sangue no escarro?',
    correctAnswer: 'Hemoptise',
    options: ['Hematêmese', 'Hemoptise', 'Epistaxe', 'Melena'],
    explanation: 'Hemoptise é a expectoração de sangue proveniente dos pulmões ou brônquios.',
    createdAt: Date.now()
  },
  {
    id: 'eb26',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Bradipneia"?',
    correctAnswer: 'Frequência respiratória abaixo do normal',
    options: ['Respiração rápida', 'Frequência respiratória abaixo do normal', 'Ausência de respiração', 'Dificuldade de respirar deitado'],
    explanation: 'Bradipneia é a lentidão do ritmo respiratório.',
    createdAt: Date.now()
  },
  {
    id: 'eb27',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão da Cólera?',
    correctAnswer: 'Fecal-oral (água e alimentos contaminados)',
    options: ['Picada de mosquito', 'Fecal-oral (água e alimentos contaminados)', 'Via respiratória', 'Contato com sangue'],
    explanation: 'A cólera é transmitida pela ingestão de água ou alimentos contaminados por fezes de pessoas infectadas.',
    createdAt: Date.now()
  },
  {
    id: 'eb28',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Anúria"?',
    correctAnswer: 'Diurese inferior a 100 ml em 24 horas',
    options: ['Diurese de 500 ml', 'Diurese inferior a 100 ml em 24 horas', 'Dor ao urinar', 'Sangue na urina'],
    explanation: 'Anúria é a ausência ou quase total supressão da eliminação urinária.',
    createdAt: Date.now()
  },
  {
    id: 'eb29',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a frequência cardíaca normal?',
    correctAnswer: 'Normocardia',
    options: ['Taquicardia', 'Bradicardia', 'Normocardia', 'Arritmia'],
    explanation: 'Normocardia refere-se ao ritmo cardíaco dentro dos limites normais (60-100 bpm).',
    createdAt: Date.now()
  },
  {
    id: 'eb30',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a finalidade da "Posição de Sims"?',
    correctAnswer: 'Exames retais e aplicação de enemas',
    options: ['Melhorar a respiração', 'Exames retais e aplicação de enemas', 'Cirurgias de cabeça', 'Parto normal'],
    explanation: 'É a posição de decúbito lateral esquerdo com a perna direita flexionada.',
    createdAt: Date.now()
  },
  {
    id: 'eb31',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Ortopneia"?',
    correctAnswer: 'Dificuldade de respirar que melhora ao sentar ou ficar de pé',
    options: ['Respiração rápida', 'Dificuldade de respirar que melhora ao sentar ou ficar de pé', 'Ausência de respiração durante o sono', 'Dor ao respirar'],
    explanation: 'O paciente sente alívio da falta de ar quando mantém o tronco ereto.',
    createdAt: Date.now()
  },
  {
    id: 'eb32',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a coloração arroxeada das extremidades por falta de oxigênio?',
    correctAnswer: 'Cianose',
    options: ['Icterícia', 'Palidez', 'Cianose', 'Eritema'],
    explanation: 'A cianose ocorre quando há uma concentração elevada de hemoglobina não oxigenada no sangue.',
    createdAt: Date.now()
  },
  {
    id: 'eb33',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Desidratação Grave em crianças?',
    correctAnswer: 'Olhos encovados e sinal da prega positivo',
    options: ['Febre alta', 'Olhos encovados e sinal da prega positivo', 'Muita energia', 'Pele muito úmida'],
    explanation: 'A perda de turgor cutâneo (sinal da prega) e olhos fundos são sinais clássicos de perda volêmica severa.',
    createdAt: Date.now()
  },
  {
    id: 'eb34',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Paracentese"?',
    correctAnswer: 'Punção da cavidade abdominal para retirada de líquido (ascite)',
    options: ['Punção do tórax', 'Punção da cavidade abdominal para retirada de líquido (ascite)', 'Punção da medula óssea', 'Punção lombar'],
    explanation: 'Procedimento médico auxiliado pela enfermagem para aliviar a pressão abdominal por acúmulo de líquido.',
    createdAt: Date.now()
  },
  {
    id: 'eb35',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a sensibilidade exagerada à dor?',
    correctAnswer: 'Hiperalgesia',
    options: ['Analgesia', 'Hiperalgesia', 'Parestesia', 'Anestesia'],
    explanation: 'Hiperalgesia é uma resposta aumentada a um estímulo que normalmente é doloroso.',
    createdAt: Date.now()
  },
  {
    id: 'eb36',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Imprudência" profissional?',
    correctAnswer: 'Agir com precipitação ou sem cautela',
    options: ['Falta de conhecimento', 'Agir com precipitação ou sem cautela', 'Deixar de fazer algo', 'Fazer algo proibido por lei'],
    explanation: 'Imprudência é a ação temerária, sem o devido cuidado ou precaução.',
    createdAt: Date.now()
  },
  {
    id: 'eb37',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a inflamação da bexiga?',
    correctAnswer: 'Cistite',
    options: ['Nefrite', 'Uretrite', 'Cistite', 'Prostatite'],
    explanation: 'Cistite é a infecção ou inflamação da bexiga urinária.',
    createdAt: Date.now()
  },
  {
    id: 'eb38',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Piúria"?',
    correctAnswer: 'Presença de pus na urina',
    options: ['Sangue na urina', 'Presença de pus na urina', 'Glicose na urina', 'Proteína na urina'],
    explanation: 'Indica a presença de leucócitos na urina, geralmente por infecção bacteriana.',
    createdAt: Date.now()
  },
  {
    id: 'eb39',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração da vacina contra a Poliomielite (VOP)?',
    correctAnswer: 'Via Oral',
    options: ['Intramuscular', 'Subcutânea', 'Via Oral', 'Intradérmica'],
    explanation: 'A VOP (Vacina Oral de Poliomielite) é administrada em gotas via oral.',
    createdAt: Date.now()
  },
  {
    id: 'eb40',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Eupneia"?',
    correctAnswer: 'Respiração normal e sem esforço',
    options: ['Respiração rápida', 'Respiração lenta', 'Respiração normal e sem esforço', 'Dificuldade de respirar'],
    explanation: 'Eupneia é o padrão respiratório saudável e rítmico.',
    createdAt: Date.now()
  },
  {
    id: 'eb41',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a dor de cabeça?',
    correctAnswer: 'Cefaleia',
    options: ['Mialgia', 'Artralgia', 'Cefaleia', 'Otalgia'],
    explanation: 'Cefaleia é o termo médico para qualquer tipo de dor de cabeça.',
    createdAt: Date.now()
  },
  {
    id: 'eb42',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Bradicardia"?',
    correctAnswer: 'Frequência cardíaca abaixo do normal',
    options: ['Frequência cardíaca acima do normal', 'Frequência cardíaca abaixo do normal', 'Ritmo cardíaco irregular', 'Ausência de batimentos'],
    explanation: 'Bradicardia é a lentidão do ritmo cardíaco.',
    createdAt: Date.now()
  },
  {
    id: 'eb43',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração da vacina contra a Febre Amarela?',
    correctAnswer: 'Subcutânea',
    options: ['Intramuscular', 'Subcutânea', 'Intradérmica', 'Oral'],
    explanation: 'A vacina da febre amarela é administrada por via subcutânea.',
    createdAt: Date.now()
  },
  {
    id: 'eb44',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Hematúria"?',
    correctAnswer: 'Presença de sangue na urina',
    options: ['Presença de pus na urina', 'Presença de sangue na urina', 'Presença de glicose na urina', 'Presença de proteínas na urina'],
    explanation: 'Hematúria é a eliminação de sangue pela urina.',
    createdAt: Date.now()
  },
  {
    id: 'eb45',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a inflamação do ouvido?',
    correctAnswer: 'Otite',
    options: ['Rinite', 'Sinusite', 'Otite', 'Glossite'],
    explanation: 'Otite é a inflamação ou infecção do ouvido.',
    createdAt: Date.now()
  },
  {
    id: 'eb46',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Taquipneia"?',
    correctAnswer: 'Frequência respiratória acima do normal',
    options: ['Frequência respiratória abaixo do normal', 'Frequência respiratória acima do normal', 'Ausência de respiração', 'Dificuldade de respirar'],
    explanation: 'Taquipneia é o aumento da frequência respiratória.',
    createdAt: Date.now()
  },
  {
    id: 'eb47',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de administração da vacina contra a Hepatite B?',
    correctAnswer: 'Intramuscular',
    options: ['Intramuscular', 'Subcutânea', 'Intradérmica', 'Oral'],
    explanation: 'A vacina da hepatite B é administrada por via intramuscular profunda.',
    createdAt: Date.now()
  },
  {
    id: 'eb48',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Melena"?',
    correctAnswer: 'Fezes negras e fétidas por sangue digerido',
    options: ['Fezes com sangue vivo', 'Fezes negras e fétidas por sangue digerido', 'Fezes muito claras', 'Fezes com muco'],
    explanation: 'Melena indica sangramento no trato digestivo superior.',
    createdAt: Date.now()
  },
  {
    id: 'eb49',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o termo para a inflamação do estômago?',
    correctAnswer: 'Gastrite',
    options: ['Enterite', 'Colite', 'Gastrite', 'Esofagite'],
    explanation: 'Gastrite é a inflamação da mucosa gástrica.',
    createdAt: Date.now()
  },
  {
    id: 'eb50',
    category: 'Enfer. Benguela 2022',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Taquicardia"?',
    correctAnswer: 'Frequência cardíaca acima do normal',
    options: ['Frequência cardíaca abaixo do normal', 'Frequência cardíaca acima do normal', 'Ritmo cardíaco irregular', 'Ausência de batimentos'],
    explanation: 'Taquicardia é o aumento da frequência cardíaca.',
    createdAt: Date.now()
  },
  // --- MEDICINA ---
  {
    id: 'med1',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o principal neurotransmissor envolvido na doença de Parkinson?',
    correctAnswer: 'Dopamina',
    options: ['Serotonina', 'Dopamina', 'Acetilcolina', 'GABA'],
    explanation: 'A doença de Parkinson é caracterizada pela degeneração de neurônios dopaminérgicos na substância negra.',
    createdAt: Date.now()
  },
  {
    id: 'med2',
    category: 'Medicina',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual destas válvulas cardíacas separa o átrio esquerdo do ventrículo esquerdo?',
    correctAnswer: 'Válvula Mitral',
    options: ['Válvula Tricúspide', 'Válvula Aórtica', 'Válvula Mitral', 'Válvula Pulmonar'],
    explanation: 'A válvula mitral (ou bicúspide) localiza-se entre o átrio e o ventrículo esquerdo.',
    createdAt: Date.now()
  },
  {
    id: 'med3',
    category: 'Medicina',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual órgão é responsável pela produção de insulina no corpo humano?',
    correctAnswer: 'Pâncreas',
    options: ['Fígado', 'Pâncreas', 'Baço', 'Rins'],
    explanation: 'O pâncreas produz insulina através das células beta das ilhotas de Langerhans.',
    createdAt: Date.now()
  },
  // --- APOIO HOSPITALAR ---
  {
    id: 'ah1',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a cor do recipiente destinado ao descarte de resíduos infectantes (Grupo A)?',
    correctAnswer: 'Branco',
    options: ['Vermelho', 'Branco', 'Azul', 'Amarelo'],
    explanation: 'Resíduos infectantes devem ser descartados em sacos brancos leitosos com o símbolo de risco biológico.',
    createdAt: Date.now()
  },
  {
    id: 'ah2',
    category: 'Apoio Hospitalar',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que significa a sigla EPC no contexto de segurança hospitalar?',
    correctAnswer: 'Equipamento de Proteção Coletiva',
    options: ['Equipamento de Proteção Coletiva', 'Equipamento de Proteção Comum', 'Estrutura de Proteção Clínica', 'Exame de Proteção Citológica'],
    explanation: 'EPCs são dispositivos instalados no ambiente de trabalho para proteger todos os trabalhadores (ex: exaustores).',
    createdAt: Date.now()
  },
  // --- ESTOMATOLOGIA ---
  {
    id: 'est1',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Quantos dentes compõem a dentição decídua (de leite) completa?',
    correctAnswer: '20 dentes',
    options: ['20 dentes', '32 dentes', '28 dentes', '24 dentes'],
    explanation: 'A dentição decídua é composta por 20 dentes (10 em cada arco).',
    createdAt: Date.now()
  },
  {
    id: 'est2',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o tecido mais duro do corpo humano, que recobre a coroa do dente?',
    correctAnswer: 'Esmalte',
    options: ['Dentina', 'Cemento', 'Esmalte', 'Osso alveolar'],
    explanation: 'O esmalte dentário é o tecido mais mineralizado e duro do organismo.',
    createdAt: Date.now()
  },
  // --- OUTROS ---
  {
    id: 'out1',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a primeira atitude a tomar em caso de engasgo total em um adulto consciente?',
    correctAnswer: 'Realizar a Manobra de Heimlich',
    options: ['Dar água para beber', 'Realizar a Manobra de Heimlich', 'Deitar a pessoa de costas', 'Bater nas costas levemente'],
    explanation: 'A Manobra de Heimlich é a técnica padrão para desobstrução de vias aéreas por corpo estranho.',
    createdAt: Date.now()
  },
  {
    id: 'out2',
    category: 'Outros',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual vitamina é sintetizada principalmente através da exposição solar?',
    correctAnswer: 'Vitamina D',
    options: ['Vitamina A', 'Vitamina C', 'Vitamina D', 'Vitamina K'],
    explanation: 'A radiação ultravioleta B (UVB) é essencial para a síntese de vitamina D na pele.',
    createdAt: Date.now()
  },
  // --- MEDICINA (ADICIONAIS) ---
  {
    id: 'med4',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O "Sinal de Blumberg" positivo durante o exame físico abdominal sugere:',
    correctAnswer: 'Apendicite aguda',
    options: ['Colecistite', 'Apendicite aguda', 'Pancreatite', 'Hepatite'],
    explanation: 'O sinal de Blumberg é a dor à descompressão súbita no ponto de McBurney, indicando irritação peritoneal.',
    createdAt: Date.now()
  },
  {
    id: 'med5',
    category: 'Medicina',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o maior osso do corpo humano?',
    correctAnswer: 'Fêmur',
    options: ['Tíbia', 'Úmero', 'Fêmur', 'Rádio'],
    explanation: 'O fêmur é o osso da coxa, sendo o mais longo e forte do corpo humano.',
    createdAt: Date.now()
  },
  {
    id: 'med6',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual bactéria é a principal causadora da Tuberculose?',
    correctAnswer: 'Mycobacterium tuberculosis',
    options: ['Staphylococcus aureus', 'Mycobacterium tuberculosis', 'Escherichia coli', 'Streptococcus pyogenes'],
    explanation: 'Também conhecido como Bacilo de Koch, o Mycobacterium tuberculosis ataca principalmente os pulmões.',
    createdAt: Date.now()
  },
  {
    id: 'med7',
    category: 'Medicina',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'A Escala de Cincinnati é utilizada para a avaliação rápida de qual condição?',
    correctAnswer: 'AVC (Acidente Vascular Cerebral)',
    options: ['Infarto', 'AVC (Acidente Vascular Cerebral)', 'Coma', 'Crise Convulsiva'],
    explanation: 'Avalia assimetria facial, queda do braço e fala anormal para identificar um possível AVC.',
    createdAt: Date.now()
  },
  {
    id: 'med8',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A icterícia é caracterizada pelo acúmulo de qual substância no sangue?',
    correctAnswer: 'Bilirrubina',
    options: ['Ureia', 'Creatinina', 'Bilirrubina', 'Glicose'],
    explanation: 'A bilirrubina em excesso causa a coloração amarelada na pele e mucosas.',
    createdAt: Date.now()
  },
  // --- APOIO HOSPITALAR (ADICIONAIS) ---
  {
    id: 'ah3',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a principal finalidade da lavagem das mãos no ambiente hospitalar?',
    correctAnswer: 'Prevenir infecções hospitalares',
    options: ['Apenas por estética', 'Prevenir infecções hospitalares', 'Economizar sabão', 'Cumprir horário'],
    explanation: 'A higienização das mãos é a medida mais simples e importante para evitar a transmissão de germes.',
    createdAt: Date.now()
  },
  {
    id: 'ah4',
    category: 'Apoio Hospitalar',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Resíduos como agulhas e lâminas de bisturi pertencem a qual grupo de risco?',
    correctAnswer: 'Grupo E (Perfurocortantes)',
    options: ['Grupo A', 'Grupo B', 'Grupo D', 'Grupo E (Perfurocortantes)'],
    explanation: 'O Grupo E compreende materiais perfurocortantes ou escarificantes.',
    createdAt: Date.now()
  },
  // --- ESTOMATOLOGIA (ADICIONAIS) ---
  {
    id: 'est3',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O sangramento gengival durante a escovação é um sinal comum de:',
    correctAnswer: 'Gengivite',
    options: ['Cárie', 'Gengivite', 'Fluorose', 'Afta'],
    explanation: 'A gengivite é a inflamação da gengiva causada pelo acúmulo de placa bacteriana.',
    createdAt: Date.now()
  },
  {
    id: 'est4',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O termo "Xerostomia" refere-se a qual condição bucal?',
    correctAnswer: 'Boca seca',
    options: ['Excesso de saliva', 'Boca seca', 'Mau hálito', 'Dente sensível'],
    explanation: 'Xerostomia é a sensação de boca seca, geralmente por redução do fluxo salivar.',
    createdAt: Date.now()
  },
  // --- OUTROS (ADICIONAIS) ---
  {
    id: 'out3',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o primeiro socorro indicado para uma queimadura térmica leve (1º grau)?',
    correctAnswer: 'Lavar com água corrente fria',
    options: ['Passar manteiga', 'Lavar com água corrente fria', 'Colocar gelo direto', 'Passar pasta de dente'],
    explanation: 'A água fria ajuda a resfriar o local e interromper o processo de queimadura.',
    createdAt: Date.now()
  },
  {
    id: 'out4',
    category: 'Outros',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual destes alimentos é uma excelente fonte de fibras alimentares?',
    correctAnswer: 'Aveia',
    options: ['Carne bovina', 'Ovos', 'Aveia', 'Leite'],
    explanation: 'Fibras são encontradas em alimentos de origem vegetal, como cereais integrais, frutas e legumes.',
    createdAt: Date.now()
  },
  {
    id: 'med9',
    category: 'Medicina',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o valor de referência clássico para definir Hipertensão Arterial (estágio 1) em adultos?',
    correctAnswer: '140/90 mmHg',
    options: ['120/80 mmHg', '140/90 mmHg', '110/70 mmHg', '160/100 mmHg'],
    explanation: 'Valores persistentes iguais ou superiores a 140/90 mmHg são geralmente classificados como hipertensão.',
    createdAt: Date.now()
  },
  {
    id: 'med10',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O termo "Polidipsia", comum no Diabetes Mellitus descompensado, refere-se a:',
    correctAnswer: 'Sede excessiva',
    options: ['Fome excessiva', 'Aumento da urina', 'Sede excessiva', 'Perda de peso'],
    explanation: 'Polidipsia é o aumento anormal da sede, um dos sintomas clássicos (4 Ps) do diabetes.',
    createdAt: Date.now()
  },
  {
    id: 'med11_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal agente etiológico da Febre Tifoide?',
    correctAnswer: 'Salmonella typhi',
    options: ['Escherichia coli', 'Salmonella typhi', 'Shigella dysenteriae', 'Vibrio cholerae'],
    explanation: 'A febre tifoide é uma doença sistêmica grave causada pela bactéria Salmonella typhi.',
    createdAt: Date.now()
  },
  {
    id: 'med12_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão da Hepatite A?',
    correctAnswer: 'Fecal-oral',
    options: ['Parenteral (sangue)', 'Sexual', 'Fecal-oral', 'Vertical (mãe para filho)'],
    explanation: 'A Hepatite A é transmitida principalmente pela ingestão de água ou alimentos contaminados.',
    createdAt: Date.now()
  },
  {
    id: 'med13_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O sinal de Murphy positivo durante a palpação abdominal sugere:',
    correctAnswer: 'Colecistite Aguda',
    options: ['Apendicite', 'Colecistite Aguda', 'Pancreatite', 'Hepatite'],
    explanation: 'A interrupção da inspiração profunda durante a palpação do ponto cístico indica inflamação da vesícula biliar.',
    createdAt: Date.now()
  },
  {
    id: 'med14_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma do Glaucoma de ângulo aberto em estágios iniciais?',
    correctAnswer: 'Assintomático',
    options: ['Dor ocular intensa', 'Visão turva súbita', 'Assintomático', 'Vermelhidão ocular'],
    explanation: 'O glaucoma de ângulo aberto é frequentemente silencioso, progredindo sem sintomas até estágios avançados.',
    createdAt: Date.now()
  },
  {
    id: 'med15_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de cegueira evitável no mundo?',
    correctAnswer: 'Catarata',
    options: ['Glaucoma', 'Catarata', 'Retinopatia Diabética', 'Tracoma'],
    explanation: 'A catarata é a opacificação do cristalino, reversível através de cirurgia.',
    createdAt: Date.now()
  },
  {
    id: 'med16_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal fator de risco para o desenvolvimento de Câncer de Pulmão?',
    correctAnswer: 'Tabagismo',
    options: ['Poluição do ar', 'Exposição ao radônio', 'Tabagismo', 'Genética'],
    explanation: 'O tabagismo é responsável por cerca de 85-90% dos casos de câncer de pulmão.',
    createdAt: Date.now()
  },
  {
    id: 'med17_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a tríade clássica da Meningite Bacteriana?',
    correctAnswer: 'Febre, cefaleia e rigidez de nuca',
    options: ['Febre, tosse e dispneia', 'Febre, cefaleia e rigidez de nuca', 'Vômitos, diarreia e dor abdominal', 'Confusão mental, hipotensão e febre'],
    explanation: 'Estes três sinais estão presentes na maioria dos pacientes com meningite aguda.',
    createdAt: Date.now()
  },
  {
    id: 'med18_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal hormônio produzido pela glândula Tireoide?',
    correctAnswer: 'Tiroxina (T4)',
    options: ['Insulina', 'Cortisol', 'Tiroxina (T4)', 'Adrenalina'],
    explanation: 'A tireoide produz T4 e T3, essenciais para a regulação do metabolismo.',
    createdAt: Date.now()
  },
  {
    id: 'med19_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A deficiência de qual vitamina causa o Escorbuto?',
    correctAnswer: 'Vitamina C',
    options: ['Vitamina A', 'Vitamina B12', 'Vitamina C', 'Vitamina D'],
    explanation: 'O escorbuto é caracterizado por sangramento gengival e fraqueza, devido à falta de ácido ascórbico.',
    createdAt: Date.now()
  },
  {
    id: 'med20_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Insuficiência Cardíaca em Angola?',
    correctAnswer: 'Hipertensão Arterial',
    options: ['Doença Coronária', 'Hipertensão Arterial', 'Valvulopatias', 'Miocardiopatia Alcoólica'],
    explanation: 'A hipertensão não controlada é o maior fator de risco para IC na região.',
    createdAt: Date.now()
  },
  {
    id: 'med21_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Anemia Falciforme"?',
    correctAnswer: 'Presença de Hemoglobina S que deforma as hemácias',
    options: ['Falta de ferro no sangue', 'Presença de Hemoglobina S que deforma as hemácias', 'Destruição de hemácias por anticorpos', 'Falta de vitamina B12'],
    explanation: 'É uma doença genética onde as hemácias assumem formato de foice em condições de baixo oxigênio.',
    createdAt: Date.now()
  },
  {
    id: 'med22_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal agente causador da Pneumonia Típica na comunidade?',
    correctAnswer: 'Streptococcus pneumoniae',
    options: ['Mycoplasma pneumoniae', 'Streptococcus pneumoniae', 'Klebsiella pneumoniae', 'Haemophilus influenzae'],
    explanation: 'O pneumococo é a bactéria mais comum em pneumonias adquiridas na comunidade.',
    createdAt: Date.now()
  },
  {
    id: 'med23_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o tratamento de escolha para a Malária não complicada por P. falciparum em Angola?',
    correctAnswer: 'Artemisinina (ACT)',
    options: ['Cloroquina', 'Artemisinina (ACT)', 'Quinino', 'Doxiciclina'],
    explanation: 'As terapias combinadas à base de artemisinina são o padrão atual devido à resistência à cloroquina.',
    createdAt: Date.now()
  },
  {
    id: 'med24_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal complicação da Cirrose Hepática?',
    correctAnswer: 'Hipertensão Portal',
    options: ['Diabetes', 'Hipertensão Portal', 'Hipotireoidismo', 'Anemia Ferropriva'],
    explanation: 'A hipertensão portal leva a varizes esofágicas e ascite.',
    createdAt: Date.now()
  },
  {
    id: 'med25_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Angina de Peito?',
    correctAnswer: 'Dor retroesternal opressiva que irradia para o braço esquerdo',
    options: ['Dor abdominal aguda', 'Dor retroesternal opressiva que irradia para o braço esquerdo', 'Cefaleia intensa', 'Tosse seca'],
    explanation: 'A angina reflete a isquemia miocárdica temporária.',
    createdAt: Date.now()
  },
  {
    id: 'med26_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Acidente Vascular Cerebral (AVC) Hemorrágico?',
    correctAnswer: 'Hipertensão Arterial Sistêmica',
    options: ['Tabagismo', 'Hipertensão Arterial Sistêmica', 'Diabetes', 'Sedentarismo'],
    explanation: 'Picos hipertensivos podem causar a ruptura de pequenos vasos cerebrais.',
    createdAt: Date.now()
  },
  {
    id: 'med27_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal hormônio envolvido na regulação do cálcio no sangue?',
    correctAnswer: 'Paratormônio (PTH)',
    options: ['Calcitonina', 'Paratormônio (PTH)', 'Vitamina D', 'Insulina'],
    explanation: 'O PTH aumenta os níveis de cálcio plasmático retirando-o dos ossos e aumentando a absorção renal.',
    createdAt: Date.now()
  },
  {
    id: 'med28_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Insuficiência Renal Crônica no mundo?',
    correctAnswer: 'Diabetes Mellitus e Hipertensão',
    options: ['Glomerulonefrites', 'Diabetes Mellitus e Hipertensão', 'Cálculos Renais', 'Infecções Urinárias'],
    explanation: 'Diabetes e hipertensão são responsáveis pela maioria dos casos de falência renal terminal.',
    createdAt: Date.now()
  },
  {
    id: 'med29_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal agente causador da Úlcera Péptica?',
    correctAnswer: 'Helicobacter pylori',
    options: ['Staphylococcus', 'Helicobacter pylori', 'Escherichia coli', 'Salmonella'],
    explanation: 'A infecção por H. pylori está fortemente associada a úlceras gástricas e duodenais.',
    createdAt: Date.now()
  },
  {
    id: 'med30_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Asma Brônquica?',
    correctAnswer: 'Dispneia, sibilância e tosse',
    options: ['Febre e expectoração purulenta', 'Dispneia, sibilância e tosse', 'Dor torácica pleurítica', 'Hemoptise'],
    explanation: 'A asma é uma doença inflamatória crônica das vias aéreas que causa broncoespasmo reversível.',
    createdAt: Date.now()
  },
  {
    id: 'med31_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão do vírus da Raiva?',
    correctAnswer: 'Saliva de animais infectados (mordedura)',
    options: ['Ar', 'Alimentos', 'Saliva de animais infectados (mordedura)', 'Sangue'],
    explanation: 'A raiva é uma zoonose transmitida principalmente pela mordida de cães ou morcegos infectados.',
    createdAt: Date.now()
  },
  {
    id: 'med32_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal marcador sorológico para o diagnóstico de infecção aguda por Hepatite B?',
    correctAnswer: 'HBsAg e Anti-HBc IgM',
    options: ['Anti-HBs', 'HBsAg e Anti-HBc IgM', 'HBeAg', 'Anti-HBe'],
    explanation: 'O HBsAg indica presença do vírus e o Anti-HBc IgM confirma a fase aguda.',
    createdAt: Date.now()
  },
  {
    id: 'med33_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Morte Materna em Angola?',
    correctAnswer: 'Hemorragia Pós-Parto e Eclâmpsia',
    options: ['Infecção Urinária', 'Hemorragia Pós-Parto e Eclâmpsia', 'Diabetes Gestacional', 'Anemia'],
    explanation: 'Complicações hemorrágicas e hipertensivas são as principais causas de mortalidade materna.',
    createdAt: Date.now()
  },
  {
    id: 'med34_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Tuberculose Pulmonar?',
    correctAnswer: 'Tosse persistente por mais de 3 semanas',
    options: ['Febre alta súbita', 'Tosse persistente por mais de 3 semanas', 'Dor abdominal', 'Erupção cutânea'],
    explanation: 'A tosse crônica é o principal sinal de alerta para investigação de TB.',
    createdAt: Date.now()
  },
  {
    id: 'med35_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal agente causador da Cólera?',
    correctAnswer: 'Vibrio cholerae',
    options: ['Salmonella', 'Vibrio cholerae', 'Shigella', 'Giardia'],
    explanation: 'O vibrião colérico causa diarreia aquosa profusa ("água de arroz").',
    createdAt: Date.now()
  },
  {
    id: 'med36_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função da Insulina?',
    correctAnswer: 'Facilitar a entrada de glicose nas células',
    options: ['Aumentar a glicose no sangue', 'Facilitar a entrada de glicose nas células', 'Produzir glicose no fígado', 'Quebrar gorduras'],
    explanation: 'A insulina é um hormônio anabólico que reduz a glicemia.',
    createdAt: Date.now()
  },
  {
    id: 'med37_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Cegueira em pacientes diabéticos?',
    correctAnswer: 'Retinopatia Diabética',
    options: ['Catarata', 'Glaucoma', 'Retinopatia Diabética', 'Descolamento de retina'],
    explanation: 'O excesso de glicose danifica os pequenos vasos da retina.',
    createdAt: Date.now()
  },
  {
    id: 'med38_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma do Hipotireoidismo?',
    correctAnswer: 'Cansaço, intolerância ao frio e ganho de peso',
    options: ['Agitação e perda de peso', 'Cansaço, intolerância ao frio e ganho de peso', 'Diarréia crônica', 'Taquicardia'],
    explanation: 'O metabolismo fica lentificado devido à falta de hormônios tireoidianos.',
    createdAt: Date.now()
  },
  {
    id: 'med39_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão da Sífilis?',
    correctAnswer: 'Sexual',
    options: ['Ar', 'Alimentos', 'Sexual', 'Picada de inseto'],
    explanation: 'A sífilis é uma Infecção Sexualmente Transmissível (IST) causada pelo Treponema pallidum.',
    createdAt: Date.now()
  },
  {
    id: 'med40_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Apendicite Aguda?',
    correctAnswer: 'Dor que inicia na região umbilical e migra para a fossa ilíaca direita',
    options: ['Dor no estômago após comer', 'Dor que inicia na região umbilical e migra para a fossa ilíaca direita', 'Dor lombar que irradia para a perna', 'Dor ao urinar'],
    explanation: 'A migração da dor é um sinal clínico clássico de apendicite.',
    createdAt: Date.now()
  },
  {
    id: 'med41_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal agente causador da Gonorreia?',
    correctAnswer: 'Neisseria gonorrhoeae',
    options: ['Chlamydia trachomatis', 'Neisseria gonorrhoeae', 'Treponema pallidum', 'Gardnerella vaginalis'],
    explanation: 'A gonorreia é causada pelo gonococo, um diplococo Gram-negativo.',
    createdAt: Date.now()
  },
  {
    id: 'med42_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Anemia Ferropriva?',
    correctAnswer: 'Perda sanguínea crônica ou baixa ingestão de ferro',
    options: ['Falta de vitamina C', 'Perda sanguínea crônica ou baixa ingestão de ferro', 'Destruição de hemácias', 'Problemas na medula óssea'],
    explanation: 'A carência de ferro impede a formação adequada da hemoglobina.',
    createdAt: Date.now()
  },
  {
    id: 'med43_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Insuficiência Cardíaca Esquerda?',
    correctAnswer: 'Dispneia (falta de ar) e ortopneia',
    options: ['Edema de membros inferiores', 'Dispneia (falta de ar) e ortopneia', 'Aumento do fígado', 'Turgência jugular'],
    explanation: 'O acúmulo de sangue nos pulmões causa congestão pulmonar e falta de ar.',
    createdAt: Date.now()
  },
  {
    id: 'med44_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função do Fígado no metabolismo?',
    correctAnswer: 'Desintoxicação e produção de proteínas plasmáticas',
    options: ['Produção de insulina', 'Desintoxicação e produção de proteínas plasmáticas', 'Filtração do sangue para urina', 'Produção de glóbulos vermelhos'],
    explanation: 'O fígado é a principal "usina" metabólica do corpo.',
    createdAt: Date.now()
  },
  {
    id: 'med45_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Doença de Alzheimer?',
    correctAnswer: 'Perda progressiva da memória recente',
    options: ['Tremores em repouso', 'Perda progressiva da memória recente', 'Fraqueza muscular', 'Perda da visão'],
    explanation: 'O Alzheimer é a causa mais comum de demência em idosos.',
    createdAt: Date.now()
  },
  {
    id: 'med46_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão da Meningite Meningocócica?',
    correctAnswer: 'Gotículas respiratórias',
    options: ['Alimentos', 'Água', 'Gotículas respiratórias', 'Picada de inseto'],
    explanation: 'A transmissão ocorre pelo contato próximo com secreções respiratórias.',
    createdAt: Date.now()
  },
  {
    id: 'med47_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma do Infarto Agudo do Miocárdio em idosos ou diabéticos?',
    correctAnswer: 'Pode ser atípico (falta de ar ou mal-estar sem dor clássica)',
    options: ['Sempre dor intensa no peito', 'Pode ser atípico (falta de ar ou mal-estar sem dor clássica)', 'Sempre desmaio', 'Sempre vômitos'],
    explanation: 'Nestes grupos, o infarto pode ocorrer de forma "silenciosa" ou com sintomas vagos.',
    createdAt: Date.now()
  },
  {
    id: 'med48_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função dos Rins?',
    correctAnswer: 'Excreção de resíduos metabólicos e regulação hídrica',
    options: ['Produção de bile', 'Excreção de resíduos metabólicos e regulação hídrica', 'Digestão de proteínas', 'Produção de anticorpos'],
    explanation: 'Os rins filtram o sangue e mantêm o equilíbrio eletrolítico e ácido-básico.',
    createdAt: Date.now()
  },
  {
    id: 'med49_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Hiperplasia Benigna da Próstata?',
    correctAnswer: 'Dificuldade para iniciar a micção e jato urinário fraco',
    options: ['Dor lombar intensa', 'Dificuldade para iniciar a micção e jato urinário fraco', 'Sangue na urina', 'Febre alta'],
    explanation: 'O aumento da próstata comprime a uretra, dificultando a saída da urina.',
    createdAt: Date.now()
  },
  {
    id: 'med50_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Osteoporose em mulheres após a menopausa?',
    correctAnswer: 'Queda nos níveis de Estrogênio',
    options: ['Falta de exercício', 'Queda nos níveis de Estrogênio', 'Excesso de cálcio', 'Uso de antibióticos'],
    explanation: 'O estrogênio tem um papel protetor na manutenção da densidade óssea.',
    createdAt: Date.now()
  },
  {
    id: 'med51_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Catarata?',
    correctAnswer: 'Visão embaçada ou "nublada" progressiva',
    options: ['Dor ocular', 'Visão embaçada ou "nublada" progressiva', 'Perda súbita da visão', 'Olhos vermelhos'],
    explanation: 'A catarata causa a perda da transparência do cristalino.',
    createdAt: Date.now()
  },
  {
    id: 'med52_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal agente causador da Escabiose (Sarna)?',
    correctAnswer: 'Sarcoptes scabiei',
    options: ['Pediculus humanus', 'Sarcoptes scabiei', 'Pulex irritans', 'Tinea corporis'],
    explanation: 'A sarna é causada por um ácaro que escava túneis na pele.',
    createdAt: Date.now()
  },
  {
    id: 'med53_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função do Pâncreas Exócrino?',
    correctAnswer: 'Produção de enzimas digestivas',
    options: ['Produção de insulina', 'Produção de enzimas digestivas', 'Produção de bile', 'Produção de adrenalina'],
    explanation: 'O pâncreas exócrino secreta o suco pancreático no duodeno.',
    createdAt: Date.now()
  },
  {
    id: 'med54_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Doença de Refluxo Gastroesofágico (DRGE)?',
    correctAnswer: 'Pirose (azia) e regurgitação ácida',
    options: ['Diarreia', 'Pirose (azia) e regurgitação ácida', 'Vômitos com sangue', 'Dor ao engolir'],
    explanation: 'O retorno do conteúdo gástrico para o esôfago causa irritação e queimação.',
    createdAt: Date.now()
  },
  {
    id: 'med55_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa de Embolia Pulmonar?',
    correctAnswer: 'Trombose Venosa Profunda (TVP) nos membros inferiores',
    options: ['Pneumonia', 'Trombose Venosa Profunda (TVP) nos membros inferiores', 'Asma', 'Tabagismo'],
    explanation: 'Um coágulo se desprende das veias das pernas e viaja até os pulmões.',
    createdAt: Date.now()
  },
  {
    id: 'med56_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Anemia Megaloblástica?',
    correctAnswer: 'Cansaço e alterações neurológicas (se falta B12)',
    options: ['Sangramentos', 'Cansaço e alterações neurológicas (se falta B12)', 'Febre', 'Dor nas articulações'],
    explanation: 'A falta de B12 ou ácido fólico afeta a produção de DNA e a integridade dos nervos.',
    createdAt: Date.now()
  },
  {
    id: 'med57_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão da Hepatite C?',
    correctAnswer: 'Parenteral (sangue contaminado)',
    options: ['Fecal-oral', 'Parenteral (sangue contaminado)', 'Ar', 'Alimentos'],
    explanation: 'A transmissão ocorre principalmente por compartilhamento de agulhas ou transfusões antes de 1992.',
    createdAt: Date.now()
  },
  {
    id: 'med58_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma do Lúpus Eritematoso Sistêmico (LES)?',
    correctAnswer: 'Mancha em "asa de borboleta" no rosto e dores articulares',
    options: ['Tosse crônica', 'Mancha em "asa de borboleta" no rosto e dores articulares', 'Perda de audição', 'Aumento da sede'],
    explanation: 'O LES é uma doença autoimune multissistêmica crônica.',
    createdAt: Date.now()
  },
  {
    id: 'med59_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função do Baço?',
    correctAnswer: 'Filtração do sangue e remoção de hemácias velhas',
    options: ['Produção de bile', 'Filtração do sangue e remoção de hemácias velhas', 'Digestão de gorduras', 'Produção de insulina'],
    explanation: 'O baço atua como um filtro biológico e órgão linfoide.',
    createdAt: Date.now()
  },
  {
    id: 'med60_new',
    category: 'Medicina',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal sintoma da Insuficiência Venosa Crônica?',
    correctAnswer: 'Varizes, edema e sensação de peso nas pernas',
    options: ['Dor ao caminhar que melhora ao parar', 'Varizes, edema e sensação de peso nas pernas', 'Pés frios e pálidos', 'Perda de pelos nas pernas'],
    explanation: 'A falha das válvulas venosas causa o acúmulo de sangue nas pernas.',
    createdAt: Date.now()
  },
  {
    id: 'ah5',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Ao transportar um paciente em cadeira de rodas, qual a posição correta ao entrar em um elevador?',
    correctAnswer: 'Entrar de costas (puxando a cadeira)',
    options: ['Entrar de frente', 'Entrar de costas (puxando a cadeira)', 'O paciente deve entrar sozinho', 'Tanto faz'],
    explanation: 'Entrar de costas garante maior segurança e controle sobre a cadeira durante o movimento do elevador.',
    createdAt: Date.now()
  },
  {
    id: 'ah6_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal função do maqueiro no ambiente hospitalar?',
    correctAnswer: 'Transporte seguro de pacientes entre setores',
    options: ['Realizar curativos', 'Transporte seguro de pacientes entre setores', 'Administrar medicamentos', 'Limpar o chão'],
    explanation: 'O maqueiro é responsável pela locomoção de pacientes que não podem deambular.',
    createdAt: Date.now()
  },
  {
    id: 'ah7_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o procedimento correto ao encontrar um derrame de líquido biológico no chão?',
    correctAnswer: 'Isolar a área e chamar a equipe de limpeza especializada',
    options: ['Limpar com papel toalha comum', 'Isolar a área e chamar a equipe de limpeza especializada', 'Ignorar e continuar o trabalho', 'Jogar água por cima'],
    explanation: 'Líquidos biológicos são potenciais fontes de infecção e exigem protocolos de limpeza específicos.',
    createdAt: Date.now()
  },
  {
    id: 'ah8_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que significa a sigla EPI?',
    correctAnswer: 'Equipamento de Proteção Individual',
    options: ['Equipamento de Proteção Interna', 'Equipamento de Proteção Individual', 'Exame de Pequena Intensidade', 'Equipe de Pronto Intervenção'],
    explanation: 'EPIs são dispositivos usados pelo trabalhador para proteção contra riscos à segurança e saúde.',
    createdAt: Date.now()
  },
  {
    id: 'ah9_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a cor do saco de lixo utilizado para resíduos infectantes (biológicos)?',
    correctAnswer: 'Branco leitoso',
    options: ['Preto', 'Azul', 'Branco leitoso', 'Verde'],
    explanation: 'O saco branco leitoso identifica resíduos que apresentam risco biológico.',
    createdAt: Date.now()
  },
  {
    id: 'ah10_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal via de transmissão de microrganismos pelas mãos?',
    correctAnswer: 'Contato direto e indireto',
    options: ['Apenas pelo ar', 'Contato direto e indireto', 'Apenas pela água', 'Apenas pelo suor'],
    explanation: 'As mãos são o principal veículo de transmissão de infecções no hospital.',
    createdAt: Date.now()
  },
  {
    id: 'ah11_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o tempo mínimo recomendado para a fricção das mãos com álcool gel?',
    correctAnswer: '20 a 30 segundos',
    options: ['5 segundos', '10 segundos', '20 a 30 segundos', '1 minuto'],
    explanation: 'A fricção deve durar até que as mãos estejam secas para garantir a eficácia.',
    createdAt: Date.now()
  },
  {
    id: 'ah12_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a finalidade do uso de luvas de procedimento?',
    correctAnswer: 'Proteção do profissional contra contato com fluidos biológicos',
    options: ['Substituir a lavagem das mãos', 'Proteção do profissional contra contato com fluidos biológicos', 'Apenas para manter as mãos limpas', 'Para não deixar impressões digitais'],
    explanation: 'As luvas são uma barreira de proteção, mas não eliminam a necessidade de lavar as mãos.',
    createdAt: Date.now()
  },
  {
    id: 'ah13_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Onde devem ser descartadas as agulhas usadas?',
    correctAnswer: 'Em coletores rígidos para perfurocortantes (Descarpack)',
    options: ['No lixo comum', 'No saco de lixo infectante', 'Em coletores rígidos para perfurocortantes (Descarpack)', 'Na pia'],
    explanation: 'Materiais perfurocortantes exigem recipientes resistentes a furos e vazamentos.',
    createdAt: Date.now()
  },
  {
    id: 'ah14_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao transportar um paciente em maca?',
    correctAnswer: 'Manter as grades laterais sempre elevadas',
    options: ['Correr nos corredores', 'Manter as grades laterais sempre elevadas', 'Deixar o paciente sozinho na maca', 'Transportar com a maca na altura máxima'],
    explanation: 'As grades elevadas previnem quedas durante o transporte.',
    createdAt: Date.now()
  },
  {
    id: 'ah15_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal regra de etiqueta no ambiente hospitalar?',
    correctAnswer: 'Manter o silêncio e falar em tom baixo',
    options: ['Falar alto para ser ouvido', 'Manter o silêncio e falar em tom baixo', 'Usar perfumes fortes', 'Correr para mostrar agilidade'],
    explanation: 'O silêncio é fundamental para o repouso e recuperação dos pacientes.',
    createdAt: Date.now()
  },
  {
    id: 'ah16_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função da recepção hospitalar?',
    correctAnswer: 'Acolhimento, identificação e encaminhamento de pacientes e visitantes',
    options: ['Realizar diagnósticos médicos', 'Acolhimento, identificação e encaminhamento de pacientes e visitantes', 'Administrar medicamentos', 'Limpar as enfermarias'],
    explanation: 'A recepção é a porta de entrada e organização do fluxo na unidade.',
    createdAt: Date.now()
  },
  {
    id: 'ah17_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que deve ser verificado na pulseira de identificação do paciente antes de qualquer transporte?',
    correctAnswer: 'O nome completo e a data de nascimento',
    options: ['Apenas a cor da pulseira', 'O nome completo e a data de nascimento', 'O número do quarto apenas', 'A religião do paciente'],
    explanation: 'A conferência de dois identificadores previne erros de identificação.',
    createdAt: Date.now()
  },
  {
    id: 'ah18_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o procedimento correto ao retirar luvas contaminadas?',
    correctAnswer: 'Retirar pelo avesso, sem tocar a parte externa com a pele',
    options: ['Puxar pelos dedos com força', 'Retirar pelo avesso, sem tocar a parte externa com a pele', 'Lavar as luvas antes de tirar', 'Soprar dentro da luva'],
    explanation: 'A técnica correta evita a autocontaminação das mãos.',
    createdAt: Date.now()
  },
  {
    id: 'ah19_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância do uso de calçados fechados no hospital?',
    correctAnswer: 'Proteção contra quedas de materiais e fluidos biológicos',
    options: ['Apenas por padrão de uniforme', 'Proteção contra quedas de materiais e fluidos biológicos', 'Para não fazer barulho', 'Para cansar menos'],
    explanation: 'Calçados fechados são itens de segurança obrigatórios em áreas assistenciais.',
    createdAt: Date.now()
  },
  {
    id: 'ah20_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do serviço de nutrição hospitalar?',
    correctAnswer: 'Preparar e distribuir dietas adequadas às necessidades dos pacientes',
    options: ['Vender lanches para visitantes', 'Preparar e distribuir dietas adequadas às necessidades dos pacientes', 'Limpar a cozinha apenas', 'Decidir quais remédios o paciente toma'],
    explanation: 'A dieta hospitalar é parte integrante do tratamento do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'ah21_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza o lixo comum (Grupo D) no hospital?',
    correctAnswer: 'Resíduos que não apresentam risco biológico, químico ou radiológico',
    options: ['Agulhas e seringas', 'Resíduos que não apresentam risco biológico, químico ou radiológico', 'Restos de órgãos', 'Medicamentos vencidos'],
    explanation: 'Papéis de escritório, restos de comida (não de pacientes em isolamento) e embalagens limpas são lixo comum.',
    createdAt: Date.now()
  },
  {
    id: 'ah22_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao auxiliar um paciente a sentar na cadeira de rodas?',
    correctAnswer: 'Travar as rodas da cadeira antes do paciente sentar',
    options: ['Deixar a cadeira solta para facilitar o movimento', 'Travar as rodas da cadeira antes do paciente sentar', 'Segurar o paciente apenas pelos braços', 'Fazer o movimento o mais rápido possível'],
    explanation: 'Travar as rodas evita que a cadeira deslize, prevenindo quedas.',
    createdAt: Date.now()
  },
  {
    id: 'ah23_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de manter os corredores hospitalares desobstruídos?',
    correctAnswer: 'Facilitar a circulação rápida em emergências e evitar acidentes',
    options: ['Apenas para facilitar a limpeza', 'Facilitar a circulação rápida em emergências e evitar acidentes', 'Para o hospital parecer maior', 'Para os pacientes poderem caminhar'],
    explanation: 'Corredores livres são essenciais para a segurança e agilidade no atendimento.',
    createdAt: Date.now()
  },
  {
    id: 'ah24_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do serviço de lavanderia hospitalar?',
    correctAnswer: 'Processamento e higienização de roupas e enxovais hospitalares',
    options: ['Lavar as roupas dos funcionários', 'Processamento e higienização de roupas e enxovais hospitalares', 'Vender roupas novas', 'Limpar os quartos'],
    explanation: 'A lavanderia garante o suprimento de roupas limpas e seguras para uso.',
    createdAt: Date.now()
  },
  {
    id: 'ah25_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Higienização das Mãos"?',
    correctAnswer: 'Termo geral que engloba a lavagem com água e sabão ou uso de álcool',
    options: ['Apenas lavar com água', 'Termo geral que engloba a lavagem com água e sabão ou uso de álcool', 'Usar apenas luvas', 'Passar creme nas mãos'],
    explanation: 'É a medida primordial para o controle de infecções.',
    createdAt: Date.now()
  },
  {
    id: 'ah26_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do auxiliar de serviços gerais no hospital?',
    correctAnswer: 'Manutenção da limpeza e desinfecção das áreas hospitalares',
    options: ['Realizar cirurgias', 'Manutenção da limpeza e desinfecção das áreas hospitalares', 'Prescrever dietas', 'Transportar oxigênio apenas'],
    explanation: 'A limpeza adequada é vital para reduzir a carga microbiana no ambiente.',
    createdAt: Date.now()
  },
  {
    id: 'ah27_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao entrar em um quarto de isolamento respiratório?',
    correctAnswer: 'Usar máscara específica (como a N95) conforme orientação',
    options: ['Entrar sem proteção se for rápido', 'Usar máscara específica (como a N95) conforme orientação', 'Usar apenas luvas', 'Não precisa de proteção se o paciente estiver dormindo'],
    explanation: 'O isolamento respiratório exige barreiras contra aerossóis ou gotículas.',
    createdAt: Date.now()
  },
  {
    id: 'ah28_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de usar o crachá de identificação no hospital?',
    correctAnswer: 'Identificar o profissional e sua função para segurança de todos',
    options: ['Apenas por estética', 'Identificar o profissional e sua função para segurança de todos', 'Para entrar no refeitório', 'Para marcar o ponto'],
    explanation: 'A identificação clara promove a segurança do paciente e o controle de acesso.',
    createdAt: Date.now()
  },
  {
    id: 'ah29_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função da farmácia hospitalar?',
    correctAnswer: 'Gestão, armazenamento e dispensação de medicamentos e materiais médicos',
    options: ['Vender remédios para o público externo', 'Gestão, armazenamento e dispensação de medicamentos e materiais médicos', 'Realizar exames de sangue', 'Limpar os frascos de remédio'],
    explanation: 'A farmácia garante que o medicamento certo chegue ao paciente certo na hora certa.',
    createdAt: Date.now()
  },
  {
    id: 'ah30_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que deve ser feito com um material estéril que caiu no chão?',
    correctAnswer: 'Considerar contaminado e não utilizar',
    options: ['Limpar com álcool e usar', 'Considerar contaminado e não utilizar', 'Usar se a embalagem não rasgou', 'Soprar e usar'],
    explanation: 'A integridade da esterilidade é perdida com o impacto ou contato com superfícies não estéreis.',
    createdAt: Date.now()
  },
  {
    id: 'ah31_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do serviço de arquivo médico (SAME)?',
    correctAnswer: 'Organização e guarda dos prontuários e históricos dos pacientes',
    options: ['Vender livros médicos', 'Organização e guarda dos prontuários e históricos dos pacientes', 'Fazer o registro de óbitos apenas', 'Limpar as salas dos médicos'],
    explanation: 'O prontuário é um documento legal e clínico essencial.',
    createdAt: Date.now()
  },
  {
    id: 'ah32_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao lidar com um acompanhante agressivo?',
    correctAnswer: 'Manter a calma, não revidar e solicitar apoio da segurança se necessário',
    options: ['Gritar de volta', 'Manter a calma, não revidar e solicitar apoio da segurança se necessário', 'Ignorar completamente', 'Expulsar à força sozinho'],
    explanation: 'A gestão de conflitos deve priorizar a segurança e a desescalada da situação.',
    createdAt: Date.now()
  },
  {
    id: 'ah33_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função da central de material e esterilização (CME)?',
    correctAnswer: 'Processamento de artigos odonto-médico-hospitalares',
    options: ['Lavar as mãos dos médicos', 'Processamento de artigos odonto-médico-hospitalares', 'Vender materiais cirúrgicos', 'Limpar o centro cirúrgico apenas'],
    explanation: 'A CME é responsável por limpar, preparar e esterilizar materiais reutilizáveis.',
    createdAt: Date.now()
  },
  {
    id: 'ah34_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza a "Limpeza Concorrente"?',
    correctAnswer: 'Limpeza diária realizada enquanto o paciente está ocupando o leito',
    options: ['Limpeza após a alta do paciente', 'Limpeza diária realizada enquanto o paciente está ocupando o leito', 'Limpeza pesada do teto', 'Limpeza apenas do banheiro'],
    explanation: 'Visa manter o ambiente limpo e organizado durante a internação.',
    createdAt: Date.now()
  },
  {
    id: 'ah35_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza a "Limpeza Terminal"?',
    correctAnswer: 'Limpeza completa realizada após a alta, óbito ou transferência do paciente',
    options: ['Limpeza diária rápida', 'Limpeza completa realizada após a alta, óbito ou transferência do paciente', 'Limpeza apenas do chão', 'Limpeza realizada pelo próprio paciente'],
    explanation: 'É uma desinfecção rigorosa para preparar o leito para o próximo paciente.',
    createdAt: Date.now()
  },
  {
    id: 'ah36_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do serviço de manutenção hospitalar?',
    correctAnswer: 'Garantir o funcionamento de equipamentos, instalações elétricas e hidráulicas',
    options: ['Consertar apenas carros do hospital', 'Garantir o funcionamento de equipamentos, instalações elétricas e hidráulicas', 'Limpar os jardins', 'Administrar o oxigênio'],
    explanation: 'A infraestrutura hospitalar deve estar sempre operacional para a segurança do atendimento.',
    createdAt: Date.now()
  },
  {
    id: 'ah37_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de seguir as normas de biossegurança?',
    correctAnswer: 'Proteger a saúde do trabalhador, do paciente e o meio ambiente',
    options: ['Apenas para evitar multas', 'Proteger a saúde do trabalhador, do paciente e o meio ambiente', 'Para o hospital economizar', 'Para os funcionários trabalharem menos'],
    explanation: 'Biossegurança é o conjunto de ações voltadas para a prevenção de riscos.',
    createdAt: Date.now()
  },
  {
    id: 'ah38_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do serviço social no hospital?',
    correctAnswer: 'Orientar e apoiar pacientes e famílias em questões sociais e direitos',
    options: ['Dar dinheiro para os pacientes', 'Orientar e apoiar pacientes e famílias em questões sociais e direitos', 'Realizar partos', 'Limpar as salas de espera'],
    explanation: 'O assistente social atua na interface entre a saúde e as questões sociais do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'ah39_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que deve ser feito se um maqueiro sofrer um acidente com material perfurocortante?',
    correctAnswer: 'Lavar o local, comunicar a chefia e procurar atendimento médico imediato',
    options: ['Ignorar se o corte for pequeno', 'Lavar o local, comunicar a chefia e procurar atendimento médico imediato', 'Passar apenas álcool e continuar trabalhando', 'Esconder o acidente por medo de demissão'],
    explanation: 'Acidentes com biológicos exigem protocolo de profilaxia pós-exposição.',
    createdAt: Date.now()
  },
  {
    id: 'ah40_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do serviço de vigilância/segurança hospitalar?',
    correctAnswer: 'Zelar pela integridade física de pessoas e do patrimônio da instituição',
    options: ['Controlar a entrada de medicamentos', 'Zelar pela integridade física de pessoas e do patrimônio da instituição', 'Realizar a triagem médica', 'Limpar os estacionamentos'],
    explanation: 'A segurança garante um ambiente tranquilo para o trabalho e recuperação.',
    createdAt: Date.now()
  },
  {
    id: 'ah41_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao transportar um cilindro de oxigênio?',
    correctAnswer: 'Usar carrinho apropriado e manter o cilindro na vertical e fixado',
    options: ['Rolar o cilindro pelo chão', 'Usar carrinho apropriado e manter o cilindro na vertical e fixado', 'Carregar no colo', 'Transportar deitado na maca com o paciente'],
    explanation: 'O transporte seguro evita quedas e explosões de gases sob pressão.',
    createdAt: Date.now()
  },
  {
    id: 'ah42_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do faturamento hospitalar?',
    correctAnswer: 'Processamento das contas hospitalares para recebimento de pagamentos',
    options: ['Pagar os salários dos médicos', 'Processamento das contas hospitalares para recebimento de pagamentos', 'Comprar alimentos', 'Limpar os escritórios'],
    explanation: 'O faturamento garante a sustentabilidade financeira da instituição.',
    createdAt: Date.now()
  },
  {
    id: 'ah43_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza o "Resíduo Químico" (Grupo B) no hospital?',
    correctAnswer: 'Substâncias químicas que podem apresentar risco à saúde ou meio ambiente',
    options: ['Papel e papelão', 'Substâncias químicas que podem apresentar risco à saúde ou meio ambiente', 'Restos de comida', 'Agulhas usadas'],
    explanation: 'Medicamentos vencidos, reveladores de raio-x e desinfetantes são resíduos químicos.',
    createdAt: Date.now()
  },
  {
    id: 'ah44_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a conduta correta ao auxiliar na transferência de um paciente da cama para a maca?',
    correctAnswer: 'Trabalhar em equipe e usar técnicas de ergonomia para evitar lesões na coluna',
    options: ['Fazer força sozinho para mostrar força', 'Trabalhar em equipe e usar técnicas de ergonomia para evitar lesões na coluna', 'Puxar o paciente pelos braços', 'Fazer o movimento sem avisar o paciente'],
    explanation: 'A ergonomia protege o trabalhador de lesões osteomusculares.',
    createdAt: Date.now()
  },
  {
    id: 'ah45_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância da ventilação adequada nos ambientes hospitalares?',
    correctAnswer: 'Reduzir a concentração de microrganismos e odores no ar',
    options: ['Apenas para refrescar os funcionários', 'Reduzir a concentração de microrganismos e odores no ar', 'Para gastar menos energia', 'Para os pacientes não sentirem calor'],
    explanation: 'A renovação do ar é uma medida de controle ambiental de infecções.',
    createdAt: Date.now()
  },
  {
    id: 'ah46_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função da ouvidoria hospitalar?',
    correctAnswer: 'Canal de comunicação para receber sugestões, elogios e reclamações dos usuários',
    options: ['Realizar cirurgias de ouvido', 'Canal de comunicação para receber sugestões, elogios e reclamações dos usuários', 'Consertar aparelhos auditivos', 'Limpar as salas de espera'],
    explanation: 'A ouvidoria auxilia na melhoria contínua dos serviços prestados.',
    createdAt: Date.now()
  },
  {
    id: 'ah47_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que deve ser feito com o lixo infectante após o preenchimento de 2/3 do saco?',
    correctAnswer: 'Fechar o saco, identificar e encaminhar para o abrigo de resíduos',
    options: ['Apertar o lixo para caber mais', 'Fechar o saco, identificar e encaminhar para o abrigo de resíduos', 'Deixar aberto até encher totalmente', 'Jogar no lixo comum'],
    explanation: 'O limite de 2/3 evita rompimentos e facilita o fechamento seguro.',
    createdAt: Date.now()
  },
  {
    id: 'ah48_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do almoxarifado hospitalar?',
    correctAnswer: 'Recebimento, conferência, armazenamento e distribuição de materiais',
    options: ['Lavar os materiais usados', 'Recebimento, conferência, armazenamento e distribuição de materiais', 'Vender materiais para os pacientes', 'Limpar os depósitos apenas'],
    explanation: 'O almoxarifado controla o estoque de insumos necessários ao hospital.',
    createdAt: Date.now()
  },
  {
    id: 'ah49_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância do treinamento contínuo para as equipes de apoio?',
    correctAnswer: 'Atualizar conhecimentos e garantir a segurança e qualidade dos processos',
    options: ['Apenas para cumprir carga horária', 'Atualizar conhecimentos e garantir a segurança e qualidade dos processos', 'Para os funcionários trabalharem mais rápido', 'Para o hospital economizar dinheiro'],
    explanation: 'A educação permanente é essencial para a excelência no serviço hospitalar.',
    createdAt: Date.now()
  },
  {
    id: 'ah50_new',
    category: 'Apoio Hospitalar',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal atitude de um profissional de apoio ao lidar com pacientes?',
    correctAnswer: 'Empatia, respeito e humanização no atendimento',
    options: ['Indiferença', 'Empatia, respeito e humanização no atendimento', 'Pressa e impaciência', 'Falar apenas o necessário'],
    explanation: 'O atendimento humanizado faz parte da assistência integral à saúde.',
    createdAt: Date.now()
  },
  {
    id: 'est5',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a função principal do fio dental na higiene bucal?',
    correctAnswer: 'Remover placa bacteriana entre os dentes',
    options: ['Clarear os dentes', 'Remover placa bacteriana entre os dentes', 'Fortalecer o esmalte', 'Substituir a escovação'],
    explanation: 'O fio dental alcança áreas onde as cerdas da escova não chegam, prevenindo cáries interproximais e doenças gengivais.',
    createdAt: Date.now()
  },
  {
    id: 'est6_new',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal causa da cárie dentária?',
    correctAnswer: 'Ação de ácidos produzidos por bactérias a partir de açúcares',
    options: ['Falta de cálcio apenas', 'Ação de ácidos produzidos por bactérias a partir de açúcares', 'Envelhecimento natural', 'Uso de antibióticos'],
    explanation: 'Bactérias na placa fermentam carboidratos, produzindo ácidos que desmineralizam o esmalte.',
    createdAt: Date.now()
  },
  {
    id: 'est7_new',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o "Tártaro" (Cálculo Dentário)?',
    correctAnswer: 'Placa bacteriana mineralizada e endurecida',
    options: ['Restos de comida endurecidos', 'Placa bacteriana mineralizada e endurecida', 'Manchas de café', 'Esmalte desgastado'],
    explanation: 'O tártaro só pode ser removido profissionalmente através da raspagem.',
    createdAt: Date.now()
  },
  {
    id: 'est8_new',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função do Flúor na saúde bucal?',
    correctAnswer: 'Fortalecer o esmalte e auxiliar na remineralização',
    options: ['Clarear os dentes', 'Fortalecer o esmalte e auxiliar na remineralização', 'Matar todas as bactérias', 'Substituir o fio dental'],
    explanation: 'O flúor torna o dente mais resistente aos ataques ácidos das bactérias.',
    createdAt: Date.now()
  },
  {
    id: 'est9_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Periodontite"?',
    correctAnswer: 'Inflamação que atinge os tecidos de suporte do dente (osso e ligamento)',
    options: ['Apenas sangramento gengival leve', 'Inflamação que atinge os tecidos de suporte do dente (osso e ligamento)', 'Cárie na raiz do dente', 'Sensibilidade ao frio'],
    explanation: 'Diferente da gengivite, a periodontite causa perda óssea e pode levar à perda do dente.',
    createdAt: Date.now()
  },
  {
    id: 'est10_new',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a recomendação de troca da escova de dentes?',
    correctAnswer: 'A cada 3 meses ou quando as cerdas estiverem gastas',
    options: ['Uma vez por ano', 'A cada 3 meses ou quando as cerdas estiverem gastas', 'Apenas quando quebrar', 'A cada 2 anos'],
    explanation: 'Escovas gastas perdem a eficiência e podem acumular mais bactérias.',
    createdAt: Date.now()
  },
  {
    id: 'est11_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Halitose"?',
    correctAnswer: 'Mau hálito persistente',
    options: ['Dor de dente', 'Mau hálito persistente', 'Gengiva inchada', 'Dente torto'],
    explanation: 'A halitose pode ter origem bucal (língua saburrosa, gengivite) ou sistêmica.',
    createdAt: Date.now()
  },
  {
    id: 'est12_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal fator de risco para o Câncer de Boca?',
    correctAnswer: 'Tabagismo e consumo excessivo de álcool',
    options: ['Falta de vitaminas', 'Tabagismo e consumo excessivo de álcool', 'Uso de aparelho ortodôntico', 'Consumo de doces'],
    explanation: 'O fumo e o álcool potencializam o risco de lesões malignas na cavidade oral.',
    createdAt: Date.now()
  },
  {
    id: 'est13_new',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Afta"?',
    correctAnswer: 'Pequena úlcera dolorosa na mucosa bucal',
    options: ['Um tipo de cárie', 'Pequena úlcera dolorosa na mucosa bucal', 'Um dente quebrado', 'Acúmulo de tártaro'],
    explanation: 'Aftas são lesões comuns, não contagiosas, que cicatrizam em 1 a 2 semanas.',
    createdAt: Date.now()
  },
  {
    id: 'est14_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função da polpa dentária?',
    correctAnswer: 'Nutrição e sensibilidade do dente',
    options: ['Apenas dar cor ao dente', 'Nutrição e sensibilidade do dente', 'Proteger contra cáries', 'Mastigar os alimentos'],
    explanation: 'A polpa contém vasos sanguíneos e nervos, sendo a parte "viva" do dente.',
    createdAt: Date.now()
  },
  {
    id: 'est15_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Endodontia"?',
    correctAnswer: 'Especialidade que trata do canal do dente',
    options: ['Tratamento de gengiva', 'Especialidade que trata do canal do dente', 'Colocação de aparelhos', 'Cirurgia de extração'],
    explanation: 'A endodontia foca no tratamento de doenças da polpa dentária.',
    createdAt: Date.now()
  },
  {
    id: 'est16_new',
    category: 'Estomatologia',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o primeiro dente permanente a nascer na maioria das crianças?',
    correctAnswer: 'Primeiro molar permanente',
    options: ['Incisivo central superior', 'Primeiro molar permanente', 'Canino', 'Siso'],
    explanation: 'O primeiro molar nasce por volta dos 6 anos, atrás dos dentes de leite, sem que nenhum caia.',
    createdAt: Date.now()
  },
  {
    id: 'est17_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que caracteriza a "Fluorose Dentária"?',
    correctAnswer: 'Manchas no esmalte por ingestão excessiva de flúor durante a formação dos dentes',
    options: ['Dentes muito brancos e saudáveis', 'Manchas no esmalte por ingestão excessiva de flúor durante a formação dos dentes', 'Cáries causadas por flúor', 'Perda dos dentes'],
    explanation: 'O excesso de flúor na infância pode causar defeitos na mineralização do esmalte.',
    createdAt: Date.now()
  },
  {
    id: 'est18_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos dentes Incisivos?',
    correctAnswer: 'Cortar os alimentos',
    options: ['Rasgar os alimentos', 'Cortar os alimentos', 'Triturar os alimentos', 'Moer os alimentos'],
    explanation: 'Os incisivos têm bordas afiadas para o corte inicial do alimento.',
    createdAt: Date.now()
  },
  {
    id: 'est19_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos dentes Caninos?',
    correctAnswer: 'Rasgar os alimentos',
    options: ['Cortar os alimentos', 'Rasgar os alimentos', 'Triturar os alimentos', 'Moer os alimentos'],
    explanation: 'Os caninos são pontiagudos e fortes, ideais para rasgar alimentos mais resistentes.',
    createdAt: Date.now()
  },
  {
    id: 'est20_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função dos dentes Molares?',
    correctAnswer: 'Triturar e moer os alimentos',
    options: ['Cortar os alimentos', 'Rasgar os alimentos', 'Triturar e moer os alimentos', 'Apenas estética'],
    explanation: 'Os molares possuem superfícies largas para a mastigação final.',
    createdAt: Date.now()
  },
  {
    id: 'est21_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Maloclusão"?',
    correctAnswer: 'Alinhamento incorreto dos dentes e encaixe das arcadas',
    options: ['Uma infecção grave', 'Alinhamento incorreto dos dentes e encaixe das arcadas', 'Falta de dentes', 'Dentes muito grandes'],
    explanation: 'A maloclusão pode afetar a mastigação, fala e estética.',
    createdAt: Date.now()
  },
  {
    id: 'est22_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal causa da sensibilidade dentária?',
    correctAnswer: 'Exposição da dentina por retração gengival ou desgaste do esmalte',
    options: ['Dentes muito limpos', 'Exposição da dentina por retração gengival ou desgaste do esmalte', 'Uso de fio dental', 'Beber muita água'],
    explanation: 'A dentina possui túbulos que levam estímulos diretamente ao nervo.',
    createdAt: Date.now()
  },
  {
    id: 'est23_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o "Abscesso Periapical"?',
    correctAnswer: 'Acúmulo de pus na ponta da raiz do dente por infecção',
    options: ['Uma mancha no dente', 'Acúmulo de pus na ponta da raiz do dente por infecção', 'Gengiva sangrando', 'Dente de leite caindo'],
    explanation: 'Geralmente causado por cárie profunda que atingiu a polpa e necrosou.',
    createdAt: Date.now()
  },
  {
    id: 'est24_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a importância de escovar a língua?',
    correctAnswer: 'Remover a saburra lingual e prevenir o mau hálito',
    options: ['Para a língua ficar mais vermelha', 'Remover a saburra lingual e prevenir o mau hálito', 'Para sentir melhor o gosto', 'Não é necessário escovar a língua'],
    explanation: 'A língua acumula restos de alimentos e bactérias que causam odor.',
    createdAt: Date.now()
  },
  {
    id: 'est25_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Exodontia"?',
    correctAnswer: 'Procedimento cirúrgico para extração de um dente',
    options: ['Limpeza profunda', 'Procedimento cirúrgico para extração de um dente', 'Restauração de cárie', 'Tratamento de canal'],
    explanation: 'É o termo técnico para a remoção de um elemento dentário.',
    createdAt: Date.now()
  },
  {
    id: 'est26_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Ortodontia"?',
    correctAnswer: 'Especialidade que corrige a posição dos dentes e ossos maxilares',
    options: ['Tratamento de crianças apenas', 'Especialidade que corrige a posição dos dentes e ossos maxilares', 'Cirurgia de gengiva', 'Próteses dentárias'],
    explanation: 'Utiliza aparelhos fixos ou removíveis para alinhar o sorriso.',
    createdAt: Date.now()
  },
  {
    id: 'est27_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Odontopediatria"?',
    correctAnswer: 'Especialidade focada no atendimento de crianças e adolescentes',
    options: ['Tratamento de idosos', 'Especialidade focada no atendimento de crianças e adolescentes', 'Cirurgia de face', 'Tratamento de canal'],
    explanation: 'Cuida da saúde bucal desde o nascimento até a adolescência.',
    createdAt: Date.now()
  },
  {
    id: 'est28_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Prótese Dentária"?',
    correctAnswer: 'Substituição de dentes perdidos por elementos artificiais',
    options: ['Aparelho para alinhar dentes', 'Substituição de dentes perdidos por elementos artificiais', 'Limpeza de tártaro', 'Clareamento dental'],
    explanation: 'Pode ser fixa (coroas, pontes) ou removível (dentaduras).',
    createdAt: Date.now()
  },
  {
    id: 'est29_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o "Bruxismo"?',
    correctAnswer: 'Hábito de ranger ou apertar os dentes, geralmente durante o sono',
    options: ['Medo de dentista', 'Hábito de ranger ou apertar os dentes, geralmente durante o sono', 'Dificuldade de abrir a boca', 'Inflamação da bochecha'],
    explanation: 'Pode causar desgaste nos dentes, dor na mandíbula e cefaleia.',
    createdAt: Date.now()
  },
  {
    id: 'est30_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função da saliva na proteção bucal?',
    correctAnswer: 'Limpeza mecânica, ação antimicrobiana e neutralização de ácidos',
    options: ['Apenas molhar a comida', 'Limpeza mecânica, ação antimicrobiana e neutralização de ácidos', 'Manchar os dentes', 'Causar cáries'],
    explanation: 'A saliva é um fluido protetor essencial para o equilíbrio da boca.',
    createdAt: Date.now()
  },
  {
    id: 'est31_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Gengivoplastia"?',
    correctAnswer: 'Cirurgia plástica para remodelar a gengiva',
    options: ['Tratamento de canal', 'Cirurgia plástica para remodelar a gengiva', 'Extração de siso', 'Limpeza de tártaro'],
    explanation: 'Utilizada para corrigir o "sorriso gengival" ou irregularidades na margem.',
    createdAt: Date.now()
  },
  {
    id: 'est32_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é o "Implante Dentário"?',
    correctAnswer: 'Pino de titânio fixado no osso para substituir a raiz de um dente',
    options: ['Um dente de plástico colado', 'Pino de titânio fixado no osso para substituir a raiz de um dente', 'Um tipo de aparelho', 'Restauração de resina'],
    explanation: 'Serve de suporte para uma coroa protética, devolvendo a função e estética.',
    createdAt: Date.now()
  },
  {
    id: 'est33_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Leucoplasia"?',
    correctAnswer: 'Mancha branca na mucosa que não sai ao ser raspada (potencial pré-maligno)',
    options: ['Uma afta comum', 'Mancha branca na mucosa que não sai ao ser raspada (potencial pré-maligno)', 'Resto de leite na boca', 'Cárie branca'],
    explanation: 'Deve ser avaliada por um profissional para descartar malignidade.',
    createdAt: Date.now()
  },
  {
    id: 'est34_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Candidíase Bucal" (Sapinho)?',
    correctAnswer: 'Infecção fúngica causada pela Candida albicans',
    options: ['Infecção por vírus', 'Infecção fúngica causada pela Candida albicans', 'Falta de higiene apenas', 'Alergia a pasta de dente'],
    explanation: 'Comum em bebês, idosos ou pessoas com imunidade baixa.',
    createdAt: Date.now()
  },
  {
    id: 'est35_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Erosão Dentária"?',
    correctAnswer: 'Perda de tecido dentário por processos químicos sem bactérias (ácidos)',
    options: ['Cárie comum', 'Perda de tecido dentário por processos químicos sem bactérias (ácidos)', 'Quebra por trauma', 'Desgaste por escovação'],
    explanation: 'Causada por alimentos ácidos, refrigerantes ou refluxo gástrico.',
    createdAt: Date.now()
  },
  {
    id: 'est36_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Abrasão Dentária"?',
    correctAnswer: 'Desgaste do dente por processos mecânicos anormais (ex: escovação forte)',
    options: ['Desgaste por ácidos', 'Desgaste do dente por processos mecânicos anormais (ex: escovação forte)', 'Cárie de mamadeira', 'Dente quebrado'],
    explanation: 'O uso de força excessiva ou pastas muito abrasivas pode desgastar o esmalte.',
    createdAt: Date.now()
  },
  {
    id: 'est37_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Atrição Dentária"?',
    correctAnswer: 'Desgaste fisiológico pelo contato dente com dente (mastigação)',
    options: ['Desgaste por ácidos', 'Desgaste fisiológico pelo contato dente com dente (mastigação)', 'Desgaste por escova', 'Cárie'],
    explanation: 'É o desgaste natural que ocorre ao longo da vida.',
    createdAt: Date.now()
  },
  {
    id: 'est38_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Dentística"?',
    correctAnswer: 'Especialidade que trata das restaurações e estética dental',
    options: ['Tratamento de gengiva', 'Especialidade que trata das restaurações e estética dental', 'Cirurgia de siso', 'Tratamento de canal'],
    explanation: 'Focada em devolver a forma e função dos dentes afetados por cáries ou traumas.',
    createdAt: Date.now()
  },
  {
    id: 'est39_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função do Cimento Dentário?',
    correctAnswer: 'Fixação de próteses e proteção da polpa',
    options: ['Apenas tapar buracos', 'Fixação de próteses e proteção da polpa', 'Clarear o dente', 'Substituir o osso'],
    explanation: 'Utilizado para "colar" coroas ou como base sob restaurações.',
    createdAt: Date.now()
  },
  {
    id: 'est40_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Radiografia Periapical"?',
    correctAnswer: 'Raio-X que mostra o dente inteiro, da coroa até a ponta da raiz',
    options: ['Raio-X de todos os dentes juntos', 'Raio-X que mostra o dente inteiro, da coroa até a ponta da raiz', 'Foto colorida do dente', 'Exame de sangue da boca'],
    explanation: 'Essencial para diagnosticar problemas na raiz e osso ao redor.',
    createdAt: Date.now()
  },
  {
    id: 'est41_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Radiografia Panorâmica"?',
    correctAnswer: 'Exame que mostra todos os dentes e ossos da face em uma única imagem',
    options: ['Raio-X de um só dente', 'Exame que mostra todos os dentes e ossos da face em uma única imagem', 'Uma câmera que entra no dente', 'Exame de saliva'],
    explanation: 'Dá uma visão geral da saúde bucal e estruturas adjacentes.',
    createdAt: Date.now()
  },
  {
    id: 'est42_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Gengivite Ulcerativa Necrosante Aguda" (GUNA)?',
    correctAnswer: 'Infecção gengival dolorosa, com necrose das papilas e odor forte',
    options: ['Uma gengivite comum', 'Infecção gengival dolorosa, com necrose das papilas e odor forte', 'Crescimento da gengiva', 'Manchas na gengiva'],
    explanation: 'Associada a estresse severo, má higiene e tabagismo.',
    createdAt: Date.now()
  },
  {
    id: 'est43_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a importância do selante dentário?',
    correctAnswer: 'Proteção das fóssulas e fissuras dos molares contra cáries',
    options: ['Clarear os dentes', 'Proteção das fóssulas e fissuras dos molares contra cáries', 'Endireitar os dentes', 'Substituir a escovação'],
    explanation: 'Uma barreira física aplicada em dentes com anatomia propensa ao acúmulo de placa.',
    createdAt: Date.now()
  },
  {
    id: 'est44_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Biópsia Bucal"?',
    correctAnswer: 'Remoção de um fragmento de tecido para análise laboratorial',
    options: ['Limpeza de tártaro', 'Remoção de um fragmento de tecido para análise laboratorial', 'Extração de dente', 'Tratamento de canal'],
    explanation: 'Fundamental para o diagnóstico definitivo de lesões suspeitas.',
    createdAt: Date.now()
  },
  {
    id: 'est45_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Estomatite"?',
    correctAnswer: 'Inflamação generalizada da mucosa bucal',
    options: ['Dor de estômago', 'Inflamação generalizada da mucosa bucal', 'Inflamação apenas da gengiva', 'Cárie no dente siso'],
    explanation: 'Pode ser causada por vírus, fungos ou reações alérgicas.',
    createdAt: Date.now()
  },
  {
    id: 'est46_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função do Odontólogo Forense?',
    correctAnswer: 'Identificação humana e perícias através dos dentes',
    options: ['Tratar cáries em presos', 'Identificação humana e perícias através dos dentes', 'Limpar dentes de cadáveres apenas', 'Fazer próteses baratas'],
    explanation: 'Atua na área legal, auxiliando a justiça em identificações e crimes.',
    createdAt: Date.now()
  },
  {
    id: 'est47_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Anquilosagem Dentária"?',
    correctAnswer: 'Fusão da raiz do dente ao osso alveolar',
    options: ['Dente muito mole', 'Fusão da raiz do dente ao osso alveolar', 'Dente que não nasceu', 'Cárie na raiz'],
    explanation: 'O dente perde o ligamento periodontal e fica "preso" ao osso.',
    createdAt: Date.now()
  },
  {
    id: 'est48_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Pericoronarite"?',
    correctAnswer: 'Inflamação da gengiva ao redor de um dente parcialmente erupcionado (comum no siso)',
    options: ['Cárie no siso', 'Inflamação da gengiva ao redor de um dente parcialmente erupcionado (comum no siso)', 'Falta de siso', 'Dor na bochecha'],
    explanation: 'Ocorre quando restos de comida e bactérias ficam sob o capuz de gengiva.',
    createdAt: Date.now()
  },
  {
    id: 'est49_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a função da ATM (Articulação Temporomandibular)?',
    correctAnswer: 'Permitir os movimentos de abrir, fechar e lateralidade da boca',
    options: ['Produzir saliva', 'Permitir os movimentos de abrir, fechar e lateralidade da boca', 'Proteger os dentes', 'Sentir o gosto dos alimentos'],
    explanation: 'É a articulação que liga a mandíbula ao crânio.',
    createdAt: Date.now()
  },
  {
    id: 'est50_new',
    category: 'Estomatologia',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O que é a "Odontologia Preventiva"?',
    correctAnswer: 'Foco em evitar o surgimento de doenças bucais através de educação e profilaxia',
    options: ['Tratar apenas cáries grandes', 'Foco em evitar o surgimento de doenças bucais através de educação e profilaxia', 'Extrair dentes ruins', 'Colocar implantes'],
    explanation: 'O objetivo é manter a saúde e evitar tratamentos invasivos.',
    createdAt: Date.now()
  },
  {
    id: 'out6_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal função do sono para o organismo?',
    correctAnswer: 'Restauração física e mental e consolidação da memória',
    options: ['Apenas passar o tempo', 'Restauração física e mental e consolidação da memória', 'Aumentar o cansaço', 'Diminuir a fome'],
    explanation: 'O sono é um processo fisiológico essencial para a manutenção da saúde e funções cognitivas.',
    createdAt: Date.now()
  },
  {
    id: 'out7_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a recomendação diária média de ingestão de água para um adulto saudável?',
    correctAnswer: 'Cerca de 2 a 3 litros',
    options: ['500 ml', '1 litro', 'Cerca de 2 a 3 litros', '5 litros'],
    explanation: 'A hidratação adequada é vital para todas as funções do corpo.',
    createdAt: Date.now()
  },
  {
    id: 'out8_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal fonte de Vitamina D para o ser humano?',
    correctAnswer: 'Exposição solar (raios UVB)',
    options: ['Comer carne', 'Beber leite', 'Exposição solar (raios UVB)', 'Dormir no escuro'],
    explanation: 'A síntese cutânea através do sol é a principal forma de obter vitamina D.',
    createdAt: Date.now()
  },
  {
    id: 'out9_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza o "Sedentarismo"?',
    correctAnswer: 'Falta ou redução de atividades físicas regulares',
    options: ['Comer muito', 'Falta ou redução de atividades físicas regulares', 'Dormir pouco', 'Trabalhar demais'],
    explanation: 'O sedentarismo é um fator de risco para diversas doenças crônicas.',
    createdAt: Date.now()
  },
  {
    id: 'out10_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de uma alimentação colorida?',
    correctAnswer: 'Garante uma maior variedade de nutrientes e fitoquímicos',
    options: ['Apenas para o prato ficar bonito', 'Garante uma maior variedade de nutrientes e fitoquímicos', 'Para comer mais rápido', 'Não tem importância'],
    explanation: 'Diferentes cores em vegetais indicam a presença de diferentes vitaminas e minerais.',
    createdAt: Date.now()
  },
  {
    id: 'out11_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o IMC (Índice de Massa Corporal)?',
    correctAnswer: 'Cálculo que relaciona peso e altura para avaliar o estado nutricional',
    options: ['Medida da gordura do braço', 'Cálculo que relaciona peso e altura para avaliar o estado nutricional', 'Medida da pressão arterial', 'Teste de força física'],
    explanation: 'O IMC é uma ferramenta simples para classificar baixo peso, peso normal, sobrepeso e obesidade.',
    createdAt: Date.now()
  },
  {
    id: 'out12_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o principal risco do consumo excessivo de sal?',
    correctAnswer: 'Aumento da pressão arterial (hipertensão)',
    options: ['Diabetes', 'Aumento da pressão arterial (hipertensão)', 'Cárie dentária', 'Miopia'],
    explanation: 'O sódio em excesso retém líquidos e aumenta a pressão nos vasos sanguíneos.',
    createdAt: Date.now()
  },
  {
    id: 'out13_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o principal risco do consumo excessivo de açúcar?',
    correctAnswer: 'Obesidade, diabetes e cáries',
    options: ['Hipertensão apenas', 'Obesidade, diabetes e cáries', 'Falta de energia', 'Melhora da memória'],
    explanation: 'O açúcar em excesso fornece calorias vazias e desregula o metabolismo da insulina.',
    createdAt: Date.now()
  },
  {
    id: 'out14_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Ergonomia" no trabalho?',
    correctAnswer: 'Adaptação do ambiente de trabalho às capacidades do trabalhador para evitar lesões',
    options: ['Apenas a decoração do escritório', 'Adaptação do ambiente de trabalho às capacidades do trabalhador para evitar lesões', 'Trabalhar o máximo de horas possível', 'Fazer ginástica'],
    explanation: 'A ergonomia previne doenças ocupacionais como as LER/DORT.',
    createdAt: Date.now()
  },
  {
    id: 'out15_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância da saúde mental?',
    correctAnswer: 'É fundamental para o bem-estar geral e equilíbrio das funções do corpo',
    options: ['Não é importante para a saúde física', 'É fundamental para o bem-estar geral e equilíbrio das funções do corpo', 'Serve apenas para quem tem doenças graves', 'É frescura'],
    explanation: 'Saúde mental e física estão intrinsecamente ligadas.',
    createdAt: Date.now()
  },
  {
    id: 'out16_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a função das vacinas?',
    correctAnswer: 'Estimular o sistema imunológico a produzir anticorpos contra doenças',
    options: ['Curar doenças já instaladas', 'Estimular o sistema imunológico a produzir anticorpos contra doenças', 'Causar a doença de forma leve', 'Apenas para crianças'],
    explanation: 'As vacinas são a forma mais eficaz de prevenir doenças infectocontagiosas.',
    createdAt: Date.now()
  },
  {
    id: 'out17_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o "Estresse"?',
    correctAnswer: 'Resposta do organismo a situações de pressão ou ameaça',
    options: ['Apenas cansaço físico', 'Resposta do organismo a situações de pressão ou ameaça', 'Uma doença contagiosa', 'Falta de sono apenas'],
    explanation: 'O estresse crônico pode levar a diversos problemas de saúde física e mental.',
    createdAt: Date.now()
  },
  {
    id: 'out18_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de lavar os alimentos antes do consumo?',
    correctAnswer: 'Remover sujeiras, agrotóxicos e microrganismos',
    options: ['Apenas para ficarem brilhantes', 'Remover sujeiras, agrotóxicos e microrganismos', 'Para durarem mais tempo', 'Não precisa lavar se forem orgânicos'],
    explanation: 'A higienização correta previne doenças transmitidas por alimentos (DTAs).',
    createdAt: Date.now()
  },
  {
    id: 'out19_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o "Tabagismo Passivo"?',
    correctAnswer: 'Inalação da fumaça de derivados do tabaco por não fumantes',
    options: ['Fumar apenas um cigarro por dia', 'Inalação da fumaça de derivados do tabaco por não fumantes', 'Fumar charuto em vez de cigarro', 'Usar adesivo de nicotina'],
    explanation: 'O fumante passivo também corre riscos de desenvolver doenças relacionadas ao tabaco.',
    createdAt: Date.now()
  },
  {
    id: 'out20_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal causa de acidentes domésticos com crianças?',
    correctAnswer: 'Quedas, queimaduras e ingestão de produtos químicos/objetos',
    options: ['Brincar com bonecas', 'Quedas, queimaduras e ingestão de produtos químicos/objetos', 'Assistir televisão', 'Dormir demais'],
    explanation: 'A supervisão constante e a adaptação do ambiente são essenciais para a prevenção.',
    createdAt: Date.now()
  },
  {
    id: 'out21_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Automutilação"?',
    correctAnswer: 'Comportamento intencional de causar dano físico ao próprio corpo',
    options: ['Um tipo de cirurgia', 'Comportamento intencional de causar dano físico ao próprio corpo', 'Um esporte radical', 'Fazer tatuagens'],
    explanation: 'É um sinal de sofrimento psíquico que requer ajuda profissional.',
    createdAt: Date.now()
  },
  {
    id: 'out22_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância da luz solar para a saúde, além da Vitamina D?',
    correctAnswer: 'Regulação do ciclo circadiano (sono/vigília) e melhora do humor',
    options: ['Nenhuma outra importância', 'Regulação do ciclo circadiano (sono/vigília) e melhora do humor', 'Apenas para bronzear', 'Para esquentar o corpo apenas'],
    explanation: 'A luz solar influencia a produção de serotonina e melatonina.',
    createdAt: Date.now()
  },
  {
    id: 'out23_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Resiliência"?',
    correctAnswer: 'Capacidade de se adaptar e superar situações adversas',
    options: ['Ser teimoso', 'Capacidade de se adaptar e superar situações adversas', 'Não sentir dor', 'Esquecer os problemas'],
    explanation: 'A resiliência é uma habilidade emocional importante para a saúde mental.',
    createdAt: Date.now()
  },
  {
    id: 'out24_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de manter a postura correta ao sentar?',
    correctAnswer: 'Prevenir dores nas costas e problemas na coluna',
    options: ['Apenas por elegância', 'Prevenir dores nas costas e problemas na coluna', 'Para não cansar as pernas', 'Para respirar melhor apenas'],
    explanation: 'A boa postura distribui o peso do corpo de forma equilibrada.',
    createdAt: Date.now()
  },
  {
    id: 'out25_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza uma "Dieta Equilibrada"?',
    correctAnswer: 'Consumo de todos os grupos alimentares em quantidades adequadas',
    options: ['Comer apenas proteínas', 'Consumo de todos os grupos alimentares em quantidades adequadas', 'Comer o mínimo possível', 'Comer apenas vegetais'],
    explanation: 'O equilíbrio garante o aporte de todos os nutrientes necessários ao corpo.',
    createdAt: Date.now()
  },
  {
    id: 'out26_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o risco do uso excessivo de telas (celular/computador) antes de dormir?',
    correctAnswer: 'Prejudicar a qualidade do sono devido à luz azul',
    options: ['Melhorar os sonhos', 'Prejudicar a qualidade do sono devido à luz azul', 'Aumentar a inteligência', 'Não tem risco'],
    explanation: 'A luz azul inibe a produção de melatonina, o hormônio do sono.',
    createdAt: Date.now()
  },
  {
    id: 'out27_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o "Check-up" médico?',
    correctAnswer: 'Realização de exames periódicos para prevenção e diagnóstico precoce',
    options: ['Ir ao médico apenas quando está doente', 'Realização de exames periódicos para prevenção e diagnóstico precoce', 'Fazer apenas exames de sangue', 'Um tipo de tratamento'],
    explanation: 'O check-up ajuda a identificar problemas antes que se tornem graves.',
    createdAt: Date.now()
  },
  {
    id: 'out28_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância da higiene pessoal?',
    correctAnswer: 'Prevenir doenças e promover o bem-estar e a autoestima',
    options: ['Apenas por vaidade', 'Prevenir doenças e promover o bem-estar e a autoestima', 'Para gastar produtos de limpeza', 'Não tem relação com a saúde'],
    explanation: 'Hábitos simples como banho e escovação são fundamentais.',
    createdAt: Date.now()
  },
  {
    id: 'out29_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Empatia"?',
    correctAnswer: 'Capacidade de compreender e se colocar no lugar do outro',
    options: ['Sentir pena de alguém', 'Capacidade de compreender e se colocar no lugar do outro', 'Ser sempre legal com todos', 'Concordar com tudo o que o outro diz'],
    explanation: 'A empatia é essencial para relações humanas saudáveis e humanização na saúde.',
    createdAt: Date.now()
  },
  {
    id: 'out30_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o benefício de praticar hobbies ou atividades de lazer?',
    correctAnswer: 'Redução do estresse e melhora da qualidade de vida',
    options: ['Apenas perder tempo', 'Redução do estresse e melhora da qualidade de vida', 'Cansar o cérebro', 'Não traz benefícios'],
    explanation: 'O lazer é fundamental para o equilíbrio emocional.',
    createdAt: Date.now()
  },
  {
    id: 'out31_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Primeira Infância"?',
    correctAnswer: 'Período que vai do nascimento até os 6 anos de idade',
    options: ['Apenas o primeiro ano de vida', 'Período que vai do nascimento até os 6 anos de idade', 'Até os 12 anos', 'A fase da alfabetização apenas'],
    explanation: 'É a fase mais importante para o desenvolvimento cerebral e emocional.',
    createdAt: Date.now()
  },
  {
    id: 'out32_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de brincar para a criança?',
    correctAnswer: 'É a principal forma de aprendizado, socialização e desenvolvimento',
    options: ['Apenas para distrair a criança', 'É a principal forma de aprendizado, socialização e desenvolvimento', 'Para a criança não chorar', 'Não tem importância pedagógica'],
    explanation: 'O brincar é um direito e uma necessidade do desenvolvimento infantil.',
    createdAt: Date.now()
  },
  {
    id: 'out33_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza a "Adolescência"?',
    correctAnswer: 'Fase de transição entre a infância e a idade adulta, com mudanças físicas e psíquicas',
    options: ['Apenas a fase de crescimento rápido', 'Fase de transição entre a infância e a idade adulta, com mudanças físicas e psíquicas', 'Quando a pessoa faz 18 anos', 'Fase de rebeldia apenas'],
    explanation: 'É marcada por intensas transformações hormonais e busca de identidade.',
    createdAt: Date.now()
  },
  {
    id: 'out34_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância do apoio familiar na saúde?',
    correctAnswer: 'Auxilia na adesão ao tratamento e na recuperação emocional do paciente',
    options: ['Não interfere no tratamento médico', 'Auxilia na adesão ao tratamento e na recuperação emocional do paciente', 'Serve apenas para levar o paciente ao hospital', 'Pode atrapalhar o médico'],
    explanation: 'A família é a principal rede de apoio do indivíduo.',
    createdAt: Date.now()
  },
  {
    id: 'out35_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o "Envelhecimento Ativo"?',
    correctAnswer: 'Processo de otimização das oportunidades de saúde, participação e segurança ao envelhecer',
    options: ['Trabalhar até morrer', 'Processamento de otimização das oportunidades de saúde, participação e segurança ao envelhecer', 'Fazer plásticas para parecer jovem', 'Não aceitar a velhice'],
    explanation: 'Busca garantir qualidade de vida e autonomia para os idosos.',
    createdAt: Date.now()
  },
  {
    id: 'out36_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de manter a casa ventilada e iluminada?',
    correctAnswer: 'Prevenir mofo, ácaros e proliferação de doenças respiratórias',
    options: ['Apenas para economizar energia', 'Prevenir mofo, ácaros e proliferação de doenças respiratórias', 'Para os vizinhos verem dentro', 'Não tem relação com a saúde'],
    explanation: 'O sol e o ar renovado são desinfetantes naturais.',
    createdAt: Date.now()
  },
  {
    id: 'out37_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Coleta Seletiva"?',
    correctAnswer: 'Separação de resíduos para reciclagem',
    options: ['Recolher o lixo da rua', 'Separação de resíduos para reciclagem', 'Queimar o lixo', 'Enterrar o lixo no quintal'],
    explanation: 'Contribui para a preservação do meio ambiente e saúde pública.',
    createdAt: Date.now()
  },
  {
    id: 'out38_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de não jogar óleo de cozinha na pia?',
    correctAnswer: 'Evita o entupimento de canos e a contaminação da água',
    options: ['Apenas para não sujar a pia', 'Evita o entupimento de canos e a contaminação da água', 'Porque o óleo pode ser reutilizado para comer', 'Não tem problema jogar na pia'],
    explanation: 'O óleo é um grande poluidor dos recursos hídricos.',
    createdAt: Date.now()
  },
  {
    id: 'out39_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Sustentabilidade"?',
    correctAnswer: 'Suprir as necessidades do presente sem comprometer as gerações futuras',
    options: ['Viver sem tecnologia', 'Suprir as necessidades do presente sem comprometer as gerações futuras', 'Plantar sua própria comida apenas', 'Usar apenas produtos caros'],
    explanation: 'Envolve equilíbrio entre economia, sociedade e meio ambiente.',
    createdAt: Date.now()
  },
  {
    id: 'out40_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o benefício de ter plantas em casa?',
    correctAnswer: 'Melhora a qualidade do ar e traz bem-estar psicológico',
    options: ['Apenas dá trabalho', 'Melhora a qualidade do ar e traz bem-estar psicológico', 'Atrai insetos perigosos apenas', 'Não traz benefícios'],
    explanation: 'As plantas ajudam a umidificar o ar e decorar o ambiente.',
    createdAt: Date.now()
  },
  {
    id: 'out41_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é o "Consumo Consciente"?',
    correctAnswer: 'Comprar apenas o necessário, considerando o impacto ambiental e social',
    options: ['Comprar tudo o que está na promoção', 'Comprar apenas o necessário, considerando o impacto ambiental e social', 'Não comprar nada nunca', 'Comer apenas em restaurantes'],
    explanation: 'Reduz o desperdício e a produção de lixo.',
    createdAt: Date.now()
  },
  {
    id: 'out42_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância de respeitar as leis de trânsito para a saúde?',
    correctAnswer: 'Prevenir acidentes que causam mortes e sequelas graves',
    options: ['Apenas para não levar multas', 'Prevenir acidentes que causam mortes e sequelas graves', 'Para chegar mais rápido', 'Não tem relação com a saúde pública'],
    explanation: 'Acidentes de trânsito são uma das principais causas de morte externa.',
    createdAt: Date.now()
  },
  {
    id: 'out43_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Direção Defensiva"?',
    correctAnswer: 'Dirigir de modo a evitar acidentes, apesar das ações incorretas de outros',
    options: ['Dirigir devagar o tempo todo', 'Dirigir de modo a evitar acidentes, apesar das ações incorretas de outros', 'Saber brigar no trânsito', 'Ter um carro blindado'],
    explanation: 'Foca na antecipação de riscos e segurança.',
    createdAt: Date.now()
  },
  {
    id: 'out44_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância do uso do cinto de segurança?',
    correctAnswer: 'Reter os ocupantes no veículo em caso de colisão, reduzindo lesões',
    options: ['Apenas para não apitar o carro', 'Reter os ocupantes no veículo em caso de colisão, reduzindo lesões', 'Para ficar preso no banco', 'Só é necessário em estradas'],
    explanation: 'O cinto salva vidas em colisões mesmo em baixa velocidade.',
    createdAt: Date.now()
  },
  {
    id: 'out45_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o risco de usar o celular enquanto dirige?',
    correctAnswer: 'Distração cognitiva e visual, aumentando muito o risco de acidentes',
    options: ['Nenhum se for rápido', 'Distração cognitiva e visual, aumentando muito o risco de acidentes', 'Apenas acabar a bateria', 'O celular pode estragar'],
    explanation: 'O uso do celular retira o foco total necessário para a condução.',
    createdAt: Date.now()
  },
  {
    id: 'out46_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que é a "Cidadania"?',
    correctAnswer: 'Conjunto de direitos e deveres de um indivíduo em sociedade',
    options: ['Apenas o direito de votar', 'Conjunto de direitos e deveres de um indivíduo em sociedade', 'Morar na cidade', 'Ter muito dinheiro'],
    explanation: 'Exercer a cidadania inclui cuidar da saúde própria e coletiva.',
    createdAt: Date.now()
  },
  {
    id: 'out47_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância do voluntariado para quem pratica?',
    correctAnswer: 'Promove senso de propósito, socialização e bem-estar emocional',
    options: ['Apenas para ganhar currículo', 'Promove senso de propósito, socialização e bem-estar emocional', 'Para não ter tempo livre', 'Não traz benefícios pessoais'],
    explanation: 'Ajudar o próximo gera sentimentos positivos e gratificação.',
    createdAt: Date.now()
  },
  {
    id: 'out48_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que caracteriza a "Inclusão Social"?',
    correctAnswer: 'Garantir que todos tenham acesso a direitos e oportunidades, sem discriminação',
    options: ['Dar dinheiro para todos', 'Garantir que todos tenham acesso a direitos e oportunidades, sem discriminação', 'Colocar todos no mesmo lugar', 'Ignorar as diferenças'],
    explanation: 'Busca integrar pessoas com deficiência, minorias e vulneráveis.',
    createdAt: Date.now()
  },
  {
    id: 'out49_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância da ética profissional na saúde?',
    correctAnswer: 'Garantir o respeito, sigilo e a melhor assistência ao paciente',
    options: ['Apenas para seguir regras chatas', 'Garantir o respeito, sigilo e a melhor assistência ao paciente', 'Para os profissionais ganharem mais', 'Não é necessária se o profissional for bom tecnicamente'],
    explanation: 'A ética norteia a conduta correta e humana do profissional.',
    createdAt: Date.now()
  },
  {
    id: 'out50_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a principal mensagem de uma vida saudável?',
    correctAnswer: 'Equilíbrio entre corpo, mente e relações sociais',
    options: ['Fazer dieta radical', 'Equilíbrio entre corpo, mente e relações sociais', 'Malhar 5 horas por dia', 'Não comer nada gostoso'],
    explanation: 'Saúde é um estado de completo bem-estar, não apenas a ausência de doença.',
    createdAt: Date.now()
  },
  {
    id: 'out51_new',
    category: 'Outros',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual a importância da hidratação para o corpo humano?',
    correctAnswer: 'Regulação da temperatura e transporte de nutrientes',
    options: ['Apenas para matar a sede', 'Regulação da temperatura e transporte de nutrientes', 'Não tem importância real', 'Apenas para a pele'],
    explanation: 'A água é essencial para quase todas as funções biológicas, incluindo a termorregulação e o transporte de substâncias.',
    createdAt: Date.now()
  },
  {
    id: 'ac_exp_1',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o anticoagulante de escolha para a realização do hemograma completo?',
    correctAnswer: 'EDTA',
    options: ['Heparina', 'EDTA', 'Citrato de Sódio', 'Fluoreto de Sódio'],
    explanation: 'O EDTA é o anticoagulante ideal para o hemograma pois preserva a morfologia celular.',
    createdAt: Date.now()
  },
  {
    id: 'ac_exp_2',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A presença de corpos de Heinz nas hemácias é indicativa de:',
    correctAnswer: 'Desnaturação da hemoglobina',
    options: ['Deficiência de ferro', 'Desnaturação da hemoglobina', 'Infecção viral', 'Presença de parasitas'],
    explanation: 'Corpos de Heinz são inclusões de hemoglobina desnaturada, comuns em deficiência de G6PD.',
    createdAt: Date.now()
  },
  {
    id: 'ac_exp_3',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o principal marcador laboratorial para o acompanhamento a longo prazo do controle glicémico no Diabetes?',
    correctAnswer: 'Hemoglobina Glicada (HbA1c)',
    options: ['Glicemia de jejum', 'Teste de tolerância à glicose', 'Hemoglobina Glicada (HbA1c)', 'Glicosúria'],
    explanation: 'A HbA1c reflete a média da glicemia nos últimos 2 a 3 meses.',
    createdAt: Date.now()
  },
  {
    id: 'ac_exp_4',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O termo "Leucocitose" refere-se a:',
    correctAnswer: 'Aumento do número total de leucócitos',
    options: ['Diminuição das plaquetas', 'Aumento do número total de leucócitos', 'Presença de hemácias na urina', 'Diminuição da hemoglobina'],
    explanation: 'Leucocitose é o aumento dos glóbulos brancos acima do valor de referência.',
    createdAt: Date.now()
  },
  {
    id: 'ac_exp_5',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual a principal função da albumina no plasma sanguíneo?',
    correctAnswer: 'Manutenção da pressão oncótica',
    options: ['Transporte de oxigénio', 'Coagulação sanguínea', 'Manutenção da pressão oncótica', 'Defesa imunitária'],
    explanation: 'A albumina é a principal proteína plasmática responsável por manter a água dentro dos vasos (pressão oncótica).',
    createdAt: Date.now()
  },
  {
    id: 'cg_exp_1',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a capital da província do Namibe?',
    correctAnswer: 'Moçâmedes',
    options: ['Lubango', 'Moçâmedes', 'Benguela', 'Tombwa'],
    explanation: 'Moçâmedes é a capital da província do Namibe, tendo recuperado o seu nome histórico recentemente.',
    createdAt: Date.now()
  },
  {
    id: 'cg_exp_2',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o principal produto de exportação da economia de Angola?',
    correctAnswer: 'Petróleo',
    options: ['Diamantes', 'Café', 'Petróleo', 'Ferro'],
    explanation: 'O petróleo é a principal fonte de receitas e o produto mais exportado por Angola.',
    createdAt: Date.now()
  },
  {
    id: 'cg_exp_3',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em que cidade foi proclamada a Independência de Angola a 11 de Novembro de 1975?',
    correctAnswer: 'Luanda',
    options: ['Huambo', 'Luanda', 'Benguela', 'Lobito'],
    explanation: 'A independência foi proclamada em Luanda, no Largo da Independência (antigo Largo 1º de Maio).',
    createdAt: Date.now()
  },
  {
    id: 'cg_exp_4',
    category: 'Cultura Geral',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o nome da maior queda de água de Angola, localizada na província de Malanje?',
    correctAnswer: 'Quedas de Kalandula',
    options: ['Quedas do Ruacaná', 'Quedas de Kalandula', 'Quedas do Musseleolo', 'Quedas do Binga'],
    explanation: 'As Quedas de Kalandula, no Rio Lucala, são uma das maiores de África em extensão.',
    createdAt: Date.now()
  },
  {
    id: 'cg_exp_5',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é a língua oficial da República de Angola?',
    correctAnswer: 'Português',
    options: ['Umbundu', 'Kimbundu', 'Português', 'Cokwe'],
    explanation: 'O Português é a língua oficial de Angola, embora existam várias línguas nacionais de origem bantu.',
    createdAt: Date.now()
  },
  ...DIAGNOSTIC_QUESTIONS
];

export default function Quiz({ profile }: { profile: Profile | null }) {
  console.log("Quiz rendered with profile:", profile);
  const [category, setCategory] = useState<string | null>(null);
  const [isMarathon, setIsMarathon] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [categorySearch, setCategorySearch] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [dailyQuestionsCount, setDailyQuestionsCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  
  const lives = useLives(profile);

  // Sync lifelines from profile
  const [lifelines, setLifelines] = useState({
    fiftyFifty: profile?.lifelines?.fiftyFifty ?? 3,
    skip: profile?.lifelines?.skip ?? 3,
    extraTime: profile?.lifelines?.extraTime ?? 3
  });

  // Load session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('quiz_master_active_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setCategory(session.category);
        setIsMarathon(session.isMarathon);
        setCurrentQuestion(session.currentQuestion);
        setSelectedOption(session.selectedOption);
        setTextAnswer(session.textAnswer || '');
        setIsAnswered(session.isAnswered);
        setIsCorrect(session.isCorrect);
        setExplanation(session.explanation);
        setQuestionCounter(session.questionCounter);
        setIsDailyChallenge(session.isDailyChallenge);
        setDailyQuestionsCount(session.dailyQuestionsCount);
        setTimeLeft(session.timeLeft);
        setTimerActive(session.timerActive);
        setHiddenOptions(session.hiddenOptions || []);
      } catch (e) {
        console.error("Failed to load session", e);
      }
    }
    setSessionLoaded(true);
  }, []);

  // Save session when relevant state changes
  useEffect(() => {
    if (!sessionLoaded) return;
    
    if (category) {
      const session = {
        category,
        isMarathon,
        currentQuestion,
        selectedOption,
        textAnswer,
        isAnswered,
        isCorrect,
        explanation,
        questionCounter,
        isDailyChallenge,
        dailyQuestionsCount,
        timeLeft,
        timerActive,
        hiddenOptions
      };
      localStorage.setItem('quiz_master_active_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('quiz_master_active_session');
    }
  }, [category, isMarathon, currentQuestion, selectedOption, textAnswer, isAnswered, isCorrect, explanation, questionCounter, isDailyChallenge, dailyQuestionsCount, timeLeft, timerActive, hiddenOptions, sessionLoaded]);

  useEffect(() => {
    if (profile?.lifelines) {
      setLifelines(profile.lifelines);
    }
  }, [profile]);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0 && !isAnswered) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && timerActive) {
      handleAnswer(true); // Auto-submit as wrong if time runs out
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isAnswered]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const generateQuestion = async (catId: string) => {
    setCategory(catId);
    console.log("Generating question for category:", catId);
    const catName = CATEGORIES.find(c => c.id === catId)?.name;
    
    // Calculate time based on progress (Starts at 60s, decreases 1s every 2 questions, min 15s)
    const newTime = Math.max(15, 60 - Math.floor(questionCounter / 2));
    
    // 1. Check custom questions first
    const customQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
    const filteredCustom = catId === 'all' 
      ? customQuestions 
      : customQuestions.filter((q: Question) => q.category === catName);
    
    // Increment counter
    const newCounter = questionCounter + 1;
    setQuestionCounter(newCounter);

    // Logic: If online, serve 5 offline/custom questions for every 1 AI question
    // If counter % 6 === 0, use AI (if online)
    // Otherwise use offline/custom
    
    const shouldUseAI = !isOffline && newCounter % 6 === 0;

    if (!shouldUseAI) {
      // Prioritize custom questions if available
      if (filteredCustom.length > 0 && Math.random() > 0.3) {
        console.log("Using custom question from local storage");
        const q = filteredCustom[Math.floor(Math.random() * filteredCustom.length)];
        setCurrentQuestion(q);
        setTimeLeft(newTime);
        setTimerActive(true);
        setHiddenOptions([]);
        return;
      }

      // Use offline questions
      console.log("Using offline questions");
      const filtered = catId === 'all'
        ? OFFLINE_QUESTIONS
        : OFFLINE_QUESTIONS.filter(q => q.category.toLowerCase().includes(catId.replace('_', ' ')) || q.category === catName);
      const q = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : OFFLINE_QUESTIONS[Math.floor(Math.random() * OFFLINE_QUESTIONS.length)];
      setCurrentQuestion(q);
      setTimeLeft(newTime);
      setTimerActive(true);
      setHiddenOptions([]);
      return;
    }

    // AI Generation (only if online and it's the 6th question)
    setLoading(true);
    try {
      const marathonPrompt = isMarathon ? "Este é um modo maratona, aumente a dificuldade progressivamente." : "";
      const topic = catId === 'all' ? "temas variados de saúde (Enfermagem, Farmácia, Análises Clínicas, etc.)" : catName;
      const response = await genAI.models.generateContent({
        model: models.flash,
        contents: `Gere uma pergunta de quiz de nível profissional sobre ${topic}. ${marathonPrompt}
          A pergunta pode ser de múltipla escolha (4 opções), verdadeiro/falso ou resposta escrita.
          Retorne APENAS um JSON com os campos:
          "type": "multiple" | "boolean" | "text",
          "difficulty": "easy" | "medium" | "hard",
          "questionText": string,
          "correctAnswer": string,
          "options": string[] (apenas se for multiple),
          "explanation": string,
          "category": "${catId === 'all' ? 'Geral' : catName}"`,
        config: { responseMimeType: 'application/json' }
      });
      
      const data = JSON.parse(response.text || '{}');
      setCurrentQuestion({ id: Date.now().toString(), ...data, createdAt: Date.now() });
      
      // Reset timer and lifelines
      setTimeLeft(newTime);
      setTimerActive(true);
      setHiddenOptions([]);
    } catch (error) {
      console.error("Error generating question with Gemini:", error);
      // Fallback to custom or offline
      const fallbackQ = filteredCustom.length > 0 
        ? filteredCustom[Math.floor(Math.random() * filteredCustom.length)]
        : OFFLINE_QUESTIONS[0];
      setCurrentQuestion(fallbackQ);
      setTimeLeft(newTime);
      setTimerActive(true);
      setHiddenOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (isTimeOut = false) => {
    if (!profile || lives <= 0 || isAnswered || !currentQuestion) return;
    
    setTimerActive(false);
    let correct = false;
    let aiExplanation = '';

    setSubmitting(true);

    if (isTimeOut) {
      correct = false;
    } else if (currentQuestion.type === 'text' && !isOffline) {
      try {
        const response = await genAI.models.generateContent({
          model: models.flash,
          contents: `Avalie esta resposta de quiz.
            Pergunta: ${currentQuestion.questionText}
            Resposta correta esperada: ${currentQuestion.correctAnswer}
            Resposta do aluno: ${textAnswer}
            Dê uma resposta JSON com "isCorrect" (boolean) e "explanation" (string).`,
          config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || '{}');
        correct = result.isCorrect;
        aiExplanation = result.explanation;
      } catch (error) {
        correct = textAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
      }
    } else {
      const answer = (currentQuestion.type === 'multiple' ? selectedOption : textAnswer) || '';
      correct = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    setExplanation(aiExplanation || currentQuestion.explanation || '');

    // Haptic Feedback for APK
    try {
      if (correct) {
        await Haptics.notification({ type: NotificationType.Success });
      } else {
        await Haptics.notification({ type: NotificationType.Error });
      }
    } catch (e) {
      // Ignorar se não estiver no mobile
    }

    try {
      const pointsToAdd = isDailyChallenge ? 0.8 : 0.4;
      const expToAdd = correct ? (isDailyChallenge ? 20 : 10) : 0;
      
      const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
      localData.points = correct ? Number(((localData.points || 0) + pointsToAdd).toFixed(1)) : (localData.points || 0);
      localData.lives = correct ? (localData.lives || 5) : (localData.lives || 5) - 1;
      localData.lastLifeUpdate = Date.now();
      
      // Update stats
      if (!localData.stats) localData.stats = { totalAnswers: 0, correctAnswers: 0, level: 1, exp: 0, dailyStreak: 0 };
      localData.stats.totalAnswers = (localData.stats.totalAnswers || 0) + 1;
      if (correct) {
        localData.stats.correctAnswers = (localData.stats.correctAnswers || 0) + 1;
        
        // Leveling Logic
        const oldLevel = Math.floor((localData.stats.exp || 0) / 100) + 1;
        localData.stats.exp = (localData.stats.exp || 0) + expToAdd;
        const currentLevel = Math.floor(localData.stats.exp / 100) + 1;
        
        if (currentLevel > oldLevel) {
          setNewLevel(currentLevel);
          setShowLevelUp(true);
          NotificationService.sendImmediateNotification("Subiu de Nível!", `Parabéns! Você agora está no nível ${currentLevel}.`);
        }
      }
      
      if (isDailyChallenge) {
        setDailyQuestionsCount(prev => prev + 1);
        if (dailyQuestionsCount >= 4) { // 5 questions total
          localData.stats.lastDailyChallenge = Date.now();
          localData.stats.dailyStreak = (localData.stats.dailyStreak || 0) + 1;
          NotificationService.sendImmediateNotification("Desafio Diário Concluído!", "Você completou o desafio de hoje e ganhou bônus de EXP.");
        }
      }
      
      localStorage.setItem('quiz_master_profile', JSON.stringify(localData));

      // Record History
      const history = JSON.parse(localStorage.getItem('quiz_master_history') || '[]');
      const newRecord = {
        id: Date.now().toString(),
        userId: localData.id,
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionText,
        category: currentQuestion.category,
        isCorrect: correct,
        answeredAt: Date.now()
      };
      localStorage.setItem('quiz_master_history', JSON.stringify([newRecord, ...history].slice(0, 50))); // Keep last 50
      
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (isDailyChallenge && dailyQuestionsCount >= 5) {
      setCategory(null);
      setIsDailyChallenge(false);
      setDailyQuestionsCount(0);
      return;
    }

    if (category) {
      setCurrentQuestion(null);
      setSelectedOption(null);
      setTextAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
      setExplanation('');
      
      // Monetization: Show Interstitial ad every 20 questions
      if (questionCounter > 0 && questionCounter % 20 === 0) {
        AdService.showInterstitialAd();
      }

      generateQuestion(category);
    }
  };

  const useLifeline = (type: 'fiftyFifty' | 'skip' | 'extraTime') => {
    if (isAnswered || !currentQuestion || lifelines[type] <= 0) return;

    const newLifelines = { ...lifelines, [type]: lifelines[type] - 1 };
    setLifelines(newLifelines);
    
    // Update profile
    const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
    localData.lifelines = newLifelines;
    localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
    window.dispatchEvent(new Event('storage'));

    if (type === 'fiftyFifty' && currentQuestion.type === 'multiple' && currentQuestion.options) {
      const incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.correctAnswer);
      const toHide = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2);
      setHiddenOptions(toHide);
    } else if (type === 'skip') {
      nextQuestion();
    } else if (type === 'extraTime') {
      setTimeLeft(prev => prev + 30);
    }
  };

  const watchAd = async (type: 'life' | 'fiftyFifty' | 'skip' | 'extraTime') => {
    const success = await AdService.showRewardAd();
    if (success) {
      const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
      
      if (type === 'life') {
        localData.lives = Math.min(5, (localData.lives || 0) + 1);
      } else {
        if (!localData.lifelines) localData.lifelines = { fiftyFifty: 3, skip: 3, extraTime: 3 };
        localData.lifelines[type] = (localData.lifelines[type] || 0) + 1;
        setLifelines(localData.lifelines);
      }
      
      localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
      window.dispatchEvent(new Event('storage'));
    }
  };

  if (!category) {
    const filteredCategories = CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black">Quiz Master Pro</h1>
          <p className="text-slate-400">Escolha uma categoria ou filtre por tema para começar.</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
            <div className="relative w-full md:w-64">
              <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Filtrar categorias..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full bg-card border border-main rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-main"
              />
            </div>
            <button 
              onClick={() => {
                const lastChallenge = profile?.stats?.lastDailyChallenge || 0;
                const isToday = new Date(lastChallenge).toDateString() === new Date().toDateString();
                if (!isToday) {
                  setIsDailyChallenge(true);
                  setDailyQuestionsCount(0);
                  generateQuestion('all');
                }
              }}
              disabled={new Date(profile?.stats?.lastDailyChallenge || 0).toDateString() === new Date().toDateString()}
              className={`px-6 py-2 rounded-xl font-bold transition-all border w-full md:w-auto flex items-center justify-center gap-2 ${
                new Date(profile?.stats?.lastDailyChallenge || 0).toDateString() === new Date().toDateString()
                ? 'bg-card border-main text-muted opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-400 text-white shadow-lg shadow-orange-500/20'
              }`}
            >
              <Sparkles size={18} />
              {new Date(profile?.stats?.lastDailyChallenge || 0).toDateString() === new Date().toDateString() 
                ? 'Desafio Concluído' 
                : 'Desafio Diário'}
            </button>
            <button 
              onClick={() => setIsMarathon(!isMarathon)}
              className={`px-6 py-2 rounded-xl font-bold transition-all border w-full md:w-auto ${
                isMarathon ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-card border-main text-muted'
              }`}
            >
              Modo Maratona: {isMarathon ? 'Ativado' : 'Desativado'}
            </button>
            {isOffline && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <XCircle size={16} /> Modo Offline
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              disabled={!cat.active}
              onClick={() => generateQuestion(cat.id)}
              className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                cat.id === 'all' 
                ? 'bg-indigo-600/10 border-indigo-500/50 hover:bg-indigo-600/20' 
                : cat.active 
                ? 'bg-card border-main hover:border-indigo-500 hover:bg-main' 
                : 'bg-card/40 border-main opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="relative z-10">
                <h3 className={`font-bold text-lg ${cat.id === 'all' ? 'text-indigo-400' : ''}`}>{cat.name}</h3>
                {!cat.active && <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Em breve</span>}
              </div>
              {cat.active && (
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={20} className="text-indigo-500" />
                </div>
              )}
            </button>
          ))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-card/50 rounded-3xl border border-dashed border-main">
            <p className="text-slate-500">Nenhuma categoria encontrada para "{categorySearch}"</p>
            <button 
              onClick={() => setCategorySearch('')}
              className="text-indigo-400 font-bold mt-2 hover:underline"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="flex flex-col items-center justify-center py-40 gap-4">
    <Loader2 className="animate-spin text-indigo-500" size={48} />
    <p className="text-slate-400 font-medium animate-pulse">Gerando pergunta com IA...</p>
  </div>;
  if (lives <= 0) return (
    <div className="max-w-md mx-auto text-center py-20 space-y-8 px-4">
      <div className="relative inline-block">
        <Heart size={80} className="mx-auto text-red-500 animate-pulse" />
        <XCircle size={24} className="absolute -top-2 -right-2 text-slate-900 bg-red-500 rounded-full" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black">Vidas Esgotadas!</h2>
        <p className="text-slate-400">Suas vidas acabaram. Você pode esperar pela regeneração ou ganhar uma agora mesmo.</p>
      </div>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => {
            // Restore from game over
            localStorage.removeItem('quiz_master_active_session');
            watchAd('life');
          }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 p-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 transition-all"
        >
          <PlayCircle size={24} /> Ganhar 1 Vida (Ver Anúncio)
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('quiz_master_active_session');
            window.location.href = '/';
          }} 
          className="w-full bg-card hover:bg-main p-4 rounded-2xl font-bold border border-main transition-all text-main"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-main">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span className="font-black text-xl">{lives}</span>
        </div>
        <div className="text-slate-400 font-bold flex items-center gap-2">
          <button 
            onClick={() => {
              AdService.showInterstitialAd();
              localStorage.removeItem('quiz_master_active_session');
              setCategory(null);
            }} 
            className="hover:text-white transition-colors"
          >
            Categorias
          </button>
          <span>/</span>
          <span className="text-indigo-400">{currentQuestion.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-400" />
          <div className="flex flex-col items-end">
            <span className="font-black text-xl">{profile?.points.toFixed(1)}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">LVL {profile?.stats?.level || 1}</span>
              <div className="w-12 h-1 bg-main rounded-full overflow-hidden border border-main">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500" 
                  style={{ width: `${(profile?.stats?.exp || 0) % 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-card p-6 md:p-8 rounded-[2rem] border border-main shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Timer Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-main">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / (Math.max(15, 60 - Math.floor(questionCounter / 2)))) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
              className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-indigo-500'}`}
            />
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest">
                {currentQuestion.category}
              </span>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                timeLeft < 10 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-main text-muted border-main'
              }`}>
                <Clock size={12} />
                {timeLeft}s
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
                  if (localData.points >= 5) {
                    localData.points = Number((localData.points - 5).toFixed(1));
                    localData.lives = Math.min(5, (localData.lives || 0) + 1);
                    localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
                    window.dispatchEvent(new Event('storage'));
                  }
                }}
                disabled={(profile?.points || 0) < 5 || (profile?.lives || 0) >= 5}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/20 transition-all disabled:opacity-30"
                title="Trocar 5 Moedas por 1 Vida"
              >
                <Heart size={12} /> +1 Vida (5 Moedas)
              </button>
              <LifelineButton 
                icon={<Lightbulb size={14} />} 
                count={lifelines.fiftyFifty} 
                onClick={() => useLifeline('fiftyFifty')}
                onWatchAd={() => watchAd('fiftyFifty')}
                disabled={isAnswered || currentQuestion.type !== 'multiple'}
              />
              <LifelineButton 
                icon={<SkipForward size={14} />} 
                count={lifelines.skip} 
                onClick={() => useLifeline('skip')}
                onWatchAd={() => watchAd('skip')}
                disabled={isAnswered}
              />
              <LifelineButton 
                icon={<Clock size={14} />} 
                count={lifelines.extraTime} 
                onClick={() => useLifeline('extraTime')}
                onWatchAd={() => watchAd('extraTime')}
                disabled={isAnswered}
              />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
            {currentQuestion.questionText}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.type === 'text' ? (
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Digite sua resposta aqui..."
                className="w-full bg-main border border-main rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm md:text-base text-main"
              />
            ) : (
              currentQuestion.options?.map((option) => (
                !hiddenOptions.includes(option) && (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 md:p-5 rounded-2xl border text-left transition-all flex items-center justify-between group relative overflow-hidden ${
                      selectedOption === option 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-main border-main text-main hover:border-indigo-500 hover:bg-card'
                    } ${isAnswered && option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-500/20 text-green-400' : ''}
                    ${isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-500/20 text-red-400' : ''}`}
                  >
                    <span className="font-bold text-sm md:text-base relative z-10">{option}</span>
                    <div className="relative z-10">
                      {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle2 size={20} />}
                      {isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && <XCircle size={20} />}
                    </div>
                  </button>
                )
              ))
            )}
          </div>

          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border ${isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
            >
              <div className="flex items-center gap-2 font-black mb-1">
                {isCorrect ? <Award size={20} /> : <XCircle size={20} />}
                {isCorrect ? 'ACERTOU!' : 'ERROU!'}
              </div>
              <p className="text-sm opacity-80">{explanation}</p>
            </motion.div>
          )}

          {!isAnswered ? (
            <button
              onClick={() => handleAnswer(false)}
              disabled={submitting || (currentQuestion.type === 'text' ? !textAnswer : !selectedOption)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-main py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 text-white"
            >
              {submitting ? <Loader2 className="animate-spin" /> : 'Confirmar Resposta'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full bg-main hover:bg-card py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 border border-main"
            >
              Próxima Pergunta
              <ArrowRight size={20} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-main/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              className="bg-card w-full max-w-sm rounded-[3rem] p-10 border-2 border-indigo-500 text-center space-y-8 shadow-[0_0_50px_rgba(99,102,241,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/40">
                  <Award size={48} className="text-white animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-white tracking-tight">NÍVEL UP!</h2>
                  <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Você alcançou o nível {newLevel}</p>
                </div>

                <div className="p-6 bg-main/50 rounded-3xl border border-indigo-500/20">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Seu conhecimento está crescendo! Continue assim para desbloquear novos avatares e conquistas exclusivas.
                  </p>
                </div>

                <button 
                  onClick={() => setShowLevelUp(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-white text-lg transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  Continuar Jornada
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LifelineButton({ icon, count, onClick, onWatchAd, disabled }: { icon: React.ReactNode, count: number, onClick: () => void, onWatchAd: () => void, disabled: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button 
        onClick={count > 0 ? onClick : onWatchAd}
        disabled={disabled}
        className={`p-2 rounded-xl border transition-all relative ${
          disabled ? 'opacity-30 grayscale' : 
          count > 0 ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700' : 
          'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20'
        }`}
      >
        {icon}
        {count > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
            {count}
          </span>
        ) : (
          <PlayCircle size={10} className="absolute -top-1 -right-1 text-indigo-400 bg-slate-900 rounded-full" />
        )}
      </button>
    </div>
  );
}
