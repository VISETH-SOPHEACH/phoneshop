<template>
  <section class="pt-6 sm:pt-8">
    <div ref="homeTopSection" class="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300 font-semibold">Featured</p>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Home Collection</h2>
        </div>
        <p v-if="filteredPixels.length" class="text-sm text-slate-500 dark:text-slate-400">{{ filteredPixels.length }} models available</p>
      </div>

      <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
        <div class="w-11 h-11 border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-300 rounded-full animate-spin"></div>
        <p class="mt-3 text-slate-500 dark:text-slate-400">Loading products...</p>
      </div>

      <p v-else-if="error" class="py-16 text-center text-red-500">{{ error }}</p>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

            <div class="mt-auto pt-5 flex items-center justify-between gap-2">
              <span class="text-xl font-extrabold text-slate-900 dark:text-slate-100">${{ product.price }}</span>
              <button
                @click="openDetails(product)"
                class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
              >
                View
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="mt-8 space-y-8">
      <section ref="iphoneSection">
        <Iphone :searchQuery="searchQuery" />
      </section>
      <section ref="samsungSection">
        <Samsung :searchQuery="searchQuery" />
      </section>
      <section ref="secondHandSection">
        <SecondHand :searchQuery="searchQuery" />
      </section>
      <section ref="accessorySection">
        <Accesury :searchQuery="searchQuery" />
      </section>
    </div>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeDetails"
    >
      <div class="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 dark:border-slate-700">
        <button @click="closeDetails" class="ml-auto block text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">x</button>
        <img :src="selectedProduct.thumbnail" :alt="selectedProduct.title" class="h-48 mx-auto object-contain" />
        <h3 class="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{{ selectedProduct.title }}</h3>
        <p class="mt-3 text-slate-600 dark:text-slate-300">{{ getDescription(selectedProduct) }}</p>
        <p class="mt-5 text-2xl font-extrabold text-blue-600 dark:text-blue-300">${{ selectedProduct.price }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineProps, nextTick } from "vue";
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
const homeTopSection = ref(null);
const iphoneSection = ref(null);
const secondHandSection = ref(null);
const samsungSection = ref(null);
const accessorySection = ref(null);
let scrollTicking = false;
let lastActivePath = "";
let onScrollOrResize = null;

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

onMounted(() => {
  fetchHome();

  const getSections = () => [
    { path: "/", el: homeTopSection.value },
    { path: "/iphone", el: iphoneSection.value },
    { path: "/samsung", el: samsungSection.value },
    { path: "/secondHand", el: secondHandSection.value },
    { path: "/accessory", el: accessorySection.value },
  ].filter((item) => item.el);

  const emitActivePath = (path) => {
    if (path === lastActivePath) return;
    lastActivePath = path;
    window.dispatchEvent(
      new CustomEvent("home-section-active", {
        detail: { path },
      }),
    );
  };

  const updateActiveSection = () => {
    const sections = getSections();
    if (!sections.length) return;

    const anchor = window.innerHeight * 0.3;
    let activePath = "/";

    for (const section of sections) {
      const top = section.el.getBoundingClientRect().top;
      if (top <= anchor) activePath = section.path;
    }

    emitActivePath(activePath);
  };

  onScrollOrResize = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateActiveSection();
      scrollTicking = false;
    });
  };

  nextTick(() => {
    updateActiveSection();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
  });
});

onUnmounted(() => {
  if (onScrollOrResize) {
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
  }
  lastActivePath = "";
  window.dispatchEvent(
    new CustomEvent("home-section-active", {
      detail: { path: "/" },
    }),
  );
});
</script>
