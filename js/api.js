const API_KEY = '8420ae4ca54e44e983cfc17d80ad5d7c';
let cachedGames = null;


async function fetchAndCacheGames() {
    try {
        const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;
        const response = await axios.get(url);
        cachedGames = response.data.results;
        return cachedGames;
    } catch (error) {
        console.log('Error fetching games:', error);
        return [];
    }
}


function filterGames(games, genre = '', search = '') {
    let filteredGames = games;


    if (genre) {
        filteredGames = filteredGames.filter(game => 
            game.genres.some(g => g.slug === genre)
        );
    }


    if (search) {
        const searchLower = search.toLowerCase();
        filteredGames = filteredGames.filter(game => 
            game.name.toLowerCase().includes(searchLower)
        );


        filteredGames.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const aStarts = aName.startsWith(searchLower);
            const bStarts = bName.startsWith(searchLower);


            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return aName.localeCompare(bName);
        });
    }


    return filteredGames;
}


function displayGames(games) {
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) return;


    gamesGrid.innerHTML = '';


    if (games.length === 0) {
        gamesGrid.innerHTML = '<div class="no-results">No games found</div>';
        return;
    }


    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card animate__animated animate__fadeIn';
        gameCard.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}">
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating}/5</p>
                <p>Released: ${game.released}</p>
            </div>
        `;
        gamesGrid.appendChild(gameCard);
    });
}


async function fetchGames(genre = '', search = '') {
    try {
        const url = `https://api.rawg.io/api/games?key=${API_KEY}${genre ? `&genres=${genre}` : ''}${search ? `&search=${search}` : ''}`;
        
        const response = await axios.get(url);
        let games = response.data.results;


        if (search) {
            const searchLower = search.toLowerCase();
            games = games
                .filter(game => game.name.toLowerCase().includes(searchLower))
                .sort((a, b) => {
                    const aStartsWith = a.name.toLowerCase().startsWith(searchLower);
                    const bStartsWith = b.name.toLowerCase().startsWith(searchLower);
                    return (bStartsWith - aStartsWith);
                });
        }


        displayGames(games);
    } catch (error) {
        console.log('Error fetching games:', error);
        displayGames([]);
    }
}



document.addEventListener('DOMContentLoaded', async () => {
    const gamesContainer = document.querySelector('.games-grid');
    
    if (gamesContainer) {
        const genreFilter = document.getElementById('genreFilter');
        const searchInput = document.getElementById('searchGame');
        
        const savedGenre = localStorage.getItem('genreFilter');
        
        if (savedGenre) {
            genreFilter.value = savedGenre;
            await fetchGames(savedGenre, '');
        } else {
            await fetchGames();
        }

        genreFilter.addEventListener('change', () => {
            const currentGenre = genreFilter.value;
            localStorage.setItem('genreFilter', currentGenre);
            fetchGames(currentGenre, searchInput.value);
        });

        searchInput.addEventListener('input', () => {
            fetchGames(genreFilter.value, searchInput.value);
        });
      }
});