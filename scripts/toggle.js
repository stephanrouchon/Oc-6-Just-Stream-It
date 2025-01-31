const buttonG1 = document.getElementById("toggleButton-gallery1");
const toggleButtons = document.querySelectorAll(".toggle");
console.log(toggleButtons);

for (let i=0; i<toggleButtons.length; i++){
    
    let boutonactuel = toggleButtons[i];
    
    boutonactuel.addEventListener('click', (event) =>{
        const monBouton = event.target;
        const galleryID = monBouton.id.replace("toggleButton-", "");
        
    
    const galleryItems1 = document.querySelectorAll(`#${galleryID} .gallery-item3, #${galleryID} .gallery-item4`);
    const galleryItems2 = document.querySelectorAll(`#${galleryID} .gallery-item5, #${galleryID} .gallery-item6`);
    
    
    const isHidden = Array.from(galleryItems1).some(item => item.classList.contains("hidden-mobile"));
    const isHidden1 = Array.from(galleryItems2).some(item => item.classList.contains("hidden-tablette"));
    galleryItems1.forEach(item => {
        item.classList.toggle("hidden-mobile");
    });
    galleryItems2.forEach(item => {
        item.classList.toggle("hidden-tablette");
    });
    if (isHidden1) {
        galleryItems2.forEach(item => {
            item.classList.remove("hidden-tablette");
        });
    } else {
        galleryItems2.forEach(item => {
            item.classList.add("hidden-tablette");
        });
    }

    if (isHidden) {
        galleryItems2.forEach(item => {
            item.classList.remove("hidden-mobile");
        });
    } else {
        galleryItems2.forEach(item => {
            item.classList.add("hidden-mobile");
        });
    }

    monBouton.textContent = isHidden ? "voir moins" : "voir plus";
    });
};