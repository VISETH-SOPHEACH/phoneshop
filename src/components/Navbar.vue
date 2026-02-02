<template>
  <div class="bg-linear-to-br from-blue-50 via-white to-purple-100">
    <header
      class="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-3.5 md:py-4 bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-sm sticky top-0 z-50"
    >
      <!-- Logo -->
      <div class="text-xl sm:text-2xl font-extrabold tracking-tight">
        <span class="text-blue-600 drop-shadow">PHONE</span>
        <span class="text-gray-900">SHOP</span>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6 lg:gap-10">
        <div
          v-for="(brand, index) in brands"
          :key="index"
          class="group relative"
        >
          <router-link
            :to="brand.path"
            v-slot="{ isActive }"
            class="text-sm lg:text-base font-semibold tracking-wide transition-colors duration-300"
          >
            <span
              :class="[
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-800 group-hover:text-blue-600',
              ]"
            >
              {{ brand.name }}
            </span>
            <span
              :class="[
                'absolute -bottom-1.5 left-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300',
                isActive ? 'w-full' : 'w-0 group-hover:w-full',
              ]"
            ></span>
          </router-link>
        </div>
      </nav>

      <!-- Search + Auth (desktop + mobile triggers) -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Mobile search trigger -->
        <button
          @click="toggleMobileSearch"
          class="md:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 backdrop-blur hover:bg-white/90 transition shadow-sm"
        >
          <img :src="searchIcon" alt="Search" class="w-5 h-5 fill-black" />
        </button>

        <!-- Desktop search -->
        <div class="hidden md:flex items-center relative">
          <span class="absolute left-3.5 text-gray-400 text-lg">🔍</span>
          <input
            v-model="searchText"
            @input="search"
            type="text"
            placeholder="Search phones, accessories..."
            class="w-56 sm:w-64 md:w-72 lg:w-80 pl-11 pr-10 py-2.5 text-sm rounded-full bg-white/80 backdrop-blur border border-gray-200/70 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition"
          />
          <button
            v-if="searchText"
            @click="clearSearch"
            class="absolute right-3.5 text-gray-500 hover:text-gray-800 text-lg transition"
          >
            ✕
          </button>
        </div>

        <!-- Auth button (visible on all sizes) -->
        <button
          @click="showAuthModal = true"
          class="hidden sm:block px-4 py-2 text-sm font-semibold text-blue-700 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/80 transition shadow-sm"
        >
          Log In
        </button>

        <!-- Hamburger -->
        <button
          @click="toggleMenu"
          class="md:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-2xl text-gray-800 hover:bg-white/50 rounded-xl transition"
        >
          <span v-if="!isMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </header>

    <!-- Mobile Full-screen Search Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg flex flex-col px-4 pt-4 md:hidden"
      >
        <div class="flex items-center gap-3 max-w-3xl mx-auto w-full">
          <div class="relative flex-1">
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              >🔍</span
            >
            <input
              v-model="searchText"
              @input="search"
              @keyup.enter="handleMobileSearch"
              type="text"
              placeholder="Search phones, accessories..."
              class="w-full pl-12 pr-14 py-3.5 text-base rounded-2xl bg-gray-100/80 border-none focus:ring-2 focus:ring-blue-500 shadow-inner outline-none"
              autofocus
            />
            <button
              @click="isSearchOpen = false"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <button
            @click="handleMobileSearch"
            class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow active:bg-blue-700 transition"
          >
            Go
          </button>
        </div>
      </div>
    </transition>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <nav
        v-if="isMenuOpen"
        class="md:hidden fixed inset-x-0 top-16 z-40 bg-white/90 backdrop-blur-2xl border-b border-gray-200/30 shadow-xl"
      >
        <div
          class="flex flex-col px-5 sm:px-8 py-6 space-y-5 max-w-3xl mx-auto"
        >
          <router-link
            v-for="(brand, index) in brands"
            :key="index"
            :to="brand.path"
            @click="isMenuOpen = false"
            class="text-lg font-medium text-gray-800 hover:text-blue-600 transition"
          >
            {{ brand.name }}
          </router-link>

          <div class="pt-4 border-t border-gray-200/50">
            <button
              @click="
                isMenuOpen = false;
                showAuthModal = true;
              "
              class="text-blue-600 font-semibold text-lg"
            >
              Log In / Register
            </button>
          </div>
        </div>
      </nav>
    </transition>

    <!-- Auth Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showAuthModal"
        class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300"
        >
          <div class="flex justify-between items-center px-6 py-5 border-b">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
              {{ isLoginView ? "Welcome Back" : "Join Us" }}
            </h2>
            <button
              @click="showAuthModal = false"
              class="text-gray-500 hover:text-gray-800 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <div class="p-6 sm:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div v-if="!isLoginView">
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Full Name</label
                >
                <input
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Email</label
                >
                <input
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Password</label
                >
                <input
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                class="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                {{ isLoginView ? "Sign In" : "Create Account" }}
              </button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
              {{ isLoginView ? "New here?" : "Already have an account?" }}
              <button
                @click="isLoginView = !isLoginView"
                class="text-blue-600 font-semibold hover:underline ml-1"
              >
                {{ isLoginView ? "Create account" : "Sign in" }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import searchIcon from "../assets/image.png";

export default {
  data() {
    return {
      searchIcon,
      searchText: "",
      isMenuOpen: false,
      isSearchOpen: false,
      showAuthModal: false,
      isLoginView: true,
      brands: [
        { name: "Home", path: "/" },
        { name: "iPhone", path: "/iphone" },
        { name: "Samsung", path: "/samsung" },
        { name: "Second Hand", path: "/secondHand" },
        { name: "Accessory", path: "/accessory" }, // ← fixed typo
      ],
    };
  },
  methods: {
    toggleMobileSearch() {
      this.isSearchOpen = !this.isSearchOpen;
      if (this.isSearchOpen) this.isMenuOpen = false;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) this.isSearchOpen = false;
    },
    search() {
      this.$emit("search-product", this.searchText.trim());
    },
    handleMobileSearch() {
      if (this.searchText.trim()) {
        this.search();
      }
      this.isSearchOpen = false;
    },
    clearSearch() {
      this.searchText = "";
      this.search();
    },
    handleSubmit() {
      alert(this.isLoginView ? "Logging in..." : "Registering...");
      this.showAuthModal = false;
      // → call real auth API here
    },
  },
};
</script>

<style>
/* Optional: extra smooth backdrop blur support on older browsers */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-xl {
    background-color: rgba(255, 255, 255, 0.75);
  }
}
</style>
