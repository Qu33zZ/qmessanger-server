import { DynamicModule, Module } from '@nestjs/common';
import { FilesService, FilesServiceProvider } from './files.service';
import { IFilesServiceConfig } from './interfaces/ifiles.service.config';

@Module({})
export class FilesModule {
  static forRoot(config:IFilesServiceConfig):DynamicModule{
    console.log(config)
    return {
      module:FilesModule,
      providers:[
        {
          provide:"FilesServiceConfig",
          useValue:config
        },
        FilesServiceProvider
      ],
      exports:[FilesServiceProvider]
    };
  }
}
