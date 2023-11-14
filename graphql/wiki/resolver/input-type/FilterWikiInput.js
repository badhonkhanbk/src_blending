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
const type_graphql_2 = require("type-graphql");
const nutrientMatrix_1 = __importDefault(require("../../../recipe/resolvers/input-type/nutrientMatrix"));
const NutrienFilterForRecipe_1 = __importDefault(require("../../../recipe/resolvers/input-type/NutrienFilterForRecipe"));
var WikiType;
(function (WikiType) {
    WikiType["INGREDIENT"] = "Ingredient";
    WikiType["NUTRIENT"] = "Nutrient";
    WikiType["HEALTH"] = "Health";
})(WikiType || (WikiType = {}));
var BlendIngredientType;
(function (BlendIngredientType) {
    BlendIngredientType["LEAFY"] = "Leafy";
    BlendIngredientType["BERRY"] = "Berry";
    BlendIngredientType["HERBAL"] = "Herbal";
    BlendIngredientType["FRUITY"] = "Fruity";
    BlendIngredientType["BALANCER"] = "Balancer";
    BlendIngredientType["FATTY"] = "Fatty";
    BlendIngredientType["SEASONING"] = "Seasoning";
    BlendIngredientType["FLAVOR"] = "Flavor";
    BlendIngredientType["ROOTY"] = "Rooty";
    BlendIngredientType["FLOWERING"] = "Flowering";
    BlendIngredientType["LIQUID"] = "Liquid";
    BlendIngredientType["TUBE_SQUASH"] = "Tube-Squash";
})(BlendIngredientType || (BlendIngredientType = {}));
var HealthCategoryFilter;
(function (HealthCategoryFilter) {
    HealthCategoryFilter["MUSCULOSKELETAL_DISORDERS"] = "Musculoskeletal Disorders";
    HealthCategoryFilter["MENTAL_AND_BEHAVIORAL"] = "Mental & Behavioral";
    HealthCategoryFilter["SKIN_CONDITIONS"] = "Skin Conditions";
    HealthCategoryFilter["CARDIOVASCULAR_DISEASES"] = "Cardiovascular Diseases";
    HealthCategoryFilter["RESPIRATORY_DISEASES"] = "Respiratory Diseases";
    HealthCategoryFilter["HORMONAL_AND_METABOLIC"] = "Hormonal & Metabolic";
    HealthCategoryFilter["INFLAMMATORY_AND_AUTOIMMUNE"] = "Inflammatory & Autoimmune";
    HealthCategoryFilter["REPRODUCTIVE_AND_URINARY"] = "Reproductive & Urinary";
    HealthCategoryFilter["EYE_AND_EAR_CONDITIONS"] = "Eye & Ear Conditions";
    HealthCategoryFilter["DIGESTIVE_DISORDERS"] = "Digestive Disorders";
    HealthCategoryFilter["TESTCATEGORY"] = "testCategory";
    HealthCategoryFilter["NEUROLOGICAL_DISORDERS"] = "Neurological Disorders";
    HealthCategoryFilter["OTHER_CONDITIONS"] = "Other Conditions";
    HealthCategoryFilter["INFECTIOUS_DISEASES"] = "Infectious Diseases";
    HealthCategoryFilter["CANCERS"] = "Cancers";
})(HealthCategoryFilter || (HealthCategoryFilter = {}));
var NutrientCategoryFilter;
(function (NutrientCategoryFilter) {
    NutrientCategoryFilter["MACRO_NUTRIENTS"] = "MacroNutrients";
    NutrientCategoryFilter["MICRO_NUTRIENTS"] = "MicroNutrients";
    NutrientCategoryFilter["VITAMIN"] = "Vitamin";
    NutrientCategoryFilter["MINERAL"] = "Mineral";
    NutrientCategoryFilter["CALORIE"] = "Calorie";
})(NutrientCategoryFilter || (NutrientCategoryFilter = {}));
(0, type_graphql_2.registerEnumType)(WikiType, {
    name: 'WikiType',
    description: 'The types', // this one is optional
});
(0, type_graphql_2.registerEnumType)(BlendIngredientType, {
    name: 'BlendIngredientType',
    description: 'The types', // this one is optional
});
(0, type_graphql_2.registerEnumType)(NutrientCategoryFilter, {
    name: 'NutrientCategoryFilter',
    description: 'The types', // this one is optional
});
(0, type_graphql_2.registerEnumType)(HealthCategoryFilter, {
    name: 'HealthCategoryFilter',
    description: 'The types', // this one is optional
});
let FilterWikiInput = class FilterWikiInput {
};
__decorate([
    (0, type_graphql_1.Field)((type) => [WikiType], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "wikiType", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "includeWikiIds", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "excludeWikiIds", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendIngredientType], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "BlendIngredientType", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [nutrientMatrix_1.default], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "nutrientMatrix", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [NutrienFilterForRecipe_1.default], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "nutrientFilters", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [NutrientCategoryFilter], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "nutrientCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [HealthCategoryFilter], { nullable: true }),
    __metadata("design:type", Array)
], FilterWikiInput.prototype, "healthCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FilterWikiInput.prototype, "searchTerm", void 0);
FilterWikiInput = __decorate([
    (0, type_graphql_1.InputType)()
], FilterWikiInput);
exports.default = FilterWikiInput;
