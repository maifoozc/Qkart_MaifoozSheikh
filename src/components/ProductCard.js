import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";

import React, { useEffect } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card sx={{ maxWidth: 345 }} className="card">
      <CardMedia
        component="img"
        height="140"
        src={product.image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product.cost}
        </Typography>
        <Rating aria-label="stars" name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          className="card-button"
          startIcon={<AddShoppingCartOutlined />}
          onClick= {() =>{handleAddToCart(product._id)}}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
