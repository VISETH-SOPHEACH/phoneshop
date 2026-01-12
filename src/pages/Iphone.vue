<template>
  <div class="max-w-7xl mx-auto px-5 py-10 bg-gray-50 min-h-screen">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">iPhone Product List</h1>
      <p v-if="iphones.length" class="text-gray-600">{{ iphones.length }} models found</p>
    </header>

    <div v-if="loading" class="text-center py-12">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>
      <p class="text-gray-600">Fetching latest iPhones...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 text-lg">{{ error }}</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
        v-for="product in iphones"
        :key="product.id"
        class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
      >
        <div class="bg-white p-5 h-56 flex items-center justify-center">
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="max-w-full max-h-full object-contain"
          />
        </div>
        <div class="p-5 flex flex-col grow">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ product.title }}
          </h3>
          <p class="text-sm text-gray-500 mb-4 leading-relaxed">
            {{ product.description }}
          </p>
          <div class="text-2xl font-bold text-gray-900 mt-auto mb-4">
            ${{ product.price }}
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const iphones = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchIphones = async () => {
  try {
    loading.value = true;
    const response = await fetch('https://dummyjson.com/products/search?q=iPhone');
    
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    iphones.value = data.products;
  } catch (err) {
    error.value = "Failed to load products. Please check your connection.";
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchIphones);
</script>