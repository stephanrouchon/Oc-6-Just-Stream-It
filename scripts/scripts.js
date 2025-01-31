const ApiGenresURL = "http://127.0.0.1:8000/api/v1/genres";
const ApiMoviesURL = "http://127.0.0.1:8000/api/v1/titles";


async function getJSON(url) {
    const response = await fetch(url);
    return response.json();

}

function generateUrlOrderByVote(genre){
    const url = `${ApiMoviesURL}/?genre=${genre}&sort_by=-avg_vote`;
    return url;

}

//fonction qui retourne l'url d'un film
function generateUrlMovieCard(movieId){
    const url = `${ApiMoviesURL}/${movieId}`;
    return url;

}

//fonction qui retourne les 10 meilleurs films d'un genre
async function getDataGenres(genre) {
    const url = generateUrlOrderByVote(genre);
    //on recupere les données de la page 1
    const data = await getJSON(url);
    //on recupere les données de la page 2
    if (data.next === null){
        return data.results;
    }
    const data2 = await getJSON(data.next);
    //on fusionne les données
    const dataAll = [...data.results, ...data2.results];

    return dataAll;
    
}

await sectionBestMovie();

const moviesData = await getDataMoviesGenre("horror");


//retourne les data du film avec la meilleur note
async function getBestMovie(){
    const url = `${ApiMoviesURL}/?sort_by=-avg_vote`;
    const data = await getJSON(url);
    const movieId = data.results[0].url;
    return await getJSON(movieId);
};


//affiche la section meilleur film
async function  sectionBestMovie(){
    const data = await getBestMovie();
    const bfJacket = document.querySelector("#bf-jacket");
    const bfTitle = document.querySelector(".bf-title");
    const bfDescription = document.querySelector(".bf-description");
    const bfButton = document.querySelector("button");
    bfJacket.src = data.image_url;
    bfTitle.textContent = data.title;
    bfDescription.textContent = data.description;
    bfButton.id = data.id;
;}


//récupere les data des films d'un genre

async function getDataMoviesGenre(genre){

    const data = await getDataGenres(genre);
    const dataLength = data.length>=6 ? 6 : data.length;
    
    let moviesData = [];

    for (let i = 0; i < dataLength; i++){
        const movie = data[i];
        const movieId = movie.url;
        const movieData = await getJSON(movieId);
        moviesData.push(movieData);
    }
    return moviesData;
}

//genere une card pour un film
function createMovieCard(movieData, index){
            
        const galleryItem = document.createElement('div');
        
        galleryItem.className = `gallery-item${index+1}`;
        if ((index === 2) || (index === 3)){
            galleryItem.classList.add("hidden-mobile");
        }

        if ((index === 4) || (index === 5)) {
            galleryItem.classList.add("hidden-tablette");
        }
        
        checkIfImageExists(movieData.image_url, "./images/not_available.png", (validUrl) => {
            movieData.image_url = validUrl;
            galleryItem.innerHTML = `
            
             <img src=" ${movieData.image_url}" alt="${movieData.title}" class="image${index}">
            
             <div class="overlay">
                     <h3 class="text">${movieData.title}</h3>
                     
                     <div class="button-container">
                         <button class="btn detail" id=${movieData.id}>Détails</button>
                     </div>
             </div>
                 
             `;    
        
            });
        
            

    return galleryItem;
    
};

//affiche les films d'un genre dans une gallerie

async function displayMovies(genre, idGallery){

    const gallery = document.getElementById(idGallery);
    const moviesData = await getDataMoviesGenre(genre);
    gallery.innerHTML = "";
    for (let i = 0; i < 6; i++){
        const movieCard = createMovieCard(moviesData[i], i);
        gallery.appendChild(movieCard);
    };
}


// display Gallerys

await displayMovies("Animation", "gallery2");
await displayMovies("Horror", "gallery3");
await displayMovies("Family", "gallery4");
await displayMovies("Comedy", "gallery5");
await displayMovies("Mystery", "gallery1");



const listBoutons = document.querySelectorAll("button.btn.detail");

for (let i=0; i<listBoutons.length; i++){
    let boutonactuel = listBoutons[i];
    
    boutonactuel.addEventListener('click', (event) =>{
        const monBouton = event.target;
        console.log(monBouton.id);
        displayMovieDetails(monBouton.id);
        const modal = document.getElementById("modal");
        modal.style.display = "block";

        
    });
};

async function getGenres() {
    const genresJSON = await getJSON(ApiGenresURL);
    const nbPages = parseInt(genresJSON.count / 5);
  
    let genres = [];
    for (let i = 1; i <= nbPages; i++) {
      const url = ApiGenresURL + "?page=" + i;
      const genresPage = await getJSON(url);
      genres = genres.concat(genresPage.results);
    }
  
    const listGenres = genres.map((genre) => genre.name);
  
    return listGenres;
  }
  

var span = document.getElementById("close-modal");
    span.onclick = function() {
        modal.style.display = "none";
    }

async function getMovieDetails(movieId){
    const url = generateUrlMovieCard(movieId);
    const data = await getJSON(url);
    return data;
}


// affiche les details d'un film dans une modale lorsque l'on clique sur le bouton detail
async function displayMovieDetails(movieId){

    const data = await getMovieDetails(movieId);
    
    
    checkIfImageExists(data.image_url, "./images/not_available.png", (validUrl) => {
        data.image_url = validUrl;
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `
            
            <div class="modal_info">
                <h2 class="modal-title">${data.title}</h2>
                <div class="modal-info-details">
                    <span class="info">${data.year} - ${data.genres.join(", ")}</span><br>
                    <span class="info">${data.rated} - ${data.duration} minutes (${data.countries.join(" / ")})</span><br>
                    <span class="info"> Recettes (usa / world): ${data.worldwide_gross_income || "inconnu"} / ${data.worldwide_gross_income || "inconnu" }</span><br>
                    <br>
                </div>
                <span id="Realise">Réalisé par</h3><br>
                <span id="directors">${data.directors.join(", ")}</p>                
            </div>

            <div class="modal-body">
                <p class="modal-description">${data.long_description}</p>
            </div>

            <div class="modal-img">
                <img src="${data.image_url}" alt="${data.title}">
            </div>

            <div class="modal-actors">
                <h5>Avec</h5>
                <p class="actors">${data.actors.join(", ")} </p></p>
            </div>
            `;

            });

}

async function displayGenres(){
    const genres = await getGenres();
    
    const genre1 = document.getElementById("select-genre1");
    const genre2 = document.getElementById("select-genre2");

    for (let i = 0 ; i < genres.length; i++){ 
        genre1.innerHTML += `
            <option value="${genres[i]}" ${genres[i]==="Family" ? "selected" : ""}>${genres[i]}</option>
            `;
    };

    for (let i = 0 ; i < genres.length; i++){ 
        genre2.innerHTML += `
            <option value="${genres[i]}" ${genres[i]==="Family" ? "selected" : ""}>${genres[i]}</option>
            
            `;
    };
}
    
displayGenres();

function checkIfImageExists(url, fallbackUrl, callback) {
    const img = new Image();
    img.src = url;

    img.onload = () => {
        callback(url); // L'image a été chargée avec succès.
    };

    img.onerror = () => {
        callback(fallbackUrl); // L'image est invalide, on utilise l'image par défaut.
    };
}

async function changeMovieData(id){
    let data = await getMovieDetails(id);

    return new Promise((resolve) => {
        checkIfImageExists(data.image_url, "./images/not_available.png", (validUrl) => {
            data.image_url = validUrl;
            resolve(data);
        });
    });
}


//On recupere le select
let listeSelect1 = document.getElementById("select-genre1");
let listeSelect2 = document.getElementById("select-genre2");

//on affiche la valeur du select

listeSelect1.addEventListener('change', async function() {
    await displayMovies(listeSelect1.value, "gallery4");
});

listeSelect2.addEventListener('change', async function() {
    await displayMovies(listeSelect2.value, "gallery5");
});


const buttonCloseModal = document.getElementById("modal-close");

buttonCloseModal.addEventListener('click', (event) =>{
    const modal = document.getElementById("modal");
    modal.style.display = "none";
});
