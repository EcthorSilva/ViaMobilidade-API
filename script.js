const linha = 'L9';
const estacoes = ['MVN', 'GRA', 'INT', 'AUT', 'JUR', 'SOC', 'SAM'];
const API_BASE = 'https://apim-proximotrem-prd-brazilsouth-001.azure-api.net/api/v1/lines';

let trens = {
  'MVN_SAM': {},
  'SAM_MVN': {}
};

async function pegarDados() {
  trens = { 'MVN_SAM': {}, 'SAM_MVN': {} };
  
  const todosTrensUnicos = {};

  for (const est of estacoes) {
    try {
      const url = `${API_BASE}/${linha}/stations/${est}/next-train`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      data.forEach(trem => {
        const idxOrigemTrem = estacoes.indexOf(trem.estacao_origem_trem);
        const idxDestino = estacoes.indexOf(trem.estacao_destino);

        if (idxOrigemTrem !== -1 && idxDestino !== -1) {
          const sentido = (idxOrigemTrem < idxDestino) ? 'MVN_SAM' : 'SAM_MVN';
          const proximaEstacao = (sentido === 'MVN_SAM') ? estacoes[idxOrigemTrem + 1] : estacoes[idxOrigemTrem - 1];
          
          const chaveUnica = `${trem.estacao_origem_trem}-${proximaEstacao}`;

          if (!todosTrensUnicos[chaveUnica]) {
            todosTrensUnicos[chaveUnica] = {
              origem: trem.estacao_origem_trem,
              destinoFinal: trem.estacao_destino,
              proxima: proximaEstacao || trem.estacao_destino,
              status: trem.status,
              sentido: sentido
            };
          }
        }
      });
    } catch (err) {
      console.error(`Erro estação ${est}:`, err);
    }
  }

  let tremId = 1;
  Object.values(todosTrensUnicos).forEach(trem => {
    trens[trem.sentido][tremId] = { id: tremId++, ...trem };
  });

  mostrarTrens();
}

function mostrarTrens() {
  console.clear();
  console.log(`[Atualização - ${new Date().toLocaleTimeString()}]`);
  
  const trensMvnSam = Object.values(trens['MVN_SAM']);
  console.log(`\n${trensMvnSam.length} trem(ns) no sentido MVN → SAM:\n`);
  trensMvnSam.forEach(trem => {
    const statusText = (trem.status === 'plataforma') ? `está na plataforma da estação ${trem.origem}` : `saiu da estação ${trem.origem}`;
    console.log(`Trem #${trem.id} ${statusText} e está indo para a próxima estação ${trem.proxima} (destino final: ${trem.destinoFinal}).`);
  });

  const trensSamMvn = Object.values(trens['SAM_MVN']);
  console.log(`\n${trensSamMvn.length} trem(ns) no sentido SAM → MVN:\n`);
  trensSamMvn.forEach(trem => {
    const statusText = (trem.status === 'plataforma') ? `está na plataforma da estação ${trem.origem}` : `saiu da estação ${trem.origem}`;
    console.log(`Trem #${trem.id} ${statusText} e está indo para a próxima estação ${trem.proxima} (destino final: ${trem.destinoFinal}).`);
  });
}

setInterval(pegarDados, 5000);