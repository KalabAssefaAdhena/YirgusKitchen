import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/home.css';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('relavance');
  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 4;

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/foods/')
      .then((response) => response.json())
      .then((data) => {
        setFoods(data.foods);
        setFilteredFoods(data.foods);
      });

    fetch('http://127.0.0.1:8000/api/categories/')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(search, selectedCategory);
  };

  const sortFoods = (list, sortValue) => {
    const sorted = [...list];
    switch (sortValue) {
      case 'priceLowHigh':
        sorted.sort((a, b) => a.item_price - b.item_price);
        break;
      case 'priceHighLow':
        sorted.sort((a, b) => b.item_price - a.item_price);
        break;
      case 'nameAZ':
        sorted.sort((a, b) => a.item_name.localeCompare(b.item_name));
        break;
      case 'nameZA':
        sorted.sort((a, b) => b.item_name.localeCompare(a.item_name));
        break;
      default:
        //keep backend order for 'relavance'
        break;
    }
    return sorted;
  };
  const applyFilters = (
    searched,
    selected,
    priceMin,
    priceMax,
    sortOverride,
  ) => {
    let result = foods;
    const min = typeof priceMin === 'number' ? priceMin : minPrice;
    const max = typeof priceMax === 'number' ? priceMax : maxPrice;
    const sortValue = sortOverride || sortBy;
    if (searched) {
      result = result.filter((food) =>
        food.item_name.toLowerCase().includes(searched.toLowerCase()),
      );
    }
    if (selected !== 'All') {
      result = result.filter((food) => food.category_name === selected);
    }

    result = result.filter(
      (food) => food.item_price >= min && food.item_price <= max,
    );

    result = sortFoods(result, sortValue);

    setFilteredFoods(result);
    setCurrentPage(1);
  };

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;

  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  const paginate = (page) => setCurrentPage(page);

  const handleMinPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setMinPrice(value);
    applyFilters(search, selectedCategory, value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setMaxPrice(value);
    applyFilters(search, selectedCategory, minPrice, value);
  };
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    applyFilters(search, selectedCategory, minPrice, maxPrice, value);
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    applyFilters(search, value, minPrice, maxPrice);
  };

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="text-center mb-4">Find Your Delicious Food Her...</h2>
        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search your favourite food"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="All">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card mb-3 border-3 shadow-sm">
          <div className="card-body py-2">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small mb-1">Sort</label>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Relevance</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A to Z</option>
                  <option value="nameZA">Name: Z to A</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small mb-1">Min Price</label>
                <input
                  className="form-control form-control-sm"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  type="number"
                  min={0}
                  max={maxPrice - 1}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small mb-1">Max Price</label>
                <input
                  className="form-control form-control-sm"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  type="number"
                  min={minPrice + 1}
                  max={500}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-12">
            <label className="form-label fw-bold my-2">
              Filter by Price: ETB {minPrice} - {maxPrice}
            </label>
            <Slider
              range
              min={0}
              max={500}
              value={[minPrice, maxPrice]}
              onChange={(value) => {
                const [min, max] = value;
                setMinPrice(min);
                setMaxPrice(max);
                applyFilters(search, selectedCategory, min, max);
              }}
            ></Slider>
            <button
              className="btn btn-outline-secondary btn-sm w-100 mt-3"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setMinPrice(0);
                setMaxPrice(500);
                setSortBy('relevance');
                setCurrentPage(1);
                setFilteredFoods(foods);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="row mt-4">
          {currentFoods.length === 0 ? (
            <p className="text-center">No foods found matching your search.</p>
          ) : (
            currentFoods.map((food) => (
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
                      <Link to={`/food/${food.id}`}>{food.item_name}</Link>
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
        {totalPages > 1 && (
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination ">
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className="page-link" onClick={() => paginate(1)}>
                  First
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                >
                  Prev
                </button>
              </li>
              <li className="page-item disabled">
                <button className="page-link">
                  Page {currentPage} of {totalPages}
                </button>
              </li>
              <li
                className={`page-item ${currentPage === totalPages && 'disabled'}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </button>
              </li>
              <li
                className={`page-item ${currentPage === totalPages && 'disabled'}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(totalPages)}
                >
                  Last
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </PublicLayout>
  );
};

export default FoodList;
