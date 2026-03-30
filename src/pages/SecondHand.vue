<template>
  <section class="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300 font-semibold">Certified</p>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Second Hand</h2>
      </div>
      <p v-if="!loading && filteredPixels.length" class="text-sm text-slate-500 dark:text-slate-400">{{ filteredPixels.length }} models available</p>
    </div>

    <div v-if="loading" class="py-20 flex flex-col items-center">
      <div class="w-11 h-11 border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-300 rounded-full animate-spin"></div>
      <p class="mt-3 text-slate-500 dark:text-slate-400">Loading products...</p>
    </div>

    <p v-else-if="error" class="py-16 text-center text-red-500">{{ error }}</p>

    <div v-else-if="filteredPixels.length" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <article
        v-for="product in filteredPixels"
        :key="product.id"
        class="rounded-2xl border border-blue-100 bg-white/85 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 dark:bg-slate-900/75 dark:border-slate-700"
      >
        <div class="h-44 sm:h-52 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 p-4">
          <img :src="product.thumbnail" :alt="product.title" class="max-h-full object-contain transition-transform duration-300 hover:scale-105" />
        </div>

        <div class="p-4 sm:p-5 flex flex-col min-h-48">
          <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 line-clamp-1">{{ product.title }}</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{{ product.description }}</p>

          <div class="mt-auto pt-4 flex items-center justify-between">
            <span class="text-xl font-extrabold text-slate-900 dark:text-slate-100">${{ product.price }}</span>
            <button @click="openDetails(product)" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">Details</button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="text-center py-14">
      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">No matches found</h3>
      <p class="mt-1 text-slate-500 dark:text-slate-400">No second-hand phones match "{{ searchQuery }}"</p>
    </div>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="w-full max-w-lg rounded-3xl border border-blue-100 bg-white shadow-2xl dark:bg-slate-900 dark:border-slate-700">
        <div class="p-6 sm:p-8">
          <button @click="closeModal" class="ml-auto block text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">x</button>

          <div v-if="modalStep === 'details'" class="text-center">
            <img :src="selectedProduct.thumbnail" class="h-44 mx-auto object-contain" />
            <h3 class="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ selectedProduct.title }}</h3>
            <p class="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-300">${{ selectedProduct.price }}</p>
            <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">{{ selectedProduct.description }}</p>
            <button @click="modalStep = 'form'" class="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Buy This Phone</button>
          </div>

          <div v-else>
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Complete Your Order</h3>
            <form @submit.prevent="submitOrder" class="mt-5 space-y-4">
              <div>
                <label class="text-sm text-slate-700 dark:text-slate-300">Delivery Location</label>
                <input v-model="orderForm.location" required type="text" placeholder="Street address, City" class="mt-1 w-full px-4 py-3 rounded-xl border border-blue-100 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label class="text-sm text-slate-700 dark:text-slate-300">Phone Number</label>
                <input v-model="orderForm.phone" required type="tel" placeholder="+1 (555) 000-0000" class="mt-1 w-full px-4 py-3 rounded-xl border border-blue-100 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label class="text-sm text-slate-700 dark:text-slate-300">Feedback / Notes</label>
                <textarea v-model="orderForm.feedback" rows="3" placeholder="Any special instructions?" class="mt-1 w-full px-4 py-3 rounded-xl border border-blue-100 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/15 resize-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"></textarea>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="modalStep = 'details'" class="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">Back</button>
                <button type="submit" class="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, reactive, computed, defineProps } from "vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

const pixels = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedProduct = ref(null);
const modalStep = ref("details");
const orderForm = reactive({
  location: "",
  phone: "",
  feedback: "",
});

const filteredPixels = computed(() => {
  if (!props.searchQuery) return pixels.value;
  const query = props.searchQuery.toLowerCase().trim();
  return pixels.value.filter((product) => {
    return (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });
});

const fetchSecond = async () => {
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
  } finally {
    loading.value = false;
  }
};

const openDetails = (product) => {
  selectedProduct.value = product;
  modalStep.value = "details";
};

const closeModal = () => {
  selectedProduct.value = null;
  orderForm.location = "";
  orderForm.phone = "";
  orderForm.feedback = "";
};

const submitOrder = () => {
  alert(
    `Order confirmed for ${selectedProduct.value.title}. Delivering to: ${orderForm.location}`,
  );
  closeModal();
};

onMounted(fetchSecond);
</script>
