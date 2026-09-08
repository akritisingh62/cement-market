const API_URL = "http://localhost:5000/api/products";

let products = [];

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Products API failed");
        }

        const data = await response.json();

        products = data.products || [];

        console.log("Cement Mall products:", products);

        return products;

    } catch (error) {
        console.error("Backend connection error:", error);

        products = [];

        return [];
    }
}


function getProductById(id) {
    return products.find(
        product => product.id === Number(id)
    );
}


function getProductsByCategory(category) {

    if (category === "All") {
        return products;
    }

    return products.filter(
        product =>
            product.category.toLowerCase() ===
            category.toLowerCase()
    );
}


function getProductsByBrand(brand) {

    return products.filter(
        product =>
            product.brand.toLowerCase() ===
            brand.toLowerCase()
    );
}