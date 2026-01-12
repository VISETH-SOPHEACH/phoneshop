<template>
  <div>
    <Navbar />
    <Iphone />
    <Samsung />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Iphone from "./pages/Iphone.vue";
import Samsung from "./pages/Samsung.vue";

export default {
  components: {
    Navbar,
    Iphone,
    Samsung,
  },
};
</script>