import { postToDiscord } from '../modules';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
const expect = chai.expect;

describe('postToDiscord', () => {
  before(() => {
    chai.use(chaiAsPromised);
  });

  it('should post a non-fancy message to a Discord channel', () => {
    expect(postToDiscord('a regular test message', 'site-status'))
        .to.eventually.equal('successful');
  });
  it('should post a fancy message to a Discord channel', () => {
    expect(postToDiscord('a fancy test message', 'site-status', true))
        .to.eventually.equal('successful');
  });
  it('should fail when a wrong webhook is passed', () => {
    expect(postToDiscord('a random message', 'Non-existent channel name'))
        .to.eventually.be.rejected;
  });
});
