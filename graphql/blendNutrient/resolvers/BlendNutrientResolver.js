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
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
const uniqueNutrient_1 = __importDefault(require("../../../models/uniqueNutrient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const wiki_1 = __importDefault(require("../../../models/wiki"));
const AddNewBlendNutrient_1 = __importDefault(require("./input-type/blendNutrient/AddNewBlendNutrient"));
const EditBlendNutrient_1 = __importDefault(require("./input-type/blendNutrient/EditBlendNutrient"));
const AddNewBlendNutrientFromSrc_1 = __importDefault(require("./input-type/blendNutrient/AddNewBlendNutrientFromSrc"));
const BlendNutrientData_1 = __importDefault(require("../schemas/BlendNutrientData"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const util_1 = __importDefault(require("./input-type/util"));
// import convert from 'recipe-unit-converter';
let allUnits = {
    Kilojoules: { unit: 'kJ', unitName: 'Kilojoules' },
    Gram: { unit: 'G', unitName: 'Gram' },
    Milligram: { unit: 'MG', unitName: 'Milligram' },
    Microgram: { unit: 'μg', unitName: 'Microgram' },
    Kilogram: { unit: 'KG', unitName: 'Kilogram' },
    Millilitre: { unit: 'ML', unitName: 'Millilitre' },
    Ounces: { unit: 'OZ', unitName: 'Ounces' },
    Liter: { unit: 'L', unitName: 'Liter' },
};
let BlendNutrientResolver = class BlendNutrientResolver {
    // @Query(() => Number)
    // async getConvertedData(
    //   @Arg('convertThis') convertThis: string,
    //   @Arg('covertInto') convertInto: string,
    //   @Arg('convertedValue') convertedValue: number
    // ) {
    //   //@ts-ignore
    //   let convert2 = convert(convertedValue).from(convertThis).to(convertInto);
    //   console.log(convert2);
    //   return 22;
    // }
    async addNewBlendNutrient(data) {
        if (!data.category) {
            return new AppError_1.default('Category can not be null.', 400);
        }
        let nutrientCategory = await blendNutrientCategory_1.default.findOne({
            _id: data.category,
        }).select('_id categoryName');
        let initials = nutrientCategory.categoryName.substring(0, 2);
        if (!data.parent || data.parent === '') {
            data.parent = null;
            data.parentIsCategory = true;
            data.isBookmarked = false;
            let searchBlendNutrient = await blendNutrient_1.default.find({
                category: data.category,
                parentIsCategory: true,
            });
            console.log(searchBlendNutrient[searchBlendNutrient.length - 1].blendId);
            data.rank = searchBlendNutrient.length + 1;
            if (searchBlendNutrient.length === 0) {
                data.blendId = initials + '-' + String(1);
            }
            else {
                data.blendId =
                    initials +
                        '-' +
                        (+searchBlendNutrient[searchBlendNutrient.length - 1].blendId.match(/\d+/)[0] + 1).toString();
            }
        }
        else {
            let parentNutrient = await blendNutrient_1.default.findOne({
                _id: parent,
            }).select('isBookmarked');
            data.isBookmarked = parentNutrient.isBookmarked;
            data.parentIsCategory = false;
            let searchBlendNutrient = await blendNutrient_1.default.find({
                parent: data.parent,
                parentIsCategory: false,
            });
            data.rank = searchBlendNutrient.length + 1;
            if (searchBlendNutrient.length === 0) {
                data.blendId = initials + '-' + String(1);
            }
            else {
                data.blendId =
                    initials +
                        '-' +
                        (+searchBlendNutrient[searchBlendNutrient.length - 1].blendId.match(/\d+/)[0] + 1).toString();
            }
        }
        console.log(data);
        await blendNutrient_1.default.create(data);
        return 'BlendNutrient Created Successful';
    }
    async getAllBlendNutrients() {
        let blendNutrients = await blendNutrient_1.default.find()
            .populate('parent')
            .populate('category')
            .sort({ nutrientName: 1 });
        return blendNutrients;
    }
    async getASingleBlendNutrient(id) {
        let blendNutrient = await blendNutrient_1.default.findById(id)
            .populate('parent')
            .populate('category');
        let returnBlendNutrient = blendNutrient;
        let mapList = await mapToBlend_1.default.find({
            blendNutrientId: blendNutrient._id,
        }).populate('srcUniqueNutrientId');
        let returnMapList = [];
        for (let i = 0; i < mapList.length; i++) {
            returnMapList.push({
                srcUniqueNutrientId: mapList[i].srcUniqueNutrientId._id,
                //@ts-ignore
                nutrientName: mapList[i].srcUniqueNutrientId.nutrient,
                rank: mapList[i].rank,
            });
        }
        returnBlendNutrient.mapList = returnMapList;
        return returnBlendNutrient;
    }
    async editBlendNutrient(data) {
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: data.editId,
        }).select('rank isBookmarked');
        if (data.editableObject.category === null) {
            return new AppError_1.default('Category can not be null.', 400);
        }
        if (data.editableObject.isBookmarked !== blendNutrient.isBookmarked) {
            await this.addBookmark(data.editId, data.editableObject.isBookmarked);
        }
        let modifiedData = data.editableObject;
        if (modifiedData.parent !== undefined) {
            if (!modifiedData.parent || modifiedData.parent === '') {
                modifiedData.parent = null;
                modifiedData.parentIsCategory = true;
            }
            else {
                modifiedData.parentIsCategory = false;
            }
        }
        if (
        //@ts-ignore
        modifiedData.unitName !== '' &&
            modifiedData.unitName) {
            //@ts-ignore
            modifiedData.units = allUnits[modifiedData.unitName].unit;
        }
        if (modifiedData.mapList) {
            for (let i = 0; i < modifiedData.mapList.length; i++) {
                await mapToBlend_1.default.findOneAndUpdate({
                    blendNutrientId: data.editId,
                    srcUniqueNutrientId: modifiedData.mapList[i].srcUniqueNutrientId,
                }, { rank: modifiedData.mapList[i].rank });
            }
        }
        if (data.editableObject.usePriorityForMap) {
            let checkRank1Data = data.editableObject.mapList.filter((item) => item.rank === 1)[0];
            if (!checkRank1Data) {
                return new AppError_1.default('Rank 1 data is required for use priority for map', 400);
            }
            await this.makeBlendNutrientsToMute(checkRank1Data.srcUniqueNutrientId, data.editId);
            for (let i = 0; i < data.editableObject.mapList.length; i++) {
                await mapToBlend_1.default.findOneAndUpdate({
                    srcUniqueNutrientId: data.editableObject.mapList[i].srcUniqueNutrientId,
                }, { rank: data.editableObject.mapList[i].rank });
            }
        }
        if (modifiedData.rank) {
            if (blendNutrient.rank !== modifiedData.rank) {
                let rank = modifiedData.rank;
                if (rank <= 0) {
                    return new AppError_1.default('Rank can not be less than 1', 400);
                }
                delete modifiedData.rank;
                (0, util_1.default)(data.editId, rank, blendNutrient.rank);
            }
        }
        await blendNutrient_1.default.findByIdAndUpdate(data.editId, modifiedData);
        return 'BlendNutrient Updated';
    }
    async makeBlendNutrientsToMute(uniqueNutrientReferrence, blendNutrientId) {
        let blendIngredints = await blendIngredient_1.default.find({
            'blendNutrients.uniqueNutrientReferrence': uniqueNutrientReferrence,
        }).select('blendNutrients');
        for (let i = 0; i < blendIngredints.length; i++) {
            let index = blendIngredints[i].blendNutrients.map(
            //@ts-ignore
            (x) => {
                if (String(x.uniqueNutrientReferrence) ===
                    String(uniqueNutrientReferrence) &&
                    String(x.blendNutrientRefference) === String(blendNutrientId)) {
                    x = {
                        value: x.value2 && x.value2 !== '0' ? x.value2 : x.value,
                        value2: '0',
                        blendNutrientRefference: x.blendNutrientRefference,
                        uniqueNutrientReferrence: x.uniqueNutrientReferrence,
                        //@ts-ignore
                        _id: x._id,
                    };
                    return x;
                }
                else if (String(x.blendNutrientRefference) === String(blendNutrientId)) {
                    x = {
                        value: '0',
                        value2: x.value2 && x.value2 !== '0' ? x.value2 : x.value,
                        blendNutrientRefference: x.blendNutrientRefference,
                        uniqueNutrientReferrence: x.uniqueNutrientReferrence,
                        //@ts-ignore
                        _id: x._id,
                    };
                    return x;
                }
                return x;
            });
            await blendIngredient_1.default.findOneAndUpdate({ _id: blendIngredints[i]._id }, {
                blendNutrients: index,
            });
        }
        return;
    }
    async addNewBlendNutrientFromSrc(
    // admin
    data) {
        if (data.blendNutrientIdForMaping === '') {
            await this.makeBlendNutrientsToNotBlendNutrients(data.srcNutrientId, data.blendNutrientIdForMaping);
            return 'Successful';
        }
        let un = await uniqueNutrient_1.default.findOne({
            _id: data.srcNutrientId,
        });
        if (!un) {
            return new AppError_1.default('Nutrient not found in source', 400);
        }
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: data.blendNutrientIdForMaping,
        });
        if (!blendNutrient) {
            return new AppError_1.default('Blend Nutrient not found', 400);
        }
        let checkBlendId = await mapToBlend_1.default.findOne({
            srcUniqueNutrientId: data.srcNutrientId,
        });
        if (checkBlendId) {
            await this.makeBlendNutrientsToNotBlendNutrients(data.srcNutrientId, data.blendNutrientIdForMaping);
        }
        let totalMaps = await mapToBlend_1.default.find({
            blendNutrientId: data.blendNutrientIdForMaping,
        });
        await mapToBlend_1.default.create({
            blendNutrientId: data.blendNutrientIdForMaping,
            srcUniqueNutrientId: un._id,
            rank: totalMaps.length + 1,
        });
        await blendNutrient_1.default.findOneAndUpdate({ _id: blendNutrient._id }, {
            uniqueNutrientId: un._id,
        });
        await this.makeNotBlendNutrientToBlendNutrient(
        //@ts-ignore
        un._id, data.blendNutrientIdForMaping);
        return 'BlendNutrient Created Successfull';
    }
    /**
     * Makes the blend nutrients not blend nutrients.
     *
     * @param {String} uniqueNutrientReferrence - The unique nutrient reference.
     * @param {String} blendNutrientId - The blend nutrient ID.
     * @return {void} No return value.
     */
    async makeBlendNutrientsToNotBlendNutrients(uniqueNutrientReferrence, blendNutrientId) {
        let singleMap = await mapToBlend_1.default.findOne({
            srcUniqueNutrientId: uniqueNutrientReferrence,
        });
        await mapToBlend_1.default.findOneAndDelete({
            srcUniqueNutrientId: uniqueNutrientReferrence,
        });
        let allReaminingMaps = await mapToBlend_1.default.find({
            blendNutrientId: singleMap.blendNutrientId,
        });
        for (let i = 0; i < allReaminingMaps.length; i++) {
            await mapToBlend_1.default.findOneAndUpdate({
                _id: allReaminingMaps[i]._id,
            }, {
                rank: i + 1,
            });
        }
        await blendIngredient_1.default.updateMany({
            'blendNutrients.uniqueNutrientReferrence': uniqueNutrientReferrence,
        }, {
            $pull: {
                blendNutrients: {
                    uniqueNutrientReferrence: uniqueNutrientReferrence,
                },
            },
        });
        return;
    }
    /**
     * A function that makes the not blend nutrient to blend nutrient.
     *
     * @param {String} uniqueNutrientReferrence - The unique nutrient reference.
     * @param {String} blendNutrientRefference - The blend nutrient reference.
     */
    async makeNotBlendNutrientToBlendNutrient(uniqueNutrientReferrence, blendNutrientRefference) {
        let blendIngredints = await blendIngredient_1.default.find({
            'notBlendNutrients.uniqueNutrientRefference': uniqueNutrientReferrence,
        }).select('notBlendNutrients');
        for (let i = 0; i < blendIngredints.length; i++) {
            let index = blendIngredints[i].notBlendNutrients.filter(
            //@ts-ignore
            (x) => {
                return (String(x.uniqueNutrientRefference) ===
                    String(uniqueNutrientReferrence));
            })[0];
            if (index) {
                let value = {
                    value: index.value,
                    blendNutrientRefference: blendNutrientRefference,
                    uniqueNutrientReferrence: uniqueNutrientReferrence,
                };
                await blendIngredient_1.default.findOneAndUpdate({ _id: blendIngredints[i]._id }, {
                    $push: {
                        blendNutrients: value,
                    },
                });
            }
        }
    }
    async removeBlendNutrient(id) {
        await blendNutrient_1.default.findByIdAndDelete(id);
        await mapToBlend_1.default.deleteMany({
            blendNutrientId: id,
        });
        await this.makeBlendNutrientToNotBlendNutrient(id);
        return 'BlendNutrient Deleted';
    }
    async makeBlendNutrientToNotBlendNutrient(blendNutrientId) {
        await blendIngredient_1.default.updateMany({
            'blendNutrient.blendNutrientRefference': blendNutrientId,
        }, {
            $pull: { blendNutrients: { blendNutrientRefference: blendNutrientId } },
        });
        await mapToBlend_1.default.deleteMany({ blendNutrientId });
        return;
    }
    async showChildren() {
        await blendNutrient_1.default.updateMany({}, { showChildren: false });
        return 'done';
    }
    async addBookmark(nutrientId, marked) {
        let nutrient = await blendNutrient_1.default.findOne({ _id: nutrientId }).select('_id parentIsCategory parent');
        if (marked &&
            (!nutrient || nutrient.parentIsCategory || !nutrient.parent)) {
            return new AppError_1.default('Making Bookmark failed', 400);
        }
        if (marked) {
            await blendIngredient_1.default.updateMany({
                'blendNutrients.blendNutrientRefference': nutrient._id,
            }, {
                $set: {
                    'blendNutrients.$.disabled': true,
                },
            });
            await blendNutrient_1.default.findOneAndUpdate({ _id: nutrientId }, { isBookmarked: marked });
            await wiki_1.default.findOneAndUpdate({ _id: nutrientId }, { nutrientBookmarkList: [], isBookmarked: marked });
            await wiki_1.default.findOneAndUpdate({ _id: nutrient.parent }, {
                $push: { nutrientBookmarkList: { nutrientId } },
            });
            let children = await blendNutrient_1.default.find({
                parent: nutrientId,
            }).select('_id');
            children = children.map((child) => child._id);
            if (children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    await blendNutrient_1.default.findOneAndUpdate({ _id: children[i] }, { isBookmarked: marked });
                    await wiki_1.default.findOneAndUpdate({ _id: children[i] }, { isBookmarked: marked });
                    if (marked) {
                        await wiki_1.default.findOneAndUpdate({ _id: nutrient.parent }, {
                            $push: { nutrientBookmarkList: { nutrientId: children[i] } },
                        });
                    }
                    else {
                        await wiki_1.default.findOneAndUpdate({ _id: nutrient.parent }, {
                            $pull: { nutrientBookmarkList: { nutrientId: children[i] } },
                        });
                    }
                    let nestedChildren = await blendNutrient_1.default.find({
                        parent: children[i],
                    }).select('_id');
                    nestedChildren = nestedChildren.map((nestedChild) => nestedChild._id);
                    if (nestedChildren.length > 0) {
                        await this.makeBookmark(nestedChildren, 
                        //@ts-ignore
                        nutrient.parent, marked, nutrientId);
                    }
                }
            }
        }
        else {
            let parentNutrient = await blendNutrient_1.default.findOne({
                _id: nutrient.parent,
            }).select('isBookmarked');
            console.log(parentNutrient.isBookmarked, nutrient.parent);
            if (!parentNutrient.isBookmarked) {
                await blendNutrient_1.default.findOneAndUpdate({ _id: nutrientId }, { isBookmarked: marked });
                await wiki_1.default.findOneAndUpdate({ _id: nutrientId }, { isBookmarked: marked });
                await blendIngredient_1.default.updateMany({
                    'blendNutrients.blendNutrientRefference': nutrientId,
                }, {
                    $set: {
                        'blendNutrients.$.disabled': false,
                    },
                });
                let mainParent = await this.findParentAndRemoveFromTheNutrientList(
                //@ts-ignore
                nutrient.parent, nutrientId);
                let nestedChildren = await blendNutrient_1.default.find({
                    parent: nutrientId,
                }).select('_id');
                nestedChildren = nestedChildren.map((nestedChild) => nestedChild._id);
                if (nestedChildren.length > 0) {
                    await this.makeBookmark(nestedChildren, mainParent, marked, nutrientId);
                }
            }
        }
    }
    /**
     * Asynchronously makes a bookmark.
     *
     * @param {any[]} bookmarkIds - An array of bookmark IDs.
     * @param {string} parent - The parent ID.
     * @param {boolean} marked - Indicates if the bookmark should be marked.
     * @param {string} NutrientId - The Nutrient ID.
     */
    async makeBookmark(bookmarkIds, parent, marked, NutrientId) {
        if (marked) {
            await blendNutrient_1.default.updateMany({ _id: { $in: bookmarkIds } }, { isBookmarked: marked });
            await wiki_1.default.updateMany({ _id: { $in: bookmarkIds } }, { isBookmarked: marked });
            for (let i = 0; i < bookmarkIds.length; i++) {
                await blendIngredient_1.default.updateMany({
                    'blendNutrients.blendNutrientRefference': bookmarkIds[i],
                }, {
                    $set: {
                        'blendNutrients.$.disabled': false,
                    },
                });
            }
            let mappedBookMarks = bookmarkIds.map((id) => {
                return {
                    nutrientId: id,
                };
            });
            await wiki_1.default.findOneAndUpdate({ _id: parent }, {
                $push: { nutrientBookmarkList: mappedBookMarks },
            });
        }
        else {
            await wiki_1.default.findOneAndUpdate({ _id: parent }, {
                $pull: {
                    nutrientBookmarkList: { nutrientId: { $in: bookmarkIds } },
                },
            });
            for (let i = 0; i < bookmarkIds.length; i++) {
                await blendIngredient_1.default.updateMany({
                    'blendNutrients.blendNutrientRefference': bookmarkIds[i],
                }, {
                    $set: {
                        'blendNutrients.$.disabled': false,
                    },
                });
            }
            let mappedBookMarks = bookmarkIds.map((id) => {
                return {
                    nutrientId: id,
                };
            });
            await wiki_1.default.findOneAndUpdate({ _id: NutrientId }, {
                $push: { nutrientBookmarkList: mappedBookMarks },
            });
        }
        for (let i = 0; i < bookmarkIds.length; i++) {
            let nestedChildren = await blendNutrient_1.default.find({
                parent: bookmarkIds[i],
            }).select('_id');
            nestedChildren = nestedChildren.map((nestedChild) => nestedChild._id);
            if (nestedChildren.length > 0) {
                await this.makeBookmark(nestedChildren, parent, marked, NutrientId);
            }
        }
    }
    /**
     * Finds the immediate parent in the nutrient list and removes the nutrient with the given ID.
     *
     * @param {string} immediateParent - The ID of the immediate parent.
     * @param {string} nutrientId - The ID of the nutrient to be removed.
     * @return {Promise<string>} - The ID of the immediate parent after removing the nutrient.
     */
    async findParentAndRemoveFromTheNutrientList(immediateParent, nutrientId) {
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: immediateParent,
        }).select('isBookmarked parent');
        console.log(immediateParent, blendNutrient.isBookmarked);
        if (!blendNutrient.isBookmarked) {
            await wiki_1.default.findOneAndUpdate({ _id: immediateParent }, {
                $pull: {
                    nutrientBookmarkList: { nutrientId: nutrientId },
                },
            });
            return immediateParent;
        }
        else {
            await this.findParentAndRemoveFromTheNutrientList(
            //@ts-ignore
            blendNutrient.parent, nutrientId);
        }
    }
    /**
     * Retrieves blend nutrients based on category.
     *
     * @param {string} nutrientCategoryId - The ID of the nutrient category.
     * @return {Promise<BlendNutrientModel[]>} An array of blend nutrients.
     */
    async getBlendNutrientsBasedOnCategoey(nutrientCategoryId) {
        let blendNutrients = await blendNutrient_1.default.find({
            category: nutrientCategoryId,
        })
            .select('_id nutrientName')
            .sort('nutrientName');
        return blendNutrients;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewBlendNutrient_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "addNewBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendNutrientData_1.default]) //Both ADMIN and USER
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "getAllBlendNutrients", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendNutrientData_1.default) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "getASingleBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlendNutrient_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "editBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewBlendNutrientFromSrc_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "addNewBlendNutrientFromSrc", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "removeBlendNutrient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "showChildren", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendNutrientData_1.default])
    /**
     * Retrieves blend nutrients based on category.
     *
     * @param {string} nutrientCategoryId - The ID of the nutrient category.
     * @return {Promise<BlendNutrientModel[]>} An array of blend nutrients.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('nutrientCategoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientResolver.prototype, "getBlendNutrientsBasedOnCategoey", null);
BlendNutrientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendNutrientResolver);
exports.default = BlendNutrientResolver;
