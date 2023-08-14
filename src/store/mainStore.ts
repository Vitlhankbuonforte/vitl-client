import { defineStore } from "pinia";
import axios from "axios";
import moment from "moment";
import { PULSE_MONTHS } from "../consts";

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
    pulseView: false,
    allRegions: [] as string[],
    selectedRegions: [] as string[],
    allChannels: [] as string[],
    selectedChannels: [] as string[],
    allDistricts: [] as string[],
    selectedDistricts: [] as string[],
    allDMs: [] as string[],
    selectedDMs: [] as string[],
    selectedProduction: "All Production",
    allProductions: [] as string[],
    sortBy: null as any,
    sortItems: [] as any[],
    loading: false,
    allData: [] as any[],
    viewOption: "Percentages",
    viewOptions: ["Percentages", "Numbers"],
    highlight: false,
    allPulseData: [] as any[],
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
      { field: "SALES_GOAL_P", title: "Sales Goal" },
      { field: "DM_PERSONAL", title: "DM Personal" },
      { field: "SG_SALES_P", title: "SG %", class: "border-right-1" },
      { field: "PRR_P", title: "PRR" },
      { field: "VAR_P", title: "VAR" },
      { field: "DM_PERSONAL_INSTALLS", title: "DM Installs" },
      { field: "CLEAN_SALES_P", title: "Clean %", class: "border-right-1" },
      { field: "RWS_P", title: "RWS %" },
      { field: "NET_PPW_TO_TARGET_P", title: "Net PPW to Target" },
    ],
  }),
  getters: {
    pulseData(state): any[] {
      return generatePulseData(this.data, state);
    },
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
        if (state.sortBy === "POINTS") {
          data = data.sort((a, b) => {
            let diff = b["POINTS"] - a["POINTS"];

            if (diff !== 0) {
              return diff;
            }
            diff = b["SALES_GOAL_P"] - a["SALES_GOAL_P"];

            if (diff !== 0) {
              return diff;
            }
            return b["RWS_P"] - a["RWS_P"] > 0 ? 1 : -1;
          });
        } else if (state.sortBy === "SALES") {
          data = data.sort((a, b) => {
            let diff = b["SALES"] - a["SALES"];

            if (diff !== 0) {
              return diff;
            }
            diff = b["GOAL"] - a["GOAL"];

            if (diff !== 0) {
              return diff;
            }
            return b["RWS"] - a["RWS"] > 0 ? 1 : -1;
          });
        }
        data = data.sort((a, b) => -a[state.sortBy] + b[state.sortBy]);
      }
      return data;
    },
  },
  actions: {
    resetFilter(level: string) {
      if (level === "District") {
        this.selectedDistricts = [];
      } else if (level === "Region") {
        this.selectedRegions = [];
        this.selectedDistricts = [];
        this.selectedDMs = [];
      }
    },
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

      if (this.lastBlock !== "District") {
        this.pulseView = false;
      }
      this.resetSortBy();

      this.loading = true;

      const params: any = {
        block,
      };

      if (!this.pulseView) {
        params.month = (this.month || [])
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
          .join(",");
      }

      if (this.selectedProduction && !this.pulseView) {
        params.production = this.selectedProduction;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/${this.pulseView ? "pulse" : "fetch"}`,
        {
          params,
        }
      );
      const allData = res.data;
      this.allData = allData.map((x: any) => ({
        ...x,
        SALES_GOAL_P: x["GOAL"] ? x["SALES"] / x["GOAL"] : 0,
        PERSONAL_PRODUCTION_P: x["PERSONAL_SALES_GOAL"]
          ? x["PERSONAL_SALES"] / x["PERSONAL_SALES_GOAL"]
          : 0,
        DM_PERSONAL: x["PERSONAL_SALES_GOAL"]
          ? x["PERSONAL_SALES"] / x["PERSONAL_SALES_GOAL"]
          : 0,
        SG_SALES_P: x["SALES"] ? x["SG_SALES"] / x["SALES"] : 0,
        PRR_P: x["SALES"] ? x["PRR"] / x["SALES"] : 0,
        VAR_P: x["SALES"] ? x["VIVINT_SALES"] / x["SALES"] : 0,
        DM_PERSONAL_INSTALLS:
          this.lastBlock === "Region"
            ? x["PERSONAL_INSTALLS"] / x["PERSONAL_INSTALLS_GOAL"]
            : x["PERSONAL_INSTALLS"]
            ? x["PERSONAL_INSTALLS"] / 6
            : 0,
        CLEAN_SALES_P: x["SALES"] ? x["CLEAN_SALES"] / x["SALES"] : 0,
        RWS_P: x["ACTIVE_REPS"] ? x["RWS"] / x["ACTIVE_REPS"] : 0,
        NET_PPW_TO_TARGET_P: x["SUGGESTED_NET_PPW"]
          ? x["NET_PPW"] / x["SUGGESTED_NET_PPW"]
          : 0,
      }));

      for (let x of this.allData as any[]) {
        let VAR_PERCENT = 0.25,
          VAR_POINTS = 5,
          RWS_POINTS = 10;

        if (this.pulseView) {
          x["DM_PERSONAL_INSTALLS"] =
            x["PERSONAL_INSTALLS"] / x["PERSONAL_INSTALLS_GOAL"];
        }

        if (this.pulseView && x.MONTH > "2023-07-01") {
          VAR_PERCENT = 0.8;
          VAR_POINTS = 10;
          RWS_POINTS = 15;
          x["DM_PERSONAL_INSTALLS"] = 0;
        }

        let points = 0;

        if (this.lastBlock === "Rep") {
          points += x["SALES_GOAL_P"] > 1 ? 35 : x["SALES_GOAL_P"] * 35;

          points +=
            x["SG_SALES"] >= 0.3
              ? 5
              : x["SG_SALES"] <= 0.1
              ? 0
              : x["SG_SALES"] * 5;

          points +=
            x["PRR_P"] >= 0.6 ? 10 : x["PRR_P"] <= 0.5 ? 0 : x["PRR_P"] * 10;

          points +=
            x["VAR_P"] > VAR_PERCENT ? VAR_POINTS : x["VAR_P"] * VAR_POINTS;

          points +=
            x["CLEAN_SALES_P"] >= 1
              ? 10
              : x["CLEAN_SALES_P"] <= 0.6
              ? 0
              : x["CLEAN_SALES_P"] * 10;

          points +=
            x["DM_PERSONAL_INSTALLS"] >= 1
              ? 10
              : x["DM_PERSONAL_INSTALLS"] * 10;

          points +=
            x["RWS_P"] >= 1
              ? RWS_POINTS
              : x["RWS_P"] <= 0.6
              ? 0
              : x["RWS_P"] * RWS_POINTS;

          points +=
            x["NET_PPW_TO_TARGET_P"] >= 1
              ? 5
              : x["NET_PPW_TO_TARGET_P"] <= 0.8
              ? 0
              : x["NET_PPW_TO_TARGET_P"] * 5;
        } else {
          points +=
            x["SALES_GOAL_P"] > 1
              ? 35
              : x["SALES_GOAL_P"] < 0.5
              ? 0
              : x["SALES_GOAL_P"] * 35;

          points +=
            x["PERSONAL_PRODUCTION_P"] >= 1
              ? 10
              : x["PERSONAL_PRODUCTION_P"] < 0.4
              ? 0
              : x["PERSONAL_PRODUCTION_P"] * 10;

          points +=
            x["SG_SALES_P"] >= 0.3
              ? 5
              : x["SG_SALES_P"] <= 0.1
              ? 0
              : x["SG_SALES_P"] * 5;

          points +=
            x["PRR_P"] >= 0.6 ? 10 : x["PRR_P"] <= 0.5 ? 0 : x["PRR_P"] * 10;

          points +=
            x["VAR_P"] > VAR_PERCENT ? VAR_POINTS : x["VAR_P"] * VAR_POINTS;

          points +=
            x["CLEAN_SALES_P"] >= 1
              ? 10
              : x["CLEAN_SALES_P"] <= 0.6
              ? 0
              : x["CLEAN_SALES_P"] * 10;

          points +=
            x["DM_PERSONAL_INSTALLS"] >= 1
              ? 10
              : x["DM_PERSONAL_INSTALLS"] < 1 / 3
              ? 0
              : x["DM_PERSONAL_INSTALLS"] * 10;

          points += x["RWS_P"] >= 1 ? RWS_POINTS : x["RWS_P"] * RWS_POINTS;

          points +=
            x["NET_PPW_TO_TARGET_P"] >= 1
              ? 5
              : x["NET_PPW_TO_TARGET_P"] <= 0.8
              ? 0
              : x["NET_PPW_TO_TARGET_P"] * 5;
        }
        x["POINTS"] = this.pulseView ? points : Math.round(points);
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

const generatePulseData = (data: any[], that: any) => {
  const r: any[] = [];
  const blockKey: any = {
    District: "DISTRICT",
    Region: "REGION",
    Rep: "REP_ID",
  }[that.lastBlock as string];

  for (const item of data) {
    const existing = r.find((i) => i.info[blockKey] === item[blockKey]);

    if (existing) {
      if (!existing[item["MONTH"]]) {
        existing[item["MONTH"]] = item;
        continue;
      }
      for (const col of that.viewOption === "Percentages"
        ? that.percentageColumns
        : that.numberColumns) {
        existing[item["MONTH"]][col.field] += item[col.field];
      }
    } else {
      const newItem: any = {
        info: {
          [blockKey]: item[blockKey],
        },
        [item["MONTH"]]: item,
      };
      item["DM_REP_ID"] && (newItem.info["DM_REP_ID"] = item["DM_REP_ID"]);
      item["REP_NAME"] && (newItem.info["REP_NAME"] = item["REP_NAME"]);

      r.push(newItem);
    }
  }

  for (const item of r) {
    item.info["POINTS"] = 0;
    item.info["SALES"] = 0;

    for (const month of PULSE_MONTHS) {
      if (!item[month]) {
        item[month] = {
          MONTH: month,
        };
        continue;
      }
      item[month]["POINTS"] && (item.info["POINTS"] += item[month]["POINTS"]);
      item[month]["SALES"] && (item.info["SALES"] += item[month]["SALES"]);
    }
    const currentMonth = new Date().getMonth() + 1;
    const avg = currentMonth > 6 ? currentMonth - 6 : 1;
    item.info["POINTS"] = item.info["POINTS"] / avg;
  }
  that.viewOption === "Percentages"
    ? r.sort((a, b) => (b.info["POINTS"] > a.info["POINTS"] ? 1 : -1))
    : r.sort((a, b) => (b.info["SALES"] > a.info["SALES"] ? 1 : -1));

  return [...Array(r.length * 3)].map((_, index) => {
    const month = PULSE_MONTHS[index % 3];
    const item = r[Math.floor(index / 3)];
    return {
      ...item[month],
      ...item.info,
      MONTH: moment(item[month].MONTH).format("MMM yyyy"),
    };
  });
};
