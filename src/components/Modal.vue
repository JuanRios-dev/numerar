<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal" :style="modalStyles">
            <button class="modal-close" @click="closeModal">
                <v-icon name="io-close-circle" class="icon"></v-icon>
            </button>
            <header class="modal-header">{{ title }}</header>
            <div class="modal-content">
                <div class="content">
                    <slot name="content"></slot>
                </div>
            </div>
            <footer class="modal-footer">
                <div class="content">
                    <slot name="footer"></slot>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import { addIcons } from 'oh-vue-icons';
import { IoCloseCircle } from 'oh-vue-icons/icons'

addIcons(IoCloseCircle)

export default {
    name: 'Modal',
    components: {
        IoCloseCircle
    },
    props: {
        title: {
            type: String,
            default: 'Modal Title'
        },
        width: {
            type: String,
            default: '600px'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        }
    },
    data() {
        return {
            isVisible: false
        };
    },
    computed: {
        modalStyles() {
            return {
                width: this.width,
                backgroundColor: this.backgroundColor
            };
        }
    },
    methods: {
        openModal() {
            this.isVisible = true;
            this.$emit('modal-open');
        },
        closeModal() {
            this.isVisible = false;
            this.$emit('modal-close');
        }
    }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: start;
    justify-content: center;
    z-index: 10;

    .modal {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 500px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        margin: 60px 20px 20px;

        .modal-close {
            position: absolute;
            top: 15px;
            right: 10px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: red;

            .icon {
                width: 30px;
                height: 30px;
            }
        }

        .modal-header {
            font-size: 20px;
            font-weight: bold;
            padding: 20px;
            border-bottom: 1px solid #ccc;
        }

        .modal-content {
            overflow-y: auto;
            height: 100%;
            max-height: calc(100% - 40px);
            background-color: $white;
            
            .content {
                padding: 20px;
            }
        }

        .modal-footer {
            width: 100%;
            border-top: 1px solid #ccc;

            .content {
                height: 60px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                justify-content: end;
            }
        }
    }
}
</style>
