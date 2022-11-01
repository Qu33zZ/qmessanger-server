import { User as UserModel } from "@prisma/client";

export interface IFilesService{
   deleteOldFile(filename:string):Promise<void>;
}