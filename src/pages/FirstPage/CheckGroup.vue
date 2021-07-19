<template>
  <div class="check-group">
    <div class="checkbox" v-for="(info, idx) in datalist" :key="info.label">
      <input
        type="radio"
        name="chk_info"
        value="1"
        class="checker"
        :checked="info.checked"
        @click="selectItem(idx)"
      />
      <label>{{ info.label }}</label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  .checker {
    padding: 10px;
    font-size: 1.5rem;
    display: inline-block;
    width: 47px;
    height: 33px;
    border: 2px solid #e8dcdc;
    cursor: pointer;
    border-radius: 5px;
  }
}
label{
    font-size: 1.5rem;
    padding: 0.5rem;
}
</style>

<script>
export default {
  data() {
    return {};
  },
  props: {
    datalist: Array
  },
  methods: {
    selectItem(idx) {
      this.$emit("onSelectItem", idx);
    }
  }
};
</script>
