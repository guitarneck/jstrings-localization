"use strict";

const assert        = require('assert');
const Localization  = require('../lib/Localization.cls.js');

try {
    require('./test-localization.js')(Localization ,assert);
} catch (e) { console.log(e) }