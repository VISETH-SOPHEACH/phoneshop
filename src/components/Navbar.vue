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
        <div
          v-for="(brand, index) in brands"
          :key="index"
          class="group relative"
        >
          <router-link
            :to="brand.path"
            class="text-sm font-semibold text-gray-700 transition-all duration-300 group-hover:text-blue-600"
          >
            {{ brand.name }}
          </router-link>
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"
          ></span>
        </div>
      </nav>

      <div class="flex items-center gap-3">
        <button
          @click="showAuthModal = true"
          class="px-4 py-2 text-sm font-medium text-blue-700 bg-white/40 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/60 transition"
        >
          Log In
        </button>
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden flex items-center justify-center w-10 h-10 text-2xl font-bold text-gray-800 hover:bg-white/50 rounded-lg transition-all"
        >
          <span v-if="!isMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </header>

    <div
      v-if="showAuthModal"
      class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">
            {{ isLoginView ? "Welcome Back" : "Create Account" }}
          </h2>
          <button
            @click="showAuthModal = false"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div v-if="!isLoginView">
              <label class="block text-sm font-medium text-gray-700"
                >Full Name</label
              >
              <input
                type="text"
                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Email Address</label
              >
              <input
                type="email"
                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <input
                type="password"
                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {{ isLoginView ? "Sign In" : "Register Now" }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-600">
            {{
              isLoginView
                ? "Don't have an account?"
                : "Already have an account?"
            }}
            <button
              @click="isLoginView = !isLoginView"
              class="text-blue-600 font-bold hover:underline ml-1"
            >
              {{ isLoginView ? "Register" : "Log In" }}
            </button>
          </p>
        </div>
      </div>
    </div>

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
            <button
              @click="
                isMenuOpen = false;
                showAuthModal = true;
              "
              class="text-blue-600 font-bold"
            >
              Log In
            </button>
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
      showAuthModal: false, // Controls visibility of the pop-up
      isLoginView: true, // Toggles between Login and Register
      brands: [
        { name: "Home", path: "/" },
        { name: "iPhone", path: "/iphone" },
        { name: "Samsung", path: "/samsung" },
        { name: "Google Pixel", path: "/pixel" },
        { name: "Nokia", path: "/nokia" },
      ],
    };
  },
  methods: {
    handleSubmit() {
      const mode = this.isLoginView ? "Logging in" : "Registering";
      alert(`${mode}... (This is where your API call goes)`);
      this.showAuthModal = false;
    },
  },
};
</script>
