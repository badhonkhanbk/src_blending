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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const recipe_1 = __importDefault(require("../../../models/recipe"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
let RecipeCorrectionResolver = class RecipeCorrectionResolver {
    async recipeCorrection() {
        await recipeModel_1.default.deleteMany();
        let recipes = await recipe_1.default.find();
        for (let i = 0; i < recipes.length; i++) {
            let newRecipe = {
                _id: recipes[i]._id,
                mainEntityOfPage: recipes[i].mainEntityOfPage,
                name: recipes[i].name,
                image: recipes[i].image,
                servings: recipes[i].servings,
                datePublished: recipes[i].datePublished,
                description: recipes[i].description,
                prepTime: recipes[i].prepTime,
                cookTime: recipes[i].cookTime,
                totalTime: recipes[i].totalTime,
                recipeYield: recipes[i].recipeYield,
                recipeCuisines: recipes[i].recipeCuisines,
                author: recipes[i].author,
                recipeBlendCategory: recipes[i].recipeBlendCategory,
                brand: recipes[i].brand,
                foodCategories: recipes[i].foodCategories,
                //NOTE:
                recipeInstructions: recipes[i].recipeInstructions,
                servingSize: recipes[i].servingSize,
                isPublished: recipes[i].isPublished,
                url: recipes[i].url,
                favicon: recipes[i].favicon,
                addedByAdmin: recipes[i].addedByAdmin,
                userId: recipes[i].userId,
                adminIds: recipes[i].adminIds,
                discovery: recipes[i].discovery,
                global: recipes[i].global,
                numberOfRating: recipes[i].numberOfRating,
                totalRating: recipes[i].totalRating,
                totalViews: recipes[i].totalViews,
                averageRating: recipes[i].averageRating,
                seoTitle: recipes[i].seoTitle,
                seoSlug: recipes[i].seoSlug,
                seoCanonicalURL: recipes[i].seoCanonicalURL,
                seoSiteMapPriority: recipes[i].seoSiteMapPriority,
                seoKeywords: recipes[i].seoKeywords,
                seoMetaDescription: recipes[i].seoMetaDescription,
                collections: recipes[i].collections,
                createdAt: recipes[i].createdAt,
                originalVersion: recipes[i].originalVersion,
                defaultVersion: recipes[i].defaultVersion,
                editedAt: recipes[i].editedAt,
                isMatch: recipes[i].isMatch,
            };
            let otherVersions = recipes[i].recipeVersion.filter((rv) => {
                return (String(rv) !== String(recipes[i].defaultVersion) &&
                    String(rv) !== String(recipes[i].originalVersion));
            });
            newRecipe.turnedOnVersions = otherVersions;
            await recipeModel_1.default.create(newRecipe);
        }
        return 'done';
    }
    async recipeCorrection2() {
        await recipeModel_1.default.deleteMany();
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "recipeCorrection", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "recipeCorrection2", null);
RecipeCorrectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeCorrectionResolver);
exports.default = RecipeCorrectionResolver;
