import Layout from "@/components/Layout";
import { useState } from "react";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  return (
    <Layout>
      <h1>New Product</h1>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product-name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
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
      <button className="btn-primary">Save</button>
    </Layout>
  );
}
