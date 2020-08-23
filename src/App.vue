<template>
  <div id="app">
    <button type="button" class="button btn-open" @click="changMenu()">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        class="bi bi-bar-chart-steps"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill-rule="evenodd" d="M.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 .5 0z" />
        <rect width="5" height="2" x="2" y="1" rx=".5" />
        <rect width="8" height="2" x="4" y="5" rx=".5" />
        <path
          d="M6 9.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z"
        />
      </svg>
    </button>
    <Loading :loading_type="loading_type" />
    <SideMenu @update-show="updateShow" :msk_data="mask_zHTw" @update-point="updatePointList" />
    <OpLayers ref="open_ly" :tmpdata="tmp_data" @update-show="updateShow(type)" />
    <div class="clearfix"></div>
    <CardDetail />
    <Footer v-if="mask_zHTw!==null" :mskupdate="update" />
  </div>
</template>

<script>
import SideMenu from "./components/SideMenu";
import OpLayers from "./components/OpLayers";
import CardDetail from "./components/CardDetail";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      mask_zHTw: null,
      flyshow: false,
      tmp_data: false,
      loading_type: false,
      point_list: null,
      update: null,
    };
  },
  components: {
    SideMenu,
    OpLayers,
    CardDetail,
    Loading,
    Footer,
  },
  created() {
    const vm = this;
    vm.getMaskData();
    document.title = "口罩地圖";
  },
  methods: {
    async getMaskData() {
      const vm = this;
      vm.loading_type = true;
      const response = await axios.get(
        "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
      );
      // 假資料
      // const response = await axios.get("http://localhost:3000/data");
      vm.mask_zHTw = Object.freeze(response.data.features);
      vm.loading_type = false;
      vm.update = vm.mask_zHTw[0].properties.updated;
    },
    updateShow(type, data) {
      const vm = this;
      if (type) {
        vm.tmp_data = Object.assign({}, data);
        vm.flyshow = false;
      }
    },
    updatePointList(data) {
      const vm = this;
      this.$refs.open_ly.addMarkers();
    },
    // 縮小面板
    changMenu() {
      document.querySelector(".menu").classList.toggle("menu-avtive");
    },
  },
};
</script>


<style lang="scss">
@import "./assets/main.scss";

#app {
  width: 100%;
  height: 100%;
  position: relative;
  .btn-open {
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: white;
    border: 1px solid transparent;
    padding: 10px 15px;
    font-size: 2rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    :focus {
      outline: none;
    }
  }
}
</style>
