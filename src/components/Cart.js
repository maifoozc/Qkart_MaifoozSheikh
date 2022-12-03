import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import config from "../App";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

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

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) {
    return;
  }

  let cartDetails = cartData.map((e) => {
    let abacus = productsData.find((res) => {
      return e.productId === res._id;
    });
    return { ...abacus, qty: e.qty };
  });
  console.log(cartDetails);
  return cartDetails;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let eachQty = [];
  let totalValue = items.map((e) => {
    return eachQty.push(e.qty * e.cost);
  });
  let sum = eachQty.reduce((a, b) => a + b, 0);

  return sum;
};

export const totalNumberOfProducts = (items) => {
  let quantity = 0;
  items.forEach((e) => {
    quantity += parseInt(e.qty);
  });
  return quantity;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */

const ItemQuantity = ({ value, handleAdd, handleDelete, pro_id, readOnly }) => {
  if (readOnly === true) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        size="small"
        color="primary"
        onClick={() => {
          handleDelete(pro_id, value);
        }}
      >
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton
        size="small"
        color="primary"
        onClick={() => {
          handleAdd(pro_id, value);
        }}
      >
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

let isReadOnly;

const Cart = ({
  products,
  items = [],
  handleQuantity,
  addProduct,
  removeProduct,
  isReadOnly,
}) => {
  const history = useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {/* //cart */}

        {items.map((event) => {
          return (
            <Box key={event._id}>
              <Box display="flex" alignItems="flex-start" padding="1rem">
                <Box className="image-container">
                  <img
                    // Add product image
                    src={event.image}
                    // Add product name as alt eext
                    alt={event.name}
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{event.name}</div>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <ItemQuantity
                      // Add required props by checking implementation
                      value={event.qty}
                      pro_id={event._id}
                      handleAdd={addProduct}
                      handleDelete={removeProduct}
                      readOnly={isReadOnly}
                    />
                    <Box padding="0.5rem" fontWeight="700">
                      ${event.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        {/* cart */}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
      </Box>

      {isReadOnly ? (
        
        <Box className="cart">
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            color="#3C3C3C"
            fontSize={"18px"}
            fontWeight={"bold"}
            alignSelf="center"
          >
            Order details
          </Box>
        </Box>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            Products
          </Box>
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            {totalNumberOfProducts(items)}
          </Box>
        </Box>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            Subtotal
          </Box>
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            {getTotalCartValue(items)}
          </Box>
        </Box>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            Shipping Charges
          </Box>
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            0
          </Box>
        </Box>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            color="#3C3C3C"
            fontSize={"22px"}
            fontWeight="bold"
            alignSelf="center"
          >
            Total
          </Box>
          <Box color="#3C3C3C" fontSize={"18px"} alignSelf="center">
            {getTotalCartValue(items)}
          </Box>
        </Box>
      </Box>
      
      
      
      
        ) : (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => {
              history.push("/checkout");
            }}
          >
            Checkout
          </Button>
        </Box>
      )}
    </>
  );
};

export default Cart;
