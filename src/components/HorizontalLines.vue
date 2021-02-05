<template>
  <div>
    <div
      class="horizontalLine"
      v-for="(item, index) in horizontalLines"
      v-if="index > 0"
      :key="index"
      v-bind:style="{ left: item.left + 'px', width: item.width + 'px' }"
    >
      <HorizontalTip v-bind:sec-obj="item"></HorizontalTip>
    </div>
  </div>
</template>

<script>
import HorizontalTip from "./HorizontalTip.vue";
export default {
  components: {
    HorizontalTip,
  },
  props: ["horizontalLines"],
  data() {
    return {
      // lines: [],
    };
  },
  // watch: {
  //   horizontalLines: {
  //     handler: function (v) {
  //       this.lines = v;
  //     },
  //     immediate: true,
  //   },
  // },
};
</script>

<style scoped>
.horizontalLine {
  position: absolute;
  top: 17px;
  height: 0;
  line-height: 0;
  border-top: dashed #333 1px;
}
.horizontalLine:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 8px;
  height: 8px;
  /* background:red; */
  box-sizing: border-box;
  border-left: solid blue 1px;
  border-top: solid blue 1px;
  transform-origin: 0% 0%;
  transform: scale(1, 0.5) rotate(-45deg);
}
.horizontalLine:after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  display: block;
  width: 8px;
  height: 8px;
  /* background:red; */
  box-sizing: border-box;
  border-top: solid blue 1px;
  border-right: solid blue 1px;
  transform-origin: 100% 0%;
  transform: scale(1, 0.5) rotate(45deg);
}
</style>