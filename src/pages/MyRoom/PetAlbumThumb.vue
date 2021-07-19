<!-- 부모 설정화면 -->
<template>
<div class="BookThumb"  @click.stop="_showDetail">
    <img class="bookimg" :src="this.info.galleryUrl"/>
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
    width: 23.5rem;
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
export default class PetAlbumThumb extends Vue {
    @Prop({default:()=>{
        return {galleryUrl: "", createdDate: "" }
    }}) private info!: { galleryUrl: string; createdDate: string };

    _showDetail(){
        this.$emit("onShowDetail", this.info );
    }
}
</script>
