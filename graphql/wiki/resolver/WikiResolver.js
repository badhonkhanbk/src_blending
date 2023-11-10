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
const mongoose_1 = __importDefault(require("mongoose"));
const BlendIngredientInfo_1 = __importDefault(require("../../blendIngredientsdata/resolvers/input-type/BlendIngredientInfo"));
const GetIngredientsFromNutrition_1 = __importDefault(require("./input-type/GetIngredientsFromNutrition"));
const EditIngredientAndNutrientWiki_1 = __importDefault(require("./input-type/EditIngredientAndNutrientWiki"));
const Wikilist_1 = __importDefault(require("../schemas/Wikilist"));
const IngredientsFromNutrition_1 = __importDefault(require("../schemas/IngredientsFromNutrition"));
const NutrientsFromIngredient_1 = __importDefault(require("../schemas/NutrientsFromIngredient"));
const WikiListWithPagination_1 = __importDefault(require("../schemas/WikiListWithPagination"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
const wikiComment_1 = __importDefault(require("../../../models/wikiComment"));
const UserIngredientCompareList_1 = __importDefault(require("../../../models/UserIngredientCompareList"));
const wiki_1 = __importDefault(require("../../../models/wiki"));
const GramConversion_1 = __importDefault(require("./input-type/GramConversion"));
const WikiLinks_1 = __importDefault(require("../schemas/WikiLinks"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const GlobalBookmarkLink_1 = __importDefault(require("../../../models/GlobalBookmarkLink"));
const BookmarkAndExternalGlobalLInk_1 = __importDefault(require("../schemas/BookmarkAndExternalGlobalLInk"));
const usedBookmark_1 = __importDefault(require("../../../models/usedBookmark"));
const FilterWikiInput_1 = __importDefault(require("./input-type/FilterWikiInput"));
const health_1 = __importDefault(require("../../../models/health"));
const HealthImpact_1 = __importDefault(require("../schemas/HealthImpact"));
const HealthWiki_1 = __importDefault(require("../schemas/HealthWiki"));
const EditHealthWiki_1 = __importDefault(require("./input-type/EditHealthWiki"));
var WikiType;
(function (WikiType) {
    WikiType["INGREDIENT"] = "Ingredient";
    WikiType["NUTRIENT"] = "Nutrient";
    WikiType["HEALTH"] = "Health";
})(WikiType || (WikiType = {}));
(0, type_graphql_1.registerEnumType)(WikiType, {
    name: 'WikiType',
    description: 'The types', // this one is optional
});
let WikiResolver = class WikiResolver {
    /**
     * Retrieves a list of nutrient information from the wiki.
     *
     * @param {String} userId - The ID of the user (optional)
     * @param {number} limit - The maximum number of results to return (optional)
     * @param {number} page - The page number to retrieve (optional)
     * @param {String[]} ids - An array of nutrient IDs to retrieve (optional)
     * @return {Object} An object containing the total number of nutrients and an array of nutrient data
     */
    async getNutrientWikiList(userId, limit, page, ids) {
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let returnData = [];
        let totalNutrients = 0;
        let find = {};
        if (ids.length > 0) {
            totalNutrients = ids.length;
            find = { _id: { $in: ids } };
        }
        else {
            totalNutrients = await blendNutrient_1.default.countDocuments();
        }
        let blendNutrients = await blendNutrient_1.default.find(find)
            .populate('category')
            .lean()
            .select('-uniqueNutrientId -related_sources -parent -bodies -wikiCoverImages')
            .limit(limit)
            .skip(limit * (page - 1));
        for (let i = 0; i < blendNutrients.length; i++) {
            let categoryName;
            if (!blendNutrients[i].category) {
                categoryName = null;
            }
            else {
                //@ts-ignore
                categoryName = blendNutrients[i].category.categoryName
                    ? //@ts-ignore
                        blendNutrients[i].category.categoryName
                    : '';
            }
            let data = {
                _id: blendNutrients[i]._id,
                wikiTitle: blendNutrients[i].wikiTitle
                    ? blendNutrients[i].wikiTitle
                    : blendNutrients[i].nutrientName,
                wikiDescription: blendNutrients[i].wikiDescription
                    ? blendNutrients[i].wikiDescription
                    : ' ',
                type: 'Nutrient',
                category: categoryName,
                status: blendNutrients[i].status,
                publishDate: new Date(),
                description: '',
                image: '',
                publishedBy: 'g. braun',
                isPublished: blendNutrients[i].isPublished,
            };
            if (userId) {
                let comments = await wikiComment_1.default.find({
                    entityId: blendNutrients[i]._id,
                }).select('_id');
                data.commentsCount = comments.length;
            }
            returnData.push(data);
        }
        return {
            total: totalNutrients,
            wikiList: returnData,
        };
    }
    async getNutrientWikiList2(userId, limit, page, ids) {
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let returnData = [];
        let totalNutrients = 0;
        let find = {};
        find = { type: 'Nutrient', isPublished: true, isBookmarked: false };
        if (ids.length > 0) {
            totalNutrients = ids.length;
            find = {
                type: 'Nutrient',
                isPublished: true,
                isBookmarked: false,
                _id: { $in: ids },
            };
        }
        else {
            totalNutrients = await wiki_1.default.countDocuments({
                type: 'Nutrient',
                isBookmarked: false,
                isPublished: true,
            });
        }
        let wikiNutrients = await wiki_1.default.find(find)
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        })
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ wikiTitle: 1 });
        for (let i = 0; i < wikiNutrients.length; i++) {
            let nutrient = await blendNutrient_1.default.findOne({
                _id: wikiNutrients[i]._id,
            }).populate({
                path: 'category',
                select: 'categoryName',
            });
            let data = wikiNutrients[i];
            //@ts-ignore
            data.category = nutrient.category ? nutrient.category.categoryName : '';
            if (userId) {
                let comments = await wikiComment_1.default.find({
                    entityId: wikiNutrients[i]._id,
                }).select('_id');
                data.commentsCount = comments.length;
            }
            returnData.push(data);
        }
        return {
            total: totalNutrients,
            wikiList: returnData,
        };
    }
    /**
     * Retrieves a list of ingredient information from the wiki.
     *
     * @param {String} userId - The ID of the user (optional).
     * @param {number} limit - The maximum number of ingredients to retrieve (optional).
     * @param {number} page - The page number of the results (optional).
     * @param {String[]} ids - An array of ingredient IDs to retrieve (optional).
     * @return {Object} An object containing the total number of ingredients and the list of ingredient data.
     */
    async getIngredientWikiList(userId, limit, page, ids) {
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let returnData = [];
        let totalIngredients = 0;
        let find = {};
        if (ids.length > 0) {
            totalIngredients = ids.length;
            find = { _id: { $in: ids } };
        }
        else {
            totalIngredients = await blendIngredient_1.default.countDocuments({});
        }
        let blendIngredients = await blendIngredient_1.default.find(find)
            .select('wikiTitle _id ingredientName wikiDescription category blendStatus createdAt portions featuredImage description isPublished')
            .limit(limit)
            .skip(limit * (page - 1))
            .lean();
        for (let i = 0; i < blendIngredients.length; i++) {
            let data = {
                _id: blendIngredients[i]._id,
                wikiTitle: blendIngredients[i].wikiTitle
                    ? blendIngredients[i].wikiTitle
                    : blendIngredients[i].ingredientName,
                wikiDescription: blendIngredients[i].wikiDescription
                    ? blendIngredients[i].wikiDescription
                    : ' ',
                type: 'Ingredient',
                category: blendIngredients[i].category
                    ? blendIngredients[i].category
                    : '',
                status: blendIngredients[i].blendStatus,
                publishDate: blendIngredients[i].createdAt,
                portions: blendIngredients[i].portions,
                image: blendIngredients[i].featuredImage,
                description: blendIngredients[i].description,
                publishedBy: 'g. braun',
                isPublished: blendIngredients[i].isPublished,
            };
            if (userId) {
                let comments = await wikiComment_1.default.find({
                    entityId: blendIngredients[i]._id,
                }).select('_id');
                let compare = await UserIngredientCompareList_1.default.findOne({
                    userId: userId,
                    ingredients: { $in: blendIngredients[i]._id },
                }).select('_id');
                if (compare) {
                    data.hasInCompare = true;
                }
                else {
                    data.hasInCompare = false;
                }
                data.commentsCount = comments.length;
            }
            returnData.push(data);
        }
        return {
            total: totalIngredients,
            wikiList: returnData,
        };
    }
    async getIngredientWikiList2(userId, limit, page, ids) {
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let returnData = [];
        let totalIngredients = 0;
        let find = {};
        find = { type: 'Ingredient', isBookmarked: false, isPublished: true };
        if (ids.length > 0) {
            totalIngredients = ids.length;
            find = {
                isBookmarked: false,
                isPublished: true,
                _id: { $in: ids },
                type: 'Ingredient',
            };
        }
        else {
            totalIngredients = await wiki_1.default.countDocuments({
                type: 'Ingredient',
                isBookmarked: false,
                isPublished: true,
            });
        }
        let wikiIngredients = await wiki_1.default.find(find)
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        })
            .limit(limit)
            .skip(limit * (page - 1))
            .lean()
            .sort({ wikiTitle: 1 });
        for (let i = 0; i < wikiIngredients.length; i++) {
            let data = wikiIngredients[i];
            let blendIngredient = await blendIngredient_1.default.findOne({
                _id: wikiIngredients[i]._id,
            }).select('portions featuredImage category');
            data.image = blendIngredient.featuredImage;
            data.category = blendIngredient.category;
            data.portions = blendIngredient.portions;
            if (userId) {
                let comments = await wikiComment_1.default.find({
                    entityId: wikiIngredients[i]._id,
                }).select('_id');
                let compare = await UserIngredientCompareList_1.default.findOne({
                    userId: userId,
                    ingredients: { $in: wikiIngredients[i]._id },
                }).select('_id');
                if (compare) {
                    data.hasInCompare = true;
                }
                else {
                    data.hasInCompare = false;
                }
                data.commentsCount = comments.length;
            }
            returnData.push(data);
        }
        return {
            total: totalIngredients,
            wikiList: returnData,
        };
    }
    /**
     * Retrieves a list of wiki items for a given user.
     *
     * @param {String} userId - The ID of the user. Nullable.
     * @return {Array} - An array of wiki items.
     */
    async getWikiList(userId) {
        let returnData = [];
        let blendNutrients = await blendNutrient_1.default.find({
            isPublished: true,
        })
            .lean()
            .select('-uniqueNutrientId -related_sources -parent -bodies -wikiCoverImages');
        for (let i = 0; i < blendNutrients.length; i++) {
            let data = {
                _id: blendNutrients[i]._id,
                wikiTitle: blendNutrients[i].wikiTitle
                    ? blendNutrients[i].wikiTitle
                    : blendNutrients[i].nutrientName,
                wikiDescription: blendNutrients[i].wikiDescription
                    ? blendNutrients[i].wikiDescription
                    : ' ',
                type: 'Nutrient',
                status: blendNutrients[i].status,
                publishDate: new Date(),
                description: '',
                image: '',
                publishedBy: 'g. braun',
                isPublished: blendNutrients[i].isPublished,
            };
            if (userId) {
                let comments = await wikiComment_1.default.find({
                    entityId: blendNutrients[i]._id,
                }).select('_id');
                data.commentsCount = comments.length;
            }
            returnData.push(data);
        }
        let blendIngredients = await blendIngredient_1.default.find({
            isPublished: true,
        })
            .select('wikiTitle _id ingredientName wikiDescription category blendStatus createdAt portions featuredImage description isPublished')
            .lean();
        for (let i = 0; i < blendIngredients.length; i++) {
            let data = {
                _id: blendIngredients[i]._id,
                wikiTitle: blendIngredients[i].wikiTitle
                    ? blendIngredients[i].wikiTitle
                    : blendIngredients[i].ingredientName,
                wikiDescription: blendIngredients[i].wikiDescription
                    ? blendIngredients[i].wikiDescription
                    : ' ',
                type: 'Ingredient',
                category: blendIngredients[i].category
                    ? blendIngredients[i].category
                    : '',
                status: blendIngredients[i].blendStatus,
                publishDate: blendIngredients[i].createdAt,
                portions: blendIngredients[i].portions,
                image: blendIngredients[i].featuredImage,
                description: blendIngredients[i].description,
                publishedBy: 'g. braun',
                isPublished: blendIngredients[i].isPublished,
            };
            if (userId) {
                let comments = await wikiComment_1.default.find({
                    entityId: blendIngredients[i]._id,
                }).select('_id');
                let compare = await UserIngredientCompareList_1.default.findOne({
                    userId: userId,
                    ingredients: { $in: blendIngredients[i]._id },
                });
                if (compare) {
                    data.hasInCompare = true;
                }
                else {
                    data.hasInCompare = false;
                }
                data.commentsCount = comments.length;
            }
            returnData.push(data);
        }
        return returnData;
    }
    async getWikiList2(userId) {
        let returnData = [];
        let wikis = await wiki_1.default.find({ isBookmarked: false, isPublished: true })
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        })
            .lean()
            .sort({ wikiTitle: 1 });
        if (userId) {
            for (let i = 0; i < wikis.length; i++) {
                let data = wikis[i];
                let comments = await wikiComment_1.default.find({
                    entityId: wikis[i]._id,
                }).select('_id');
                let compare = await UserIngredientCompareList_1.default.findOne({
                    userId: userId,
                    ingredients: { $in: wikis[i]._id },
                });
                if (compare) {
                    data.hasInCompare = true;
                }
                else {
                    data.hasInCompare = false;
                }
                data.commentsCount = comments.length;
                returnData.push(data);
            }
        }
        else {
            returnData = wikis;
        }
        return returnData;
    }
    // @Query(() => NutritionFromIngredient) // wait
    // async getBlendNutritionBasedIngredientsWiki(
    //   @Arg('ingredientsInfo', (type) => [BlendIngredientInfo])
    //   ingredientsInfo: BlendIngredientInfo[],
    //   @Arg('userId', { nullable: true }) userId: String
    // ) {
    //   let data: any = ingredientsInfo;
    //   // @ts-ignore
    //   let hello = data.map((x) => new mongoose.mongo.ObjectId(x.ingredientId));
    //   let ingredient: any = await BlendIngredientModel.findOne({
    //     _id: ingredientsInfo[0].ingredientId,
    //   });
    //   let commentsCount = 0;
    //   let hasInCompare = false;
    //   if (userId) {
    //     let comments = await WikiCommentModel.find({
    //       entityId: ingredient._id,
    //     }).select('_id');
    //     let compare = await UserIngredientsCompareModel.findOne({
    //       userId: userId,
    //       ingredients: { $in: ingredient._id },
    //     }).select('_id');
    //     if (compare) {
    //       hasInCompare = true;
    //     }
    //     commentsCount = comments.length;
    //   }
    //   let returnData = {
    //     wikiTitle: ingredient.wikiTitle,
    //     wikiDescription: ingredient.wikiDescription,
    //     ingredientName: ingredient.ingredientName,
    //     wikiCoverImages: ingredient.wikiCoverImages,
    //     wikiFeatureImage: ingredient.wikiFeatureImage,
    //     bodies: ingredient.bodies,
    //     type: 'Ingredient',
    //     category: ingredient.category ? ingredient.category : '',
    //     publishedBy: 'g. Braun',
    //     seoTitle: ingredient.seoTitle,
    //     seoSlug: ingredient.seoSlug,
    //     portions: ingredient.portions,
    //     seoCanonicalURL: ingredient.seoCanonicalURL,
    //     seoSiteMapPriority: ingredient.seoSiteMapPriority,
    //     seoKeywords: ingredient.seoKeywords,
    //     seoMetaDescription: ingredient.seoMetaDescription,
    //     isPublished: ingredient.isPublished,
    //     commentsCount: commentsCount,
    //     hasInCompare: hasInCompare,
    //   };
    //   return returnData;
    // }
    async getBlendNutritionBasedIngredientsWiki2(ingredientsInfo, userId) {
        // let data: any = ingredientsInfo;
        // // @ts-ignore
        // let hello = data.map((x) => new mongoose.mongo.ObjectId(x.ingredientId));
        let wiki = await wiki_1.default.findOne({
            _id: ingredientsInfo[0].ingredientId,
        })
            .populate({
            path: 'ingredientBookmarkList.ingredientId',
            select: '_id ingredientName portions',
        })
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        });
        let blendIngredient = await blendIngredient_1.default.findOne({
            _id: wiki._id,
        }).select('portions category featuredImage');
        let commentsCount = 0;
        let hasInCompare = false;
        if (userId) {
            let comments = await wikiComment_1.default.find({
                entityId: wiki._id,
            }).select('_id');
            let compare = await UserIngredientCompareList_1.default.findOne({
                userId: userId,
                ingredients: { $in: wiki._id },
            }).select('_id');
            if (compare) {
                hasInCompare = true;
            }
            commentsCount = comments.length;
        }
        wiki.commentsCount = commentsCount;
        wiki.hasInCompare = hasInCompare;
        wiki.wikiFeatureImage = wiki.featureImage
            ? wiki.featureImage
            : blendIngredient.featuredImage
                ? blendIngredient.featuredImage
                : null;
        wiki.portions = blendIngredient.portions;
        wiki.category = blendIngredient.category;
        wiki.relatedWikis = await this.getRelatedWiki('Ingredient', blendIngredient.category, userId, ingredientsInfo[0].ingredientId);
        wiki.healthImpacts = await this.getHealthImpactByEntityId(String(wiki._id), 'Food');
        return wiki;
    }
    async getAHealthWiki(wikiHealthId, userId) {
        // let data: any = ingredientsInfo;
        // // @ts-ignore
        // let hello = data.map((x) => new mongoose.mongo.ObjectId(x.ingredientId));
        let wiki = await wiki_1.default.findOne({
            _id: wikiHealthId,
        }).populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        });
        let healthData = await health_1.default.findOne({
            _id: wiki._id,
        })
            .populate({
            path: 'nutrients.nutrientId',
            model: 'BlendNutrient',
            populate: {
                path: 'category',
                model: 'BlendNutrientCategory',
            },
        })
            .populate({
            path: 'foods.foodId',
            model: 'BlendIngredient',
        })
            .select('category featuredImage foods nutrients');
        // console.log(healthData.foods);
        let commentsCount = 0;
        let hasInCompare = false;
        if (userId) {
            let comments = await wikiComment_1.default.find({
                entityId: wiki._id,
            }).select('_id');
            let compare = await UserIngredientCompareList_1.default.findOne({
                userId: userId,
                ingredients: { $in: wiki._id },
            }).select('_id');
            if (compare) {
                hasInCompare = true;
            }
            commentsCount = comments.length;
        }
        wiki.nutrients = healthData.nutrients
            .slice(0, 10)
            .sort((a, b) => b.score - a.score);
        wiki.foods = healthData.foods
            .slice(0, 10)
            .sort((a, b) => b.score - a.score);
        wiki.commentsCount = commentsCount;
        wiki.hasInCompare = hasInCompare;
        wiki.wikiFeatureImage = wiki.featureImage
            ? wiki.featureImage
            : healthData.featuredImage
                ? healthData.featuredImage
                : null;
        wiki.category = healthData.category;
        wiki.relatedWikis = await this.getRelatedWiki('Ingredient', healthData.category, userId, String(healthData._id));
        wiki.healthImpacts = await this.getHealthImpactByEntityId(String(wiki._id), 'Food');
        return wiki;
    }
    // @Query(() => IngredientFromNutrition)
    // async getAllIngredientsBasedOnNutrition(
    //   @Arg('data') data: GetIngredientsFromNutrition,
    //   @Arg('userId', { nullable: true }) userId: String
    // ) {
    //   let nutrient = await BlendNutrientModel.findOne({
    //     _id: data.nutritionID,
    //   }).populate('category');
    //   let ingredients: any;
    //   if (data.category === 'All') {
    //     ingredients = await BlendIngredientModel.find({
    //       classType: 'Class - 1',
    //       blendStatus: 'Active',
    //     })
    //       .select(
    //         '-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients'
    //       )
    //       .populate('blendNutrients.blendNutrientRefference');
    //   } else {
    //     ingredients = await BlendIngredientModel.find({
    //       classType: 'Class - 1',
    //       blendStatus: 'Active',
    //       category: data.category,
    //     })
    //       .select(
    //         '-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients'
    //       )
    //       .populate('blendNutrients.blendNutrientRefference');
    //   }
    //   let returnIngredients: any = {};
    //   for (let i = 0; i < ingredients.length; i++) {
    //     for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
    //       if (ingredients[i].blendNutrients[j].blendNutrientRefference === null)
    //         continue;
    //       if (
    //         String(
    //           ingredients[i].blendNutrients[j].blendNutrientRefference._id
    //         ) === data.nutritionID
    //       ) {
    //         if (!returnIngredients[ingredients[i].ingredientName]) {
    //           // let value = await this.convertToGram({
    //           //   amount: parseInt(ingredients[i].blendNutrients[j].value),
    //           //   unit: ingredients[i].blendNutrients[j].blendNutrientRefference
    //           //     .units,
    //           // });
    //           let defaultPortion = ingredients[i].portions.filter(
    //             //@ts-ignore
    //             (a) => a.default === true
    //           )[0];
    //           if (!defaultPortion) {
    //             defaultPortion = ingredients[i].portions[0];
    //           }
    //           returnIngredients[ingredients[i].ingredientName] = {
    //             ingredientId: ingredients[i]._id,
    //             name: ingredients[i].ingredientName,
    //             value: parseFloat(ingredients[i].blendNutrients[j].value),
    //             units:
    //               ingredients[i].blendNutrients[j].blendNutrientRefference.units,
    //             portion: defaultPortion,
    //           };
    //         } else {
    //           let defaultPortion = ingredients[i].portions.filter(
    //             //@ts-ignore
    //             (a) => a.default === true
    //           )[0];
    //           returnIngredients[ingredients[i].ingredientName] = {
    //             ingredientId: ingredients[i]._id,
    //             name: ingredients[i].ingredientName,
    //             value:
    //               parseFloat(
    //                 returnIngredients[ingredients[i].ingredientName].value
    //               ) + parseFloat(ingredients[i].blendNutrients[j].value),
    //             units:
    //               ingredients[i].blendNutrients[j].blendNutrientRefference.units,
    //             portion: defaultPortion,
    //           };
    //         }
    //       }
    //     }
    //   }
    //   let sortArray: any = [];
    //   Object.keys(returnIngredients).forEach((key) => {
    //     sortArray.push(returnIngredients[key]);
    //   });
    //   //@ts-ignore
    //   let result = sortArray.sort((a, b) => {
    //     return b.value - a.value;
    //   });
    //   let commentsCount = 0;
    //   if (userId) {
    //     let comments = await WikiCommentModel.find({
    //       entityId: nutrient._id,
    //     }).select('_id');
    //     commentsCount = comments.length;
    //   }
    //   let returnData = {
    //     wikiTitle: nutrient.wikiTitle,
    //     wikiDescription: nutrient.wikiDescription,
    //     nutrientName: nutrient.nutrientName,
    //     wikiCoverImages: nutrient.wikiCoverImages,
    //     wikiFeatureImage: nutrient.wikiFeatureImage,
    //     bodies: nutrient.bodies,
    //     ingredients: result.slice(0, 10),
    //     type: 'Nutrient',
    //     publishedBy: 'g. Braun',
    //     seoTitle: nutrient.seoTitle,
    //     seoSlug: nutrient.seoSlug,
    //     seoCanonicalURL: nutrient.seoCanonicalURL,
    //     seoSiteMapPriority: nutrient.seoSiteMapPriority,
    //     seoKeywords: nutrient.seoKeywords,
    //     seoMetaDescription: nutrient.seoMetaDescription,
    //     isPublished: nutrient.isPublished,
    //     commentsCount: commentsCount,
    //   };
    //   return returnData;
    // }
    async getAllIngredientsBasedOnNutrition2(data, userId) {
        let wiki = await wiki_1.default.findOne({
            _id: data.nutritionID,
        })
            .populate({
            path: 'nutrientBookmarkList.nutrientId',
            select: '_id nutrientName',
        })
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        });
        if (!wiki) {
            return new AppError_1.default('wiki not found', 404);
        }
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: data.nutritionID,
        }).populate({
            path: 'category',
            select: 'categoryName',
        });
        let wikiData = wiki;
        if (userId) {
            let ingredients;
            if (data.category === 'All') {
                ingredients = await blendIngredient_1.default.find({
                    classType: 'Class - 1',
                    blendStatus: 'Active',
                })
                    .select('-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients')
                    .populate('blendNutrients.blendNutrientRefference');
            }
            else {
                ingredients = await blendIngredient_1.default.find({
                    classType: 'Class - 1',
                    blendStatus: 'Active',
                    category: data.category,
                })
                    .select('-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients')
                    .populate('blendNutrients.blendNutrientRefference');
            }
            let returnIngredients = {};
            for (let i = 0; i < ingredients.length; i++) {
                for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                    if (ingredients[i].blendNutrients[j].blendNutrientRefference === null)
                        continue;
                    if (String(ingredients[i].blendNutrients[j].blendNutrientRefference._id) === data.nutritionID) {
                        if (!returnIngredients[ingredients[i].ingredientName]) {
                            // let value = await this.convertToGram({
                            //   amount: parseInt(ingredients[i].blendNutrients[j].value),
                            //   unit: ingredients[i].blendNutrients[j].blendNutrientRefference
                            //     .units,
                            // });
                            let defaultPortion = ingredients[i].portions.filter(
                            //@ts-ignore
                            (a) => a.default === true)[0];
                            if (!defaultPortion) {
                                defaultPortion = ingredients[i].portions[0];
                            }
                            returnIngredients[ingredients[i].ingredientName] = {
                                ingredientId: ingredients[i]._id,
                                name: ingredients[i].ingredientName,
                                value: parseFloat(ingredients[i].blendNutrients[j].value),
                                units: ingredients[i].blendNutrients[j].blendNutrientRefference
                                    .units,
                                portion: defaultPortion,
                            };
                        }
                        else {
                            let defaultPortion = ingredients[i].portions.filter(
                            //@ts-ignore
                            (a) => a.default === true)[0];
                            returnIngredients[ingredients[i].ingredientName] = {
                                ingredientId: ingredients[i]._id,
                                name: ingredients[i].ingredientName,
                                value: parseFloat(returnIngredients[ingredients[i].ingredientName].value) + parseFloat(ingredients[i].blendNutrients[j].value),
                                units: ingredients[i].blendNutrients[j].blendNutrientRefference
                                    .units,
                                portion: defaultPortion,
                            };
                        }
                    }
                }
            }
            let sortArray = [];
            Object.keys(returnIngredients).forEach((key) => {
                sortArray.push(returnIngredients[key]);
            });
            //@ts-ignore
            let result = sortArray.sort((a, b) => {
                return b.value - a.value;
            });
            wikiData.ingredients = result.slice(0, 10);
        }
        else {
            wikiData.ingredients = [];
        }
        let commentsCount = 0;
        if (userId) {
            let comments = await wikiComment_1.default.find({
                entityId: wiki._id,
            }).select('_id');
            commentsCount = comments.length;
        }
        wikiData.comments = commentsCount;
        //@ts-ignore
        wikiData.category = blendNutrient.category.categoryName
            ? //@ts-ignore
                blendNutrient.category.categoryName
            : 'No Category Assigned';
        console.log(wikiData.type);
        console.log(blendNutrient.category._id);
        wikiData.relatedWikis = await this.getRelatedWiki(wikiData.type, String(blendNutrient.category._id), userId, data.nutritionID);
        wikiData.healthImpacts = await this.getHealthImpactByEntityId(data.nutritionID, 'Nutrient');
        return wikiData;
    }
    /**
     * Edit the ingredient wiki.
     *
     * @param {EditIngredientAndNutrientInWiki} data - the data for editing the ingredient and nutrient in the wiki
     * @return {Promise<string>} - a promise that resolves to the string 'success'
     */
    async editIngredientWiki(data) {
        await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async editIngredientWiki2(data) {
        let newData = data;
        if (newData.editableObject.isPublished) {
            newData.editableObject.publishDate = new Date();
        }
        await wiki_1.default.findOneAndUpdate({ _id: data.editId }, newData.editableObject);
        return 'success';
    }
    /**
     * Edits the nutrient wiki.
     *
     * @param {EditIngredientAndNutrientInWiki} data - the data to edit the nutrient wiki
     * @return {Promise<string>} - a promise that resolves to 'success' if the edit is successful
     */
    async editNutrientWiki(data) {
        let newData = data;
        if (newData.editableObject.isPublished) {
            newData.editableObject.publishDate = new Date();
        }
        await blendNutrient_1.default.findOneAndUpdate({ _id: data.editId }, newData.editableObject);
        return 'success';
    }
    async editNutrientWiki2(data) {
        await wiki_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async editHealthWiki(data) {
        await wiki_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    /**
     * Asynchronously converts the given data to grams.
     *
     * @param {GramConversion} data - the data to be converted
     * @return {Number} the converted value in grams
     */
    async convertToGram(data) {
        // [ 'kJ', 'G', 'MG', 'UG', 'IU' ]
        let gram;
        // console.log('data', data);
        if (data.unit === 'kJ') {
            gram = +data.amount * 238.90295761862;
            return gram;
        }
        if (data.unit === 'G') {
            return data.amount;
        }
        if (data.unit === 'MG') {
            gram = +data.amount * 0.001;
            return gram;
        }
        if (data.unit === 'UG') {
            gram = +data.amount * 0.000001;
            return gram;
        }
        if (data.unit === 'IU') {
            gram = +data.amount * 0.000001059322033898305;
            return gram;
        }
        if (data.unit === 'L') {
            gram = +data.amount * 1000;
            return gram;
        }
    }
    /**
     * Convert a value in grams to a specified unit of measurement.
     *
     * @param {GramConversion} data - The data object containing the amount and unit of measurement.
     * @return {Number} The converted value in the specified unit of measurement.
     */
    async convertGramToUnit(data) {
        // [ 'kJ', 'G', 'MG', 'UG', 'IU' ]
        let gram;
        // console.log('data', data);
        if (data.unit === 'kJ') {
            gram = +data.amount * 238.90295761862;
            return gram;
        }
        if (data.unit === 'G') {
            return data.amount;
        }
        if (data.unit === 'MG') {
            gram = +data.amount * 0.001;
            return gram;
        }
        if (data.unit === 'UG') {
            gram = +data.amount * 0.000001;
            return gram;
        }
        if (data.unit === 'IU') {
            gram = +data.amount * 0.000001059322033898305;
            return gram;
        }
    }
    /**
     * Retrieves the default portion measurement weight for a given ingredient.
     *
     * @param {String} ingredientId - The ID of the ingredient
     * @return {Number} The default portion measurement weight
     */
    async getDefaultPortion(ingredientId) {
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientId,
        });
        let defaultPortion = ingredient.portions.filter(
        //@ts-ignore
        (a) => a.default === true)[0];
        if (!defaultPortion) {
            defaultPortion = ingredient.portions[0];
        }
        return Number(defaultPortion.meausermentWeight);
    }
    /**
     * Retrieves the description of the entire function and returns it as a JSON string.
     *
     * @return {string} The description of the entire function as a JSON string.
     */
    async bodyTeswwt() {
        let description = await blendIngredient_1.default.find({}).select('wikiCoverImages wikiFeatureImage wikiTitle wikiDescription bodies seoTitle seoSlug seoCanonicalURL seoSiteMapPriority seoKeywords seoMetaDescription sourceName isPublished');
        return JSON.stringify(description);
    }
    // have to fix this later
    // fixing this
    // warning
    async getBlendNutritionBasedOnRecipexxx2(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients = await blendIngredient_1.default.find({
            _id: { $in: hello },
            status: 'Active',
        })
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            select: '-bodies -wikiCoverImages -wikiFeatureImage -wikiDescription -wikiTitle -isPublished -related_sources',
        })
            .lean();
        for (let i = 0; i < ingredients.length; i++) {
            let value = data.filter(
            // @ts-ignore
            (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                ingredients[i].blendNutrients[j].value =
                    (+ingredients[i].blendNutrients[j].value / 100) * value;
                // if (
                //   String(ingredients[i].nutrients[j].uniqueNutrientRefference._id) ===
                //   '61c618813ced314894f2924a'
                // ) {
                //   console.log(ingredients[i].nutrients[j].value);
                // }
            }
        }
        let nutrients = [];
        for (let i = 0; i < ingredients.length; i++) {
            nutrients.push(...ingredients[i].blendNutrients);
        }
        //@ts-ignore
        let returnNutrients = nutrients.reduce((acc, nutrient) => {
            //@ts-ignore
            let obj = acc.find(
            //@ts-ignore
            (o) => String(o.blendNutrientRefference._id) ===
                String(nutrient.blendNutrientRefference._id));
            if (!obj) {
                nutrient.count = 1;
                acc.push(nutrient);
            }
            else {
                //@ts-ignore
                const index = acc.findIndex((element, index) => {
                    if (String(element.blendNutrientRefference._id) ===
                        String(obj.blendNutrientRefference._id)) {
                        return true;
                    }
                });
                acc[index].count++;
                acc[index].value = +acc[index].value + +nutrient.value;
            }
            return acc;
        }, []);
        let blendNutrientCategories = await blendNutrientCategory_1.default.find()
            .lean()
            .select('_id categoryName');
        //returnNutrients
        let obj = {};
        for (let i = 0; i < blendNutrientCategories.length; i++) {
            obj[blendNutrientCategories[i].categoryName] =
                await this.getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
        }
        return JSON.stringify(obj);
    }
    /**
     * Retrieves a child object from the database based on the given parent object and an array of nutrients to return.
     *
     * @param {any} parent - The parent object to search for child objects.
     * @param {any[]} returnNutrients - An array of nutrients to return.
     * @return {Promise<any>} - The retrieved child object.
     */
    async getChild(parent, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({ parent: parent })
            .lean()
            .select('_id nutrientName altName');
        if (childs.length === 0) {
            return null;
        }
        for (let i = 0; i < childs.length; i++) {
            let ek = returnNutrients.filter((rn) => String(rn.blendNutrientRefference._id) === String(childs[i]._id))[0];
            let check = childs[i].altName === '';
            let check2 = childs[i].altName === undefined;
            let check3 = check || check2;
            let name = check3 ? childs[i].nutrientName : childs[i].altName;
            if (!ek) {
                obj[name.toLowerCase()] = null;
                continue;
            }
            childs[i] = ek;
            childs[i].childs = await this.getChild(childs[i].blendNutrientRefference._id, returnNutrients);
            let check4 = childs[i].blendNutrientRefference.altName === '';
            let check5 = childs[i].blendNutrientRefference.altName === undefined;
            let check6 = check4 || check5;
            let name2 = check6
                ? childs[i].blendNutrientRefference.nutrientName
                : childs[i].blendNutrientRefference.altName;
            obj[name2.toLowerCase()] = childs[i];
        }
        return obj;
    }
    /**
     * Retrieves the top-level child nutrients for a given category.
     *
     * @param {any} category - The category for which to retrieve the top-level child nutrients.
     * @param {any[]} returnNutrients - An array of return nutrients.
     * @return {Promise<any>} An object containing the top-level child nutrients.
     */
    async getTopLevelChilds(category, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({
            category: category,
            parentIsCategory: true,
        })
            .lean()
            .select('_id');
        let populatedChild = childs.map((child) => {
            let data = returnNutrients.filter((rn) => String(rn.blendNutrientRefference._id) === String(child._id))[0];
            if (!data) {
                data = {
                    value: 0,
                    blendNutrientRefference: null,
                };
            }
            return data;
        });
        let populatedChild2 = populatedChild.filter(
        //@ts-ignore
        (child) => child.blendNutrientRefference !== null);
        for (let i = 0; i < populatedChild2.length; i++) {
            let check = populatedChild2[i].blendNutrientRefference.altName === '';
            let check2 = populatedChild2[i].blendNutrientRefference.altName === undefined;
            let check3 = check || check2;
            let name = check3
                ? populatedChild2[i].blendNutrientRefference.nutrientName
                : populatedChild2[i].blendNutrientRefference.altName;
            obj[name.toLowerCase()] = populatedChild2[i];
            obj[name.toLowerCase()].childs = await this.getChild(populatedChild2[i].blendNutrientRefference._id, returnNutrients);
        }
        return obj;
    }
    /**
     * Retrieves the wiki links for a given entity ID and type.
     *
     * @param {String} entityId - The ID of the entity.
     * @param {String} type - The type of the entity.
     * @param {Boolean} links - Optional parameter to specify if links should be retrieved.
     * @return {Object} An object containing the retrieved links and bookmarks.
     */
    async getWikiLinks(entityId, type, links) {
        let blendNutrients = [];
        let blendIngredients = [];
        if (links) {
            blendNutrients = await blendNutrient_1.default.find({ isBookmarked: false })
                .lean()
                .select('_id nutrientName');
            blendIngredients = await blendIngredient_1.default.find()
                .select('wikiTitle _id ingredientName portions')
                .lean();
            // if()
        }
        let bookmarks = [];
        if (type === 'Nutrient') {
            let wiki = await wiki_1.default.findOne({
                _id: entityId,
            })
                .populate({
                path: 'nutrientBookmarkList.nutrientId',
                select: '_id nutrientName',
            })
                .select('_id nutrientBookmarkList');
            bookmarks = wiki.nutrientBookmarkList;
        }
        else {
            let wiki = await wiki_1.default.findOne({
                _id: entityId,
            })
                .populate({
                path: 'ingredientBookmarkList.ingredientId',
                select: '_id ingredientName portions',
            })
                .select('_id ingredientBookmarkList');
            bookmarks = wiki.ingredientBookmarkList;
        }
        let globalBookmarks = await GlobalBookmarkLink_1.default.find().populate({
            path: 'entityId',
            select: 'ingredientName nutrientName',
        });
        return {
            ingredientLinks: blendIngredients,
            nutrientLinks: blendNutrients,
            bookmarks: bookmarks,
            globalBookmarks: globalBookmarks,
        };
    }
    /**
     * Generates wiki entries for blend ingredients and blend nutrients.
     *
     * @return {Promise<string>} - A string indicating the function has completed.
     */
    async makeWikis() {
        let blendIngredients = await blendIngredient_1.default.find().select('wikiTitle _id ingredientName wikiDescription category blendStatus createdAt portions featuredImage description isPublished');
        for (let i = 0; i < blendIngredients.length; i++) {
            let data = {
                _id: blendIngredients[i]._id,
                onModel: 'BlendIngredient',
                wikiTitle: blendIngredients[i].wikiTitle
                    ? blendIngredients[i].wikiTitle
                    : blendIngredients[i].ingredientName,
                wikiDescription: blendIngredients[i].wikiDescription
                    ? blendIngredients[i].wikiDescription
                    : ' ',
                type: 'Ingredient',
                status: blendIngredients[i].blendStatus,
                image: blendIngredients[i].featuredImage,
                description: blendIngredients[i].description,
                publishedBy: 'g. braun',
                isPublished: blendIngredients[i].isPublished,
            };
            await wiki_1.default.create(data);
        }
        let blendNutrients = await blendNutrient_1.default.find()
            .lean()
            .select('-uniqueNutrientId -related_sources -parent -bodies -wikiCoverImages');
        for (let i = 0; i < blendNutrients.length; i++) {
            let data = {
                _id: blendNutrients[i]._id,
                onModel: 'BlendNutrient',
                wikiTitle: blendNutrients[i].wikiTitle
                    ? blendNutrients[i].wikiTitle
                    : blendNutrients[i].nutrientName,
                wikiDescription: blendNutrients[i].wikiDescription
                    ? blendNutrients[i].wikiDescription
                    : ' ',
                type: 'Nutrient',
                status: blendNutrients[i].status,
                description: '',
                image: '',
                publishedBy: 'g. braun',
                isPublished: blendNutrients[i].isPublished,
            };
            await wiki_1.default.create(data);
        }
        return 'hello';
    }
    /**
     * Generates a wiki for each ingredient in the blendNutrients collection.
     *
     * @return {Promise<string>} A string indicating the completion status of the operation.
     */
    async makeOtherIngredientWiki() {
        let blendIngredients = await blendIngredient_1.default.find().select('wikiTitle _id ingredientName wikiDescription category blendStatus createdAt portions featuredImage description isPublished');
        for (let i = 0; i < blendIngredients.length; i++) {
            let wiki = await wiki_1.default.findOne({
                _id: blendIngredients[i]._id,
            }).select('_id');
            if (!wiki) {
                let data = {
                    _id: blendIngredients[i]._id,
                    onModel: 'BlendIngredient',
                    wikiTitle: blendIngredients[i].wikiTitle
                        ? blendIngredients[i].wikiTitle
                        : blendIngredients[i].ingredientName,
                    wikiDescription: blendIngredients[i].wikiDescription
                        ? blendIngredients[i].wikiDescription
                        : ' ',
                    type: 'Ingredient',
                    status: blendIngredients[i].blendStatus,
                    image: blendIngredients[i].featuredImage,
                    description: blendIngredients[i].description,
                    publishedBy: 'g. braun',
                    isPublished: blendIngredients[i].isPublished,
                };
                await wiki_1.default.create(data);
            }
        }
        return 'done';
    }
    /**
     * Manipulates bookmarks for a wiki.
     *
     * @param {String} wikiId - The ID of the wiki.
     * @param {String} bookmarkId - The ID of the bookmark (optional).
     * @param {String} link - The link for the bookmark.
     * @param {String} type - The type of the bookmark.
     * @param {String} customBookmarkName - The custom name for the bookmark (optional).
     * @param {Boolean} removeCustomBookmark - Indicates whether to remove the custom bookmark (optional).
     * @return {Object} The updated bookmark list and the global bookmarks.
     */
    async manipulateBookMarks(wikiId, bookmarkId, // no need
    link, type, // no need
    customBookmarkName, removeCustomBookmark) {
        // if (link === '') {
        //   return new AppError('link cant be empty', 401);
        // }
        if (!bookmarkId && removeCustomBookmark === undefined) {
            return new AppError_1.default('bookmarkId is null and remove is undefiend', 401);
        }
        let wiki = await wiki_1.default.findOne({ _id: wikiId }).select('ingredientBookmarkList nutrientBookmarkList');
        // if (!(type === 'Nutrient') || !(type === 'Ingredient')) {801930
        //   return new AppError('Invalid type for bookmarks', 401);
        // }
        if (type === 'Nutrient') {
            if (!bookmarkId) {
                let found = wiki.nutrientBookmarkList.filter(
                //@ts-ignore
                (bookmark) => bookmark.link === link)[0];
                if (found) {
                    await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                        $pull: {
                            //@ts-ignore
                            nutrientBookmarkList: { _id: found._id },
                        },
                    });
                    if (!removeCustomBookmark) {
                        await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                            $push: {
                                nutrientBookmarkList: {
                                    customBookmarkName: found.customBookmarkName,
                                    link: found.link,
                                    active: false,
                                },
                            },
                        });
                    }
                }
                else {
                    await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                        $push: {
                            nutrientBookmarkList: {
                                customBookmarkName: customBookmarkName,
                                link: link,
                                active: true,
                            },
                        },
                    });
                }
            }
            else {
                let found = wiki.nutrientBookmarkList.filter(
                //@ts-ignore
                (bookmark) => String(bookmark.nutrientId) === bookmarkId)[0];
                let newData = {
                    nutrientId: found.nutrientId,
                    link: link,
                    active: !found.active,
                };
                if (newData.active) {
                    let entity = await GlobalBookmarkLink_1.default.findOne({
                        entityId: found.nutrientId,
                    }).select('_id');
                    await blendIngredient_1.default.updateMany({
                        'blendNutrients.blendNutrientRefference': found.nutrientId,
                    }, {
                        $set: {
                            'blendNutrients.$.link': link,
                        },
                    });
                    if (!entity) {
                        await GlobalBookmarkLink_1.default.create({
                            entityId: found.nutrientId,
                            onModel: 'BlendNutrient',
                            link: newData.link,
                            type: 'Nutrient',
                        });
                    }
                }
                else {
                    let usedBookmark = await usedBookmark_1.default.findOne({
                        entityId: found.nutrientId,
                    });
                    if (usedBookmark) {
                        return new AppError_1.default('bookmark is in use', 400);
                    }
                    await GlobalBookmarkLink_1.default.findOneAndRemove({ entityId: bookmarkId });
                    await blendIngredient_1.default.updateMany({
                        'blendNutrients.blendNutrientRefference': found.nutrientId,
                    }, {
                        $set: {
                            'blendNutrients.$.link': null,
                        },
                    });
                }
                await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                    $pull: {
                        //@ts-ignore
                        nutrientBookmarkList: { _id: found._id },
                    },
                });
                // console.log('');
                await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                    $push: {
                        nutrientBookmarkList: newData,
                    },
                });
            }
        }
        else {
            if (!bookmarkId) {
                // console.log('hello');
                let found = wiki.ingredientBookmarkList.filter(
                //@ts-ignore
                (bookmark) => bookmark.link === link)[0];
                if (found) {
                    await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                        $pull: {
                            //@ts-ignore
                            ingredientBookmarkList: { _id: found._id },
                        },
                    });
                    if (!removeCustomBookmark) {
                        await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                            $push: {
                                ingredientBookmarkList: {
                                    customBookmarkName: found.customBookmarkName,
                                    link: found.link,
                                    active: false,
                                },
                            },
                        });
                    }
                }
                else {
                    await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                        $push: {
                            ingredientBookmarkList: {
                                customBookmarkName: customBookmarkName,
                                link: link,
                                active: true,
                            },
                        },
                    });
                }
            }
            else {
                let found = wiki.ingredientBookmarkList.filter(
                //@ts-ignore
                (bookmark) => String(bookmark.ingredientId) === bookmarkId)[0];
                let newData = {
                    ingredientId: found.ingredientId,
                    link: link,
                    active: !found.active,
                };
                if (newData.active) {
                    let entity = await GlobalBookmarkLink_1.default.findOne({
                        entityId: found.ingredientId,
                    }).select('_id');
                    if (!entity) {
                        await GlobalBookmarkLink_1.default.create({
                            entityId: found.ingredientId,
                            onModel: 'BlendIngredient',
                            link: newData.link,
                            type: 'Ingredient',
                        });
                    }
                }
                else {
                    let usedBookmark = await usedBookmark_1.default.findOne({
                        entityId: found.ingredientId,
                    });
                    if (usedBookmark) {
                        return new AppError_1.default('bookmark is in use', 400);
                    }
                    await GlobalBookmarkLink_1.default.findOneAndRemove({ entityId: bookmarkId });
                }
                await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                    $pull: {
                        //@ts-ignore
                        ingredientBookmarkList: { _id: found._id },
                    },
                });
                await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                    $push: {
                        ingredientBookmarkList: newData,
                    },
                });
            }
        }
        let externalBookmarks = await GlobalBookmarkLink_1.default.find().populate({
            path: 'entityId',
            select: 'ingredientName nutrientName',
        });
        if (type === 'Nutrient') {
            let wiki = await wiki_1.default.findOne({
                _id: wikiId,
            })
                .populate({
                path: 'nutrientBookmarkList.nutrientId',
                select: '_id nutrientName',
            })
                .select('_id nutrientBookmarkList');
            return {
                bookmarks: wiki.nutrientBookmarkList,
                globalBookmarks: externalBookmarks,
            };
        }
        else {
            let wiki = await wiki_1.default.findOne({
                _id: wikiId,
            })
                .populate({
                path: 'ingredientBookmarkList.ingredientId',
                select: '_id ingredientName portions',
            })
                .select('_id ingredientBookmarkList');
            return {
                bookmarks: wiki.ingredientBookmarkList,
                globalBookmarks: externalBookmarks,
            };
        }
    }
    /**
     * Performs a specific action with a bookmark.
     *
     * @param {String} bookmarkId - The ID of the bookmark to be used.
     * @param {Boolean} use - Indicates whether the bookmark should be used or not.
     * @return {String} - Returns 'done' if the action is successfully performed.
     */
    async useABookmark(bookmarkId, use) {
        let usedBookmark = await usedBookmark_1.default.findOne({ entityId: bookmarkId });
        if (!usedBookmark) {
            if (!use) {
                return new AppError_1.default('entity not found as used Bookmark', 401);
            }
            else {
                await usedBookmark_1.default.create({
                    entityId: bookmarkId,
                    usedCount: 1,
                });
            }
        }
        else {
            let update;
            if (!use) {
                update = { $inc: { usedCount: -1 } };
            }
            else {
                update = { $inc: { usedCount: 1 } };
            }
            let usedBookmark = await usedBookmark_1.default.findOneAndUpdate({ entityId: bookmarkId }, update, {
                new: true,
            });
            if (usedBookmark.usedCount === 0) {
                await usedBookmark_1.default.findOneAndDelete({ entityId: bookmarkId });
            }
        }
        return 'done';
    }
    /**
     * Creates a bookmark for blend nutrients.
     *
     * @return {Promise<string>} A string indicating the completion status of the function.
     */
    async createBookMark() {
        let blendNutrientBookmarks = await blendNutrient_1.default.find({
            isBookmarked: true,
        }).select('_id');
        let bookmarkedIds = blendNutrientBookmarks.map((b) => String(b._id));
        for (let i = 0; i < bookmarkedIds.length; i++) {
            await blendIngredient_1.default.updateMany({
                'blendNutrients.blendNutrientRefference': bookmarkedIds[i],
            }, {
                $set: {
                    'blendNutrients.$.disabled': true,
                },
            });
        }
        return 'done';
    }
    /**
     * An asynchronous function that creates a bookmark for blend ingredients.
     *
     * @return {Promise<string>} A promise that resolves to the string 'done' when the operation is complete.
     */
    async createBookMark2() {
        let blendIngredientBookmarks = await blendNutrient_1.default.find({
            isBookmarked: true,
        }).select('_id');
        for (let i = 0; i < blendIngredientBookmarks.length; i++) {
            await wiki_1.default.findOneAndUpdate({
                _id: blendIngredientBookmarks[i]._id,
            }, {
                isBookmarked: true,
            });
        }
        return 'done';
    }
    /**
     * Retrieves theme widget data.
     *
     * @return {Promise<string>} The result of the function.
     */
    async getThemeWidgetData() {
        // let blendNutrients = await BlendNutrientModel.find().select('_id');
        // let doubleWiki = [];
        // let notInWiki = [];
        // for (let i = 0; i < blendNutrients.length; i++) {
        //   let wikis = await WikiModel.find({ _id: blendNutrients[i]._id }).select(
        //     '_id'
        //   );
        //   if (wikis.length > 1) {
        //     doubleWiki.push(wikis[0]._id);
        //   }
        //   if (wikis.length === 0) {
        //     notInWiki.push(blendNutrients[i]._id);
        //   }
        // }
        // console.log('d', doubleWiki);
        // console.log('niw', notInWiki);
        let notFoundInIngredient = [];
        let notFoundInNutrient = [];
        let wikis = await wiki_1.default.find().select('_id type');
        for (let i = 0; i < wikis.length; i++) {
            if (wikis[i].type === 'Ingredient') {
                let blendIngredient = await wiki_1.default.findOne({
                    _id: wikis[i]._id,
                });
                if (!blendIngredient) {
                    notFoundInIngredient.push(wikis[i]._id);
                }
            }
            else if (wikis[i].type === 'Nutrient') {
                let blendNutrient = await wiki_1.default.findOne({
                    _id: wikis[i]._id,
                });
                if (!blendNutrient) {
                    notFoundInNutrient.push(wikis[i]._id);
                }
            }
        }
        return 'done';
    }
    async getWikiList3(userId) {
        let returnData = [];
        let wikis = await wiki_1.default.find({ isBookmarked: false, isPublished: true })
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        })
            .lean()
            .sort({ wikiTitle: 1 });
        if (userId) {
            for (let i = 0; i < wikis.length; i++) {
                let data = wikis[i];
                let comments = await wikiComment_1.default.find({
                    entityId: wikis[i]._id,
                }).select('_id');
                let compare = await UserIngredientCompareList_1.default.findOne({
                    userId: userId,
                    ingredients: { $in: wikis[i]._id },
                });
                if (compare) {
                    data.hasInCompare = true;
                }
                else {
                    data.hasInCompare = false;
                }
                data.commentsCount = comments.length;
                returnData.push(data);
            }
        }
        else {
            returnData = wikis;
        }
        // console.log('hello');
        return returnData;
    }
    async filterWiki(data, page, limit, userId) {
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let filter = {};
        let filter2 = {};
        // let combinedFilter: any = {}
        if (data.wikiType && data.wikiType.length > 0) {
            filter.type = { $in: data.wikiType };
        }
        let ingredientFilter = {};
        let nutrientFilter = {};
        let allElements = [];
        if (data.includeWikiIds && data.includeWikiIds.length > 0) {
            ingredientFilter._id = { $in: data.includeWikiIds };
        }
        if (data.excludeWikiIds && data.excludeWikiIds.length > 0) {
            ingredientFilter._id = { $nin: data.excludeWikiIds };
        }
        if (data.BlendIngredientType && data.BlendIngredientType.length > 0) {
            ingredientFilter.category = { $in: data.BlendIngredientType };
        }
        if (data.nutrientMatrix && data.nutrientMatrix.length > 0) {
            for (let i = 0; i < data.nutrientMatrix.length; i++) {
                if (data.nutrientMatrix[i].matrixName === 'calorie') {
                    let calorieValueFilter = {};
                    if (data.nutrientMatrix[i].lessThan) {
                        calorieValueFilter = { $lt: data.nutrientMatrix[i].value };
                    }
                    else if (data.nutrientMatrix[i].greaterThan) {
                        calorieValueFilter = { $gt: data.nutrientMatrix[i].value };
                    }
                    else if (data.nutrientMatrix[i].between) {
                        calorieValueFilter = {
                            $gt: data.nutrientMatrix[i].value1,
                            $lt: data.nutrientMatrix[i].value2,
                        };
                    }
                    // ingredientFilter.blendNutrients = {
                    //   $elemMatch: {
                    //     blendNutrientRefference: new mongoose.mongo.ObjectId(
                    //       '620b4606b82695d67f28e193'
                    //     ),
                    //     value: calorieValueFilter,
                    //   },
                    // };
                    allElements.push({
                        $elemMatch: {
                            blendNutrientRefference: new mongoose_1.default.mongo.ObjectId('620b4606b82695d67f28e193'),
                            valueInNumber: calorieValueFilter,
                        },
                    });
                    continue;
                }
                let val = '';
                if (data.nutrientMatrix[i].matrixName === 'netCarbs') {
                    val = 'netCarbs';
                    ingredientFilter[val] = {};
                }
                else if (data.nutrientMatrix[i].matrixName === 'totalGi') {
                    val = 'gigl.totalGi';
                    ingredientFilter[val] = {};
                }
                else if (data.nutrientMatrix[i].matrixName === 'totalGl') {
                    val = 'gigl.totalGl';
                    ingredientFilter[val] = {};
                }
                if (data.nutrientMatrix[i].lessThan) {
                    ingredientFilter[val] = { $lt: data.nutrientMatrix[i].value };
                }
                else if (data.nutrientMatrix[i].greaterThan) {
                    ingredientFilter[val] = { $gt: data.nutrientMatrix[i].value };
                }
                else if (data.nutrientMatrix[i].between) {
                    ingredientFilter[val] = {
                        $gt: data.nutrientMatrix[i].value1,
                        $lt: data.nutrientMatrix[i].value2,
                    };
                }
            }
        }
        if (data.nutrientFilters && data.nutrientFilters.length > 0) {
            for (let i = 0; i < data.nutrientFilters.length; i++) {
                let nutrientFilter = {};
                if (data.nutrientFilters[i].lessThan) {
                    nutrientFilter = { $lt: data.nutrientFilters[i].value };
                }
                else if (data.nutrientFilters[i].greaterThan) {
                    nutrientFilter = { $gt: data.nutrientFilters[i].value };
                }
                else if (data.nutrientFilters[i].between) {
                    nutrientFilter = {
                        $gt: data.nutrientFilters[i].value1,
                        $lt: data.nutrientFilters[i].value2,
                    };
                }
                allElements.push({
                    $elemMatch: {
                        blendNutrientRefference: new mongoose_1.default.mongo.ObjectId(data.nutrientFilters[i].nutrientId.toString()),
                        valueInNumber: nutrientFilter,
                    },
                });
            }
        }
        if (allElements.length > 0) {
            ingredientFilter.blendNutrients = {
                $all: allElements,
            };
        }
        let keys = Object.keys(ingredientFilter);
        // console.log(ingredientFilter);
        let wikiIds = [];
        if (keys.length > 0) {
            // console.log('x', ingredientFilter);
            let ingredients = await blendIngredient_1.default.find(ingredientFilter).select('_id');
            let ingredientIDs = ingredients.map((ingredient) => ingredient._id);
            // console.log(ingredientIDs);
            // filter2._id = { $in: ingredientIDs };
            wikiIds = wikiIds.concat(ingredientIDs);
            console.log(wikiIds);
        }
        let blendNutrients = [];
        let includeNutrientIds = [];
        if (data.includeWikiIds && data.includeWikiIds.length > 0) {
            blendNutrients = await blendNutrient_1.default.find({
                _id: { $in: data.includeWikiIds },
            }).select('_id');
            let blendNutrientIds = blendNutrients.map((blendNutrient) => blendNutrient._id);
            includeNutrientIds = blendNutrientIds;
            blendNutrients = await blendNutrient_1.default.find({
                _id: { $in: includeNutrientIds },
            }).select('_id');
            wikiIds = wikiIds.concat(blendNutrientIds);
        }
        if (data.nutrientCategory && data.nutrientCategory.length > 0) {
            let categories = [];
            for (let i = 0; i < data.nutrientCategory.length; i++) {
                console.log(data.nutrientCategory[i]);
                if (data.nutrientCategory[i] === 'MacroNutrients') {
                    categories.push(new mongoose_1.default.Types.ObjectId('6203a9381c100bd226c13c67'));
                }
                else if (data.nutrientCategory[i] === 'Mineral') {
                    categories.push(new mongoose_1.default.Types.ObjectId('6203a98a1c100bd226c13c6b'));
                }
                else if (data.nutrientCategory[i] === 'Vitamin') {
                    categories.push(new mongoose_1.default.Types.ObjectId('6203a96e1c100bd226c13c69'));
                }
                else if (data.nutrientCategory[i] === 'Calorie') {
                    categories.push(new mongoose_1.default.Types.ObjectId('6203a9061c100bd226c13c65'));
                }
                else {
                    categories.push(new mongoose_1.default.Types.ObjectId('6203a98a1c100bd226c13c6b'));
                    categories.push(new mongoose_1.default.Types.ObjectId('6203a96e1c100bd226c13c69'));
                }
            }
            let blendNutrients = [];
            if (data.includeWikiIds && data.includeWikiIds.length > 0) {
                blendNutrients = await blendNutrient_1.default.find({
                    _id: { $in: includeNutrientIds },
                    category: { $in: categories },
                }).select('_id');
            }
            else {
                blendNutrients = await blendNutrient_1.default.find({
                    category: { $in: categories },
                }).select('_id');
            }
            let blendNutrientIds = blendNutrients.map((blendNutrient) => blendNutrient._id);
            wikiIds = wikiIds.concat(blendNutrientIds);
        }
        if (wikiIds.length > 0) {
            // console.log(wikiIds);
            filter2._id = { $in: wikiIds };
        }
        if (data.searchTerm && data.searchTerm !== '') {
            filter.wikiTitle = { $regex: data.searchTerm, $options: 'i' };
        }
        filter.isPublished = true;
        filter2.isPublished = true;
        filter.isBookmarked = false;
        filter2.isBookmarked = false;
        let returnData = [];
        // console.log(1, filter);
        // console.log(2, filter2);
        let wikis = await wiki_1.default.find({ $and: [filter, filter2] })
            .populate({
            path: 'author',
            select: 'firstName lastName displayName email profilePicture',
        })
            .limit(limit)
            .skip(limit * (page - 1))
            .lean()
            .select('-bodies')
            .sort({ wikiTitle: 1 });
        // console.log(wikis.length);
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
        // console.log(returnData);
        return {
            wikiList: returnData,
            total: await wiki_1.default.countDocuments({ $and: [filter, filter2] }),
        };
    }
    async getRelatedWiki(type, category, userId, wikiId) {
        let wikiIds = [];
        if (type === 'Ingredient') {
            let blendIngredients = await blendIngredient_1.default.find({
                _id: { $ne: wikiId },
                category: category,
            }).select('_id');
            wikiIds = blendIngredients.map((blendIngredient) => blendIngredient._id);
        }
        else if (type === 'Nutrient') {
            let blendNutrients = await blendNutrient_1.default.find({
                _id: { $ne: wikiId },
                category: category,
            }).select('_id');
            wikiIds = blendNutrients.map((blendNutrient) => blendNutrient._id);
        }
        let wikis = await wiki_1.default.find({
            _id: { $in: wikiIds },
            isPublished: true,
            isBookmarked: false,
        })
            .limit(5)
            .lean()
            .select('-bodies')
            .sort({ wikiTitle: 1 });
        let returnData = [];
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
        return {
            wikiList: returnData,
            total: await wiki_1.default.countDocuments({
                _id: { $in: wikiIds },
                isPublished: true,
                isBookmarked: false,
            }),
        };
    }
    async getHealthImpactByEntityId(entityId, type) {
        let match = {};
        let firstProject = {};
        let secondProject = {};
        let firstUnwind = '';
        let secondUnwind = '';
        if (type === 'Food') {
            match = {
                'foods.foodId': new mongoose_1.default.mongo.ObjectId(entityId.toString()),
            };
            firstProject = {
                _id: 1,
                healthTopic: 1,
                foods: 1,
            };
            secondProject = {
                healthId: '$_id',
                healthTopic: 1,
                score: '$foods.score',
            };
            firstUnwind = '$foods';
            secondUnwind = '$foods.foodId';
        }
        else if (type === 'Nutrient') {
            match = {
                'nutrients.nutrientId': new mongoose_1.default.mongo.ObjectId(entityId.toString()),
            };
            firstProject = {
                _id: 1,
                healthTopic: 1,
                nutrients: 1,
            };
            secondProject = {
                healthId: '$_id',
                healthTopic: 1,
                score: '$nutrients.score',
            };
            firstUnwind = '$nutrients';
            secondUnwind = '$nutrients.nutrientId';
        }
        // let healthImpacts = await Health.aggregate([
        //   {
        //     $match: {
        //       'nutrients.nutrientId': new mongoose.mongo.ObjectId(
        //         nutrientId.toString()
        //       ),
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       healthTopic: 1,
        //       nutrients: 1,
        //     },
        //   },
        //   {
        //     $unwind: '$nutrients',
        //   },
        //   {
        //     $unwind: '$nutrients.nutrientId',
        //   },
        //   {
        //     $match: {
        //       'nutrients.nutrientId': new mongoose.mongo.ObjectId(
        //         nutrientId.toString()
        //       ),
        //     },
        //   },
        //   {
        //     $limit: 10,
        //   },
        //   {
        //     $project: {
        //       healthId: '$_id',
        //       healthTopic: 1,
        //       score: '$nutrients.score',
        //     },
        //   },
        //   {
        //     $sort: {
        //       score: -1,
        //     },
        //   },
        // ]);
        let healthImpacts = await health_1.default.aggregate([
            {
                $match: match,
            },
            {
                $project: firstProject,
            },
            { $unwind: firstUnwind },
            { $unwind: secondUnwind },
            {
                $match: match,
            },
            {
                $limit: 10,
            },
            {
                $project: secondProject,
            },
            {
                $sort: {
                    score: -1,
                },
            },
        ]);
        return healthImpacts;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => WikiListWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('ids', (type) => [String], { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getNutrientWikiList", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiListWithPagination_1.default) //TODO
    ,
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('ids', (type) => [String], { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getNutrientWikiList2", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiListWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('ids', (type) => [String], { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getIngredientWikiList", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiListWithPagination_1.default) //TODO
    ,
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('ids', (type) => [String], { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getIngredientWikiList2", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Wikilist_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getWikiList", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Wikilist_1.default]) //TODO
    ,
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getWikiList2", null);
__decorate([
    (0, type_graphql_1.Query)(() => NutrientsFromIngredient_1.default) // TODO
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getBlendNutritionBasedIngredientsWiki2", null);
__decorate([
    (0, type_graphql_1.Query)(() => HealthWiki_1.default) // TODO
    ,
    __param(0, (0, type_graphql_1.Arg)('wikiHealthId', (type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getAHealthWiki", null);
__decorate([
    (0, type_graphql_1.Query)(() => IngredientsFromNutrition_1.default) //todo
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetIngredientsFromNutrition_1.default,
        String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getAllIngredientsBasedOnNutrition2", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredientAndNutrientWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editIngredientWiki", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //todo
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredientAndNutrientWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editIngredientWiki2", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredientAndNutrientWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editNutrientWiki", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //todo
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditIngredientAndNutrientWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editNutrientWiki2", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //todo
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditHealthWiki_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "editHealthWiki", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GramConversion_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "convertToGram", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GramConversion_1.default]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "convertGramToUnit", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getDefaultPortion", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "bodyTeswwt", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getBlendNutritionBasedOnRecipexxx2", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiLinks_1.default),
    __param(0, (0, type_graphql_1.Arg)('entityId')),
    __param(1, (0, type_graphql_1.Arg)('type')),
    __param(2, (0, type_graphql_1.Arg)('links', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getWikiLinks", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "makeWikis", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "makeOtherIngredientWiki", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BookmarkAndExternalGlobalLInk_1.default),
    __param(0, (0, type_graphql_1.Arg)('wikiId')),
    __param(1, (0, type_graphql_1.Arg)('bookmarkId', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('link')),
    __param(3, (0, type_graphql_1.Arg)('type')),
    __param(4, (0, type_graphql_1.Arg)('customBookmarkName', { nullable: true })),
    __param(5, (0, type_graphql_1.Arg)('removeCustomBookmark', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "manipulateBookMarks", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('bookmarkId')),
    __param(1, (0, type_graphql_1.Arg)('use')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Boolean]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "useABookmark", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "createBookMark", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * An asynchronous function that creates a bookmark for blend ingredients.
     *
     * @return {Promise<string>} A promise that resolves to the string 'done' when the operation is complete.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "createBookMark2", null);
__decorate([
    (0, type_graphql_1.Query)(() => String)
    /**
     * Retrieves theme widget data.
     *
     * @return {Promise<string>} The result of the function.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getThemeWidgetData", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Wikilist_1.default]) //TODO
    ,
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getWikiList3", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiListWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterWikiInput_1.default, Number, Number, String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "filterWiki", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiListWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('type')),
    __param(1, (0, type_graphql_1.Arg)('category')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __param(3, (0, type_graphql_1.Arg)('wikiId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getRelatedWiki", null);
__decorate([
    (0, type_graphql_1.Query)(() => [HealthImpact_1.default]),
    __param(0, (0, type_graphql_1.Arg)('entityId')),
    __param(1, (0, type_graphql_1.Arg)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getHealthImpactByEntityId", null);
WikiResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiResolver);
exports.default = WikiResolver;
