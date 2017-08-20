const chai = require('chai');
const tokenFn = require('./../create-decode-token');

const should = chai.should();

describe('createToken()', () => {
    it('should return a token', (done) => {
        const token = tokenFn.createToken({id: 1, name: 'Edwin'});
        should.exist(token);
        token.should.be.a('string');
        done();
    });
});