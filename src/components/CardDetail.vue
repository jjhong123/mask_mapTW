<template>
  <div class="show_details" v-if="(template_data.properties!== undefined )? true:false">
    <button type="button" class="button btn-close" @click="deletePanel()">
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
    <div class="card">
      <div class="title">{{template_data.properties.name}}</div>
      <div class="address">地址：{{template_data.properties.address}}</div>
      <div class="phone">電話：{{template_data.properties.phone}}</div>
      <div class="mask-num">
        <div class="adult" :class="{'adult-active':(template_data.properties.mask_adult===0)}">
          <div>成人口罩</div>
          <div>
            剩餘
            <span class="title">{{template_data.properties.mask_adult}}</span>個
          </div>
        </div>
        <div class="child" :class="{'child-active':(template_data.properties.mask_child===0)}">
          <div>兒童口罩</div>
          <div>
            剩餘
            <span class="title">{{template_data.properties.mask_child}}</span>個
          </div>
        </div>
      </div>
      <div class="note">備註：{{template_data.properties.note}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      template_data: {},
    };
  },
  created() {
    const vm = this;
    this.$bus.$on("carddetail:message", (msg) => {
      vm.template_data = Object.assign({}, msg);
    });
  },
  beforeDestroy() {
    this.$bus.$off("carddetails:message");
  },
  methods: {
    deletePanel() {
      const vm = this;
      vm.template_data = Object.assign({}, null);
    },
  },
};
</script>

<style lang="scss">
.show_details {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 400px;
  height: 300px;
  background: white;
  z-index: 999;
  border-radius: 10px;
  border: 5px solid #7ac3c5;
  margin-bottom: 66px;
  margin-right: 20px;
  padding: 25px;
  color: #b7b7b7;

  button {
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

  @media (max-width: 768px) {
    width: 100%;
    margin: unset;
    margin-bottom: 66px;
  }
  .card {
    font-size: 1.6rem;
    > div {
      margin-bottom: 25px;
    }
    .title {
      font-size: 1.8rem;
      font-weight: bold;
    }
    .address {
      line-height: 2.5rem;
    }
    .mask-num {
      width: 100%;
      display: flex;
      color: white;
      .adult {
        width: 48%;
        background: #0ba29c;
        border-radius: 0.25rem;
        padding: 5px 10px;
        margin-right: calc(100% - 96%);
        .title {
          font-size: 3rem;
        }
        &-active {
          background: #b3b3b3;
        }
      }
      .child {
        width: 48%;
        background: #d4145a;
        border-radius: 0.25rem;
        padding: 5px 10px;
        .title {
          font-size: 3rem;
        }
        &-active {
          background: #b3b3b3;
        }
      }
    }
  }
}
</style>
