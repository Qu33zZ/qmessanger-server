import { ILoginDTO } from "./ILogin.dto";
import { ILoginResponse } from "./ILogin.response";

export interface IAuthService {
	login(loginDTO: ILoginDTO): Promise<ILoginResponse>;
	logout(sessionId: string): Promise<any>;
}
