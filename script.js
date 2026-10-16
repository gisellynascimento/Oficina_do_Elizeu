const SENHA_ADM = "2307";

// Produtos padrão iniciais com controle de estoque e tags
let produtos = JSON.parse(localStorage.getItem('produtos_oficina')) || [
    { id: 1, nome: "Rolamento de Roda 6004", moto: "CG 125/150/160, Bros", categoria: "pecas", preco: 35.00, custo: 18.00, estoque: 8, tag: "Mais Vendido", imagem: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=60" },
    { id: 2, nome: "Cabo de Embreagem Reforçado", moto: "Honda Titan / Fan 150/160", categoria: "pecas", preco: 25.00, custo: 12.00, estoque: 2, tag: "Promoção", imagem: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=400&auto=format&fit=crop&q=60" },
    { id: 3, nome: "Cabo de Acelerador A/B", moto: "CG 150/160, XRE 190", categoria: "pecas", preco: 28.00, custo: 14.00, estoque: 10, tag: "", imagem: "https://images.unsplash.com/photo-1609630875172-2ec55de25941?w=400&auto=format&fit=crop&q=60" },
    { id: 4, nome: "Óleo Motor 20W50 4T", moto: "Universal Motores 4T", categoria: "lubrificante", preco: 42.00, custo: 28.00, estoque: 15, tag: "Mais Vendido", imagem: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=60" },
    { id: 5, nome: "Kit Relação Aço 1045", moto: "Titan/Fan 160, Start", categoria: "pecas", preco: 135.00, custo: 85.00, estoque: 3, tag: "", imagem: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=60" },
    { id: 6, nome: "Jogo de Junta de Kit A/B", moto: "Titan 150 / Fan 150", categoria: "motor", preco: 45.00, custo: 24.00, estoque: 1, tag: "Estoque Baixo", imagem: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=60" },
    { id: 7, nome: "Válvula de Escape Original", moto: "Bros 150 / CG 150", categoria: "motor", preco: 58.00, custo: 32.00, estoque: 6, tag: "", imagem: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=60" },
    { id: 8, nome: "Válvula de Admissão", moto: "Bros 150 / CG 150", categoria: "motor", preco: 58.00, custo: 32.00, estoque: 5, tag: "", imagem: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=400&auto=format&fit=crop&q=60" }
];

let carrinho = JSON.parse(localStorage.getItem('carrinho_oficina')) || [];
let historicoVendas = JSON.parse(localStorage.getItem('historico_vendas_tio')) || [];
let categoriaAtual = 'todos';

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    verificarHorarioFuncionamento();
    renderizarProdutos();
    atualizarCarrinho();
});

// Horário de Funcionamento Dinâmico (Ex: Segunda a Sábado das 08:00 às 18:00)
function verificarHorarioFuncionamento() {
    const agora = new Date();
    const dia = agora.getDay(); // 0 = Domingo, 6 = Sábado
    const hora = agora.getHours();

    const ponto = document.getElementById('status-ponto');
    const texto = document.getElementById('status-texto');

    // Supondo funcionamento Seg-Sex 08:00 às 18:00, Sáb 08:00 às 13:00, Dom Fechado
    let aberto = false;
    if (dia >= 1 && dia <= 5 && hora >= 8 && hora < 18) aberto = true;
    if (dia === 6 && hora >= 8 && hora < 13) aberto = true;

    if (aberto) {
        ponto.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
        texto.innerText = "Oficina Aberta";
    } else {
        ponto.className = "w-2 h-2 rounded-full bg-red-500";
        texto.innerText = "Oficina Fechada (Abre seg. às 08h)";
    }
}

// Renderização da Vitrine com Tags e Estoque
function renderizarProdutos(lista = produtos) {
    const vitrine = document.getElementById('vitrine-produtos');
    vitrine.innerHTML = '';

    if(lista.length === 0) {
        vitrine.innerHTML = '<p class="col-span-full text-center text-slate-500 py-12 text-sm">Nenhuma peça encontrada.</p>';
        return;
    }

    lista.forEach(p => {
        const itemNoCarrinho = carrinho.find(i => i.id === p.id);
        const qtd = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

        let tagHTML = '';
        if (p.tag) {
            let corTag = "bg-red-950/80 text-red-400 border-red-500/30";
            if (p.tag === "Mais Vendido") corTag = "bg-amber-950/80 text-amber-400 border-amber-500/30";
            if (p.tag === "Promoção") corTag = "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
            tagHTML = `<span class="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border backdrop-blur-md ${corTag}">${p.tag}</span>`;
        }

        let avisoEstoque = '';
        if (p.estoque <= 2 && p.estoque > 0) {
            avisoEstoque = `<span class="text-[10px] text-amber-400 font-bold block mt-0.5">Últimas unidades (${p.estoque})</span>`;
        } else if (p.estoque === 0) {
            avisoEstoque = `<span class="text-[10px] text-red-500 font-bold block mt-0.5">Indisponível</span>`;
        }

        let seletorHTML = '';
        if (p.estoque === 0) {
            seletorHTML = `<span class="text-xs text-slate-500 font-bold">Esgotado</span>`;
        } else if (qtd > 0) {
            seletorHTML = `
                <div class="flex items-center bg-slate-950 border border-red-600/80 rounded-xl overflow-hidden">
                    <button onclick="alterarQuantidade(${p.id}, -1)" class="px-2.5 py-1 text-slate-300 font-bold hover:bg-slate-800 text-xs">-</button>
                    <span class="px-2 text-white font-black text-xs">${qtd}</span>
                    <button onclick="alterarQuantidade(${p.id}, 1)" class="px-2.5 py-1 text-slate-300 font-bold hover:bg-slate-800 text-xs">+</button>
                </div>
            `;
        } else {
            seletorHTML = `
                <button onclick="adicionarAoCarrinho(${p.id})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md transition">
                    <i class="fa-solid fa-plus text-[10px]"></i> Adicionar
                </button>
            `;
        }

        vitrine.innerHTML += `
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
                <div>
                    <div class="w-full h-36 rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                        <img src="${p.imagem || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=60'}" alt="${p.nome}" class="w-full h-full object-cover">
                        ${tagHTML}
                    </div>
                    <span class="text-[9px] font-bold text-red-500 uppercase tracking-wider block">${p.categoria}</span>
                    <h3 class="font-bold text-white text-sm leading-tight mt-0.5">${p.nome}</h3>
                    <p class="text-[11px] text-slate-400 truncate mt-1"><i class="fa-solid fa-motorcycle text-[9px] text-slate-500"></i> ${p.moto}</p>
                    ${avisoEstoque}
                </div>
                
                <div class="flex items-center justify-between mt-4 pt-2 border-t border-slate-800/60">
                    <span class="text-base font-black text-white">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                    ${seletorHTML}
                </div>
            </div>
        `;
    });
}

// Filtro Geral (Categoria + Busca Textual + Select de Moto)
function filtrarGeral() {
    const termo = document.getElementById('campo-busca').value.toLowerCase();
    const motoSelecionada = document.getElementById('filtro-moto').value;

    let resultado = produtos.filter(p => {
        const matchCat = (categoriaAtual === 'todos' || p.categoria === categoriaAtual);
        const matchBusca = p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo) || p.moto.toLowerCase().includes(termo);
        const matchMoto = (motoSelecionada === 'todos' || p.moto.toLowerCase().includes(motoSelecionada.toLowerCase()));
        return matchCat && matchBusca && matchMoto;
    });

    renderizarProdutos(resultado);
}

function filtrarCategoria(cat, el) {
    categoriaAtual = cat;
    document.querySelectorAll('.btn-categoria').forEach(b => {
        b.classList.remove('bg-red-600', 'text-white');
        b.classList.add('bg-slate-900', 'text-slate-300');
    });
    el.classList.remove('bg-slate-900', 'text-slate-300');
    el.classList.add('bg-red-600', 'text-white');
    filtrarGeral();
}

// Carrinho com persistência
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const item = carrinho.find(i => i.id === id);
    
    const qtdAtualCarrinho = item ? item.quantidade : 0;
    if (qtdAtualCarrinho + 1 > produto.estoque) {
        return alert("Quantidade solicitada excede o estoque disponível!");
    }

    if(item) {
        item.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
}

function alterarQuantidade(id, delta) {
    const produto = produtos.find(p => p.id === id);
    const item = carrinho.find(i => i.id === id);
    if(item) {
        if (delta > 0 && item.quantidade + 1 > produto.estoque) {
            return alert("Estoque máximo atingido!");
        }
        item.quantidade += delta;
        if(item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.id !== id);
        }
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    localStorage.setItem('carrinho_oficina', JSON.stringify(carrinho));
    const lista = document.getElementById('lista-carrinho');
    const totalEl = document.getElementById('valor-total');
    const badgeMobile = document.getElementById('badge-carrinho-mobile');
    const badgeDesktop = document.getElementById('badge-carrinho-desktop');
    
    lista.innerHTML = '';
    let total = 0, qtdTotal = 0;

    if(carrinho.length === 0) {
        lista.innerHTML = '<p class="text-slate-500 text-center text-xs py-12">Seu carrinho está vazio.</p>';
    }

    carrinho.forEach(i => {
        total += i.preco * i.quantidade;
        qtdTotal += i.quantidade;
        lista.innerHTML += `
            <div class="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center text-xs">
                <div class="flex-1 pr-2">
                    <h4 class="font-bold text-white text-sm">${i.nome}</h4>
                    <span class="text-slate-400 text-[11px]">R$ ${i.preco.toFixed(2).replace('.', ',')} un</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center bg-slate-900 border border-slate-800 rounded-lg">
                        <button onclick="alterarQuantidade(${i.id}, -1)" class="px-2.5 py-1 text-slate-300 font-bold hover:bg-slate-800">-</button>
                        <span class="px-2 text-white font-black">${i.quantidade}</span>
                        <button onclick="alterarQuantidade(${i.id}, 1)" class="px-2.5 py-1 text-slate-300 font-bold hover:bg-slate-800">+</button>
                    </div>
                    <button onclick="removerDoCarrinho(${i.id})" class="text-red-400 hover:text-red-300 p-1.5"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    badgeMobile.innerText = qtdTotal;
    if(badgeDesktop) badgeDesktop.innerText = qtdTotal;

    filtrarGeral();
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    atualizarCarrinho();
}

function toggleCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

function finalizarPedido() {
    if(carrinho.length === 0) return alert("Seu carrinho está vazio!");

    let totalVenda = 0, custoTotal = 0, msgItens = "";
    carrinho.forEach(i => {
        totalVenda += i.preco * i.quantidade;
        custoTotal += i.custo * i.quantidade;
        msgItens += `- ${i.quantidade}x ${i.nome} (R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')})\n`;

        // Dar baixa no estoque
        const prodRef = produtos.find(p => p.id === i.id);
        if(prodRef) prodRef.estoque = Math.max(0, prodRef.estoque - i.quantidade);
    });

    localStorage.setItem('produtos_oficina', JSON.stringify(produtos));

    historicoVendas.push({
        data: new Date().toISOString(),
        itens: [...carrinho],
        total: totalVenda,
        lucro: totalVenda - custoTotal
    });
    localStorage.setItem('historico_vendas_tio', JSON.stringify(historicoVendas));

    const whatsAppNumber = "5522999999999"; // Substitua pelo número do seu tio
    const mensagem = encodeURIComponent(`Olá! Fiz um pedido no site para *Retirada na Oficina*:\n\n${msgItens}\n*Total: R$ ${totalVenda.toFixed(2).replace('.', ',')}*`);

    carrinho = [];
    atualizarCarrinho();
    toggleCarrinho();

    window.open(`https://wa.me/${whatsAppNumber}?text=${mensagem}`, '_blank');
}

// Painel do Tio & Abas
function abrirPainelAdm() {
    document.getElementById('modal-adm').classList.remove('hidden');
    document.getElementById('modal-adm').classList.add('flex');
}

function fecharPainelAdm() {
    document.getElementById('modal-adm').classList.remove('flex');
    document.getElementById('modal-adm').classList.add('hidden');
}

function verificarSenha() {
    if(document.getElementById('input-senha').value === SENHA_ADM) {
        document.getElementById('bloco-senha').classList.add('hidden');
        document.getElementById('bloco-conteudo-adm').classList.remove('hidden');
        carregarRelatorios();
        carregarCrudProdutos();
    } else {
        document.getElementById('erro-senha').classList.remove('hidden');
    }
}

function mudarAbaAdm(aba) {
    const btnRel = document.getElementById('tab-btn-relatorios');
    const btnProd = document.getElementById('tab-btn-produtos');
    const divRel = document.getElementById('aba-relatorios');
    const divProd = document.getElementById('aba-produtos');

    if(aba === 'relatorios') {
        btnRel.className = "flex-1 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white transition";
        btnProd.className = "flex-1 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition";
        divRel.classList.remove('hidden');
        divProd.classList.add('hidden');
        carregarRelatorios();
    } else {
        btnProd.className = "flex-1 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white transition";
        btnRel.className = "flex-1 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition";
        divProd.classList.remove('hidden');
        divRel.classList.add('hidden');
        carregarCrudProdutos();
    }
}

// Relatórios com Filtro por Período
function carregarRelatorios() {
    const agora = new Date();
    let hoje = 0, semana = 0, mes = 0, lucro = 0;
    const listaHist = document.getElementById('lista-historico-vendas');
    listaHist.innerHTML = '';

    const dataInicio = document.getElementById('filtro-data-inicio').value;
    const dataFim = document.getElementById('filtro-data-fim').value;
    let totalPeriodo = 0;

    [...historicoVendas].reverse().forEach(v => {
        const d = new Date(v.data);
        if(d.toDateString() === agora.toDateString()) hoje += v.total;
        if((agora - d)/(1000*60*60*24) <= 7) semana += v.total;
        if(d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()) {
            mes += v.total;
            lucro += v.lucro;
        }

        // Filtro personalizado
        if(dataInicio && dataFim) {
            const dataVendaStr = v.data.split('T')[0];
            if(dataVendaStr >= dataInicio && dataVendaStr <= dataFim) {
                totalPeriodo += v.total;
            }
        }

        listaHist.innerHTML += `
            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between text-[11px]">
                <span class="text-slate-400">${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</span>
                <span class="text-emerald-400 font-bold">R$ ${v.total.toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById('relatorio-hoje').innerText = `R$ ${hoje.toFixed(2)}`;
    document.getElementById('relatorio-semana').innerText = `R$ ${semana.toFixed(2)}`;
    document.getElementById('relatorio-mes').innerText = `R$ ${mes.toFixed(2)}`;
    document.getElementById('relatorio-lucro').innerText = `R$ ${lucro.toFixed(2)}`;
    
    if(dataInicio && dataFim) {
        document.getElementById('resultado-filtro-periodo').innerText = `Faturamento no período: R$ ${totalPeriodo.toFixed(2)}`;
    }
}

function registrarVendaBalcao() {
    const val = parseFloat(document.getElementById('venda-manual-valor').value);
    if(!val || val <= 0) return alert("Digite um valor válido");

    historicoVendas.push({
        data: new Date().toISOString(),
        itens: [{ quantidade: 1, nome: "Venda Presencial Balcão" }],
        total: val,
        lucro: val * 0.35
    });
    localStorage.setItem('historico_vendas_tio', JSON.stringify(historicoVendas));
    document.getElementById('venda-manual-valor').value = '';
    carregarRelatorios();
    alert("Venda registrada com sucesso!");
}

function limparHistorico() {
    if(confirm("Apagar histórico de vendas?")) {
        historicoVendas = [];
        localStorage.removeItem('historico_vendas_tio');
        carregarRelatorios();
    }
}

// Exportar Vendas em CSV (Excel)
function exportarCSV() {
    if(historicoVendas.length === 0) return alert("Não há vendas para exportar.");
    let csvContent = "data:text/csv;charset=utf-8,Data,Total (R$),Lucro (R$)\n";
    historicoVendas.forEach(v => {
        csvContent += `${v.data},${v.total},${v.lucro}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historico_vendas_oficina.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// CRUD de Produtos
function carregarCrudProdutos() {
    const lista = document.getElementById('lista-crud-produtos');
    lista.innerHTML = '';

    produtos.forEach(p => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div>
                    <span class="text-white font-bold block">${p.nome} (${p.moto})</span>
                    <span class="text-slate-400 text-[10px]">R$ ${p.preco.toFixed(2)} | Estoque: ${p.estoque}</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="editarProduto(${p.id})" class="text-blue-400 hover:text-blue-300 px-2 py-1"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="excluirProduto(${p.id})" class="text-red-400 hover:text-red-300 px-2 py-1"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function salvarProduto() {
    const idEdicao = document.getElementById('prod-edit-id').value;
    const nome = document.getElementById('prod-nome').value.trim();
    const moto = document.getElementById('prod-moto').value.trim();
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const custo = parseFloat(document.getElementById('prod-custo').value);
    const estoque = parseInt(document.getElementById('prod-estoque').value);
    const categoria = document.getElementById('prod-categoria').value;
    const tag = document.getElementById('prod-tag').value.trim();
    const imagem = document.getElementById('prod-imagem').value.trim();

    if(!nome || isNaN(preco) || isNaN(custo) || isNaN(estoque)) {
        return alert("Preencha os campos obrigatórios corretamente!");
    }

    if(idEdicao) {
        // Editar
        const p = produtos.find(item => item.id == idEdicao);
        if(p) {
            p.nome = nome;
            p.moto = moto;
            p.preco = preco;
            p.custo = custo;
            p.estoque = estoque;
            p.categoria = categoria;
            p.tag = tag;
            if(imagem) p.imagem = imagem;
        }
    } else {
        // Criar novo
        const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
        produtos.push({
            id: novoId,
            nome,
            moto: moto || "Universal",
            categoria,
            preco,
            custo,
            estoque,
            tag,
            imagem: imagem || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=60"
        });
    }

    localStorage.setItem('produtos_oficina', JSON.stringify(produtos));
    limparFormProduto();
    carregarCrudProdutos();
    renderizarProdutos();
    alert("Peça salva com sucesso!");
}

function editarProduto(id) {
    const p = produtos.find(item => item.id === id);
    if(!p) return;

    document.getElementById('prod-edit-id').value = p.id;
    document.getElementById('prod-nome').value = p.nome;
    document.getElementById('prod-moto').value = p.moto;
    document.getElementById('prod-preco').value = p.preco;
    document.getElementById('prod-custo').value = p.custo;
    document.getElementById('prod-estoque').value = p.estoque;
    document.getElementById('prod-categoria').value = p.categoria;
    document.getElementById('prod-tag').value = p.tag || '';
    document.getElementById('prod-imagem').value = p.imagem || '';

    document.getElementById('titulo-form-produto').innerText = "Editar Peça";
    document.getElementById('btn-cancelar-edicao').classList.remove('hidden');
}

function limparFormProduto() {
    document.getElementById('prod-edit-id').value = '';
    document.getElementById('prod-nome').value = '';
    document.getElementById('prod-moto').value = '';
    document.getElementById('prod-preco').value = '';
    document.getElementById('prod-custo').value = '';
    document.getElementById('prod-estoque').value = '';
    document.getElementById('prod-tag').value = '';
    document.getElementById('prod-imagem').value = '';
    document.getElementById('titulo-form-produto').innerText = "Adicionar Nova Peça";
    document.getElementById('btn-cancelar-edicao').classList.add('hidden');
}

function excluirProduto(id) {
    if(confirm("Deseja realmente excluir esta peça?")) {
        produtos = produtos.filter(p => p.id !== id);
        localStorage.setItem('produtos_oficina', JSON.stringify(produtos));
        carregarCrudProdutos();
        renderizarProdutos();
    }
}
