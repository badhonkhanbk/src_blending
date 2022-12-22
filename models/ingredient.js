"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ingredientSchema = new mongoose_1.Schema({
    refDatabaseId: String,
    ingredientId: String,
    ingredientName: String,
    category: String,
    blendStatus: String,
    classType: String,
    source: String,
    description: String,
    sourceId: String,
    sourceCategory: String,
    publication_date: String,
    nutrients: [
        {
            value: String,
            sourceId: String,
            uniqueNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'UniqueNutrient',
            },
        },
    ],
    portions: [
        {
            measurement: String,
            measurement2: String,
            meausermentWeight: String,
            default: Boolean,
            sourceId: String,
        },
    ],
    featuredImage: String,
    images: [String],
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    addedToBlend: Boolean,
    new: Boolean,
    new2: Boolean,
    nutrientCount: Number,
    portionCount: Number,
});
const Ingredient = (0, mongoose_1.model)('Ingredient', ingredientSchema);
exports.default = Ingredient;
// {
//   "refDatabaseId": "",
//   "ingredientName": "Abiyuch",
//   "id": "",
//   "category": "",
//   "blendStatus": "Review",
//   "classType": "",
//   "source": "usda-legacy",
//   "description": "Abiyuch, raw",
//   "sourceId": "9427",
//   "sourceCategory": "Abiyuch, raw",
//   "publication_date": "2019-04-01",
//   "nutrients": [
//       {
//           "nutrient": "Vitamin A, IU",
//           "category": "",
//           "value": "100",
//           "sourceId": _id,
//           "unitName": "String",
//           "parentNutrient": ,
//           "min": "",
//           "rank": "",
//           "publication_date": "2019-04-01"
//           "refDatabaseId": "",
//           "related_sources": [{
//             "source": "usda-legacy",
//             "sourceId": "9427",
//             "sourceNutrientName": "Abiyuch, raw",
//             "units": "IU",
//           }]
//       },
// ]
//   "portions": [
//       {
//           "measurement": "0.5 undetermined",
//           "measuredWeight": "114 gm",
//           "refDatabaseId": "",
//       }
//   ],
//   "featuredImage": "",
//   "images": [
//       "/images/product-img.jpg",
//       "/images/user-img.jpg"
//   ]
// }
