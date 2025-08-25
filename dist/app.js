"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_1 = __importDefault(require("./routes/health"));
const apis_1 = __importDefault(require("./routes/apis"));
const redis_1 = require("./db/redis");
(0, redis_1.connectRedis)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "0.0.0.0";
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api", health_1.default);
app.use("/api", apis_1.default);
// Start server
app.listen(parseInt(PORT), HOST, () => {
    console.log(`Jsapithrottler server running on http://${HOST}:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map