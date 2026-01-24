<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col justify-center items-center">
        <h1
          class="text-3xl text-center font-extrabold tracking-tight text-blue-600"
        >
          Accesury <span class="text-gray-400 font-light">Store</span>
        </h1>
        <p v-if="!loading && filteredSamsung.length" class="text-center pt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          {{ filteredSamsung.length }} Items Found
        </p>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-14">
      <div v-if="loading" class="flex flex-col items-center py-24">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">
          API កំពុងបែកវ៉ល់ហើយ កុំប្រញ៉ាប់ពេក...
        </p>
      </div>

      <div v-else-if="error" class="text-center py-24">
        <p class="text-red-500 text-xl font-semibold">{{ error }}</p>
      </div>

      <div
        v-else-if="filteredSamsung.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <div
          v-for="item in filteredSamsung"
          :key="item.id"
          class="group rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div class="h-60 flex items-center justify-center bg-gray-50">
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="max-h-52 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div class="p-6 flex flex-col grow">
            <p
              class="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1"
            >
              {{ item.brand }}
            </p>
            <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
              {{ item.title }}
            </h2>
            <p class="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
              {{ item.description }}
            </p>

            <div class="mt-auto flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900"
                >${{ item.price }}</span
              >
              <button
                @click="selectedProduct = item"
                class="px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:opacity-80 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-4xl mb-4">📦</div>
        <h3 class="text-lg font-bold text-gray-800">រកមិនឃើញគ្រឿងបន្លាស់ទេ</h3>
        <p class="text-gray-500">No accessories match "{{ searchQuery }}"</p>
      </div>
    </main>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="selectedProduct = null"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200"
      >
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Checkout</h2>
            <button
              @click="selectedProduct = null"
              class="text-gray-400 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
          </div>

          <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl mb-6">
            <img
              :src="selectedProduct.thumbnail"
              class="w-16 h-16 object-contain"
            />
            <div>
              <p class="font-bold text-gray-800">{{ selectedProduct.title }}</p>
              <p class="text-blue-600 font-bold">
                ${{ selectedProduct.price }}
              </p>
            </div>
          </div>

          <form @submit.prevent="handlePurchase" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input
                v-model="form.location"
                required
                type="text"
                placeholder="House #, Street, City"
                class="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                v-model="form.phone"
                required
                type="tel"
                placeholder="012 345 678"
                class="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Feedback</label>
              <textarea
                v-model="form.feedback"
                rows="3"
                placeholder="Tell us what you think..."
                class="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, defineProps } from "vue";

// Accept searchQuery from parent
const props = defineProps({
  searchQuery: {
    type: String,
    default: ""
  }
});

const samsung = ref([]);
const loading = ref(true);
const error = ref(null);

// Form & Modal State
const selectedProduct = ref(null);
const form = reactive({
  location: "",
  phone: "",
  feedback: "",
});
  //filter products by name or description
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
    const response = await fetch(
      "https://dummyjson.com/products/search?q=phone"
    );
    if (!response.ok) throw new Error("បែកវ៉ល់ API ហើយ");
    const data = await response.json();
    samsung.value = data.products;
  } catch (err) {
    error.value = "វីវរ API ហើយ";
  } finally {
    loading.value = false;
  }
};

const handlePurchase = () => {
  alert(
    `អរគុណច្រើន! Order for ${selectedProduct.value.title} is placed.\nLocation: ${form.location}`
  );

  // Clear and close
  selectedProduct.value = null;
  form.location = "";
  form.phone = "";
  form.feedback = "";
};

onMounted(fetchSamsung);
</script>