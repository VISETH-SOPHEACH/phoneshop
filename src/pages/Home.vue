<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-1">
      <nav class="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md">
        <div
          class="max-w-7xl mx-auto py-3 flex justify-center items-center"
        >
          <h1
            class="text-3xl text-center font-extrabold tracking-tight text-blue-600"
          >
            Home <span class="text-gray-400 font-light">Page</span>
          </h1>
        </div>

        <p v-if="pixels.length" class="text-center pb-2.5 text-gray-500 text-lg">
          {{ pixels.length }} models available
        </p>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center py-20">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">Loading home page .... សូមរង់ចាំ</p>
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
          v-for="product in pixels"
          :key="product.id"
          class="group rounded-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div
            class="h-60 flex items-center justify-center bg-linear-to-b from-gray-50 to-white"
          >
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
                @click="openDetails(product)"
                class="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
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
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
        <button
          @click="closeDetails"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 class="text-2xl font-bold text-gray-900 mb-3">
          {{ selectedProduct.title }}
        </h2>

        <img
          :src="selectedProduct.thumbnail"
          class="w-full h-48 object-contain mb-4"
        />

        <p class="text-gray-600 leading-relaxed">
          {{ getDescription(selectedProduct) }}
        </p>

        <div class="mt-6 text-xl font-bold text-blue-600">
          ${{ selectedProduct.price }}
        </div>
      </div>
    </div>
  </div>
  <Iphone />
  <Pixel />
  <Samsung />
  <Accesury />
</template>

<script setup>
import { ref, onMounted } from "vue";
import Iphone from "./Iphone.vue";
import Pixel from "./Pixel.vue";
import Samsung from "./Samsung.vue";
import Accesury from "./Accesury.vue";

const pixels = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);

/* CUSTOM DESCRIPTIONS */
const customDescriptions = {
  "iPhone 9":
    "This Google Pixel smartphone delivers a clean Android experience with excellent camera quality and long-term software support.",
  "iPhone X":
    "A stylish and affordable Pixel phone designed for daily use with strong battery life.",
  "Samsung Universe 9":
    "Built for photography lovers, featuring AI-enhanced night mode and portrait shots.",
  OPPOF19:
    "A premium Pixel device offering fast performance, security updates, and a smooth display.",
};

/* Fetch products from DummyJSON */
const fetchHome = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      "https://dummyjson.com/products/category/smartphones",
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    pixels.value = data.products;
  } catch (err) {
    error.value = "Failed to load products. Please check your connection.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

/* Open/close modal */
const openDetails = (product) => {
  selectedProduct.value = product;
};
const closeDetails = () => {
  selectedProduct.value = null;
};

/* Get description for modal */
const getDescription = (product) => {
  return (
    customDescriptions[product.title] ||
    "This is a sample custom description written by meee, ឡូយអត់ ?."
  );
};

onMounted(fetchHome);
</script>
