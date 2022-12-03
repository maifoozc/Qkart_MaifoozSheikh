import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  let token = localStorage.getItem("token");

  const performAPICall = async () => {
    setLoading(true);
    try {
      let response = await axios.get(config.endpoint + "/products");

      setData(response.data);

      setLoading(false);

      return response.data;
    } catch (err) {
      if (err.response.status === 500) {
        enqueueSnackbar(err.response.data.message, {
          autoHideDuration: 3000,
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          {
            autoHideDuration: 3000,
            variant: "error",
          }
        );
      }
      setLoading(false);
      return null;
    }
  };
  useEffect(() => {
    performAPICall();
  }, []);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    let searchValue = text;
    console.log(searchValue);
    await axios
      .get(`${config.endpoint}` + "/products/search?value=" + searchValue)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log(err);
          setData([]);
        } else {
          console.log(err);
          setData([]);
        }
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (debounceTimeout) => {
    let sec = debounceTimeout;
    let timer;
    return (event) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await performSearch(event.target.value);
      }, sec);
    };
  };

  const [cartItem, setCartItem] = useState();

  const fetchCart = async (token) => {
    if (!token) {
      return;
    }
    try {
      let response = await axios.get(config.endpoint + "/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      console.log(e);
    }
  };
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    fetchCart(token)
      .then((e) => {
        return generateCartItemsFrom(e, data);
      })
      .then((res) => {
      
        return setCartData(res);
      });
  }, [data]);

  // cart handle

  const isItemInCart = (productId) => {
    let match = cartData.find((e) => {
      if (e._id === productId) {
        return true;
      }
    });
    if (match) {
      return true;
    } else {
      return false;
    }
  };

  const addToCart = async (productId) => {
    console.log("add to cart is pressed");

    if (!localStorage.getItem("token")) {
      enqueueSnackbar("Login to add an item to the Cart", {
        autoHideDuration: 3000,
        variant: "error",
      });
    }
    isItemInCart(productId);
    if (isItemInCart(productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          autoHideDuration: 3000,
          variant: "warning",
        }
      );
    } else {
     
      let response = await axios.post(
        config.endpoint + "/cart",
        { productId: productId, qty: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      let a = generateCartItemsFrom(response.data, data);
      setCartData(a);
      await fetchCart(localStorage.getItem("token"));
    }
  };
  const addProduct = async (productId, quantity) => {
    console.log("addProduct used");

    let token = localStorage.getItem("token");

    let response = await axios.post(
      config.endpoint + "/cart",
      { productId: productId, qty: quantity + 1 },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    let a = generateCartItemsFrom(response.data, data);
 

    setCartData(a);
    await fetchCart(localStorage.getItem("token"));
  };

  const removeProduct = async (productId, quantity) => {
    console.log("removeProduct used");
    let response = await axios.post(
      config.endpoint + "/cart",
      { productId: productId, qty: quantity - 1 },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let a = generateCartItemsFrom(response.data, data);
   
    setCartData(a);
    await fetchCart(localStorage.getItem("token"));
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          variant="outlined"
          placeholder="Search for items/categories"
          name="search"
          onChange={debounceSearch(500)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e) => {
          debounceSearch(performSearch(e.target.value), 500);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item className="product-grid" md={token ? 9 : 12} sm={12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          <Box>
            {loading ? (
              <Box className="loading">
                {" "}
                <CircularProgress /> <h4>Loading Products</h4>
              </Box>
            ) : (
              <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
                {data.length ? (
                  data.map((e) => (
                    <Grid item xs={6} md={3} key={e._id}>
                      <ProductCard product={e} handleAddToCart={addToCart} />
                    </Grid>
                  ))
                ) : (
                  <Box className="loading">
                    {<SentimentDissatisfied color="action" />}{" "}
                    <h4 style={{ color: "#636363" }}>No Products Found</h4>
                  </Box>
                )}
              </Grid>
            )}
          </Box>
        </Grid>

        {token ? (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart
              products={data}
              items={cartData}
              addProduct={addProduct}
              removeProduct={removeProduct}
              isReadOnly= {false}
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
