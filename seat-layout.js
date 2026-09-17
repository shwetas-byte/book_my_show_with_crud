// ---------- URL se params nikalo ----------
const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get('id')
const cinemaId = urlParams.get('cinemaId')
let showTime = urlParams.get('time')
const dayIndex = Number(urlParams.get('dayIndex'))

// ---------- Global state ----------
let maxSeats = 0
let selectedSeats = []
let cinemaData = null

// ---------- Date formatting ----------
const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function getFormattedDate(index){
    const d = new Date()
    d.setDate(d.getDate() + index)
    const dayName = dayNames[d.getDay()]
    const dateNum = d.getDate()
    const monthName = monthNames[d.getMonth()]
    const year = d.getFullYear()
    return `${dayName}, ${dateNum} ${monthName}, ${year}`
}

// ---------- Seat layout blueprint ----------
function getBlueprint(categoryType){
    const type = categoryType.toLowerCase()

    if(type.includes('recliner')) return { rows: 1, seatsPerRow: 8 }
    if(type.includes('platinum') || type.includes('executive xl')) return { rows: 2, seatsPerRow: 12 }
    if(type.includes('gold') || type.includes('executive')) return { rows: 3, seatsPerRow: 14 }
    return { rows: 4, seatsPerRow: 16 }
}

let rowLetterCode = 65

function getNextRowLetter(){
    const letter = String.fromCharCode(rowLetterCode)
    rowLetterCode++
    return letter
}

// ---------- Toast notification ----------
function showToast(message){
    const toast = document.querySelector('#toastMessage')
    toast.textContent = message
    toast.classList.add('show')

    setTimeout(() => {
        toast.classList.remove('show')
    }, 2500)
}

// ---------- Main loader ----------
async function loadSeatLayout(){
    const seatMapContainer = document.querySelector('#seatMapContainer')

    try{
        const movieRes = await fetch(`${api}/movies/${movieId}`)
        const movie = await movieRes.json()

        const cinemaRes = await fetch(`${api}/cinemas/${cinemaId}`)
        cinemaData = await cinemaRes.json()

        document.querySelector('#movieTitleHeader').textContent = movie.title
        updateHeaderInfo()

        buildSeatCountModal()
        renderTimePills()
        buildSeatMap()

    }catch(err){
        seatMapContainer.innerHTML = `<p class="loading-text">Something went wrong loading the seat layout.</p>`
        console.log(err)
    }
}

// ---------- Header info (cinema | full date | time) ----------
function updateHeaderInfo(){
    const showInfoHeader = document.querySelector('#showInfoHeader')
    showInfoHeader.textContent = `${cinemaData.name} | ${getFormattedDate(dayIndex)} | ${showTime}`
}

// ---------- Time Pills ----------
function renderTimePills(){
    const timePills = document.querySelector('#timePills')
    timePills.innerHTML = ''

    const showsForDay = cinemaData.showtimesByDay[dayIndex]

    showsForDay.forEach((show) => {
        const isActive = show.time === showTime
        const pillHTML = `<button class="time-pill ${isActive ? 'active' : ''}" data-time="${show.time}">${show.time}</button>`
        timePills.insertAdjacentHTML('beforeend', pillHTML)
    })

    document.querySelectorAll('.time-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
            showTime = pill.getAttribute('data-time')

            document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'))
            pill.classList.add('active')

            updateHeaderInfo()

            // time badalne par seats reset karo aur map dobara banao
            selectedSeats = []
            rowLetterCode = 65
            buildSeatMap()
            updateProceedFooter()
        })
    })
}

// ---------- "How many seats?" modal ----------
function buildSeatCountModal(){
    const seatCountRow = document.querySelector('#seatCountRow')
    const categoryPriceList = document.querySelector('#categoryPriceList')
    const selectSeatsBtn = document.querySelector('#selectSeatsBtn')

    seatCountRow.innerHTML = ''
    categoryPriceList.innerHTML = ''

    for(let i = 1; i <= 10; i++){
        const btn = document.createElement('button')
        btn.className = 'count-btn'
        btn.textContent = i
        btn.addEventListener('click', () => {
            document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            maxSeats = i
            selectSeatsBtn.disabled = false
        })
        seatCountRow.appendChild(btn)
    }

    cinemaData.seatPricing.forEach((seat) => {
        categoryPriceList.insertAdjacentHTML('beforeend', `
            <div class="category-price-item">
                <div class="cat-name">${seat.type}</div>
                <div class="cat-price">₹${seat.price}</div>
                <div class="cat-status">AVAILABLE</div>
            </div>
        `)
    })

    selectSeatsBtn.addEventListener('click', () => {
        document.querySelector('#seatCountModal').style.display = 'none'
        document.querySelector('#ticketBadge').style.display = 'flex'
        document.querySelector('#ticketCount').textContent = maxSeats
    })

    // edit icon click -> modal dobara kholo
    document.querySelector('#editTicketsBtn').addEventListener('click', () => {
        selectedSeats = []
        rowLetterCode = 65
        buildSeatMap()
        updateProceedFooter()

        document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'))
        selectSeatsBtn.disabled = true

        document.querySelector('#seatCountModal').style.display = 'flex'
    })
}

// ---------- Seat-map generate karna ----------
function buildSeatMap(){
    const seatMapContainer = document.querySelector('#seatMapContainer')
    seatMapContainer.innerHTML = ''
    rowLetterCode = 65

    cinemaData.seatPricing.forEach((category) => {
        const blueprint = getBlueprint(category.type)

        let categoryHTML = `
            <div class="category-block">
                <div class="category-heading">₹${category.price} ${category.type.toUpperCase()}</div>
        `

        for(let r = 0; r < blueprint.rows; r++){
            const rowLetter = getNextRowLetter()

            categoryHTML += `<div class="seat-row"><span class="row-label">${rowLetter}</span>`

            for(let s = 1; s <= blueprint.seatsPerRow; s++){
                const seatId = `${rowLetter}${s}`
                const isSold = Math.random() < 0.08

                categoryHTML += `
                    <button
                        class="seat-btn ${isSold ? 'sold' : 'available'}"
                        data-seat-id="${seatId}"
                        data-price="${category.price}"
                        ${isSold ? 'disabled' : ''}
                    >${s}</button>
                `

                if(s === Math.floor(blueprint.seatsPerRow / 2)){
                    categoryHTML += `<span class="seat-gap"></span>`
                }
            }

            categoryHTML += `</div>`
        }

        categoryHTML += `</div>`
        seatMapContainer.insertAdjacentHTML('beforeend', categoryHTML)
    })

    seatMapContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('seat-btn') && !e.target.classList.contains('sold')){
            handleSeatClick(e.target)
        }
    })
}

// ---------- Seat click hone par ----------
function handleSeatClick(seatEl){
    const seatId = seatEl.getAttribute('data-seat-id')
    const price = Number(seatEl.getAttribute('data-price'))

    const alreadySelectedIndex = selectedSeats.findIndex(s => s.seatId === seatId)

    if(alreadySelectedIndex !== -1){
        selectedSeats.splice(alreadySelectedIndex, 1)
        seatEl.classList.remove('selected')
        seatEl.classList.add('available')
    } else {
        if(selectedSeats.length >= maxSeats){
            showToast(`You can select only ${maxSeats} seats`)
            return
        }
        selectedSeats.push({ seatId, price })
        seatEl.classList.remove('available')
        seatEl.classList.add('selected')
    }

    updateProceedFooter()
}

// ---------- Footer update karna ----------
function updateProceedFooter(){
    const proceedFooter = document.querySelector('#proceedFooter')
    const footerSeatCount = document.querySelector('#footerSeatCount')
    const footerTotalPrice = document.querySelector('#footerTotalPrice')

    if(selectedSeats.length === 0){
        proceedFooter.style.display = 'none'
        return
    }

    proceedFooter.style.display = 'flex'
    footerSeatCount.textContent = selectedSeats.length

    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    footerTotalPrice.textContent = `₹${total}`
}

// ---------- Proceed button ----------
document.addEventListener('DOMContentLoaded', () => {
    const proceedBtn = document.querySelector('#proceedBtn')
    proceedBtn.addEventListener('click', () => {
        const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
        const seatList = selectedSeats.map(s => s.seatId).join(', ')
        alert(`Booking Confirmed!\nSeats: ${seatList}\nTotal: ₹${total}`)
    })
})

loadSeatLayout()