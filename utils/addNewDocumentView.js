"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userViewTrack_1 = __importDefault(require("../models/userViewTrack"));
function addNewDocumentView(collectionType, documentId, onModel, userId) {
    return userViewTrack_1.default.create({
        collectionType,
        documentId,
        onModel,
        userId,
    });
}
exports.default = addNewDocumentView;
