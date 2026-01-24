<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
    <nav
      class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex flex-col justify-center items-center"
      >
        <h1 class="text-3xl text-center font-bold tracking-tight text-blue-600">
          Apple Store
        </h1>

        <p
          v-if="!loading && filteredIphones.length"
          class="text-center pt-2 text-xs font-bold text-gray-400 uppercase tracking-widest"
        >
          {{ filteredIphones.length }} Models Found
        </p>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div
          class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
      </div>

      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-500 font-medium">{{ error }}</p>
      </div>

      <div
        v-else-if="filteredIphones.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
      >
        <div
          v-for="product in filteredIphones"
          :key="product.id"
          class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
        >
          <div
            class="aspect-square flex items-center justify-center bg-gray-50 p-4"
          >
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div class="p-4 flex flex-col grow">
            <h3 class="text-sm md:text-lg font-bold line-clamp-1 mb-1">
              {{ product.title }}
            </h3>
            <p class="text-xs text-gray-500 line-clamp-2 mb-4 hidden sm:block">
              {{ product.description }}
            </p>

            <div class="mt-auto flex flex-col gap-2">
              <span class="text-lg font-black">${{ product.price }}</span>
              <button
                @click="openDetails(product)"
                class="w-full py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-bold text-gray-800">No matches found</h3>
        <p class="text-gray-500">
          We couldn't find any iPhone matching "{{ searchQuery }}"
        </p>
      </div>
    </main>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="closeDetails"
    >
      <div
        class="bg-white rounded-4xl max-w-sm w-full p-6 relative shadow-2xl animate-in zoom-in duration-200"
      >
        <button
          @click="closeDetails"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <img
          :src="selectedProduct.thumbnail"
          class="h-40 mx-auto mb-4 object-contain"
        />
        <h2 class="text-xl font-bold mb-2">{{ selectedProduct.title }}</h2>
        <p class="text-sm text-gray-600 mb-6">
          {{ selectedProduct.description }}
        </p>
        <div class="flex justify-between items-center border-t pt-4">
          <span class="text-2xl font-black">${{ selectedProduct.price }}</span>
          <div class="flex gap-x-3">
            <button
              class="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm"
            >
              Buy
            </button>
            <button
              class="bg-gray-100 text-gray-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps } from "vue";

// Accept the searchQuery from App.vue
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

/**
 * Filtered logic:
 * This computed property automatically recalculates whenever
 * iphones.value OR props.searchQuery changes.
 */
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
