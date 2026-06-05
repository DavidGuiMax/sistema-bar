let banco = {};

const listaClientes =
document.getElementById("listaClientes");

const totalClientes =
document.getElementById("totalClientes");

const totalDividas =
document.getElementById("totalDividas");

async function iniciar(){

    banco = await carregarBanco();

    renderizar();

}

function calcularTotal(clienteId){

    return banco.movimentacoes
    .filter(
        mov => mov.cliente_id === clienteId
    )
    .reduce(
        (total,mov) => total + Number(mov.valor),
        0
    );

}

function classeDivida(total){

    if(total <= 50){

        return "verde";

    }

    if(total <= 100){

        return "amarelo";

    }

    return "vermelho";

}

function atualizarDashboard(){

    totalClientes.textContent =
    banco.fiados.length;

    const total =
    banco.fiados.reduce(

        (acc,cliente)=>

        acc +
        calcularTotal(cliente.id),

        0

    );

    totalDividas.textContent =
    `R$ ${total.toFixed(2)}`;

}

function renderizar(){

    atualizarDashboard();

    listaClientes.innerHTML = "";

    const busca =
    document
    .getElementById("pesquisaCliente")
    .value
    .toLowerCase();

    banco.fiados

    .filter(cliente =>

        cliente.nome
        .toLowerCase()
        .includes(busca)

    )

    .forEach(cliente=>{

        const total =
        calcularTotal(cliente.id);

        const historico =
        banco.movimentacoes

        .filter(
            mov =>
            mov.cliente_id === cliente.id
        )

        .sort(
            (a,b)=>
            new Date(b.data) -
            new Date(a.data)
        );

        const historicoHTML =
        historico.map(item => `

            <div class="item-historico">

                <span>

                    ${
                        new Date(item.data)
                        .toLocaleDateString()
                    }

                </span>

                <span>

                    ${item.tipo}

                </span>

                <span>

                    R$ ${Number(item.valor)
                    .toFixed(2)}

                </span>

            </div>

        `).join("");

        listaClientes.innerHTML += `

        <div class="cliente ${classeDivida(total)}">

            <h2>${cliente.nome}</h2>

            <h3>

                Total:
                R$ ${total.toFixed(2)}

            </h3>

            <div class="acoes">

                <input
                id="valor-${cliente.id}"
                type="number"
                placeholder="Valor">

                <button
                onclick="adicionarDivida('${cliente.id}')">

                    + Dívida

                </button>

                <button
                onclick="registrarPagamento('${cliente.id}')">

                    Pagamento

                </button>

                <button
                onclick="excluirCliente('${cliente.id}')">

                    Excluir

                </button>

            </div>

            <div class="historico">

                ${historicoHTML}

            </div>

        </div>

        `;

    });

}

document
.getElementById(
    "btnAdicionarCliente"
)
.addEventListener(
    "click",
    async ()=>{

        const nome =
        document
        .getElementById(
            "nomeCliente"
        )
        .value;

        if(!nome) return;

        await criarFiado(nome);

        banco =
        await carregarBanco();

        renderizar();

    }
);

async function adicionarDivida(id){

    const valor =
    Number(
        document
        .getElementById(
            `valor-${id}`
        )
        .value
    );

    if(!valor) return;

    await adicionarMovimentacao({

        cliente_id: id,
        valor: valor,
        tipo: "Dívida"

    });

    const cliente =
    banco.fiados.find(
        c => c.id === id
    );

    await atualizarSaldoCliente(

        id,

        Number(cliente.saldo || 0)
        + valor

    );

    banco =
    await carregarBanco();

    renderizar();

}

async function registrarPagamento(id){

    const valor =
    Number(
        document
        .getElementById(
            `valor-${id}`
        )
        .value
    );

    if(!valor) return;

    await adicionarMovimentacao({

        cliente_id: id,
        valor: -valor,
        tipo: "Pagamento"

    });

    const cliente =
    banco.fiados.find(
        c => c.id === id
    );

    await atualizarSaldoCliente(

        id,

        Number(cliente.saldo || 0)
        - valor

    );

    banco =
    await carregarBanco();

    renderizar();

}

async function excluirCliente(id){

    const confirmar =
    confirm(
        "Excluir cliente?"
    );

    if(!confirmar) return;

    await excluirMovimentacoesCliente(id);

    await excluirClienteFiado(id);

    banco =
    await carregarBanco();

    renderizar();

}

document
.getElementById(
    "pesquisaCliente"
)
.addEventListener(
    "input",
    renderizar
);

iniciar();