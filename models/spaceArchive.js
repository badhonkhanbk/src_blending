"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SpaceArchiveSchema = new mongoose_1.Schema({
    archiveName: {
        type: String,
        required: [true, 'archiveName is required'],
    },
    icon: String,
    spaceBlogs: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'SpaceBlog',
        },
    ],
    spaceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Space',
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    blogsCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
SpaceArchiveSchema.pre('save', async function (next) {
    //@ts-ignore
    this.blogsCount = this.spaceBlogs.length;
    next();
});
SpaceArchiveSchema.pre('findOneAndUpdate', function (next) {
    // doc.slug = slugify(doc.title.toString() + 'hello');
    let update = this.getUpdate();
    console.log(update);
    //@ts-ignore
    if (update.spaceBlogs) {
        //@ts-ignore
        update.blogsCount = update.spaceBlogs.length;
        // if (update['$set'].title) {
        //   update['$set'] = {
        //     ...update['$set'],
        //     slug: slugify(update['$set'].title.toString()),
        //   };
        // }
    }
    next();
});
const SpaceArchive = (0, mongoose_1.model)('SpaceArchive', SpaceArchiveSchema);
exports.default = SpaceArchive;
