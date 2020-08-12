<template>
  <div id="app">
    <SideMenu :msk_data="mask_zHTw" />
    <OpLayers v-if="mask_zHTw !== null" :msk_data="mask_zHTw" />
    <CardDetail/>
    <div class="clearfix"></div>
  </div>
</template>

<script>
import SideMenu from "./components/SideMenu";
import OpLayers from "./components/OpLayers";
import CardDetail from "./components/CardDetail";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      mask_zHTw: null,
    };
  },
  components: {
    SideMenu,
    OpLayers,
    CardDetail
  },
  created() {
    const vm = this;
    vm.getMaskData();
  },
  methods: {
    async getMaskData() {
      const vm = this;
      // const response = await axios.get(
      //   "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
      // );
      // 假資料
      const response = await axios.get("http://localhost:3000/data");
      vm.mask_zHTw = await Object.freeze(response.data.features); //凍結對象,禁止對於屬性做修改
    },
  },
};
</script>


<style lang="scss">
@import "./assets/main.scss";

#app {
  width: 100%;
  height: 100%;
}
</style>
