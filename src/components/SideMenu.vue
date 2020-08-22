<template>
  <div class="menu" ref="menu">
    <button type="button" class="button btn-close" @click="changMenu()">
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
    <div class="nav">
      <div class="nav-header" style="margin-bottom:10px;">
        {{today.year}}.{{today.month}}.{{today.day}}
        {{get_chweek}}
      </div>
      <div class="nav-title" style="margin-bottom:10px;">
        <span>
          {{
          (day===true)?'偶數':'奇數'
          }}
        </span>購買日
      </div>
      <div class="nav-area">
        <select
          class="fm-ctl"
          type="text"
          style="margin-bottom: 15px;"
          v-model="select_city"
          @change="getDataCity(select_city)"
        >
          <option value selected disabled hidden>---選擇城市---</option>
          <option
            :value="item.name"
            v-for="(item,index) in data_zHTw.data"
            :key="index"
          >{{item.name}}</option>
        </select>

        <select
          class="fm-ctl"
          type="text"
          v-model="select_district"
          @change="getDataDistrict(select_district)"
        >
          <option value selected disabled hidden>---選擇行政區---</option>
          <option
            :value="item.name"
            v-for="(item,index) in city_district"
            :key="index"
          >{{item.name}}</option>
        </select>
      </div>
    </div>
    <div class="menu-cards">
      <ul class="cards-list">
        <Card
          v-for="(item,index) in ft_data"
          :key="index"
          :data="item"
          @click.native="printDetailsClick(item)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import data_zHTw from "@/data_zHTw.js";
import Card from "./Card";
import axios from "axios";

export default {
  props: ["msk_data"],
  components: {
    Card,
  },
  data() {
    return {
      data_zHTw: data_zHTw,
      select_city: "臺北市",
      select_district: "",
      ft_data: null,
      day: null,
      cards: {},
      today: {
        year: null,
        month: null,
        day: null,
        week: null,
      },
    };
  },
  created() {
    const vm = this;
    vm.day = new Date();
    vm.today.year = vm.day.getFullYear();
    vm.today.month = vm.day.getMonth() + 1;
    vm.today.day = vm.day.getDate();
    vm.today.week = vm.day.getDay();
    vm.day = vm.day % 2 !== 0 ? (vm.day = false) : (vm.day = true);
  },
  computed: {
    city_district() {
      const vm = this;
      if (vm.select_city == "") {
        return [];
      }
      let new_district = vm.data_zHTw.data.filter((item, index) => {
        if (item.name === vm.select_city) {
          return true;
        }
        return false;
      });
      return new_district[0].districts;
    },
    get_chweek() {
      const vm = this;
      switch (vm.today.week) {
        case 1:
          return "星期一";
          break;
        case 2:
          return "星期二";
          break;
        case 3:
          return "星期三";
          break;
        case 4:
          return "星期四";
          break;
        case 5:
          return "星期五";
          break;
        case 6:
          return "星期六";
          break;
        case 7:
          return "星期日";
          break;
      }
    },
  },
  methods: {
    // 城市
    getDataCity(item) {
      const vm = this;
      vm.ft_data = vm.msk_data.filter((item, index) => {
        if (item.properties.address.indexOf(vm.select_city) >= 0) {
          return true;
        }
        return false;
      });
      console.log(vm.ft_data);
    },
    // 城市->區域
    getDataDistrict(item) {
      const vm = this;
      vm.ft_data = vm.msk_data.filter((item, index) => {
        if (item.properties.address.indexOf(vm.select_city) >= 0) {
          if (item.properties.address.indexOf(vm.select_district) >= 0) {
            return true;
          }
        }
        return false;
      });
      vm.$store
        .dispatch("changePointList", {
          data: vm.ft_data,
        })
        .then(() => {
          console.log('ok')
          this.$emit("update-point");
        });
    },
    // 左面板->list_click
    printDetailsClick(data) {
      this.$bus.$emit("carddetail:message", data);
      this.$emit("update-show", true, data);
    },
    // 縮小面板
    changMenu() {
      const vm = this;
      this.$refs.menu.classList.toggle("menu-avtive");
    },
  },
};
</script>

<style lang="scss">
.menu {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  z-index: 9999;
  width: 375px;
  transition: all 0.6s;
  @media (max-width: 768px) {
    width: 100%;
  }

  &-avtive {
    transform: translateX(-100%);
  }

  .button {
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
    right: 0;
    :focus {
      outline: none;
    }
  }
  .nav {
    width: 100%;
    background-color: #7ac3c5;
    font-size: 1.8rem;
    padding: 15px 10px;
    &-title {
      span {
        font-size: 5rem;
      }
    }
    &-area {
      width: 90%;
    }
    .fm-ctl {
      width: 100%;
      padding: 15px 10px;
      border-radius: 10px;
      cursor: pointer;
      border: transparent;
      color: #34495e;
      font-size: 1.8rem;
      font-weight: bold;
    }
  }

  .menu-cards {
    background-color: #f7f7f7;
    padding: 0px 5px;
    color: #b3b3b3;
    width: 100%;
    font-size: 1.8rem;
    height: 100%;
    overflow: auto;
  }
}
</style>