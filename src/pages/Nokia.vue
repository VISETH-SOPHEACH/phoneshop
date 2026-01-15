<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="sticky top-0 z-10 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-5 flex justify-center items-center">
        <h1
          class="text-3xl text-center font-extrabold tracking-tight text-blue-600 dark:text-blue-400"
        >
          Nokia <span class="text-gray-400 font-light">Page</span>
        </h1>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-14">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center py-24">
        <div
          class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"
        ></div>
        <p class="text-gray-500 text-lg">API កំពុងបែកវ៉ល់ហើយ កុំប្រញ៉ាប់ពេក... ចប់ហើយ</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-24">
        <p class="text-red-500 text-xl font-semibold">{{ error }}</p>
      </div>

      <!-- Products -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        <div
          v-for="item in samsung"
          :key="item.id"
          class="group rounded-3xl bg-gray-50 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
        >
          <!-- Image -->
          <div
            class="h-60 flex items-center justify-center bg-linaer-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
          >
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="max-h-52 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col grow">
            <p
              class="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1"
            >
              {{ item.brand }}
            </p>

            <h2
              class="text-xl font-semibold text-gray-900  mb-2 line-clamp-1"
            >
              {{ item.title }}
            </h2>

            <p
              class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3"
            >
              {{ item.description }}
            </p>

            <div class="mt-auto flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900 ">
                ${{ item.price }}
              </span>

              <button
                class="px-5 py-2.5 rounded-full bg-black text-white  text-sm font-semibold hover:opacity-80 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const samsung = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchSamsung = async () => {
  try {
    loading.value = true;

    const response = await fetch(
      "https://dummyjson.com/products/search?q=phone"
    );

    if (!response.ok) throw new Error("បែកវ៉ល់ API ហើយ");

    const data = await response.json();
    console.log("API Data:", data);

    samsung.value = data.products; // ✅ matches template
  } catch (err) {
    error.value = "វីវរ API ហើយ";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSamsung);
</script>
