// Production-only configuration for An Kun Studio
export const APP_CONFIG = {
    MODE: 'production', // Always production mode
    
    // Database configuration - Always use real database
    DATABASE: {
        URL: process.env.DATABASE_URL,
        USE_REAL_DB: true
    },

    // Email configuration - Always use real SMTP
    EMAIL: {
        USE_REAL_SMTP: true
    },

    // Development helpers
    DEV: {
        ENABLE_LOGGING: true,
        MOCK_SLOW_RESPONSES: false,
        SHOW_DEBUG_INFO: process.env.NODE_ENV === 'production'
    }
}

// Client-side mode detection - Always production
export const getClientMode = () => {
    return 'production'; // Always production
}

// Helper functions
export const isProductionMode = () => {
    return true; // Always production
}

export const isDemoMode = () => {
    return false; // Never demo mode
}

export const shouldUseRealDatabase = () => {
    return true; // Always use real database
}

export const shouldUseRealSMTP = () => {
    return true; // Always use real SMTP
}
