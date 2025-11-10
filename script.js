// Esperem que tota la pàgina s'hagi carregat abans d'executar res
document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const addSectionBtn = document.getElementById('add-section-btn');

    // --- PART 1: AFEGIR NOVES SECCIONS (CONTENIDORS) ---

    addSectionBtn.addEventListener('click', () => {
        const sectionTitle = prompt("Quin títol vols per a la nova secció?");
        if (sectionTitle) { // Només si l'usuari escriu alguna cosa
            const newSection = createSection(sectionTitle);
            mainContent.insertBefore(newSection, addSectionBtn.parentElement);
        }
    });

    // Funció que crea l'HTML d'una nova secció
    function createSection(title) {
        const section = document.createElement('section');
        section.className = 'card';
        section.innerHTML = `
            <div class="card-header">
                <h2>${title}</h2>
                <button class="add-link-btn" title="Afegir nou enllaç">+</button>
            </div>
            <div class="button-container">
                <!-- Aquí aniran els nous botons d'enllaç -->
            </div>
        `;
        return section;
    }


    // --- PART 2: AFEGIR NOUS ENLLAÇOS (BOTONS) DINS D'UNA SECCIÓ ---

    // Utilitzem una tècnica que escolta els clics a tot el 'main'
    // per a que funcioni també amb les noves seccions que creem.
    mainContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-link-btn')) {
            const buttonText = prompt("Quin text vols per al botó?");
            if (!buttonText) return;

            const buttonUrl = prompt("Quina URL (enllaç) vols posar-li?");
            if (!buttonUrl) return;

            const newButton = createButton(buttonText, buttonUrl);
            
            // Trobem el contenidor de botons d'aquesta secció i hi afegim el nou botó
            const buttonContainer = event.target.closest('.card').querySelector('.button-container');
            buttonContainer.appendChild(newButton);
        }
    });

    // Funció que crea l'HTML d'un nou botó d'enllaç
    function createButton(text, url) {
        const button = document.createElement('a');
        button.href = url;
        button.className = 'button';
        button.target = '_blank';
        button.draggable = true;
        button.textContent = text;
        return button;
    }


    // --- PART 3: ARROSSEGAR I CANVIAR DE LLOC ELS BOTONS ---
    
    let draggedButton = null;

    // També escoltem a tot el 'main' per a que funcioni amb els botons nous.
    mainContent.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('button')) {
            draggedButton = event.target;
            setTimeout(() => {
                event.target.classList.add('dragging');
            }, 0);
        }
    });

    mainContent.addEventListener('dragend', (event) => {
        if (event.target.classList.contains('button')) {
            event.target.classList.remove('dragging');
            draggedButton = null;
        }
    });

    mainContent.addEventListener('dragover', (event) => {
        // Això és necessari per permetre que es pugui deixar anar l'element aquí
        event.preventDefault(); 
        
        const container = event.target.closest('.button-container');
        if (container) {
            const afterElement = getDragAfterElement(container, event.clientX);
            if (afterElement == null) {
                container.appendChild(draggedButton);
            } else {
                container.insertBefore(draggedButton, afterElement);
            }
        }
    });
    
    // Funció auxiliar per saber on col·locar el botó que arrosseguem
    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.button:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});