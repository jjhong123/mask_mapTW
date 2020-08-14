<template>
  <div id="menu">
    <CardDetail />
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
    <div class="menu-label">
      <ul class="menu__list">
        <li class="menu__list__item menu__list__item--active">全部口罩</li>
        <li class="menu__list__item">成人口罩</li>
        <li class="menu__list__item">兒童口罩</li>
      </ul>
    </div>
    <div class="menu-cards">
      <ul class="cards-list">
        <Card v-for="(item,index) in ft_data" :key="index" :data="item" @click.native="printDetailsClick(item)"/>
      </ul>
    </div>
  </div>
</template>

<script>
import data_zHTw from "@/data_zHTw.js";
import Card from "./Card";
import axios from "axios";
import CardDetail from "./CardDetail";

export default {
  props: ["msk_data"],
  components: {
    Card,
    CardDetail,
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
    },
    // 左面板->list_click
    printDetailsClick(data) {
      this.$bus.$emit("carddetail:message",data);
      this.$emit("update-show",true,data);
    }
  },
};
</script>

<style lang="scss">
#menu {
  width: 400px;
  height: 100vh;
  float: left;
  color: white;
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
  .menu-label {
    .menu__list {
      padding: 15px 15px;
      background: #f7f7f7;
      display: flex;
      justify-content: space-around;
      &__item {
        width: 85px;
        padding: 5px 5px;
        border-radius: 10px;
        cursor: pointer;
        border: 1px solid #7ac3c5;
        font-size: 1.8rem;
        font-weight: bold;
        color: #7ac3c5;
        text-align: center;
        &--active {
          background: #7ac3c5;
          color: white;
        }
      }
    }
  }
  .menu-cards {
    background-color: #f7f7f7;
    padding: 0px 5px;
    color: #b3b3b3;
    width: 100%;
    font-size: 1.8rem;
    height: calc(100% - 297px);
    overflow: auto;
  }
}
</style>