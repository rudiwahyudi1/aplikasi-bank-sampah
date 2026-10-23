const request = require("supertest");
const app = require("../src/app");

describe("Express Web Application Routes", () => {
    test("GET / should redirect unauthenticated users to /login", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });

    test("GET /login should render login page successfully with 200 OK", async () => {
        const res = await request(app).get("/login");
        expect(res.status).toBe(200);
        expect(res.text).toContain("login");
        expect(res.text).toContain("password");
    });

    test("GET /dashboard should redirect unauthenticated request to /login", async () => {
        const res = await request(app).get("/dashboard");
        expect(res.status).toBe(302);
        expect(res.headers.location).toMatch(/login/);
    });

    test("POST /login with missing credentials should redirect to /login", async () => {
        const res = await request(app)
            .post("/login")
            .type("form")
            .send({ login: "", password: "" });
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });

    test("GET /non-existent-page-xyz should return 404 status code", async () => {
        const res = await request(app).get("/non-existent-page-xyz");
        expect(res.status).toBe(404);
    });

    test("GET /metrics should return Prometheus formatted monitoring metrics", async () => {
        const res = await request(app).get("/metrics");
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toContain("text/plain");
        expect(res.text).toContain("process_uptime_seconds");
        expect(res.text).toContain("nodejs_memory_heap_used_bytes");
    });
});
