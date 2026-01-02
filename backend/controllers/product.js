import Product from "../models/Productmodel.js"
import multer from "multer";


// export async function addProduct(req, res) {
//     try {
//         const newRecord = req.body;
//         newRecord.image = req.file.path.replace(/\\/g, "/");
//         const newProduct = new Product(newRecord);
//         await newProduct.save();
//         return res.status(201).json(newProduct);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }



export async function addProduct(req, res) {
  try {
    const newRecord = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    newRecord.image = `uploads/${req.file.filename}`;

    const newProduct = new Product(newRecord);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}




export async function getProduct(req, res) {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updatedRecord = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        if (!updatedRecord) {
            return res
                .status(400)
                .json({ message: "Updated product schema is required" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedRecord, {
            new: true,
        });
        if (!updatedProduct)
            return res.status(404).json({ message: "Could not update this product" });
        return res
            .status(200)
            .json({ message: "Product Updated", product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "ID not found" });
        }
        return res
            .status(200)
            .json({ message: "Product with id " + id + " successfully deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function checkSlug(req,res){
  try {
    const {slug}=req.params;
    if(!slug){
      res.status(400).json({message:"slug required"});
      return;
    }
    const matchingSlug=await Product.findOne({slug:slug});
    if(matchingSlug)
      return res.status(400).json({message:"Slug already exists. Choose different"})

    if(!matchingSlug)
      return res.status(200).json({message:"slug is available"})
  }
  catch(error){
    return  res.status(500).json({message:error.message});
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};