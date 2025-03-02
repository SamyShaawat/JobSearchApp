import { buildSchema } from "graphql";
import userModel from "../DB/models/user.model.js";
import companyModel from "../DB/models/company.model.js";


export const schema = buildSchema(`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    gender: String
    mobileNumber: String
    role: String
    isConfirmed: Boolean
    bannedAt: String
    deletedAt: String
  }

  type Company {
    _id: ID
    companyName: String
    description: String
    industry: String
    address: String
    numberOfEmployees: Int
    companyEmail: String
    bannedAt: String
    deletedAt: String
    approvedByAdmin: Boolean
  }

  type Query {
    users: [User]
    companies: [Company]
  }
`);

export const rootValue = {
    users: async () => {
        return await userModel.find({});
    },
    companies: async () => {
        return await companyModel.find({});
    }
};
