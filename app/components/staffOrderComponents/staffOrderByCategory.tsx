"use client";

import ButtonAction from "@/app/components_global/buttons/ButtonAction";
import { useState, useEffect } from "react";

const getProducts = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/product", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/category", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

export default function StaffOrderByCategory(props: any) {
  const [category, SetCategory] = useState("");
  const [allCategories, SetAllCategories] = useState([]);
  const [products, SetProducts] = useState([]);
  const [payload, SetPayload] = useState({
    productName: "",
    productAmmount: 0,
    size: "",
    Toppings: [String],
    Price: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      SetAllCategories(data.category);
      console.log(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      let filteredData;

      if (category === "") {
        // If category is empty, render all products
        filteredData = data.product;
      } else {
        // If category is not empty, filter products based on category
        filteredData = data.product.filter(
          (product: any) => product.category == category
        );
      }

      // console.log("Fetched data:", filteredData);
      SetProducts(filteredData);
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    // Use the useEffect hook to trigger the callback when payload changes
    props.onClick(payload);
  }, [payload, props]);

  return (
    <>
      <h1 className="text-white text-xl -mb-4">
        {category == "" ? <p>All Categories</p> : category}
      </h1>
      <div className="flex flex-col w-full gap-4">
        {/* List Categories */}
        <div className=" flex gap-8 mt-8 w-full justify-arround bg-[#141414] py-4 border-white border-y-2">
          <ButtonAction
            className="min-w-[150px]"
            onClick={(e) => SetCategory("")}
          >
            All Products
          </ButtonAction>
          {allCategories.map((t: any) => (
            <ButtonAction
              key={t._id}
              className="min-w-[150px]"
              onClick={(e) => SetCategory(t.category)}
            >
              {t.category}
            </ButtonAction>
          ))}
        </div>

        {/* List products */}
        <div className="flex w-full justify-start items-start">
          <div className=" flex gap-4 row-gap-4 justify-start bg-[#141414] w-full h-56 flex-wrap overflow-y-scroll p-4 rounded-xl border-white border-2 overflow-x-clip items-start align-content-start">
            {products.map((t: any) => (
              <ButtonAction
                key={t._id}
                className=" min-w-[150px] h-fit"
                onClick={() => {
                  SetPayload({
                    productName: t.name,
                    productAmmount: 1,
                    size: "",
                    Toppings: t.toppings,
                    Price: t.price,
                  });
                  props.onClick(payload);
                  console.log("Cat:" + payload);
                }}
              >
                {t.name}
              </ButtonAction>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
