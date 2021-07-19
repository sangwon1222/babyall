<!-- 부모 설정화면 -->
<template>
<div class="BookThumb"  @click.stop="_showDetail">
    <img class="bookimg" :src="info.galleryUrl"/>
</div>
</template>

<style lang="scss" scoped>
.BookThumb{
    margin: 0.5rem;
    margin-bottom: 1rem;
    position: relative;
    cursor: pointer;
}

.bookimg{
    width: 13rem;
    height: 9.5rem;
    border-radius: 20px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
}

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components:{
    }
})
export default class MakingBookThumb extends Vue {
    // @Prop({default:`http://www.imestudy.co.kr:8080/package/bookcover/1001_cover.png`}) private imagePath: string;
    @Prop({default: {galleryUrl:"", createdDate:"" } }) private info: string;

    _showDetail(){
        this.$emit("onShowDetail", this.info );
    }
}
</script>
