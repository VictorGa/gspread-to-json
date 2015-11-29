'use strict';

import {expect} from 'chai';
import Parsers from '../../develop/src/Parsers';

describe('gspread', () => {
    describe('Parsers', function () {
        let parserInstance;

        beforeEach(function () {
            parserInstance = Parsers;
        });

        it('should parse array', function (done) {
            expect(parserInstance.toArray('[1,2,3]')).to.be.an('array');
            done();
        });

        it('should camelize', function (done) {
            expect(parserInstance.camelize('hello-world')).to.equal('helloWorld');
            done();
        });

        it('should clean spaces', function (done) {
            expect(parserInstance.cleanSpaces('hello world')).to.equal('helloworld');
            done();
        });

        it('should clean locale', function (done) {
            expect(parserInstance.cleanLocale('test-locale-en')).to.equal('test');
            done();
        });
    });
});
