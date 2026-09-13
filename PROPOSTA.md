# :checkered_flag: NOME DO PROJETO
**QuixasPet**
Portal que conecta ONGs de proteção animal a pessoas interessadas em adotar,
tornando o processo mais transparente e acessível.


## :technologist: Membros da equipe
580224 DIOGO ASSUNCAO DA SILVA - Ciência da Computação
581924 JOAO DAVID BRANDAO DE ARAUJO - Ciência da Computação
579284 JOAO EDUARDO RABELO DE MEDEIROS - Ciência da Computação


## :bulb: Objetivo Geral
Desenvolver um portal web que facilite e organize o processo de adoção
responsável de animais, conectando ONGs a potenciais adotantes de forma
simples e transparente.


## :eyes: Público-Alvo
ONGs e protetores independentes de animais, e pessoas interessadas em adotar
um pet de forma responsável.


## :star2: Impacto Esperado
Aumentar as taxas de adoção responsável ao centralizar animais disponíveis em
um único portal, reduzir o abandono ao conscientizar sobre o processo e
desburocratizar a comunicação entre ONGs e adotantes.


## :people_holding_hands: Papéis ou tipos de usuário da aplicação
- **Visitante** (não autenticado): acesso à galeria pública e detalhes dos animais.
- **Adotante** (autenticado): pode enviar e acompanhar solicitações de adoção.
- **Administrador de ONG** (autenticado): gerencia o cadastro de animais e as solicitações recebidas.


> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.
## :triangular_flag_on_post:	 Principais funcionalidades da aplicação
### Acessíveis a todos
- Galeria de animais disponíveis para adoção
- Filtros por espécie, porte, idade e localidade
- Página de detalhes de cada animal (fotos, descrição, temperamento)
- Página informativa sobre o processo de adoção


### Restritas a usuários logados
- **Adotante:** envio de formulário de interesse; acompanhamento do status
  das próprias solicitações
- **Admin ONG:** cadastro, edição e remoção de animais; visualização e
  gestão de solicitações (aprovar/recusar); atualização automática do
  status do animal para "adotado"


## :spiral_calendar: Entidades ou tabelas do sistema
- **Usuario** — dados de autenticação e papel (adotante ou admin)
- **Animal** — espécie, nome, idade, porte, descrição, fotos, status
- **SolicitacaoAdocao** — relaciona Usuario e Animal; inclui data e status (pendente / aprovada / recusada)
- **ONG** — informações da organização responsável pelo animal
