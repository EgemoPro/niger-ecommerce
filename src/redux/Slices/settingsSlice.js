import { createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios";

const initialState = {
    // Thème et apparence
    darkMode: false,
    language: 'fr',
    theme: 'default',
    
    // Notifications
    notifications: {
        push: true,
        email: true,
        sms: false,
        marketing: false
    },
    
    // Interface utilisateur
    ui: {
        sidebar: {
            collapsed: false,
            position: 'left'
        },
        animations: true,
        compactMode: false
    },
    
    // Page produit
    productPage: {
        headerVisibility: false,
        content: {
            /**
             * Structure unifiée pour le suivi du scroll
             * @typedef {Object} ScrollState
             * @property {boolean} isScrolling - Indique si l'utilisateur fait défiler actuellement
             * @property {boolean} isBottom - Indique si l'utilisateur a atteint le bas de la liste
             * @property {Object} metrics - Métriques brutes du DOM
             * @property {number} metrics.scrollTop - Position de défilement actuelle
             * @property {number} metrics.scrollHeight - Hauteur totale du contenu défilable
             * @property {number} metrics.clientHeight - Hauteur visible du conteneur
             * @property {Object} options - Options de configuration pour le défilement
             * @property {boolean} options.smooth - Active le défilement fluide
             * @property {number} options.duration - Durée des animations de défilement (ms)
             */
            scroll: {
                isScrolling: false,
                isBottom: false,
                metrics: {
                    scrollTop: 0,
                    scrollHeight: 0,
                    clientHeight: 0
                },
                options: {
                    smooth: true,
                    duration: 300
                }
            },
            layout: 'grid', // 'grid' | 'list'
            itemsPerPage: 12
        }
    },
    
    // Préférences utilisateur
    preferences: {
        currency: 'EUR',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'fr-FR'
    },
    
    // État
    isLoading: false,
    error: null
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        // Thème
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
        
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        
        // Notifications
        updateNotificationSettings: (state, action) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
        
        toggleNotification: (state, action) => {
            const { type } = action.payload;
            if (type in state.notifications) {
                state.notifications[type] = !state.notifications[type];
            }
        },
        
        // Interface
        updateUISettings: (state, action) => {
            state.ui = { ...state.ui, ...action.payload };
        },
        
        toggleSidebar: (state) => {
            state.ui.sidebar.collapsed = !state.ui.sidebar.collapsed;
        },
        
        setSidebarPosition: (state, action) => {
            state.ui.sidebar.position = action.payload;
        },
        
        // Page produit
        setProductPage: (state, action) => {
            state.productPage = { ...state.productPage, ...action.payload };
        },
        
        setProductLayout: (state, action) => {
            state.productPage.content.layout = action.payload;
        },
        
        // Scroll tracking - Reducers dédiés
        updateScrollMetrics: (state, action) => {
            const { scrollTop, scrollHeight, clientHeight } = action.payload;
            state.productPage.content.scroll.metrics = {
                scrollTop: scrollTop || 0,
                scrollHeight: scrollHeight || 0,
                clientHeight: clientHeight || 0
            };
        },
        
        setIsScrolling: (state, action) => {
            state.productPage.content.scroll.isScrolling = action.payload;
        },
        
        setIsBottom: (state, action) => {
            state.productPage.content.scroll.isBottom = action.payload;
        },
        
        updateScrollOptions: (state, action) => {
            state.productPage.content.scroll.options = {
                ...state.productPage.content.scroll.options,
                ...action.payload
            };
        },
        
        // Reducer umbrella pour mise à jour complète du scroll
        updateScroll: (state, action) => {
            state.productPage.content.scroll = {
                ...state.productPage.content.scroll,
                ...action.payload
            };
        },
        
        // Préférences
        updatePreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        
        setCurrency: (state, action) => {
            state.preferences.currency = action.payload;
        },
        
        // État global
        resetSettings: (state) => {
            return { ...initialState };
        },
        
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        clearError: (state) => {
            state.error = null;
        }
    }
});

// Actions
export const {
    // Thème
    setDarkMode,
    toggleDarkMode,
    setLanguage,
    setTheme,
    
    // Notifications
    updateNotificationSettings,
    toggleNotification,
    
    // Interface
    updateUISettings,
    toggleSidebar,
    setSidebarPosition,
    
    // Page produit
    setProductPage,
    setProductLayout,
    
    // Scroll tracking
    updateScrollMetrics,
    setIsScrolling,
    setIsBottom,
    updateScrollOptions,
    updateScroll,
    
    // Préférences
    updatePreferences,
    setCurrency,
    
    // État
    resetSettings,
    setLoading,
    setError,
    clearError
} = settingsSlice.actions;

// Sélecteurs
export const settingsSelectors = {
    // Sélecteurs généraux
    selectDarkMode: (state) => state.settings.darkMode,
    selectLanguage: (state) => state.settings.language,
    selectTheme: (state) => state.settings.theme,
    selectNotifications: (state) => state.settings.notifications,
    selectUI: (state) => state.settings.ui,
    selectProductPage: (state) => state.settings.productPage,
    selectPreferences: (state) => state.settings.preferences,
    selectIsLoading: (state) => state.settings.isLoading,
    selectError: (state) => state.settings.error,
    
    // Sélecteurs dédiés au scroll
    selectScroll: (state) => state.settings.productPage.content.scroll,
    selectScrollMetrics: (state) => state.settings.productPage.content.scroll.metrics,
    selectIsScrolling: (state) => state.settings.productPage.content.scroll.isScrolling,
    selectIsBottom: (state) => state.settings.productPage.content.scroll.isBottom,
    selectScrollOptions: (state) => state.settings.productPage.content.scroll.options
};

export default settingsSlice;
