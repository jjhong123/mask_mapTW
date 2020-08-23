<template>
  <div class="menu" ref="menu">
    <button type="button" class="button btn-close" @click="changMenu()">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        class="bi bi-x"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
        />
        <path
          fill-rule="evenodd"
          d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
        />
      </svg>
    </button>
    <div class="nav">
      <div class="nav-header">
        <img src="@/assets/img/doctor.svg" alt="doctor" />
        <div class="title" style="margin-bottom:10px;">
          <div class="title-1">貼心小提醒</div>
          <div class="title-2" v-if="day!=='all'">
            今天是身分證末一碼為
            [
            <span v-if="day==='old'">1、3、5、7、9</span>
            <span v-else-if="day==='even'">2、4、6、8、0</span>
            ]的民眾才能購買口罩唷!
          </div>
          <div class="title-2" v-else-if="day=='all'">今天都所有民眾都可以購買唷!</div>
        </div>
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
    let day = new Date();
    vm.today.year = day.getFullYear();
    vm.today.month = day.getMonth() + 1;
    vm.today.day = day.getDate();
    vm.today.week = day.getDay();
    // vm.day = vm.today.week % 2 === 0 ? "even" : "odd";
    if (vm.today.week % 2 === 0 && vm.today.week !== 0) {
      vm.day = "even";
    } else if (vm.today.week % 2 !== 0 || vm.today.week !== 0) {
      vm.day = "old";
    } else {
      vm.day = "all";
    }
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
      vm.$store.dispatch("changePointList", vm.ft_data).then(() => {
        this.$emit("update-point");
      });

      // console.log(vm.ft_data);
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
      vm.$store.dispatch("changePointList", vm.ft_data).then(() => {
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
  height: calc(100% - 50px);
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  z-index: 1002;
  width: 375px;
  transition: all 0.6s;
  background: white;
  @media (max-width: 768px) {
    width: 100%;
    height: calc(100% - 67px);
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
    font-size: 1.8rem;
    padding: 15px 16px;
    &-header {
      display: flex;
      img {
        width: 300px;
        height: auto;
      }
      .title {
        color: #00000080;
        padding: 10px 10px;
        &-1 {
          font-size: 2.5rem;
          color: #0ba29c;
          line-height: 50px;
        }
        &-2 {
          span {
            font-size: 2.2rem;
            color: #fbb03b;
          }
        }
      }
    }

    &-area {
      margin-top: 10px;
      width: 100%;
      display: inline-block;
    }
    .fm-ctl {
      width: 80%;
      padding: 15px 10px;
      display: block;
      margin: 0 auto;

      border-radius: 10px;
      cursor: pointer;
      border: transparent;
      color: #34495e;
      font-size: 1.8rem;
      font-weight: bold;
      border: 1px solid #0ba29c;
      &:focus {
        border: 2px solid #0ba29c;
        outline: none;
      }
    }
  }

  .menu-cards {
    padding: 10px 5px;
    color: #b3b3b3;
    width: 100%;
    font-size: 1.8rem;
    height: 66%;
    overflow: auto;
    @media (max-width: 768px) {
      height: 60%;
    }
  }
}
</style>