<template>
  <div>
    <div id="timeOfDay_lay" style="margin-top: 30px">
      <div class="start" v-html="format(start)"></div>
      <div class="end" v-html="format(end)"></div>

      <!-- 竖线 -->
      <VerticalLines v-bind:vertical-lines="verticalLines"></VerticalLines>

      <!-- 横向标识线 -->
      <HorizontalLines
        v-bind:horizontal-lines="horizontalLines"
      ></HorizontalLines>

      <div
        class="timeSec"
        v-for="(item, index) in handlers"
        :key="index"
        :data-index="index"
        v-bind:style="{ left: item.left + 'px' }"
      ></div>
    </div>
  </div>
</template> 
<script>
import { Drag } from "./../lib/Drag.js";
import { EleResize } from "./../lib/EleResize.js";

import VerticalLines from "./VerticalLines.vue";
import HorizontalLines from "./HorizontalLines.vue";
export default {
  components: {
    VerticalLines,
    HorizontalLines,
  },
  props: ["startTime", "endTime", "timePart"],
  data() {
    return {
      title: "时间线",
      start: "2021/02/03 10:00",
      end: "2021/02/03 19:00",
      section: [
        ["2021/02/03 10:00", "2021/02/03 12:00"],
        ["2021/02/03 12:00", "2021/02/03 19:00"],
      ],
      handlers: [],
      verticalLines: [],
      horizontalLines: [],
      handleIndex: -1,
      totalDuring: 0,
      execTime: 0,
      areaWidth: 0,

      sublings: [], //所有控制点
    };
  },
  filters: {
    format: function (v) {
      return v.split(" ")[1];
    },
  },
  methods: {
    format: function (v) {
      return v.split(" ").join("<br>");
    },
    resetRange: function (dragInstance) {
      if (this.sublings.length === 0) {
        var sublings = dragInstance.drag.parentNode.children;
        var tmp = [];
        var currIndex = -1;
        for (var i = 0; i < sublings.length; i++) {
          if (sublings[i].className === "timeSec") {
            tmp.push(sublings[i]);
          }
        }
        this.sublings = tmp;
      } else {
        tmp = this.sublings;
      }

      //只有一个点的时间
      if (tmp.length === 1) {
        dragInstance.options.range = [0, this.areaWidth];
        return;
      }

      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] === dragInstance.drag) {
          currIndex = i;
        }
      }
      if (currIndex === 0) {
        //console.log(tmp[currIndex - 1].style.left.replace("px", ""));
        dragInstance.options.range = [
          0,
          tmp[currIndex + 1]
            ? tmp[currIndex + 1].style.left.replace("px", "") * 1
            : this.areaWidth,
        ];
      } else if (currIndex > 0) {
        dragInstance.options.range = [
          tmp[currIndex - 1].style.left.replace("px", "") * 1,
          tmp[currIndex + 1]
            ? tmp[currIndex + 1].style.left.replace("px", "") * 1
            : this.areaWidth,
        ];
      }

      // console.log(dragInstance.options.range);
      this.handleIndex = currIndex;
    },
    handleMove: function (x) {
      if (new Date().getTime() - this.execTime < 10) {
        console.log("间隔太小 待下次执行");
        this.execTime = new Date().getTime();
        return false;
      }
      this.execTime = new Date().getTime();

      //通过划动距离 计算确切的时间
      var percent = x / this.areaWidth;
      //划到的时间点
      let t = new Date(
        this.totalDuring * percent + new Date(this.startTime).getTime()
      );
      let y = t.getFullYear();
      let m = t.getMonth() + 1;
      let d = t.getDate();
      let h = t.getHours();
      let M = t.getMinutes();

      let tmp =
        y +
        "/" +
        (m >= 10 ? m : "0" + m) +
        "/" +
        (d >= 10 ? d : "0" + d) +
        " " +
        (h >= 10 ? h : "0" + h) +
        ":" +
        (M >= 10 ? M : "0" + M);
      // console.log(tmp);

      //重置this.section
      if (this.handleIndex === 0) {
        this.section[this.handleIndex][0] = tmp;
      } else if (this.handleIndex > 0) {
        this.section[this.handleIndex - 1][1] = tmp;

        this.section[this.handleIndex] &&
          (this.section[this.handleIndex][0] = tmp);
      }

      // console.log(this.section);
      this.initNext();
    },
    handleUp: function () {
      this.$emit("update:timePart", this.section);
    },
    initNext: function () {
      this.$nextTick(() => {
        //根据时间段生成指针(先处理最简单)
        //都是连续的时间段且是从startTime开始的
        this.createHandler();

        //生成竖向指示线
        this.createVerticalLine();

        //生成横向范围标识线
        this.createHorizontalLine();
      });
    },
    init: function () {
      this.totalDuring =
        new Date(this.endTime).getTime() - new Date(this.startTime).getTime();
      this.areaWidth = document.getElementById("timeOfDay_lay").offsetWidth;
      let _this = this;
      let timeOfday = new Drag({
        dragRangeDom: document.getElementById("timeOfDay_lay"),
        dragAimClass: "timeSec",
        // downFun: this.resetRange,
        downFun: function () {
          _this.resetRange(timeOfday);
        },
        moveFun: this.handleMove,
        upFun: this.handleUp,
      });
    },
    initTime: function () {
      let t = new Date();
      let y = t.getFullYear();
      let m = t.getMonth() + 1;
      let d = t.getDate();

      this.time =
        y + "/" + (m >= 10 ? m : "0" + m) + "/" + (d >= 10 ? d : "0" + d);
    },
    createHandler: function () {
      //每一项的[1]做为指针指向的时间
      //再根据第一个指针所对应的时间 算出在时间轴上的位置
      let startTime = new Date(this.startTime).getTime();
      let tmp = [
        {
          left:
            ((new Date(this.section[0][0]).getTime() - startTime) /
              this.totalDuring) *
            this.areaWidth,
          time: this.section[0][0],
        },
      ];
      for (let i = 0; i < this.section.length; i++) {
        tmp.push({
          left:
            ((new Date(this.section[i][1]).getTime() - startTime) /
              this.totalDuring) *
            this.areaWidth,
          time: this.section[i][1],
        });
      }

      // console.log(tmp);
      this.handlers = tmp;
    },
    createVerticalLine: function () {
      let startTime = new Date(this.startTime).getTime();
      //根据this.handlers生成坚向的指示线
      this.verticalLines = [
        {
          left:
            ((new Date(this.section[0][0]).getTime() - startTime) /
              this.totalDuring) *
            this.areaWidth,
          time: this.startTime,
        },
      ].concat(this.handlers);
      // console.log(this.verticalLines);
    },
    caleDuring: function (s, e) {
      var s = new Date(s).getTime();
      var e = new Date(e).getTime();

      var seconds = (e - s) / 1000;

      return seconds;
    },
    createHorizontalLine: function () {
      //根据this.verticalLines生成间隔的线段
      var tmp = [];
      for (var i = 0; i < this.verticalLines.length; i++) {
        if (i == 0) {
          continue;
        }

        tmp.push({
          rangeStartTime: this.startTime, //时间轴开始
          rangeEndTime: this.endTime, //时间轴结束
          startTime: this.verticalLines[i - 1].time, //时间段开始
          endTime: this.verticalLines[i].time, //时间段开始
          // during: this.caleDuring(
          //   this.verticalLines[i - 1].time,
          //   this.verticalLines[i].time
          // ),
          percent:
            (this.verticalLines[i].left - this.verticalLines[i - 1].left) /
            this.areaWidth, //当前段的长度占总长的的比例
          left: this.verticalLines[i - 1].left,
          width: this.verticalLines[i].left - this.verticalLines[i - 1].left,
        });
      }

      // console.log(tmp);
      this.horizontalLines = tmp;
    },
    resize: function () {
      this.$nextTick(() => {
        this.areaWidth = document.getElementById("timeOfDay_lay").offsetWidth;
        this.initNext();
      });
    },
  },
  mounted() {
    // this.initTime();
    this.$nextTick(this.init);
    EleResize.on(
      document.getElementById("timeOfDay_lay"),
      this.resize.bind(this)
    );
  },
  destroyed() {
    EleResize.off(
      document.getElementById("timeOfDay_lay"),
      this.resize.bind(this)
    );
  },
  watch: {
    startTime: {
      handler: function (v) {
        if (v) {
          this.start = v;
        }
      },
      immediate: true,
    },
    endTime: {
      handler: function (v) {
        if (v) {
          this.end = v;
        }
      },
      immediate: true,
    },
    timePart: {
      handler: function (v) {
        if (v) {
          if (Object.prototype.toString.call(v) === "[object Array]") {
            //必须是数级
            // console.log("数组");
            // console.log(v);
            this.section = v;
            this.$nextTick(this.initNext);
          } else {
          }
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
#timeOfDay_lay {
  width: 100%;
  border-top: solid blue 2px;
  position: relative;
  background: blue;
  user-select: none;
}
.timeSec {
  width: 0px;
  height: 0px;
  border-top: solid transparent 10px;
  border-left: solid red 10px;
  border-right: solid transparent 10px;
  border-bottom: solid transparent 4px;

  top: 0;
  left: 0;
  position: absolute;
  transform-origin: 0% 0%;
  transform: rotate(20deg);
  /* background: red; */
}
.start {
  position: absolute;
  text-align: left;
  left: 0;
  top: -30px;
  font-size: 12px;
  line-height: 14px;
  pointer-events: none;
}
.end {
  position: absolute;
  text-align: right;
  right: 0;
  top: -30px;
  font-size: 12px;
  line-height: 14px;
  pointer-events: none;
}
</style>