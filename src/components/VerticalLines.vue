<template>
  <div>
    <div
      class="verticalLine"
      v-for="(item, index) in verticalLines"
      :key="index"
      v-bind:style="{ left: item.left + 'px' }"
    >
      <div>{{ item.time | format }}</div>
    </div>
  </div>
</template> 

<script>
export default {
  props: ["verticalLines"],
  data() {
    return {
      // lines: [],
    };
  },
  filters: {
    format: function (v) {
      return v.split(" ")[1];
    },
  },
  // watch: {
  //   verticalLines: {
  //     handler: function (v) {
  //       this.lines = v;
  //     },
  //     immediate: true,
  //   },
  // },
};
</script>

<style scoped>
.verticalLine {
  position: absolute;
  top: 2px;
  width: 0;
  height: 30px;
  border-left: dashed #333 1px;
  pointer-events: none;
}
.verticalLine div {
  position: absolute;
  bottom: -12px;
  left: 0;
  white-space: nowrap;
  font-size: 12px;
  transform-origin: 0% 50%;
  transform: rotate(35deg);
  pointer-events: none;
}
</style>