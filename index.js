const main = document.querySelector('main');
const basicArray = [
    {
        pic: 0,
        min: 1
    },
    {
        pic: 1,
        min: 1
    },
    {
        pic: 2,
        min: 1
    },
    {
        pic: 3,
        min: 1
    },
    {
        pic: 4,
        min: 1
    },
    {
        pic: 5,
        min: 1
    },
    {
        pic: 6,
        min: 1
    },
    {
        pic: 7,
        min: 1
    },
    {
        pic: 8,
        min: 1
    },
    {
        pic: 9,
        min: 1
    },
];

let exerciceArray = [];

//Get Stored Exercices array
(() => {
    if (localStorage.exercices) {
        exerciceArray = JSON.parse(localStorage.exercices);
    } else {
        exerciceArray = basicArray
    }
})();

class Exercice {
    constructor() {
        this.index = 0;
        this.minutes = exerciceArray[this.index].min;
        this.secondes = 0;
    }
    updateCountdown (){
        this.secondes = this.secondes < 10 ? "0" + this.secondes : this.secondes;

        setTimeout(()=>{
            if (this.minutes === 0 && this.secondes === "00") {
                this.index++;
                this.ring();
                if (this.index < exerciceArray.length){
                    this.minutes = exerciceArray[this.index].min;
                    this.secondes = 0
                    this.updateCountdown();
                }else{
                    return page.finish();
                }

            }else if(this.secondes === "00"){
                this.minutes --;
                this.secondes = 59;
                this.updateCountdown()

            }else{
                this.secondes --;
                this.updateCountdown()
            }
        }, 10)

        return(main.innerHTML = `
        <div class="exercice-container">
        <p>${this.minutes}:${this.secondes}</p>
        <img src ="./img/${exerciceArray[this.index].pic}.png" />
        <div>${this.index +1}/${exerciceArray.length}</div>
        </div>
      
        `)
    }

    ring(){
        const audio = new Audio();
        audio.src="ring.mp3";
        audio.play();
    }
}

const utils = {
    pageContent: function (title, content, btn) {
        document.querySelector('h1').innerHTML = title
        main.innerHTML = content
        document.querySelector('.btn-container').innerHTML = btn
    },
    handleEventMinutes: function () {
        document.querySelectorAll('input[type="number"]').forEach((input) => { // pour chacun des input de type number qu'on appelle number dans le parametre
            input.addEventListener('input', (e) => {
                exerciceArray.map((exo) => {

                    if (exo.pic == e.target.id) {
                        exo.min = parseInt(e.target.value)
                        this.store()
                    }
                })
            })

        })
    },

    handleEventArrow: function () {
        document.querySelectorAll('.arrow').forEach((arrow) => {
            arrow.addEventListener('click', (e) => {
                let position = 0;
                exerciceArray.map((exo) => {
                    if (exo.pic == e.target.dataset.pic && position != 0) {
                        [exerciceArray[position], exerciceArray[position - 1]] = [exerciceArray[position - 1], exerciceArray[position]]; // ici on intervertie les valeurs
                        page.lobby() // ici on actualise la page
                        this.store()
                    } else {
                        position++;
                    }
                })
            })
        })
    },

    deleteItem: function () {
        document.querySelectorAll('.deleteBtn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                let newArr = [];
                exerciceArray.map((exo) => {
                    if (exo.pic != e.target.dataset.pic) {
                        newArr.push(exo)
                    }
                })
                exerciceArray = newArr;
                page.lobby();
                this.store()
            })
        })
    },

    reboot: function () {
        exerciceArray = basicArray;
        page.lobby();
        this.store();
    },

    store: function () {
        localStorage.exercices = JSON.stringify(exerciceArray); // cette fonction permet de stocker dans le navigateur, a quque fois que l'array évolue il faut stocker : on le met dans les autres fonctions utils
    }
};


const page = {
    lobby: function () {
        let mapArray = exerciceArray
            .map(
                (exo) => //ici on crée les cartes d'exercice
                    `
            <li>
                <div class="card-header"> 
                <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
                <span> min </span>
                </div>
                <img src="./img/${exo.pic}.png">
                <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
                <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
            </li> 
            `
            )
            .join("");

        utils.pageContent( // ici en paramètre on met tout ce qui suit :
            "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
            "<ul>" + mapArray + "</ul>",
            "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>");
        utils.handleEventMinutes();
        utils.handleEventArrow();
        utils.deleteItem();
        reboot.addEventListener('click', () => utils.reboot()) //il reconnait grace au id de reboot
        start.addEventListener('click', ()=>this.routine());
    },

    routine: function () {
        const exercice = new Exercice();
        utils.pageContent("Routine",
            exercice.updateCountdown(),
            null)
    },

    finish: function () {
        utils.pageContent(
            "C'est termine !",
            "<button id='start'> Recommencer </button>",
            "<button id='reboot' class='btn-reboot'>Réinintialiser <i class='fas fa-times-circle'></i></button>"
        );
        reboot.addEventListener("click", () => utils.reboot());
        start.addEventListener("click", () => this.routine());
    }
};

page.lobby();