import { GenericRecord } from "@/types";

export const getFilters = (
  filters1: GenericRecord[],
  filters2: GenericRecord[],
): GenericRecord[] => {
  return filters1.map((filter1) => {
    const filter2 = filters2.find((f) => f.id === filter1.id);
    if (filter2) {
      return {
        ...filter1,
        value: filter2.value ?? [],
        value_label: filter2.value_label ?? "",
        applied: true,
      };
    }
    return filter1;
  });
};

