import * as chai           from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import db                  from '../database/db';

const expect = chai.expect;

describe('Database connection', () => {
  before(() => {
    chai.use(chaiAsPromised);
    chai.should();
  });

  it('should connect to the database', async() => {
    db.connect().should.be.fulfilled;
  });
});
