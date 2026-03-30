<template>
  <section class="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300 font-semibold">Apple</p>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">iPhone Store</h2>
      </div>
      <p v-if="!loading && filteredIphones.length" class="text-sm text-slate-500 dark:text-slate-400">{{ filteredIphones.length }} models found</p>
    </div>

    <div v-if="loading" class="py-20 flex items-center justify-center">
      <div class="w-11 h-11 border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-300 rounded-full animate-spin"></div>
    </div>

    <p v-else-if="error" class="py-10 text-center text-red-500">{{ error }}</p>

    <div v-else-if="filteredIphones.length" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <article
        v-for="product in filteredIphones"
        :key="product.id"
        class="rounded-2xl border border-blue-100 bg-white/85 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-slate-900/75 dark:border-slate-700"
      >
        <div class="aspect-square flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 p-4">
          <img :src="product.thumbnail" :alt="product.title" class="max-h-full object-contain transition-transform duration-300 hover:scale-105" />
        </div>

        <div class="p-4 flex flex-col min-h-40">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ product.title }}</h3>
          <p class="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{{ product.description }}</p>
          <div class="mt-auto pt-4 flex items-center justify-between gap-2">
            <span class="text-lg font-extrabold text-slate-900 dark:text-slate-100">${{ product.price }}</span>
            <button @click="openDetails(product)" class="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 transition">Details</button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="text-center py-14">
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">No matches found</h3>
      <p class="mt-1 text-slate-500 dark:text-slate-400">No iPhone matches "{{ searchQuery }}"</p>
    </div>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      @click.self="closeDetails"
    >
      <div class="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border-slate-700">
        <button @click="closeDetails" class="ml-auto block text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">x</button>
        <img :src="selectedProduct.thumbnail" :alt="selectedProduct.title" class="h-40 mx-auto object-contain" />
        <h3 class="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{{ selectedProduct.title }}</h3>
        <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">{{ selectedProduct.description }}</p>
        <div class="mt-5 flex items-center justify-between">
          <span class="text-2xl font-extrabold text-blue-600 dark:text-blue-300">${{ selectedProduct.price }}</span>
          <div class="flex gap-2">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Buy</button>
            <button class="bg-slate-100 text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold dark:bg-slate-800 dark:text-slate-100">Add</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, defineProps } from "vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

const iphones = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);

const filteredIphones = computed(() => {
  if (!props.searchQuery) {
    return iphones.value;
  }
  const query = props.searchQuery.toLowerCase().trim();
  return iphones.value.filter((phone) => {
    return (
      phone.title.toLowerCase().includes(query) ||
      phone.description.toLowerCase().includes(query)
    );
  });
});

const fetchIphones = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      "https://dummyjson.com/products/search?q=iPhone",
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
