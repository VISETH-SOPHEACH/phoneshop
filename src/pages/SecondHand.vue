<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
    <div class="max-w-7xl mx-auto px-6">
      <nav class="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md">
        <div
          class="max-w-7xl mx-auto px-6 py-5 flex flex-col justify-center items-center"
        >
          <h1
            class="text-3xl text-center font-extrabold tracking-tight text-blue-600"
          >
            Second <span class="text-gray-400 font-light">Hand</span>
          </h1>
          <p
            v-if="!loading && filteredPixels.length"
            class="text-gray-500 text-lg pt-2"
          >
            {{ filteredPixels.length }} models available
          </p>
        </div>
      </nav>

      <div v-if="loading" class="flex flex-col items-center py-20">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">ទាញយកទិន្នន័យពី API</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-xl font-semibold">{{ error }}</p>
      </div>

      <div
        v-else-if="filteredPixels.length > 0"
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

      <div v-else class="text-center py-20">
        <div class="text-4xl mb-4">🔎</div>
        <h3 class="text-lg font-bold text-gray-800">រកមិនឃើញទិន្នន័យទេ</h3>
        <p class="text-gray-500">
          No second hand phones match "{{ searchQuery }}"
        </p>
      </div>

      <div
        v-if="selectedProduct"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in duration-200"
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
          >
            &times;
          </button>

          <div v-if="modalStep === 'details'" class="p-8">
            <div class="flex flex-col items-center">
              <img
                :src="selectedProduct.thumbnail"
                class="h-48 object-contain mb-6"
              />
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                {{ selectedProduct.title }}
              </h2>
              <p class="text-blue-600 text-2xl font-bold mb-4">
                ${{ selectedProduct.price }}
              </p>
              <div class="text-gray-600 space-y-2 text-center mb-8">
                <p><strong>Brand:</strong> {{ selectedProduct.brand }}</p>
                <p><strong>Category:</strong> {{ selectedProduct.category }}</p>
                <p>{{ selectedProduct.description }}</p>
              </div>
              <button
                @click="modalStep = 'form'"
                class="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors shadow-lg"
              >
                Buy This Phone
              </button>
            </div>
          </div>

          <div v-else-if="modalStep === 'form'" class="p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Complete Your Order
            </h2>
            <form @submit.prevent="submitOrder" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Delivery Location</label
                >
                <input
                  v-model="orderForm.location"
                  required
                  type="text"
                  placeholder="Street address, City"
                  class="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Phone Number</label
                >
                <input
                  v-model="orderForm.phone"
                  required
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  class="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Feedback / Notes</label
                >
                <textarea
                  v-model="orderForm.feedback"
                  rows="3"
                  placeholder="Any special instructions?"
                  class="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="modalStep = 'details'"
                  class="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  class="flex-2 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg"
                >
                  Confirm Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, defineProps } from "vue";

// accept the search query prop
const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

const pixels = ref([]);
const loading = ref(true);
const error = ref(null);

// modal State
const selectedProduct = ref(null);
const modalStep = ref("details");
const orderForm = reactive({
  location: "",
  phone: "",
  feedback: "",
});

// filter logic for the list
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
    `Order Confirmed for ${selectedProduct.value.title}!\nDelivering to: ${orderForm.location}`,
  );
  closeModal();
};

onMounted(fetchSecond);
</script>
