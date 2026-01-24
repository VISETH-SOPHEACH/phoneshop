<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-1">
      <nav class="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto py-3 flex justify-center items-center">
          <h1
            class="text-3xl text-center font-extrabold tracking-tight text-blue-600"
          >
            Home <span class="text-gray-400 font-light">Page</span>
          </h1>
        </div>
        <p
          v-if="filteredPixels.length"
          class="text-center pb-2.5 text-gray-500 text-lg"
        >
          {{ filteredPixels.length }} models available
        </p>
      </nav>

      <div v-if="loading" class="flex flex-col items-center py-20">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">Loading home page .... សូមរង់ចាំ</p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <div
          v-for="product in filteredPixels"
          :key="product.id"
          class="group rounded-3xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div
            class="h-60 flex items-center justify-center bg-linear-to-b from-gray-50 to-white"
          >
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="max-h-52 object-contain group-hover:scale-110 transition-transform"
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
              <span class="text-2xl font-bold text-gray-900"
                >${{ product.price }}</span
              >
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

    <div class="space-y-12">
      <Iphone :searchQuery="searchQuery" />
      <SecondHand :searchQuery="searchQuery" />
      <Samsung :searchQuery="searchQuery" />
      <Accesury :searchQuery="searchQuery" />
    </div>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeDetails"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-8 relative">
        <button
          @click="closeDetails"
          class="absolute top-4 right-4 text-gray-400 text-xl"
        >
          ✕
        </button>
        <h2 class="text-2xl font-bold mb-3">{{ selectedProduct.title }}</h2>
        <img
          :src="selectedProduct.thumbnail"
          class="w-full h-48 object-contain mb-4"
        />
        <p class="text-gray-600">{{ getDescription(selectedProduct) }}</p>
        <div class="mt-6 text-xl font-bold text-blue-600">
          ${{ selectedProduct.price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps } from "vue";
import Iphone from "./Iphone.vue";
import SecondHand from "./SecondHand.vue";
import Samsung from "./Samsung.vue";
import Accesury from "./Accesury.vue";

const props = defineProps({
  searchQuery: { type: String, default: "" },
});

const pixels = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);

const filteredPixels = computed(() => {
  if (!props.searchQuery) return pixels.value;
  const q = props.searchQuery.toLowerCase();
  return pixels.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
});

const fetchHome = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      "https://dummyjson.com/products/category/smartphones",
    );
    const data = await response.json();
    pixels.value = data.products;
  } catch (err) {
    error.value = "Error loading products.";
  } finally {
    loading.value = false;
  }
};

const openDetails = (p) => {
  selectedProduct.value = p;
};
const closeDetails = () => {
  selectedProduct.value = null;
};
const getDescription = (p) => p.description || "Custom description here.";

onMounted(fetchHome);
</script>
