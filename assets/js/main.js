document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("destaques");

    const arquivos = [
        { path: "data/personagens.json", tipo: "personagem" },
        { path: "data/faccoes.json", tipo: "faccoes" },
        { path: "data/mundos.json", tipo: "mundos" }
    ];

    for (const arquivo of arquivos) {

        try {
            const response = await fetch(arquivo.path);
            const dados = await response.json();

            dados
                .filter(item => item.destaque === true)
                .forEach(item => {

                    const card = document.createElement("div");
                    card.classList.add("card");

                    const titulo = item.nome || item.titulo;
                    const descricao = item.descricao_curta || item.descricao;

                    // 🔎 Compatibilidade de imagem
                    const imagemSrc = (item.imagens && item.imagens.length > 0)
                        ? item.imagens[0]
                        : item.imagem;

                    card.innerHTML = `
                        <div class="card-content">
                            <h3>${titulo}</h3>
                            <p>${descricao}</p>
                        </div>

                        <div class="card-image">
                            <img src="${imagemSrc || ""}" alt="${titulo}">
                        </div>
                    `;

                    card.style.cursor = "pointer";

                    card.addEventListener("click", () => {
                        window.location.href = `${arquivo.tipo}.html?id=${item.id}`;
                    });

                    container.appendChild(card);

                });

        } catch (error) {
            console.warn(`Erro ao carregar ${arquivo.path}`);
        }
    }

});