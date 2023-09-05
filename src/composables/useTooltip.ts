import { ref, onMounted, onUnmounted } from "vue";
import { useMainStore } from "../store/mainStore";
import { storeToRefs } from "pinia";

export function useTooltip({
  columns,
  pulse = false,
}: {
  columns: any;
  pulse?: boolean;
}) {
  const store = useMainStore();
  const { data, pulseData, showRules } = storeToRefs(store);

  const tooltip = ref();
  const tValue = ref<any>(null);
  const currentEl = ref<Element>();

  const showTooltip = (
    target: Element,
    row: any,
    index: number,
    currentField: any
  ) => {
    tValue.value = { ...row, rank: index + 1, currentField };
    tooltip.value.hide();

    setTimeout(() => {
      tooltip.value.show({
        currentTarget: target,
      });
    });
  };

  const hideTooltip = () => {
    if (!tooltip.value) {
      return;
    }
    tooltip.value.hide();
    tValue.value = null;
  };

  function handleMouseMove(e: MouseEvent) {
    if (showRules.value) {
      return;
    }
    const { clientX, clientY } = e;
    const els = document.elementsFromPoint(clientX, clientY);
    const el = els.find((el) => (el as any).dataset.index);

    if (!el) {
      hideTooltip();
      currentEl.value = undefined;
    } else {
      if (currentEl.value === el) {
        return;
      }
      currentEl.value = el;
      const { index, field } = (el as any).dataset;
      const row = pulse ? pulseData.value[+index] : data.value[+index];
      const col =
        field === "MONTH"
          ? { title: "Month", field: "MONTH" }
          : field === "PULSE_POINTS"
          ? { title: "Points", field: "PULSE_POINTS" }
          : columns.find((col: any) => col.field === field);

      showTooltip(el, row, pulse ? Math.floor(+index / 3) : +index, col);
    }
  }

  onMounted(() => {
    window.addEventListener("mousemove", handleMouseMove);
  });
  onUnmounted(() => window.removeEventListener("mousemove", handleMouseMove));

  return { tooltip, tValue };
}
