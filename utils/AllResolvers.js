"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FoodResolver_1 = __importDefault(require("../graphql/src_food/resolvers/FoodResolver"));
const RecipeResolver_1 = __importDefault(require("../graphql/recipe/resolvers/RecipeResolver"));
const RecipeCategoryResolver_1 = __importDefault(require("../graphql/recipe/resolvers/RecipeCategoryResolver"));
const BrandResolver_1 = __importDefault(require("../graphql/recipe/resolvers/BrandResolver"));
const AdminResolver_1 = __importDefault(require("../graphql/admin/resolvers/AdminResolver"));
const RoleResolver_1 = __importDefault(require("../graphql/admin/resolvers/RoleResolver"));
const MemberResolver_1 = __importDefault(require("../graphql/member/resolvers/MemberResolver"));
const ConfigurationResolver_1 = __importDefault(require("../graphql/configuiration/resolvers/ConfigurationResolver"));
const UserRecipeAndCollectionResolver_1 = __importDefault(require("../graphql/member/resolvers/UserRecipeAndCollectionResolver"));
const UserCommentResolver_1 = __importDefault(require("../graphql/member/resolvers/UserCommentResolver"));
const AdminCollectionResolver_1 = __importDefault(require("../graphql/admin/resolvers/AdminCollectionResolver"));
const UserNoteResolver_1 = __importDefault(require("../graphql/member/resolvers/UserNoteResolver"));
const BlendNutrientCategoryResolver_1 = __importDefault(require("../graphql/blendNutrient/resolvers/BlendNutrientCategoryResolver"));
const BlendNutrientResolver_1 = __importDefault(require("../graphql/blendNutrient/resolvers/BlendNutrientResolver"));
const BlendIngredientsResolvers_1 = __importDefault(require("../graphql/blendIngredientsdata/resolvers/BlendIngredientsResolvers"));
const WikiResolver_1 = __importDefault(require("../graphql/wiki/resolver/WikiResolver"));
const dailyResolver_1 = __importDefault(require("../graphql/daily/resolvers/dailyResolver"));
const DailyGoalResolver_1 = __importDefault(require("../graphql/daily/resolvers/DailyGoalResolver"));
const WidgetResolvers_1 = __importDefault(require("../graphql/widget/resolvers/WidgetResolvers"));
const themeResolver_1 = __importDefault(require("../graphql/theme/resolvers/themeResolver"));
const RecipeVersionResolver_1 = __importDefault(require("../graphql/recipe/resolvers/RecipeVersionResolver"));
const groceryResolver_1 = __importDefault(require("../graphql/grocery/resolvers/groceryResolver"));
const pantryListResolver_1 = __importDefault(require("../graphql/grocery/resolvers/pantryListResolver"));
const PlannerResolvers_1 = __importDefault(require("../graphql/planner/resolvers/PlannerResolvers"));
const ChallengePostResolver_1 = __importDefault(require("../graphql/planner/resolvers/ChallengePostResolver"));
const ChallengeResolver_1 = __importDefault(require("../graphql/planner/resolvers/ChallengeResolver"));
const WikiCommentsResolver_1 = __importDefault(require("../graphql/wiki/resolver/WikiCommentsResolver"));
const WikiIngredientCompareResolver_1 = __importDefault(require("../graphql/wiki/resolver/WikiIngredientCompareResolver"));
const ThemeChannelResolver_1 = __importDefault(require("../graphql/theme/resolvers/ThemeChannelResolver"));
const BannerResolver_1 = __importDefault(require("../graphql/theme/resolvers/BannerResolver"));
const ShareResolver_1 = __importDefault(require("../graphql/share/resolvers/ShareResolver"));
const GeneralBlogResolver_1 = __importDefault(require("../graphql/generalBlog/resolver/GeneralBlogResolver"));
const BlogCommentResolvers_1 = __importDefault(require("../graphql/generalBlog/resolver/BlogCommentResolvers"));
const PlanResolver_1 = __importDefault(require("../graphql/planner/resolvers/PlanResolver"));
const GeneralBlogCollection_1 = __importDefault(require("../graphql/generalBlog/resolver/GeneralBlogCollection"));
const PlanCommentResolver_1 = __importDefault(require("../graphql/planner/resolvers/PlanCommentResolver"));
const PlanCollectionResolver_1 = __importDefault(require("../graphql/planner/resolvers/PlanCollectionResolver"));
const ShareCollectionResolver_1 = __importDefault(require("../graphql/share/resolvers/ShareCollectionResolver"));
const RecipeCorrectionResolver_1 = __importDefault(require("../graphql/recipe/resolvers/RecipeCorrectionResolver"));
const NewRecipeResolver_1 = __importDefault(require("../graphql/recipe/resolvers/NewRecipeResolver"));
function getAllResolvers() {
    return [
        FoodResolver_1.default,
        RecipeResolver_1.default,
        RecipeCategoryResolver_1.default,
        BrandResolver_1.default,
        AdminResolver_1.default,
        RoleResolver_1.default,
        MemberResolver_1.default,
        ConfigurationResolver_1.default,
        UserRecipeAndCollectionResolver_1.default,
        UserCommentResolver_1.default,
        AdminCollectionResolver_1.default,
        UserNoteResolver_1.default,
        BlendNutrientCategoryResolver_1.default,
        BlendNutrientResolver_1.default,
        BlendIngredientsResolvers_1.default,
        WikiResolver_1.default,
        dailyResolver_1.default,
        DailyGoalResolver_1.default,
        WidgetResolvers_1.default,
        RecipeVersionResolver_1.default,
        groceryResolver_1.default,
        pantryListResolver_1.default,
        themeResolver_1.default,
        ThemeChannelResolver_1.default,
        PlannerResolvers_1.default,
        ChallengePostResolver_1.default,
        WikiCommentsResolver_1.default,
        WikiIngredientCompareResolver_1.default,
        ChallengeResolver_1.default,
        BannerResolver_1.default,
        ShareResolver_1.default,
        GeneralBlogResolver_1.default,
        BlogCommentResolvers_1.default,
        PlanResolver_1.default,
        GeneralBlogCollection_1.default,
        PlanCommentResolver_1.default,
        PlanCollectionResolver_1.default,
        ShareCollectionResolver_1.default,
        RecipeCorrectionResolver_1.default,
        NewRecipeResolver_1.default,
    ];
}
exports.default = getAllResolvers;
