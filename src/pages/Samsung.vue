<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col justify-center items-center">
        <h1
          class="text-3xl text-center font-extrabold tracking-tight text-blue-600"
        >
          Samsung <span class="text-gray-400 font-light">Store</span>
        </h1>
        <p v-if="!loading && filteredSamsung.length" class="text-center pt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          {{ filteredSamsung.length }} Models Found
        </p>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-14">
      <div v-if="loading" class="flex flex-col items-center py-24">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">កំពុងទាញយកទិន្នន័យ...ពី API សូមរង់ចាំបន្តិច</p>
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
                @click="openModal(item)"
                class="px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-bold text-gray-800">រកមិនឃើញទិន្នន័យទេ</h3>
        <p class="text-gray-500">No Samsung products match "{{ searchQuery }}"</p>
      </div>
    </main>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        <div class="p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Checkout</h2>
            <button
              @click="showModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p class="text-sm text-gray-600 mb-6">
            You are purchasing:
            <span class="font-semibold text-blue-600">{{ selectedProduct?.title }}</span>
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input v-model="formData.phone" type="tel" required placeholder="012 345 678" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
              <input v-model="formData.location" type="text" required placeholder="Street, City, Province" class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
            </div>

            <button type="submit" class="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
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

// receive the search query prop from App.vue or Home.vue
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

// computed property for real-time filtering
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
    error.value = "API បែកង៉ាងើយ វីវរហើយ";
  } finally {
    loading.value = false;
  }
};

const openModal = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const handleSubmit = () => {
  alert(`អរគុណសម្រាប់ការបញ្ជាទិញ ${selectedProduct.value.title}!\nយើងនឹងទាក់ទងទៅលេខ: ${formData.phone}`);
  showModal.value = false;
  formData.phone = "";
  formData.location = "";
  formData.feedback = "";
};

onMounted(fetchSamsung);
</script>