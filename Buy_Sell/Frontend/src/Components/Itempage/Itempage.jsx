import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

function Itempage({ item }) {
  const [seller, setSeller] = useState({})
  const [checkitem, setCheckItem] = useState(false)
  function set1(seller) {
    setSeller(seller);
  }

  function set2(status) {
    setCheckItem(status);
  }

  useEffect(() => {
    const getSeller = async () => {
      try {
        let response = await axios.post("http://localhost:4000/api/getseller", { item }, {
          withCredentials: true,
        });
        set1(response.data.Seller);
      } catch (error) {
        throw error;
      }
    };

    getSeller();
  }, []);

  useEffect(() => {
    const checkitem = async () => {
      try {
        let response = await axios.post("http://localhost:4000/api/checkitem", { item }, {
          withCredentials: true,
        });
        set2(response.data.status);
      } catch (error) {
        throw error;
      }
    };

    checkitem();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-full text-2xl  max-w-xl bg-white p-8 rounded-2xl shadow-lg">
          <Link to="#" className="flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
              className="mr-3 h-30 "
              alt="Logo"
            />
          </Link>
          <div className="grid grid-cols-2 gap-4 text-2xl mt-10">
            <div><b>Name:</b></div>
            <div >{item.Name}</div>

            <div ><b>Price (Rs):</b></div>
            <div>{item.Price}/-</div>

            <div ><b>Description:</b></div>
            <div>{item.Description}</div>

            <div><b>Seller:</b></div>
            <div>{seller.FirstName} {seller.LastName}</div>

            <div><b>Contact Number:</b></div>
            <div>{seller.ContactNumber}</div>

            <div><b>Contact Email:</b></div>
            <div className="break-words">{seller.Email}</div>
          </div>
          {!checkitem ?
            (<button
              className=" bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-5"
              onClick={() => {
                const addtocart = async () => {
                  try {
                    let response = await axios.post("http://localhost:4000/api/addtocart", { item }, {
                      withCredentials: true,
                    });

                    if (response.status == 201) {
                      alert('Item added to your Cart.')
                      set2(true)
                    }
                    else {
                      alert('An Error Occured while adding to cart.')
                    }
                  } catch (err) {
                    alert(err.response?.data.error || "An error occurred");
                  }
                };

                addtocart();
              }}
            >Add to Cart
            </button>) : (<button
              className="mt-5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {

                const removefromcart = async () => {
                  const myitem = item
                  try {
                    const response = await axios.post("http://localhost:4000/api/removefromcart", { myitem }, {
                      withCredentials: true,
                    });

                    if (response.status === 201) {
                      alert("Removed from cart.")
                      set2(false)
                    } else {
                      alert("Failed to remove item from Cart.")
                    }
                  } catch (error) {
                    throw error;
                  }
                };

                removefromcart();
              }}
            >
              Remove From Cart
            </button>)
          }
        </div>
      </div>
    </>
  );
}

export default Itempage;