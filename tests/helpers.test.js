const {
    formatRupiah,
    formatWeight,
    formatDate,
    formatDateTime
} = require("../src/routes/_exportHelper");

describe("Export Helper Functions", () => {
    describe("formatRupiah", () => {
        test("should format standard positive number to Indonesian Rupiah", () => {
            const formatted = formatRupiah(15000);
            expect(formatted).toMatch(/Rp\s*15\.000/);
        });

        test("should handle zero and null cleanly", () => {
            const formattedZero = formatRupiah(0);
            expect(formattedZero).toMatch(/Rp\s*0/);

            const formattedNull = formatRupiah(null);
            expect(formattedNull).toMatch(/Rp\s*0/);
        });
    });

    describe("formatWeight", () => {
        test("should format weight to kilograms with 3 decimal places", () => {
            const formatted = formatWeight(2.5);
            expect(formatted).toMatch(/2,500\s*kg/);
        });

        test("should handle zero weight", () => {
            const formatted = formatWeight(0);
            expect(formatted).toMatch(/0,000\s*kg/);
        });
    });

    describe("formatDate and formatDateTime", () => {
        test("should return '-' for null or empty values", () => {
            expect(formatDate(null)).toBe("-");
            expect(formatDateTime(null)).toBe("-");
            expect(formatDate("")).toBe("-");
        });

        test("should format valid date correctly", () => {
            const result = formatDate("2026-08-17");
            expect(result).toMatch(/17.*2026/);
        });
    });
});
