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
const CreateNewDaily_1 = __importDefault(require("./input-type/CreateNewDaily"));
const Range_1 = __importDefault(require("./input-type/Range"));
const EditRange_1 = __importDefault(require("./input-type/EditRange"));
const EditDaily_1 = __importDefault(require("./input-type/EditDaily"));
const Daily_1 = __importDefault(require("../../../models/Daily"));
const GetDaily_1 = __importDefault(require("../schemas/GetDaily"));
const RangeType_1 = __importDefault(require("../schemas/RangeType"));
const PopulatedDaily_1 = __importDefault(require("../schemas/PopulatedDaily"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const memberConfiguiration_1 = __importDefault(require("../../../models/memberConfiguiration"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const DailyWithRanges_1 = __importDefault(require("../schemas/DailyWithRanges"));
let allUnits = {
    Kilojoules: { unit: 'kJ', unitName: 'Kilojoules' },
    Gram: { unit: 'G', unitName: 'Gram' },
    Milligram: { unit: 'MG', unitName: 'Milligram' },
    Microgram: { unit: 'UG', unitName: 'Microgram' },
    Kilogram: { unit: 'KG', unitName: 'Kilogram' },
    Millilitre: { unit: 'ML', unitName: 'Millilitre' },
    Ounces: { unit: 'OZ', unitName: 'Ounces' },
    Liter: { unit: 'L', unitName: 'Liter' },
};
let UserDailyResolver = class UserDailyResolver {
    async createNewDaily(data) {
        //ADMIN
        let userDaily = await Daily_1.default.findOne({
            blendNutrientRef: data.blendNutrientRef,
        });
        if (userDaily) {
            return new AppError_1.default('Daily with that Blend refference already exists', 400);
        }
        let blendNutrientCategory = await blendNutrientCategory_1.default.findOne({
            _id: data.category,
        });
        let daily = {
            categoryName: blendNutrientCategory.categoryName,
            category: data.category,
            nutrientName: data.nutrientName,
            unitName: data.unitName,
            showPercentage: data.showPercentage,
            calorieGram: data.calorieGram,
            //@ts-ignore
            units: allUnits[data.unitName].unit,
            blendNutrientRef: data.blendNutrientRef,
        };
        let dailyData = await Daily_1.default.create(daily);
        return dailyData._id;
    }
    async EditADaily(data) {
        let daily = await Daily_1.default.findOne({ _id: data.editId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        let changedData = data.editableObject;
        if (changedData.category) {
            let blendNutrientCategory = await blendNutrientCategory_1.default.findOne({
                _id: changedData.category,
            });
            changedData.categoryName = blendNutrientCategory.categoryName;
        }
        if (changedData.unitName) {
            //@ts-ignore
            changedData.units = allUnits[changedData.unitName].unit;
        }
        await Daily_1.default.findOneAndUpdate({ _id: data.editId }, changedData);
        return 'success';
    }
    async getAllDailys() {
        let dailys = await Daily_1.default.find().populate('blendNutrientRef');
        return dailys;
    }
    async getASingleDaily(dailyId) {
        let daily = await Daily_1.default.findOne({ _id: dailyId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        return daily;
    }
    async getRangesForADaily(dailyId) {
        let daily = await Daily_1.default.findOne({ _id: dailyId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        return daily.ranges;
    }
    async getASingleRange(dailyId, rangeId) {
        let daily = await Daily_1.default.findOne({ _id: dailyId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        //@ts-ignore
        let range = daily.ranges.find((range) => String(range._id) === rangeId);
        if (!range) {
            return new AppError_1.default('Range not found', 404);
        }
        return range;
    }
    async addRangeToDaily(dailyID, range) {
        let daily = await Daily_1.default.findOne({ _id: dailyID });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        let rangeData = range;
        rangeData.units = daily.units;
        await Daily_1.default.findOneAndUpdate({ _id: dailyID }, { $push: { ranges: rangeData } });
        return 'success';
    }
    async editARange(dailyID, data) {
        let daily = await Daily_1.default.findOne({ _id: dailyID });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        //@ts-ignore
        let range = daily.ranges.find((range) => String(range._id) === data._id);
        if (!range) {
            return new AppError_1.default('Range not found', 404);
        }
        await Daily_1.default.findOneAndUpdate({ _id: dailyID }, {
            $pull: {
                ranges: { _id: data._id },
            },
        });
        await Daily_1.default.findOneAndUpdate({ _id: dailyID }, {
            $push: {
                ranges: data,
            },
        });
        return 'success';
    }
    async removeADaily(dailyId) {
        let daily = await Daily_1.default.findOne({ _id: dailyId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        await Daily_1.default.findOneAndDelete({ _id: dailyId });
        return 'success';
    }
    async removeARangeFromDaily(dailyId, rangeId) {
        let daily = await Daily_1.default.findOne({ _id: dailyId });
        if (!daily) {
            return new AppError_1.default('Daily not found', 404);
        }
        await Daily_1.default.findOneAndUpdate({ _id: dailyId }, {
            $pull: {
                ranges: { _id: rangeId },
            },
        });
        return 'success';
    }
    async getDailyByUserId(userId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let config = await memberConfiguiration_1.default.findOne({
            _id: user.configuration,
        });
        let daily = await this.getDaily(config.age.months, Number(config.age.quantity), config.activity, config.gender, Number(config.weightInKilograms), Number(config.heightInCentimeters), userId);
        return daily;
    }
    async getDaily(isAgeInMonth, ageInNumber, activity, gender, weightInKG, heightInCM, userId) {
        if (isAgeInMonth) {
            ageInNumber = Number(ageInNumber) / 12;
        }
        let bmi = await this.bmiCalculation(Number(weightInKG), Number(heightInCM));
        let calories = await this.getDailyCalorie(activity.toLowerCase(), ageInNumber, bmi, gender.toLowerCase(), weightInKG, heightInCM);
        let nutrients = await this.getDailyNutrition(ageInNumber, calories, userId);
        let returnData = {
            bmi: {
                value: bmi,
                units: 'kg/m2',
            },
            calories: {
                value: calories,
                units: 'kcal',
            },
            nutrients: nutrients,
        };
        return returnData;
    }
    async getDailyNutrition(ageInNumber, calories, userId) {
        let Energy = [];
        let Minerals = [];
        let Vitamins = [];
        let daily = await Daily_1.default.find()
            .populate('category')
            .populate('blendNutrientRef');
        let user = await memberModel_1.default.findOne({ _id: userId }).select('macroInfo');
        for (let i = 0; i < daily.length; i++) {
            let isEmptyString = daily[i].blendNutrientRef.altName === '';
            let isUndefined = daily[i].blendNutrientRef.altName === undefined;
            let isNull = daily[i].blendNutrientRef.altName === null;
            let checkForAltName = isEmptyString || isUndefined || isNull;
            let name = checkForAltName
                ? daily[i].blendNutrientRef.nutrientName
                : daily[i].blendNutrientRef.altName;
            let myData;
            if (!daily[i].showPercentage) {
                myData = {
                    nutrientName: name,
                    data: await this.getDataFromRanges(JSON.stringify(daily[i].ranges), ageInNumber, calories, daily[i].blendNutrientRef.units),
                    blendNutrientRef: daily[i].blendNutrientRef._id,
                    showPercentage: daily[i].showPercentage,
                };
            }
            else {
                let macro = user.macroInfo.filter(
                //@ts-ignore
                (macro) => String(macro.blendNutrientId) ===
                    String(daily[i].blendNutrientRef._id))[0];
                myData = {
                    nutrientName: name,
                    data: {
                        value: Math.floor((+calories * (macro.percentage / 100)) / daily[i].calorieGram),
                        units: daily[i].blendNutrientRef.units,
                    },
                    blendNutrientRef: daily[i].blendNutrientRef._id,
                    showPercentage: daily[i].showPercentage,
                    percentage: macro.percentage,
                    calorieGram: daily[i].calorieGram,
                };
            }
            if (daily[i].categoryName === 'Energy') {
                Energy.push(myData);
            }
            else if (daily[i].categoryName === 'Minerals') {
                Minerals.push(myData);
            }
            else if (daily[i].categoryName === 'Vitamins') {
                Vitamins.push(myData);
            }
        }
        return { Energy, Minerals, Vitamins };
    }
    async getDataFromRanges(ranges, ageInNumber, calories, unit) {
        let convertedRanges = JSON.parse(String(ranges));
        let value = {};
        for (let i = 0; i < convertedRanges.length; i++) {
            if (convertedRanges[i].ageInRange &&
                convertedRanges[i].ageRangeFrom <= ageInNumber &&
                convertedRanges[i].ageRangeTo >= ageInNumber) {
                if (convertedRanges[i].dailyPercentageInRange) {
                    let value1 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeFrom;
                    let value2 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeTo;
                    value = {
                        value: value1,
                        value2: value2,
                        units: unit,
                        upperLimit: convertedRanges[i].upperLimit,
                    };
                    break;
                }
                else {
                    value = {
                        value: convertedRanges[i].value,
                        units: unit,
                        upperLimit: convertedRanges[i].upperLimit,
                    };
                    break;
                }
            }
            else if (convertedRanges[i].ageMorethan < ageInNumber) {
                if (convertedRanges[i].dailyPercentageInRange) {
                    let value1 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeFrom;
                    let value2 = (Number(calories) / 100) *
                        convertedRanges[i].dailyPercentageRangeTo;
                    value = {
                        value: value1,
                        value2: value2,
                        units: unit,
                        upperLimit: convertedRanges[i].upperLimit,
                    };
                    break;
                }
                else {
                    value = {
                        value: convertedRanges[i].value,
                        units: unit,
                        upperLimit: convertedRanges[i].upperLimit,
                    };
                    break;
                }
            }
        }
        return value;
    }
    async bmiCalculation(weightInKilograms, heightInCentimeters) {
        let heightInMeters = Number(heightInCentimeters) * 0.01;
        let bmi = Number(weightInKilograms) / (heightInMeters * heightInMeters);
        return bmi;
    }
    async getDailyCalorie(activity, ageInYears, bmi, gender, weightInKG, heightInCM) {
        let heightInMeters = Number(heightInCM) * 0.01;
        let totalCaloriesNeeded;
        console.log('activity', activity);
        console.log('ageInYears', ageInYears);
        console.log('bmi', bmi);
        console.log('gender', gender);
        console.log('weightInKG', weightInKG);
        console.log('heightInCM', heightInCM);
        if (+bmi >= 18.5 && +bmi <= 25) {
            console.log('step 1');
            if (+ageInYears >= 9 && +ageInYears <= 18) {
                if (gender === 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.13;
                    }
                    else if (activity === 'high') {
                        pal = 1.26;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.42;
                    }
                    //113.5 - 61.9*age (years) + PAL * (26.7 * weight (kg) + 903 * height (m)), where PAL = 1 if sedentary, 1.13 if low active, 1.26 if active, and 1.42 if very active.
                    totalCaloriesNeeded =
                        113.5 -
                            61.9 * Number(ageInYears) +
                            Number(pal) * (26.7 * Number(weightInKG) + 903 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender === 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.16;
                    }
                    else if (activity === 'high') {
                        pal = 1.31;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.48;
                    }
                    //160.3 - 30.8*age (years) + PAL * (10 * weight (kg) + 934 * height (m)), where PAL = 1 if sedentary, 1.16 if low active, 1.31 if active, and 1.56 if very active.
                    totalCaloriesNeeded =
                        160.3 -
                            30.8 * Number(ageInYears) +
                            Number(pal) * (10 * Number(weightInKG) + 934 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
            else if (+ageInYears >= 19) {
                if (gender == 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.11;
                    }
                    else if (activity === 'high') {
                        pal = 1.25;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.48;
                    }
                    //661.8 - 9.53*age (years) + PAL*(15.91* weight (kg) + 539.6* height (m)), where PAL = 1 if sedentary, 1.11 if low active, 1.25 if active, and 1.48 if very active.
                    totalCaloriesNeeded =
                        661.8 -
                            9.53 * Number(ageInYears) +
                            Number(pal) * (15.91 * Number(weightInKG) + 539.6 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender == 'female') {
                    console.log('step 2');
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        console.log('step 3');
                        pal = 1.27;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //354.1 - 6.91*age (years) + PAL*(9.36* weight (kg) + 726* height (m)), where PAL = 1 if sedentary, 1.12 if low active, 1.27 if active, and 1.45 if very active.
                    totalCaloriesNeeded =
                        354.1 -
                            6.91 * Number(ageInYears) +
                            Number(pal) * (9.36 * Number(weightInKG) + 726 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
        }
        else if (+bmi > 25) {
            if (+ageInYears >= 9 && +ageInYears <= 18) {
                if (gender === 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //-114.1-50.9*age (years) + PAL * (19.5*weight (kg) + 1161.4*height (m)), where PAL = 1 if sedentary, 1.12 if low active, 1.24 if active, and 1.45 if very active
                    totalCaloriesNeeded =
                        -114.1 -
                            50.9 * Number(ageInYears) +
                            Number(pal) * (19.5 * Number(weightInKG) + 1161.4 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender == 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //389.2 - 41.2*age (years) + PAL * (15 * weight (kg) + 701.6 * height (m)), where PAL = 1 if sedentary, 1.18 if low active, 1.35 if active, and 1.60 if very active
                    totalCaloriesNeeded =
                        389.2 -
                            41.2 * Number(ageInYears) +
                            Number(pal) * (15 * Number(weightInKG) + 701.6 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
            else if (+ageInYears >= 19) {
                if (gender === 'male') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //1085.6 - 10.08*age (years) + PAL*(13.7* weight (kg) + 416* height (m)), where PAL = 1 if sedentary, 1.12 if low active, 1.29 if active and 1.59 if very active.
                    totalCaloriesNeeded =
                        1085.6 -
                            10.08 * Number(ageInYears) +
                            Number(pal) * (13.7 * Number(weightInKG) + 416 * heightInMeters);
                    return totalCaloriesNeeded;
                }
                else if (gender === 'female') {
                    let pal;
                    if (activity === 'low') {
                        pal = 1;
                    }
                    else if (activity === 'moderate') {
                        pal = 1.12;
                    }
                    else if (activity === 'high') {
                        pal = 1.24;
                    }
                    else if (activity === 'extreme') {
                        pal = 1.45;
                    }
                    //447.6 - 7.95*age (years) + PAL*(11.4* weight (kg) + 619* height (m)), where PAL = 1 if sedentary, 1.16 if low active, 1.27 if active and 1.44 if very active.
                    totalCaloriesNeeded =
                        445.6 -
                            7.95 * Number(ageInYears) +
                            Number(pal) * (11.4 * Number(weightInKG) + 619 * heightInMeters);
                    return totalCaloriesNeeded;
                }
            }
        }
        else {
            return 3134;
        }
    }
    async getParentChild(data) {
        let blendNutrientCategories = await blendNutrientCategory_1.default.find({
            $ne: { _id: new mongoose_1.default.mongo.ObjectId('6203a9061c100bd226c13c65') },
        }).select('_id categoryName');
        let obj = {};
        for (let i = 0; i < blendNutrientCategories.length; i++) {
            obj[blendNutrientCategories[i].categoryName] =
                await this.getTopLevelChildsxxx(blendNutrientCategories[i]._id, data);
        }
        return obj;
    }
    async getTopLevelChildsxxx(category, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({
            category: category,
            parentIsCategory: true,
        })
            .lean()
            .select('_id nutrientName category altName');
        let populatedChild = childs.map((child) => {
            let data = returnNutrients.filter((rn) => String(rn.blendNutrientRef) === String(child._id))[0];
            if (!data) {
                data = {
                    nutrientName: child.nutrientName,
                    nutrientCategory: child.category,
                    data: {},
                    blendNutrientRef: child._id,
                    active: false,
                };
            }
            else {
                data.active = true;
            }
            return data;
        });
        let populatedChild2 = populatedChild;
        for (let i = 0; i < populatedChild2.length; i++) {
            let name = populatedChild2[i].nutrientName;
            obj[name.toLowerCase()] = populatedChild2[i];
            obj[name.toLowerCase()].childs = await this.getChildxxx(populatedChild2[i].blendNutrientRef, returnNutrients);
        }
        return obj;
    }
    async getChildxxx(parent, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({ parent: parent })
            .lean()
            .select('_id nutrientName altName');
        if (childs.length === 0) {
            return null;
        }
        for (let i = 0; i < childs.length; i++) {
            let ek = returnNutrients.filter((rn) => String(rn.blendNutrientRef) === String(childs[i]._id))[0];
            let name = childs[i].nutrientName;
            if (!ek) {
                obj[name.toLowerCase()] = {
                    nutrientName: childs[i].nutrientName,
                    nutrientCategory: childs[i].category,
                    data: {},
                    blendNutrientRef: childs[i]._id,
                    active: false,
                };
                childs[i] = obj[name.toLowerCase()];
            }
            else {
                ek.active = true;
                childs[i] = ek;
            }
            childs[i].childs = await this.getChildxxx(childs[i].blendNutrientRef, returnNutrients);
            let name2 = childs[i].nutrientName;
            obj[name2.toLowerCase()] = childs[i];
        }
        return obj;
    }
    async getShowPercentageDaily() { }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewDaily_1.default]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "createNewDaily", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditDaily_1.default]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "EditADaily", null);
__decorate([
    (0, type_graphql_1.Query)(() => [PopulatedDaily_1.default]) //admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getAllDailys", null);
__decorate([
    (0, type_graphql_1.Query)(() => DailyWithRanges_1.default) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getASingleDaily", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RangeType_1.default]) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getRangesForADaily", null);
__decorate([
    (0, type_graphql_1.Query)(() => RangeType_1.default) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __param(1, (0, type_graphql_1.Arg)('rangeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getASingleRange", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __param(1, (0, type_graphql_1.Arg)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Range_1.default]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "addRangeToDaily", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __param(1, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EditRange_1.default]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "editARange", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "removeADaily", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('dailyId')),
    __param(1, (0, type_graphql_1.Arg)('rangeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "removeARangeFromDaily", null);
__decorate([
    (0, type_graphql_1.Query)(() => GetDaily_1.default) //client
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDailyByUserId", null);
__decorate([
    __param(0, (0, type_graphql_1.Arg)('isAgeInMonth')),
    __param(1, (0, type_graphql_1.Arg)('ageInNumber')),
    __param(2, (0, type_graphql_1.Arg)('activity')),
    __param(3, (0, type_graphql_1.Arg)('gender')),
    __param(4, (0, type_graphql_1.Arg)('weightInKG')),
    __param(5, (0, type_graphql_1.Arg)('heightInCM')),
    __param(6, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean,
        Number,
        String,
        String,
        Number,
        Number,
        String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDaily", null);
__decorate([
    __param(0, (0, type_graphql_1.Arg)('ageInNumber')),
    __param(1, (0, type_graphql_1.Arg)('calories')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number,
        Number,
        String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDailyNutrition", null);
__decorate([
    __param(0, (0, type_graphql_1.Arg)('ranges')),
    __param(1, (0, type_graphql_1.Arg)('ageInNumber')),
    __param(2, (0, type_graphql_1.Arg)('calories')),
    __param(3, (0, type_graphql_1.Arg)('unit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Number,
        Number,
        String]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDataFromRanges", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('weightInKG')),
    __param(1, (0, type_graphql_1.Arg)('heightInCM')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "bmiCalculation", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('activity')),
    __param(1, (0, type_graphql_1.Arg)('ageInYears')),
    __param(2, (0, type_graphql_1.Arg)('bmi')),
    __param(3, (0, type_graphql_1.Arg)('gender')),
    __param(4, (0, type_graphql_1.Arg)('weightInKG')),
    __param(5, (0, type_graphql_1.Arg)('heightInCM')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Number,
        Number,
        String,
        Number,
        Number]),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getDailyCalorie", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserDailyResolver.prototype, "getShowPercentageDaily", null);
UserDailyResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserDailyResolver);
exports.default = UserDailyResolver;
// @Field()
// nutrientName: String;
// @Field()
// ageInMonth: Boolean;
// @Field()
// ageInRange: Boolean;
// @Field()
// dailyPercentage: Boolean;
// @Field()
// dailyPercentageInRange: Boolean;
// @Field()
// range: Range;
