import { defineStore } from "pinia";
import axios from "axios";

export const useMainStore = defineStore("store", {
  state: () => ({
    lastBlock: "",
    filterActive: false,
    month: [
      {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
      },
    ],
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
    viewOption: "Percentages",
    viewOptions: ["Percentages", "Numbers"],
    highlight: false,
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
      { field: "SUGGESTED_NET_PPW", title: "Suggested Net PPW" },
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
    ],
  }),
  getters: {
    data(state): any[] {
      let data = state.allData;

      if (state.selectedRegions.length) {
        data = data.filter((x: any) =>
          state.selectedRegions.includes(x["REGION"])
        );
      }
      if (state.selectedChannels.length) {
        data = data.filter((x: any) =>
          state.selectedChannels.includes(x["CHANNEL"])
        );
      }
      if (state.selectedDistricts.length) {
        data = data.filter((x: any) =>
          state.selectedDistricts.includes(x["DISTRICT"])
        );
      }
      if (state.selectedDMs.length) {
        data = data.filter((x: any) =>
          state.selectedDMs.includes(x["DM_NAME"])
        );
      }
      if (state.sortBy) {
        data = data.sort((a, b) => -a[state.sortBy] + b[state.sortBy]);
      }
      return data;
    },
  },
  actions: {
    toggleFilter() {
      this.filterActive = !this.filterActive;
    },
    resetSortBy() {
      if (this.viewOption == "Numbers") {
        this.sortItems = this.numberColumns;
      } else {
        this.sortItems = this.percentageColumns;
      }
      this.sortBy = this.sortItems[0].field;
    },
    async loadData(block = "") {
      if (!block) {
        block = this.lastBlock;
      }
      this.lastBlock = block;
      this.resetSortBy();
      this.loading = true;
      const params: any = {
        month: (this.month || [])
          .filter(Boolean)
          .map(
            (m) =>
              `${
                m.year +
                "-" +
                (m.month + 1 > 9 ? m.month + 1 : `0${m.month + 1}`) +
                "-01"
              }`
          )
          .join(","),
        block,
      };

      if (this.selectedProduction) {
        params.production = this.selectedProduction;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/fetch`, {
        params,
      });
      const allData = res.data;
      this.allData = allData.map((x: any) => {
        return {
          ...x,
          SALES_GOAL: x["GOAL"] ? x["SALES"] / x["GOAL"] : 0,
          DM_PERSONAL: x["PERSONAL_SALES"] ? x["PERSONAL_SALES"] / 10 : 0,
          SG_P: x["SALES"] ? x["SG_SALES"] / x["SALES"] : 0,
          PRR_P: x["SALES"] ? x["PRR"] / x["SALES"] : 0,
          VAR: x["SALES"] ? x["VIVINT_SALES"] / x["SALES"] : 0,
          DM_PERSONAL_INSTALLS: x["PERSONAL_INSTALLS"]
            ? x["PERSONAL_INSTALLS"] / 6
            : 0,
          CLEAN_P: x["SALES"] ? x["CLEAN_SALES"] / x["SALES"] : 0,
          RWS_P: x["ACTIVE_REPS"] ? x["RWS"] / x["ACTIVE_REPS"] : 0,
          NET_PPW_P: x["SUGGESTED_NET_PPW"]
            ? x["NET_PPW"] / x["SUGGESTED_NET_PPW"]
            : 0,
        };
      });

      for (let x of this.allData as any[]) {
        let points = 0;

        if (this.lastBlock === "Rep") {
          points += x["SALES_GOAL"] > 1 ? 35 : x["SALES_GOAL"] * 35;

          points +=
            x["DM_PERSONAL_INSTALLS"] >= 1
              ? 10
              : x["DM_PERSONAL_INSTALLS"] * 10;
        } else {
          points +=
            x["SALES_GOAL"] > 1
              ? 35
              : x["SALES_GOAL"] < 0.4
              ? 0
              : x["SALES_GOAL"] * 35;

          points +=
            x["DM_PERSONAL"] >= 1
              ? 10
              : x["DM_PERSONAL"] < 0.4
              ? 0
              : x["DM_PERSONAL"] * 10;

          points +=
            x["DM_PERSONAL_INSTALLS"] >= 1
              ? 10
              : x["DM_PERSONAL_INSTALLS"] < 1 / 3
              ? 0
              : x["DM_PERSONAL_INSTALLS"] * 10;
        }

        points +=
          x["SG_P"] >= 0.3
            ? 5
            : x["SG_P"] <= 0.1
            ? 0
            : ((x["SG_P"] - 0.1) / 0.2) * 5;

        points +=
          x["PRR_P"] >= 0.75
            ? 10
            : x["PRR_P"] <= 0.5
            ? 0
            : ((x["PRR_P"] - 0.5) / 0.25) * 10;

        points += x["VAR"] > 0.25 ? 5 : x["VAR"] * 5;

        points +=
          x["CLEAN_P"] >= 1
            ? 10
            : x["CLEAN_P"] <= 0.6
            ? 0
            : ((x["CLEAN_P"] - 0.6) / 0.4) * 10;

        points +=
          x["RWS_P"] >= 1
            ? 10
            : x["RWS_P"] <= 0.6
            ? 0
            : ((x["RWS_P"] - 0.6) / 0.4) * 10;

        points +=
          x["NET_PPW_P"] >= 1
            ? 5
            : x["NET_PPW_P"] <= 0.8
            ? 0
            : ((x["NET_PPW_P"] - 0.8) / 0.2) * 5;

        x["POINTS"] = Math.round(points);
      }
      this.allRegions = allData
        .map((x: any) => x["REGION"])
        .filter(
          (value: any, index: number, array: any[]) =>
            value && array.indexOf(value) === index
        );
      this.allChannels = allData
        .map((x: any) => x["CHANNEL"])
        .filter(
          (value: any, index: number, array: any[]) =>
            value && array.indexOf(value) === index
        );
      this.allDistricts = allData
        .map((x: any) => x["DISTRICT"])
        .filter(
          (value: any, index: number, array: any[]) =>
            value && array.indexOf(value) === index
        );
      this.allDMs = allData
        .map((x: any) => x["DM_NAME"])
        .filter(
          (value: any, index: number, array: any[]) =>
            value && array.indexOf(value) === index
        );
      this.allProductions = allData
        .map((x: any) => x["PRODUCTION"])
        .filter(
          (value: any, index: number, array: any[]) =>
            value && array.indexOf(value) === index
        );
      this.loading = false;
    },
  },
});
