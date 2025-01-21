const fetchFeaturedGames = async () => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&ordering=-rating&page_size=20`);
        return response.data.results.map(({ name, background_image }) => ({
            name,
            image: background_image
        }));
    } catch (error) {
        console.error('Error fetching featured games:', error);
        return [];
    }
}

const initializeSplide = (splideElement) => {
    return new Splide(splideElement, {
        type: 'loop',
        perPage: 3,
        gap: '1rem',
        breakpoints: {
            768: { perPage: 2 },
            480: { perPage: 1 }
        }
    }).mount();
}

const createGameSlide = (game) => `
    <li class="splide__slide">
        <div class="game-card">
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
        </div>
    </li>
`;

const createCategoryCard = (category) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `<h3>${category.name}</h3>`;
    
    card.addEventListener('click', () => {
        localStorage.setItem('genreFilter', category.slug);
        localStorage.setItem('fromCategory', 'true');
        window.location.href = 'games.html';
    });
    
    return card;
}


const handleScroll = () => {
    const scrollBtn = document.getElementById('scrollToTop');
    if (window.pageYOffset > 300) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.pointerEvents = 'auto';
    } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.pointerEvents = 'none';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    Auth.updateNavigation();

    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const scrollBtn = document.getElementById('scrollToTop');
    const splideList = document.querySelector('.splide__list');
    const splideElement = document.querySelector('.splide');
    const categoryGrid = document.querySelector('.category-grid');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    if (scrollBtn) {
        window.addEventListener('scroll', handleScroll);
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    
    if (splideList) {
        const featuredGames = await fetchFeaturedGames();
        splideList.innerHTML = featuredGames.map(createGameSlide).join('');
    }

    if (splideElement) {
        initializeSplide('.splide');
    }

    if (categoryGrid) {
        const categories = [
            { name: 'Action', slug: 'action' },
            { name: 'RPG', slug: 'role-playing' },
            { name: 'Strategy', slug: 'strategy' },
            { name: 'Sports', slug: 'sports' },
            { name: 'Adventure', slug: 'adventure' }
        ];

        categories.forEach(category => {
            categoryGrid.appendChild(createCategoryCard(category));
        });
    }
});
