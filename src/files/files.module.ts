import { DynamicModule, Module } from '@nestjs/common';
import {  FilesServiceProvider } from './files.service';
import { IFilesServiceConfig } from './interfaces/ifiles.service.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';


@Module({})
export class FilesModule {
  static forRoot(config:IFilesServiceConfig):DynamicModule{
	return {
	  module:FilesModule,
	  providers:[
		{
		  provide:"FilesServiceConfig",
		  useValue:config
		},
		FilesServiceProvider,
	  ],
	  imports:[
		ServeStaticModule.forRoot({
			rootPath:resolve("uploads"),
			serveRoot:"/static"
		  })
	  ],
	  exports:[FilesServiceProvider]
	};
  }
}
