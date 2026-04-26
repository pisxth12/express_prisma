import { ProductRepository } from "../repositories/product.repository.js";
import { deleteImage } from "../config/cloudinary.js";
export class ProductService{
    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(page, limit, filters){
        const {data, total} = await this.productRepository.findAllWithFilters(page, limit, filters);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

  async getProductContactLink(slug) {
    const product = await this.productRepository.findBySlug(slug);
    
    if (!product || !product.isActive) {
        throw new Error('Product not available');
    }
    
    const message = `Hi! I'm interested in ${product.name} - $${product.discount_price || product.original_price}` + `\n\n ${process.env.FRONTEND_URL}/products/${product.slug}`; ;
    const telegramLink = `https://t.me/${process.env.TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;

    
    return { link: telegramLink, productName: product.name };
}


    async getProductById(id){
        return await this.productRepository.findById(id);
    }

    async getProductBySlug(slug){
        return await this.productRepository.findBySlug(slug);
    }

    async createProduct(data , imageUrl){
        const productData = {
            ...data,
            original_price: parseFloat(data.original_price),
            discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
            image_url: imageUrl || null
        }
        return await this.productRepository.create(productData);
    }

    async updateProduct(id, data, imageUrl){
        const existingProduct  = await this.productRepository.findById(id);
        if(!existingProduct ) return null;

        if(imageUrl && existingProduct.image_url){
            await this.deleteImage(existingProduct.image_url);
        }

        const productData = { ... data};
        if(data.original_price) productData.original_price = parseFloat(data.original_price);
        if(data.discount_price) productData.discount_price = parseFloat(data.discount_price);
        if(imageUrl !== undefined) productData.image_url = imageUrl;

        return await this.productRepository.update(id, productData);
    }


    async deleteProduct(id){
        const existingProduct  = await this.productRepository.findById(id);
        if(!existingProduct ) return null;

        if(existingProduct.image_url){
            deleteImage(existingProduct.image_url);
        }
         await this.productRepository.delete(id);
        return true;
    }

}