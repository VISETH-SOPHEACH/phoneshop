<template>
  <div class="bg-linear-to-br from-blue-50 via-white to-purple-100">
    <header
      class="flex items-center justify-between px-6 md:px-16 py-4 bg-white/30 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-50"
    >
      <div class="text-2xl font-extrabold tracking-tight">
        <span class="text-blue-600 drop-shadow-sm">PHONE</span>
        <span class="text-gray-900">SHOP</span>
      </div>

      <nav class="hidden md:flex items-center gap-8">
        <div v-for="(brand, index) in brands" :key="index" class="group relative">
          <router-link
            :to="brand.path"
            class="text-sm font-semibold text-gray-700 transition-all duration-300 group-hover:text-blue-600"
            active-class="text-blue-600"
          >
            {{ brand.name }}
          </router-link>
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
        </div>
      </nav>

      <div class="flex items-center gap-3">
        <button class="hidden sm:block px-4 py-2 text-sm font-medium text-blue-700 bg-white/40 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/60 transition">
          Log In
        </button>

        <button class="px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-300/40 hover:scale-105 transition-transform">
          Shop Now
        </button>

        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="md:hidden flex items-center justify-center w-10 h-10 text-2xl font-bold text-gray-800 hover:bg-white/50 rounded-lg transition-all"
          aria-label="Toggle Menu"
        >
          <span v-if="!isMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </header>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-5"
    >
      <nav 
        v-if="isMenuOpen" 
        class="md:hidden absolute top-18.25 left-0 w-full bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl z-40"
      >
        <div class="flex flex-col p-6 space-y-4">
          <router-link
            v-for="(brand, index) in brands"
            :key="index"
            :to="brand.path"
            @click="isMenuOpen = false"
            class="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {{ brand.name }}
          </router-link>
          
          <div class="pt-4 border-t border-gray-200/50">
            <button class="text-blue-600 font-bold">Log In</button>
          </div>
        </div>
      </nav>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      brands: [
        { name: "Home", path: "/" },
        { name: "iPhone", path: "/iphone" },
        { name: "Samsung", path: "/samsung" },
        { name: "Google Pixel", path: "/pixel" },
        { name: "Nokia", path: "/nokia" },
      ],
    };
  },
};
</script>