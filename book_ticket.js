// url se id 
const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get('id');

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

}
    
}

MovieInfo()