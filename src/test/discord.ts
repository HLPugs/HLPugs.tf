import { postToDiscord } from '../modules';
import * as chai from 'chai';
import 'mocha';
import * as chaiAsPromised from 'chai-as-promised';

const expect = chai.expect;

describe('postToDiscord', () => {
  before(() => {
    chai.use(chaiAsPromised);
  });

  it('should post a non-fancy message to a Discord channel', () => {
    expect(postToDiscord('Test', 'site-status'))
        .to.eventually.equal('successful');
  });

  it('should fail when a wrong webhook is passed', () => {
    expect(postToDiscord('a random message', 'Non-existent channel name'))
        .to.eventually.be.rejected;
  });
});
