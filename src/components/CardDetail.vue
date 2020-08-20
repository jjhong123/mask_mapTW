<template>
  <div class="show_details" v-if="(template_data.properties!== undefined )? true:false">
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
      console.log(vm.template_data);
    });
  },
  beforeDestroy() {
    this.$bus.$off("carddetails:message");
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
  margin-bottom: 20px;
  margin-right: 20px;
  padding: 25px;
  color: #b7b7b7;
  @media (max-width: 378px) {
    width: 100%;
    margin-bottom: unset;
    margin-right: unset;
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
        background: #88b5dd;
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
        background: #db8688;
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
