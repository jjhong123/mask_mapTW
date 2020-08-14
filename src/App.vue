<template>
  <div id="app">
    <SideMenu @update-show="updateShow" :msk_data="mask_zHTw" />
    <OpLayers
      :flyshow="flyshow"
      v-if="mask_zHTw !== null"
      :msk_data="mask_zHTw"
      :tmpdata="tmp_data"
      @update-show="updateShow(type)"
    />
    <div class="clearfix"></div>
  </div>
</template>

<script>
import SideMenu from "./components/SideMenu";
import OpLayers from "./components/OpLayers";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      mask_zHTw: null,
      flyshow: false,
      tmp_data: false,
    };
  },
  components: {
    SideMenu,
    OpLayers,
  },
  created() {
    const vm = this;
    vm.getMaskData();
  },
  methods: {
    async getMaskData() {
      const vm = this;
      const response = await axios.get(
        "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
      );
      // 假資料
      // const response = await axios.get("http://localhost:3000/data");
      vm.mask_zHTw = await Object.freeze(response.data.features); //凍結對象,禁止對於屬性做修改
    },
    updateShow(type, data) {
      const vm = this;
      if (type) {
        vm.tmp_data = Object.assign({}, data);
        vm.flyshow = false;
      }
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
