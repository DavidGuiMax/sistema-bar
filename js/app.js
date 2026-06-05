const categoriasContainer =
document.getElementById("categoriasContainer");

const pesquisa =
document.getElementById("pesquisa");

let banco = null;

function formatarPreco(valor){

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

}

async function carregarDados(){

    banco = await carregarBanco();

    renderizar();

}

function renderizar(){

    if(!banco) return;

    categoriasContainer.innerHTML = "";

    const busca =
    pesquisa.value
    .trim()
    .toLowerCase();

    let totalProdutos = 0;

    banco.categorias.forEach(categoria => {

        const produtosCategoria =
        banco.produtos.filter(produto => {

            const nomeProduto =
            produto.nome.toLowerCase();

            const nomeCategoria =
            categoria.nome.toLowerCase();

            return (

                produto.categoria == categoria.id

                &&

                (
                    nomeProduto.includes(busca)

                    ||

                    nomeCategoria.includes(busca)
                )

            );

        });

        if(produtosCategoria.length === 0){

            return;

        }

        totalProdutos +=
        produtosCategoria.length;

        const section =
        document.createElement("section");

        section.classList.add("categoria");

        section.innerHTML = `

            <h2>
                ${categoria.nome}
            </h2>

            <div class="carrossel"></div>

        `;

        const carrossel =
        section.querySelector(
            ".carrossel"
        );

        produtosCategoria.forEach(produto => {

            const imagem =

                produto.imagem

                ||

                "assets/img/sem-imagem.png";

            carrossel.innerHTML += `

                <div class="card">

                    <img
                    src="${imagem}"
                    alt="${produto.nome}">

                    <div class="info">

                        <div class="nome">

                            ${produto.nome}

                        </div>

                        <div class="preco">

                            ${formatarPreco(
                                produto.preco
                            )}

                        </div>

                    </div>

                </div>

            `;

        });

        categoriasContainer.appendChild(
            section
        );

    });

    atualizarContador(
        totalProdutos
    );

}

function atualizarContador(total){

    const contador =
    document.getElementById(
        "contadorProdutos"
    );

    if(!contador) return;

    contador.textContent =

        `${total} produto${
            total !== 1
            ? "s"
            : ""
        } disponível${
            total !== 1
            ? "is"
            : ""
        }`;

}

pesquisa.addEventListener(
    "input",
    renderizar
);

carregarDados();