<template>
    <MainLayout>
        <h1>Bienvenido</h1>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import { defineComponent } from 'vue'


export default defineComponent({
    name: 'HomeView',
    components: {
        MainLayout
    },
    setup() {
        
    }
});
</script>

<style scoped lang="scss">
h1 {
    color: $primary-color;
    margin: 0;
}
</style>