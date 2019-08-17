import { Controller, Get } from 'routing-controllers';

@Controller()
export class APIController {
	
	@Get('/')
	greetUser() {
		return 'Welcome to V1 of HLPugs.tf API :)';
	}
}