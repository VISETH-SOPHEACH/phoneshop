<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <nav class="sticky top-0 z-10 bg-gray-50">
        <div
          class="max-w-7xl mx-auto px-6 py-5 flex justify-center items-center"
        >
          <h1
            class="text-3xl text-center font-extrabold tracking-tight text-blue-600 dark:text-blue-400"
          >
            iPhone
          </h1>
        </div>
      </nav>

      <!-- Products Count -->
      <p v-if="iphones.length" class="ml-[44%] mb-3 text-gray-500 text-lg">
        {{ iphones.length }} models available
      </p>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center py-20">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">Loading Apple products…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-xl font-semibold">{{ error }}</p>
      </div>

      <!-- Products Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <div
          v-for="product in iphones"
          :key="product.id"
          class="group rounded-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative"
        >
          <!-- Image -->
          <div
            class="h-60 flex items-center justify-center bg-linear-to-b from-gray-50 to-white"
          >
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="max-h-52 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <!-- Content -->
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
                @click="openDetails(product)"
                class="px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl"
      >
        <!-- Close Button -->
        <button
          @click="closeDetails"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <!-- Image -->
        <div class="flex justify-center mb-4">
          <img
            :src="selectedProduct.thumbnail"
            :alt="selectedProduct.title"
            class="h-56 object-contain"
          />
        </div>

        <!-- Info -->
        <h2 class="text-2xl font-bold mb-2">
          {{ selectedProduct.title }}
        </h2>

        <p class="text-gray-600 mb-4">
          {{ selectedProduct.description }}
        </p>

        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold">
            ${{ selectedProduct.price }}
          </span>

          <span class="text-sm text-gray-500">
            Rating: ⭐ {{ selectedProduct.rating }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const iphones = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);

// Fetch iPhones from API
const fetchIphones = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      "https://dummyjson.com/products/search?q=iPhone"
    );

    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    iphones.value = data.products;
  } catch (err) {
    error.value = "Failed to load products. Please check your connection.";
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

const openDetails = (product) => {
  selectedProduct.value = product;
};

const closeDetails = () => {
  selectedProduct.value = null;
};

onMounted(fetchIphones);
</script>