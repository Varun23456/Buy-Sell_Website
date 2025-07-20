import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

function Itempage({ item }) {
  const [seller, setSeller] = useState({})
  const [checkitem, setCheckItem] = useState(false)
  const [loading, setLoading] = useState(true)
  
  function set1(seller) {
    setSeller(seller);
  }

  function set2(status) {
    setCheckItem(status);
  }
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [item]);

  useEffect(() => {
    const getSeller = async () => {
      try {
        let response = await axios.post("http://localhost:4000/api/getseller", { item }, {
          withCredentials: true,
        });
        set1(response.data.Seller);
      } catch (error) {
        console.error("Error fetching seller:", error);
      }
    };

    getSeller();
  }, [item]);

  useEffect(() => {
    const checkitemFunc = async () => {
      try {
        let response = await axios.post("http://localhost:4000/api/checkitem", { item }, {
          withCredentials: true,
        });
        set2(response.data.status);
        setLoading(false);
      } catch (error) {
        console.error("Error checking item:", error);
        setLoading(false);
      }
    };

    checkitemFunc();
  }, [item]);

  const handleAddToCart = async () => {
    try {
      let response = await axios.post("http://localhost:4000/api/addtocart", { item }, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert('Item added to your Cart.')
        set2(true)
      } else {
        alert('An Error Occurred while adding to cart.')
      }
    } catch (err) {
      alert(err.response?.data.error || "An error occurred");
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/removefromcart", { myitem: item }, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Removed from cart.")
        set2(false)
      } else {
        alert("Failed to remove item from Cart.")
      }
    } catch (error) {
      alert("An error occurred while removing from cart.");
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-2 text-center">
            <Link to="#" className="inline-flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                className="h-16 w-auto"
                alt="IIIT Hyderabad Logo"
              />
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image Section */}
              <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                  <div className="aspect-square bg-white rounded-lg shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm">Product Image</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="md:w-1/2 p-6 sm:p-8">
                <div className="h-full flex flex-col">
                  {/* Product Header */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.Name}</h1>
                    <div className="flex items-center mb-6">
                      <span className="text-3xl font-bold text-green-600">₹{item.Price}</span>
                      <span className="text-lg text-gray-500 ml-2">/-</span>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{item.Description}</p>
                    </div>

                    {/* Seller Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Seller Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">Name:</span>
                          <span className="text-gray-600">{seller.FirstName} {seller.LastName}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 w-20">Phone:</span>
                          <a href={`tel:${seller.ContactNumber}`} className="text-blue-600 hover:text-blue-800">
                            {seller.ContactNumber}
                          </a>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-gray-700 w-20">Email:</span>
                          <a href={`mailto:${seller.Email}`} className="text-blue-600 hover:text-blue-800 break-words">
                            {seller.Email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {!checkitem ? (
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                      >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveFromCart}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
                      >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove from Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Card */}
          <div className="mt-4 bg-white rounded-lg shadow-sm p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <svg className="w-8 h-8 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-gray-900">Verified Seller</h4>
              </div>
              <div className="text-center p-4">
                <svg className="w-8 h-8 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h4 className="font-semibold text-gray-900">Direct Contact</h4>
              </div>
              <div className="text-center p-4">
                <svg className="w-8 h-8 mx-auto text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h4 className="font-semibold text-gray-900">Best Prices</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Itempage;