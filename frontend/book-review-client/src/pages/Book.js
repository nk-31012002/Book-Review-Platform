import { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await API.get('/books');
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Filter books dynamically
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (authorFilter ? book.author === authorFilter : true) &&
    (ratingFilter ? book.rating >= Number(ratingFilter) : true)
  );

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      {/* Search and Filter UI */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="p-2 border rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="p-2 border rounded" value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
          <option value="">Filter by Author</option>
          {Array.from(new Set(books.map(book => book.author))).map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
        <select className="p-2 border rounded" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="">Filter by Rating</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} Stars & above</option>
          ))}
        </select>
      </div>

      {/* Display Books */}
      <div className="grid grid-cols-3 gap-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Rating: {book.rating} ⭐</p>
              <Link to={`/books/${book._id}`} className="text-blue-500">View Details</Link>
            </div>
          ))
        ) : (
          <p>No books match your filters.</p>
        )}
      </div>
    </div>
  );
}

export default Books;
