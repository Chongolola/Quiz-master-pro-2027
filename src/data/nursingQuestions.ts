import { Question } from '../types';

export const NURSING_QUESTIONS: Question[] = [
  {
    id: 'enf_new_1',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O ambiente hospitalar oferece inúmeros riscos ao trabalhador. A biossegurança envolve práticas preventivas no trabalho com agentes patogénicos. Escolha a afirmativa correcta:',
    correctAnswer: 'O sangue é reconhecido como o mais importante veículo de transmissão do VIH.',
    options: [
      'O sangue é reconhecido como o mais importante veículo de transmissão do VIH.',
      'O uso permanente de luvas garante a total imunidade do trabalhador.',
      'Os riscos biológicos não são fontes de insalubridade.',
      'O vírus VIH só pode ser adquirido por contacto com grande volume de sangue.'
    ],
    explanation: 'O sangue e fluidos biológicos contaminados são as principais vias de transmissão do HIV em ambiente ocupacional.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_2',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre as indicações para a lavagem das mãos, assinale a afirmativa INCORRECTA:',
    correctAnswer: 'Todas as afirmações são falsas.',
    options: [
      'À chegada e à saída do serviço',
      'Antes e depois do contacto com o paciente',
      'Antes e depois de ir ao WC',
      'Todas as afirmações são falsas.'
    ],
    explanation: 'Todas as opções anteriores (a, b, c) são indicações corretas e obrigatórias para a higienização das mãos.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_3',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A temperatura corporal indica as condições de saúde. Assinale a alternativa correcta:',
    correctAnswer: 'A temperatura corporal pode ser verificada por via axilar, inguinal, oral e retal',
    options: [
      'A temperatura corporal pode ser verificada por via axilar, inguinal, oral e retal',
      'A temperatura abaixo do normal indica hipertermia.',
      'O paciente com hipertermia deve ser mantido aquecido com muitos cobertores.',
      'O termómetro deve ser mantido com a coluna de mercúrio acima de 35 ºC antes do uso.'
    ],
    explanation: 'Existem diversas vias para aferição da temperatura, sendo a axilar a mais comum, mas a retal a mais precisa.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_4',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a verificação do pulso e da respiração, assinale a alternativa correcta:',
    correctAnswer: 'O pulso e a respiração podem ser avaliados quanto a frequência, ao ritmo e à amplitude.',
    options: [
      'A frequência normal denomina-se dispneia.',
      'O pulso e a respiração podem ser avaliados quanto a frequência, ao ritmo e à amplitude.',
      'A verificação do pulso evita a interferência emocional na respiração em pacientes em coma.',
      'O pulso e a respiração podem ser avaliados apenas quanto à frequência.'
    ],
    explanation: 'Sinais vitais devem ser avaliados de forma completa, observando não apenas a contagem, mas a qualidade do sinal.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_5',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'A sequência ideal para a verificação dos sinais vitais na criança é:',
    correctAnswer: 'Respiração, Pulso, Temperatura, Pressão arterial',
    options: [
      'Pulso, Pressão arterial, Respiração, Temperatura',
      'Temperatura, Respiração, Pressão arterial, Pulso',
      'Respiração, Pulso, Temperatura, Pressão arterial',
      'Pressão arterial, Temperatura, Pulso, Respiração'
    ],
    explanation: 'Em pediatria, inicia-se pelos métodos menos invasivos para evitar o choro e alteração dos parâmetros.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_6',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Ao avaliar o quadro respiratório, assinale a alternativa INCORRECTA:',
    correctAnswer: 'Todas as alternativas são incorretas',
    options: [
      'Taquipneico (Frequência respiratória aumentada)',
      'Bradipneico (Frequência respiratória diminuída)',
      'Apneico (Ausência de movimentos respiratórios)',
      'Todas as alternativas são incorretas'
    ],
    explanation: 'As definições de taquipneia, bradipneia e apneia apresentadas nas opções anteriores estão corretas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_7',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'A administração de medicamentos requer os "cinco certos". Assinale a alternativa correcta:',
    correctAnswer: 'O paciente certo, o medicamento certo, a dose certa a via de administração certa, e o horário certo .',
    options: [
      'O preparo certo, a via certa, o horário certo, o material certo, e a dose certa.',
      'O paciente certo, o medicamento certo, o rótulo certo, a via certa, e a dose certa.',
      'O paciente certo, o medicamento certo, a dose certa a via de administração certa, e o horário certo .',
      'A prescrição certa, a concentração certa, a via certa, a dose certa e turno certo.'
    ],
    explanation: 'Os 5 certos clássicos são: Paciente, Medicamento, Dose, Via e Horário.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_8',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre as equivalências de medidas líquidas, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Uma colher de sopa (10 mililitros)',
    options: [
      'Uma colher de sopa (10 mililitros)',
      'Uma colher de chá (5 mililitros)',
      'Uma colher de sopa (15 mililitros)',
      'Um mililitro (ml) (20 gotas)'
    ],
    explanation: 'Uma colher de sopa equivale a 15 ml, não 10 ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_9',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Prescrição: 1000 ml de soro para correr em 8 horas. O gotejamento deve ser:',
    correctAnswer: '42 Gotas/minutos',
    options: [
      '42 Gotas/minutos',
      '30 Gotas/minutos',
      '12 Gotas/minutos',
      '8 Gotas/minutos'
    ],
    explanation: 'Cálculo: Volume / (Tempo * 3) = 1000 / (8 * 3) = 1000 / 24 ≈ 41.6, arredondando para 42 gotas/min.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_10',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Um soro de 500 ml a correr a 17 gotas por minuto deverá terminar em:',
    correctAnswer: '9 Horas e 48 minutos',
    options: [
      '6 Horas e 50 minutos',
      '8 Horas e 44 minutos',
      '9 Horas e 48 minutos',
      '2 Horas e 45 minutos'
    ],
    explanation: 'Cálculo: (Volume * 20) / Gotas = (500 * 20) / 17 = 10000 / 17 ≈ 588 minutos = 9h 48min.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_11',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quantos gramas de dextrose há em um frasco de 500 ml de soro glicosado a 5%?',
    correctAnswer: '25 Gramas',
    options: [
      '5 Gramas',
      '4,5 Gramas',
      '10 Gramas',
      '25 Gramas'
    ],
    explanation: '5% significa 5g em 100ml. Logo, em 500ml temos 5 * 5 = 25g.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_12',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Os principais locais da injecção intradérmica são:',
    correctAnswer: 'Região anterior do braço',
    options: [
      'Região anterior do braço',
      'Tórax anterior e posterior',
      'Região lateral e posterior do braço',
      'Nenhuma afirmação é correta'
    ],
    explanation: 'A face anterior do antebraço é o local de eleição para testes de sensibilidade e vacina BCG.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_13',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a sondagem vesical, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Em doentes com Tuberculose e VIH/SIDA',
    options: [
      'Obtenção de urina asséptica para exame',
      'Esvaziar a bexiga em retenção urinária',
      'Em doentes com Tuberculose e VIH/SIDA',
      'Monitorizar o débito urinário cirúrgico'
    ],
    explanation: 'Ter TB ou HIV não é uma indicação clínica para sondagem vesical.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_14',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre contra-indicações da Sonda Vesical, assinale a INCORRECTA:',
    correctAnswer: 'Esvaziamento da bexiga em pacientes com retenção urinária',
    options: [
      'Sepsis urinária aguda',
      'Uretrite evidente',
      'Esvaziamento da bexiga em pacientes com retenção urinária',
      'Doentes com agitação psicomotora'
    ],
    explanation: 'Esvaziar a bexiga em retenção é uma indicação, não uma contra-indicação.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_15',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre conceitos de alterações da micção, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Todas as respostas estão incorrectas',
    options: [
      'Anúria (Diurese inferior a 100 ml/dia)',
      'Disúria (Dor ou desconforto)',
      'Incontinência (Incapacidade de controlar)',
      'Todas as respostas estão incorrectas'
    ],
    explanation: 'As definições de anúria, disúria e incontinência nas opções anteriores estão corretas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_16',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'No atendimento em UCI, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Todas as afirmações são corretas excepto a alínea c)',
    options: [
      'Deixar o doente repousar por períodos interruptos',
      'Diminuir a estimulação visual e auditiva',
      'Evitar usar meios limitativos da mobilidade',
      'Todas as afirmações são corretas excepto a alínea c)'
    ],
    explanation: 'Meios limitativos da mobilidade devem ser evitados sempre que possível para prevenir complicações.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_17',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre queimaduras e hipovolemia, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Pessoas com queimaduras leves no membro superior esquerdo.',
    options: [
      'Queimaduras em áreas vascularizadas (cara)',
      'Maior deslocação de líquidos em áreas musculares',
      'Pessoas com queimaduras leves no membro superior esquerdo.',
      'As alíneas a) e b) são corretas'
    ],
    explanation: 'Queimaduras leves não costumam causar grande deslocamento de líquidos sistêmico.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_18',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quanto ao agente causal, as feridas classificam-se em:',
    correctAnswer: 'Perfuro-contusas',
    options: [
      'Corto-contusa',
      'Perfurante',
      'Perfuro-contusas',
      'perfuro - contaminadas'
    ],
    explanation: 'Feridas perfuro-contusas são causadas por agentes que perfuram e esmagam o tecido simultaneamente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_19',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre anotações de enfermagem, assinale a alínea INCORRECTA:',
    correctAnswer: 'Os dados da punção venosa apenas com local e data são suficientes.',
    options: [
      'Constituem comunicação importante na equipe.',
      'Oferecem subsídios para o diagnóstico.',
      'Devem incluir data, hora e assinatura.',
      'Os dados da punção venosa apenas com local e data são suficientes.'
    ],
    explanation: 'Anotações de punção devem incluir também o calibre do cateter, intercorrências e resposta do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_20',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Na injecção intramuscular glútea, a agulha deve formar um ângulo de:',
    correctAnswer: '90º',
    options: [
      '15º',
      '60º',
      '90º',
      '45º'
    ],
    explanation: 'O ângulo de 90 graus garante que a medicação atinja a profundidade do músculo.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_21',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O local correto para administração de medicamentos intramuscular na região glútea é:',
    correctAnswer: 'Quadrante superior externo',
    options: [
      'Quadrante superior interno',
      'Quadrante inferior interno',
      'Quadrante mediano',
      'Quadrante superior externo'
    ],
    explanation: 'O quadrante superior externo evita o nervo ciático e grandes vasos.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_22',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São factores de risco para a hipertensão arterial, EXCEPTO:',
    correctAnswer: 'Prática de actividade física',
    options: [
      'Prática de actividade física',
      'Obesidade',
      'Consumo excessivo de sal',
      'Estresse'
    ],
    explanation: 'A atividade física é um fator de proteção, não de risco.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_23',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São materiais necessários para administração endovenosa, EXCEPTO:',
    correctAnswer: 'Luvas estéreis',
    options: [
      'Seringa',
      'Garrote',
      'Luvas estéreis',
      'Bolas de algodão'
    ],
    explanation: 'Para punção venosa simples, utilizam-se luvas de procedimento, não estéreis.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_24',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre medidas não farmacológicas para febre, assinale a INCORRECTA:',
    correctAnswer: 'Todas alíneas anteriores são falsas',
    options: [
      'Aplicação de toalha húmida',
      'Beber bastante água',
      'Utilizar roupas leves',
      'Todas alíneas anteriores são falsas'
    ],
    explanation: 'Todas as opções anteriores (a, b, c) são medidas corretas para baixar a febre.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_25',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alínea verdadeira sobre infecção nosocomial:',
    correctAnswer: 'A infecção nosocomial não é transportada pelo doente da sua casa para o hospital',
    options: [
      'A infecção nosocomial não é transportada pelo doente da sua casa para o hospital',
      'É sempre adquirida através de uma bactéria',
      'A porta de entrada são sempre as mãos',
      'É adquirida em casa do doente.'
    ],
    explanation: 'Infecção nosocomial é aquela adquirida especificamente no ambiente hospitalar.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_26',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Em relação ao HIV, assinale a alínea verdadeira:',
    correctAnswer: 'É um vírus que é transmitido através de uma picada de agulha usada num doente contaminado.',
    options: [
      'É uma bactéria transmitida por agulha.',
      'É um vírus que é transmitido através de uma picada de agulha usada num doente contaminado.',
      'É um parasita transmitido por agulha.',
      'É um protozoário transmitido por sexo.'
    ],
    explanation: 'O HIV é um vírus (Vírus da Imunodeficiência Humana) transmitido por fluidos corporais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_27',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sintomas frequentes numa hemorragia, EXCEPTO:',
    correctAnswer: 'Hipertensão',
    options: [
      'Hipertensão',
      'Tonturas',
      'Diminuição da pressão sanguínea',
      'Perda de equilíbrio'
    ],
    explanation: 'Hemorragias causam hipotensão (queda de pressão), não hipertensão.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_28',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a hipertensão arterial, assinale a alínea correcta:',
    correctAnswer: 'O tratamento deve incluir além da terapêutica farmacológica, o tratamento não farmacológico.',
    options: [
      'A hipertensão tem cura definitiva.',
      'Afeta apenas pessoas adultas.',
      'O tratamento deve incluir além da terapêutica farmacológica, o tratamento não farmacológico.',
      'Hipertensos devem aumentar o sal na dieta.'
    ],
    explanation: 'O controle da hipertensão exige mudanças no estilo de vida e, se necessário, medicação.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_29',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a hipertensão arterial, assinale a alínea INCORRECTA:',
    correctAnswer: 'A Hipertensão Arterial é uma doença transmissível',
    options: [
      'É fator de risco para doenças cardiovasculares.',
      'É fator de risco para insuficiência renal.',
      'A Hipertensão Arterial é uma doença transmissível',
      'Muitas vezes não apresenta sintomas.'
    ],
    explanation: 'A hipertensão é uma doença crônica não transmissível.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_30',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a diabetes mellitus, assinale a alínea correcta:',
    correctAnswer: 'Os diabéticos devem ser orientados a realizarem actividade física e terem uma alimentação regrada.',
    options: [
      'É uma doença crónica transmissível.',
      'A Diabetes Mellitus tem cura.',
      'Devem comer alimentos ricos em carboidratos.',
      'Os diabéticos devem ser orientados a realizarem actividade física e terem uma alimentação regrada.'
    ],
    explanation: 'Exercício e dieta são pilares fundamentais no controle da glicemia.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_31',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sintomas frequentes numa hemorragia, EXCEPTO:',
    correctAnswer: 'Elevação da tensão arterial',
    options: [
      'Elevação da tensão arterial',
      'Taquicardia',
      'Pele fria',
      'Pulso radial fraco'
    ],
    explanation: 'Hemorragias levam à queda da pressão arterial (hipotensão).',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_32',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Prescrição: 20 mg de Gentamicina IM. Disponível: 80 mg/2 ml. Quanto administrar?',
    correctAnswer: '0,5 ml',
    options: [
      '0,5 ml',
      '0,8 ml',
      '1,5 ml',
      '1,8 ml'
    ],
    explanation: 'Cálculo: (20mg * 2ml) / 80mg = 40 / 80 = 0.5 ml.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_33',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre o aconselhamento, assinale a afirmação FALSA:',
    correctAnswer: 'A entrevista não deve basear-se numa relação mútua entre o profissional e o utente.',
    options: [
      'É uma técnica de comunicação interpessoal.',
      'A entrevista não deve basear-se numa relação mútua entre o profissional e o utente.',
      'Ajuda as pessoas a definirem seus problemas.',
      'Providencia apoio psicossocial.'
    ],
    explanation: 'O aconselhamento baseia-se justamente na relação mútua e confiança entre profissional e usuário.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_34',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em relação ao pós-operatório imediato, é INCORRETO afirmar:',
    correctAnswer: 'A cabeceira do leito deve ser mantida a zero grau em qualquer cirurgia.',
    options: [
      'Garantir a permeabilidade das vias aéreas.',
      'A cabeceira do leito deve ser mantida a zero grau em qualquer cirurgia.',
      'Verificar o funcionamento de equipamentos.',
      'Verificação dos sinais vitais.'
    ],
    explanation: 'A posição da cabeceira depende do tipo de cirurgia e anestesia realizada.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_35',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre Serviços de Cuidados Intensivos, assinale a afirmação INCORRECTA:',
    correctAnswer: 'O máximo de espaço para equipamento e pessoal',
    options: [
      'O máximo de espaço para equipamento e pessoal',
      'Janelas para melhorar orientação do doente',
      'Permitir privacidade e visualização directa.',
      'Nenhuma das anteriores'
    ],
    explanation: 'Embora o espaço seja importante, o "máximo" de espaço pode dificultar a visualização e monitoramento rápido dos pacientes.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_36',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quanto ao grau de contaminação, as feridas são classificadas, EXCEPTO:',
    correctAnswer: 'Equimoses e hematomas',
    options: [
      'Limpas',
      'Potencialmente contaminada',
      'Equimoses e hematomas',
      'Contaminadas'
    ],
    explanation: 'Equimoses e hematomas são tipos de lesões teciduais, não graus de contaminação bacteriana.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_37',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Quanto ao comprometimento tecidual na Lesão por Pressão, assinale a afirmação correcta:',
    correctAnswer: 'Estágio 01, não há perda tecidual, com a pele intacta e eritema.',
    options: [
      'Estágio 01, não há perda tecidual, com a pele intacta e eritema.',
      'Estágio 02, há perda total da pele e necrose.',
      'Estágio 03, a úlcera é rasa.',
      'Lesão Não Classificável é perda parcial.'
    ],
    explanation: 'No Estágio 1, a pele está íntegra, mas apresenta vermelhidão que não desaparece após alívio da pressão.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_38',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Em relação ao Diabetes Mellitus, assinale a alínea FALSA:',
    correctAnswer: 'A aplicação de insulina diária se faz por via intramuscular.',
    options: [
      'É caracterizada pela deficiência de insulina.',
      'A meta é diminuir os níveis de glicose.',
      'Medidas incluem dieta e exercício.',
      'A aplicação de insulina diária se faz por via intramuscular.'
    ],
    explanation: 'A insulina deve ser aplicada por via subcutânea, não intramuscular.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_39',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Em relação à cetoacidose diabética é INCORRETO afirmar:',
    correctAnswer: 'É uma complicação crônica do diabetes',
    options: [
      'É uma complicação crônica do diabetes',
      'Caracteriza-se por distúrbios metabólicos.',
      'Apresenta hálito cetônico e coma.',
      'Objetivo é restaurar o metabolismo.'
    ],
    explanation: 'A cetoacidose diabética é uma complicação aguda (emergência), não crônica.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_40',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a classificação das feridas segundo a cor, assinale a INCORRECTA:',
    correctAnswer: 'Todas as afirmações são falsa',
    options: [
      'Vermelha: tecido de granulação saudável.',
      'Amarela: presença de exsudato.',
      'Preta: presença de necrose.',
      'Todas as afirmações são falsa'
    ],
    explanation: 'As definições de cores (vermelha, amarela e preta) estão corretas conforme o protocolo de tratamento de feridas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_41',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre os cuidados paliativos, assinale a alínea correcta:',
    correctAnswer: 'Cuidados ativos e totais prestados com o objectivo de proporcionar a melhor qualidade de vida aos doentes e seus familiares.',
    options: [
      'Cuidados prestados apenas em fase final de vida.',
      'Cuidados ativos e totais prestados com o objectivo de proporcionar a melhor qualidade de vida aos doentes e seus familiares.',
      'Cuidados prestados apenas aos familiares.',
      'Cuidados prestados apenas aos cônjuges.'
    ],
    explanation: 'Cuidados paliativos visam a qualidade de vida do paciente e da família diante de doenças que ameaçam a vida.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_42',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a Sistematização da Assistência de Enfermagem (SAE), assinale a afirmação INCORRECTA:',
    correctAnswer: 'Todas as alíneas são falsas',
    options: [
      'Histórico de Enfermagem',
      'Diagnóstico de Enfermagem',
      'Implementação e Avaliação',
      'Todas as alíneas são falsas'
    ],
    explanation: 'Histórico, Diagnóstico, Implementação e Avaliação são etapas fundamentais da SAE.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_43',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A estrutura do enunciado diagnóstico real deve descrever o seguinte, EXCEPTO:',
    correctAnswer: 'Factores de risco',
    options: [
      'Título',
      'Características definidoras',
      'Factores relacionados',
      'Factores de risco'
    ],
    explanation: 'Fatores de risco são usados em diagnósticos de RISCO, não em diagnósticos REAIS.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_44',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a sequência correcta para avaliação do Exame Físico:',
    correctAnswer: 'Inspeção, palpação, percussão e auscultação',
    options: [
      'Inspeção, palpação, percussão e auscultação',
      'Palpação, percussão, auscultação e inspeção',
      'Percussão, auscultação, inspeção e palpação',
      'Inspeção, palpação, auscultação e percussão'
    ],
    explanation: 'A sequência padrão é Inspeção, Palpação, Percussão e Ausculta (exceto no abdome, onde a ausculta vem antes da palpação).',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_45',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sinais e sintomas da Tuberculose na criança não vacinada. Assinale a resposta INCORRECTA:',
    correctAnswer: 'Febre alta',
    options: [
      'Catarro com sinais de sangue',
      'Febre alta',
      'Tosse Seca mais de 4 semanas',
      'Emagrecimento'
    ],
    explanation: 'A febre na tuberculose costuma ser baixa (vespertina), não alta.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_46',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sinais de alerta de Sarampo, EXCEPTO:',
    correctAnswer: 'Vómitos após as refeições',
    options: [
      'Febre',
      'Manchas vermelhas pelo corpo',
      'Vómitos após as refeições',
      'Tosse'
    ],
    explanation: 'Vômitos pós-prandiais não são sinais característicos do sarampo.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_47',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São sinais de desidratação, EXCEPTO:',
    correctAnswer: 'Choro com lágrimas',
    options: [
      'Olhos fundos',
      'Pele, boca ou lábios secos',
      'Choro com lágrimas',
      'A criança com muita sede'
    ],
    explanation: 'O choro SEM lágrimas é que indica desidratação.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_48',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre saúde da criança, assinale a afirmação FALSA:',
    correctAnswer: 'Na hipoglicemia neonatal, são observados sinais como: Tremores, convulsões, flacidez muscular.',
    options: [
      'Na hipoglicemia neonatal, são observados sinais como: Tremores, convulsões, flacidez muscular.',
      'A imaturidade neurológica predispõe a apneia.',
      'A capacidade gástrica do prematuro é pequena.',
      'Movimentos respiratórios do neonato são diafragmáticos.'
    ],
    explanation: 'A afirmação sobre hipoglicemia está incompleta ou incorreta dependendo do contexto, mas tremores e convulsões são sinais reais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_49',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre situações de alto risco no recém-nascido, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Todas as afirmações são falsas',
    options: [
      'Peso baixo à nascença (menos de 2500g)',
      'Doença crónica na família',
      'Três ou mais irmãos falecidos',
      'Todas as afirmações são falsas'
    ],
    explanation: 'Peso baixo e histórico familiar de óbitos infantis são fatores de risco reais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_50',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre assistência pré-natal (CPN), assinale a afirmação INCORRECTA:',
    correctAnswer: 'Medir a altura uterina, auscultar movimentos fetais, peso e TA não fazem parte do pacote.',
    options: [
      'Informar-se sobre a idade gestacional.',
      'Incentivar consultas até a 8ª visita.',
      'Medir a altura uterina, auscultar movimentos fetais, peso e TA não fazem parte do pacote.',
      'Aumento excessivo de peso e TA são sinais de alerta.'
    ],
    explanation: 'Altura uterina, BCF, peso e TA são componentes OBRIGATÓRIOS de toda consulta de pré-natal.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_51',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre cuidados ao parto, assinale a afirmação correcta:',
    correctAnswer: 'A utilização do partograma dá ao profissional a percepção do risco obstétrico',
    options: [
      'Hemorragia no pré-parto não constitui preocupação.',
      'A utilização do partograma dá ao profissional a percepção do risco obstétrico',
      'Postos de saúde seguem trabalho de parto por mais de 12 horas.',
      'Perda de 500 ml de sangue após a placenta é pouco preocupante.'
    ],
    explanation: 'O partograma é a ferramenta padrão para monitorar o progresso do parto e detectar distocias.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_52',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Paciente com dor intensa, amenorreia, sangramento discreto e sinais de choque. Hipótese: Gravidez Ectópica. Conduta correcta:',
    correctAnswer: 'Canalizar uma veia, administrar soro e providenciar transferência urgente.',
    options: [
      'Oferecer um copo de leite morno.',
      'Colocar a mulher em decúbito lateral direito.',
      'Canalizar uma veia, administrar soro e providenciar transferência urgente.',
      'Aguardar pela chegada do médico reunido.'
    ],
    explanation: 'Gravidez ectópica rota é uma emergência cirúrgica que requer estabilização hemodinâmica e cirurgia imediata.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_53',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre cuidados ao parto, assinale a alínea INCORRECTA:',
    correctAnswer: 'Durante o trabalho de parto, os sinais vitais e FCF são menos importantes',
    options: [
      'Controlar o trabalho de parto utilizando o partograma.',
      'Partograma dá percepção do risco obstétrico.',
      'Acompanhar o progresso através da palpação abdominal.',
      'Durante o trabalho de parto, os sinais vitais e FCF são menos importantes'
    ],
    explanation: 'Monitorar sinais vitais maternos e a Frequência Cardíaca Fetal é CRÍTICO durante todo o parto.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_54',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Quanto à assistência à mulher mastectomizada, assinale a alínea INCORRECTA:',
    correctAnswer: 'São evitados exercícios para o membro homolateral para prevenir trombose.',
    options: [
      'Proporcionar actividades grupais para auto-estima.',
      'São evitados exercícios para o membro homolateral para prevenir trombose.',
      'Promover trocas de experiências entre participantes.',
      'Realizar exercícios de relaxamento e lazer.'
    ],
    explanation: 'Exercícios específicos para o membro afetado são essenciais na reabilitação para prevenir linfedema e recuperar mobilidade.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_55',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alternativa INCORRECTA sobre causas do câncer do útero:',
    correctAnswer: 'Falta de vitamina C',
    options: [
      'Actividade sexual precoce',
      'Vários parceiros sexuais',
      'Papilomatose (HPV)',
      'Falta de vitamina C'
    ],
    explanation: 'O câncer de colo de útero está ligado principalmente à infecção pelo vírus HPV, não à falta de vitaminas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_56',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre organogramas hospitalares, assinale a afirmação correcta:',
    correctAnswer: 'A principal diferença entre Hospital Nacional e Provincial está no nível estratégico e tático',
    options: [
      'A diferença está apenas no nível estratégico.',
      'A diferença está apenas no nível operacional.',
      'A principal diferença entre Hospital Nacional e Provincial está no nível estratégico e tático',
      'A diferença está no nível táctico operacional.'
    ],
    explanation: 'Hospitais de diferentes níveis hierárquicos possuem complexidades distintas em sua gestão estratégica e tática.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_57',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre as fases do planeamento administrativo, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Desenvolvimento Grupo Aperfeiçoamento.',
    options: [
      'Conhecimento dos objectivos.',
      'Determinação dos objectivos.',
      'Estabelecimento de prioridades.',
      'Desenvolvimento Grupo Aperfeiçoamento.'
    ],
    explanation: 'As fases clássicas envolvem diagnóstico, definição de objetivos, estratégias e avaliação.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_58',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre manuais de enfermagem, assinale a afirmação correcta:',
    correctAnswer: 'Estruturação e confecção dos instrumentos',
    options: [
      'Diagnóstico da Situação',
      'Determinação dos assuntos',
      'Estruturação e confecção dos instrumentos',
      'Avaliação'
    ],
    explanation: 'A elaboração física do manual é a etapa de estruturação e confecção.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_59',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A gerência de materiais nas unidades de enfermagem tem várias funções:',
    correctAnswer: 'Previsão, Provisão, Organização e Controlo',
    options: [
      'Previsão, provisão, Controlo',
      'Previsão, Provisão, Organização e Controlo',
      'Todas são verdadeiras',
      'Todas são falsas'
    ],
    explanation: 'O ciclo de materiais envolve prever a necessidade, prover o item, organizar o estoque e controlar o uso.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_60',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre instrumentos para a função supervisão, assinale a afirmação INCORRECTA:',
    correctAnswer: 'Todas são falsas.',
    options: [
      'Observação directa Análise e registo',
      'Entrevista, Reunião, Discussão em grupo',
      'Demonstração, Orientação, Estudo de caso',
      'Todas são falsas.'
    ],
    explanation: 'Todas as opções anteriores (a, b, c) são instrumentos válidos e utilizados na supervisão de enfermagem.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_61',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre o Consentimento Livre e Esclarecido, assinale a afirmação INCORRECTA:',
    correctAnswer: 'O utente não tem o direito de recusar o tratamento.',
    options: [
      'Deve ser obtido antes de qualquer procedimento.',
      'O utente deve ser informado sobre riscos e benefícios.',
      'O utente não tem o direito de recusar o tratamento.',
      'Deve ser registado no processo clínico.'
    ],
    explanation: 'O paciente tem o direito fundamental de recusar tratamentos, desde que devidamente informado das consequências.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_62',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Um profissional que revela segredo de um paciente sem autorização está violando o princípio de:',
    correctAnswer: 'Confidencialidade',
    options: [
      'Beneficência',
      'Não maleficência',
      'Confidencialidade',
      'Justiça'
    ],
    explanation: 'A confidencialidade é o dever de resguardar informações sigilosas obtidas no exercício profissional.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_63',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Ao prestar assistência igualitária a todos os pacientes, o enfermeiro respeita o princípio da:',
    correctAnswer: 'Justiça',
    options: [
      'Autonomia',
      'Fidelidade',
      'Justiça',
      'Veracidade'
    ],
    explanation: 'O princípio da justiça na bioética refere-se à equidade e distribuição justa dos cuidados de saúde.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_64',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Os quatro princípios fundamentais da bioética são:',
    correctAnswer: 'Autonomia, Beneficência, Não Maleficência e Justiça',
    options: [
      'Autonomia, Caridade, Verdade e Justiça',
      'Autonomia, Beneficência, Não Maleficência e Justiça',
      'Fidelidade, Sigilo, Respeito e Honestidade',
      'Nenhuma das anteriores'
    ],
    explanation: 'Estes são os pilares do principialismo bioético propostos por Beauchamp e Childress.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_65',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a avaliação das necessidades do paciente, assinale a afirmação correcta:',
    correctAnswer: 'Deve ser contínua e dinâmica durante toda a assistência.',
    options: [
      'Deve ser feita apenas na admissão.',
      'Não precisa ser registada.',
      'É responsabilidade apenas do médico.',
      'Deve ser contínua e dinâmica durante toda a assistência.'
    ],
    explanation: 'A avaliação de enfermagem é um processo cíclico que se adapta às mudanças no estado do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_66',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A confidencialidade dos dados do paciente é:',
    correctAnswer: 'Um dever ético e legal do profissional de saúde.',
    options: [
      'Opcional em casos de doenças leves.',
      'Apenas para pacientes famosos.',
      'Um dever ético e legal do profissional de saúde.',
      'Quebrável por qualquer membro da família.'
    ],
    explanation: 'O sigilo profissional é protegido por lei e pelo código de ética da profissão.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_67',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O conceito de Ética Profissional refere-se a:',
    correctAnswer: 'Conjunto de normas de conduta que devem ser observadas no exercício da profissão.',
    options: [
      'Apenas seguir as ordens superiores.',
      'Conjunto de normas de conduta que devem ser observadas no exercício da profissão.',
      'Ganhar o máximo de dinheiro possível.',
      'Trabalhar apenas o horário estabelecido.'
    ],
    explanation: 'A ética profissional orienta o comportamento e as decisões técnicas e morais no ambiente de trabalho.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_68',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São exemplos de postura ética, EXCEPTO:',
    correctAnswer: 'Divulgar fotos de pacientes em redes sociais sem autorização.',
    options: [
      'Respeitar a privacidade do paciente.',
      'Manter-se actualizado tecnicamente.',
      'Ser pontual e responsável.',
      'Divulgar fotos de pacientes em redes sociais sem autorização.'
    ],
    explanation: 'A exposição não autorizada de pacientes viola gravemente a ética e a privacidade.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_69',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Constitui violação do código de ética de enfermagem:',
    correctAnswer: 'Negar assistência em caso de urgência.',
    options: [
      'Participar de movimentos reivindicatórios.',
      'Recusar-se a executar tarefas para as quais não está apto.',
      'Denunciar falhas na instituição.',
      'Negar assistência em caso de urgência.'
    ],
    explanation: 'O socorro em urgências é um dever imperativo; a omissão de socorro é crime e falta ética.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_70',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alínea FALSA sobre ética profissional:',
    correctAnswer: 'A ética é algo que muda conforme o humor do profissional.',
    options: [
      'A ética é algo que muda conforme o humor do profissional.',
      'A ética baseia-se em valores e princípios.',
      'O profissional deve agir com honestidade.',
      'O respeito ao próximo é fundamental.'
    ],
    explanation: 'A ética baseia-se em princípios estáveis e valores universais, não em estados emocionais passageiros.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_71',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a Bioética, assinale a alínea FALSA:',
    correctAnswer: 'A bioética defende que a ciência pode fazer tudo o que é tecnicamente possível.',
    options: [
      'Estuda os problemas éticos resultantes das pesquisas biológicas.',
      'Visa proteger a dignidade humana.',
      'A bioética defende que a ciência pode fazer tudo o que é tecnicamente possível.',
      'Baseia-se no respeito à vida.'
    ],
    explanation: 'Nem tudo o que é tecnicamente possível é eticamente aceitável; a bioética impõe limites morais à ciência.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_72',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São valores universais da ética, EXCEPTO:',
    correctAnswer: 'Egoísmo',
    options: [
      'Egoísmo',
      'Liberdade',
      'Igualdade',
      'Fraternidade'
    ],
    explanation: 'O egoísmo é o oposto dos valores éticos de altruísmo e bem comum.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_73',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre o dever de sigilo, assinale a afirmação FALSA:',
    correctAnswer: 'O sigilo pode ser quebrado para fofocar com colegas de outros sectores.',
    options: [
      'O sigilo pode ser quebrado para fofocar com colegas de outros sectores.',
      'O sigilo pode ser quebrado por ordem judicial.',
      'O sigilo pode ser quebrado com autorização por escrito do paciente.',
      'O sigilo visa proteger a intimidade do doente.'
    ],
    explanation: 'A quebra de sigilo só é permitida por justa causa, dever legal ou autorização expressa, nunca para fins informais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_74',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O dever de sigilo profissional termina quando:',
    correctAnswer: 'Nunca termina, mesmo após a morte do paciente.',
    options: [
      'O paciente recebe alta.',
      'O paciente falece.',
      'O profissional muda de emprego.',
      'Nunca termina, mesmo após a morte do paciente.'
    ],
    explanation: 'O dever de sigilo é perpétuo e permanece mesmo após o óbito do assistido.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_75',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alínea FALSA sobre a conduta ética:',
    correctAnswer: 'O enfermeiro pode aceitar subornos para priorizar pacientes.',
    options: [
      'O enfermeiro deve tratar todos com cortesia.',
      'O enfermeiro pode aceitar subornos para priorizar pacientes.',
      'O enfermeiro deve colaborar com a equipe.',
      'O enfermeiro deve zelar pelo património da instituição.'
    ],
    explanation: 'Aceitar vantagens indevidas é corrupção e violação gravíssima do código de ética.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_76',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre o dever de informação, assinale a afirmação FALSA:',
    correctAnswer: 'O paciente não precisa saber o que está sendo injetado nele.',
    options: [
      'O paciente tem direito a saber seu diagnóstico.',
      'A informação deve ser clara e compreensível.',
      'O paciente deve ser informado sobre os custos se houver.',
      'O paciente não precisa saber o que está sendo injetado nele.'
    ],
    explanation: 'O paciente tem o direito de saber exatamente qual medicação e procedimento está recebendo.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_77',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São deveres da profissão de enfermagem, EXCEPTO:',
    correctAnswer: 'Omitir erros cometidos para evitar punições.',
    options: [
      'Exercer a profissão com justiça e compromisso.',
      'Respeitar a vida e a dignidade humana.',
      'Garantir a continuidade da assistência.',
      'Omitir erros cometidos para evitar punições.'
    ],
    explanation: 'Erros devem ser comunicados imediatamente para que medidas corretivas sejam tomadas visando a segurança do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_78',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alínea FALSA sobre a relação com a equipe:',
    correctAnswer: 'O enfermeiro deve criticar colegas na frente de pacientes.',
    options: [
      'Deve haver respeito mútuo.',
      'A comunicação deve ser eficiente.',
      'O enfermeiro deve criticar colegas na frente de pacientes.',
      'O trabalho em equipe melhora a segurança do paciente.'
    ],
    explanation: 'Críticas a colegas devem ser feitas em local privado e de forma construtiva, nunca perante o paciente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_79',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a ética na pesquisa com seres humanos, assinale a FALSA:',
    correctAnswer: 'Pode-se realizar pesquisas sem aprovação de comitês de ética.',
    options: [
      'O benefício deve ser maior que o risco.',
      'O participante pode desistir a qualquer momento.',
      'Pode-se realizar pesquisas sem aprovação de comitês de ética.',
      'O anonimato deve ser garantido.'
    ],
    explanation: 'Toda pesquisa com seres humanos exige aprovação prévia de um Comitê de Ética em Pesquisa (CEP).',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_80',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Assinale a alínea FALSA sobre a autonomia do paciente:',
    correctAnswer: 'O paciente deve ser forçado a fazer o que o enfermeiro quer.',
    options: [
      'O paciente tem direito à autodeterminação.',
      'O paciente deve ser forçado a fazer o que o enfermeiro quer.',
      'A autonomia deve ser respeitada sempre que possível.',
      'O paciente pode escolher entre diferentes opções de cuidado.'
    ],
    explanation: 'A autonomia pressupõe o respeito à vontade do paciente, proibindo qualquer forma de coerção ou força.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_1',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual é o sinal mais fidedigno de uma paragem cardíaca?',
    correctAnswer: 'Ausência de pulso nas grandes artérias (carotídea e femoral)',
    options: [
      'Ausência de movimentos respiratórios',
      'Cianose das extremidades',
      'Midríase (pupilas dilatadas)',
      'Ausência de pulso nas grandes artérias (carotídea e femoral)'
    ],
    explanation: 'A ausência de pulso central é o indicador definitivo de parada cardíaca.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_2',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A infecção nosocomial é aquela que:',
    correctAnswer: 'O doente adquire durante a sua estadia no hospital',
    options: [
      'O doente já traz de casa',
      'O doente adquire durante a sua estadia no hospital',
      'É transmitida apenas por insectos',
      'Só ocorre em crianças'
    ],
    explanation: 'Infecção nosocomial ou hospitalar é adquirida após a admissão do paciente na unidade de saúde.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_3',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Na diálise peritoneal, um cuidado de enfermagem fundamental é:',
    correctAnswer: 'Aquecer o líquido de diálise à temperatura corporal',
    options: [
      'Aquecer o líquido de diálise à temperatura corporal',
      'Manter o doente em jejum absoluto',
      'Administrar antibióticos via oral antes do procedimento',
      'Realizar o procedimento em ambiente não estéril'
    ],
    explanation: 'O aquecimento do líquido evita desconforto, dor abdominal e vasoconstrição peritoneal.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_4',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Após uma cirurgia abdominal, a presença de sangue vivo no penso sugere:',
    correctAnswer: 'Hemorragia activa',
    options: [
      'Cicatrização normal',
      'Hemorragia activa',
      'Infecção da ferida operatória',
      'Drenagem de serosidade'
    ],
    explanation: 'Sangue vivo (rutilante) indica sangramento ativo que requer avaliação imediata.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_5',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A diminuição acentuada da diurese (menos de 400ml/24h) denomina-se:',
    correctAnswer: 'Oligúria',
    options: [
      'Anúria',
      'Disúria',
      'Poliúria',
      'Oligúria'
    ],
    explanation: 'Oligúria é a redução do volume urinário abaixo do normal para as necessidades metabólicas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_6',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Para a entubação endotraqueal, o doente deve ser colocado em posição de:',
    correctAnswer: 'Roser (cabeça pendente)',
    options: [
      'Fowler',
      'Trendelenburg',
      'Roser (cabeça pendente)',
      'Genupeitoral'
    ],
    explanation: 'A posição de Roser facilita a visualização das cordas vocais e a passagem do tubo.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_7',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Qual destes medicamentos é um anti-térmico?',
    correctAnswer: 'Paracetamol',
    options: [
      'Penicilina',
      'Furosemida',
      'Paracetamol',
      'Diazepam'
    ],
    explanation: 'O paracetamol é amplamente utilizado por sua ação analgésica e antitérmica.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_8',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Para minimizar a dispneia num doente com insuficiência cardíaca, a posição ideal é:',
    correctAnswer: 'Fowler ou Semi-Fowler',
    options: [
      'Fowler ou Semi-Fowler',
      'Decúbito ventral',
      'Trendelenburg',
      'Decúbito lateral esquerdo'
    ],
    explanation: 'A posição elevada facilita a expansão pulmonar e diminui o retorno venoso, aliviando o esforço cardíaco.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_9',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São cuidados imediatos ao recém-nascido, EXCEPTO:',
    correctAnswer: 'Administração de vacinas do 9º mês',
    options: [
      'Desobstrução das vias aéreas',
      'Laqueação do cordão umbilical',
      'Identificação do bebé',
      'Administração de vacinas do 9º mês'
    ],
    explanation: 'Vacinas do 9º mês (como sarampo) não são cuidados imediatos ao nascimento.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_10',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A micção dolorosa ou difícil chama-se:',
    correctAnswer: 'Disúria',
    options: [
      'Hematúria',
      'Disúria',
      'Nictúria',
      'Piúria'
    ],
    explanation: 'Disúria é o termo técnico para dor, ardor ou dificuldade ao urinar.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_11',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'A mudança de decúbito em doentes acamados visa principalmente prevenir:',
    correctAnswer: 'Escaras de decúbito (úlceras por pressão)',
    options: [
      'Pneumonia',
      'Escaras de decúbito (úlceras por pressão)',
      'Atrofia muscular',
      'Obstipação'
    ],
    explanation: 'A alternância de pressão sobre a pele é vital para manter a integridade tecidual em pacientes imóveis.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_12',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'No banho no leito, a sequência correcta de limpeza é:',
    correctAnswer: 'Da zona mais limpa para a mais suja',
    options: [
      'Da zona mais suja para a mais limpa',
      'Começar sempre pelos pés',
      'Da zona mais limpa para a mais suja',
      'Não há uma sequência definida'
    ],
    explanation: 'Limpar do mais limpo para o mais sujo evita a dispersão de microrganismos para áreas menos contaminadas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_13',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São vias de administração de medicamentos, EXCEPTO:',
    correctAnswer: 'Via auditiva (para o estômago)',
    options: [
      'Via oral',
      'Via intramuscular',
      'Via auditiva (para o estômago)',
      'Via rectal'
    ],
    explanation: 'A via auditiva é para o ouvido; para o estômago usa-se a via oral ou sondas enterais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_14',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a injecção intramuscular, assinale a afirmação ERRADA:',
    correctAnswer: 'No músculo deltoide pode-se administrar até 10ml.',
    options: [
      'O ângulo deve ser de 90 graus.',
      'Deve-se aspirar antes de injectar.',
      'No músculo deltoide pode-se administrar até 10ml.',
      'O glúteo é um local comum.'
    ],
    explanation: 'O músculo deltoide suporta volumes pequenos, geralmente até 2ml ou 3ml no máximo.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_15',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O termo técnico para febre é:',
    correctAnswer: 'Hipertermia',
    options: [
      'Hipotermia',
      'Hipertermia',
      'Eupneia',
      'Bradicardia'
    ],
    explanation: 'Hipertermia ou piréxia são os termos para elevação da temperatura corporal acima do normal.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_16',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Na folha de sinais vitais, as cores usadas são, EXCEPTO:',
    correctAnswer: 'Verde para a dor',
    options: [
      'Azul para o pulso',
      'Vermelho para a temperatura',
      'Verde para a dor',
      'Preto para a respiração'
    ],
    explanation: 'Embora varie entre instituições, o verde não é uma cor padrão universal para dor em gráficos de sinais vitais clássicos.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_17',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São procedimentos na introdução da Sonda Nasogástrica (SNG), EXCEPTO:',
    correctAnswer: 'Introduzir a sonda com o doente a dormir profundamente',
    options: [
      'Medir da ponta do nariz ao lobo da orelha e ao apêndice xifoide',
      'Lubrificar a ponta da sonda',
      'Verificar o posicionamento aspirando conteúdo gástrico',
      'Introduzir a sonda com o doente a dormir profundamente'
    ],
    explanation: 'A colaboração do paciente (deglutindo) é fundamental para a passagem correta da SNG.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_18',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Na transferência do doente para o bloco operatório, deve-se garantir, EXCEPTO:',
    correctAnswer: 'Que o doente leve as suas jóias e valores',
    options: [
      'O jejum pré-operatório',
      'A remoção de próteses dentárias',
      'A presença do processo clínico completo',
      'Que o doente leve as suas jóias e valores'
    ],
    explanation: 'Objetos de valor devem ser entregues à família ou guardados pela instituição para evitar perdas ou acidentes.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_19',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Para avaliar o estado neurológico básico, observa-se, EXCEPTO:',
    correctAnswer: 'A cor da urina',
    options: [
      'A cor da urina',
      'O nível de consciência',
      'A reacção das pupilas à luz',
      'A orientação no tempo e espaço'
    ],
    explanation: 'A cor da urina não reflete o estado neurológico imediato do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_20',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sintomas de hemorragia interna, EXCEPTO:',
    correctAnswer: 'Pele quente e rosada',
    options: [
      'Sede intensa',
      'Agitação e ansiedade',
      'Pele quente e rosada',
      'Pulso rápido e fraco'
    ],
    explanation: 'Na hemorragia, a pele torna-se pálida, fria e pegajosa devido ao choque hipovolêmico.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_21',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sinais de desidratação grave na criança, EXCEPTO:',
    correctAnswer: 'Choro com lágrimas abundantes',
    options: [
      'Olhos muito fundos',
      'Sinal da prega cutânea positivo',
      'Incapacidade de beber líquidos',
      'Choro com lágrimas abundantes'
    ],
    explanation: 'A ausência de lágrimas é um sinal clássico de desidratação.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_22',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sinais de alerta no Sarampo, EXCEPTO:',
    correctAnswer: 'Apetite aumentado',
    options: [
      'Febre persistente',
      'Dificuldade respiratória',
      'Convulsões',
      'Apetite aumentado'
    ],
    explanation: 'A perda de apetite (anorexia) é comum em doenças infecciosas como o sarampo.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_23',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Após uma injecção intramuscular, é normal o doente apresentar:',
    correctAnswer: 'Nenhuma das anteriores',
    options: [
      'Febre alta imediata',
      'Paralisia do membro',
      'Hemorragia abundante',
      'Nenhuma das anteriores'
    ],
    explanation: 'Nenhum desses sintomas é esperado em uma aplicação correta de injeção IM.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_24',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'O local de eleição para injecção IM no glúteo é:',
    correctAnswer: 'Quadrante superior externo',
    options: [
      'Quadrante superior externo',
      'Quadrante inferior interno',
      'Centro da nádega',
      'Perto do nervo ciático'
    ],
    explanation: 'O quadrante superior externo é a zona de segurança para evitar lesões nervosas.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_25',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'São materiais para punção endovenosa, EXCEPTO:',
    correctAnswer: 'Sonda de aspiração',
    options: [
      'Cateter (Abocath ou Butterfly)',
      'Garrote',
      'Algodão com álcool',
      'Sonda de aspiração'
    ],
    explanation: 'Sondas de aspiração são usadas para vias aéreas, não para punção venosa.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_26',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'É factor de risco para Hipertensão Arterial, EXCEPTO:',
    correctAnswer: 'Beber muita água',
    options: [
      'Beber muita água',
      'Sedentarismo',
      'Tabagismo',
      'Consumo de álcool'
    ],
    explanation: 'A hidratação adequada é saudável; os outros são fatores de risco cardiovascular.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_27',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a infecção nosocomial, é VERDADEIRO que:',
    correctAnswer: 'A lavagem das mãos é a medida principal de prevenção',
    options: [
      'Ocorre apenas em hospitais privados',
      'É impossível de prevenir',
      'A lavagem das mãos é a medida principal de prevenção',
      'Só afecta doentes com VIH'
    ],
    explanation: 'A higienização das mãos é a estratégia mais simples e eficaz para reduzir infecções hospitalares.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_28',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São locais para injecção intramuscular, EXCEPTO:',
    correctAnswer: 'Músculo abdominal',
    options: [
      'Vasto lateral da coxa',
      'Deltoide',
      'Glúteo',
      'Músculo abdominal'
    ],
    explanation: 'O músculo abdominal é usado para via subcutânea (insulina, heparina), não intramuscular.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_29',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a administração de medicação, assinale a FALSA:',
    correctAnswer: 'Pode-se administrar medicação sem prescrição médica ou protocolo',
    options: [
      'Deve-se conferir o nome do doente',
      'Deve-se verificar a validade do fármaco',
      'Deve-se registar após administrar',
      'Pode-se administrar medicação sem prescrição médica ou protocolo'
    ],
    explanation: 'Toda medicação deve ser respaldada por prescrição médica legal ou protocolos institucionais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_30',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre queimaduras e hipovolemia, assinale a FALSA:',
    correctAnswer: 'A perda de líquidos só ocorre em queimaduras de 3º grau',
    options: [
      'Queimaduras extensas causam grande perda de plasma',
      'A perda de líquidos só ocorre em queimaduras de 3º grau',
      'O choque hipovolémico é um risco grave',
      'A reposição de líquidos deve ser imediata'
    ],
    explanation: 'Queimaduras de 2º grau (com bolhas) também causam perda significativa de líquidos e eletrólitos.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_31',
    category: 'Enfermagem',
    difficulty: 'easy',
    type: 'multiple',
    questionText: 'Sobre a mudança de decúbito, é VERDADE que:',
    correctAnswer: 'Deve ser feita pelo menos de 2 em 2 horas',
    options: [
      'Só deve ser feita uma vez por dia',
      'Deve ser feita pelo menos de 2 em 2 horas',
      'Só é necessária se o doente pedir',
      'Não é necessária em doentes magros'
    ],
    explanation: 'O protocolo padrão de mudança de decúbito é a cada 2 horas para prevenir lesões por pressão.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_32',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre a via parenteral, é VERDADE que:',
    correctAnswer: 'A absorção é mais rápida que pela via oral',
    options: [
      'A absorção é mais rápida que pela via oral',
      'É a via mais segura e fácil de administrar',
      'Não requer técnica asséptica',
      'Só pode ser usada em doentes conscientes'
    ],
    explanation: 'Vias parenterais (IM, EV, SC) pulam a barreira digestiva, resultando em ação mais rápida.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_33',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A isquemia prolongada dos tecidos sobre proeminências ósseas causa:',
    correctAnswer: 'Escaras de decúbito',
    options: [
      'Edema',
      'Hematomas',
      'Escaras de decúbito',
      'Urticária'
    ],
    explanation: 'A pressão contínua interrompe o fluxo sanguíneo (isquemia), levando à morte tecidual e formação de úlceras.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_34',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'São sinais de infecção puerperal, EXCEPTO:',
    correctAnswer: 'Lóquios sem cheiro e rosados',
    options: [
      'Febre acima de 38ºC',
      'Lóquios com cheiro fétido',
      'Dor abdominal intensa',
      'Lóquios sem cheiro e rosados'
    ],
    explanation: 'Lóquios rosados e sem odor fétido são normais no período pós-parto.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list2_35',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre complicações de injecção IM mal aplicada, assinale a INCORRECTA:',
    correctAnswer: 'Melhoria imediata da mobilidade',
    options: [
      'Abcesso local',
      'Lesão do nervo ciático',
      'Necrose tecidual',
      'Melhoria imediata da mobilidade'
    ],
    explanation: 'Uma injeção mal aplicada causa danos e dor, nunca melhora a mobilidade imediatamente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_1',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o princípio da Bioética que obriga o profissional a fazer o bem e maximizar os benefícios para o paciente?',
    correctAnswer: 'Beneficência',
    options: [
      'Autonomia',
      'Justiça',
      'Beneficência',
      'Não-maleficência'
    ],
    explanation: 'A beneficência é o dever ético de agir no melhor interesse do paciente.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_2',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O isolamento de "Precauções por Gotículas" é indicado para qual das seguintes patologias?',
    correctAnswer: 'Meningite Bacteriana',
    options: [
      'Tuberculose Pulmonar',
      'Sarampo',
      'Meningite Bacteriana',
      'Varicela'
    ],
    explanation: 'Gotículas são partículas maiores que 5 micras que viajam curtas distâncias, comum na meningite e gripe.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_3',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Na classificação de risco (Protocolo de Manchester), a cor VERMELHA indica:',
    correctAnswer: 'Emergência (Atendimento imediato)',
    options: [
      'Urgência (Atendimento em até 60 min)',
      'Emergência (Atendimento imediato)',
      'Muito Urgente (Atendimento em até 10 min)',
      'Pouco Urgente (Atendimento em até 120 min)'
    ],
    explanation: 'O vermelho é reservado para casos com risco iminente de morte que exigem intervenção imediata.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_4',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a principal causa de mortalidade materna em Angola, frequentemente associada à falta de assistência pré-natal?',
    correctAnswer: 'Hemorragia pós-parto',
    options: [
      'Eclâmpsia',
      'Hemorragia pós-parto',
      'Sepsis puerperal',
      'Aborto inseguro'
    ],
    explanation: 'As hemorragias continuam sendo a principal causa direta de morte materna no país.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_5',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'O Programa Alargado de Vacinação (PAV) em Angola recomenda a vacina da Pólio (VOP) em quantas doses básicas no primeiro ano de vida?',
    correctAnswer: '3 doses',
    options: [
      '1 dose',
      '2 doses',
      '3 doses',
      '4 doses'
    ],
    explanation: 'O esquema básico da VOP/VIP consiste em 3 doses (2, 4 e 6 meses) mais reforços.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_6',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é o termo técnico para a presença de sangue na urina?',
    correctAnswer: 'Hematúria',
    options: [
      'Glicosúria',
      'Piúria',
      'Hematúria',
      'Proteinúria'
    ],
    explanation: 'Hematúria é a presença de hemácias na urina, podendo ser macroscópica ou microscópica.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_7',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'A administração de oxigénio por cateter nasal deve ter um fluxo máximo de:',
    correctAnswer: '5 a 6 litros por minuto',
    options: [
      '2 litros por minuto',
      '5 a 6 litros por minuto',
      '10 litros por minuto',
      '15 litros por minuto'
    ],
    explanation: 'Fluxos acima de 6L/min por cateter nasal não aumentam a FiO2 e causam ressecamento excessivo da mucosa.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_8',
    category: 'Enfermagem',
    difficulty: 'hard',
    type: 'multiple',
    questionText: 'Qual é a principal complicação da Terapia Intravenosa caracterizada por inflamação da veia?',
    correctAnswer: 'Flebite',
    options: [
      'Infiltração',
      'Extravasamento',
      'Flebite',
      'Embolia gasosa'
    ],
    explanation: 'A flebite pode ser química, mecânica ou infecciosa, manifestando-se por dor, calor e rubor no trajeto venoso.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_9',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Sobre o descarte de materiais perfurocortantes, assinale a opção correcta:',
    correctAnswer: 'Devem ser descartados em caixas rígidas e resistentes à perfuração.',
    options: [
      'Devem ser descartados no lixo comum.',
      'Devem ser descartados em sacos plásticos vermelhos.',
      'Devem ser descartados em caixas rígidas e resistentes à perfuração.',
      'Devem ser lavados e reutilizados.'
    ],
    explanation: 'O uso de coletores rígidos (como o Descarpack) é obrigatório para prevenir acidentes ocupacionais.',
    createdAt: Date.now()
  },
  {
    id: 'enf_new_list3_10',
    category: 'Enfermagem',
    difficulty: 'medium',
    type: 'multiple',
    questionText: 'Qual é a posição indicada para pacientes com dificuldade respiratória grave?',
    correctAnswer: 'Posição de Fowler ou Semi-Fowler',
    options: [
      'Decúbito Dorsal',
      'Posição de Trendelenburg',
      'Posição de Fowler ou Semi-Fowler',
      'Decúbito Lateral Direito'
    ],
    explanation: 'A posição sentada ou semi-sentada facilita a expansão pulmonar e diminui o esforço respiratório.',
    createdAt: Date.now()
  }
];
