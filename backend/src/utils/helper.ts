import { v4 as uuidv4 } from "uuid";

export const slugify = (text: string) => {
  const uuid = uuidv4().replace(/\s+/g, "").slice(0, 4);
  const slug = text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return `${slug}-${uuid}`;
};
