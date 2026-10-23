import { live, readCms } from "@/lib/cms/read";

export const trustItems = live(() => readCms().trustItems);
export const faqs = live(() => readCms().faqs);
