import "dotenv/config";

export const NODEMAILER_CONFIG = {
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD
	},
	ports:465,
	host:"smtp.gmail.com"
}

