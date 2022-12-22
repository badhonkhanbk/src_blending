"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.enable('trust proxy');
// Implement CORS
app.use((0, cors_1.default)());
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10000kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10000kb' }));
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, compression_1.default)());
// Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 1000000,
    windowMs: 60 * 60 * 100000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/graphql', limiter);
exports.default = app;
