import { Question } from '../types';

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'diag_new_1',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual célula dá origem às plaquetas?',
    correctAnswer: 'Megacariócito',
    options: ['Linfócito', 'Monócito', 'Megacariócito', 'Eritrócito'],
    explanation: 'As plaquetas são fragmentos citoplasmáticos derivados dos megacariócitos na medula óssea.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_2',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual equipamento é utilizado no laboratório clínico para a separação do plasma sanguíneo?',
    correctAnswer: 'Centrífuga',
    options: ['Microscópio', 'Centrífuga', 'Autoclave', 'Agitador'],
    explanation: 'A centrífuga utiliza a força sedimentar para separar os componentes do sangue com base na densidade.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_3',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'O exame RDW (Red Cell Distribution Width) apresenta o grau de:',
    correctAnswer: 'Anisocitose',
    options: ['Anisocitose', 'Poiquilocitose', 'Hipocromia', 'Policromasia'],
    explanation: 'O RDW mede a variação de tamanho entre as hemácias (anisocitose).',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_4',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual índice hematimétrico serve para classificar as anemias em hipocrômicas ou normocrômicas?',
    correctAnswer: 'CHCM',
    options: ['VCM', 'HCM', 'CHCM', 'RDW'],
    explanation: 'O CHCM (Concentração de Hemoglobina Corpuscular Média) avalia a cor/saturação de hemoglobina.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_5',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual o marcador CD4 é utilizado para definir quais tipos de células?',
    correctAnswer: 'Linfócitos T Auxiliares',
    options: ['Linfócitos B', 'Linfócitos T Citotóxicos', 'Linfócitos T Auxiliares', 'Células NK'],
    explanation: 'O marcador CD4 é característico dos Linfócitos T helper (auxiliares).',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_6',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o valor de referência normal para a glicémia de jejum em adultos?',
    correctAnswer: '70 a 99 mg/dL',
    options: ['70 a 99 mg/dL', '100 a 125 mg/dL', 'Acima de 126 mg/dL', 'Abaixo de 60 mg/dL'],
    explanation: 'Valores entre 70 e 99 mg/dL são considerados normais para glicemia de jejum.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_7',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O exame VDRL é utilizado para o rastreio de qual doença?',
    correctAnswer: 'Sífilis',
    options: ['HIV', 'Hepatite B', 'Sífilis', 'Tuberculose'],
    explanation: 'O VDRL é um teste não treponêmico utilizado no diagnóstico e acompanhamento da sífilis.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_8',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual dessas substâncias é um resíduo do metabolismo muscular eliminado pelos rins?',
    correctAnswer: 'Creatinina',
    options: ['Glicose', 'Creatinina', 'Colesterol', 'Albumina'],
    explanation: 'A creatinina é produzida pelo músculo e excretada pelos rins, servindo como marcador da função renal.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_9',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A técnica de coloração de Gram diferencia bactérias com base em quê?',
    correctAnswer: 'Estrutura da parede celular',
    options: ['Presença de núcleo', 'Estrutura da parede celular', 'Tipo de DNA', 'Capacidade de movimento'],
    explanation: 'Bactérias Gram-positivas têm parede espessa de peptidoglicano, enquanto Gram-negativas têm parede mais fina e membrana externa.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_10',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual enzima cardíaca eleva-se precocemente (em poucas horas) no Infarto Agudo do Miocárdio?',
    correctAnswer: 'Troponina',
    options: ['ALT', 'Troponina', 'Amilase', 'Fosfatase Alcalina'],
    explanation: 'As troponinas (T e I) são os marcadores mais específicos e sensíveis para lesão do miocárdio.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_11',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o principal pigmento responsável pela cor amarela da urina?',
    correctAnswer: 'Urocromo',
    options: ['Bilirrubina', 'Hemoglobina', 'Urocromo', 'Mioglobina'],
    explanation: 'O urocromo (ou urobilina) é o produto final do metabolismo da hemoglobina que colore a urina.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_12',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual o reagente utilizado na prova do laço (Fragilidade Capilar)?',
    correctAnswer: 'Nenhum (usa-se o esfigmomanómetro)',
    options: ['Álcool 70%', 'Lugol', 'Nenhum (usa-se o esfigmomanómetro)', 'Soro Fisiológico'],
    explanation: 'A prova do laço é um teste físico de resistência capilar realizado com o manguito do esfigmomanômetro.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_13',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A hipocalémia refere-se à diminuição de qual eletrólito no sangue?',
    correctAnswer: 'Potássio',
    options: ['Sódio', 'Cálcio', 'Potássio', 'Magnésio'],
    explanation: 'K+ é o símbolo do potássio (do latim Kalium), logo hipocalemia é a baixa de potássio.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_14',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O método de Kato-Katz é utilizado para o diagnóstico de:',
    correctAnswer: 'Ovos de helmintos nas fezes',
    options: ['Bactérias na urina', 'Ovos de helmintos nas fezes', 'Vírus no sangue', 'Fungos na pele'],
    explanation: 'É um método quantitativo para pesquisa e contagem de ovos de helmintos em amostras fecais.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_15',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual o grupo sanguíneo doador universal?',
    correctAnswer: 'O negativo',
    options: ['AB positivo', 'O negativo', 'A positivo', 'B negativo'],
    explanation: 'O tipo O- não possui antígenos A, B ou Rh, podendo ser transfundido em situações de emergência sem reação imediata.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_16',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A ureia é produzida principalmente em qual órgão?',
    correctAnswer: 'Fígado',
    options: ['Rins', 'Fígado', 'Pâncreas', 'Baço'],
    explanation: 'A ureia é sintetizada no fígado através do ciclo da ureia, para eliminar a amônia tóxica.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_17',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual a principal utilidade clínica da medição do BNP (Peptídeo Natriurético Tipo B)?',
    correctAnswer: 'Diagnóstico de Insuficiência Cardíaca',
    options: ['Diagnóstico de Diabetes', 'Diagnóstico de Insuficiência Cardíaca', 'Avaliação da função hepática', 'Rastreio de câncer de próstata'],
    explanation: 'O BNP é liberado pelos ventrículos em resposta ao aumento da pressão, sendo marcador de insuficiência cardíaca.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_18',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o meio de cultura clássico utilizado para o isolamento de fungos?',
    correctAnswer: 'Ágar Sabouraud',
    options: ['Ágar Sangue', 'Ágar MacConkey', 'Ágar Sabouraud', 'Ágar Chocolate'],
    explanation: 'O Ágar Sabouraud possui pH ácido e alta concentração de dextrose, favorecendo o crescimento fúngico.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_19',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'No exame de urina II, a presença de nitritos sugere:',
    correctAnswer: 'Infecção urinária por bactérias gram-negativas',
    options: ['Cálculos renais', 'Diabetes descontrolado', 'Infecção urinária por bactérias gram-negativas', 'Uso de antibióticos'],
    explanation: 'Muitas bactérias gram-negativas reduzem o nitrato da urina em nitrito.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_20',
    category: 'Análises Clínicas',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O que avalia o Tempo de Protrombina (TP)?',
    correctAnswer: 'Via extrínseca da coagulação',
    options: ['Via intrínseca da coagulação', 'Via extrínseca da coagulação', 'Função das plaquetas', 'Processo de fibrinólise'],
    explanation: 'O TP avalia a via extrínseca e a via comum, sendo muito usado para monitorar varfarina.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_21',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A hiperbilirrubinemia indireta (não conjugada) é comum em casos de:',
    correctAnswer: 'Hemorragias intensas ou hemólise',
    options: ['Obstrução biliar', 'Hemorragias intensas ou hemólise', 'Hepatite viral aguda', 'Cálculos na vesícula'],
    explanation: 'A bilirrubina indireta aumenta quando há excesso de destruição de hemácias (hemólise).',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_22',
    category: 'Análises Clínicas',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual cristal de urina apresenta forma de "tampa de caixão" e pode estar associado a infecções por Proteus?',
    correctAnswer: 'Fosfato Triplo',
    options: ['Oxalato de Cálcio', 'Ácido Úrico', 'Fosfato Triplo', 'Cistina'],
    explanation: 'Cristais de fosfato amoníaco-magnesiano (fosfato triplo) têm aparência característica de tampa de caixão em urina alcalina.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_23',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual o principal eletrólito intracelular?',
    correctAnswer: 'Potássio',
    options: ['Sódio', 'Cloro', 'Potássio', 'Bicarbonato'],
    explanation: 'Enquanto o sódio é o principal cátion extracelular, o potássio é o principal cátion intracelular.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_24',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O teste de Coombs Direto é utilizado principalmente para o diagnóstico de:',
    correctAnswer: 'Anemia Hemolítica Autoimune',
    options: ['Diabetes Gestacional', 'Anemia Hemolítica Autoimune', 'Hepatite C', 'Deficiência de Ferro'],
    explanation: 'O Coombs Direto detecta anticorpos ou complemento fixados diretamente na superfície das hemácias.',
    createdAt: Date.now()
  },
  {
    id: 'diag_new_25',
    category: 'Análises Clínicas',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual destas células é a primeira a chegar em um local de infecção bacteriana aguda?',
    correctAnswer: 'Neutrófilo',
    options: ['Monócito', 'Neutrófilo', 'Eosinófilo', 'Basófilo'],
    explanation: 'Os neutrófilos são a "primeira linha de defesa" celular contra infecções bacterianas.',
    createdAt: Date.now()
  }
];
