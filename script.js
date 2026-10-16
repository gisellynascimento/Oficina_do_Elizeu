const SENHA_ADM = "2307";

const produtos = [
    { id: 1, nome: "Rolamento de Roda 6004", moto: "CG 125/150/160, Bros", categoria: "pecas", preco: 35.00, custo: 18.00, imagem: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=60" },
    { id: 2, nome: "Cabo de Embreagem Reforçado", moto: "Honda Titan / Fan 150/160", categoria: "pecas", preco: 25.00, custo: 12.00, imagem: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=400&auto=format&fit=crop&q=60" },
    { id: 3, nome: "Cabo de Acelerador A/B", moto: "CG 150/160, XRE 190", categoria: "pecas", preco: 28.00, custo: 14.00, imagem: "https://images.unsplash.com/photo-1609630875172-2ec55de25941?w=400&auto=format&fit=crop&q=60" },
    { id: 4, nome: "Óleo Motor 20W50 4T", moto: "Universal Motores 4T", categoria: "lubrificante", preco: 42.00, custo: 28.00, imagem: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=60" },
    { id: 5, nome: "Kit Relação Aço 1045", moto: "Titan/Fan 160, Start", categoria: "pecas", preco: 135.00, custo: 85.00, imagem: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&auto=format&fit=crop&q=60" },
    { id: 6, nome: "Jogo de Junta de Kit A/B", moto: "Titan 150 / Fan 150", categoria: "motor", preco: 45.00, custo: 24.00, imagem: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=60" },
    { id: 7, nome: "Válvula de Escape Original", moto: "Bros 150 / CG 150", categoria: "motor", preco: 58.00, custo: 32.00, imagem: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=60" },
    { id: 8, nome: "Válvula de Admissão", moto: "Bros 150 / CG 150", categoria: "motor", preco: 58.00, custo: 32.00, imagem: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=400&auto=format&fit=crop&q=60" }
];

let carrinho = [];
let historicoVendas = JSON.parse(localStorage.getItem('historico_vendas_tio')) || [];

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

        let seletorHTML = '';
        if (qtd > 0) {
            seletorHTML = `
                <div class="flex items-center bg-slate-950 border border-red-600/80 rounded-xl overflow-hidden">
                    <button onclick="alterarQuantidade(${p.id}, -1)" class="px-2.5 py-1 text-slate-300 font-bold hover:bg-slate-800 text-xs active:text-red-400">-</button>
                    <span class="px-2 text-white font-black text-xs">${qtd}</span>
                    <button onclick="alterarQuantidade(${p.id}, 1)" class="px-2.5 py-1 text-slate-300 font-bold hover:bg-slate-800 text-xs active:text-red-400">+</button>
                </div>
            `;
        } else {
            seletorHTML = `
                <button onclick="adicionarAoCarrinho(${p.id})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md shadow-red-950 transition">
                    <i class="fa-solid fa-plus text-[10px]"></i> Adicionar
                </button>
            `;
        }

        vitrine.innerHTML += `
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-md hover:border-slate-700 transition">
                <div>
                    <div class="w-full h-36 rounded-xl overflow-hidden bg-slate-950 mb-3">
                        <img src="${p.imagem}" alt="${p.nome}" class="w-full h-full object-cover">
                    </div>
                    <span class="text-[9px] font-bold text-red-500 uppercase tracking-wider block">${p.categoria}</span>
                    <h3 class="font-bold text-white text-sm leading-tight mt-0.5">${p.nome}</h3>
                    <p class="text-[11px] text-slate-400 truncate mt-1"><i class="fa-solid fa-motorcycle text-[9px] text-slate-500"></i> ${p.moto}</p>
                </div>
                
                <div class="flex items-center justify-between mt-4 pt-2 border-t border-slate-800/60">
                    <span class="text-base font-black text-white">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                    ${seletorHTML}
                </div>
            </div>
        `;
    });
}

function buscarProdutos(termo) {
    const t = termo.toLowerCase();
    const resultado = produtos.filter(p => 
        p.nome.toLowerCase().includes(t) || 
        p.categoria.toLowerCase().includes(t) ||
        p.moto.toLowerCase().includes(t)
    );
    renderizarProdutos(resultado);
}

function filtrarProdutos(cat, el) {
    document.querySelectorAll('.btn-categoria').forEach(b => {
        b.classList.remove('bg-red-600', 'text-white');
        b.classList.add('bg-slate-900', 'text-slate-300');
    });
    el.classList.remove('bg-slate-900', 'text-slate-300');
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

    renderizarProdutos(produtos);
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
        msgItens += `- ${i.quantidade}x ${i.nome} (R$ ${(i.preco * i.quantidade).toFixed(2)})\n`;
    });

    historicoVendas.push({
        data: new Date().toISOString(),
        itens: [...carrinho],
        total: totalVenda,
        lucro: totalVenda - custoTotal
    });
    localStorage.setItem('historico_vendas_tio', JSON.stringify(historicoVendas));

    const whatsAppNumber = "5522999999999"; // ALTERE AQUI O NÚMERO DO SEU TIO
    const mensagem = encodeURIComponent(`Olá! Gostaria de fazer o pedido das seguintes peças:\n\n${msgItens}\n*Total: R$ ${totalVenda.toFixed(2).replace('.', ',')}*`);

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
