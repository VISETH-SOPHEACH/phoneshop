<template>
  <div class=" bg-linear-to-br from-blue-50 via-white to-purple-100">
    <!-- Glass Header -->
    <header
      class="flex items-center justify-between px-6 md:px-16 py-4
             bg-white/30 backdrop-blur-xl border border-white/20
             shadow-lg sticky top-0 z-50"
    >
      <!-- Logo -->
      <div class="text-2xl font-extrabold tracking-tight">
        <span class="text-blue-600 drop-shadow-sm">PHONE</span>
        <span class="text-gray-900">SHOP</span>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <div
          v-for="(brand, index) in brands"
          :key="index"
          class="group relative"
        >
          <a
            :href="brand.path"
            class="text-sm font-semibold text-gray-700
                   transition-all duration-300
                   group-hover:text-blue-600"
          >
            {{ brand.name }}
          </a>

          <!-- Glow underline -->
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5
                   bg-linear-to-r from-blue-500 to-purple-500
                   transition-all duration-300 group-hover:w-full"
          ></span>
        </div>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button
          class="px-4 py-2 text-sm font-medium text-blue-700
                 bg-white/40 backdrop-blur-md
                 border border-white/30 rounded-lg
                 hover:bg-white/60 transition"
        >
          Log In
        </button>

        <button
          class="px-5 py-2 text-sm font-semibold text-white
                 bg-linear-to-r from-blue-600 to-purple-600
                 rounded-lg shadow-lg shadow-blue-300/40
                 hover:scale-105 transition-transform"
        >
          Shop Now
        </button>
      </div>
    </header>

    <!-- Hero -->
    <main class="p-10 text-center">
      <h1
        class="text-4xl md:text-6xl font-extrabold
               bg-linear-to-r from-blue-600 to-purple-600
               bg-clip-text text-transparent mb-4"
      >
        Latest Technology
      </h1>

      <p class="text-gray-600 text-lg max-w-xl mx-auto">
        Browse the newest releases from your favorite brands with a modern
        glass-inspired experience.
      </p>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brands: [
        { name: "iPhone", path: "/iphone" },
        { name: "Samsung", path: "/samsung" },
        { name: "Google Pixel", path: "/pixel" },
        { name: "Nokia", path: "/nokia" },
      ],
    };
  },
};
</script>
