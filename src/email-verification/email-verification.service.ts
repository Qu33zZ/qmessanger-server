import { HttpCode, HttpException, HttpStatus, Injectable, Provider } from "@nestjs/common";
import { ServicesInjectTokens } from "../services.inject.tokens";
import { IEmailVerificationService } from "./interfaces/IEmail.verification.service";
import { createTransport } from "nodemailer";
import { NODEMAILER_CONFIG } from "../nodemailer.config";
import "dotenv/config";

@Injectable()
export class EmailVerificationService implements IEmailVerificationService{
	async sendMessage(code: string, email: string): Promise<any> {
		const message = {
			from:process.env.GMAIL_USER,
			to:email,
			subject:`QMessanger verification code is ${code}`,
			html:`
				<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <meta http-equiv="X-UA-Compatible" content="IE=edge">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Document</title>
		    <link rel="preconnect" href="https://fonts.googleapis.com">
		    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap" rel="stylesheet">
			    <style>
			        /*Обнуление*/
			        *{
			            padding: 0;
			            margin: 0;
			            border: 0;
			        }
			        nav,footer,header,aside{display: block;}
			    
			        html,body{
			            width: 100vw;
			            height: 100vh;
			            line-height: 1;
			            font-size: 14px;
			            -ms-text-size-adjust: 100%;
			            -moz-text-size-adjust: 100%;
			            -webkit-text-size-adjust: 100%;
			        }
			    
			        a, a:visited{text-decoration: none;}
			        a:hover{text-decoration: none;}
			        ul li{list-style: none;}
			    
			        h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight: 400;}
			    
			    
			        body{
			            width: 100%;
			            background-color: #0F1828;
			        }
			        header{
			            width: 100%;
			            height: 100px;
			            display: flex;
			            align-items: center;
			            justify-content: space-around;
			        }
			        header h1{
			            font-family: Mulish;
			            color: white;
			            font-size: 36px;
			            font-weight: bold;
			        }
			        #code-block{
			            display: flex;
			            width: fit-content;
			            flex-direction: column;
			            margin: 12% auto 0 auto;
			            font-family: Mulish;
			        }
			        #login-code-description{
			            font-size: 20px;
			            font-weight: 500;
			            color: #ADB5BD;
			        }
			        #code{
			            font-size: 26px;
			            font-weight: bold;
			            color:white;
			            margin: 15px auto 0 auto;
			        }
			    </style>
			</head>
			<body>
			    <header>
			        <h1>QMessanger verification</h1>
			    </header>
			    <div id="code-block">
			        <p id="login-code-description">Your login verification code for QMessanger:</p>
			        <h2 id="code">${code}</h2>
			    </div>
			</body>
			</html>
			`
		};

		const transport = createTransport(NODEMAILER_CONFIG);
		transport.sendMail(message,(err) => {
			throw new HttpException(
				{
					message:"Unable to send email"
				},
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		})
	}
}


export const EmailEmailVerificationServiceProvider:Provider={
	provide:ServicesInjectTokens.EmailVerificationService,
	useClass:EmailVerificationService
};