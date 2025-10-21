'use strict';

let notas = [];

window.addEventListener('DOMContentLoaded', () => {
  notas = JSON.parse(localStorage.getItem('notas') || '[]');

  if (notas.length === 0) {
    mostrarEstadoVazio();
    return;
  }

  gerarEstatisticas();
  gerarGraficos();
  listarNotas();
});

function mostrarEstadoVazio() {
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    statsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="icon"><i class="fas fa-inbox" style="font-size: 5rem;"></i></div>
        <h2>Nenhuma nota cadastrada</h2>
        <p>Comece fazendo o upload da sua primeira nota fiscal!</p>
        <a href="upload.html" class="btn" style="margin-top: 1rem;"><i class="fas fa-plus-circle"></i> Adicionar Nota</a>
      </div>
    `;
  }

  const chartSections = document.querySelectorAll('.charts-section');
  chartSections.forEach(section => {
    section.style.display = 'none';
  });

  const notasList = document.querySelector('.notas-list');
  if (notasList) {
    notasList.style.display = 'none';
  }
}

function gerarEstatisticas() {
  const totalNotas = notas.length;
  const valorTotal = notas.reduce((sum, nota) => sum + (nota.valorTotal || 0), 0);
  const ticketMedio = totalNotas > 0 ? valorTotal / totalNotas : 0;
  const lojasUnicas = new Set(notas.map(nota => nota.nomeLoja)).size;

  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) {
    return;
  }

  statsGrid.innerHTML = `
    <div class="stat-card stat-blue">
      <div class="icon"><i class="fas fa-file-invoice"></i></div>
      <div class="value">${totalNotas}</div>
      <div class="label">Notas Cadastradas</div>
    </div>
    <div class="stat-card stat-green">
      <div class="icon"><i class="fas fa-dollar-sign"></i></div>
      <div class="value">R$ ${valorTotal.toFixed(2)}</div>
      <div class="label">Valor Total</div>
    </div>
    <div class="stat-card stat-purple">
      <div class="icon"><i class="fas fa-bullseye"></i></div>
      <div class="value">R$ ${ticketMedio.toFixed(2)}</div>
      <div class="label">Ticket Médio</div>
    </div>
    <div class="stat-card stat-orange">
      <div class="icon"><i class="fas fa-store"></i></div>
      <div class="value">${lojasUnicas}</div>
      <div class="label">Lojas Diferentes</div>
    </div>
  `;
}

function gerarGraficos() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js não carregado');
    return;
  }

  const gastosPorLoja = {};
  notas.forEach(nota => {
    const loja = nota.nomeLoja || 'Desconhecido';
    gastosPorLoja[loja] = (gastosPorLoja[loja] || 0) + (nota.valorTotal || 0);
  });

  const lojasTop = Object.entries(gastosPorLoja)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const ctxLojas = document.getElementById('chartLojas');
  if (ctxLojas) {
    new Chart(ctxLojas, {
      type: 'bar',
      data: {
        labels: lojasTop.map(loja => loja[0]),
        datasets: [{
          label: 'Gasto Total (R$)',
          data: lojasTop.map(loja => loja[1]),
          backgroundColor: 'rgba(138, 43, 226, 0.6)',
          borderColor: 'rgba(138, 43, 226, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }

  const notasOrdenadas = [...notas].sort((a, b) => new Date(a.data) - new Date(b.data));
  const ctxTempo = document.getElementById('chartTempo');
  if (ctxTempo) {
    new Chart(ctxTempo, {
      type: 'line',
      data: {
        labels: notasOrdenadas.map(nota => new Date(nota.data).toLocaleDateString('pt-BR')),
        datasets: [{
          label: 'Valor da Nota (R$)',
          data: notasOrdenadas.map(nota => nota.valorTotal || 0),
          borderColor: 'rgba(43, 220, 251, 1)',
          backgroundColor: 'rgba(43, 220, 251, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'white' } } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }

  const produtosCount = {};
  notas.forEach(nota => {
    nota.itens?.forEach(item => {
      const nome = item.nome || 'Desconhecido';
      produtosCount[nome] = (produtosCount[nome] || 0) + (item.quantidade || 1);
    });
  });

  const produtosTop = Object.entries(produtosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const ctxProdutos = document.getElementById('chartProdutos');
  if (ctxProdutos) {
    new Chart(ctxProdutos, {
      type: 'doughnut',
      data: {
        labels: produtosTop.map(produto => produto[0]),
        datasets: [{
          data: produtosTop.map(produto => produto[1]),
          backgroundColor: [
            'rgba(138, 43, 226, 0.8)',
            'rgba(43, 220, 251, 0.8)',
            'rgba(81, 207, 102, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(255, 200, 0, 0.8)'
          ],
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.2)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: 'white' }
          }
        }
      }
    });
  }

  const faixas = {
    '0-50': 0,
    '50-100': 0,
    '100-200': 0,
    '200-500': 0,
    '500+': 0
  };

  notas.forEach(nota => {
    const valor = nota.valorTotal || 0;
    if (valor <= 50) faixas['0-50']++;
    else if (valor <= 100) faixas['50-100']++;
    else if (valor <= 200) faixas['100-200']++;
    else if (valor <= 500) faixas['200-500']++;
    else faixas['500+']++;
  });

  const ctxDistribuicao = document.getElementById('chartDistribuicao');
  if (ctxDistribuicao) {
    new Chart(ctxDistribuicao, {
      type: 'bar',
      data: {
        labels: Object.keys(faixas).map(faixa => `R$ ${faixa}`),
        datasets: [{
          label: 'Quantidade de Notas',
          data: Object.values(faixas),
          backgroundColor: 'rgba(81, 207, 102, 0.6)',
          borderColor: 'rgba(81, 207, 102, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: 'white', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }

  const gastosPorCategoria = {};
  notas.forEach(nota => {
    nota.itens?.forEach(item => {
      const categoria = item.categoria || 'Outros';
      gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + (item.valorTotal || item.valor || 0);
    });
  });

  const categoriasOrdenadas = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const ctxCategorias = document.getElementById('chartCategorias');
  if (ctxCategorias && categoriasOrdenadas.length > 0) {
    const cores = ['#2bdcfb', '#51cf66', '#ff9f43', '#8a2be2', '#ff6b6b', '#ffc800', '#00d4ff', '#a78bfa'];

    new Chart(ctxCategorias, {
      type: 'doughnut',
      data: {
        labels: categoriasOrdenadas.map(cat => cat[0]),
        datasets: [{
          data: categoriasOrdenadas.map(cat => cat[1]),
          backgroundColor: cores,
          borderColor: '#1a1a2e',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: 'white', font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: R$ ${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }
}

function listarNotas() {
  const notasList = document.getElementById('notasList');
  if (!notasList) {
    return;
  }

  if (notas.length === 0) {
    notasList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Nenhuma nota encontrada.</p>';
    return;
  }

  const notasOrdenadas = [...notas].sort((a, b) => new Date(b.data) - new Date(a.data));

  notasList.innerHTML = notasOrdenadas
    .map((nota, index) => `
      <div class="nota-item" onclick="verDetalhes(${index})">
        <div class="nota-header">
          <div class="nota-loja"><i class="fas fa-store"></i> ${nota.nomeLoja || 'Loja Desconhecida'}</div>
          <div class="nota-valor">R$ ${(nota.valorTotal || 0).toFixed(2)}</div>
        </div>
        <div class="nota-details">
          <span><i class="fas fa-calendar-alt"></i> ${new Date(nota.data).toLocaleDateString('pt-BR')}</span>
          <span><i class="fas fa-box"></i> ${nota.itens?.length || 0} itens</span>
          <span><i class="fas fa-file-invoice"></i> ${nota.cnpj || 'CNPJ não identificado'}</span>
        </div>
      </div>
    `)
    .join('');
}

function verDetalhes(index) {
  const notasOrdenadas = [...notas].sort((a, b) => new Date(b.data) - new Date(a.data));
  const notaSelecionada = notasOrdenadas[index];
  if (!notaSelecionada) {
    return;
  }

  localStorage.setItem('ultimaNota', JSON.stringify(notaSelecionada));
  window.location.href = 'analise.html';
}

function limparHistorico() {
  if (!confirm('⚠️ Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita!')) {
    return;
  }

  localStorage.removeItem('notas');
  localStorage.removeItem('ultimaNota');
  window.location.reload();
}

function exportarHTML() {
  if (notas.length === 0) {
    alert('❌ Nenhuma nota para exportar!');
    return;
  }

  const totalNotas = notas.length;
  const valorTotal = notas.reduce((sum, nota) => sum + (nota.valorTotal || 0), 0);
  const ticketMedio = totalNotas > 0 ? valorTotal / totalNotas : 0;
  const lojasUnicas = new Set(notas.map(nota => nota.nomeLoja)).size;

  const escapeHTML = text => String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const gastosPorCategoria = {};
  notas.forEach(nota => {
    nota.itens?.forEach(item => {
      const categoria = item.categoria || 'Outros';
      gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + (item.valorTotal || item.valor || 0);
    });
  });

  const categoriasHTML = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, valor]) => `<div class="categoria-item"><strong>${escapeHTML(categoria)}:</strong> R$ ${valor.toFixed(2)}</div>`)
    .join('') || '<p>Nenhuma categoria registrada.</p>';

  const notasHTML = [...notas]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .map(nota => `
      <tr>
        <td>${new Date(nota.data).toLocaleDateString('pt-BR')}</td>
        <td>${escapeHTML(nota.nomeLoja || 'Desconhecida')}</td>
        <td>${nota.itens?.length || 0} itens</td>
        <td>R$ ${(nota.valorTotal || 0).toFixed(2)}</td>
      </tr>
    `)
    .join('');

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const htmlLines = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="UTF-8">',
    `<title>Relatório PathTrack - ${dataAtual}</title>`,
    '<style>',
    'body { font-family: Arial, sans-serif; padding: 2rem; color: #333; }',
    'h1 { color: #8a2be2; border-bottom: 3px solid #8a2be2; padding-bottom: 0.5rem; }',
    'h2 { color: #555; margin-top: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 0.3rem; }',
    '.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0; }',
    '.stat-box { background: #f5f5f5; padding: 1rem; border-radius: 8px; text-align: center; }',
    '.stat-value { font-size: 1.8rem; font-weight: bold; color: #8a2be2; }',
    '.stat-label { font-size: 0.9rem; color: #666; margin-top: 0.5rem; }',
    'table { width: 100%; border-collapse: collapse; margin-top: 1rem; }',
    'th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid #ddd; }',
    'th { background: #8a2be2; color: white; }',
    'tr:hover { background: #f9f9f9; }',
    '.categoria-list { margin-top: 1rem; }',
    '.categoria-item { padding: 0.5rem; margin: 0.3rem 0; background: #f0f0f0; border-radius: 4px; }',
    '.footer { margin-top: 3rem; text-align: center; color: #999; font-size: 0.8rem; }',
    '@media print { body { padding: 1rem; } }',
    '</style>',
    '</head>',
    '<body>',
    '<h1>📊 Relatório de Análise de Gastos - PathTrack</h1>',
    `<p><strong>Data de geração:</strong> ${dataAtual}</p>`,
    '<h2>📈 Estatísticas Gerais</h2>',
    '<div class="stats">',
    `<div class="stat-box"><div class="stat-value">${totalNotas}</div><div class="stat-label">Notas Cadastradas</div></div>`,
    `<div class="stat-box"><div class="stat-value">R$ ${valorTotal.toFixed(2)}</div><div class="stat-label">Valor Total</div></div>`,
    `<div class="stat-box"><div class="stat-value">R$ ${ticketMedio.toFixed(2)}</div><div class="stat-label">Ticket Médio</div></div>`,
    `<div class="stat-box"><div class="stat-value">${lojasUnicas}</div><div class="stat-label">Lojas Diferentes</div></div>`,
    '</div>',
    '<h2>🏪 Gastos por Categoria</h2>',
    `<div class="categoria-list">${categoriasHTML}</div>`,
    '<h2>📋 Histórico de Notas</h2>',
    '<table>',
    '<thead><tr><th>Data</th><th>Loja</th><th>Itens</th><th>Valor Total</th></tr></thead>',
    `<tbody>${notasHTML}</tbody>`,
    '</table>',
    '<div class="footer">',
    '<p>Relatório gerado por PathTrack - Sistema de Análise de Notas Fiscais</p>',
    '<p>© 2025 PathTrack. Todos os direitos reservados.</p>',
    '</div>',
    '</body>',
    '</html>'
  ];

  const htmlContent = htmlLines.join('\n');
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pathtrack-relatorio-${new Date().toISOString().split('T')[0]}.html`;
  link.click();
  URL.revokeObjectURL(url);

  alert('✅ Arquivo HTML gerado! Abra no navegador e use Ctrl+P para salvar como PDF.');
}

function exportarCSV() {
  if (notas.length === 0) {
    alert('❌ Nenhuma nota para exportar!');
    return;
  }

  let csvContent = 'Data,Loja,CNPJ,Produto,Categoria,Quantidade,Valor Unitário,Valor Total,Nota Total\n';

  notas.forEach(nota => {
    const data = new Date(nota.data).toLocaleDateString('pt-BR');
    const loja = (nota.nomeLoja || 'Desconhecida').replace(/,/g, ';');
    const cnpj = (nota.cnpj || 'N/A').replace(/,/g, '');
    const notaTotal = (nota.valorTotal || 0).toFixed(2);

    if (nota.itens && nota.itens.length > 0) {
      nota.itens.forEach(item => {
        const produto = (item.nome || '').replace(/,/g, ';');
        const categoria = (item.categoria || 'Outros').replace(/,/g, ';');
        const quantidade = item.quantidade || 1;
        const valorUnitario = (item.valor || 0).toFixed(2);
        const valorTotal = (item.valorTotal || 0).toFixed(2);

        csvContent += `${data},${loja},${cnpj},${produto},${categoria},${quantidade},${valorUnitario},${valorTotal},${notaTotal}\n`;
      });
    } else {
      csvContent += `${data},${loja},${cnpj},Sem itens,-,0,0.00,0.00,${notaTotal}\n`;
    }
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pathtrack-dados-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  alert('✅ Arquivo CSV exportado com sucesso!');
}

window.verDetalhes = verDetalhes;
window.limparHistorico = limparHistorico;
window.exportarHTML = exportarHTML;
window.exportarCSV = exportarCSV;
