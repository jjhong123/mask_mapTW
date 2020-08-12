<template>
  <div class="show_details">
    <div class="card">
      <div class="title">XX藥局</div>
      <div class="address">地址：DDDDDDDDDDDDDDD</div>
      <div class="phone">電話：DDDDDDDD</div>
      <div class="mask-num">
        <div class="adult">
          <div>成人口罩</div>
          <div>
            剩餘
            <span class="title">0</span>個
          </div>
        </div>
        <div class="child">
          <div>兒童口罩</div>
          <div>
            剩餘
            <span class="title">1245</span>個
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
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
  border-radius: 10px ;
  border: 5px solid #7ac3c5;
  margin-bottom: 20px;
  margin-right: 20px;
  padding: 25px;
  color: #b7b7b7;
  .card {
    font-size: 1.8rem;
    > div {
      margin-bottom: 25px;
    }
    .title {
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
      }
      .child {
        width: 48%;
        background: #db8688;
        border-radius: 0.25rem;
        padding: 5px 10px;
        .title {
          font-size: 3rem;
        }
      }
    }
  }
}
</style>