const CounterManager = {
    counterKey: 'mandarinCount',
    totalCollectedKey: 'mandarinTotalCollected',
    completionKey: 'page1Completed',
    maxLimitKey: 'maxLimit',
    currentPageMaxKey: 'currentPageMax',
    defaultMax: 0,

    getCount() {
        return parseInt(localStorage.getItem(this.counterKey)) || 0;
    },

    setCount(count) {
        localStorage.setItem(this.counterKey, Math.max(0, count));
    },

    getTotalCollected() {
        const savedTotal = localStorage.getItem(this.totalCollectedKey);

        if (savedTotal !== null) {
            return parseInt(savedTotal) || 0;
        }

        return Math.max(this.getCount(), this.getLegacyCollectedCount());
    },

    setTotalCollected(count) {
        localStorage.setItem(this.totalCollectedKey, Math.max(0, count));
    },

    incrementCount() {
        const totalBeforeIncrement = this.getTotalCollected();
        const newCount = this.getCount() + 1;
        this.setCount(newCount);
        this.setTotalCollected(totalBeforeIncrement + 1);
        return newCount;
    },

    spendCount(amount = 1) {
        const currentCount = this.getCount();

        if (currentCount < amount) {
            return false;
        }

        this.setCount(currentCount - amount);
        return true;
    },

    getLegacyCollectedCount() {
        let collected = 0;

        if (this.isPage1Completed()) {
            collected += 1;
        }

        if (localStorage.getItem('hiddenMandarinUsed') === 'true') {
            collected += 1;
        }

        return collected;
    },

    isPage1Completed() {
        return localStorage.getItem(this.completionKey) === 'true';
    },

    markPage1Completed() {
        localStorage.setItem(this.completionKey, 'true');
    },

    setPageMaxLimit(maxValue) {
        localStorage.setItem(this.currentPageMaxKey, maxValue);
    },

    getPageMaxLimit() {
        return parseInt(localStorage.getItem(this.currentPageMaxKey)) || this.defaultMax;
    },

    updateCounterDisplay(displayElement, textElement, maxElement) {
        const availableCount = this.getCount();
        const totalCollected = this.getTotalCollected();
        const maxLimit = this.getPageMaxLimit();
        
        if (displayElement) {
            displayElement.textContent = `${availableCount} 🍊 ${totalCollected}/${maxLimit}`;
        }
        if (textElement) {
            textElement.textContent = '';
        }
        if (maxElement) {
            maxElement.textContent = '';
        }
    }
};
