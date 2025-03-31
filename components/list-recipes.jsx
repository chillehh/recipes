"use client";

import React, { useState, useEffect } from "react";
import RecipeContentLoader from "./content-loader";
import RecipeCard from "./recipe-card";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ListRecipes = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const { data, error } = useSWR(
    `/api/recipes?page=${page}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setPageCount(data.pagination.pageCount);
    }
  }, [data]);

  function handlePrevious() {
    setPage((p) => {
      if (p === 1) return p;
      return p - 1;
    });
  }

  function handleNext() {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (!data || data.items <= 0 ? <RecipeContentLoader/> :
    <div style={{ overflowY: "auto", height: "100vh" }}>
      {data.items.map((item) => (
        <RecipeCard key={item._id} recipe={item} />
      ))}
    </div>
  );
};

export default ListRecipes;