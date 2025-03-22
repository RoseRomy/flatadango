document.addEventListener('DOMContentLoaded', () => {
    const filmList = document.getElementById('films');
    const title = document.getElementById('title');
    const poster = document.getElementById('poster');
    const description = document.getElementById('description');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyButton = document.getElementById('buy-ticket');

    // Fetch movies from the server
    function fetchMovies() {
        fetch('http://localhost:3000/films')
            .then(response => response.json())
            .then(renderMovies);
    }

    // Render movie list
    function renderMovies(movies) {
        movies.forEach(movie => {
            const li = document.createElement('li');
            li.textContent = movie.title;
            li.addEventListener('click', () => showMovieDetails(movie));
            filmList.appendChild(li);
        });

        // Auto-select the first movie
        if (movies.length > 0) {
            showMovieDetails(movies[0]);
        }
    }

    // Display movie details
    function showMovieDetails(movie) {
        title.textContent = movie.title;
        poster.src = movie.poster;
        description.textContent = movie.description;
        showtime.textContent = movie.showtime;

        const available = movie.capacity - movie.tickets_sold;
        availableTickets.textContent = available;
        buyButton.disabled = available <= 0;

        // Handle ticket purchase
        buyButton.onclick = () => purchaseTicket(movie);
    }

    // Buy a ticket
    function purchaseTicket(movie) {
        if (movie.tickets_sold < movie.capacity) {
            movie.tickets_sold++;
            availableTickets.textContent = movie.capacity - movie.tickets_sold;

            if (movie.tickets_sold >= movie.capacity) {
                buyButton.disabled = true;
            }

            updateTicketCount(movie);
        }
    }

    // Update the server
    function updateTicketCount(movie) {
        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: movie.tickets_sold })
        });
    }

    fetchMovies();
});