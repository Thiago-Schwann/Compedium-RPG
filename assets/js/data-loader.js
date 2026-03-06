document.addEventListener("DOMContentLoaded", async () => {

    async function loadComponent(id, file) {
        const response = await fetch(file);
        const content = await response.text();
        document.getElementById(id).innerHTML = content;
    }

    await loadComponent("header", "components/header.html");
    await loadComponent("footer", "components/footer.html");

});