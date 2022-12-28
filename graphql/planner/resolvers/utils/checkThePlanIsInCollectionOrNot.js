"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const planCollection_1 = __importDefault(require("../../../../models/planCollection"));
async function checkThePlanIsInCollectionOrNot(planId, memberId) {
    let planCollections = await planCollection_1.default.find({
        memberId: memberId,
        plans: {
            $in: planId,
        },
    }).select('_id');
    let collectionIds = planCollections.map((pc) => pc._id);
    return collectionIds;
}
exports.default = checkThePlanIsInCollectionOrNot;
