# API Proximo Trem - Via Mobilidade
###### Engenharia Reversa na API do Próximo Trem (Via Mobilidade)

## Descrição

Um belo dia, enquanto aguardava o trem na estação Grajaú, me deparei com um QR Code na parede da estação Grajaú com a frase _"Aponte a câmera do seu celular para o QR Code e descubra quando o próximo trem chegará"_ . Ao acessar o link fornecido, fiquei curioso sobre como as informações eram apresentadas e decidi investigar enquanto aguardava meu trem. Baixei um aplicativo para celular parecido com o Postman e com alguns minutos vasculhando o site descobri uma API interessante que fornecia informações sobre o horário estimado de chegada do próximo trem.

Neste repositório, vou documentar o que encontrei sobre essa API e como a engenharia reversa foi aplicada para acessar e entender os dados por trás do site.

## O que é o "Próximo Trem"?

O **Próximo Trem** é um sistema desenvolvido pela **ViaMobilidade** para informar aos passageiros o tempo estimado de chegada do próximo trem nas estações. Através de QRCodes instalados nas plataformas de embarque, o sistema permite que os passageiros consultem informações em tempo real sobre o número da linha, o sentido do trem, status da operação e horário de previsão de chegada.

Você pode acessar o sistema através dos QR Codes espalhados em todas as estações das Linhas 8 e 9. 

Segundo o site do grupo CCR o sistema utiliza tecnologias avançadas como Inteligência Artificial (IA), Machine Learning e Big Data para fornecer previsões precisas sobre os horários de chegada dos trens.

Para mais informações sobre o sistema "Próximo Trem", você pode acessar [este artigo](https://mobilidade.grupoccr.com.br/viamobilidade8e9/noticias/2024-12/novo-sistema-de-previsao-dos-trens-da-viamobilidade-e-construido/), publicado pela Assessoria de Comunicação da ViaMobilidade.

## A Investigação

O site que encontrei é utilizado para acompanhar o horário estimado de chegada do próximo trem na estação em que você se encontra. No meu caso o link acessado foi:

[https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=GRA](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=GRA)

Ao acessar a URL, percebi que ela possui dois parâmetros:
- `linha`: O número da linha do trem.
- `estacao_origem`: A estação de origem (no meu caso, Grajaú).

Após ver a URL e notar os parâmetros, utilizei um software de testes de API (semelhante ao Postman) para testar as requisições e entender melhor como os dados eram fornecidos. Com o tempo, tive a ideia de investigar o comportamento da página no navegador.

Utilizando o **DevTools** do meu navegador, acessei a aba **Network** e observei que a página estava fazendo requisições regulares para dois endpoints principais: `next-train` e `lines`. 

Após limpar os logs, esperei por uma nova requisição e, ao parar de gravar, consegui capturar a URL da API que estava sendo acessada. A partir daí, obtive acesso às informações da API, incluindo os horários de partida e os nomes das estações da Linha 9 Esmeralda.

## Endpoints

### 1. Endpoint `next-train`

**URL**: `https://apim-proximotrem-prd-brazilsouth-001.azure-api.net/api/v1/lines/L9/stations/GRA/next-train`

**Método**: **GET**

**Resposta**:

```json
[
    {
        "linha": "L9",
        "estacao_origem": "GRA",
        "estacao_destino": "MVN",
        "estacao_origem_trem": "SOC",
        "proximo_em": 489,
        "hora_previsto_chegada": "16:23",
        "atualizado_em": "2024-12-30 16:15:30.198362",
        "status": "deslocamento"
    },
    {
        "linha": "L9",
        "estacao_origem": "GRA",
        "estacao_destino": "INT",
        "estacao_origem_trem": "MVN",
        "proximo_em": 125,
        "hora_previsto_chegada": "16:16",
        "atualizado_em": "2024-12-30 16:15:30.199579",
        "status": "plataforma"
    }
]

```

#### Lógica das informações:

- estacao_origem: Onde foi feita a requisição (onde você está).
- estacao_destino: A próxima estação onde o trem vai parar.
- estacao_origem_trem: A última estação em que o trem esteve.
- proximo_em: O tempo em segundos até o próximo trem chegar.
- hora_previsto_chegada: A hora prevista de chegada do próximo trem.
- status: O status do trem, como "deslocamento" ou "plataforma".

#### Lista de Estações da Linha 9 - Esmeralda  

- MVN - [Mendes Vila Natal](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=MVN)  
- GRA - [Grajaú](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=GRA)  
- INT - [Primavera Interlagos](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=INT)  
- AUT - [Autódromo](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=AUT)  
- JUR - [Jurubatuba Senac](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=JUR)  
- SOC - [Socorro](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=SOC)  
- SAM - [Santo Amaro](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=SAM)  
- JOD - [João Dias](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=JOD)  
- GJT - [Granja Julieta](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=GJT)  
- MRB - [Morumbi - Claro](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=MRB)  
- BRR - [Berrini](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=BRR)  
- VOL - [Vila Olímpia](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=VOL)  
- CJD - [Cidade Jardim](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=CJD)  
- HBR - [Hebraica - Rebouças](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=HBR)  
- PIN - [Pinheiros](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=PIN)  
- USP - [Cidade Universitária](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=USP)  
- JAG - [Villa Lobos - Jaguaré](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=JAG)  
- CEA - [Ceasa](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=CEA)  
- PAL - [Presidente Altino](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=PAL)  
- OSA - [Osasco](https://proximotrem.viamobilidade.com.br/?linha=L9&estacao_origem=OSA)  

#### Lista de Estações da Linha 8 - Diamante 

- IPV
- ECD
- SCO
- JDI
- JSI
- JBE
- BRU
- AJO
- STE
- CPB
- GMC
- QTU
- CSA
- OSA
- PAL
- ILE
- DMO
- LAB
- BFU
- JPR

### 2. Endpoint lines  
**URL**: `https://apim-proximotrem-prd-brazilsouth-001.azure-api.net/api/v1/lines`  
**Método**: **GET**  
**Resposta**:  

```json
{
    "Status": true,
    "Message": "",
    "MessageDebug": "",
    "Data": [
        {
            "Code": 1,
            "ColorName": "Azul",
            "ColorHex": "#00378c",
            "Line": "Linha 1 - Azul",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": "Operação Normal"
        },
        {
            "Code": 2,
            "ColorName": "Verde",
            "ColorHex": "#186d55",
            "Line": "Linha 2 - Verde",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": "Operação Normal"
        },
        {
            "Code": 3,
            "ColorName": "Vermelha",
            "ColorHex": "#f51200",
            "Line": "Linha 3 - Vermelha",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": "Operação Normal"
        },
        {
            "Code": 4,
            "ColorName": "Amarela",
            "ColorHex": "#efba00",
            "Line": "Linha 4-Amarela",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": ""
        },
        {
            "Code": 5,
            "ColorName": "Lilás",
            "ColorHex": "#9271b1",
            "Line": "Linha 5-Lilás",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": null
        },
        {
            "Code": 7,
            "ColorName": "RUBI",
            "ColorHex": "#c80857",
            "Line": "RUBI",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": ""
        },
        {
            "Code": 8,
            "ColorName": "Diamante",
            "ColorHex": "#949488",
            "Line": "Linha 8-Diamante",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": null
        },
        {
            "Code": 9,
            "ColorName": "Esmeralda",
            "ColorHex": "#219896",
            "Line": "Linha 9-Esmeralda",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": null
        },
        {
            "Code": 10,
            "ColorName": "TURQUESA",
            "ColorHex": "#1c8aab",
            "Line": "TURQUESA",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": ""
        },
        {
            "Code": 11,
            "ColorName": "CORAL",
            "ColorHex": "#f46c55",
            "Line": "CORAL",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": ""
        },
        {
            "Code": 12,
            "ColorName": "SAFIRA",
            "ColorHex": "#1f2086",
            "Line": "SAFIRA",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": ""
        },
        {
            "Code": 13,
            "ColorName": "JADE",
            "ColorHex": "#29b352",
            "Line": "JADE",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": ""
        },
        {
            "Code": 15,
            "ColorName": "Prata",
            "ColorHex": "#848d90",
            "Line": "Linha 15 - Prata",
            "StatusCode": "OperacaoNormal",
            "StatusLabel": "Operação Normal",
            "StatusColor": "verde",
            "Description": "Operação Normal"
        }
    ]
}
```

## Contribuições

Este é um repositório pessoal, mas se você tiver algum conhecimento relacionado ou quiser compartilhar algo, fique à vontade para contribuir!

## Licença

Este projeto é de uso pessoal e, por enquanto, não está licenciado. Fique à vontade para explorar, mas lembre-se de respeitar as leis de privacidade e de uso de dados.

---

**Nota**: Este repositório é apenas um estudo de caso sobre a engenharia reversa de uma API pública e não está vinculado à Via Mobilidade ou qualquer outra entidade.
