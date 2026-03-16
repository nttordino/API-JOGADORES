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
const API_KEY = "minha_chave_super_secreta";


//===========================
// FUNÇÃO QUE CHAMA A API
//===========================

async function fetchFromApi(endpoint){

    if(!jogadorArea) return;

    jogadorArea.classList.add("loading");

    try {

        const url = `${API_BASE}${endpoint}`;
        console.log("Requisição:", url);

        const response = await fetch(url,{
            headers:{
                "x-api-key": API_KEY
            }
        });

        if(!response.ok){
            throw new Error("Erro na requisição");
        }

        const data = await response.json();
        console.log("Resposta:", data);

        if(data.status === "success"){

            //mostrar imagem
            jogadorImage.src = data.foto || "";

            //remover "_" do nome e formatar texto
            let formattedMessage = data.message
                .replace(/_/g," ")
                .replace(/\n/g,"<br>");

            //mostrar dados
            breedName.innerHTML = formattedMessage;

        } else {

            breedName.textContent = "Jogador não encontrado";
            jogadorImage.src = "";

        }

    } catch(error){

        console.error("Erro:", error);

        breedName.textContent = "Erro ao carregar jogador";
        jogadorImage.src = "";

    } finally {

        jogadorArea.classList.remove("loading");

    }

}


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