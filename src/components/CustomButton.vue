<template>
    <button :style="{ backgroundColor: color, color: iconColor }" class="small-button">
        <v-icon :name="formattedIcon" class="icon" />
    </button>
</template>

<script>
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import * as Icons from 'oh-vue-icons/icons';

export default {
    name: 'SmallButton',
    components: {
        'v-icon': OhVueIcon,
    },
    props: {
        color: {
            type: String,
            required: false,
            default: '#074F8E'
        },
        icon: {
            type: String,
            required: true
        },
        iconColor: {
            type: String,
            required: false,
            default: '#FFFFFF' 
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
.small-button {
    padding: 4px 8px; /* Reduce el padding para un botón más pequeño */
    margin-left: 5px; /* Ajusta el margen si es necesario */
    display: flex;
    align-items: center;
    color: $white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    outline: none;

    .icon {
        width: 12px; /* Ajusta el tamaño del icono */
        height: 12px;
    }

    &:hover {
        opacity: 0.9;
    }
}
</style>
