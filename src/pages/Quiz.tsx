import React, { useState, useEffect } from 'react';
import { Question, Profile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Zap, CheckCircle2, XCircle, Loader2, Award, ArrowRight } from 'lucide-react';
import { useLives } from '../hooks/useLives';
import { genAI, models } from '../lib/gemini';

const CATEGORIES = [
  { id: 'enfermagem', name: 'Enfermagem', active: true },
  { id: 'enfer_benguela_2022', name: 'Enfer. Benguela 2022', active: true },
  { id: 'farmacia', name: 'Farmácia', active: true },
  { id: 'analises_clinicas', name: 'Análises Clínicas', active: true },
  { id: 'cultura_geral', name: 'Cultura Geral', active: true },
  { id: 'medicina', name: 'Medicina', active: false },
  { id: 'apoio_hospitalar', name: 'Apoio Hospitalar', active: false },
  { id: 'estomatologia', name: 'Estomatologia', active: false },
  { id: 'outros', name: 'Outros', active: false },
];

const OFFLINE_QUESTIONS: Question[] = [
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
    questionText: 'Quantas províncias compõem o território da República de Angola?',
    correctAnswer: '18',
    options: ['10', '15', '18', '20'],
    explanation: 'Angola está dividida administrativamente em 18 províncias.',
    createdAt: Date.now()
  },
  {
    id: 'cg12',
    category: 'Cultura Geral',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual é o número total de municípios em Angola?',
    correctAnswer: '164',
    options: ['150', '164', '172', '180'],
    explanation: 'Atualmente, Angola possui 164 municípios distribuídos pelas suas 18 províncias.',
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
    id: 'ac28',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a principal causa de morte em Angola, segundo os manuais de saúde pública?',
    correctAnswer: 'Malária',
    options: ['HIV/SIDA', 'Tuberculose', 'Malária', 'Acidentes de viação'],
    explanation: 'A malária continua sendo a principal causa de morbilidade e mortalidade no país.',
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
  }
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
  const lives = useLives(profile);

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
    
    // 1. Check custom questions first
    const customQuestions = JSON.parse(localStorage.getItem('quiz_master_custom_questions') || '[]');
    const filteredCustom = customQuestions.filter((q: Question) => q.category === catName);
    
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
        return;
      }

      // Use offline questions
      console.log("Using offline questions");
      const filtered = OFFLINE_QUESTIONS.filter(q => q.category.toLowerCase().includes(catId.replace('_', ' ')) || q.category === catName);
      const q = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : OFFLINE_QUESTIONS[Math.floor(Math.random() * OFFLINE_QUESTIONS.length)];
      setCurrentQuestion(q);
      return;
    }

    // AI Generation (only if online and it's the 6th question)
    setLoading(true);
    try {
      const marathonPrompt = isMarathon ? "Este é um modo maratona, aumente a dificuldade progressivamente." : "";
      const response = await genAI.models.generateContent({
        model: models.flash,
        contents: `Gere uma pergunta de quiz de nível profissional sobre ${catName}. ${marathonPrompt}
          A pergunta pode ser de múltipla escolha (4 opções), verdadeiro/falso ou resposta escrita.
          Retorne APENAS um JSON com os campos:
          "type": "multiple" | "boolean" | "text",
          "difficulty": "easy" | "medium" | "hard",
          "questionText": string,
          "correctAnswer": string,
          "options": string[] (apenas se for multiple),
          "explanation": string,
          "category": "${catName}"`,
        config: { responseMimeType: 'application/json' }
      });
      
      const data = JSON.parse(response.text || '{}');
      setCurrentQuestion({ id: Date.now().toString(), ...data, createdAt: Date.now() });
    } catch (error) {
      console.error("Error generating question with Gemini:", error);
      // Fallback to custom or offline
      const fallbackQ = filteredCustom.length > 0 
        ? filteredCustom[Math.floor(Math.random() * filteredCustom.length)]
        : OFFLINE_QUESTIONS[0];
      setCurrentQuestion(fallbackQ);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!profile || lives <= 0 || isAnswered || !currentQuestion) return;
    
    let correct = false;
    let aiExplanation = '';

    setSubmitting(true);

    if (currentQuestion.type === 'text' && !isOffline) {
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

    try {
      const basePoints = currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 20 : 30;
      const pointsToAdd = isMarathon ? basePoints * 1.5 : basePoints;
      
      const localData = JSON.parse(localStorage.getItem('quiz_master_profile') || '{}');
      localData.points = correct ? (localData.points || 0) + pointsToAdd : (localData.points || 0);
      localData.lives = correct ? (localData.lives || 5) : (localData.lives || 5) - 1;
      localData.lastLifeUpdate = Date.now();
      
      localStorage.setItem('quiz_master_profile', JSON.stringify(localData));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (category) {
      setCurrentQuestion(null);
      setSelectedOption(null);
      setTextAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
      setExplanation('');
      generateQuestion(category);
    }
  };

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black">Escolha uma Categoria</h1>
          <p className="text-slate-400">Selecione o tema para começar o seu desafio.</p>
          
          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={() => setIsMarathon(!isMarathon)}
              className={`px-6 py-2 rounded-full font-bold transition-all border ${
                isMarathon ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Modo Maratona: {isMarathon ? 'Ativado' : 'Desativado'}
            </button>
            {isOffline && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <XCircle size={16} /> Modo Offline
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              disabled={!cat.active}
              onClick={() => generateQuestion(cat.id)}
              className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                cat.active 
                ? 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:bg-slate-800' 
                : 'bg-slate-900/40 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="relative z-10">
                <h3 className="font-bold text-lg">{cat.name}</h3>
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
      </div>
    );
  }

  if (loading) return <div className="flex flex-col items-center justify-center py-40 gap-4">
    <Loader2 className="animate-spin text-indigo-500" size={48} />
    <p className="text-slate-400 font-medium animate-pulse">Gerando pergunta com IA...</p>
  </div>;
  if (lives <= 0) return (
    <div className="text-center py-20 space-y-6">
      <Heart size={64} className="mx-auto text-red-500 animate-pulse" />
      <h2 className="text-3xl font-black">Você ficou sem vidas!</h2>
      <p className="text-slate-400">Aguarde a regeneração automática (1 a cada 30 min) ou volte mais tarde.</p>
      <button onClick={() => window.location.href = '/'} className="bg-indigo-600 px-6 py-3 rounded-xl font-bold">Voltar ao Início</button>
    </div>
  );

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" />
          <span className="font-black text-xl">{lives}</span>
        </div>
        <div className="text-slate-400 font-bold flex items-center gap-2">
          <button onClick={() => setCategory(null)} className="hover:text-white transition-colors">Categorias</button>
          <span>/</span>
          <span className="text-indigo-400">{currentQuestion.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-400" />
          <span className="font-black text-xl">{profile?.points}</span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6"
        >
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase rounded-full border border-indigo-500/20">
              {currentQuestion.category}
            </span>
            <span className={`px-3 py-1 text-xs font-black uppercase rounded-full border ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-xl font-bold leading-tight">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.type === 'text' ? (
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Digite sua resposta aqui..."
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            ) : (
              currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    selectedOption === option 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                  } ${isAnswered && option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-500/20 text-green-400' : ''}
                  ${isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-500/20 text-red-400' : ''}`}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle2 size={20} />}
                  {isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && <XCircle size={20} />}
                </button>
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
              onClick={handleAnswer}
              disabled={submitting || (currentQuestion.type === 'text' ? !textAnswer : !selectedOption)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" /> : 'Confirmar Resposta'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2"
            >
              Próxima Pergunta
              <ArrowRight size={20} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
