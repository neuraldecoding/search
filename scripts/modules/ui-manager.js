/**
 * UI Manager Module
 * Handles all user interface interactions and state management
 */

export class UIManager {
    constructor() {
        this.searchGenerator = null;
        this.formData = {
            database: 'ieee',
            searchTerms: [],
            startYear: 2020,
            endYear: 2024,
            searchField: 'All Metadata',
            resultsPerPage: 50
        };
        this.termGroupCounter = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeDefaultState();
    }

    /**
     * Initialize UI elements
     */
    initializeElements() {
        // Form elements
        this.form = document.getElementById('searchForm');
        this.termGroupsContainer = document.getElementById('termGroups');
        this.addTermGroupBtn = document.getElementById('addTermGroup');
        
        // Database selection
        this.tabButtons = document.querySelectorAll('.tab-btn');
        
        // Year controls
        this.startYearInput = document.getElementById('startYear');
        this.endYearInput = document.getElementById('endYear');
        this.startYearSlider = document.getElementById('startYearSlider');
        this.endYearSlider = document.getElementById('endYearSlider');
        
        // Advanced options
        this.searchFieldSelect = document.getElementById('searchField');
        this.resultsPerPageSelect = document.getElementById('resultsPerPage');
        
        // URL preview
        this.urlPreview = document.getElementById('urlPreview');
        this.urlText = document.getElementById('urlText');
        this.copyBtn = document.getElementById('copyBtn');
        this.openUrlBtn = document.getElementById('openUrlBtn');
        this.clearFormBtn = document.getElementById('clearFormBtn');
        
        // Notification
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notificationText');
    }

    /**
     * Set the search generator instance
     * @param {SearchURLGenerator} generator - Search URL generator instance
     */
    setSearchGenerator(generator) {
        this.searchGenerator = generator;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Database tabs
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDatabaseChange(e));
        });

        // Add term group
        this.addTermGroupBtn.addEventListener('click', () => this.addTermGroup());

        // Year controls
        this.startYearInput.addEventListener('input', () => this.handleYearChange('start'));
        this.endYearInput.addEventListener('input', () => this.handleYearChange('end'));
        this.startYearSlider.addEventListener('input', () => this.handleYearSliderChange('start'));
        this.endYearSlider.addEventListener('input', () => this.handleYearSliderChange('end'));

        // Advanced options
        this.searchFieldSelect.addEventListener('change', () => this.handleFieldChange());
        this.resultsPerPageSelect.addEventListener('change', () => this.handleResultsPerPageChange());

        // URL actions
        this.copyBtn.addEventListener('click', () => this.copyURL());
        this.openUrlBtn.addEventListener('click', () => this.openURL());
        this.clearFormBtn.addEventListener('click', () => this.clearForm());

        // Form submission prevention
        this.form.addEventListener('submit', (e) => e.preventDefault());
    }

    /**
     * Initialize default state with example data
     */
    initializeDefaultState() {
        // Add default term group with example data
        this.addTermGroup();
        
        // Set example search terms
        const firstGroup = this.formData.searchTerms[0];
        if (firstGroup) {
            firstGroup.terms = ['neural decoding', 'brain decoding'];
            firstGroup.searchField = 'All Metadata';
        }

        // Update UI
        this.updateURLPreview();
    }

    /**
     * Handle database tab change
     * @param {Event} e - Click event
     */
    handleDatabaseChange(e) {
        const database = e.target.dataset.database;
        
        // Update active tab
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update form data
        this.formData.database = database;
        
        // Update search generator
        if (this.searchGenerator) {
            this.searchGenerator.setDatabase(database);
        }

        // Update field options
        this.updateFieldOptions(database);
        
        // Update URL preview
        this.updateURLPreview();
    }

    /**
     * Update field options based on database
     * @param {string} database - Database type
     */
    updateFieldOptions(database) {
        if (!this.searchGenerator) return;

        const fieldOptions = this.searchGenerator.getFieldOptions(database);
        
        // Clear current options
        this.searchFieldSelect.innerHTML = '';
        
        // Add new options
        fieldOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            
            // Set default selection
            if (option.value === 'All Metadata' || option.value === 'TITLE-ABS-KEY') {
                optionElement.selected = true;
                this.formData.searchField = option.value;
            }
            
            this.searchFieldSelect.appendChild(optionElement);
        });
    }

    /**
     * Add a new term group
     */
    addTermGroup() {
        this.termGroupCounter++;
        const groupId = `termGroup${this.termGroupCounter}`;
        
        // Create term group data
        const termGroup = {
            id: groupId,
            searchField: this.formData.searchField,
            operator: 'OR',
            terms: ['', '']
        };

        this.formData.searchTerms.push(termGroup);

        // Create DOM element
        const groupElement = this.createTermGroupElement(termGroup);
        this.termGroupsContainer.appendChild(groupElement);

        // Update URL preview
        this.updateURLPreview();
    }

    /**
     * Create term group DOM element
     * @param {Object} termGroup - Term group data
     * @returns {HTMLElement} Created group element
     */
    createTermGroupElement(termGroup) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'term-group';
        groupDiv.id = termGroup.id;

        groupDiv.innerHTML = `
            <div class="term-group-header">
                <span class="term-group-title">Term Group ${this.formData.searchTerms.length}</span>
                <div class="group-actions">
                    <button type="button" class="icon-btn" onclick="uiManager.removeTermGroup('${termGroup.id}')" title="Remove group">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="term-group-content">
                ${termGroup.terms.map((term, index) => `
                    <div class="term-input-group">
                        <div class="term-input-wrapper">
                            <label class="term-input-label">Search Term ${index + 1}</label>
                            <input type="text" 
                                   class="term-input" 
                                   placeholder="Enter search term"
                                   value="${term}"
                                   oninput="uiManager.updateTerm('${termGroup.id}', ${index}, this.value)">
                        </div>
                        ${index === 0 ? `
                            <div class="term-operator">
                                <label class="term-input-label">Operator</label>
                                <select class="operator-select" onchange="uiManager.updateOperator('${termGroup.id}', this.value)">
                                    <option value="OR" ${termGroup.operator === 'OR' ? 'selected' : ''}>OR</option>
                                    <option value="AND" ${termGroup.operator === 'AND' ? 'selected' : ''}>AND</option>
                                </select>
                            </div>
                        ` : '<div class="term-operator"></div>'}
                    </div>
                `).join('')}
                <button type="button" class="add-term-btn" onclick="uiManager.addTermToGroup('${termGroup.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Term
                </button>
            </div>
        `;

        return groupDiv;
    }

    /**
     * Remove a term group
     * @param {string} groupId - Group ID to remove
     */
    removeTermGroup(groupId) {
        // Find and remove from data
        const index = this.formData.searchTerms.findIndex(group => group.id === groupId);
        if (index !== -1) {
            this.formData.searchTerms.splice(index, 1);
        }

        // Remove DOM element
        const groupElement = document.getElementById(groupId);
        if (groupElement) {
            groupElement.remove();
        }

        // Update URL preview
        this.updateURLPreview();
    }

    /**
     * Add a term to an existing group
     * @param {string} groupId - Group ID
     */
    addTermToGroup(groupId) {
        const group = this.formData.searchTerms.find(g => g.id === groupId);
        if (group) {
            group.terms.push('');
            
            // Re-render the group
            const groupElement = document.getElementById(groupId);
            if (groupElement) {
                const newGroup = this.createTermGroupElement(group);
                groupElement.replaceWith(newGroup);
            }

            // Update URL preview
            this.updateURLPreview();
        }
    }

    /**
     * Update term value
     * @param {string} groupId - Group ID
     * @param {number} termIndex - Term index
     * @param {string} value - New term value
     */
    updateTerm(groupId, termIndex, value) {
        const group = this.formData.searchTerms.find(g => g.id === groupId);
        if (group && group.terms[termIndex] !== undefined) {
            group.terms[termIndex] = value;
            this.updateURLPreview();
        }
    }

    /**
     * Update operator for a group
     * @param {string} groupId - Group ID
     * @param {string} operator - New operator (OR/AND)
     */
    updateOperator(groupId, operator) {
        const group = this.formData.searchTerms.find(g => g.id === groupId);
        if (group) {
            group.operator = operator;
            this.updateURLPreview();
        }
    }

    /**
     * Handle year input change
     * @param {string} type - 'start' or 'end'
     */
    handleYearChange(type) {
        const value = type === 'start' ? parseInt(this.startYearInput.value) : parseInt(this.endYearInput.value);
        
        if (type === 'start') {
            this.formData.startYear = value;
            this.startYearSlider.value = value;
        } else {
            this.formData.endYear = value;
            this.endYearSlider.value = value;
        }

        this.updateURLPreview();
    }

    /**
     * Handle year slider change
     * @param {string} type - 'start' or 'end'
     */
    handleYearSliderChange(type) {
        const value = type === 'start' ? parseInt(this.startYearSlider.value) : parseInt(this.endYearSlider.value);
        
        if (type === 'start') {
            this.formData.startYear = value;
            this.startYearInput.value = value;
        } else {
            this.formData.endYear = value;
            this.endYearInput.value = value;
        }

        this.updateURLPreview();
    }

    /**
     * Handle search field change
     */
    handleFieldChange() {
        this.formData.searchField = this.searchFieldSelect.value;
        
        // Update all term groups with new field
        this.formData.searchTerms.forEach(group => {
            group.searchField = this.formData.searchField;
        });

        this.updateURLPreview();
    }

    /**
     * Handle results per page change
     */
    handleResultsPerPageChange() {
        this.formData.resultsPerPage = parseInt(this.resultsPerPageSelect.value);
        this.updateURLPreview();
    }

    /**
     * Update URL preview
     */
    updateURLPreview() {
        if (!this.searchGenerator) return;

        try {
            const validation = this.searchGenerator.validateFormData(this.formData);
            
            if (!validation.isValid) {
                this.urlText.textContent = validation.errors.join(', ');
                this.urlText.style.color = '#EF4444';
                return;
            }

            const url = this.searchGenerator.generateURL(this.formData);
            this.urlText.textContent = url;
            this.urlText.style.color = '#E5E7EB';

            // Show warnings if any
            if (validation.warnings.length > 0) {
                console.warn('Search URL Generator Warnings:', validation.warnings);
            }
        } catch (error) {
            this.urlText.textContent = `Error generating URL: ${error.message}`;
            this.urlText.style.color = '#EF4444';
        }
    }

    /**
     * Copy URL to clipboard
     */
    async copyURL() {
        const url = this.urlText.textContent;
        
        if (!url || url.includes('Error') || url.includes('required')) {
            this.showNotification('No valid URL to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            this.showCopySuccess();
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopySuccess();
        }
    }

    /**
     * Show copy success feedback
     */
    showCopySuccess() {
        this.copyBtn.classList.add('copied');
        this.copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
        `;
        
        this.showNotification('URL copied to clipboard!', 'success');
        
        setTimeout(() => {
            this.copyBtn.classList.remove('copied');
            this.copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="m5 15 4-4 4 4"></path>
                </svg>
            `;
        }, 2000);
    }

    /**
     * Open URL in new tab
     */
    openURL() {
        const url = this.urlText.textContent;
        
        if (!url || url.includes('Error') || url.includes('required')) {
            this.showNotification('No valid URL to open', 'error');
            return;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    }

    /**
     * Clear all form data
     */
    clearForm() {
        // Reset form data
        this.formData = {
            database: this.formData.database,
            searchTerms: [],
            startYear: 2020,
            endYear: 2024,
            searchField: this.searchFieldSelect.options[0].value,
            resultsPerPage: 50
        };

        // Reset UI controls
        this.startYearInput.value = '2020';
        this.endYearInput.value = '2024';
        this.startYearSlider.value = '2020';
        this.endYearSlider.value = '2024';
        this.resultsPerPageSelect.value = '50';

        // Clear term groups
        this.termGroupsContainer.innerHTML = '';
        this.termGroupCounter = 0;

        // Add fresh term group
        this.addTermGroup();

        this.showNotification('Form cleared', 'success');
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error')
     */
    showNotification(message, type = 'success') {
        this.notificationText.textContent = message;
        this.notification.className = `notification ${type} show`;

        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
}