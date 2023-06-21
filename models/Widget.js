"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const widgetSchema = new mongoose_1.Schema({
    widgetName: {
        type: String,
        required: [true, 'Widget Name Is Required'],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug Is Required'],
        unique: true,
    },
    bannerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Banner' },
    widgetType: String,
    clickCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    collectionCount: {
        type: Number,
        default: 0,
    },
    widgetCollections: [
        {
            showTabMenu: { type: Boolean, default: true },
            displayName: String,
            icon: String,
            slug: String,
            banner: String,
            collectionData: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdminCollection' },
            isPublished: { type: Boolean, default: false },
            publishDate: String,
            expiryDate: String,
            publishedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin' },
            orderBy: String,
            theme: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Theme' },
            bannerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Banner' },
            publishedAt: Date,
            filter: {
                filterType: String,
                values: [
                    {
                        value: mongoose_1.Schema.Types.ObjectId,
                        label: String,
                    },
                ],
            },
        },
    ],
});
const Widget = (0, mongoose_1.model)('Widget', widgetSchema);
exports.default = Widget;
// addWidget
// deleteWidget
// editWidget
// getAllWidgets
// addWidgetCollection
// removeWidgetCollection
// editWidgetCollection
//
