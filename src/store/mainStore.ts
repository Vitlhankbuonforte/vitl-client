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
    oldSelectedRegions: [] as string[],
    allChannels: [] as string[],
    selectedChannels: [] as string[],
    oldSelectedChannels: [] as string[],
    allDistricts: [] as string[],
    selectedDistricts: [] as string[],
    oldSelectedDistricts: [] as string[],
    allDMs: [] as string[],
    selectedDMs: [] as string[],
    oldSelectedDMs: [] as string[],
    selectedProduction: "All Production",
    allProductions: [] as string[],
    sortBy: null as any,
    sortItems: [] as any[],
    loading: false,
    allData: [] as any[],
    total: null,
    loadingTotal: true,
    viewOption: "Percentages",
    viewOptions: ["Percentages", "Numbers"],
    highlight: false,
    allPulseData: [] as any[],
    showRules: false,
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
      { field: "PERSONAL_PRODUCTION_P", title: "DM Personal" },
      { field: "SG_SALES_P", title: "SG %", class: "border-right-1" },
      { field: "PRR_P", title: "PRR" },
      { field: "VAR_P", title: "VAR" },
      { field: "PERSONAL_INSTALLS_P", title: "DM Installs" },
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
        if (state.sortBy === this.sortItems[0].field) {
          data = data.sort((a, b) => {
            const field = this.percentageColumns[0].field;
            let diff = b[field] - a[field];

            if (diff !== 0) {
              return diff > 0 ? 1 : -1;
            }
            diff = b["SALES_GOAL_P"] - a["SALES_GOAL_P"];

            if (diff !== 0) {
              return diff > 0 ? 1 : -1;
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
        data = data.sort((a, b) => b[state.sortBy] - a[state.sortBy]);
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
      if (this.lastBlock === "Region" || this.lastBlock === "District") {
        this.percentageColumns[0].field = "DM_RM_POINTS";
      } else {
        this.percentageColumns[0].field = "REP_POINTS";
      }

      if (this.viewOption == "Numbers") {
        this.sortItems = this.numberColumns;
      } else {
        this.sortItems = this.percentageColumns;
      }
      this.sortBy = this.sortItems[0].field;
    },
    async loadTotal() {
      if (this.pulseView) {
        return;
      }
      this.loadingTotal = true;

      const params = getFilterData(this);

      params.total = true;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/data`, {
        params,
      });
      this.loadingTotal = false;
      this.total = formatRow(res.data.total, this);
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
          .map((m) => `${m.month + 1}/1/${m.year}`)
          .join(",");
      }

      if (this.selectedProduction && !this.pulseView) {
        params.production = this.selectedProduction;
      }

      const {
        data: { rows, total },
      } = await axios.get(
        `${import.meta.env.VITE_API_URL}/${this.pulseView ? "pulse" : "data"}`,
        {
          params,
        }
      );

      this.total = formatRow(total, this);
      const allData = rows.map((row: any) => formatRow(row, this));
      this.allData = allData;

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
      this.loadingTotal = false;
    },
  },
});

const formatRow = (row: any, state: any) => {
  row["ACTIVE_REPS"] = row["ACTIVE_REPS"] || row["ACTIVE_REPS_"] || 0;
  row["RWS"] = row["RWS"] || row["RWS_"] || 0;

  for (const col of state.percentageColumns) {
    let v = +row[col.field] || 0;

    if (col.field === state.percentageColumns[0].field) {
      row[col.field] = Math.round(v);
      continue;
    }
    v = v * 100;

    if (["SALES_GOAL_P", "RWS_P"].includes(col.field)) {
      v = parseFloat(v.toFixed(1));
    } else {
      v = Math.round(v);
    }
    row[col.field] = v;
  }

  for (const col of state.numberColumns) {
    row[col.field] = Math.round(row[col.field] || 0);
  }
  return row;
};

const getFilterData = (state: any) => {
  const params: any = {
    block: state.lastBlock,
  };

  if (!state.pulseView) {
    params.month = (state.month || [])
      .filter(Boolean)
      .map((m: any) => `${m.month + 1}/1/${m.year}`)
      .join(",");
  }

  if (state.selectedChannels) {
    params.channel = state.selectedChannels.join(",");
  }

  if (state.selectedDMs) {
    params.dms = state.selectedDMs.join(",");
  }

  if (state.selectedDistricts) {
    params.district = state.selectedDistricts.join(",");
  }

  if (state.selectedRegions) {
    params.region = state.selectedRegions.join(",");
  }

  if (state.selectedProduction && !state.pulseView) {
    params.production = state.selectedProduction;
  }
  return params;
};

const generatePulseData = (data: any[], that: any) => {
  const r: any[] = [];
  const blockKey = "DISTRICT";
  data = JSON.parse(JSON.stringify(data));

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
          DM_NAME: item["DM_NAME"],
        },
        [item["MONTH"]]: item,
      };
      item["DM_REP_ID"] && (newItem.info["DM_REP_ID"] = item["DM_REP_ID"]);
      item["REP_NAME"] && (newItem.info["REP_NAME"] = item["REP_NAME"]);

      r.push(newItem);
    }
  }

  for (const item of r) {
    item.info["PULSE_POINTS"] = 0;
    item.info["SALES"] = 0;

    let avg = 0;

    for (const month of PULSE_MONTHS) {
      if (!item[month]) {
        item[month] = {
          MONTH: month,
        };
        continue;
      }
      item[month]["DM_RM_POINTS"] &&
        (item.info["PULSE_POINTS"] += item[month]["DM_RM_POINTS"]);
      item[month]["SALES"] && (item.info["SALES"] += item[month]["SALES"]);
      avg += 1;
    }
    // const currentMonth = new Date().getMonth() + 1;
    // const avg = currentMonth > 6 ? currentMonth - 6 : 1;
    item.info["PULSE_POINTS"] = item.info["PULSE_POINTS"] / avg;
  }
  that.viewOption === "Percentages"
    ? r.sort((a, b) =>
        b.info["PULSE_POINTS"] > a.info["PULSE_POINTS"] ? 1 : -1
      )
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
