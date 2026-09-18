const movieTitle = localStorage.getItem('ticketMovie')
const cinemaName = localStorage.getItem('ticketCinema')
const ticketDate = localStorage.getItem('ticketDate')
const ticketTime = localStorage.getItem('ticketTime')
const seatsData = localStorage.getItem('ticketSeats')
const total = localStorage.getItem('ticketTotal')
const posterUrl = localStorage.getItem('ticketPoster')

document.querySelector('#ticketPoster').src = posterUrl
document.querySelector('#ticketMovieTitle').textContent = movieTitle
document.querySelector('#ticketCinemaName').textContent = cinemaName
document.querySelector('#ticketDateTime').textContent = `${ticketDate} | ${ticketTime}`
document.querySelector('#totalAmountText').textContent = `₹${total}`

const seatsArray =JSON.parse(seatsData)
document.querySelector('#ticketCountText').textContent = `${seatsArray.length} Ticket(s)`

const seatIdsList = seatsArray.map(seat=> seat.seatId).join(',')
document.querySelector('#ticketSeatsList').textContent = seatIdsList

const bookingId = Math.random().toString(36).slice(2, 9).toUpperCase()
document.querySelector('#bookingIdText').textContent = `BOOKING ID: ${bookingId}`

document.querySelector('#qrCodeImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`

const totalNum =Number(total)
const ticketPrice = (totalNum/1.08).toFixed(2)
const convenienceFee =(totalNum-ticketPrice).toFixed(2)
document.querySelector('#ticketPriceLabel').textContent = `Ticket(s) price (${seatsArray.length})`
document.querySelector('#ticketPriceText').textContent = `₹${ticketPrice}`
document.querySelector('#convenienceFeeText').textContent = `₹${convenienceFee}`
