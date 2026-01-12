<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      <nav
        class="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10"
      >
        <h1
          class="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400"
        >
          Samsung <span class="text-gray-400 font-light">Store</span>
        </h1>
      </nav>

      <main class="max-w-7xl mx-auto p-6">
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-20"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-500">កំពុងស្វែងរកផលិតផល...</p>
        </div>

        <div
          v-else-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          <strong class="font-bold">Error: </strong>
          <span>{{ error }}</span>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="item in samsung"
            :key="item.id"
            class="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div class="h-48 overflow-hidden bg-gray-200">
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div class="p-4">
              <p
                class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1"
              >
                {{ item.brand }}
              </p>
              <h2 class="text-lg font-bold mb-2 line-clamp-1">
                {{ item.title }}
              </h2>
              <p
                class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4"
              >
                {{ item.description }}
              </p>
              <div class="flex items-center justify-between mt-auto">
                <span
                  class="text-xl font-bold text-green-600 dark:text-green-400"
                  >${{ item.price }}</span
                >
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const samsung = ref([]);
const loading = ref(true);
const error = ref(null);
const isDark = ref(false);

const fetchSamsung = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      "https://dummyjson.com/products/search?q=samsung"
    );

    if (!response.ok) throw new Error("បែកវ៉ល់ API ហើយ");
    const data = await response.json();

    samsung.value = data.products;
  } catch (err) {
    error.value = "បរាជ័យ API ហើយ";
    console.error("Fetch error: ", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSamsung);
</script>

<style scoped>
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
}

/* Enable dark mode classes */
.dark {
  color-scheme: dark;
}
</style>
