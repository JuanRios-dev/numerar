import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            user: null,
            token: null,
            companies: [],
            selectedCompanyId: null
        }
    },
    getters: {
        getToken: (state) => state.token,
        getUser: (state) => state.user,
        isAuthenticated: (state) => !!state.token,
        isCompanies: (state) => state.companies.length > 0,
        isSelectedCompanyId: (state) => state.selectedCompanyId,
    },
    actions: {
        async login(credentials) {
            try {
                const response = await axios.post('/login', credentials);
                const { user, token, companies } = response.data;
                
                this.user = user;
                this.token = token;
                this.companies = companies;
                this.selectedCompanyId = Object.keys(companies)[0];

                return true;
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
            }
        },
        async logout() {
            try {
                await axios.post('/logout'); // Realiza la solicitud para cerrar sesión

                // Limpia el estado
                this.user = null;
                this.token = null;
                this.companies = [];
                this.selectedCompanyId = null;

                return true;
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                return false; // Devuelve false si hubo un error
            }
        },
        setSelectedCompanyId(companyId) {
            this.selectedCompanyId = companyId;
        }
    },
    persist: true,
})
