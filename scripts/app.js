/**
 * Main Application Entry Point
 * Initializes the Academic Search URL Generator
 */

import { SearchURLGenerator } from './modules/search-generator.js';
import { UIManager } from './modules/ui-manager.js';

// Make UI manager globally available for onclick handlers
window.uiManager = null;

class AcademicSearchGenerator {
    constructor() {
        this.searchGenerator = null;
        this.uiManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing Academic Search URL Generator...');
            
            // Initialize search generator
            this.searchGenerator = new SearchURLGenerator();
            
            // Initialize UI manager
            this.uiManager = new UIManager();
            this.uiManager.setSearchGenerator(this.searchGenerator);
            
            // Make UI manager globally available for inline event handlers
            window.uiManager = this.uiManager;
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Show initialization error
     * @param {Error} error - Initialization error
     */
    showInitializationError(error) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 48px 24px;">
                    <h1 style="color: #EF4444; margin-bottom: 16px;">Initialization Error</h1>
                    <p style="color: #6B7280; margin-bottom: 24px;">
                        Failed to initialize the Academic Search URL Generator.
                    </p>
                    <details style="text-align: left; max-width: 600px; margin: 0 auto;">
                        <summary style="cursor: pointer; color: #0057B7;">Error Details</summary>
                        <pre style="background: #F8F9FA; padding: 16px; border-radius: 8px; margin-top: 8px; overflow: auto; font-size: 14px;">${error.message}</pre>
                    </details>
                    <button onclick="location.reload()" style="margin-top: 24px; padding: 12px 24px; background: #0057B7; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    /**
     * Check browser compatibility
     */
    checkBrowserCompatibility() {
        const issues = [];

        // Check for ES6 module support
        if (!window.URL || !window.URLSearchParams) {
            issues.push('Modern URL API not supported');
        }

        // Check for fetch API (not strictly required but good to have)
        if (!window.fetch) {
            console.warn('Fetch API not available - some features may be limited');
        }

        // Check for clipboard API
        if (!navigator.clipboard) {
            console.warn('Clipboard API not available - copy functionality will fallback to older methods');
        }

        if (issues.length > 0) {
            console.warn('Browser compatibility issues:', issues);
        }
    }

    /**
     * Handle window errors
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    /**
     * Add keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + C to copy URL when URL preview is focused
            if ((event.ctrlKey || event.metaKey) && event.key === 'c' && document.activeElement === this.uiManager?.urlPreview) {
                event.preventDefault();
                this.uiManager?.copyURL();
            }

            // Ctrl/Cmd + Enter to open URL in new tab
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                this.uiManager?.openURL();
            }

            // Escape to clear form
            if (event.key === 'Escape') {
                this.uiManager?.clearForm();
            }
        });
    }

    /**
     * Add performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });

        // Monitor URL generation performance
        const originalUpdateURL = this.uiManager?.updateURLPreview;
        if (originalUpdateURL) {
            this.uiManager.updateURLPreview = function() {
                const startTime = performance.now();
                const result = originalUpdateURL.call(this);
                const endTime = performance.now();
                console.log(`URL generation took ${(endTime - startTime).toFixed(2)}ms`);
                return result;
            };
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new AcademicSearchGenerator();
    
    // Check browser compatibility
    app.checkBrowserCompatibility();
    
    // Setup error handling
    app.setupErrorHandling();
    
    // Initialize the application
    app.init().then(() => {
        // Setup additional features after initialization
        app.setupKeyboardShortcuts();
        app.setupPerformanceMonitoring();
        
        // Add focus management for better accessibility
        const firstInput = document.querySelector('.term-input');
        if (firstInput) {
            firstInput.focus();
        }
    });
});

// Export for potential external use
window.AcademicSearchGenerator = AcademicSearchGenerator;