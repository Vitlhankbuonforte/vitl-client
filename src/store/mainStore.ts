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
    total: null,
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

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/${this.pulseView ? "pulse" : "data"}`,
        {
          params,
        }
      );

      const allData: any[] = res.data.map((row: any) => {
        row["ACTIVE_REPS"] = row["ACTIVE_REPS"] || row["ACTIVE_REPS_"] || 0;
        row["RWS"] = row["RWS"] || row["RWS_"] || 0;

        // if (this.lastBlock === "Rep") {
        //   row.SALES_GOAL_P_POINTS =
        //     row.SALES_GOAL_P_POINTS > 1 ? 35 : row.SALES_GOAL_P_POINTS * 35;
        //   row.SG_SALES_P_POINTS =
        //     row.SG_SALES_P >= 0.3
        //       ? 5
        //       : row.SG_SALES_P <= 0.1
        //       ? 0
        //       : row.SG_SALES_P * 5;
        //   row.PRR_P_POINTS =
        //     row.PRR_P >= 0.6 ? 10 : row.PRR_P <= 0.5 ? 0 : row.PRR_P * 10;
        //   row.VAR_P_POINTS = row.VAR_P > 0.8 ? 5 : row.VAR_P * 5;
        //   row.PERSONAL_INSTALLS_P_POINTS =
        //     row.PERSONAL_INSTALLS_P >= 1 ? 10 : row.PERSONAL_INSTALLS_P * 10;
        //   row.RWS_P_POINTS =
        //     row.RWS_P >= 1 ? 10 : row.RWS_P <= 0.6 ? 0 : row.RWS_P * 10;
        //   row.NET_PPW_TO_TARGET_P_POINTS =
        //     row.NET_PPW_TO_TARGET_P >= 1
        //       ? 5
        //       : row.NET_PPW_TO_TARGET_P <= 0.8
        //       ? 0
        //       : row.NET_PPW_TO_TARGET_P * 5;
        // } else {
        //   row.SALES_GOAL_P_POINTS =
        //     row.SALES_GOAL_P_POINTS > 1
        //       ? 35
        //       : row.SALES_GOAL_P_POINTS < 5 / 10
        //       ? 0
        //       : row.SALES_GOAL_P_POINTS * 35;
        //   row.PERSONAL_PRODUCTION_P_POINTS =
        //     row.PERSONAL_PRODUCTION_P >= 1
        //       ? 10
        //       : row.PERSONAL_PRODUCTION_P < 4 / 10
        //       ? 0
        //       : row.PERSONAL_PRODUCTION_P * 10;
        //   row.SG_SALES_P_POINTS =
        //     row.SG_SALES_P >= 0.3
        //       ? 5
        //       : row.SG_SALES_P <= 0.1
        //       ? 0
        //       : row.SG_SALES_P * 5;
        //   row.PRR_P_POINTS =
        //     row.PRR_P >= 0.6 ? 10 : row.PRR_P <= 0.5 ? 0 : row.PRR_P * 10;

        //   if (this.pulseView) {
        //     if (row.MONTH > "2023-07-01") {
        //       row.VAR_P_POINTS = row.VAR_P > 0.8 ? 10 : row.VAR_P * 10;
        //     } else {
        //       row.VAR_P_POINTS = row.VAR_P > 0.25 ? 5 : row.VAR_P * 5;
        //     }
        //   } else {
        //     row.VAR_P_POINTS = row.VAR_P > 0.8 ? 5 : row.VAR_P * 5;
        //   }

        //   if (this.pulseView && row.MONTH > "2023-07-01") {
        //     row.PERSONAL_INSTALLS_P_POINTS = 0;
        //   } else {
        //     row.PERSONAL_INSTALLS_P_POINTS =
        //       row.PERSONAL_INSTALLS_P >= 1
        //         ? 10
        //         : row.PERSONAL_INSTALLS_P < 2 / 6
        //         ? 0
        //         : row.PERSONAL_INSTALLS_P * 10;
        //   }
        //   row.CLEAN_SALES_P_POINTS =
        //     row.CLEAN_SALES_P >= 1
        //       ? 10
        //       : row.CLEAN_SALES_P <= 0.6
        //       ? 0
        //       : row.CLEAN_SALES_P * 10;

        //   if (this.pulseView) {
        //     if (row.MONTH > "2023-07-01") {
        //       row.RWS_P_POINTS = row.RWS_P >= 1 ? 15 : row.RWS_P * 15;
        //     } else {
        //       row.RWS_P_POINTS = row.RWS_P >= 1 ? 10 : row.RWS_P * 10;
        //     }
        //   } else {
        //     row.RWS_P_POINTS =
        //       row.RWS_P >= 1 ? 10 : row.RWS_P <= 0.6 ? 0 : row.RWS_P * 10;
        //   }
        //   row.NET_PPW_TO_TARGET_P_POINTS =
        //     row.NET_PPW_TO_TARGET_P >= 1
        //       ? 5
        //       : row.NET_PPW_TO_TARGET_P <= 0.8
        //       ? 0
        //       : row.NET_PPW_TO_TARGET_P * 5;
        // }

        for (const col of this.percentageColumns) {
          let v = +row[col.field] || 0;

          if (col.field === this.percentageColumns[0].field) {
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

        for (const col of this.numberColumns) {
          row[col.field] = Math.round(row[col.field] || 0);
        }
        return row;
      });
      this.total = allData.find((r) => r.BLOCK === "Total");
      this.allData = allData.filter((r) => r.BLOCK !== "Total");

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
    }
    const currentMonth = new Date().getMonth() + 1;
    const avg = currentMonth > 6 ? currentMonth - 6 : 1;
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
