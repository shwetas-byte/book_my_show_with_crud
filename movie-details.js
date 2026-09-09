// URL se ?id=X nikalo
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function loadMovieDetails(){
  const hero = document.querySelector('#movieHero');
  const aboutSection = document.querySelector('#aboutSection');
  if(!hero) return;

  if(!movieId){
    hero.innerHTML = `<p class="loading-text">Movie not found.</p>`;
    return;
  }

  try{
    const res = await fetch(`${api}/movies/${movieId}`);

    if(!res.ok){
      hero.innerHTML = `<p class="loading-text">Movie not found.</p>`;
      return;
    }

    const movie = await res.json();

    // hero ka background image poster se set karo
    hero.style.backgroundImage = `url('${movie.poster}')`;

    // format tags aur language tags banao
    const formatTags = (movie.formats || []).map(f => `<span class="tag-pill">${f}</span>`).join('');
    const languageText = (movie.languages || []).join(', ');

    hero.innerHTML = `
      <button class="share-btn">&#128257; Share</button>
      <div class="hero-inner">
        <div class="hero-poster">
          <img src="${movie.poster}" alt="${movie.title}">
          <div class="hero-status">${movie.status || 'In cinemas'}</div>
        </div>
        <div class="hero-info">
          <h1 class="hero-title">${movie.title}</h1>

          <div class="rating-pill">
            <span class="star">&#9733;</span>
            <span class="rating-value">${movie.rating || movie.badgeValue}</span>
            <span class="votes">(${movie.votes || ''})</span>
            <button class="rate-now-btn">Rate now</button>
          </div>

          <p class="meta-line">
            ${movie.duration || ''} &bull; ${movie.genre} &bull; ${movie.certification || ''} &bull; ${movie.releaseDate || ''}
          </p>

          <div class="tag-row">
            ${formatTags}
            <span class="tag-pill">${languageText}</span>
          </div>

          <button class="book-btn">Book tickets</button>
        </div>
      </div>
    `;

    if(aboutSection){
      aboutSection.innerHTML = `
        <h2 class="about-title">About the movie</h2>
        <p class="about-text">${movie.description || ''}</p>
      `;
    }

  }catch(err){
    hero.innerHTML = `<p class="loading-text">Something went wrong loading this movie.</p>`;
    console.error(err);
  }
}

loadMovieDetails();