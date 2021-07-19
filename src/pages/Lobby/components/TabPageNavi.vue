<template>
  <div class="TabPageNavi">
    <div
      class="button"
      @click="onSelectTab(item)"
      v-for="item in menu"
      :key="item.label"
      ref = "button"
    >
        <!-- <img :src="item.selected == true ? require(`../../../assets/img/homenavi/${item.img}_select.png`):require(`../../../assets/img/homenavi/${item.img}_nor.png`)" /> -->
        <img :src="_getItemImage(item)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.TabPageNavi {
    width: inherit;
    height: 120px;
    display: flex;
    flex-direction: row;
    position: absolute;
    z-index:2;
    bottom: -120px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    justify-content: center;

    .button {
        margin-right:1rem;
        // border: 1px solid rgba(0, 0, 0, 1);
        // font-size: 30px;
        // width: 25%;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // background-color: #fff;
        cursor: pointer;
    }
    .button:last-child{ margin-right:0rem; }
    .button:hover {
        background-color: #ccc;
    }
}
</style>

<script  scoped>

export default {
  props: {
    menu: Array,
  },
  
  methods: {
    _getItemImage( item ){
        //item.selected == true ? require(`../../../assets/img/homenavi/${item.img}_select.png`):require(`../../../assets/img/homenavi/${item.img}_nor.png`)
        return item.selected == true ? `img/lobby/${item.img}_select.png`:`img/lobby/${item.img}_nor.png`;
    },
    onSelectTab( item ) {
        for( const item_ of this.menu ){
            if( item_ !== item ){
                item_.selected = false;
            }
        }
        item.selected = true;
        this.$emit("onSelectTab", item.pageIDX);
    },

  },
  mounted(){
      this.onSelectTab( this.menu[0] );
  },
};
</script>
