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
let WikiResolver = class WikiResolver {
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
        //cullinert helth super powwer for mere power
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
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ wikiTitle: 1 });
        for (let i = 0; i < wikiNutrients.length; i++) {
            let data = wikiNutrients[i];
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
            .limit(limit)
            .skip(limit * (page - 1))
            .lean()
            .sort({ wikiTitle: 1 });
        for (let i = 0; i < wikiIngredients.length; i++) {
            let data = wikiIngredients[i];
            let blendIngredient = await blendIngredient_1.default.findOne({
                _id: wikiIngredients[i]._id,
            }).select('portions');
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
    async getWikiList(userId) {
        let returnData = [];
        let blendNutrients = await blendNutrient_1.default.find()
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
        let blendIngredients = await blendIngredient_1.default.find()
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
        let wikis = await wiki_1.default.find({ isBookmarked: false })
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
    async getBlendNutritionBasedIngredientsWiki(ingredientsInfo, userId) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientsInfo[0].ingredientId,
        });
        let commentsCount = 0;
        let hasInCompare = false;
        if (userId) {
            let comments = await wikiComment_1.default.find({
                entityId: ingredient._id,
            }).select('_id');
            let compare = await UserIngredientCompareList_1.default.findOne({
                userId: userId,
                ingredients: { $in: ingredient._id },
            }).select('_id');
            if (compare) {
                hasInCompare = true;
            }
            commentsCount = comments.length;
        }
        let returnData = {
            wikiTitle: ingredient.wikiTitle,
            wikiDescription: ingredient.wikiDescription,
            ingredientName: ingredient.ingredientName,
            wikiCoverImages: ingredient.wikiCoverImages,
            wikiFeatureImage: ingredient.wikiFeatureImage,
            bodies: ingredient.bodies,
            type: 'Ingredient',
            category: ingredient.category ? ingredient.category : '',
            publishedBy: 'g. Braun',
            seoTitle: ingredient.seoTitle,
            seoSlug: ingredient.seoSlug,
            portions: ingredient.portions,
            seoCanonicalURL: ingredient.seoCanonicalURL,
            seoSiteMapPriority: ingredient.seoSiteMapPriority,
            seoKeywords: ingredient.seoKeywords,
            seoMetaDescription: ingredient.seoMetaDescription,
            isPublished: ingredient.isPublished,
            commentsCount: commentsCount,
            hasInCompare: hasInCompare,
        };
        return returnData;
    }
    async getBlendNutritionBasedIngredientsWiki2(ingredientsInfo, userId) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let wiki = await wiki_1.default.findOne({
            _id: ingredientsInfo[0].ingredientId,
        }).populate({
            path: 'ingredientBookmarkList.ingredientId',
            select: '_id ingredientName portions',
        });
        let blendIngredient = await blendIngredient_1.default.findOne({
            _id: wiki._id,
        }).select('portions');
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
        wiki.portions = blendIngredient.portions;
        return wiki;
    }
    async getAllIngredientsBasedOnNutrition(data, userId) {
        let nutrient = await blendNutrient_1.default.findOne({
            _id: data.nutritionID,
        }).populate('category');
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
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
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
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
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
        let commentsCount = 0;
        if (userId) {
            let comments = await wikiComment_1.default.find({
                entityId: nutrient._id,
            }).select('_id');
            commentsCount = comments.length;
        }
        let returnData = {
            wikiTitle: nutrient.wikiTitle,
            wikiDescription: nutrient.wikiDescription,
            nutrientName: nutrient.nutrientName,
            wikiCoverImages: nutrient.wikiCoverImages,
            wikiFeatureImage: nutrient.wikiFeatureImage,
            bodies: nutrient.bodies,
            ingredients: result.slice(0, 10),
            type: 'Nutrient',
            publishedBy: 'g. Braun',
            seoTitle: nutrient.seoTitle,
            seoSlug: nutrient.seoSlug,
            seoCanonicalURL: nutrient.seoCanonicalURL,
            seoSiteMapPriority: nutrient.seoSiteMapPriority,
            seoKeywords: nutrient.seoKeywords,
            seoMetaDescription: nutrient.seoMetaDescription,
            isPublished: nutrient.isPublished,
            commentsCount: commentsCount,
        };
        return returnData;
    }
    async getAllIngredientsBasedOnNutrition2(data, userId) {
        let wiki = await wiki_1.default.findOne({
            _id: data.nutritionID,
        }).populate({
            path: 'nutrientBookmarkList.nutrientId',
            select: '_id nutrientName',
        });
        if (!wiki) {
            return new AppError_1.default('wiki not found', 404);
        }
        let wikiData = wiki;
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
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
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
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
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
        let commentsCount = 0;
        if (userId) {
            let comments = await wikiComment_1.default.find({
                entityId: wiki._id,
            }).select('_id');
            commentsCount = comments.length;
        }
        wikiData.comments = commentsCount;
        wikiData.ingredients = result.slice(0, 10);
        return wikiData;
    }
    async editIngredientWiki(data) {
        await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async editIngredientWiki2(data) {
        await wiki_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async editNutrientWiki(data) {
        await blendNutrient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async editNutrientWiki2(data) {
        await wiki_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'success';
    }
    async convertToGram(data) {
        // [ 'kJ', 'G', 'MG', 'UG', 'IU' ]
        let gram;
        console.log('data', data);
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
    async convertGramToUnit(data) {
        // [ 'kJ', 'G', 'MG', 'UG', 'IU' ]
        let gram;
        console.log('data', data);
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
    async manipulateBookMarks(wikiId, bookmarkId, link, type, customBookmarkName, removeCustomBookmark) {
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
            console.log('hello world');
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
                console.log('');
                await wiki_1.default.findOneAndUpdate({ _id: wikiId }, {
                    $push: {
                        nutrientBookmarkList: newData,
                    },
                });
            }
        }
        else {
            if (!bookmarkId) {
                console.log('hello');
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
    async getData() {
        return 'data';
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
    (0, type_graphql_1.Query)(() => NutrientsFromIngredient_1.default) // wait
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getBlendNutritionBasedIngredientsWiki", null);
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
    (0, type_graphql_1.Query)(() => IngredientsFromNutrition_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetIngredientsFromNutrition_1.default,
        String]),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getAllIngredientsBasedOnNutrition", null);
__decorate([
    (0, type_graphql_1.Query)(() => IngredientsFromNutrition_1.default) //todo
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
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
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "createBookMark2", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiResolver.prototype, "getData", null);
WikiResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiResolver);
exports.default = WikiResolver;
