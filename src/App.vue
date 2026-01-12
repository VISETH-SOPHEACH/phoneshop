<template>
  <div>
    <Navbar />
    <Home />
    <Iphone />
    <Samsung />
    <Pixel />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Home from "./pages/Home.vue";
import Iphone from "./pages/Iphone.vue";
import Samsung from "./pages/Samsung.vue";
import Pixel from "./pages/Pixel.vue";

export default {
  components: {
    Navbar,
    Iphone,
    Samsung,
    Pixel,
    Home,
  },
};
</script>