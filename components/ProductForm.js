import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import React from "react";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: assignedProperties
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(assignedProperties || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      //Update Product
      await axios.put("/api/products", { ...data, _id });
    } else {
      //Create Product
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  function setProductProp(name, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[name] = value;
      return newProductProps;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product-name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {categories.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="flex gap-1">
            <div>{p.name}</div>
            <select
              value={productProperties[p.name]}
              onChange={(e) => setProductProp(p.name, e.target.value)}
            >
              {p.values.map((v) => (
                <option value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link}></img>
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="flex items-center h-24">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages}></input>
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      ></input>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
