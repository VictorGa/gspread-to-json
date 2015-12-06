'use strict';

import {expect, assert} from 'chai';
import {default as Tokenizer, parse} from '../../develop/src/Tokenizer';

describe('gspread', () => {
    describe('Tokenizer', function () {
        let array = "[1, 3, 5]";
        let object = '{ "x": 0, "y": 2, "test": "hello"}';

        beforeEach(function () {
        });

        it('array should be a valid regex', function (done) {
            expect(parse(array)).to.be.an('array');
            done();
        });

        it('object should be a valid regex', function (done) {
            expect(parse(object)).to.be.an('object');
            done();
        });
    });
});
