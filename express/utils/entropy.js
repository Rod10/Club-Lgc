/* do not add any require as this file is used in react */

/* some helper */
/* eslint-disable camelcase */
const char_a = "a".charCodeAt(0);
const char_z = "z".charCodeAt(0);
const char_A = "A".charCodeAt(0);
const char_Z = "Z".charCodeAt(0);
const char_0 = "0".charCodeAt(0);
const char_9 = "9".charCodeAt(0);
const char_space = " ".charCodeAt(0);
const char_tilde = "~".charCodeAt(0);
const isLowercase = charcode => charcode >= char_a && charcode <= char_z;
const isUppercase = charcode => charcode >= char_A && charcode <= char_Z;
const isNumber = charcode => charcode >= char_0 && charcode <= char_9;
const isPrintable = charcode => charcode >= char_space && charcode <= char_tilde;
/* eslint-enable camelcase */

/* entropy to score values */
const STRONG = 70;
const MILD = 50;
const WEAK = 30;
const SUPER_WEAK = 10;

const getEntropy = str => {
  let range = 0;
  const has = {
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  };
  const tests = [
    {fn: isLowercase, key: "lowercase", rangeLength: 26},
    {fn: isUppercase, key: "uppercase", rangeLength: 26},
    {fn: isNumber, key: "number", rangeLength: 10},
    {fn: isPrintable, key: "special", rangeLength: 30},
  ];
  for (let i = 0; i < str.length; i++) {
    const charcode = str.charCodeAt(i);
    for (const test of tests) {
      if (test.fn(charcode)) {
        if (!has[test.key]) {
          has[test.key] = true;
          range += test.rangeLength;
        }
        break;
      }
    }
  }
  return Math.floor(str.length * Math.log2(range));
};

const getScore = str => {
  const entropy = getEntropy(str);
  let score = 0;
  /* eslint-disable no-magic-numbers */
  if (entropy > STRONG) score = 4;
  else if (entropy > MILD) score = 3;
  else if (entropy > WEAK) score = 2;
  else if (entropy > SUPER_WEAK) score = 1;
  /* eslint-enable no-magic-numbers */
  return score;
};

module.exports = {
  getEntropy,
  getScore,
};
