document.addEventListener("DOMContentLoaded", function () {
    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dados = Object.fromEntries(new FormData(formCadastro));
            try {
                const resp = await fetch('/cadastrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
                const result = await resp.json();
                document.getElementById('mensagem').innerText = result.message;
                formCadastro.reset();
            } catch (err) {
                alert('Erro de comunicação: ' + err);
            }
        });
    }

    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const nome = document.getElementById('campoBusca').value;
            const resp = await fetch(`/buscar?nome=${nome}`);
            const clientes = await resp.json();

            const tabela = document.getElementById('tabelaResultados');
            tabela.innerHTML = ''; 

            clientes.forEach(cli => {
                const row = `
                <tr>
                    <td>${cli.ID}</td>
                    <td>${cli.Nome}</td>
                    <td>${cli.CPF}</td>
                    <td>${cli.Email}</td>
                    <td>${cli.Telefone}</td>
                    <td><a href="/alterar?id=${cli.ID}" class="btn btn-sm btn-warning">Editar</a></td>
                </tr>`;
                tabela.innerHTML += row;
            });
        });
    }

    const formAlterar = document.getElementById('formAlterar');
    if (formAlterar) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id'); 
        const mensagem = document.getElementById('mensagem');

        fetch(`/api/cliente/${id}`) 
            .then(r => r.json())
            .then(cli => {
                document.getElementById('clienteid').value = cli.ID;
                document.getElementById('nome').value = cli.Nome;
                document.getElementById('cpf').value = cli.CPF;
                document.getElementById('email').value = cli.Email;
                document.getElementById('telefone').value = cli.Telefone;
                document.getElementById('endereco').value = cli.Endereço;
                document.getElementById('observacoes').value = cli.Observações;
            });

        formAlterar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dados = {
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                endereco: document.getElementById('endereco').value,
                observacoes: document.getElementById('observacoes').value
            };

            try {
                const resp = await fetch(`/api/atualizar/${id}`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(dados)
                });

                const result = await resp.json(); 
                mensagem.innerText = result.message;
            } catch (err) {
                console.error("Erro ao atualizar:", err);
            }
        });
    }
});

// --- CÓDIGO DO CANVAS (CORRIGIDO) ---
const canvas = document.createElement('canvas');
canvas.id = 'snowCanvas';
// Estilo para o canvas não atrapalhar o layout
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9999';

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

let snowflakes = [];
let mouseX = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', e => mouseX = e.clientX);

function createSnowflakes(count) {
    for (let i = 0; i < count; i++){
        snowflakes.push({
           x: Math.random() * canvas.width,
           y: Math.random() * canvas.height,
           r: Math.random() * 4 + 1,
           d: Math.random() + 1
        });
    }
}
createSnowflakes(40);

function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    
    for(let flake of snowflakes){
        ctx.beginPath();
        // Correção: Usar ctx.arc para desenhar círculos e Math com M maiúsculo
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();
        
        // Atualização da posição (Correção: Math.pow, Math.sin, Math.random)
        flake.y += Math.pow(flake.d, 2) + 1;
        flake.x += Math.sin(mouseX / 100) * 0.5;
        
        if (flake.y > canvas.height){
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
    }
    requestAnimationFrame(drawSnow);
}
drawSnow();