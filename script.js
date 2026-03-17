/*
CONSUMINDO UMA API COM JAVASCRIPT
*/

const jogadorImage = document.getElementById("jogadorImage");
const breedName = document.getElementById("breedName");

const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const breedInput = document.getElementById("breedInput");

const jogadorArea = document.querySelector(".jogador-area");

const API_BASE = "http://10.106.208.7:3000/api";
const API_KEY = "DSI3_SESI";


//===========================
// FUNÇÃO QUE CHAMA A API
//===========================

async function fetchFromApi(endpoint){

    if (endpoint === "/verificar"){
        const url = `http://10.106.208.7:3000${endpoint}`
        const response = await fetch(url, ({
            method: "GET",
            headers:{
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            }
        }))
        const data = await response.json()
        console.log(data.message)

    } else{

        if(!jogadorArea) return;
    
        jogadorArea.classList.add("loading");
    
        try {
    
            const url = `${API_BASE}${endpoint}`;
            // console.log("Requisição:", url);
    
            const response = await fetch(url,{
                method: "GET",
                headers:{
                    "x-api-key": API_KEY,
                    "Content-Type": "application/json"
                }
            });
    
            // 👇 DEBUG IMPORTANTE
            // console.log("Status:", response.status);
    
            if(!response.ok){
    
                const erro = await response.json().catch(() => null);
                console.log("Erro detalhado:", erro);
    
                throw new Error(`Erro ${response.status}`);
            }
    
            const data = await response.json();
            // console.log("Resposta:", data);
    
            if(data.status === "success"){
    
                jogadorImage.src = data.foto || "";
    
                let formattedMessage = data.message
                    .replace(/_/g," ")
                    .replace(/\n/g,"<br>");
    
                breedName.innerHTML = formattedMessage;
    
            } else {
    
                breedName.textContent = data.message || "Jogador não encontrado";
                jogadorImage.src = "";
    
            }
    
        } catch (error) {

            console.error("Erro:", error);

            if (error.message === "Failed to fetch") {
                breedName.textContent = "Erro de conexão com o servidor";
                jogadorImage.src = "";
            } else {
                breedName.textContent = "Erro ao carregar jogador";
                jogadorImage.src = "";
            }

        } finally {
    
            jogadorArea.classList.remove("loading");
    
        }
    }

}

fetchFromApi("/verificar")

//======================
// CARREGAR AO ABRIR
//======================

fetchFromApi("/jogadores/aleatorio");


//======================
// FUNÇÕES DE AÇÃO
//======================

function getRandomJogador(){
    fetchFromApi("/jogadores/aleatorio");
}

function getBreedJogador(){

    let jogador = breedInput.value.trim().toLowerCase();

    if(!jogador){
        alert("Digite o nome de um jogador!");
        return;
    }

    jogador = jogador.replace(/\s+/g,"_");

    fetchFromApi(`/jogadores/${jogador}`);

    breedInput.value = "";
}


//======================
// EVENTOS
//======================

randomBtn?.addEventListener("click", getRandomJogador);

searchBtn?.addEventListener("click", getBreedJogador);

jogadorImage?.addEventListener("click", getRandomJogador);

breedInput?.addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        getBreedJogador();
    }

});