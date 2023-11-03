"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
async function addOrRemoveFacilitators(spaceId, userIds, isRemove) {
    for (let i = 0; i < userIds.length; i++) {
        let user = await memberModel_1.default.findOne({ _id: userIds[i] }).select('_id facilitatorsAccess');
        if (!user) {
            continue;
        }
        let findIndex = user.facilitatorsAccess.findIndex((facilitatorSpace) => String(facilitatorSpace) === String(spaceId));
        if (findIndex === -1) {
            await memberModel_1.default.findOneAndUpdate({
                _id: userIds[i],
            }, {
                $push: {
                    facilitatorsAccess: spaceId,
                },
            });
        }
        else {
            if (isRemove) {
                await memberModel_1.default.findOneAndUpdate({
                    _id: userIds[i],
                }, {
                    $pull: {
                        facilitatorsAccess: spaceId,
                    },
                });
            }
        }
    }
    return 'done';
}
exports.default = addOrRemoveFacilitators;
