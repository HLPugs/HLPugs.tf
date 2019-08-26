import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { DiscordService } from '../services/DiscordService';
const expect = chai.expect;

describe('postToDiscord', () => {
	before(() => {
		chai.use(chaiAsPromised);
	});

	it('should post a non-fancy message to a Discord channel', () => {
		expect(
			DiscordService.postToDiscord('Test', 'site-status')
		).to.eventually.equal('successful');
	});

	it('should fail when a wrong webhook is passed', () => {
		expect(
			DiscordService.postToDiscord(
				'a random message',
				'Non-existent channel name'
			)
		).to.eventually.be.rejected;
	});
});
