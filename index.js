let api="http://localhost:3000"
async function signup(event){
    event.preventDefault()
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirmpassword = document.querySelector("#confirm-password").value;
  const contact = document.querySelector("#contact").value;

  if (!name.trim()) {
    alert("Please enter your name");
    return;
  }

  if (!email.trim()) {
    alert("Please enter your email");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter correct format of email");
    return;
  }

  if (!password.trim()) {
    alert("Please generate password");
    return;
  }

  if (password.length < 8 || password.length >= 16) {
    alert("Required min character 8 and max 16");
    return;
  }

  if (!/[!@#$%^&*()]/.test(password)) {
    alert("Special character required");
    return;
  }

  if (!confirmpassword.trim()) {
    alert("Please confirm your password");
    return;
  }

  if (password !== confirmpassword) {
    alert("Confirm password does not match the password");
    return;
  }

  if (!contact.trim()) {
    alert("Please enter contact number");
    return;
  }

  if (isNaN(contact)) {
    alert("Only numbers are allowed in contact");
    return;
  }

  if (contact.length !== 10) {
    alert("Contact number must contain 10 numbers");
    return;
  }

//   check whether email already exists
const resemail = await fetch(`${api}/users?email=${email}`);
const dataemail = await resemail.json();

if(dataemail.length>0){
    alert("User already exists")
    return;
}

// create new user
try{
    const res=await fetch(`${api}/users`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:name,
            email:email,
            password:password,
            contact:contact,
        }),
    })

    alert("User added successfully")
    const data= await res.json()
    localStorage.setItem('Loggedinuser',JSON.stringify(data))
    window.location.href='index.html'
}
catch(err){
    console.log("Fetch error:",err);
    alert("Something went wrong:"+err.message)
    
}
   
}

// login

async function login(){
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if(!email.trim()){
        alert("Please enter your email");
        return;
    }

    if(!email.includes("@")){
        alert("Please enter correct format of email");
        return;
    }

    if(!password.trim()){
        alert("Please enter password");
        return;
    }

    if(password.length < 8 || password.length > 16){
        alert("Required min character 8 and max 16");
        return;
    }

    if(!/[!@#$%^&*()]/.test(password)){
        alert("Special character required");
        return;
    }

    try{
        const res = await fetch(`${api}/users?email=${email}`);
        const data = await res.json();

        if(!data || data.length === 0){
            alert("User email not found");
            return;
        }

        const realdata = data[0];

        if(email !== realdata.email){
            alert("User email not found");
            return;
        }

        if(password !== realdata.password){
            alert("Password not matched");
            return;
        }

        // sirf yahan tak pahunche to hi login successful
        localStorage.setItem('Loggedinuser',JSON.stringify(realdata))
        window.location.href = 'index.html';

    }catch(err){
        alert("Something went wrong, please try again");
        console.error(err);
    }
}


// sigin button ko name se replace krna

window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('Loggedinuser'));
    const signinBtn = document.querySelector('.signin-btn');

    if(!signinBtn) return;

    if(user){
        signinBtn.textContent = user.name;

        signinBtn.addEventListener('click', () => {
            const confirmLogout = confirm("Do you want to logout?");
            if(confirmLogout){
                localStorage.removeItem('Loggedinuser');
                window.location.reload();
            }
        });
    }
});

// movie cards dynamic
async function loadMovies(){
  const movieGrid= document.querySelector('#movieGrid')
  if(!movieGrid) return;

  try{
    const res =await fetch(`${api}/movies`)
    const movies=await res.json()

    movies.forEach(movie => {
      const cardHTML= `
         
        <div class="movie-card" data-id="${movie.id}">
                    <div class="poster-wrap">
                        <img src="${movie.poster}" alt="${movie.title}">
                        <div class="badge">${movie.badgeValue}</div>
                    </div>
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-genre">${movie.genre}</p>
                </div>
      
      `
      movieGrid.insertAdjacentHTML('beforeend',cardHTML)
    }) 

    const allcards= document.querySelectorAll('.movie-card')
    allcards.forEach(card => {
      card.addEventListener('click',()=>{
        const movieId = card.getAttribute('data-id')
        window.location.href=`movie-details.html?id=${movieId}`
      })
    })
    
  }
  catch(err){
    console.log("Movies does not load",err)
  }
}

//comdeyy cards

async function loadEvents(){
  const eventsGrid =document.querySelector('#eventsGrid')
  try{
    const res = await fetch(`${api}/events`)
    const events = await res.json()

    events.forEach((event)=>{
      const eventCardHTML = `
                <div class="event-card" data-id="${event.id}">
                    <img src="${event.image}" alt="${event.title}">
                    <div class="event-overlay"></div>
                    <div class="event-text">
                        <h3>${event.title}</h3>
                        <p>${event.eventCount}</p>
                    </div>
                </div>
            `
            eventsGrid.insertAdjacentHTML('beforeend', eventCardHTML)
    })
  }catch(err){
    console.log(err)
  }
}
loadMovies()
loadEvents()