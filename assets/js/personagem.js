document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const response = await fetch("data/personagens.json");
    const personagens = await response.json();

    const personagem = personagens.find(p => p.id === id);
    const container = document.getElementById("personagem");

    if (!personagem) {
        container.innerHTML = "<h2>Personagem não encontrado.</h2>";
        return;
    }

/* =========================
   🎵 SISTEMA GLOBAL DE MÚSICA
========================== */
if (personagem.musica) {

    const audio = document.createElement("audio");
    audio.src = personagem.musica;
    audio.loop = true;
    audio.volume = 0;
    document.body.appendChild(audio);

    const button = document.createElement("button");
    button.classList.add("music-btn");

    button.innerHTML = `
        <svg class="icon-som" viewBox="0 0 24 24">
            <!-- Base do alto-falante -->
            <path class="som-base" d="M3 10V14H7L12 18V6L7 10H3Z"/>
            
            <!-- Ondas sonoras -->
            <path class="som-on" d="M16 8C17.5 9.5 17.5 14.5 16 16"/>
            <path class="som-on" d="M18.5 5.5C21 8 21 16 18.5 18.5"/>
            
            <!-- Linha de mudo -->
            <line class="som-off" x1="16" y1="8" x2="21" y2="16"/>
        </svg>
    `;

    document.body.appendChild(button);

    const TARGET_VOLUME = 0.3;
    let isPlaying = false;

    const fadeIn = () => {
        audio.volume = 0;
        let fade = setInterval(() => {
            if (audio.volume < TARGET_VOLUME) {
                audio.volume += 0.01;
            } else {
                audio.volume = TARGET_VOLUME;
                clearInterval(fade);
            }
        }, 100);
    };

    button.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!isPlaying) {
            audio.play().then(() => {
                fadeIn();
                button.classList.add("ativo");
                isPlaying = true;
            }).catch(() => {
                console.warn("Autoplay bloqueado pelo navegador.");
            });
        } else {
            audio.pause();
            button.classList.remove("ativo");
            isPlaying = false;
        }
    });

}
let historiaHTML = "";
let reflavorsHTML = "";

/* =========================
   📖 CARREGA HISTÓRIA
========================== */

if (personagem.historiaArquivo) {
    try {
        const res = await fetch(personagem.historiaArquivo);
        historiaHTML = await res.text();
    } catch (err) {
        console.error("Erro ao carregar história:", err);
    }
}

/* =========================
   ✨ CARREGA REFLAVORS
========================== */

if (personagem.caster && personagem.reflavorsArquivo) {
    try {
        const res = await fetch(personagem.reflavorsArquivo);
        reflavorsHTML = await res.text();
    } catch (err) {
        console.error("Erro ao carregar reflavors:", err);
    }
}

    /* =========================
       📄 CONTEÚDO PRINCIPAL
    ========================== */

container.innerHTML = `
<div class="personagem-layout">

    <div class="personagem-main">

        <div class="personagem-header">
            <div class="carrossel">
                <button class="carrossel-btn prev" aria-label="Anterior">
                    <svg viewBox="0 0 24 24" class="icon-seta">
                        <path d="M15 6 L9 12 L15 18" />
                    </svg>
                </button>

                <div class="carrossel-track">
                    ${personagem.imagens.map(img => `
                        <img src="${img}" alt="${personagem.nome}">
                    `).join("")}
                </div>

                <button class="carrossel-btn next" aria-label="Próximo">
                    <svg viewBox="0 0 24 24" class="icon-seta">
                        <path d="M9 6 L15 12 L9 18" />
                    </svg>
                </button>
            </div>
            <div class="personagem-info">
                <h1>${personagem.nome}</h1>

                <div class="personagem-meta">
                    ${personagem.raca || ""} • 
                    ${personagem.classe || ""} • 
                    ${personagem.subclasse || ""}<br>
                    ${personagem.cenário || ""} —
                    ${personagem.mesa || ""} 
                </div>

                ${personagem.atributos ? `
                    <div class="atributos-barra">
                        ${Object.entries(personagem.atributos).map(([chave, valor]) => `
                            <div class="atributo-retangulo">
                                <span class="label">${chave.toUpperCase()}</span>
                                <span class="valor">${valor}</span>
                            </div>
                        `).join("")}
                    </div>
                ` : ""}

                <p>${personagem.descricao_curta || ""}</p>
            </div>
        </div>

        <div class="personagem-detalhes">

            <div class="abas-detalhes">
                <button class="aba-btn ativa" data-aba="historia">História</button>
                <button class="aba-btn" data-aba="caracteristicas">Características</button>
                ${personagem.caster && reflavorsHTML ? `
                    <button class="aba-btn" data-aba="reflavors">Reflavors</button>
                ` : ""}
            </div>

            <div class="conteudo-aba ativa" id="aba-historia">
                <div class="historia-conteudo collapsed">
                    ${historiaHTML || ""}
                </div>

                <button class="btn btn-outline toggle-historia">
                    Ler mais ↓
                </button>
            </div>

            <div class="conteudo-aba" id="aba-caracteristicas">
                <div class="bloco-caracteristica">
                    <h3>Traços de Personalidade</h3>
                    <p>${personagem.tracos || ""}</p>
                </div>

                <div class="bloco-caracteristica">
                    <h3>Ideais</h3>
                    <p>${personagem.ideais || ""}</p>
                </div>

                <div class="bloco-caracteristica">
                    <h3>Defeitos</h3>
                    <p>${personagem.defeitos || ""}</p>
                </div>
            </div>

            ${personagem.caster && reflavorsHTML ? `
                <div class="conteudo-aba" id="aba-reflavors">
                    ${reflavorsHTML}
                </div>
            ` : ""}

        </div>

    </div>

</div>
`;

const track = document.querySelector(".carrossel-track");
const slides = Array.from(document.querySelectorAll(".carrossel-track img"));
const prevBtn = document.querySelector(".carrossel-btn.prev");
const nextBtn = document.querySelector(".carrossel-btn.next");

if (slides.length > 1) {

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = document.querySelectorAll(".carrossel-track img");

    let index = 1;
    let isAnimating = false;

    track.style.transform = `translateX(-${index * 100}%)`;

    function updateCarousel(animate = true) {

        if (isAnimating) return;

        isAnimating = true;

        track.style.transition = animate ? "transform 0.4s ease" : "none";
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        if (isAnimating) return;
        index++;
        updateCarousel(true);
    });

    prevBtn.addEventListener("click", () => {
        if (isAnimating) return;
        index--;
        updateCarousel(true);
    });

    track.addEventListener("transitionend", () => {

        const total = allSlides.length;

        if (index === total - 1) {
            index = 1;
            track.style.transition = "none";
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        if (index === 0) {
            index = total - 2;
            track.style.transition = "none";
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        // Pequeno timeout garante que o reset não seja reanimado
        setTimeout(() => {
            isAnimating = false;
        }, 20);

    });

}

    /* =========================
       🔽 TOGGLE HISTÓRIA
    ========================== */

    const toggleBtn = document.querySelector(".toggle-historia");
    const historia = document.querySelector(".historia-conteudo");

    toggleBtn.addEventListener("click", () => {

        if (historia.classList.contains("collapsed")) {
            historia.style.maxHeight = historia.scrollHeight + "px";
            historia.classList.remove("collapsed");
            toggleBtn.textContent = "Ler menos ↑";
        } else {
            historia.style.maxHeight = "200px";
            historia.classList.add("collapsed");
            toggleBtn.textContent = "Ler mais ↓";
        }
    });
    document.querySelector(".abas-detalhes").addEventListener("click", (e) => {

    const botao = e.target.closest(".aba-btn");
    if (!botao) return;

    document.querySelectorAll(".aba-btn")
        .forEach(b => b.classList.remove("ativa"));

    document.querySelectorAll(".conteudo-aba")
        .forEach(c => c.classList.remove("ativa"));

    botao.classList.add("ativa");

    const alvo = document.getElementById("aba-" + botao.dataset.aba);
    if (alvo) {
        alvo.classList.add("ativa");
    }

});

/* =========================
   🎵 MÚSICAS SHOWCASE
========================== */

if (personagem.musicas_showcase) {

    const abasContainer = document.querySelector(".abas-detalhes");

    const botaoMusicas = document.createElement("button");
    botaoMusicas.classList.add("aba-btn");
    botaoMusicas.dataset.aba = "musicas";
    botaoMusicas.textContent = "Músicas";
    abasContainer.appendChild(botaoMusicas);

    const sectionMusicas = document.createElement("div");
    sectionMusicas.classList.add("conteudo-aba");
    sectionMusicas.id = "aba-musicas";

    document.querySelector(".personagem-detalhes")
        .appendChild(sectionMusicas);

    try {

        const pasta = personagem.musicas_showcase;
        const response = await fetch(`assets/audio/showcase/${pasta}/musicas.json`);
        const musicas = await response.json();

        musicas.forEach(musica => {

            const bloco = document.createElement("div");
            bloco.classList.add("musica-item");

            bloco.innerHTML = `
                <h3 class="musica-titulo">${musica.titulo}</h3>

                <div class="player-custom">

                    <button class="play-btn" aria-label="Play">
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5L19 12L8 19Z"/>
                        </svg>
                    </button>

                    <div class="barra-progresso">
                        <div class="progresso"></div>
                    </div>

                    <span class="tempo">0:00</span>

                    <div class="volume-container">

                    <button class="volume-btn" aria-label="Volume">
                        <svg viewBox="0 0 24 24" class="icon-volume">
                            <path class="icon-base" d="M3 10V14H7L12 18V6L7 10H3Z"/>
                            <path class="icon-wave" d="M16 8C17.5 9.5 17.5 14.5 16 16"/>
                            <path class="icon-wave" d="M18.5 5.5C21 8 21 16 18.5 18.5"/>
                        </svg>
                    </button>

                    <input type="range"
                        class="volume-slider"
                        min="0"
                        max="1"
                        step="0.01"
                        value="0.7">

                    </div>

                </div>

                <audio preload="none">
                    <source src="assets/audio/showcase/${pasta}/${musica.arquivo}" type="audio/mpeg">
                </audio>
            `;

            sectionMusicas.appendChild(bloco);

        });

    } catch (erro) {

        sectionMusicas.innerHTML = `
            <p>Nenhuma música encontrada.</p>
        `;

        console.error("Erro ao carregar músicas:", erro);
    }
}

document.querySelectorAll(".musica-item").forEach(item => {

    const audio = item.querySelector("audio");
    const playBtn = item.querySelector(".play-btn");
    const progresso = item.querySelector(".progresso");
    const barra = item.querySelector(".barra-progresso");
    const tempo = item.querySelector(".tempo");

    const volumeSlider = item.querySelector(".volume-slider");
    const volumeBtn = item.querySelector(".volume-btn");
    const iconVolume = item.querySelector(".icon-volume");

    /* =========================
       CONFIG INICIAL
    ========================== */

    audio.volume = volumeSlider.value;

    function updateVolumeIcon(value) {

        if (value == 0) {
            iconVolume.innerHTML = `
                <path d="M3 10V14H7L12 18V6L7 10H3Z"/>
                <line x1="16" y1="8" x2="21" y2="16" stroke="#2b1d0e" stroke-width="2"/>
            `;
        } else {
            iconVolume.innerHTML = `
                <path d="M3 10V14H7L12 18V6L7 10H3Z"/>
                <path d="M16 8C17.5 9.5 17.5 14.5 16 16" fill="none" stroke="#2b1d0e" stroke-width="2"/>
                <path d="M18.5 5.5C21 8 21 16 18.5 18.5" fill="none" stroke="#2b1d0e" stroke-width="2"/>
            `;
        }
    }

    updateVolumeIcon(audio.volume);

    /* =========================
       PLAY / PAUSE
    ========================== */

    playBtn.addEventListener("click", () => {

        // pausa os outros
        document.querySelectorAll(".musica-item audio").forEach(a => {
            if (a !== audio) a.pause();
        });

        // reseta ícones dos outros
        document.querySelectorAll(".play-btn").forEach(btn => {
            if (btn !== playBtn) {
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M8 5L19 12L8 19Z"/>
                    </svg>
                `;
            }
        });

        if (audio.paused) {

            audio.play();

            playBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14"/>
                    <rect x="14" y="5" width="4" height="14"/>
                </svg>
            `;

        } else {

            audio.pause();

            playBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M8 5L19 12L8 19Z"/>
                </svg>
            `;
        }
    });

    /* =========================
       PROGRESSO
    ========================== */

    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        progresso.style.width = percent + "%";

        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60)
            .toString()
            .padStart(2, "0");

        tempo.textContent = `${minutes}:${seconds}`;
    });

    barra.addEventListener("click", (e) => {

        const rect = barra.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;

        audio.currentTime = percent * audio.duration;
    });

    /* =========================
       VOLUME
    ========================== */

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
        updateVolumeIcon(audio.volume);
    });

    volumeBtn.addEventListener("click", () => {

        if (audio.volume > 0) {
            audio.volume = 0;
            volumeSlider.value = 0;
        } else {
            audio.volume = 0.7;
            volumeSlider.value = 0.7;
        }

        updateVolumeIcon(audio.volume);
    });

    /* =========================
       RESET AO TERMINAR
    ========================== */

    audio.addEventListener("ended", () => {

        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M8 5L19 12L8 19Z"/>
            </svg>
        `;

        progresso.style.width = "0%";
        tempo.textContent = "0:00";
    });

});
    
});