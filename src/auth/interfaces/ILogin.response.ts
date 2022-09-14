import { User as UserModel, Session as SessionModel } from "@prisma/client";

export interface ILoginResponse {
	user: UserModel;
	session: SessionModel;
}
