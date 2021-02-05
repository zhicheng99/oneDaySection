<template>
  <div class="tip">
    <span v-if="obj.width > 50">{{ obj.during }}</span>
    <span v-else>...</span>
  </div>
</template>

<script>
export default {
  props: ["secObj"],
  data() {
    return {
      obj: null,
      callTime: 0,
    };
  },
  filters: {
    secondsFormat: function (s) {
      var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
      var hour = Math.floor((s - day * 24 * 3600) / 3600);
      var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
      // var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
      return day > 0 ? day + "天" : "" + hour + "时" + minute + "分";
    },
  },
  methods: {
    secondsFormat: function (s) {
      var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
      var hour = Math.floor((s - day * 24 * 3600) / 3600);
      var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
      // var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
      return day > 0 ? day + "天" : "" + hour + "时" + minute + "分";
    },
    init: function () {
      // if (new Date().getTime() - this.callTime < 200) {
      //   this.callTime = new Date().getTime();
      //   return false;
      // }
      // this.callTime = new Date().getTime();

      //开始计算时间间隔
      this.obj = {
        ...this.obj,
        ...{
          during: this.caleDuring(this.obj.startTime, this.obj.endTime),
        },
      };
      // console.log(this.obj);
    },
    caleDuring: function (s, e) {
      var s = new Date(s).getTime();
      var e = new Date(e).getTime();

      var seconds = (e - s) / 1000;

      return this.secondsFormat(seconds);
    },
  },
  watch: {
    secObj: {
      handler: function (v) {
        if (v) {
          this.obj = v;
          this.$nextTick(this.init);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.tip {
  font-size: 12px;
  color: blue;
  pointer-events: none;
  text-align: center;
}
.tip span {
  background: #fff;
}
</style>