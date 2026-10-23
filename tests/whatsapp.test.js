const {
    formatPhoneNumber,
    createWhatsAppLink,
    templates
} = require("../src/services/whatsapp");

describe("WhatsApp Notification Service", () => {
    describe("formatPhoneNumber", () => {
        test("should convert Indonesian local numbers 08xxx to 628xxx", () => {
            expect(formatPhoneNumber("08123456789")).toBe("628123456789");
        });

        test("should convert numbers starting with 8xxx to 628xxx", () => {
            expect(formatPhoneNumber("8123456789")).toBe("628123456789");
        });

        test("should strip non-numeric characters (dashes, spaces, plus)", () => {
            expect(formatPhoneNumber("+62 812-3456-7890")).toBe("6281234567890");
        });

        test("should return empty string for null or empty input", () => {
            expect(formatPhoneNumber(null)).toBe("");
            expect(formatPhoneNumber("")).toBe("");
        });
    });

    describe("createWhatsAppLink", () => {
        test("should generate valid wa.me URL with encoded message", () => {
            const url = createWhatsAppLink("08123456789", "Halo Budi!");
            expect(url).toContain("https://wa.me/628123456789?text=Halo%20Budi!");
        });

        test("should return empty string if phone is empty", () => {
            expect(createWhatsAppLink("", "Halo")).toBe("");
        });
    });

    describe("templates", () => {
        test("pickupAccepted template should contain required keywords", () => {
            const msg = templates.pickupAccepted({
                nasabahName: "Ahmad",
                requestCode: "PKP-001",
                officerName: "Pak Budi",
                scheduleDate: "2026-10-24"
            });
            expect(msg).toContain("Ahmad");
            expect(msg).toContain("#PKP-001");
            expect(msg).toContain("Pak Budi");
        });

        test("pickupCompleted template should contain weight and amount", () => {
            const msg = templates.pickupCompleted({
                nasabahName: "Siti",
                requestCode: "PKP-002",
                totalWeight: "5,000 kg",
                totalAmount: "Rp 25.000"
            });
            expect(msg).toContain("Siti");
            expect(msg).toContain("5,000 kg");
            expect(msg).toContain("Rp 25.000");
        });
    });
});
