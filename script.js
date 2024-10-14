// script.js

// Global Variables
let books = [];
let isLibrarianLoggedIn = false;

// Fetch books from the JSON file
function fetchBooks() {
  return fetch('books.json')
    .then(response => response.json())
    .then(data => {
      books = data;
      return books;
    })
    .catch(error => console.error('Error fetching books:', error));
}

// Populate the genre filter dropdown
function populateGenreFilter() {
  const genreFilter = document.getElementById('genre-filter');
  const genres = [...new Set(books.map(book => book.genre))].sort();

  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// Display books on the catalog page
function displayBooks(bookList) {
  const bookListDiv = document.getElementById('book-list');
  bookListDiv.innerHTML = '';

  if (bookList.length === 0) {
    bookListDiv.innerHTML = '<p>No books found.</p>';
    return;
  }

  bookList.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    if (book.cover) {
      const coverImg = document.createElement('img');
      coverImg.src = book.cover;
      coverImg.alt = book.title;
      bookCard.appendChild(coverImg);
    }

    const title = document.createElement('h3');
    title.textContent = book.title;
    bookCard.appendChild(title);

    const author = document.createElement('p');
    author.textContent = `Author: ${book.author}`;
    bookCard.appendChild(author);

    const genre = document.createElement('p');
    genre.textContent = `Genre: ${book.genre}`;
    bookCard.appendChild(genre);

    const availability = document.createElement('p');
    availability.className = 'availability';
    availability.textContent = `Available: ${book.available ? 'Yes' : 'No'}`;
    bookCard.appendChild(availability);

    if (isLibrarianLoggedIn) {
      const editButton = document.createElement('button');
      editButton.className = 'button edit-button';
      editButton.textContent = 'Toggle Availability';
      editButton.addEventListener('click', () => toggleAvailability(book.id));
      bookCard.appendChild(editButton);
    }

    bookListDiv.appendChild(bookCard);
  });
}

// Search and filter functionality
function filterBooks() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedGenre = document.getElementById('genre-filter').value;

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                          book.author.toLowerCase().includes(searchTerm) ||
                          book.genre.toLowerCase().includes(searchTerm);

    const matchesGenre = !selectedGenre || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  displayBooks(filteredBooks);
}

// Librarian Login Functionality
function handleLogin(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;
  const loginError = document.getElementById('login-error');

  // Replace 'librarian' and 'password123' with actual credentials
  if (usernameInput === 'librarian' && passwordInput === 'password123') {
    isLibrarianLoggedIn = true;
    localStorage.setItem('librarianLoggedIn', 'true');
    window.location.href = 'manage.html';
  } else {
    loginError.textContent = 'Incorrect username or password.';
  }
}

// Check librarian login status
function checkLoginStatus() {
  isLibrarianLoggedIn = localStorage.getItem('librarianLoggedIn') === 'true';
}

// Logout Functionality
function handleLogout() {
  isLibrarianLoggedIn = false;
  localStorage.removeItem('librarianLoggedIn');
  window.location.href = 'index.html';
}

// Display books on the manage page
function displayManageBooks() {
  const manageBookListDiv = document.getElementById('manage-book-list');
  manageBookListDiv.innerHTML = '';

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    if (book.cover) {
      const coverImg = document.createElement('img');
      coverImg.src = book.cover;
      coverImg.alt = book.title;
      bookCard.appendChild(coverImg);
    }

    const title = document.createElement('h3');
    title.textContent = book.title;
    bookCard.appendChild(title);

    const author = document.createElement('p');
    author.textContent = `Author: ${book.author}`;
    bookCard.appendChild(author);

    const genre = document.createElement('p');
    genre.textContent = `Genre: ${book.genre}`;
    bookCard.appendChild(genre);

    const availability = document.createElement('p');
    availability.className = 'availability';
    availability.id = `availability-${book.id}`;
    availability.textContent = `Available: ${book.available ? 'Yes' : 'No'}`;
    bookCard.appendChild(availability);

    const editButton = document.createElement('button');
    editButton.className = 'button edit-button';
    editButton.textContent = 'Toggle Availability';
    editButton.addEventListener('click', () => toggleAvailability(book.id));
    bookCard.appendChild(editButton);

    manageBookListDiv.appendChild(bookCard);
  });
}

// Toggle book availability
function toggleAvailability(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.available = !book.available;
    const availabilityElement = document.getElementById(`availability-${bookId}`);
    availabilityElement.textContent = `Available: ${book.available ? 'Yes' : 'No'}`;
    alert(`Book availability updated to: ${book.available ? 'Available' : 'Not Available'}`);
    // Note: Changes are not saved permanently without a backend server.
  }
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;

  if (currentPage.endsWith('catalog.html')) {
    fetchBooks().then(() => {
      populateGenreFilter();
      displayBooks(books);

      document.getElementById('search-input').addEventListener('input', filterBooks);
      document.getElementById('genre-filter').addEventListener('change', filterBooks);
    });
  }

  if (currentPage.endsWith('login.html')) {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
  }

  if (currentPage.endsWith('manage.html')) {
    checkLoginStatus();
    if (!isLibrarianLoggedIn) {
      window.location.href = 'login.html';
    } else {
      fetchBooks().then(() => {
        displayManageBooks();
        document.getElementById('logout-button').addEventListener('click', handleLogout);
      });
    }
  }
});
