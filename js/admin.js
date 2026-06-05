let banco = {};
let produtoEditando = null;
let imagemBase64 = "";

const listaProdutos =
document.getElementById("listaProdutos");

const categoriaSelect =
document.getElementById("categoria");

const totalProdutos =
document.getElementById("totalProdutos");

const totalCategorias =
document.getElementById("totalCategorias");

async function iniciar(){

    try{

        banco =
        await carregarBanco();

        atualizarDashboard();

        renderizarCategorias();

        renderizarProdutos();

    }

    catch(erro){

        console.error(
            "Erro ao carregar dados:",
            erro
        );

    }

}

function atualizarDashboard(){

    totalProdutos.textContent =
    banco.produtos.length;

    totalCategorias.textContent =
    banco.categorias.length;

    const totalFiados =
    banco.fiados.reduce(

        (total, cliente)=>
        total + Number(cliente.saldo || 0),

        0

    );

    document
    .getElementById("valorFiadoTotal")
    .textContent =
    `R$ ${totalFiados.toFixed(2)}`;

}

function renderizarCategorias(){

    categoriaSelect.innerHTML = "";

    banco.categorias.forEach(cat=>{

        categoriaSelect.innerHTML += `
            <option value="${cat.id}">
                ${cat.nome}
            </option>
        `;

    });

}

function renderizarProdutos(){

    listaProdutos.innerHTML =
    '<div class="produtos-grid"></div>';

    const grid =
    listaProdutos.querySelector(
        ".produtos-grid"
    );

    banco.produtos.forEach(produto=>{

        const categoria =
        banco.categorias.find(
            c => c.id === produto.categoria
        );

        grid.innerHTML += `

        <div class="produto-card">

            <img
            src="${produto.imagem || ''}"
            alt="${produto.nome}">

            <div class="produto-info">

                <h3>${produto.nome}</h3>

                <p>
                    ${categoria?.nome || "Sem categoria"}
                </p>

                <p>
                    R$ ${Number(produto.preco).toFixed(2)}
                </p>

                <div class="produto-acoes">

                    <button
                    class="btn-editar"
                    onclick="abrirModalEdicao('${produto.id}')">

                        Editar

                    </button>

                    <button
                    class="btn-excluir"
                    onclick="excluirProduto('${produto.id}')">

                        Excluir

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

document
.getElementById("salvarProduto")
.addEventListener(
    "click",
    async ()=>{

        const nome =
        document.getElementById("nome").value;

        const preco =
        Number(
            document.getElementById("preco").value
        );

        const categoria =
        categoriaSelect.value;

        await adicionarProduto({

            nome,
            preco,
            categoria,
            imagem: imagemBase64

        });

        banco =
        await carregarBanco();

        atualizarDashboard();

        renderizarProdutos();

    }
);

async function excluirProduto(id){

    await excluirProdutoBanco(id);

    banco =
    await carregarBanco();

    atualizarDashboard();

    renderizarProdutos();

}

function abrirModalEdicao(id){

    produtoEditando =
    banco.produtos.find(
        p => p.id === id
    );

    document
    .getElementById("editNome")
    .value =
    produtoEditando.nome;

    document
    .getElementById("editPreco")
    .value =
    produtoEditando.preco;

    document
    .getElementById("modalEditar")
    .style.display =
    "flex";

    document
    .getElementById("editImagem")
    .addEventListener(
        "change",
        function(event){

            const arquivo =
            event.target.files[0];

            if(!arquivo) return;

            const leitor =
            new FileReader();

            leitor.onload = function(e){

                produtoEditando.imagem =
                e.target.result;

                document
                .getElementById(
                    "editPreview"
                )
                .src =
                produtoEditando.imagem;

                document
                .getElementById(
                    "editPreview"
                )
                .style.display =
                "block";

            };

            leitor.readAsDataURL(
                arquivo
            );

        }
    );

    document
    .getElementById("editPreview")
    .src =
    produtoEditando.imagem;

    document
    .getElementById("editPreview")
    .style.display =
    "block";

}

async function editarProduto(id){

    const produto =
    banco.produtos.find(
        p => p.id === id
    );

    const novoNome =
    prompt(
        "Nome:",
        produto.nome
    );

    const novoPreco =
    prompt(
        "Preço:",
        produto.preco
    );

    if(!novoNome) return;

    produto.nome =
    novoNome;

    produto.preco =
    Number(novoPreco);

    await atualizarProduto(produto);

    banco =
    await carregarBanco();

    renderizarProdutos();

}

document
.getElementById("criarCategoria")
.addEventListener(
    "click",
    async ()=>{

        const nome =
        document.getElementById(
            "novaCategoria"
        ).value.trim();

        if(!nome) return;

        await criarCategoria(nome);

        banco =
        await carregarBanco();

        renderizarCategorias();

        atualizarDashboard();

        document.getElementById(
            "novaCategoria"
        ).value = "";

    }
);

document
.getElementById(
    "exportarBackup"
)
.addEventListener(
    "click",
    ()=>{

        const blob =
        new Blob(

            [
                JSON.stringify(
                    banco,
                    null,
                    2
                )
            ],

            {
                type:
                "application/json"
            }

        );

        const url =
        URL.createObjectURL(
            blob
        );

        const a =
        document.createElement(
            "a"
        );

        a.href = url;

        a.download =
        "backup-bar.json";

        a.click();

    }
);

document
.getElementById(
    "importarBackup"
)
.addEventListener(
    "change",
    event=>{

        const arquivo =
        event.target.files[0];

        const leitor =
        new FileReader();

        leitor.onload =
        function(){

            banco =
            JSON.parse(
                leitor.result
            );

            console.log(
                "Backup carregado:",
                banco
            );

            location.reload();

        };

        leitor.readAsText(
            arquivo
        );

    }
);

document
.getElementById("salvarEdicao")
.addEventListener(
    "click",
    async ()=>{

        produtoEditando.nome =
        document.getElementById("editNome").value;

        produtoEditando.preco =
        Number(
            document.getElementById("editPreco").value
        );

        await atualizarProduto(
            produtoEditando
        );

        banco =
        await carregarBanco();

        renderizarProdutos();

        document
        .getElementById("modalEditar")
        .style.display =
        "none";

    }
);

document
.getElementById("fecharModal")
.addEventListener(
    "click",
    ()=>{

        document
        .getElementById("modalEditar")
        .style.display =
        "none";

    }
);

document
.getElementById("imagem")
.addEventListener(
    "change",
    function(event){

        const arquivo =
        event.target.files[0];

        if(!arquivo) return;

        const leitor =
        new FileReader();

        leitor.onload = function(e){

            imagemBase64 =
            e.target.result;

            const preview =
            document.getElementById(
                "previewImagem"
            );

            preview.src =
            imagemBase64 || "";

            preview.style.display =
            "block";

        };

        leitor.readAsDataURL(
            arquivo
        );

    }
);

iniciar();