<template>
  <div class="min-h-screen bg-gray-50">
    <header
      class="flex items-center justify-between px-6 md:px-16 py-4 bg-white shadow-md sticky top-0 z-50"
    >
      <div class="text-2xl font-extrabold tracking-tight text-blue-600">
        PHONE<span class="text-gray-900">SHOP</span>
      </div>

      <nav class="hidden md:flex items-center gap-8">
        <div
          v-for="(brand, index) in brands"
          :key="index"
          class="group relative cursor-pointer"
        >
          <a
            :href="brand.path"
            class="text-sm font-semibold text-gray-600 transition-colors duration-300 group-hover:text-blue-600"
          >
            {{ brand.name }}
          </a>
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"
          ></span>
        </div>
      </nav>

      <div class="flex items-center gap-4">
        <button
          class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          Log In
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
        >
          Shop Now
        </button>
      </div>
    </header>

    <main class="p-10 text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        Latest Technology.
      </h1>
      <p class="text-gray-500 text-lg">
        Browse the newest releases from your favorite brands.
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