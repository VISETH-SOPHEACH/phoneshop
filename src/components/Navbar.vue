<template>
  <header class="sticky top-3 z-50 px-2 sm:px-0">
    <div class="glass-panel rounded-2xl shadow-lg shadow-blue-900/10">
      <div class="flex items-center gap-3 px-3 sm:px-5 py-3.5">
        <router-link to="/" class="shrink-0">
          <h1 class="text-lg sm:text-xl font-extrabold tracking-tight">
            <span class="text-blue-600 dark:text-blue-300">PHONE</span>
            <span class="text-slate-900 dark:text-slate-100">SHOP</span>
          </h1>
        </router-link>

        <nav class="hidden lg:flex items-center gap-6 ml-5">
          <router-link v-for="item in brands" :key="item.path" :to="item.path" v-slot="{ isActive }">
            <span
              class="relative inline-flex text-sm font-semibold tracking-wide transition"
              :class="isNavActive(item.path, isActive) ? 'text-blue-600 dark:text-blue-300' : 'text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300'"
            >
              {{ item.name }}
              <span
                class="absolute -bottom-1 left-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-300 transition-all duration-200"
                :class="isNavActive(item.path, isActive) ? 'w-full' : 'w-0'"
              ></span>
            </span>
          </router-link>
        </nav>

        <div class="ml-auto flex items-center gap-2 sm:gap-3">
          <div class="hidden md:flex items-center relative">
            <input
              v-model="searchText"
              @input="emitSearch"
              type="text"
              placeholder="Search products"
              class="w-44 lg:w-64 pl-10 pr-9 py-2.5 rounded-xl border bg-white/80 border-blue-100 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400 dark:bg-slate-900/80 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
            />
            <svg class="w-4 h-4 absolute left-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <button
              v-if="searchText"
              @click="clearSearch"
              class="absolute right-3 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
              aria-label="Clear"
            >
              x
            </button>
          </div>

          <button
            @click="toggleTheme"
            class="h-10 px-3 sm:px-3.5 rounded-xl border border-blue-100 bg-white/85 text-slate-700 hover:bg-blue-50 transition flex items-center gap-1.5 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:bg-slate-800"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="isDark" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3z" />
            </svg>
            <span class="hidden sm:inline text-xs font-semibold">
              {{ isDark ? "Light" : "Dark" }}
            </span>
          </button>

          <button
            @click="toggleMobileSearch"
            class="md:hidden h-10 w-10 rounded-xl border border-blue-100 bg-white/85 text-slate-700 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200"
            aria-label="Open search"
          >
            <svg class="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </button>

          <button
            @click="toggleMenu"
            class="lg:hidden h-10 w-10 rounded-xl border border-blue-100 bg-white/85 text-slate-700 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200"
            aria-label="Menu"
          >
            <span class="font-bold">{{ isMenuOpen ? 'x' : '=' }}</span>
          </button>
        </div>
      </div>

      <div v-if="isSearchOpen" class="border-t border-blue-100/80 dark:border-slate-700 p-3 md:hidden">
        <div class="relative">
          <input
            v-model="searchText"
            @input="emitSearch"
            type="text"
            placeholder="Search products"
            class="w-full rounded-xl border bg-white/80 border-blue-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-10 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400 dark:bg-slate-900/80 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
          />
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <button
            v-if="searchText"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500"
          >
            x
          </button>
        </div>
      </div>

      <!-- <nav class="lg:hidden border-t border-blue-100/80 dark:border-slate-700 px-3 py-2.5 flex items-center gap-4 overflow-x-auto">
        <router-link v-for="item in brands" :key="`mobile-${item.path}`" :to="item.path" v-slot="{ isActive }">
          <span
            class="relative inline-flex whitespace-nowrap text-sm font-semibold pb-1 transition"
            :class="isNavActive(item.path, isActive) ? 'text-blue-600 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'"
          >
            {{ item.name }}
            <span
              class="absolute bottom-0 left-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-300 transition-all duration-200"
              :class="isNavActive(item.path, isActive) ? 'w-full' : 'w-0'"
            ></span>
          </span>
        </router-link>
      </nav> -->

      <nav
        v-if="isMenuOpen"
        class="lg:hidden border-t border-blue-100/80 dark:border-slate-700 px-4 py-4 space-y-2"
      >
        <router-link v-for="item in brands" :key="item.path" :to="item.path" v-slot="{ isActive }">
          <span
            @click="isMenuOpen = false"
            class="block px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="isNavActive(item.path, isActive) ? 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-slate-800' : 'text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800'"
          >
            <span class="relative inline-block">
              {{ item.name }}
              <span
                class="absolute -bottom-1 left-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-300 transition-all duration-200"
                :class="isNavActive(item.path, isActive) ? 'w-full' : 'w-0'"
              ></span>
            </span>
          </span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["search-product"]);
const route = useRoute();

const searchText = ref("");
const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const isDark = ref(false);
const activeHomeSectionPath = ref("/");

const brands = [
  { name: "Home", path: "/" },
  { name: "iPhone", path: "/iphone" },
  { name: "Samsung", path: "/samsung" },
  { name: "Second Hand", path: "/secondHand" },
  { name: "Accessory", path: "/accessory" },
];

const applyTheme = (darkEnabled) => {
  document.documentElement.classList.toggle("dark", darkEnabled);
  isDark.value = darkEnabled;
};

const toggleTheme = () => {
  const next = !isDark.value;
  applyTheme(next);
  localStorage.setItem("phoneshop-theme", next ? "dark" : "light");
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) isSearchOpen.value = false;
};

const toggleMobileSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) isMenuOpen.value = false;
};

const emitSearch = () => emit("search-product", searchText.value.trim());

const clearSearch = () => {
  searchText.value = "";
  emitSearch();
};

const handleHomeSectionActive = (event) => {
  const nextPath = event.detail?.path;
  if (route.path === "/" && typeof nextPath === "string") {
    activeHomeSectionPath.value = nextPath;
  }
};

const isNavActive = (path, routeIsActive) => {
  if (route.path === "/") {
    return activeHomeSectionPath.value === path;
  }
  return routeIsActive;
};

onMounted(() => {
  const saved = localStorage.getItem("phoneshop-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);
  window.addEventListener("home-section-active", handleHomeSectionActive);
});

onUnmounted(() => {
  window.removeEventListener("home-section-active", handleHomeSectionActive);
});

watch(
  () => route.path,
  (nextPath) => {
    if (nextPath !== "/") {
      activeHomeSectionPath.value = nextPath;
    } else {
      activeHomeSectionPath.value = "/";
    }
  },
  { immediate: true },
);
</script>
