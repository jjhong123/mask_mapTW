<template>
  <li class="item">
    <div>
      {{data.properties.name}}
      <div class="clearfix"></div>
    </div>
    <div class="card">
      <div class="mk-ad" :class="{'mk-ad-active':(data.properties.mask_adult===0)}">
        <div>成人口罩</div>
        <div>
          剩餘
          <span class="title">{{data.properties.mask_adult}}</span>個
        </div>
      </div>
      <div class="mk-ch" :class="{'mk-ch-active':(data.properties.mask_child===0)}">
        <div>兒童口罩</div>
        <div>
          剩餘
          <span class="title">{{data.properties.mask_child}}</span>個
        </div>
      </div>
    </div>
    <div class="address">
      <div class="title">地址：</div>
      <div class="info">{{data.properties.address}}</div>
      <div class="check">查看地址</div>
    </div>
    <div class="phone">
      <div>電話：</div>
      <div>{{data.properties.phone}}</div>
      <div class="check">撥打電話</div>
    </div>
    <div>營業時間：09:00-21:00</div>
  </li>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style lang="scss">
.cards-list {
  .item {
    background-color: white;
    margin-bottom: 20px;
    padding: 10px 15px;
    font-size: 1.6rem;
    border: 3px solid #7ac3c5;
    cursor: pointer;
    > div {
      margin-bottom: 10px;
    }
    .card {
      color: white;
      font-size: 1.6rem;
      display: flex;
      justify-content: space-between;
      
      .mk-ad {
        width: 49%;
        background: #88b5dd;
        border-radius: 0.25rem;
        padding: 5px 10px;
        .title {
          font-size: 4rem;
        }
        &-active {
          background: #b3b3b3;
        }
      }
      .mk-ch {
        width: 49%;
        background: #db8688;
        border-radius: 0.25rem;
        padding: 5px 10px;
        .title {
          font-size: 4rem;
        }
        &-active {
          background: #b3b3b3;
        }
      }
    }

    .address {
      display: flex;
      justify-content: flex-start;
      .title {
        white-space: nowrap;
      }
      .check {
        margin-left: auto;
        white-space: nowrap;
        text-decoration: underline;
      }
    }
    .phone {
      display: flex;
      justify-content: flex-start;
      .title {
        white-space: nowrap;
      }
      .check {
        margin-left: auto;
        white-space: nowrap;
        text-decoration: underline;
      }
    }
  }
}
</style>