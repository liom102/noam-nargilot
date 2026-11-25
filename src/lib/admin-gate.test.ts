import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// The admin password must never be written into the site's code.
describe("admin password", () => {
  it("is read from the server secret, not hard-coded", () => {
    const src = readFileSync("src/lib/admin.functions.ts", "utf8");
    expect(src).toContain('process.env["ADMIN_PASSWORD"]');
    expect(src).not.toContain("noam1234");
  });
});
