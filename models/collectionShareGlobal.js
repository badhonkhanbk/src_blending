"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shareCollectionGlobalSchema = new mongoose_1.Schema({
    sharedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'MemberId is required'],
    },
    collectionId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'UserCollection',
    },
    globalAccepted: [
        {
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        },
    ],
});
const shareCollectionGlobal = (0, mongoose_1.model)('shareCollectionGlobal', shareCollectionGlobalSchema);
exports.default = shareCollectionGlobal;
