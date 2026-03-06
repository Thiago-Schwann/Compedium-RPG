document.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch("data/personagens.json");
    const personagens = await response.json();

    const container = document.getElementById("lista-personagens");

    personagens.forEach(p => {

        const card = document.createElement("div");
        card.classList.add("card");

        const imagemSrc = (p.imagens && p.imagens.length > 0)
            ? p.imagens[0]
            : p.imagem;

        card.innerHTML = `
            <div class="card-content">
                <h3>${p.nome}</h3>
                <p>${p.descricao_curta}</p>
            </div>

            <div class="card-image">
                <img src="${imagemSrc}" alt="${p.nome}">
            </div>
        `;

        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `personagem.html?id=${p.id}`;
        });

        container.appendChild(card);

    });

});