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
const AddWidgetInput_1 = __importDefault(require("./input-type/AddWidgetInput"));
const WidgetCollection_1 = __importDefault(require("./input-type/WidgetCollection"));
const CreateEditWidgetCollection_1 = __importDefault(require("./input-type/CreateEditWidgetCollection"));
const EditWidget_1 = __importDefault(require("./input-type/EditWidget"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const Widget_1 = __importDefault(require("../../../models/Widget"));
const WidgetForClient_1 = __importDefault(require("../schemas/WidgetForClient"));
const Widget_2 = __importDefault(require("../schemas/Widget"));
const WidgetCollection_2 = __importDefault(require("../schemas/WidgetCollection"));
const theme_1 = __importDefault(require("../../../models/theme"));
const banner_1 = __importDefault(require("../../../models/banner"));
const WidgetCollectionForClient_1 = __importDefault(require("../schemas/WidgetCollectionForClient"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const banner_2 = __importDefault(require("../../../models/banner"));
const adminCollection_1 = __importDefault(require("../../../models/adminCollection"));
const theme_2 = __importDefault(require("../../../models/theme"));
const SingleWidgetCollection_1 = __importDefault(require("../schemas/SingleWidgetCollection"));
const mongoose_1 = __importDefault(require("mongoose"));
const wiki_1 = __importDefault(require("../../../models/wiki"));
const Plan_1 = __importDefault(require("../../../models/Plan"));
const generalBlog_1 = __importDefault(require("../../../models/generalBlog"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const UserIngredientCompareList_1 = __importDefault(require("../../../models/UserIngredientCompareList"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const wikiComment_1 = __importDefault(require("../../../models/wikiComment"));
const generalBlogCollection_1 = __importDefault(require("../../../models/generalBlogCollection"));
const blogComment_1 = __importDefault(require("../../../models/blogComment"));
var key;
(function (key) {
    key["Ingredient"] = "foodCategories";
    key["Type"] = "recipeBlendCategory";
    key["Random"] = "adminIds";
    // WIKI = 'Wiki',
})(key || (key = {}));
let WigdetResolver = class WigdetResolver {
    /**
     * Adds a new widget.
     *
     * @param {AddWidgetInput} data - The data for the new widget.
     * @return {Promise<string>} The ID of the newly created widget.
     */
    async addNewWidget(data) {
        let widget = await Widget_1.default.create(data);
        return widget._id;
    }
    /**
     * Adds a new widget collection.
     *
     * @param {String} widgetId - The ID of the widget.
     * @param {WidgetCollectionInput} widgetCollection - The widget collection data.
     * @return {any} The newly created widget collection data.
     */
    async addNewWidgetCollection(widgetId, widgetCollection) {
        let data = widgetCollection;
        data._id = new mongoose_1.default.mongo.ObjectId();
        if (data.isPublished) {
            data.publishedAt = Date.now();
        }
        await Widget_1.default.findOneAndUpdate({ _id: widgetId }, {
            $push: { widgetCollections: data },
            $inc: { collectionCount: 1 },
        });
        data.bannerId = await banner_2.default.findOne({
            _id: widgetCollection.bannerId,
        });
        data.collectionData = await adminCollection_1.default.findOne({
            _id: widgetCollection.collectionData,
        });
        data.theme = await theme_2.default.findOne({ _id: widgetCollection.theme });
        return data;
    }
    /**
     * Remove a widget collection.
     *
     * @param {String} widgetId - the ID of the widget
     * @param {String} widgetCollectionId - the ID of the widget collection
     * @return {Promise<string>} - a promise that resolves to a string indicating the success of the removal
     */
    async removeAWidgetCollection(widgetId, widgetCollectionId) {
        await Widget_1.default.findOneAndUpdate({ _id: widgetId }, {
            $pull: {
                widgetCollections: { _id: widgetCollectionId },
            },
            $inc: { collectionCount: -1 },
        });
        return 'widget collection removed successfully';
    }
    //change
    /**
     * Edits a widget collection.
     *
     * @param {String} widgetId - The ID of the widget.
     * @param {CreateEditWidgetCollection} widgetCollection - The widget collection to edit.
     * @return {any} The edited widget collection data.
     */
    async editAWidgetCollection(widgetId, widgetCollection) {
        let data = widgetCollection;
        if (data.isPublished) {
            data.publishedAt = Date.now();
        }
        let obj = {};
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            obj[`widgetCollections.$.${keys[i]}`] = data[keys[i]];
        }
        delete obj._id;
        console.log(obj);
        await Widget_1.default.findOneAndUpdate({ _id: widgetId, 'widgetCollections._id': widgetCollection._id }, obj, { new: true });
        data.bannerId = await banner_2.default.findOne({
            _id: widgetCollection.bannerId,
        });
        data.collectionData = await adminCollection_1.default.findOne({
            _id: widgetCollection.collectionData,
        });
        data.theme = await theme_2.default.findOne({ _id: widgetCollection.theme });
        return data;
    }
    /**
     * Removes a widget from the database.
     *
     * @param {String} widgetId - The ID of the widget to be removed.
     * @return {String} A message indicating the success of the operation.
     */
    async removeAWidget(widgetId) {
        await Widget_1.default.findOneAndRemove({ _id: widgetId });
        return 'widget removed successfully';
    }
    /**
     * Retrieves all widgets from the database.
     *
     * @return {Promise<WidgetModel[]>} The array of widgets.
     */
    async getAllWidgets() {
        let widgets = await Widget_1.default.find();
        return widgets;
    }
    /**
     * Retrieves all widget collections for a given widget ID.
     *
     * @param {String} widgetId - The ID of the widget.
     * @return {Array} An array of widget collections.
     */
    async getAllWidgetCollection(widgetId) {
        let widget = await Widget_1.default.findOne({ _id: widgetId });
        return widget.widgetCollections;
    }
    /**
     * Retrieves a single widget by its ID.
     *
     * @param {String} widgetId - The ID of the widget to retrieve.
     * @return {Promise<WidgetModel>} The widget with the specified ID.
     */
    async getASingleWidget(widgetId) {
        let widget = await Widget_1.default.findOne({ _id: widgetId }).populate('widgetCollections.theme widgetCollections.bannerId slug widgetCollections.collectionData');
        return widget;
    }
    /**
     * Retrieves a single widget collection.
     *
     * @param {String} widgetId - The ID of the widget.
     * @param {String} widgetCollectionId - The ID of the widget collection.
     * @return {Object} The widget collection matching the provided IDs.
     */
    async getASingleWidgetCollection(widgetId, widgetCollectionId) {
        let widget = await Widget_1.default.findOne({ _id: widgetId }).populate('widgetCollections.collectionData');
        return widget.widgetCollections.find(
        // @ts-ignore
        (widgetCollection) => String(widgetCollection._id) === widgetCollectionId);
    }
    /**
     * Edits a widget.
     *
     * @param data - The data for editing the widget.
     * @returns A message indicating the success of the edit operation.
     */
    async editAWidget(data) {
        await Widget_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Widget edited successfully.';
    }
    /**
     * Retrieves the widget type based on the given slug.
     *
     * @param {String} slug - The slug of the widget.
     * @return {Promise<type>} The widget type.
     */
    async getWidgetTypeBySlug(slug) {
        let widget = await Widget_1.default.findOne({ slug: slug }).select('widgetType');
        return widget.widgetType;
    }
    //grid
    /**
     * Retrieves widget collections based on the provided widget slug and current date.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {string} currentDate - The current date (optional).
     * @return {Promise<any>} Returns a Promise that resolves to the widget collections.
     */
    async getWidgetCollections(widgetSlug, currentDate) {
        let widget = await Widget_1.default.findOne({
            slug: widgetSlug,
        })
            .populate('bannerId')
            .populate({
            path: 'widgetCollections.collectionData',
        });
        if (!widget) {
            return new AppError_1.default('Widget not found!', 404);
        }
        if (widget.widgetType !== 'Grid') {
            return new AppError_1.default('The request must be for Grid type only', 403);
        }
        if (currentDate) {
            let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
            widget.widgetCollections = widget.widgetCollections.filter((wc) => {
                if (wc.publishDate) {
                    return new Date(wc.publishDate) >= today;
                }
                else if (wc.publishDate && wc.expiryDate) {
                    return (new Date(wc.publishDate) >= today &&
                        new Date(wc.expiryDate) <= today);
                }
                else {
                    return true;
                }
            });
        }
        await Widget_1.default.findOneAndUpdate({
            _id: widget._id,
        }, {
            $inc: {
                viewCount: 1,
            },
        });
        return widget;
    }
    //
    /**
     * Retrieves an entity collection based on the provided widget slug and collection slug.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {Promise<any>} The entity collection.
     */
    async getEntityCollection(widgetSlug, collectionSlug) {
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount');
        if (widget.widgetType !== 'Grid') {
            return new AppError_1.default('The request must be for Grid type only', 403);
        }
        let widgetCollection = widget.widgetCollections.filter(
        //@ts-ignore
        (wc) => wc.slug === collectionSlug)[0];
        if (!widgetCollection) {
            return new AppError_1.default('No widget collection found', 404);
        }
        let values = [];
        //@ts-ignore
        let collectionType = widgetCollection.collectionData.collectionType;
        if (collectionType === 'Recipe') {
            let orderBy = {};
            if (!widgetCollection.orderBy) {
                widgetCollection.orderBy = 'PUBLISHED_DATE';
            }
            if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                orderBy = { createdAt: 1 };
            }
            else if (widgetCollection.orderBy === 'POPULARITY') {
                orderBy = { averageRating: -1 };
            }
            else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                orderBy = { name: 1 };
            }
            else {
                orderBy = { createdAt: -1 };
            }
            // console.log("ft",widgetCollection.filter.filterType);
            let filter = {};
            if (widgetCollection.filter.filterType === 'Ingredient') {
                //@ts-ignore
                values = widgetCollection.filter.values.map((v) => {
                    return v.label;
                });
                filter = {
                    $in: values,
                };
            }
            else if (widgetCollection.filter.filterType === 'Type') {
                //@ts-ignore
                values = widgetCollection.filter.values.map((v) => {
                    return v.value;
                });
                filter = {
                    $in: values,
                };
            }
            else {
                widgetCollection.filter.filterType = 'Random';
                values = widgetCollection.filter.values.map((v) => {
                    return v.value;
                });
                filter = [];
            }
            let recipes;
            recipes = await recipeModel_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: widgetCollection.collectionData.children,
                },
                [key[widgetCollection.filter.filterType]]: filter,
            })
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate('brand')
                .populate('recipeBlendCategory')
                .sort(orderBy)
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            // if (!theme) {
            //   theme = {
            //     link: null,
            //   };
            // }
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: widgetCollection.filter.filterType === 'Random'
                    ? {
                        filterType: 'Random',
                        values: [],
                    }
                    : {
                        filterType: key[widgetCollection.filter.filterType],
                        values: widgetCollection.filter.values,
                    },
                data: {
                    collectionType: collectionType,
                    Recipe: recipes,
                    Wiki: [],
                    Plan: [],
                },
            };
            return returnWidgetCollection;
        }
        else if (collectionType === 'Wiki') {
            let orderBy = {};
            if (!widgetCollection.orderBy) {
                widgetCollection.orderBy = 'ALPHABETICALLY';
            }
            if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                orderBy = { wikiTitle: 1 };
            }
            else {
                orderBy = { createdAt: -1 };
            }
            let wikis;
            wikis = await wiki_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: widgetCollection.collectionData.children,
                },
            })
                .populate({
                path: 'author',
                select: 'firstName lastName displayName email profilePicture',
            })
                .sort(orderBy)
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: {
                    filterType: key[widgetCollection.filter.filterType],
                    values: widgetCollection.filter.values,
                },
                data: {
                    collectionType: collectionType,
                    Recipe: [],
                    Wiki: wikis,
                    Plan: [],
                },
            };
            return returnWidgetCollection;
        }
        else if (collectionType === 'Plan') {
            let plans;
            let orderBy = {};
            if (!widgetCollection.orderBy) {
                widgetCollection.orderBy = 'PUBLISHED_DATE';
            }
            if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                orderBy = { createdAt: 1 };
            }
            else if (widgetCollection.orderBy === 'POPULARITY') {
                orderBy = { averageRating: 1 };
            }
            else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                orderBy = { planName: 1 };
            }
            else {
                orderBy = { createdAt: -1 };
            }
            plans = await Plan_1.default.find({ isGlobal: true })
                .populate({
                path: 'planData.recipes',
                populate: [
                    {
                        path: 'defaultVersion',
                        populate: {
                            path: 'ingredients.ingredientId',
                            model: 'BlendIngredient',
                            select: 'ingredientName',
                        },
                        select: 'postfixTitle ingredients',
                    },
                    {
                        path: 'brand',
                    },
                    {
                        path: 'recipeBlendCategory',
                    },
                ],
            })
                .sort(orderBy)
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: {
                    filterType: key[widgetCollection.filter.filterType],
                    values: widgetCollection.filter.values,
                },
                data: {
                    collectionType: collectionType,
                    Recipes: [],
                    Wikis: [],
                    Plans: plans,
                },
            };
            return returnWidgetCollection;
        }
        else {
            return new AppError_1.default('Error CollectionType not Exists', 403);
        }
    }
    //Grid
    /**
     * Retrieves a recipe collection based on the provided widget and collection slugs.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {Object} The retrieved recipe collection.
     */
    async getRecipeCollection(widgetSlug, collectionSlug) {
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount');
        if (widget.widgetType !== 'Grid') {
            return new AppError_1.default('The request must be for Grid type only', 403);
        }
        let widgetCollection = widget.widgetCollections.filter(
        //@ts-ignore
        (wc) => wc.slug === collectionSlug)[0];
        if (!widgetCollection) {
            return new AppError_1.default('No widget collection found', 404);
        }
        let values = [];
        //@ts-ignore
        let collectionType = widgetCollection.collectionData.collectionType;
        if (collectionType === 'Recipe') {
            let orderBy = {};
            if (!widgetCollection.orderBy) {
                widgetCollection.orderBy = 'PUBLISHED_DATE';
            }
            if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                orderBy = { createdAt: 1 };
            }
            else if (widgetCollection.orderBy === 'POPULARITY') {
                orderBy = { averageRating: -1 };
            }
            else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                orderBy = { name: 1 };
            }
            else {
                orderBy = { createdAt: -1 };
            }
            // console.log("ft",widgetCollection.filter.filterType);
            let filter = {};
            if (widgetCollection.filter.filterType === 'Ingredient') {
                //@ts-ignore
                values = widgetCollection.filter.values.map((v) => {
                    return v.label;
                });
                filter = {
                    $in: values,
                };
            }
            else if (widgetCollection.filter.filterType === 'Type') {
                //@ts-ignore
                values = widgetCollection.filter.values.map((v) => {
                    return v.value;
                });
                filter = {
                    $in: values,
                };
            }
            else {
                widgetCollection.filter.filterType = 'Random';
                values = widgetCollection.filter.values.map((v) => {
                    return v.value;
                });
                filter = [];
            }
            let recipes;
            recipes = await recipeModel_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: widgetCollection.collectionData.children,
                },
                [key[widgetCollection.filter.filterType]]: filter,
            })
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate('brand')
                .populate('recipeBlendCategory')
                .sort(orderBy)
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: widgetCollection.filter.filterType === 'Random'
                    ? {
                        filterType: 'Random',
                        values: [],
                    }
                    : {
                        filterType: key[widgetCollection.filter.filterType],
                        values: widgetCollection.filter.values,
                    },
                data: {
                    collectionType: collectionType,
                    Recipes: recipes,
                    Wikis: [],
                    Plans: [],
                },
            };
            return returnWidgetCollection;
        }
        else {
            return new AppError_1.default('This collection is only for recipes', 403);
        }
    }
    //Grid
    /**
     * Retrieves a widget collection from the database based on the provided widgetSlug and collectionSlug.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {Object} The retrieved widget collection.
     */
    async getWikiCollection(widgetSlug, collectionSlug) {
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount');
        if (widget.widgetType !== 'Grid') {
            return new AppError_1.default('The request muut be for Grid type only', 403);
        }
        let widgetCollection = widget.widgetCollections.filter(
        //@ts-ignore
        (wc) => wc.slug === collectionSlug)[0];
        if (!widgetCollection) {
            return new AppError_1.default('No widget collection found', 404);
        }
        let values = [];
        //@ts-ignore
        let collectionType = widgetCollection.collectionData.collectionType;
        if (collectionType === 'Wiki') {
            let orderBy = {};
            if (!widgetCollection.orderBy) {
                widgetCollection.orderBy = 'ALPHABETICALLY';
            }
            if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                orderBy = { wikiTitle: 1 };
            }
            else {
                orderBy = { createdAt: -1 };
            }
            let wikis;
            wikis = await wiki_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: widgetCollection.collectionData.children,
                },
            })
                .populate({
                path: 'author',
                select: 'firstName lastName displayName email profilePicture',
            })
                .sort(orderBy)
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: {
                    filterType: key[widgetCollection.filter.filterType],
                    values: widgetCollection.filter.values,
                },
                data: {
                    collectionType: collectionType,
                    Recipes: [],
                    Wikis: wikis,
                    Plans: [],
                },
            };
            return returnWidgetCollection;
        }
        else {
            return new AppError_1.default('This collection is only for Wikis', 403);
        }
    }
    //Grid
    /**
     * Retrieves a plan collection based on the provided widget and collection slugs.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {any} The retrieved plan collection.
     */
    async getPlanCollection(widgetSlug, collectionSlug) {
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount');
        if (!widget.widgetType) {
            return new AppError_1.default('No Widget type defined', 403);
        }
        if (widget.widgetType !== 'Grid') {
            return new AppError_1.default('The request muust be for Grid type only', 403);
        }
        let widgetCollection = widget.widgetCollections.filter(
        //@ts-ignore
        (wc) => wc.slug === collectionSlug)[0];
        if (!widgetCollection) {
            return new AppError_1.default('No widget collection found', 404);
        }
        let values = [];
        //@ts-ignore
        let collectionType = widgetCollection.collectionData.collectionType;
        if (collectionType === 'Plan') {
            let plans;
            let orderBy = {};
            if (!widgetCollection.orderBy) {
                widgetCollection.orderBy = 'PUBLISHED_DATE';
            }
            if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                orderBy = { createdAt: 1 };
            }
            else if (widgetCollection.orderBy === 'POPULARITY') {
                orderBy = { planName: 1 };
            }
            else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                orderBy = { planName: 1 };
            }
            else {
                orderBy = { createdAt: -1 };
            }
            plans = await Plan_1.default.find({ isGlobal: true })
                .populate({
                path: 'planData.recipes',
                populate: [
                    {
                        path: 'defaultVersion',
                        populate: {
                            path: 'ingredients.ingredientId',
                            model: 'BlendIngredient',
                            select: 'ingredientName',
                        },
                        select: 'postfixTitle ingredients',
                    },
                    {
                        path: 'brand',
                    },
                    {
                        path: 'recipeBlendCategory',
                    },
                ],
            })
                .sort(orderBy)
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: {
                    filterType: key[widgetCollection.filter.filterType],
                    values: widgetCollection.filter.values,
                },
                data: {
                    collectionType: collectionType,
                    Recipes: [],
                    Wikis: [],
                    Plans: plans,
                },
            };
            return returnWidgetCollection;
        }
        else {
            return new AppError_1.default('This collection is only for Plans', 403);
        }
    }
    /**
     * Retrieves an entity widget.
     *
     * @param {String} widgetSlug - the slug of the widget
     * @param {string} currentDate - the current date (nullable)
     * @return {any} the entity widget
     */
    async getEntityWidget(widgetSlug, userId, currentDate) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount slug');
        if (currentDate) {
            let today = new Date(new Date().toISOString().slice(0, 10));
            widget.widgetCollections = widget.widgetCollections.filter((wc) => {
                if (wc.publishDate && wc.expiryDate) {
                    return (new Date(wc.publishDate) <= today &&
                        new Date(wc.expiryDate) >= today);
                }
                else if (wc.publishDate) {
                    console.log(wc.publishDate);
                    console.log(today);
                    return new Date(wc.publishDate) <= today;
                }
                else {
                    return true;
                }
            });
        }
        returnWidget._id = widget._id;
        returnWidget.bannerId = widget.bannerId;
        returnWidget.slug = widget.slug;
        returnWidget.widgetName = widget.widgetName;
        returnWidget.widgetType = widget.widgetType;
        returnWidget.collectionCount = widget.collectionCount;
        returnWidget.widgetCollections = [];
        // let recipes = [];
        // let ingredients: any[] = [];
        // console.log(widget.widgetCollections);
        for (let i = 0; i < widget.widgetCollections.length; i++) {
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Recipe') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { averageRating: -1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { name: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                // console.log("ft",widgetCollection.filter.filterType);
                let filter = {};
                let values = [];
                if (widgetCollection.filter.filterType === 'Ingredient') {
                    //@ts-ignore
                    values = widgetCollection.filter.values.map((v) => {
                        return v.label;
                    });
                    filter = {
                        $in: values,
                    };
                }
                else if (widgetCollection.filter.filterType === 'Type') {
                    //@ts-ignore
                    values = widgetCollection.filter.values.map((v) => {
                        return v.value;
                    });
                    filter = {
                        $in: values,
                    };
                }
                else {
                    widgetCollection.filter.filterType = 'Random';
                    values = widgetCollection.filter.values.map((v) => {
                        return v.value;
                    });
                    filter = [];
                }
                let recipes;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                recipes = await recipeModel_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widget.widgetCollections[i].collectionData.children,
                        // .slice(
                        //   0,
                        //   8
                        // ),
                    },
                    [key[widget.widgetCollections[i].filter.filterType]]: filter,
                })
                    .populate({
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                })
                    .populate('brand')
                    .populate('recipeBlendCategory')
                    .sort('orderBy')
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: widgetCollection.filter.filterType === 'Random'
                        ? {
                            filterType: 'Random',
                            values: [],
                        }
                        : {
                            filterType: key[widgetCollection.filter.filterType],
                            values: widgetCollection.filter.values,
                        },
                    data: {
                        collectionType: collectionType,
                        Recipe: recipes,
                        Plan: [],
                        Wiki: [],
                        GeneralBlog: [],
                    },
                });
            }
            else if (collectionType === 'Wiki') {
                let orderBy = {};
                if (!widget.widgetCollections[i].orderBy) {
                    widget.widgetCollections[i].orderBy = 'ALPHABETICALLY';
                }
                if (widget.widgetCollections[i].orderBy === 'ALPHABETICALLY') {
                    orderBy = { wikiTitle: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let wikis;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                wikis = await wiki_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widget.widgetCollections[i].collectionData.children,
                    },
                })
                    .populate({
                    path: 'author',
                    select: 'firstName lastName displayName email profilePicture',
                })
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                let returnData = [];
                if (userId) {
                    for (let i = 0; i < wikis.length; i++) {
                        let data = wikis[i];
                        if (wikis[i].type === 'Ingredient') {
                            // console.log('Ingredient');
                            let blendIngredient = await blendIngredient_1.default.findOne({
                                _id: wikis[i]._id,
                            }).select('portions featuredImage category');
                            data.image = blendIngredient.featuredImage;
                            data.category = blendIngredient.category;
                            data.portions = blendIngredient.portions;
                            let compare = await UserIngredientCompareList_1.default.findOne({
                                userId: userId,
                                ingredients: { $in: wikis[i]._id },
                            }).select('_id');
                            if (compare) {
                                data.hasInCompare = true;
                            }
                            else {
                                data.hasInCompare = false;
                            }
                        }
                        else if (wikis[i].type === 'Nutrient') {
                            // console.log('nutrient');
                            let nutrient = await blendNutrient_1.default.findOne({
                                _id: wikis[i]._id,
                            }).populate({
                                path: 'category',
                                select: 'categoryName',
                            });
                            //@ts-ignore
                            data.category = nutrient.category
                                ? //@ts-ignore
                                    nutrient.category.categoryName
                                : '';
                        }
                        else {
                            // console.log(wikis[i].type);
                        }
                        let comments = await wikiComment_1.default.find({
                            entityId: wikis[i]._id,
                        }).select('_id');
                        data.commentsCount = comments.length;
                        returnData.push(data);
                    }
                }
                else {
                    returnData = wikis;
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: [],
                        Wiki: returnData,
                        GeneralBlog: [],
                    },
                });
            }
            else if (collectionType === 'Plan') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { averageRating: 1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { planName: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let plans;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                plans = await Plan_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .populate({
                    path: 'planData.recipes',
                    populate: [
                        {
                            path: 'defaultVersion',
                            populate: {
                                path: 'ingredients.ingredientId',
                                model: 'BlendIngredient',
                                select: 'ingredientName',
                            },
                            select: 'postfixTitle ingredients',
                        },
                        {
                            path: 'brand',
                        },
                        {
                            path: 'recipeBlendCategory',
                        },
                    ],
                })
                    .sort(orderBy)
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: plans,
                        Wiki: [],
                        GeneralBlog: [],
                    },
                });
            }
            else if (collectionType === 'GeneralBlog') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { title: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let blogs = await generalBlog_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .lean()
                    .populate('brand')
                    .populate('createdBy')
                    .sort(orderBy)
                    .lean();
                let returnBlogs = [];
                for (let i = 0; i < blogs.length; i++) {
                    let blog = blogs[i];
                    blog.commentsCount = await blogComment_1.default.countDocuments({
                        blogId: new mongoose_1.default.mongo.ObjectId(blog._id),
                    });
                    let blogCollections = await generalBlogCollection_1.default.find({
                        memberId: userId,
                        blogs: {
                            $in: blog._id,
                        },
                    }).select('_id');
                    let collectionIds = blogCollections.map((bc) => bc._id);
                    blog.blogCollections = collectionIds;
                    returnBlogs.push(blog);
                }
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: [],
                        Wiki: [],
                        GeneralBlog: returnBlogs,
                    },
                });
            }
        }
        await Widget_1.default.findOneAndUpdate({
            _id: widget._id,
        }, {
            $inc: {
                viewCount: 1,
            },
        });
        return returnWidget;
    }
    /**
     * Retrieves a recipe widget based on the given widget slug and current date.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {string} currentDate - The current date (optional).
     * @return {any} The recipe widget object.
     */
    async getRecipeWidget(widgetSlug, currentDate) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount slug');
        if (currentDate) {
            let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
            widget.widgetCollections = widget.widgetCollections.filter((wc) => {
                if (wc.publishDate) {
                    return new Date(wc.publishDate) >= today;
                }
                else if (wc.publishDate && wc.expiryDate) {
                    return (new Date(wc.publishDate) >= today &&
                        new Date(wc.expiryDate) <= today);
                }
                else {
                    return true;
                }
            });
        }
        returnWidget._id = widget._id;
        returnWidget.bannerId = widget.bannerId;
        returnWidget.slug = widget.slug;
        returnWidget.widgetName = widget.widgetName;
        returnWidget.widgetType = widget.widgetType;
        returnWidget.collectionCount = widget.collectionCount;
        returnWidget.widgetCollections = [];
        // let recipes = [];
        // let ingredients: any[] = [];
        for (let i = 0; i < widget.widgetCollections.length; i++) {
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Recipe') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { averageRating: -1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { name: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                // console.log("ft",widgetCollection.filter.filterType);
                let filter = {};
                let values = [];
                if (widgetCollection.filter.filterType === 'Ingredient') {
                    //@ts-ignore
                    values = widgetCollection.filter.values.map((v) => {
                        return v.label;
                    });
                    filter = {
                        $in: values,
                    };
                }
                else if (widgetCollection.filter.filterType === 'Type') {
                    //@ts-ignore
                    values = widgetCollection.filter.values.map((v) => {
                        return v.value;
                    });
                    filter = {
                        $in: values,
                    };
                }
                else {
                    widgetCollection.filter.filterType = 'Random';
                    values = widgetCollection.filter.values.map((v) => {
                        return v.value;
                    });
                    filter = [];
                }
                let recipes;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                recipes = await recipeModel_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widget.widgetCollections[i].collectionData.children,
                        // .slice(
                        //   0,
                        //   8
                        // ),
                    },
                    [key[widget.widgetCollections[i].filter.filterType]]: { $in: values },
                })
                    .populate({
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                })
                    .populate('brand')
                    .populate('recipeBlendCategory')
                    .sort('orderBy')
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: widgetCollection.filter.filterType === 'Random'
                        ? {
                            filterType: 'Random',
                            values: [],
                        }
                        : {
                            filterType: key[widgetCollection.filter.filterType],
                            values: widgetCollection.filter.values,
                        },
                    data: {
                        collectionType: collectionType,
                        Recipe: recipes,
                        Plan: [],
                        Wiki: [],
                    },
                });
            }
            await Widget_1.default.findOneAndUpdate({
                _id: widget._id,
            }, {
                $inc: {
                    viewCount: 1,
                },
            });
            return returnWidget;
        }
    }
    /**
     * Retrieves a wiki widget.
     *
     * @param {String} widgetSlug - the slug of the widget
     * @param {string} currentDate - the current date (optional)
     * @return {any} the retrieved widget
     */
    async getWikiWidget(widgetSlug, currentDate) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount slug');
        if (currentDate) {
            let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
            widget.widgetCollections = widget.widgetCollections.filter((wc) => {
                if (wc.publishDate) {
                    return new Date(wc.publishDate) >= today;
                }
                else if (wc.publishDate && wc.expiryDate) {
                    return (new Date(wc.publishDate) >= today &&
                        new Date(wc.expiryDate) <= today);
                }
                else {
                    return true;
                }
            });
        }
        returnWidget._id = widget._id;
        returnWidget.bannerId = widget.bannerId;
        returnWidget.slug = widget.slug;
        returnWidget.widgetName = widget.widgetName;
        returnWidget.widgetType = widget.widgetType;
        returnWidget.collectionCount = widget.collectionCount;
        returnWidget.widgetCollections = [];
        // let recipes = [];
        // let ingredients: any[] = [];
        for (let i = 0; i < widget.widgetCollections.length; i++) {
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Wiki') {
                let orderBy = {};
                if (!widget.widgetCollections[i].orderBy) {
                    widget.widgetCollections[i].orderBy = 'ALPHABETICALLY';
                }
                if (widget.widgetCollections[i].orderBy === 'ALPHABETICALLY') {
                    orderBy = { wikiTitle: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let wikis;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                wikis = await wiki_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .populate({
                    path: 'author',
                    select: 'firstName lastName displayName email profilePicture',
                })
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: [],
                        Wiki: wikis,
                    },
                });
            }
            else {
                return new AppError_1.default('Corrupted data', 401);
            }
        }
        await Widget_1.default.findOneAndUpdate({
            _id: widget._id,
        }, {
            $inc: {
                viewCount: 1,
            },
        });
        return returnWidget;
    }
    /**
     * Retrieves a plan widget based on the widget slug and current date.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {string} currentDate - The current date (optional).
     * @return {any} The retrieved plan widget.
     */
    async getPlanWidget(widgetSlug, currentDate) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount slug');
        if (currentDate) {
            let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
            widget.widgetCollections = widget.widgetCollections.filter((wc) => {
                if (wc.publishDate) {
                    return new Date(wc.publishDate) >= today;
                }
                else if (wc.publishDate && wc.expiryDate) {
                    return (new Date(wc.publishDate) >= today &&
                        new Date(wc.expiryDate) <= today);
                }
                else {
                    return true;
                }
            });
        }
        returnWidget._id = widget._id;
        returnWidget.bannerId = widget.bannerId;
        returnWidget.slug = widget.slug;
        returnWidget.widgetName = widget.widgetName;
        returnWidget.widgetType = widget.widgetType;
        returnWidget.collectionCount = widget.collectionCount;
        returnWidget.widgetCollections = [];
        // let recipes = [];
        // let ingredients: any[] = [];
        for (let i = 0; i < widget.widgetCollections.length; i++) {
            let orderBy = {};
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Plan') {
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { planName: 1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { planName: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let plans;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                plans = await Plan_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .populate({
                    path: 'planData.recipes',
                    populate: [
                        {
                            path: 'defaultVersion',
                            populate: {
                                path: 'ingredients.ingredientId',
                                model: 'BlendIngredient',
                                select: 'ingredientName',
                            },
                            select: 'postfixTitle ingredients',
                        },
                        {
                            path: 'brand',
                        },
                        {
                            path: 'recipeBlendCategory',
                        },
                    ],
                })
                    .sort(orderBy)
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: plans,
                        Wiki: [],
                    },
                });
            }
            else {
                return new AppError_1.default('Corrupted data', 401);
            }
        }
        await Widget_1.default.findOneAndUpdate({
            _id: widget._id,
        }, {
            $inc: {
                viewCount: 1,
            },
        });
        return returnWidget;
    }
    /**
     * Retrieves widgets for a specific client based on the slug.
     *
     * @param {String} slug - The slug of the client.
     * @return {Object} returnWidget - The widget object for the client.
     */
    async getWidgetsForClient(slug, userId) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: slug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount slug');
        returnWidget._id = widget._id;
        returnWidget.bannerId = widget.bannerId;
        returnWidget.slug = widget.slug;
        returnWidget.widgetName = widget.widgetName;
        returnWidget.widgetType = widget.widgetType;
        returnWidget.collectionCount = widget.collectionCount;
        returnWidget.widgetCollections = [];
        // let recipes = [];
        // let ingredients: any[] = [];
        for (let i = 0; i < widget.widgetCollections.length; i++) {
            let values = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            let widgetCollection = widget.widgetCollections[i];
            if (collectionType === 'Recipe') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { averageRating: -1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { name: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                // console.log("ft",widgetCollection.filter.filterType);
                let filter = {};
                let values = [];
                if (widgetCollection.filter.filterType === 'Ingredient') {
                    //@ts-ignore
                    values = widgetCollection.filter.values.map((v) => {
                        return v.label;
                    });
                    filter = {
                        $in: values,
                    };
                }
                else if (widgetCollection.filter.filterType === 'Type') {
                    //@ts-ignore
                    values = widgetCollection.filter.values.map((v) => {
                        return v.value;
                    });
                    filter = {
                        $in: values,
                    };
                }
                else {
                    widgetCollection.filter.filterType = 'Random';
                    values = widgetCollection.filter.values.map((v) => {
                        return v.value;
                    });
                    filter = [];
                }
                let recipes;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                recipes = await recipeModel_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widget.widgetCollections[i].collectionData.children,
                        // .slice(
                        //   0,
                        //   8
                        // ),
                    },
                    [key[widget.widgetCollections[i].filter.filterType]]: filter,
                })
                    .populate({
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                })
                    .populate('brand')
                    .populate('recipeBlendCategory')
                    .sort('orderBy')
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!theme) {
                    theme = {
                        link: null,
                    };
                }
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: widgetCollection.filter.filterType === 'Random'
                        ? {
                            filterType: 'Random',
                            values: [],
                        }
                        : {
                            filterType: key[widgetCollection.filter.filterType],
                            values: widgetCollection.filter.values,
                        },
                    data: {
                        collectionType: collectionType,
                        Recipe: recipes,
                        Plan: [],
                        Wiki: [],
                        GeneralBlog: [],
                    },
                });
            }
            else if (collectionType === 'Wiki') {
                let orderBy = {};
                if (!widget.widgetCollections[i].orderBy) {
                    widget.widgetCollections[i].orderBy = 'ALPHABETICALLY';
                }
                if (widget.widgetCollections[i].orderBy === 'ALPHABETICALLY') {
                    orderBy = { wikiTitle: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let wikis;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                wikis = await wiki_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .populate({
                    path: 'author',
                    select: 'firstName lastName displayName email profilePicture',
                })
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!theme) {
                    theme = {
                        link: null,
                    };
                }
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                let returnData = [];
                if (userId) {
                    for (let i = 0; i < wikis.length; i++) {
                        let data = wikis[i];
                        if (wikis[i].type === 'Ingredient') {
                            // console.log('Ingredient');
                            let blendIngredient = await blendIngredient_1.default.findOne({
                                _id: wikis[i]._id,
                            }).select('portions featuredImage category');
                            data.image = blendIngredient.featuredImage;
                            data.category = blendIngredient.category;
                            data.portions = blendIngredient.portions;
                            let compare = await UserIngredientCompareList_1.default.findOne({
                                userId: userId,
                                ingredients: { $in: wikis[i]._id },
                            }).select('_id');
                            if (compare) {
                                data.hasInCompare = true;
                            }
                            else {
                                data.hasInCompare = false;
                            }
                        }
                        else if (wikis[i].type === 'Nutrient') {
                            // console.log('nutrient');
                            let nutrient = await blendNutrient_1.default.findOne({
                                _id: wikis[i]._id,
                            }).populate({
                                path: 'category',
                                select: 'categoryName',
                            });
                            //@ts-ignore
                            data.category = nutrient.category
                                ? //@ts-ignore
                                    nutrient.category.categoryName
                                : '';
                        }
                        else {
                            // console.log(wikis[i].type);
                        }
                        let comments = await wikiComment_1.default.find({
                            entityId: wikis[i]._id,
                        }).select('_id');
                        data.commentsCount = comments.length;
                        returnData.push(data);
                    }
                }
                else {
                    returnData = wikis;
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: [],
                        Wiki: returnData,
                        GeneralBlog: [],
                    },
                });
            }
            else if (collectionType === 'Plan') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { createdAt: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { averageRating: 1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { planName: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let plans;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                plans = await Plan_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .populate({
                    path: 'planData.recipes',
                    populate: [
                        {
                            path: 'defaultVersion',
                            populate: {
                                path: 'ingredients.ingredientId',
                                model: 'BlendIngredient',
                                select: 'ingredientName',
                            },
                            select: 'postfixTitle ingredients',
                        },
                        {
                            path: 'brand',
                        },
                        {
                            path: 'recipeBlendCategory',
                        },
                    ],
                })
                    .sort(orderBy)
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: plans,
                        Wiki: [],
                        GeneralBlog: [],
                    },
                });
            }
            else if (collectionType === 'GeneralBlog') {
                let orderBy = {};
                let widgetCollection = widget.widgetCollections[i];
                if (!widgetCollection.orderBy) {
                    widgetCollection.orderBy = 'PUBLISHED_DATE';
                }
                if (widgetCollection.orderBy === 'PUBLISHED_DATE') {
                    orderBy = { publishDate: 1 };
                }
                else if (widgetCollection.orderBy === 'POPULARITY') {
                    orderBy = { createdAt: -1 };
                }
                else if (widgetCollection.orderBy === 'ALPHABETICALLY') {
                    orderBy = { title: 1 };
                }
                else {
                    orderBy = { createdAt: -1 };
                }
                let generalBlogs;
                // if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                //   //@ts-ignore
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.label;
                //     }
                //   );
                // } else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                //   values = widget.widgetCollections[i].filter.values.map(
                //     //@ts-ignore
                //     (v) => {
                //       return v.value;
                //     }
                //   );
                // }
                generalBlogs = await generalBlog_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widgetCollection.collectionData.children,
                    },
                })
                    .populate('brand')
                    .populate('createdBy')
                    .sort(orderBy)
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link style _id');
                let banner = await banner_1.default.findOne({
                    _id: widget.widgetCollections[i].bannerId,
                }).select('link');
                if (!banner) {
                    banner = {
                        link: null,
                    };
                }
                returnWidget.widgetCollections.push({
                    //@ts-ignore
                    _id: widget.widgetCollections[i]._id,
                    displayName: widget.widgetCollections[i].displayName,
                    icon: widget.widgetCollections[i].icon,
                    slug: widget.widgetCollections[i].slug,
                    banner: widget.widgetCollections[i].banner,
                    showTabMenu: widget.widgetCollections[i].showTabMenu,
                    theme: theme ? theme : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipe: [],
                        Plan: [],
                        Wiki: [],
                        GeneralBlog: generalBlogs,
                    },
                });
            }
        }
        return returnWidget;
    }
    /**
     * Retrieves a widget collection for a client based on the provided slug.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} slug - The slug of the widget collection.
     * @return {WidgetCollectionForClient} The widget collection for the client.
     */
    async getWidgetCollectionbySlugForClient(widgetSlug, slug) {
        let widget = await Widget_1.default.find({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount');
        let widgetCollection = widget[0].widgetCollections.filter(
        //@ts-ignore
        (wc) => wc.slug === slug)[0];
        if (!widgetCollection) {
            return new AppError_1.default('No widget collection found', 404);
        }
        let values = [];
        //@ts-ignore
        let collectionType = widgetCollection.collectionData.collectionType;
        if (collectionType === 'Recipe') {
            if (widgetCollection.filter.filterType === 'Ingredient') {
                //@ts-ignore
                values = widgetCollection.filter.values.map((v) => {
                    return v.label;
                });
            }
            else if (widgetCollection.filter.filterType === 'Type') {
                //@ts-ignore
                values = widgetCollection.filter.values.map((v) => {
                    return v.value;
                });
            }
            let recipes;
            recipes = await recipeModel_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: widgetCollection.collectionData.children.slice(0, 8),
                },
                [key[widgetCollection.filter.filterType]]: {
                    $in: values,
                },
            })
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate('brand')
                .populate('recipeBlendCategory')
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link style _id');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
            }).select('link');
            if (!banner) {
                banner = {
                    link: null,
                };
            }
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                theme: theme ? theme : null,
                bannerLink: banner.link ? banner.link : null,
                filter: {
                    filterType: key[widgetCollection.filter.filterType],
                    values: widgetCollection.filter.values,
                },
                data: {
                    collectionType: collectionType,
                    Recipe: recipes,
                    Ingredient: [],
                },
            };
            return returnWidgetCollection;
        }
    }
    async qsq12() {
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddWidgetInput_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "addNewWidget", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SingleWidgetCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        WidgetCollection_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "addNewWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "removeAWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SingleWidgetCollection_1.default)
    /**
     * Edits a widget collection.
     *
     * @param {String} widgetId - The ID of the widget.
     * @param {CreateEditWidgetCollection} widgetCollection - The widget collection to edit.
     * @return {any} The edited widget collection data.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        CreateEditWidgetCollection_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "editAWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Removes a widget from the database.
     *
     * @param {String} widgetId - The ID of the widget to be removed.
     * @return {String} A message indicating the success of the operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "removeAWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Widget_2.default])
    /**
     * Retrieves all widgets from the database.
     *
     * @return {Promise<WidgetModel[]>} The array of widgets.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getAllWidgets", null);
__decorate([
    (0, type_graphql_1.Query)(() => [WidgetCollection_2.default])
    /**
     * Retrieves all widget collections for a given widget ID.
     *
     * @param {String} widgetId - The ID of the widget.
     * @return {Array} An array of widget collections.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getAllWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Widget_2.default)
    /**
     * Retrieves a single widget by its ID.
     *
     * @param {String} widgetId - The ID of the widget to retrieve.
     * @return {Promise<WidgetModel>} The widget with the specified ID.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getASingleWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollection_2.default)
    /**
     * Retrieves a single widget collection.
     *
     * @param {String} widgetId - The ID of the widget.
     * @param {String} widgetCollectionId - The ID of the widget collection.
     * @return {Object} The widget collection matching the provided IDs.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getASingleWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Edits a widget.
     *
     * @param data - The data for editing the widget.
     * @returns A message indicating the success of the edit operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditWidget_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "editAWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => String)
    /**
     * Retrieves the widget type based on the given slug.
     *
     * @param {String} slug - The slug of the widget.
     * @return {Promise<type>} The widget type.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWidgetTypeBySlug", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default)
    /**
     * Retrieves widget collections based on the provided widget slug and current date.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {string} currentDate - The current date (optional).
     * @return {Promise<any>} Returns a Promise that resolves to the widget collections.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('currentDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWidgetCollections", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default)
    /**
     * Retrieves an entity collection based on the provided widget slug and collection slug.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {Promise<any>} The entity collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getEntityCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default)
    /**
     * Retrieves a recipe collection based on the provided widget and collection slugs.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {Object} The retrieved recipe collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getRecipeCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default)
    /**
     * Retrieves a widget collection from the database based on the provided widgetSlug and collectionSlug.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {Object} The retrieved widget collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWikiCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default)
    /**
     * Retrieves a plan collection based on the provided widget and collection slugs.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {String} collectionSlug - The slug of the collection.
     * @return {any} The retrieved plan collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getPlanCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default)
    /**
     * Retrieves an entity widget.
     *
     * @param {String} widgetSlug - the slug of the widget
     * @param {string} currentDate - the current date (nullable)
     * @return {any} the entity widget
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('currentDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getEntityWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default)
    /**
     * Retrieves a recipe widget based on the given widget slug and current date.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {string} currentDate - The current date (optional).
     * @return {any} The recipe widget object.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('currentDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getRecipeWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default)
    /**
     * Retrieves a wiki widget.
     *
     * @param {String} widgetSlug - the slug of the widget
     * @param {string} currentDate - the current date (optional)
     * @return {any} the retrieved widget
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('currentDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWikiWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default)
    /**
     * Retrieves a plan widget based on the widget slug and current date.
     *
     * @param {String} widgetSlug - The slug of the widget.
     * @param {string} currentDate - The current date (optional).
     * @return {any} The retrieved plan widget.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('currentDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getPlanWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default)
    /**
     * Retrieves widgets for a specific client based on the slug.
     *
     * @param {String} slug - The slug of the client.
     * @return {Object} returnWidget - The widget object for the client.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWidgetsForClient", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default) //
    ,
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWidgetCollectionbySlugForClient", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "qsq12", null);
WigdetResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WigdetResolver);
exports.default = WigdetResolver;
