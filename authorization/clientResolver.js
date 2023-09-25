// import { Arg, Mutation, Query, Resolver } from 'type-graphql';
// import NewClientInput from './inputType/CreateNewClientInput';
// import Client from '../schemas/Client';
// import ClientModel from '../../../models/client';
// import EditClient from './inputType/EditClient';
// import CategoryModel from '../../../models/categoryModel';
// import CategoryAndClient from '../schemas/CategoryAndClient';
// import testMail from '../../../utils/sendClientEmail';
// @Resolver()
// export default class ClientResolver {
//   @Mutation(() => Client)
//   async addNewClient(@Arg('data') data: NewClientInput) {
//     const client = await ClientModel.create(data);
//     return client;
//   }
//   @Query(() => Client)
//   async findClientById(@Arg('clientId') clientId: String) {
//     const client: any = await ClientModel.findById(clientId);
//     let returnClient: any = client;
//     returnClient.populatedRelatedCategory = await CategoryModel.findOne({
//       id: returnClient.relatedCategory,
//     });
//     return returnClient;
//   }
//   @Query(() => [Client])
//   async getAllFeaturedClients() {
//     const clients: any = await ClientModel.find();
//     const featuredClients = [];
//     for (let i = 0; i < clients.length; i++) {
//       console.log(clients[i].isFeatured);
//       if (clients[i].isFeatured) {
//         featuredClients.push(clients[i]);
//       }
//     }
//     return featuredClients;
//   }
//   @Query(() => [CategoryAndClient])
//   async getClientsByClientCategory() {
//     const clients: any = await ClientModel.find()
//       .select('categories')
//       .sort({ isFeatured: 1 });
//     let categoriesNames = [];
//     for (let i = 0; i < clients.length; i++) {
//       for (let j = 0; j < clients[i].categories.length; j++) {
//         categoriesNames.push(clients[i].categories[j]);
//       }
//     }
//     categoriesNames = [...new Set(categoriesNames)];
//     let categoryAndClients = [];
//     for (let i = 0; i < categoriesNames.length; i++) {
//       let clients = await ClientModel.find()
//         .where('categories')
//         .in(categoriesNames[i])
//         .sort({ isFeatured: -1 });
//       categoryAndClients.push({
//         categoryName: categoriesNames[i],
//         clients: clients,
//       });
//     }
//     return categoryAndClients;
//   }
//   @Mutation(() => String)
//   async RemoveClientById(@Arg('clientId') clientId: String) {
//     await ClientModel.findByIdAndDelete(clientId);
//     return 'success';
//   }
//   @Mutation(() => String)
//   async EditClientById(@Arg('data') data: EditClient) {
//     await ClientModel.findByIdAndUpdate(data.editId, data.editableObject);
//     return 'success';
//   }
//   @Query(() => [Client])
//   async getAllClients() {
//     const clients: any = await ClientModel.find();
//     return clients;
//   }
//   @Query(() => String)
//   async sendTestEmail() {
//     testMail();
//     return 'success';
//   }
// }
