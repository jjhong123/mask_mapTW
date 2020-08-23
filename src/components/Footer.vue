<template>
  <div class="footer">
    <span>口罩庫存最後更新時間：</span>
    <span>{{mskupdate}}</span>
  </div>
</template>

<script>
export default {
  props: ["mskupdate"],
  mounted() {},
};
</script>

<style lang="scss">
.footer {
  z-index: 1050;
  width: 100%;
  color: white;
  position: absolute;
  bottom: 0;
  background: #0ba29c;
  padding: 15px 20px;
  font-size: 2rem;
  display: flex;
  span {
    display: block;
  }
  @media (max-width: 768px) {
    font-size: 1.8rem;
    display: inline-block;
  }
}
</style>