import { postToDiscord } from '../modules';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

describe('postToDiscord', () => {
  before(() => {
    chai.use(chaiAsPromised);
  });

  it('should post a non-fancy message to a Discord channel', async() => {
    expect(postToDiscord('a regular test message', 'site-status'))
        .to.eventually.equal('successful');
  });
  it('should post a fancy message to a Discord channel', async() => {
    expect(postToDiscord('a fancy test message', 'site-status', true))
        .to.eventually.equal('successful');
  });
  it('should fail when a wrong webhook is passed', async() => {
    expect(postToDiscord('a random message', 'Non-existent channel name'))
        .to.eventually.be.rejected;
  });
});
