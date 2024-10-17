<template>
  <div v-if="visible" :class="['alert', type]" @click="hideAlert">
    <div class="alert-content">

      <v-icon :name="icon" class="icon"></v-icon>
      <div class="alert-message">
        <slot></slot>
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { addIcons } from 'oh-vue-icons';
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from 'oh-vue-icons/icons';

// Agregamos los íconos globalmente
addIcons(IoCheckmarkCircleSharp, IoCloseCircleSharp);

export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'success',
    }
  },
  computed: {
    // Computamos el ícono según el tipo de alerta
    icon() {
      return this.type === 'success' ? 'io-checkmark-circle-sharp' : 'io-close-circle-sharp';
    }
  },
  data() {
    return {
      visible: true
    };
  },
  methods: {
    hideAlert() {
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.alert {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: absolute;
  right: 40px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(0);
}

.alert.success {
  background-color: #e6ffed;
  color: #276749;
  border-left: 5px solid #276749;
}

.alert.error {
  background-color: #ffe6e6;
  color: #a71d2a;
  border-left: 5px solid #a71d2a;
}

.alert:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.alert-content {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 10px;
  }
}

.alert-message {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.alert.success .alert-icon {
  color: #276749;
}

.alert.error .alert-icon {
  color: #a71d2a;
}
</style>
