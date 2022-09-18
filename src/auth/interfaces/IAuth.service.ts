import { ILoginDTO } from "./ILogin.dto";
import { ILoginResponse } from "./ILogin.response";

export interface IAuthService {
	login(loginDTO: ILoginDTO): Promise<void>;
	logout(sessionId: string): Promise<any>;
	confirmLogin(code:string, userId:string):Promise<ILoginResponse>;
}
