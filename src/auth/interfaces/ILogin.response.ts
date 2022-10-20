import { Session as SessionModel, User as UserModel } from "@prisma/client";

export interface ILoginResponse {
	user: UserModel;
	session: SessionModel;
}
