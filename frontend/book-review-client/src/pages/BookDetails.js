import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import API from '../api';

function BookDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await API.get(`/books/${id}`);
        setBook(data);
        const reviewData = await API.get(`/reviews/${id}`);
        setReviews(reviewData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    try {
      const { data } = await API.post('/reviews', {
        book: id,
        reviewText,
        rating
      });
      setReviews([...reviews, data]); 
      setReviewText('');
      setRating(5);
      setError('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  if (loading) return <p>Loading book details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>
      <p>Rating: {book.rating} ⭐</p>

      <h2 className="text-2xl font-bold mt-6">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="border p-4 mt-2 rounded">
            <p>{review.reviewText}</p>
            <p>Rating: {review.rating} ⭐</p>
            <p>- {review.user?.name || 'Anonymous'}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      {user ? (
        <form onSubmit={handleReviewSubmit} className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-bold">Submit a Review</h3>
          {error && <p className="text-red-500">{error}</p>}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            placeholder="Write your review here..."
            required
          />
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-3 w-full">
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mt-4 text-gray-600">Log in to leave a review.</p>
      )}
    </div>
  );
}

export default BookDetails;
