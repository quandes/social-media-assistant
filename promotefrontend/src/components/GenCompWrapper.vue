<template lang="">
    <div id="wrapperContainer">
        <SidebarMenu></SidebarMenu>
        <TextGenComp></TextGenComp>
    </div>
</template>
<script>
import SidebarMenu from './SidebarMenu.vue'
import TextGenComp from './TextGenComp.vue'
export default {
    components: {
        SidebarMenu,
        TextGenComp
    }
}
</script>
<style>
#wrapperContainer {
    display: flex;
    width: 100%;
}
</style>