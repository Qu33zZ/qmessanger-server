import { Inject, Injectable, Provider } from '@nestjs/common';
import {resolve} from 'path';
import { IFilesService } from './interfaces/ifiles.service';
import { IFilesServiceConfig } from './interfaces/ifiles.service.config';
import * as fs from "fs";

@Injectable()
export class FilesService implements IFilesService{
    pathToDestinationFolder:string;
    
    constructor(@Inject("FilesServiceConfig") private config:IFilesServiceConfig){  
        const resolvedPath = resolve("uploads", config.module, config.submodule);
        this.pathToDestinationFolder = resolvedPath;

    };


    async deleteOldFile(filename:string):Promise<void>{
        const pathToFile = resolve(this.pathToDestinationFolder, filename);
        console.log(pathToFile);
        if (fs.existsSync(pathToFile)){ 
            fs.unlinkSync(pathToFile);
        }
    }
}


export const FilesServiceProvider:Provider = {
    provide:"FilesService",
    useClass:FilesService
}