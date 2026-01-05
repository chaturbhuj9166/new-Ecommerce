// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const EditProduct = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_BASEURL}/product/${id}`)
//       .then((res) => setProduct(res.data));
//   }, [id]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

//       <input
//         className="border p-2 w-full mb-3"
//         value={product.name}
//       />

//       <input
//         className="border p-2 w-full mb-3"
//         value={product.price}
//       />

//       <button className="bg-purple-600 text-white px-4 py-2 rounded">
//         Update Product
//       </button>
//     </div>
//   );
// };

// export default EditProduct;
import React from 'react'

const EditProduct = () => {
  return (
    <div>
      <h1>kjndskfjwa</h1>
    </div>
  )
}

export default EditProduct

