<template>
  <div class="Loading" v-if="loading_type">
    <div class="js-loading-mask loading-mask">
      <div class="title">
        <span>口罩地圖</span>
        <span>Mask For Taiwan</span>
      </div>
      <div class="loading-sets">
        <div class="loading loading-0"></div>
        <div class="loading loading-1"></div>
        <div class="loading loading-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['loading_type']
};
</script>

<style lang="scss">
.Loading {
  z-index: 999999;
  width: 100%;
  height: 100%;
  position: absolute;
  background: white;

  .title {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.8rem;
    // display: flex;
    span {
      font-weight: bold;
      display: inline-block;
    }
  }

  .loading-mask {
    position: fixed;
    z-index: 9999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f4f4f4;
    top: 0;
    height: 100%;
    transition: all 1s;
    transition-timing-function: ease;
  }
  .loading-mask.is-remove {
    top: -20px;
    height: 0;
  }

  .loading-sets {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -5px;
    margin-left: -20px;
  }

  .loading {
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 100%;
    float: left;
    margin-right: 5px;
  }

  .loading-0 {
    animation: bounce 1s infinite ease;
    animation-delay: 0.1s;
    background: #f44336;
  }

  .loading-1 {
    animation: bounce 1s infinite ease;
    animation-delay: 0.3s;
    background: #4caf50;
  }

  .loading-2 {
    animation: bounce 1s infinite ease;
    animation-delay: 0.5s;
    background: #2196f3;
  }

  @keyframes bounce {
    0%,
    100% {
      opacity: 1;
    }
    60% {
      opacity: 0;
    }
  }
}
</style>