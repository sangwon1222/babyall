<template>
<div>
    <div class="myRoom">
        <img src="img/home/btn_box_myroom.png" @click="_selectItem"/>
    </div>
</div>
</template>

<style lang="scss" scoped>
.myRoom {
    overflow: hidden;
	position: relative;

	display: flex;
	justify-content: center;
	width:13.5rem;
	height:13.5rem;
	padding:0.5rem;
	cursor: pointer;

	>img{ width:100%; }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components:{
    }
})
export default class MyRoom extends Vue {

    private _selectItem(){
        this.$emit('onClick')
    }
}
</script>
