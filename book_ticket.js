// url se id 
const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get('id');
let allCinemas = []
const cinemaList = document.querySelector('#cinemaList')
let currentDateIndex = 0

async function MovieInfo(){
    const movieInfo = document.querySelector('#movieInfoBar');
    
    if(!movieInfo) return;

    if(!movieId){
        movieInfo.innerHTML=`<p class="loading-text"> Movie not found. </p>`
        return;
    }

        try{
            const res = await fetch(`${api}/movies/${movieId}`)

            if(!res.ok){
                movieInfo.innerHTML=`<p class="loading-text"> Movie not found.</p>`;
                return;
            }

            const movie = await res.json()

                movieInfo.innerHTML = `
                    <h1 class="info-title">${movie.title}</h1>
                    <div class="info-tags">
                        <span class="info-pill">${movie.duration}</span>
                        <span class="info-pill">${movie.certification}</span>
                        <span class="info-pill">${movie.genre}</span>
                    </div>
                `;
            

        }
    catch(err){
        movieInfo.innerHTML=`<p class="loading-text"> Something went wrong loading this movie.</p>`
        console.log(err);
        

    }

}


async function DateStrip(){
    const datestrip= document.querySelector('#dateStrip')

    const day= ["SUN","MON",'TUE','WED','THUR','FRI','SAT']
    const month=['JAN','FEB','MAR','APRIL','MAY','JUNE','JULY','AUG','SEP','OCT','NOV','DEC']

    for (let i=0;i<3;i++ ){

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);

    const dayName = day[currentDate.getDay()];
    const dateNum = currentDate.getDate();
    const monthName = month[currentDate.getMonth()];

    console.log(dayName, dateNum, monthName);

    const activeclass = i===0 ? "active" : "";

    const dateBoxHTML =`
        <div class='date-box ${activeclass}' data-index="${i}">
            <div class='day-name'>${dayName}</div>

            <div class='day-num'>${dateNum}</div>

            <div class='month-name'>${monthName}</div>
        </div>
    `
    datestrip.insertAdjacentHTML('beforeend', dateBoxHTML);

    

}

const allDateBoxes = document.querySelectorAll('.date-box')

allDateBoxes.forEach((box)=>{
    box.addEventListener('click',()=>{

        allDateBoxes.forEach((b)=>{
            b.classList.remove('active')
        })

        box.classList.add('active')

        const clickedIndex= Number(box.getAttribute('data-index'))
currentDateIndex=clickedIndex


        renderCinemas(clickedIndex)

    })
})
    
}

async function loadCinemas(){
    try{
        const res =await fetch(`${api}/cinemas`)
        const cinemas= await res.json()
        console.log(cinemas);
        
        allCinemas=cinemas  

        renderCinemas(0)

        
        
    }catch(err){
        console.log(err);
        
    }
}

function renderCinemas(dayIndex){

    const searchBox = document.querySelector('#cinemaSearch')
    const searchText =searchBox.value.toLowerCase()

    const filteredList = allCinemas.filter((cinema)=>{
        return cinema.name.toLowerCase().includes(searchText)
    })

    cinemaList.innerHTML=''

    filteredList.forEach((cinema)=>{
           const cinema_name =cinema.name
           const cinema_status =cinema.cancellation

           const todaysShows = cinema.showtimesByDay[dayIndex]
           const cinemaPricing = cinema.seatPricing

           let showtimeButtonsHTML =''
           let pricingHTML =''

           cinemaPricing.forEach((seat)=>{
            pricingHTML+=`
                <div class='price-row'>
                    <span> ${seat.type} </span>
                    <span> ${seat.price} </span>
                </div>
            `
           })

           todaysShows.forEach((show)=>{
                showtimeButtonsHTML+=`
                    <div class='showtime-wrap'>
                        <button class='showtime-btn ${show.status}'> ${show.time} </button>

                        <div class="price-tooltip">
                            ${pricingHTML}
                        </div>
                    </div>
                `
           })

           

           const cinemaCardHTML=`
                <div class='cinema-card'>
                    <div class='cinema-header'>
                        <div>
                            <div class='cinema-name'> ${cinema_name} </div>

                            <div class='cinema-cancellation'> ${cinema_status} </div>
                        </div>
                    </div>

                    <div class='showtime-row'>
                        ${showtimeButtonsHTML}
                    </div>

                    
                </div>
           `
           cinemaList.insertAdjacentHTML('beforeend', cinemaCardHTML)

        })

}

MovieInfo()
DateStrip()
loadCinemas()
const searchBox=document.querySelector('#cinemaSearch')
searchBox.addEventListener('input',()=>{
    renderCinemas(currentDateIndex)
})