import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useLocation } from 'react-router-dom';
import '../styles/home.css';

const Search = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || '';
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`http://127.0.0.1:8000/api/food_search/?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setFoods(data.foods);
        })
        .catch((error) => console.error('Error fetching foods:', error));
    }
  }, [query]);

  return (
    <PublicLayout>
      <div className="container py-4">
        <h3 className="text-primary text-center mb-4">
          Results for: "{query}"
        </h3>
        <div className="row mt-4">
          {foods.length === 0 ? (
            <p className="text-center">
              No foods found matching your search. Please try a different
              keyword.
            </p>
          ) : (
            foods.map((food) => (
              <div className="col-md-4 mb-4">
                <div className="card hovereffect">
                  <img
                    src={`http://127.0.0.1:8000${food.image}`}
                    className="card-img-top"
                    style={{
                      height: '180px',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    alt=""
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to="">{food.item_name}</Link>
                    </h5>
                    <p className="card-text text-muted">
                      {food.item_description?.slice(0, 40)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">ETB {food.item_price}</span>
                      {food.is_available ? (
                        <Link
                          to={`/food/${food.id}`}
                          className="btn btn-outline-primary btn-sm ms-2"
                        >
                          <i className="fas fa-shopping-basket me-1"></i>Order
                          Now
                        </Link>
                      ) : (
                        <div title="This item is currently unavailable. Please check back later.">
                          <button
                            to=""
                            className="btn btn-outline-secondary btn-sm ms-2"
                          >
                            <i className="fas fa-times-circle me-1"></i>{' '}
                            Currently Not Available
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Search;
