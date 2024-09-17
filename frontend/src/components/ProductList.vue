<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div class="w-1/4 bg-gray-800 text-white p-6">
      <h2 class="text-2xl font-bold mb-6">Product Management</h2>
      <div class="space-y-4">
        <button
          @click="selectedAction = 'add'"
          class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Product
        </button>
        <button
          @click="selectedAction = 'update'"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Product Quantity
        </button>
        <button
          @click="selectedAction = 'increase'"
          class="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Increase Product Quantity
        </button>
        <button
          @click="selectedAction = 'decrease'"
          class="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Decrease Product Quantity
        </button>
        <button
          @click="selectedAction = 'delete'"
          class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Product
        </button>
      </div>
    </div>

    <!-- Table of Product -->
    <div class="w-3/4 p-6">
      <h1 class="text-3xl font-bold mb-6 text-center">Product List</h1>

      <div v-if="loading" class="text-center">
        <p>Loading products...</p>
      </div>

      <div v-if="error" class="text-center text-red-500">
        <p>{{ error }}</p>
      </div>

      <div v-if="products.length > 0" class="overflow-x-auto">
        <table class="table-auto w-full text-left bg-white rounded-lg shadow-md">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Category</th>
              <th class="px-6 py-4">Quantity</th>
              <th class="px-6 py-4">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product._id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ product.name }}</td>
              <td class="px-6 py-4">{{ product.category }}</td>
              <td class="px-6 py-4">{{ product.quantity }}</td>
              <td class="px-6 py-4">{{ product.price.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action -->
      <div v-if="selectedAction" class="mt-8">
        <h2 class="text-2xl mb-4">{{ getActionTitle(selectedAction) }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2"
              >Product Name</label
            >
            <input
              v-model="productData.name"
              type="text"
              id="name"
              class="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <!-- Additional fields depending on action -->
          <div v-if="['add', 'update', 'increase', 'decrease'].includes(selectedAction)">
            <div class="mb-4">
              <label
                for="quantity"
                class="block text-gray-700 font-bold mb-2"
                >Quantity</label
              >
              <input
                v-model="productData.quantity"
                type="number"
                id="quantity"
                class="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div v-if="selectedAction === 'add'">
            <div class="mb-4">
              <label
                for="category"
                class="block text-gray-700 font-bold mb-2"
                >Category</label
              >
              <input
                v-model="productData.category"
                type="text"
                id="category"
                class="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label
                for="price"
                class="block text-gray-700 font-bold mb-2"
                >Price</label
              >
              <input
                v-model="productData.price"
                type="number"
                step="0.01"
                id="price"
                class="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      productData: { name: "", category: "", quantity: 0, price: 0 },
      selectedAction: null,
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    getActionTitle(action) {
      switch (action) {
        case "add":
          return "Add Product";
        case "update":
          return "Update Product Quantity";
        case "increase":
          return "Increase Product Quantity";
        case "decrease":
          return "Decrease Product Quantity";
        case "delete":
          return "Delete Product";
        default:
          return "";
      }
    },
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:5000/api/products/product");
        this.products = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        if (this.selectedAction === "add") {
          await axios.post("http://localhost:5000/api/products/add", this.productData);
        } else if (this.selectedAction === "update") {
          await axios.put("http://localhost:5000/api/products/update", {
            name: this.productData.name,
            quantity: this.productData.quantity,
          });
        } else if (this.selectedAction === "increase") {
          await axios.put("http://localhost:5000/api/products/increase", {
            name: this.productData.name,
            quantityToAdd: this.productData.quantity,
          });
        } else if (this.selectedAction === "decrease") {
          await axios.put("http://localhost:5000/api/products/decrease", {
            name: this.productData.name,
            quantityToSubtract: this.productData.quantity,
          });
        } else if (this.selectedAction === "delete") {
          const productId = this.products.find(p => p.name === this.productData.name)?._id;
          if (productId) {
            await axios.delete(`http://localhost:5000/api/products/delete/${productId}`);
          } else {
            throw new Error('Product not found');
          }
        }
        this.fetchProducts(); // Refresh product list
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
/* Additional styling */
</style>
