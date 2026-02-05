import fs from "fs";

export function writeCSV<T extends Record<string, any>>(
  data: T[],
  filePath: string
) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(d => Object.values(d).join(","));

  fs.writeFileSync(
    filePath,
    [headers, ...rows].join("\n"),
    "utf-8"
  );
}
