<template>
    <button :style="{ backgroundColor: color }">
        <v-icon :name="formattedIcon" class="icon" />
        <span>{{ title }}</span>
    </button>
</template>

<script>
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import * as Icons from 'oh-vue-icons/icons';

export default {
    name: 'CustomButton',
    components: {
        'v-icon': OhVueIcon,
    },
    props: {
        title: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: false,
            default: '#074F8E'
        },
        icon: {
            type: String,
            required: true
        }
    },
    computed: {
        formattedIcon() {
            return this.icon.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
        }
    },
    created() {
        const iconImportName = this.icon;

        if (Icons[iconImportName]) {
            addIcons(Icons[iconImportName]);
        } else {
            console.error(`Icon ${iconImportName} not found in oh-vue-icons/icons`);
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    padding: 8px 12px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: $white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    outline: none;

    .icon {
        width: 15px;
        height: 15px;
        margin-right: 5px;
        color: $white;
    }

    &:hover {
        opacity: 0.9;
    }
}
</style>