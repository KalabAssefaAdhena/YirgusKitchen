import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 2;

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
        setAllCategories(data.categories);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleSearch = (query) => {
    query = query.toLowerCase();
    if (!query) {
      setCategories(allCategories);
      setCurrentPage(1);
      return;
    }
    const filtered = allCategories.filter((cat) =>
      cat.category_name.toLowerCase().includes(query),
    );
    setCategories(filtered);
    setCurrentPage(1);
  };
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category ?')) {
      fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message);
          setCategories(categories.filter((cat) => cat.id !== id));
          setAllCategories(allCategories.filter((cat) => cat.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;

  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory,
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (categories.length === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [categories.length, currentPage, totalPages]);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div>
        <h3 className="text-center text-primary mb-4">
          <i className=" fas fa-list-alt me-1"></i>Manage Food Category
        </h3>
        <h5 className="text-end text-muted">
          {' '}
          <i className="fas fa-database me-1"></i>Total Categories{' '}
          <span className="ms-2 badge bg-success">{categories.length}</span>
        </h5>
        <div className="mb-3 d-flex justify-content-between">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by category name ..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <CSVLink
            data={categories}
            filename="categories.csv"
            className="btn btn-sm btn-outline-success mt-2"
          >
            <i className="fas fa-file-csv me-2"></i>Export to CSV
          </CSVLink>
        </div>
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Category Name</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <tr key={category.id}>
                <td>{indexOfFirstCategory + index + 1}</td>
                <td>{category.category_name}</td>
                <td>{new Date(category.creation_date).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/edit_category/${category.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    <i className="fas fa-edit me-1"></i>Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fas fa-trash-alt me-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => paginate(page)}
                      className="page-link"
                    >
                      {page}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;
