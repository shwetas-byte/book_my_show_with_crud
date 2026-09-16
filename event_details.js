const urlParams = new URLSearchParams(window.location.search)
const eventId = urlParams.get('id')

async function loadEventDetails(){
    const eventDetails = document.querySelector('#eventDetails')

    try{
        const res = await fetch(`${api}/events/${eventId}`)
        const event = await res.json()

        eventDetails.textContent = event.title

    }catch(err){
        console.log(err)
    }
}

loadEventDetails()