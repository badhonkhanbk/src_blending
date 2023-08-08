"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const banner_1 = __importDefault(require("../../../models/banner"));
const Banner_1 = __importDefault(require("../schemas/Banner"));
const EditBanner_1 = __importDefault(require("./input-type/EditBanner"));
const BannerInput_1 = __importDefault(require("./input-type/BannerInput"));
const newModel_1 = __importDefault(require("../../../models/newModel"));
const Widget_1 = __importDefault(require("../../../models/Widget"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let BannerResolver = class BannerResolver {
    /**
   * Creates a new banner.
   *
   * @param {BannerInput} data - The data for the new banner.
   * @return {Promise<string>} The ID of the newly created banner.
   */
    async createNewBanner(data) {
        let theme = await banner_1.default.create(data);
        return theme._id;
    }
    /**
   * Edits a banner.
   *
   * @param {EditBanner} data - the data needed to edit the banner
   * @return {Promise<string>} - a promise that resolves to a success message
   */
    async editABanner(data) {
        let theme = await banner_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        //@ts-ignore
        theme.updatedAt = Date.now();
        theme.save();
        return 'successfully edited';
    }
    /**
   * Removes a banner from the database.
   *
   * @param {String} bannerId - The ID of the banner to be removed.
   * @return {Promise<string | AppError>} A promise that resolves to a success message if the banner is removed successfully, or an AppError if the banner is in use in a widget or widget collection.
   */
    async removeABanner(bannerId) {
        let widget = await Widget_1.default.findOne({
            bannerId: bannerId,
        }).select('_id');
        if (widget) {
            return new AppError_1.default('The banner is in use in widget', 401);
        }
        let widgetWidgetCollection = await Widget_1.default.findOne({
            'widgetCollections.bannerId': {
                $in: [bannerId],
            },
        });
        if (widgetWidgetCollection) {
            return new AppError_1.default('The banner is in use in widgetCollection under a widget', 401);
        }
        await banner_1.default.findByIdAndDelete(bannerId);
        return 'theme removed successfully';
    }
    /**
   * Retrieves a single banner by its ID.
   *
   * @param {String} bannerId - The ID of the banner.
   * @return {Promise<BannerModel>} The banner with the specified ID.
   */
    async getASingleBanner(themeId) {
        let theme = await banner_1.default.findOne({ _id: themeId });
        return theme;
    }
    /**
   * Retrieves all banners based on the provided domain.
   *
   * @param {String} domain - The domain used to filter the banners. Can be nullable.
   * @return {Array} An array of banners sorted by createdAt in descending order.
   */
    async getAllBanners(domain) {
        if (!domain) {
            let banners = await banner_1.default.find().sort({ createdAt: -1 });
            return banners;
        }
        else {
            let banners = await banner_1.default.find({ domain: domain }).sort({
                createdAt: -1,
            });
            return banners;
        }
    }
    /**
   * Removes all banners from the system.
   *
   * @return {Promise<string>} A promise that resolves to 'done' when all banners have been removed.
   */
    async removeAllBanners() {
        await banner_1.default.deleteMany();
        return 'done';
    }
    /**
   * Removes all banners from the system.
   *
   * @return {Promise<string>} A promise that resolves to 'done' when all banners have been removed.
   */
    async getBannerCount() {
        console.log(JSON.stringify(newModel_1.default.obj));
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BannerInput_1.default]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "createNewBanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBanner_1.default]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "editABanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('bannerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "removeABanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => Banner_1.default),
    __param(0, (0, type_graphql_1.Arg)('bannerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "getASingleBanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Banner_1.default]),
    __param(0, (0, type_graphql_1.Arg)('domain', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "getAllBanners", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "removeAllBanners", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "getBannerCount", null);
BannerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BannerResolver);
exports.default = BannerResolver;
