import React, { useEffect, useState } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import BookCard from "../components/Card";
import { useFirebase } from "../context/Firebase";

const HomePage = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    firebase.listAllBooks().then((books) => setBooks(books.docs));
  }, []);

  return (
    <div className="container mt-5">
      {/* Centered Text */}
      <div className="text-center mb-4">
        <h1>Welcome to Our Bookstore!</h1>
        <p className="lead">Discover a world of books – your next adventure awaits!</p>
      </div>

      {/* Centered Image */}
      <div className="text-center mb-5">
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" 
          alt="Bookstore Banner" 
          className="img-fluid" 
          style={{ maxHeight: "400px", borderRadius: "10px" }} 
        />
      </div>

      {/* Book Cards */}
      <CardGroup>
        {books.map((book) => (
          <BookCard
            link={`/book/view/${book.id}`}
            key={book.id}
            id={book.id}
            {...book.data()}
          />
        ))}
      </CardGroup>
    </div>
  );
};

export default HomePage;
