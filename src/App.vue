<template>
  <div id="app">
    <TimeOfDay
      v-bind:start-time="startTime"
      v-bind:end-time="endTime"
      v-bind:time-part.sync="section"
    ></TimeOfDay>
  </div>
</template>

<script>
import TimeOfDay from "./components/TimeOfDay.vue";

export default {
  name: "App",
  data() {
    return {
      startTime: "2021/02/03 10:00",
      endTime: "2021/02/03 19:00",
      section: [
        ["2021/02/03 10:00", "2021/02/03 12:01"],
        ["2021/02/03 12:01", "2021/02/03 15:35"],
      ],
    };
  },
  methods: {
    fun: function () {
      console.log(this.section);
    },
  },
  components: {
    TimeOfDay,
  },
  watch: {
    section: {
      handler: function (v) {
        console.log(v);
      },
      deep: true,
    },
  },
};
</script>

<style>
#app {
}
</style>
