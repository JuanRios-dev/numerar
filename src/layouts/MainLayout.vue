<template>
  <div class="main-layout">
    <header class="main-header">
      <div class="top-bar">
        <div class="logo">
          <h1>Numerar</h1>
        </div>
        <div class="option">
          <div class="select-wrapper">
            <select class="styled-select" v-model="selectedCompany" @change="updateCompany">
              <option disabled value="">Select Company</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
          <div class="notify-icon">
            <v-icon name="io-notifications-circle-sharp" class="icon" />
          </div>
          <div class="user-icon">
            <v-icon name="fa-user-circle" class="icon" />
            <div class="submenu">
              <ul>
                <li @click="Logout">Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <nav class="nav-bar">
      <ul class="menu">
        <router-link :to="{ name: 'home' }">
          <v-icon name="co-home" class="icon" />
          Inicio
        </router-link>
        <a href="#">
          <v-icon name="gi-shopping-cart" class="icon" />
          Vender
        </a>
        <a href="#" class="has-submenu">
          <v-icon name="ri-contacts-book-line" class="icon" />
          Terceros
          <ul class="submenu">
            <li><router-link :to="{ name: 'customers' }">Clientes</router-link></li>
            <li><router-link :to="{ name: 'providers' }">Proveedores</router-link></li>
          </ul>
        </a>
        <a href="#" class="has-submenu">
          <v-icon name="fa-boxes" class="icon" />
          Inventario
          <ul class="submenu">
            <li><router-link :to="{ name: 'products' }">Productos</router-link></li>
            <li><a href="#">Movimientos</a></li>
            <li><a href="#">Traslados</a></li>
            <li><a href="#">Compras</a></li>
          </ul>
        </a>
        <a href="#" class="has-submenu">
          <v-icon name="io-bar-chart-sharp" class="icon" />
          Estadisticas
          <ul class="submenu">
            <li><a href="#">Financieras</a></li>
            <li><a href="#">Ventas</a></li>
            <li><a href="#">Inventario</a></li>
            <li><a href="#">Operativas</a></li>
          </ul>
        </a>
        <a href="#" class="has-submenu">
          <v-icon name="gi-calculator" class="icon" />
          Contabilidad
          <ul class="submenu">
            <li><a href="#">Cuentas</a></li>
            <li><a href="#">Comprobantes</a></li>
            <li><a href="#">Libro Mayor</a></li>
            <li><a href="#">Transacciones</a></li>
          </ul>
        </a>
        <a href="#" class="has-submenu">
          <v-icon name="io-settings-outline" class="icon" />
          Configuración
          <ul class="submenu">
            <li><router-link :to="{ name: 'companies' }">Tiendas</router-link></li>
            <li><a href="#">Usuarios</a></li>
          </ul>
        </a>
      </ul>
    </nav>
    <main class="main">
      <div class="content">
        <slot />
      </div>
    </main>
    <footer class="footer">
      <div class="content">
        <h6>Numerar © Ryos SmartConnect Corporation - Sistema Pos Contable</h6>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/AuthStore';
import { defineComponent, computed } from 'vue';
import { addIcons } from 'oh-vue-icons';
import {
  FaUserCircle,
  IoNotificationsCircleSharp,
  CoHome,
  GiShoppingCart,
  RiContactsBookLine,
  FaBoxes,
  IoBarChartSharp,
  GiCalculator,
  IoSettingsOutline
} from 'oh-vue-icons/icons';

addIcons(
  FaUserCircle,
  IoNotificationsCircleSharp,
  CoHome,
  GiShoppingCart,
  RiContactsBookLine,
  FaBoxes,
  IoBarChartSharp,
  GiCalculator,
  IoSettingsOutline
);

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const authStore = useAuthStore();

    const companies = computed(() => {
      return Object.entries(authStore.companies).map(([id, name]) => ({
        id,
        name,
      })) || [];
    });

    const selectedCompany = computed(() => authStore.selectedCompanyId);

    const updateCompany = (event) => {
      const companyId = event.target.value;
      authStore.setSelectedCompanyId(companyId);

      window.location.reload();
    };

    const Logout = async () => {
      const success = await authStore.logout();
      if (success) {
        console.log("Logout exitoso");
        window.location.reload();
      } else {
        console.error("Error al cerrar sesión");
      }
    };

    return {
      companies,
      selectedCompany,
      updateCompany,
      Logout
    };
  },
});
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  position: relative;

  .main-header {
    background: $primary-color;
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: 70px;
    z-index: 10;

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 2rem;

      .logo {
        color: $white;
      }

      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .select-wrapper {
          position: relative;
          display: inline-block;

          .styled-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            padding: 8px 60px 8px 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: $white;
            font-size: 14px;
            font-weight: 400;
            color: $black;
            cursor: pointer;

            &:focus {
              outline: none;
              border-color: #888;
            }
          }

          &::after {
            content: '﹀';
            font-size: 12px;
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            pointer-events: none;
            color: #000;
          }
        }

        .notify-icon {
          .icon {
            width: 24px;
            height: 24px;
            color: $white;
            margin-left: 20px;
          }
        }

        .user-icon {
          position: relative;

          .icon {
            width: 40px;
            height: 40px;
            color: $white;
            margin-left: 20px;
            cursor: pointer;
          }

          .submenu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background-color: $white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

            ul {
              list-style: none;
              padding: 0;
              margin: 0;

              li {
                padding: 10px 15px;
                cursor: pointer;

                &:hover {
                  background-color: $light-gray;
                }
              }
            }
          }

          &:hover .submenu {
            display: block;
          }
        }
      }
    }
  }

  .nav-bar {
    position: fixed;
    width: 100%;
    background: $white;
    display: flex;
    align-items: center;
    margin-top: 70px;

    .menu {
      width: 100%;
      display: flex;
      align-items: center;
      margin: 0;

      a {
        padding: 20px 3.5rem 20px 0;
        text-decoration: none;
        color: $gray;
        display: flex;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 500;
        position: relative;

        .icon {
          width: 20px;
          height: 20px;
          color: $gray;
          margin-right: 10px;
          transition: .3s ease;
        }

        &:hover {
          color: $primary-color;

          .icon {
            color: $primary-color;
            transform: scale(1.2);
            transition: .3s ease;
          }
        }

        &.has-submenu {
          cursor: pointer;

          .submenu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: $white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;

            li {
              a {
                padding: 15px 0 15px 30px;
                white-space: nowrap;
                display: block;
                color: $gray;
                text-decoration: none;

                &:hover {
                  background: $primary-color;
                  color: $white;
                }
              }
            }
          }
        }

        &:hover .submenu {
          display: block;
        }

      }

    }
  }

  .main {
    margin-top: 130px;

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: $white;
      border-radius: 10px;
      margin: 20px;
      padding: 20px;
    }
  }

  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 0;

    .content {
      background: $primary-color;
      width: 100%;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      h6 {
        color: $white;
        margin: 0;
      }
    }
  }
}
</style>