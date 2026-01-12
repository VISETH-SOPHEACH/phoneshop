<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-14">

      <header class="text-center mb-14">
       
        <p v-if="pixels.length" class="text-gray-500 text-lg">
          {{ pixels.length }} models available
        </p>
      </header>

      <div v-if="loading" class="flex flex-col items-center py-20">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p class="text-gray-500 text-lg">Loading Google products…</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-xl font-semibold">{{ error }}</p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <div
          v-for="product in pixels"
          :key="product.id"
          class="group rounded-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div class="h-60 flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="max-h-52 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div class="p-6 flex flex-col grow">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ product.title }}
            </h3>

            <p class="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
              {{ product.description }}
            </p>

            <div class="mt-auto flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900">
                ${{ product.price }}
              </span>

              <button
                class="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const pixels = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchPixels = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      'https://dummyjson.com/products/category/smartphones'
    );

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    pixels.value = data.products;
  } catch (err) {
    error.value = 'Failed to load products. Please check your connection.';
    console.error('Fetch error:', err);
  } finally {
    loading.value = false;
  }
};


onMounted(fetchPixels);
</script>