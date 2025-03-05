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
  const [editingReview, setEditingReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

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

  const handleReviewEdit = (review) => {
    setEditingReview(review._id);
    setReviewText(review.reviewText);
    setRating(review.rating);
  };

  const handleReviewUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/reviews/${editingReview}`, { reviewText, rating });
      setReviews(reviews.map(review => review._id === editingReview ? { ...review, reviewText, rating } : review));
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) return <p>Loading book details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Rating: {book.rating} ⭐</p>

      <h2 className="text-2xl font-bold mt-6">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="border p-4 mt-2 rounded">
            {editingReview === review._id ? (
              <form onSubmit={handleReviewUpdate}>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required />
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
                <button type="submit">Save</button>
                <button onClick={() => setEditingReview(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <p>{review.reviewText}</p>
                <p>Rating: {review.rating} ⭐</p>
                <p>- {review.user?.name || 'Anonymous'}</p>
                {user && user.id === review.user?._id && (
                  <div>
                    <button onClick={() => handleReviewEdit(review)}>Edit</button>
                    <button onClick={() => handleReviewDelete(review._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}

export default BookDetails;
