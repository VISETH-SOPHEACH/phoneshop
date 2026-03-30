<template>
  <section class="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300 font-semibold">Galaxy</p>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Samsung Store</h2>
      </div>
      <p v-if="!loading && filteredSamsung.length" class="text-sm text-slate-500 dark:text-slate-400">{{ filteredSamsung.length }} models found</p>
    </div>

    <div v-if="loading" class="py-20 flex flex-col items-center">
      <div class="w-11 h-11 border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-300 rounded-full animate-spin"></div>
      <p class="mt-3 text-slate-500 dark:text-slate-400">Loading products...</p>
    </div>

    <p v-else-if="error" class="py-16 text-center text-red-500">{{ error }}</p>

    <div v-else-if="filteredSamsung.length" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <article
        v-for="item in filteredSamsung"
        :key="item.id"
        class="rounded-2xl border border-blue-100 bg-white/85 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-slate-900/75 dark:border-slate-700"
      >
        <div class="h-44 sm:h-52 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 p-4">
          <img :src="item.thumbnail" :alt="item.title" class="max-h-full object-contain transition-transform duration-300 hover:scale-105" />
        </div>

        <div class="p-4 sm:p-5 flex flex-col min-h-48">
          <p class="text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wider">{{ item.brand }}</p>
          <h3 class="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ item.title }}</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{{ item.description }}</p>

          <div class="mt-auto pt-4 flex items-center justify-between">
            <span class="text-xl font-extrabold text-slate-900 dark:text-slate-100">${{ item.price }}</span>
            <button @click="openModal(item)" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 transition">Buy</button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="text-center py-14">
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">No matches found</h3>
      <p class="mt-1 text-slate-500 dark:text-slate-400">No Samsung products match "{{ searchQuery }}"</p>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm" @click.self="showModal = false">
      <div class="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-6 sm:p-7 shadow-2xl dark:bg-slate-900 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Checkout</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100">x</button>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300 mb-5">You are purchasing: <span class="font-bold text-blue-600 dark:text-blue-300">{{ selectedProduct?.title }}</span></p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="text-sm text-slate-700 dark:text-slate-300">Phone Number</label>
            <input v-model="formData.phone" type="tel" required placeholder="012 345 678" class="mt-1 w-full px-4 py-3 rounded-xl border border-blue-100 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
          </div>

          <div>
            <label class="text-sm text-slate-700 dark:text-slate-300">Delivery Location</label>
            <input v-model="formData.location" type="text" required placeholder="Street, City, Province" class="mt-1 w-full px-4 py-3 rounded-xl border border-blue-100 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
          </div>

          <button type="submit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">Confirm Order</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, reactive, computed, defineProps } from "vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: ""
  }
});

const samsung = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const selectedProduct = ref(null);
const formData = reactive({
  phone: "",
  location: "",
  feedback: "",
});

const filteredSamsung = computed(() => {
  if (!props.searchQuery) return samsung.value;
  const query = props.searchQuery.toLowerCase().trim();
  return samsung.value.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });
});

const fetchSamsung = async () => {
  try {
    loading.value = true;
    const response = await fetch("https://dummyjson.com/products/search?q=samsung");
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    samsung.value = data.products;
  } catch (err) {
    error.value = "Failed to load Samsung products.";
  } finally {
    loading.value = false;
  }
};

const openModal = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const handleSubmit = () => {
  alert(`Thanks for your order of ${selectedProduct.value.title}. We will contact ${formData.phone}.`);
  showModal.value = false;
  formData.phone = "";
  formData.location = "";
  formData.feedback = "";
};

onMounted(fetchSamsung);
</script>
