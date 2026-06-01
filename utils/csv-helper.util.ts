import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export class CsvUtil {
  /**
   * Reads a CSV file and returns an array of typed objects.
   * @param filePath - The path to the CSV file relative to the project root.
   * @param options - Optional parsing settings.
   * @returns An array of records mapped to the provided type T.
   */
  static readCsv<T>(
    filePath: string,
    { columns = true, skip_empty_lines = true, trim = true, cast = true } = {},
  ): T[] {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const fileContent = fs.readFileSync(absolutePath, { encoding: "utf-8" });

    return parse(fileContent, { columns, skip_empty_lines, trim, cast }) as T[];
  }
}
