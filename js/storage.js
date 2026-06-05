async function carregarBanco(){

    const banco = {

        produtos: [],
        categorias: [],
        fiados: [],
        movimentacoes: []

    };

    const produtos =
    await supabaseClient
    .from("produtos")
    .select("*");

    const categorias =
    await supabaseClient
    .from("categorias")
    .select("*");

    const fiados =
    await supabaseClient
    .from("fiados")
    .select("*");

    const movimentacoes =
    await supabaseClient
    .from("movimentacoes_fiados")
    .select("*");

    banco.produtos =
    produtos.data || [];

    banco.categorias =
    categorias.data || [];

    banco.fiados =
    fiados.data || [];

    banco.movimentacoes =
    movimentacoes.data || [];

    return banco;

}

/* =========================
   PRODUTOS
========================= */

async function adicionarProduto(produto){

    const { data, error } =
    await supabaseClient
    .from("produtos")
    .insert([produto])
    .select();

    if(error){

        console.error(error);

        return null;

    }

    return data;

}

async function atualizarProduto(produto){

    const { error } =
    await supabaseClient
    .from("produtos")
    .update({

        nome: produto.nome,

        preco: produto.preco,

        imagem: produto.imagem,

        categoria: produto.categoria

    })
    .eq("id", produto.id);

    if(error){

        console.error(error);

    }

}

async function excluirProdutoBanco(id){

    const { error } =
    await supabaseClient
    .from("produtos")
    .delete()
    .eq("id", id);

    if(error){

        console.error(error);

    }

}

/* =========================
   CATEGORIAS
========================= */

async function criarCategoria(nome){

    const { data, error } =
    await supabaseClient
    .from("categorias")
    .insert([
        {
            nome
        }
    ])
    .select();

    if(error){

        console.error(error);

        return null;

    }

    return data;

}

async function excluirCategoria(id){

    const { error } =
    await supabaseClient
    .from("categorias")
    .delete()
    .eq("id", id);

    if(error){

        console.error(error);

    }

}

/* =========================
   FIADOS
========================= */

async function criarFiado(nome){

    const { data, error } =
    await supabaseClient
    .from("fiados")
    .insert([
        {
            nome,
            saldo: 0
        }
    ])
    .select();

    if(error){

        console.error(error);

        return null;

    }

    return data;

}

async function atualizarSaldoCliente(

    clienteId,
    novoSaldo

){

    const { error } =
    await supabaseClient
    .from("fiados")
    .update({

        saldo: novoSaldo

    })
    .eq("id", clienteId);

    if(error){

        console.error(error);

    }

}

async function excluirClienteFiado(id){

    const { error } =
    await supabaseClient
    .from("fiados")
    .delete()
    .eq("id", id);

    if(error){

        console.error(error);

    }

}

/* =========================
   MOVIMENTAÇÕES
========================= */

async function adicionarMovimentacao({

    cliente_id,
    valor,
    tipo

}){

    const { data, error } =
    await supabaseClient
    .from("movimentacoes_fiados")
    .insert([
        {
            cliente_id,
            valor,
            tipo
        }
    ])
    .select();

    if(error){

        console.error(error);

        return null;

    }

    return data;

}

async function carregarMovimentacoesCliente(
    clienteId
){

    const { data, error } =
    await supabaseClient
    .from("movimentacoes_fiados")
    .select("*")
    .eq(
        "cliente_id",
        clienteId
    )
    .order(
        "data",
        {
            ascending:false
        }
    );

    if(error){

        console.error(error);

        return [];

    }

    return data;

}

async function excluirMovimentacoesCliente(clienteId){

    const { error } =
    await supabaseClient
    .from("movimentacoes_fiados")
    .delete()
    .eq("cliente_id", clienteId);

    if(error){

        console.error(error);

    }

}