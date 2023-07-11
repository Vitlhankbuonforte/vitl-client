import { defineStore } from 'pinia'
export const useMainStore = defineStore('store', {
    state: () => ({
        lastBlock: '',
        filterActive: false,
        month: new Date(new Date().setMonth(new Date().getMonth())),
        allRegions: [] as string[],
        selectedRegions: [] as string[],
        allChannels: [] as string[],
        selectedChannels: [] as string[],
        allDistricts: [] as string[],
        selectedDistricts: [] as string[],
        allDMs: [] as string[],
        selectedDMs: [] as string[],
        selectedProduction: [] as string[],
        allProductions: [] as string[],
        sortBy: null as any,
        sortItems: [] as any[],
        loading: false,
        allData: [],
        viewOption: 'Percentages',
        viewOptions: ['Percentages', 'Numbers'],
        numberColumns: [
            { field: "SALES", title: "Sales" },
            { field: "GOAL", title: "Goal" },
            { field: "ACTIVE_REPS", title: "Active Reps" },
            { field: "PERSONAL_SALES", title: "DM Personal Sales" },
            { field: "SG_SALES", title: "SG Sales" },
            { field: "PRR", title: "PRR" },
            { field: "VIVINT_SALES", title: "Vivint Sales" },
            { field: "PERSONAL_INSTALLS", title: "DM Personal Installs" },
            { field: "CLEAN_SALES", title: "Clean Sales" },
            { field: "RWS", title: "RWS" },
            { field: "NET_PPW", title: "Net PPW" },
            { field: "SUGGESTED_NET_PPW", title: "Suggested Net PPW" }
        ],
        percentageColumns: [
            { field: "POINTS", title: "Points" },
            { field: "SALES_GOAL", title: "Sales Goal" },
            { field: "DM_PERSONAL", title: "DM Personal" },
            { field: "SG_P", title: "SG %", class: "border-right-1" },
            { field: "PRR_P", title: "PRR" },
            { field: "VAR", title: "VAR" },
            { field: "DM_PERSONAL_INSTALLS", title: "DM Installs" },
            { field: "CLEAN_P", title: "Clean %", class: "border-right-1" },
            { field: "RWS_P", title: "RWS %" },
            { field: "NET_PPW_P", title: "Net PPW to Target" },
        ]
    }),
    getters: {
        data(state): any[] {
            let data = state.allData;

            if (state.selectedRegions.length) {
                data = data.filter((x: any) => state.selectedRegions.includes(x['REGION']));
            }
            if (state.selectedChannels.length) {
                data = data.filter((x: any) => state.selectedChannels.includes(x['CHANNEL']));
            }
            if (state.selectedDistricts.length) {
                data = data.filter((x: any) => state.selectedDistricts.includes(x['DISTRICT']));
            }
            if (state.selectedDMs.length) {
                data = data.filter((x: any) => state.selectedDMs.includes(x['DM_NAME']));
            }
            if (state.selectedProduction.length) {
                data = data.filter((x: any) => state.selectedProduction.includes(x['PRODUCTION']));
            }
            if (state.sortBy) {
                data = data.sort((a, b) => -a[state.sortBy] + b[state.sortBy]);
            }
            return data;
        }
    },
    actions: {
        toggleFilter() {
            this.filterActive = !this.filterActive;
        },
        resetSortBy() {
            if (this.viewOption == 'Numbers') {
                this.sortItems = this.numberColumns;
            } else {
                this.sortItems = this.percentageColumns;
            }
            this.sortBy = this.sortItems[0].field;
        },
        async loadData(block = '') {
            if(!block) {
                block = this.lastBlock;
            }
            this.lastBlock = block;
            this.resetSortBy();
            this.loading = true;
            const resp = await fetch(`https://vitl.azurewebsites.net/api/GetSigns?code=ksjdp8Yu0goOwRGrbmS-OJwu5Oz5uegIM4gcXW3zEI1eAzFuKYa9SQ==&block=${block}&month=${this.month.getFullYear() + '-' + (this.month.getMonth()+1) + '-01'}`);
            const allData = await resp.json();
            this.allData = allData.map((x: any) => {
                return {
                    ...x,
                    'SALES_GOAL': x['GOAL'] ? x['SALES'] / x['GOAL'] : null,
                    'DM_PERSONAL': x['PERSONAL_SALES'] ? x['PERSONAL_SALES'] / 10 : null,
                    'SG_P': x['SALES'] ? x['SG_SALES'] / x['SALES'] : null,
                    'PRR_P': x['SALES'] ? x['PRR'] / x['SALES'] : null,
                    'VAR': x['SALES'] ? x['VIVINT_SALES'] / x['SALES'] : null,
                    'DM_PERSONAL_INSTALLS': x['PERSONAL_INSTALLS'] ? x['PERSONAL_INSTALLS'] / 6 : null,
                    'CLEAN_P': x['SALES'] ? x['CLEAN_SALES'] / x['SALES'] : null,
                    'RWS_P': x['ACTIVE_REPS'] ? x['RWS'] / x['ACTIVE_REPS'] : null,
                    'NET_PPW_P': x['SUGGESTED_NET_PPW'] ? x['NET_PPW'] / x['SUGGESTED_NET_PPW'] : null
                }
            });
            console.log(this.allData);
            for(let x of this.allData as any[]) {
                let points = 0;
                if(x['SALES_GOAL'] > 1) {
                    points += 30;
                } else if(x['SALES_GOAL'] && x['SALES_GOAL'] >= 0.4) {
                    points += x['SALES_GOAL'] * 30;
                }
                if(x['DM_PERSONAL'] > 1) {
                    points += 10;
                } else if(x['DM_PERSONAL'] && x['DM_PERSONAL'] >= 0.4) {
                    points += x['DM_PERSONAL'] * 10;
                }
                if(x['SG_P'] > 0.3) {
                    points += 5;
                } else if(x['SG_P'] && x['SG_P'] > 0.1) {
                    points += (x['SG_P']-0.1) / 0.2 * 5;
                }
                if(x['PRR_P'] >= 0.75) {
                    points += 5;
                } else if(x['PRR_P'] && x['PRR_P'] > 0.5) {
                    points += (x['PRR_P']-0.5) / 0.25 * 10;
                }
                if(x['VAR'] > 0.25) {
                    points + 5;
                } else if(x['VAR']) {
                    points += x['VAR'] * 5;
                }
                if(x['CLEAN_P'] >= 1) {
                    points += 10;
                } else if(x['CLEAN_P'] && x['CLEAN_P'] > 0.6) {
                    points += (x['CLEAN_P']-0.6) / 0.4 * 10;
                }
                if(x['DM_PERSONAL_INSTALLS'] >= 1) {
                    points += 10;
                } else if(x['DM_PERSONAL_INSTALLS'] && x['DM_PERSONAL_INSTALLS'] >= 1/3) {
                    points += x['DM_PERSONAL_INSTALLS'] * 10;
                }
                if(x['RWS_P'] >= 1) {
                    points += 10;
                } else if(x['RWS_P'] && x['RWS_P'] > 0.6) {
                    points += (x['RWS_P']-0.6) / 0.4 * 10;
                }
                if(x['NET_PPW_P'] >= 1) {
                    points += 10;
                } else if(x['NET_PPW_P'] && x['NET_PPW_P'] > 0.8) {
                    points += (x['NET_PPW_P']-0.8) / 0.2 * 10;
                }
                x['POINTS'] = Math.round(points);
            }
            this.allRegions = allData.map((x: any) => x['REGION']).filter((value: any, index: number, array: any[]) => value && array.indexOf(value) === index);
            this.allChannels = allData.map((x: any) => x['CHANNEL']).filter((value: any, index: number, array: any[]) => value && array.indexOf(value) === index);
            this.allDistricts = allData.map((x: any) => x['DISTRICT']).filter((value: any, index: number, array: any[]) => value && array.indexOf(value) === index);
            this.allDMs = allData.map((x: any) => x['DM_NAME']).filter((value: any, index: number, array: any[]) => value && array.indexOf(value) === index);
            this.allProductions = allData.map((x: any) => x['PRODUCTION']).filter((value: any, index: number, array: any[]) => value && array.indexOf(value) === index);
            this.loading = false;
        },
    },
})