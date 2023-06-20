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
const recipe_1 = __importDefault(require("../../../models/recipe"));
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
var key;
(function (key) {
    key["Ingredient"] = "foodCategories";
    key["Type"] = "recipeBlendCategory";
    // WIKI = 'Wiki',
})(key || (key = {}));
let WigdetResolver = class WigdetResolver {
    async addNewWidget(data) {
        let widget = await Widget_1.default.create(data);
        return widget._id;
    }
    // change
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
    async editAWidgetCollection(widgetId, widgetCollection) {
        await Widget_1.default.findOneAndUpdate({ _id: widgetId }, {
            $pull: {
                widgetCollections: { _id: widgetCollection._id },
            },
        }, { new: true });
        let data = widgetCollection;
        if (data.isPublished) {
            data.publishedAt = Date.now();
        }
        // if (widgetCollection.isPublished) {
        //   data.publishedAt = Date.now();
        // }
        await Widget_1.default.findOneAndUpdate({ _id: widgetId }, {
            $push: { widgetCollections: data },
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
    async removeAWidget(widgetId) {
        await Widget_1.default.findOneAndRemove({ _id: widgetId });
        return 'widget removed successfully';
    }
    async getAllWidgets() {
        let widgets = await Widget_1.default.find();
        return widgets;
    }
    async getAllWidgetCollection(widgetId) {
        let widget = await Widget_1.default.findOne({ _id: widgetId });
        return widget.widgetCollections;
    }
    async getASingleWidget(widgetId) {
        let widget = await Widget_1.default.findOne({ _id: widgetId }).populate('widgetCollections.theme widgetCollections.bannerId slug widgetCollections.collectionData');
        return widget;
    }
    async getASingleWidgetCollection(widgetId, widgetCollectionId) {
        let widget = await Widget_1.default.findOne({ _id: widgetId }).populate('widgetCollections.collectionData');
        return widget.widgetCollections.find(
        // @ts-ignore
        (widgetCollection) => String(widgetCollection._id) === widgetCollectionId);
    }
    async editAWidget(data) {
        await Widget_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'new widget created successfully';
    }
    async getWidgetTypeBySlug(slug) {
        let widget = await Widget_1.default.findOne({ slug: slug }).select('widgetType');
        return widget.widgetType;
    }
    //grid
    async getWidgetCollections(widgetSlug) {
        let widget = await Widget_1.default.findOne({
            slug: widgetSlug,
        })
            .populate('bannerId')
            .populate({
            path: 'widgetCollections.collectionData',
        });
        if (widget.widgetType !== 'Grid') {
            return new AppError_1.default('The request muust be for Grid type only', 403);
        }
        return widget;
    }
    //Grid
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
            recipes = await recipe_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: widgetCollection.collectionData.children,
                },
                // [key[widgetCollection.filter.filterType as keyof typeof key]]: {
                //   $in: values,
                // },
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
            }).select('link');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
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
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                themeLink: theme.link ? theme.link : null,
                bannerLink: banner.link ? banner.link : null,
                filter: {
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
    async getWikiCollection(widgetSlug, collectionSlug) {
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
            .populate('widgetCollections.collectionData bannerId')
            .select('widgetCollections widgetName widgetType collectionCount');
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
        if (collectionType === 'Wiki') {
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
                .lean();
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
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
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                themeLink: theme.link ? theme.link : null,
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
            plans = await Plan_1.default.find({ isGlobal: true }).populate({
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
            });
            let theme = await theme_1.default.findOne({
                _id: widgetCollection.theme,
            }).select('link');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
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
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                themeLink: theme.link ? theme.link : null,
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
    async getRecipeWidget(widgetSlug) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
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
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Recipe') {
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
                recipes = await recipe_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widget.widgetCollections[i].collectionData.children,
                        // .slice(
                        //   0,
                        //   8
                        // ),
                    },
                    // [key[
                    //   widget.widgetCollections[i].filter.filterType as keyof typeof key
                    // ]]: { $in: values },
                })
                    .populate({
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                })
                    .populate('brand')
                    .populate('recipeBlendCategory')
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link');
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
                    themeLink: theme.link ? theme.link : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipes: recipes,
                        Plans: [],
                        Wikis: [],
                    },
                });
            }
            else {
                return new AppError_1.default('Corrupted data', 401);
            }
        }
        return returnWidget;
    }
    async getWikiWidget(widgetSlug) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
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
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Wiki') {
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
                }).select('link');
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
                    themeLink: theme.link ? theme.link : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipes: [],
                        Plans: [],
                        Wikis: wikis,
                    },
                });
            }
            else {
                return new AppError_1.default('Corrupted data', 401);
            }
        }
        return returnWidget;
    }
    async getPlanWidget(widgetSlug) {
        let returnWidget = {};
        let widget = await Widget_1.default.findOne({ slug: widgetSlug })
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
            // let values: any[] = [];
            let collectionType = 
            //@ts-ignore
            widget.widgetCollections[i].collectionData.collectionType;
            if (collectionType === 'Plan') {
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
                plans = await Plan_1.default.find({ isGlobal: true }).populate({
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
                });
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link');
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
                    themeLink: theme.link ? theme.link : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipes: [],
                        Plans: plans,
                        Wikis: [],
                    },
                });
            }
            else {
                return new AppError_1.default('Corrupted data', 401);
            }
        }
        return returnWidget;
    }
    async getWidgetsForClient(slug) {
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
            if (collectionType === 'Recipe') {
                let recipes;
                if (widget.widgetCollections[i].filter.filterType === 'Ingredient') {
                    //@ts-ignore
                    values = widget.widgetCollections[i].filter.values.map(
                    //@ts-ignore
                    (v) => {
                        return v.label;
                    });
                }
                else if (widget.widgetCollections[i].filter.filterType === 'Type') {
                    values = widget.widgetCollections[i].filter.values.map(
                    //@ts-ignore
                    (v) => {
                        return v.value;
                    });
                }
                recipes = await recipe_1.default.find({
                    _id: {
                        //@ts-ignore
                        $in: widget.widgetCollections[i].collectionData.children,
                        // .slice(
                        //   0,
                        //   8
                        // ),
                    },
                    // [key[
                    //   widget.widgetCollections[i].filter.filterType as keyof typeof key
                    // ]]: { $in: values },
                })
                    .populate({
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                })
                    .populate('brand')
                    .populate('recipeBlendCategory')
                    .lean();
                let theme = await theme_1.default.findOne({
                    _id: widget.widgetCollections[i].theme,
                }).select('link');
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
                    themeLink: theme.link ? theme.link : null,
                    bannerLink: banner.link ? banner.link : null,
                    filter: {
                        filterType: key[widget.widgetCollections[i].filter
                            .filterType],
                        values: widget.widgetCollections[i].filter.values,
                    },
                    data: {
                        collectionType: collectionType,
                        Recipes: recipes,
                        Wikis: [],
                        Plans: [],
                    },
                });
            }
        }
        return returnWidget;
    }
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
            recipes = await recipe_1.default.find({
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
            }).select('link');
            let banner = await banner_1.default.findOne({
                _id: widgetCollection.bannerId,
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
            let returnWidgetCollection = {
                //@ts-ignore
                _id: widgetCollection._id,
                displayName: widgetCollection.displayName,
                icon: widgetCollection.icon,
                banner: widgetCollection.banner,
                showTabMenu: widgetCollection.showTabMenu,
                themeLink: theme.link ? theme.link : null,
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
    (0, type_graphql_1.Mutation)(() => SingleWidgetCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        CreateEditWidgetCollection_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "editAWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "removeAWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Widget_2.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getAllWidgets", null);
__decorate([
    (0, type_graphql_1.Query)(() => [WidgetCollection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getAllWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Widget_2.default),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getASingleWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollection_2.default),
    __param(0, (0, type_graphql_1.Arg)('widgetId')),
    __param(1, (0, type_graphql_1.Arg)('widgetCollectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getASingleWidgetCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditWidget_1.default]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "editAWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWidgetTypeBySlug", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWidgetCollections", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getRecipeCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWikiCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetCollectionForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __param(1, (0, type_graphql_1.Arg)('collectionSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getPlanCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getRecipeWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getWikiWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('widgetSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WigdetResolver.prototype, "getPlanWidget", null);
__decorate([
    (0, type_graphql_1.Query)(() => WidgetForClient_1.default),
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
