export interface ISmsService{
	sendMessage(text:string, phone:string):Promise<any>;
}