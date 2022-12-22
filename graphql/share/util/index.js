"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const share_1 = __importDefault(require("../../../models/share"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
async function default_1(token, sharedWith) {
    const share = await share_1.default.findOne({ _id: token });
    let member = await memberModel_1.default.findOne({ _id: sharedWith }).select('email');
    if (!share) {
        return false;
    }
    if (!share.shareTo.includes(member.email)) {
        return false;
    }
    return true;
}
exports.default = default_1;
