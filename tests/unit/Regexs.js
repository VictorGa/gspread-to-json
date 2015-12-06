'use strict';

import {expect, assert} from 'chai';
import Regexs from '../../develop/src/Regexs';
import RegexNames from '../../develop/src/RegexNames';

describe('gspread', () => {
    describe('Regexs', function () {

        beforeEach(function () {
        });

        it('every regex should be a valid regex', function (done) {
            Object.keys(Regexs).forEach(key => {
                assert.equal(Regexs[key].regex instanceof RegExp, true);
                assert.equal(typeof Regexs[key].parser === 'function', true);
            });
            done();
        });

        it('every regex should have a parser', function (done) {
            Object.keys(Regexs).forEach(key => {
                assert.equal(typeof Regexs[key].parser === 'function', true);
            });
            done();
        });

        it('every regex should have a regex name', function (done) {
            Object.keys(RegexNames).forEach(key => {
                assert.equal(typeof Regexs[RegexNames[key]] !== 'undefined', true);
            });
            done();
        });
    });
});
