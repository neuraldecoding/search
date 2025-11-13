/**
 * Search URL Generator Module
 * Handles URL generation for IEEE Xplore and Scopus databases
 */

export class SearchURLGenerator {
    constructor() {
        this.currentDatabase = 'ieee';
    }

    /**
     * Set the current database type
     * @param {string} database - 'ieee' or 'scopus'
     */
    setDatabase(database) {
        this.currentDatabase = database;
    }

    /**
     * Generate search URL based on form data
     * @param {Object} formData - Form data object
     * @returns {string} Generated search URL
     */
    generateURL(formData) {
        switch (this.currentDatabase) {
            case 'ieee':
                return this.generateIEEEURL(formData);
            case 'scopus':
                return this.generateScopusURL(formData);
            default:
                throw new Error('Unsupported database type');
        }
    }

    /**
     * Generate IEEE Xplore search URL
     * @param {Object} formData - Form data
     * @returns {string} IEEE search URL
     */
    generateIEEEURL(formData) {
        const baseURL = 'https://ieeexplore.ieee.org/search/searchresult.jsp';
        
        // Build query text
        const queryText = this.buildIEEEQueryText(formData.searchTerms);
        
        // Build URL parameters
        const params = new URLSearchParams({
            action: 'search',
            newsearch: 'true',
            matchBoolean: 'true',
            queryText: queryText,
            ranges: `${formData.startYear}_${formData.endYear}_Year`
        });

        return `${baseURL}?${params.toString()}`;
    }

    /**
     * Build IEEE query text from search terms
     * @param {Array} searchTerms - Array of search term groups
     * @returns {string} Encoded query text
     */
    buildIEEEQueryText(searchTerms) {
        const termGroups = searchTerms.map((group, index) => {
            const terms = group.terms
                .filter(term => term.trim() !== '')
                .map(term => `("${group.searchField}":"${term.trim()}")`)
                .join(` ${group.operator} `);
            
            return terms ? `(${terms})` : '';
        }).filter(group => group !== '');

        if (termGroups.length === 0) {
            return '';
        }

        // Join term groups with AND
        const fullQuery = termGroups.join(' AND ');
        return encodeURIComponent(fullQuery);
    }

    /**
     * Generate Scopus search URL
     * @param {Object} formData - Form data
     * @returns {string} Scopus search URL
     */
    generateScopusURL(formData) {
        const baseURL = 'https://www.scopus.com/results/results.uri';
        
        // Build search query
        const searchQuery = this.buildScopusQuery(formData.searchTerms);
        
        // Build URL parameters
        const params = new URLSearchParams({
            sort: 'plf-f',
            src: 's',
            sot: 'a',
            sdt: 'a',
            sl: '211',
            s: searchQuery,
            origin: 'searchadvanced',
            editSaveSearch: '',
            limit: formData.resultsPerPage.toString()
        });

        // Add year range
        const yearClause = `AND PUBYEAR > ${formData.startYear} AND PUBYEAR < ${formData.endYear + 1}`;
        const currentS = params.get('s');
        params.set('s', `${currentS} ${encodeURIComponent(yearClause)}`);

        return `${baseURL}?${params.toString()}`;
    }

    /**
     * Build Scopus search query
     * @param {Array} searchTerms - Array of search term groups
     * @returns {string} Encoded search query
     */
    buildScopusQuery(searchTerms) {
        const termGroups = searchTerms.map((group, index) => {
            const terms = group.terms
                .filter(term => term.trim() !== '')
                .map(term => `${group.searchField}("${term.trim()}")`)
                .join(` ${group.operator} `);
            
            return terms ? `(${terms})` : '';
        }).filter(group => group !== '');

        if (termGroups.length === 0) {
            return '';
        }

        // Join term groups with AND
        const fullQuery = termGroups.join(' AND ');
        return encodeURIComponent(fullQuery);
    }

    /**
     * Validate form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} Validation result
     */
    validateFormData(formData) {
        const errors = [];
        const warnings = [];

        // Check if there are any search terms
        const hasValidTerms = formData.searchTerms.some(group => 
            group.terms.some(term => term.trim() !== '')
        );

        if (!hasValidTerms) {
            errors.push('At least one search term is required');
        }

        // Validate year range
        if (formData.startYear > formData.endYear) {
            errors.push('Start year must be less than or equal to end year');
        }

        if (formData.startYear < 1900 || formData.endYear > 2030) {
            warnings.push('Year range should be between 1900 and 2030');
        }

        // Check for very long queries
        const totalTerms = formData.searchTerms.reduce((total, group) => 
            total + group.terms.filter(term => term.trim() !== '').length, 0
        );

        if (totalTerms > 20) {
            warnings.push('Large number of search terms may result in very long URLs');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Get example search terms for testing
     * @returns {Object} Example search terms
     */
    getExampleSearchTerms() {
        return [
            {
                searchField: 'All Metadata',
                operator: 'OR',
                terms: ['neural decoding', 'brain decoding']
            },
            {
                searchField: 'All Metadata',
                operator: 'OR',
                terms: ['visual cortex', 'image reconstruction']
            }
        ];
    }

    /**
     * Extract database-specific field options
     * @param {string} database - Database type
     * @returns {Array} Field options
     */
    getFieldOptions(database) {
        switch (database) {
            case 'ieee':
                return [
                    { value: 'All Metadata', label: 'All Metadata' },
                    { value: 'Title', label: 'Title' },
                    { value: 'Abstract', label: 'Abstract' },
                    { value: 'Authors', label: 'Authors' },
                    { value: 'Keywords', label: 'Keywords' }
                ];
            case 'scopus':
                return [
                    { value: 'TITLE-ABS-KEY', label: 'Title, Abstract & Keywords' },
                    { value: 'TITLE', label: 'Title' },
                    { value: 'ABS', label: 'Abstract' },
                    { value: 'AUTH', label: 'Authors' },
                    { value: 'KEY', label: 'Keywords' }
                ];
            default:
                return [];
        }
    }
}