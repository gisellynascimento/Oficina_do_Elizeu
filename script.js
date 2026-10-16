const SENHA_ADM = "2307";

const produtos = [
    { id: 1, nome: "Rolamento de Roda", categoria: "pecas", preco: 35.00, custo: 20.00, imagem: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=60" },
    { id: 2, nome: "Cabo Embreagem", categoria: "pecas", preco: 25.00, custo: 12.00, imagem: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=300&auto=format&fit=crop&q=60" },
    { id: 3, nome: "Cabo Acelerador", categoria: "pecas", preco: 28.00, custo: 14.00, imagem: "https://images.unsplash.com/photo-1609630875172-2ec55de25941?w=300&auto=format&fit=crop&q=60" },
    { id: 4, nome: "Óleo Motor 4T", categoria: "lubrificante", preco: 45.00, custo: 32.00, imagem: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&auto=format&fit=crop&q=60" },
    { id: 5, nome: "Kit Relação Moto", categoria: "pecas", preco: 120.00, custo: 80.00, imagem: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&auto=format&fit=crop&q=60" },
    { id: 6, nome: "Jogo de Junta", categoria: "motor", preco: 40.00, custo: 22.00, imagem: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&auto=format&fit=crop&q=60" },
    { id: 7, nome: "Válvula Escape", categoria: "motor", preco: 55.00, custo: 30.00, imagem: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&auto=format&fit=crop&q=60" },
    { id: 8, nome: "Válvula Admissão", categoria: "motor", preco: 55.00, custo: 30.00, imagem: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=300&auto=format&fit=crop&q=60" }
];

let carrinho = [];
let historicoVendas = JSON.parse(localStorage.getItem('historico_vendas_tio')) || [];

function renderizarProdutos(lista = produtos) {
    const vitrine = document.getElementById('vitrine-produtos');
    vitrine.innerHTML = '';

    if(lista.length === 0) {
        vitrine.innerHTML = '<p class="col-span-full text-center text-slate-400 py-8 text-sm">Nenhum produto encontrado.</p>';
        return;
    }

    lista.forEach(p => {
        vitrine.innerHTML += `
            <div class="bg-slate-800 border border-slate-700/80 rounded-xl overflow-hidden flex flex-col justify-between p-2.5 shadow-sm">
                <div>
                    <div class="h-28 rounded-lg overflow-hidden bg-slate-900 mb-2">
                        <img src="${p.imagem}" alt="${p.nome}" class="w-full h-full object-cover">
                    </div>
                    <span class="text-[9px] font-bold text-red-400 uppercase tracking-wider block">${p.categoria}</span>
                    <h3 class="font-semibold text-white text-xs leading-tight line-clamp-2 mt-0.5">${p.nome}</h3>
                </div>
                <div class="mt-3 flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <span class="text-sm font-black text-white">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                    <button onclick="adicionarAoCarrinho(${p.id})" class="bg-red-600 active:bg-red-700 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs shadow-sm">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

function buscarProdutos(termo) {
    const resultado = produtos.filter(p => p.nome.toLowerCase().includes(termo.toLowerCase()) || p.categoria.toLowerCase().includes(termo.toLowerCase()));
    renderizarProdutos(resultado);
}

function filtrarProdutos(cat, el) {
    document.querySelectorAll('.btn-categoria').forEach(b => {
        b.classList.remove('bg-red-600', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-300');
    });
    el.classList.remove('bg-slate-800', 'text-slate-300');
    el.classList.add('bg-red-600', 'text-white');

    if(cat === 'todos') renderizarProdutos(produtos);
    else renderizarProdutos(produtos.filter(p => p.categoria === cat));
}

function adicionarAoCarrinho(id) {
    const item = carrinho.find(i => i.id === id);
    if(item) {
        item.quantidade++;
    } else {
        const produto = produtos.find(p => p.id === id);
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if(item) {
        item.quantidade += delta;
        if(item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.id !== id);
        }
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const totalEl = document.getElementById('valor-total');
    const contadorTopo = document.getElementById('contador-carrinho-topo');
    const badgeMobile = document.getElementById('badge-carrinho-mobile');
    
    lista.innerHTML = '';
    let total = 0, qtdTotal = 0;

    if(carrinho.length === 0) {
        lista.innerHTML = '<p class="text-slate-400 text-center text-xs py-12">Seu carrinho está vazio.</p>';
    }

    carrinho.forEach(i => {
        total += i.preco * i.quantidade;
        qtdTotal += i.quantidade;
        lista.innerHTML += `
            <div class="flex justify-between items-center bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl text-xs">
                <div class="flex-1 pr-2">
                    <h4 class="font-bold text-white text-sm">${i.nome}</h4>
                    <span class="text-slate-400 text-[11px]">R$ ${i.preco.toFixed(2).replace('.', ',')} un</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                        <button onclick="alterarQuantidade(${i.id}, -1)" class="px-2.5 py-1 text-slate-300 hover:bg-slate-700">-</button>
                        <span class="px-2 text-white font-bold">${i.quantidade}</span>
                        <button onclick="alterarQuantidade(${i.id}, 1)" class="px-2.5 py-1 text-slate-300 hover:bg-slate-700">+</button>
                    </div>
                    <button onclick="removerDoCarrinho(${i.id})" class="text-red-400 hover:text-red-300 p-1.5"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    contadorTopo.innerText = qtdTotal;
    badgeMobile.innerText = qtdTotal;
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    atualizarCarrinho();
}

function toggleCarrinho() {
    document.getElementById('modal-carrinho').classList.toggle('hidden');
    document.getElementById('modal-carrinho').classList.toggle('flex');
}

function finalizarPedido() {
    if(carrinho.length === 0) return alert("Seu carrinho está vazio!");

    let totalVenda = 0, custoTotal = 0, msgItens = "";
    carrinho.forEach(i => {
        totalVenda += i.preco * i.quantidade;
        custoTotal += i.custo * i.quantidade;
        msgItens += `- ${i.quantidade}x ${i.nome} (R$ ${(i.preco * i.quantidade).toFixed(2)})\n`;
    });

    historicoVendas.push({
        data: new Date().toISOString(),
        itens: [...carrinho],
        total: totalVenda,
        lucro: totalVenda - custoTotal
    });
    localStorage.setItem('historico_vendas_tio', JSON.stringify(historicoVendas));

    const whatsAppNumber = "5522999999999"; // Coloque o número do seu tio com o DDD aqui!
    const mensagem = encodeURIComponent(`Olá! Gostaria de pedir as seguintes peças:\n\n${msgItens}\n*Total: R$ ${totalVenda.toFixed(2).replace('.', ',')}*`);

    carrinho = [];
    atualizarCarrinho();
    toggleCarrinho();

    window.open(`https://wa.me/${whatsAppNumber}?text=${mensagem}`, '_blank');
}

// Painel do Tio
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
    } else {
        document.getElementById('erro-senha').classList.remove('hidden');
    }
}

function carregarRelatorios() {
    const agora = new Date();
    let hoje = 0, semana = 0, mes = 0, lucro = 0;
    const listaHist = document.getElementById('lista-historico-vendas');
    listaHist.innerHTML = '';

    [...historicoVendas].reverse().forEach(v => {
        const d = new Date(v.data);
        if(d.toDateString() === agora.toDateString()) hoje += v.total;
        if((agora - d)/(1000*60*60*24) <= 7) semana += v.total;
        if(d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()) {
            mes += v.total;
            lucro += v.lucro;
        }

        listaHist.innerHTML += `
            <div class="bg-slate-800 p-2 rounded-lg border border-slate-700/50 flex justify-between text-[11px]">
                <span class="text-slate-300">${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</span>
                <span class="text-emerald-400 font-bold">R$ ${v.total.toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById('relatorio-hoje').innerText = `R$ ${hoje.toFixed(2)}`;
    document.getElementById('relatorio-semana').innerText = `R$ ${semana.toFixed(2)}`;
    document.getElementById('relatorio-mes').innerText = `R$ ${mes.toFixed(2)}`;
    document.getElementById('relatorio-lucro').innerText = `R$ ${lucro.toFixed(2)}`;
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
    alert("Venda registrada!");
}

function limparHistorico() {
    if(confirm("Apagar histórico de vendas?")) {
        historicoVendas = [];
        localStorage.removeItem('historico_vendas_tio');
        carregarRelatorios();
    }
}

renderizarProdutos();
