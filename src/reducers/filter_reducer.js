import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";
import { formatPrice } from "../utils/helpers";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let maxPrice = action.payload.map((product) => product.price);
    maxPrice = Math.max(...maxPrice);
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: {
        ...state.filters,
        max_price: maxPrice,
        price: maxPrice,
      },
    };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }

  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let temProducts = [...filtered_products];

    if (sort === "price-lowest") {
      temProducts = temProducts.sort((a, b) => {
        return a.price - b.price;
      });
    }
    if (sort === "price-highest") {
      temProducts = temProducts.sort((a, b) => {
        return b.price - a.price;
      });
    }
    if (sort === "name-a") {
      temProducts = temProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === "name-z") {
      temProducts = temProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    return { ...state, filtered_products: temProducts };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return {
      ...state,
      filters: {
        ...state.filters,
        [name]: value,
      },
    };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, category, company, color, price, max_price, shipping } =
      state.filters;

    let tempProducts = [...all_products];
    // text ==========================================
    if (text) {
      tempProducts = tempProducts.filter((product) => {
        return product.name.toLowerCase().startsWith(text);
      });
    }
    // category ==========================================
    if (category !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.category.toLowerCase() === category;
      });
    }
    // company ==========================================
    if (company !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.company.toLowerCase() === company;
      });
    }

    // color ==========================================

    if (color !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.colors.includes(color);
      });
    }

    // price ==========================================
    if (price < max_price) {
      tempProducts = tempProducts.filter((product) => {
        return product.price < price;
      });
    }
    // shipping ==========================================
    if (shipping) {
      tempProducts = tempProducts.filter((product) => {
        return product.shipping === true;
      });
    }
    // ================================================
    // console.log(...tempProducts);
    // let newMaxPrice = tempProducts.map((tempProduct) => tempProduct.price);
    // console.log(newMaxPrice);

    // newMaxPrice = Math.max(...newMaxPrice);
    // console.log(newMaxPrice);

    return {
      ...state,
      filtered_products: tempProducts,
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        company: "all",
        category: "all",
        color: "all",
        // min_price: 0,
        // max_price: 0,
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
