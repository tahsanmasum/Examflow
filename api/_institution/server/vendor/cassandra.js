var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/cassandra-driver/node_modules/long/umd/index.js
var require_umd = __commonJS({
  "node_modules/cassandra-driver/node_modules/long/umd/index.js"(exports2, module2) {
    var Long = function(exports3) {
      "use strict";
      Object.defineProperty(exports3, "__esModule", {
        value: !0
      }), exports3.default = void 0;
      var wasm = null;
      try {
        wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
      } catch {
      }
      function Long2(low, high, unsigned) {
        this.low = low | 0, this.high = high | 0, this.unsigned = !!unsigned;
      }
      Long2.prototype.__isLong__, Object.defineProperty(Long2.prototype, "__isLong__", {
        value: !0
      });
      function isLong(obj) {
        return (obj && obj.__isLong__) === !0;
      }
      function ctz32(value) {
        var c = Math.clz32(value & -value);
        return value ? 31 - c : c;
      }
      Long2.isLong = isLong;
      var INT_CACHE = {}, UINT_CACHE = {};
      function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        return unsigned ? (value >>>= 0, (cache = 0 <= value && value < 256) && (cachedObj = UINT_CACHE[value], cachedObj) ? cachedObj : (obj = fromBits(value, 0, !0), cache && (UINT_CACHE[value] = obj), obj)) : (value |= 0, (cache = -128 <= value && value < 128) && (cachedObj = INT_CACHE[value], cachedObj) ? cachedObj : (obj = fromBits(value, value < 0 ? -1 : 0, !1), cache && (INT_CACHE[value] = obj), obj));
      }
      Long2.fromInt = fromInt;
      function fromNumber(value, unsigned) {
        if (isNaN(value)) return unsigned ? UZERO : ZERO;
        if (unsigned) {
          if (value < 0) return UZERO;
          if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
        } else {
          if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
          if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
        }
        return value < 0 ? fromNumber(-value, unsigned).neg() : fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
      }
      Long2.fromNumber = fromNumber;
      function fromBits(lowBits, highBits, unsigned) {
        return new Long2(lowBits, highBits, unsigned);
      }
      Long2.fromBits = fromBits;
      var pow_dbl = Math.pow;
      function fromString(str, unsigned, radix) {
        if (str.length === 0) throw Error("empty string");
        if (typeof unsigned == "number" ? (radix = unsigned, unsigned = !1) : unsigned = !!unsigned, str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return unsigned ? UZERO : ZERO;
        if (radix = radix || 10, radix < 2 || 36 < radix) throw RangeError("radix");
        var p;
        if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
        if (p === 0)
          return fromString(str.substring(1), unsigned, radix).neg();
        for (var radixToPower = fromNumber(pow_dbl(radix, 8)), result = ZERO, i = 0; i < str.length; i += 8) {
          var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
          if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
          } else
            result = result.mul(radixToPower), result = result.add(fromNumber(value));
        }
        return result.unsigned = unsigned, result;
      }
      Long2.fromString = fromString;
      function fromValue(val, unsigned) {
        return typeof val == "number" ? fromNumber(val, unsigned) : typeof val == "string" ? fromString(val, unsigned) : fromBits(val.low, val.high, typeof unsigned == "boolean" ? unsigned : val.unsigned);
      }
      Long2.fromValue = fromValue;
      var TWO_PWR_16_DBL = 65536, TWO_PWR_24_DBL = 1 << 24, TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL, TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL, TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2, TWO_PWR_24 = fromInt(TWO_PWR_24_DBL), ZERO = fromInt(0);
      Long2.ZERO = ZERO;
      var UZERO = fromInt(0, !0);
      Long2.UZERO = UZERO;
      var ONE = fromInt(1);
      Long2.ONE = ONE;
      var UONE = fromInt(1, !0);
      Long2.UONE = UONE;
      var NEG_ONE = fromInt(-1);
      Long2.NEG_ONE = NEG_ONE;
      var MAX_VALUE = fromBits(-1, 2147483647, !1);
      Long2.MAX_VALUE = MAX_VALUE;
      var MAX_UNSIGNED_VALUE = fromBits(-1, -1, !0);
      Long2.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
      var MIN_VALUE = fromBits(0, -2147483648, !1);
      Long2.MIN_VALUE = MIN_VALUE;
      var LongPrototype = Long2.prototype;
      LongPrototype.toInt = function() {
        return this.unsigned ? this.low >>> 0 : this.low;
      }, LongPrototype.toNumber = function() {
        return this.unsigned ? (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0) : this.high * TWO_PWR_32_DBL + (this.low >>> 0);
      }, LongPrototype.toString = function(radix) {
        if (radix = radix || 10, radix < 2 || 36 < radix) throw RangeError("radix");
        if (this.isZero()) return "0";
        if (this.isNegative())
          if (this.eq(MIN_VALUE)) {
            var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
          } else return "-" + this.neg().toString(radix);
        for (var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this, result = ""; ; ) {
          var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
          if (rem = remDiv, rem.isZero()) return digits + result;
          for (; digits.length < 6; ) digits = "0" + digits;
          result = "" + digits + result;
        }
      }, LongPrototype.getHighBits = function() {
        return this.high;
      }, LongPrototype.getHighBitsUnsigned = function() {
        return this.high >>> 0;
      }, LongPrototype.getLowBits = function() {
        return this.low;
      }, LongPrototype.getLowBitsUnsigned = function() {
        return this.low >>> 0;
      }, LongPrototype.getNumBitsAbs = function() {
        if (this.isNegative())
          return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        for (var val = this.high != 0 ? this.high : this.low, bit = 31; bit > 0 && !(val & 1 << bit); bit--) ;
        return this.high != 0 ? bit + 33 : bit + 1;
      }, LongPrototype.isZero = function() {
        return this.high === 0 && this.low === 0;
      }, LongPrototype.eqz = LongPrototype.isZero, LongPrototype.isNegative = function() {
        return !this.unsigned && this.high < 0;
      }, LongPrototype.isPositive = function() {
        return this.unsigned || this.high >= 0;
      }, LongPrototype.isOdd = function() {
        return (this.low & 1) === 1;
      }, LongPrototype.isEven = function() {
        return (this.low & 1) === 0;
      }, LongPrototype.equals = function(other) {
        return isLong(other) || (other = fromValue(other)), this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1 ? !1 : this.high === other.high && this.low === other.low;
      }, LongPrototype.eq = LongPrototype.equals, LongPrototype.notEquals = function(other) {
        return !this.eq(
          /* validates */
          other
        );
      }, LongPrototype.neq = LongPrototype.notEquals, LongPrototype.ne = LongPrototype.notEquals, LongPrototype.lessThan = function(other) {
        return this.comp(
          /* validates */
          other
        ) < 0;
      }, LongPrototype.lt = LongPrototype.lessThan, LongPrototype.lessThanOrEqual = function(other) {
        return this.comp(
          /* validates */
          other
        ) <= 0;
      }, LongPrototype.lte = LongPrototype.lessThanOrEqual, LongPrototype.le = LongPrototype.lessThanOrEqual, LongPrototype.greaterThan = function(other) {
        return this.comp(
          /* validates */
          other
        ) > 0;
      }, LongPrototype.gt = LongPrototype.greaterThan, LongPrototype.greaterThanOrEqual = function(other) {
        return this.comp(
          /* validates */
          other
        ) >= 0;
      }, LongPrototype.gte = LongPrototype.greaterThanOrEqual, LongPrototype.ge = LongPrototype.greaterThanOrEqual, LongPrototype.compare = function(other) {
        if (isLong(other) || (other = fromValue(other)), this.eq(other)) return 0;
        var thisNeg = this.isNegative(), otherNeg = other.isNegative();
        return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : this.unsigned ? other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(other).isNegative() ? -1 : 1;
      }, LongPrototype.comp = LongPrototype.compare, LongPrototype.negate = function() {
        return !this.unsigned && this.eq(MIN_VALUE) ? MIN_VALUE : this.not().add(ONE);
      }, LongPrototype.neg = LongPrototype.negate, LongPrototype.add = function(addend) {
        isLong(addend) || (addend = fromValue(addend));
        var a48 = this.high >>> 16, a32 = this.high & 65535, a16 = this.low >>> 16, a00 = this.low & 65535, b48 = addend.high >>> 16, b32 = addend.high & 65535, b16 = addend.low >>> 16, b00 = addend.low & 65535, c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        return c00 += a00 + b00, c16 += c00 >>> 16, c00 &= 65535, c16 += a16 + b16, c32 += c16 >>> 16, c16 &= 65535, c32 += a32 + b32, c48 += c32 >>> 16, c32 &= 65535, c48 += a48 + b48, c48 &= 65535, fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
      }, LongPrototype.subtract = function(subtrahend) {
        return isLong(subtrahend) || (subtrahend = fromValue(subtrahend)), this.add(subtrahend.neg());
      }, LongPrototype.sub = LongPrototype.subtract, LongPrototype.multiply = function(multiplier) {
        if (this.isZero()) return this;
        if (isLong(multiplier) || (multiplier = fromValue(multiplier)), wasm) {
          var low = wasm.mul(this.low, this.high, multiplier.low, multiplier.high);
          return fromBits(low, wasm.get_high(), this.unsigned);
        }
        if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
        if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
        if (this.isNegative())
          return multiplier.isNegative() ? this.neg().mul(multiplier.neg()) : this.neg().mul(multiplier).neg();
        if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
        var a48 = this.high >>> 16, a32 = this.high & 65535, a16 = this.low >>> 16, a00 = this.low & 65535, b48 = multiplier.high >>> 16, b32 = multiplier.high & 65535, b16 = multiplier.low >>> 16, b00 = multiplier.low & 65535, c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        return c00 += a00 * b00, c16 += c00 >>> 16, c00 &= 65535, c16 += a16 * b00, c32 += c16 >>> 16, c16 &= 65535, c16 += a00 * b16, c32 += c16 >>> 16, c16 &= 65535, c32 += a32 * b00, c48 += c32 >>> 16, c32 &= 65535, c32 += a16 * b16, c48 += c32 >>> 16, c32 &= 65535, c32 += a00 * b32, c48 += c32 >>> 16, c32 &= 65535, c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48, c48 &= 65535, fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
      }, LongPrototype.mul = LongPrototype.multiply, LongPrototype.divide = function(divisor) {
        if (isLong(divisor) || (divisor = fromValue(divisor)), divisor.isZero()) throw Error("division by zero");
        if (wasm) {
          if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1)
            return this;
          var low = (this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high);
          return fromBits(low, wasm.get_high(), this.unsigned);
        }
        if (this.isZero()) return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (this.unsigned) {
          if (divisor.unsigned || (divisor = divisor.toUnsigned()), divisor.gt(this)) return UZERO;
          if (divisor.gt(this.shru(1)))
            return UONE;
          res = UZERO;
        } else {
          if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE;
            if (divisor.eq(MIN_VALUE)) return ONE;
            var halfThis = this.shr(1);
            return approx = halfThis.div(divisor).shl(1), approx.eq(ZERO) ? divisor.isNegative() ? ONE : NEG_ONE : (rem = this.sub(divisor.mul(approx)), res = approx.add(rem.div(divisor)), res);
          } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
          if (this.isNegative())
            return divisor.isNegative() ? this.neg().div(divisor.neg()) : this.neg().div(divisor).neg();
          if (divisor.isNegative()) return this.div(divisor.neg()).neg();
          res = ZERO;
        }
        for (rem = this; rem.gte(divisor); ) {
          approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
          for (var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor); approxRem.isNegative() || approxRem.gt(rem); )
            approx -= delta, approxRes = fromNumber(approx, this.unsigned), approxRem = approxRes.mul(divisor);
          approxRes.isZero() && (approxRes = ONE), res = res.add(approxRes), rem = rem.sub(approxRem);
        }
        return res;
      }, LongPrototype.div = LongPrototype.divide, LongPrototype.modulo = function(divisor) {
        if (isLong(divisor) || (divisor = fromValue(divisor)), wasm) {
          var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high);
          return fromBits(low, wasm.get_high(), this.unsigned);
        }
        return this.sub(this.div(divisor).mul(divisor));
      }, LongPrototype.mod = LongPrototype.modulo, LongPrototype.rem = LongPrototype.modulo, LongPrototype.not = function() {
        return fromBits(~this.low, ~this.high, this.unsigned);
      }, LongPrototype.countLeadingZeros = function() {
        return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
      }, LongPrototype.clz = LongPrototype.countLeadingZeros, LongPrototype.countTrailingZeros = function() {
        return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
      }, LongPrototype.ctz = LongPrototype.countTrailingZeros, LongPrototype.and = function(other) {
        return isLong(other) || (other = fromValue(other)), fromBits(this.low & other.low, this.high & other.high, this.unsigned);
      }, LongPrototype.or = function(other) {
        return isLong(other) || (other = fromValue(other)), fromBits(this.low | other.low, this.high | other.high, this.unsigned);
      }, LongPrototype.xor = function(other) {
        return isLong(other) || (other = fromValue(other)), fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
      }, LongPrototype.shiftLeft = function(numBits) {
        return isLong(numBits) && (numBits = numBits.toInt()), (numBits &= 63) === 0 ? this : numBits < 32 ? fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned) : fromBits(0, this.low << numBits - 32, this.unsigned);
      }, LongPrototype.shl = LongPrototype.shiftLeft, LongPrototype.shiftRight = function(numBits) {
        return isLong(numBits) && (numBits = numBits.toInt()), (numBits &= 63) === 0 ? this : numBits < 32 ? fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned) : fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
      }, LongPrototype.shr = LongPrototype.shiftRight, LongPrototype.shiftRightUnsigned = function(numBits) {
        return isLong(numBits) && (numBits = numBits.toInt()), (numBits &= 63) === 0 ? this : numBits < 32 ? fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned) : numBits === 32 ? fromBits(this.high, 0, this.unsigned) : fromBits(this.high >>> numBits - 32, 0, this.unsigned);
      }, LongPrototype.shru = LongPrototype.shiftRightUnsigned, LongPrototype.shr_u = LongPrototype.shiftRightUnsigned, LongPrototype.rotateLeft = function(numBits) {
        var b;
        return isLong(numBits) && (numBits = numBits.toInt()), (numBits &= 63) === 0 ? this : numBits === 32 ? fromBits(this.high, this.low, this.unsigned) : numBits < 32 ? (b = 32 - numBits, fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned)) : (numBits -= 32, b = 32 - numBits, fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned));
      }, LongPrototype.rotl = LongPrototype.rotateLeft, LongPrototype.rotateRight = function(numBits) {
        var b;
        return isLong(numBits) && (numBits = numBits.toInt()), (numBits &= 63) === 0 ? this : numBits === 32 ? fromBits(this.high, this.low, this.unsigned) : numBits < 32 ? (b = 32 - numBits, fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned)) : (numBits -= 32, b = 32 - numBits, fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned));
      }, LongPrototype.rotr = LongPrototype.rotateRight, LongPrototype.toSigned = function() {
        return this.unsigned ? fromBits(this.low, this.high, !1) : this;
      }, LongPrototype.toUnsigned = function() {
        return this.unsigned ? this : fromBits(this.low, this.high, !0);
      }, LongPrototype.toBytes = function(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
      }, LongPrototype.toBytesLE = function() {
        var hi = this.high, lo = this.low;
        return [lo & 255, lo >>> 8 & 255, lo >>> 16 & 255, lo >>> 24, hi & 255, hi >>> 8 & 255, hi >>> 16 & 255, hi >>> 24];
      }, LongPrototype.toBytesBE = function() {
        var hi = this.high, lo = this.low;
        return [hi >>> 24, hi >>> 16 & 255, hi >>> 8 & 255, hi & 255, lo >>> 24, lo >>> 16 & 255, lo >>> 8 & 255, lo & 255];
      }, Long2.fromBytes = function(bytes, unsigned, le) {
        return le ? Long2.fromBytesLE(bytes, unsigned) : Long2.fromBytesBE(bytes, unsigned);
      }, Long2.fromBytesLE = function(bytes, unsigned) {
        return new Long2(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
      }, Long2.fromBytesBE = function(bytes, unsigned) {
        return new Long2(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
      };
      var _default = Long2;
      return exports3.default = _default, "default" in exports3 ? exports3.default : exports3;
    }({});
    typeof define == "function" && define.amd ? define([], function() {
      return Long;
    }) : typeof module2 == "object" && typeof exports2 == "object" && (module2.exports = Long);
  }
});

// node_modules/cassandra-driver/lib/errors.js
var require_errors = __commonJS({
  "node_modules/cassandra-driver/lib/errors.js"(exports2) {
    "use strict";
    var util = require("util");
    function DriverError(message) {
      Error.call(this, message), Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.info = "Cassandra Driver Error", this.message = message;
    }
    util.inherits(DriverError, Error);
    function NoHostAvailableError(innerErrors, message) {
      if (DriverError.call(this, message), this.innerErrors = innerErrors, this.info = "Represents an error when a query cannot be performed because no host is available or could be reached by the driver.", !message && (this.message = "All host(s) tried for query failed.", innerErrors)) {
        let hostList = Object.keys(innerErrors);
        if (hostList.length > 0) {
          let host = hostList[0];
          this.message += util.format(" First host tried, %s: %s. See innerErrors.", host, innerErrors[host]);
        }
      }
    }
    util.inherits(NoHostAvailableError, DriverError);
    function ResponseError(code, message) {
      DriverError.call(this, message), this.code = code, this.info = "Represents an error message from the server";
    }
    util.inherits(ResponseError, DriverError);
    function DriverInternalError(message) {
      DriverError.call(this, message), this.info = "Represents a bug inside the driver or in a Cassandra host.";
    }
    util.inherits(DriverInternalError, DriverError);
    function AuthenticationError(message) {
      DriverError.call(this, message), this.info = "Represents an authentication error from the driver or from a Cassandra node.";
    }
    util.inherits(AuthenticationError, DriverError);
    function ArgumentError(message) {
      DriverError.call(this, message), this.info = "Represents an error that is raised when one of the arguments provided to a method is not valid.";
    }
    util.inherits(ArgumentError, DriverError);
    function OperationTimedOutError(message, host) {
      DriverError.call(this, message, this.constructor), this.info = "Represents a client-side error that is raised when the client did not hear back from the server within socketOptions.readTimeout", this.host = host;
    }
    util.inherits(OperationTimedOutError, DriverError);
    function NotSupportedError(message) {
      DriverError.call(this, message, this.constructor), this.info = "Represents a feature that is not supported in the driver or in the Cassandra version.";
    }
    util.inherits(NotSupportedError, DriverError);
    function BusyConnectionError(address, maxRequestsPerConnection, connectionLength) {
      let message = util.format(
        "All connections to host %s are busy, %d requests are in-flight on %s",
        address,
        maxRequestsPerConnection,
        connectionLength === 1 ? "a single connection" : "each connection"
      );
      DriverError.call(this, message, this.constructor), this.info = "Represents a client-side error indicating that all connections to a certain host have reached the maximum amount of in-flight requests supported (pooling.maxRequestsPerConnection)";
    }
    util.inherits(BusyConnectionError, DriverError);
    function VIntOutOfRangeException(long) {
      let message = `Value ${long.toString} is out of range for a JavaScript Number`;
      DriverError.call(this, message, this.constructor), this.info = "Represents a run-time exception when attempting to decode a vint and the JavaScript Number doesn't have enough space to fit the value that was decoded";
    }
    util.inherits(VIntOutOfRangeException, DriverError);
    exports2.ArgumentError = ArgumentError;
    exports2.AuthenticationError = AuthenticationError;
    exports2.BusyConnectionError = BusyConnectionError;
    exports2.DriverError = DriverError;
    exports2.OperationTimedOutError = OperationTimedOutError;
    exports2.DriverInternalError = DriverInternalError;
    exports2.NoHostAvailableError = NoHostAvailableError;
    exports2.NotSupportedError = NotSupportedError;
    exports2.ResponseError = ResponseError;
    exports2.VIntOutOfRangeException = VIntOutOfRangeException;
  }
});

// node_modules/cassandra-driver/lib/promise-utils.js
var require_promise_utils = __commonJS({
  "node_modules/cassandra-driver/lib/promise-utils.js"(exports2, module2) {
    "use strict";
    function delay(ms) {
      return new Promise((r) => setTimeout(r, ms || 0));
    }
    function fromEvent(emitter, eventName) {
      return new Promise((resolve, reject) => emitter.once(eventName, (err, result) => {
        err ? reject(err) : resolve(result);
      }));
    }
    function fromCallback(fn) {
      return new Promise((resolve, reject) => fn((err, result) => {
        err ? reject(err) : resolve(result);
      }));
    }
    function getCallback(resolve, reject) {
      return function(err, result) {
        err ? reject(err) : resolve(result);
      };
    }
    async function invokeSequentially(info, length, fn) {
      let index;
      for (; (index = info.counter++) < length; )
        await fn(index);
    }
    function newQueryPlan(lbp, keyspace, executionOptions) {
      return new Promise((resolve, reject) => {
        lbp.newQueryPlan(keyspace, executionOptions, (err, iterator) => {
          err ? reject(err) : resolve(iterator);
        });
      });
    }
    function optionalCallback(promise, callback) {
      if (!callback)
        return promise;
      toCallback(promise, callback);
    }
    function times(count, limit, fn) {
      limit > count && (limit = count);
      let promises = new Array(limit), info = {
        counter: 0
      };
      for (let i = 0; i < limit; i++)
        promises[i] = invokeSequentially(info, count, fn);
      return Promise.all(promises);
    }
    function toBackground(promise) {
      promise.catch(() => {
      });
    }
    function toCallback(promise, callback) {
      promise.then(
        (result) => process.nextTick(() => callback(null, result)),
        // Avoid marking the promise as rejected
        (err) => process.nextTick(() => callback(err))
      );
    }
    module2.exports = {
      delay,
      fromCallback,
      fromEvent,
      getCallback,
      newQueryPlan,
      optionalCallback,
      times,
      toBackground,
      toCallback
    };
  }
});

// node_modules/cassandra-driver/lib/utils.js
var require_utils = __commonJS({
  "node_modules/cassandra-driver/lib/utils.js"(exports2) {
    "use strict";
    var Long = require_umd(), util = require("util"), net = require("net"), { EventEmitter } = require("events"), errors = require_errors(), promiseUtils = require_promise_utils(), maxInt = 9007199254740992, maxInt32 = 2147483647, emptyObject = Object.freeze({}), emptyArray = Object.freeze([]);
    function noop() {
    }
    var allocBuffer = Buffer.alloc || allocBufferFillDeprecated, allocBufferUnsafe = Buffer.allocUnsafe || allocBufferDeprecated, allocBufferFromString = Int8Array.from !== Buffer.from && Buffer.from || allocBufferFromStringDeprecated, allocBufferFromArray = Int8Array.from !== Buffer.from && Buffer.from || allocBufferFromArrayDeprecated;
    function allocBufferDeprecated(size) {
      return new Buffer(size);
    }
    function allocBufferFillDeprecated(size) {
      let b = allocBufferDeprecated(size);
      return b.fill(0), b;
    }
    function allocBufferFromStringDeprecated(text, encoding) {
      if (typeof text != "string")
        throw new TypeError("Expected string, obtained " + util.inspect(text));
      return new Buffer(text, encoding);
    }
    function allocBufferFromArrayDeprecated(arr) {
      if (!Array.isArray(arr))
        throw new TypeError("Expected Array, obtained " + util.inspect(arr));
      return new Buffer(arr);
    }
    function callbackOnce(callback) {
      let cb = callback;
      return function(err, result) {
        cb(err, result), cb = noop;
      };
    }
    function copyBuffer(buf) {
      let targetBuffer = allocBufferUnsafe(buf.length);
      return buf.copy(targetBuffer), targetBuffer;
    }
    function fixStack(stackTrace, error) {
      return stackTrace && (error.stack += `
  (event loop)
` + stackTrace.substr(stackTrace.indexOf(`
`) + 1)), error;
    }
    function log(type, info, furtherInfo, options) {
      if (!this.logEmitter) {
        let effectiveOptions = options || this.options;
        if (!effectiveOptions || !effectiveOptions.logEmitter)
          throw new Error("Log emitter not defined");
        this.logEmitter = effectiveOptions.logEmitter;
      }
      this.logEmitter("log", type, this.constructor.name, info, furtherInfo || "");
    }
    function totalLength(arr) {
      if (arr.length === 1)
        return arr[0].length;
      let total = 0;
      return arr.forEach(function(item) {
        let length = item.length;
        length = length || 0, total += length;
      }), total;
    }
    function extend(target) {
      return Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (!source)
          return;
        let keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i], value = source[key];
          value !== void 0 && (target[key] = value);
        }
      }), target;
    }
    function toLowerCaseProperties(obj) {
      let keys = Object.keys(obj), result = {};
      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        result[k.toLowerCase()] = obj[k];
      }
      return result;
    }
    function deepExtend(target) {
      return Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        for (let prop in source) {
          if (!source.hasOwnProperty(prop))
            continue;
          let targetProp = target[prop], targetType = typeof targetProp;
          !targetProp || targetType === "number" || targetType === "string" || Array.isArray(targetProp) || targetProp instanceof Date || targetProp.constructor.name !== "Object" ? target[prop] = source[prop] : target[prop] = deepExtend({}, targetProp, source[prop]);
        }
      }), target;
    }
    function propCompare(propName) {
      return function(a, b) {
        return a[propName] > b[propName] ? 1 : a[propName] < b[propName] ? -1 : 0;
      };
    }
    function funcCompare(name, argArray) {
      return function(a, b) {
        if (typeof a[name] > "u")
          return 0;
        let valA = a[name].apply(a, argArray), valB = b[name].apply(b, argArray);
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      };
    }
    function arrayIterator(arr) {
      return arr[Symbol.iterator]();
    }
    function iteratorToArray(iterator) {
      let values = [], item = iterator.next();
      for (; !item.done; )
        values.push(item.value), item = iterator.next();
      return values;
    }
    function binarySearch(arr, key, compareFunc) {
      let low = 0, high = arr.length - 1;
      for (; low <= high; ) {
        let mid = low + high >>> 1, midVal = arr[mid], cmp = compareFunc(midVal, key);
        if (cmp < 0)
          low = mid + 1;
        else if (cmp > 0)
          high = mid - 1;
        else
          return mid;
      }
      return ~low;
    }
    function insertSorted(arr, item, compareFunc) {
      if (arr.length === 0)
        return arr.push(item);
      let position = binarySearch(arr, item, compareFunc);
      position < 0 && (position = ~position), arr.splice(position, 0, item);
    }
    function validateFn(fn, name) {
      if (typeof fn != "function")
        throw new errors.ArgumentError(util.format("%s is not a function", name || "callback"));
      return fn;
    }
    function adaptNamedParamsPrepared(params, columns) {
      if (!params || Array.isArray(params) || !columns || columns.length === 0)
        return params;
      let paramsArray = new Array(columns.length);
      params = toLowerCaseProperties(params);
      let keys = {};
      for (let i = 0; i < columns.length; i++) {
        let name = columns[i].name;
        if (!params.hasOwnProperty(name))
          throw new errors.ArgumentError(util.format('Parameter "%s" not defined', name));
        paramsArray[i] = params[name], keys[name] = i;
      }
      return paramsArray;
    }
    function adaptNamedParamsWithHints(params, execOptions) {
      if (!params || Array.isArray(params))
        return { params, namedParameters: !1, keyIndexes: null };
      let keys = Object.keys(params), paramsArray = new Array(keys.length), hints = new Array(keys.length), userHints = execOptions.getHints() || emptyObject, keyIndexes = {};
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        paramsArray[i] = { name: key.toLowerCase(), value: params[key] }, hints[i] = userHints[key], keyIndexes[key] = i;
      }
      return execOptions.setHints(hints), { params: paramsArray, namedParameters: !0, keyIndexes };
    }
    function stringRepeat(val, times2) {
      return !times2 || times2 < 0 ? null : times2 === 1 ? val : new Array(times2 + 1).join(val);
    }
    function objectValues(obj) {
      if (!obj)
        return emptyArray;
      let keys = Object.keys(obj), values = new Array(keys.length);
      for (let i = 0; i < keys.length; i++)
        values[i] = obj[keys[i]];
      return values;
    }
    function promiseWrapper(options, originalCallback, handler) {
      if (typeof originalCallback == "function") {
        handler.call(this, originalCallback);
        return;
      }
      let factory = options.promiseFactory || defaultPromiseFactory, self = this;
      return factory(function(callback) {
        handler.call(self, callback);
      });
    }
    function defaultPromiseFactory(handler) {
      return new Promise(function(resolve, reject) {
        handler(function(err, result) {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }
    function ifUndefined(v1, v2) {
      return v1 !== void 0 ? v1 : v2;
    }
    function ifUndefined3(v1, v2, v3) {
      return v1 !== void 0 ? v1 : v2 !== void 0 ? v2 : v3;
    }
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)), temp = arr[i];
        arr[i] = arr[j], arr[j] = temp;
      }
      return arr;
    }
    function HashSet() {
      this.length = 0, this.items = {};
    }
    HashSet.prototype.add = function(key) {
      return this.contains(key) ? !1 : (this.items[key] = !0, this.length++, !0);
    };
    HashSet.prototype.contains = function(key) {
      return this.length > 0 && this.items[key] === !0;
    };
    HashSet.prototype.remove = function(key) {
      if (!this.contains(key))
        return !1;
      delete this.items[key], this.length--;
    };
    HashSet.prototype.toArray = function() {
      return Object.keys(this.items);
    };
    var AddressResolver = class {
      /**
       * Creates a new instance of the resolver.
       * @param {Object} options
       * @param {String} options.nameOrIp
       * @param {Object} [options.dns]
       */
      constructor(options) {
        if (!options || !options.nameOrIp || !options.dns)
          throw new Error("nameOrIp and dns lib must be provided as part of the options");
        this._resolve4 = util.promisify(options.dns.resolve4), this._nameOrIp = options.nameOrIp, this._isIp = net.isIP(options.nameOrIp), this._index = 0, this._addresses = null, this._refreshing = null;
      }
      /**
       * Resolves the addresses for the host name.
       */
      async init() {
        this._isIp || await this._resolve();
      }
      /**
       * Tries to resolve the addresses for the host name.
       */
      async refresh() {
        if (!this._isIp) {
          if (this._refreshing)
            return await promiseUtils.fromEvent(this._refreshing, "finished");
          this._refreshing = new EventEmitter().setMaxListeners(0);
          try {
            await this._resolve();
          } catch {
          }
          this._refreshing.emit("finished"), this._refreshing = null;
        }
      }
      async _resolve() {
        let arr = await this._resolve4(this._nameOrIp);
        if (!arr || arr.length === 0)
          throw new Error(`${this._nameOrIp} could not be resolved`);
        this._addresses = arr;
      }
      /**
       * Returns resolved ips in a round-robin fashion.
       */
      getIp() {
        if (this._isIp)
          return this._nameOrIp;
        let item = this._addresses[this._index % this._addresses.length];
        return this._index = this._index !== maxInt32 ? this._index + 1 : 0, item;
      }
    };
    function each(arr, fn, callback) {
      if (!Array.isArray(arr))
        throw new TypeError("First parameter is not an Array");
      callback = callback || noop;
      let length = arr.length;
      if (length === 0)
        return callback();
      let completed = 0;
      for (let i = 0; i < length; i++)
        fn(arr[i], next);
      function next(err) {
        if (err) {
          let cb = callback;
          callback = noop, cb(err);
          return;
        }
        ++completed === length && callback();
      }
    }
    function eachSeries(arr, fn, callback) {
      if (!Array.isArray(arr))
        throw new TypeError("First parameter is not an Array");
      callback = callback || noop;
      let length = arr.length;
      if (length === 0)
        return callback();
      let sync, index = 1;
      fn(arr[0], next), sync === void 0 && (sync = !1);
      function next(err) {
        if (err)
          return callback(err);
        if (index >= length)
          return callback();
        if (sync === void 0 && (sync = !0), sync)
          return process.nextTick(function() {
            fn(arr[index++], next);
          });
        fn(arr[index++], next);
      }
    }
    function forEachOf(arr, fn, callback) {
      return mapEach(arr, fn, !0, callback);
    }
    function map(arr, fn, callback) {
      return mapEach(arr, fn, !1, callback);
    }
    function mapEach(arr, fn, useIndex, callback) {
      if (!Array.isArray(arr))
        throw new TypeError("First parameter must be an Array");
      callback = callback || noop;
      let length = arr.length;
      if (length === 0)
        return callback(null, []);
      let result = new Array(length), completed = 0, invoke = useIndex ? invokeWithIndex : invokeWithoutIndex;
      for (let i = 0; i < length; i++)
        invoke(i);
      function invokeWithoutIndex(i) {
        fn(arr[i], function(err, transformed) {
          result[i] = transformed, next(err);
        });
      }
      function invokeWithIndex(i) {
        fn(arr[i], i, function(err, transformed) {
          result[i] = transformed, next(err);
        });
      }
      function next(err) {
        if (err) {
          let cb = callback;
          callback = noop, cb(err);
          return;
        }
        ++completed === length && callback(null, result);
      }
    }
    function mapSeries(arr, fn, callback) {
      if (!Array.isArray(arr))
        throw new TypeError("First parameter must be an Array");
      callback = callback || noop;
      let length = arr.length;
      if (length === 0)
        return callback(null, []);
      let result = new Array(length), index = 0, sync;
      invoke(0), sync === void 0 && (sync = !1);
      function invoke(i) {
        fn(arr[i], function(err, transformed) {
          result[i] = transformed, next(err);
        });
      }
      function next(err) {
        if (err)
          return callback(err);
        if (++index === length)
          return callback(null, result);
        sync === void 0 && (sync = !0);
        let i = index;
        if (sync)
          return process.nextTick(function() {
            invoke(i);
          });
        invoke(index);
      }
    }
    function parallel(arr, callback) {
      if (!Array.isArray(arr))
        throw new TypeError("First parameter must be an Array");
      callback = callback || noop;
      let length = arr.length, completed = 0;
      for (let i = 0; i < length; i++)
        arr[i](next);
      function next(err) {
        if (err) {
          let cb = callback;
          return callback = noop, cb(err);
        }
        ++completed === length && callback();
      }
    }
    function series(arr, callback) {
      if (!Array.isArray(arr))
        throw new TypeError("First parameter must be an Array");
      callback = callback || noop;
      let index = 0, sync;
      next();
      function next(err, result) {
        if (err)
          return callback(err);
        if (index === arr.length)
          return callback(null, result);
        if (sync)
          return process.nextTick(function() {
            sync = !0, arr[index++](next), sync = !1;
          });
        sync = !0, arr[index++](next), sync = !1;
      }
    }
    function times(count, iteratorFunc, callback) {
      if (callback = callback || noop, count = +count, isNaN(count) || count === 0)
        return callback();
      let completed = 0;
      for (let i = 0; i < count; i++)
        iteratorFunc(i, next);
      function next(err) {
        if (err) {
          let cb = callback;
          return callback = noop, cb(err);
        }
        ++completed === count && callback();
      }
    }
    function timesLimit(count, limit, iteratorFunc, callback) {
      let sync;
      callback = callback || noop, limit = Math.min(limit, count);
      let index = limit - 1, i, completed = 0;
      for (i = 0; i < limit; i++)
        iteratorFunc(i, next);
      i = -1;
      function next(err) {
        if (err) {
          let cb = callback;
          callback = noop, cb(err);
          return;
        }
        if (++completed === count)
          return callback();
        if (index++, !(index >= count)) {
          if (sync === void 0 && (sync = i >= 0), sync) {
            let captureIndex = index;
            return process.nextTick(function() {
              iteratorFunc(captureIndex, next);
            });
          }
          iteratorFunc(index, next);
        }
      }
    }
    function timesSeries(count, iteratorFunction, callback) {
      if (count = +count, isNaN(count) || count < 1)
        return callback();
      let index = 1, sync;
      iteratorFunction(0, next), sync === void 0 && (sync = !1);
      function next(err) {
        if (err)
          return callback(err);
        if (index === count)
          return callback();
        sync === void 0 && (sync = !0);
        let i = index++;
        if (sync)
          return process.nextTick(function() {
            iteratorFunction(i, next);
          });
        iteratorFunction(i, next);
      }
    }
    function whilst(condition, fn, callback) {
      let sync = 0;
      next();
      function next(err) {
        if (err)
          return callback(err);
        if (!condition())
          return callback();
        if (sync === 0) {
          sync = 1, fn(function(err2) {
            sync === 1 && (sync = 4), next(err2);
          }), sync === 1 && (sync = 2);
          return;
        }
        if (sync === 4)
          return process.nextTick(function() {
            fn(next);
          });
        fn(next);
      }
    }
    var VIntCoding = /* @__PURE__ */ function() {
      function encodeZigZag64(n) {
        return n.toUnsigned().shiftLeft(1).xor(n.shiftRight(63));
      }
      function decodeZigZag64(n) {
        return n.shiftRightUnsigned(1).xor(n.and(Long.ONE).negate());
      }
      function writeVInt(value, buffer) {
        return writeUnsignedVInt(encodeZigZag64(value), buffer);
      }
      function writeUnsignedVInt(value, buffer) {
        let size = computeUnsignedVIntSize(value);
        return size === 1 ? (buffer[0] = value.getLowBits(), 1) : (encodeVInt(value, size, buffer), size);
      }
      function computeUnsignedVIntSize(value) {
        return 639 - numberOfLeadingZeros(value.or(Long.ONE)) * 9 >> 6;
      }
      function encodeVInt(value, size, buffer) {
        let extraBytes = size - 1, intValue = value.getLowBits(), i, intBytes = 4;
        for (i = extraBytes; i >= 0 && intBytes-- > 0; i--)
          buffer[i] = 255 & intValue, intValue >>= 8;
        for (intValue = value.getHighBits(); i >= 0; i--)
          buffer[i] = 255 & intValue, intValue >>= 8;
        buffer[0] |= encodeExtraBytesToRead(extraBytes);
      }
      function numberOfLeadingZeros(value) {
        if (value.equals(Long.ZERO))
          return 64;
        let n = 1, x = value.getHighBits();
        return x === 0 && (n += 32, x = value.getLowBits()), x >>> 16 || (n += 16, x <<= 16), x >>> 24 || (n += 8, x <<= 8), x >>> 28 || (n += 4, x <<= 4), x >>> 30 || (n += 2, x <<= 2), n -= x >>> 31, n;
      }
      function encodeExtraBytesToRead(extraBytesToRead) {
        return ~(255 >> extraBytesToRead);
      }
      function readVInt(buffer, offset) {
        return decodeZigZag64(readUnsignedVInt(buffer, offset));
      }
      function readUnsignedVInt(input, offset) {
        let firstByte = input[offset.value++];
        if (!(firstByte & 128))
          return Long.fromInt(firstByte);
        let sByteInt = fromSignedByteToInt(firstByte), size = numberOfExtraBytesToRead(sByteInt), result = Long.fromInt(sByteInt & firstByteValueMask(size));
        for (let ii = 0; ii < size; ii++) {
          let b = Long.fromInt(input[offset.value++]);
          result = result.shiftLeft(8).or(b);
        }
        return result;
      }
      function fromSignedByteToInt(value) {
        return value > 127 ? value - 256 : value;
      }
      function numberOfLeadingZerosInt32(i) {
        if (i === 0)
          return 32;
        let n = 1;
        return i >>> 16 || (n += 16, i <<= 16), i >>> 24 || (n += 8, i <<= 8), i >>> 28 || (n += 4, i <<= 4), i >>> 30 || (n += 2, i <<= 2), n -= i >>> 31, n;
      }
      function numberOfExtraBytesToRead(firstByte) {
        return numberOfLeadingZerosInt32(~firstByte) - 24;
      }
      function firstByteValueMask(extraBytesToRead) {
        return 255 >> extraBytesToRead;
      }
      function writeUnsignedVInt32(value, output) {
        writeUnsignedVInt(Long.fromNumber(value), output);
      }
      function getUnsignedVInt32(input, readerIndex) {
        return checkedCast(getUnsignedVInt(input, readerIndex, input.length));
      }
      function getUnsignedVInt(input, readerIndex, readerLimit) {
        if (readerIndex < 0)
          throw new errors.ArgumentError(
            "Reader index should be non-negative, but was " + readerIndex
          );
        if (readerIndex >= readerLimit)
          return Long.fromNumber(-1);
        let firstByte = (
          /** @type {Number} */
          input.at(readerIndex++)
        );
        if (firstByte >= 0)
          return Long.fromNumber(firstByte);
        let size = numberOfExtraBytesToRead(firstByte);
        if (readerIndex + size > readerLimit)
          return Long.fromNumber(-1);
        let retval = Long.fromNumber(firstByte & firstByteValueMask(size));
        for (let ii = 0; ii < size; ii++) {
          let b = (
            /** @type {Number} */
            input.at(readerIndex++)
          );
          retval.shiftLeft(8), retval.or(b & 255);
        }
        return retval;
      }
      function checkedCast(value) {
        let result = value.toInt();
        if (value.notEquals(result))
          throw new errors.VIntOutOfRangeException(value);
        return result;
      }
      function uvintUnpack(bytes) {
        let firstByte = bytes[0];
        if (!(firstByte & 128))
          return [firstByte, 1];
        let numExtraBytes = 8 - (~firstByte & 255).toString(2).length, rv = firstByte & 255 >> numExtraBytes;
        for (let idx = 1; idx <= numExtraBytes; idx++) {
          let newByte = bytes[idx];
          rv <<= 8, rv |= newByte & 255;
        }
        return [rv, numExtraBytes + 1];
      }
      function uvintPack(val) {
        let rv = [];
        if (val < 128)
          rv.push(val);
        else {
          let v = val, numExtraBytes = 0, numBits = v.toString(2).length, reservedBits = numExtraBytes + 1;
          for (; numBits > 8 - reservedBits; )
            numExtraBytes += 1, numBits -= 8, reservedBits = Math.min(numExtraBytes + 1, 8), rv.push(v & 255), v >>= 8;
          if (numExtraBytes > 8)
            throw new Error(`Value ${val} is too big and cannot be encoded as vint`);
          let n = 8 - numExtraBytes;
          v |= 255 >> n << n, rv.push(Math.abs(v));
        }
        return rv.reverse(), Buffer.from(rv);
      }
      return {
        readVInt,
        writeVInt,
        uvintPack,
        uvintUnpack
      };
    }();
    exports2.adaptNamedParamsPrepared = adaptNamedParamsPrepared;
    exports2.adaptNamedParamsWithHints = adaptNamedParamsWithHints;
    exports2.AddressResolver = AddressResolver;
    exports2.allocBuffer = allocBuffer;
    exports2.allocBufferUnsafe = allocBufferUnsafe;
    exports2.allocBufferFromArray = allocBufferFromArray;
    exports2.allocBufferFromString = allocBufferFromString;
    exports2.arrayIterator = arrayIterator;
    exports2.binarySearch = binarySearch;
    exports2.callbackOnce = callbackOnce;
    exports2.copyBuffer = copyBuffer;
    exports2.deepExtend = deepExtend;
    exports2.each = each;
    exports2.eachSeries = eachSeries;
    exports2.emptyArray = Object.freeze([]);
    exports2.emptyObject = emptyObject;
    exports2.extend = extend;
    exports2.fixStack = fixStack;
    exports2.forEachOf = forEachOf;
    exports2.funcCompare = funcCompare;
    exports2.ifUndefined = ifUndefined;
    exports2.ifUndefined3 = ifUndefined3;
    exports2.insertSorted = insertSorted;
    exports2.iteratorToArray = iteratorToArray;
    exports2.log = log;
    exports2.map = map;
    exports2.mapSeries = mapSeries;
    exports2.maxInt = maxInt;
    exports2.noop = noop;
    exports2.objectValues = objectValues;
    exports2.parallel = parallel;
    exports2.promiseWrapper = promiseWrapper;
    exports2.propCompare = propCompare;
    exports2.series = series;
    exports2.shuffleArray = shuffleArray;
    exports2.stringRepeat = stringRepeat;
    exports2.times = times;
    exports2.timesLimit = timesLimit;
    exports2.timesSeries = timesSeries;
    exports2.totalLength = totalLength;
    exports2.validateFn = validateFn;
    exports2.whilst = whilst;
    exports2.HashSet = HashSet;
    exports2.VIntCoding = VIntCoding;
  }
});

// node_modules/cassandra-driver/lib/policies/address-resolution.js
var require_address_resolution = __commonJS({
  "node_modules/cassandra-driver/lib/policies/address-resolution.js"(exports2) {
    "use strict";
    var dns = require("dns"), util = require("util"), utils = require_utils();
    function AddressTranslator() {
    }
    AddressTranslator.prototype.translate = function(address, port, callback) {
      callback(address + ":" + port);
    };
    function EC2MultiRegionTranslator() {
    }
    util.inherits(EC2MultiRegionTranslator, AddressTranslator);
    EC2MultiRegionTranslator.prototype.translate = function(address, port, callback) {
      let newAddress = address, self = this, name;
      utils.series([
        function(next) {
          dns.reverse(address, function(err, hostNames) {
            if (err)
              return next(err);
            if (!hostNames)
              return next();
            name = hostNames[0], next();
          });
        },
        function(next) {
          if (!name)
            return next();
          dns.lookup(name, function(err, lookupAddress) {
            if (err)
              return next(err);
            newAddress = lookupAddress, next();
          });
        }
      ], function(err) {
        err && self.logError(address, err), callback(newAddress + ":" + port);
      });
    };
    EC2MultiRegionTranslator.prototype.logError = function(address, err) {
    };
    exports2.AddressTranslator = AddressTranslator;
    exports2.EC2MultiRegionTranslator = EC2MultiRegionTranslator;
  }
});

// node_modules/cassandra-driver/lib/types/uuid.js
var require_uuid = __commonJS({
  "node_modules/cassandra-driver/lib/types/uuid.js"(exports2, module2) {
    "use strict";
    var crypto = require("crypto"), utils = require_utils();
    function Uuid(buffer) {
      if (!buffer || buffer.length !== 16)
        throw new Error("You must provide a buffer containing 16 bytes");
      this.buffer = buffer;
    }
    Uuid.fromString = function(value) {
      if (typeof value != "string" || value.length !== 36)
        throw new Error("Invalid string representation of Uuid, it should be in the 00000000-0000-0000-0000-000000000000");
      return new Uuid(utils.allocBufferFromString(value.replace(/-/g, ""), "hex"));
    };
    Uuid.random = function(callback) {
      if (callback)
        getRandomBytes(function(err, buffer) {
          return err ? callback(err) : callback(null, createUuidFromBuffer(buffer));
        });
      else {
        let buffer = getRandomBytes();
        return createUuidFromBuffer(buffer);
      }
    };
    Uuid.prototype.getBuffer = function() {
      return this.buffer;
    };
    Uuid.prototype.equals = function(other) {
      return other instanceof Uuid && this.buffer.equals(other.buffer);
    };
    Uuid.prototype.toString = function() {
      let hexValue = getHex(this);
      return hexValue.substr(0, 8) + "-" + hexValue.substr(8, 4) + "-" + hexValue.substr(12, 4) + "-" + hexValue.substr(16, 4) + "-" + hexValue.substr(20, 12);
    };
    Uuid.prototype.inspect = function() {
      return this.constructor.name + ": " + this.toString();
    };
    Uuid.prototype.toJSON = function() {
      return this.toString();
    };
    function createUuidFromBuffer(buffer) {
      return buffer[6] &= 15, buffer[6] |= 64, buffer[8] &= 63, buffer[8] |= 128, new Uuid(buffer);
    }
    function getHex(uuid) {
      return uuid.buffer.toString("hex");
    }
    function getRandomBytes(cb) {
      return crypto.randomBytes(16, cb);
    }
    module2.exports = Uuid;
  }
});

// node_modules/cassandra-driver/lib/types/time-uuid.js
var require_time_uuid = __commonJS({
  "node_modules/cassandra-driver/lib/types/time-uuid.js"(exports2, module2) {
    "use strict";
    var util = require("util"), crypto = require("crypto"), Long = require_umd(), Uuid = require_uuid(), utils = require_utils(), _unixToGregorian = 122192928e5, _ticksInMs = 1e4, minNodeId = utils.allocBufferFromString("808080808080", "hex"), minClockId = utils.allocBufferFromString("8080", "hex"), maxNodeId = utils.allocBufferFromString("7f7f7f7f7f7f", "hex"), maxClockId = utils.allocBufferFromString("7f7f", "hex"), _ticks = 0, _ticksForCurrentTime = 0, _lastTimestamp = 0;
    function TimeUuid(value, ticks, nodeId, clockId) {
      let buffer;
      if (value instanceof Buffer) {
        if (value.length !== 16)
          throw new Error("Buffer for v1 uuid not valid");
        buffer = value;
      } else
        buffer = generateBuffer(value, ticks, nodeId, clockId);
      Uuid.call(this, buffer);
    }
    util.inherits(TimeUuid, Uuid);
    TimeUuid.fromDate = function(date, ticks, nodeId, clockId, callback) {
      if (typeof ticks == "function" ? (callback = ticks, ticks = nodeId = clockId = null) : typeof nodeId == "function" ? (callback = nodeId, nodeId = clockId = null) : typeof clockId == "function" && (callback = clockId, clockId = null), !callback)
        return new TimeUuid(date, ticks, nodeId, clockId);
      utils.parallel([
        (next) => getOrGenerateRandom(nodeId, 6, (err, buffer) => next(err, nodeId = buffer)),
        (next) => getOrGenerateRandom(clockId, 2, (err, buffer) => next(err, clockId = buffer))
      ], (err) => {
        if (err)
          return callback(err);
        let timeUuid;
        try {
          timeUuid = new TimeUuid(date, ticks, nodeId, clockId);
        } catch (e) {
          return callback(e);
        }
        callback(null, timeUuid);
      });
    };
    TimeUuid.fromString = function(value) {
      return new TimeUuid(Uuid.fromString(value).getBuffer());
    };
    TimeUuid.min = function(date, ticks) {
      return new TimeUuid(date, ticks, minNodeId, minClockId);
    };
    TimeUuid.max = function(date, ticks) {
      return new TimeUuid(date, ticks, maxNodeId, maxClockId);
    };
    TimeUuid.now = function(nodeId, clockId, callback) {
      return TimeUuid.fromDate(null, null, nodeId, clockId, callback);
    };
    TimeUuid.prototype.getDatePrecision = function() {
      let timeLow = this.buffer.readUInt32BE(0), timeHigh = 0;
      timeHigh |= (this.buffer[4] & 255) << 8, timeHigh |= this.buffer[5] & 255, timeHigh |= (this.buffer[6] & 15) << 24, timeHigh |= (this.buffer[7] & 255) << 16;
      let val = Long.fromBits(timeLow, timeHigh), ticksInMsLong = Long.fromNumber(_ticksInMs), ticks = val.modulo(ticksInMsLong), time = val.div(ticksInMsLong).subtract(Long.fromNumber(_unixToGregorian));
      return { date: new Date(time.toNumber()), ticks: ticks.toNumber() };
    };
    TimeUuid.prototype.getDate = function() {
      return this.getDatePrecision().date;
    };
    TimeUuid.prototype.getNodeId = function() {
      return this.buffer.slice(10);
    };
    TimeUuid.prototype.getClockId = function() {
      return this.buffer.slice(8, 10);
    };
    TimeUuid.prototype.getNodeIdString = function() {
      return this.buffer.slice(10).toString("ascii");
    };
    function writeTime(buffer, time, ticks) {
      let val = Long.fromNumber(time + _unixToGregorian).multiply(Long.fromNumber(1e4)).add(Long.fromNumber(ticks)), timeHigh = val.getHighBitsUnsigned();
      buffer.writeUInt32BE(val.getLowBitsUnsigned(), 0), buffer.writeUInt16BE(timeHigh & 65535, 4), buffer.writeUInt16BE(timeHigh >>> 16 & 65535, 6);
    }
    function getClockId(clockId) {
      let buffer = clockId;
      if (typeof clockId == "string" && (buffer = utils.allocBufferFromString(clockId, "ascii")), !(buffer instanceof Buffer))
        buffer = getRandomBytes(2);
      else if (buffer.length !== 2)
        throw new Error("Clock identifier must have 2 bytes");
      return buffer;
    }
    function getNodeId(nodeId) {
      let buffer = nodeId;
      if (typeof nodeId == "string" && (buffer = utils.allocBufferFromString(nodeId, "ascii")), !(buffer instanceof Buffer))
        buffer = getRandomBytes(6);
      else if (buffer.length !== 6)
        throw new Error("Node identifier must have 6 bytes");
      return buffer;
    }
    function getTicks(ticks) {
      return (typeof ticks != "number" || ticks >= _ticksInMs) && (_ticks++, _ticks >= _ticksInMs && (_ticks = 0), ticks = _ticks), ticks;
    }
    function getTimeWithTicks(date, ticks) {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        date = /* @__PURE__ */ new Date();
        let time = date.getTime();
        _ticksForCurrentTime++, (_ticksForCurrentTime > _ticksInMs || time > _lastTimestamp) && (_ticksForCurrentTime = 0, _lastTimestamp = time), ticks = _ticksForCurrentTime;
      }
      return {
        time: date.getTime(),
        ticks: getTicks(ticks)
      };
    }
    function getRandomBytes(length) {
      return crypto.randomBytes(length);
    }
    function getOrGenerateRandom(id, length, callback) {
      if (id)
        return callback(null, id);
      crypto.randomBytes(length, callback);
    }
    function generateBuffer(date, ticks, nodeId, clockId) {
      let timeWithTicks = getTimeWithTicks(date, ticks);
      nodeId = getNodeId(nodeId), clockId = getClockId(clockId);
      let buffer = utils.allocBufferUnsafe(16);
      return writeTime(buffer, timeWithTicks.time, timeWithTicks.ticks), clockId.copy(buffer, 8, 0), nodeId.copy(buffer, 10, 0), buffer[6] = buffer[6] & 15, buffer[6] = buffer[6] | 16, buffer[8] = buffer[8] & 63, buffer[8] = buffer[8] | 128, buffer;
    }
    module2.exports = TimeUuid;
  }
});

// node_modules/cassandra-driver/lib/types/version-number.js
var require_version_number = __commonJS({
  "node_modules/cassandra-driver/lib/types/version-number.js"(exports2, module2) {
    "use strict";
    var _versionPattern = /(\d+)\.(\d+)(?:\.(\d+))?(?:\.(\d+)?)?(?:[-~]([\w+]*(?:-\w[.\w]*)*))?(?:\+([.\w]+))?/, VersionNumber = class _VersionNumber {
      constructor(major, minor, patch, dsePatch, preReleases, build) {
        this.major = major, this.minor = minor, this.patch = patch, this.dsePatch = dsePatch, this.preReleases = preReleases, this.build = build;
      }
      /**
       * @return {String} String representation of this version.
       */
      toString() {
        let str = this.major + "." + this.minor;
        return this.patch !== void 0 && (str += "." + this.patch), this.dsePatch !== void 0 && (str += "." + this.dsePatch), this.preReleases !== void 0 && this.preReleases.forEach((preRelease) => {
          str += "-" + preRelease;
        }), this.build && (str += "+" + this.build), str;
      }
      /**
       * Compares this version with the provided version. 
       * @param {VersionNumber} other 
       * @return {Number} -1 if less than other, 0 if equal, 1 if greater than.
       */
      compare(other) {
        if (this.major < other.major)
          return -1;
        if (this.major > other.major)
          return 1;
        if (this.minor < other.minor)
          return -1;
        if (this.minor > other.minor)
          return 1;
        let thisPatch = this.patch || 0, otherPatch = other.patch || 0;
        if (thisPatch < otherPatch)
          return -1;
        if (thisPatch > otherPatch)
          return 1;
        if (this.dsePatch === void 0) {
          if (other.dsePatch !== void 0)
            return -1;
        } else {
          if (other.dsePatch === void 0)
            return 1;
          if (this.dsePatch < other.dsePatch)
            return -1;
          if (this.dsePatch > other.dsePatch)
            return 1;
        }
        if (this.preReleases === void 0) {
          if (other.preReleases !== void 0)
            return 1;
        } else if (other.preReleases === void 0)
          return -1;
        return 0;
      }
      static parse(version) {
        if (!version)
          return null;
        let match = version.match(_versionPattern);
        if (match) {
          let major = parseInt(match[1], 10), minor = parseInt(match[2], 10), patch = match[3] ? parseInt(match[3], 10) : void 0, dsePatch = match[4] ? parseInt(match[4], 10) : void 0, preReleases = match[5] ? match[5].split("-") : void 0, build = match[6];
          return new _VersionNumber(major, minor, patch, dsePatch, preReleases, build);
        }
        throw new TypeError("Could not extract version from '" + version + "'");
      }
    };
    module2.exports = VersionNumber;
  }
});

// node_modules/cassandra-driver/lib/types/protocol-version.js
var require_protocol_version = __commonJS({
  "node_modules/cassandra-driver/lib/types/protocol-version.js"(exports2, module2) {
    "use strict";
    var utils = require_utils(), VersionNumber = require_version_number(), v200 = VersionNumber.parse("2.0.0"), v210 = VersionNumber.parse("2.1.0"), v220 = VersionNumber.parse("2.2.0"), v300 = VersionNumber.parse("3.0.0"), v510 = VersionNumber.parse("5.1.0"), v600 = VersionNumber.parse("6.0.0"), protocolVersion = {
      // Strict equality operators to compare versions are allowed, other comparison operators are discouraged. Instead,
      // use a function that checks if a functionality is present on a certain version, for maintainability purposes.
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      dseV1: 65,
      dseV2: 66,
      maxSupported: 66,
      minSupported: 1,
      /**
       * Determines whether the protocol version is a DSE-specific protocol version.
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      isDse: function(version) {
        return version >= this.dseV1 && version <= this.dseV2;
      },
      /**
       * Returns true if the protocol version represents a version of Cassandra
       * supported by this driver, false otherwise
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      isSupportedCassandra: function(version) {
        return version <= 4 && version >= 1;
      },
      /**
       * Determines whether the protocol version is supported by this driver.
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      isSupported: function(version) {
        return this.isDse(version) || this.isSupportedCassandra(version);
      },
      /**
       * Determines whether the protocol includes flags for PREPARE messages.
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      supportsPrepareFlags: function(version) {
        return version === this.dseV2;
      },
      /**
       * Determines whether the protocol supports sending the keyspace as part of PREPARE, QUERY, EXECUTE, and BATCH.
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      supportsKeyspaceInRequest: function(version) {
        return version === this.dseV2;
      },
      /**
       * Determines whether the protocol supports result_metadata_id on `prepared` response and
       * and `execute` request.
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      supportsResultMetadataId: function(version) {
        return version === this.dseV2;
      },
      /**
       * Determines whether the protocol supports partition key indexes in the `prepared` RESULT responses.
       * @param {Number} version
       * @returns {Boolean}
       * @ignore
       */
      supportsPreparedPartitionKey: function(version) {
        return version >= this.v4;
      },
      /**
       * Determines whether the protocol supports up to 4 strings (ie: change_type, target, keyspace and table) in the
       * schema change responses.
       * @param version
       * @return {boolean}
       * @ignore
       */
      supportsSchemaChangeFullMetadata: function(version) {
        return version >= this.v3;
      },
      /**
       * Determines whether the protocol supports continuous paging.
       * @param version
       * @return {boolean}
       * @ignore
       */
      supportsContinuousPaging: function(version) {
        return this.isDse(version);
      },
      /**
       * Determines whether the protocol supports paging state and serial consistency parameters in QUERY and EXECUTE
       * requests.
       * @param version
       * @return {boolean}
       * @ignore
       */
      supportsPaging: function(version) {
        return version >= this.v2;
      },
      /**
       * Determines whether the protocol supports timestamps parameters in BATCH, QUERY and EXECUTE requests.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      supportsTimestamp: function(version) {
        return version >= this.v3;
      },
      /**
       * Determines whether the protocol supports named parameters in QUERY and EXECUTE requests.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      supportsNamedParameters: function(version) {
        return version >= this.v3;
      },
      /**
       * Determines whether the protocol supports unset parameters.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      supportsUnset: function(version) {
        return version >= this.v4;
      },
      /**
       * Determines whether the protocol provides a reason map for read and write failure errors.
       * @param version
       * @return {boolean}
       * @ignore
       */
      supportsFailureReasonMap: function(version) {
        return version >= this.v5;
      },
      /**
       * Determines whether the protocol supports timestamp and serial consistency parameters in BATCH requests.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      uses2BytesStreamIds: function(version) {
        return version >= this.v3;
      },
      /**
       * Determines whether the collection length is encoded using 32 bits.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      uses4BytesCollectionLength: function(version) {
        return version >= this.v3;
      },
      /**
       * Determines whether the QUERY, EXECUTE and BATCH flags are encoded using 32 bits.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      uses4BytesQueryFlags: function(version) {
        return this.isDse(version);
      },
      /**
       * Startup responses using protocol v4+ can be a SERVER_ERROR wrapping a ProtocolException, this method returns true
       * when is possible to receive such error.
       * @param {Number} version
       * @return {boolean}
       * @ignore
       */
      canStartupResponseErrorBeWrapped: function(version) {
        return version >= this.v4;
      },
      /**
       * Gets the first version number that is supported, lower than the one provided.
       * Returns zero when there isn't a lower supported version.
       * @param {Number} version
       * @return {Number}
       * @ignore
       */
      getLowerSupported: function(version) {
        return version >= this.v5 ? this.v4 : version <= this.v1 ? 0 : version - 1;
      },
      /**
       * Computes the highest supported protocol version collectively by the given hosts.
       *
       * Considers the cassandra_version of the input hosts to determine what protocol versions
       * are supported and uses the highest common protocol version among them.
       *
       * If hosts >= C* 3.0 are detected, any hosts older than C* 2.1 will not be considered
       * as those cannot be connected to.  In general this will not be a problem as C* does
       * not support clusters with nodes that have versions that are more than one major
       * version away from each other.
       * @param {Connection} connection Connection hosts were discovered from.
       * @param {Array.<Host>} hosts The hosts to determine highest protocol version from.
       * @return {Number} Highest supported protocol version among hosts.
       */
      getHighestCommon: function(connection, hosts) {
        let log = connection.log ? connection.log.bind(connection) : utils.noop, maxVersion = connection.protocolVersion, v3Requirement = !1, maxVersionWith3OrMore = maxVersion;
        if (hosts.forEach((h) => {
          let dseVersion = null;
          if (h.dseVersion && (dseVersion = VersionNumber.parse(h.dseVersion), log("verbose", `Encountered host ${h.address} with dse version ${dseVersion}`), dseVersion.compare(v510) >= 0)) {
            v3Requirement = !0, dseVersion.compare(v600) >= 0 ? maxVersion = Math.min(this.dseV2, maxVersion) : maxVersion = Math.min(this.dseV1, maxVersion), maxVersionWith3OrMore = maxVersion;
            return;
          }
          if (!h.cassandraVersion || h.cassandraVersion.length === 0) {
            log("warning", "Encountered host " + h.address + " with no cassandra version, skipping as part of protocol version evaluation");
            return;
          }
          try {
            let cassandraVersion = VersionNumber.parse(h.cassandraVersion);
            dseVersion || log("verbose", "Encountered host " + h.address + " with cassandra version " + cassandraVersion), cassandraVersion.compare(v300) >= 0 ? (v3Requirement = !0, maxVersion = Math.min(this.v4, maxVersion), maxVersionWith3OrMore = maxVersion) : cassandraVersion.compare(v220) >= 0 ? (maxVersion = Math.min(this.v4, maxVersion), maxVersionWith3OrMore = maxVersion) : cassandraVersion.compare(v210) >= 0 ? (maxVersion = Math.min(this.v3, maxVersion), maxVersionWith3OrMore = maxVersion) : cassandraVersion.compare(v200) >= 0 ? maxVersion = Math.min(this.v2, maxVersion) : maxVersion = this.v1;
          } catch {
            log("warning", "Encountered host " + h.address + " with unparseable cassandra version " + h.cassandraVersion + " skipping as part of protocol version evaluation");
          }
        }), v3Requirement && maxVersion < this.v3) {
          let addendum = ". This should not be possible as nodes within a cluster can't be separated by more than one major version";
          maxVersionWith3OrMore < this.v3 ? log("error", "Detected hosts that require at least protocol version 0x3, but currently connected to " + connection.address + ":" + connection.port + " using protocol version 0x" + maxVersionWith3OrMore + ". Will not be able to connect to these hosts" + addendum) : log("error", "Detected hosts with maximum protocol version of 0x" + maxVersion.toString(16) + " but there are some hosts that require at least version 0x3. Will not be able to connect to these older hosts" + addendum), maxVersion = maxVersionWith3OrMore;
        }
        return log("verbose", "Resolved protocol version 0x" + maxVersion.toString(16) + " as the highest common protocol version among hosts"), maxVersion;
      },
      /**
       * Determines if the protocol is a BETA version of the protocol.
       * @param {Number} version
       * @return {Number}
       */
      isBeta: function(version) {
        return version === this.v5;
      }
    };
    module2.exports = protocolVersion;
  }
});

// node_modules/cassandra-driver/lib/types/integer.js
var require_integer = __commonJS({
  "node_modules/cassandra-driver/lib/types/integer.js"(exports2, module2) {
    var utils = require_utils();
    function Integer(bits, sign) {
      this.bits_ = [], this.sign_ = sign;
      for (var top = !0, i = bits.length - 1; i >= 0; i--) {
        var val = bits[i] | 0;
        (!top || val != sign) && (this.bits_[i] = val, top = !1);
      }
    }
    Integer.IntCache_ = {};
    Integer.fromInt = function(value) {
      if (-128 <= value && value < 128) {
        var cachedObj = Integer.IntCache_[value];
        if (cachedObj)
          return cachedObj;
      }
      var obj = new Integer([value | 0], value < 0 ? -1 : 0);
      return -128 <= value && value < 128 && (Integer.IntCache_[value] = obj), obj;
    };
    Integer.fromNumber = function(value) {
      if (isNaN(value) || !isFinite(value))
        return Integer.ZERO;
      if (value < 0)
        return Integer.fromNumber(-value).negate();
      for (var bits = [], pow = 1, i = 0; value >= pow; i++)
        bits[i] = value / pow | 0, pow *= Integer.TWO_PWR_32_DBL_;
      return new Integer(bits, 0);
    };
    Integer.fromBits = function(bits) {
      var high = bits[bits.length - 1];
      return new Integer(bits, high & 1 << 31 ? -1 : 0);
    };
    Integer.fromString = function(str, opt_radix) {
      if (str.length == 0)
        throw TypeError("number format error: empty string");
      var radix = opt_radix || 10;
      if (radix < 2 || 36 < radix)
        throw Error("radix out of range: " + radix);
      if (str.charAt(0) == "-")
        return Integer.fromString(str.substring(1), radix).negate();
      if (str.indexOf("-") >= 0)
        throw TypeError('number format error: interior "-" character');
      for (var radixToPower = Integer.fromNumber(Math.pow(radix, 8)), result = Integer.ZERO, i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = Integer.fromNumber(Math.pow(radix, size));
          result = result.multiply(power).add(Integer.fromNumber(value));
        } else
          result = result.multiply(radixToPower), result = result.add(Integer.fromNumber(value));
      }
      return result;
    };
    Integer.fromBuffer = function(buf) {
      for (var bits = new Array(Math.ceil(buf.length / 4)), sign = buf[0] & 128 ? -1 : 0, i = 0; i < bits.length; i++) {
        var offset = buf.length - (i + 1) * 4, value;
        if (offset < 0) {
          offset = offset + 4, value = 0;
          for (var j = 0; j < offset; j++) {
            var byte = buf[j];
            sign === -1 && (byte = ~byte & 255), value = value | byte << (offset - j - 1) * 8;
          }
          sign === -1 && (value = ~value);
        } else
          value = buf.readInt32BE(offset);
        bits[i] = value;
      }
      return new Integer(bits, sign);
    };
    Integer.toBuffer = function(value) {
      var sign = value.sign_, bits = value.bits_;
      if (bits.length === 0)
        return utils.allocBufferFromArray([value.sign_]);
      var highBits = bits[bits.length - 1];
      sign === -1 && (highBits = ~highBits);
      var high = [];
      highBits >>> 24 > 0 && high.push(highBits >> 24 & 255), highBits >>> 16 > 0 && high.push(highBits >> 16 & 255), highBits >>> 8 > 0 && high.push(highBits >> 8 & 255), high.push(highBits & 255), high[0] >> 7 && high.unshift(0);
      for (var buf = utils.allocBufferUnsafe(high.length + (bits.length - 1) * 4), j = 0; j < high.length; j++) {
        var b = high[j];
        sign === -1 ? buf[j] = ~b : buf[j] = b;
      }
      for (var i = 0; i < bits.length - 1; i++) {
        var group = bits[bits.length - 2 - i], offset = high.length + i * 4;
        buf.writeInt32BE(group, offset);
      }
      return buf;
    };
    Integer.TWO_PWR_32_DBL_ = 65536 * 65536;
    Integer.ZERO = Integer.fromInt(0);
    Integer.ONE = Integer.fromInt(1);
    Integer.TWO_PWR_24_ = Integer.fromInt(1 << 24);
    Integer.prototype.toInt = function() {
      return this.bits_.length > 0 ? this.bits_[0] : this.sign_;
    };
    Integer.prototype.toNumber = function() {
      if (this.isNegative())
        return -this.negate().toNumber();
      for (var val = 0, pow = 1, i = 0; i < this.bits_.length; i++)
        val += this.getBitsUnsigned(i) * pow, pow *= Integer.TWO_PWR_32_DBL_;
      return val;
    };
    Integer.prototype.toString = function(opt_radix) {
      var radix = opt_radix || 10;
      if (radix < 2 || 36 < radix)
        throw Error("radix out of range: " + radix);
      if (this.isZero())
        return "0";
      if (this.isNegative())
        return "-" + this.negate().toString(radix);
      for (var radixToPower = Integer.fromNumber(Math.pow(radix, 6)), rem = this, result = ""; ; ) {
        var remDiv = rem.divide(radixToPower), intval = rem.subtract(remDiv.multiply(radixToPower)).toInt(), digits = intval.toString(radix);
        if (rem = remDiv, rem.isZero())
          return digits + result;
        for (; digits.length < 6; )
          digits = "0" + digits;
        result = "" + digits + result;
      }
    };
    Integer.prototype.getBits = function(index) {
      return index < 0 ? 0 : index < this.bits_.length ? this.bits_[index] : this.sign_;
    };
    Integer.prototype.getBitsUnsigned = function(index) {
      var val = this.getBits(index);
      return val >= 0 ? val : Integer.TWO_PWR_32_DBL_ + val;
    };
    Integer.prototype.getSign = function() {
      return this.sign_;
    };
    Integer.prototype.isZero = function() {
      if (this.sign_ != 0)
        return !1;
      for (var i = 0; i < this.bits_.length; i++)
        if (this.bits_[i] != 0)
          return !1;
      return !0;
    };
    Integer.prototype.isNegative = function() {
      return this.sign_ == -1;
    };
    Integer.prototype.isOdd = function() {
      return this.bits_.length == 0 && this.sign_ == -1 || this.bits_.length > 0 && (this.bits_[0] & 1) != 0;
    };
    Integer.prototype.equals = function(other) {
      if (this.sign_ != other.sign_)
        return !1;
      for (var len = Math.max(this.bits_.length, other.bits_.length), i = 0; i < len; i++)
        if (this.getBits(i) != other.getBits(i))
          return !1;
      return !0;
    };
    Integer.prototype.notEquals = function(other) {
      return !this.equals(other);
    };
    Integer.prototype.greaterThan = function(other) {
      return this.compare(other) > 0;
    };
    Integer.prototype.greaterThanOrEqual = function(other) {
      return this.compare(other) >= 0;
    };
    Integer.prototype.lessThan = function(other) {
      return this.compare(other) < 0;
    };
    Integer.prototype.lessThanOrEqual = function(other) {
      return this.compare(other) <= 0;
    };
    Integer.prototype.compare = function(other) {
      var diff = this.subtract(other);
      return diff.isNegative() ? -1 : diff.isZero() ? 0 : 1;
    };
    Integer.prototype.shorten = function(numBits) {
      for (var arr_index = numBits - 1 >> 5, bit_index = (numBits - 1) % 32, bits = [], i = 0; i < arr_index; i++)
        bits[i] = this.getBits(i);
      var sigBits = bit_index == 31 ? 4294967295 : (1 << bit_index + 1) - 1, val = this.getBits(arr_index) & sigBits;
      return val & 1 << bit_index ? (val |= 4294967295 - sigBits, bits[arr_index] = val, new Integer(bits, -1)) : (bits[arr_index] = val, new Integer(bits, 0));
    };
    Integer.prototype.negate = function() {
      return this.not().add(Integer.ONE);
    };
    Integer.prototype.add = function(other) {
      for (var len = Math.max(this.bits_.length, other.bits_.length), arr = [], carry = 0, i = 0; i <= len; i++) {
        var a1 = this.getBits(i) >>> 16, a0 = this.getBits(i) & 65535, b1 = other.getBits(i) >>> 16, b0 = other.getBits(i) & 65535, c0 = carry + a0 + b0, c1 = (c0 >>> 16) + a1 + b1;
        carry = c1 >>> 16, c0 &= 65535, c1 &= 65535, arr[i] = c1 << 16 | c0;
      }
      return Integer.fromBits(arr);
    };
    Integer.prototype.subtract = function(other) {
      return this.add(other.negate());
    };
    Integer.prototype.multiply = function(other) {
      if (this.isZero())
        return Integer.ZERO;
      if (other.isZero())
        return Integer.ZERO;
      if (this.isNegative())
        return other.isNegative() ? this.negate().multiply(other.negate()) : this.negate().multiply(other).negate();
      if (other.isNegative())
        return this.multiply(other.negate()).negate();
      if (this.lessThan(Integer.TWO_PWR_24_) && other.lessThan(Integer.TWO_PWR_24_))
        return Integer.fromNumber(this.toNumber() * other.toNumber());
      for (var len = this.bits_.length + other.bits_.length, arr = [], i = 0; i < 2 * len; i++)
        arr[i] = 0;
      for (var i = 0; i < this.bits_.length; i++)
        for (var j = 0; j < other.bits_.length; j++) {
          var a1 = this.getBits(i) >>> 16, a0 = this.getBits(i) & 65535, b1 = other.getBits(j) >>> 16, b0 = other.getBits(j) & 65535;
          arr[2 * i + 2 * j] += a0 * b0, Integer.carry16_(arr, 2 * i + 2 * j), arr[2 * i + 2 * j + 1] += a1 * b0, Integer.carry16_(arr, 2 * i + 2 * j + 1), arr[2 * i + 2 * j + 1] += a0 * b1, Integer.carry16_(arr, 2 * i + 2 * j + 1), arr[2 * i + 2 * j + 2] += a1 * b1, Integer.carry16_(arr, 2 * i + 2 * j + 2);
        }
      for (var i = 0; i < len; i++)
        arr[i] = arr[2 * i + 1] << 16 | arr[2 * i];
      for (var i = len; i < 2 * len; i++)
        arr[i] = 0;
      return new Integer(arr, 0);
    };
    Integer.carry16_ = function(bits, index) {
      for (; (bits[index] & 65535) != bits[index]; )
        bits[index + 1] += bits[index] >>> 16, bits[index] &= 65535;
    };
    Integer.prototype.divide = function(other) {
      if (other.isZero())
        throw Error("division by zero");
      if (this.isZero())
        return Integer.ZERO;
      if (this.isNegative())
        return other.isNegative() ? this.negate().divide(other.negate()) : this.negate().divide(other).negate();
      if (other.isNegative())
        return this.divide(other.negate()).negate();
      for (var res = Integer.ZERO, rem = this; rem.greaterThanOrEqual(other); ) {
        for (var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber())), log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48), approxRes = Integer.fromNumber(approx), approxRem = approxRes.multiply(other); approxRem.isNegative() || approxRem.greaterThan(rem); )
          approx -= delta, approxRes = Integer.fromNumber(approx), approxRem = approxRes.multiply(other);
        approxRes.isZero() && (approxRes = Integer.ONE), res = res.add(approxRes), rem = rem.subtract(approxRem);
      }
      return res;
    };
    Integer.prototype.modulo = function(other) {
      return this.subtract(this.divide(other).multiply(other));
    };
    Integer.prototype.not = function() {
      for (var len = this.bits_.length, arr = [], i = 0; i < len; i++)
        arr[i] = ~this.bits_[i];
      return new Integer(arr, ~this.sign_);
    };
    Integer.prototype.and = function(other) {
      for (var len = Math.max(this.bits_.length, other.bits_.length), arr = [], i = 0; i < len; i++)
        arr[i] = this.getBits(i) & other.getBits(i);
      return new Integer(arr, this.sign_ & other.sign_);
    };
    Integer.prototype.or = function(other) {
      for (var len = Math.max(this.bits_.length, other.bits_.length), arr = [], i = 0; i < len; i++)
        arr[i] = this.getBits(i) | other.getBits(i);
      return new Integer(arr, this.sign_ | other.sign_);
    };
    Integer.prototype.xor = function(other) {
      for (var len = Math.max(this.bits_.length, other.bits_.length), arr = [], i = 0; i < len; i++)
        arr[i] = this.getBits(i) ^ other.getBits(i);
      return new Integer(arr, this.sign_ ^ other.sign_);
    };
    Integer.prototype.shiftLeft = function(numBits) {
      for (var arr_delta = numBits >> 5, bit_delta = numBits % 32, len = this.bits_.length + arr_delta + (bit_delta > 0 ? 1 : 0), arr = [], i = 0; i < len; i++)
        bit_delta > 0 ? arr[i] = this.getBits(i - arr_delta) << bit_delta | this.getBits(i - arr_delta - 1) >>> 32 - bit_delta : arr[i] = this.getBits(i - arr_delta);
      return new Integer(arr, this.sign_);
    };
    Integer.prototype.shiftRight = function(numBits) {
      for (var arr_delta = numBits >> 5, bit_delta = numBits % 32, len = this.bits_.length - arr_delta, arr = [], i = 0; i < len; i++)
        bit_delta > 0 ? arr[i] = this.getBits(i + arr_delta) >>> bit_delta | this.getBits(i + arr_delta + 1) << 32 - bit_delta : arr[i] = this.getBits(i + arr_delta);
      return new Integer(arr, this.sign_);
    };
    Integer.prototype.inspect = function() {
      return this.constructor.name + ": " + this.toString();
    };
    Integer.prototype.abs = function() {
      return this.sign_ === 0 ? this : this.negate();
    };
    Integer.prototype.toJSON = function() {
      return this.toString();
    };
    module2.exports = Integer;
  }
});

// node_modules/cassandra-driver/lib/types/big-decimal.js
var require_big_decimal = __commonJS({
  "node_modules/cassandra-driver/lib/types/big-decimal.js"(exports2, module2) {
    "use strict";
    var Integer = require_integer(), utils = require_utils();
    function BigDecimal(unscaledValue, scale) {
      typeof unscaledValue == "number" && (unscaledValue = Integer.fromNumber(unscaledValue)), this._intVal = unscaledValue, this._scale = scale;
    }
    BigDecimal.fromBuffer = function(buf) {
      let scale = buf.readInt32BE(0), unscaledValue = Integer.fromBuffer(buf.slice(4));
      return new BigDecimal(unscaledValue, scale);
    };
    BigDecimal.toBuffer = function(value) {
      let unscaledValueBuffer = Integer.toBuffer(value._intVal), scaleBuffer = utils.allocBufferUnsafe(4);
      return scaleBuffer.writeInt32BE(value._scale, 0), Buffer.concat([scaleBuffer, unscaledValueBuffer], scaleBuffer.length + unscaledValueBuffer.length);
    };
    BigDecimal.fromString = function(value) {
      if (!value)
        throw new TypeError("Invalid null or undefined value");
      value = value.trim();
      let scaleIndex = value.indexOf("."), scale = 0;
      return scaleIndex >= 0 && (scale = value.length - 1 - scaleIndex, value = value.substr(0, scaleIndex) + value.substr(scaleIndex + 1)), new BigDecimal(Integer.fromString(value), scale);
    };
    BigDecimal.fromNumber = function(value) {
      if (isNaN(value))
        return new BigDecimal(Integer.ZERO, 0);
      let textValue = value.toString();
      return textValue.indexOf("e") >= 0 && (textValue = value.toFixed(20)), BigDecimal.fromString(textValue);
    };
    BigDecimal.prototype.equals = function(other) {
      return other instanceof BigDecimal && this.compare(other) === 0;
    };
    BigDecimal.prototype.inspect = function() {
      return this.constructor.name + ": " + this.toString();
    };
    BigDecimal.prototype.notEquals = function(other) {
      return !this.equals(other);
    };
    BigDecimal.prototype.compare = function(other) {
      let diff = this.subtract(other);
      return diff.isNegative() ? -1 : diff.isZero() ? 0 : 1;
    };
    BigDecimal.prototype.subtract = function(other) {
      let first = this;
      if (first._scale === other._scale)
        return new BigDecimal(first._intVal.subtract(other._intVal), first._scale);
      let diffScale, unscaledValue;
      return first._scale < other._scale ? (diffScale = other._scale - first._scale, unscaledValue = first._intVal.multiply(Integer.fromNumber(Math.pow(10, diffScale))).subtract(other._intVal), new BigDecimal(unscaledValue, other._scale)) : (diffScale = first._scale - other._scale, unscaledValue = first._intVal.subtract(
        other._intVal.multiply(Integer.fromNumber(Math.pow(10, diffScale)))
      ), new BigDecimal(unscaledValue, first._scale));
    };
    BigDecimal.prototype.add = function(other) {
      let first = this;
      if (first._scale === other._scale)
        return new BigDecimal(first._intVal.add(other._intVal), first._scale);
      let diffScale, unscaledValue;
      return first._scale < other._scale ? (diffScale = other._scale - first._scale, unscaledValue = first._intVal.multiply(Integer.fromNumber(Math.pow(10, diffScale))).add(other._intVal), new BigDecimal(unscaledValue, other._scale)) : (diffScale = first._scale - other._scale, unscaledValue = first._intVal.add(
        other._intVal.multiply(Integer.fromNumber(Math.pow(10, diffScale)))
      ), new BigDecimal(unscaledValue, first._scale));
    };
    BigDecimal.prototype.greaterThan = function(other) {
      return this.compare(other) === 1;
    };
    BigDecimal.prototype.isNegative = function() {
      return this._intVal.isNegative();
    };
    BigDecimal.prototype.isZero = function() {
      return this._intVal.isZero();
    };
    BigDecimal.prototype.toString = function() {
      let intString = this._intVal.toString();
      if (this._scale === 0)
        return intString;
      let signSymbol = "";
      intString.charAt(0) === "-" && (signSymbol = "-", intString = intString.substr(1));
      let separatorIndex = intString.length - this._scale;
      return separatorIndex <= 0 && (intString = utils.stringRepeat("0", -separatorIndex + 1) + intString, separatorIndex = intString.length - this._scale), signSymbol + intString.substr(0, separatorIndex) + "." + intString.substr(separatorIndex);
    };
    BigDecimal.prototype.toNumber = function() {
      return parseFloat(this.toString());
    };
    BigDecimal.prototype.toJSON = function() {
      return this.toString();
    };
    module2.exports = BigDecimal;
  }
});

// node_modules/cassandra-driver/lib/types/duration.js
var require_duration = __commonJS({
  "node_modules/cassandra-driver/lib/types/duration.js"(exports2, module2) {
    "use strict";
    var Long = require_umd(), util = require("util"), utils = require_utils(), VIntCoding = utils.VIntCoding, reusableBuffers = {
      months: utils.allocBuffer(9),
      days: utils.allocBuffer(9),
      nanoseconds: utils.allocBuffer(9)
    }, maxInt32 = 2147483647, longOneThousand = Long.fromInt(1e3), nanosPerMicro = longOneThousand, nanosPerMilli = longOneThousand.multiply(nanosPerMicro), nanosPerSecond = longOneThousand.multiply(nanosPerMilli), nanosPerMinute = Long.fromInt(60).multiply(nanosPerSecond), nanosPerHour = Long.fromInt(60).multiply(nanosPerMinute), daysPerWeek = 7, monthsPerYear = 12, standardRegex = /(\d+)(y|mo|w|d|h|s|ms|us|µs|ns|m)/gi, iso8601Regex = /P((\d+)Y)?((\d+)M)?((\d+)D)?(T((\d+)H)?((\d+)M)?((\d+)S)?)?/, iso8601WeekRegex = /P(\d+)W/, iso8601AlternateRegex = /P(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    function Duration(months, days, nanoseconds) {
      this.months = months, this.days = days, this.nanoseconds = typeof nanoseconds == "number" ? Long.fromNumber(nanoseconds) : nanoseconds;
    }
    Duration.prototype.equals = function(other) {
      return other instanceof Duration ? this.months === other.months && this.days === other.days && this.nanoseconds.equals(other.nanoseconds) : !1;
    };
    Duration.prototype.toBuffer = function() {
      let lengthMonths = VIntCoding.writeVInt(Long.fromNumber(this.months), reusableBuffers.months), lengthDays = VIntCoding.writeVInt(Long.fromNumber(this.days), reusableBuffers.days), lengthNanoseconds = VIntCoding.writeVInt(this.nanoseconds, reusableBuffers.nanoseconds), buffer = utils.allocBufferUnsafe(lengthMonths + lengthDays + lengthNanoseconds);
      reusableBuffers.months.copy(buffer, 0, 0, lengthMonths);
      let offset = lengthMonths;
      return reusableBuffers.days.copy(buffer, offset, 0, lengthDays), offset += lengthDays, reusableBuffers.nanoseconds.copy(buffer, offset, 0, lengthNanoseconds), buffer;
    };
    Duration.prototype.toString = function() {
      let value = "";
      function append(dividend, divisor, unit) {
        return dividend === 0 || dividend < divisor ? dividend : (value += (dividend / divisor).toFixed(0) + unit, dividend % divisor);
      }
      function append64(dividend, divisor, unit) {
        return dividend.equals(Long.ZERO) || dividend.lessThan(divisor) ? dividend : (value += dividend.divide(divisor).toString() + unit, dividend.modulo(divisor));
      }
      (this.months < 0 || this.days < 0 || this.nanoseconds.isNegative()) && (value = "-");
      let remainder = append(Math.abs(this.months), monthsPerYear, "y");
      if (append(remainder, 1, "mo"), append(Math.abs(this.days), 1, "d"), !this.nanoseconds.equals(Long.ZERO)) {
        let nanos = this.nanoseconds.isNegative() ? this.nanoseconds.negate() : this.nanoseconds;
        remainder = append64(nanos, nanosPerHour, "h"), remainder = append64(remainder, nanosPerMinute, "m"), remainder = append64(remainder, nanosPerSecond, "s"), remainder = append64(remainder, nanosPerMilli, "ms"), remainder = append64(remainder, nanosPerMicro, "us"), append64(remainder, Long.ONE, "ns");
      }
      return value;
    };
    Duration.fromBuffer = function(buffer) {
      let offset = { value: 0 }, months = VIntCoding.readVInt(buffer, offset).toNumber(), days = VIntCoding.readVInt(buffer, offset).toNumber(), nanoseconds = VIntCoding.readVInt(buffer, offset);
      return new Duration(months, days, nanoseconds);
    };
    Duration.fromString = function(input) {
      let isNegative = input.charAt(0) === "-", source = isNegative ? input.substr(1) : input;
      return source.charAt(0) === "P" ? source.charAt(source.length - 1) === "W" ? parseIso8601WeekFormat(isNegative, source) : source.indexOf("-") > 0 ? parseIso8601AlternativeFormat(isNegative, source) : parseIso8601Format(isNegative, source) : parseStandardFormat(isNegative, source);
    };
    function parseStandardFormat(isNegative, source) {
      let builder = new Builder(isNegative);
      standardRegex.lastIndex = 0;
      let matches;
      for (; (matches = standardRegex.exec(source)) && matches.length <= 3; )
        builder.add(matches[1], matches[2]);
      return builder.build();
    }
    function parseIso8601Format(isNegative, source) {
      let matches = iso8601Regex.exec(source);
      if (!matches || matches[0] !== source)
        throw new TypeError(util.format("Unable to convert '%s' to a duration", source));
      let builder = new Builder(isNegative);
      return matches[1] && builder.addYears(matches[2]), matches[3] && builder.addMonths(matches[4]), matches[5] && builder.addDays(matches[6]), matches[7] && (matches[8] && builder.addHours(matches[9]), matches[10] && builder.addMinutes(matches[11]), matches[12] && builder.addSeconds(matches[13])), builder.build();
    }
    function parseIso8601WeekFormat(isNegative, source) {
      let matches = iso8601WeekRegex.exec(source);
      if (!matches || matches[0] !== source)
        throw new TypeError(util.format("Unable to convert '%s' to a duration", source));
      return new Builder(isNegative).addWeeks(matches[1]).build();
    }
    function parseIso8601AlternativeFormat(isNegative, source) {
      let matches = iso8601AlternateRegex.exec(source);
      if (!matches || matches[0] !== source)
        throw new TypeError(util.format("Unable to convert '%s' to a duration", source));
      return new Builder(isNegative).addYears(matches[1]).addMonths(matches[2]).addDays(matches[3]).addHours(matches[4]).addMinutes(matches[5]).addSeconds(matches[6]).build();
    }
    function Builder(isNegative) {
      this._isNegative = isNegative, this._unitIndex = 0, this._months = 0, this._days = 0, this._nanoseconds = Long.ZERO, this._addMethods = {
        y: this.addYears,
        mo: this.addMonths,
        w: this.addWeeks,
        d: this.addDays,
        h: this.addHours,
        m: this.addMinutes,
        s: this.addSeconds,
        ms: this.addMillis,
        // µs
        \u00B5s: this.addMicros,
        us: this.addMicros,
        ns: this.addNanos
      }, this._unitByIndex = [
        null,
        "years",
        "months",
        "weeks",
        "days",
        "hours",
        "minutes",
        "seconds",
        "milliseconds",
        "microseconds",
        "nanoseconds"
      ];
    }
    Builder.prototype._validateOrder = function(unitIndex) {
      if (unitIndex === this._unitIndex)
        throw new TypeError(util.format("Invalid duration. The %s are specified multiple times", this._getUnitName(unitIndex)));
      if (unitIndex <= this._unitIndex)
        throw new TypeError(util.format(
          "Invalid duration. The %s should be after %s",
          this._getUnitName(this._unitIndex),
          this._getUnitName(unitIndex)
        ));
      this._unitIndex = unitIndex;
    };
    Builder.prototype._validateMonths = function(units, monthsPerUnit) {
      this._validate32(units, (maxInt32 - this._months) / monthsPerUnit, "months");
    };
    Builder.prototype._validateDays = function(units, daysPerUnit) {
      this._validate32(units, (maxInt32 - this._days) / daysPerUnit, "days");
    };
    Builder.prototype._validateNanos = function(units, nanosPerUnit) {
      this._validate64(units, Long.MAX_VALUE.subtract(this._nanoseconds).divide(nanosPerUnit), "nanoseconds");
    };
    Builder.prototype._validate32 = function(units, limit, unitName) {
      if (units > limit)
        throw new TypeError(util.format(
          "Invalid duration. The total number of %s must be less or equal to %s",
          unitName,
          maxInt32
        ));
    };
    Builder.prototype._validate64 = function(units, limit, unitName) {
      if (units.greaterThan(limit))
        throw new TypeError(util.format(
          "Invalid duration. The total number of %s must be less or equal to %s",
          unitName,
          Long.MAX_VALUE.toString()
        ));
    };
    Builder.prototype._getUnitName = function(unitIndex) {
      let name = this._unitByIndex[+unitIndex];
      if (!name)
        throw new Error("unknown unit index: " + unitIndex);
      return name;
    };
    Builder.prototype.add = function(textValue, symbol) {
      let addMethod = this._addMethods[symbol.toLowerCase()];
      if (!addMethod)
        throw new TypeError(util.format("Unknown duration symbol '%s'", symbol));
      return addMethod.call(this, textValue);
    };
    Builder.prototype.addYears = function(years) {
      let value = +years;
      return this._validateOrder(1), this._validateMonths(value, monthsPerYear), this._months += value * monthsPerYear, this;
    };
    Builder.prototype.addMonths = function(months) {
      let value = +months;
      return this._validateOrder(2), this._validateMonths(value, 1), this._months += value, this;
    };
    Builder.prototype.addWeeks = function(weeks) {
      let value = +weeks;
      return this._validateOrder(3), this._validateDays(value, daysPerWeek), this._days += value * daysPerWeek, this;
    };
    Builder.prototype.addDays = function(days) {
      let value = +days;
      return this._validateOrder(4), this._validateDays(value, 1), this._days += value, this;
    };
    Builder.prototype.addHours = function(hours) {
      let value = typeof hours == "string" ? Long.fromString(hours) : hours;
      return this._validateOrder(5), this._validateNanos(value, nanosPerHour), this._nanoseconds = this._nanoseconds.add(value.multiply(nanosPerHour)), this;
    };
    Builder.prototype.addMinutes = function(minutes) {
      let value = typeof minutes == "string" ? Long.fromString(minutes) : minutes;
      return this._validateOrder(6), this._validateNanos(value, nanosPerMinute), this._nanoseconds = this._nanoseconds.add(value.multiply(nanosPerMinute)), this;
    };
    Builder.prototype.addSeconds = function(seconds) {
      let value = typeof seconds == "string" ? Long.fromString(seconds) : seconds;
      return this._validateOrder(7), this._validateNanos(value, nanosPerSecond), this._nanoseconds = this._nanoseconds.add(value.multiply(nanosPerSecond)), this;
    };
    Builder.prototype.addMillis = function(millis) {
      let value = typeof millis == "string" ? Long.fromString(millis) : millis;
      return this._validateOrder(8), this._validateNanos(value, nanosPerMilli), this._nanoseconds = this._nanoseconds.add(value.multiply(nanosPerMilli)), this;
    };
    Builder.prototype.addMicros = function(micros) {
      let value = typeof micros == "string" ? Long.fromString(micros) : micros;
      return this._validateOrder(9), this._validateNanos(value, nanosPerMicro), this._nanoseconds = this._nanoseconds.add(value.multiply(nanosPerMicro)), this;
    };
    Builder.prototype.addNanos = function(nanos) {
      let value = typeof nanos == "string" ? Long.fromString(nanos) : nanos;
      return this._validateOrder(10), this._validateNanos(value, Long.ONE), this._nanoseconds = this._nanoseconds.add(value), this;
    };
    Builder.prototype.build = function() {
      return this._isNegative ? new Duration(-this._months, -this._days, this._nanoseconds.negate()) : new Duration(this._months, this._days, this._nanoseconds);
    };
    module2.exports = Duration;
  }
});

// node_modules/cassandra-driver/lib/types/inet-address.js
var require_inet_address = __commonJS({
  "node_modules/cassandra-driver/lib/types/inet-address.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    function InetAddress(buffer) {
      if (!(buffer instanceof Buffer) || buffer.length !== 4 && buffer.length !== 16)
        throw new TypeError("The ip address must contain 4 or 16 bytes");
      this.buffer = buffer, this.length = buffer.length, this.version = buffer.length === 4 ? 4 : 6;
    }
    InetAddress.fromString = function(value) {
      if (!value)
        return new InetAddress(utils.allocBufferFromArray([0, 0, 0, 0]));
      let ipv4Pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, ipv6Pattern = /^[\da-f:.]+$/i, parts;
      if (ipv4Pattern.test(value))
        return parts = value.split("."), new InetAddress(utils.allocBufferFromArray(parts));
      if (!ipv6Pattern.test(value))
        throw new TypeError("Value could not be parsed as InetAddress: " + value);
      if (parts = value.split(":"), parts.length < 3)
        throw new TypeError("Value could not be parsed as InetAddress: " + value);
      let buffer = utils.allocBufferUnsafe(16), filling = 8 - parts.length + 1, applied = !1, offset = 0, embeddedIp4 = ipv4Pattern.test(parts[parts.length - 1]);
      embeddedIp4 && (filling -= 1);
      function writeItem(uIntValue) {
        buffer.writeUInt8(+uIntValue, offset++);
      }
      for (let i = 0; i < parts.length; i++) {
        let item = parts[i];
        if (item) {
          if (embeddedIp4 && i === parts.length - 1) {
            item.split(".").forEach(writeItem);
            break;
          }
          buffer.writeUInt16BE(parseInt(item, 16), offset), offset = offset + 2;
          continue;
        }
        applied && (filling = 1), applied = !0;
        for (let j = 0; j < filling; j++)
          buffer[offset++] = 0, buffer[offset++] = 0;
      }
      if (embeddedIp4 && !isValidIPv4Mapped(buffer))
        throw new TypeError("Only IPv4-Mapped IPv6 addresses are allowed as IPv6 address with embedded IPv4 address");
      return new InetAddress(buffer);
    };
    InetAddress.prototype.equals = function(other) {
      return other instanceof InetAddress ? this.buffer.length === other.buffer.length && this.buffer.toString("hex") === other.buffer.toString("hex") : !1;
    };
    InetAddress.prototype.getBuffer = function() {
      return this.buffer;
    };
    InetAddress.prototype.inspect = function() {
      return this.constructor.name + ": " + this.toString();
    };
    InetAddress.prototype.toString = function(encoding) {
      if (encoding === "hex")
        return this.buffer.toString("hex");
      if (this.buffer.length === 4)
        return this.buffer[0] + "." + this.buffer[1] + "." + this.buffer[2] + "." + this.buffer[3];
      let start = -1, longest = { length: 0, start: -1 };
      function checkLongest(i) {
        if (start >= 0) {
          let length = i - start;
          length > longest.length && (longest.length = length, longest.start = start, start = -1);
        }
      }
      for (let i = 0; i < this.buffer.length; i = i + 2) {
        if (this.buffer[i] === 0 && this.buffer[i + 1] === 0) {
          start < 0 && (start = i), i === this.buffer.length - 2 && checkLongest(i + 2);
          continue;
        }
        checkLongest(i);
      }
      let address = "";
      for (let h = 0; h < this.buffer.length; h = h + 2) {
        if (h === longest.start) {
          address += ":";
          continue;
        }
        h < longest.start + longest.length && h > longest.start || (address.length > 0 && (address += ":"), address += (this.buffer[h] << 8 | this.buffer[h + 1]).toString(16));
      }
      return address.charAt(address.length - 1) === ":" && (address += ":"), address;
    };
    InetAddress.prototype.toJSON = function() {
      return this.toString();
    };
    function isValidIPv4Mapped(buffer) {
      for (let i = 0; i < buffer.length - 6; i++)
        if (buffer[i] !== 0)
          return !1;
      return !(buffer[10] !== 255 || buffer[11] !== 255);
    }
    module2.exports = InetAddress;
  }
});

// node_modules/cassandra-driver/lib/types/local-date.js
var require_local_date = __commonJS({
  "node_modules/cassandra-driver/lib/types/local-date.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), millisecondsPerDay = 864e5, dateCenter = Math.pow(2, 31);
    function LocalDate(year, month, day) {
      if (typeof year == "number" && typeof month == "number" && typeof day == "number") {
        if (this.date = /* @__PURE__ */ new Date(), this.date.setUTCHours(0, 0, 0, 0), this.date.setUTCFullYear(year, month - 1, day), isNaN(this.date.getTime()))
          throw new Error(util.format(
            "%d-%d-%d does not form a valid ES5 date!",
            year,
            month,
            day
          ));
      } else if (typeof month > "u" && typeof day > "u" && typeof year == "number") {
        if (year < -2147483648 || year > 2147483647)
          throw new Error("You must provide a valid value for days since epoch (-2147483648 <= value <= 2147483647).");
        this.date = new Date(year * millisecondsPerDay);
      }
      if (typeof this.date > "u")
        throw new Error("You must provide a valid year, month and day");
      this._value = isNaN(this.date.getTime()) ? year : null, this.year = this.date.getUTCFullYear(), this.month = this.date.getUTCMonth() + 1, this.day = this.date.getUTCDate();
    }
    LocalDate.now = function() {
      return LocalDate.fromDate(/* @__PURE__ */ new Date());
    };
    LocalDate.utcNow = function() {
      return new LocalDate(Date.now());
    };
    LocalDate.fromDate = function(date) {
      if (isNaN(date.getTime()))
        throw new TypeError("Invalid date: " + date);
      return new LocalDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    };
    LocalDate.fromString = function(value) {
      if ((value.match(/-/g) || []).length >= 2) {
        let multiplier = 1;
        value[0] === "-" && (value = value.substring(1), multiplier = -1);
        let parts = value.split("-");
        return new LocalDate(multiplier * parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10));
      }
      if (value.match(/^-?\d+$/))
        return new LocalDate(parseInt(value, 10));
      throw new Error("Invalid input '" + value + "'.");
    };
    LocalDate.fromBuffer = function(buffer) {
      return new LocalDate(buffer.readUInt32BE(0) - dateCenter);
    };
    LocalDate.prototype.compare = function(other) {
      let thisValue = isNaN(this.date.getTime()) ? this._value * millisecondsPerDay : this.date.getTime(), otherValue = isNaN(other.date.getTime()) ? other._value * millisecondsPerDay : other.date.getTime(), diff = thisValue - otherValue;
      return diff < 0 ? -1 : diff > 0 ? 1 : 0;
    };
    LocalDate.prototype.equals = function(other) {
      return other instanceof LocalDate && this.compare(other) === 0;
    };
    LocalDate.prototype.inspect = function() {
      return this.constructor.name + ": " + this.toString();
    };
    LocalDate.prototype.toBuffer = function() {
      let value = (isNaN(this.date.getTime()) ? this._value : Math.floor(this.date.getTime() / millisecondsPerDay)) + dateCenter, buf = utils.allocBufferUnsafe(4);
      return buf.writeUInt32BE(value, 0), buf;
    };
    LocalDate.prototype.toString = function() {
      let result;
      return isNaN(this.date.getTime()) ? this._value.toString() : (this.year < 0 ? result = "-" + fillZeros((this.year * -1).toString(), 4) : result = fillZeros(this.year.toString(), 4), result += "-" + fillZeros(this.month.toString(), 2) + "-" + fillZeros(this.day.toString(), 2), result);
    };
    LocalDate.prototype.toJSON = function() {
      return this.toString();
    };
    function fillZeros(value, amount) {
      return value.length >= amount ? value : utils.stringRepeat("0", amount - value.length) + value;
    }
    module2.exports = LocalDate;
  }
});

// node_modules/cassandra-driver/lib/types/local-time.js
var require_local_time = __commonJS({
  "node_modules/cassandra-driver/lib/types/local-time.js"(exports2, module2) {
    "use strict";
    var Long = require_umd(), util = require("util"), utils = require_utils(), maxNanos = Long.fromString("86399999999999"), nanoSecInSec = Long.fromNumber(1e9), nanoSecInMillis = Long.fromNumber(1e6), millisInDay = 864e5;
    function LocalTime(totalNanoseconds) {
      if (!(totalNanoseconds instanceof Long))
        throw new Error("You must specify a Long value as totalNanoseconds");
      if (totalNanoseconds.lessThan(Long.ZERO) || totalNanoseconds.greaterThan(maxNanos))
        throw new Error("Total nanoseconds out of range");
      this.value = totalNanoseconds, this.hour = this._getParts()[0], this.minute = this._getParts()[1], this.second = this._getParts()[2], this.nanosecond = this._getParts()[3];
    }
    LocalTime.fromString = function(value) {
      if (typeof value != "string")
        throw new Error("Argument type invalid: " + util.inspect(value));
      let parts = value.split(":"), millis = parseInt(parts[0], 10) * 36e5 + parseInt(parts[1], 10) * 6e4, nanos;
      if (parts.length === 3) {
        let secParts = parts[2].split(".");
        millis += parseInt(secParts[0], 10) * 1e3, secParts.length === 2 && (nanos = secParts[1], nanos = nanos + utils.stringRepeat("0", 9 - nanos.length));
      }
      return LocalTime.fromMilliseconds(millis, parseInt(nanos, 10) || 0);
    };
    LocalTime.now = function(nanoseconds) {
      return LocalTime.fromDate(/* @__PURE__ */ new Date(), nanoseconds);
    };
    LocalTime.fromDate = function(date, nanoseconds) {
      if (!(date instanceof Date))
        throw new Error("Not a valid date");
      let millis = (date.getTime() + date.getTimezoneOffset() * -6e4) % millisInDay;
      return LocalTime.fromMilliseconds(millis, nanoseconds);
    };
    LocalTime.fromMilliseconds = function(milliseconds, nanoseconds) {
      return typeof nanoseconds != "number" && (nanoseconds = 0), new LocalTime(Long.fromNumber(milliseconds).multiply(nanoSecInMillis).add(Long.fromNumber(nanoseconds)));
    };
    LocalTime.fromBuffer = function(value) {
      if (!(value instanceof Buffer))
        throw new TypeError("Expected Buffer, obtained " + util.inspect(value));
      return new LocalTime(new Long(value.readInt32BE(4), value.readInt32BE(0)));
    };
    LocalTime.prototype.compare = function(other) {
      return this.value.compare(other.value);
    };
    LocalTime.prototype.equals = function(other) {
      return other instanceof LocalTime && this.compare(other) === 0;
    };
    LocalTime.prototype.getTotalNanoseconds = function() {
      return this.value;
    };
    LocalTime.prototype.inspect = function() {
      return this.constructor.name + ": " + this.toString();
    };
    LocalTime.prototype.toBuffer = function() {
      let buffer = utils.allocBufferUnsafe(8);
      return buffer.writeUInt32BE(this.value.getHighBitsUnsigned(), 0), buffer.writeUInt32BE(this.value.getLowBitsUnsigned(), 4), buffer;
    };
    LocalTime.prototype.toString = function() {
      return formatTime(this._getParts());
    };
    LocalTime.prototype.toJSON = function() {
      return this.toString();
    };
    LocalTime.prototype._getParts = function() {
      if (!this._partsCache) {
        let parts = [0, 0, 0, 0], secs = this.value.div(nanoSecInSec);
        parts[3] = this.value.subtract(secs.multiply(nanoSecInSec)).toNumber(), parts[2] = secs.toNumber(), parts[2] >= 60 && (parts[1] = Math.floor(parts[2] / 60), parts[2] = parts[2] % 60), parts[1] >= 60 && (parts[0] = Math.floor(parts[1] / 60), parts[1] = parts[1] % 60), this._partsCache = parts;
      }
      return this._partsCache;
    };
    function formatTime(values) {
      let result;
      if (values[0] < 10 ? result = "0" + values[0] + ":" : result = values[0] + ":", values[1] < 10 ? result += "0" + values[1] + ":" : result += values[1] + ":", values[2] < 10 ? result += "0" + values[2] : result += values[2], values[3] > 0) {
        let nanos = values[3].toString();
        nanos.length < 9 && (nanos = utils.stringRepeat("0", 9 - nanos.length) + nanos);
        let lastPosition;
        for (let i = nanos.length - 1; i > 0 && nanos[i] === "0"; i--)
          lastPosition = i;
        lastPosition && (nanos = nanos.substring(0, lastPosition)), result += "." + nanos;
      }
      return result;
    }
    module2.exports = LocalTime;
  }
});

// node_modules/cassandra-driver/lib/types/result-set.js
var require_result_set = __commonJS({
  "node_modules/cassandra-driver/lib/types/result-set.js"(exports2, module2) {
    "use strict";
    var utils = require_utils(), errors = require_errors(), asyncIteratorSymbol = Symbol.asyncIterator || "@@asyncIterator";
    function ResultSet(response, host, triedHosts, speculativeExecutions, consistency, isSchemaInAgreement) {
      speculativeExecutions === -1 && (speculativeExecutions = 0), this.info = {
        queriedHost: host,
        triedHosts,
        speculativeExecutions,
        achievedConsistency: consistency,
        traceId: null,
        warnings: null,
        customPayload: null,
        isSchemaInAgreement
      }, response.flags && (this.info.traceId = response.flags.traceId, this.info.warnings = response.flags.warnings, this.info.customPayload = response.flags.customPayload), this.rows = response.rows, this.rowLength = this.rows ? this.rows.length : response.rowLength, this.columns = null, this.pageState = null, this.nextPage = void 0, this.nextPageAsync = void 0;
      let meta = response.meta;
      meta && (this.columns = meta.columns, meta.pageState && (this.pageState = meta.pageState.toString("hex"), Object.defineProperty(this, "rawPageState", { value: meta.pageState, enumerable: !1 })));
    }
    ResultSet.prototype.first = function() {
      return this.rows && this.rows.length ? this.rows[0] : null;
    };
    ResultSet.prototype.getPageState = function() {
      return this.pageState;
    };
    ResultSet.prototype.getColumns = function() {
      return this.columns;
    };
    ResultSet.prototype.wasApplied = function() {
      if (!this.rows || this.rows.length === 0)
        return !0;
      let applied = this.rows[0]["[applied]"];
      return typeof applied == "boolean" ? applied : !0;
    };
    ResultSet.prototype[Symbol.iterator] = function() {
      return this.rows ? this.rows[Symbol.iterator]() : utils.emptyArray[Symbol.iterator]();
    };
    ResultSet.prototype[asyncIteratorSymbol] = function() {
      let index = 0, pageState = this.rawPageState, rows = this.rows;
      if (!rows || rows.length === 0)
        return { next: () => Promise.resolve({ done: !0 }) };
      let self = this;
      return {
        async next() {
          if (index >= rows.length && pageState) {
            if (!self.nextPageAsync)
              throw new errors.DriverInternalError("Property nextPageAsync should be set when pageState is defined");
            let rs = await self.nextPageAsync(pageState);
            rows = rs.rows, index = 0, pageState = rs.rawPageState;
          }
          return index < rows.length ? { done: !1, value: rows[index++] } : { done: !0 };
        }
      };
    };
    ResultSet.prototype.isPaged = function() {
      return !!this.rawPageState;
    };
    module2.exports = ResultSet;
  }
});

// node_modules/cassandra-driver/lib/types/result-stream.js
var require_result_stream = __commonJS({
  "node_modules/cassandra-driver/lib/types/result-stream.js"(exports2, module2) {
    "use strict";
    var { Readable } = require("stream"), utils = require_utils(), errors = require_errors(), clientOptions = require_client_options(), ResultStream = class extends Readable {
      constructor(opt) {
        super(opt), this.buffer = [], this.paused = !0, this._cancelAllowed = !1, this._handlersObject = null, this._highWaterMarkRows = 0;
      }
      _read() {
        for (this.paused = !1, this.buffer.length === 0 && (this._readableState.reading = !1); !this.paused && this.buffer.length > 0; )
          this.paused = !this.push(this.buffer.shift());
        this._checkBelowHighWaterMark(), !this.paused && !this.buffer.length && this._readNext && (this._readNext(), this._readNext = null);
      }
      /**
       * Allows for throttling, helping nodejs keep the internal buffers reasonably sized.
       * @param {function} readNext function that triggers reading the next result chunk
       * @ignore
       */
      _valve(readNext) {
        this._readNext = null, readNext && (this.paused || this.buffer.length ? this._readNext = readNext : readNext());
      }
      add(chunk) {
        let length = this.buffer.push(chunk);
        return this.read(0), this._checkAboveHighWaterMark(), length;
      }
      _checkAboveHighWaterMark() {
        !this._handlersObject || !this._handlersObject.resumeReadingHandler || this._highWaterMarkRows === 0 || this.buffer.length !== this._highWaterMarkRows || this._handlersObject.resumeReadingHandler(!1);
      }
      _checkBelowHighWaterMark() {
        !this._handlersObject || !this._handlersObject.resumeReadingHandler || this._highWaterMarkRows === 0 || this.buffer.length >= this._highWaterMarkRows || this._handlersObject.resumeReadingHandler(!0);
      }
      /**
       * When continuous paging is enabled, allows the client to notify to the server to stop pushing further pages.
       * <p>Note: This is not part of the public API yet.</p>
       * @param {Function} [callback] The cancel method accepts an optional callback.
       * @example <caption>Cancelling a continuous paging execution</caption>
       * const stream = client.stream(query, params, { prepare: true, continuousPaging: true });
       * // ...
       * // Ask the server to stop pushing rows.
       * stream.cancel();
       * @ignore
       */
      cancel(callback) {
        if (!this._cancelAllowed) {
          let err = new Error("You can only cancel streaming executions when continuous paging is enabled");
          if (!callback)
            throw err;
          return callback(err);
        }
        if (!this._handlersObject)
          throw new errors.DriverInternalError("ResultStream cancel is allowed but the cancel options were not set");
        if (callback = callback || utils.noop, !this._handlersObject.cancelHandler) {
          this._handlersObject.cancelHandler = callback;
          return;
        }
        this._handlersObject.cancelHandler(callback);
      }
      /**
       * Sets the pointer to the handler to be used to cancel the continuous page execution.
       * @param options
       * @internal
       * @ignore
       */
      setHandlers(options) {
        options.continuousPaging && (this._cancelAllowed = !0, this._handlersObject = options, this._highWaterMarkRows = options.continuousPaging.highWaterMarkRows || clientOptions.continuousPageDefaultHighWaterMark);
      }
    };
    module2.exports = ResultStream;
  }
});

// node_modules/cassandra-driver/lib/types/row.js
var require_row = __commonJS({
  "node_modules/cassandra-driver/lib/types/row.js"(exports2, module2) {
    "use strict";
    function Row(columns) {
      if (!columns)
        throw new Error("Columns not defined");
      Object.defineProperty(this, "__columns", { value: columns, enumerable: !1, writable: !1 });
    }
    Row.prototype.get = function(columnName) {
      return typeof columnName == "number" ? this[this.__columns[columnName].name] : this[columnName];
    };
    Row.prototype.values = function() {
      let valuesArray = [];
      return this.forEach(function(val) {
        valuesArray.push(val);
      }), valuesArray;
    };
    Row.prototype.keys = function() {
      let keysArray = [];
      return this.forEach(function(val, key) {
        keysArray.push(key);
      }), keysArray;
    };
    Row.prototype.forEach = function(callback) {
      for (let columnName in this)
        this.hasOwnProperty(columnName) && callback(this[columnName], columnName);
    };
    module2.exports = Row;
  }
});

// node_modules/cassandra-driver/lib/types/tuple.js
var require_tuple = __commonJS({
  "node_modules/cassandra-driver/lib/types/tuple.js"(exports2, module2) {
    "use strict";
    function Tuple(...args) {
      if (this.elements = args, this.elements.length === 0)
        throw new TypeError("Tuple must contain at least one value");
      this.length = this.elements.length;
    }
    Tuple.fromArray = function(elements) {
      return new Tuple(...elements);
    };
    Tuple.prototype.get = function(index) {
      return this.elements[index || 0];
    };
    Tuple.prototype.toString = function() {
      return "(" + this.elements.reduce(function(prev, x, i) {
        return prev + (i > 0 ? "," : "") + x.toString();
      }, "") + ")";
    };
    Tuple.prototype.toJSON = function() {
      return this.elements;
    };
    Tuple.prototype.values = function() {
      return this.elements.slice(0);
    };
    module2.exports = Tuple;
  }
});

// node_modules/cassandra-driver/lib/types/vector.js
var require_vector = __commonJS({
  "node_modules/cassandra-driver/lib/types/vector.js"(exports2, module2) {
    "use strict";
    var util = require("node:util"), Vector = class _Vector {
      /**
         *
         * @param {Float32Array | Array<any>} elements
         * @param {string} [subtype]
         */
      constructor(elements, subtype) {
        if (elements instanceof Float32Array)
          this.elements = Array.from(elements);
        else if (Array.isArray(elements))
          this.elements = elements;
        else
          throw new TypeError("Vector must be constructed with a Float32Array or an Array");
        if (this.elements.length === 0)
          throw new TypeError("Vector must contain at least one value");
        return this.length = this.elements.length, this.subtype = subtype, new Proxy(this, {
          get: function(obj, key) {
            return key === "IDENTITY" ? "Vector" : typeof key == "string" && Number.isInteger(Number(key)) ? obj.elements[key] : obj[key];
          },
          set: function(obj, key, value) {
            return typeof key == "string" && Number.isInteger(Number(key)) ? obj.elements[key] = value : obj[key] = value;
          },
          ownKeys: function(obj) {
            return Reflect.ownKeys(elements);
          },
          getOwnPropertyDescriptor(target, key) {
            return typeof key == "string" && Number.isInteger(Number(key)) ? { enumerable: !0, configurable: !0 } : Reflect.getOwnPropertyDescriptor(target, key);
          }
        });
      }
      /**
         * Returns the string representation of the vector.
         * @returns {string}
         */
      toString() {
        return "[".concat(this.elements.toString(), "]");
      }
      /**
         *
         * @param {number} index
         */
      at(index) {
        return this.elements[index];
      }
      /**
       * 
       * @returns {IterableIterator<any>} an iterator over the elements of the vector
       */
      [Symbol.iterator]() {
        return this.elements[Symbol.iterator]();
      }
      static get [Symbol.species]() {
        return _Vector;
      }
      forEach(callback) {
        return this.elements.forEach(callback);
      }
      /**
       * @returns {string | undefined} get the subtype string, e.g., "float", but it's optional so it can return undefined
       */
      getSubtype() {
        return this.subtype;
      }
    };
    Object.defineProperty(Vector, Symbol.hasInstance, {
      value: function(i) {
        return util.types.isProxy(i) && i.IDENTITY === "Vector" || i instanceof Float32Array;
      }
    });
    module2.exports = Vector;
  }
});

// node_modules/cassandra-driver/lib/types/index.js
var require_types = __commonJS({
  "node_modules/cassandra-driver/lib/types/index.js"(exports2) {
    "use strict";
    var util = require("util"), errors = require_errors(), TimeUuid = require_time_uuid(), Uuid = require_uuid(), protocolVersion = require_protocol_version(), utils = require_utils(), Long = require_umd(), consistencies = {
      any: 0,
      one: 1,
      two: 2,
      three: 3,
      quorum: 4,
      all: 5,
      localQuorum: 6,
      eachQuorum: 7,
      serial: 8,
      localSerial: 9,
      localOne: 10
    }, consistencyToString = {};
    consistencyToString[consistencies.any] = "ANY";
    consistencyToString[consistencies.one] = "ONE";
    consistencyToString[consistencies.two] = "TWO";
    consistencyToString[consistencies.three] = "THREE";
    consistencyToString[consistencies.quorum] = "QUORUM";
    consistencyToString[consistencies.all] = "ALL";
    consistencyToString[consistencies.localQuorum] = "LOCAL_QUORUM";
    consistencyToString[consistencies.eachQuorum] = "EACH_QUORUM";
    consistencyToString[consistencies.serial] = "SERIAL";
    consistencyToString[consistencies.localSerial] = "LOCAL_SERIAL";
    consistencyToString[consistencies.localOne] = "LOCAL_ONE";
    var dataTypes = {
      custom: 0,
      ascii: 1,
      bigint: 2,
      blob: 3,
      boolean: 4,
      counter: 5,
      decimal: 6,
      double: 7,
      float: 8,
      int: 9,
      text: 10,
      timestamp: 11,
      uuid: 12,
      varchar: 13,
      varint: 14,
      timeuuid: 15,
      inet: 16,
      date: 17,
      time: 18,
      smallint: 19,
      tinyint: 20,
      duration: 21,
      list: 32,
      map: 33,
      set: 34,
      udt: 48,
      tuple: 49,
      /**
       * Returns the typeInfo of a given type name
       * @param {string} name
       */
      getByName: function(name) {
        if (name = name.toLowerCase(), name.indexOf("<") > 0) {
          let listMatches = /^(list|set)<(.+)>$/.exec(name);
          if (listMatches)
            return { code: this[listMatches[1]], info: this.getByName(listMatches[2]) };
          let mapMatches = /^(map)< *(.+) *, *(.+)>$/.exec(name);
          if (mapMatches)
            return { code: this[mapMatches[1]], info: [this.getByName(mapMatches[2]), this.getByName(mapMatches[3])] };
          let udtMatches = /^(udt)<(.+)>$/.exec(name);
          if (udtMatches)
            return { code: this[udtMatches[1]], info: udtMatches[2] };
          let tupleMatches = /^(tuple)<(.+)>$/.exec(name);
          if (tupleMatches)
            return { code: this[tupleMatches[1]], info: tupleMatches[2].split(",").map(function(x) {
              return this.getByName(x.trim());
            }, this) };
          let vectorMatches = /^vector<\s*(.+)\s*,\s*(\d+)\s*>$/.exec(name);
          if (vectorMatches)
            return {
              code: this.custom,
              customTypeName: "vector",
              info: [this.getByName(vectorMatches[1]), parseInt(vectorMatches[2], 10)]
            };
        }
        let typeInfo = { code: this[name] };
        if (typeof typeInfo.code != "number")
          throw new TypeError("Data type with name " + name + " not valid");
        return typeInfo;
      }
    }, _dataTypesByCode = function() {
      let result = {};
      for (let key in dataTypes) {
        if (!dataTypes.hasOwnProperty(key))
          continue;
        let val = dataTypes[key];
        typeof val == "number" && (result[val] = key);
      }
      return result;
    }(), distance = {
      local: 0,
      remote: 1,
      ignored: 2
    }, opcodes = {
      error: 0,
      startup: 1,
      ready: 2,
      authenticate: 3,
      credentials: 4,
      options: 5,
      supported: 6,
      query: 7,
      result: 8,
      prepare: 9,
      execute: 10,
      register: 11,
      event: 12,
      batch: 13,
      authChallenge: 14,
      authResponse: 15,
      authSuccess: 16,
      cancel: 255,
      /**
       * Determines if the code is a valid opcode
       */
      isInRange: function(code) {
        return code > this.error && code > this.event;
      }
    }, protocolEvents = {
      topologyChange: "TOPOLOGY_CHANGE",
      statusChange: "STATUS_CHANGE",
      schemaChange: "SCHEMA_CHANGE"
    }, responseErrorCodes = {
      serverError: 0,
      protocolError: 10,
      badCredentials: 256,
      unavailableException: 4096,
      overloaded: 4097,
      isBootstrapping: 4098,
      truncateError: 4099,
      writeTimeout: 4352,
      readTimeout: 4608,
      readFailure: 4864,
      functionFailure: 5120,
      writeFailure: 5376,
      syntaxError: 8192,
      unauthorized: 8448,
      invalid: 8704,
      configError: 8960,
      alreadyExists: 9216,
      unprepared: 9472,
      clientWriteFailure: 32768
    }, resultKind = {
      voidResult: 1,
      rows: 2,
      setKeyspace: 3,
      prepared: 4,
      schemaChange: 5
    }, frameFlags = {
      compression: 1,
      tracing: 2,
      customPayload: 4,
      warning: 8
    }, unset = Object.freeze({ unset: !0 }), _longOneThousand = Long.fromInt(1e3), _timestampTicks = 0;
    function timeuuid(options, buffer, offset) {
      let date, ticks, nodeId, clockId;
      options && (typeof options.msecs == "number" && (date = new Date(options.msecs)), options.msecs instanceof Date && (date = options.msecs), Array.isArray(options.node) && (nodeId = utils.allocBufferFromArray(options.node)), typeof options.clockseq == "number" && (clockId = utils.allocBufferUnsafe(2), clockId.writeUInt16BE(options.clockseq, 0)), typeof options.nsecs == "number" && (ticks = options.nsecs));
      let uuid2 = new TimeUuid(date, ticks, nodeId, clockId);
      return buffer instanceof Buffer ? (uuid2.getBuffer().copy(buffer, offset || 0), buffer) : uuid2.toString();
    }
    function uuid(options, buffer, offset) {
      let uuid2;
      return options && Array.isArray(options.random) && (uuid2 = new Uuid(utils.allocBufferFromArray(options.random))), uuid2 || (uuid2 = Uuid.random()), buffer instanceof Buffer ? (uuid2.getBuffer().copy(buffer, offset || 0), buffer) : uuid2.toString();
    }
    function getDataTypeNameByCode(item) {
      if (!item || typeof item.code != "number")
        throw new errors.ArgumentError("Invalid signature type definition");
      let typeName = _dataTypesByCode[item.code];
      if (!typeName)
        throw new errors.ArgumentError(util.format("Type with code %d not found", item.code));
      return !("info" in item) || !item.info ? typeName : item.code === dataTypes.custom && "customTypeName" in item && item.customTypeName === "vector" ? "vector<" + getDataTypeNameByCode(item.info[0]) + ", " + item.info[1] + ">" : Array.isArray(item.info) ? typeName + "<" + item.info.map(function(t) {
        return getDataTypeNameByCode(t);
      }).join(", ") + ">" : typeof item.info.code == "number" ? typeName + "<" + getDataTypeNameByCode(item.info) + ">" : item.code === dataTypes.udt ? (
        /**@type {UdtColumnInfo}*/
        item.info.name
      ) : typeName;
    }
    function FrameHeader(version, flags, streamId, opcode, bodyLength) {
      this.version = version, this.flags = flags, this.streamId = streamId, this.opcode = opcode, this.bodyLength = bodyLength;
    }
    FrameHeader.size = function(version) {
      return protocolVersion.uses2BytesStreamIds(version) ? 9 : 8;
    };
    FrameHeader.getProtocolVersion = function(buffer) {
      return buffer[0] & 127;
    };
    FrameHeader.fromBuffer = function(buf, offset) {
      let streamId = 0;
      offset || (offset = 0);
      let version = buf[offset++] & 127, flags = buf.readUInt8(offset++);
      return protocolVersion.uses2BytesStreamIds(version) ? (streamId = buf.readInt16BE(offset), offset += 2) : streamId = buf.readInt8(offset++), new FrameHeader(version, flags, streamId, buf.readUInt8(offset++), buf.readUInt32BE(offset));
    };
    FrameHeader.prototype.toBuffer = function() {
      let buf = utils.allocBufferUnsafe(FrameHeader.size(this.version));
      buf.writeUInt8(this.version, 0), buf.writeUInt8(this.flags, 1);
      let offset = 3;
      return protocolVersion.uses2BytesStreamIds(this.version) ? (buf.writeInt16BE(this.streamId, 2), offset = 4) : buf.writeInt8(this.streamId, 2), buf.writeUInt8(this.opcode, offset++), buf.writeUInt32BE(this.bodyLength, offset), buf;
    };
    Long.fromBuffer = function(value) {
      if (!(value instanceof Buffer))
        throw new TypeError("Expected Buffer, obtained " + util.inspect(value));
      return new Long(value.readInt32BE(4), value.readInt32BE(0));
    };
    Long.toBuffer = function(value) {
      if (!(value instanceof Long))
        throw new TypeError("Expected Long, obtained " + util.inspect(value));
      let buffer = utils.allocBufferUnsafe(8);
      return buffer.writeUInt32BE(value.getHighBitsUnsigned(), 0), buffer.writeUInt32BE(value.getLowBitsUnsigned(), 4), buffer;
    };
    Long.prototype.inspect = function() {
      return "Long: " + this.toString();
    };
    Long.prototype.toJSON = function() {
      return this.toString();
    };
    function generateTimestamp(date, microseconds) {
      date || (date = /* @__PURE__ */ new Date());
      let longMicro = Long.ZERO;
      return typeof microseconds == "number" && microseconds >= 0 && microseconds < 1e3 ? longMicro = Long.fromInt(microseconds) : (_timestampTicks > 999 && (_timestampTicks = 0), longMicro = Long.fromInt(_timestampTicks), _timestampTicks++), Long.fromNumber(date.getTime()).multiply(_longOneThousand).add(longMicro);
    }
    function QueryParserError(e) {
      QueryParserError.super_.call(this, e.message, this.constructor), this.internalError = e;
    }
    util.inherits(QueryParserError, errors.DriverError);
    function TimeoutError(message) {
      TimeoutError.super_.call(this, message, this.constructor), this.info = "Represents an error that happens when the maximum amount of time for an operation passed.";
    }
    util.inherits(TimeoutError, errors.DriverError);
    exports2.opcodes = opcodes;
    exports2.consistencies = consistencies;
    exports2.consistencyToString = consistencyToString;
    exports2.dataTypes = dataTypes;
    exports2.getDataTypeNameByCode = getDataTypeNameByCode;
    exports2.distance = distance;
    exports2.frameFlags = frameFlags;
    exports2.protocolEvents = protocolEvents;
    exports2.protocolVersion = protocolVersion;
    exports2.responseErrorCodes = responseErrorCodes;
    exports2.resultKind = resultKind;
    exports2.timeuuid = timeuuid;
    exports2.uuid = uuid;
    exports2.BigDecimal = require_big_decimal();
    exports2.Duration = require_duration();
    exports2.FrameHeader = FrameHeader;
    exports2.InetAddress = require_inet_address();
    exports2.Integer = require_integer();
    exports2.LocalDate = require_local_date();
    exports2.LocalTime = require_local_time();
    exports2.Long = Long;
    exports2.ResultSet = require_result_set();
    exports2.ResultStream = require_result_stream();
    exports2.Row = require_row();
    exports2.DriverError = errors.DriverError;
    exports2.TimeoutError = TimeoutError;
    exports2.TimeUuid = TimeUuid;
    exports2.Tuple = require_tuple();
    exports2.Vector = require_vector();
    exports2.Uuid = Uuid;
    exports2.unset = unset;
    exports2.generateTimestamp = generateTimestamp;
  }
});

// node_modules/cassandra-driver/lib/policies/load-balancing.js
var require_load_balancing = __commonJS({
  "node_modules/cassandra-driver/lib/policies/load-balancing.js"(exports2, module2) {
    "use strict";
    var util = require("util"), types = require_types(), utils = require_utils(), errors = require_errors(), doneIteratorObject = Object.freeze({ done: !0 }), newlyUpInterval = 6e4;
    function LoadBalancingPolicy() {
    }
    LoadBalancingPolicy.prototype.init = function(client, hosts, callback) {
      this.client = client, this.hosts = hosts, callback();
    };
    LoadBalancingPolicy.prototype.getDistance = function(host) {
      return types.distance.local;
    };
    LoadBalancingPolicy.prototype.newQueryPlan = function(keyspace, executionOptions, callback) {
      callback(new Error("You must implement a query plan for the LoadBalancingPolicy class"));
    };
    LoadBalancingPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map();
    };
    function RoundRobinPolicy() {
      this.index = 0;
    }
    util.inherits(RoundRobinPolicy, LoadBalancingPolicy);
    RoundRobinPolicy.prototype.newQueryPlan = function(keyspace, executionOptions, callback) {
      if (!this.hosts)
        return callback(new Error("Load balancing policy not initialized"));
      let hosts = this.hosts.values(), self = this, counter = 0, planIndex = self.index % hosts.length;
      self.index += 1, self.index >= utils.maxInt && (self.index = 0), callback(null, {
        next: function() {
          return ++counter > hosts.length ? doneIteratorObject : { value: hosts[planIndex++ % hosts.length], done: !1 };
        }
      });
    };
    function DCAwareRoundRobinPolicy(localDc) {
      this.localDc = localDc, this.index = 0, this.localHostsArray = null;
    }
    util.inherits(DCAwareRoundRobinPolicy, LoadBalancingPolicy);
    DCAwareRoundRobinPolicy.prototype.init = function(client, hosts, callback) {
      this.client = client, this.hosts = hosts, hosts.on("add", this._cleanHostCache.bind(this)), hosts.on("remove", this._cleanHostCache.bind(this));
      try {
        setLocalDc(this, client, this.hosts);
      } catch (err) {
        return callback(err);
      }
      callback();
    };
    DCAwareRoundRobinPolicy.prototype.getDistance = function(host) {
      return host.datacenter === this.localDc ? types.distance.local : types.distance.ignored;
    };
    DCAwareRoundRobinPolicy.prototype._cleanHostCache = function() {
      this.localHostsArray = null;
    };
    DCAwareRoundRobinPolicy.prototype._resolveLocalHosts = function() {
      let hosts = this.hosts.values();
      this.localHostsArray || (this.localHostsArray = [], hosts.forEach(function(h) {
        h.datacenter && h.datacenter === this.localDc && this.localHostsArray.push(h);
      }, this));
    };
    DCAwareRoundRobinPolicy.prototype.newQueryPlan = function(keyspace, executionOptions, callback) {
      if (!this.hosts)
        return callback(new Error("Load balancing policy not initialized"));
      this.index += 1, this.index >= utils.maxInt && (this.index = 0), this._resolveLocalHosts();
      let localHostsArray = this.localHostsArray, planLocalIndex = this.index, counter = 0;
      callback(null, {
        next: function() {
          let host;
          return counter++ < localHostsArray.length ? (host = localHostsArray[planLocalIndex++ % localHostsArray.length], { value: host, done: !1 }) : doneIteratorObject;
        }
      });
    };
    DCAwareRoundRobinPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map([
        ["localDataCenter", this.localDc]
      ]);
    };
    function TokenAwarePolicy(childPolicy) {
      if (!childPolicy)
        throw new Error("You must specify a child load balancing policy");
      this.childPolicy = childPolicy;
    }
    util.inherits(TokenAwarePolicy, LoadBalancingPolicy);
    TokenAwarePolicy.prototype.init = function(client, hosts, callback) {
      this.client = client, this.hosts = hosts, this.childPolicy.init(client, hosts, callback);
    };
    TokenAwarePolicy.prototype.getDistance = function(host) {
      return this.childPolicy.getDistance(host);
    };
    TokenAwarePolicy.prototype.newQueryPlan = function(keyspace, executionOptions, callback) {
      let routingKey;
      executionOptions && (routingKey = executionOptions.getRoutingKey(), executionOptions.getKeyspace() && (keyspace = executionOptions.getKeyspace()));
      let replicas;
      if (routingKey && (replicas = this.client.getReplicas(keyspace, routingKey)), !routingKey || !replicas)
        return this.childPolicy.newQueryPlan(keyspace, executionOptions, callback);
      new TokenAwareIterator(keyspace, executionOptions, replicas, this.childPolicy).iterate(callback);
    };
    function TokenAwareIterator(keyspace, execOptions, replicas, childPolicy) {
      this.keyspace = keyspace, this.childPolicy = childPolicy, this.options = execOptions, this.localReplicas = [], this.replicaIndex = 0, this.replicaMap = {}, this.childIterator = null;
      for (let i = 0; i < replicas.length; i++) {
        let host = replicas[i];
        this.childPolicy.getDistance(host) === types.distance.local && (this.replicaMap[host.address] = !0, this.localReplicas.push(host));
      }
      this.startIndex = Math.floor(Math.random() * this.localReplicas.length);
    }
    TokenAwareIterator.prototype.iterate = function(callback) {
      let self = this;
      this.childPolicy.newQueryPlan(this.keyspace, this.options, function(err, iterator) {
        if (err)
          return callback(err);
        self.childIterator = iterator, callback(null, {
          next: function() {
            return self.computeNext();
          }
        });
      });
    };
    TokenAwareIterator.prototype.computeNext = function() {
      let host;
      if (this.replicaIndex < this.localReplicas.length)
        return host = this.localReplicas[(this.startIndex + this.replicaIndex++) % this.localReplicas.length], { value: host, done: !1 };
      let item;
      for (; (item = this.childIterator.next()) && !item.done; )
        if (!this.replicaMap[item.value.address])
          return item;
      return doneIteratorObject;
    };
    TokenAwarePolicy.prototype.getOptions = function() {
      let map = /* @__PURE__ */ new Map([
        ["childPolicy", this.childPolicy.constructor !== void 0 ? this.childPolicy.constructor.name : null]
      ]);
      return this.childPolicy instanceof DCAwareRoundRobinPolicy && map.set("localDataCenter", this.childPolicy.localDc), map;
    };
    function AllowListPolicy(childPolicy, allowList) {
      if (!childPolicy)
        throw new Error("You must specify a child load balancing policy");
      if (!Array.isArray(allowList))
        throw new Error("You must provide the list of allowed host addresses");
      this.childPolicy = childPolicy, this.allowList = new Map(allowList.map((address) => [address, !0]));
    }
    util.inherits(AllowListPolicy, LoadBalancingPolicy);
    AllowListPolicy.prototype.init = function(client, hosts, callback) {
      this.childPolicy.init(client, hosts, callback);
    };
    AllowListPolicy.prototype.getDistance = function(host) {
      return this._contains(host) ? this.childPolicy.getDistance(host) : types.distance.ignored;
    };
    AllowListPolicy.prototype._contains = function(host) {
      return !!this.allowList.get(host.address);
    };
    AllowListPolicy.prototype.newQueryPlan = function(keyspace, info, callback) {
      let self = this;
      this.childPolicy.newQueryPlan(keyspace, info, function(err, iterator) {
        if (err)
          return callback(err);
        callback(null, self._filter(iterator));
      });
    };
    AllowListPolicy.prototype._filter = function(childIterator) {
      let self = this;
      return {
        next: function() {
          let item = childIterator.next();
          return !item.done && !self._contains(item.value) ? this.next() : item;
        }
      };
    };
    AllowListPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map([
        ["childPolicy", this.childPolicy.constructor !== void 0 ? this.childPolicy.constructor.name : null],
        ["allowList", Array.from(this.allowList.keys())]
      ]);
    };
    function WhiteListPolicy(childPolicy, allowList) {
      AllowListPolicy.call(this, childPolicy, allowList);
    }
    util.inherits(WhiteListPolicy, AllowListPolicy);
    var DefaultLoadBalancingPolicy = class _DefaultLoadBalancingPolicy extends LoadBalancingPolicy {
      /**
       * Creates a new instance of <code>DefaultLoadBalancingPolicy</code>.
       * @param {String|Object} [options] The local data center name or the optional policy options object.
       * <p>
       *   Note that when providing the local data center name, it overrides <code>localDataCenter</code> option at
       *   <code>Client</code> level.
       * </p>
       * @param {String} [options.localDc] local data center name.  This value overrides the 'localDataCenter' Client option
       * and is useful for cases where you have multiple execution profiles that you intend on using for routing
       * requests to different data centers.
       * @param {Function} [options.filter] A function to apply to determine if hosts are included in the query plan.
       * The function takes a Host parameter and returns a Boolean.
       */
      constructor(options) {
        super(), typeof options == "string" ? options = { localDc: options } : options || (options = utils.emptyObject), this._client = null, this._hosts = null, this._filteredHosts = null, this._preferredHost = null, this._index = 0, this.localDc = options.localDc, this._filter = options.filter || this._defaultFilter, options.isHostNewlyUp && (this._isHostNewlyUp = options.isHostNewlyUp), options.healthCheck && (this._healthCheck = options.healthCheck), options.compare && (this._compare = options.compare), options.getReplicas && (this._getReplicas = options.getReplicas);
      }
      /**
       * Initializes the load balancing policy, called after the driver obtained the information of the cluster.
       * @param {Client} client
       * @param {HostMap} hosts
       * @param {Function} callback
       */
      init(client, hosts, callback) {
        this._client = client, this._hosts = hosts, this._hosts.on("add", () => this._filteredHosts = null), this._hosts.on("remove", () => this._filteredHosts = null);
        try {
          setLocalDc(this, client, this._hosts);
        } catch (err) {
          return callback(err);
        }
        callback();
      }
      /**
       * Returns the distance assigned by this policy to the provided host, relatively to the client instance.
       * @param {Host} host
       */
      getDistance(host) {
        return this._preferredHost !== null && host === this._preferredHost || this._filter(host) && host.datacenter === this.localDc ? types.distance.local : types.distance.ignored;
      }
      /**
       * Returns a host iterator to be used for a query execution.
       * @override
       * @param {String} keyspace
       * @param {ExecutionOptions} executionOptions
       * @param {Function} callback
       */
      newQueryPlan(keyspace, executionOptions, callback) {
        let routingKey, preferredHost;
        executionOptions && (routingKey = executionOptions.getRoutingKey(), executionOptions.getKeyspace() && (keyspace = executionOptions.getKeyspace()), preferredHost = executionOptions.getPreferredHost());
        let iterable;
        return !keyspace || !routingKey ? iterable = this._getLocalHosts() : iterable = this._getReplicasAndLocalHosts(keyspace, routingKey), preferredHost && (this._preferredHost = preferredHost, iterable = _DefaultLoadBalancingPolicy._getPreferredHostFirst(preferredHost, iterable)), callback(null, iterable);
      }
      /**
       * Yields the preferred host first, followed by the host in the provided iterable
       * @param preferredHost
       * @param iterable
       * @private
       */
      static *_getPreferredHostFirst(preferredHost, iterable) {
        yield preferredHost;
        for (let host of iterable)
          host !== preferredHost && (yield host);
      }
      /**
       * Yields the local hosts without the replicas already yielded
       * @param {Array<Host>} [localReplicas] The local replicas that we should avoid to include again
       * @private
       */
      *_getLocalHosts(localReplicas) {
        let hosts = this._getFilteredLocalHosts(), initialIndex = this._getIndex(), canBeYield = localReplicas ? (h) => localReplicas.indexOf(h) === -1 : (h) => !0;
        for (let i = 0; i < hosts.length; i++) {
          let h = hosts[(i + initialIndex) % hosts.length];
          canBeYield(h) && h.isUp() && (yield h);
        }
      }
      _getReplicasAndLocalHosts(keyspace, routingKey) {
        let replicas = this._getReplicas(keyspace, routingKey);
        if (replicas === null)
          return this._getLocalHosts();
        let filteredReplicas = [], newlyUpReplica = null, newlyUpReplicaTimestamp = Number.MIN_SAFE_INTEGER, unhealthyReplicas = 0;
        for (let i = 0; i < replicas.length; i++) {
          let h = replicas[i];
          if (!this._filter(h) || h.datacenter !== this.localDc || !h.isUp())
            continue;
          let isUpSince = this._isHostNewlyUp(h);
          isUpSince !== null && isUpSince > newlyUpReplicaTimestamp && (newlyUpReplica = h, newlyUpReplicaTimestamp = isUpSince), newlyUpReplica === null && !this._healthCheck(h) && unhealthyReplicas++, filteredReplicas.push(h);
        }
        if (replicas = filteredReplicas, utils.shuffleArray(replicas), replicas.length < 3)
          return this.yieldReplicasFirst(replicas);
        let temp;
        if (newlyUpReplica === null)
          unhealthyReplicas > 0 && unhealthyReplicas < Math.floor(replicas.length / 2 + 1) && this._sendUnhealthyToTheBack(replicas, unhealthyReplicas);
        else if ((newlyUpReplica === replicas[0] || newlyUpReplica === replicas[1]) && Math.random() * 4 >= 1) {
          let index = newlyUpReplica === replicas[0] ? 0 : 1;
          temp = replicas[replicas.length - 1], replicas[replicas.length - 1] = replicas[index], replicas[index] = temp;
        }
        return this._compare(replicas[1], replicas[0]) > 0 && (temp = replicas[0], replicas[0] = replicas[1], replicas[1] = temp), this.yieldReplicasFirst(replicas);
      }
      /**
       * Yields the local replicas followed by the rest of local nodes.
       * @param {Array<Host>} replicas The local replicas
       */
      *yieldReplicasFirst(replicas) {
        for (let i = 0; i < replicas.length; i++)
          yield replicas[i];
        yield* this._getLocalHosts(replicas);
      }
      _isHostNewlyUp(h) {
        return h.isUpSince !== null && Date.now() - h.isUpSince < newlyUpInterval ? h.isUpSince : null;
      }
      /**
       * Returns a boolean determining whether the host health is ok or not.
       * A Host is considered unhealthy when there are enough items in the queue (10 items in-flight) but the
       * Host is not responding to those requests.
       * @param {Host} h
       * @return {boolean}
       * @private
       */
      _healthCheck(h) {
        return !(h.getInFlight() >= 10 && h.getResponseCount() <= 1);
      }
      /**
       * Compares to host and returns 1 if it needs to favor the first host otherwise, -1.
       * @return {number}
       * @private
       */
      _compare(h1, h2) {
        return h1.getInFlight() < h2.getInFlight() ? 1 : -1;
      }
      _getReplicas(keyspace, routingKey) {
        return this._client.getReplicas(keyspace, routingKey);
      }
      /**
       * Returns an Array of hosts filtered by DC and predicate.
       * @returns {Array<Host>}
       * @private
       */
      _getFilteredLocalHosts() {
        return this._filteredHosts === null && (this._filteredHosts = this._hosts.values().filter((h) => this._filter(h) && h.datacenter === this.localDc)), this._filteredHosts;
      }
      _getIndex() {
        let result = this._index++;
        return this._index === 2147483647 && (this._index = 0), result;
      }
      _sendUnhealthyToTheBack(replicas, unhealthyReplicas) {
        let counter = 0;
        for (let i = replicas.length - 1; i >= 0 && counter < unhealthyReplicas; i--) {
          let host = replicas[i];
          if (this._healthCheck(host))
            continue;
          let targetIndex = replicas.length - 1 - counter;
          if (targetIndex !== i) {
            let temp = replicas[targetIndex];
            replicas[targetIndex] = host, replicas[i] = temp;
          }
          counter++;
        }
      }
      _defaultFilter() {
        return !0;
      }
      /**
       * Gets an associative array containing the policy options.
       */
      getOptions() {
        return /* @__PURE__ */ new Map([
          ["localDataCenter", this.localDc],
          ["filterFunction", this._filter !== this._defaultFilter]
        ]);
      }
    };
    function setLocalDc(lbp, client, hosts) {
      if (!(lbp instanceof LoadBalancingPolicy))
        throw new errors.DriverInternalError("LoadBalancingPolicy instance was not provided");
      client && client.options && (lbp.localDc && !client.options.localDataCenter && client.log("info", `Local data center '${lbp.localDc}' was provided as an argument to the load-balancing policy. It is preferable to specify the local data center using 'localDataCenter' in Client options instead when your application is targeting a single data center.`), lbp.localDc = lbp.localDc || client.options.localDataCenter);
      let dcs = getDataCenters(hosts);
      if (!lbp.localDc)
        throw new errors.ArgumentError(
          `'localDataCenter' is not defined in Client options and also was not specified in constructor. At least one is required. Available DCs are: [${Array.from(dcs)}]`
        );
      if (!dcs.has(lbp.localDc))
        throw new errors.ArgumentError(`Datacenter ${lbp.localDc} was not found. Available DCs are: [${Array.from(dcs)}]`);
    }
    function getDataCenters(hosts) {
      return new Set(hosts.values().map((h) => h.datacenter));
    }
    module2.exports = {
      AllowListPolicy,
      DCAwareRoundRobinPolicy,
      DefaultLoadBalancingPolicy,
      LoadBalancingPolicy,
      RoundRobinPolicy,
      TokenAwarePolicy,
      // Deprecated: for backward compatibility only.
      WhiteListPolicy
    };
  }
});

// node_modules/cassandra-driver/lib/policies/reconnection.js
var require_reconnection = __commonJS({
  "node_modules/cassandra-driver/lib/policies/reconnection.js"(exports2) {
    "use strict";
    var util = require("util");
    function ReconnectionPolicy() {
    }
    ReconnectionPolicy.prototype.newSchedule = function() {
      throw new Error("You must implement a new schedule for the Reconnection class");
    };
    ReconnectionPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map();
    };
    function ConstantReconnectionPolicy(delay) {
      this.delay = delay;
    }
    util.inherits(ConstantReconnectionPolicy, ReconnectionPolicy);
    ConstantReconnectionPolicy.prototype.newSchedule = function() {
      let self = this;
      return {
        next: function() {
          return { value: self.delay, done: !1 };
        }
      };
    };
    ConstantReconnectionPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map([["delay", this.delay]]);
    };
    function ExponentialReconnectionPolicy(baseDelay, maxDelay, startWithNoDelay) {
      this.baseDelay = baseDelay, this.maxDelay = maxDelay, this.startWithNoDelay = startWithNoDelay;
    }
    util.inherits(ExponentialReconnectionPolicy, ReconnectionPolicy);
    ExponentialReconnectionPolicy.prototype.newSchedule = function* () {
      let index = this.startWithNoDelay ? -1 : 0;
      for (; ; ) {
        let delay = 0;
        index >= 64 ? delay = this.maxDelay : index !== -1 && (delay = Math.min(Math.pow(2, index) * this.baseDelay, this.maxDelay)), index++, yield this._addJitter(delay);
      }
    };
    ExponentialReconnectionPolicy.prototype._addJitter = function(value) {
      if (value === 0)
        return value;
      let minPercentage = 0.85, range = 0.3;
      return !this.startWithNoDelay && value === this.baseDelay ? (minPercentage = 1, range = 0.15) : value === this.maxDelay && (range = 0.15), Math.floor(value * (Math.random() * range + minPercentage));
    };
    ExponentialReconnectionPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map([
        ["baseDelay", this.baseDelay],
        ["maxDelay", this.maxDelay],
        ["startWithNoDelay", this.startWithNoDelay]
      ]);
    };
    exports2.ReconnectionPolicy = ReconnectionPolicy;
    exports2.ConstantReconnectionPolicy = ConstantReconnectionPolicy;
    exports2.ExponentialReconnectionPolicy = ExponentialReconnectionPolicy;
  }
});

// node_modules/cassandra-driver/lib/policies/retry.js
var require_retry = __commonJS({
  "node_modules/cassandra-driver/lib/policies/retry.js"(exports2) {
    "use strict";
    var util = require("util");
    function RetryPolicy() {
    }
    RetryPolicy.prototype.onUnavailable = function(info, consistency, required, alive) {
      return info.nbRetry > 0 ? this.rethrowResult() : this.retryResult(void 0, !1);
    };
    RetryPolicy.prototype.onReadTimeout = function(info, consistency, received, blockFor, isDataPresent) {
      return info.nbRetry > 0 ? this.rethrowResult() : received >= blockFor && !isDataPresent ? this.retryResult() : this.rethrowResult();
    };
    RetryPolicy.prototype.onWriteTimeout = function(info, consistency, received, blockFor, writeType) {
      return info.nbRetry > 0 ? this.rethrowResult() : writeType === "BATCH_LOG" ? this.retryResult() : this.rethrowResult();
    };
    RetryPolicy.prototype.onRequestError = function(info, consistency, err) {
      return this.retryResult(void 0, !1);
    };
    RetryPolicy.prototype.retryResult = function(consistency, useCurrentHost) {
      return {
        decision: RetryPolicy.retryDecision.retry,
        consistency,
        useCurrentHost: useCurrentHost !== !1
      };
    };
    RetryPolicy.prototype.rethrowResult = function() {
      return { decision: RetryPolicy.retryDecision.rethrow };
    };
    RetryPolicy.retryDecision = {
      rethrow: 0,
      retry: 1,
      ignore: 2
    };
    function IdempotenceAwareRetryPolicy(childPolicy) {
      this._childPolicy = childPolicy || new RetryPolicy();
    }
    util.inherits(IdempotenceAwareRetryPolicy, RetryPolicy);
    IdempotenceAwareRetryPolicy.prototype.onReadTimeout = function(info, consistency, received, blockFor, isDataPresent) {
      return this._childPolicy.onReadTimeout(info, consistency, received, blockFor, isDataPresent);
    };
    IdempotenceAwareRetryPolicy.prototype.onRequestError = function(info, consistency, err) {
      return info.executionOptions.isIdempotent() ? this._childPolicy.onRequestError(info, consistency, err) : this.rethrowResult();
    };
    IdempotenceAwareRetryPolicy.prototype.onUnavailable = function(info, consistency, required, alive) {
      return this._childPolicy.onUnavailable(info, consistency, required, alive);
    };
    IdempotenceAwareRetryPolicy.prototype.onWriteTimeout = function(info, consistency, received, blockFor, writeType) {
      return info.executionOptions.isIdempotent() ? this._childPolicy.onWriteTimeout(info, consistency, received, blockFor, writeType) : this.rethrowResult();
    };
    function FallthroughRetryPolicy() {
    }
    util.inherits(FallthroughRetryPolicy, RetryPolicy);
    FallthroughRetryPolicy.prototype.onReadTimeout = function() {
      return this.rethrowResult();
    };
    FallthroughRetryPolicy.prototype.onRequestError = function() {
      return this.rethrowResult();
    };
    FallthroughRetryPolicy.prototype.onUnavailable = function() {
      return this.rethrowResult();
    };
    FallthroughRetryPolicy.prototype.onWriteTimeout = function() {
      return this.rethrowResult();
    };
    exports2.IdempotenceAwareRetryPolicy = IdempotenceAwareRetryPolicy;
    exports2.FallthroughRetryPolicy = FallthroughRetryPolicy;
    exports2.RetryPolicy = RetryPolicy;
  }
});

// node_modules/cassandra-driver/lib/policies/speculative-execution.js
var require_speculative_execution = __commonJS({
  "node_modules/cassandra-driver/lib/policies/speculative-execution.js"(exports2) {
    "use strict";
    var util = require("util"), errors = require_errors();
    function SpeculativeExecutionPolicy() {
    }
    SpeculativeExecutionPolicy.prototype.init = function(client) {
    };
    SpeculativeExecutionPolicy.prototype.shutdown = function() {
    };
    SpeculativeExecutionPolicy.prototype.newPlan = function(keyspace, queryInfo) {
      throw new Error("You must implement newPlan() method in the SpeculativeExecutionPolicy");
    };
    SpeculativeExecutionPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map();
    };
    function NoSpeculativeExecutionPolicy() {
      this._plan = {
        nextExecution: function() {
          return -1;
        }
      };
    }
    util.inherits(NoSpeculativeExecutionPolicy, SpeculativeExecutionPolicy);
    NoSpeculativeExecutionPolicy.prototype.newPlan = function() {
      return this._plan;
    };
    function ConstantSpeculativeExecutionPolicy(delay, maxSpeculativeExecutions) {
      if (!(delay >= 0))
        throw new errors.ArgumentError("delay must be a positive number or zero");
      if (!(maxSpeculativeExecutions > 0))
        throw new errors.ArgumentError("maxSpeculativeExecutions must be a positive number");
      this._delay = delay, this._maxSpeculativeExecutions = maxSpeculativeExecutions;
    }
    util.inherits(ConstantSpeculativeExecutionPolicy, SpeculativeExecutionPolicy);
    ConstantSpeculativeExecutionPolicy.prototype.newPlan = function() {
      let executions = 0, self = this;
      return {
        nextExecution: function() {
          return executions++ < self._maxSpeculativeExecutions ? self._delay : -1;
        }
      };
    };
    ConstantSpeculativeExecutionPolicy.prototype.getOptions = function() {
      return /* @__PURE__ */ new Map([
        ["delay", this._delay],
        ["maxSpeculativeExecutions", this._maxSpeculativeExecutions]
      ]);
    };
    exports2.NoSpeculativeExecutionPolicy = NoSpeculativeExecutionPolicy;
    exports2.SpeculativeExecutionPolicy = SpeculativeExecutionPolicy;
    exports2.ConstantSpeculativeExecutionPolicy = ConstantSpeculativeExecutionPolicy;
  }
});

// node_modules/cassandra-driver/lib/policies/timestamp-generation.js
var require_timestamp_generation = __commonJS({
  "node_modules/cassandra-driver/lib/policies/timestamp-generation.js"(exports2) {
    "use strict";
    var util = require("util"), { Long } = require_types(), errors = require_errors(), _maxSafeNumberDate = 9007199254740, _longOneThousand = Long.fromInt(1e3);
    function TimestampGenerator() {
    }
    TimestampGenerator.prototype.next = function(client) {
      throw new Error("next() must be implemented");
    };
    function MonotonicTimestampGenerator(warningThreshold, minLogInterval) {
      if (warningThreshold < 0)
        throw new errors.ArgumentError("warningThreshold can not be lower than 0");
      this._warningThreshold = warningThreshold || 1e3, this._minLogInterval = 1e3, typeof minLogInterval == "number" && (this._minLogInterval = minLogInterval), this._micros = -1, this._lastDate = 0, this._lastLogDate = 0;
    }
    util.inherits(MonotonicTimestampGenerator, TimestampGenerator);
    MonotonicTimestampGenerator.prototype.getDate = function() {
      return Date.now();
    };
    MonotonicTimestampGenerator.prototype.next = function(client) {
      let date = this.getDate(), drifted = 0;
      if (date > this._lastDate)
        return this._micros = 0, this._lastDate = date, this._generateMicroseconds();
      date < this._lastDate && (drifted = this._lastDate - date, date = this._lastDate), ++this._micros === 1e3 && (this._micros = 0, date === this._lastDate && (date++, drifted++));
      let lastDate = this._lastDate;
      this._lastDate = date;
      let result = this._generateMicroseconds();
      if (drifted >= this._warningThreshold) {
        let currentLogDate = Date.now();
        if (this._minLogInterval > 0 && this._lastLogDate + this._minLogInterval <= currentLogDate) {
          let message = util.format(
            "Timestamp generated using current date was %d milliseconds behind the last generated timestamp (which millisecond portion was %d), the returned value (%s) is being artificially incremented to guarantee monotonicity.",
            drifted,
            lastDate,
            result
          );
          this._lastLogDate = currentLogDate, client.log("warning", message);
        }
      }
      return result;
    };
    MonotonicTimestampGenerator.prototype._generateMicroseconds = function() {
      return this._lastDate < _maxSafeNumberDate ? this._lastDate * 1e3 + this._micros : Long.fromNumber(this._lastDate).multiply(_longOneThousand).add(Long.fromInt(this._micros));
    };
    exports2.TimestampGenerator = TimestampGenerator;
    exports2.MonotonicTimestampGenerator = MonotonicTimestampGenerator;
  }
});

// node_modules/cassandra-driver/lib/policies/index.js
var require_policies = __commonJS({
  "node_modules/cassandra-driver/lib/policies/index.js"(exports2) {
    "use strict";
    var addressResolution = exports2.addressResolution = require_address_resolution(), loadBalancing = exports2.loadBalancing = require_load_balancing(), reconnection = exports2.reconnection = require_reconnection(), retry = exports2.retry = require_retry(), speculativeExecution = exports2.speculativeExecution = require_speculative_execution(), timestampGeneration = exports2.timestampGeneration = require_timestamp_generation();
    exports2.defaultAddressTranslator = function() {
      return new addressResolution.AddressTranslator();
    };
    exports2.defaultLoadBalancingPolicy = function(localDc) {
      return new loadBalancing.DefaultLoadBalancingPolicy(localDc);
    };
    exports2.defaultRetryPolicy = function() {
      return new retry.RetryPolicy();
    };
    exports2.defaultReconnectionPolicy = function() {
      return new reconnection.ExponentialReconnectionPolicy(1e3, 10 * 60 * 1e3, !1);
    };
    exports2.defaultSpeculativeExecutionPolicy = function() {
      return new speculativeExecution.NoSpeculativeExecutionPolicy();
    };
    exports2.defaultTimestampGenerator = function() {
      return new timestampGeneration.MonotonicTimestampGenerator();
    };
  }
});

// node_modules/cassandra-driver/lib/tracker/request-tracker.js
var require_request_tracker = __commonJS({
  "node_modules/cassandra-driver/lib/tracker/request-tracker.js"(exports2, module2) {
    "use strict";
    var RequestTracker = class {
      /**
       * Invoked each time a query or batch request succeeds.
       * @param {Host} host The node that acted as coordinator of the request.
       * @param {String|Array} query In the case of prepared or unprepared query executions, the provided
       * query string. For batch requests, an Array containing the queries and parameters provided.
       * @param {Array|Object|null} parameters In the case of prepared or unprepared query executions, the provided
       * parameters.
       * @param {ExecutionOptions} executionOptions The information related to the execution of the request.
       * @param {Number} requestLength Length of the body of the request.
       * @param {Number} responseLength Length of the body of the response.
       * @param {Array<Number>} latency An array containing [seconds, nanoseconds] tuple, where nanoseconds is the
       * remaining part of the real time that can't be represented in second precision (see <code>process.hrtime()</code>).
       */
      onSuccess(host, query, parameters, executionOptions, requestLength, responseLength, latency) {
      }
      /**
       * Invoked each time a query or batch request fails.
       * @param {Host} host The node that acted as coordinator of the request.
       * @param {String|Array} query In the case of prepared or unprepared query executions, the provided
       * query string. For batch requests, an Array containing the queries and parameters provided.
       * @param {Array|Object|null} parameters In the case of prepared or unprepared query executions, the provided
       * parameters.
       * @param {ExecutionOptions} executionOptions The information related to the execution of the request.
       * @param {Number} requestLength Length of the body of the request. When the failure occurred before the request was
       * written to the wire, the length will be <code>0</code>.
       * @param {Error} err The error that caused that caused the request to fail.
       * @param {Array<Number>} latency An array containing [seconds, nanoseconds] tuple, where nanoseconds is the
       * remaining part of the real time that can't be represented in second precision (see <code>process.hrtime()</code>).
       */
      onError(host, query, parameters, executionOptions, requestLength, err, latency) {
      }
      /**
       * Invoked when the Client is being shutdown.
       */
      shutdown() {
      }
    };
    module2.exports = RequestTracker;
  }
});

// node_modules/cassandra-driver/lib/tracker/request-logger.js
var require_request_logger = __commonJS({
  "node_modules/cassandra-driver/lib/tracker/request-logger.js"(exports2, module2) {
    "use strict";
    var events = require("events"), RequestTracker = require_request_tracker(), errors = require_errors(), { format } = require("util"), nanosToMillis = 1e6, defaultMessageMaxQueryLength = 500, defaultMaxParameterValueLength = 50, defaultMaxErrorStackTraceLength = 200, RequestLogger = class extends RequestTracker {
      /**
       * Creates a new instance of {@link RequestLogger}.
       * @param {Object} options
       * @param {Number} [options.slowThreshold] The threshold in milliseconds beyond which queries are considered 'slow'
       * and logged as such by the driver.
       * @param {Number} [options.requestSizeThreshold] The threshold in bytes beyond which requests are considered 'large'
       * and logged as such by the driver.
       * @param {Boolean} [options.logNormalRequests] Determines whether it should emit 'normal' events for every
       * EXECUTE, QUERY and BATCH request executed successfully, useful only for debugging. This option can be modified
       * after the client is connected using the property {@link RequestLogger#logNormalRequests}.
       * @param {Boolean} [options.logErroredRequests] Determines whether it should emit 'failure' events for every
       * EXECUTE, QUERY and BATCH request execution that resulted in an error. This option can be modified
       * after the client is connected using the property {@link RequestLogger#logErroredRequests}.
       * @param {Number} [options.messageMaxQueryLength] The maximum amount of characters that are logged from the query
       * portion of the message. Defaults to 500.
       * @param {Number} [options.messageMaxParameterValueLength] The maximum amount of characters of each query parameter
       * value that will be included in the message. Defaults to 50.
       * @param {Number} [options.messageMaxErrorStackTraceLength] The maximum amount of characters of the stack trace
       * that will be included in the message. Defaults to 200.
       */
      constructor(options) {
        if (super(), !options)
          throw new errors.ArgumentError("RequestLogger options parameter is required");
        this._options = options, this.logNormalRequests = this._options.logNormalRequests, this.logErroredRequests = this._options.logErroredRequests, this.emitter = new events.EventEmitter();
      }
      /**
       * Logs message if request execution was deemed too slow, large or if normal requests are logged.
       * @override
       */
      onSuccess(host, query, parameters, execOptions, requestLength, responseLength, latency) {
        this._options.slowThreshold > 0 && toMillis(latency) > this._options.slowThreshold ? this._logSlow(host, query, parameters, execOptions, requestLength, responseLength, latency) : this._options.requestSizeThreshold > 0 && requestLength > this._options.requestSizeThreshold ? this._logLargeRequest(host, query, parameters, execOptions, requestLength, responseLength, latency) : this.logNormalRequests && this._logNormalRequest(host, query, parameters, execOptions, requestLength, responseLength, latency);
      }
      /**
       * Logs message if request execution was too large and/or encountered an error.
       * @override
       */
      onError(host, query, parameters, execOptions, requestLength, err, latency) {
        this._options.requestSizeThreshold > 0 && requestLength > this._options.requestSizeThreshold ? this._logLargeErrorRequest(host, query, parameters, execOptions, requestLength, err, latency) : this.logErroredRequests && this._logErrorRequest(host, query, parameters, execOptions, requestLength, err, latency);
      }
      _logSlow(host, query, parameters, execOptions, requestLength, responseLength, latency) {
        let message = format(
          "[%s] Slow request, took %d ms (%s): %s",
          host.address,
          Math.floor(toMillis(latency)),
          getPayloadSizes(requestLength, responseLength),
          getStatementInfo(query, parameters, execOptions, this._options)
        );
        this.emitter.emit("slow", message);
      }
      _logLargeRequest(host, query, parameters, execOptions, requestLength, responseLength, latency) {
        let message = format(
          "[%s] Request exceeded length, %s (took %d ms): %s",
          host.address,
          getPayloadSizes(requestLength, responseLength),
          ~~toMillis(latency),
          getStatementInfo(query, parameters, execOptions, this._options)
        );
        this.emitter.emit("large", message);
      }
      _logNormalRequest(host, query, parameters, execOptions, requestLength, responseLength, latency) {
        let message = format(
          "[%s] Request completed normally, took %d ms (%s): %s",
          host.address,
          ~~toMillis(latency),
          getPayloadSizes(requestLength, responseLength),
          getStatementInfo(query, parameters, execOptions, this._options)
        );
        this.emitter.emit("normal", message);
      }
      _logLargeErrorRequest(host, query, parameters, execOptions, requestLength, err, latency) {
        let maxStackTraceLength = this._options.messageMaxErrorStackTraceLength || defaultMaxErrorStackTraceLength, message = format(
          "[%s] Request exceeded length and execution failed, %s (took %d ms): %s; error: %s",
          host.address,
          getPayloadSizes(requestLength),
          ~~toMillis(latency),
          getStatementInfo(query, parameters, execOptions, this._options),
          err.stack.substr(0, maxStackTraceLength)
        );
        this.emitter.emit("large", message);
      }
      _logErrorRequest(host, query, parameters, execOptions, requestLength, err, latency) {
        let maxStackTraceLength = this._options.messageMaxErrorStackTraceLength || defaultMaxErrorStackTraceLength, message = format(
          "[%s] Request execution failed, took %d ms (%s): %s; error: %s",
          host.address,
          ~~toMillis(latency),
          getPayloadSizes(requestLength),
          getStatementInfo(query, parameters, execOptions, this._options),
          err.stack.substr(0, maxStackTraceLength)
        );
        this.emitter.emit("failure", message);
      }
    };
    function toMillis(latency) {
      return latency[0] * 1e3 + latency[1] / nanosToMillis;
    }
    function getStatementInfo(query, parameters, execOptions, options) {
      let maxQueryLength = options.messageMaxQueryLength || defaultMessageMaxQueryLength, maxParameterLength = options.messageMaxParameterValueLength || defaultMaxParameterValueLength;
      if (Array.isArray(query))
        return getBatchStatementInfo(query, execOptions, maxQueryLength, maxParameterLength);
      let message = query.substr(0, maxQueryLength), remaining = maxQueryLength - message.length - 1;
      return message += getParametersInfo(parameters, remaining, maxParameterLength), execOptions.isPrepared() || (message += " (not prepared)"), message;
    }
    function getBatchStatementInfo(queries, execOptions, maxQueryLength, maxParameterLength) {
      let message = (execOptions.isBatchLogged() ? "LOGGED " : "") + "BATCH w/ " + queries.length + (execOptions.isPrepared() ? "" : " not prepared") + " queries (", remaining = maxQueryLength, i;
      for (i = 0; i < queries.length && remaining > 0; i++) {
        let q = queries[i], params = q.params;
        typeof q != "string" && (q = q.query), i > 0 && (message += ",", remaining--);
        let queryLength = Math.min(remaining, q.length);
        if (message += q.substr(0, queryLength), remaining -= queryLength, remaining <= 0)
          break;
        let parameters = getParametersInfo(params, remaining, maxParameterLength);
        remaining -= parameters.length, message += parameters;
      }
      return message += i < queries.length ? ",...)" : ")", message;
    }
    function getParametersInfo(params, remaining, maxParameterLength) {
      if (remaining <= 3)
        return " [...]";
      if (!params)
        return " []";
      let paramStringifier = (index, length) => formatParam(params[index], length);
      if (!Array.isArray(params)) {
        let obj = params;
        params = Object.keys(params), paramStringifier = (index, length) => {
          let key = params[index], result = key.substr(0, length), rem = length - result.length - 1;
          return rem <= 0 || (result += ":" + formatParam(obj[key], rem)), result;
        };
      }
      let message = " [", i;
      for (i = 0; remaining > 0 && i < params.length; i++) {
        i > 0 && (message += ",", remaining--);
        let paramString = paramStringifier(i, Math.min(maxParameterLength, remaining));
        remaining -= paramString.length, message += paramString;
      }
      return i < params.length && (message += "..."), message += "]", message;
    }
    function formatParam(value, maxLength) {
      return value === void 0 ? "undefined" : value === null ? "null" : value.toString().substr(0, maxLength);
    }
    function getPayloadSizes(requestLength, responseLength) {
      let message = "request size " + formatSize(requestLength);
      return responseLength !== void 0 && (message += " / response size " + formatSize(responseLength)), message;
    }
    function formatSize(length) {
      return length > 1e3 ? Math.round(length / 1024) + " KB" : length + " bytes";
    }
    module2.exports = RequestLogger;
  }
});

// node_modules/cassandra-driver/lib/tracker/index.js
var require_tracker = __commonJS({
  "node_modules/cassandra-driver/lib/tracker/index.js"(exports2) {
    "use strict";
    exports2.RequestLogger = require_request_logger();
    exports2.RequestTracker = require_request_tracker();
  }
});

// node_modules/cassandra-driver/lib/metrics/client-metrics.js
var require_client_metrics = __commonJS({
  "node_modules/cassandra-driver/lib/metrics/client-metrics.js"(exports2, module2) {
    "use strict";
    var ClientMetrics = class {
      /**
       * Method invoked when an authentication error is obtained from the server.
       * @param {AuthenticationError|Error} e The error encountered.
       */
      onAuthenticationError(e) {
      }
      /**
       * Method invoked when an error (different than a server or client timeout, authentication or connection error) is
       * encountered when executing a request.
       * @param {OperationTimedOutError} e The timeout error.
       */
      onClientTimeoutError(e) {
      }
      /**
       * Method invoked when there is a connection error.
       * @param {Error} e The error encountered.
       */
      onConnectionError(e) {
      }
      /**
       * Method invoked when an error (different than a server or client timeout, authentication or connection error) is
       * encountered when executing a request.
       * @param {Error} e The error encountered.
       */
      onOtherError(e) {
      }
      /**
       * Method invoked when a read timeout error is obtained from the server.
       * @param {ResponseError} e The error encountered.
       */
      onReadTimeoutError(e) {
      }
      /**
       * Method invoked when a write timeout error is obtained from the server.
       * @param {ResponseError} e The error encountered.
       */
      onWriteTimeoutError(e) {
      }
      /**
       * Method invoked when an unavailable error is obtained from the server.
       * @param {ResponseError} e The error encountered.
       */
      onUnavailableError(e) {
      }
      /**
       * Method invoked when an execution is retried as a result of a client-level timeout.
       * @param {Error} e The error that caused the retry.
       */
      onClientTimeoutRetry(e) {
      }
      /**
       * Method invoked when an error (other than a server or client timeout) is retried.
       * @param {Error} e The error that caused the retry.
       */
      onOtherErrorRetry(e) {
      }
      /**
       * Method invoked when an execution is retried as a result of a read timeout from the server (coordinator to replica).
       * @param {Error} e The error that caused the retry.
       */
      onReadTimeoutRetry(e) {
      }
      /**
       * Method invoked when an execution is retried as a result of an unavailable error from the server.
       * @param {Error} e The error that caused the retry.
       */
      onUnavailableRetry(e) {
      }
      /**
       * Method invoked when an execution is retried as a result of a write timeout from the server (coordinator to
       * replica).
       * @param {Error} e The error that caused the retry.
       */
      onWriteTimeoutRetry(e) {
      }
      /**
       * Method invoked when an error is marked as ignored by the retry policy.
       * @param {Error} e The error that was ignored by the retry policy.
       */
      onIgnoreError(e) {
      }
      /**
       * Method invoked when a speculative execution is started.
       */
      onSpeculativeExecution() {
      }
      /**
       * Method invoked when a response is obtained successfully.
       * @param {Array<Number>} latency The latency represented in a <code>[seconds, nanoseconds]</code> tuple
       * Array, where nanoseconds is the remaining part of the real time that can't be represented in second precision.
       */
      onSuccessfulResponse(latency) {
      }
      /**
       * Method invoked when any response is obtained, the response can be the result of a successful execution or a
       * server-side error.
       * @param {Array<Number>} latency The latency represented in a <code>[seconds, nanoseconds]</code> tuple
       * Array, where nanoseconds is the remaining part of the real time that can't be represented in second precision.
       */
      onResponse(latency) {
      }
    };
    module2.exports = ClientMetrics;
  }
});

// node_modules/cassandra-driver/lib/metrics/default-metrics.js
var require_default_metrics = __commonJS({
  "node_modules/cassandra-driver/lib/metrics/default-metrics.js"(exports2, module2) {
    "use strict";
    var ClientMetrics = require_client_metrics(), EventEmitter = require("events"), DefaultMetrics = class extends ClientMetrics {
      /**
       * Creates a new instance of [DefaultMetrics]{@link module:metrics~DefaultMetrics}.
       */
      constructor() {
        super(), this.errors = new EventEmitter(), this.errors.authentication = new EventEmitter(), this.errors.clientTimeout = new EventEmitter(), this.errors.connection = new EventEmitter(), this.errors.other = new EventEmitter(), this.errors.readTimeout = new EventEmitter(), this.errors.unavailable = new EventEmitter(), this.errors.writeTimeout = new EventEmitter(), this.retries = new EventEmitter(), this.retries.clientTimeout = new EventEmitter(), this.retries.other = new EventEmitter(), this.retries.readTimeout = new EventEmitter(), this.retries.unavailable = new EventEmitter(), this.retries.writeTimeout = new EventEmitter(), this.speculativeExecutions = new EventEmitter(), this.ignoredErrors = new EventEmitter(), this.responses = new EventEmitter(), this.responses.success = new EventEmitter();
      }
      /** @override */
      onAuthenticationError(e) {
        this.errors.authentication.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onConnectionError(e) {
        this.errors.connection.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onReadTimeoutError(e) {
        this.errors.readTimeout.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onWriteTimeoutError(e) {
        this.errors.writeTimeout.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onUnavailableError(e) {
        this.errors.unavailable.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onClientTimeoutError(e) {
        this.errors.clientTimeout.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onOtherError(e) {
        this.errors.other.emit("increment", e), this.errors.emit("increment", e);
      }
      /** @override */
      onClientTimeoutRetry(e) {
        this.retries.clientTimeout.emit("increment", e), this.retries.emit("increment", e);
      }
      /** @override */
      onOtherErrorRetry(e) {
        this.retries.other.emit("increment", e), this.retries.emit("increment", e);
      }
      /** @override */
      onReadTimeoutRetry(e) {
        this.retries.readTimeout.emit("increment", e), this.retries.emit("increment", e);
      }
      /** @override */
      onUnavailableRetry(e) {
        this.retries.unavailable.emit("increment", e), this.retries.emit("increment", e);
      }
      /** @override */
      onWriteTimeoutRetry(e) {
        this.retries.writeTimeout.emit("increment", e), this.retries.emit("increment", e);
      }
      /** @override */
      onIgnoreError(e) {
        this.ignoredErrors.emit("increment", e);
      }
      /** @override */
      onSpeculativeExecution() {
        this.speculativeExecutions.emit("increment");
      }
      /** @override */
      onSuccessfulResponse(latency) {
        this.responses.success.emit("increment", latency);
      }
      /** @override */
      onResponse(latency) {
        this.responses.emit("increment", latency);
      }
    };
    module2.exports = DefaultMetrics;
  }
});

// node_modules/cassandra-driver/lib/metrics/index.js
var require_metrics = __commonJS({
  "node_modules/cassandra-driver/lib/metrics/index.js"(exports2, module2) {
    "use strict";
    var ClientMetrics = require_client_metrics(), DefaultMetrics = require_default_metrics();
    module2.exports = { ClientMetrics, DefaultMetrics };
  }
});

// node_modules/cassandra-driver/lib/auth/provider.js
var require_provider = __commonJS({
  "node_modules/cassandra-driver/lib/auth/provider.js"(exports2) {
    "use strict";
    function AuthProvider() {
    }
    AuthProvider.prototype.newAuthenticator = function(endpoint, name) {
      throw new Error("This is an abstract class, you must implement newAuthenticator method or use another auth provider that inherits from this class");
    };
    function Authenticator() {
    }
    Authenticator.prototype.initialResponse = function(callback) {
      callback(new Error("Not implemented"));
    };
    Authenticator.prototype.evaluateChallenge = function(challenge, callback) {
      callback(new Error("Not implemented"));
    };
    Authenticator.prototype.onAuthenticationSuccess = function(token) {
    };
    exports2.AuthProvider = AuthProvider;
    exports2.Authenticator = Authenticator;
  }
});

// node_modules/cassandra-driver/lib/auth/plain-text-auth-provider.js
var require_plain_text_auth_provider = __commonJS({
  "node_modules/cassandra-driver/lib/auth/plain-text-auth-provider.js"(exports2, module2) {
    "use strict";
    var util = require("util"), provider = require_provider(), utils = require_utils(), AuthProvider = provider.AuthProvider, Authenticator = provider.Authenticator;
    function PlainTextAuthProvider(username, password) {
      this.username = username, this.password = password;
    }
    util.inherits(PlainTextAuthProvider, AuthProvider);
    PlainTextAuthProvider.prototype.newAuthenticator = function() {
      return new PlainTextAuthenticator(this.username, this.password);
    };
    function PlainTextAuthenticator(username, password) {
      this.username = username, this.password = password;
    }
    util.inherits(PlainTextAuthenticator, Authenticator);
    PlainTextAuthenticator.prototype.initialResponse = function(callback) {
      let initialToken = Buffer.concat([
        utils.allocBufferFromArray([0]),
        utils.allocBufferFromString(this.username, "utf8"),
        utils.allocBufferFromArray([0]),
        utils.allocBufferFromString(this.password, "utf8")
      ]);
      callback(null, initialToken);
    };
    PlainTextAuthenticator.prototype.evaluateChallenge = function(challenge, callback) {
      callback();
    };
    module2.exports = {
      PlainTextAuthenticator,
      PlainTextAuthProvider
    };
  }
});

// node_modules/cassandra-driver/lib/auth/base-dse-authenticator.js
var require_base_dse_authenticator = __commonJS({
  "node_modules/cassandra-driver/lib/auth/base-dse-authenticator.js"(exports2, module2) {
    "use strict";
    var util = require("util"), { Authenticator } = require_provider(), dseAuthenticatorName = "com.datastax.bdp.cassandra.auth.DseAuthenticator";
    function BaseDseAuthenticator(authenticatorName) {
      this.authenticatorName = authenticatorName;
    }
    util.inherits(BaseDseAuthenticator, Authenticator);
    BaseDseAuthenticator.prototype.getMechanism = function() {
      throw new Error("Not implemented");
    };
    BaseDseAuthenticator.prototype.getInitialServerChallenge = function() {
      throw new Error("Not implemented");
    };
    BaseDseAuthenticator.prototype.initialResponse = function(callback) {
      if (!this._isDseAuthenticator())
        return this.evaluateChallenge(this.getInitialServerChallenge(), callback);
      callback(null, this.getMechanism());
    };
    BaseDseAuthenticator.prototype._isDseAuthenticator = function() {
      return this.authenticatorName === dseAuthenticatorName;
    };
    module2.exports = BaseDseAuthenticator;
  }
});

// node_modules/cassandra-driver/lib/auth/gssapi-client.js
var require_gssapi_client = __commonJS({
  "node_modules/cassandra-driver/lib/auth/gssapi-client.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), GssapiClient = class {
      /**
       * @param {String} [authorizationId]
       * @param {String} [service]
       */
      constructor(authorizationId, service) {
        this.authorizationId = authorizationId, this.service = service !== void 0 ? service : "dse";
      }
      /**
       * @abstract
       * @param {String} host Host name or ip
       * @param {Function} callback
       */
      init(host, callback) {
        throw new Error("Not implemented");
      }
      /**
       * @param {Buffer} challenge
       * @param {Function} callback
       * @abstract
       */
      evaluateChallenge(challenge, callback) {
        throw new Error("Not implemented");
      }
      /**
       * @abstract
       * @param {Function} [callback]
       */
      shutdown(callback) {
        throw new Error("Not implemented");
      }
      /**
       * Factory to get the actual implementation of GSSAPI (unix or win)
       * @param {Object} kerberosModule Kerberos client library dependency
       * @param {String} [authorizationId] An identity to act as (for proxy authentication).
       * @param {String} [service] The service to use. (defaults to 'dse')
       * @returns GssapiClient
       */
      static createNew(kerberosModule, authorizationId, service) {
        return new StandardGssClient(kerberosModule, authorizationId, service);
      }
    }, StandardGssClient = class extends GssapiClient {
      constructor(kerberosModule, authorizationId, service) {
        if (typeof kerberosModule.initializeClient != "function")
          throw new Error("The driver expects version 1.x of the kerberos library");
        super(authorizationId, service), this.kerberos = kerberosModule, this.transitionIndex = 0;
      }
      init(host, callback) {
        this.host = host;
        let uri = this.service;
        this.host && (uri = util.format("%s@%s", this.service, this.host));
        let options = {
          gssFlags: this.kerberos.GSS_C_MUTUAL_FLAG
          //authenticate itself flag
        };
        this.kerberos.initializeClient(uri, options, (err, kerberosClient) => {
          if (err)
            return callback(err);
          this.kerberosClient = kerberosClient, callback();
        });
      }
      /** @override */
      evaluateChallenge(challenge, callback) {
        this["transition" + this.transitionIndex](challenge, (err, response) => {
          if (err)
            return callback(err);
          this.transitionIndex++, callback(null, response ? utils.allocBufferFromString(response, "base64") : utils.allocBuffer(0));
        });
      }
      transition0(challenge, callback) {
        this.kerberosClient.step("", callback);
      }
      transition1(challenge, callback) {
        let charPointerChallenge = challenge.toString("base64");
        this.kerberosClient.step(charPointerChallenge, callback);
      }
      transition2(challenge, callback) {
        this.kerberosClient.unwrap(challenge.toString("base64"), (err, response) => {
          if (err)
            return callback(err, !1);
          let cb = function(err2, wrapped) {
            if (err2)
              return callback(err2);
            callback(null, wrapped);
          };
          this.authorizationId !== void 0 ? this.kerberosClient.wrap(response, { user: this.authorizationId }, cb) : this.kerberosClient.wrap(response, null, cb);
        });
      }
      shutdown(callback) {
        this.kerberosClient = null, callback();
      }
    };
    module2.exports = GssapiClient;
  }
});

// node_modules/cassandra-driver/lib/auth/dse-gssapi-auth-provider.js
var require_dse_gssapi_auth_provider = __commonJS({
  "node_modules/cassandra-driver/lib/auth/dse-gssapi-auth-provider.js"(exports2, module2) {
    "use strict";
    var util = require("util"), { AuthProvider } = require_provider(), BaseDseAuthenticator = require_base_dse_authenticator(), GssapiClient = require_gssapi_client(), dns = require("dns"), utils = require_utils(), mechanism = utils.allocBufferFromString("GSSAPI"), initialServerChallenge = "GSSAPI-START", emptyBuffer = utils.allocBuffer(0);
    function DseGssapiAuthProvider(gssOptions) {
      try {
        this._kerberos = require("kerberos");
      } catch (err) {
        if (err.code === "MODULE_NOT_FOUND") {
          let newErr = new Error('You must install module "kerberos" to use GSSAPI auth provider: https://www.npmjs.com/package/kerberos');
          throw newErr.code = err.code, newErr;
        }
        throw err;
      }
      gssOptions = gssOptions || utils.emptyObject, this.authorizationId = gssOptions.authorizationId || gssOptions.user, this.service = gssOptions.service, this.hostNameResolver = gssOptions.hostNameResolver || DseGssapiAuthProvider.lookupServiceResolver;
    }
    util.inherits(DseGssapiAuthProvider, AuthProvider);
    DseGssapiAuthProvider.prototype.newAuthenticator = function(endpoint, name) {
      let address = endpoint;
      return endpoint.indexOf(":") > 0 && (address = endpoint.split(":")[0]), new GssapiAuthenticator(
        this._kerberos,
        address,
        name,
        this.authorizationId,
        this.service,
        this.hostNameResolver
      );
    };
    DseGssapiAuthProvider.lookupServiceResolver = function(ip, callback) {
      if (!dns.lookupService)
        return DseGssapiAuthProvider.reverseDnsResolver(ip, callback);
      dns.lookupService(ip, 0, function(err, hostname) {
        if (err)
          return callback(err);
        if (!hostname)
          return callback(null, ip);
        callback(null, hostname);
      });
    };
    DseGssapiAuthProvider.reverseDnsResolver = function(ip, callback) {
      dns.reverse(ip, function(err, names) {
        if (err)
          return callback(err);
        if (!names || !names.length)
          return callback(null, ip);
        callback(null, names[0]);
      });
    };
    DseGssapiAuthProvider.useIpResolver = function(ip, callback) {
      callback(null, ip);
    };
    function GssapiAuthenticator(kerberosModule, address, authenticatorName, authorizationId, service, hostNameResolver) {
      BaseDseAuthenticator.call(this, authenticatorName), this.authorizationId = authorizationId, this.address = address, this.client = GssapiClient.createNew(kerberosModule, authorizationId, service), this.hostNameResolver = hostNameResolver;
    }
    util.inherits(GssapiAuthenticator, BaseDseAuthenticator);
    GssapiAuthenticator.prototype.getMechanism = function() {
      return mechanism;
    };
    GssapiAuthenticator.prototype.getInitialServerChallenge = function() {
      return utils.allocBufferFromString(initialServerChallenge);
    };
    GssapiAuthenticator.prototype.initialResponse = function(callback) {
      let self = this, host = this.address;
      utils.series([
        function(next) {
          self.hostNameResolver(self.address, function(err, name) {
            !err && name && (host = name), next();
          });
        },
        function(next) {
          self.client.init(host, function(err) {
            if (err)
              return next(err);
            if (!self._isDseAuthenticator())
              return self.evaluateChallenge(self.getInitialServerChallenge(), next);
            next(null, self.getMechanism());
          });
        }
      ], callback);
    };
    GssapiAuthenticator.prototype.evaluateChallenge = function(challenge, callback) {
      (!challenge || challenge.toString() === initialServerChallenge) && (challenge = emptyBuffer), this.client.evaluateChallenge(challenge, callback);
    };
    GssapiAuthenticator.prototype.onAuthenticationSuccess = function(token) {
      this.client.shutdown(function() {
      });
    };
    module2.exports = DseGssapiAuthProvider;
  }
});

// node_modules/cassandra-driver/lib/auth/dse-plain-text-auth-provider.js
var require_dse_plain_text_auth_provider = __commonJS({
  "node_modules/cassandra-driver/lib/auth/dse-plain-text-auth-provider.js"(exports2, module2) {
    "use strict";
    var util = require("util"), { AuthProvider } = require_provider(), BaseDseAuthenticator = require_base_dse_authenticator(), utils = require_utils(), mechanism = utils.allocBufferFromString("PLAIN"), separatorBuffer = utils.allocBufferFromArray([0]), initialServerChallenge = "PLAIN-START";
    function DsePlainTextAuthProvider(username, password, authorizationId) {
      if (typeof username != "string" || typeof password != "string")
        throw new TypeError("Username and password must be a string");
      this.username = username, this.password = password, this.authorizationId = authorizationId;
    }
    util.inherits(DsePlainTextAuthProvider, AuthProvider);
    DsePlainTextAuthProvider.prototype.newAuthenticator = function(endpoint, name) {
      return new PlainTextAuthenticator(name, this.username, this.password, this.authorizationId);
    };
    function PlainTextAuthenticator(authenticatorName, authenticatorId, password, authorizationId) {
      BaseDseAuthenticator.call(this, authenticatorName), this.authenticatorId = utils.allocBufferFromString(authenticatorId), this.password = utils.allocBufferFromString(password), this.authorizationId = utils.allocBufferFromString(authorizationId || "");
    }
    util.inherits(PlainTextAuthenticator, BaseDseAuthenticator);
    PlainTextAuthenticator.prototype.getMechanism = function() {
      return mechanism;
    };
    PlainTextAuthenticator.prototype.getInitialServerChallenge = function() {
      return utils.allocBufferFromString(initialServerChallenge);
    };
    PlainTextAuthenticator.prototype.evaluateChallenge = function(challenge, callback) {
      if (!challenge || challenge.toString() !== initialServerChallenge)
        return callback(new Error("Incorrect SASL challenge from server"));
      callback(null, Buffer.concat([
        this.authorizationId,
        separatorBuffer,
        this.authenticatorId,
        separatorBuffer,
        this.password
      ]));
    };
    module2.exports = DsePlainTextAuthProvider;
  }
});

// node_modules/cassandra-driver/lib/auth/no-auth-provider.js
var require_no_auth_provider = __commonJS({
  "node_modules/cassandra-driver/lib/auth/no-auth-provider.js"(exports2, module2) {
    "use strict";
    var { AuthProvider, Authenticator } = require_provider(), { PlainTextAuthenticator } = require_plain_text_auth_provider(), errors = require_errors(), dseAuthenticator = "com.datastax.bdp.cassandra.auth.DseAuthenticator", NoAuthProvider = class extends AuthProvider {
      newAuthenticator(endpoint, name) {
        return name === dseAuthenticator ? new TransitionalModePlainTextAuthenticator() : new NoAuthAuthenticator(endpoint);
      }
    }, NoAuthAuthenticator = class extends Authenticator {
      constructor(endpoint) {
        super(), this.endpoint = endpoint;
      }
      initialResponse(callback) {
        callback(new errors.AuthenticationError(
          `Host ${this.endpoint} requires authentication, but no authenticator found in the options`
        ));
      }
    }, TransitionalModePlainTextAuthenticator = class extends PlainTextAuthenticator {
      constructor() {
        super("", "");
      }
    };
    module2.exports = NoAuthProvider;
  }
});

// node_modules/cassandra-driver/lib/auth/index.js
var require_auth = __commonJS({
  "node_modules/cassandra-driver/lib/auth/index.js"(exports2, module2) {
    "use strict";
    var { Authenticator, AuthProvider } = require_provider(), { PlainTextAuthProvider } = require_plain_text_auth_provider(), DseGssapiAuthProvider = require_dse_gssapi_auth_provider(), DsePlainTextAuthProvider = require_dse_plain_text_auth_provider(), NoAuthProvider = require_no_auth_provider();
    module2.exports = {
      Authenticator,
      AuthProvider,
      DseGssapiAuthProvider,
      DsePlainTextAuthProvider,
      NoAuthProvider,
      PlainTextAuthProvider
    };
  }
});

// node_modules/cassandra-driver/lib/client-options.js
var require_client_options = __commonJS({
  "node_modules/cassandra-driver/lib/client-options.js"(exports2) {
    "use strict";
    var util = require("util"), policies = require_policies(), types = require_types(), utils = require_utils(), tracker = require_tracker(), metrics = require_metrics(), auth = require_auth(), coreConnectionsPerHostV2 = {
      [types.distance.local]: 2,
      [types.distance.remote]: 1,
      [types.distance.ignored]: 0
    }, coreConnectionsPerHostV3 = {
      [types.distance.local]: 1,
      [types.distance.remote]: 1,
      [types.distance.ignored]: 0
    }, maxRequestsPerConnectionV2 = 128, maxRequestsPerConnectionV3 = 2048, continuousPageUnitBytes = "bytes", continuousPageDefaultSize = 5e3, continuousPageDefaultHighWaterMark = 1e4;
    function defaultOptions() {
      return {
        policies: {
          addressResolution: policies.defaultAddressTranslator(),
          loadBalancing: policies.defaultLoadBalancingPolicy(),
          reconnection: policies.defaultReconnectionPolicy(),
          retry: policies.defaultRetryPolicy(),
          speculativeExecution: policies.defaultSpeculativeExecutionPolicy(),
          timestampGeneration: policies.defaultTimestampGenerator()
        },
        queryOptions: {
          fetchSize: 5e3,
          prepare: !1,
          captureStackTrace: !1
        },
        protocolOptions: {
          port: 9042,
          maxSchemaAgreementWaitSeconds: 10,
          maxVersion: 0,
          noCompact: !1
        },
        pooling: {
          heartBeatInterval: 3e4,
          warmup: !0
        },
        socketOptions: {
          connectTimeout: 5e3,
          defunctReadTimeoutThreshold: 64,
          keepAlive: !0,
          keepAliveDelay: 0,
          readTimeout: 12e3,
          tcpNoDelay: !0,
          coalescingThreshold: 65536
        },
        authProvider: null,
        requestTracker: null,
        metrics: new metrics.DefaultMetrics(),
        maxPrepared: 500,
        refreshSchemaDelay: 1e3,
        isMetadataSyncEnabled: !0,
        prepareOnAllHosts: !0,
        rePrepareOnUp: !0,
        encoding: {
          copyBuffer: !0,
          useUndefinedAsUnset: !0
        },
        monitorReporting: {
          enabled: !0
        }
      };
    }
    function extend(baseOptions, userOptions) {
      arguments.length === 1 && (userOptions = arguments[0], baseOptions = {});
      let options = utils.deepExtend(baseOptions, defaultOptions(), userOptions);
      if (options.cloud)
        validateCloudOptions(options);
      else {
        if (!Array.isArray(options.contactPoints) || options.contactPoints.length === 0)
          throw new TypeError("Contacts points are not defined.");
        for (let i = 0; i < options.contactPoints.length; i++) {
          let hostName = options.contactPoints[i];
          if (!hostName)
            throw new TypeError(util.format("Contact point %s (%s) is not a valid host name, the following values are valid contact points: ipAddress, hostName or ipAddress:port", i, hostName));
        }
        options.sni = void 0;
      }
      if (options.logEmitter || (options.logEmitter = function() {
      }), !options.queryOptions)
        throw new TypeError("queryOptions not defined in options");
      if (options.requestTracker !== null && !(options.requestTracker instanceof tracker.RequestTracker))
        throw new TypeError("requestTracker must be an instance of RequestTracker");
      if (!(options.metrics instanceof metrics.ClientMetrics))
        throw new TypeError("metrics must be an instance of ClientMetrics");
      if (validatePoliciesOptions(options.policies), validateProtocolOptions(options.protocolOptions), validateSocketOptions(options.socketOptions), validateAuthenticationOptions(options), options.encoding = options.encoding || {}, validateEncodingOptions(options.encoding), options.profiles && !Array.isArray(options.profiles))
        throw new TypeError("profiles must be an Array of ExecutionProfile instances");
      return validateApplicationInfo(options), validateMonitorReporting(options), options;
    }
    function validateCloudOptions(options) {
      let bundle = options.cloud.secureConnectBundle;
      if (!(typeof bundle == "string" || typeof URL < "u" && bundle instanceof URL))
        throw new TypeError("secureConnectBundle in cloud options must be of type string");
      if (options.contactPoints)
        throw new TypeError("Contact points can not be defined when cloud settings are provided");
      if (options.sslOptions)
        throw new TypeError("SSL options can not be defined when cloud settings are provided");
    }
    function validatePoliciesOptions(policiesOptions) {
      if (!policiesOptions)
        throw new TypeError("policies not defined in options");
      if (!(policiesOptions.loadBalancing instanceof policies.loadBalancing.LoadBalancingPolicy))
        throw new TypeError("Load balancing policy must be an instance of LoadBalancingPolicy");
      if (!(policiesOptions.reconnection instanceof policies.reconnection.ReconnectionPolicy))
        throw new TypeError("Reconnection policy must be an instance of ReconnectionPolicy");
      if (!(policiesOptions.retry instanceof policies.retry.RetryPolicy))
        throw new TypeError("Retry policy must be an instance of RetryPolicy");
      if (!(policiesOptions.addressResolution instanceof policies.addressResolution.AddressTranslator))
        throw new TypeError("Address resolution policy must be an instance of AddressTranslator");
      if (policiesOptions.timestampGeneration !== null && !(policiesOptions.timestampGeneration instanceof policies.timestampGeneration.TimestampGenerator))
        throw new TypeError("Timestamp generation policy must be an instance of TimestampGenerator");
    }
    function validateProtocolOptions(protocolOptions) {
      if (!protocolOptions)
        throw new TypeError("protocolOptions not defined in options");
      let version = protocolOptions.maxVersion;
      if (version && (typeof version != "number" || !types.protocolVersion.isSupported(version)))
        throw new TypeError(util.format("protocolOptions.maxVersion provided (%s) is invalid", version));
    }
    function validateSocketOptions(socketOptions) {
      if (!socketOptions)
        throw new TypeError("socketOptions not defined in options");
      if (typeof socketOptions.readTimeout != "number")
        throw new TypeError("socketOptions.readTimeout must be a Number");
      if (typeof socketOptions.coalescingThreshold != "number" || socketOptions.coalescingThreshold <= 0)
        throw new TypeError("socketOptions.coalescingThreshold must be a positive Number");
    }
    function validateAuthenticationOptions(options) {
      if (options.authProvider) {
        if (!(options.authProvider instanceof auth.AuthProvider))
          throw new TypeError("options.authProvider must be an instance of AuthProvider");
      } else {
        let credentials = options.credentials;
        if (credentials) {
          if (typeof credentials.username != "string" || typeof credentials.password != "string")
            throw new TypeError("credentials username and password must be a string");
          options.authProvider = new auth.PlainTextAuthProvider(credentials.username, credentials.password);
        } else
          options.authProvider = new auth.NoAuthProvider();
      }
    }
    function validateEncodingOptions(encodingOptions) {
      if (encodingOptions.map) {
        let mapConstructor = encodingOptions.map;
        if (typeof mapConstructor != "function" || typeof mapConstructor.prototype.forEach != "function" || typeof mapConstructor.prototype.set != "function")
          throw new TypeError("Map constructor not valid");
      }
      if (encodingOptions.set) {
        let setConstructor = encodingOptions.set;
        if (typeof setConstructor != "function" || typeof setConstructor.prototype.forEach != "function" || typeof setConstructor.prototype.add != "function")
          throw new TypeError("Set constructor not valid");
      }
      if ((encodingOptions.useBigIntAsLong || encodingOptions.useBigIntAsVarint) && typeof BigInt > "u")
        throw new TypeError("BigInt is not supported by the JavaScript engine");
    }
    function validateApplicationInfo(options) {
      function validateString(key) {
        let str = options[key];
        if (str != null && typeof str != "string")
          throw new TypeError(`${key} should be a String`);
      }
      if (validateString("applicationName"), validateString("applicationVersion"), options.id !== null && options.id !== void 0 && !(options.id instanceof types.Uuid))
        throw new TypeError("Client id must be a Uuid");
    }
    function validateMonitorReporting(options) {
      let o = options.monitorReporting;
      if (o === null || typeof o != "object")
        throw new TypeError(`Monitor reporting must be an object, obtained: ${o}`);
    }
    function setMetadataDependent(client) {
      let version = client.controlConnection.protocolVersion, coreConnectionsPerHost = coreConnectionsPerHostV3, maxRequestsPerConnection = maxRequestsPerConnectionV3;
      types.protocolVersion.uses2BytesStreamIds(version) || (coreConnectionsPerHost = coreConnectionsPerHostV2, maxRequestsPerConnection = maxRequestsPerConnectionV2), client.options.queryOptions.consistency === void 0 && (client.options.queryOptions.consistency = client.metadata.isDbaas() ? types.consistencies.localQuorum : types.consistencies.localOne), client.options.pooling = utils.deepExtend(
        {},
        { coreConnectionsPerHost, maxRequestsPerConnection },
        client.options.pooling
      );
    }
    exports2.extend = extend;
    exports2.defaultOptions = defaultOptions;
    exports2.coreConnectionsPerHostV2 = coreConnectionsPerHostV2;
    exports2.coreConnectionsPerHostV3 = coreConnectionsPerHostV3;
    exports2.maxRequestsPerConnectionV2 = maxRequestsPerConnectionV2;
    exports2.maxRequestsPerConnectionV3 = maxRequestsPerConnectionV3;
    exports2.setMetadataDependent = setMetadataDependent;
    exports2.continuousPageUnitBytes = continuousPageUnitBytes;
    exports2.continuousPageDefaultSize = continuousPageDefaultSize;
    exports2.continuousPageDefaultHighWaterMark = continuousPageDefaultHighWaterMark;
  }
});

// node_modules/cassandra-driver/lib/execution-profile.js
var require_execution_profile = __commonJS({
  "node_modules/cassandra-driver/lib/execution-profile.js"(exports2, module2) {
    "use strict";
    var utils = require_utils(), types = require_types(), promiseUtils = require_promise_utils();
    function ExecutionProfile(name, options) {
      if (typeof name != "string")
        throw new TypeError("Execution profile name must be a string");
      options = options || utils.emptyObject;
      let graphOptions = options.graphOptions || utils.emptyObject;
      this.name = name, this.consistency = options.consistency, this.loadBalancing = options.loadBalancing, this.readTimeout = options.readTimeout, this.retry = options.retry, this.serialConsistency = options.serialConsistency, this.graphOptions = {
        language: graphOptions.language,
        results: graphOptions.results,
        name: graphOptions.name,
        readConsistency: graphOptions.readConsistency,
        source: graphOptions.source,
        writeConsistency: graphOptions.writeConsistency
      };
    }
    var ProfileManager = class {
      /**
       * @param {ClientOptions} options
       */
      constructor(options) {
        this._profiles = options.profiles || [], this._defaultConfiguredRetryPolicy = void 0, this._setDefault(options), this._loadBalancingPolicies = [], this._profilesMap = {}, this._customPayloadCache = {}, this._graphOptionsCache = {}, this._profiles.forEach(function(p) {
          return this._profilesMap[p.name] = p, p.loadBalancing = p.loadBalancing || this._defaultProfile.loadBalancing, this._loadBalancingPolicies.indexOf(p.loadBalancing) === -1 && this._loadBalancingPolicies.push(p.loadBalancing), p;
        }, this);
      }
      /**
       * @param {Client} client
       * @param {HostMap} hosts
       */
      async init(client, hosts) {
        for (let lbp of this._loadBalancingPolicies)
          await promiseUtils.fromCallback((callback) => lbp.init(client, hosts, callback));
      }
      /**
       * Uses the load-balancing policies to get the relative distance to the host and return the closest one.
       * @param {Host} host
       */
      getDistance(host) {
        let distance = types.distance.ignored;
        for (let i = 0; i < this._loadBalancingPolicies.length; i++) {
          let d = this._loadBalancingPolicies[i].getDistance(host);
          if (d < distance && (distance = d, distance === types.distance.local))
            break;
        }
        return host.setDistance(distance), distance;
      }
      /**
       * @param {String|ExecutionProfile} name
       * @returns {ExecutionProfile|undefined} It returns the execution profile by name or the default profile when name is
       * undefined. It returns undefined when the profile does not exist.
       */
      getProfile(name) {
        return name instanceof ExecutionProfile ? name : this._profilesMap[name || "default"];
      }
      /** @returns {ExecutionProfile} */
      getDefault() {
        return this._defaultProfile;
      }
      /** @returns {LoadBalancingPolicy} */
      getDefaultLoadBalancing() {
        return this._defaultProfile.loadBalancing;
      }
      /**
       * Gets the cached default graph options for a given profile. If it doesn't exist, it creates new options using the
       * handler and inserts it into the cache
       * @param {ExecutionProfile} profile
       * @param {Function} createHandler
       */
      getOrCreateGraphOptions(profile, createHandler) {
        let graphOptions = this._graphOptionsCache[profile.name];
        return graphOptions || (graphOptions = this._graphOptionsCache[profile.name] = createHandler()), graphOptions;
      }
      /**
       * @private
       * @param {ClientOptions} options
       */
      _setDefault(options) {
        this._defaultProfile = this._profiles.filter(function(p) {
          return p.name === "default";
        })[0], this._defaultProfile || this._profiles.push(this._defaultProfile = new ExecutionProfile("default")), this._defaultConfiguredRetryPolicy = this._defaultProfile.retry, this._defaultProfile.loadBalancing = this._defaultProfile.loadBalancing || options.policies.loadBalancing, this._defaultProfile.retry = this._defaultProfile.retry || options.policies.retry;
      }
      /**
       * Gets all the execution profiles currently defined.
       * @returns {Array.<ExecutionProfile>}
       */
      getAll() {
        return this._profiles;
      }
      getDefaultConfiguredRetryPolicy() {
        return this._defaultConfiguredRetryPolicy;
      }
    };
    module2.exports = {
      ProfileManager,
      ExecutionProfile
    };
  }
});

// node_modules/cassandra-driver/lib/writers.js
var require_writers = __commonJS({
  "node_modules/cassandra-driver/lib/writers.js"(exports2, module2) {
    "use strict";
    var events = require("events"), types = require_types(), utils = require_utils(), FrameHeader = types.FrameHeader, FrameWriter = class {
      /**
       * Creates a new instance of FrameWriter.
       * @param {Number} opcode
       */
      constructor(opcode) {
        if (!opcode)
          throw new Error("Opcode not provided");
        this.buffers = [], this.opcode = opcode, this.bodyLength = 0;
      }
      add(buf) {
        this.buffers.push(buf), this.bodyLength += buf.length;
      }
      writeShort(num) {
        let buf = utils.allocBufferUnsafe(2);
        buf.writeUInt16BE(num, 0), this.add(buf);
      }
      writeInt(num) {
        let buf = utils.allocBufferUnsafe(4);
        buf.writeInt32BE(num, 0), this.add(buf);
      }
      /** @param {Long} num */
      writeLong(num) {
        this.add(types.Long.toBuffer(num));
      }
      /**
       * Writes bytes according to Cassandra <int byteLength><bytes>
       * @param {Buffer|null|types.unset} bytes
       */
      writeBytes(bytes) {
        if (bytes === null) {
          this.writeInt(-1);
          return;
        }
        if (bytes === types.unset) {
          this.writeInt(-2);
          return;
        }
        this.writeInt(bytes.length), this.add(bytes);
      }
      /**
       * Writes a buffer according to Cassandra protocol: bytes.length (2) + bytes
       * @param {Buffer} bytes
       */
      writeShortBytes(bytes) {
        if (bytes === null) {
          this.writeShort(-1);
          return;
        }
        this.writeShort(bytes.length), this.add(bytes);
      }
      /**
       * Writes a single byte
       * @param {Number} num Value of the byte, a number between 0 and 255.
       */
      writeByte(num) {
        this.add(utils.allocBufferFromArray([num]));
      }
      writeString(str) {
        if (typeof str > "u")
          throw new Error("can not write undefined");
        let len = Buffer.byteLength(str, "utf8"), buf = utils.allocBufferUnsafe(2 + len);
        buf.writeUInt16BE(len, 0), buf.write(str, 2, buf.length - 2, "utf8"), this.add(buf);
      }
      writeLString(str) {
        let len = Buffer.byteLength(str, "utf8"), buf = utils.allocBufferUnsafe(4 + len);
        buf.writeInt32BE(len, 0), buf.write(str, 4, buf.length - 4, "utf8"), this.add(buf);
      }
      writeStringList(values) {
        this.writeShort(values.length), values.forEach(this.writeString, this);
      }
      writeCustomPayload(payload) {
        let keys = Object.keys(payload);
        this.writeShort(keys.length), keys.forEach((k) => {
          this.writeString(k), this.writeBytes(payload[k]);
        });
      }
      writeStringMap(map) {
        let keys = [];
        for (let k in map)
          map.hasOwnProperty(k) && keys.push(k);
        this.writeShort(keys.length);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          this.writeString(key), this.writeString(map[key]);
        }
      }
      /**
       * @param {Number} version
       * @param {Number} streamId
       * @param {Number} [flags] Header flags
       * @returns {Buffer}
       * @throws {TypeError}
       */
      write(version, streamId, flags) {
        let headerBuffer = new FrameHeader(version, flags || 0, streamId, this.opcode, this.bodyLength).toBuffer();
        return this.buffers.unshift(headerBuffer), Buffer.concat(this.buffers, headerBuffer.length + this.bodyLength);
      }
    }, WriteQueue = class extends events.EventEmitter {
      /**
       * Creates a new WriteQueue instance.
       * @param {Socket} netClient
       * @param {Encoder} encoder
       * @param {ClientOptions} options
       */
      constructor(netClient, encoder, options) {
        super(), this.netClient = netClient, this.encoder = encoder, this.isRunning = !1, this.queue = [], this.coalescingThreshold = options.socketOptions.coalescingThreshold, this.error = null, this.canWrite = !0, netClient.on("drain", () => {
          this.canWrite = !0, this.run();
        });
      }
      /**
       * Enqueues a new request
       * @param {OperationState} operation
       * @param {Function} callback The write callback.
       */
      push(operation, callback) {
        let self = this;
        if (this.error)
          return process.nextTick(function() {
            callback(self.error);
          });
        this.queue.push({ operation, callback }), this.run();
      }
      run() {
        !this.isRunning && this.canWrite && (this.isRunning = !0, process.nextTick(() => this.process()));
      }
      process() {
        if (this.error)
          return;
        let buffers = [], callbacks = [], totalLength = 0;
        for (; this.queue.length > 0 && totalLength < this.coalescingThreshold; ) {
          let writeItem = this.queue.shift();
          if (!writeItem.operation.canBeWritten()) {
            writeItem.callback(new Error("The operation was already cancelled or timeout elapsed"));
            continue;
          }
          let data;
          try {
            data = writeItem.operation.request.write(this.encoder, writeItem.operation.streamId);
          } catch (err) {
            writeItem.callback(err);
            continue;
          }
          totalLength += data.length, buffers.push(data), callbacks.push(writeItem.callback);
        }
        if (totalLength === 0) {
          this.isRunning = !1;
          return;
        }
        for (let i = 0; i < callbacks.length; i++)
          callbacks[i]();
        this.canWrite = this.netClient.write(Buffer.concat(buffers, totalLength), (err) => {
          if (err) {
            this.setWriteError(err);
            return;
          }
          if (this.queue.length === 0 || !this.canWrite) {
            this.isRunning = !1;
            return;
          }
          setImmediate(() => this.process());
        });
      }
      /**
       * Emits the 'error' event and callbacks items that haven't been written and clears them from the queue.
       * @param err
       */
      setWriteError(err) {
        err.isSocketError = !0, this.error = new types.DriverError("Socket was closed"), this.error.isSocketError = !0, this.error.requestNotWritten = !0, this.error.innerError = err;
        let q = this.queue;
        this.queue = utils.emptyArray;
        for (let i = 0; i < q.length; i++)
          q[i].callback(this.error);
      }
    };
    module2.exports = { FrameWriter, WriteQueue };
  }
});

// node_modules/cassandra-driver/lib/execution-options.js
var require_execution_options = __commonJS({
  "node_modules/cassandra-driver/lib/execution-options.js"(exports2, module2) {
    "use strict";
    var utils = require_utils(), types = require_types(), errors = require_errors(), proxyExecuteKey = "ProxyExecute", ExecutionOptions = class _ExecutionOptions {
      /**
       * Creates a new instance of {@link ExecutionOptions}.
       */
      constructor() {
      }
      /**
       * Creates an empty instance, where all methods return undefined, used internally.
       * @ignore
       * @return {ExecutionOptions}
       */
      static empty() {
        return new _ExecutionOptions();
      }
      /**
       * Determines if the stack trace before the query execution should be maintained.
       * @abstract
       * @returns {Boolean}
       */
      getCaptureStackTrace() {
      }
      /**
       * Gets the [Consistency level]{@link module:types~consistencies} to be used for the execution.
       * @abstract
       * @returns {Number}
       */
      getConsistency() {
      }
      /**
       * Key-value payload to be passed to the server. On the server side, implementations of QueryHandler can use
       * this data.
       * @abstract
       * @returns {Object}
       */
      getCustomPayload() {
      }
      /**
       * Gets the amount of rows to retrieve per page.
       * @abstract
       * @returns {Number}
       */
      getFetchSize() {
      }
      /**
       * When a fixed host is set on the query options and the query plan for the load-balancing policy is not used, it
       * gets the host that should handle the query.
       * @returns {Host}
       */
      getFixedHost() {
      }
      /**
       * Gets the type hints for parameters given in the query, ordered as for the parameters.
       * @abstract
       * @returns {Array|Array<Array>}
       */
      getHints() {
      }
      /**
       * Determines whether the driver must retrieve the following result pages automatically.
       * <p>
       *   This setting is only considered by the [Client#eachRow()]{@link Client#eachRow} method.
       * </p>
       * @abstract
       * @returns {Boolean}
       */
      isAutoPage() {
      }
      /**
       * Determines whether its a counter batch. Only valid for [Client#batch()]{@link Client#batch}, it will be ignored by
       * other methods.
       * @abstract
       * @returns {Boolean} A <code>Boolean</code> value, it can't be <code>undefined</code>.
       */
      isBatchCounter() {
      }
      /**
       * Determines whether the batch should be written to the batchlog. Only valid for
       * [Client#batch()]{@link Client#batch}, it will be ignored by other methods.
       * @abstract
       * @returns {Boolean} A <code>Boolean</code> value, it can't be <code>undefined</code>.
       */
      isBatchLogged() {
      }
      /**
       * Determines whether the query can be applied multiple times without changing the result beyond the initial
       * application.
       * @abstract
       * @returns {Boolean}
       */
      isIdempotent() {
      }
      /**
       * Determines whether the query must be prepared beforehand.
       * @abstract
       * @returns {Boolean} A <code>Boolean</code> value, it can't be <code>undefined</code>.
       */
      isPrepared() {
      }
      /**
       * Determines whether query tracing is enabled for the execution.
       * @abstract
       * @returns {Boolean}
       */
      isQueryTracing() {
      }
      /**
       * Gets the keyspace for the query when set at query options level.
       * <p>
       *   Note that this method will return <code>undefined</code> when the keyspace is not set at query options level.
       *   It will only return the keyspace name when the user provided a different keyspace than the current
       *   {@link Client} keyspace.
       * </p>
       * @abstract
       * @returns {String}
       */
      getKeyspace() {
      }
      /**
       * Gets the load balancing policy used for this execution.
       * @returns {LoadBalancingPolicy} A <code>LoadBalancingPolicy</code> instance, it can't be <code>undefined</code>.
       */
      getLoadBalancingPolicy() {
      }
      /**
       * Gets the Buffer representing the paging state.
       * @abstract
       * @returns {Buffer}
       */
      getPageState() {
      }
      /**
       * Internal method that gets the preferred host.
       * @abstract
       * @ignore
       */
      getPreferredHost() {
      }
      /**
       * Gets the query options as provided to the execution method without setting the default values.
       * @returns {QueryOptions}
       */
      getRawQueryOptions() {
      }
      /**
       * Gets the timeout in milliseconds to be used for the execution per coordinator.
       * <p>
       *   A value of <code>0</code> disables client side read timeout for the execution. Default: <code>undefined</code>.
       * </p>
       * @abstract
       * @returns {Number}
       */
      getReadTimeout() {
      }
      /**
       * Gets the [retry policy]{@link module:policies/retry} to be used.
       * @abstract
       * @returns {RetryPolicy} A <code>RetryPolicy</code> instance, it can't be <code>undefined</code>.
       */
      getRetryPolicy() {
      }
      /**
       * Internal method to obtain the row callback, for "by row" results.
       * @abstract
       * @ignore
       */
      getRowCallback() {
      }
      /**
       * Internal method to get or generate a timestamp for the request execution.
       * @ignore
       * @returns {Long|null}
       */
      getOrGenerateTimestamp() {
      }
      /**
       * Gets the index of the parameters that are part of the partition key to determine the routing.
       * @abstract
       * @ignore
       * @returns {Array}
       */
      getRoutingIndexes() {
      }
      /**
       * Gets the partition key(s) to determine which coordinator should be used for the query.
       * @abstract
       * @returns {Buffer|Array<Buffer>}
       */
      getRoutingKey() {
      }
      /**
       * Gets the array of the parameters names that are part of the partition key to determine the
       * routing. Only valid for non-prepared requests.
       * @abstract
       * @ignore
       */
      getRoutingNames() {
      }
      /**
       * Gets the the consistency level to be used for the serial phase of conditional updates.
       * @abstract
       * @returns {Number}
       */
      getSerialConsistency() {
      }
      /**
       * Gets the provided timestamp for the execution in microseconds from the unix epoch (00:00:00, January 1st, 1970).
       * <p>When a timestamp generator is used, this method returns <code>undefined</code>.</p>
       * @abstract
       * @returns {Number|Long|undefined|null}
       */
      getTimestamp() {
      }
      /**
       * @param {Array} hints
       * @abstract
       * @ignore
       */
      setHints(hints) {
      }
      /**
       * Sets the keyspace for the execution.
       * @ignore
       * @abstract
       * @param {String} keyspace
       */
      setKeyspace(keyspace) {
      }
      /**
       * @abstract
       * @ignore
       */
      setPageState() {
      }
      /**
       * Internal method that sets the preferred host.
       * @abstract
       * @ignore
       */
      setPreferredHost() {
      }
      /**
       * Sets the index of the parameters that are part of the partition key to determine the routing.
       * @param {Array} routingIndexes
       * @abstract
       * @ignore
       */
      setRoutingIndexes(routingIndexes) {
      }
      /**
       * Sets the routing key.
       * @abstract
       * @ignore
       */
      setRoutingKey(value) {
      }
    }, DefaultExecutionOptions = class _DefaultExecutionOptions extends ExecutionOptions {
      /**
       * Creates a new instance of {@link ExecutionOptions}.
       * @param {QueryOptions} queryOptions
       * @param {Client} client
       * @param {Function|null} rowCallback
       */
      constructor(queryOptions, client, rowCallback) {
        if (super(), this._queryOptions = queryOptions, this._rowCallback = rowCallback, this._routingKey = this._queryOptions.routingKey, this._hints = this._queryOptions.hints, this._keyspace = this._queryOptions.keyspace, this._routingIndexes = this._queryOptions.routingIndexes, this._pageState = typeof this._queryOptions.pageState == "string" ? utils.allocBufferFromString(this._queryOptions.pageState, "hex") : this._queryOptions.pageState, this._preferredHost = null, this._client = client, this._defaultQueryOptions = client.options.queryOptions, this._profile = client.profileManager.getProfile(this._queryOptions.executionProfile), this._customPayload = _DefaultExecutionOptions.createCustomPayload(this._queryOptions, this._defaultQueryOptions), !this._profile)
          throw new errors.ArgumentError(`Execution profile "${this._queryOptions.executionProfile}" not found`);
      }
      /**
       * Creates a payload for given user.
       * @param {QueryOptions} userOptions
       * @param {QueryOptions} defaultQueryOptions
       * @private
       */
      static createCustomPayload(userOptions, defaultQueryOptions) {
        let customPayload = userOptions.customPayload || defaultQueryOptions.customPayload, executeAs = userOptions.executeAs || defaultQueryOptions.executeAs;
        return executeAs && (customPayload ? customPayload[proxyExecuteKey] || (customPayload = utils.extend({}, customPayload), customPayload[proxyExecuteKey] = utils.allocBufferFromString(executeAs)) : (customPayload = {}, customPayload[proxyExecuteKey] = utils.allocBufferFromString(executeAs))), customPayload;
      }
      /**
       * Creates a new instance {@link ExecutionOptions}, based on the query options.
       * @param {QueryOptions|null} queryOptions
       * @param {Client} client
       * @param {Function|null} [rowCallback]
       * @ignore
       * @return {ExecutionOptions}
       */
      static create(queryOptions, client, rowCallback) {
        return (!queryOptions || typeof queryOptions == "function") && (queryOptions = utils.emptyObject), new _DefaultExecutionOptions(queryOptions, client, rowCallback);
      }
      getCaptureStackTrace() {
        return ifUndefined(this._queryOptions.captureStackTrace, this._defaultQueryOptions.captureStackTrace);
      }
      getConsistency() {
        return ifUndefined3(
          this._queryOptions.consistency,
          this._profile.consistency,
          this._defaultQueryOptions.consistency
        );
      }
      getCustomPayload() {
        return this._customPayload;
      }
      getFetchSize() {
        return ifUndefined(this._queryOptions.fetchSize, this._defaultQueryOptions.fetchSize);
      }
      getFixedHost() {
        return this._queryOptions.host;
      }
      getHints() {
        return this._hints;
      }
      isAutoPage() {
        return ifUndefined(this._queryOptions.autoPage, this._defaultQueryOptions.autoPage);
      }
      isBatchCounter() {
        return ifUndefined(this._queryOptions.counter, !1);
      }
      isBatchLogged() {
        return ifUndefined3(this._queryOptions.logged, this._defaultQueryOptions.logged, !0);
      }
      isIdempotent() {
        return ifUndefined(this._queryOptions.isIdempotent, this._defaultQueryOptions.isIdempotent);
      }
      /**
       * Determines if the query execution must be prepared beforehand.
       * @return {Boolean}
       */
      isPrepared() {
        return ifUndefined(this._queryOptions.prepare, this._defaultQueryOptions.prepare);
      }
      isQueryTracing() {
        return ifUndefined(this._queryOptions.traceQuery, this._defaultQueryOptions.traceQuery);
      }
      getKeyspace() {
        return this._keyspace;
      }
      getLoadBalancingPolicy() {
        return this._profile.loadBalancing;
      }
      getOrGenerateTimestamp() {
        let result = this.getTimestamp();
        if (result === void 0) {
          let generator = this._client.options.policies.timestampGeneration;
          types.protocolVersion.supportsTimestamp(this._client.controlConnection.protocolVersion) && generator ? result = generator.next(this._client) : result = null;
        }
        return typeof result == "number" ? types.Long.fromNumber(result) : result;
      }
      getPageState() {
        return this._pageState;
      }
      /**
       * Gets the profile defined by the user or the default profile
       * @internal
       * @ignore
       */
      getProfile() {
        return this._profile;
      }
      getRawQueryOptions() {
        return this._queryOptions;
      }
      getReadTimeout() {
        return ifUndefined3(
          this._queryOptions.readTimeout,
          this._profile.readTimeout,
          this._client.options.socketOptions.readTimeout
        );
      }
      getRetryPolicy() {
        return ifUndefined3(this._queryOptions.retry, this._profile.retry, this._client.options.policies.retry);
      }
      getRoutingIndexes() {
        return this._routingIndexes;
      }
      getRoutingKey() {
        return this._routingKey;
      }
      getRoutingNames() {
        return this._queryOptions.routingNames;
      }
      /**
       * Internal method to obtain the row callback, for "by row" results.
       * @ignore
       */
      getRowCallback() {
        return this._rowCallback;
      }
      getSerialConsistency() {
        return ifUndefined3(
          this._queryOptions.serialConsistency,
          this._profile.serialConsistency,
          this._defaultQueryOptions.serialConsistency
        );
      }
      getTimestamp() {
        return this._queryOptions.timestamp;
      }
      /**
       * Internal property to set the custom payload.
       * @ignore
       * @internal
       * @param {Object} payload
       */
      setCustomPayload(payload) {
        this._customPayload = payload;
      }
      /**
       * @param {Array} hints
       */
      setHints(hints) {
        this._hints = hints;
      }
      /**
       * @param {String} keyspace
       */
      setKeyspace(keyspace) {
        this._keyspace = keyspace;
      }
      /**
       * @param {Buffer} pageState
       */
      setPageState(pageState) {
        this._pageState = pageState;
      }
      /**
       * @param {Array} routingIndexes
       */
      setRoutingIndexes(routingIndexes) {
        this._routingIndexes = routingIndexes;
      }
      setRoutingKey(value) {
        this._routingKey = value;
      }
    };
    function ifUndefined(v1, v2) {
      return v1 !== void 0 ? v1 : v2;
    }
    function ifUndefined3(v1, v2, v3) {
      return v1 !== void 0 ? v1 : v2 !== void 0 ? v2 : v3;
    }
    module2.exports = { ExecutionOptions, DefaultExecutionOptions, proxyExecuteKey };
  }
});

// node_modules/cassandra-driver/package.json
var require_package = __commonJS({
  "node_modules/cassandra-driver/package.json"(exports2, module2) {
    module2.exports = {
      name: "cassandra-driver",
      version: "4.10.0",
      description: "Apache Cassandra Node.js Driver",
      author: "Apache Software Foundation",
      keywords: [
        "cassandra",
        "cql",
        "cql3",
        "connection",
        "gremlin",
        "datastax",
        "nosql",
        "driver",
        "database",
        "dse",
        "graph",
        "graphdb"
      ],
      license: "Apache-2.0",
      types: "./index.d.ts",
      dependencies: {
        "adm-zip": "~0.6.0",
        long: "~5.2.3"
      },
      devDependencies: {
        "@types/node": "^20.14.8",
        chai: "~4.3.8",
        kerberos: "^2.2.2",
        mocha: "~10.8.2",
        "mocha-jenkins-reporter": "~0.4.8",
        proxyquire: "~2.1.3",
        sinon: "~15.2.0",
        temp: ">= 0.8.3"
      },
      repository: {
        type: "git",
        url: "https://github.com/apache/cassandra-nodejs-driver.git"
      },
      bugs: {
        url: "https://issues.apache.org/jira/projects/CASSNODEJS/issues"
      },
      scripts: {
        test: "./node_modules/.bin/mocha test/unit -R spec -t 5000 --recursive",
        unit: "./node_modules/.bin/mocha test/unit -R spec -t 5000 --recursive",
        integration_short: "./node_modules/.bin/mocha test/integration/short -R spec -t 5000 --recursive",
        integration_long: "./node_modules/.bin/mocha test/integration/long -R spec -t 5000 --recursive",
        ci_jenkins: "./node_modules/.bin/mocha test/unit test/integration/short --recursive -R mocha-jenkins-reporter --exit",
        ci_appveyor: '.\\"node_modules/.bin/mocha" test/unit test/integration/short --recursive -R mocha-appveyor-reporter --exit',
        ci_unit_appveyor: '.\\"node_modules/.bin/mocha" test/unit --recursive -R mocha-appveyor-reporter --exit',
        server_api: "./node_modules/.bin/mocha test/integration/short -g '@SERVER_API' --recursive --exit",
        eslint: "eslint lib test"
      },
      engines: {
        node: ">=20"
      }
    };
  }
});

// node_modules/cassandra-driver/lib/requests.js
var require_requests = __commonJS({
  "node_modules/cassandra-driver/lib/requests.js"(exports2) {
    "use strict";
    var util = require("util"), { FrameWriter } = require_writers(), types = require_types(), utils = require_utils(), { ExecutionOptions } = require_execution_options(), packageInfo = require_package(), queryFlag = {
      values: 1,
      skipMetadata: 2,
      pageSize: 4,
      withPagingState: 8,
      withSerialConsistency: 16,
      withDefaultTimestamp: 32,
      withNameForValues: 64,
      withKeyspace: 128,
      withPageSizeBytes: 1073741824,
      withContinuousPaging: 2147483648
    }, batchFlag = {
      withSerialConsistency: 16,
      withDefaultTimestamp: 32,
      withNameForValues: 64,
      withKeyspace: 128
    }, prepareFlag = {
      withKeyspace: 1
    }, batchType = {
      logged: 0,
      unlogged: 1,
      counter: 2
    }, Request = class {
      constructor() {
        this.length = 0;
      }
      /**
       * @abstract
       * @param {Encoder} encoder
       * @param {Number} streamId
       * @throws {TypeError}
       * @returns {Buffer}
       */
      write(encoder, streamId) {
        throw new Error("Method must be implemented");
      }
      /**
       * Creates a new instance using the same constructor as the current instance, copying the properties.
       * @return {Request}
       */
      clone() {
        let newRequest = new this.constructor(), keysArray = Object.keys(this);
        for (let i = 0; i < keysArray.length; i++) {
          let key = keysArray[i];
          newRequest[key] = this[key];
        }
        return newRequest;
      }
    }, ExecuteRequest = class extends Request {
      /**
       * @param {String} query
       * @param queryId
       * @param params
       * @param {ExecutionOptions} execOptions
       * @param meta
       */
      constructor(query, queryId, params, execOptions, meta) {
        super(), this.query = query, this.queryId = queryId, this.params = params, this.meta = meta, this.options = execOptions || ExecutionOptions.empty(), this.timestamp = this.options.getOrGenerateTimestamp(), this.consistency = this.options.getConsistency() || types.consistencies.one, this.namedParameters = !1;
      }
      getParamType(index) {
        let columnInfo = this.meta.columns[index];
        return columnInfo ? columnInfo.type : null;
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.execute), headerFlags = this.options.isQueryTracing() ? types.frameFlags.tracing : 0;
        return this.options.getCustomPayload() && (headerFlags |= types.frameFlags.customPayload, frameWriter.writeCustomPayload(this.options.getCustomPayload())), frameWriter.writeShortBytes(this.queryId), types.protocolVersion.supportsResultMetadataId(encoder.protocolVersion) && frameWriter.writeShortBytes(this.meta.resultId), this.writeQueryParameters(frameWriter, encoder), this.length = frameWriter.bodyLength, frameWriter.write(encoder.protocolVersion, streamId, headerFlags);
      }
      /**
       * Writes v1 and v2 execute query parameters
       * @param {FrameWriter} frameWriter
       * @param {Encoder} encoder
       * @param {Boolean} [isQuery] True if query, otherwise assumed to be execute request.
       */
      writeQueryParameters(frameWriter, encoder, isQuery) {
        let flags = 0, timestamp = this.timestamp;
        if (types.protocolVersion.supportsPaging(encoder.protocolVersion)) {
          flags |= this.params && this.params.length ? queryFlag.values : 0, flags |= this.options.getFetchSize() > 0 ? queryFlag.pageSize : 0, flags |= this.options.getPageState() ? queryFlag.withPagingState : 0, flags |= this.options.getSerialConsistency() ? queryFlag.withSerialConsistency : 0, flags |= timestamp != null ? queryFlag.withDefaultTimestamp : 0, flags |= this.namedParameters ? queryFlag.withNameForValues : 0;
          let supportsKeyspace = isQuery && types.protocolVersion.supportsKeyspaceInRequest(encoder.protocolVersion);
          flags |= supportsKeyspace && this.options.getKeyspace() ? queryFlag.withKeyspace : 0, frameWriter.writeShort(this.consistency), types.protocolVersion.uses4BytesQueryFlags(encoder.protocolVersion) ? frameWriter.writeInt(flags) : frameWriter.writeByte(flags);
        }
        if (this.params && this.params.length) {
          frameWriter.writeShort(this.params.length);
          for (let i = 0; i < this.params.length; i++) {
            let paramValue = this.params[i];
            flags & queryFlag.withNameForValues && (frameWriter.writeString(paramValue.name), paramValue = paramValue.value), frameWriter.writeBytes(encoder.encode(paramValue, this.getParamType(i)));
          }
        }
        if (!types.protocolVersion.supportsPaging(encoder.protocolVersion)) {
          (!this.params || !this.params.length) && frameWriter.writeShort(0), frameWriter.writeShort(this.consistency);
          return;
        }
        flags & queryFlag.pageSize && frameWriter.writeInt(this.options.getFetchSize()), flags & queryFlag.withPagingState && frameWriter.writeBytes(this.options.getPageState()), flags & queryFlag.withSerialConsistency && frameWriter.writeShort(this.options.getSerialConsistency()), flags & queryFlag.withDefaultTimestamp && frameWriter.writeLong(timestamp), flags & queryFlag.withKeyspace && frameWriter.writeString(this.options.getKeyspace());
      }
    }, QueryRequest = class extends ExecuteRequest {
      /**
       * @param {String} query
       * @param params
       * @param {ExecutionOptions} [execOptions]
       * @param {Boolean} [namedParameters]
       */
      constructor(query, params, execOptions, namedParameters) {
        super(query, null, params, execOptions, null), this.hints = this.options.getHints() || utils.emptyArray, this.namedParameters = namedParameters;
      }
      getParamType(index) {
        return this.hints[index];
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.query), headerFlags = this.options.isQueryTracing() ? types.frameFlags.tracing : 0;
        return this.options.getCustomPayload() && (headerFlags |= types.frameFlags.customPayload, frameWriter.writeCustomPayload(this.options.getCustomPayload())), frameWriter.writeLString(this.query), types.protocolVersion.supportsPaging(encoder.protocolVersion) ? this.writeQueryParameters(frameWriter, encoder, !0) : frameWriter.writeShort(this.consistency), this.length = frameWriter.bodyLength, frameWriter.write(encoder.protocolVersion, streamId, headerFlags);
      }
    }, PrepareRequest = class extends Request {
      constructor(query, keyspace) {
        super(), this.query = query, this.keyspace = keyspace;
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.prepare);
        if (frameWriter.writeLString(this.query), types.protocolVersion.supportsPrepareFlags(encoder.protocolVersion)) {
          let flags = this.keyspace && types.protocolVersion.supportsKeyspaceInRequest(encoder.protocolVersion) ? prepareFlag.withKeyspace : 0;
          frameWriter.writeInt(flags), flags & prepareFlag.withKeyspace && frameWriter.writeString(this.keyspace);
        }
        return frameWriter.write(encoder.protocolVersion, streamId);
      }
    }, StartupRequest = class extends Request {
      /**
       * Creates a new instance of {@link StartupRequest}.
       * @param {Object} [options]
       * @param [options.cqlVersion]
       * @param [options.noCompact]
       * @param [options.clientId]
       * @param [options.applicationName]
       * @param [options.applicationVersion]
       */
      constructor(options2) {
        super(), this.options = options2 || {};
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.startup), startupOptions = {
          CQL_VERSION: this.options.cqlVersion || "3.0.0",
          DRIVER_NAME: packageInfo.description,
          DRIVER_VERSION: packageInfo.version
        };
        return this.options.noCompact && (startupOptions.NO_COMPACT = "true"), this.options.clientId && (startupOptions.CLIENT_ID = this.options.clientId.toString()), this.options.applicationName && (startupOptions.APPLICATION_NAME = this.options.applicationName), this.options.applicationVersion && (startupOptions.APPLICATION_VERSION = this.options.applicationVersion), frameWriter.writeStringMap(startupOptions), frameWriter.write(encoder.protocolVersion, streamId);
      }
    }, RegisterRequest = class extends Request {
      constructor(events) {
        super(), this.events = events;
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.register);
        return frameWriter.writeStringList(this.events), frameWriter.write(encoder.protocolVersion, streamId);
      }
    }, AuthResponseRequest = class extends Request {
      constructor(token) {
        super(), this.token = token;
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.authResponse);
        return frameWriter.writeBytes(this.token), frameWriter.write(encoder.protocolVersion, streamId);
      }
    }, CredentialsRequest = class extends Request {
      constructor(username, password) {
        super(), this.username = username, this.password = password;
      }
      write(encoder, streamId) {
        let frameWriter = new FrameWriter(types.opcodes.credentials);
        return frameWriter.writeStringMap({ username: this.username, password: this.password }), frameWriter.write(encoder.protocolVersion, streamId);
      }
    }, BatchRequest = class _BatchRequest extends Request {
      /**
       * Creates a new instance of BatchRequest.
       * @param {Array.<{query, params, [info]}>} queries Array of objects with the properties query and params
       * @param {ExecutionOptions} execOptions
       */
      constructor(queries, execOptions) {
        super(), this.queries = queries, this.options = execOptions, this.timestamp = this.options.getOrGenerateTimestamp(), this.hints = execOptions.getHints() || utils.emptyArray, this.type = batchType.logged, execOptions.isBatchCounter() ? this.type = batchType.counter : execOptions.isBatchLogged() || (this.type = batchType.unlogged);
      }
      /**
      * Writes a batch request
      */
      write(encoder, streamId) {
        if (!this.queries || !(this.queries.length > 0))
          throw new TypeError(util.format("Invalid queries provided %s", this.queries));
        let frameWriter = new FrameWriter(types.opcodes.batch), headerFlags = this.options.isQueryTracing() ? types.frameFlags.tracing : 0;
        this.options.getCustomPayload() && (headerFlags |= types.frameFlags.customPayload, frameWriter.writeCustomPayload(this.options.getCustomPayload())), frameWriter.writeByte(this.type), frameWriter.writeShort(this.queries.length);
        let self = this;
        if (this.queries.forEach(function(item, i) {
          let hints = self.hints[i], params = item.params || utils.emptyArray, getParamType;
          item.queryId ? (frameWriter.writeByte(1), frameWriter.writeShortBytes(item.queryId), getParamType = (i2) => item.meta.columns[i2].type) : (frameWriter.writeByte(0), frameWriter.writeLString(item.query), getParamType = hints ? (i2) => hints[i2] : () => null), frameWriter.writeShort(params.length), params.forEach((param, index) => frameWriter.writeBytes(encoder.encode(param, getParamType(index))));
        }, this), frameWriter.writeShort(this.options.getConsistency()), types.protocolVersion.supportsTimestamp(encoder.protocolVersion)) {
          let flags = this.options.getSerialConsistency() ? batchFlag.withSerialConsistency : 0, timestamp = this.timestamp;
          flags |= timestamp != null ? batchFlag.withDefaultTimestamp : 0, flags |= this.options.getKeyspace() && types.protocolVersion.supportsKeyspaceInRequest(encoder.protocolVersion) ? batchFlag.withKeyspace : 0, types.protocolVersion.uses4BytesQueryFlags(encoder.protocolVersion) ? frameWriter.writeInt(flags) : frameWriter.writeByte(flags), flags & batchFlag.withSerialConsistency && frameWriter.writeShort(this.options.getSerialConsistency()), flags & batchFlag.withDefaultTimestamp && frameWriter.writeLong(timestamp), flags & batchFlag.withKeyspace && frameWriter.writeString(this.options.getKeyspace());
        }
        return this.length = frameWriter.bodyLength, frameWriter.write(encoder.protocolVersion, streamId, headerFlags);
      }
      clone() {
        return new _BatchRequest(this.queries, this.options);
      }
    };
    function CancelRequest(operationId) {
      this.streamId = null, this.operationId = operationId;
    }
    util.inherits(CancelRequest, Request);
    CancelRequest.prototype.write = function(encoder, streamId) {
      let frameWriter = new FrameWriter(types.opcodes.cancel);
      return frameWriter.writeInt(1), frameWriter.writeInt(this.operationId), frameWriter.write(encoder.protocolVersion, streamId);
    };
    var OptionsRequest = class extends Request {
      write(encoder, streamId) {
        return new FrameWriter(types.opcodes.options).write(encoder.protocolVersion, streamId, 0);
      }
      clone() {
        return this;
      }
    }, options = new OptionsRequest();
    exports2.AuthResponseRequest = AuthResponseRequest;
    exports2.BatchRequest = BatchRequest;
    exports2.CancelRequest = CancelRequest;
    exports2.CredentialsRequest = CredentialsRequest;
    exports2.ExecuteRequest = ExecuteRequest;
    exports2.PrepareRequest = PrepareRequest;
    exports2.QueryRequest = QueryRequest;
    exports2.Request = Request;
    exports2.RegisterRequest = RegisterRequest;
    exports2.StartupRequest = StartupRequest;
    exports2.options = options;
  }
});

// node_modules/cassandra-driver/lib/metadata/client-state.js
var require_client_state = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/client-state.js"(exports2, module2) {
    "use strict";
    var util = require("util"), errors = require_errors(), ClientState = class _ClientState {
      /**
       * Creates a new instance of <code>ClientState</code>.
       * @param {Array<Host>} hosts
       * @param {Object.<String, Number>} openConnections
       * @param {Object.<String, Number>} inFlightQueries
       */
      constructor(hosts, openConnections, inFlightQueries) {
        this._hosts = hosts, this._openConnections = openConnections, this._inFlightQueries = inFlightQueries;
      }
      /**
       * Get an array of hosts to which the client is connected to.
       * @return {Array<Host>}
       */
      getConnectedHosts() {
        return this._hosts;
      }
      /**
       * Gets the amount of open connections to a given host.
       * @param {Host} host
       * @return {Number}
       */
      getOpenConnections(host) {
        if (!host)
          throw new errors.ArgumentError("Host is not defined");
        return this._openConnections[host.address] || 0;
      }
      /**
       * Gets the amount of queries that are currently being executed through a given host.
       * <p>
       * This corresponds to the number of queries that have been sent by the Client to server Host on one of its connections
       * but haven't yet obtained a response.
       * </p>
       * @param {Host} host
       * @return {Number}
       */
      getInFlightQueries(host) {
        if (!host)
          throw new errors.ArgumentError("Host is not defined");
        return this._inFlightQueries[host.address] || 0;
      }
      /**
       * Returns the string representation of the instance.
       */
      toString() {
        return util.format(
          '{"hosts": %j, "openConnections": %j, "inFlightQueries": %j}',
          this._hosts.map(function(h) {
            return h.address;
          }),
          this._openConnections,
          this._inFlightQueries
        );
      }
      /**
       * Creates a new instance from the provided client.
       * @param {Client} client
       * @internal
       * @ignore
       */
      static from(client) {
        let openConnections = {}, inFlightQueries = {}, hostArray = [];
        return client.hosts.forEach((host) => {
          host.pool.connections.length !== 0 && (hostArray.push(host), openConnections[host.address] = host.pool.connections.length, inFlightQueries[host.address] = host.getInFlight());
        }), new _ClientState(hostArray, openConnections, inFlightQueries);
      }
    };
    module2.exports = ClientState;
  }
});

// node_modules/cassandra-driver/lib/types/mutable-long.js
var require_mutable_long = __commonJS({
  "node_modules/cassandra-driver/lib/types/mutable-long.js"(exports2, module2) {
    "use strict";
    var Long = require_umd(), TWO_PWR_16_DBL = 65536, TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL, MutableLong = class _MutableLong {
      constructor(b00, b16, b32, b48) {
        this._arr = [b00 & 65535, b16 & 65535, b32 & 65535, b48 & 65535];
      }
      toString() {
        return this.toImmutable().toString();
      }
      /**
       * Compares this value with the provided value.
       * @param {MutableLong} other
       * @return {number}
       */
      compare(other) {
        let thisNeg = this.isNegative(), otherNeg = other.isNegative();
        return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : this._compareBits(other);
      }
      _compareBits(other) {
        for (let i = 3; i >= 0; i--) {
          if (this._arr[i] > other._arr[i])
            return 1;
          if (this._arr[i] < other._arr[i])
            return -1;
        }
        return 0;
      }
      getUint16(index) {
        return this._arr[index];
      }
      getLowBitsUnsigned() {
        return (this._arr[0] | (this._arr[1] & 65535) << 16) >>> 0;
      }
      getHighBitsUnsigned() {
        return (this._arr[2] | this._arr[3] << 16) >>> 0;
      }
      toNumber() {
        return (this._arr[3] << 16 | this._arr[2]) * TWO_PWR_32_DBL + ((this._arr[1] << 16 | this._arr[0]) >>> 0);
      }
      /**
       * Performs the bitwise NOT of this value.
       * @return {MutableLong}
       */
      not() {
        return this._arr[0] = ~this._arr[0] & 65535, this._arr[1] = ~this._arr[1] & 65535, this._arr[2] = ~this._arr[2] & 65535, this._arr[3] = ~this._arr[3] & 65535, this;
      }
      add(addend) {
        let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        return c00 += this._arr[0] + addend._arr[0], this._arr[0] = c00 & 65535, c16 += c00 >>> 16, c16 += this._arr[1] + addend._arr[1], this._arr[1] = c16 & 65535, c32 += c16 >>> 16, c32 += this._arr[2] + addend._arr[2], this._arr[2] = c32 & 65535, c48 += c32 >>> 16, c48 += this._arr[3] + addend._arr[3], this._arr[3] = c48 & 65535, this;
      }
      shiftLeft(numBits) {
        if (numBits === 0)
          return this;
        if (numBits >= 64)
          return this.toZero();
        let remainingBits = numBits % 16, pos = Math.floor(numBits / 16);
        return pos > 0 && (this._arr[3] = this._arr[3 - pos], this._arr[2] = pos > 2 ? 0 : this._arr[2 - pos], this._arr[1] = pos > 1 ? 0 : this._arr[0], this._arr[0] = 0), remainingBits > 0 && (this._arr[3] = (this._arr[3] << remainingBits | this._arr[2] >>> 16 - remainingBits) & 65535, this._arr[2] = (this._arr[2] << remainingBits | this._arr[1] >>> 16 - remainingBits) & 65535, this._arr[1] = (this._arr[1] << remainingBits | this._arr[0] >>> 16 - remainingBits) & 65535, this._arr[0] = this._arr[0] << remainingBits & 65535), this;
      }
      shiftRightUnsigned(numBits) {
        if (numBits === 0)
          return this;
        if (numBits >= 64)
          return this.toZero();
        let remainingBits = numBits % 16, pos = Math.floor(numBits / 16);
        return pos > 0 && (this._arr[0] = this._arr[pos], this._arr[1] = pos > 2 ? 0 : this._arr[1 + pos], this._arr[2] = pos > 1 ? 0 : this._arr[3], this._arr[3] = 0), remainingBits > 0 && (this._arr[0] = this._arr[0] >>> remainingBits | this._arr[1] << 16 - remainingBits & 65535, this._arr[1] = this._arr[1] >>> remainingBits | this._arr[2] << 16 - remainingBits & 65535, this._arr[2] = this._arr[2] >>> remainingBits | this._arr[3] << 16 - remainingBits & 65535, this._arr[3] = this._arr[3] >>> remainingBits), this;
      }
      or(other) {
        return this._arr[0] |= other._arr[0], this._arr[1] |= other._arr[1], this._arr[2] |= other._arr[2], this._arr[3] |= other._arr[3], this;
      }
      /**
       * Returns the bitwise XOR of this Long and the given one.
       * @param {MutableLong} other
       * @returns {MutableLong} this instance.
       */
      xor(other) {
        return this._arr[0] ^= other._arr[0], this._arr[1] ^= other._arr[1], this._arr[2] ^= other._arr[2], this._arr[3] ^= other._arr[3], this;
      }
      clone() {
        return new _MutableLong(this._arr[0], this._arr[1], this._arr[2], this._arr[3]);
      }
      /**
       * Performs the product of this and the specified Long.
       * @param {MutableLong} multiplier
       * @returns {MutableLong} this instance.
       */
      multiply(multiplier) {
        let negate = !1;
        if (this.isZero() || multiplier.isZero())
          return this.toZero();
        this.isNegative() && (this.negate(), negate = !negate), multiplier.isNegative() && (multiplier = multiplier.clone().negate(), negate = !negate);
        let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        return c00 += this._arr[0] * multiplier._arr[0], c16 += c00 >>> 16, c16 += this._arr[1] * multiplier._arr[0], c32 += c16 >>> 16, c16 &= 65535, c16 += this._arr[0] * multiplier._arr[1], c32 += c16 >>> 16, c32 += this._arr[2] * multiplier._arr[0], c48 += c32 >>> 16, c32 &= 65535, c32 += this._arr[1] * multiplier._arr[1], c48 += c32 >>> 16, c32 &= 65535, c32 += this._arr[0] * multiplier._arr[2], c48 += c32 >>> 16, c48 += this._arr[3] * multiplier._arr[0] + this._arr[2] * multiplier._arr[1] + this._arr[1] * multiplier._arr[2] + this._arr[0] * multiplier._arr[3], this._arr[0] = c00 & 65535, this._arr[1] = c16 & 65535, this._arr[2] = c32 & 65535, this._arr[3] = c48 & 65535, negate && this.negate(), this;
      }
      toZero() {
        return this._arr[3] = this._arr[2] = this._arr[1] = this._arr[0] = 0, this;
      }
      isZero() {
        return this._arr[3] === 0 && this._arr[2] === 0 && this._arr[1] === 0 && this._arr[0] === 0;
      }
      isNegative() {
        return (this._arr[3] & 32768) > 0;
      }
      /**
       * Negates this value.
       * @return {MutableLong}
       */
      negate() {
        return this.not().add(_MutableLong.one);
      }
      equals(other) {
        return other instanceof _MutableLong ? this._arr[0] === other._arr[0] && this._arr[1] === other._arr[1] && this._arr[2] === other._arr[2] && this._arr[3] === other._arr[3] : !1;
      }
      toImmutable() {
        return Long.fromBits(this.getLowBitsUnsigned(), this.getHighBitsUnsigned(), !1);
      }
      static fromNumber(value) {
        if (isNaN(value) || !isFinite(value))
          return new _MutableLong();
        if (value < 0)
          return _MutableLong.fromNumber(-value).negate();
        let low32Bits = value % TWO_PWR_32_DBL, high32Bits = value / TWO_PWR_32_DBL;
        return _MutableLong.fromBits(low32Bits, high32Bits);
      }
      static fromBits(low32Bits, high32Bits) {
        return new _MutableLong(low32Bits, low32Bits >>> 16, high32Bits, high32Bits >>> 16);
      }
      /**
       * Returns a Long representation of the given string, written using the specified radix.
       * @param {String} str
       * @param {Number} [radix]
       * @return {MutableLong}
       */
      static fromString(str, radix) {
        if (typeof str != "string")
          throw new Error("String format is not valid: " + str);
        if (str.length === 0)
          throw Error("number format error: empty string");
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
          return new _MutableLong();
        if (radix = radix || 10, radix < 2 || radix > 36)
          throw Error("radix out of range: " + radix);
        let p;
        if ((p = str.indexOf("-")) > 0)
          throw Error('number format error: interior "-" character: ' + str);
        if (p === 0)
          return _MutableLong.fromString(str.substring(1), radix).negate();
        let radixToPower = _MutableLong.fromNumber(Math.pow(radix, 8)), result = new _MutableLong();
        for (let i = 0; i < str.length; i += 8) {
          let size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
          if (size < 8) {
            let power = _MutableLong.fromNumber(Math.pow(radix, size));
            result.multiply(power).add(_MutableLong.fromNumber(value));
            break;
          }
          result.multiply(radixToPower), result.add(_MutableLong.fromNumber(value));
        }
        return result;
      }
    };
    MutableLong.one = new MutableLong(1, 0, 0, 0);
    module2.exports = MutableLong;
  }
});

// node_modules/cassandra-driver/lib/token.js
var require_token = __commonJS({
  "node_modules/cassandra-driver/lib/token.js"(exports2) {
    "use strict";
    var types = require_types(), util = require("util"), _Murmur3TokenType = types.dataTypes.getByName("bigint"), _RandomTokenType = types.dataTypes.getByName("varint"), _OrderedTokenType = types.dataTypes.getByName("blob"), Token = class {
      constructor(value) {
        this._value = value;
      }
      /**
       * @returns {{code: number, info: *|Object}} The type info for the
       *                                           type of the value of the token.
       */
      getType() {
        throw new Error("You must implement a getType function for this Token instance");
      }
      /**
       * @returns {*} The raw value of the token.
       */
      getValue() {
        return this._value;
      }
      toString() {
        return this._value.toString();
      }
      /**
       * Returns 0 if the values are equal, 1 if greater than other, -1
       * otherwise.
       *
       * @param {Token} other 
       * @returns {Number}
       */
      compare(other) {
        return this._value.compare(other._value);
      }
      equals(other) {
        return this.compare(other) === 0;
      }
      inspect() {
        return this.constructor.name + " { " + this.toString() + " }";
      }
    }, Murmur3Token = class extends Token {
      constructor(value) {
        super(value);
      }
      getType() {
        return _Murmur3TokenType;
      }
    }, RandomToken = class extends Token {
      constructor(value) {
        super(value);
      }
      getType() {
        return _RandomTokenType;
      }
    }, ByteOrderedToken = class extends Token {
      constructor(value) {
        super(value);
      }
      getType() {
        return _OrderedTokenType;
      }
      toString() {
        return this._value.toString("hex").toUpperCase();
      }
    }, TokenRange = class _TokenRange {
      constructor(start, end, tokenizer) {
        this.start = start, this.end = end, Object.defineProperty(this, "_tokenizer", { value: tokenizer, enumerable: !1 });
      }
      /**
       * Splits this range into a number of smaller ranges of equal "size"
       * (referring to the number of tokens, not the actual amount of data).
       *
       * Splitting an empty range is not permitted.  But not that, in edge
       * cases, splitting a range might produce one or more empty ranges.
       *
       * @param {Number} numberOfSplits Number of splits to make.
       * @returns {TokenRange[]} Split ranges.
       * @throws {Error} If splitting an empty range.
       */
      splitEvenly(numberOfSplits) {
        if (numberOfSplits < 1)
          throw new Error(util.format("numberOfSplits (%d) must be greater than 0.", numberOfSplits));
        if (this.isEmpty())
          throw new Error("Can't split empty range " + this.toString());
        let tokenRanges = [], splitPoints = this._tokenizer.split(this.start, this.end, numberOfSplits), splitStart = this.start, splitEnd;
        for (let splitIndex = 0; splitIndex < splitPoints.length; splitIndex++)
          splitEnd = splitPoints[splitIndex], tokenRanges.push(new _TokenRange(splitStart, splitEnd, this._tokenizer)), splitStart = splitEnd;
        return tokenRanges.push(new _TokenRange(splitStart, this.end, this._tokenizer)), tokenRanges;
      }
      /**
       * A range is empty when start and end are the same token, except if
       * that is the minimum token, in which case the range covers the
       * whole ring.  This is consistent with the behavior of CQL range
       * queries.
       *
       * @returns {boolean} Whether this range is empty.
       */
      isEmpty() {
        return this.start.equals(this.end) && !this.start.equals(this._tokenizer.minToken());
      }
      /**
       * A range wraps around the end of the ring when the start token
       * is greater than the end token and the end token is not the 
       * minimum token.
       *
       * @returns {boolean} Whether this range wraps around.
       */
      isWrappedAround() {
        return this.start.compare(this.end) > 0 && !this.end.equals(this._tokenizer.minToken());
      }
      /**
       * Splits this range into a list of two non-wrapping ranges.
       *
       * This will return the range itself if it is non-wrapped, or two
       * ranges otherwise.
       *
       * This is useful for CQL range queries, which do not handle
       * wrapping.
       *
       * @returns {TokenRange[]} The list of non-wrapping ranges.
       */
      unwrap() {
        return this.isWrappedAround() ? [
          new _TokenRange(this.start, this._tokenizer.minToken(), this._tokenizer),
          new _TokenRange(this._tokenizer.minToken(), this.end, this._tokenizer)
        ] : [this];
      }
      /**
       * Whether this range contains a given Token.
       * 
       * @param {*} token Token to check for.
       * @returns {boolean} Whether or not the Token is in this range.
       */
      contains(token) {
        if (this.isEmpty())
          return !1;
        let minToken = this._tokenizer.minToken();
        if (this.end.equals(minToken))
          return this.start.equals(minToken) || token.equals(minToken) ? !0 : token.compare(this.start) > 0;
        let isAfterStart = token.compare(this.start) > 0, isBeforeEnd = token.compare(this.end) <= 0;
        return this.isWrappedAround() ? isAfterStart || isBeforeEnd : isAfterStart && isBeforeEnd;
      }
      /**
       * Determines if the input range is equivalent to this one.
       * 
       * @param {TokenRange} other Range to compare with.
       * @returns {boolean} Whether or not the ranges are equal.
       */
      equals(other) {
        return other === this ? !0 : other instanceof _TokenRange ? this.compare(other) === 0 : !1;
      }
      /**
       * Returns 0 if the values are equal, otherwise compares against
       * start, if start is equal, compares against end.
       *  
       * @param {TokenRange} other Range to compare with.
       * @returns {Number} 
       */
      compare(other) {
        let compareStart = this.start.compare(other.start);
        return compareStart !== 0 ? compareStart : this.end.compare(other.end);
      }
      toString() {
        return util.format(
          "]%s, %s]",
          this.start.toString(),
          this.end.toString()
        );
      }
    };
    exports2.Token = Token;
    exports2.TokenRange = TokenRange;
    exports2.ByteOrderedToken = ByteOrderedToken;
    exports2.Murmur3Token = Murmur3Token;
    exports2.RandomToken = RandomToken;
  }
});

// node_modules/cassandra-driver/lib/datastax/search/date-range.js
var require_date_range = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/search/date-range.js"(exports2) {
    "use strict";
    var utils = require_utils(), Long = require_umd(), dateRegex = /^[-+]?(\d{1,6})(?:-(\d{1,2}))?(?:-(\d{1,2}))?(?:T(\d{1,2}?)?(?::(\d{1,2}))?(?::(\d{1,2})(?:\.(\d{1,3}))?)?)?Z?$/, multipleBoundariesRegex = /^\[(.+?) TO (.+)]$/, unbounded = Object.freeze(new DateRangeBound(null, -1)), dateRangeType = {
      // single value as in "2001-01-01"
      singleValue: 0,
      // closed range as in "[2001-01-01 TO 2001-01-31]"
      closedRange: 1,
      // open range high as in "[2001-01-01 TO *]"
      openRangeHigh: 2,
      // - 0x03 - open range low as in "[* TO 2001-01-01]"
      openRangeLow: 3,
      // - 0x04 - both ranges open as in "[* TO *]"
      openBoth: 4,
      // - 0x05 - single open range as in "[*]"
      openSingle: 5
    }, dateRangePrecision = {
      year: 0,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 6
    };
    function DateRange(lowerBound, upperBound) {
      if (!lowerBound)
        throw new TypeError("The lower boundaries must be defined");
      this.lowerBound = lowerBound, this.upperBound = upperBound || null, this.upperBound === null ? this.lowerBound !== unbounded ? this._type = dateRangeType.singleValue : this._type = dateRangeType.openSingle : this.lowerBound !== unbounded ? this._type = this.upperBound !== unbounded ? dateRangeType.closedRange : dateRangeType.openRangeHigh : this._type = this.upperBound !== unbounded ? dateRangeType.openRangeLow : dateRangeType.openBoth;
    }
    DateRange.prototype.equals = function(other) {
      return other instanceof DateRange ? other.lowerBound.equals(this.lowerBound) && (other.upperBound ? other.upperBound.equals(this.upperBound) : !this.upperBound) : !1;
    };
    DateRange.prototype.toString = function() {
      return this.upperBound === null ? this.lowerBound.toString() : "[" + this.lowerBound.toString() + " TO " + this.upperBound.toString() + "]";
    };
    DateRange.prototype.toBuffer = function() {
      if (this._type === dateRangeType.openBoth || this._type === dateRangeType.openSingle)
        return utils.allocBufferFromArray([this._type]);
      let buffer, offset = 0;
      if (this._type !== dateRangeType.closedRange) {
        let boundary = this._type !== dateRangeType.openRangeLow ? this.lowerBound : this.upperBound;
        return buffer = utils.allocBufferUnsafe(10), buffer.writeUInt8(this._type, offset++), offset = writeDate(boundary.date, buffer, offset), buffer.writeUInt8(boundary.precision, offset), buffer;
      }
      return buffer = utils.allocBufferUnsafe(19), buffer.writeUInt8(this._type, offset++), offset = writeDate(this.lowerBound.date, buffer, offset), buffer.writeUInt8(this.lowerBound.precision, offset++), offset = writeDate(this.upperBound.date, buffer, offset), buffer.writeUInt8(this.upperBound.precision, offset), buffer;
    };
    DateRange.fromString = function(dateRangeString) {
      let matches = multipleBoundariesRegex.exec(dateRangeString);
      return matches ? new DateRange(DateRangeBound.toLowerBound(DateRangeBound.fromString(matches[1])), DateRangeBound.toUpperBound(DateRangeBound.fromString(matches[2]))) : new DateRange(DateRangeBound.toLowerBound(DateRangeBound.fromString(dateRangeString)));
    };
    DateRange.fromBuffer = function(buffer) {
      if (buffer.length === 0)
        throw new TypeError("DateRange serialized value must have at least 1 byte");
      let type = buffer.readUInt8(0);
      if (type === dateRangeType.openBoth)
        return new DateRange(unbounded, unbounded);
      if (type === dateRangeType.openSingle)
        return new DateRange(unbounded);
      let offset = 1, date1, lowerBound, upperBound = null;
      if (type !== dateRangeType.closedRange)
        return date1 = readDate(buffer, offset), offset += 8, lowerBound = new DateRangeBound(date1, buffer.readUInt8(offset)), type === dateRangeType.openRangeLow ? (upperBound = lowerBound, lowerBound = unbounded) : upperBound = type === dateRangeType.openRangeHigh ? unbounded : null, new DateRange(lowerBound, upperBound);
      date1 = readDate(buffer, offset), offset += 8, lowerBound = new DateRangeBound(date1, buffer.readUInt8(offset++));
      let date2 = readDate(buffer, offset);
      return offset += 8, upperBound = new DateRangeBound(date2, buffer.readUInt8(offset)), new DateRange(lowerBound, upperBound);
    };
    function writeDate(date, buffer, offset) {
      let long = Long.fromNumber(date.getTime());
      return buffer.writeUInt32BE(long.getHighBitsUnsigned(), offset), buffer.writeUInt32BE(long.getLowBitsUnsigned(), offset + 4), offset + 8;
    }
    function readDate(buffer, offset) {
      let long = new Long(buffer.readInt32BE(offset + 4), buffer.readInt32BE(offset));
      return new Date(long.toNumber());
    }
    function DateRangeBound(date, precision) {
      this.date = date, this.precision = precision;
    }
    DateRangeBound.prototype.toString = function() {
      if (this.precision === -1)
        return "*";
      let precision = 0, isoString = this.date.toISOString(), i, char;
      for (i = 4; i < isoString.length && precision <= this.precision; i++) {
        if (char = isoString.charAt(i), precision === dateRangePrecision.day && char === "T") {
          precision = dateRangePrecision.hour;
          continue;
        }
        if (precision >= dateRangePrecision.hour && char === ":" || char === ".") {
          precision++;
          continue;
        }
        precision < dateRangePrecision.day && char === "-" && precision++;
      }
      let start = 0, firstChar = isoString.charAt(0), sign = "", toRemoveIndex = 4;
      if (firstChar === "+" || firstChar === "-")
        for (sign = firstChar, firstChar === "-" && (toRemoveIndex = 3), start = 1; start < toRemoveIndex && isoString.charAt(start) === "0"; start++)
          ;
      return this.precision !== dateRangePrecision.millisecond && i--, sign + isoString.substring(start, i);
    };
    DateRangeBound.prototype.equals = function(other) {
      return !(other instanceof DateRangeBound) || other.precision !== this.precision ? !1 : datesEqual(other.date, this.date);
    };
    function datesEqual(d1, d2) {
      let t1 = d1 ? d1.getTime() : null, t2 = d2 ? d2.getTime() : null;
      return t1 === t2;
    }
    DateRangeBound.prototype.isUnbounded = function() {
      return this.precision === -1;
    };
    DateRangeBound.fromString = function(boundaryString) {
      if (!boundaryString)
        return null;
      if (boundaryString === "*")
        return unbounded;
      let matches = dateRegex.exec(boundaryString);
      if (!matches)
        throw TypeError("String provided is not a valid date " + boundaryString);
      if (matches[7] !== void 0 && matches[5] === void 0)
        throw new TypeError("String representation of the date contains the milliseconds portion but not the seconds: " + boundaryString);
      let builder = new BoundaryBuilder(boundaryString.charAt(0) === "-");
      for (let i = 1; i < matches.length; i++)
        builder.set(i - 1, matches[i], boundaryString);
      return builder.build();
    };
    DateRangeBound.unbounded = unbounded;
    DateRangeBound.toLowerBound = function(bound) {
      if (bound === unbounded)
        return bound;
      let rounded = new Date(bound.date.getTime());
      switch (bound.precision) {
        case dateRangePrecision.year:
          rounded.setUTCMonth(0);
        case dateRangePrecision.month:
          rounded.setUTCDate(1);
        case dateRangePrecision.day:
          rounded.setUTCHours(0);
        case dateRangePrecision.hour:
          rounded.setUTCMinutes(0);
        case dateRangePrecision.minute:
          rounded.setUTCSeconds(0);
        case dateRangePrecision.second:
          rounded.setUTCMilliseconds(0);
      }
      return new DateRangeBound(rounded, bound.precision);
    };
    DateRangeBound.toUpperBound = function(bound) {
      if (bound === unbounded)
        return bound;
      let rounded = new Date(bound.date.getTime());
      switch (bound.precision) {
        case dateRangePrecision.year:
          rounded.setUTCMonth(11);
        case dateRangePrecision.month:
          rounded.setUTCMonth(rounded.getUTCMonth() + 1, 0);
        case dateRangePrecision.day:
          rounded.setUTCHours(23);
        case dateRangePrecision.hour:
          rounded.setUTCMinutes(59);
        case dateRangePrecision.minute:
          rounded.setUTCSeconds(59);
        case dateRangePrecision.second:
          rounded.setUTCMilliseconds(999);
      }
      return new DateRangeBound(rounded, bound.precision);
    };
    function BoundaryBuilder(isNegative) {
      this._sign = isNegative ? -1 : 1, this._index = 0, this._values = new Int32Array(7);
    }
    BoundaryBuilder.prototype.set = function(index, value, stringDate) {
      if (value === void 0)
        return;
      if (index > 6)
        throw new TypeError("Index out of bounds: " + index);
      index > this._index && (this._index = index);
      let numValue = +value;
      switch (index) {
        case dateRangePrecision.month:
          if (numValue < 1 || numValue > 12)
            throw new TypeError("Month portion is not valid for date: " + stringDate);
          break;
        case dateRangePrecision.day:
          if (numValue < 1 || numValue > 31)
            throw new TypeError("Day portion is not valid for date: " + stringDate);
          break;
        case dateRangePrecision.hour:
          if (numValue > 23)
            throw new TypeError("Hour portion is not valid for date: " + stringDate);
          break;
        case dateRangePrecision.minute:
        case dateRangePrecision.second:
          if (numValue > 59)
            throw new TypeError("Minute/second portion is not valid for date: " + stringDate);
          break;
        case dateRangePrecision.millisecond:
          if (numValue > 999)
            throw new TypeError("Millisecond portion is not valid for date: " + stringDate);
          break;
      }
      this._values[index] = numValue;
    };
    BoundaryBuilder.prototype.build = function() {
      let date = /* @__PURE__ */ new Date(0), month = this._values[1];
      return month && month--, date.setUTCFullYear(this._sign * this._values[0], month, this._values[2] || 1), date.setUTCHours(this._values[3], this._values[4], this._values[5], this._values[6]), new DateRangeBound(date, this._index);
    };
    exports2.unbounded = unbounded;
    exports2.dateRangePrecision = dateRangePrecision;
    exports2.DateRange = DateRange;
    exports2.DateRangeBound = DateRangeBound;
  }
});

// node_modules/cassandra-driver/lib/datastax/search/index.js
var require_search = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/search/index.js"(exports2) {
    "use strict";
    var dateRangeModule = require_date_range();
    exports2.DateRange = dateRangeModule.DateRange;
    exports2.DateRangeBound = dateRangeModule.DateRangeBound;
    exports2.dateRangePrecision = dateRangeModule.dateRangePrecision;
  }
});

// node_modules/cassandra-driver/lib/geometry/geometry.js
var require_geometry = __commonJS({
  "node_modules/cassandra-driver/lib/geometry/geometry.js"(exports2, module2) {
    "use strict";
    var endianness = {
      0: "BE",
      1: "LE"
    };
    function Geometry() {
    }
    Geometry.types = {
      Point2D: 1,
      LineString: 2,
      Polygon: 3
    };
    Geometry.getEndianness = function(code) {
      let value = endianness[code.toString()];
      if (typeof value > "u")
        throw new TypeError("Invalid endianness with code " + code);
      return value;
    };
    Geometry.readInt32 = function(buffer, endianness2, offset) {
      return endianness2 === "BE" ? buffer.readInt32BE(offset, !0) : buffer.readInt32LE(offset, !0);
    };
    Geometry.readDouble = function(buffer, endianness2, offset) {
      return endianness2 === "BE" ? buffer.readDoubleBE(offset, !0) : buffer.readDoubleLE(offset, !0);
    };
    Geometry.prototype.writeInt32 = function(val, buffer, offset) {
      return this.useBESerialization() ? buffer.writeInt32BE(val, offset, !0) : buffer.writeInt32LE(val, offset, !0);
    };
    Geometry.prototype.writeDouble = function(val, buffer, offset) {
      return this.useBESerialization() ? buffer.writeDoubleBE(val, offset, !0) : buffer.writeDoubleLE(val, offset, !0);
    };
    Geometry.prototype.writeEndianness = function(buffer, offset) {
      return this.useBESerialization() ? buffer.writeInt8(0, offset, !0) : buffer.writeInt8(1, offset, !0);
    };
    Geometry.prototype.useBESerialization = function() {
      throw new Error("Not Implemented");
    };
    module2.exports = Geometry;
  }
});

// node_modules/cassandra-driver/lib/geometry/point.js
var require_point = __commonJS({
  "node_modules/cassandra-driver/lib/geometry/point.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), Geometry = require_geometry();
    function Point(x, y) {
      if (typeof x != "number" || typeof y != "number")
        throw new TypeError("X and Y must be numbers");
      if (isNaN(x) || isNaN(y))
        throw new TypeError("X and Y must be numbers");
      this.x = x, this.y = y;
    }
    util.inherits(Point, Geometry);
    Point.fromBuffer = function(buffer) {
      if (!buffer || buffer.length !== 21)
        throw new TypeError("2D Point buffer should contain 21 bytes");
      let endianness = Geometry.getEndianness(buffer.readInt8(0, !0));
      if (Geometry.readInt32(buffer, endianness, 1) !== Geometry.types.Point2D)
        throw new TypeError("Binary representation was not a point");
      return new Point(Geometry.readDouble(buffer, endianness, 5), Geometry.readDouble(buffer, endianness, 13));
    };
    Point.fromString = function(textValue) {
      let matches = /^POINT\s?\(([-0-9.]+) ([-0-9.]+)\)$/g.exec(textValue);
      if (!matches || matches.length !== 3)
        throw new TypeError("2D Point WTK should contain 2 coordinates");
      return new Point(parseFloat(matches[1]), parseFloat(matches[2]));
    };
    Point.prototype.toBuffer = function() {
      let buffer = utils.allocBufferUnsafe(21);
      return this.writeEndianness(buffer, 0), this.writeInt32(Geometry.types.Point2D, buffer, 1), this.writeDouble(this.x, buffer, 5), this.writeDouble(this.y, buffer, 13), buffer;
    };
    Point.prototype.equals = function(other) {
      return other instanceof Point ? this.x === other.x && this.y === other.y : !1;
    };
    Point.prototype.toString = function() {
      return util.format("POINT (%d %d)", this.x, this.y);
    };
    Point.prototype.useBESerialization = function() {
      return !1;
    };
    Point.prototype.toJSON = function() {
      return { type: "Point", coordinates: [this.x, this.y] };
    };
    module2.exports = Point;
  }
});

// node_modules/cassandra-driver/lib/geometry/line-string.js
var require_line_string = __commonJS({
  "node_modules/cassandra-driver/lib/geometry/line-string.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), Geometry = require_geometry(), Point = require_point();
    function LineString(point) {
      let points = Array.prototype.slice.call(arguments);
      if (points.length === 1 && Array.isArray(points) && Array.isArray(points[0]) && (points = points[0]), points.length === 1)
        throw new TypeError("LineString can be either empty or contain 2 or more points");
      this.points = Object.freeze(points);
    }
    util.inherits(LineString, Geometry);
    LineString.fromBuffer = function(buffer) {
      if (!buffer || buffer.length < 9)
        throw new TypeError("A linestring buffer should contain at least 9 bytes");
      let endianness = Geometry.getEndianness(buffer.readInt8(0, !0)), offset = 1;
      if (Geometry.readInt32(buffer, endianness, offset) !== Geometry.types.LineString)
        throw new TypeError("Binary representation was not a LineString");
      offset += 4;
      let length = Geometry.readInt32(buffer, endianness, offset);
      if (offset += 4, buffer.length !== offset + length * 16)
        throw new TypeError(util.format("Length of the buffer does not match %d !== %d", buffer.length, offset + length * 8));
      let points = new Array(length);
      for (let i = 0; i < length; i++)
        points[i] = new Point(
          Geometry.readDouble(buffer, endianness, offset),
          Geometry.readDouble(buffer, endianness, offset + 8)
        ), offset += 16;
      return new LineString(points);
    };
    LineString.fromString = function(textValue) {
      let matches = /^LINESTRING ?\(([-0-9. ,]+)\)+$/g.exec(textValue);
      if (!matches || matches.length !== 2)
        throw new TypeError("Invalid WKT: " + textValue);
      let points = LineString.parseSegments(matches[1]);
      return new LineString(points);
    };
    LineString.parseSegments = function(textValue) {
      let points = [], pointParts = textValue.split(",");
      for (let i = 0; i < pointParts.length; i++) {
        let p = pointParts[i].trim();
        if (p.length === 0)
          throw new TypeError("Invalid WKT segment: " + textValue);
        let xyText = p.split(" ").filter(function(element) {
          return element.trim().length > 0;
        });
        if (xyText.length !== 2)
          throw new TypeError("Invalid WKT segment: " + textValue);
        points.push(new Point(parseFloat(xyText[0]), parseFloat(xyText[1])));
      }
      return points;
    };
    LineString.prototype.toBuffer = function() {
      let buffer = utils.allocBufferUnsafe(9 + this.points.length * 16);
      this.writeEndianness(buffer, 0);
      let offset = 1;
      return this.writeInt32(Geometry.types.LineString, buffer, offset), offset += 4, this.writeInt32(this.points.length, buffer, offset), offset += 4, this.points.forEach(function(p) {
        this.writeDouble(p.x, buffer, offset), this.writeDouble(p.y, buffer, offset + 8), offset += 16;
      }, this), buffer;
    };
    LineString.prototype.equals = function(other) {
      if (!(other instanceof LineString) || this.points.length !== other.points.length)
        return !1;
      for (let i = 0; i < this.points.length; i++)
        if (!this.points[i].equals(other.points[i]))
          return !1;
      return !0;
    };
    LineString.prototype.toString = function() {
      return this.points.length === 0 ? "LINESTRING EMPTY" : "LINESTRING (" + this.points.map(function(p) {
        return p.x + " " + p.y;
      }).join(", ") + ")";
    };
    LineString.prototype.useBESerialization = function() {
      return !1;
    };
    LineString.prototype.toJSON = function() {
      return { type: "LineString", coordinates: this.points.map(function(p) {
        return [p.x, p.y];
      }) };
    };
    module2.exports = LineString;
  }
});

// node_modules/cassandra-driver/lib/geometry/polygon.js
var require_polygon = __commonJS({
  "node_modules/cassandra-driver/lib/geometry/polygon.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), Geometry = require_geometry(), Point = require_point(), LineString = require_line_string();
    function Polygon(ringPoints) {
      let rings = Array.prototype.slice.call(arguments);
      this.rings = Object.freeze(rings);
    }
    util.inherits(Polygon, Geometry);
    Polygon.fromBuffer = function(buffer) {
      if (!buffer || buffer.length < 9)
        throw new TypeError("A Polygon buffer should contain at least 9 bytes");
      let endianness = Geometry.getEndianness(buffer.readInt8(0, !0)), offset = 1;
      if (Geometry.readInt32(buffer, endianness, offset) !== Geometry.types.Polygon)
        throw new TypeError("Binary representation was not a Polygon");
      offset += 4;
      let ringsLength = Geometry.readInt32(buffer, endianness, offset);
      offset += 4;
      let ringsArray = new Array(ringsLength);
      for (let ringIndex = 0; ringIndex < ringsLength; ringIndex++) {
        let pointsLength = Geometry.readInt32(buffer, endianness, offset);
        if (offset += 4, buffer.length < offset + pointsLength * 16)
          throw new TypeError(util.format("Length of the buffer does not match"));
        let ring = new Array(pointsLength);
        for (let i = 0; i < pointsLength; i++)
          ring[i] = new Point(
            Geometry.readDouble(buffer, endianness, offset),
            Geometry.readDouble(buffer, endianness, offset + 8)
          ), offset += 16;
        ringsArray[ringIndex] = ring;
      }
      return construct(ringsArray);
    };
    Polygon.fromString = function(textValue) {
      let matches = /^POLYGON ?\((\(.*\))\)$/g.exec(textValue);
      function validateWkt(condition) {
        if (condition)
          throw new TypeError("Invalid WKT: " + textValue);
      }
      validateWkt(!matches || matches.length !== 2);
      let ringsText = matches[1], ringsArray = [], ringStart = null;
      for (let i = 0; i < ringsText.length; i++) {
        let c = ringsText[i];
        if (c === "(") {
          validateWkt(ringStart !== null), ringStart = i + 1;
          continue;
        }
        if (c === ")") {
          validateWkt(ringStart === null), ringsArray.push(ringsText.substring(ringStart, i)), ringStart = null;
          continue;
        }
        validateWkt(ringStart === null && c !== " " && c !== ",");
      }
      return construct(ringsArray.map(LineString.parseSegments));
    };
    function construct(argsArray) {
      function F() {
        return Polygon.apply(this, argsArray);
      }
      return F.prototype = Polygon.prototype, new F();
    }
    Polygon.prototype.toBuffer = function() {
      let totalRingsLength = 0;
      this.rings.forEach(function(ring) {
        totalRingsLength += 4 + ring.length * 16;
      }, this);
      let buffer = utils.allocBufferUnsafe(9 + totalRingsLength);
      this.writeEndianness(buffer, 0);
      let offset = 1;
      return this.writeInt32(Geometry.types.Polygon, buffer, offset), offset += 4, this.writeInt32(this.rings.length, buffer, offset), offset += 4, this.rings.forEach(function(ring) {
        this.writeInt32(ring.length, buffer, offset), offset += 4, ring.forEach(function(p) {
          this.writeDouble(p.x, buffer, offset), this.writeDouble(p.y, buffer, offset + 8), offset += 16;
        }, this);
      }, this), buffer;
    };
    Polygon.prototype.equals = function(other) {
      if (!(other instanceof Polygon) || this.rings.length !== other.rings.length)
        return !1;
      for (let i = 0; i < this.rings.length; i++) {
        let r1 = this.rings[i], r2 = other.rings[i];
        if (r1.length !== r2.length)
          return !1;
        for (let j = 0; j < r1.length; j++)
          if (!r1[i].equals(r2[i]))
            return !1;
      }
      return !0;
    };
    Polygon.prototype.useBESerialization = function() {
      return !1;
    };
    Polygon.prototype.toString = function() {
      if (this.rings.length === 0)
        return "POLYGON EMPTY";
      let ringStrings = "";
      return this.rings.forEach(function(r, i) {
        i > 0 && (ringStrings += ", "), ringStrings += "(" + r.map(function(p) {
          return p.x + " " + p.y;
        }).join(", ") + ")";
      }), "POLYGON (" + ringStrings + ")";
    };
    Polygon.prototype.toJSON = function() {
      return { type: "Polygon", coordinates: this.rings.map(function(r) {
        return r.map(function(p) {
          return [p.x, p.y];
        });
      }) };
    };
    module2.exports = Polygon;
  }
});

// node_modules/cassandra-driver/lib/geometry/index.js
var require_geometry2 = __commonJS({
  "node_modules/cassandra-driver/lib/geometry/index.js"(exports2) {
    "use strict";
    exports2.Geometry = require_geometry();
    exports2.LineString = require_line_string();
    exports2.Point = require_point();
    exports2.Polygon = require_polygon();
  }
});

// node_modules/cassandra-driver/lib/encoder.js
var require_encoder = __commonJS({
  "node_modules/cassandra-driver/lib/encoder.js"(exports2, module2) {
    "use strict";
    var util = require("util"), types = require_types(), dataTypes = types.dataTypes, Long = types.Long, Integer = types.Integer, BigDecimal = types.BigDecimal, MutableLong = require_mutable_long(), utils = require_utils(), token = require_token(), { DateRange } = require_search(), geo = require_geometry2(), Vector = require_vector(), Geometry = geo.Geometry, LineString = geo.LineString, Point = geo.Point, Polygon = geo.Polygon, uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, buffers = {
      int16Zero: utils.allocBufferFromArray([0, 0]),
      int32Zero: utils.allocBufferFromArray([0, 0, 0, 0]),
      int8Zero: utils.allocBufferFromArray([0]),
      int8One: utils.allocBufferFromArray([1]),
      int8MaxValue: utils.allocBufferFromArray([255])
    }, isBigIntSupported = typeof BigInt < "u", bigInt32 = isBigIntSupported ? BigInt(32) : null, bigInt8 = isBigIntSupported ? BigInt(8) : null, bigInt0 = isBigIntSupported ? BigInt(0) : null, bigIntMinus1 = isBigIntSupported ? BigInt(-1) : null, bigInt32BitsOn = isBigIntSupported ? BigInt(4294967295) : null, bigInt8BitsOn = isBigIntSupported ? BigInt(255) : null, complexTypeNames = Object.freeze({
      list: "org.apache.cassandra.db.marshal.ListType",
      set: "org.apache.cassandra.db.marshal.SetType",
      map: "org.apache.cassandra.db.marshal.MapType",
      udt: "org.apache.cassandra.db.marshal.UserType",
      tuple: "org.apache.cassandra.db.marshal.TupleType",
      frozen: "org.apache.cassandra.db.marshal.FrozenType",
      reversed: "org.apache.cassandra.db.marshal.ReversedType",
      composite: "org.apache.cassandra.db.marshal.CompositeType",
      empty: "org.apache.cassandra.db.marshal.EmptyType",
      collection: "org.apache.cassandra.db.marshal.ColumnToCollectionType"
    }), cqlNames = Object.freeze({
      frozen: "frozen",
      list: "list",
      set: "set",
      map: "map",
      tuple: "tuple",
      empty: "empty",
      duration: "duration",
      vector: "vector"
    }), singleTypeNames = Object.freeze({
      "org.apache.cassandra.db.marshal.UTF8Type": dataTypes.varchar,
      "org.apache.cassandra.db.marshal.AsciiType": dataTypes.ascii,
      "org.apache.cassandra.db.marshal.UUIDType": dataTypes.uuid,
      "org.apache.cassandra.db.marshal.TimeUUIDType": dataTypes.timeuuid,
      "org.apache.cassandra.db.marshal.Int32Type": dataTypes.int,
      "org.apache.cassandra.db.marshal.BytesType": dataTypes.blob,
      "org.apache.cassandra.db.marshal.FloatType": dataTypes.float,
      "org.apache.cassandra.db.marshal.DoubleType": dataTypes.double,
      "org.apache.cassandra.db.marshal.BooleanType": dataTypes.boolean,
      "org.apache.cassandra.db.marshal.InetAddressType": dataTypes.inet,
      "org.apache.cassandra.db.marshal.SimpleDateType": dataTypes.date,
      "org.apache.cassandra.db.marshal.TimeType": dataTypes.time,
      "org.apache.cassandra.db.marshal.ShortType": dataTypes.smallint,
      "org.apache.cassandra.db.marshal.ByteType": dataTypes.tinyint,
      "org.apache.cassandra.db.marshal.DateType": dataTypes.timestamp,
      "org.apache.cassandra.db.marshal.TimestampType": dataTypes.timestamp,
      "org.apache.cassandra.db.marshal.LongType": dataTypes.bigint,
      "org.apache.cassandra.db.marshal.DecimalType": dataTypes.decimal,
      "org.apache.cassandra.db.marshal.IntegerType": dataTypes.varint,
      "org.apache.cassandra.db.marshal.CounterColumnType": dataTypes.counter
    }), singleTypeNamesByDataType = invertObject(singleTypeNames), singleFqTypeNamesLength = Object.keys(singleTypeNames).reduce(function(previous, current) {
      return current.length > previous ? current.length : previous;
    }, 0), customTypeNames = Object.freeze({
      duration: "org.apache.cassandra.db.marshal.DurationType",
      lineString: "org.apache.cassandra.db.marshal.LineStringType",
      point: "org.apache.cassandra.db.marshal.PointType",
      polygon: "org.apache.cassandra.db.marshal.PolygonType",
      dateRange: "org.apache.cassandra.db.marshal.DateRangeType",
      vector: "org.apache.cassandra.db.marshal.VectorType"
    }), nullValueBuffer = utils.allocBufferFromArray([255, 255, 255, 255]), unsetValueBuffer = utils.allocBufferFromArray([255, 255, 255, 254]), zeroLengthTypesSupported = /* @__PURE__ */ new Set([
      dataTypes.text,
      dataTypes.ascii,
      dataTypes.varchar,
      dataTypes.custom,
      dataTypes.blob
    ]);
    function Encoder(protocolVersion, options) {
      this.encodingOptions = options.encoding || utils.emptyObject, defineInstanceMembers.call(this), this.setProtocolVersion(protocolVersion), setEncoders.call(this), this.encodingOptions.copyBuffer ? this.handleBuffer = handleBufferCopy : this.handleBuffer = handleBufferRef;
    }
    function defineInstanceMembers() {
      this.setProtocolVersion = function(value) {
        this.protocolVersion = value, this.decodeCollectionLength = decodeCollectionLengthV3, this.getLengthBuffer = getLengthBufferV3, this.collectionLengthSize = 4, types.protocolVersion.uses4BytesCollectionLength(this.protocolVersion) || (this.decodeCollectionLength = decodeCollectionLengthV2, this.getLengthBuffer = getLengthBufferV2, this.collectionLengthSize = 2);
      };
      let customDecoders = {
        [customTypeNames.duration]: decodeDuration,
        [customTypeNames.lineString]: decodeLineString,
        [customTypeNames.point]: decodePoint,
        [customTypeNames.polygon]: decodePolygon,
        [customTypeNames.dateRange]: decodeDateRange
      }, customEncoders = {
        [customTypeNames.duration]: encodeDuration,
        [customTypeNames.lineString]: encodeLineString,
        [customTypeNames.point]: encodePoint,
        [customTypeNames.polygon]: encodePolygon,
        [customTypeNames.dateRange]: encodeDateRange
      };
      this.decodeBlob = function(bytes) {
        return this.handleBuffer(bytes);
      }, this.decodeCustom = function(bytes, columnInfo) {
        if (!columnInfo)
          return this.handleBuffer(bytes);
        if ("customTypeName" in columnInfo && columnInfo.customTypeName === "vector")
          return this.decodeVector(bytes, columnInfo);
        if (typeof columnInfo.info == "string" && columnInfo.info.startsWith(customTypeNames.vector)) {
          let vectorColumnInfo = (
            /** @type {VectorColumnInfo} */
            this.parseFqTypeName(columnInfo.info)
          );
          return this.decodeVector(bytes, vectorColumnInfo);
        }
        let handler = customDecoders[columnInfo.info];
        return handler ? handler.call(this, bytes) : this.handleBuffer(bytes);
      }, this.decodeUtf8String = function(bytes) {
        return bytes.toString("utf8");
      }, this.decodeAsciiString = function(bytes) {
        return bytes.toString("ascii");
      }, this.decodeBoolean = function(bytes) {
        return !!bytes.readUInt8(0);
      }, this.decodeDouble = function(bytes) {
        return bytes.readDoubleBE(0);
      }, this.decodeFloat = function(bytes) {
        return bytes.readFloatBE(0);
      }, this.decodeInt = function(bytes) {
        return bytes.readInt32BE(0);
      }, this.decodeSmallint = function(bytes) {
        return bytes.readInt16BE(0);
      }, this.decodeTinyint = function(bytes) {
        return bytes.readInt8(0);
      }, this._decodeCqlLongAsLong = function(bytes) {
        return Long.fromBuffer(bytes);
      }, this._decodeCqlLongAsBigInt = function(bytes) {
        return BigInt.asIntN(64, BigInt(bytes.readUInt32BE(0)) << bigInt32 | BigInt(bytes.readUInt32BE(4)));
      }, this.decodeLong = this.encodingOptions.useBigIntAsLong ? this._decodeCqlLongAsBigInt : this._decodeCqlLongAsLong, this._decodeVarintAsInteger = function(bytes) {
        return Integer.fromBuffer(bytes);
      }, this._decodeVarintAsBigInt = function(bytes) {
        let result = bigInt0;
        if (bytes[0] <= 127)
          for (let i = 0; i < bytes.length; i++) {
            let b = BigInt(bytes[bytes.length - 1 - i]);
            result = result | b << BigInt(i * 8);
          }
        else {
          for (let i = 0; i < bytes.length; i++) {
            let b = BigInt(bytes[bytes.length - 1 - i]);
            result = result | (~b & bigInt8BitsOn) << BigInt(i * 8);
          }
          result = ~result;
        }
        return result;
      }, this.decodeVarint = this.encodingOptions.useBigIntAsVarint ? this._decodeVarintAsBigInt : this._decodeVarintAsInteger, this.decodeDecimal = function(bytes) {
        return BigDecimal.fromBuffer(bytes);
      }, this.decodeTimestamp = function(bytes) {
        return new Date(this._decodeCqlLongAsLong(bytes).toNumber());
      }, this.decodeDate = function(bytes) {
        return types.LocalDate.fromBuffer(bytes);
      }, this.decodeTime = function(bytes) {
        return types.LocalTime.fromBuffer(bytes);
      }, this.decodeList = function(bytes, columnInfo) {
        let subtype = columnInfo.info, totalItems = this.decodeCollectionLength(bytes, 0), offset = this.collectionLengthSize, list = new Array(totalItems);
        for (let i = 0; i < totalItems; i++) {
          let length = this.decodeCollectionLength(bytes, offset);
          offset += this.collectionLengthSize, list[i] = this.decode(bytes.slice(offset, offset + length), subtype), offset += length;
        }
        return list;
      }, this.decodeSet = function(bytes, columnInfo) {
        let arr = this.decodeList(bytes, columnInfo);
        if (this.encodingOptions.set) {
          let setConstructor = this.encodingOptions.set;
          return new setConstructor(arr);
        }
        return arr;
      }, this.decodeMap = function(bytes, columnInfo) {
        let subtypes = columnInfo.info, map, totalItems = this.decodeCollectionLength(bytes, 0), offset = this.collectionLengthSize, self = this;
        function readValues(callback, thisArg) {
          for (let i = 0; i < totalItems; i++) {
            let keyLength = self.decodeCollectionLength(bytes, offset);
            offset += self.collectionLengthSize;
            let key = self.decode(bytes.slice(offset, offset + keyLength), subtypes[0]);
            offset += keyLength;
            let valueLength = self.decodeCollectionLength(bytes, offset);
            if (offset += self.collectionLengthSize, valueLength < 0) {
              callback.call(thisArg, key, null);
              continue;
            }
            let value = self.decode(bytes.slice(offset, offset + valueLength), subtypes[1]);
            offset += valueLength, callback.call(thisArg, key, value);
          }
        }
        if (this.encodingOptions.map) {
          let mapConstructor = this.encodingOptions.map;
          map = new mapConstructor(), readValues(map.set, map);
        } else
          map = {}, readValues(function(key, value) {
            map[key] = value;
          });
        return map;
      }, this.decodeUuid = function(bytes) {
        return new types.Uuid(this.handleBuffer(bytes));
      }, this.decodeTimeUuid = function(bytes) {
        return new types.TimeUuid(this.handleBuffer(bytes));
      }, this.decodeInet = function(bytes) {
        return new types.InetAddress(this.handleBuffer(bytes));
      }, this.decodeUdt = function(bytes, columnInfo) {
        let udtInfo = columnInfo.info, result = {}, offset = 0;
        for (let i = 0; i < udtInfo.fields.length && offset < bytes.length; i++) {
          let length = bytes.readInt32BE(offset);
          offset += 4;
          let field = udtInfo.fields[i];
          if (length < 0) {
            result[field.name] = null;
            continue;
          }
          result[field.name] = this.decode(bytes.slice(offset, offset + length), field.type), offset += length;
        }
        return result;
      }, this.decodeTuple = function(bytes, columnInfo) {
        let tupleInfo = columnInfo.info, elements = new Array(tupleInfo.length), offset = 0;
        for (let i = 0; i < tupleInfo.length && offset < bytes.length; i++) {
          let length = bytes.readInt32BE(offset);
          if (offset += 4, length < 0) {
            elements[i] = null;
            continue;
          }
          elements[i] = this.decode(bytes.slice(offset, offset + length), tupleInfo[i]), offset += length;
        }
        return types.Tuple.fromArray(elements);
      }, this.encodeFloat = function(value) {
        if (typeof value == "string" && (value = parseFloat(value), Number.isNaN(value)))
          throw new TypeError(`Expected string representation of a number, obtained ${util.inspect(value)}`);
        if (typeof value != "number")
          throw new TypeError("Expected Number, obtained " + util.inspect(value));
        let buf = utils.allocBufferUnsafe(4);
        return buf.writeFloatBE(value, 0), buf;
      }, this.encodeDouble = function(value) {
        if (typeof value == "string" && (value = parseFloat(value), Number.isNaN(value)))
          throw new TypeError(`Expected string representation of a number, obtained ${util.inspect(value)}`);
        if (typeof value != "number")
          throw new TypeError("Expected Number, obtained " + util.inspect(value));
        let buf = utils.allocBufferUnsafe(8);
        return buf.writeDoubleBE(value, 0), buf;
      }, this.encodeTimestamp = function(value) {
        let originalValue = value;
        if (typeof value == "string" && (value = new Date(value)), value instanceof Date && (value = value.getTime(), isNaN(value)))
          throw new TypeError("Invalid date: " + originalValue);
        return this.encodingOptions.useBigIntAsLong && (value = BigInt(value)), this.encodeLong(value);
      }, this.encodeDate = function(value) {
        let originalValue = value;
        try {
          typeof value == "string" && (value = types.LocalDate.fromString(value)), value instanceof Date && (value = types.LocalDate.fromDate(value));
        } catch (err) {
          throw new TypeError("LocalDate could not be parsed " + err);
        }
        if (!(value instanceof types.LocalDate))
          throw new TypeError("Expected Date/String/LocalDate, obtained " + util.inspect(originalValue));
        return value.toBuffer();
      }, this.encodeTime = function(value) {
        let originalValue = value;
        try {
          typeof value == "string" && (value = types.LocalTime.fromString(value));
        } catch (err) {
          throw new TypeError("LocalTime could not be parsed " + err);
        }
        if (!(value instanceof types.LocalTime))
          throw new TypeError("Expected String/LocalTime, obtained " + util.inspect(originalValue));
        return value.toBuffer();
      }, this.encodeUuid = function(value) {
        if (typeof value == "string")
          try {
            value = types.Uuid.fromString(value).getBuffer();
          } catch (err) {
            throw new TypeError(err.message);
          }
        else if (value instanceof types.Uuid)
          value = value.getBuffer();
        else
          throw new TypeError("Not a valid Uuid, expected Uuid/String/Buffer, obtained " + util.inspect(value));
        return value;
      }, this.encodeInet = function(value) {
        if (typeof value == "string" && (value = types.InetAddress.fromString(value)), value instanceof types.InetAddress && (value = value.getBuffer()), !(value instanceof Buffer))
          throw new TypeError("Not a valid Inet, expected InetAddress/Buffer, obtained " + util.inspect(value));
        return value;
      }, this._encodeBigIntFromLong = function(value) {
        typeof value == "number" ? value = Long.fromNumber(value) : typeof value == "string" && (value = Long.fromString(value));
        let buf = null;
        if (value instanceof Long ? buf = Long.toBuffer(value) : value instanceof MutableLong && (buf = Long.toBuffer(value.toImmutable())), buf === null)
          throw new TypeError("Not a valid bigint, expected Long/Number/String/Buffer, obtained " + util.inspect(value));
        return buf;
      }, this._encodeBigIntFromBigInt = function(value) {
        if (typeof value == "string" && (value = BigInt(value)), typeof value != "bigint")
          throw new TypeError("Not a valid BigInt value, obtained " + util.inspect(value));
        let buffer = utils.allocBufferUnsafe(8);
        return buffer.writeUInt32BE(Number(value >> bigInt32) >>> 0, 0), buffer.writeUInt32BE(Number(value & bigInt32BitsOn), 4), buffer;
      }, this.encodeLong = this.encodingOptions.useBigIntAsLong ? this._encodeBigIntFromBigInt : this._encodeBigIntFromLong, this._encodeVarintFromInteger = function(value) {
        typeof value == "number" && (value = Integer.fromNumber(value)), typeof value == "string" && (value = Integer.fromString(value));
        let buf = null;
        if (value instanceof Buffer && (buf = value), value instanceof Integer && (buf = Integer.toBuffer(value)), buf === null)
          throw new TypeError("Not a valid varint, expected Integer/Number/String/Buffer, obtained " + util.inspect(value));
        return buf;
      }, this._encodeVarintFromBigInt = function(value) {
        if (typeof value == "string" && (value = BigInt(value)), typeof value != "bigint")
          throw new TypeError("Not a valid varint, expected BigInt, obtained " + util.inspect(value));
        if (value === bigInt0)
          return buffers.int8Zero;
        if (value === bigIntMinus1)
          return buffers.int8MaxValue;
        let parts = [];
        if (value > bigInt0) {
          for (; value !== bigInt0; )
            parts.unshift(Number(value & bigInt8BitsOn)), value = value >> bigInt8;
          parts[0] > 127 && parts.unshift(0);
        } else {
          for (; value !== bigIntMinus1; )
            parts.unshift(Number(value & bigInt8BitsOn)), value = value >> bigInt8;
          parts[0] <= 127 && parts.unshift(255);
        }
        return utils.allocBufferFromArray(parts);
      }, this.encodeVarint = this.encodingOptions.useBigIntAsVarint ? this._encodeVarintFromBigInt : this._encodeVarintFromInteger, this.encodeDecimal = function(value) {
        typeof value == "number" ? value = BigDecimal.fromNumber(value) : typeof value == "string" && (value = BigDecimal.fromString(value));
        let buf = null;
        if (value instanceof BigDecimal)
          buf = BigDecimal.toBuffer(value);
        else
          throw new TypeError("Not a valid varint, expected BigDecimal/Number/String/Buffer, obtained " + util.inspect(value));
        return buf;
      }, this.encodeString = function(value, encoding) {
        if (typeof value != "string")
          throw new TypeError("Not a valid text value, expected String obtained " + util.inspect(value));
        return utils.allocBufferFromString(value, encoding);
      }, this.encodeUtf8String = function(value) {
        return this.encodeString(value, "utf8");
      }, this.encodeAsciiString = function(value) {
        return this.encodeString(value, "ascii");
      }, this.encodeBlob = function(value) {
        if (!(value instanceof Buffer))
          throw new TypeError("Not a valid blob, expected Buffer obtained " + util.inspect(value));
        return value;
      }, this.encodeCustom = function(value, columnInfo) {
        if ("customTypeName" in columnInfo && columnInfo.customTypeName === "vector")
          return this.encodeVector(value, columnInfo);
        if (typeof columnInfo.info == "string" && columnInfo.info.startsWith(customTypeNames.vector)) {
          let vectorColumnInfo = (
            /** @type {VectorColumnInfo} */
            this.parseFqTypeName(columnInfo.info)
          );
          return this.encodeVector(value, vectorColumnInfo);
        }
        let handler = customEncoders[columnInfo.info];
        if (handler)
          return handler.call(this, value);
        throw new TypeError("No encoding handler found for type " + columnInfo);
      }, this.encodeBoolean = function(value) {
        return value ? buffers.int8One : buffers.int8Zero;
      }, this.encodeInt = function(value) {
        if (isNaN(value))
          throw new TypeError("Expected Number, obtained " + util.inspect(value));
        let buf = utils.allocBufferUnsafe(4);
        return buf.writeInt32BE(value, 0), buf;
      }, this.encodeSmallint = function(value) {
        if (isNaN(value))
          throw new TypeError("Expected Number, obtained " + util.inspect(value));
        let buf = utils.allocBufferUnsafe(2);
        return buf.writeInt16BE(value, 0), buf;
      }, this.encodeTinyint = function(value) {
        if (isNaN(value))
          throw new TypeError("Expected Number, obtained " + util.inspect(value));
        let buf = utils.allocBufferUnsafe(1);
        return buf.writeInt8(value, 0), buf;
      }, this.encodeList = function(value, columnInfo) {
        let subtype = columnInfo.info;
        if (!Array.isArray(value))
          throw new TypeError("Not a valid list value, expected Array obtained " + util.inspect(value));
        if (value.length === 0)
          return null;
        let parts = [];
        parts.push(this.getLengthBuffer(value));
        for (let i = 0; i < value.length; i++) {
          let val = value[i];
          if (val === null || typeof val > "u" || val === types.unset)
            throw new TypeError("A collection can't contain null or unset values");
          let bytes = this.encode(val, subtype);
          parts.push(this.getLengthBuffer(bytes)), parts.push(bytes);
        }
        return Buffer.concat(parts);
      }, this.encodeSet = function(value, columnInfo) {
        if (this.encodingOptions.set && value instanceof this.encodingOptions.set) {
          let arr = [];
          return value.forEach(function(x) {
            arr.push(x);
          }), this.encodeList(arr, columnInfo);
        }
        return this.encodeList(value, columnInfo);
      }, this.encodeMap = function(value, columnInfo) {
        let subtypes = columnInfo.info, parts = [], propCounter = 0, keySubtype = null, valueSubtype = null, self = this;
        subtypes && (keySubtype = subtypes[0], valueSubtype = subtypes[1]);
        function addItem(val, key) {
          if (key === null || typeof key > "u" || key === types.unset)
            throw new TypeError("A map can't contain null or unset keys");
          if (val === null || typeof val > "u" || val === types.unset)
            throw new TypeError("A map can't contain null or unset values");
          let keyBuffer = self.encode(key, keySubtype);
          parts.push(self.getLengthBuffer(keyBuffer)), parts.push(keyBuffer);
          let valueBuffer = self.encode(val, valueSubtype);
          parts.push(self.getLengthBuffer(valueBuffer)), valueBuffer !== null && parts.push(valueBuffer), propCounter++;
        }
        if (this.encodingOptions.map && value instanceof this.encodingOptions.map)
          value.forEach(addItem);
        else
          for (let key in value) {
            if (!value.hasOwnProperty(key))
              continue;
            let val = value[key];
            addItem(val, key);
          }
        return parts.unshift(this.getLengthBuffer(propCounter)), Buffer.concat(parts);
      }, this.encodeUdt = function(value, columnInfo) {
        let udtInfo = columnInfo.info, parts = [], totalLength = 0;
        for (let i = 0; i < udtInfo.fields.length; i++) {
          let field = udtInfo.fields[i], item = this.encode(value[field.name], field.type);
          if (!item) {
            parts.push(nullValueBuffer), totalLength += 4;
            continue;
          }
          if (item === types.unset) {
            parts.push(unsetValueBuffer), totalLength += 4;
            continue;
          }
          let lengthBuffer = utils.allocBufferUnsafe(4);
          lengthBuffer.writeInt32BE(item.length, 0), parts.push(lengthBuffer), parts.push(item), totalLength += item.length + 4;
        }
        return Buffer.concat(parts, totalLength);
      }, this.encodeTuple = function(value, columnInfo) {
        let tupleInfo = columnInfo.info, parts = [], totalLength = 0, length = Math.min(tupleInfo.length, value.length);
        for (let i = 0; i < length; i++) {
          let type = tupleInfo[i], item = this.encode(value.get(i), type);
          if (!item) {
            parts.push(nullValueBuffer), totalLength += 4;
            continue;
          }
          if (item === types.unset) {
            parts.push(unsetValueBuffer), totalLength += 4;
            continue;
          }
          let lengthBuffer = utils.allocBufferUnsafe(4);
          lengthBuffer.writeInt32BE(item.length, 0), parts.push(lengthBuffer), parts.push(item), totalLength += item.length + 4;
        }
        return Buffer.concat(parts, totalLength);
      }, this.decodeVector = function(buffer, params) {
        let subtype = params.info[0], dimension = params.info[1], elemLength = this.serializationSizeIfFixed(subtype), rv = [], offset = 0;
        for (let i = 0; i < dimension; i++)
          if (elemLength === -1) {
            let [size, bytesRead] = utils.VIntCoding.uvintUnpack(buffer.subarray(offset));
            if (offset += bytesRead, offset + size > buffer.length)
              throw new TypeError("Not enough bytes to decode the vector");
            rv[i] = this.decode(buffer.subarray(offset, offset + size), subtype), offset += size;
          } else {
            if (offset + elemLength > buffer.length)
              throw new TypeError("Not enough bytes to decode the vector");
            rv[i] = this.decode(buffer.subarray(offset, offset + elemLength), subtype), offset += elemLength;
          }
        if (offset !== buffer.length)
          throw new TypeError("Extra bytes found after decoding the vector");
        let typeInfo = types.getDataTypeNameByCode(subtype);
        return new Vector(rv, typeInfo);
      }, this.serializationSizeIfFixed = function(cqlType) {
        switch (cqlType.code) {
          case dataTypes.bigint:
            return 8;
          case dataTypes.boolean:
            return 1;
          case dataTypes.timestamp:
            return 8;
          case dataTypes.double:
            return 8;
          case dataTypes.float:
            return 4;
          case dataTypes.int:
            return 4;
          case dataTypes.timeuuid:
            return 16;
          case dataTypes.uuid:
            return 16;
          case dataTypes.custom:
            if ("customTypeName" in cqlType && cqlType.customTypeName === "vector") {
              let subtypeSerialSize = this.serializationSizeIfFixed(cqlType.info[0]);
              return subtypeSerialSize === -1 ? -1 : subtypeSerialSize * cqlType.info[1];
            }
            return -1;
          default:
            return -1;
        }
      }, this.encodeVector = function(value, params) {
        if (!(value instanceof Vector))
          throw new TypeError("Driver only supports Vector type when encoding a vector");
        let dimension = params.info[1];
        if (value.length !== dimension)
          throw new TypeError(`Expected vector with ${dimension} dimensions, observed size of ${value.length}`);
        if (value.length === 0)
          throw new TypeError("Cannot encode empty array as vector");
        let serializationSize = this.serializationSizeIfFixed(params.info[0]), encoded = [];
        for (let elem of value) {
          let elemBuffer = this.encode(elem, params.info[0]);
          serializationSize === -1 && encoded.push(utils.VIntCoding.uvintPack(elemBuffer.length)), encoded.push(elemBuffer);
        }
        return Buffer.concat(encoded);
      }, this.parseVectorTypeArgs = function(typeName, stringToExclude, subtypeResolveFn) {
        let argsStartIndex = stringToExclude.length + 1, argsLength = typeName.length - (stringToExclude.length + 2), params = parseParams(typeName, argsStartIndex, argsLength);
        if (params.length === 2)
          return { code: dataTypes.custom, info: [subtypeResolveFn.bind(this)(params[0].trim()), parseInt(params[1].trim(), 10)], customTypeName: "vector" };
        throw new TypeError("Not a valid type " + typeName);
      }, this.setRoutingKeyFromUser = function(params, execOptions, keys) {
        let totalLength = 0, userRoutingKey = execOptions.getRoutingKey();
        if (Array.isArray(userRoutingKey)) {
          if (userRoutingKey.length === 1) {
            execOptions.setRoutingKey(userRoutingKey[0]);
            return;
          }
          totalLength = 0;
          for (let i = 0; i < userRoutingKey.length; i++) {
            let item = userRoutingKey[i];
            if (!item) {
              execOptions.setRoutingKey(null);
              return;
            }
            totalLength += item.length + 3;
          }
          execOptions.setRoutingKey(concatRoutingKey(userRoutingKey, totalLength));
          return;
        }
        if (userRoutingKey) {
          if (userRoutingKey instanceof Buffer || userRoutingKey instanceof token.Token || userRoutingKey instanceof token.TokenRange)
            return;
          throw new TypeError(`Unexpected routingKey '${util.inspect(userRoutingKey)}' provided. Expected Buffer, Array<Buffer>, Token, or TokenRange.`);
        }
        if (!params || params.length === 0)
          return;
        let routingIndexes = execOptions.getRoutingIndexes();
        if (execOptions.getRoutingNames() && (routingIndexes = execOptions.getRoutingNames().map((k) => keys[k])), !routingIndexes)
          return;
        let parts = [], hints = execOptions.getHints() || utils.emptyArray, encodeParam = keys ? (i) => this.encode(params[i].value, hints[i]) : (i) => this.encode(params[i], hints[i]);
        try {
          totalLength = this._encodeRoutingKeyParts(parts, routingIndexes, encodeParam);
        } catch {
        }
        totalLength !== 0 && execOptions.setRoutingKey(concatRoutingKey(parts, totalLength));
      }, this.setRoutingKeyFromMeta = function(meta, params, execOptions) {
        let routingIndexes = execOptions.getRoutingIndexes();
        if (!routingIndexes)
          return;
        let parts = new Array(routingIndexes.length), encodeParam = (i) => {
          let columnInfo = meta.columns[i];
          return this.encode(params[i], columnInfo ? columnInfo.type : null);
        }, totalLength = 0;
        try {
          totalLength = this._encodeRoutingKeyParts(parts, routingIndexes, encodeParam);
        } catch {
        }
        totalLength !== 0 && execOptions.setRoutingKey(concatRoutingKey(parts, totalLength));
      }, this._encodeRoutingKeyParts = function(parts, routingIndexes, encodeParam) {
        let totalLength = 0;
        for (let i = 0; i < routingIndexes.length; i++) {
          let paramIndex = routingIndexes[i];
          if (paramIndex === void 0)
            return 0;
          let item = encodeParam(paramIndex);
          if (item == null || item === types.unset)
            return 0;
          totalLength += item.length + 3, parts[i] = item;
        }
        return totalLength;
      }, this.parseTypeName = async function(keyspace, typeName, startIndex, length, udtResolver) {
        startIndex = startIndex || 0, length || (length = typeName.length);
        let innerTypes, frozen = !1;
        if (typeName.indexOf("'", startIndex) === startIndex) {
          let info = typeName.substr(startIndex + 1, length - 2);
          return {
            code: dataTypes.custom,
            info
          };
        }
        if (length || (length = typeName.length), typeName.indexOf(cqlNames.frozen, startIndex) === startIndex && (startIndex += cqlNames.frozen.length + 1, length -= cqlNames.frozen.length + 2, frozen = !0), typeName.indexOf(cqlNames.list, startIndex) === startIndex) {
          if (startIndex += cqlNames.list.length + 1, length -= cqlNames.list.length + 2, innerTypes = parseParams(typeName, startIndex, length, "<", ">"), innerTypes.length !== 1)
            throw new TypeError("Not a valid type " + typeName);
          let info = await this.parseTypeName(keyspace, innerTypes[0], 0, null, udtResolver);
          return {
            code: dataTypes.list,
            info,
            options: {
              frozen
            }
          };
        }
        if (typeName.indexOf(cqlNames.set, startIndex) === startIndex) {
          if (startIndex += cqlNames.set.length + 1, length -= cqlNames.set.length + 2, innerTypes = parseParams(typeName, startIndex, length, "<", ">"), innerTypes.length !== 1)
            throw new TypeError("Not a valid type " + typeName);
          let info = await this.parseTypeName(keyspace, innerTypes[0], 0, null, udtResolver);
          return {
            code: dataTypes.set,
            info,
            options: {
              frozen
            }
          };
        }
        if (typeName.indexOf(cqlNames.map, startIndex) === startIndex) {
          if (startIndex += cqlNames.map.length + 1, length -= cqlNames.map.length + 2, innerTypes = parseParams(typeName, startIndex, length, "<", ">"), innerTypes.length !== 2)
            throw new TypeError("Not a valid type " + typeName);
          let info = await this._parseChildTypes(keyspace, innerTypes, udtResolver);
          return {
            code: dataTypes.map,
            info,
            options: {
              frozen
            }
          };
        }
        if (typeName.indexOf(cqlNames.tuple, startIndex) === startIndex) {
          if (startIndex += cqlNames.tuple.length + 1, length -= cqlNames.tuple.length + 2, innerTypes = parseParams(typeName, startIndex, length, "<", ">"), innerTypes.length < 1)
            throw new TypeError("Not a valid type " + typeName);
          let info = await this._parseChildTypes(keyspace, innerTypes, udtResolver);
          return {
            code: dataTypes.tuple,
            info,
            options: { frozen }
          };
        }
        if (typeName.indexOf(cqlNames.vector, startIndex) === startIndex) {
          let params = this.parseVectorTypeArgs.bind(this)(typeName, cqlNames.vector, (arg) => arg);
          return params.info[0] = await this.parseTypeName(keyspace, params.info[0]), params;
        }
        let quoted = typeName.indexOf('"', startIndex) === startIndex;
        quoted && (startIndex++, length -= 2), startIndex > 0 && (typeName = typeName.substr(startIndex, length)), quoted && (typeName = typeName.replace('""', '"'));
        let typeCode = dataTypes[typeName];
        if (typeof typeCode == "number")
          return { code: typeCode, info: null };
        if (typeName === cqlNames.duration)
          return { code: dataTypes.custom, info: customTypeNames.duration };
        if (typeName === cqlNames.empty)
          return { code: dataTypes.custom, info: "empty" };
        let udtInfo = await udtResolver(keyspace, typeName);
        if (udtInfo)
          return {
            code: dataTypes.udt,
            info: udtInfo,
            options: {
              frozen
            }
          };
        throw new TypeError('Not a valid type "' + typeName + '"');
      }, this._parseChildTypes = function(keyspace, typeNames, udtResolver) {
        return Promise.all(typeNames.map((name) => this.parseTypeName(keyspace, name.trim(), 0, null, udtResolver)));
      }, this.parseFqTypeName = function(typeName, startIndex, length) {
        let frozen = !1, reversed = !1;
        startIndex = startIndex || 0;
        let params;
        length || (length = typeName.length), length > complexTypeNames.reversed.length && typeName.indexOf(complexTypeNames.reversed) === startIndex && (startIndex += complexTypeNames.reversed.length + 1, length -= complexTypeNames.reversed.length + 2, reversed = !0), length > complexTypeNames.frozen.length && typeName.indexOf(complexTypeNames.frozen, startIndex) === startIndex && (startIndex += complexTypeNames.frozen.length + 1, length -= complexTypeNames.frozen.length + 2, frozen = !0);
        let options = {
          frozen,
          reversed
        };
        if (typeName === complexTypeNames.empty)
          return {
            code: dataTypes.custom,
            info: "empty",
            options
          };
        if (length <= singleFqTypeNamesLength) {
          startIndex > 0 && (typeName = typeName.substr(startIndex, length));
          let typeCode = singleTypeNames[typeName];
          if (typeof typeCode == "number")
            return { code: typeCode, info: null, options };
          if (typeName === customTypeNames.duration)
            return { code: dataTypes.duration, options };
          throw new TypeError('Not a valid type "' + typeName + '"');
        }
        if (typeName.indexOf(complexTypeNames.list, startIndex) === startIndex) {
          if (startIndex += complexTypeNames.list.length + 1, length -= complexTypeNames.list.length + 2, params = parseParams(typeName, startIndex, length), params.length !== 1)
            throw new TypeError("Not a valid type " + typeName);
          let info2 = this.parseFqTypeName(params[0]);
          return {
            code: dataTypes.list,
            info: info2,
            options
          };
        }
        if (typeName.indexOf(complexTypeNames.set, startIndex) === startIndex) {
          if (startIndex += complexTypeNames.set.length + 1, length -= complexTypeNames.set.length + 2, params = parseParams(typeName, startIndex, length), params.length !== 1)
            throw new TypeError("Not a valid type " + typeName);
          let info2 = this.parseFqTypeName(params[0]);
          return {
            code: dataTypes.set,
            info: info2,
            options
          };
        }
        if (typeName.indexOf(complexTypeNames.map, startIndex) === startIndex) {
          if (startIndex += complexTypeNames.map.length + 1, length -= complexTypeNames.map.length + 2, params = parseParams(typeName, startIndex, length), params.length !== 2)
            throw new TypeError("Not a valid type " + typeName);
          let info1 = this.parseFqTypeName(params[0]), info2 = this.parseFqTypeName(params[1]);
          return {
            code: dataTypes.map,
            info: [info1, info2],
            options
          };
        }
        if (typeName.indexOf(complexTypeNames.udt, startIndex) === startIndex) {
          startIndex += complexTypeNames.udt.length + 1, length -= complexTypeNames.udt.length + 2;
          let udtType = this._parseUdtName(typeName, startIndex, length);
          return udtType.options = options, udtType;
        }
        if (typeName.indexOf(complexTypeNames.tuple, startIndex) === startIndex) {
          if (startIndex += complexTypeNames.tuple.length + 1, length -= complexTypeNames.tuple.length + 2, params = parseParams(typeName, startIndex, length), params.length < 1)
            throw new TypeError("Not a valid type " + typeName);
          let info2 = params.map((x) => this.parseFqTypeName(x));
          return {
            code: dataTypes.tuple,
            info: info2,
            options
          };
        }
        if (typeName.indexOf(customTypeNames.vector, startIndex) === startIndex) {
          let params2 = this.parseVectorTypeArgs.bind(this)(typeName, customTypeNames.vector, this.parseFqTypeName);
          return params2.options = options, params2;
        }
        let info = typeName.substr(startIndex, length);
        return {
          code: dataTypes.custom,
          info,
          options
        };
      }, this.parseKeyTypes = function(typesString) {
        let i = 0, length = typesString.length, isComposite = typesString.indexOf(complexTypeNames.composite) === 0;
        isComposite && (i = complexTypeNames.composite.length + 1, length--);
        let types2 = [], startIndex = i, nested = 0, inCollectionType = !1, hasCollections = !1;
        for (; ++i < length; )
          switch (typesString[i]) {
            case ",":
              if (nested > 0)
                break;
              inCollectionType && (startIndex = typesString.indexOf(":", startIndex) + 1), types2.push(typesString.substring(startIndex, i)), startIndex = i + 1;
              break;
            case "(":
              if (nested === 0 && typesString.indexOf(complexTypeNames.collection, startIndex) === startIndex) {
                inCollectionType = !0, hasCollections = !0, i++, startIndex = i;
                break;
              }
              nested++;
              break;
            case ")":
              if (inCollectionType && nested === 0) {
                types2.push(typesString.substring(typesString.indexOf(":", startIndex) + 1, i)), startIndex = i + 1;
                break;
              }
              nested--;
              break;
          }
        return startIndex < length && types2.push(typesString.substring(startIndex, length)), {
          types: types2.map((name) => this.parseFqTypeName(name)),
          hasCollections,
          isComposite
        };
      }, this._parseUdtName = function(typeName, startIndex, length) {
        let udtParams = parseParams(typeName, startIndex, length);
        if (udtParams.length < 2)
          throw new TypeError("Not a valid type " + typeName);
        let udtInfo = {
          keyspace: udtParams[0],
          name: utils.allocBufferFromString(udtParams[1], "hex").toString(),
          fields: []
        };
        for (let i = 2; i < udtParams.length; i++) {
          let p = udtParams[i], separatorIndex = p.indexOf(":"), fieldType = this.parseFqTypeName(p, separatorIndex + 1, p.length - (separatorIndex + 1));
          udtInfo.fields.push({
            name: utils.allocBufferFromString(p.substr(0, separatorIndex), "hex").toString(),
            type: fieldType
          });
        }
        return {
          code: dataTypes.udt,
          info: udtInfo
        };
      };
    }
    function setEncoders() {
      this.decoders = {
        [dataTypes.custom]: this.decodeCustom,
        [dataTypes.ascii]: this.decodeAsciiString,
        [dataTypes.bigint]: this.decodeLong,
        [dataTypes.blob]: this.decodeBlob,
        [dataTypes.boolean]: this.decodeBoolean,
        [dataTypes.counter]: this.decodeLong,
        [dataTypes.decimal]: this.decodeDecimal,
        [dataTypes.double]: this.decodeDouble,
        [dataTypes.float]: this.decodeFloat,
        [dataTypes.int]: this.decodeInt,
        [dataTypes.text]: this.decodeUtf8String,
        [dataTypes.timestamp]: this.decodeTimestamp,
        [dataTypes.uuid]: this.decodeUuid,
        [dataTypes.varchar]: this.decodeUtf8String,
        [dataTypes.varint]: this.decodeVarint,
        [dataTypes.timeuuid]: this.decodeTimeUuid,
        [dataTypes.inet]: this.decodeInet,
        [dataTypes.date]: this.decodeDate,
        [dataTypes.time]: this.decodeTime,
        [dataTypes.smallint]: this.decodeSmallint,
        [dataTypes.tinyint]: this.decodeTinyint,
        [dataTypes.duration]: decodeDuration,
        [dataTypes.list]: this.decodeList,
        [dataTypes.map]: this.decodeMap,
        [dataTypes.set]: this.decodeSet,
        [dataTypes.udt]: this.decodeUdt,
        [dataTypes.tuple]: this.decodeTuple
      }, this.encoders = {
        [dataTypes.custom]: this.encodeCustom,
        [dataTypes.ascii]: this.encodeAsciiString,
        [dataTypes.bigint]: this.encodeLong,
        [dataTypes.blob]: this.encodeBlob,
        [dataTypes.boolean]: this.encodeBoolean,
        [dataTypes.counter]: this.encodeLong,
        [dataTypes.decimal]: this.encodeDecimal,
        [dataTypes.double]: this.encodeDouble,
        [dataTypes.float]: this.encodeFloat,
        [dataTypes.int]: this.encodeInt,
        [dataTypes.text]: this.encodeUtf8String,
        [dataTypes.timestamp]: this.encodeTimestamp,
        [dataTypes.uuid]: this.encodeUuid,
        [dataTypes.varchar]: this.encodeUtf8String,
        [dataTypes.varint]: this.encodeVarint,
        [dataTypes.timeuuid]: this.encodeUuid,
        [dataTypes.inet]: this.encodeInet,
        [dataTypes.date]: this.encodeDate,
        [dataTypes.time]: this.encodeTime,
        [dataTypes.smallint]: this.encodeSmallint,
        [dataTypes.tinyint]: this.encodeTinyint,
        [dataTypes.duration]: encodeDuration,
        [dataTypes.list]: this.encodeList,
        [dataTypes.map]: this.encodeMap,
        [dataTypes.set]: this.encodeSet,
        [dataTypes.udt]: this.encodeUdt,
        [dataTypes.tuple]: this.encodeTuple
      };
    }
    Encoder.prototype.decode = function(buffer, type) {
      if (buffer === null || buffer.length === 0 && !zeroLengthTypesSupported.has(type.code))
        return null;
      let decoder = this.decoders[type.code];
      if (!decoder)
        throw new Error("Unknown data type: " + type.code);
      return decoder.call(this, buffer, type);
    };
    Encoder.prototype.encode = function(value, typeInfo) {
      if (value === void 0 && (value = this.encodingOptions.useUndefinedAsUnset && this.protocolVersion >= 4 ? types.unset : null), value === types.unset) {
        if (!types.protocolVersion.supportsUnset(this.protocolVersion))
          throw new TypeError("Unset value can not be used for this version of Cassandra, protocol version: " + this.protocolVersion);
        return value;
      }
      if (value === null || value instanceof Buffer)
        return value;
      let type = null;
      if (typeInfo) {
        if (typeof typeInfo == "number" ? type = {
          code: typeInfo
        } : typeof typeInfo == "string" ? type = dataTypes.getByName(typeInfo) : typeof typeInfo.code == "number" && (type = typeInfo), type == null || typeof type.code != "number")
          throw new TypeError("Type information not valid, only String and Number values are valid hints");
      } else if (type = Encoder.guessDataType(value), !type)
        throw new TypeError("Target data type could not be guessed, you should use prepared statements for accurate type mapping. Value: " + util.inspect(value));
      let encoder = this.encoders[type.code];
      if (!encoder)
        throw new Error("Type not supported " + type.code);
      return encoder.call(this, value, type);
    };
    Encoder.guessDataType = function(value) {
      let esTypeName = typeof value;
      if (esTypeName === "number")
        return { code: dataTypes.double };
      if (esTypeName === "string")
        return value.length === 36 && uuidRegex.test(value) ? { code: dataTypes.uuid } : { code: dataTypes.text };
      if (esTypeName === "boolean")
        return { code: dataTypes.boolean };
      if (value instanceof Buffer)
        return { code: dataTypes.blob };
      if (value instanceof Date)
        return { code: dataTypes.timestamp };
      if (value instanceof Long)
        return { code: dataTypes.bigint };
      if (value instanceof Integer)
        return { code: dataTypes.varint };
      if (value instanceof BigDecimal)
        return { code: dataTypes.decimal };
      if (value instanceof types.Uuid)
        return { code: dataTypes.uuid };
      if (value instanceof types.InetAddress)
        return { code: dataTypes.inet };
      if (value instanceof types.Tuple)
        return { code: dataTypes.tuple };
      if (value instanceof types.LocalDate)
        return { code: dataTypes.date };
      if (value instanceof types.LocalTime)
        return { code: dataTypes.time };
      if (value instanceof types.Duration)
        return {
          code: dataTypes.custom,
          info: customTypeNames.duration
        };
      if (value instanceof types.Vector)
        if (value && value.length > 0) {
          if (value instanceof Float32Array)
            return {
              code: dataTypes.custom,
              customTypeName: "vector",
              info: [{ code: dataTypes.float }, value.length]
            };
          let subtypeColumnInfo = null;
          if (value.subtype)
            try {
              subtypeColumnInfo = dataTypes.getByName(value.subtype);
            } catch {
            }
          if (subtypeColumnInfo == null && (subtypeColumnInfo = this.guessDataType(value[0])), subtypeColumnInfo != null)
            return {
              code: dataTypes.custom,
              customTypeName: "vector",
              info: [subtypeColumnInfo, value.length]
            };
          throw new TypeError("Cannot guess subtype from element " + value[0]);
        } else
          throw new TypeError("Cannot guess subtype of empty vector");
      else {
        if (Array.isArray(value))
          return { code: dataTypes.list };
        if (value instanceof Geometry) {
          if (value instanceof LineString)
            return {
              code: dataTypes.custom,
              info: customTypeNames.lineString
            };
          if (value instanceof Point)
            return {
              code: dataTypes.custom,
              info: customTypeNames.point
            };
          if (value instanceof Polygon)
            return {
              code: dataTypes.custom,
              info: customTypeNames.polygon
            };
        } else if (value instanceof DateRange)
          return {
            code: dataTypes.custom,
            info: customTypeNames.dateRange
          };
      }
      return null;
    };
    function getLengthBufferV2(value) {
      if (!value)
        return buffers.int16Zero;
      let lengthBuffer = utils.allocBufferUnsafe(2);
      return typeof value == "number" ? lengthBuffer.writeUInt16BE(value, 0) : lengthBuffer.writeUInt16BE(value.length, 0), lengthBuffer;
    }
    function getLengthBufferV3(value) {
      if (!value)
        return buffers.int32Zero;
      let lengthBuffer = utils.allocBufferUnsafe(4);
      return typeof value == "number" ? lengthBuffer.writeInt32BE(value, 0) : lengthBuffer.writeInt32BE(value.length, 0), lengthBuffer;
    }
    function handleBufferCopy(buffer) {
      return buffer === null ? null : utils.copyBuffer(buffer);
    }
    function handleBufferRef(buffer) {
      return buffer;
    }
    function decodeCollectionLengthV3(bytes, offset) {
      return bytes.readInt32BE(offset);
    }
    function decodeCollectionLengthV2(bytes, offset) {
      return bytes.readUInt16BE(offset);
    }
    function decodeDuration(bytes) {
      return types.Duration.fromBuffer(bytes);
    }
    function encodeDuration(value) {
      if (!(value instanceof types.Duration))
        throw new TypeError("Not a valid duration, expected Duration/Buffer obtained " + util.inspect(value));
      return value.toBuffer();
    }
    function decodeLineString(buffer) {
      return LineString.fromBuffer(buffer);
    }
    function encodeLineString(value) {
      return value.toBuffer();
    }
    function decodePoint(buffer) {
      return Point.fromBuffer(buffer);
    }
    function encodePoint(value) {
      return value.toBuffer();
    }
    function decodePolygon(buffer) {
      return Polygon.fromBuffer(buffer);
    }
    function encodePolygon(value) {
      return value.toBuffer();
    }
    function decodeDateRange(buffer) {
      return DateRange.fromBuffer(buffer);
    }
    function encodeDateRange(value) {
      return value.toBuffer();
    }
    function parseParams(value, startIndex, length, open, close) {
      open = open || "(", close = close || ")";
      let types2 = [], paramStart = startIndex, level = 0;
      for (let i = startIndex; i < startIndex + length; i++) {
        let c = value[i];
        c === open && level++, c === close && level--, level === 0 && c === "," && (types2.push(value.substr(paramStart, i - paramStart)), paramStart = i + 1);
      }
      return types2.push(value.substr(paramStart, length - (paramStart - startIndex))), types2;
    }
    function concatRoutingKey(parts, totalLength) {
      if (totalLength === 0)
        return null;
      if (parts.length === 1)
        return parts[0];
      let routingKey = utils.allocBufferUnsafe(totalLength), offset = 0;
      for (let i = 0; i < parts.length; i++) {
        let item = parts[i];
        routingKey.writeUInt16BE(item.length, offset), offset += 2, item.copy(routingKey, offset), offset += item.length, routingKey[offset] = 0, offset++;
      }
      return routingKey;
    }
    function invertObject(obj) {
      let rv = {};
      for (let k in obj)
        obj.hasOwnProperty(k) && (rv[obj[k]] = k);
      return rv;
    }
    Encoder.isTypedArray = function(arg) {
      return arg instanceof Object.getPrototypeOf(Uint8Array);
    };
    module2.exports = Encoder;
  }
});

// node_modules/cassandra-driver/lib/readers.js
var require_readers = __commonJS({
  "node_modules/cassandra-driver/lib/readers.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), types = require_types(), errors = require_errors(), resultFlag = {
      globalTablesSpec: 1,
      hasMorePages: 2,
      noMetadata: 4,
      metadataChanged: 8,
      continuousPaging: 1073741824,
      lastContinuousPage: 2147483648
    }, _writeTimeoutQueryMessage = "Server timeout during write query at consistency %s (%d peer(s) acknowledged the write over %d required)", _writeTimeoutBatchLogMessage = "Server timeout during batchlog write at consistency %s (%d peer(s) acknowledged the write over %d required)", _writeFailureMessage = "Server failure during write query at consistency %s (%d responses were required but only %d replicas responded, %d failed)", _unavailableMessage = "Not enough replicas available for query at consistency %s (%d required but only %d alive)", _readTimeoutMessage = "Server timeout during read query at consistency %s (%s)", _readFailureMessage = "Server failure during read query at consistency %s (%d responses were required but only %d replicas responded, %d failed)", FrameReader = class {
      /**
       * Creates a new instance of the reader
       * @param {FrameHeader} header
       * @param {Buffer} body
       * @param {Number} [offset]
       */
      constructor(header, body, offset) {
        this.header = header, this.opcode = header.opcode, this.offset = offset || 0, this.buf = body;
      }
      remainingLength() {
        return this.buf.length - this.offset;
      }
      getBuffer() {
        return this.buf;
      }
      /**
       * Slices the underlining buffer
       * @param {Number} begin
       * @param {Number} [end]
       * @returns {Buffer}
       */
      slice(begin, end) {
        return typeof end > "u" && (end = this.buf.length), this.buf.slice(begin, end);
      }
      /**
       * Modifies the underlying buffer, it concatenates the given buffer with the original (internalBuffer = concat(bytes, internalBuffer)
       */
      unshift(bytes) {
        if (this.offset > 0)
          throw new Error("Can not modify the underlying buffer if already read");
        this.buf = Buffer.concat([bytes, this.buf], bytes.length + this.buf.length);
      }
      /**
       * Reads any number of bytes and moves the offset.
       * if length not provided or it's larger than the remaining bytes, reads to end.
       * @param length
       * @returns {Buffer}
       */
      read(length) {
        let end = this.buf.length;
        typeof length < "u" && this.offset + length < this.buf.length && (end = this.offset + length);
        let bytes = this.slice(this.offset, end);
        return this.offset = end, bytes;
      }
      /**
       * Moves the reader cursor to the end
       */
      toEnd() {
        this.offset = this.buf.length;
      }
      /**
       * Reads a BE Int and moves the offset
       * @returns {Number}
       */
      readInt() {
        let result = this.buf.readInt32BE(this.offset);
        return this.offset += 4, result;
      }
      /** @returns {Number} */
      readShort() {
        let result = this.buf.readUInt16BE(this.offset);
        return this.offset += 2, result;
      }
      readByte() {
        let result = this.buf.readUInt8(this.offset);
        return this.offset += 1, result;
      }
      readString() {
        let length = this.readShort();
        this.checkOffset(length);
        let result = this.buf.toString("utf8", this.offset, this.offset + length);
        return this.offset += length, result;
      }
      /**
       * Checks that the new length to read is within the range of the buffer length. Throws a RangeError if not.
       * @param {Number} newLength
       */
      checkOffset(newLength) {
        if (this.offset + newLength > this.buf.length) {
          let err = new RangeError("Trying to access beyond buffer length");
          throw err.expectedLength = newLength, err;
        }
      }
      /**
       * Reads a protocol string list
       * @returns {Array}
       */
      readStringList() {
        let length = this.readShort(), list = new Array(length);
        for (let i = 0; i < length; i++)
          list[i] = this.readString();
        return list;
      }
      /**
       * Reads the amount of bytes that the field has and returns them (slicing them).
       * @returns {Buffer}
       */
      readBytes() {
        let length = this.readInt();
        return length < 0 ? null : (this.checkOffset(length), this.read(length));
      }
      readShortBytes() {
        let length = this.readShort();
        return length < 0 ? null : (this.checkOffset(length), this.read(length));
      }
      /**
       * Reads an associative array of strings as keys and bytes as values
       * @param {Number} length
       * @param {Function} keyFn
       * @param {Function} valueFn
       * @returns {Object}
       */
      readMap(length, keyFn, valueFn) {
        if (length < 0)
          return null;
        let map = {};
        for (let i = 0; i < length; i++)
          map[keyFn.call(this)] = valueFn.call(this);
        return map;
      }
      /**
       * Reads an associative array of strings as keys and string lists as values
       * @returns {Object}
       */
      readStringMultiMap() {
        let length = this.readShort();
        if (length < 0)
          return null;
        let map = {};
        for (let i = 0; i < length; i++)
          map[this.readString()] = this.readStringList();
        return map;
      }
      /**
       * Reads a data type definition
       * @returns {{code: Number, info: Object|null}} An array of 2 elements
       */
      readType() {
        let i, type = {
          code: this.readShort(),
          type: null
        };
        switch (type.code) {
          case types.dataTypes.custom:
            type.info = this.readString();
            break;
          case types.dataTypes.list:
          case types.dataTypes.set:
            type.info = this.readType();
            break;
          case types.dataTypes.map:
            type.info = [this.readType(), this.readType()];
            break;
          case types.dataTypes.udt:
            for (type.info = {
              keyspace: this.readString(),
              name: this.readString(),
              fields: new Array(this.readShort())
            }, i = 0; i < type.info.fields.length; i++)
              type.info.fields[i] = {
                name: this.readString(),
                type: this.readType()
              };
            break;
          case types.dataTypes.tuple:
            for (type.info = new Array(this.readShort()), i = 0; i < type.info.length; i++)
              type.info[i] = this.readType();
            break;
        }
        return type;
      }
      /**
       * Reads an Ip address and port
       * @returns {{address: exports.InetAddress, port: Number}}
       */
      readInet() {
        let length = this.readByte(), address = this.read(length);
        return { address: new types.InetAddress(address), port: this.readInt() };
      }
      /**
       * Reads an Ip address
       * @returns {InetAddress}
       */
      readInetAddress() {
        let length = this.readByte();
        return new types.InetAddress(this.read(length));
      }
      /**
       * Reads the body bytes corresponding to the flags
       * @returns {{traceId: Uuid, warnings: Array, customPayload}}
       * @throws {RangeError}
       */
      readFlagsInfo() {
        if (this.header.flags === 0)
          return utils.emptyObject;
        let result = {};
        return this.header.flags & types.frameFlags.tracing && (this.checkOffset(16), result.traceId = new types.Uuid(utils.copyBuffer(this.read(16)))), this.header.flags & types.frameFlags.warning && (result.warnings = this.readStringList()), this.header.flags & types.frameFlags.customPayload && (result.customPayload = this.readMap(this.readShort(), this.readString, this.readBytes)), result;
      }
      /**
       * Reads the metadata from a row or a prepared result response
       * @param {Number} kind
       * @returns {Object}
       * @throws {RangeError}
       */
      readMetadata(kind) {
        let i, isPrepared = kind === types.resultKind.prepared, meta = {};
        types.protocolVersion.supportsResultMetadataId(this.header.version) && isPrepared && (meta.resultId = utils.copyBuffer(this.readShortBytes()));
        let flags = this.readInt(), columnLength = this.readInt();
        if (types.protocolVersion.supportsPreparedPartitionKey(this.header.version) && isPrepared)
          for (meta.partitionKeys = new Array(this.readInt()), i = 0; i < meta.partitionKeys.length; i++)
            meta.partitionKeys[i] = this.readShort();
        for (flags & resultFlag.hasMorePages && (meta.pageState = utils.copyBuffer(this.readBytes())), flags & resultFlag.metadataChanged && (meta.newResultId = utils.copyBuffer(this.readShortBytes())), flags & resultFlag.continuousPaging && (meta.continuousPageIndex = this.readInt(), meta.lastContinuousPage = !!(flags & resultFlag.lastContinuousPage)), flags & resultFlag.globalTablesSpec && (meta.global_tables_spec = !0, meta.keyspace = this.readString(), meta.table = this.readString()), meta.columns = new Array(columnLength), meta.columnsByName = utils.emptyObject, isPrepared && (meta.columnsByName = {}), i = 0; i < columnLength; i++) {
          let col = {};
          meta.global_tables_spec || (col.ksname = this.readString(), col.tablename = this.readString()), col.name = this.readString(), col.type = this.readType(), meta.columns[i] = col, isPrepared && (meta.columnsByName[col.name] = i);
        }
        return meta;
      }
      /**
       * Reads the error from the frame
       * @throws {RangeError}
       * @returns {ResponseError}
       */
      readError() {
        let code = this.readInt(), message = this.readString(), err = new errors.ResponseError(code, message);
        switch (code) {
          case types.responseErrorCodes.unavailableException:
            err.consistencies = this.readShort(), err.required = this.readInt(), err.alive = this.readInt(), err.message = util.format(_unavailableMessage, types.consistencyToString[err.consistencies], err.required, err.alive);
            break;
          case types.responseErrorCodes.readTimeout:
          case types.responseErrorCodes.readFailure:
            if (err.consistencies = this.readShort(), err.received = this.readInt(), err.blockFor = this.readInt(), code === types.responseErrorCodes.readFailure && (types.protocolVersion.supportsFailureReasonMap(this.header.version) ? (err.failures = this.readInt(), err.reasons = this.readMap(err.failures, this.readInetAddress, this.readShort)) : err.failures = this.readInt()), err.isDataPresent = this.readByte(), code === types.responseErrorCodes.readTimeout) {
              let details;
              err.received < err.blockFor ? details = util.format("%d replica(s) responded over %d required", err.received, err.blockFor) : err.isDataPresent ? details = "timeout while waiting for repair of inconsistent replica" : details = "the replica queried for the data didn't respond", err.message = util.format(_readTimeoutMessage, types.consistencyToString[err.consistencies], details);
            } else
              err.message = util.format(_readFailureMessage, types.consistencyToString[err.consistencies], err.blockFor, err.received, err.failures);
            break;
          case types.responseErrorCodes.writeTimeout:
          case types.responseErrorCodes.writeFailure:
            if (err.consistencies = this.readShort(), err.received = this.readInt(), err.blockFor = this.readInt(), code === types.responseErrorCodes.writeFailure && (types.protocolVersion.supportsFailureReasonMap(this.header.version) ? (err.failures = this.readInt(), err.reasons = this.readMap(err.failures, this.readInetAddress, this.readShort)) : err.failures = this.readInt()), err.writeType = this.readString(), code === types.responseErrorCodes.writeTimeout) {
              let template = err.writeType === "BATCH_LOG" ? _writeTimeoutBatchLogMessage : _writeTimeoutQueryMessage;
              err.message = util.format(template, types.consistencyToString[err.consistencies], err.received, err.blockFor);
            } else
              err.message = util.format(_writeFailureMessage, types.consistencyToString[err.consistencies], err.blockFor, err.received, err.failures);
            break;
          case types.responseErrorCodes.unprepared:
            err.queryId = utils.copyBuffer(this.readShortBytes());
            break;
          case types.responseErrorCodes.functionFailure:
            err.keyspace = this.readString(), err.functionName = this.readString(), err.argTypes = this.readStringList();
            break;
          case types.responseErrorCodes.alreadyExists: {
            err.keyspace = this.readString();
            let table = this.readString();
            table.length > 0 && (err.table = table);
            break;
          }
        }
        return err;
      }
      /**
       * Reads an event from Cassandra and returns the detail
       * @returns {{eventType: String, inet: {address: Buffer, port: Number}}, *}
       */
      readEvent() {
        let eventType = this.readString();
        switch (eventType) {
          case types.protocolEvents.topologyChange:
            return {
              added: this.readString() === "NEW_NODE",
              inet: this.readInet(),
              eventType
            };
          case types.protocolEvents.statusChange:
            return {
              up: this.readString() === "UP",
              inet: this.readInet(),
              eventType
            };
          case types.protocolEvents.schemaChange:
            return this.parseSchemaChange();
        }
        return { eventType };
      }
      parseSchemaChange() {
        let result;
        if (!types.protocolVersion.supportsSchemaChangeFullMetadata(this.header.version))
          return result = {
            eventType: types.protocolEvents.schemaChange,
            schemaChangeType: this.readString(),
            keyspace: this.readString(),
            table: this.readString()
          }, result.isKeyspace = !result.table, result;
        switch (result = {
          eventType: types.protocolEvents.schemaChange,
          schemaChangeType: this.readString(),
          target: this.readString(),
          keyspace: this.readString(),
          table: null,
          udt: null,
          signature: null
        }, result.isKeyspace = result.target === "KEYSPACE", result.target) {
          case "TABLE":
            result.table = this.readString();
            break;
          case "TYPE":
            result.udt = this.readString();
            break;
          case "FUNCTION":
            result.functionName = this.readString(), result.signature = this.readStringList();
            break;
          case "AGGREGATE":
            result.aggregate = this.readString(), result.signature = this.readStringList();
        }
        return result;
      }
    };
    module2.exports = { FrameReader };
  }
});

// node_modules/cassandra-driver/lib/streams.js
var require_streams = __commonJS({
  "node_modules/cassandra-driver/lib/streams.js"(exports2) {
    "use strict";
    var util = require("util"), { Transform, Writable } = require("stream"), types = require_types(), utils = require_utils(), errors = require_errors(), { FrameHeader } = types, { FrameReader } = require_readers();
    function Protocol(options) {
      Transform.call(this, options), this.header = null, this.bodyLength = 0, this.clearHeaderChunks(), this.version = 0, this.headerSize = 0;
    }
    util.inherits(Protocol, Transform);
    Protocol.prototype._transform = function(chunk, encoding, callback) {
      let error = null;
      try {
        this.readItems(chunk);
      } catch (err) {
        error = err;
      }
      callback(error);
    };
    Protocol.prototype.readItems = function(chunk) {
      if (!chunk || chunk.length === 0)
        return;
      this.version === 0 && (this.version = FrameHeader.getProtocolVersion(chunk), this.headerSize = FrameHeader.size(this.version));
      let offset = 0, currentHeader = this.header;
      if (this.header = null, this.headerChunks.byteLength !== 0) {
        if (this.headerChunks.parts.push(chunk), this.headerChunks.byteLength + chunk.length < this.headerSize) {
          this.headerChunks.byteLength += chunk.length;
          return;
        }
        currentHeader = FrameHeader.fromBuffer(Buffer.concat(this.headerChunks.parts, this.headerSize)), offset = this.headerSize - this.headerChunks.byteLength, this.clearHeaderChunks();
      }
      let items = [];
      for (; ; ) {
        if (!currentHeader) {
          if (this.headerSize > chunk.length - offset) {
            if (chunk.length - offset <= 0)
              break;
            let headerPart = chunk.slice(offset, chunk.length);
            this.headerChunks.parts.push(headerPart), this.headerChunks.byteLength = headerPart.length;
            break;
          }
          currentHeader = FrameHeader.fromBuffer(chunk, offset), offset += this.headerSize;
        }
        let remaining = chunk.length - offset;
        if (currentHeader.bodyLength <= remaining + this.bodyLength)
          items.push({ header: currentHeader, chunk, offset, frameEnded: !0 }), offset += currentHeader.bodyLength - this.bodyLength, this.bodyLength = 0;
        else if (remaining >= 0) {
          this.header = currentHeader, this.bodyLength += remaining, remaining > 0 && items.push({ header: currentHeader, chunk, offset, frameEnded: !1 });
          break;
        }
        currentHeader = null;
      }
      for (let i = 0; i < items.length; i++)
        this.push(items[i]);
    };
    Protocol.prototype.clearHeaderChunks = function() {
      this.headerChunks = { byteLength: 0, parts: [] };
    };
    function Parser(streamOptions, encoder) {
      Transform.call(this, streamOptions), this.frames = {}, this.encoder = encoder;
    }
    util.inherits(Parser, Transform);
    Parser.prototype._transform = function(item, encoding, callback) {
      let frameInfo = this.frameState(item), error = null;
      try {
        this.parseBody(frameInfo, item);
      } catch (err) {
        error = err;
      }
      callback(error), item.frameEnded && (frameInfo.cellBuffer && this.push({
        header: frameInfo.header,
        error: new errors.DriverInternalError("There was an problem while parsing streaming frame, opcode " + frameInfo.header.opcode)
      }), this.push({ header: frameInfo.header, frameEnded: !0 }));
    };
    Parser.prototype.parseBody = function(frameInfo, item) {
      if (frameInfo.isStreaming = frameInfo.byRow && item.header.opcode === types.opcodes.result, !this.handleFrameBuffers(frameInfo, item))
        return;
      let reader = new FrameReader(item.header, item.chunk, item.offset);
      if (frameInfo.flagsInfo === void 0) {
        let originalOffset = reader.offset;
        try {
          frameInfo.flagsInfo = reader.readFlagsInfo();
        } catch (e) {
          return this.handleParsingError(e, frameInfo, reader, originalOffset);
        }
      }
      switch (item.header.opcode) {
        case types.opcodes.result:
          return this.parseResult(frameInfo, reader);
        case types.opcodes.ready:
        case types.opcodes.authSuccess:
          return this.push({ header: frameInfo.header, ready: !0 });
        case types.opcodes.authChallenge:
          return this.push({ header: frameInfo.header, authChallenge: !0, token: reader.readBytes() });
        case types.opcodes.authenticate:
          return this.push({ header: frameInfo.header, mustAuthenticate: !0, authenticatorName: reader.readString() });
        case types.opcodes.error:
          return this.push({ header: frameInfo.header, error: reader.readError() });
        case types.opcodes.supported:
          return this.push({ header: frameInfo.header, supported: reader.readStringMultiMap() });
        case types.opcodes.event:
          return this.push({ header: frameInfo.header, event: reader.readEvent() });
        default:
          return this.push({ header: frameInfo.header, error: new Error("Received invalid opcode: " + item.header.opcode) });
      }
    };
    Parser.prototype.handleFrameBuffers = function(frameInfo, item) {
      if (!frameInfo.isStreaming)
        return (frameInfo.bufferLength || 0) + item.chunk.length - item.offset < item.header.bodyLength ? (this.addFrameBuffer(frameInfo, item), !1) : (frameInfo.buffers && (item.chunk = this.getFrameBuffer(frameInfo, item), item.offset = 0), !0);
      if (frameInfo.cellBuffer) {
        if (item.offset !== 0)
          throw new errors.DriverInternalError("Following chunks can not have an offset greater than zero");
        if (frameInfo.cellBuffer.parts.push(item.chunk), !frameInfo.cellBuffer.expectedLength) {
          if (frameInfo.cellBuffer.parts.length !== 2)
            throw new errors.DriverInternalError("Buffer for streaming frame can not contain more than 1 item");
          return item.chunk = Buffer.concat(frameInfo.cellBuffer.parts, frameInfo.cellBuffer.byteLength + item.chunk.length), frameInfo.cellBuffer = null, !0;
        }
        if (frameInfo.cellBuffer.expectedLength > frameInfo.cellBuffer.byteLength + item.chunk.length)
          return frameInfo.cellBuffer.byteLength += item.chunk.length, !1;
        item.chunk = Buffer.concat(frameInfo.cellBuffer.parts, frameInfo.cellBuffer.byteLength + item.chunk.length), frameInfo.cellBuffer = null;
      }
      return !0;
    };
    Parser.prototype.addFrameBuffer = function(frameInfo, item) {
      if (!frameInfo.buffers) {
        frameInfo.buffers = [item.chunk.slice(item.offset)], frameInfo.bufferLength = item.chunk.length - item.offset;
        return;
      }
      if (item.offset > 0)
        throw new errors.DriverInternalError("Following chunks can not have an offset greater than zero");
      frameInfo.buffers.push(item.chunk), frameInfo.bufferLength += item.chunk.length;
    };
    Parser.prototype.getFrameBuffer = function(frameInfo, item) {
      frameInfo.buffers.push(item.chunk);
      let result = Buffer.concat(frameInfo.buffers, frameInfo.bodyLength);
      return frameInfo.buffers = null, result;
    };
    Parser.prototype.parseResult = function(frameInfo, reader) {
      let result, originalOffset = reader.offset;
      try {
        if (!frameInfo.meta)
          switch (frameInfo.kind = reader.readInt(), frameInfo.kind) {
            case types.resultKind.voidResult:
              result = { header: frameInfo.header, flags: frameInfo.flagsInfo };
              break;
            case types.resultKind.rows:
              frameInfo.meta = reader.readMetadata(frameInfo.kind);
              break;
            case types.resultKind.setKeyspace:
              result = { header: frameInfo.header, keyspaceSet: reader.readString(), flags: frameInfo.flagsInfo };
              break;
            case types.resultKind.prepared: {
              let preparedId = utils.copyBuffer(reader.readShortBytes());
              frameInfo.meta = reader.readMetadata(frameInfo.kind), result = { header: frameInfo.header, id: preparedId, meta: frameInfo.meta, flags: frameInfo.flagsInfo };
              break;
            }
            case types.resultKind.schemaChange:
              result = { header: frameInfo.header, schemaChange: reader.parseSchemaChange(), flags: frameInfo.flagsInfo };
              break;
            default:
              throw errors.DriverInternalError("Unexpected result kind: " + frameInfo.kind);
          }
      } catch (e) {
        return this.handleParsingError(e, frameInfo, reader, originalOffset);
      }
      if (result)
        return frameInfo.emitted ? void 0 : (frameInfo.emitted = !0, this.push(result));
      reader.remainingLength() > 0 && this.parseRows(frameInfo, reader);
    };
    Parser.prototype.parseRows = function(frameInfo, reader) {
      if (frameInfo.parsingError)
        return;
      if (frameInfo.rowLength === void 0)
        try {
          frameInfo.rowLength = reader.readInt();
        } catch (e) {
          return this.handleParsingError(e, frameInfo, reader);
        }
      if (frameInfo.rowLength === 0)
        return this.push({
          header: frameInfo.header,
          result: { rows: utils.emptyArray, meta: frameInfo.meta, flags: frameInfo.flagsInfo }
        });
      let meta = frameInfo.meta;
      frameInfo.rowIndex = frameInfo.rowIndex || 0;
      for (let i = frameInfo.rowIndex; i < frameInfo.rowLength; i++) {
        let rowOffset = reader.offset, row = new types.Row(meta.columns), cellBuffer;
        for (let j = 0; j < meta.columns.length; j++) {
          let c = meta.columns[j];
          try {
            cellBuffer = reader.readBytes();
          } catch (e) {
            return this.handleParsingError(e, frameInfo, reader, rowOffset, i);
          }
          try {
            row[c.name] = this.encoder.decode(cellBuffer, c.type);
          } catch (e) {
            return this.handleParsingError(e, frameInfo, null);
          }
        }
        this.push({
          header: frameInfo.header,
          row,
          meta: frameInfo.meta,
          byRow: frameInfo.byRow,
          length: frameInfo.rowLength,
          flags: frameInfo.flagsInfo
        });
      }
      frameInfo.byRow && this.push({
        header: frameInfo.header,
        byRowCompleted: !0,
        meta: frameInfo.meta,
        length: frameInfo.rowLength,
        flags: frameInfo.flagsInfo
      });
    };
    Parser.prototype.setOptions = function(id, options) {
      if (this.frames[id.toString()])
        throw new types.DriverError("There was already state for this frame");
      this.frames[id.toString()] = options;
    };
    Parser.prototype.clearOptions = function(id) {
      delete this.frames[id.toString()];
    };
    Parser.prototype.frameState = function(item) {
      let frameInfo = this.frames[item.header.streamId];
      return frameInfo ? item.frameEnded && delete this.frames[item.header.streamId] : (frameInfo = {}, item.frameEnded || (this.frames[item.header.streamId] = frameInfo)), frameInfo.header = item.header, frameInfo;
    };
    Parser.prototype.handleParsingError = function(e, frameInfo, reader, originalOffset, rowIndex) {
      if (reader && frameInfo.isStreaming && e instanceof RangeError)
        return this.bufferResultCell(frameInfo, reader, originalOffset, rowIndex, e.expectedLength);
      frameInfo.parsingError = !0, frameInfo.cellBuffer = null, this.push({ header: frameInfo.header, error: e });
    };
    Parser.prototype.bufferResultCell = function(frameInfo, reader, originalOffset, rowIndex, expectedLength) {
      !originalOffset && originalOffset !== 0 && (originalOffset = reader.offset), frameInfo.rowIndex = rowIndex;
      let buffer = reader.slice(originalOffset);
      frameInfo.cellBuffer = {
        parts: [buffer],
        byteLength: buffer.length,
        expectedLength
      };
    };
    function ResultEmitter(options) {
      Writable.call(this, options), this.rowBuffer = {};
    }
    util.inherits(ResultEmitter, Writable);
    ResultEmitter.prototype._write = function(item, encoding, callback) {
      let error = null;
      try {
        this.each(item);
      } catch (err) {
        error = err;
      }
      callback(error);
    };
    ResultEmitter.prototype.each = function(item) {
      return item.error || item.result ? this.emit("result", item.header, item.error, item.result) : item.frameEnded ? this.emit("frameEnded", item.header) : item.lastContinuousPage ? this.emit("lastContinuousPage", item.header) : item.byRowCompleted ? this.emit("byRowCompleted", item.header, item.row, item.meta, item.flags) : item.byRow ? this.emit("row", item.header, item.row, item.meta, item.length, item.flags) : item.row ? this.bufferAndEmit(item) : item.event ? this.emit("nodeEvent", item.header, item.event) : this.emit("result", item.header, null, item);
    };
    ResultEmitter.prototype.bufferAndEmit = function(item) {
      let rows = this.rowBuffer[item.header.streamId];
      rows || (rows = this.rowBuffer[item.header.streamId] = []), rows.push(item.row), rows.length === item.length && (this.emit("result", item.header, null, { rows, meta: item.meta, flags: item.flags }), delete this.rowBuffer[item.header.streamId]);
    };
    exports2.Protocol = Protocol;
    exports2.Parser = Parser;
    exports2.ResultEmitter = ResultEmitter;
  }
});

// node_modules/cassandra-driver/lib/stream-id-stack.js
var require_stream_id_stack = __commonJS({
  "node_modules/cassandra-driver/lib/stream-id-stack.js"(exports2, module2) {
    "use strict";
    var types = require_types(), groupSize = 128, shiftToGroup = 7, releasableSize = 4, maxGroupsFor2Bytes = 256, defaultReleaseDelay = 5e3, StreamIdStack = class {
      /**
       * Creates a new instance of StreamIdStack.
       * @param {number} version Protocol version
       * @constructor
       */
      constructor(version) {
        this.currentGroup = generateGroup(0), this.groupIndex = 0, this.groups = [this.currentGroup], this.releaseTimeout = null, this.setVersion(version), this.inUse = 0, this.releaseDelay = defaultReleaseDelay;
      }
      /**
       * Sets the protocol version
       * @param {Number} version
       */
      setVersion(version) {
        this.maxGroups = types.protocolVersion.uses2BytesStreamIds(version) ? maxGroupsFor2Bytes : 1;
      }
      /**
       * Dequeues an id.
       * Similar to {@link Array#pop()}.
       * @returns {Number} Returns an id or null
       */
      pop() {
        let id = this.currentGroup.pop();
        if (typeof id < "u")
          return this.inUse++, id;
        for (; this.groupIndex < this.groups.length - 1; )
          if (this.currentGroup = this.groups[++this.groupIndex], id = this.currentGroup.pop(), typeof id < "u")
            return this.inUse++, id;
        return this._tryCreateGroup();
      }
      /**
       * Enqueue an id for future use.
       * Similar to {@link Array#push()}.
       * @param {Number} id
       */
      push(id) {
        this.inUse--;
        let groupIndex = id >> shiftToGroup, group = this.groups[groupIndex];
        group.push(id), groupIndex < this.groupIndex && (this.groupIndex = groupIndex, this.currentGroup = group), this._tryIssueRelease();
      }
      /**
       * Clears all timers
       */
      clear() {
        this.releaseTimeout && (clearTimeout(this.releaseTimeout), this.releaseTimeout = null);
      }
      /**
       * Tries to create an additional group and returns a new id
       * @returns {Number} Returns a new id or null if it's not possible to create a new group
       * @private
       */
      _tryCreateGroup() {
        return this.groups.length === this.maxGroups ? null : (this.groupIndex = this.groups.length, this.currentGroup = generateGroup(this.groupIndex << shiftToGroup), this.groups.push(this.currentGroup), this.inUse++, this.currentGroup.pop());
      }
      _tryIssueRelease() {
        this.releaseTimeout || this.groups.length <= releasableSize || (this.releaseTimeout = setTimeout(() => this._releaseGroups(), this.releaseDelay));
      }
      _releaseGroups() {
        let counter = 0, index = this.groups.length - 1;
        for (; counter++ < releasableSize && this.groups.length > releasableSize && index > this.groupIndex && this.groups[index].length === groupSize; )
          this.groups.pop(), index--;
        this.releaseTimeout = null, this._tryIssueRelease();
      }
    };
    function generateGroup(initialValue) {
      let arr = new Array(groupSize), upperBound = initialValue + groupSize - 1;
      for (let i = 0; i < groupSize; i++)
        arr[i] = upperBound - i;
      return arr;
    }
    module2.exports = StreamIdStack;
  }
});

// node_modules/cassandra-driver/lib/operation-state.js
var require_operation_state = __commonJS({
  "node_modules/cassandra-driver/lib/operation-state.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), errors = require_errors(), requests = require_requests(), ExecuteRequest = requests.ExecuteRequest, QueryRequest = requests.QueryRequest, state = {
      init: 0,
      completed: 1,
      timedOut: 2,
      cancelled: 3
    }, OperationState = class {
      /**
       * Creates a new instance of OperationState.
       * @param {Request} request
       * @param {Function} rowCallback
       * @param {Function} callback
       */
      constructor(request, rowCallback, callback) {
        this.request = request, this._rowCallback = rowCallback, this._callback = callback, this._timeout = null, this._state = state.init, this._rowIndex = 0, this.streamId = -1;
      }
      /**
       * Marks the operation as cancelled, clearing all callbacks and timeouts.
       */
      cancel() {
        this._state === state.init && (this._timeout !== null && clearTimeout(this._timeout), this._state = state.cancelled, this._callback = utils.noop);
      }
      /**
       * Determines if the operation can be written to the wire (when it hasn't been cancelled or it hasn't timed out).
       */
      canBeWritten() {
        return this._state === state.init;
      }
      /**
       * Determines if the response is going to be yielded by row.
       * @return {boolean}
       */
      isByRow() {
        return this._rowCallback && (this.request instanceof ExecuteRequest || this.request instanceof QueryRequest);
      }
      /**
       * Creates the timeout for the request.
       * @param {ExecutionOptions} execOptions
       * @param {Number} defaultReadTimeout
       * @param {String} address
       * @param {Function} onTimeout The callback to be invoked when it times out.
       * @param {Function} onResponse The callback to be invoked if a response is obtained after it timed out.
       */
      setRequestTimeout(execOptions, defaultReadTimeout, address, onTimeout, onResponse) {
        if (this._state !== state.init)
          return;
        let millis = execOptions.getReadTimeout() !== void 0 ? execOptions.getReadTimeout() : defaultReadTimeout;
        if (!(millis > 0))
          return;
        let self = this;
        this._timeout = setTimeout(function() {
          onTimeout();
          let message = util.format("The host %s did not reply before timeout %d ms", address, millis);
          self._markAsTimedOut(new errors.OperationTimedOutError(message, address), onResponse);
        }, millis);
      }
      setResultRow(row, meta, rowLength, flags, header) {
        if (this._markAsCompleted(), !this._rowCallback)
          return this.setResult(new errors.DriverInternalError("RowCallback not found for streaming frame handler"));
        this._rowCallback(this._rowIndex++, row, rowLength), this._rowIndex === rowLength && this._swapCallbackAndInvoke(null, { rowLength, meta, flags }, header.bodyLength);
      }
      /**
       * Marks the current operation as timed out.
       * @param {Error} err
       * @param {Function} onResponse
       * @private
       */
      _markAsTimedOut(err, onResponse) {
        this._state === state.init && (this._state = state.timedOut, this._swapCallbackAndInvoke(err, null, null, onResponse));
      }
      _markAsCompleted() {
        this._state === state.init && (this._timeout !== null && clearTimeout(this._timeout), this._state = state.completed);
      }
      /**
       * Sets the result of this operation, declaring that no further input will be processed for this operation.
       * @param {Error} err
       * @param {Object} [result]
       * @param {Number} [length]
       */
      setResult(err, result, length) {
        this._markAsCompleted(), this._swapCallbackAndInvoke(err, result, length);
      }
      _swapCallbackAndInvoke(err, result, length, newCallback) {
        let callback = this._callback;
        this._callback = newCallback || utils.noop, callback(err, result, length);
      }
    };
    module2.exports = OperationState;
  }
});

// node_modules/cassandra-driver/lib/connection.js
var require_connection = __commonJS({
  "node_modules/cassandra-driver/lib/connection.js"(exports2, module2) {
    "use strict";
    var events = require("events"), util = require("util"), tls = require("tls"), net = require("net"), Encoder = require_encoder(), { WriteQueue } = require_writers(), requests = require_requests(), streams = require_streams(), utils = require_utils(), types = require_types(), errors = require_errors(), StreamIdStack = require_stream_id_stack(), OperationState = require_operation_state(), promiseUtils = require_promise_utils(), { ExecutionOptions } = require_execution_options(), Connection = class extends events.EventEmitter {
      /**
       * Creates a new instance of Connection.
       * @param {String} endpoint An string containing ip address and port of the host
       * @param {Number|null} protocolVersion
       * @param {ClientOptions} options
       */
      constructor(endpoint, protocolVersion, options) {
        if (super(), this.setMaxListeners(0), !options)
          throw new Error("options is not defined");
        if (this.endpoint = endpoint, this.endpointFriendlyName = this.endpoint, options.sni && (this._serverName = endpoint, this.endpoint = `${options.sni.addressResolver.getIp()}:${options.sni.port}`, this.endpointFriendlyName = `${this.endpoint} (${this._serverName})`), !this.endpoint || this.endpoint.indexOf(":") < 0)
          throw new Error("EndPoint must contain the ip address and port separated by : symbol");
        let portSeparatorIndex = this.endpoint.lastIndexOf(":");
        this.address = this.endpoint.substr(0, portSeparatorIndex), this.port = this.endpoint.substr(portSeparatorIndex + 1), Object.defineProperty(this, "options", { value: options, enumerable: !1, writable: !1 }), protocolVersion === null && (protocolVersion = types.protocolVersion.maxSupported, options.protocolOptions.maxVersion && (protocolVersion = options.protocolOptions.maxVersion), this._checkingVersion = !0), this.log = utils.log, this.protocolVersion = protocolVersion, this._operations = /* @__PURE__ */ new Map(), this._pendingWrites = [], this._preparing = /* @__PURE__ */ new Map(), this._idleTimeout = null, this.timedOutOperations = 0, this._streamIds = new StreamIdStack(this.protocolVersion), this._metrics = options.metrics, this.encoder = new Encoder(protocolVersion, options), this.keyspace = null, this.emitDrain = !1, this.connected = !1, this.isSocketOpen = !1, this.send = util.promisify(this.sendStream), this.closeAsync = util.promisify(this.close), this.openAsync = util.promisify(this.open), this.prepareOnceAsync = util.promisify(this.prepareOnce);
      }
      /**
       * Binds the necessary event listeners for the socket
       */
      bindSocketListeners() {
        this.netClient.removeAllListeners("connect"), this.netClient.removeAllListeners("timeout"), this.isSocketOpen = !0, this.netClient.on("close", () => {
          this.log("info", `Connection to ${this.endpointFriendlyName} closed`), this.isSocketOpen = !1;
          let wasConnected = this.connected;
          this.close(), wasConnected && this.emit("socketClose");
        }), this.protocol = new streams.Protocol({ objectMode: !0 }), this.parser = new streams.Parser({ objectMode: !0 }, this.encoder);
        let resultEmitter = new streams.ResultEmitter({ objectMode: !0 });
        resultEmitter.on("result", this.handleResult.bind(this)), resultEmitter.on("row", this.handleRow.bind(this)), resultEmitter.on("frameEnded", this.freeStreamId.bind(this)), resultEmitter.on("nodeEvent", this.handleNodeEvent.bind(this)), this.netClient.pipe(this.protocol).pipe(this.parser).pipe(resultEmitter), this.writeQueue = new WriteQueue(this.netClient, this.encoder, this.options);
      }
      /**
       * Connects a socket and sends the startup protocol messages.
       * Note that when open() callbacks in error, the caller should immediately call {@link Connection#close}.
       */
      open(callback) {
        let self = this;
        if (this.log("info", `Connecting to ${this.endpointFriendlyName}`), !this.options.sslOptions)
          this.netClient = new net.Socket({ highWaterMark: this.options.socketOptions.coalescingThreshold }), this.netClient.connect(this.port, this.address, function() {
            self.log("verbose", `Socket connected to ${self.endpointFriendlyName}`), self.bindSocketListeners(), self.startup(callback);
          });
        else {
          let sslOptions = utils.extend({ rejectUnauthorized: !1 }, this.options.sslOptions);
          this.options.sni && (sslOptions.servername = this._serverName), this.netClient = tls.connect(this.port, this.address, sslOptions, function() {
            self.log("verbose", `Secure socket connected to ${self.endpointFriendlyName} with protocol ${self.netClient.getProtocol()}`), self.bindSocketListeners(), self.startup(callback);
          }), this.netClient.setMaxSendFragment(this.options.socketOptions.coalescingThreshold);
        }
        this.netClient.once("error", function(err) {
          self.errorConnecting(err, !1, callback);
        }), this.netClient.once("timeout", function() {
          let err = new types.DriverError("Connection timeout");
          self.errorConnecting(err, !0, callback);
        }), this.netClient.setTimeout(this.options.socketOptions.connectTimeout), this.options.socketOptions.keepAlive && this.netClient.setKeepAlive(!0, this.options.socketOptions.keepAliveDelay), this.netClient.setNoDelay(!!this.options.socketOptions.tcpNoDelay);
      }
      /**
       * Determines the protocol version to use and sends the STARTUP request
       * @param {Function} callback
       */
      startup(callback) {
        this._checkingVersion && this.log("info", "Trying to use protocol version 0x" + this.protocolVersion.toString(16));
        let self = this, request = new requests.StartupRequest({
          noCompact: this.options.protocolOptions.noCompact,
          clientId: this.options.id,
          applicationName: this.options.applicationName,
          applicationVersion: this.options.applicationVersion
        });
        this.sendStream(request, null, function(err, response) {
          if (err && self._checkingVersion) {
            let invalidProtocol = err instanceof errors.ResponseError && err.code === types.responseErrorCodes.protocolError && err.message.indexOf("Invalid or unsupported protocol version") >= 0;
            if (!invalidProtocol && types.protocolVersion.canStartupResponseErrorBeWrapped(self.protocolVersion) && (invalidProtocol = err instanceof errors.ResponseError && err.code === types.responseErrorCodes.serverError && err.message.indexOf("ProtocolException: Invalid or unsupported protocol version") > 0), invalidProtocol) {
              let lowerVersion = self.protocol.version;
              if (lowerVersion === self.protocolVersion ? lowerVersion = types.protocolVersion.getLowerSupported(self.protocolVersion) : types.protocolVersion.isSupported(self.protocol.version) || (self.log("info", `Protocol version ${self.protocol.version} not supported by this driver, downgrading`), lowerVersion = types.protocolVersion.getLowerSupported(self.protocol.version)), !lowerVersion)
                return startupCallback(
                  new Error("Connection was unable to STARTUP using protocol version " + self.protocolVersion)
                );
              self.log("info", "Protocol 0x" + self.protocolVersion.toString(16) + " not supported, using 0x" + lowerVersion.toString(16)), self.decreaseVersion(lowerVersion), setImmediate(function() {
                self.close(function() {
                  self.open(callback);
                });
              });
              return;
            }
          }
          if (response && response.mustAuthenticate)
            return self.startAuthenticating(response.authenticatorName, startupCallback);
          startupCallback(err);
        });
        function startupCallback(err) {
          return err ? self.errorConnecting(err, !1, callback) : self.connectionReady(callback);
        }
      }
      errorConnecting(err, destroy, callback) {
        this.log("warning", `There was an error when trying to connect to the host ${this.endpointFriendlyName}`, err), destroy && this.netClient.destroy(), this._metrics.onConnectionError(err), callback(err);
      }
      /**
       * Sets the connection to ready/connected status
       */
      connectionReady(callback) {
        this.emit("connected"), this.connected = !0, this.netClient.removeAllListeners("error"), this.netClient.on("error", this.handleSocketError.bind(this)), callback();
      }
      /** @param {Number} lowerVersion */
      decreaseVersion(lowerVersion) {
        this.protocolVersion = lowerVersion, this.encoder.setProtocolVersion(lowerVersion), this._streamIds.setVersion(lowerVersion);
      }
      /**
       * Handle socket errors, if the socket is not readable invoke all pending callbacks
       */
      handleSocketError(err) {
        this._metrics.onConnectionError(err), this.clearAndInvokePending(err);
      }
      /**
       * Cleans all internal state and invokes all pending callbacks of sent streams
       */
      clearAndInvokePending(innerError) {
        this._idleTimeout && (clearTimeout(this._idleTimeout), this._idleTimeout = null), this._streamIds.clear(), this.emitDrain && this.emit("drain");
        let err = new types.DriverError("Socket was closed");
        err.isSocketError = !0, innerError && (err.innerError = innerError);
        let operations = Array.from(this._operations.values());
        this._operations = /* @__PURE__ */ new Map(), operations.length > 0 && this.log("info", "Invoking " + operations.length + " pending callbacks"), utils.each(operations, function(operation, next) {
          operation.setResult(err), next();
        });
        let pendingWritesCopy = this._pendingWrites;
        this._pendingWrites = [], utils.each(pendingWritesCopy, function(operation, next) {
          operation.setResult(err), next();
        });
      }
      /**
       * Starts the SASL flow
       * @param {String} authenticatorName
       * @param {Function} callback
       */
      startAuthenticating(authenticatorName, callback) {
        if (!this.options.authProvider)
          return callback(new errors.AuthenticationError("Authentication provider not set"));
        let authenticator = this.options.authProvider.newAuthenticator(this.endpoint, authenticatorName), self = this;
        authenticator.initialResponse(function(err, token) {
          if (err)
            return self.onAuthenticationError(callback, err);
          self.authenticate(authenticator, token, callback);
        });
      }
      /**
       * Handles authentication requests and responses.
       * @param {Authenticator} authenticator
       * @param {Buffer} token
       * @param {Function} callback
       */
      authenticate(authenticator, token, callback) {
        let self = this, request = new requests.AuthResponseRequest(token);
        if (this.protocolVersion === 1) {
          if (!authenticator.username)
            return self.onAuthenticationError(
              callback,
              new errors.AuthenticationError("Only plain text authenticator providers allowed under protocol v1")
            );
          request = new requests.CredentialsRequest(authenticator.username, authenticator.password);
        }
        this.sendStream(request, null, function(err, result) {
          if (err) {
            if (err instanceof errors.ResponseError && err.code === types.responseErrorCodes.badCredentials) {
              let authError = new errors.AuthenticationError(err.message);
              authError.additionalInfo = err, err = authError;
            }
            return self.onAuthenticationError(callback, err);
          }
          if (result.ready)
            return authenticator.onAuthenticationSuccess(), callback();
          if (result.authChallenge)
            return authenticator.evaluateChallenge(result.token, function(err2, t) {
              if (err2)
                return self.onAuthenticationError(callback, err2);
              self.authenticate(authenticator, t, callback);
            });
          callback(new errors.DriverInternalError("Unexpected response from Cassandra: " + util.inspect(result)));
        });
      }
      onAuthenticationError(callback, err) {
        this._metrics.onAuthenticationError(err), callback(err);
      }
      /**
       * Executes a 'USE ' query, if keyspace is provided and it is different from the current keyspace
       * @param {?String} keyspace
       */
      async changeKeyspace(keyspace) {
        if (!keyspace || this.keyspace === keyspace)
          return;
        if (this.toBeKeyspace === keyspace)
          return promiseUtils.fromEvent(this, "keyspaceChanged");
        this.toBeKeyspace = keyspace;
        let query = `USE "${keyspace}"`;
        try {
          await this.send(new requests.QueryRequest(query, null, null), null), this.keyspace = keyspace, this.emit("keyspaceChanged", null, keyspace);
        } catch (err) {
          throw this.log("error", `Connection to ${this.endpointFriendlyName} could not switch active keyspace: ${err}`, err), this.emit("keyspaceChanged", err), err;
        } finally {
          this.toBeKeyspace = null;
        }
      }
      /**
       * Prepares a query on a given connection. If its already being prepared, it queues the callback.
       * @param {String} query
       * @param {String} keyspace
       * @param {function} callback
       */
      prepareOnce(query, keyspace, callback) {
        let name = (keyspace || "") + query, info = this._preparing.get(name);
        if (info)
          return info.once("prepared", callback);
        info = new events.EventEmitter(), info.setMaxListeners(0), info.once("prepared", callback), this._preparing.set(name, info), this.sendStream(new requests.PrepareRequest(query, keyspace), null, (err, response) => {
          info.emit("prepared", err, response), this._preparing.delete(name);
        });
      }
      /**
       * Queues the operation to be written to the wire and invokes the callback once the response was obtained or with an
       * error (socket error or OperationTimedOutError or serialization-related error).
       * @param {Request} request
       * @param {ExecutionOptions|null} execOptions
       * @param {function} callback Function to be called once the response has been received
       * @return {OperationState}
       */
      sendStream(request, execOptions, callback) {
        execOptions = execOptions || ExecutionOptions.empty();
        let operation = new OperationState(request, execOptions.getRowCallback(), (err, response, length) => {
          (!err || !err.isSocketError) && this.emit("responseDequeued"), callback(err, response, length);
        }), streamId = this._getStreamId();
        return operation.setRequestTimeout(
          execOptions,
          this.options.socketOptions.readTimeout,
          this.endpoint,
          () => this.timedOutOperations++,
          () => this.timedOutOperations--
        ), streamId === null ? (this.log(
          "info",
          "Enqueuing " + this._pendingWrites.length + ", if this message is recurrent consider configuring more connections per host or lowering the pressure"
        ), this._pendingWrites.push(operation), operation) : (this._write(operation, streamId), operation);
      }
      /**
       * Pushes the item into the queue.
       * @param {OperationState} operation
       * @param {Number} streamId
       * @private
       */
      _write(operation, streamId) {
        operation.streamId = streamId;
        let self = this;
        this.writeQueue.push(operation, function(err) {
          if (err)
            return self._streamIds.push(streamId), operation.setResult(err);
          self.log("verbose", "Sent stream #" + streamId + " to " + self.endpointFriendlyName), operation.isByRow() && self.parser.setOptions(streamId, { byRow: !0 }), self._setIdleTimeout(), self._operations.set(streamId, operation);
        });
      }
      _setIdleTimeout() {
        if (!this.options.pooling.heartBeatInterval)
          return;
        let self = this, previousTimeout = this._idleTimeout;
        self._idleTimeout = setTimeout(() => self._idleTimeoutHandler(), self.options.pooling.heartBeatInterval), previousTimeout && clearTimeout(previousTimeout);
      }
      /**
       * Function that gets executed once the idle timeout has passed to issue a request to keep the connection alive
       */
      _idleTimeoutHandler() {
        if (this.sendingIdleQuery) {
          this._idleTimeout = setTimeout(() => this._idleTimeoutHandler(), this.options.pooling.heartBeatInterval);
          return;
        }
        this.log("verbose", `Connection to ${this.endpointFriendlyName} idling, issuing a request to prevent disconnects`), this.sendingIdleQuery = !0, this.sendStream(requests.options, null, (err) => {
          this.sendingIdleQuery = !1, err && (this.log("warning", "Received heartbeat request error", err), this.emit("idleRequestError", err, this));
        });
      }
      /**
       * Returns an available streamId or null if there isn't any available
       * @returns {Number}
       */
      _getStreamId() {
        return this._streamIds.pop();
      }
      freeStreamId(header) {
        let streamId = header.streamId;
        streamId < 0 || (this._operations.delete(streamId), this._streamIds.push(streamId), this.emitDrain && this._streamIds.inUse === 0 && this._pendingWrites.length === 0 && this.emit("drain"), this._writeNext());
      }
      _writeNext() {
        if (this._pendingWrites.length === 0)
          return;
        let streamId = this._getStreamId();
        if (streamId === null)
          return;
        let self = this, operation;
        for (; (operation = this._pendingWrites.shift()) && !operation.canBeWritten(); )
          ;
        if (!operation) {
          this._streamIds.push(streamId);
          return;
        }
        setImmediate(function() {
          self._write(operation, streamId);
        });
      }
      /**
       * Returns the number of requests waiting for response
       * @returns {Number}
       */
      getInFlight() {
        return this._streamIds.inUse;
      }
      /**
       * Handles a result and error response
       */
      handleResult(header, err, result) {
        let streamId = header.streamId;
        if (streamId < 0)
          return this.log("verbose", "event received", header);
        let operation = this._operations.get(streamId);
        if (!operation)
          return this.log("error", "The server replied with a wrong streamId #" + streamId);
        this.log("verbose", "Received frame #" + streamId + " from " + this.endpointFriendlyName), operation.setResult(err, result, header.bodyLength);
      }
      handleNodeEvent(header, event) {
        switch (event.eventType) {
          case types.protocolEvents.schemaChange:
            this.emit("nodeSchemaChange", event);
            break;
          case types.protocolEvents.topologyChange:
            this.emit("nodeTopologyChange", event);
            break;
          case types.protocolEvents.statusChange:
            this.emit("nodeStatusChange", event);
            break;
        }
      }
      /**
       * Handles a row response
       */
      handleRow(header, row, meta, rowLength, flags) {
        let streamId = header.streamId;
        if (streamId < 0)
          return this.log("verbose", "Event received", header);
        let operation = this._operations.get(streamId);
        if (!operation)
          return this.log("error", "The server replied with a wrong streamId #" + streamId);
        operation.setResultRow(row, meta, rowLength, flags, header);
      }
      /**
       * Closes the socket (if not already closed) and cancels all in-flight requests.
       * Multiple calls to this method have no additional side-effects.
       * @param {Function} [callback]
       */
      close(callback) {
        if (callback = callback || utils.noop, !this.connected && !this.isSocketOpen || (this.connected = !1, this.removeAllListeners("drain"), this.clearAndInvokePending(), !this.isSocketOpen))
          return callback();
        this.isSocketOpen = !1, this.log("verbose", `Closing connection to ${this.endpointFriendlyName}`);
        let self = this, endTimeout = setTimeout(() => {
          this.log("info", `${this.endpointFriendlyName} did not respond to connection close within ${this.options.socketOptions.connectTimeout}ms, destroying connection`), this.netClient.destroy();
        }, this.options.socketOptions.connectTimeout);
        this.netClient.once("close", function(hadError) {
          clearTimeout(endTimeout), hadError && self.log("info", "The socket closed with a transmission error"), setImmediate(callback);
        }), this.netClient.removeAllListeners("error"), this.netClient.on("error", (err) => this.clearAndInvokePending(err)), this.netClient.end();
      }
      /**
       * Gets the local IP address to which this connection socket is bound to.
       * @returns {String|undefined}
       */
      getLocalAddress() {
        if (this.netClient)
          return this.netClient.localAddress;
      }
    };
    module2.exports = Connection;
  }
});

// node_modules/cassandra-driver/lib/host-connection-pool.js
var require_host_connection_pool = __commonJS({
  "node_modules/cassandra-driver/lib/host-connection-pool.js"(exports2, module2) {
    "use strict";
    var util = require("util"), events = require("events"), Connection = require_connection(), utils = require_utils(), promiseUtils = require_promise_utils(), errors = require_errors(), clientOptions = require_client_options(), connectionIndex = 0, connectionIndexOverflow = Math.pow(2, 15), defaultOptions, state = {
      // Initial state: open / opening / ready to be opened
      initial: 0,
      // When the pool is being closed as part of a distance change
      closing: 1,
      // When the pool is being shutdown for good
      shuttingDown: 2,
      // When the pool has being shutdown
      shutDown: 4
    }, HostConnectionPool = class _HostConnectionPool extends events.EventEmitter {
      /**
       * Creates a new instance of HostConnectionPool.
       * @param {Host} host
       * @param {Number} protocolVersion Initial protocol version
       * @extends EventEmitter
       */
      constructor(host, protocolVersion) {
        super(), this._address = host.address, this._newConnectionTimeout = null, this._state = state.initial, this._opening = !1, this._host = host, this.responseCounter = 0, this.options = host.options, this.protocolVersion = protocolVersion, this.coreConnectionsLength = 1, this.connections = utils.emptyArray, this.setMaxListeners(0), this.log = utils.log;
      }
      getInFlight() {
        let length = this.connections.length;
        if (length === 1)
          return this.connections[0].getInFlight();
        let sum = 0;
        for (let i = 0; i < length; i++)
          sum += this.connections[i].getInFlight();
        return sum;
      }
      /**
       * Gets the least busy connection from the pool.
       * @param {Connection} [previousConnection] When provided, the pool should attempt to obtain a different connection.
       * @returns {Connection!}
       * @throws {Error}
       * @throws {BusyConnectionError}
       */
      borrowConnection(previousConnection) {
        if (this.connections.length === 0)
          throw new Error("No connection available");
        let maxRequests = this.options.pooling.maxRequestsPerConnection, c = _HostConnectionPool.minInFlight(this.connections, maxRequests, previousConnection);
        if (c.getInFlight() >= maxRequests)
          throw new errors.BusyConnectionError(this._address, maxRequests, this.connections.length);
        return c;
      }
      /**
       * Gets the connection with the minimum number of in-flight requests.
       * Only checks for 2 connections (round-robin) and gets the one with minimum in-flight requests, as long as
       * the amount of in-flight requests is lower than maxRequests.
       * @param {Array.<Connection>} connections
       * @param {Number} maxRequests
       * @param {Connection} previousConnection When provided, it will attempt to obtain a different connection.
       * @returns {Connection!}
       */
      static minInFlight(connections, maxRequests, previousConnection) {
        let length = connections.length;
        if (length === 1)
          return connections[0];
        connectionIndex++, connectionIndex >= connectionIndexOverflow && (connectionIndex = 0);
        let current;
        for (let index = connectionIndex; index < connectionIndex + length; index++) {
          current = connections[index % length], current === previousConnection && (current = connections[++index % length]);
          let next = connections[(index + 1) % length];
          if (next === previousConnection && (next = connections[(index + 2) % length]), next.getInFlight() < current.getInFlight() && (current = next), current.getInFlight() < maxRequests)
            break;
        }
        return current;
      }
      /**
       * Creates all the connections in the pool and switches the keyspace of each connection if needed.
       * @param {string} keyspace
       */
      async warmup(keyspace) {
        if (this.connections.length < this.coreConnectionsLength) {
          for (; this.connections.length < this.coreConnectionsLength; )
            await this._attemptNewConnection();
          this.log(
            "info",
            `Connection pool to host ${this._address} created with ${this.connections.length} connection(s)`
          );
        } else
          this.log("info", `Connection pool to host ${this._address} contains ${this.connections.length} connection(s)`);
        if (keyspace)
          try {
            for (let connection of this.connections)
              await connection.changeKeyspace(keyspace);
          } catch {
            this.log("warning", `Connection(s) to host ${this._address} could not be switched to keyspace ${keyspace}`);
          }
      }
      /** @returns {Connection} */
      _createConnection() {
        let endpointOrServerName = this.options.sni ? this._host.hostId.toString() : this._address, c = new Connection(endpointOrServerName, this.protocolVersion, this.options);
        return this._addListeners(c), c;
      }
      /** @param {Connection} c */
      _addListeners(c) {
        c.on("responseDequeued", () => this.responseCounter++);
        let self = this;
        function connectionErrorCallback() {
          self.remove(c);
        }
        c.on("idleRequestError", connectionErrorCallback), c.on("socketClose", connectionErrorCallback);
      }
      addExistingConnection(c) {
        this._addListeners(c), this.connections = this.connections.slice(0), this.connections.push(c);
      }
      /**
       * Prevents reconnection timeout from triggering
       */
      clearNewConnectionAttempt() {
        this._newConnectionTimeout && (clearTimeout(this._newConnectionTimeout), this._newConnectionTimeout = null);
      }
      /**
       * Tries to open a new connection.
       * If a connection is being opened, it will resolve when the existing open task completes.
       * @returns {Promise<void>}
       */
      async _attemptNewConnection() {
        if (this._opening)
          return await promiseUtils.fromEvent(this, "open");
        this._opening = !0;
        let c = this._createConnection(), err;
        try {
          await c.openAsync();
        } catch (e) {
          err = e, this.log("warning", `Connection to ${this._address} could not be created: ${err}`, err);
        }
        if (this.isClosing() && (this.log("info", `Connection to ${this._address} opened successfully but pool was being closed`), err = new Error("Connection closed")), err)
          promiseUtils.toBackground(c.closeAsync());
        else {
          let newConnections = this.connections.slice(0);
          newConnections.push(c), this.connections = newConnections, this.log("info", `Connection to ${this._address} opened successfully`);
        }
        if (this._opening = !1, this.emit("open", err, c), err)
          throw err;
      }
      attemptNewConnectionImmediate() {
        let self = this;
        function openConnection() {
          self.clearNewConnectionAttempt(), self.scheduleNewConnectionAttempt(0);
        }
        if (this._state === state.initial)
          return openConnection();
        if (this._state === state.closing)
          return this.once("close", openConnection);
      }
      /**
       * Closes the connection and removes a connection from the pool.
       * @param {Connection} connection
       */
      remove(connection) {
        let index = this.connections.indexOf(connection);
        if (index < 0)
          return;
        let newConnections = this.connections.slice(0);
        newConnections.splice(index, 1), this.connections = newConnections, setImmediate(function() {
          connection.close();
        }), this.emit("remove");
      }
      /**
       * @param {Number} delay
       */
      scheduleNewConnectionAttempt(delay) {
        if (this.isClosing())
          return;
        let self = this;
        this._newConnectionTimeout = setTimeout(function() {
          if (self._newConnectionTimeout = null, !(self.connections.length >= self.coreConnectionsLength)) {
            if (delay > 0 && self.options.sni) {
              promiseUtils.toBackground(self.options.sni.addressResolver.refresh().then(() => self._attemptNewConnection()));
              return;
            }
            promiseUtils.toBackground(self._attemptNewConnection());
          }
        }, delay);
      }
      hasScheduledNewConnection() {
        return !!this._newConnectionTimeout || this._opening;
      }
      /**
       * Increases the size of the connection pool in the background, if needed.
       */
      increaseSize() {
        this.connections.length < this.coreConnectionsLength && !this.hasScheduledNewConnection() && this.scheduleNewConnectionAttempt(0);
      }
      /**
       * Gets the amount of responses and resets the internal counter.
       * @returns {number}
       */
      getAndResetResponseCounter() {
        let temp = this.responseCounter;
        return this.responseCounter = 0, temp;
      }
      /**
       * Gets a boolean indicating if the pool is being closed / shutting down or has been shutdown.
       */
      isClosing() {
        return this._state !== state.initial;
      }
      /**
       * Gracefully waits for all in-flight requests to finish and closes the pool.
       */
      drainAndShutdown() {
        if (this.isClosing())
          return;
        if (this._state = state.closing, this.clearNewConnectionAttempt(), this.connections.length === 0)
          return this._afterClosing();
        let self = this, connections = this.connections;
        this.connections = utils.emptyArray;
        let closedConnections = 0;
        this.log("info", util.format("Draining and closing %d connections to %s", connections.length, this._address));
        let wasClosed = !1, checkShutdownTimeout;
        for (let i = 0; i < connections.length; i++) {
          let c = connections[i];
          if (c.getInFlight() === 0) {
            getDelayedClose(c)();
            continue;
          }
          c.emitDrain = !0, c.once("drain", getDelayedClose(c));
        }
        function getDelayedClose(connection) {
          return function() {
            connection.close(), !(++closedConnections < connections.length) && (wasClosed || (wasClosed = !0, checkShutdownTimeout && clearTimeout(checkShutdownTimeout), self._afterClosing()));
          };
        }
        let delay = (this.options.socketOptions.readTimeout || getDefaultOptions().socketOptions.readTimeout) + 100;
        checkShutdownTimeout = setTimeout(function() {
          wasClosed = !0, connections.forEach(function(c) {
            c.close();
          }), self._afterClosing();
        }, delay);
      }
      _afterClosing() {
        let self = this;
        function resetState() {
          self._state === state.shuttingDown ? self._state = state.shutDown : self._state = state.initial, self.emit("close"), self._state === state.shutDown && self.emit("shutdown");
        }
        if (this._opening)
          return this.once("open", resetState);
        resetState();
      }
      /**
       * @returns {Promise<void>}
       */
      async shutdown() {
        if (this.clearNewConnectionAttempt(), !this.connections.length) {
          this._state = state.shutDown;
          return;
        }
        let previousState = this._state;
        if (this._state = state.shuttingDown, previousState === state.closing || previousState === state.shuttingDown)
          return promiseUtils.fromEvent(this, "shutdown");
        await this._closeAllConnections(), this._state = state.shutDown, this.emit("shutdown");
      }
      async _closeAllConnections() {
        let connections = this.connections;
        this.connections = utils.emptyArray, connections.length !== 0 && (this.log("info", util.format("Closing %d connections to %s", connections.length, this._address)), await Promise.all(connections.map((c) => c.closeAsync())));
      }
    };
    function getDefaultOptions() {
      return defaultOptions === void 0 && (defaultOptions = clientOptions.defaultOptions()), defaultOptions;
    }
    module2.exports = HostConnectionPool;
  }
});

// node_modules/cassandra-driver/lib/prepare-handler.js
var require_prepare_handler = __commonJS({
  "node_modules/cassandra-driver/lib/prepare-handler.js"(exports2, module2) {
    "use strict";
    var errors = require_errors(), utils = require_utils(), types = require_types(), promiseUtils = require_promise_utils(), PrepareHandler = class _PrepareHandler {
      /**
       * Creates a new instance of PrepareHandler
       * @param {Client} client
       * @param {LoadBalancingPolicy} loadBalancing
       */
      constructor(client, loadBalancing) {
        this._client = client, this._loadBalancing = loadBalancing, this.logEmitter = client.options.logEmitter, this.log = utils.log;
      }
      /**
       * Gets the query id and metadata for a prepared statement, preparing it on
       * single host or on all hosts depending on the options.
       * @param {Client} client
       * @param {LoadBalancingPolicy} loadBalancing
       * @param {String} query
       * @param {String} keyspace
       * @returns {Promise<{queryId, meta}>}
       * @static
       */
      static async getPrepared(client, loadBalancing, query, keyspace) {
        let info = client.metadata.getPreparedInfo(keyspace, query);
        return info.queryId ? info : info.preparing ? await promiseUtils.fromEvent(info, "prepared") : await new _PrepareHandler(client, loadBalancing)._prepare(info, query, keyspace);
      }
      /**
       * @param {Client} client
       * @param {LoadBalancingPolicy} loadBalancing
       * @param {Array} queries
       * @param {String} keyspace
       * @static
       */
      static async getPreparedMultiple(client, loadBalancing, queries, keyspace) {
        let result = [];
        for (let item of queries) {
          let query;
          if (item && (query = typeof item == "string" ? item : item.query), typeof query != "string")
            throw new errors.ArgumentError("Query item should be a string");
          let { queryId, meta } = await _PrepareHandler.getPrepared(client, loadBalancing, query, keyspace);
          result.push({ query, params: utils.adaptNamedParamsPrepared(item.params, meta.columns), queryId, meta });
        }
        return result;
      }
      /**
       * Prepares the query on a single host or on all hosts depending on the options.
       * Uses the info 'prepared' event to emit the result.
       * @param {Object} info
       * @param {String} query
       * @param {String} keyspace
       * @returns {Promise<{queryId, meta}>}
       */
      async _prepare(info, query, keyspace) {
        info.preparing = !0;
        let iterator;
        try {
          return iterator = await promiseUtils.newQueryPlan(this._loadBalancing, keyspace, null), await this._prepareWithQueryPlan(info, iterator, query, keyspace);
        } catch (err) {
          throw info.preparing = !1, err.query = query, info.emit("prepared", err), err;
        }
      }
      /**
       * Uses the query plan to prepare the query on the first host and optionally on the rest of the hosts.
       * @param {Object} info
       * @param {Iterator} iterator
       * @param {String} query
       * @param {String} keyspace
       * @returns {Promise<{queryId, meta}>}
       * @private
       */
      async _prepareWithQueryPlan(info, iterator, query, keyspace) {
        let triedHosts = {};
        for (; ; ) {
          let host = _PrepareHandler.getNextHost(iterator, this._client.profileManager, triedHosts);
          if (host === null)
            throw new errors.NoHostAvailableError(triedHosts);
          try {
            let response = await (await _PrepareHandler._borrowWithKeyspace(host, keyspace)).prepareOnceAsync(query, keyspace);
            return this._client.options.prepareOnAllHosts && await this._prepareOnAllHosts(iterator, query, keyspace), info.preparing = !1, info.queryId = response.id, info.meta = response.meta, this._client.metadata.setPreparedById(info), info.emit("prepared", null, info), info;
          } catch (err) {
            if (triedHosts[host.address] = err, !err.isSocketError && !(err instanceof errors.OperationTimedOutError))
              throw err;
          }
        }
      }
      /**
       * Gets the next host from the query plan.
       * @param {Iterator} iterator
       * @param {ProfileManager} profileManager
       * @param {Object} [triedHosts]
       * @return {Host|null}
       */
      static getNextHost(iterator, profileManager, triedHosts) {
        let host;
        for (; ; ) {
          let item = iterator.next();
          if (item.done)
            return null;
          if (host = item.value, profileManager.getDistance(host) !== types.distance.ignored) {
            if (host.isUp())
              break;
            triedHosts && (triedHosts[host.address] = "Host considered as DOWN");
          }
        }
        return host;
      }
      /**
       * Prepares all queries on a single host.
       * @param {Host} host
       * @param {Array} allPrepared
       */
      static async prepareAllQueries(host, allPrepared) {
        let anyKeyspaceQueries = [], queriesByKeyspace = /* @__PURE__ */ new Map();
        allPrepared.forEach((info) => {
          let arr;
          info.keyspace ? (arr = queriesByKeyspace.get(info.keyspace), arr || (arr = [], queriesByKeyspace.set(info.keyspace, arr))) : arr = anyKeyspaceQueries, arr.push(info.query);
        });
        for (let [keyspace, queries] of queriesByKeyspace)
          await _PrepareHandler._borrowAndPrepare(host, keyspace, queries);
        await _PrepareHandler._borrowAndPrepare(host, null, anyKeyspaceQueries);
      }
      /**
       * Borrows a connection from the host and prepares the queries provided.
       * @param {Host} host
       * @param {String} keyspace
       * @param {Array} queries
       * @returns {Promise<void>}
       * @private
       */
      static async _borrowAndPrepare(host, keyspace, queries) {
        if (queries.length === 0)
          return;
        let connection = await _PrepareHandler._borrowWithKeyspace(host, keyspace);
        for (let query of queries)
          await connection.prepareOnceAsync(query, keyspace);
      }
      /**
       * Borrows a connection and changes the active keyspace on the connection, if needed.
       * It does not perform any retry or error handling.
       * @param {Host!} host
       * @param {string} keyspace
       * @returns {Promise<Connection>}
       * @throws {errors.BusyConnectionError} When the connection is busy.
       * @throws {errors.ResponseError} For invalid keyspaces.
       * @throws {Error} For socket errors.
       * @private
       */
      static async _borrowWithKeyspace(host, keyspace) {
        let connection = host.borrowConnection();
        return keyspace && connection.keyspace !== keyspace && await connection.changeKeyspace(keyspace), connection;
      }
      /**
       * Prepares the provided query on all hosts, except the host provided.
       * @param {Iterator} iterator
       * @param {String} query
       * @param {String} keyspace
       * @private
       */
      _prepareOnAllHosts(iterator, query, keyspace) {
        let queries = [query], h, hosts = [];
        for (; (h = _PrepareHandler.getNextHost(iterator, this._client.profileManager)) !== null; )
          hosts.push(h);
        return Promise.all(hosts.map((h2) => _PrepareHandler._borrowAndPrepare(h2, keyspace, queries).catch((err) => this.log("verbose", `Unexpected error while preparing query (${query}) on ${h2.address}`, err))));
      }
    };
    module2.exports = PrepareHandler;
  }
});

// node_modules/cassandra-driver/lib/host.js
var require_host = __commonJS({
  "node_modules/cassandra-driver/lib/host.js"(exports2, module2) {
    "use strict";
    var events = require("events"), utils = require_utils(), types = require_types(), HostConnectionPool = require_host_connection_pool(), PrepareHandler = require_prepare_handler(), promiseUtils = require_promise_utils(), healthResponseCountInterval = 200, Host = class extends events.EventEmitter {
      /**
       * Creates a new Host instance.
       */
      constructor(address, protocolVersion, options, metadata) {
        super(), this.address = address, this.setDownAt = 0, this.log = utils.log, this.isUpSince = null, Object.defineProperty(this, "options", { value: options, enumerable: !1, writable: !1 }), Object.defineProperty(this, "pool", { value: new HostConnectionPool(this, protocolVersion), enumerable: !1 }), this.pool.on("open", (err) => promiseUtils.toBackground(this._onNewConnectionOpen(err))), this.pool.on("remove", () => this._checkPoolState()), this.cassandraVersion = null, this.datacenter = null, this.rack = null, this.tokens = null, this.hostId = null, this.dseVersion = null, this.workloads = utils.emptyArray, this._distance = types.distance.ignored, this._healthResponseCounter = 0, Object.defineProperty(this, "_metadata", { value: metadata, enumerable: !1 }), Object.defineProperty(this, "_healthResponseCountTimer", { value: null, enumerable: !1, writable: !0 }), this.reconnectionSchedule = this.options.policies.reconnection.newSchedule(), this.reconnectionDelay = 0;
      }
      /**
       * Marks this host as not available for query coordination, when the host was previously marked as UP, otherwise its
       * a no-op.
       * @internal
       * @ignore
       */
      setDown() {
        this.setDownAt === 0 && (this.pool.isClosing() || (this.setDownAt = Date.now(), this.pool.coreConnectionsLength > 0 ? this.log("warning", `Host ${this.address} considered as DOWN. Reconnection delay ${this.reconnectionDelay}ms.`) : this.log("info", `Host ${this.address} considered as DOWN.`), this.emit("down"), this._checkPoolState()));
      }
      /**
       * Marks this host as available for querying.
       * @param {Boolean} [clearReconnection]
       * @internal
       * @ignore
       */
      setUp(clearReconnection) {
        this.setDownAt && (this.log("info", `Setting host ${this.address} as UP`), this.setDownAt = 0, this.isUpSince = Date.now(), this.reconnectionSchedule = this.options.policies.reconnection.newSchedule(), clearReconnection && this.pool.clearNewConnectionAttempt(), this.emit("up"));
      }
      /**
       * Resets the reconnectionSchedule and tries to issue a reconnection immediately.
       * @internal
       * @ignore
       */
      checkIsUp() {
        this.isUp() || (this.reconnectionSchedule = this.options.policies.reconnection.newSchedule(), this.reconnectionDelay = 0, this.pool.attemptNewConnectionImmediate());
      }
      /**
       * @param {Boolean} [waitForPending] When true, it waits for in-flight operations to be finish before closing the
       * connections.
       * @returns {Promise<void>}
       * @internal
       * @ignore
       */
      shutdown(waitForPending) {
        return this._healthResponseCountTimer && clearInterval(this._healthResponseCountTimer), waitForPending ? (this.pool.drainAndShutdown(), Promise.resolve()) : this.pool.shutdown();
      }
      /**
       * Determines if the node is UP now (seen as UP by the driver).
       * @returns {boolean}
       */
      isUp() {
        return !this.setDownAt;
      }
      /**
       * Determines if the host can be considered as UP.
       * Deprecated: Use {@link Host#isUp()} instead.
       * @returns {boolean}
       */
      canBeConsideredAsUp() {
        let self = this;
        function hasTimePassed() {
          return (/* @__PURE__ */ new Date()).getTime() - self.setDownAt >= self.reconnectionDelay;
        }
        return !this.setDownAt || hasTimePassed();
      }
      /**
       * Sets the distance of the host relative to the client using the load balancing policy.
       * @param {Number} distance
       * @internal
       * @ignore
       */
      setDistance(distance) {
        let previousDistance = this._distance;
        return this._distance = distance || types.distance.local, this.options.pooling.coreConnectionsPerHost ? this.pool.coreConnectionsLength = this.options.pooling.coreConnectionsPerHost[this._distance] || 0 : this.pool.coreConnectionsLength = 1, this._distance === previousDistance ? this._distance : (this._healthResponseCountTimer && clearInterval(this._healthResponseCountTimer), this._distance === types.distance.ignored ? (this.emit("ignore"), this.pool.drainAndShutdown()) : (this.isUp() || this.checkIsUp(), this._healthResponseCountTimer = setInterval(() => {
          this._healthResponseCounter = this.pool.getAndResetResponseCounter();
        }, healthResponseCountInterval)), this._distance);
      }
      /**
       * Changes the protocol version of a given host
       * @param {Number} value
       * @internal
       * @ignore
       */
      setProtocolVersion(value) {
        this.pool.protocolVersion = value;
      }
      /**
       * Gets the least busy connection from the pool.
       * @param {Connection} [previousConnection] When provided, the pool should attempt to obtain a different connection.
       * @returns {Connection!}
       * @throws {Error}
       * @throws {BusyConnectionError}
       * @internal
       * @ignore
       */
      borrowConnection(previousConnection) {
        return this.pool.borrowConnection(previousConnection);
      }
      /**
       * Creates all the connection in the pool.
       * @param {string} keyspace
       * @internal
       * @ignore
       */
      warmupPool(keyspace) {
        return this.pool.warmup(keyspace);
      }
      /**
       * Starts creating the pool in the background.
       * @internal
       * @ignore
       */
      initializePool() {
        this.pool.increaseSize();
      }
      /**
       * Gets any connection that is already opened or null if not found.
       * @returns {Connection}
       * @internal
       * @ignore
       */
      getActiveConnection() {
        return !this.isUp() || !this.pool.connections.length ? null : this.pool.connections[0];
      }
      /**
       * Internal method to get the amount of responses dequeued in the last interval (between 200ms and 400ms) on all
       * connections to the host.
       * @returns {Number}
       * @internal
       * @ignore
       */
      getResponseCount() {
        return this._healthResponseCounter + this.pool.responseCounter;
      }
      /**
       * Checks the health of a connection in the pool
       * @param {Connection} connection
       * @internal
       * @ignore
       */
      checkHealth(connection) {
        connection.timedOutOperations <= this.options.socketOptions.defunctReadTimeoutThreshold || this.removeFromPool(connection);
      }
      /**
       * @param {Connection} connection
       * @internal
       * @ignore
       */
      removeFromPool(connection) {
        this.pool.remove(connection), this._checkPoolState();
      }
      /**
       * Internal method that gets the amount of in-flight requests on all connections to the host.
       * @internal
       * @ignore
       */
      getInFlight() {
        return this.pool.getInFlight();
      }
      /**
       * Validates that the internal state of the connection pool.
       * If the pool size is smaller than expected, schedule a new connection attempt.
       * If the amount of connections is 0 for not ignored hosts, the host must be down.
       * @private
       */
      _checkPoolState() {
        if (this.pool.isClosing())
          return;
        this.pool.connections.length < this.pool.coreConnectionsLength && (this.pool.hasScheduledNewConnection() || (this.reconnectionDelay = this.reconnectionSchedule.next().value, this.pool.scheduleNewConnectionAttempt(this.reconnectionDelay))), this._distance !== types.distance.ignored && this.pool.coreConnectionsLength > 0 && this.pool.connections.length === 0 && this.setDown();
      }
      /**
       * Executed after an scheduled new connection attempt finished
       * @private
       */
      async _onNewConnectionOpen(err) {
        if (err) {
          this._checkPoolState();
          return;
        }
        if (!this.isUp() && this.options.rePrepareOnUp) {
          this.log("info", `Re-preparing all queries on host ${this.address} before setting it as UP`);
          let allPrepared = this._metadata.getAllPrepared();
          try {
            await PrepareHandler.prepareAllQueries(this, allPrepared);
          } catch (err2) {
            this.log("warning", `Failed re-preparing on host ${this.address}: ${err2}`, err2);
          }
        }
        this.setUp(), this.pool.increaseSize();
      }
      /**
       * Returns an array containing the Cassandra Version as an Array of Numbers having the major version in the first
       * position.
       * @returns {Array.<Number>}
       */
      getCassandraVersion() {
        return this.cassandraVersion ? this.cassandraVersion.split("-")[0].split(".").map((x) => parseInt(x, 10)) : utils.emptyArray;
      }
      /**
       * Gets the DSE version of the host as an Array, containing the major version in the first position.
       * In case the cluster is not a DSE cluster, it returns an empty Array.
       * @returns {Array}
       */
      getDseVersion() {
        return this.dseVersion ? this.dseVersion.split("-")[0].split(".").map((x) => parseInt(x, 10)) : utils.emptyArray;
      }
    }, HostMap = class extends events.EventEmitter {
      constructor() {
        super(), this._items = /* @__PURE__ */ new Map(), this._values = null, Object.defineProperty(this, "length", { get: () => this.values().length, enumerable: !0 });
      }
      /**
       * Executes a provided function once per map element.
       * @param callback
       */
      forEach(callback) {
        let items = this._items;
        for (let [key, value] of items)
          callback(value, key);
      }
      /**
       * Gets a {@link Host host} by key or undefined if not found.
       * @param {String} key
       * @returns {Host}
       */
      get(key) {
        return this._items.get(key);
      }
      /**
       * Returns an array of host addresses.
       * @returns {Array.<String>}
       */
      keys() {
        return Array.from(this._items.keys());
      }
      /**
       * Removes an item from the map.
       * @param {String} key The key of the host
       * @fires HostMap#remove
       */
      remove(key) {
        let value = this._items.get(key);
        if (value === void 0)
          return;
        this._values = null;
        let copy = new Map(this._items);
        copy.delete(key), this._items = copy, this.emit("remove", value);
      }
      /**
       * Removes multiple hosts from the map.
       * @param {Array.<String>} keys
       * @fires HostMap#remove
       */
      removeMultiple(keys) {
        this._values = null;
        let copy = new Map(this._items), removedHosts = [];
        for (let key of keys) {
          let h = copy.get(key);
          h && (removedHosts.push(h), copy.delete(key));
        }
        this._items = copy, removedHosts.forEach((h) => this.emit("remove", h));
      }
      /**
       * Adds a new item to the map.
       * @param {String} key The key of the host
       * @param {Host} value The host to be added
       * @fires HostMap#remove
       * @fires HostMap#add
       */
      set(key, value) {
        this._values = null;
        let originalValue = this._items.get(key);
        if (originalValue) {
          this._items.set(key, value), this.emit("remove", originalValue), this.emit("add", value);
          return;
        }
        let copy = new Map(this._items);
        return copy.set(key, value), this._items = copy, this.emit("add", value), value;
      }
      /**
       * Returns a shallow copy of a portion of the items into a new array object.
       * Backward-compatibility.
       * @param {Number} [begin]
       * @param {Number} [end]
       * @returns {Array}
       * @ignore
       */
      slice(begin, end) {
        return !begin && !end ? this.values() : this.values().slice(begin || 0, end);
      }
      /**
       * Deprecated: Use set() instead.
       * @ignore
       * @deprecated
       */
      push(k, v) {
        this.set(k, v);
      }
      /**
       * Returns a shallow copy of the values of the map.
       * @returns {Array.<Host>}
       */
      values() {
        return this._values || (this._values = Object.freeze(Array.from(this._items.values()))), this._values;
      }
      /**
       * Removes all items from the map.
       * @returns {Array.<Host>} The previous items
       */
      clear() {
        let previousItems = this.values();
        return this._values = null, this._items = /* @__PURE__ */ new Map(), previousItems.forEach((h) => this.emit("remove", h)), previousItems;
      }
      inspect() {
        return this._items;
      }
      toJSON() {
        if (Object.fromEntries)
          return Object.fromEntries(this._items);
        let obj = {};
        for (let [key, value] of this._items)
          obj[key] = value;
        return obj;
      }
    };
    module2.exports = {
      Host,
      HostMap
    };
  }
});

// node_modules/cassandra-driver/lib/tokenizer.js
var require_tokenizer = __commonJS({
  "node_modules/cassandra-driver/lib/tokenizer.js"(exports2) {
    "use strict";
    var types = require_types(), token = require_token(), utils = require_utils(), MutableLong = require_mutable_long(), { Integer } = types, mconst1 = new MutableLong(21461, 4418, 31633, 34755), mconst2 = new MutableLong(37759, 10053, 44355, 19701), mlongFive = MutableLong.fromNumber(5), mconst3 = new MutableLong(36045, 60757, 45015, 65361), mconst4 = new MutableLong(60499, 6789, 47614, 50382), mconst5 = MutableLong.fromNumber(1390208809), mconst6 = MutableLong.fromNumber(944331445), Tokenizer = class {
      constructor() {
      }
      /**
       * Creates a token based on the Buffer value provided
       * @abstract
       * @param {Buffer|Array} value
       * @returns {Token} Computed token
       */
      hash(value) {
        throw new Error("You must implement a hash function for the tokenizer");
      }
      /**
       * Parses a token string and returns a representation of the token
       * @abstract
       * @param {String} value
       */
      parse(value) {
        throw new Error("You must implement a parse function for the tokenizer");
      }
      minToken() {
        throw new Error("You must implement a minToken function for the tokenizer");
      }
      /**
       * Splits the range specified by start and end into numberOfSplits equal parts.
       * @param {Token} start Starting token
       * @param {Token} end  End token
       * @param {Number} numberOfSplits Number of splits to make.
       */
      split(start, end, numberOfSplits) {
        throw new Error("You must implement a split function for the tokenizer");
      }
      /**
       * Common implementation for splitting token ranges when start is in
       * a shared Integer format.
       *
       * @param {Integer} start Starting token
       * @param {Integer} range How large the range of the split is
       * @param {Integer} ringEnd The end point of the ring so we know where to wrap
       * @param {Integer} ringLength The total size of the ring
       * @param {Number} numberOfSplits The number of splits to make
       * @returns {Array<Integer>} The evenly-split points on the range
       */
      splitBase(start, range, ringEnd, ringLength, numberOfSplits) {
        let numberOfSplitsInt = Integer.fromInt(numberOfSplits), divider = range.divide(numberOfSplitsInt), remainder = range.modulo(numberOfSplitsInt), results = [], current = start, dividerPlusOne = divider.add(Integer.ONE);
        for (let i = 1; i < numberOfSplits; i++)
          remainder.greaterThan(Integer.ZERO) ? current = current.add(dividerPlusOne) : current = current.add(divider), ringLength && current.greaterThan(ringEnd) && (current = current.subtract(ringLength)), results.push(current), remainder = remainder.subtract(Integer.ONE);
        return results;
      }
      /**
       * Return internal string based representation of a Token.
       * @param {Token} token 
       */
      stringify(token2) {
        return token2.getValue().toString();
      }
    }, Murmur3Tokenizer = class extends Tokenizer {
      constructor() {
        super();
      }
      /**
       * @param {Buffer} value
       * @return {Murmur3Token}
       */
      hash(value) {
        let data = value, offset = 0, length = data.length, nblocks = length >> 4, h1 = new MutableLong(), h2 = new MutableLong(), k1 = new MutableLong(), k2 = new MutableLong();
        for (let i = 0; i < nblocks; i++)
          k1 = this.getBlock(data, offset, i * 2), k2 = this.getBlock(data, offset, i * 2 + 1), k1.multiply(mconst1), this.rotl64(k1, 31), k1.multiply(mconst2), h1.xor(k1), this.rotl64(h1, 27), h1.add(h2), h1.multiply(mlongFive).add(mconst5), k2.multiply(mconst2), this.rotl64(k2, 33), k2.multiply(mconst1), h2.xor(k2), this.rotl64(h2, 31), h2.add(h1), h2.multiply(mlongFive).add(mconst6);
        switch (offset += nblocks * 16, k1 = new MutableLong(), k2 = new MutableLong(), length & 15) {
          case 15:
            k2.xor(fromSignedByte(data[offset + 14]).shiftLeft(48));
          case 14:
            k2.xor(fromSignedByte(data[offset + 13]).shiftLeft(40));
          case 13:
            k2.xor(fromSignedByte(data[offset + 12]).shiftLeft(32));
          case 12:
            k2.xor(fromSignedByte(data[offset + 11]).shiftLeft(24));
          case 11:
            k2.xor(fromSignedByte(data[offset + 10]).shiftLeft(16));
          case 10:
            k2.xor(fromSignedByte(data[offset + 9]).shiftLeft(8));
          case 9:
            k2.xor(fromSignedByte(data[offset + 8])), k2.multiply(mconst2), this.rotl64(k2, 33), k2.multiply(mconst1), h2.xor(k2);
          case 8:
            k1.xor(fromSignedByte(data[offset + 7]).shiftLeft(56));
          case 7:
            k1.xor(fromSignedByte(data[offset + 6]).shiftLeft(48));
          case 6:
            k1.xor(fromSignedByte(data[offset + 5]).shiftLeft(40));
          case 5:
            k1.xor(fromSignedByte(data[offset + 4]).shiftLeft(32));
          case 4:
            k1.xor(fromSignedByte(data[offset + 3]).shiftLeft(24));
          case 3:
            k1.xor(fromSignedByte(data[offset + 2]).shiftLeft(16));
          case 2:
            k1.xor(fromSignedByte(data[offset + 1]).shiftLeft(8));
          case 1:
            k1.xor(fromSignedByte(data[offset])), k1.multiply(mconst1), this.rotl64(k1, 31), k1.multiply(mconst2), h1.xor(k1);
        }
        return h1.xor(MutableLong.fromNumber(length)), h2.xor(MutableLong.fromNumber(length)), h1.add(h2), h2.add(h1), this.fmix(h1), this.fmix(h2), h1.add(h2), new token.Murmur3Token(h1);
      }
      /**
       *
       * @param {Array<Number>} key
       * @param {Number} offset
       * @param {Number} index
       * @return {MutableLong}
       */
      getBlock(key, offset, index) {
        let i8 = index << 3, blockOffset = offset + i8;
        return new MutableLong(
          key[blockOffset] | key[blockOffset + 1] << 8,
          key[blockOffset + 2] | key[blockOffset + 3] << 8,
          key[blockOffset + 4] | key[blockOffset + 5] << 8,
          key[blockOffset + 6] | key[blockOffset + 7] << 8
        );
      }
      /**
       * @param {MutableLong} v
       * @param {Number} n
       */
      rotl64(v, n) {
        let left = v.clone().shiftLeft(n);
        v.shiftRightUnsigned(64 - n).or(left);
      }
      /** @param {MutableLong} k */
      fmix(k) {
        k.xor(new MutableLong(k.getUint16(2) >>> 1 | k.getUint16(3) << 15 & 65535, k.getUint16(3) >>> 1, 0, 0)), k.multiply(mconst3);
        let other = new MutableLong(
          k.getUint16(2) >>> 1 | k.getUint16(3) << 15 & 65535,
          k.getUint16(3) >>> 1,
          0,
          0
        );
        k.xor(other), k.multiply(mconst4), k.xor(new MutableLong(k.getUint16(2) >>> 1 | k.getUint16(3) << 15 & 65535, k.getUint16(3) >>> 1, 0, 0));
      }
      /**
       * Parses a int64 decimal string representation into a MutableLong.
       * @param {String} value
       * @returns {Murmur3Token}
       */
      parse(value) {
        return new token.Murmur3Token(MutableLong.fromString(value));
      }
      minToken() {
        return this._minToken || (this._minToken = this.parse("-9223372036854775808")), this._minToken;
      }
      maxToken() {
        return this._maxToken || (this._maxToken = this.parse("9223372036854775807")), this._maxToken;
      }
      maxValue() {
        return this._maxValue || (this._maxValue = Integer.fromString("9223372036854775807")), this._maxValue;
      }
      minValue() {
        return this._minValue || (this._minValue = Integer.fromString("-9223372036854775808")), this._minValue;
      }
      ringLength() {
        return this._ringLength || (this._ringLength = this.maxValue().subtract(this.minValue())), this._ringLength;
      }
      split(start, end, numberOfSplits) {
        start.equals(end) && start.equals(this.minToken()) && (end = this.maxToken());
        let startVal = Integer.fromString(start.getValue().toString()), range = Integer.fromString(end.getValue().toString()).subtract(startVal);
        return range.isNegative() && (range = range.add(this.ringLength())), this.splitBase(startVal, range, this.maxValue(), this.ringLength(), numberOfSplits).map((v) => this.parse(v.toString()));
      }
      stringify(token2) {
        let value = token2.getValue();
        return value.getUint16(0) + "," + value.getUint16(1) + "," + value.getUint16(2) + "," + value.getUint16(3);
      }
    }, RandomTokenizer = class extends Tokenizer {
      constructor() {
        super(), this._crypto = require("crypto");
      }
      /**
       * @param {Buffer|Array} value
       * @returns {RandomToken}
       */
      hash(value) {
        Array.isArray(value) && (value = utils.allocBufferFromArray(value));
        let hashedValue = this._crypto.createHash("md5").update(value).digest();
        return new token.RandomToken(Integer.fromBuffer(hashedValue).abs());
      }
      /**
       * @returns {Token}
       */
      parse(value) {
        return new token.RandomToken(Integer.fromString(value));
      }
      minToken() {
        return this._minToken || (this._minToken = this.parse("-1")), this._minToken;
      }
      maxValue() {
        return this._maxValue || (this._maxValue = Integer.fromNumber(Math.pow(2, 127))), this._maxValue;
      }
      maxToken() {
        return this._maxToken || (this._maxToken = new token.RandomToken(this.maxValue())), this._maxToken;
      }
      ringLength() {
        return this._ringLength || (this._ringLength = this.maxValue().add(Integer.ONE)), this._ringLength;
      }
      split(start, end, numberOfSplits) {
        start.equals(end) && start.equals(this.minToken()) && (end = this.maxToken());
        let startVal = start.getValue(), range = end.getValue().subtract(startVal);
        return range.lessThan(Integer.ZERO) && (range = range.add(this.ringLength())), this.splitBase(startVal, range, this.maxValue(), this.ringLength(), numberOfSplits).map((v) => new token.RandomToken(v));
      }
    }, ByteOrderedTokenizer = class extends Tokenizer {
      constructor() {
        super();
      }
      /**
       * @param {Buffer} value
       * @returns {ByteOrderedToken}
       */
      hash(value) {
        Array.isArray(value) && (value = utils.allocBufferFromArray(value));
        let zeroIndex = value.length;
        for (let i = value.length - 1; i > 0 && value[i] === 0; i--)
          zeroIndex = i;
        return new token.ByteOrderedToken(value.slice(0, zeroIndex));
      }
      stringify(token2) {
        return token2.getValue().toString("hex");
      }
      parse(value) {
        return this.hash(utils.allocBufferFromString(value, "hex"));
      }
      minToken() {
        return this._minToken || (this._minToken = this.hash([])), this._minToken;
      }
      _toNumber(buffer, significantBytes) {
        let target = buffer;
        buffer.length !== significantBytes && (target = Buffer.alloc(significantBytes), buffer.copy(target));
        let bits = new Array(Math.ceil(target.length / 4));
        for (let i = 0; i < bits.length; i++) {
          let offset = target.length - (i + 1) * 4, value;
          if (offset < 0) {
            offset = offset + 4, value = 0;
            for (let j = 0; j < offset; j++) {
              let byte = target[j];
              value = value | byte << (offset - j - 1) * 8;
            }
          } else
            value = target.readInt32BE(offset);
          bits[i] = value;
        }
        return new Integer(bits, 0);
      }
      _toBuffer(number, significantBytes) {
        let buffer = Integer.toBuffer(number);
        if (buffer.length === significantBytes)
          return buffer;
        let start, length;
        buffer[0] === 0 ? (start = 1, length = buffer.length - 1) : (start = 0, length = buffer.length);
        let target = Buffer.alloc(significantBytes);
        return buffer.copy(target, significantBytes - length, start, length + start), target;
      }
      split(start, end, numberOfSplits) {
        let tokenOrder = start.compare(end);
        if (tokenOrder === 0 && start.equals(this.minToken()))
          throw new Error("Cannot split whole ring with ordered partitioner");
        let startVal, endVal, range, ringLength, ringEnd, intNumberOfSplits = Integer.fromNumber(numberOfSplits), significantBytes = Math.max(start.getValue().length, end.getValue().length);
        if (tokenOrder < 0) {
          let addedBytes = 0;
          for (; startVal = this._toNumber(start.getValue(), significantBytes), endVal = this._toNumber(end.getValue(), significantBytes), range = endVal.subtract(startVal), !(addedBytes === 4 || range.compare(intNumberOfSplits) >= 0); )
            significantBytes += 1, addedBytes += 1;
        } else {
          let addedBytes = 0;
          for (; startVal = this._toNumber(start.getValue(), significantBytes), endVal = this._toNumber(end.getValue(), significantBytes), ringLength = Integer.fromNumber(Math.pow(2, significantBytes * 8)), ringEnd = ringLength.subtract(Integer.ONE), range = endVal.subtract(startVal).add(ringLength), !(addedBytes === 4 || range.compare(intNumberOfSplits) >= 0); )
            significantBytes += 1, addedBytes += 1;
        }
        return this.splitBase(startVal, range, ringEnd, ringLength, numberOfSplits).map((v) => new token.ByteOrderedToken(this._toBuffer(v, significantBytes)));
      }
    };
    function fromSignedByte(value) {
      return value < 128 ? new MutableLong(value, 0, 0, 0) : new MutableLong(value - 256 & 65535, 65535, 65535, 65535);
    }
    exports2.Murmur3Tokenizer = Murmur3Tokenizer;
    exports2.RandomTokenizer = RandomTokenizer;
    exports2.ByteOrderedTokenizer = ByteOrderedTokenizer;
  }
});

// node_modules/cassandra-driver/lib/metadata/data-collection.js
var require_data_collection = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/data-collection.js"(exports2, module2) {
    "use strict";
    var util = require("util"), events = require("events");
    function DataCollection(name) {
      events.EventEmitter.call(this), this.setMaxListeners(0), Object.defineProperty(this, "loading", { value: !1, enumerable: !1, writable: !0 }), Object.defineProperty(this, "loaded", { value: !1, enumerable: !1, writable: !0 }), this.name = name, this.bloomFilterFalsePositiveChance = 0, this.caching = null, this.comment = null, this.gcGraceSeconds = 0, this.compactionClass = null, this.compactionOptions = null, this.compression = null, this.localReadRepairChance = 0, this.readRepairChance = 0, this.extensions = null, this.crcCheckChance = null, this.populateCacheOnFlush = !1, this.defaultTtl = 0, this.speculativeRetry = "NONE", this.minIndexInterval = 128, this.maxIndexInterval = 2048, this.columns = null, this.columnsByName = null, this.partitionKeys = [], this.clusteringKeys = [], this.clusteringOrder = [], this.nodesync = null;
    }
    util.inherits(DataCollection, events.EventEmitter);
    module2.exports = DataCollection;
  }
});

// node_modules/cassandra-driver/lib/metadata/table-metadata.js
var require_table_metadata = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/table-metadata.js"(exports2, module2) {
    "use strict";
    var util = require("util"), DataCollection = require_data_collection();
    function TableMetadata(name) {
      DataCollection.call(this, name), this.replicateOnWrite = !0, this.memtableFlushPeriod = 0, this.indexInterval = null, this.isCompact = !1, this.indexes = null, this.cdc = null, this.virtual = !1;
    }
    util.inherits(TableMetadata, DataCollection);
    module2.exports = TableMetadata;
  }
});

// node_modules/cassandra-driver/lib/metadata/aggregate.js
var require_aggregate = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/aggregate.js"(exports2, module2) {
    "use strict";
    function Aggregate() {
      this.name = null, this.keyspaceName = null, this.signature = null, this.argumentTypes = null, this.stateFunction = null, this.stateType = null, this.finalFunction = null, this.initConditionRaw = null, this.initCondition = null, this.returnType = null, this.deterministic = null;
    }
    module2.exports = Aggregate;
  }
});

// node_modules/cassandra-driver/lib/metadata/schema-function.js
var require_schema_function = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/schema-function.js"(exports2, module2) {
    "use strict";
    function SchemaFunction() {
      this.name = null, this.keyspaceName = null, this.signature = null, this.argumentNames = null, this.argumentTypes = null, this.body = null, this.calledOnNullInput = null, this.language = null, this.returnType = null, this.deterministic = null, this.monotonic = null, this.monotonicOn = null;
    }
    module2.exports = SchemaFunction;
  }
});

// node_modules/cassandra-driver/lib/metadata/schema-index.js
var require_schema_index = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/schema-index.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), types = require_types(), kind = {
      custom: 0,
      keys: 1,
      composites: 2
    };
    function Index(name, target, kind2, options) {
      this.name = name, this.target = target, this.kind = typeof kind2 == "string" ? getKindByName(kind2) : kind2, this.options = options;
    }
    Index.prototype.isCompositesKind = function() {
      return this.kind === kind.composites;
    };
    Index.prototype.isKeysKind = function() {
      return this.kind === kind.keys;
    };
    Index.prototype.isCustomKind = function() {
      return this.kind === kind.custom;
    };
    Index.fromRows = function(indexRows) {
      return !indexRows || indexRows.length === 0 ? utils.emptyArray : indexRows.map(function(row) {
        let options = row.options;
        return new Index(row.index_name, options.target, getKindByName(row.kind), options);
      });
    };
    Index.fromColumnRows = function(columnRows, columnsByName) {
      let result = [];
      for (let i = 0; i < columnRows.length; i++) {
        let row = columnRows[i], indexName = row.index_name;
        if (!indexName)
          continue;
        let c = columnsByName[row.column_name], target, options = JSON.parse(row.index_options);
        options !== null && options.index_keys !== void 0 ? target = util.format("keys(%s)", c.name) : options !== null && options.index_keys_and_values !== void 0 ? target = util.format("entries(%s)", c.name) : c.type.options.frozen && (c.type.code === types.dataTypes.map || c.type.code === types.dataTypes.list || c.type.code === types.dataTypes.set) ? target = util.format("full(%s)", c.name) : target = c.name, result.push(new Index(indexName, target, getKindByName(row.index_type), options));
      }
      return result;
    };
    function getKindByName(name) {
      return name ? kind[name.toLowerCase()] : kind.custom;
    }
    module2.exports = Index;
  }
});

// node_modules/cassandra-driver/lib/metadata/materialized-view.js
var require_materialized_view = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/materialized-view.js"(exports2, module2) {
    "use strict";
    var util = require("util"), DataCollection = require_data_collection();
    function MaterializedView(name) {
      DataCollection.call(this, name), this.tableName = null, this.whereClause = null, this.includeAllColumns = !1;
    }
    util.inherits(MaterializedView, DataCollection);
    module2.exports = MaterializedView;
  }
});

// node_modules/cassandra-driver/lib/metadata/schema-parser.js
var require_schema_parser = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/schema-parser.js"(exports2) {
    "use strict";
    var util = require("util"), events = require("events"), types = require_types(), utils = require_utils(), errors = require_errors(), promiseUtils = require_promise_utils(), TableMetadata = require_table_metadata(), Aggregate = require_aggregate(), SchemaFunction = require_schema_function(), Index = require_schema_index(), MaterializedView = require_materialized_view(), { format } = util, _selectAllKeyspacesV1 = "SELECT * FROM system.schema_keyspaces", _selectSingleKeyspaceV1 = "SELECT * FROM system.schema_keyspaces where keyspace_name = '%s'", _selectAllKeyspacesV2 = "SELECT * FROM system_schema.keyspaces", _selectSingleKeyspaceV2 = "SELECT * FROM system_schema.keyspaces where keyspace_name = '%s'", _selectTableV1 = "SELECT * FROM system.schema_columnfamilies WHERE keyspace_name='%s' AND columnfamily_name='%s'", _selectTableV2 = "SELECT * FROM system_schema.tables WHERE keyspace_name='%s' AND table_name='%s'", _selectColumnsV1 = "SELECT * FROM system.schema_columns WHERE keyspace_name='%s' AND columnfamily_name='%s'", _selectColumnsV2 = "SELECT * FROM system_schema.columns WHERE keyspace_name='%s' AND table_name='%s'", _selectIndexesV2 = "SELECT * FROM system_schema.indexes WHERE keyspace_name='%s' AND table_name='%s'", _selectUdtV1 = "SELECT * FROM system.schema_usertypes WHERE keyspace_name='%s' AND type_name='%s'", _selectUdtV2 = "SELECT * FROM system_schema.types WHERE keyspace_name='%s' AND type_name='%s'", _selectFunctionsV1 = "SELECT * FROM system.schema_functions WHERE keyspace_name = '%s' AND function_name = '%s'", _selectFunctionsV2 = "SELECT * FROM system_schema.functions WHERE keyspace_name = '%s' AND function_name = '%s'", _selectAggregatesV1 = "SELECT * FROM system.schema_aggregates WHERE keyspace_name = '%s' AND aggregate_name = '%s'", _selectAggregatesV2 = "SELECT * FROM system_schema.aggregates WHERE keyspace_name = '%s' AND aggregate_name = '%s'", _selectMaterializedViewV2 = "SELECT * FROM system_schema.views WHERE keyspace_name = '%s' AND view_name = '%s'", _selectAllVirtualKeyspaces = "SELECT * FROM system_virtual_schema.keyspaces", _selectSingleVirtualKeyspace = "SELECT * FROM system_virtual_schema.keyspaces where keyspace_name = '%s'", _selectVirtualTable = "SELECT * FROM system_virtual_schema.tables where keyspace_name = '%s' and table_name='%s'", _selectVirtualColumns = "SELECT * FROM system_virtual_schema.columns where keyspace_name = '%s' and table_name='%s'", SchemaParser = class {
      constructor(options, cc) {
        this.cc = cc, this.encodingOptions = options.encoding, this.selectTable = null, this.selectColumns = null, this.selectIndexes = null, this.selectUdt = null, this.selectAggregates = null, this.selectFunctions = null, this.supportsVirtual = !1;
      }
      /**
       * @param name
       * @param durableWrites
       * @param strategy
       * @param strategyOptions
       * @param virtual
       * @returns {{name, durableWrites, strategy, strategyOptions, tokenToReplica, udts, tables, functions, aggregates}}
       * @protected
       */
      _createKeyspace(name, durableWrites, strategy, strategyOptions, virtual) {
        return {
          name,
          durableWrites,
          strategy,
          strategyOptions,
          virtual: virtual === !0,
          udts: {},
          tables: {},
          functions: {},
          aggregates: {},
          views: {},
          tokenToReplica: getTokenToReplicaMapper(strategy, strategyOptions),
          graphEngine: void 0
        };
      }
      /**
       * @abstract
       * @param {String} name
       * @returns {Promise<Object>}
       */
      getKeyspace(name) {
      }
      /**
       * @abstract
       * @param {Boolean} waitReconnect
       * @returns {Promise<Object<string, Object>>}
       */
      getKeyspaces(waitReconnect) {
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @param {Object} cache
       * @param {Boolean} virtual
       * @returns {Promise<TableMetadata|null>}
       */
      async getTable(keyspaceName, name, cache, virtual) {
        let tableInfo = cache && cache[name];
        if (tableInfo || (tableInfo = new TableMetadata(name), cache && (cache[name] = tableInfo)), tableInfo.loaded)
          return tableInfo;
        if (tableInfo.loading)
          return promiseUtils.fromEvent(tableInfo, "load");
        try {
          tableInfo.loading = !0;
          let indexRows, virtualTable = virtual, selectTable = virtualTable ? _selectVirtualTable : this.selectTable, query = util.format(selectTable, keyspaceName, name), tableRow = await this._getFirstRow(query);
          if (!tableRow && this.supportsVirtual && virtualTable === void 0) {
            let query2 = util.format(_selectVirtualTable, keyspaceName, name);
            try {
              tableRow = await this._getFirstRow(query2);
            } catch {
            }
            tableRow && (virtualTable = !0);
          }
          if (!tableRow)
            return tableInfo.loading = !1, tableInfo.emit("load", null, null), null;
          let selectColumns = virtualTable ? _selectVirtualColumns : this.selectColumns, columnRows = await this._getRows(util.format(selectColumns, keyspaceName, name));
          return this.selectIndexes && !virtualTable && (indexRows = await this._getRows(util.format(this.selectIndexes, keyspaceName, name))), await this._parseTableOrView(tableInfo, tableRow, columnRows, indexRows, virtualTable), tableInfo.loaded = !0, tableInfo.emit("load", null, tableInfo), tableInfo;
        } catch (err) {
          throw tableInfo.emit("load", err, null), err;
        } finally {
          tableInfo.loading = !1;
        }
      }
      async _getFirstRow(query) {
        return (await this._getRows(query))[0];
      }
      async _getRows(query) {
        return (await this.cc.query(query)).rows;
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @param {Object} cache
       * @returns {Promise<Object|null>}
       */
      async getUdt(keyspaceName, name, cache) {
        let udtInfo = cache && cache[name];
        if (udtInfo || (udtInfo = new events.EventEmitter(), cache && (cache[name] = udtInfo), udtInfo.setMaxListeners(0), udtInfo.loading = !1, udtInfo.name = name, udtInfo.keyspace = keyspaceName, udtInfo.fields = null), udtInfo.fields)
          return udtInfo;
        if (udtInfo.loading)
          return promiseUtils.fromEvent(udtInfo, "load");
        udtInfo.loading = !0;
        let query = format(this.selectUdt, keyspaceName, name);
        try {
          let row = await this._getFirstRow(query);
          return row ? (await this._parseUdt(udtInfo, row), udtInfo.emit("load", null, udtInfo), udtInfo) : (udtInfo.loading = !1, udtInfo.emit("load", null, null), null);
        } catch (err) {
          throw udtInfo.emit("load", err), err;
        } finally {
          udtInfo.loading = !1;
        }
      }
      /**
       * Parses the udt information from the row
       * @param udtInfo
       * @param {Row} row
       * @returns {Promise<void>}
       * @abstract
       */
      _parseUdt(udtInfo, row) {
      }
      /**
       * Builds the metadata based on the table and column rows
       * @abstract
       * @param {module:metadata~TableMetadata} tableInfo
       * @param {Row} tableRow
       * @param {Array.<Row>} columnRows
       * @param {Array.<Row>} indexRows
       * @param {Boolean} virtual
       * @returns {Promise<void>}
       * @throws {Error}
       */
      async _parseTableOrView(tableInfo, tableRow, columnRows, indexRows, virtual) {
      }
      /**
       * @abstract
       * @param {String} keyspaceName
       * @param {String} name
       * @param {Object} cache
       * @returns {Promise<MaterializedView|null>}
       */
      getMaterializedView(keyspaceName, name, cache) {
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @param {Boolean} aggregate
       * @param {Object} cache
       * @returns {Promise<Map>}
       */
      async getFunctions(keyspaceName, name, aggregate, cache) {
        let query = this.selectFunctions, parser = (row) => this._parseFunction(row);
        aggregate && (query = this.selectAggregates, parser = (row) => this._parseAggregate(row));
        let functionsInfo = cache && cache[name];
        if (functionsInfo || (functionsInfo = new events.EventEmitter(), cache && (cache[name] = functionsInfo), functionsInfo.setMaxListeners(0)), functionsInfo.values)
          return functionsInfo.values;
        if (functionsInfo.loading)
          return promiseUtils.fromEvent(functionsInfo, "load");
        functionsInfo.loading = !0;
        try {
          let rows = await this._getRows(format(query, keyspaceName, name)), funcs = await Promise.all(rows.map(parser)), result = /* @__PURE__ */ new Map();
          return rows.length > 0 && (functionsInfo.values = result), funcs.forEach((f) => functionsInfo.values.set(f.signature.join(","), f)), functionsInfo.emit("load", null, result), result;
        } catch (err) {
          throw functionsInfo.emit("load", err), err;
        } finally {
          functionsInfo.loading = !1;
        }
      }
      /**
       * @abstract
       * @param {Row} row
       * @returns {Promise}
       */
      _parseAggregate(row) {
      }
      /**
       * @abstract
       * @param {Row} row
       * @returns {Promise}
       */
      _parseFunction(row) {
      }
      /** @returns {Map} */
      _asMap(obj) {
        return obj ? this.encodingOptions.map && obj instanceof this.encodingOptions.map ? obj : new Map(Object.keys(obj).map((k) => [k, obj[k]])) : /* @__PURE__ */ new Map();
      }
      _mapAsObject(map) {
        if (!map)
          return map;
        if (this.encodingOptions.map && map instanceof this.encodingOptions.map) {
          let result = {};
          return map.forEach((value, key) => result[key] = value), result;
        }
        return map;
      }
    }, SchemaParserV1 = class extends SchemaParser {
      /**
       * @param {ClientOptions} options
       * @param {ControlConnection} cc
       */
      constructor(options, cc) {
        super(options, cc), this.selectTable = _selectTableV1, this.selectColumns = _selectColumnsV1, this.selectUdt = _selectUdtV1, this.selectAggregates = _selectAggregatesV1, this.selectFunctions = _selectFunctionsV1;
      }
      async getKeyspaces(waitReconnect) {
        let keyspaces = {}, result = await this.cc.query(_selectAllKeyspacesV1, waitReconnect);
        for (let i = 0; i < result.rows.length; i++) {
          let row = result.rows[i], ksInfo = this._createKeyspace(row.keyspace_name, row.durable_writes, row.strategy_class, JSON.parse(row.strategy_options || null));
          keyspaces[ksInfo.name] = ksInfo;
        }
        return keyspaces;
      }
      async getKeyspace(name) {
        let row = await this._getFirstRow(format(_selectSingleKeyspaceV1, name));
        return row ? this._createKeyspace(row.keyspace_name, row.durable_writes, row.strategy_class, JSON.parse(row.strategy_options)) : null;
      }
      // eslint-disable-next-line require-await
      async _parseTableOrView(tableInfo, tableRow, columnRows, indexRows, virtual) {
        let c, name, types2, encoder = this.cc.getEncoder(), columnsKeyed = {}, partitionKeys = [], clusteringKeys = [];
        tableInfo.bloomFilterFalsePositiveChance = tableRow.bloom_filter_fp_chance, tableInfo.caching = tableRow.caching, tableInfo.comment = tableRow.comment, tableInfo.compactionClass = tableRow.compaction_strategy_class, tableInfo.compactionOptions = JSON.parse(tableRow.compaction_strategy_options), tableInfo.compression = JSON.parse(tableRow.compression_parameters), tableInfo.gcGraceSeconds = tableRow.gc_grace_seconds, tableInfo.localReadRepairChance = tableRow.local_read_repair_chance, tableInfo.readRepairChance = tableRow.read_repair_chance, tableInfo.populateCacheOnFlush = tableRow.populate_io_cache_on_flush || tableInfo.populateCacheOnFlush, tableInfo.memtableFlushPeriod = tableRow.memtable_flush_period_in_ms || tableInfo.memtableFlushPeriod, tableInfo.defaultTtl = tableRow.default_time_to_live || tableInfo.defaultTtl, tableInfo.speculativeRetry = tableRow.speculative_retry || tableInfo.speculativeRetry, tableInfo.indexInterval = tableRow.index_interval || tableInfo.indexInterval, typeof tableRow.min_index_interval < "u" ? (tableInfo.minIndexInterval = tableRow.min_index_interval || tableInfo.minIndexInterval, tableInfo.maxIndexInterval = tableRow.max_index_interval || tableInfo.maxIndexInterval) : (tableInfo.minIndexInterval = null, tableInfo.maxIndexInterval = null), typeof tableRow.replicate_on_write < "u" && (tableInfo.replicateOnWrite = tableRow.replicate_on_write), tableInfo.columns = [];
        for (let i = 0; i < columnRows.length; i++) {
          let row = columnRows[i], type = encoder.parseFqTypeName(row.validator);
          switch (c = {
            name: row.column_name,
            type,
            isStatic: !1
          }, tableInfo.columns.push(c), columnsKeyed[c.name] = c, row.type) {
            case "partition_key":
              partitionKeys.push({ c, index: row.component_index || 0 });
              break;
            case "clustering_key":
              clusteringKeys.push({
                c,
                index: row.component_index || 0,
                order: c.type.options.reversed ? "DESC" : "ASC"
              });
              break;
            case "static":
              c.isStatic = !0;
              break;
          }
        }
        partitionKeys.length > 0 && (tableInfo.partitionKeys = partitionKeys.sort(utils.propCompare("index")).map((item) => item.c), clusteringKeys.sort(utils.propCompare("index")), tableInfo.clusteringKeys = clusteringKeys.map((item) => item.c), tableInfo.clusteringOrder = clusteringKeys.map((item) => item.order));
        let keysStoredInTableRow = tableInfo.partitionKeys.length === 0;
        if (keysStoredInTableRow && tableRow.key_aliases) {
          partitionKeys = JSON.parse(tableRow.key_aliases), types2 = encoder.parseKeyTypes(tableRow.key_validator).types;
          for (let i = 0; i < partitionKeys.length; i++)
            name = partitionKeys[i], c = columnsKeyed[name], c || (c = {
              name,
              type: types2[i]
            }, tableInfo.columns.push(c)), tableInfo.partitionKeys.push(c);
        }
        let comparator = encoder.parseKeyTypes(tableRow.comparator);
        if (keysStoredInTableRow && tableRow.column_aliases) {
          clusteringKeys = JSON.parse(tableRow.column_aliases);
          for (let i = 0; i < clusteringKeys.length; i++)
            name = clusteringKeys[i], c = columnsKeyed[name], c || (c = {
              name,
              type: comparator.types[i]
            }, tableInfo.columns.push(c)), tableInfo.clusteringKeys.push(c), tableInfo.clusteringOrder.push(c.type.options.reversed ? "DESC" : "ASC");
        }
        tableInfo.isCompact = !!tableRow.is_dense, tableInfo.isCompact || (tableInfo.isCompact = //clustering keys are not marked as composite
        !comparator.isComposite || //only 1 column not part of the partition or clustering keys
        !comparator.hasCollections && tableInfo.clusteringKeys.length !== comparator.types.length - 1), name = tableRow.value_alias, tableInfo.isCompact && name && !columnsKeyed[name] && (c = {
          name,
          type: encoder.parseFqTypeName(tableRow.default_validator)
        }, tableInfo.columns.push(c), columnsKeyed[name] = c), tableInfo.columnsByName = columnsKeyed, tableInfo.indexes = Index.fromColumnRows(columnRows, tableInfo.columnsByName);
      }
      getMaterializedView(keyspaceName, name, cache) {
        return Promise.reject(new errors.NotSupportedError("Materialized views are not supported on Cassandra versions below 3.0"));
      }
      // eslint-disable-next-line require-await
      async _parseAggregate(row) {
        let encoder = this.cc.getEncoder(), aggregate = new Aggregate();
        aggregate.name = row.aggregate_name, aggregate.keyspaceName = row.keyspace_name, aggregate.signature = row.signature || utils.emptyArray, aggregate.stateFunction = row.state_func, aggregate.finalFunction = row.final_func, aggregate.initConditionRaw = row.initcond, aggregate.argumentTypes = (row.argument_types || utils.emptyArray).map((name) => encoder.parseFqTypeName(name)), aggregate.stateType = encoder.parseFqTypeName(row.state_type);
        let initConditionValue = encoder.decode(aggregate.initConditionRaw, aggregate.stateType);
        return initConditionValue !== null && typeof initConditionValue < "u" && (aggregate.initCondition = initConditionValue.toString()), aggregate.returnType = encoder.parseFqTypeName(row.return_type), aggregate;
      }
      // eslint-disable-next-line require-await
      async _parseFunction(row) {
        let encoder = this.cc.getEncoder(), func = new SchemaFunction();
        return func.name = row.function_name, func.keyspaceName = row.keyspace_name, func.signature = row.signature || utils.emptyArray, func.argumentNames = row.argument_names || utils.emptyArray, func.body = row.body, func.calledOnNullInput = row.called_on_null_input, func.language = row.language, func.argumentTypes = (row.argument_types || utils.emptyArray).map((name) => encoder.parseFqTypeName(name)), func.returnType = encoder.parseFqTypeName(row.return_type), func;
      }
      // eslint-disable-next-line require-await
      async _parseUdt(udtInfo, row) {
        let encoder = this.cc.getEncoder(), fieldNames = row.field_names, fieldTypes = row.field_types, fields = new Array(fieldNames.length);
        for (let i = 0; i < fieldNames.length; i++)
          fields[i] = {
            name: fieldNames[i],
            type: encoder.parseFqTypeName(fieldTypes[i])
          };
        return udtInfo.fields = fields, udtInfo;
      }
    }, SchemaParserV2 = class extends SchemaParser {
      /**
       * @param {ClientOptions} options The client options
       * @param {ControlConnection} cc The control connection to be used
       * @param {Function} udtResolver The function to be used to retrieve the udts.
       */
      constructor(options, cc, udtResolver) {
        super(options, cc), this.udtResolver = udtResolver, this.selectTable = _selectTableV2, this.selectColumns = _selectColumnsV2, this.selectUdt = _selectUdtV2, this.selectAggregates = _selectAggregatesV2, this.selectFunctions = _selectFunctionsV2, this.selectIndexes = _selectIndexesV2;
      }
      async getKeyspaces(waitReconnect) {
        let keyspaces = {}, result = await this.cc.query(_selectAllKeyspacesV2, waitReconnect);
        for (let i = 0; i < result.rows.length; i++) {
          let ksInfo = this._parseKeyspace(result.rows[i]);
          keyspaces[ksInfo.name] = ksInfo;
        }
        return keyspaces;
      }
      async getKeyspace(name) {
        let row = await this._getFirstRow(format(_selectSingleKeyspaceV2, name));
        return row ? this._parseKeyspace(row) : null;
      }
      async getMaterializedView(keyspaceName, name, cache) {
        let viewInfo = cache && cache[name];
        if (viewInfo || (viewInfo = new MaterializedView(name), cache && (cache[name] = viewInfo)), viewInfo.loaded)
          return viewInfo;
        if (viewInfo.loading)
          return promiseUtils.fromEvent(viewInfo, "load");
        viewInfo.loading = !0;
        try {
          let tableRow = await this._getFirstRow(format(_selectMaterializedViewV2, keyspaceName, name));
          if (!tableRow)
            return viewInfo.emit("load", null, null), viewInfo.loading = !1, null;
          let columnRows = await this._getRows(format(this.selectColumns, keyspaceName, name));
          return await this._parseTableOrView(viewInfo, tableRow, columnRows, null, !1), viewInfo.loaded = !0, viewInfo.emit("load", null, viewInfo), viewInfo;
        } catch (err) {
          throw viewInfo.emit("load", err), err;
        } finally {
          viewInfo.loading = !1;
        }
      }
      _parseKeyspace(row, virtual) {
        let replication = row.replication, strategy, strategyOptions;
        if (replication) {
          strategy = replication.class, strategyOptions = {};
          for (let key in replication)
            !replication.hasOwnProperty(key) || key === "class" || (strategyOptions[key] = replication[key]);
        }
        let ks = this._createKeyspace(row.keyspace_name, row.durable_writes, strategy, strategyOptions, virtual);
        return ks.graphEngine = row.graph_engine, ks;
      }
      async _parseTableOrView(tableInfo, tableRow, columnRows, indexRows, virtual) {
        let encoder = this.cc.getEncoder(), columnsKeyed = {}, partitionKeys = [], clusteringKeys = [];
        if (tableInfo.columns = await Promise.all(columnRows.map(async (row) => {
          let type = await encoder.parseTypeName(tableRow.keyspace_name, row.type, 0, null, this.udtResolver), c = {
            name: row.column_name,
            type,
            isStatic: !1
          };
          switch (columnsKeyed[c.name] = c, row.kind) {
            case "partition_key":
              partitionKeys.push({ c, index: row.position || 0 });
              break;
            case "clustering":
              clusteringKeys.push({
                c,
                index: row.position || 0,
                order: row.clustering_order === "desc" ? "DESC" : "ASC"
              });
              break;
            case "static":
              c.isStatic = !0;
              break;
          }
          return c;
        })), tableInfo.columnsByName = columnsKeyed, tableInfo.partitionKeys = partitionKeys.sort(utils.propCompare("index")).map((item) => item.c), clusteringKeys.sort(utils.propCompare("index")), tableInfo.clusteringKeys = clusteringKeys.map((item) => item.c), tableInfo.clusteringOrder = clusteringKeys.map((item) => item.order), virtual) {
          tableInfo.virtual = !0;
          return;
        }
        let isView = tableInfo instanceof MaterializedView;
        tableInfo.bloomFilterFalsePositiveChance = tableRow.bloom_filter_fp_chance, tableInfo.caching = JSON.stringify(tableRow.caching), tableInfo.comment = tableRow.comment;
        let compaction = this._asMap(tableRow.compaction);
        if (compaction && (tableInfo.compactionOptions = {}, tableInfo.compactionClass = compaction.get("class"), compaction.forEach((value, key) => {
          key !== "class" && (tableInfo.compactionOptions[key] = compaction.get(key));
        })), tableInfo.compression = this._mapAsObject(tableRow.compression), tableInfo.gcGraceSeconds = tableRow.gc_grace_seconds, tableInfo.localReadRepairChance = tableRow.dclocal_read_repair_chance, tableInfo.readRepairChance = tableRow.read_repair_chance, tableInfo.extensions = this._mapAsObject(tableRow.extensions), tableInfo.crcCheckChance = tableRow.crc_check_chance, tableInfo.memtableFlushPeriod = tableRow.memtable_flush_period_in_ms || tableInfo.memtableFlushPeriod, tableInfo.defaultTtl = tableRow.default_time_to_live || tableInfo.defaultTtl, tableInfo.speculativeRetry = tableRow.speculative_retry || tableInfo.speculativeRetry, tableInfo.minIndexInterval = tableRow.min_index_interval || tableInfo.minIndexInterval, tableInfo.maxIndexInterval = tableRow.max_index_interval || tableInfo.maxIndexInterval, tableInfo.nodesync = tableRow.nodesync || tableInfo.nodesync, !isView) {
          let cdc = tableRow.cdc;
          cdc !== void 0 && (tableInfo.cdc = cdc);
        }
        if (isView) {
          tableInfo.tableName = tableRow.base_table_name, tableInfo.whereClause = tableRow.where_clause, tableInfo.includeAllColumns = tableRow.include_all_columns;
          return;
        }
        tableInfo.indexes = this._getIndexes(indexRows);
        let flags = tableRow.flags;
        Array.isArray(flags) && (flags = new Set(flags));
        let isDense = flags.has("dense"), isSuper = flags.has("super"), isCompound = flags.has("compound");
        tableInfo.isCompact = isSuper || isDense || !isCompound, !isSuper && !isDense && !isCompound ? pruneStaticCompactTableColumns(tableInfo) : isDense && pruneDenseTableColumns(tableInfo);
      }
      _getIndexes(indexRows) {
        return !indexRows || indexRows.length === 0 ? utils.emptyArray : indexRows.map((row) => {
          let options = this._mapAsObject(row.options);
          return new Index(row.index_name, options.target, row.kind, options);
        });
      }
      async _parseAggregate(row) {
        let encoder = this.cc.getEncoder(), aggregate = new Aggregate();
        return aggregate.name = row.aggregate_name, aggregate.keyspaceName = row.keyspace_name, aggregate.signature = row.argument_types || utils.emptyArray, aggregate.stateFunction = row.state_func, aggregate.finalFunction = row.final_func, aggregate.initConditionRaw = row.initcond, aggregate.initCondition = aggregate.initConditionRaw, aggregate.deterministic = row.deterministic || !1, aggregate.argumentTypes = await Promise.all(aggregate.signature.map((name) => encoder.parseTypeName(row.keyspace_name, name, 0, null, this.udtResolver))), aggregate.stateType = await encoder.parseTypeName(row.keyspace_name, row.state_type, 0, null, this.udtResolver), aggregate.returnType = await encoder.parseTypeName(row.keyspace_name, row.return_type, 0, null, this.udtResolver), aggregate;
      }
      async _parseFunction(row) {
        let encoder = this.cc.getEncoder(), func = new SchemaFunction();
        return func.name = row.function_name, func.keyspaceName = row.keyspace_name, func.signature = row.argument_types || utils.emptyArray, func.argumentNames = row.argument_names || utils.emptyArray, func.body = row.body, func.calledOnNullInput = row.called_on_null_input, func.language = row.language, func.deterministic = row.deterministic || !1, func.monotonic = row.monotonic || !1, func.monotonicOn = row.monotonic_on || utils.emptyArray, func.argumentTypes = await Promise.all(func.signature.map((name) => encoder.parseTypeName(row.keyspace_name, name, 0, null, this.udtResolver))), func.returnType = await encoder.parseTypeName(row.keyspace_name, row.return_type, 0, null, this.udtResolver), func;
      }
      async _parseUdt(udtInfo, row) {
        let encoder = this.cc.getEncoder(), fieldTypes = row.field_types, keyspace = row.keyspace_name;
        return udtInfo.fields = await Promise.all(row.field_names.map(async (name, i) => {
          let type = await encoder.parseTypeName(keyspace, fieldTypes[i], 0, null, this.udtResolver);
          return { name, type };
        })), udtInfo;
      }
    }, SchemaParserV3 = class extends SchemaParserV2 {
      /**
       * @param {ClientOptions} options The client options
       * @param {ControlConnection} cc The control connection to be used
       * @param {Function} udtResolver The function to be used to retrieve the udts.
       */
      constructor(options, cc, udtResolver) {
        super(options, cc, udtResolver), this.supportsVirtual = !0;
      }
      async getKeyspaces(waitReconnect) {
        let keyspaces = {}, queries = [
          { query: _selectAllKeyspacesV2, virtual: !1 },
          { query: _selectAllVirtualKeyspaces, virtual: !0 }
        ];
        return await Promise.all(queries.map(async (q) => {
          let result = null;
          try {
            result = await this.cc.query(q.query, waitReconnect);
          } catch (err) {
            if (q.virtual)
              return;
            throw err;
          }
          for (let i = 0; i < result.rows.length; i++) {
            let ksInfo = this._parseKeyspace(result.rows[i], q.virtual);
            keyspaces[ksInfo.name] = ksInfo;
          }
        })), keyspaces;
      }
      async getKeyspace(name) {
        let ks = await this._getKeyspace(_selectSingleKeyspaceV2, name, !1);
        return ks || this._getKeyspace(_selectSingleVirtualKeyspace, name, !0);
      }
      async _getKeyspace(query, name, virtual) {
        try {
          let row = await this._getFirstRow(format(query, name));
          return row ? this._parseKeyspace(row, virtual) : null;
        } catch (err) {
          if (virtual)
            return null;
          throw err;
        }
      }
    };
    function pruneStaticCompactTableColumns(tableInfo) {
      let i, c;
      for (i = 0; i < tableInfo.clusteringKeys.length; i++) {
        c = tableInfo.clusteringKeys[i];
        let index = tableInfo.columns.indexOf(c);
        tableInfo.columns.splice(index, 1), delete tableInfo.columnsByName[c.name];
      }
      for (tableInfo.clusteringKeys = utils.emptyArray, tableInfo.clusteringOrder = utils.emptyArray, i = tableInfo.columns.length; i--; ) {
        if (c = tableInfo.columns[i], !c.isStatic && tableInfo.partitionKeys.indexOf(c) === -1) {
          tableInfo.columns.splice(i, 1), delete tableInfo.columnsByName[c.name];
          continue;
        }
        c.isStatic = !1;
      }
    }
    function pruneDenseTableColumns(tableInfo) {
      let i = tableInfo.columns.length;
      for (; i--; ) {
        let c = tableInfo.columns[i];
        if (!c.isStatic && c.type.code === types.dataTypes.custom && c.type.info === "empty") {
          tableInfo.columns.splice(i, 1), delete tableInfo.columnsByName[c.name];
          continue;
        }
        c.isStatic = !1;
      }
    }
    function getTokenToReplicaMapper(strategy, strategyOptions) {
      if (/SimpleStrategy$/.test(strategy)) {
        let rf = parseInt(strategyOptions.replication_factor, 10);
        if (rf > 1)
          return getTokenToReplicaSimpleMapper(rf);
      }
      return /NetworkTopologyStrategy$/.test(strategy) ? getTokenToReplicaNetworkMapper(strategyOptions) : function(tokenizer, ring, primaryReplicas) {
        let replicas = {};
        for (let key in primaryReplicas)
          primaryReplicas.hasOwnProperty(key) && (replicas[key] = [primaryReplicas[key]]);
        return replicas;
      };
    }
    function getTokenToReplicaSimpleMapper(replicationFactor) {
      return function(tokenizer, ringTokensAsStrings, primaryReplicas) {
        let ringLength = ringTokensAsStrings.length, rf = Math.min(replicationFactor, ringLength), replicas = {};
        for (let i = 0; i < ringLength; i++) {
          let key = ringTokensAsStrings[i], tokenReplicas = [primaryReplicas[key]];
          for (let j = 1; j < ringLength && tokenReplicas.length < rf; j++) {
            let nextReplicaIndex = i + j;
            nextReplicaIndex >= ringLength && (nextReplicaIndex = nextReplicaIndex % ringLength);
            let nextReplica = primaryReplicas[ringTokensAsStrings[nextReplicaIndex]];
            tokenReplicas.indexOf(nextReplica) === -1 && tokenReplicas.push(nextReplica);
          }
          replicas[key] = tokenReplicas;
        }
        return replicas;
      };
    }
    function getTokenToReplicaNetworkMapper(replicationFactors) {
      return function(tokenizer, ringTokensAsStrings, primaryReplicas, datacenters) {
        let replicas = {}, ringLength = ringTokensAsStrings.length;
        for (let i = 0; i < ringLength; i++) {
          let key = ringTokensAsStrings[i], tokenReplicas = [], replicasByDc = {}, racksPlaced = {}, skippedHosts = [];
          for (let j = 0; j < ringLength; j++) {
            let nextReplicaIndex = i + j;
            nextReplicaIndex >= ringLength && (nextReplicaIndex = nextReplicaIndex % ringLength);
            let h = primaryReplicas[ringTokensAsStrings[nextReplicaIndex]];
            if (tokenReplicas.indexOf(h) !== -1)
              continue;
            let dc = h.datacenter, dcRf = parseInt(replicationFactors[dc], 10);
            if (!dcRf)
              continue;
            dcRf = Math.min(dcRf, datacenters[dc].hostLength);
            let dcReplicas = replicasByDc[dc] || 0;
            if (dcReplicas >= dcRf)
              continue;
            let racksPlacedInDc = racksPlaced[dc];
            if (racksPlacedInDc || (racksPlacedInDc = racksPlaced[dc] = new utils.HashSet()), h.rack && racksPlacedInDc.contains(h.rack) && racksPlacedInDc.length < datacenters[dc].racks.length) {
              skippedHosts.length < dcRf - dcReplicas && skippedHosts.push(h);
              continue;
            }
            if (replicasByDc[h.datacenter] = ++dcReplicas, tokenReplicas.push(h), h.rack && racksPlacedInDc.add(h.rack) && racksPlacedInDc.length === datacenters[dc].racks.length && (replicasByDc[dc] += addSkippedHosts(dcRf, dcReplicas, tokenReplicas, skippedHosts)), isDoneForToken(replicationFactors, datacenters, replicasByDc))
              break;
          }
          replicas[key] = tokenReplicas;
        }
        return replicas;
      };
    }
    function addSkippedHosts(dcRf, dcReplicas, tokenReplicas, skippedHosts) {
      let i;
      for (i = 0; i < dcRf - dcReplicas && i < skippedHosts.length; i++)
        tokenReplicas.push(skippedHosts[i]);
      return i;
    }
    function isDoneForToken(replicationFactors, datacenters, replicasByDc) {
      let keys = Object.keys(replicationFactors);
      for (let i = 0; i < keys.length; i++) {
        let dcName = keys[i], dc = datacenters[dcName];
        if (!dc)
          continue;
        let rf = Math.min(parseInt(replicationFactors[dcName], 10), dc.hostLength);
        if (rf > 0 && (!replicasByDc[dcName] || replicasByDc[dcName] < rf))
          return !1;
      }
      return !0;
    }
    function getByVersion(options, cc, udtResolver, version, currentInstance) {
      let parserConstructor = SchemaParserV1;
      return version && version[0] === 3 ? parserConstructor = SchemaParserV2 : version && version[0] >= 4 && (parserConstructor = SchemaParserV3), !currentInstance || !(currentInstance instanceof parserConstructor) ? new parserConstructor(options, cc, udtResolver) : currentInstance;
    }
    exports2.getByVersion = getByVersion;
    exports2.isDoneForToken = isDoneForToken;
  }
});

// node_modules/cassandra-driver/lib/metadata/index.js
var require_metadata = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/index.js"(exports2, module2) {
    "use strict";
    var events = require("events"), util = require("util"), t = require_tokenizer(), utils = require_utils(), errors = require_errors(), types = require_types(), requests = require_requests(), schemaParserFactory = require_schema_parser(), promiseUtils = require_promise_utils(), { TokenRange } = require_token(), { ExecutionOptions } = require_execution_options(), _selectTraceSession = "SELECT * FROM system_traces.sessions WHERE session_id=%s", _selectTraceEvents = "SELECT * FROM system_traces.events WHERE session_id=%s", _selectSchemaVersionPeers = "SELECT schema_version FROM system.peers", _selectSchemaVersionLocal = "SELECT schema_version FROM system.local", _traceMaxAttemps = 5, _traceAttemptDelay = 400, Metadata = class {
      /**
       * Creates a new instance of {@link Metadata}.
       * @param {ClientOptions} options
       * @param {ControlConnection} controlConnection Control connection used to retrieve information.
       */
      constructor(options, controlConnection) {
        if (!options)
          throw new errors.ArgumentError("Options are not defined");
        Object.defineProperty(this, "options", { value: options, enumerable: !1, writable: !1 }), Object.defineProperty(this, "controlConnection", { value: controlConnection, enumerable: !1, writable: !1 }), this.keyspaces = {}, this.initialized = !1, this._isDbaas = !1, this._schemaParser = schemaParserFactory.getByVersion(options, controlConnection, this.getUdt.bind(this)), this.log = utils.log, this._preparedQueries = new PreparedQueries(options.maxPrepared, (...args) => this.log(...args));
      }
      /**
       * Sets the cassandra version
       * @internal
       * @ignore
       * @param {Array.<Number>} version
       */
      setCassandraVersion(version) {
        this._schemaParser = schemaParserFactory.getByVersion(
          this.options,
          this.controlConnection,
          this.getUdt.bind(this),
          version,
          this._schemaParser
        );
      }
      /**
       * Determines whether the cluster is provided as a service.
       * @returns {boolean} true when the cluster is provided as a service (DataStax Astra), <code>false<code> when it's a
       * different deployment (on-prem).
       */
      isDbaas() {
        return this._isDbaas;
      }
      /**
       * Sets the product type as DBaaS.
       * @internal
       * @ignore
       */
      setProductTypeAsDbaas() {
        this._isDbaas = !0;
      }
      /**
       * @ignore
       * @param {String} partitionerName
       */
      setPartitioner(partitionerName) {
        return /RandomPartitioner$/.test(partitionerName) ? this.tokenizer = new t.RandomTokenizer() : /ByteOrderedPartitioner$/.test(partitionerName) ? this.tokenizer = new t.ByteOrderedTokenizer() : this.tokenizer = new t.Murmur3Tokenizer();
      }
      /**
       * Populates the information regarding primary replica per token, datacenters (+ racks) and sorted token ring.
       * @ignore
       * @param {HostMap} hosts
       */
      buildTokens(hosts) {
        if (!this.tokenizer)
          return this.log("error", "Tokenizer could not be determined");
        let allSorted = [], primaryReplicas = {}, hostArray = hosts.values(), stringify = this.tokenizer.stringify, datacenters = {};
        hostArray.forEach((h) => {
          if (!h.tokens)
            return;
          h.tokens.forEach((tokenString) => {
            let token = this.tokenizer.parse(tokenString);
            utils.insertSorted(allSorted, token, (t1, t2) => t1.compare(t2)), primaryReplicas[stringify(token)] = h;
          });
          let dc = datacenters[h.datacenter];
          dc || (dc = datacenters[h.datacenter] = {
            hostLength: 0,
            racks: new utils.HashSet()
          }), dc.hostLength++, dc.racks.add(h.rack);
        }), this.primaryReplicas = primaryReplicas, this.ring = allSorted;
        let tokenRanges = /* @__PURE__ */ new Set();
        if (this.ring.length === 1) {
          let min = this.tokenizer.minToken();
          tokenRanges.add(new TokenRange(min, min, this.tokenizer));
        } else
          for (let i = 0; i < this.ring.length; i++) {
            let start = this.ring[i], end = this.ring[(i + 1) % this.ring.length];
            tokenRanges.add(new TokenRange(start, end, this.tokenizer));
          }
        this.tokenRanges = tokenRanges, this.ringTokensAsStrings = new Array(allSorted.length);
        for (let i = 0; i < allSorted.length; i++)
          this.ringTokensAsStrings[i] = stringify(allSorted[i]);
        this.datacenters = datacenters;
      }
      /**
       * Gets the keyspace metadata information and updates the internal state of the driver.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the keyspaces metadata refresh completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * @param {String} name Name of the keyspace.
       * @param {Function} [callback] Optional callback.
       */
      refreshKeyspace(name, callback) {
        return promiseUtils.optionalCallback(this._refreshKeyspace(name), callback);
      }
      /**
       * @param {String} name
       * @private
       */
      async _refreshKeyspace(name) {
        if (!this.initialized)
          throw this._uninitializedError();
        this.log("info", util.format("Retrieving keyspace %s metadata", name));
        try {
          let ksInfo = await this._schemaParser.getKeyspace(name);
          return ksInfo ? (this.keyspaces[ksInfo.name] = ksInfo, ksInfo) : (delete this.keyspaces[name], null);
        } catch (err) {
          throw this.log("error", "There was an error while trying to retrieve keyspace information", err), err;
        }
      }
      /**
       * Gets the metadata information of all the keyspaces and updates the internal state of the driver.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the keyspace metadata refresh completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * @param {Boolean|Function} [waitReconnect] Determines if it should wait for reconnection in case the control connection is not
       * connected at the moment. Default: true.
       * @param {Function} [callback] Optional callback.
       */
      refreshKeyspaces(waitReconnect, callback) {
        if ((typeof waitReconnect == "function" || typeof waitReconnect > "u") && (callback = waitReconnect, waitReconnect = !0), !this.initialized) {
          let err = this._uninitializedError();
          return callback ? callback(err) : Promise.reject(err);
        }
        return promiseUtils.optionalCallback(this.refreshKeyspacesInternal(waitReconnect), callback);
      }
      /**
       * @param {Boolean} waitReconnect
       * @returns {Promise<Object<string, Object>>}
       * @ignore
       * @internal
       */
      async refreshKeyspacesInternal(waitReconnect) {
        this.log("info", "Retrieving keyspaces metadata");
        try {
          return this.keyspaces = await this._schemaParser.getKeyspaces(waitReconnect), this.keyspaces;
        } catch (err) {
          throw this.log("error", "There was an error while trying to retrieve keyspaces information", err), err;
        }
      }
      _getKeyspaceReplicas(keyspace) {
        return keyspace.replicas || (keyspace.replicas = keyspace.tokenToReplica(this.tokenizer, this.ringTokensAsStrings, this.primaryReplicas, this.datacenters)), keyspace.replicas;
      }
      /**
       * Gets the host list representing the replicas that contain the given partition key, token or token range.
       * <p>
       *   It uses the pre-loaded keyspace metadata to retrieve the replicas for a token for a given keyspace.
       *   When the keyspace metadata has not been loaded, it returns null.
       * </p>
       * @param {String} keyspaceName
       * @param {Buffer|Token|TokenRange} token Can be Buffer (serialized partition key), Token or TokenRange
       * @returns {Array}
       */
      getReplicas(keyspaceName, token) {
        if (!this.ring)
          return null;
        Buffer.isBuffer(token) && (token = this.tokenizer.hash(token)), token instanceof TokenRange && (token = token.end);
        let keyspace;
        if (keyspaceName && (keyspace = this.keyspaces[keyspaceName], !keyspace))
          return null;
        let i = utils.binarySearch(this.ring, token, (t1, t2) => t1.compare(t2));
        i < 0 && (i = ~i), i >= this.ring.length && (i = i % this.ring.length);
        let closestToken = this.ringTokensAsStrings[i];
        return keyspaceName ? this._getKeyspaceReplicas(keyspace)[closestToken] : [this.primaryReplicas[closestToken]];
      }
      /**
       * Gets the token ranges that define data distribution in the ring.
       *
       * @returns {Set<TokenRange>} The ranges of the ring or empty set if schema metadata is not enabled.
       */
      getTokenRanges() {
        return this.tokenRanges;
      }
      /**
       * Gets the token ranges that are replicated on the given host, for
       * the given keyspace.
       *
       * @param {String} keyspaceName The name of the keyspace to get ranges for.
       * @param {Host} host The host.
       * @returns {Set<TokenRange>|null} Ranges for the keyspace on this host or null if keyspace isn't found or hasn't been loaded.
       */
      getTokenRangesForHost(keyspaceName, host) {
        if (!this.ring)
          return null;
        let keyspace;
        if (keyspaceName && (keyspace = this.keyspaces[keyspaceName], !keyspace))
          return null;
        if (this.ring.length === 1)
          return this.getTokenRanges();
        let replicas = this._getKeyspaceReplicas(keyspace), ranges = /* @__PURE__ */ new Set();
        return this.tokenRanges.forEach((tokenRange) => {
          replicas[this.tokenizer.stringify(tokenRange.end)].indexOf(host) !== -1 && ranges.add(tokenRange);
        }), ranges;
      }
      /**
       * Constructs a Token from the input buffer(s) or string input.  If a string is passed in
       * it is assumed this matches the token representation reported by cassandra.
       * @param {Array<Buffer>|Buffer|String} components
       * @returns {Token} constructed token from the input buffer.
       */
      newToken(components) {
        if (!this.tokenizer)
          throw new Error("Partitioner not established.  This should only happen if metadata was disabled or you have not connected yet.");
        return Array.isArray(components) ? this.tokenizer.hash(Buffer.concat(components)) : typeof components == "string" ? this.tokenizer.parse(components) : this.tokenizer.hash(components);
      }
      /**
       * Constructs a TokenRange from the given start and end tokens.
       * @param {Token} start
       * @param {Token} end
       * @returns TokenRange build range spanning from start (exclusive) to end (inclusive).
       */
      newTokenRange(start, end) {
        if (!this.tokenizer)
          throw new Error("Partitioner not established.  This should only happen if metadata was disabled or you have not connected yet.");
        return new TokenRange(start, end, this.tokenizer);
      }
      /**
       * Gets the metadata information already stored associated to a prepared statement
       * @param {String} keyspaceName
       * @param {String} query
       * @internal
       * @ignore
       */
      getPreparedInfo(keyspaceName, query) {
        return this._preparedQueries.getOrAdd(keyspaceName, query);
      }
      /**
       * Clears the internal state related to the prepared statements.
       * Following calls to the Client using the prepare flag will re-prepare the statements.
       */
      clearPrepared() {
        this._preparedQueries.clear();
      }
      /** @ignore */
      getPreparedById(id) {
        return this._preparedQueries.getById(id);
      }
      /** @ignore */
      setPreparedById(info) {
        return this._preparedQueries.setById(info);
      }
      /** @ignore */
      getAllPrepared() {
        return this._preparedQueries.getAll();
      }
      /** @ignore */
      _uninitializedError() {
        return new Error("Metadata has not been initialized.  This could only happen if you have not connected yet.");
      }
      /**
       * Gets the definition of an user-defined type.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       * When trying to retrieve the same UDT definition concurrently, it will query once and invoke all callbacks
       * with the retrieved information.
       * </p>
       * @param {String} keyspaceName Name of the keyspace.
       * @param {String} name Name of the UDT.
       * @param {Function} [callback] The callback to invoke when retrieval completes.
       */
      getUdt(keyspaceName, name, callback) {
        return promiseUtils.optionalCallback(this._getUdt(keyspaceName, name), callback);
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @returns {Promise<Object|null>}
       * @private
       */
      async _getUdt(keyspaceName, name) {
        if (!this.initialized)
          throw this._uninitializedError();
        let cache;
        if (this.options.isMetadataSyncEnabled) {
          let keyspace = this.keyspaces[keyspaceName];
          if (!keyspace)
            return null;
          cache = keyspace.udts;
        }
        return await this._schemaParser.getUdt(keyspaceName, name, cache);
      }
      /**
       * Gets the definition of a table.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       * When trying to retrieve the same table definition concurrently, it will query once and invoke all callbacks
       * with the retrieved information.
       * </p>
       * @param {String} keyspaceName Name of the keyspace.
       * @param {String} name Name of the Table.
       * @param {Function} [callback] The callback with the err as a first parameter and the {@link TableMetadata} as
       * second parameter.
       */
      getTable(keyspaceName, name, callback) {
        return promiseUtils.optionalCallback(this._getTable(keyspaceName, name), callback);
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @private
       */
      async _getTable(keyspaceName, name) {
        if (!this.initialized)
          throw this._uninitializedError();
        let cache, virtual;
        if (this.options.isMetadataSyncEnabled) {
          let keyspace = this.keyspaces[keyspaceName];
          if (!keyspace)
            return null;
          cache = keyspace.tables, virtual = keyspace.virtual;
        }
        return await this._schemaParser.getTable(keyspaceName, name, cache, virtual);
      }
      /**
       * Gets the definition of CQL functions for a given name.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       * When trying to retrieve the same function definition concurrently, it will query once and invoke all callbacks
       * with the retrieved information.
       * </p>
       * @param {String} keyspaceName Name of the keyspace.
       * @param {String} name Name of the Function.
       * @param {Function} [callback] The callback with the err as a first parameter and the array of {@link SchemaFunction}
       * as second parameter.
       */
      getFunctions(keyspaceName, name, callback) {
        return promiseUtils.optionalCallback(this._getFunctionsWrapper(keyspaceName, name), callback);
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @private
       */
      async _getFunctionsWrapper(keyspaceName, name) {
        if (!keyspaceName || !name)
          throw new errors.ArgumentError("You must provide the keyspace name and cql function name to retrieve the metadata");
        let functionsMap = await this._getFunctions(keyspaceName, name, !1);
        return Array.from(functionsMap.values());
      }
      /**
       * Gets a definition of CQL function for a given name and signature.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       * When trying to retrieve the same function definition concurrently, it will query once and invoke all callbacks
       * with the retrieved information.
       * </p>
       * @param {String} keyspaceName Name of the keyspace
       * @param {String} name Name of the Function
       * @param {Array.<String>|Array.<{code, info}>} signature Array of types of the parameters.
       * @param {Function} [callback] The callback with the err as a first parameter and the {@link SchemaFunction} as second
       * parameter.
       */
      getFunction(keyspaceName, name, signature, callback) {
        return promiseUtils.optionalCallback(this._getSingleFunction(keyspaceName, name, signature, !1), callback);
      }
      /**
       * Gets the definition of CQL aggregate for a given name.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       * When trying to retrieve the same aggregates definition concurrently, it will query once and invoke all callbacks
       * with the retrieved information.
       * </p>
       * @param {String} keyspaceName Name of the keyspace
       * @param {String} name Name of the Function
       * @param {Function} [callback] The callback with the err as a first parameter and the array of {@link Aggregate} as
       * second parameter.
       */
      getAggregates(keyspaceName, name, callback) {
        return promiseUtils.optionalCallback(this._getAggregates(keyspaceName, name), callback);
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @private
       */
      async _getAggregates(keyspaceName, name) {
        if (!keyspaceName || !name)
          throw new errors.ArgumentError("You must provide the keyspace name and cql aggregate name to retrieve the metadata");
        let functionsMap = await this._getFunctions(keyspaceName, name, !0);
        return Array.from(functionsMap.values());
      }
      /**
       * Gets a definition of CQL aggregate for a given name and signature.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       * When trying to retrieve the same aggregate definition concurrently, it will query once and invoke all callbacks
       * with the retrieved information.
       * </p>
       * @param {String} keyspaceName Name of the keyspace
       * @param {String} name Name of the aggregate
       * @param {Array.<String>|Array.<{code, info}>} signature Array of types of the parameters.
       * @param {Function} [callback] The callback with the err as a first parameter and the {@link Aggregate} as second parameter.
       */
      getAggregate(keyspaceName, name, signature, callback) {
        return promiseUtils.optionalCallback(this._getSingleFunction(keyspaceName, name, signature, !0), callback);
      }
      /**
       * Gets the definition of a CQL materialized view for a given name.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * <p>
       *   Note that, unlike the rest of the {@link Metadata} methods, this method does not cache the result for following
       *   calls, as the current version of the Cassandra native protocol does not support schema change events for
       *   materialized views. Each call to this method will produce one or more queries to the cluster.
       * </p>
       * @param {String} keyspaceName Name of the keyspace
       * @param {String} name Name of the materialized view
       * @param {Function} [callback] The callback with the err as a first parameter and the {@link MaterializedView} as
       * second parameter.
       */
      getMaterializedView(keyspaceName, name, callback) {
        return promiseUtils.optionalCallback(this._getMaterializedView(keyspaceName, name), callback);
      }
      /**
       * @param {String} keyspaceName
       * @param {String} name
       * @returns {Promise<MaterializedView|null>}
       * @private
       */
      async _getMaterializedView(keyspaceName, name) {
        if (!this.initialized)
          throw this._uninitializedError();
        let cache;
        if (this.options.isMetadataSyncEnabled) {
          let keyspace = this.keyspaces[keyspaceName];
          if (!keyspace)
            return null;
          cache = keyspace.views;
        }
        return await this._schemaParser.getMaterializedView(keyspaceName, name, cache);
      }
      /**
       * Gets a map of cql function definitions or aggregates based on signature.
       * @param {String} keyspaceName
       * @param {String} name Name of the function or aggregate
       * @param {Boolean} aggregate
       * @returns {Promise<Map>}
       * @private
       */
      async _getFunctions(keyspaceName, name, aggregate) {
        if (!this.initialized)
          throw this._uninitializedError();
        let cache;
        if (this.options.isMetadataSyncEnabled) {
          let keyspace = this.keyspaces[keyspaceName];
          if (!keyspace)
            return /* @__PURE__ */ new Map();
          cache = aggregate ? keyspace.aggregates : keyspace.functions;
        }
        return await this._schemaParser.getFunctions(keyspaceName, name, aggregate, cache);
      }
      /**
       * Gets a single cql function or aggregate definition
       * @param {String} keyspaceName
       * @param {String} name
       * @param {Array} signature
       * @param {Boolean} aggregate
       * @returns {Promise<SchemaFunction|Aggregate|null>}
       * @private
       */
      async _getSingleFunction(keyspaceName, name, signature, aggregate) {
        if (!keyspaceName || !name)
          throw new errors.ArgumentError("You must provide the keyspace name and cql function name to retrieve the metadata");
        if (!Array.isArray(signature))
          throw new errors.ArgumentError("Signature must be an array of types");
        return signature = signature.map((item) => typeof item == "string" ? item : types.getDataTypeNameByCode(item)), (await this._getFunctions(keyspaceName, name, aggregate)).get(signature.join(",")) || null;
      }
      /**
       * Gets the trace session generated by Cassandra when query tracing is enabled for the
       * query. The trace itself is stored in Cassandra in the <code>sessions</code> and
       * <code>events</code> table in the <code>system_traces</code> keyspace and can be
       * retrieve manually using the trace identifier.
       * <p>
       *   If a <code>callback</code> is provided, the callback is invoked when the metadata retrieval completes.
       *   Otherwise, it returns a <code>Promise</code>.
       * </p>
       * @param {Uuid} traceId Identifier of the trace session.
       * @param {Number} [consistency] The consistency level to obtain the trace.
       * @param {Function} [callback] The callback with the err as first parameter and the query trace as second parameter.
       */
      getTrace(traceId, consistency, callback) {
        return !callback && typeof consistency == "function" && (callback = consistency, consistency = null), promiseUtils.optionalCallback(this._getTrace(traceId, consistency), callback);
      }
      /**
       * @param {Uuid} traceId
       * @param {Number} consistency
       * @returns {Promise<Object>}
       * @private
       */
      async _getTrace(traceId, consistency) {
        if (!this.initialized)
          throw this._uninitializedError();
        let trace, attempts = 0, info = ExecutionOptions.empty();
        info.getConsistency = () => consistency;
        let sessionRequest = new requests.QueryRequest(util.format(_selectTraceSession, traceId), null, info), eventsRequest = new requests.QueryRequest(util.format(_selectTraceEvents, traceId), null, info);
        for (; !trace && attempts++ < _traceMaxAttemps; ) {
          let sessionRow = (await this.controlConnection.query(sessionRequest)).rows[0];
          if (!sessionRow || typeof sessionRow.duration != "number") {
            await promiseUtils.delay(_traceAttemptDelay);
            continue;
          }
          trace = {
            requestType: sessionRow.request,
            coordinator: sessionRow.coordinator,
            parameters: sessionRow.parameters,
            startedAt: sessionRow.started_at,
            duration: sessionRow.duration,
            clientAddress: sessionRow.client,
            events: null
          };
          let eventsResponse = await this.controlConnection.query(eventsRequest);
          trace.events = eventsResponse.rows.map((row) => ({
            id: row.event_id,
            activity: row.activity,
            source: row.source,
            elapsed: row.source_elapsed,
            thread: row.thread
          }));
        }
        if (!trace)
          throw new Error(`Trace ${traceId.toString()} could not fully retrieved after ${_traceMaxAttemps} attempts`);
        return trace;
      }
      /**
       * Checks whether hosts that are currently up agree on the schema definition.
       * <p>
       *   This method performs a one-time check only, without any form of retry; therefore
       *   <code>protocolOptions.maxSchemaAgreementWaitSeconds</code> setting does not apply in this case.
       * </p>
       * @param {Function} [callback] A function that is invoked with a value
       * <code>true</code> when all hosts agree on the schema and <code>false</code> when there is no agreement or when
       * the check could not be performed (for example, if the control connection is down).
       * @returns {Promise} Returns a <code>Promise</code> when a callback is not provided. The promise resolves to
       * <code>true</code> when all hosts agree on the schema and <code>false</code> when there is no agreement or when
       * the check could not be performed (for example, if the control connection is down).
       */
      checkSchemaAgreement(callback) {
        return promiseUtils.optionalCallback(this._checkSchemaAgreement(), callback);
      }
      /**
       * Async-only version of check schema agreement.
       * @private
       */
      async _checkSchemaAgreement() {
        let connection = this.controlConnection.connection;
        if (!connection)
          return !1;
        try {
          return await this.compareSchemaVersions(connection);
        } catch {
          return !1;
        }
      }
      /**
       * Uses the metadata to fill the user provided parameter hints
       * @param {String} keyspace
       * @param {Array} hints
       * @internal
       * @ignore
       */
      async adaptUserHints(keyspace, hints) {
        if (!Array.isArray(hints))
          return;
        let udts = [];
        for (let i = 0; i < hints.length; i++) {
          let hint = hints[i];
          if (typeof hint != "string")
            continue;
          let type = types.dataTypes.getByName(hint);
          this._checkUdtTypes(udts, type, keyspace), hints[i] = type;
        }
        for (let type of udts) {
          let udtInfo = await this.getUdt(type.info.keyspace, type.info.name);
          if (!udtInfo)
            throw new TypeError("User defined type not found: " + type.info.keyspace + "." + type.info.name);
          type.info = udtInfo;
        }
      }
      /**
       * @param {Array} udts
       * @param {{code, info}} type
       * @param {string} keyspace
       * @private
       */
      _checkUdtTypes(udts, type, keyspace) {
        if (type.code === types.dataTypes.udt) {
          let udtName = type.info.split(".");
          if (type.info = {
            keyspace: udtName[0],
            name: udtName[1]
          }, !type.info.name) {
            if (!keyspace)
              throw new TypeError("No keyspace specified for udt: " + udtName.join("."));
            type.info.name = type.info.keyspace, type.info.keyspace = keyspace;
          }
          udts.push(type);
          return;
        }
        if (type.info) {
          if (type.code === types.dataTypes.list || type.code === types.dataTypes.set)
            return this._checkUdtTypes(udts, type.info, keyspace);
          type.code === types.dataTypes.map && (this._checkUdtTypes(udts, type.info[0], keyspace), this._checkUdtTypes(udts, type.info[1], keyspace));
        }
      }
      /**
       * Uses the provided connection to query the schema versions and compare them.
       * @param {Connection} connection
       * @internal
       * @ignore
       */
      async compareSchemaVersions(connection) {
        let versions = /* @__PURE__ */ new Set(), response1 = await connection.send(new requests.QueryRequest(_selectSchemaVersionLocal), null);
        response1 && response1.rows && response1.rows.length === 1 && versions.add(response1.rows[0].schema_version.toString());
        let response2 = await connection.send(new requests.QueryRequest(_selectSchemaVersionPeers), null);
        if (response2 && response2.rows)
          for (let row of response2.rows) {
            let value = row.schema_version;
            value && versions.add(value.toString());
          }
        return versions.size === 1;
      }
    }, PreparedQueries = class {
      /**
       * @param {Number} maxPrepared
       * @param {Function} logger
       */
      constructor(maxPrepared, logger) {
        this.length = 0, this._maxPrepared = maxPrepared, this._mapByKey = /* @__PURE__ */ new Map(), this._mapById = /* @__PURE__ */ new Map(), this._logger = logger;
      }
      _getKey(keyspace, query) {
        return (keyspace || "") + query;
      }
      getOrAdd(keyspace, query) {
        let key = this._getKey(keyspace, query), info = this._mapByKey.get(key);
        return info || (this._validateOverflow(), info = new events.EventEmitter(), info.setMaxListeners(0), info.query = query, info.keyspace = keyspace, this._mapByKey.set(key, info), this.length++, info);
      }
      _validateOverflow() {
        if (this.length < this._maxPrepared)
          return;
        let toRemove = [];
        this._logger(
          "warning",
          "Prepared statements exceeded maximum. This could be caused by preparing queries that contain parameters"
        );
        let toRemoveLength = this.length - this._maxPrepared + 1;
        for (let [key, info] of this._mapByKey) {
          if (!info.queryId)
            continue;
          if (toRemove.push([key, info]) >= toRemoveLength)
            break;
        }
        for (let [key, info] of toRemove)
          this._mapByKey.delete(key), this._mapById.delete(info.queryId.toString("hex")), this.length--;
      }
      setById(info) {
        this._mapById.set(info.queryId.toString("hex"), info);
      }
      getById(id) {
        return this._mapById.get(id.toString("hex"));
      }
      clear() {
        this._mapByKey = /* @__PURE__ */ new Map(), this._mapById = /* @__PURE__ */ new Map(), this.length = 0;
      }
      getAll() {
        return Array.from(this._mapByKey.values()).filter((info) => !!info.queryId);
      }
    };
    module2.exports = Metadata;
  }
});

// node_modules/cassandra-driver/lib/metadata/event-debouncer.js
var require_event_debouncer = __commonJS({
  "node_modules/cassandra-driver/lib/metadata/event-debouncer.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), promiseUtils = require_promise_utils(), _queueOverflowThreshold = 1e3, EventDebouncer = class {
      /**
       * Creates a new instance of the event debouncer.
       * @param {Number} delay
       * @param {Function} logger
       */
      constructor(delay, logger) {
        this._delay = delay, this._logger = logger, this._queue = null, this._timeout = null;
      }
      /**
       * Adds a new event to the queue and moves the delay.
       * @param {{ handler: Function, all: boolean|undefined, keyspace: String|undefined,
       * cqlObject: String|null|undefined }} event
       * @param {Boolean} processNow
       * @returns {Promise}
       */
      eventReceived(event, processNow) {
        return new Promise((resolve, reject) => {
          event.callback = promiseUtils.getCallback(resolve, reject), this._queue = this._queue || { callbacks: [], keyspaces: {} };
          let delay = processNow ? 0 : this._delay;
          if (event.all && (this._queue.mainEvent = event), this._queue.callbacks.length === _queueOverflowThreshold && this._logger("warn", util.format("Event debouncer queue exceeded %d events", _queueOverflowThreshold)), this._queue.callbacks.push(event.callback), this._queue.mainEvent)
            return this._slideDelay(delay);
          let keyspaceEvents = this._queue.keyspaces[event.keyspace];
          keyspaceEvents || (keyspaceEvents = this._queue.keyspaces[event.keyspace] = { events: [] }), event.cqlObject === void 0 && (keyspaceEvents.mainEvent = event), keyspaceEvents.events.push(event), this._slideDelay(delay);
        });
      }
      /**
       * @param {Number} delay
       * @private
       * */
      _slideDelay(delay) {
        let self = this;
        function process2() {
          let q = self._queue;
          self._queue = null, self._timeout = null, processQueue(q);
        }
        if (delay === 0)
          return this._timeout && clearTimeout(this._timeout), process2();
        let previousTimeout = this._timeout;
        this._timeout = setTimeout(process2, delay), previousTimeout && clearTimeout(previousTimeout);
      }
      /**
       * Clears the timeout and invokes all pending callback.
       */
      shutdown() {
        this._queue && (this._queue.callbacks.forEach(function(cb) {
          cb();
        }), this._queue = null, clearTimeout(this._timeout), this._timeout = null);
      }
    };
    function processQueue(q) {
      if (q.mainEvent)
        return promiseUtils.toCallback(q.mainEvent.handler(), (err) => {
          for (let i = 0; i < q.callbacks.length; i++)
            q.callbacks[i](err);
        });
      utils.each(Object.keys(q.keyspaces), function(name, next) {
        let keyspaceEvents = q.keyspaces[name];
        if (keyspaceEvents.mainEvent)
          return promiseUtils.toCallback(keyspaceEvents.mainEvent.handler(), function(err) {
            for (let i = 0; i < keyspaceEvents.events.length; i++)
              keyspaceEvents.events[i].callback(err);
            next();
          });
        keyspaceEvents.events.forEach((event) => {
          event.handler(), event.callback();
        }), next();
      });
    }
    module2.exports = EventDebouncer;
  }
});

// node_modules/cassandra-driver/lib/control-connection.js
var require_control_connection = __commonJS({
  "node_modules/cassandra-driver/lib/control-connection.js"(exports2, module2) {
    "use strict";
    var events = require("events"), util = require("util"), net = require("net"), dns = require("dns"), errors = require_errors(), { Host, HostMap } = require_host(), Metadata = require_metadata(), EventDebouncer = require_event_debouncer(), Connection = require_connection(), requests = require_requests(), utils = require_utils(), types = require_types(), promiseUtils = require_promise_utils(), f = util.format, selectPeers = "SELECT * FROM system.peers", selectLocal = "SELECT * FROM system.local WHERE key='local'", newNodeDelay = 1e3, metadataQueryAbortTimeout = 2e3, schemaChangeTypes = {
      created: "CREATED",
      updated: "UPDATED",
      dropped: "DROPPED"
    }, supportedProductTypeKey = "PRODUCT_TYPE", supportedDbaas = "DATASTAX_APOLLO", ControlConnection = class extends events.EventEmitter {
      /**
       * Creates a new instance of <code>ControlConnection</code>.
       * @param {Object} options
       * @param {ProfileManager} profileManager
       * @param {{borrowHostConnection: function, createConnection: function}} [context] An object containing methods to
       * allow dependency injection.
       */
      constructor(options, profileManager, context) {
        super(), this.protocolVersion = null, this.hosts = new HostMap(), this.setMaxListeners(0), this.log = utils.log, Object.defineProperty(this, "options", { value: options, enumerable: !1, writable: !1 }), this.metadata = new Metadata(this.options, this), this.initialized = !1, this.host = null, this.connection = null, this._addressTranslator = this.options.policies.addressResolution, this._reconnectionPolicy = this.options.policies.reconnection, this._reconnectionSchedule = this._reconnectionPolicy.newSchedule(), this._isShuttingDown = !1, this._encoder = null, this._debouncer = new EventDebouncer(options.refreshSchemaDelay, this.log.bind(this)), this._profileManager = profileManager, this._triedHosts = null, this._resolvedContactPoints = /* @__PURE__ */ new Map(), this._contactPoints = /* @__PURE__ */ new Set(), this._topologyChangeTimeout = null, this._nodeStatusChangeTimeout = null, context && context.borrowHostConnection && (this._borrowHostConnection = context.borrowHostConnection), context && context.createConnection && (this._createConnection = context.createConnection);
      }
      /**
       * Stores the contact point information and what it resolved to.
       * @param {String|null} address
       * @param {String} port
       * @param {String} name
       * @param {Boolean} isIPv6
       */
      _addContactPoint(address, port, name, isIPv6) {
        if (address === null) {
          this._resolvedContactPoints.set(name, utils.emptyArray);
          return;
        }
        let portNumber = parseInt(port, 10) || this.options.protocolOptions.port, endpoint = `${address}:${portNumber}`;
        this._contactPoints.add(endpoint);
        let standardEndpoint = isIPv6 ? `[${address}]:${portNumber}` : endpoint, resolvedAddressedByName = this._resolvedContactPoints.get(name);
        (resolvedAddressedByName === void 0 || resolvedAddressedByName === utils.emptyArray) && (resolvedAddressedByName = [], this._resolvedContactPoints.set(name, resolvedAddressedByName)), resolvedAddressedByName.push(standardEndpoint);
      }
      async _parseContactPoint(name) {
        let addressOrName = name, port = null;
        if (name.indexOf("[") === 0 && name.indexOf("]:") > 1) {
          let index = name.lastIndexOf("]:");
          addressOrName = name.substr(1, index - 1), port = name.substr(index + 2);
        } else if (name.indexOf(":") > 0) {
          let parts = name.split(":");
          parts.length === 2 && (addressOrName = parts[0], port = parts[1]);
        }
        if (net.isIP(addressOrName)) {
          this._addContactPoint(addressOrName, port, name, net.isIPv6(addressOrName));
          return;
        }
        let addresses = await this._resolveAll(addressOrName);
        addresses.length > 0 ? addresses.forEach((addressInfo) => this._addContactPoint(addressInfo.address, port, name, addressInfo.isIPv6)) : this._addContactPoint(null, null, name, !1);
      }
      /**
       * Initializes the control connection by establishing a Connection using a suitable protocol
       * version to be used and retrieving cluster metadata.
       */
      async init() {
        if (!this.initialized) {
          if (!this.options.sni)
            await Promise.all(this.options.contactPoints.map((name) => this._parseContactPoint(name)));
          else {
            this.options.contactPoints.forEach((cp) => this._contactPoints.add(cp));
            let address = this.options.sni.address, separatorIndex = address.lastIndexOf(":");
            if (separatorIndex === -1)
              throw new new errors.DriverInternalError("The SNI endpoint address should contain ip/name and port")();
            let nameOrIp = address.substr(0, separatorIndex);
            this.options.sni.port = address.substr(separatorIndex + 1), this.options.sni.addressResolver = new utils.AddressResolver({ nameOrIp, dns }), await this.options.sni.addressResolver.init();
          }
          if (this._contactPoints.size === 0)
            throw new errors.NoHostAvailableError({}, "No host could be resolved");
          await this._initializeConnection();
        }
      }
      _setHealthListeners(host, connection) {
        let self = this, wasRefreshCalled = 0;
        function removeListeners() {
          host.removeListener("down", downOrIgnoredHandler), host.removeListener("ignore", downOrIgnoredHandler), connection.removeListener("socketClose", socketClosedHandler);
        }
        function startReconnecting(hostDown) {
          wasRefreshCalled++ === 0 && (removeListeners(), !self._isShuttingDown && (hostDown ? self.log(
            "warning",
            `Host ${host.address} used by the ControlConnection DOWN, connection to ${connection.endpointFriendlyName} will not longer be used`
          ) : self.log("warning", `Connection to ${connection.endpointFriendlyName} used by the ControlConnection was closed`), promiseUtils.toBackground(self._refresh())));
        }
        function downOrIgnoredHandler() {
          startReconnecting(!0);
        }
        function socketClosedHandler() {
          startReconnecting(!1);
        }
        host.once("down", downOrIgnoredHandler), host.once("ignore", downOrIgnoredHandler), connection.once("socketClose", socketClosedHandler);
      }
      /**
       * Iterates through the hostIterator and Gets the following open connection.
       * @param {Iterator<Host>} hostIterator
       * @returns {Connection!}
       */
      _borrowAConnection(hostIterator) {
        let connection = null;
        for (; !connection; ) {
          let item = hostIterator.next(), host = item.value;
          if (item.done)
            throw new errors.NoHostAvailableError(this._triedHosts);
          let distance = this._profileManager.getDistance(host);
          if (!(!host.isUp() || distance === types.distance.ignored))
            try {
              connection = this._borrowHostConnection(host);
            } catch (err) {
              this._triedHosts[host.address] = err;
            }
        }
        return connection;
      }
      /**
       * Iterates through the contact points and tries to open a connection.
       * @param {Iterator<string>} contactPointsIterator
       * @returns {Promise<void>}
       */
      async _borrowFirstConnection(contactPointsIterator) {
        let connection = null;
        for (; !connection; ) {
          let item = contactPointsIterator.next(), contactPoint = item.value;
          if (item.done)
            throw new errors.NoHostAvailableError(this._triedHosts);
          try {
            connection = await this._createConnection(contactPoint);
          } catch (err) {
            this._triedHosts[contactPoint] = err;
          }
        }
        if (!connection) {
          let err = new errors.NoHostAvailableError(this._triedHosts);
          throw this.log("error", "ControlConnection failed to acquire a connection"), err;
        }
        this.protocolVersion = connection.protocolVersion, this._encoder = connection.encoder, this.connection = connection;
      }
      /** Default implementation for borrowing connections, that can be injected at constructor level */
      _borrowHostConnection(host) {
        return host.borrowConnection();
      }
      /**
       * Default implementation for creating initial connections, that can be injected at constructor level
       * @param {String} contactPoint
       */
      async _createConnection(contactPoint) {
        let c = new Connection(contactPoint, null, this.options);
        try {
          await c.openAsync();
        } catch (err) {
          throw promiseUtils.toBackground(c.closeAsync()), err;
        }
        return c;
      }
      /**
       * Gets the info from local and peer metadata, reloads the keyspaces metadata and rebuilds tokens.
       * <p>It throws an error when there's a failure or when reconnecting and there's no connection.</p>
       * @param {Boolean} initializing Determines whether this function was called in order to initialize the control
       * connection the first time
       * @param {Boolean} isReconnecting Determines whether the refresh is being done because the ControlConnection is
       * switching to use this connection to this host.
       */
      async _refreshHosts(initializing, isReconnecting) {
        let c = this.connection;
        if (!c) {
          if (isReconnecting)
            throw new errors.DriverInternalError("Connection reference has been lost when reconnecting");
          return;
        }
        this.log("info", "Refreshing local and peers info");
        let rsLocal = await c.send(new requests.QueryRequest(selectLocal), null);
        if (this._setLocalInfo(initializing, isReconnecting, c, rsLocal), !this.host)
          throw new errors.DriverInternalError("Information from system.local could not be retrieved");
        let rsPeers = await c.send(new requests.QueryRequest(selectPeers), null);
        if (await this.setPeersInfo(initializing, rsPeers), !this.initialized) {
          let highestCommon = types.protocolVersion.getHighestCommon(c, this.hosts), reconnect = highestCommon !== this.protocolVersion;
          if (this.protocolVersion = highestCommon, this.hosts.forEach((h) => h.setProtocolVersion(this.protocolVersion)), reconnect) {
            this.log("info", `Reconnecting since the protocol version changed to 0x${highestCommon.toString(16)}`), c.decreaseVersion(this.protocolVersion), await c.closeAsync();
            try {
              await c.openAsync();
            } catch (err) {
              throw promiseUtils.toBackground(c.closeAsync()), err;
            }
          }
          if (this.metadata.setCassandraVersion(this.host.getCassandraVersion()), this.metadata.buildTokens(this.hosts), !this.options.isMetadataSyncEnabled) {
            this.metadata.initialized = !0;
            return;
          }
          await this.metadata.refreshKeyspacesInternal(!1), this.metadata.initialized = !0;
        }
      }
      async _refreshControlConnection(hostIterator) {
        if (this.options.sni)
          this.connection = this._borrowAConnection(hostIterator);
        else
          try {
            this.connection = this._borrowAConnection(hostIterator);
          } catch {
            this.log("info", "ControlConnection could not reconnect using existing connections.  Refreshing contact points and retrying"), this._contactPoints.clear(), this._resolvedContactPoints.clear(), await Promise.all(this.options.contactPoints.map((name) => this._parseContactPoint(name)));
            let refreshedContactPoints = Array.from(this._contactPoints).join(",");
            this.log("info", `Refreshed contact points: ${refreshedContactPoints}`), await this._initializeConnection();
          }
      }
      /**
       * Acquires a new connection and refreshes topology and keyspace metadata.
       * <p>When it fails obtaining a connection and there aren't any more hosts, it schedules reconnection.</p>
       * <p>When it fails obtaining the metadata, it marks connection and/or host unusable and retries using the same
       * iterator from query plan / host list</p>
       * @param {Iterator<Host>} [hostIterator]
       */
      async _refresh(hostIterator) {
        if (this._isShuttingDown) {
          this.log("info", "The ControlConnection will not be refreshed as the Client is being shutdown");
          return;
        }
        this.host = null, this.connection = null;
        try {
          hostIterator || (this.log("info", "Trying to acquire a connection to a new host"), this._triedHosts = {}, hostIterator = await promiseUtils.newQueryPlan(this._profileManager.getDefaultLoadBalancing(), null, null)), await this._refreshControlConnection(hostIterator);
        } catch (err) {
          if (this.log("error", "ControlConnection failed to acquire a connection", err), !this._isShuttingDown) {
            let delay = this._reconnectionSchedule.next().value;
            this.log("warning", `ControlConnection could not reconnect, scheduling reconnection in ${delay}ms`), setTimeout(() => this._refresh(), delay), this.emit("newConnection", err);
          }
          return;
        }
        this.log("info", `ControlConnection connected to ${this.connection.endpointFriendlyName}`);
        try {
          await this._refreshHosts(!1, !0), await this._registerToConnectionEvents();
        } catch (err) {
          return this.log("error", "ControlConnection failed to retrieve topology and keyspaces information", err), this._triedHosts[this.connection.endpoint] = err, err.isSocketError && this.host && this.host.removeFromPool(this.connection), await this._refresh(hostIterator);
        }
        this._reconnectionSchedule = this._reconnectionPolicy.newSchedule(), this._setHealthListeners(this.host, this.connection), this.emit("newConnection", null, this.connection, this.host), this.log("info", `ControlConnection connected to ${this.connection.endpointFriendlyName} and up to date`);
      }
      /**
       * Acquires a connection and refreshes topology and keyspace metadata for the first time.
       * @returns {Promise<void>}
       */
      async _initializeConnection() {
        this.log("info", "Getting first connection"), this.host = null, this.connection = null, this._triedHosts = {};
        let contactPointsIterator = utils.shuffleArray(Array.from(this._contactPoints))[Symbol.iterator]();
        for (; ; ) {
          await this._borrowFirstConnection(contactPointsIterator), this.log("info", `ControlConnection using protocol version 0x${this.protocolVersion.toString(16)}, connected to ${this.connection.endpointFriendlyName}`);
          try {
            await this._getSupportedOptions(), await this._refreshHosts(!0, !0), await this._registerToConnectionEvents();
            break;
          } catch (err) {
            this.log("error", "ControlConnection failed to retrieve topology and keyspaces information", err), this._triedHosts[this.connection.endpoint] = err;
          }
        }
        this.host.pool.addExistingConnection(this.connection), this.initialized = !0, this._setHealthListeners(this.host, this.connection), this.log("info", `ControlConnection connected to ${this.connection.endpointFriendlyName}`);
      }
      async _getSupportedOptions() {
        let response = await this.connection.send(requests.options, null), productType = response.supported && response.supported[supportedProductTypeKey];
        Array.isArray(productType) && productType[0] === supportedDbaas && this.metadata.setProductTypeAsDbaas();
      }
      async _registerToConnectionEvents() {
        this.connection.on("nodeTopologyChange", this._nodeTopologyChangeHandler.bind(this)), this.connection.on("nodeStatusChange", this._nodeStatusChangeHandler.bind(this)), this.connection.on("nodeSchemaChange", this._nodeSchemaChangeHandler.bind(this));
        let request = new requests.RegisterRequest(["TOPOLOGY_CHANGE", "STATUS_CHANGE", "SCHEMA_CHANGE"]);
        await this.connection.send(request, null);
      }
      /**
       * Handles a TOPOLOGY_CHANGE event
       */
      _nodeTopologyChangeHandler(event) {
        this.log("info", "Received topology change", event), clearTimeout(this._topologyChangeTimeout), this._topologyChangeTimeout = setTimeout(() => promiseUtils.toBackground(this._scheduleRefreshHosts()), newNodeDelay);
      }
      /**
       * Handles a STATUS_CHANGE event
       */
      _nodeStatusChangeHandler(event) {
        let self = this, addressToTranslate = event.inet.address.toString(), port = this.options.protocolOptions.port;
        this._addressTranslator.translate(addressToTranslate, port, function(endPoint) {
          let host = self.hosts.get(endPoint);
          if (!host) {
            self.log("warning", "Received status change event but host was not found: " + addressToTranslate);
            return;
          }
          let distance = self._profileManager.getDistance(host);
          if (event.up) {
            if (distance === types.distance.ignored)
              return host.setUp(!0);
            clearTimeout(self._nodeStatusChangeTimeout), self._nodeStatusChangeTimeout = setTimeout(() => host.checkIsUp(), newNodeDelay);
            return;
          }
          if (distance === types.distance.ignored)
            return host.setDown();
          self.log("warning", "Received status change to DOWN for host " + host.address);
        });
      }
      /**
       * Handles a SCHEMA_CHANGE event
       */
      _nodeSchemaChangeHandler(event) {
        this.log("info", "Schema change", event), this.options.isMetadataSyncEnabled && promiseUtils.toBackground(this.handleSchemaChange(event, !1));
      }
      /**
       * Schedules metadata refresh and callbacks when is refreshed.
       * @param {{keyspace: string, isKeyspace: boolean, schemaChangeType, table, udt, functionName, aggregate}} event
       * @param {Boolean} processNow
       * @returns {Promise<void>}
       */
      handleSchemaChange(event, processNow) {
        let self = this, handler, cqlObject;
        if (event.isKeyspace)
          return event.schemaChangeType === schemaChangeTypes.dropped ? (handler = function() {
            delete self.metadata.keyspaces[event.keyspace];
          }, this._scheduleObjectRefresh(handler, event.keyspace, null, processNow)) : this._scheduleKeyspaceRefresh(event.keyspace, processNow);
        let ksInfo = this.metadata.keyspaces[event.keyspace];
        return !ksInfo || (event.table ? (cqlObject = event.table, handler = function() {
          delete ksInfo.tables[event.table], delete ksInfo.views[event.table];
        }) : event.udt ? (cqlObject = event.udt, handler = function() {
          delete ksInfo.udts[event.udt];
        }) : event.functionName ? (cqlObject = event.functionName, handler = function() {
          delete ksInfo.functions[event.functionName];
        }) : event.aggregate && (cqlObject = event.aggregate, handler = function() {
          delete ksInfo.aggregates[event.aggregate];
        }), !handler) ? Promise.resolve() : this._scheduleObjectRefresh(handler, event.keyspace, cqlObject, processNow);
      }
      /**
       * @param {Function} handler
       * @param {String} keyspace
       * @param {String} cqlObject
       * @param {Boolean} processNow
       * @returns {Promise<void>}
       */
      _scheduleObjectRefresh(handler, keyspace, cqlObject, processNow) {
        return this._debouncer.eventReceived({ handler, keyspace, cqlObject }, processNow);
      }
      /**
       * @param {String} keyspace
       * @param {Boolean} processNow
       * @returns {Promise<void>}
       */
      _scheduleKeyspaceRefresh(keyspace, processNow) {
        return this._debouncer.eventReceived({
          handler: () => this.metadata.refreshKeyspace(keyspace),
          keyspace
        }, processNow);
      }
      /** @returns {Promise<void>} */
      _scheduleRefreshHosts() {
        return this._debouncer.eventReceived({
          handler: () => this._refreshHosts(!1, !1),
          all: !0
        }, !1);
      }
      /**
       * Sets the information for the host used by the control connection.
       * @param {Boolean} initializing
       * @param {Connection} c
       * @param {Boolean} setCurrentHost Determines if the host retrieved must be set as the current host
       * @param result
       */
      _setLocalInfo(initializing, setCurrentHost, c, result) {
        if (!result || !result.rows || !result.rows.length) {
          this.log("warning", "No local info could be obtained");
          return;
        }
        let row = result.rows[0], localHost, endpoint = this.options.sni ? `${row.rpc_address}:${this.options.protocolOptions.port}` : c.endpoint;
        if (initializing)
          localHost = new Host(endpoint, this.protocolVersion, this.options, this.metadata), this.hosts.set(endpoint, localHost), this.log("info", `Adding host ${endpoint}`);
        else if (localHost = this.hosts.get(endpoint), !localHost) {
          this.log("error", "Localhost could not be found");
          return;
        }
        localHost.datacenter = row.data_center, localHost.rack = row.rack, localHost.tokens = row.tokens, localHost.hostId = row.host_id, localHost.cassandraVersion = row.release_version, setDseParameters(localHost, row), this.metadata.setPartitioner(row.partitioner), this.log("info", "Local info retrieved"), setCurrentHost && (this.host = localHost);
      }
      /**
       * @param {Boolean} initializing Determines whether this function was called in order to initialize the control
       * connection the first time.
       * @param {ResultSet} result
       */
      async setPeersInfo(initializing, result) {
        if (!result || !result.rows)
          return;
        let peers = {}, port = this.options.protocolOptions.port, foundDataCenters = /* @__PURE__ */ new Set();
        this.host && this.host.datacenter && foundDataCenters.add(this.host.datacenter);
        for (let row of result.rows) {
          let endpoint = await this.getAddressForPeerHost(row, port);
          if (!endpoint)
            continue;
          peers[endpoint] = !0;
          let host = this.hosts.get(endpoint), isNewHost = !host;
          isNewHost && (host = new Host(endpoint, this.protocolVersion, this.options, this.metadata), this.log("info", `Adding host ${endpoint}`), isNewHost = !0), host.datacenter = row.data_center, host.rack = row.rack, host.tokens = row.tokens, host.hostId = row.host_id, host.cassandraVersion = row.release_version, setDseParameters(host, row), host.datacenter && foundDataCenters.add(host.datacenter), isNewHost && (this.hosts.set(endpoint, host), initializing || (this._profileManager.getDistance(host), host.setDown()));
        }
        if (this.hosts.length > result.rows.length + 1) {
          this.log("info", "Removing nodes from the pool");
          let toRemove = [];
          this.hosts.forEach((h) => {
            !peers[h.address] && h !== this.host && (this.log("info", "Removing host " + h.address), toRemove.push(h.address), h.shutdown(!0));
          }), this.hosts.removeMultiple(toRemove);
        }
        if (initializing && this.options.localDataCenter) {
          let localDc = this.options.localDataCenter;
          if (!foundDataCenters.has(localDc))
            throw new errors.ArgumentError(`localDataCenter was configured as '${localDc}', but only found hosts in data centers: [${Array.from(foundDataCenters).join(", ")}]`);
        }
        this.log("info", "Peers info retrieved");
      }
      /**
       * Gets the address from a peers row and translates the address.
       * @param {Object|Row} row
       * @param {Number} defaultPort
       * @returns {Promise<string>}
       */
      getAddressForPeerHost(row, defaultPort) {
        return new Promise((resolve) => {
          let address = row.rpc_address, peer = row.peer, bindAllAddress = "0.0.0.0";
          if (!address)
            return this.log("error", f(
              "No rpc_address found for host %s in %s's peers system table. %s will be ignored.",
              peer,
              this.host.address,
              peer
            )), resolve(null);
          address.toString() === bindAllAddress && (this.log("warning", f("Found host with 0.0.0.0 as rpc_address, using listen_address (%s) to contact it instead. If this is incorrect you should avoid the use of 0.0.0.0 server side.", peer)), address = peer), this._addressTranslator.translate(address.toString(), defaultPort, resolve);
        });
      }
      /**
       * Uses the DNS protocol to resolve a IPv4 and IPv6 addresses (A and AAAA records) for the hostname.
       * It returns an Array of addresses that can be empty and logs the error.
       * @private
       * @param name
       */
      async _resolveAll(name) {
        let addresses = [], resolve4 = util.promisify(dns.resolve4), resolve6 = util.promisify(dns.resolve6), lookup = util.promisify(dns.lookup), ipv4Promise = resolve4(name).catch(() => {
        }).then((r) => r || utils.emptyArray), ipv6Promise = resolve6(name).catch(() => {
        }).then((r) => r || utils.emptyArray), arr;
        if (arr = await ipv4Promise, arr.forEach((address) => addresses.push({ address, isIPv6: !1 })), arr = await ipv6Promise, arr.forEach((address) => addresses.push({ address, isIPv6: !0 })), addresses.length === 0)
          try {
            arr = await lookup(name, { all: !0 }), arr.forEach(({ address, family }) => addresses.push({ address, isIPv6: family === 6 }));
          } catch (err) {
            this.log("error", `Host with name ${name} could not be resolved`, err);
          }
        return addresses;
      }
      /**
       * Waits for a connection to be available. If timeout expires before getting a connection it callbacks in error.
       * @returns {Promise<void>}
       */
      _waitForReconnection() {
        return new Promise((resolve, reject) => {
          let callback = promiseUtils.getCallback(resolve, reject), timeout;
          function newConnectionListener(err) {
            clearTimeout(timeout), callback(err);
          }
          this.once("newConnection", newConnectionListener), timeout = setTimeout(() => {
            this.removeListener("newConnection", newConnectionListener), callback(new errors.OperationTimedOutError("A connection could not be acquired before timeout."));
          }, metadataQueryAbortTimeout);
        });
      }
      /**
       * Executes a query using the active connection
       * @param {String|Request} cqlQuery
       * @param {Boolean} [waitReconnect] Determines if it should wait for reconnection in case the control connection is not
       * connected at the moment. Default: true.
       */
      async query(cqlQuery, waitReconnect = !0) {
        let queryOnConnection = async () => {
          if (!this.connection || this._isShuttingDown)
            throw new errors.NoHostAvailableError({}, "ControlConnection is not connected at the time");
          let request = typeof cqlQuery == "string" ? new requests.QueryRequest(cqlQuery, null, null) : cqlQuery;
          return await this.connection.send(request, null);
        };
        return !this.connection && waitReconnect && await this._waitForReconnection(), await queryOnConnection();
      }
      /** @returns {Encoder} The encoder used by the current connection */
      getEncoder() {
        if (!this._encoder)
          throw new errors.DriverInternalError("Encoder is not defined");
        return this._encoder;
      }
      /**
       * Cancels all timers and shuts down synchronously.
       */
      shutdown() {
        this._isShuttingDown = !0, this._debouncer.shutdown(), this.emit("newConnection", new errors.DriverError("ControlConnection is being shutdown")), clearTimeout(this._topologyChangeTimeout), clearTimeout(this._nodeStatusChangeTimeout);
      }
      /**
       * Resets the Connection to its initial state.
       */
      async reset() {
        let currentHosts = this.hosts.clear();
        this._isShuttingDown = !0, await Promise.all(currentHosts.map((h) => h.shutdown())), this.initialized = !1, this._isShuttingDown = !1;
      }
      /**
       * Gets a Map containing the original contact points and the addresses that each one resolved to.
       */
      getResolvedContactPoints() {
        return this._resolvedContactPoints;
      }
      /**
       * Gets the local IP address to which the control connection socket is bound to.
       * @returns {String|undefined}
       */
      getLocalAddress() {
        if (this.connection)
          return this.connection.getLocalAddress();
      }
      /**
       * Gets the address and port of host the control connection is connected to.
       * @returns {String|undefined}
       */
      getEndpoint() {
        if (this.connection)
          return this.connection.endpoint;
      }
    };
    function setDseParameters(host, row) {
      row.workloads !== void 0 ? host.workloads = row.workloads : row.workload ? host.workloads = [row.workload] : host.workloads = utils.emptyArray, row.dse_version !== void 0 && (host.dseVersion = row.dse_version);
    }
    module2.exports = ControlConnection;
  }
});

// node_modules/cassandra-driver/lib/request-execution.js
var require_request_execution = __commonJS({
  "node_modules/cassandra-driver/lib/request-execution.js"(exports2, module2) {
    "use strict";
    var errors = require_errors(), requests = require_requests(), retry = require_retry(), types = require_types(), utils = require_utils(), promiseUtils = require_promise_utils(), retryOnCurrentHost = Object.freeze({
      decision: retry.RetryPolicy.retryDecision.retry,
      useCurrentHost: !0,
      consistency: void 0
    }), rethrowDecision = Object.freeze({ decision: retry.RetryPolicy.retryDecision.rethrow }), errorCodes = {
      none: 0,
      // Socket error
      socketError: 1,
      // Socket error before the request was written to the wire
      socketErrorBeforeRequestWritten: 2,
      // OperationTimedOutError
      clientTimeout: 3,
      // Response error "unprepared"
      serverErrorUnprepared: 4,
      // Response error "overloaded", "is_bootstrapping" and "truncateError":
      serverErrorOverloaded: 5,
      serverErrorReadTimeout: 6,
      serverErrorUnavailable: 7,
      serverErrorWriteTimeout: 8,
      // Any other server error (different from the ones detailed above)
      serverErrorOther: 9
    }, metricsHandlers = /* @__PURE__ */ new Map([
      [errorCodes.none, (metrics, err, latency) => metrics.onSuccessfulResponse(latency)],
      [errorCodes.socketError, (metrics, err) => metrics.onConnectionError(err)],
      [errorCodes.clientTimeout, (metrics, err) => metrics.onClientTimeoutError(err)],
      [errorCodes.serverErrorOverloaded, (metrics, err) => metrics.onOtherError(err)],
      [errorCodes.serverErrorReadTimeout, (metrics, err) => metrics.onReadTimeoutError(err)],
      [errorCodes.serverErrorUnavailable, (metrics, err) => metrics.onUnavailableError(err)],
      [errorCodes.serverErrorWriteTimeout, (metrics, err) => metrics.onWriteTimeoutError(err)],
      [errorCodes.serverErrorOther, (metrics, err) => metrics.onOtherError(err)]
    ]), metricsRetryHandlers = /* @__PURE__ */ new Map([
      [errorCodes.socketError, (metrics, err) => metrics.onOtherErrorRetry(err)],
      [errorCodes.clientTimeout, (metrics, err) => metrics.onClientTimeoutRetry(err)],
      [errorCodes.serverErrorOverloaded, (metrics, err) => metrics.onOtherErrorRetry(err)],
      [errorCodes.serverErrorReadTimeout, (metrics, err) => metrics.onReadTimeoutRetry(err)],
      [errorCodes.serverErrorUnavailable, (metrics, err) => metrics.onUnavailableRetry(err)],
      [errorCodes.serverErrorWriteTimeout, (metrics, err) => metrics.onWriteTimeoutRetry(err)],
      [errorCodes.serverErrorOther, (metrics, err) => metrics.onOtherErrorRetry(err)]
    ]), RequestExecution = class _RequestExecution {
      /**
       * Encapsulates a single flow of execution against a coordinator, handling individual retries and failover.
       * @param {RequestHandler!} parent
       * @param {Host!} host
       * @param {Connection!} connection
       */
      constructor(parent, host, connection) {
        this._parent = parent, this._operation = null, this._host = host, this._connection = connection, this._cancelled = !1, this._startTime = null, this._retryCount = 0, this._request = this._parent.request, parent.speculativeExecutions++;
      }
      /**
       * Sends the request using the active connection.
       */
      start() {
        this._sendOnConnection();
      }
      /**
       * Borrows the next connection available using the query plan and sends the request.
       * @returns {Promise<void>}
       */
      async restart() {
        try {
          let { host, connection } = this._parent.getNextConnection();
          this._connection = connection, this._host = host;
        } catch (err) {
          return this._parent.handleNoHostAvailable(err, this);
        }
        let keyspace = this._parent.client.keyspace;
        if (keyspace && keyspace !== this._connection.keyspace)
          try {
            await this._connection.changeKeyspace(keyspace);
          } catch (err) {
            return this._handleError(_RequestExecution._getErrorCode(err), err);
          }
        this._cancelled || this._sendOnConnection();
      }
      /**
       * Sends the request using the active connection.
       * @private
       */
      _sendOnConnection() {
        this._startTime = process.hrtime(), this._operation = this._connection.sendStream(this._request, this._parent.executionOptions, (err, response, length) => {
          let errorCode = _RequestExecution._getErrorCode(err);
          if (this._trackResponse(process.hrtime(this._startTime), errorCode, err, length), !this._cancelled) {
            if (errorCode !== errorCodes.none)
              return this._handleError(errorCode, err);
            if (response.schemaChange)
              return promiseUtils.toBackground(
                this._parent.client.handleSchemaAgreementAndRefresh(this._connection, response.schemaChange).then((agreement) => {
                  this._cancelled || this._parent.setCompleted(null, this._getResultSet(response, agreement));
                })
              );
            if (response.keyspaceSet && (this._parent.client.keyspace = response.keyspaceSet), response.meta && response.meta.newResultId && this._request.queryId) {
              let info = this._parent.client.metadata.getPreparedById(this._request.queryId);
              info.meta.resultId = response.meta.newResultId;
            }
            this._parent.setCompleted(null, this._getResultSet(response));
          }
        });
      }
      _trackResponse(latency, errorCode, err, length) {
        _RequestExecution._invokeMetricsHandler(errorCode, this._parent.client.metrics, err, latency);
        let tracker = this._parent.client.options.requestTracker;
        if (tracker === null)
          return;
        let query = this._request.query || this._request.queries, parameters = this._request.params, requestLength = this._request.length;
        err ? tracker.onError(this._host, query, parameters, this._parent.executionOptions, requestLength, err, latency) : tracker.onSuccess(this._host, query, parameters, this._parent.executionOptions, requestLength, length, latency);
      }
      _getResultSet(response, agreement) {
        let rs = new types.ResultSet(
          response,
          this._host.address,
          this._parent.triedHosts,
          this._parent.speculativeExecutions,
          this._request.consistency,
          agreement === void 0 || agreement
        );
        return rs.rawPageState && (rs.nextPageAsync = this._parent.getNextPageHandler()), rs;
      }
      /**
       * Gets the method of the {ClientMetrics} instance depending on the error code and invokes it.
       * @param {Number} errorCode
       * @param {ClientMetrics} metrics
       * @param {Error} err
       * @param {Array} latency
       * @private
       */
      static _invokeMetricsHandler(errorCode, metrics, err, latency) {
        let handler = metricsHandlers.get(errorCode);
        handler !== void 0 && handler(metrics, err, latency), (!err || err instanceof errors.ResponseError) && metrics.onResponse(latency);
      }
      /**
       * Gets the method of the {ClientMetrics} instance related to retry depending on the error code and invokes it.
       * @param {Number} errorCode
       * @param {ClientMetrics} metrics
       * @param {Error} err
       * @private
       */
      static _invokeMetricsHandlerForRetry(errorCode, metrics, err) {
        let handler = metricsRetryHandlers.get(errorCode);
        handler !== void 0 && handler(metrics, err);
      }
      /**
       * Allows the handler to cancel the current request.
       * When the request has been already written, we can unset the callback and forget about it.
       */
      cancel() {
        this._cancelled = !0, this._operation !== null && this._operation.cancel();
      }
      /**
       * Determines if the current execution was cancelled.
       */
      wasCancelled() {
        return this._cancelled;
      }
      _handleError(errorCode, err) {
        if (this._parent.triedHosts[this._host.address] = err, err.coordinator = this._host.address, errorCode === errorCodes.serverErrorUnprepared)
          return this._prepareAndRetry(err.queryId);
        errorCode === errorCodes.socketError || errorCode === errorCodes.socketErrorBeforeRequestWritten ? this._host.removeFromPool(this._connection) : errorCode === errorCodes.clientTimeout && (this._parent.log("warning", err.message), this._host.checkHealth(this._connection));
        let decisionInfo = this._getDecision(errorCode, err);
        if (!decisionInfo || decisionInfo.decision === retry.RetryPolicy.retryDecision.rethrow)
          return (this._request instanceof requests.QueryRequest || this._request instanceof requests.ExecuteRequest) && (err.query = this._request.query), this._parent.setCompleted(err);
        let metrics = this._parent.client.metrics;
        return decisionInfo.decision === retry.RetryPolicy.retryDecision.ignore ? (metrics.onIgnoreError(err), this._parent.setCompleted(null, this._getResultSet(utils.emptyObject))) : (_RequestExecution._invokeMetricsHandlerForRetry(errorCode, metrics, err), this._retry(decisionInfo.consistency, decisionInfo.useCurrentHost));
      }
      /**
       * Gets a decision whether or not to retry based on the error information.
       * @param {Number} errorCode
       * @param {Error} err
       * @returns {{decision, useCurrentHost, consistency}}
       */
      _getDecision(errorCode, err) {
        let operationInfo = {
          query: this._request && this._request.query,
          executionOptions: this._parent.executionOptions,
          nbRetry: this._retryCount
        }, retryPolicy = operationInfo.executionOptions.getRetryPolicy();
        switch (errorCode) {
          case errorCodes.socketErrorBeforeRequestWritten:
            return retryOnCurrentHost;
          case errorCodes.socketError:
          case errorCodes.clientTimeout:
          case errorCodes.serverErrorOverloaded:
            return operationInfo.executionOptions.isIdempotent() ? retryPolicy.onRequestError(operationInfo, this._request.consistency, err) : rethrowDecision;
          case errorCodes.serverErrorUnavailable:
            return retryPolicy.onUnavailable(operationInfo, err.consistencies, err.required, err.alive);
          case errorCodes.serverErrorReadTimeout:
            return retryPolicy.onReadTimeout(
              operationInfo,
              err.consistencies,
              err.received,
              err.blockFor,
              err.isDataPresent
            );
          case errorCodes.serverErrorWriteTimeout:
            return operationInfo.executionOptions.isIdempotent() ? retryPolicy.onWriteTimeout(
              operationInfo,
              err.consistencies,
              err.received,
              err.blockFor,
              err.writeType
            ) : rethrowDecision;
          default:
            return rethrowDecision;
        }
      }
      static _getErrorCode(err) {
        if (!err)
          return errorCodes.none;
        if (err.isSocketError)
          return err.requestNotWritten ? errorCodes.socketErrorBeforeRequestWritten : errorCodes.socketError;
        if (err instanceof errors.OperationTimedOutError)
          return errorCodes.clientTimeout;
        if (err instanceof errors.ResponseError)
          switch (err.code) {
            case types.responseErrorCodes.overloaded:
            case types.responseErrorCodes.isBootstrapping:
            case types.responseErrorCodes.truncateError:
              return errorCodes.serverErrorOverloaded;
            case types.responseErrorCodes.unavailableException:
              return errorCodes.serverErrorUnavailable;
            case types.responseErrorCodes.readTimeout:
              return errorCodes.serverErrorReadTimeout;
            case types.responseErrorCodes.writeTimeout:
              return errorCodes.serverErrorWriteTimeout;
            case types.responseErrorCodes.unprepared:
              return errorCodes.serverErrorUnprepared;
          }
        return errorCodes.serverErrorOther;
      }
      /**
       * @param {Number|undefined} consistency
       * @param {Boolean} useCurrentHost
       * @param {Object} [meta]
       * @private
       */
      _retry(consistency, useCurrentHost, meta) {
        if (!this._cancelled) {
          if (this._parent.log("info", "Retrying request"), this._retryCount++, (meta || typeof consistency == "number" && this._request.consistency !== consistency) && (this._request = this._request.clone(), typeof consistency == "number" && (this._request.consistency = consistency), meta && (this._request.meta = meta)), useCurrentHost !== !1) {
            try {
              this._connection = this._host.borrowConnection(this._connection);
            } catch {
              return promiseUtils.toBackground(this.restart());
            }
            return this._sendOnConnection();
          }
          promiseUtils.toBackground(this.restart());
        }
      }
      /**
       * Issues a PREPARE request on the current connection.
       * If there's a socket or timeout issue, it moves to next host and executes the original request.
       * @param {Buffer} queryId
       * @private
       */
      _prepareAndRetry(queryId) {
        let connection = this._connection;
        this._parent.log(
          "info",
          `Query 0x${queryId.toString("hex")} not prepared on host ${connection.endpointFriendlyName}, preparing and retrying`
        );
        let info = this._parent.client.metadata.getPreparedById(queryId);
        if (!info)
          return this._parent.setCompleted(new errors.DriverInternalError(
            `Unprepared response invalid, id: 0x${queryId.toString("hex")}`
          ));
        let version = this._connection.protocolVersion;
        if (!types.protocolVersion.supportsKeyspaceInRequest(version) && info.keyspace && info.keyspace !== connection.keyspace)
          return this._parent.setCompleted(
            new Error(`Query was prepared on keyspace ${info.keyspace}, can't execute it on ${connection.keyspace} (${info.query})`)
          );
        let self = this;
        this._connection.prepareOnce(info.query, info.keyspace, function(err, result) {
          if (err)
            return !err.isSocketError && err instanceof errors.OperationTimedOutError && self._parent.log(
              "warning",
              `Unexpected timeout error when re-preparing query on host ${connection.endpointFriendlyName}`
            ), self._retry(void 0, !1);
          info.meta = result.meta, self._retry(void 0, !0, result.meta);
        });
      }
    };
    module2.exports = RequestExecution;
  }
});

// node_modules/cassandra-driver/lib/request-handler.js
var require_request_handler = __commonJS({
  "node_modules/cassandra-driver/lib/request-handler.js"(exports2, module2) {
    "use strict";
    var util = require("util"), errors = require_errors(), types = require_types(), utils = require_utils(), RequestExecution = require_request_execution(), promiseUtils = require_promise_utils(), RequestHandler = class _RequestHandler {
      /**
       * Creates a new instance of RequestHandler.
       * @param {Request} request
       * @param {ExecutionOptions} execOptions
       * @param {Client} client Client instance used to retrieve and set the keyspace.
       */
      constructor(request, execOptions, client) {
        this.client = client, this._speculativeExecutionPlan = client.options.policies.speculativeExecution.newPlan(
          client.keyspace,
          request.query || request.queries
        ), this.logEmitter = client.options.logEmitter, this.log = utils.log, this.request = request, this.executionOptions = execOptions, this.stackContainer = null, this.triedHosts = {}, this.speculativeExecutions = -1, this._hostIterator = null, this._resolveCallback = null, this._rejectCallback = null, this._newExecutionTimeout = null, this._executions = [];
      }
      /**
       * Sends a new BATCH, QUERY or EXECUTE request.
       * @param {Request} request
       * @param {ExecutionOptions} execOptions
       * @param {Client} client Client instance used to retrieve and set the keyspace.
       * @returns {Promise<ResultSet>}
       */
      static send(request, execOptions, client) {
        return new _RequestHandler(request, execOptions, client).send();
      }
      /**
       * Gets a connection from the next host according to the query plan or throws a NoHostAvailableError.
       * @returns {{host, connection}}
       * @throws {NoHostAvailableError}
       */
      getNextConnection() {
        let host, connection, iterator = this._hostIterator;
        for (; ; ) {
          let item = iterator.next();
          if (item.done)
            throw new errors.NoHostAvailableError(this.triedHosts);
          if (host = item.value, this.client.profileManager.getDistance(host) !== types.distance.ignored) {
            if (!host.isUp()) {
              this.triedHosts[host.address] = "Host considered as DOWN";
              continue;
            }
            try {
              connection = host.borrowConnection(), this.triedHosts[host.address] = null;
              break;
            } catch (err) {
              this.triedHosts[host.address] = err;
            }
          }
        }
        return { connection, host };
      }
      /**
       * Gets an available connection and sends the request
       * @returns {Promise<ResultSet>}
       */
      send() {
        return this.executionOptions.getCaptureStackTrace() && Error.captureStackTrace(this.stackContainer = {}), new Promise((resolve, reject) => {
          this._resolveCallback = resolve, this._rejectCallback = reject;
          let lbp = this.executionOptions.getLoadBalancingPolicy(), fixedHost = this.executionOptions.getFixedHost();
          fixedHost ? (this._hostIterator = utils.arrayIterator([fixedHost]), promiseUtils.toBackground(this._startNewExecution())) : lbp.newQueryPlan(this.client.keyspace, this.executionOptions, (err, iterator) => {
            if (err)
              return reject(err);
            this._hostIterator = iterator, promiseUtils.toBackground(this._startNewExecution());
          });
        });
      }
      /**
       * Starts a new execution on the next host of the query plan.
       * @param {Boolean} [isSpecExec]
       * @returns {Promise<void>}
       * @private
       */
      async _startNewExecution(isSpecExec) {
        isSpecExec && this.client.metrics.onSpeculativeExecution();
        let host, connection;
        try {
          ({ host, connection } = this.getNextConnection());
        } catch (err) {
          return this.handleNoHostAvailable(err, null);
        }
        if (isSpecExec && this._executions.length >= 0 && this._executions[0].wasCancelled())
          return;
        if (this.client.keyspace && this.client.keyspace !== connection.keyspace)
          try {
            await connection.changeKeyspace(this.client.keyspace);
          } catch (err) {
            return this.triedHosts[host.address] = err, this._startNewExecution(isSpecExec);
          }
        let execution = new RequestExecution(this, host, connection);
        this._executions.push(execution), execution.start(), this.executionOptions.isIdempotent() && this._scheduleSpeculativeExecution(host);
      }
      /**
       * Schedules next speculative execution, if any.
       * @param {Host!} host
       * @private
       */
      _scheduleSpeculativeExecution(host) {
        let delay = this._speculativeExecutionPlan.nextExecution(host);
        if (!(typeof delay != "number" || delay < 0)) {
          if (delay === 0)
            return process.nextTick(() => {
              promiseUtils.toBackground(this._startNewExecution(!0));
            });
          this._newExecutionTimeout = setTimeout(() => promiseUtils.toBackground(this._startNewExecution(!0)), delay);
        }
      }
      /**
       * Sets the keyspace in any connection that is already opened.
       * @param {Client} client
       * @returns {Promise}
       */
      static setKeyspace(client) {
        let connection;
        for (let host of client.hosts.values())
          if (connection = host.getActiveConnection(), connection)
            break;
        if (!connection)
          throw new errors.DriverInternalError("No active connection found");
        return connection.changeKeyspace(client.keyspace);
      }
      /**
       * @param {Error} err
       * @param {ResultSet} [result]
       */
      setCompleted(err, result) {
        this._newExecutionTimeout !== null && clearTimeout(this._newExecutionTimeout);
        for (let execution of this._executions)
          execution.cancel();
        if (err)
          return this.executionOptions.getCaptureStackTrace() && utils.fixStack(this.stackContainer.stack, err), this._rejectCallback(err);
        result.info.warnings && result.info.warnings.forEach(function(message, i, warnings) {
          this.log("warning", util.format(
            'Received warning (%d of %d) "%s" for "%s"',
            i + 1,
            warnings.length,
            message,
            this.request.query || "batch"
          ));
        }, this), this._resolveCallback(result);
      }
      /**
       * @param {NoHostAvailableError} err
       * @param {RequestExecution|null} execution
       */
      handleNoHostAvailable(err, execution) {
        if (execution !== null) {
          let index = this._executions.indexOf(execution);
          this._executions.splice(index, 1);
        }
        this._executions.length === 0 && this.setCompleted(err);
      }
      /**
       * Gets a long lived closure that can fetch the next page.
       * @returns {Function}
       */
      getNextPageHandler() {
        let request = this.request, execOptions = this.executionOptions, client = this.client;
        return function(pageState) {
          return execOptions.setPageState(pageState), new _RequestHandler(request, execOptions, client).send();
        };
      }
    };
    module2.exports = RequestHandler;
  }
});

// node_modules/cassandra-driver/lib/insights-client.js
var require_insights_client = __commonJS({
  "node_modules/cassandra-driver/lib/insights-client.js"(exports2, module2) {
    "use strict";
    var os = require("os"), path = require("path"), fs = require("fs"), utils = require_utils(), promiseUtils = require_promise_utils(), types = require_types(), requests = require_requests(), { ExecutionOptions } = require_execution_options(), packageInfo = require_package(), VersionNumber = require_version_number(), { NoAuthProvider } = require_auth(), kerberosModule;
    try {
      kerberosModule = require("kerberos");
    } catch {
    }
    var minDse6Version = new VersionNumber(6, 0, 5), minDse51Version = new VersionNumber(5, 1, 13), dse600Version = new VersionNumber(6, 0, 0), rpc = "CALL InsightsRpc.reportInsight(?)", maxStatusErrorLogs = 5, InsightsClient = class {
      /**
       * Creates a new instance of the {@link InsightsClient} using the driver {@link Client}.
       * @param {Client} client
       * @param {Object} [options]
       * @param {Number} [options.statusEventDelay]
       * @param {Function} [options.errorCallback]
       */
      constructor(client, options) {
        this._client = client, this._sessionId = types.Uuid.random().toString(), this._enabled = !1, this._closed = !1, this._firstTimeout = null, this._recurrentTimeout = null, this._statusErrorLogs = 0, options = options || {}, this._statusEventDelay = options.statusEventDelay || 3e5, this._errorCallback = options.errorCallback || utils.noop;
      }
      /**
       * Initializes the insights client in the background by sending the startup event and scheduling status events at
       * regular intervals.
       * @returns {undefined}
       */
      init() {
        this._enabled = this._client.options.monitorReporting.enabled && this._dseSupportsInsights(), this._enabled && promiseUtils.toBackground(this._init());
      }
      async _init() {
        try {
          if (await this._sendStartupEvent(), this._closed)
            return;
          let firstDelay = Math.floor(this._statusEventDelay - 0.1 * this._statusEventDelay * Math.random());
          this._firstTimeout = setTimeout(() => {
            this._sendStatusEvent(), this._recurrentTimeout = setInterval(() => this._sendStatusEvent(), this._statusEventDelay);
          }, firstDelay);
        } catch (err) {
          if (this._closed)
            return;
          this._client.log("verbose", `Insights startup message could not be sent (${err})`, err), this._errorCallback(err);
        }
      }
      /**
       * Sends the startup event.
       * @returns {Promise}
       * @private
       */
      async _sendStartupEvent() {
        let message = await this._getStartupMessage(), request = new requests.QueryRequest(rpc, [message], ExecutionOptions.empty());
        await this._client.controlConnection.query(request, !1);
      }
      /**
       * Sends the status event.
       * @returns {Promise} A promise that is never rejected.
       * @private
       */
      async _sendStatusEvent() {
        let request = new requests.QueryRequest(rpc, [this._getStatusEvent()], ExecutionOptions.empty());
        try {
          await this._client.controlConnection.query(request, !1);
        } catch (err) {
          if (this._closed)
            return;
          this._statusErrorLogs < maxStatusErrorLogs && (this._client.log("warning", `Insights status message could not be sent (${err})`, err), this._statusErrorLogs++), this._errorCallback(err);
        }
      }
      /**
       * Validates the minimum server version for all nodes in the cluster.
       * @private
       */
      _dseSupportsInsights() {
        return this._client.hosts.length === 0 ? !1 : this._client.hosts.values().reduce((acc, host) => {
          if (!acc)
            return acc;
          let versionArr = host.getDseVersion();
          if (versionArr.length === 0)
            return !1;
          let version = new VersionNumber(...versionArr);
          return version.compare(minDse6Version) >= 0 || version.compare(dse600Version) < 0 && version.compare(minDse51Version) >= 0;
        }, !0);
      }
      /**
       * @returns {Promise<String>} Returns a json string with the startup message.
       * @private
       */
      async _getStartupMessage() {
        let cc = this._client.controlConnection, options = this._client.options, appInfo = await this._getAppInfo(options), message = {
          metadata: {
            name: "driver.startup",
            insightMappingId: "v1",
            insightType: "EVENT",
            timestamp: Date.now(),
            tags: { language: "nodejs" }
          },
          data: {
            driverName: packageInfo.description,
            driverVersion: packageInfo.version,
            clientId: options.id,
            sessionId: this._sessionId,
            applicationName: appInfo.applicationName,
            applicationVersion: appInfo.applicationVersion,
            applicationNameWasGenerated: appInfo.applicationNameWasGenerated,
            contactPoints: mapToObject(cc.getResolvedContactPoints()),
            dataCenters: this._getDataCenters(),
            initialControlConnection: cc.host ? cc.host.address : void 0,
            protocolVersion: cc.protocolVersion,
            localAddress: cc.getLocalAddress(),
            hostName: os.hostname(),
            executionProfiles: getExecutionProfiles(this._client),
            poolSizeByHostDistance: {
              local: options.pooling.coreConnectionsPerHost[types.distance.local],
              remote: options.pooling.coreConnectionsPerHost[types.distance.remote]
            },
            heartbeatInterval: options.pooling.heartBeatInterval,
            compression: "NONE",
            reconnectionPolicy: getPolicyInfo(options.policies.reconnection),
            ssl: {
              enabled: !!options.sslOptions,
              certValidation: options.sslOptions ? !!options.sslOptions.rejectUnauthorized : void 0
            },
            authProvider: {
              type: options.authProvider instanceof NoAuthProvider ? void 0 : getConstructor(options.authProvider)
            },
            otherOptions: {
              coalescingThreshold: options.socketOptions.coalescingThreshold
            },
            platformInfo: {
              os: {
                name: os.platform(),
                version: os.release(),
                arch: os.arch()
              },
              cpus: {
                length: os.cpus().length,
                model: os.cpus()[0].model
              },
              runtime: {
                node: process.versions.node,
                v8: process.versions.v8,
                uv: process.versions.uv,
                openssl: process.versions.openssl,
                kerberos: kerberosModule ? kerberosModule.version : void 0
              }
            },
            configAntiPatterns: this._getConfigAntiPatterns(),
            periodicStatusInterval: Math.floor(this._statusEventDelay / 1e3)
          }
        };
        return JSON.stringify(message);
      }
      _getConfigAntiPatterns() {
        let options = this._client.options, result = {};
        return options.sslOptions && !options.sslOptions.rejectUnauthorized && (result.sslWithoutCertValidation = "Client-to-node encryption is enabled but server certificate validation is disabled"), result;
      }
      /**
       * Gets an array of data centers the driver connects to.
       * Whether the driver connects to a certain host is determined by the host distance (local and remote hosts)
       * and the pooling options (whether connection length for remote hosts is greater than 0).
       * @returns {Array}
       * @private
       */
      _getDataCenters() {
        let remoteConnectionsLength = this._client.options.pooling.coreConnectionsPerHost[types.distance.remote], dataCenters = /* @__PURE__ */ new Set();
        return this._client.hosts.values().forEach((h) => {
          let distance = this._client.profileManager.getDistance(h);
          (distance === types.distance.local || distance === types.distance.remote && remoteConnectionsLength > 0) && dataCenters.add(h.datacenter);
        }), Array.from(dataCenters);
      }
      /**
       * Tries to obtain the application name and version from
       * @param {DseClientOptions} options
       * @returns {Promise}
       * @private
       */
      async _getAppInfo(options) {
        if (typeof options.applicationName == "string")
          return Promise.resolve({
            applicationName: options.applicationName,
            applicationVersion: options.applicationVersion,
            applicationNameWasGenerated: !1
          });
        let readPromise = Promise.resolve();
        if (require.main && require.main.filename) {
          let packageInfoPath = path.dirname(require.main.filename);
          readPromise = this._readPackageInfoFile(packageInfoPath);
        }
        let text = await readPromise, applicationName = "Default Node.js Application", applicationVersion;
        if (text)
          try {
            let packageInfo2 = JSON.parse(text);
            packageInfo2.name && (applicationName = packageInfo2.name, applicationVersion = packageInfo2.version);
          } catch {
          }
        return {
          applicationName,
          applicationVersion,
          applicationNameWasGenerated: !0
        };
      }
      /**
       * @private
       * @returns {Promise<string>} A Promise that will never be rejected
       */
      _readPackageInfoFile(packageInfoPath) {
        return new Promise((resolve) => {
          fs.readFile(path.join(packageInfoPath, "package.json"), "utf8", (err, data) => {
            resolve(data);
          });
        });
      }
      /**
       * @returns {String} Returns a json string with the startup message.
       * @private
       */
      _getStatusEvent() {
        let cc = this._client.controlConnection, options = this._client.options, state = this._client.getState(), connectedNodes = {};
        state.getConnectedHosts().forEach((h) => {
          connectedNodes[h.address] = {
            connections: state.getOpenConnections(h),
            inFlightQueries: state.getInFlightQueries(h)
          };
        });
        let message = {
          metadata: {
            name: "driver.status",
            insightMappingId: "v1",
            insightType: "EVENT",
            timestamp: Date.now(),
            tags: { language: "nodejs" }
          },
          data: {
            clientId: options.id,
            sessionId: this._sessionId,
            controlConnection: cc.host ? cc.host.address : void 0,
            connectedNodes
          }
        };
        return JSON.stringify(message);
      }
      /**
       * Cleans any timer used internally and sets the client as closed.
       */
      shutdown() {
        this._enabled && (this._closed = !0, this._firstTimeout !== null && clearTimeout(this._firstTimeout), this._recurrentTimeout !== null && clearInterval(this._recurrentTimeout));
      }
    };
    module2.exports = InsightsClient;
    function mapToObject(map) {
      let result = {};
      return map.forEach((value, key) => result[key] = value), result;
    }
    function getPolicyInfo(policy) {
      if (!policy)
        return;
      let options = policy.getOptions && policy.getOptions();
      return {
        type: policy.constructor.name,
        options: options instanceof Map ? mapToObject(options) : utils.emptyObject
      };
    }
    function getConsistencyString(c) {
      if (typeof c == "number")
        return types.consistencyToString[c];
    }
    function getConstructor(instance) {
      return instance ? instance.constructor.name : void 0;
    }
    function getExecutionProfiles(client) {
      let executionProfiles = {}, defaultProfile = client.profileManager.getDefault();
      return setExecutionProfileProperties(client, executionProfiles, defaultProfile, defaultProfile), client.profileManager.getAll().filter((p) => p !== defaultProfile).forEach((profile) => setExecutionProfileProperties(client, executionProfiles, profile, defaultProfile)), executionProfiles;
    }
    function setExecutionProfileProperties(client, parent, profile, defaultProfile) {
      let output = parent[profile.name] = {};
      if (setExecutionProfileItem(output, profile, defaultProfile, "readTimeout"), setExecutionProfileItem(output, profile, defaultProfile, "loadBalancing", getPolicyInfo), setExecutionProfileItem(output, profile, defaultProfile, "retry", getPolicyInfo), setExecutionProfileItem(output, profile, defaultProfile, "consistency", getConsistencyString), setExecutionProfileItem(output, profile, defaultProfile, "serialConsistency", getConsistencyString), profile === defaultProfile && (output.speculativeExecution = getPolicyInfo(client.options.policies.speculativeExecution)), profile.graphOptions) {
        output.graphOptions = {};
        let defaultGraphOptions = defaultProfile.graphOptions || utils.emptyObject;
        setExecutionProfileItem(output.graphOptions, profile.graphOptions, defaultGraphOptions, "language"), setExecutionProfileItem(output.graphOptions, profile.graphOptions, defaultGraphOptions, "name"), setExecutionProfileItem(
          output.graphOptions,
          profile.graphOptions,
          defaultGraphOptions,
          "readConsistency",
          getConsistencyString
        ), setExecutionProfileItem(output.graphOptions, profile.graphOptions, defaultGraphOptions, "source"), setExecutionProfileItem(
          output.graphOptions,
          profile.graphOptions,
          defaultGraphOptions,
          "writeConsistency",
          getConsistencyString
        ), Object.keys(output.graphOptions).length === 0 && (output.graphOptions = void 0);
      }
    }
    function setExecutionProfileItem(output, profile, defaultProfile, prop, valueGetter) {
      let value = profile[prop];
      valueGetter = valueGetter || ((x) => x), (profile === defaultProfile && value !== void 0 || value !== defaultProfile[prop]) && (output[prop] = valueGetter(value));
    }
  }
});

// node_modules/adm-zip/util/constants.js
var require_constants = __commonJS({
  "node_modules/adm-zip/util/constants.js"(exports2, module2) {
    module2.exports = {
      /* The local file header */
      LOCHDR: 30,
      // LOC header size
      LOCSIG: 67324752,
      // "PK\003\004"
      LOCVER: 4,
      // version needed to extract
      LOCFLG: 6,
      // general purpose bit flag
      LOCHOW: 8,
      // compression method
      LOCTIM: 10,
      // modification time (2 bytes time, 2 bytes date)
      LOCCRC: 14,
      // uncompressed file crc-32 value
      LOCSIZ: 18,
      // compressed size
      LOCLEN: 22,
      // uncompressed size
      LOCNAM: 26,
      // filename length
      LOCEXT: 28,
      // extra field length
      /* The Data descriptor */
      EXTSIG: 134695760,
      // "PK\007\008"
      EXTHDR: 16,
      // EXT header size
      EXTCRC: 4,
      // uncompressed file crc-32 value
      EXTSIZ: 8,
      // compressed size
      EXTLEN: 12,
      // uncompressed size
      /* The central directory file header */
      CENHDR: 46,
      // CEN header size
      CENSIG: 33639248,
      // "PK\001\002"
      CENVEM: 4,
      // version made by
      CENVER: 6,
      // version needed to extract
      CENFLG: 8,
      // encrypt, decrypt flags
      CENHOW: 10,
      // compression method
      CENTIM: 12,
      // modification time (2 bytes time, 2 bytes date)
      CENCRC: 16,
      // uncompressed file crc-32 value
      CENSIZ: 20,
      // compressed size
      CENLEN: 24,
      // uncompressed size
      CENNAM: 28,
      // filename length
      CENEXT: 30,
      // extra field length
      CENCOM: 32,
      // file comment length
      CENDSK: 34,
      // volume number start
      CENATT: 36,
      // internal file attributes
      CENATX: 38,
      // external file attributes (host system dependent)
      CENOFF: 42,
      // LOC header offset
      /* The entries in the end of central directory */
      ENDHDR: 22,
      // END header size
      ENDSIG: 101010256,
      // "PK\005\006"
      ENDSUB: 8,
      // number of entries on this disk
      ENDTOT: 10,
      // total number of entries
      ENDSIZ: 12,
      // central directory size in bytes
      ENDOFF: 16,
      // offset of first CEN header
      ENDCOM: 20,
      // zip file comment length
      END64HDR: 20,
      // zip64 END header size
      END64SIG: 117853008,
      // zip64 Locator signature, "PK\006\007"
      END64START: 4,
      // number of the disk with the start of the zip64
      END64OFF: 8,
      // relative offset of the zip64 end of central directory
      END64NUMDISKS: 16,
      // total number of disks
      ZIP64SIG: 101075792,
      // zip64 signature, "PK\006\006"
      ZIP64HDR: 56,
      // zip64 record minimum size
      ZIP64LEAD: 12,
      // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
      ZIP64SIZE: 4,
      // zip64 size of the central directory record
      ZIP64VEM: 12,
      // zip64 version made by
      ZIP64VER: 14,
      // zip64 version needed to extract
      ZIP64DSK: 16,
      // zip64 number of this disk
      ZIP64DSKDIR: 20,
      // number of the disk with the start of the record directory
      ZIP64SUB: 24,
      // number of entries on this disk
      ZIP64TOT: 32,
      // total number of entries
      ZIP64SIZB: 40,
      // zip64 central directory size in bytes
      ZIP64OFF: 48,
      // offset of start of central directory with respect to the starting disk number
      ZIP64EXTRA: 56,
      // extensible data sector
      /* Compression methods */
      STORED: 0,
      // no compression
      SHRUNK: 1,
      // shrunk
      REDUCED1: 2,
      // reduced with compression factor 1
      REDUCED2: 3,
      // reduced with compression factor 2
      REDUCED3: 4,
      // reduced with compression factor 3
      REDUCED4: 5,
      // reduced with compression factor 4
      IMPLODED: 6,
      // imploded
      // 7 reserved for Tokenizing compression algorithm
      DEFLATED: 8,
      // deflated
      ENHANCED_DEFLATED: 9,
      // enhanced deflated
      PKWARE: 10,
      // PKWare DCL imploded
      // 11 reserved by PKWARE
      BZIP2: 12,
      //  compressed using BZIP2
      // 13 reserved by PKWARE
      LZMA: 14,
      // LZMA
      // 15-17 reserved by PKWARE
      IBM_TERSE: 18,
      // compressed using IBM TERSE
      IBM_LZ77: 19,
      // IBM LZ77 z
      AES_ENCRYPT: 99,
      // WinZIP AES encryption method
      /* General purpose bit flag */
      // values can obtained with expression 2**bitnr
      FLG_ENC: 1,
      // Bit 0: encrypted file
      FLG_COMP1: 2,
      // Bit 1, compression option
      FLG_COMP2: 4,
      // Bit 2, compression option
      FLG_DESC: 8,
      // Bit 3, data descriptor
      FLG_ENH: 16,
      // Bit 4, enhanced deflating
      FLG_PATCH: 32,
      // Bit 5, indicates that the file is compressed patched data.
      FLG_STR: 64,
      // Bit 6, strong encryption (patented)
      // Bits 7-10: Currently unused.
      FLG_EFS: 2048,
      // Bit 11: Language encoding flag (EFS)
      // Bit 12: Reserved by PKWARE for enhanced compression.
      // Bit 13: encrypted the Central Directory (patented).
      // Bits 14-15: Reserved by PKWARE.
      FLG_MSK: 4096,
      // mask header values
      /* Load type */
      FILE: 2,
      BUFFER: 1,
      NONE: 0,
      /* 4.5 Extensible data fields */
      EF_ID: 0,
      EF_SIZE: 2,
      /* Header IDs */
      ID_ZIP64: 1,
      ID_AVINFO: 7,
      ID_PFS: 8,
      ID_OS2: 9,
      ID_NTFS: 10,
      ID_OPENVMS: 12,
      ID_UNIX: 13,
      ID_FORK: 14,
      ID_PATCH: 15,
      ID_X509_PKCS7: 20,
      ID_X509_CERTID_F: 21,
      ID_X509_CERTID_C: 22,
      ID_STRONGENC: 23,
      ID_RECORD_MGT: 24,
      ID_X509_PKCS7_RL: 25,
      ID_IBM1: 101,
      ID_IBM2: 102,
      ID_POSZIP: 18064,
      EF_ZIP64_OR_32: 4294967295,
      EF_ZIP64_OR_16: 65535,
      EF_ZIP64_SUNCOMP: 0,
      EF_ZIP64_SCOMP: 8,
      EF_ZIP64_RHO: 16,
      EF_ZIP64_DSN: 24
    };
  }
});

// node_modules/adm-zip/util/errors.js
var require_errors2 = __commonJS({
  "node_modules/adm-zip/util/errors.js"(exports2) {
    var errors = {
      /* Header error messages */
      INVALID_LOC: "Invalid LOC header (bad signature)",
      INVALID_CEN: "Invalid CEN header (bad signature)",
      INVALID_END: "Invalid END header (bad signature)",
      /* Descriptor */
      DESCRIPTOR_NOT_EXIST: "No descriptor present",
      DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
      DESCRIPTOR_FAULTY: "Descriptor data is malformed",
      /* ZipEntry error messages*/
      NO_DATA: "Nothing to decompress",
      BAD_CRC: "CRC32 checksum failed {0}",
      MAX_OUTPUT_EXCEEDED: "Decompressed data exceeds the declared uncompressed size",
      FILE_IN_THE_WAY: "There is a file in the way: {0}",
      UNKNOWN_METHOD: "Invalid/unsupported compression method",
      /* Inflater error messages */
      AVAIL_DATA: "inflate::Available inflate data did not terminate",
      INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
      TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
      INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
      INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
      INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
      INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
      INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
      INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
      INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
      /* ADM-ZIP error messages */
      CANT_EXTRACT_FILE: "Could not extract the file",
      CANT_OVERRIDE: "Target file already exists",
      DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
      NO_ZIP: "No zip file was loaded",
      NO_ENTRY: "Entry doesn't exist",
      DUPLICATE_ENTRY: "Duplicate entry name {0}",
      DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
      FILE_NOT_FOUND: 'File not found: "{0}"',
      NOT_IMPLEMENTED: "Not implemented",
      INVALID_FILENAME: "Invalid filename",
      INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
      ZIP64_VALUE_TOO_LARGE: "Zip64 value exceeds the maximum safe integer",
      INVALID_PASS_PARAM: "Incompatible password parameter",
      WRONG_PASSWORD: "Wrong Password",
      /* ADM-ZIP */
      COMMENT_TOO_LONG: "Comment is too long",
      // Comment can be max 65535 bytes long (NOTE: some non-US characters may take more space)
      EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
    };
    function E(message) {
      return function(...args) {
        return args.length && (message = message.replace(/\{(\d)\}/g, (_, n) => args[n] || "")), new Error("ADM-ZIP: " + message);
      };
    }
    for (let msg of Object.keys(errors))
      exports2[msg] = E(errors[msg]);
  }
});

// node_modules/adm-zip/util/utils.js
var require_utils2 = __commonJS({
  "node_modules/adm-zip/util/utils.js"(exports2, module2) {
    var fsystem = require("fs"), pth = require("path"), Constants = require_constants(), Errors = require_errors2(), isWin = typeof process == "object" && process.platform === "win32", is_Obj = (obj) => typeof obj == "object" && obj !== null, crcTable = new Uint32Array(256).map((t, c) => {
      for (let k = 0; k < 8; k++)
        c & 1 ? c = 3988292384 ^ c >>> 1 : c >>>= 1;
      return c >>> 0;
    });
    function Utils(opts) {
      this.sep = pth.sep, this.fs = fsystem, is_Obj(opts) && is_Obj(opts.fs) && typeof opts.fs.statSync == "function" && (this.fs = opts.fs);
    }
    module2.exports = Utils;
    Utils.prototype.makeDir = function(folder) {
      let self = this;
      function mkdirSync(fpath) {
        let resolvedPath = fpath.split(self.sep)[0];
        fpath.split(self.sep).forEach(function(name) {
          if (!(!name || name.substr(-1, 1) === ":")) {
            resolvedPath += self.sep + name;
            var stat;
            try {
              stat = self.fs.statSync(resolvedPath);
            } catch (e) {
              if (e.message && e.message.startsWith("ENOENT"))
                self.fs.mkdirSync(resolvedPath);
              else
                throw e;
            }
            if (stat && stat.isFile()) throw Errors.FILE_IN_THE_WAY(`"${resolvedPath}"`);
          }
        });
      }
      mkdirSync(folder);
    };
    Utils.prototype.writeFileTo = function(path, content, overwrite, attr) {
      let self = this;
      if (self.fs.existsSync(path)) {
        if (!overwrite) return !1;
        var stat = self.fs.statSync(path);
        if (stat.isDirectory())
          return !1;
      }
      var folder = pth.dirname(path);
      self.fs.existsSync(folder) || self.makeDir(folder);
      var fd;
      try {
        fd = self.fs.openSync(path, "w", 438);
      } catch {
        self.fs.chmodSync(path, 438), fd = self.fs.openSync(path, "w", 438);
      }
      if (fd)
        try {
          self.fs.writeSync(fd, content, 0, content.length, 0);
        } finally {
          self.fs.closeSync(fd);
        }
      return self.fs.chmodSync(path, attr || 438), !0;
    };
    Utils.prototype.writeFileToAsync = function(path, content, overwrite, attr, callback) {
      typeof attr == "function" && (callback = attr, attr = void 0);
      let self = this;
      self.fs.exists(path, function(exist) {
        if (exist && !overwrite) return callback(!1);
        self.fs.stat(path, function(err, stat) {
          if (exist && stat && stat.isDirectory())
            return callback(!1);
          var folder = pth.dirname(path);
          self.fs.exists(folder, function(exists) {
            if (!exists)
              try {
                self.makeDir(folder);
              } catch {
                return callback(!1);
              }
            let writeToFd = function(fd) {
              self.fs.write(fd, content, 0, content.length, 0, function(writeErr) {
                self.fs.close(fd, function() {
                  if (writeErr) return callback(!1);
                  self.fs.chmod(path, attr || 438, function() {
                    callback(!0);
                  });
                });
              });
            };
            self.fs.open(path, "w", 438, function(err2, fd) {
              err2 ? self.fs.chmod(path, 438, function() {
                self.fs.open(path, "w", 438, function(retryErr, fd2) {
                  if (retryErr || !fd2) return callback(!1);
                  writeToFd(fd2);
                });
              }) : fd ? writeToFd(fd) : callback(!1);
            });
          });
        });
      });
    };
    Utils.prototype.assertPathSafe = function(root, target) {
      let self = this;
      if (typeof self.fs.lstatSync != "function") return;
      let resolvedRoot = pth.resolve(root), resolvedTarget = pth.resolve(target);
      if (resolvedTarget === resolvedRoot) return;
      let rel = pth.relative(resolvedRoot, resolvedTarget);
      if (!rel || rel === ".." || rel.startsWith(".." + pth.sep) || pth.isAbsolute(rel)) return;
      let cur = resolvedRoot;
      for (let part of rel.split(pth.sep)) {
        if (!part || part === ".") continue;
        cur = pth.join(cur, part);
        let stat;
        try {
          stat = self.fs.lstatSync(cur);
        } catch {
          break;
        }
        if (stat.isSymbolicLink()) throw Errors.FILE_IN_THE_WAY(`"${cur}"`);
      }
    };
    Utils.prototype.findFiles = function(path) {
      let self = this, canLstat = typeof self.fs.lstatSync == "function", rootReal = self.fs.realpathSync(path);
      function escapesRoot(p) {
        if (!canLstat || !self.fs.lstatSync(p).isSymbolicLink()) return !1;
        let real;
        try {
          real = self.fs.realpathSync(p);
        } catch {
          return !0;
        }
        return !(real === rootReal || real.startsWith(rootReal + pth.sep));
      }
      function findSync(dir, pattern, recursive, visited) {
        typeof pattern == "boolean" && (recursive = pattern, pattern = void 0);
        let files = [];
        return self.fs.readdirSync(dir).forEach(function(file) {
          let path2 = pth.join(dir, file);
          if (escapesRoot(path2)) return;
          let stat = self.fs.statSync(path2);
          if ((!pattern || pattern.test(path2)) && files.push(pth.normalize(path2) + (stat.isDirectory() ? self.sep : "")), stat.isDirectory() && recursive) {
            let realDir = self.fs.realpathSync(path2);
            visited.has(realDir) || (visited.add(realDir), files = files.concat(findSync(path2, pattern, recursive, visited)));
          }
        }), files;
      }
      return findSync(path, void 0, !0, /* @__PURE__ */ new Set([rootReal]));
    };
    Utils.prototype.findFilesAsync = function(dir, cb) {
      let self = this, results = [], finished = !1, finish = function(err) {
        finished || (finished = !0, cb(err, err ? void 0 : results));
      }, canLstat = typeof self.fs.lstat == "function", rootReal = null, escapesRoot = function(file, cb2) {
        if (!canLstat) return cb2(null, !1);
        self.fs.lstat(file, function(err, lst) {
          if (err) return cb2(err);
          if (!lst || !lst.isSymbolicLink()) return cb2(null, !1);
          self.fs.realpath(file, function(err2, real) {
            if (err2) return cb2(null, !0);
            cb2(null, !(real === rootReal || real.startsWith(rootReal + pth.sep)));
          });
        });
      }, walk = function(dir2, visited, done) {
        self.fs.readdir(dir2, function(err, list) {
          if (err) return done(err);
          let pending = list.length;
          if (!pending) return done();
          list.forEach(function(name) {
            let file = pth.join(dir2, name);
            escapesRoot(file, function(err2, escapes) {
              if (err2) return done(err2);
              if (escapes) {
                --pending || done();
                return;
              }
              self.fs.stat(file, function(err3, stat) {
                if (err3) return done(err3);
                if (!stat) {
                  --pending || done();
                  return;
                }
                if (results.push(pth.normalize(file) + (stat.isDirectory() ? self.sep : "")), !stat.isDirectory()) {
                  --pending || done();
                  return;
                }
                self.fs.realpath(file, function(err4, realDir) {
                  if (err4) return done(err4);
                  if (visited.has(realDir)) {
                    --pending || done();
                    return;
                  }
                  visited.add(realDir), walk(file, visited, function(err5) {
                    if (err5) return done(err5);
                    --pending || done();
                  });
                });
              });
            });
          });
        });
      };
      self.fs.realpath(dir, function(err, realDir) {
        if (err) return finish(err);
        rootReal = realDir, walk(dir, /* @__PURE__ */ new Set([realDir]), finish);
      });
    };
    Utils.prototype.getAttributes = function() {
    };
    Utils.prototype.setAttributes = function() {
    };
    Utils.crc32update = function(crc, byte) {
      return crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
    };
    Utils.crc32 = function(buf) {
      typeof buf == "string" && (buf = Buffer.from(buf, "utf8"));
      let len = buf.length, crc = -1;
      for (let off = 0; off < len; ) crc = Utils.crc32update(crc, buf[off++]);
      return ~crc >>> 0;
    };
    Utils.methodToString = function(method) {
      switch (method) {
        case Constants.STORED:
          return "STORED (" + method + ")";
        case Constants.DEFLATED:
          return "DEFLATED (" + method + ")";
        default:
          return "UNSUPPORTED (" + method + ")";
      }
    };
    Utils.canonical = function(path) {
      if (!path) return "";
      let safeSuffix = pth.posix.normalize("/" + path.split("\\").join("/"));
      return pth.join(".", safeSuffix);
    };
    Utils.zipnamefix = function(path) {
      if (!path) return "";
      let safeSuffix = pth.posix.normalize("/" + path.split("\\").join("/"));
      return pth.posix.join(".", safeSuffix);
    };
    Utils.findLast = function(arr, callback) {
      if (!Array.isArray(arr)) throw new TypeError("arr is not array");
      let len = arr.length >>> 0;
      for (let i = len - 1; i >= 0; i--)
        if (callback(arr[i], i, arr))
          return arr[i];
    };
    Utils.sanitize = function(prefix, name) {
      prefix = pth.resolve(pth.normalize(prefix));
      for (var parts = name.split("/"), i = 0, l = parts.length; i < l; i++) {
        var path = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
        if (path === prefix || path.startsWith(prefix + pth.sep))
          return path;
      }
      return pth.normalize(pth.join(prefix, pth.basename(name)));
    };
    Utils.toBuffer = function(input, encoder) {
      return Buffer.isBuffer(input) ? input : input instanceof Uint8Array ? Buffer.from(input) : typeof input == "string" ? encoder(input) : Buffer.alloc(0);
    };
    Utils.readBigUInt64LE = function(buffer, index) {
      let lo = buffer.readUInt32LE(index), value = buffer.readUInt32LE(index + 4) * 4294967296 + lo;
      if (value > Number.MAX_SAFE_INTEGER)
        throw Errors.ZIP64_VALUE_TOO_LARGE();
      return value;
    };
    Utils.writeBigUInt64LE = function(buffer, value, index) {
      let lo = value >>> 0, hi = Math.floor(value / 4294967296) >>> 0;
      buffer.writeUInt32LE(lo, index), buffer.writeUInt32LE(hi, index + 4);
    };
    Utils.fromDOS2Date = function(val) {
      return new Date((val >> 25 & 127) + 1980, Math.max((val >> 21 & 15) - 1, 0), Math.max(val >> 16 & 31, 1), val >> 11 & 31, val >> 5 & 63, (val & 31) << 1);
    };
    Utils.fromDate2DOS = function(val) {
      let date = 0, time = 0;
      return val.getFullYear() > 1979 && (date = (val.getFullYear() - 1980 & 127) << 9 | val.getMonth() + 1 << 5 | val.getDate(), time = val.getHours() << 11 | val.getMinutes() << 5 | val.getSeconds() >> 1), date << 16 | time;
    };
    Utils.isWin = isWin;
    Utils.crcTable = crcTable;
  }
});

// node_modules/adm-zip/util/fattr.js
var require_fattr = __commonJS({
  "node_modules/adm-zip/util/fattr.js"(exports2, module2) {
    var pth = require("path");
    module2.exports = function(path, { fs }) {
      var _path = path || "", _obj = newAttr(), _stat = null;
      function newAttr() {
        return {
          directory: !1,
          readonly: !1,
          hidden: !1,
          executable: !1,
          mtime: 0,
          atime: 0
        };
      }
      return _path && fs.existsSync(_path) ? (_stat = fs.statSync(_path), _obj.directory = _stat.isDirectory(), _obj.mtime = _stat.mtime, _obj.atime = _stat.atime, _obj.executable = (73 & _stat.mode) !== 0, _obj.readonly = (128 & _stat.mode) === 0, _obj.hidden = pth.basename(_path)[0] === ".") : console.warn("Invalid path: " + _path), {
        get directory() {
          return _obj.directory;
        },
        get readOnly() {
          return _obj.readonly;
        },
        get hidden() {
          return _obj.hidden;
        },
        get mtime() {
          return _obj.mtime;
        },
        get atime() {
          return _obj.atime;
        },
        get executable() {
          return _obj.executable;
        },
        decodeAttributes: function() {
        },
        encodeAttributes: function() {
        },
        toJSON: function() {
          return {
            path: _path,
            isDirectory: _obj.directory,
            isReadOnly: _obj.readonly,
            isHidden: _obj.hidden,
            isExecutable: _obj.executable,
            mTime: _obj.mtime,
            aTime: _obj.atime
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/util/decoder.js
var require_decoder = __commonJS({
  "node_modules/adm-zip/util/decoder.js"(exports2, module2) {
    module2.exports = {
      efs: !0,
      encode: (data) => Buffer.from(data, "utf8"),
      decode: (data) => data.toString("utf8")
    };
  }
});

// node_modules/adm-zip/util/index.js
var require_util = __commonJS({
  "node_modules/adm-zip/util/index.js"(exports2, module2) {
    module2.exports = require_utils2();
    module2.exports.Constants = require_constants();
    module2.exports.Errors = require_errors2();
    module2.exports.FileAttr = require_fattr();
    module2.exports.decoder = require_decoder();
  }
});

// node_modules/adm-zip/headers/entryHeader.js
var require_entryHeader = __commonJS({
  "node_modules/adm-zip/headers/entryHeader.js"(exports2, module2) {
    var Utils = require_util(), Constants = Utils.Constants;
    module2.exports = function() {
      var _verMade = 20, _version = 10, _flags = 0, _method = 0, _time = 0, _crc = 0, _compressedSize = 0, _size = 0, _fnameLen = 0, _extraLen = 0, _comLen = 0, _diskStart = 0, _inattr = 0, _attr = 0, _offset = 0;
      _verMade |= Utils.isWin ? 2560 : 768, _flags |= Constants.FLG_EFS;
      let _localHeader = {
        extraLen: 0
      }, uint32 = (val) => Math.max(0, val) >>> 0, uint16 = (val) => Math.max(0, val) & 65535, uint8 = (val) => Math.max(0, val) & 255;
      return _time = Utils.fromDate2DOS(/* @__PURE__ */ new Date()), {
        get made() {
          return _verMade;
        },
        set made(val) {
          _verMade = val;
        },
        get version() {
          return _version;
        },
        set version(val) {
          _version = val;
        },
        get flags() {
          return _flags;
        },
        set flags(val) {
          _flags = val;
        },
        get flags_efs() {
          return (_flags & Constants.FLG_EFS) > 0;
        },
        set flags_efs(val) {
          val ? _flags |= Constants.FLG_EFS : _flags &= ~Constants.FLG_EFS;
        },
        get flags_desc() {
          return (_flags & Constants.FLG_DESC) > 0;
        },
        set flags_desc(val) {
          val ? _flags |= Constants.FLG_DESC : _flags &= ~Constants.FLG_DESC;
        },
        get method() {
          return _method;
        },
        set method(val) {
          switch (val) {
            case Constants.STORED:
              this.version = 10;
              break;
            case Constants.DEFLATED:
            default:
              this.version = 20;
          }
          _method = val;
        },
        get time() {
          return Utils.fromDOS2Date(this.timeval);
        },
        set time(val) {
          val = new Date(val), this.timeval = Utils.fromDate2DOS(val);
        },
        get timeval() {
          return _time;
        },
        set timeval(val) {
          _time = uint32(val);
        },
        get timeHighByte() {
          return uint8(_time >>> 8);
        },
        get crc() {
          return _crc;
        },
        set crc(val) {
          _crc = uint32(val);
        },
        get compressedSize() {
          return _compressedSize;
        },
        set compressedSize(val) {
          _compressedSize = uint32(val);
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = uint32(val);
        },
        get fileNameLength() {
          return _fnameLen;
        },
        set fileNameLength(val) {
          _fnameLen = val;
        },
        get extraLength() {
          return _extraLen;
        },
        set extraLength(val) {
          _extraLen = val;
        },
        get extraLocalLength() {
          return _localHeader.extraLen;
        },
        set extraLocalLength(val) {
          _localHeader.extraLen = val;
        },
        get commentLength() {
          return _comLen;
        },
        set commentLength(val) {
          _comLen = val;
        },
        get diskNumStart() {
          return _diskStart;
        },
        set diskNumStart(val) {
          _diskStart = uint32(val);
        },
        get inAttr() {
          return _inattr;
        },
        set inAttr(val) {
          _inattr = uint32(val);
        },
        get attr() {
          return _attr;
        },
        set attr(val) {
          _attr = uint32(val);
        },
        // get Unix file permissions
        get fileAttr() {
          return (_attr || 0) >> 16 & 511;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = uint32(val);
        },
        get encrypted() {
          return (_flags & Constants.FLG_ENC) === Constants.FLG_ENC;
        },
        get centralHeaderSize() {
          return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
        },
        get realDataOffset() {
          return _offset + Constants.LOCHDR + _localHeader.fnameLen + _localHeader.extraLen;
        },
        get localHeader() {
          return _localHeader;
        },
        loadLocalHeaderFromBinary: function(input) {
          if (_offset < 0 || _offset + Constants.LOCHDR > input.length)
            throw Utils.Errors.INVALID_LOC();
          var data = input.slice(_offset, _offset + Constants.LOCHDR);
          if (data.readUInt32LE(0) !== Constants.LOCSIG)
            throw Utils.Errors.INVALID_LOC();
          _localHeader.version = data.readUInt16LE(Constants.LOCVER), _localHeader.flags = data.readUInt16LE(Constants.LOCFLG), _localHeader.flags_desc = (_localHeader.flags & Constants.FLG_DESC) > 0, _localHeader.method = data.readUInt16LE(Constants.LOCHOW), _localHeader.time = data.readUInt32LE(Constants.LOCTIM), _localHeader.crc = data.readUInt32LE(Constants.LOCCRC), _localHeader.compressedSize = data.readUInt32LE(Constants.LOCSIZ), _localHeader.size = data.readUInt32LE(Constants.LOCLEN), _localHeader.fnameLen = data.readUInt16LE(Constants.LOCNAM), _localHeader.extraLen = data.readUInt16LE(Constants.LOCEXT);
          let extraStart = _offset + Constants.LOCHDR + _localHeader.fnameLen, extraEnd = extraStart + _localHeader.extraLen;
          return input.slice(extraStart, extraEnd);
        },
        loadFromBinary: function(data) {
          if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG)
            throw Utils.Errors.INVALID_CEN();
          _verMade = data.readUInt16LE(Constants.CENVEM), _version = data.readUInt16LE(Constants.CENVER), _flags = data.readUInt16LE(Constants.CENFLG), _method = data.readUInt16LE(Constants.CENHOW), _time = data.readUInt32LE(Constants.CENTIM), _crc = data.readUInt32LE(Constants.CENCRC), _compressedSize = data.readUInt32LE(Constants.CENSIZ), _size = data.readUInt32LE(Constants.CENLEN), _fnameLen = data.readUInt16LE(Constants.CENNAM), _extraLen = data.readUInt16LE(Constants.CENEXT), _comLen = data.readUInt16LE(Constants.CENCOM), _diskStart = data.readUInt16LE(Constants.CENDSK), _inattr = data.readUInt16LE(Constants.CENATT), _attr = data.readUInt32LE(Constants.CENATX), _offset = data.readUInt32LE(Constants.CENOFF);
        },
        localHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.LOCHDR);
          return data.writeUInt32LE(Constants.LOCSIG, 0), data.writeUInt16LE(_version, Constants.LOCVER), data.writeUInt16LE(_flags & ~Constants.FLG_DESC, Constants.LOCFLG), data.writeUInt16LE(_method, Constants.LOCHOW), data.writeUInt32LE(_time, Constants.LOCTIM), data.writeUInt32LE(_crc, Constants.LOCCRC), data.writeUInt32LE(_compressedSize, Constants.LOCSIZ), data.writeUInt32LE(_size, Constants.LOCLEN), data.writeUInt16LE(_fnameLen, Constants.LOCNAM), data.writeUInt16LE(_localHeader.extraLen, Constants.LOCEXT), data;
        },
        centralHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
          return data.writeUInt32LE(Constants.CENSIG, 0), data.writeUInt16LE(_verMade, Constants.CENVEM), data.writeUInt16LE(_version, Constants.CENVER), data.writeUInt16LE(_flags & ~Constants.FLG_DESC, Constants.CENFLG), data.writeUInt16LE(_method, Constants.CENHOW), data.writeUInt32LE(_time, Constants.CENTIM), data.writeUInt32LE(_crc, Constants.CENCRC), data.writeUInt32LE(_compressedSize, Constants.CENSIZ), data.writeUInt32LE(_size, Constants.CENLEN), data.writeUInt16LE(_fnameLen, Constants.CENNAM), data.writeUInt16LE(_extraLen, Constants.CENEXT), data.writeUInt16LE(_comLen, Constants.CENCOM), data.writeUInt16LE(_diskStart, Constants.CENDSK), data.writeUInt16LE(_inattr, Constants.CENATT), data.writeUInt32LE(_attr, Constants.CENATX), data.writeUInt32LE(_offset, Constants.CENOFF), data;
        },
        toJSON: function() {
          let bytes = function(nr) {
            return nr + " bytes";
          };
          return {
            made: _verMade,
            version: _version,
            flags: _flags,
            method: Utils.methodToString(_method),
            time: this.time,
            crc: "0x" + _crc.toString(16).toUpperCase(),
            compressedSize: bytes(_compressedSize),
            size: bytes(_size),
            fileNameLength: bytes(_fnameLen),
            extraLength: bytes(_extraLen),
            commentLength: bytes(_comLen),
            diskNumStart: _diskStart,
            inAttr: _inattr,
            attr: _attr,
            offset: _offset,
            centralHeaderSize: bytes(Constants.CENHDR + _fnameLen + _extraLen + _comLen)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/headers/mainHeader.js
var require_mainHeader = __commonJS({
  "node_modules/adm-zip/headers/mainHeader.js"(exports2, module2) {
    var Utils = require_util(), Constants = Utils.Constants;
    module2.exports = function() {
      var _volumeEntries = 0, _totalEntries = 0, _size = 0, _offset = 0, _commentLength = 0;
      let needsZip64 = () => _volumeEntries > Constants.EF_ZIP64_OR_16 || _totalEntries > Constants.EF_ZIP64_OR_16 || _size > Constants.EF_ZIP64_OR_32 || _offset > Constants.EF_ZIP64_OR_32;
      return {
        get diskEntries() {
          return _volumeEntries;
        },
        set diskEntries(val) {
          _volumeEntries = _totalEntries = val;
        },
        get totalEntries() {
          return _totalEntries;
        },
        set totalEntries(val) {
          _totalEntries = _volumeEntries = val;
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = val;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = val;
        },
        get commentLength() {
          return _commentLength;
        },
        set commentLength(val) {
          _commentLength = val;
        },
        get mainHeaderSize() {
          return (needsZip64() ? Constants.ZIP64HDR + Constants.END64HDR : 0) + Constants.ENDHDR + _commentLength;
        },
        loadFromBinary: function(data) {
          if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) && (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG))
            throw Utils.Errors.INVALID_END();
          data.readUInt32LE(0) === Constants.ENDSIG ? (_volumeEntries = data.readUInt16LE(Constants.ENDSUB), _totalEntries = data.readUInt16LE(Constants.ENDTOT), _size = data.readUInt32LE(Constants.ENDSIZ), _offset = data.readUInt32LE(Constants.ENDOFF), _commentLength = data.readUInt16LE(Constants.ENDCOM)) : (_volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB), _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT), _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZB), _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF), _commentLength = 0);
        },
        toBinary: function() {
          if (!needsZip64()) {
            var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
            return b.writeUInt32LE(Constants.ENDSIG, 0), b.writeUInt32LE(0, 4), b.writeUInt16LE(_volumeEntries, Constants.ENDSUB), b.writeUInt16LE(_totalEntries, Constants.ENDTOT), b.writeUInt32LE(_size, Constants.ENDSIZ), b.writeUInt32LE(_offset, Constants.ENDOFF), b.writeUInt16LE(_commentLength, Constants.ENDCOM), b.fill(" ", Constants.ENDHDR), b;
          }
          var b = Buffer.alloc(this.mainHeaderSize);
          let offset = 0;
          b.writeUInt32LE(Constants.ZIP64SIG, offset), Utils.writeBigUInt64LE(b, Constants.ZIP64HDR - Constants.ZIP64LEAD, offset + Constants.ZIP64SIZE), b.writeUInt16LE(45, offset + Constants.ZIP64VEM), b.writeUInt16LE(45, offset + Constants.ZIP64VER), b.writeUInt32LE(0, offset + Constants.ZIP64DSK), b.writeUInt32LE(0, offset + Constants.ZIP64DSKDIR), Utils.writeBigUInt64LE(b, _volumeEntries, offset + Constants.ZIP64SUB), Utils.writeBigUInt64LE(b, _totalEntries, offset + Constants.ZIP64TOT), Utils.writeBigUInt64LE(b, _size, offset + Constants.ZIP64SIZB), Utils.writeBigUInt64LE(b, _offset, offset + Constants.ZIP64OFF);
          let zip64EndOffset = _offset + _size;
          return offset += Constants.ZIP64HDR, b.writeUInt32LE(Constants.END64SIG, offset), b.writeUInt32LE(0, offset + Constants.END64START), Utils.writeBigUInt64LE(b, zip64EndOffset, offset + Constants.END64OFF), b.writeUInt32LE(1, offset + Constants.END64NUMDISKS), offset += Constants.END64HDR, b.writeUInt32LE(Constants.ENDSIG, offset), b.writeUInt32LE(0, offset + 4), b.writeUInt16LE(Math.min(_volumeEntries, Constants.EF_ZIP64_OR_16), offset + Constants.ENDSUB), b.writeUInt16LE(Math.min(_totalEntries, Constants.EF_ZIP64_OR_16), offset + Constants.ENDTOT), b.writeUInt32LE(Math.min(_size, Constants.EF_ZIP64_OR_32), offset + Constants.ENDSIZ), b.writeUInt32LE(Math.min(_offset, Constants.EF_ZIP64_OR_32), offset + Constants.ENDOFF), b.writeUInt16LE(_commentLength, offset + Constants.ENDCOM), b.fill(" ", offset + Constants.ENDHDR), b;
        },
        toJSON: function() {
          let offset = function(nr, len) {
            let offs = nr.toString(16).toUpperCase();
            for (; offs.length < len; ) offs = "0" + offs;
            return "0x" + offs;
          };
          return {
            diskEntries: _volumeEntries,
            totalEntries: _totalEntries,
            size: _size + " bytes",
            offset: offset(_offset, 4),
            commentLength: _commentLength
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/headers/index.js
var require_headers = __commonJS({
  "node_modules/adm-zip/headers/index.js"(exports2) {
    exports2.EntryHeader = require_entryHeader();
    exports2.MainHeader = require_mainHeader();
  }
});

// node_modules/adm-zip/methods/deflater.js
var require_deflater = __commonJS({
  "node_modules/adm-zip/methods/deflater.js"(exports2, module2) {
    module2.exports = function(inbuf) {
      var zlib = require("zlib"), opts = { chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024 };
      return {
        deflate: function() {
          return zlib.deflateRawSync(inbuf, opts);
        },
        deflateAsync: function(callback) {
          var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
          tmp.on("data", function(data) {
            parts.push(data), total += data.length;
          }), tmp.on("end", function() {
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written), written += part.length;
            }
            callback && callback(buf);
          }), tmp.end(inbuf);
        }
      };
    };
  }
});

// node_modules/adm-zip/methods/inflater.js
var require_inflater = __commonJS({
  "node_modules/adm-zip/methods/inflater.js"(exports2, module2) {
    var version = +(process?.versions?.node ?? "").split(".")[0] || 0, Errors = require_errors2();
    module2.exports = function(inbuf, expectedLength) {
      var zlib = require("zlib");
      let maxOutputLength = expectedLength > 0 ? expectedLength : 1, option = version >= 15 ? { maxOutputLength } : {};
      return {
        inflate: function() {
          return zlib.inflateRawSync(inbuf, option);
        },
        inflateAsync: function(callback) {
          var tmp = zlib.createInflateRaw(option), parts = [], total = 0, done = !1;
          let fail = function(err) {
            done || (done = !0, tmp.destroy(), callback && callback(Buffer.alloc(0), err));
          };
          tmp.on("error", function(err) {
            fail(err);
          }), tmp.on("data", function(data) {
            if (!done) {
              if (total += data.length, total > maxOutputLength)
                return fail(Errors.MAX_OUTPUT_EXCEEDED());
              parts.push(data);
            }
          }), tmp.on("end", function() {
            if (!done) {
              done = !0;
              var buf = Buffer.alloc(total), written = 0;
              buf.fill(0);
              for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                part.copy(buf, written), written += part.length;
              }
              callback && callback(buf);
            }
          }), tmp.end(inbuf);
        }
      };
    };
  }
});

// node_modules/adm-zip/methods/zipcrypto.js
var require_zipcrypto = __commonJS({
  "node_modules/adm-zip/methods/zipcrypto.js"(exports2, module2) {
    "use strict";
    var { randomFillSync } = require("crypto"), Errors = require_errors2(), crctable = new Uint32Array(256).map((t, crc) => {
      for (let j = 0; j < 8; j++)
        crc & 1 ? crc = crc >>> 1 ^ 3988292384 : crc >>>= 1;
      return crc >>> 0;
    }), uMul = (a, b) => Math.imul(a, b) >>> 0, crc32update = (pCrc32, bval) => crctable[(pCrc32 ^ bval) & 255] ^ pCrc32 >>> 8, genSalt = () => typeof randomFillSync == "function" ? randomFillSync(Buffer.alloc(12)) : genSalt.node();
    genSalt.node = () => {
      let salt = Buffer.alloc(12), len = salt.length;
      for (let i = 0; i < len; i++) salt[i] = Math.random() * 256 & 255;
      return salt;
    };
    var config = {
      genSalt
    };
    function Initkeys(pw) {
      let pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
      this.keys = new Uint32Array([305419896, 591751049, 878082192]);
      for (let i = 0; i < pass.length; i++)
        this.updateKeys(pass[i]);
    }
    Initkeys.prototype.updateKeys = function(byteValue) {
      let keys = this.keys;
      return keys[0] = crc32update(keys[0], byteValue), keys[1] += keys[0] & 255, keys[1] = uMul(keys[1], 134775813) + 1, keys[2] = crc32update(keys[2], keys[1] >>> 24), byteValue;
    };
    Initkeys.prototype.next = function() {
      let k = (this.keys[2] | 2) >>> 0;
      return uMul(k, k ^ 1) >> 8 & 255;
    };
    function make_decrypter(pwd) {
      let keys = new Initkeys(pwd);
      return function(data) {
        let result = Buffer.alloc(data.length), pos = 0;
        for (let c of data)
          result[pos++] = keys.updateKeys(c ^ keys.next());
        return result;
      };
    }
    function make_encrypter(pwd) {
      let keys = new Initkeys(pwd);
      return function(data, result, pos = 0) {
        result || (result = Buffer.alloc(data.length));
        for (let c of data) {
          let k = keys.next();
          result[pos++] = c ^ k, keys.updateKeys(c);
        }
        return result;
      };
    }
    function decrypt(data, header, pwd) {
      if (!data || !Buffer.isBuffer(data) || data.length < 12)
        return Buffer.alloc(0);
      let decrypter = make_decrypter(pwd), salt = decrypter(data.slice(0, 12)), verifyByte = (header.flags & 8) === 8 ? header.timeHighByte : header.crc >>> 24;
      if (salt[11] !== verifyByte)
        throw Errors.WRONG_PASSWORD();
      return decrypter(data.slice(12));
    }
    function _salter(data) {
      Buffer.isBuffer(data) && data.length >= 12 ? config.genSalt = function() {
        return data.slice(0, 12);
      } : data === "node" ? config.genSalt = genSalt.node : config.genSalt = genSalt;
    }
    function encrypt(data, header, pwd, oldlike = !1) {
      data == null && (data = Buffer.alloc(0)), Buffer.isBuffer(data) || (data = Buffer.from(data.toString()));
      let encrypter = make_encrypter(pwd), salt = config.genSalt();
      salt[11] = header.crc >>> 24 & 255, oldlike && (salt[10] = header.crc >>> 16 & 255);
      let result = Buffer.alloc(data.length + 12);
      return encrypter(salt, result), encrypter(data, result, 12);
    }
    module2.exports = { decrypt, encrypt, _salter };
  }
});

// node_modules/adm-zip/methods/index.js
var require_methods = __commonJS({
  "node_modules/adm-zip/methods/index.js"(exports2) {
    exports2.Deflater = require_deflater();
    exports2.Inflater = require_inflater();
    exports2.ZipCrypto = require_zipcrypto();
  }
});

// node_modules/adm-zip/zipEntry.js
var require_zipEntry = __commonJS({
  "node_modules/adm-zip/zipEntry.js"(exports2, module2) {
    var Utils = require_util(), Headers = require_headers(), Constants = Utils.Constants, Methods = require_methods();
    module2.exports = function(options, input) {
      var _centralHeader = new Headers.EntryHeader(), _entryName = Buffer.alloc(0), _comment = Buffer.alloc(0), _isDirectory = !1, uncompressedData = null, _extra = Buffer.alloc(0), _extralocal = Buffer.alloc(0), _efs = !0;
      let opts = options, decoder = typeof opts.decoder == "object" ? opts.decoder : Utils.decoder;
      _efs = decoder.hasOwnProperty("efs") ? decoder.efs : !1;
      function getCompressedDataFromZip() {
        if (!input || !(input instanceof Uint8Array))
          return Buffer.alloc(0);
        _extralocal = _centralHeader.loadLocalHeaderFromBinary(input);
        let dataOffset = _centralHeader.realDataOffset, dataEnd = dataOffset + _centralHeader.compressedSize;
        if (dataOffset < 0 || dataEnd < dataOffset || dataEnd > input.length)
          throw Utils.Errors.INVALID_LOC();
        return input.slice(dataOffset, dataEnd);
      }
      function crc32OK(data) {
        let expectedCrc = _centralHeader.flags_desc || _centralHeader.localHeader.flags_desc ? _centralHeader.crc : _centralHeader.localHeader.crc;
        return Utils.crc32(data) === expectedCrc;
      }
      function decompress(async, callback, pass) {
        if (typeof callback > "u" && typeof async == "string" && (pass = async, async = void 0), _isDirectory)
          return async && callback && callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR()), Buffer.alloc(0);
        var compressedData;
        try {
          if (compressedData = getCompressedDataFromZip(), compressedData.length === 0)
            return async && callback && callback(compressedData), compressedData;
          if (_centralHeader.encrypted) {
            if (typeof pass != "string" && !Buffer.isBuffer(pass))
              throw Utils.Errors.INVALID_PASS_PARAM();
            compressedData = Methods.ZipCrypto.decrypt(compressedData, _centralHeader, pass);
          }
        } catch (err) {
          if (async && callback)
            return callback(Buffer.alloc(0), err), Buffer.alloc(0);
          throw err;
        }
        var data;
        switch (_centralHeader.method) {
          case Utils.Constants.STORED:
            if (data = Buffer.alloc(compressedData.length), compressedData.copy(data), crc32OK(data))
              return async && callback && callback(data), data;
            throw async && callback && callback(data, Utils.Errors.BAD_CRC()), Utils.Errors.BAD_CRC();
          case Utils.Constants.DEFLATED:
            var inflater = new Methods.Inflater(compressedData, _centralHeader.size);
            if (async)
              inflater.inflateAsync(function(result, err) {
                callback && (err ? callback(Buffer.alloc(0), err) : crc32OK(result) ? callback(result) : callback(result, Utils.Errors.BAD_CRC()));
              });
            else {
              if (data = inflater.inflate(), !crc32OK(data))
                throw Utils.Errors.BAD_CRC(`"${decoder.decode(_entryName)}"`);
              return data;
            }
            break;
          default:
            throw async && callback && callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD()), Utils.Errors.UNKNOWN_METHOD();
        }
      }
      function compress(async, callback) {
        if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input))
          return async && callback && callback(getCompressedDataFromZip()), getCompressedDataFromZip();
        if (uncompressedData.length && !_isDirectory) {
          var compressedData;
          switch (_centralHeader.method) {
            case Utils.Constants.STORED:
              return _centralHeader.compressedSize = _centralHeader.size, compressedData = Buffer.alloc(uncompressedData.length), uncompressedData.copy(compressedData), async && callback && callback(compressedData), compressedData;
            default:
            case Utils.Constants.DEFLATED:
              var deflater = new Methods.Deflater(uncompressedData);
              if (async)
                deflater.deflateAsync(function(data) {
                  compressedData = Buffer.alloc(data.length), _centralHeader.compressedSize = data.length, data.copy(compressedData), callback && callback(compressedData);
                });
              else {
                var deflated = deflater.deflate();
                return _centralHeader.compressedSize = deflated.length, deflated;
              }
              deflater = null;
              break;
          }
        } else if (async && callback)
          callback(Buffer.alloc(0));
        else
          return Buffer.alloc(0);
      }
      function readUInt64LE(buffer, offset) {
        return Utils.readBigUInt64LE(buffer, offset);
      }
      function parseExtra(data) {
        try {
          for (var offset = 0, signature, size, part; offset + 4 < data.length; )
            signature = data.readUInt16LE(offset), offset += 2, size = data.readUInt16LE(offset), offset += 2, part = data.slice(offset, offset + size), offset += size, Constants.ID_ZIP64 === signature && parseZip64ExtendedInformation(part);
        } catch {
          throw Utils.Errors.EXTRA_FIELD_PARSE_ERROR();
        }
      }
      function parseZip64ExtendedInformation(data) {
        var size, compressedSize, offset, diskNumStart;
        data.length >= Constants.EF_ZIP64_SCOMP && (size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP), _centralHeader.size === Constants.EF_ZIP64_OR_32 && (_centralHeader.size = size)), data.length >= Constants.EF_ZIP64_RHO && (compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP), _centralHeader.compressedSize === Constants.EF_ZIP64_OR_32 && (_centralHeader.compressedSize = compressedSize)), data.length >= Constants.EF_ZIP64_DSN && (offset = readUInt64LE(data, Constants.EF_ZIP64_RHO), _centralHeader.offset === Constants.EF_ZIP64_OR_32 && (_centralHeader.offset = offset)), data.length >= Constants.EF_ZIP64_DSN + 4 && (diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN), _centralHeader.diskNumStart === Constants.EF_ZIP64_OR_16 && (_centralHeader.diskNumStart = diskNumStart));
      }
      return {
        get entryName() {
          return decoder.decode(_entryName);
        },
        get rawEntryName() {
          return _entryName;
        },
        set entryName(val) {
          _entryName = Utils.toBuffer(val, decoder.encode);
          var lastChar = _entryName[_entryName.length - 1];
          _isDirectory = lastChar === 47 || lastChar === 92, _centralHeader.fileNameLength = _entryName.length;
        },
        get efs() {
          return typeof _efs == "function" ? _efs(this.entryName) : _efs;
        },
        get extra() {
          return _extra;
        },
        set extra(val) {
          _extra = val, _centralHeader.extraLength = val.length, parseExtra(val);
        },
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          if (_comment = Utils.toBuffer(val, decoder.encode), _centralHeader.commentLength = _comment.length, _comment.length > 65535) throw Utils.Errors.COMMENT_TOO_LONG();
        },
        get name() {
          let n = decoder.decode(_entryName);
          return _isDirectory ? n.replace(/[/\\]$/, "").split("/").pop() : n.split("/").pop();
        },
        get isDirectory() {
          return _isDirectory;
        },
        getCompressedData: function() {
          return compress(!1, null);
        },
        getCompressedDataAsync: function(callback) {
          compress(!0, callback);
        },
        setData: function(value) {
          uncompressedData = Utils.toBuffer(value, Utils.decoder.encode), !_isDirectory && uncompressedData.length ? (_centralHeader.size = uncompressedData.length, _centralHeader.method = Utils.Constants.DEFLATED, _centralHeader.crc = Utils.crc32(value), _centralHeader.changed = !0) : _centralHeader.method = Utils.Constants.STORED;
        },
        getData: function(pass) {
          return _centralHeader.changed ? uncompressedData : decompress(!1, null, pass);
        },
        getDataAsync: function(callback, pass) {
          _centralHeader.changed ? callback(uncompressedData) : decompress(!0, callback, pass);
        },
        set attr(attr) {
          _centralHeader.attr = attr;
        },
        get attr() {
          return _centralHeader.attr;
        },
        set header(data) {
          _centralHeader.loadFromBinary(data);
        },
        get header() {
          return _centralHeader;
        },
        packCentralHeader: function() {
          _centralHeader.flags_efs = this.efs, _centralHeader.extraLength = _extra.length;
          var header = _centralHeader.centralHeaderToBinary(), addpos = Utils.Constants.CENHDR;
          return _entryName.copy(header, addpos), addpos += _entryName.length, _extra.copy(header, addpos), addpos += _centralHeader.extraLength, _comment.copy(header, addpos), header;
        },
        packLocalHeader: function() {
          let addpos = 0;
          _centralHeader.flags_efs = this.efs, _centralHeader.extraLocalLength = _extralocal.length;
          let localHeaderBuf = _centralHeader.localHeaderToBinary(), localHeader = Buffer.alloc(localHeaderBuf.length + _entryName.length + _centralHeader.extraLocalLength);
          return localHeaderBuf.copy(localHeader, addpos), addpos += localHeaderBuf.length, _entryName.copy(localHeader, addpos), addpos += _entryName.length, _extralocal.copy(localHeader, addpos), addpos += _extralocal.length, localHeader;
        },
        toJSON: function() {
          let bytes = function(nr) {
            return "<" + (nr && nr.length + " bytes buffer" || "null") + ">";
          };
          return {
            entryName: this.entryName,
            name: this.name,
            comment: this.comment,
            isDirectory: this.isDirectory,
            header: _centralHeader.toJSON(),
            compressedData: bytes(input),
            data: bytes(uncompressedData)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/zipFile.js
var require_zipFile = __commonJS({
  "node_modules/adm-zip/zipFile.js"(exports2, module2) {
    var ZipEntry = require_zipEntry(), Headers = require_headers(), Utils = require_util();
    module2.exports = function(inBuffer, options) {
      var entryList = [], entryTable = /* @__PURE__ */ Object.create(null), _comment = Buffer.alloc(0), mainHeader = new Headers.MainHeader(), loadedEntries = !1, password = null;
      let temporary = /* @__PURE__ */ new Set(), opts = options, { noSort, decoder } = opts;
      inBuffer ? readMainHeader(opts.readEntries) : loadedEntries = !0;
      function makeTemporaryFolders() {
        let foldersList = /* @__PURE__ */ new Set();
        for (let elem of Object.keys(entryTable)) {
          let elements = elem.split("/");
          if (elements.pop(), !!elements.length)
            for (let i = 0; i < elements.length; i++) {
              let sub = elements.slice(0, i + 1).join("/") + "/";
              foldersList.add(sub);
            }
        }
        for (let elem of foldersList)
          if (!(elem in entryTable)) {
            let tempfolder = new ZipEntry(opts);
            tempfolder.entryName = elem, tempfolder.attr = 16, tempfolder.temporary = !0, entryList.push(tempfolder), entryTable[tempfolder.entryName] = tempfolder, temporary.add(tempfolder);
          }
      }
      function readEntries() {
        if (loadedEntries = !0, entryTable = /* @__PURE__ */ Object.create(null), mainHeader.diskEntries > (inBuffer.length - mainHeader.offset) / Utils.Constants.CENHDR)
          throw Utils.Errors.DISK_ENTRY_TOO_LARGE();
        entryList = new Array(mainHeader.diskEntries);
        for (var index = mainHeader.offset, i = 0; i < entryList.length; i++) {
          var tmp = index, entry = new ZipEntry(opts, inBuffer);
          if (entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR), entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength), entry.header.extraLength && (entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength)), entry.header.commentLength && (entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength)), index += entry.header.centralHeaderSize, entry.entryName in entryTable)
            throw Utils.Errors.DUPLICATE_ENTRY(`"${entry.entryName}"`);
          entryList[i] = entry, entryTable[entry.entryName] = entry;
        }
        temporary.clear(), makeTemporaryFolders();
      }
      function readMainHeader(readNow) {
        var i = inBuffer.length - Utils.Constants.ENDHDR, max = Math.max(0, i - 65535), n = max, endStart = inBuffer.length, endOffset = -1, commentEnd = 0;
        for ((typeof opts.trailingSpace == "boolean" ? opts.trailingSpace : !1) && (max = 0), i; i >= n; i--)
          if (inBuffer[i] === 80) {
            if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) {
              endOffset = i, commentEnd = i, endStart = i + Utils.Constants.ENDHDR, n = i - Utils.Constants.END64HDR;
              continue;
            }
            if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
              n = max;
              continue;
            }
            if (inBuffer.readUInt32LE(i) === Utils.Constants.ZIP64SIG) {
              endOffset = i, endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
              break;
            }
          }
        if (endOffset == -1) throw Utils.Errors.INVALID_FORMAT();
        mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart)), mainHeader.commentLength && (_comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR)), readNow && readEntries();
      }
      function sortEntries() {
        entryList.length > 1 && !noSort && (entryList = entryList.map((entry) => ({ entry, key: entry.entryName.toLowerCase() })).sort((a, b) => a.key.localeCompare(b.key)).map((pair) => pair.entry));
      }
      return {
        /**
         * Returns an array of ZipEntry objects existent in the current opened archive
         * @return Array
         */
        get entries() {
          return loadedEntries || readEntries(), entryList.filter((e) => !temporary.has(e));
        },
        /**
         * Archive comment
         * @return {String}
         */
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode), mainHeader.commentLength = _comment.length;
        },
        getEntryCount: function() {
          return loadedEntries ? entryList.length : mainHeader.diskEntries;
        },
        forEach: function(callback) {
          this.entries.forEach(callback);
        },
        /**
         * Returns a reference to the entry with the given name or null if entry is inexistent
         *
         * @param entryName
         * @return ZipEntry
         */
        getEntry: function(entryName) {
          return loadedEntries || readEntries(), entryTable[entryName] || null;
        },
        /**
         * Adds the given entry to the entry list
         *
         * @param entry
         */
        setEntry: function(entry) {
          loadedEntries || readEntries(), entryList.push(entry), entryTable[entry.entryName] = entry, mainHeader.totalEntries = entryList.length;
        },
        /**
         * Removes the file with the given name from the entry list.
         *
         * If the entry is a directory, then all nested files and directories will be removed
         * @param entryName
         * @returns {void}
         */
        deleteFile: function(entryName, withsubfolders = !0) {
          loadedEntries || readEntries();
          let entry = entryTable[entryName];
          this.getEntryChildren(entry, withsubfolders).map((child) => child.entryName).forEach(this.deleteEntry);
        },
        /**
         * Removes the entry with the given name from the entry list.
         *
         * @param {string} entryName
         * @returns {void}
         */
        deleteEntry: function(entryName) {
          loadedEntries || readEntries();
          let entry = entryTable[entryName], index = entryList.indexOf(entry);
          index >= 0 && (entryList.splice(index, 1), delete entryTable[entryName], mainHeader.totalEntries = entryList.length);
        },
        /**
         *  Iterates and returns all nested files and directories of the given entry
         *
         * @param entry
         * @return Array
         */
        getEntryChildren: function(entry, subfolders = !0) {
          if (loadedEntries || readEntries(), typeof entry == "object")
            if (entry.isDirectory && subfolders) {
              let list = [], name = entry.entryName;
              for (let zipEntry of entryList)
                zipEntry.entryName.startsWith(name) && list.push(zipEntry);
              return list;
            } else
              return [entry];
          return [];
        },
        /**
         *  How many child elements entry has
         *
         * @param {ZipEntry} entry
         * @return {integer}
         */
        getChildCount: function(entry) {
          if (entry && entry.isDirectory) {
            let list = this.getEntryChildren(entry);
            return list.includes(entry) ? list.length - 1 : list.length;
          }
          return 0;
        },
        /**
         * Returns the zip file
         *
         * @return Buffer
         */
        compressToBuffer: function() {
          loadedEntries || readEntries(), sortEntries();
          let dataBlock = [], headerBlocks = [], totalSize = 0, dindex = 0;
          mainHeader.size = 0, mainHeader.offset = 0;
          let totalEntries = 0;
          for (let entry of this.entries) {
            let compressedData = entry.getCompressedData();
            entry.header.offset = dindex;
            let localHeader = entry.packLocalHeader(), dataLength = localHeader.length + compressedData.length;
            dindex += dataLength, dataBlock.push(localHeader), dataBlock.push(compressedData);
            let centralHeader = entry.packCentralHeader();
            headerBlocks.push(centralHeader), mainHeader.size += centralHeader.length, totalSize += dataLength + centralHeader.length, totalEntries++;
          }
          totalSize += mainHeader.mainHeaderSize, mainHeader.offset = dindex, mainHeader.totalEntries = totalEntries, dindex = 0;
          let outBuffer = Buffer.alloc(totalSize);
          for (let content of dataBlock)
            content.copy(outBuffer, dindex), dindex += content.length;
          for (let content of headerBlocks)
            content.copy(outBuffer, dindex), dindex += content.length;
          let mh = mainHeader.toBinary();
          return _comment && _comment.copy(mh, mh.length - _comment.length), mh.copy(outBuffer, dindex), inBuffer = outBuffer, loadedEntries = !1, outBuffer;
        },
        toAsyncBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          try {
            loadedEntries || readEntries(), sortEntries();
            let dataBlock = [], centralHeaders = [], totalSize = 0, dindex = 0, totalEntries = 0;
            mainHeader.size = 0, mainHeader.offset = 0;
            let compress2Buffer = function(entryLists) {
              if (entryLists.length > 0) {
                let entry = entryLists.shift(), name = entry.entryName + entry.extra.toString();
                onItemStart && onItemStart(name), entry.getCompressedDataAsync(function(compressedData) {
                  onItemEnd && onItemEnd(name), entry.header.offset = dindex;
                  let localHeader = entry.packLocalHeader(), dataLength = localHeader.length + compressedData.length;
                  dindex += dataLength, dataBlock.push(localHeader), dataBlock.push(compressedData);
                  let centalHeader = entry.packCentralHeader();
                  centralHeaders.push(centalHeader), mainHeader.size += centalHeader.length, totalSize += dataLength + centalHeader.length, totalEntries++, compress2Buffer(entryLists);
                });
              } else {
                totalSize += mainHeader.mainHeaderSize, mainHeader.offset = dindex, mainHeader.totalEntries = totalEntries, dindex = 0;
                let outBuffer = Buffer.alloc(totalSize);
                dataBlock.forEach(function(content) {
                  content.copy(outBuffer, dindex), dindex += content.length;
                }), centralHeaders.forEach(function(content) {
                  content.copy(outBuffer, dindex), dindex += content.length;
                });
                let mh = mainHeader.toBinary();
                _comment && _comment.copy(mh, mh.length - _comment.length), mh.copy(outBuffer, dindex), inBuffer = outBuffer, loadedEntries = !1, onSuccess(outBuffer);
              }
            };
            compress2Buffer(Array.from(this.entries));
          } catch (e) {
            onFail(e);
          }
        }
      };
    };
  }
});

// node_modules/adm-zip/adm-zip.js
var require_adm_zip = __commonJS({
  "node_modules/adm-zip/adm-zip.js"(exports2, module2) {
    var Utils = require_util(), pth = require("path"), ZipEntry = require_zipEntry(), ZipFile = require_zipFile(), get_Bool = (...val) => Utils.findLast(val, (c) => typeof c == "boolean"), get_Str = (...val) => Utils.findLast(val, (c) => typeof c == "string"), get_Fun = (...val) => Utils.findLast(val, (c) => typeof c == "function"), defaultOptions = {
      // option "noSort" : if true it disables files sorting
      noSort: !1,
      // read entries during load (initial loading may be slower)
      readEntries: !1,
      // default method is none
      method: Utils.Constants.NONE,
      // file system
      fs: null
    };
    module2.exports = function(input, options) {
      let inBuffer = null, opts = Object.assign(/* @__PURE__ */ Object.create(null), defaultOptions);
      input && typeof input == "object" && (input instanceof Uint8Array || (Object.assign(opts, input), input = opts.input ? opts.input : void 0, opts.input && delete opts.input), Buffer.isBuffer(input) && (inBuffer = input, opts.method = Utils.Constants.BUFFER, input = void 0)), Object.assign(opts, options);
      let filetools = new Utils(opts), applyDirAttributes = (dirEntries) => {
        dirEntries.filter((d) => d.attr).sort((a, b) => b.path.length - a.path.length).forEach((d) => filetools.fs.chmodSync(d.path, d.attr));
      };
      if ((typeof opts.decoder != "object" || typeof opts.decoder.encode != "function" || typeof opts.decoder.decode != "function") && (opts.decoder = Utils.decoder), input && typeof input == "string")
        if (filetools.fs.existsSync(input))
          opts.method = Utils.Constants.FILE, opts.filename = input, inBuffer = filetools.fs.readFileSync(input);
        else
          throw Utils.Errors.INVALID_FILENAME();
      let _zip = new ZipFile(inBuffer, opts), { canonical, sanitize, zipnamefix } = Utils;
      function getEntry(entry) {
        if (entry && _zip) {
          var item;
          if (typeof entry == "string" && (item = _zip.getEntry(pth.posix.normalize(entry))), typeof entry == "object" && typeof entry.entryName < "u" && typeof entry.header < "u" && (item = _zip.getEntry(entry.entryName)), item)
            return item;
        }
        return null;
      }
      function fixPath(zipPath) {
        let { join, normalize, sep } = pth.posix;
        return join(pth.isAbsolute(zipPath) ? "/" : ".", normalize(sep + zipPath.split("\\").join(sep) + sep));
      }
      function filenameFilter(filterfn) {
        return filterfn instanceof RegExp ? /* @__PURE__ */ function(rx) {
          return function(filename) {
            return rx.test(filename);
          };
        }(filterfn) : typeof filterfn != "function" ? () => !0 : filterfn;
      }
      let relativePath = (local, entry) => {
        let lastChar = entry.slice(-1);
        return lastChar = lastChar === filetools.sep ? filetools.sep : "", pth.relative(local, entry) + lastChar;
      };
      return {
        /**
         * Extracts the given entry from the archive and returns the content as a Buffer object
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {Buffer|string} [pass] - password
         * @return Buffer or Null in case of error
         */
        readFile: function(entry, pass) {
          var item = getEntry(entry);
          return item && item.getData(pass) || null;
        },
        /**
         * Returns how many child elements has on entry (directories) on files it is always 0
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @returns {integer}
         */
        childCount: function(entry) {
          let item = getEntry(entry);
          if (item)
            return _zip.getChildCount(item);
        },
        /**
         * Asynchronous readFile
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         *
         * @return Buffer or Null in case of error
         */
        readFileAsync: function(entry, callback) {
          var item = getEntry(entry);
          item ? item.getDataAsync(callback) : callback(null, "getEntry failed for:" + entry);
        },
        /**
         * Extracts the given entry from the archive and returns the content as plain text in the given encoding
         * @param {ZipEntry|string} entry - ZipEntry object or String with the full path of the entry
         * @param {string} encoding - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsText: function(entry, encoding) {
          var item = getEntry(entry);
          if (item) {
            var data = item.getData();
            if (data && data.length)
              return data.toString(encoding || "utf8");
          }
          return "";
        },
        /**
         * Asynchronous readAsText
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         * @param {string} [encoding] - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsTextAsync: function(entry, callback, encoding) {
          var item = getEntry(entry);
          item ? item.getDataAsync(function(data, err) {
            if (err) {
              callback(data, err);
              return;
            }
            data && data.length ? callback(data.toString(encoding || "utf8")) : callback("");
          }) : callback("");
        },
        /**
         * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
         *
         * @param {ZipEntry|string} entry
         * @param {boolean} withsubfolders
         * @returns {void}
         */
        deleteFile: function(entry, withsubfolders = !0) {
          var item = getEntry(entry);
          item && _zip.deleteFile(item.entryName, withsubfolders);
        },
        /**
         * Remove the entry from the file or directory without affecting any nested entries
         *
         * @param {ZipEntry|string} entry
         * @returns {void}
         */
        deleteEntry: function(entry) {
          var item = getEntry(entry);
          item && _zip.deleteEntry(item.entryName);
        },
        /**
         * Adds a comment to the zip. The zip must be rewritten after adding the comment.
         *
         * @param {string} comment
         */
        addZipComment: function(comment) {
          _zip.comment = comment;
        },
        /**
         * Returns the zip comment
         *
         * @return String
         */
        getZipComment: function() {
          return _zip.comment || "";
        },
        /**
         * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
         * The comment cannot exceed 65535 characters in length
         *
         * @param {ZipEntry} entry
         * @param {string} comment
         */
        addZipEntryComment: function(entry, comment) {
          var item = getEntry(entry);
          item && (item.comment = comment);
        },
        /**
         * Returns the comment of the specified entry
         *
         * @param {ZipEntry} entry
         * @return String
         */
        getZipEntryComment: function(entry) {
          var item = getEntry(entry);
          return item && item.comment || "";
        },
        /**
         * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
         *
         * @param {ZipEntry} entry
         * @param {Buffer} content
         */
        updateFile: function(entry, content) {
          var item = getEntry(entry);
          item && item.setData(content);
        },
        /**
         * Adds a file from the disk to the archive
         *
         * @param {string} localPath File to add to zip
         * @param {string} [zipPath] Optional path inside the zip
         * @param {string} [zipName] Optional name for the file
         * @param {string} [comment] Optional file comment
         */
        addLocalFile: function(localPath, zipPath, zipName, comment) {
          if (filetools.fs.existsSync(localPath)) {
            zipPath = zipPath ? fixPath(zipPath) : "";
            let p = pth.win32.basename(pth.win32.normalize(localPath));
            zipPath += zipName || p;
            let _attr = filetools.fs.statSync(localPath), data = _attr.isFile() ? filetools.fs.readFileSync(localPath) : Buffer.alloc(0);
            _attr.isDirectory() && (zipPath += filetools.sep), this.addFile(zipPath, data, comment, _attr);
          } else
            throw Utils.Errors.FILE_NOT_FOUND(localPath);
        },
        /**
         * Callback for showing if everything was done.
         *
         * @callback doneCallback
         * @param {Error} err - Error object
         * @param {boolean} done - was request fully completed
         */
        /**
         * Adds a file from the disk to the archive
         *
         * @param {(object|string)} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the file.
         * @param {string} [options.comment] - Optional file comment.
         * @param {string} [options.zipPath] - Optional path inside the zip
         * @param {string} [options.zipName] - Optional name for the file
         * @param {doneCallback} callback - The callback that handles the response.
         */
        addLocalFileAsync: function(options2, callback) {
          options2 = typeof options2 == "object" ? options2 : { localPath: options2 };
          let localPath = pth.resolve(options2.localPath), { comment } = options2, { zipPath, zipName } = options2, self = this;
          filetools.fs.stat(localPath, function(err, stats) {
            if (err) return callback(err, !1);
            zipPath = zipPath ? fixPath(zipPath) : "";
            let p = pth.win32.basename(pth.win32.normalize(localPath));
            if (zipPath += zipName || p, stats.isFile())
              filetools.fs.readFile(localPath, function(err2, data) {
                return err2 ? callback(err2, !1) : (self.addFile(zipPath, data, comment, stats), setImmediate(callback, void 0, !0));
              });
            else if (stats.isDirectory())
              return zipPath += filetools.sep, self.addFile(zipPath, Buffer.alloc(0), comment, stats), setImmediate(callback, void 0, !0);
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - local path to the folder
         * @param {string} [zipPath] - optional path inside zip
         * @param {(RegExp|function)} [filter] - optional RegExp or Function if files match will be included.
         */
        addLocalFolder: function(localPath, zipPath, filter) {
          if (filter = filenameFilter(filter), zipPath = zipPath ? fixPath(zipPath) : "", localPath = pth.normalize(localPath), filetools.fs.existsSync(localPath)) {
            let items = filetools.findFiles(localPath), self = this;
            if (items.length)
              for (let filepath of items) {
                let p = pth.join(zipPath, relativePath(localPath, filepath));
                filter(p) && self.addLocalFile(filepath, pth.dirname(p));
              }
          } else
            throw Utils.Errors.FILE_NOT_FOUND(localPath);
        },
        /**
         * Asynchronous addLocalFolder
         * @param {string} localPath
         * @param {callback} callback
         * @param {string} [zipPath] optional path inside zip
         * @param {RegExp|function} [filter] optional RegExp or Function if files match will
         *               be included.
         */
        addLocalFolderAsync: function(localPath, callback, zipPath, filter) {
          filter = filenameFilter(filter), zipPath = zipPath ? fixPath(zipPath) : "", localPath = pth.normalize(localPath);
          var self = this;
          filetools.fs.open(localPath, "r", function(err) {
            if (err && err.code === "ENOENT")
              callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath));
            else if (err)
              callback(void 0, err);
            else {
              var items = filetools.findFiles(localPath), i = -1, next = function() {
                if (i += 1, i < items.length) {
                  var filepath = items[i], p = relativePath(localPath, filepath).split("\\").join("/");
                  p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, ""), filter(p) ? filetools.fs.stat(filepath, function(er0, stats) {
                    er0 && callback(void 0, er0), stats.isFile() ? filetools.fs.readFile(filepath, function(er1, data) {
                      er1 ? callback(void 0, er1) : (self.addFile(zipPath + p, data, "", stats), next());
                    }) : (self.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats), next());
                  }) : process.nextTick(() => {
                    next();
                  });
                } else
                  callback(!0, void 0);
              };
              next();
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {object | string} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the folder.
         * @param {string} [options.zipPath] - optional path inside zip.
         * @param {RegExp|function} [options.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [options.namefix] - optional function to help fix filename
         * @param {doneCallback} callback - The callback that handles the response.
         *
         */
        addLocalFolderAsync2: function(options2, callback) {
          let self = this;
          options2 = typeof options2 == "object" ? options2 : { localPath: options2 };
          let localPath = pth.resolve(options2.localPath), { zipPath, filter, namefix } = options2;
          filter instanceof RegExp ? filter = /* @__PURE__ */ function(rx) {
            return function(filename) {
              return rx.test(filename);
            };
          }(filter) : typeof filter != "function" && (filter = function() {
            return !0;
          }), zipPath = zipPath ? fixPath(zipPath) : "", namefix === "latin1" && (namefix = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "")), typeof namefix != "function" && (namefix = (str) => str);
          let relPathFix = (entry) => pth.join(zipPath, namefix(relativePath(localPath, entry))), fileNameFix = (entry) => pth.win32.basename(pth.win32.normalize(namefix(entry)));
          filetools.fs.open(localPath, "r", function(err) {
            err && err.code === "ENOENT" ? callback(Utils.Errors.FILE_NOT_FOUND(localPath), !1) : err ? callback(err, !1) : filetools.findFilesAsync(localPath, function(err2, fileEntries) {
              if (err2) return callback(err2, !1);
              if (fileEntries = fileEntries.filter((dir) => filter(relPathFix(dir))), !fileEntries.length) return callback(void 0, !0);
              setImmediate(
                fileEntries.reverse().reduce(function(next, entry) {
                  return function(err3, done) {
                    if (err3 || done === !1) return setImmediate(next, err3, !1);
                    self.addLocalFileAsync(
                      {
                        localPath: entry,
                        zipPath: pth.dirname(relPathFix(entry)),
                        zipName: fileNameFix(entry)
                      },
                      next
                    );
                  };
                }, callback)
              );
            });
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - path where files will be extracted
         * @param {object} props - optional properties
         * @param {string} [props.zipPath] - optional path inside zip
         * @param {RegExp|function} [props.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [props.namefix] - optional function to help fix filename
         */
        addLocalFolderPromise: function(localPath, props) {
          return new Promise((resolve, reject) => {
            this.addLocalFolderAsync2(Object.assign({ localPath }, props), (err, done) => {
              if (err) return reject(err);
              done && resolve(this);
            });
          });
        },
        /**
         * Allows you to create a entry (file or directory) in the zip file.
         * If you want to create a directory the entryName must end in / and a null buffer should be provided.
         * Comment and attributes are optional
         *
         * @param {string} entryName
         * @param {Buffer | string} content - file content as buffer or utf8 coded string
         * @param {string} [comment] - file comment
         * @param {number | object} [attr] - number as unix file permissions, object as filesystem Stats object
         */
        addFile: function(entryName, content, comment, attr) {
          entryName = zipnamefix(entryName);
          let entry = getEntry(entryName), update = entry != null;
          update || (entry = new ZipEntry(opts), entry.entryName = entryName), entry.comment = comment || "";
          let isStat = typeof attr == "object" && attr instanceof filetools.fs.Stats;
          isStat && (entry.header.time = attr.mtime);
          var fileattr = entry.isDirectory ? 16 : 0;
          let unix = entry.isDirectory ? 16384 : 32768;
          return isStat ? unix |= 4095 & attr.mode : typeof attr == "number" ? unix |= 4095 & attr : unix |= entry.isDirectory ? 493 : 420, fileattr = (fileattr | unix << 16) >>> 0, entry.attr = fileattr, entry.setData(content), update || _zip.setEntry(entry), entry;
        },
        /**
         * Returns an array of ZipEntry objects representing the files and folders inside the archive
         *
         * @param {string} [password]
         * @returns Array
         */
        getEntries: function(password) {
          return _zip.password = password, _zip ? _zip.entries : [];
        },
        /**
         * Returns a ZipEntry object representing the file or folder specified by ``name``.
         *
         * @param {string} name
         * @return ZipEntry
         */
        getEntry: function(name) {
          return getEntry(name);
        },
        getEntryCount: function() {
          return _zip.getEntryCount();
        },
        forEach: function(callback) {
          return _zip.forEach(callback);
        },
        /**
         * Extracts the given entry to the given targetPath
         * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
         *
         * @param {string|ZipEntry} entry - ZipEntry object or String with the full path of the entry
         * @param {string} targetPath - Target folder where to write the file
         * @param {boolean} [maintainEntryPath=true] - If maintainEntryPath is true and the entry is inside a folder, the entry folder will be created in targetPath as well. Default is TRUE
         * @param {boolean} [overwrite=false] - If the file already exists at the target path, the file will be overwriten if this is true.
         * @param {boolean} [keepOriginalPermission=false] - The file will be set as the permission from the entry if this is true.
         * @param {string} [outFileName] - String If set will override the filename of the extracted file (Only works if the entry is a file)
         *
         * @return Boolean
         */
        extractEntryTo: function(entry, targetPath, maintainEntryPath, overwrite, keepOriginalPermission, outFileName) {
          overwrite = get_Bool(!1, overwrite), keepOriginalPermission = get_Bool(!1, keepOriginalPermission), maintainEntryPath = get_Bool(!0, maintainEntryPath), outFileName = get_Str(keepOriginalPermission, outFileName);
          var item = getEntry(entry);
          if (!item)
            throw Utils.Errors.NO_ENTRY();
          var entryName = canonical(item.entryName), target = sanitize(targetPath, outFileName && !item.isDirectory ? canonical(outFileName) : maintainEntryPath ? entryName : pth.basename(entryName));
          if (item.isDirectory) {
            var children = _zip.getEntryChildren(item);
            return children.forEach(function(child) {
              if (child.isDirectory) return;
              var content2 = child.getData();
              if (!content2)
                throw Utils.Errors.CANT_EXTRACT_FILE();
              var name = canonical(maintainEntryPath ? child.entryName : child.entryName.substring(item.entryName.length)), childName = sanitize(targetPath, name);
              filetools.assertPathSafe(targetPath, childName);
              let fileAttr2 = keepOriginalPermission ? child.header.fileAttr : void 0;
              filetools.writeFileTo(childName, content2, overwrite, fileAttr2);
            }), !0;
          }
          var content = item.getData(_zip.password);
          if (!content) throw Utils.Errors.CANT_EXTRACT_FILE();
          if (filetools.assertPathSafe(targetPath, target), filetools.fs.existsSync(target) && !overwrite)
            throw Utils.Errors.CANT_OVERRIDE();
          let fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
          return filetools.writeFileTo(target, content, overwrite, fileAttr), !0;
        },
        /**
         * Test the archive
         * @param {string} [pass]
         */
        test: function(pass) {
          if (!_zip)
            return !1;
          for (var entry of _zip.entries)
            try {
              if (entry.isDirectory)
                continue;
              var content = entry.getData(pass);
              if (!content)
                return !1;
            } catch {
              return !1;
            }
          return !0;
        },
        /**
         * Extracts the entire archive to the given location
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {string|Buffer} [pass] password
         */
        extractAllTo: function(targetPath, overwrite, keepOriginalPermission, pass) {
          if (keepOriginalPermission = get_Bool(!1, keepOriginalPermission), pass = get_Str(keepOriginalPermission, pass), overwrite = get_Bool(!1, overwrite), !_zip) throw Utils.Errors.NO_ZIP();
          let dirEntries = [];
          _zip.entries.forEach(function(entry) {
            var entryName = sanitize(targetPath, canonical(entry.entryName));
            if (filetools.assertPathSafe(targetPath, entryName), entry.isDirectory) {
              filetools.makeDir(entryName), keepOriginalPermission && dirEntries.push({ path: entryName, attr: entry.header.fileAttr });
              return;
            }
            var content = entry.getData(pass);
            if (!content)
              throw Utils.Errors.CANT_EXTRACT_FILE();
            let fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            filetools.writeFileTo(entryName, content, overwrite, fileAttr);
            try {
              filetools.fs.utimesSync(entryName, entry.header.time, entry.header.time);
            } catch {
            }
          }), applyDirAttributes(dirEntries);
        },
        /**
         * Asynchronous extractAllTo
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {function} callback The callback will be executed when all entries are extracted successfully or any error is thrown.
         */
        extractAllToAsync: function(targetPath, overwrite, keepOriginalPermission, callback) {
          if (callback = get_Fun(overwrite, keepOriginalPermission, callback), keepOriginalPermission = get_Bool(!1, keepOriginalPermission), overwrite = get_Bool(!1, overwrite), !callback)
            return new Promise((resolve, reject) => {
              this.extractAllToAsync(targetPath, overwrite, keepOriginalPermission, function(err) {
                err ? reject(err) : resolve(this);
              });
            });
          if (!_zip) {
            callback(Utils.Errors.NO_ZIP());
            return;
          }
          targetPath = pth.resolve(targetPath);
          let getPath = (entry) => sanitize(targetPath, pth.normalize(canonical(entry.entryName))), getError = (msg, file) => new Error(msg + ': "' + file + '"'), dirEntries = [], fileEntries = [];
          _zip.entries.forEach((e) => {
            e.isDirectory ? dirEntries.push(e) : fileEntries.push(e);
          });
          let deferredDirAttr = [];
          for (let entry of dirEntries) {
            let dirPath = getPath(entry), dirAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            try {
              filetools.assertPathSafe(targetPath, dirPath), filetools.makeDir(dirPath);
            } catch {
              callback(getError("Unable to create folder", dirPath));
              continue;
            }
            dirAttr && deferredDirAttr.push({ path: dirPath, attr: dirAttr });
            try {
              filetools.fs.utimesSync(dirPath, entry.header.time, entry.header.time);
            } catch {
            }
          }
          let done = (err) => {
            if (!err)
              try {
                applyDirAttributes(deferredDirAttr);
              } catch (er) {
                return callback(getError("Unable to set folder permissions", er.path || ""));
              }
            callback(err);
          };
          fileEntries.reverse().reduce(function(next, entry) {
            return function(err) {
              if (err)
                next(err);
              else {
                let entryName = pth.normalize(canonical(entry.entryName)), filePath = sanitize(targetPath, entryName);
                try {
                  filetools.assertPathSafe(targetPath, filePath);
                } catch (er) {
                  return next(er);
                }
                entry.getDataAsync(function(content, err_1) {
                  if (err_1)
                    next(err_1);
                  else if (!content)
                    next(Utils.Errors.CANT_EXTRACT_FILE());
                  else {
                    let fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
                    filetools.writeFileToAsync(filePath, content, overwrite, fileAttr, function(succ) {
                      if (!succ)
                        return next(getError("Unable to write file", filePath));
                      filetools.fs.utimes(filePath, entry.header.time, entry.header.time, function() {
                        next();
                      });
                    });
                  }
                });
              }
            };
          }, done)();
        },
        /**
         * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
         *
         * @param {string} targetFileName
         * @param {function} callback
         */
        writeZip: function(targetFileName, callback) {
          if (arguments.length === 1 && typeof targetFileName == "function" && (callback = targetFileName, targetFileName = ""), !targetFileName && opts.filename && (targetFileName = opts.filename), !!targetFileName) {
            var zipData = _zip.compressToBuffer();
            if (zipData) {
              var ok = filetools.writeFileTo(targetFileName, zipData, !0);
              typeof callback == "function" && callback(ok ? null : new Error("failed"), "");
            }
          }
        },
        /**
                 *
                 * @param {string} targetFileName
                 * @param {object} [props]
                 * @param {boolean} [props.overwrite=true] If the file already exists at the target path, the file will be overwriten if this is true.
                 * @param {boolean} [props.perm] The file will be set as the permission from the entry if this is true.
        
                 * @returns {Promise<void>}
                 */
        writeZipPromise: function(targetFileName, props) {
          let { overwrite, perm } = Object.assign({ overwrite: !0 }, props);
          return new Promise((resolve, reject) => {
            !targetFileName && opts.filename && (targetFileName = opts.filename), targetFileName || reject("ADM-ZIP: ZIP File Name Missing"), this.toBufferPromise().then((zipData) => {
              let ret = (done) => done ? resolve(done) : reject("ADM-ZIP: Wasn't able to write zip file");
              filetools.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
            }, reject);
          });
        },
        /**
         * @returns {Promise<Buffer>} A promise to the Buffer.
         */
        toBufferPromise: function() {
          return new Promise((resolve, reject) => {
            _zip.toAsyncBuffer(resolve, reject);
          });
        },
        /**
         * Returns the content of the entire zip file as a Buffer object
         *
         * @prop {function} [onSuccess]
         * @prop {function} [onFail]
         * @prop {function} [onItemStart]
         * @prop {function} [onItemEnd]
         * @returns {Buffer}
         */
        toBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          return typeof onSuccess == "function" ? (_zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd), null) : _zip.compressToBuffer();
        }
      };
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/cloud/index.js
var require_cloud = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/cloud/index.js"(exports2, module2) {
    "use strict";
    var https = require("https"), fs = require("fs"), util = require("util"), AdmZip = require_adm_zip(), { URL: URL2 } = require("url"), errors = require_errors(), utils = require_utils(), { DsePlainTextAuthProvider, NoAuthProvider } = require_auth(), readFile = util.promisify(fs.readFile);
    async function init(options) {
      if (!options.cloud)
        return;
      let cloudOptions = new CloudOptions(options);
      await parseZipFile(cloudOptions), await getMetadataServiceInfoAsync(cloudOptions), cloudOptions.clientOptions.sslOptions.checkServerIdentity || (cloudOptions.clientOptions.sslOptions.checkServerIdentity = (_, cert) => checkServerIdentity(cert, cloudOptions.clientOptions.sni.address));
    }
    var CloudOptions = class {
      constructor(clientOptions) {
        this.clientOptions = clientOptions, clientOptions.cloud.secureConnectBundle ? (this.secureConnectBundle = clientOptions.cloud.secureConnectBundle, this.serviceUrl = null) : this.serviceUrl = clientOptions.cloud.endpoint, this.logEmitter = clientOptions.logEmitter, this.contactPoints = null, this.localDataCenter = null;
      }
      /**
       * The sslOptions in the client options from a given map.
       * @param {Map<String, Buffer>} zipEntries
       */
      setSslOptions(zipEntries) {
        this.clientOptions.sslOptions = Object.assign({
          ca: [zipEntries.get("ca.crt")],
          cert: zipEntries.get("cert"),
          key: zipEntries.get("key"),
          rejectUnauthorized: !0
        }, this.clientOptions.sslOptions);
      }
      /**
       *
       * @param username
       * @param password
       */
      setAuthProvider(username, password) {
        !username || !password || this.clientOptions.authProvider && !(this.clientOptions.authProvider instanceof NoAuthProvider) || (this.clientOptions.authProvider = new DsePlainTextAuthProvider(username, password));
      }
    };
    async function parseZipFile(cloudOptions) {
      if (cloudOptions.serviceUrl)
        return;
      if (!cloudOptions.secureConnectBundle)
        throw new TypeError("secureConnectBundle must be provided");
      let data = await readFile(cloudOptions.secureConnectBundle), zip = new AdmZip(data), zipEntries = new Map(zip.getEntries().map((e) => [e.entryName, e.getData()]));
      if (!zipEntries.get("config.json"))
        throw new TypeError("Config file must be contained in secure bundle");
      let config = JSON.parse(zipEntries.get("config.json").toString("utf8"));
      if (!config.host || !config.port)
        throw new TypeError("Config file must include host and port information");
      cloudOptions.serviceUrl = `${config.host}:${config.port}/metadata`, cloudOptions.setSslOptions(zipEntries), cloudOptions.setAuthProvider(config.username, config.password);
    }
    function getMetadataServiceInfo(cloudOptions, callback) {
      let matches = /^(.+?):(\d+)(.*)$/.exec(cloudOptions.serviceUrl);
      if (callback = utils.callbackOnce(callback), !matches || matches.length !== 4)
        throw new TypeError("url should be composed of host, port number and path, without scheme");
      let requestOptions = Object.assign({
        hostname: matches[1],
        port: matches[2],
        path: matches[3] || void 0,
        timeout: cloudOptions.clientOptions.socketOptions.connectTimeout
      }, cloudOptions.clientOptions.sslOptions), req = https.get(requestOptions, (res) => {
        let data = "";
        utils.log("verbose", `Connected to metadata service with SSL/TLS protocol ${res.socket.getProtocol()}`, {}, cloudOptions), res.on("data", (chunk) => data += chunk.toString()).on("end", () => {
          if (res.statusCode !== 200)
            return callback(getServiceRequestError(new Error(`Obtained http status ${res.statusCode}`), requestOptions));
          let message;
          try {
            if (message = JSON.parse(data), !message || !message.contact_info)
              throw new TypeError("contact_info should be defined in response");
          } catch (err) {
            return callback(getServiceRequestError(err, requestOptions, !0));
          }
          let contactInfo = message.contact_info;
          cloudOptions.clientOptions.contactPoints = contactInfo.contact_points, cloudOptions.clientOptions.localDataCenter = contactInfo.local_dc, cloudOptions.clientOptions.sni = { address: contactInfo.sni_proxy_address }, callback();
        });
      });
      req.on("error", (err) => callback(getServiceRequestError(err, requestOptions))), req.setTimeout(cloudOptions.clientOptions.socketOptions.connectTimeout, () => req.abort());
    }
    var getMetadataServiceInfoAsync = util.promisify(getMetadataServiceInfo);
    function getServiceRequestError(err, requestOptions, isParsingError) {
      let message = isParsingError ? "There was an error while parsing the metadata service information" : "There was an error fetching the metadata information", url = `${requestOptions.hostname}:${requestOptions.port}${requestOptions.path ? requestOptions.path : "/"}`;
      return new errors.NoHostAvailableError({ [url]: err }, message);
    }
    function checkServerIdentity(cert, sniAddress) {
      let hostName = sniAddress.split(":")[0], altNames = cert.subjectaltname, cn = cert.subject.CN;
      if (hostName === cn)
        return;
      let parsedAltNames = [];
      if (altNames)
        for (let name of altNames.split(", "))
          name.startsWith("DNS:") ? parsedAltNames.push(name.slice(4)) : name.startsWith("URI:") && parsedAltNames.push(new URL2(name.slice(4)).hostname);
      let hostParts = hostName.split("."), wildcard = (pattern) => checkParts(hostParts, pattern), valid;
      if (parsedAltNames.length > 0 ? valid = parsedAltNames.some(wildcard) : valid = wildcard(cn), !valid) {
        let error = new Error(`Host: ${hostName} is not cert's CN/altnames: ${cn} / ${altNames}`);
        return error.reason = error.message, error.host = hostName, error.cert = cert, error;
      }
    }
    function checkParts(hostParts, pattern) {
      if (!pattern)
        return !1;
      let patternParts = pattern.split(".");
      if (hostParts.length !== patternParts.length)
        return !1;
      for (let i = hostParts.length - 1; i > 0; i -= 1)
        if (hostParts[i] !== patternParts[i])
          return !1;
      let hostSubdomain = hostParts[0], patternSubdomain = patternParts[0], patternSubdomainParts = patternSubdomain.split("*");
      if (patternSubdomainParts.length === 1 || patternSubdomain.includes("xn--"))
        return hostSubdomain === patternSubdomain;
      if (patternSubdomainParts.length > 2 || patternParts.length <= 2)
        return !1;
      let [prefix, suffix] = patternSubdomainParts;
      return !(prefix.length + suffix.length > hostSubdomain.length || !hostSubdomain.startsWith(prefix) || !hostSubdomain.endsWith(suffix));
    }
    module2.exports = {
      checkServerIdentity,
      init
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/result-set.js
var require_result_set2 = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/result-set.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    function GraphResultSet(result, rowParser) {
      this.info = result.info;
      let rows = result.rows;
      rowParser = rowParser || parsePlainJsonRow, this.length = result.rowLength, this.pageState = result.pageState, this.first = function() {
        let item = this.values().next();
        return item.done ? null : item.value;
      }, this.forEach = function(callback, thisArg) {
        if (!rows.length)
          return;
        let iterator = this.values(), item = iterator.next(), index = 0;
        for (; !item.done; )
          callback.call(thisArg || this, item.value, index++), item = iterator.next();
      }, this.toArray = function() {
        return rows.length ? utils.iteratorToArray(this.values()) : utils.emptyArray;
      }, this.values = function* () {
        for (let traverser of this.getTraversers()) {
          let bulk = traverser.bulk || 1;
          for (let j = 0; j < bulk; j++)
            yield traverser.object;
        }
      }, this.getTraversers = function* () {
        for (let row of rows)
          yield rowParser(row);
      };
    }
    typeof Symbol < "u" && typeof Symbol.iterator == "symbol" && (GraphResultSet.prototype[Symbol.iterator] = function() {
      return this.values();
    });
    function parsePlainJsonRow(row) {
      let parsed = JSON.parse(row.gremlin);
      return { object: parsed.result, bulk: parsed.bulk || 1 };
    }
    module2.exports = GraphResultSet;
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/wrappers.js
var require_wrappers = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/wrappers.js"(exports2, module2) {
    "use strict";
    var types = require_types(), { dataTypes } = types, GraphTypeWrapper = class {
      constructor(value, typeInfo) {
        this.value = value, this.typeInfo = typeof typeInfo == "number" ? { code: typeInfo } : typeInfo;
      }
    }, UdtGraphWrapper = class {
      constructor(value, udtInfo) {
        if (this.value = value, !udtInfo || !udtInfo.name || !udtInfo.keyspace || !udtInfo.fields)
          throw new TypeError("udtInfo must be an object with name, keyspace and field properties defined");
        this.udtInfo = udtInfo;
      }
    };
    function asInt(value) {
      return new GraphTypeWrapper(value, dataTypes.int);
    }
    function asDouble(value) {
      return new GraphTypeWrapper(value, dataTypes.double);
    }
    function asFloat(value) {
      return new GraphTypeWrapper(value, dataTypes.float);
    }
    function asTimestamp(value) {
      return new GraphTypeWrapper(value, dataTypes.timestamp);
    }
    function asUdt(value, udtInfo) {
      return new UdtGraphWrapper(value, udtInfo);
    }
    module2.exports = { asInt, asDouble, asFloat, asTimestamp, asUdt, UdtGraphWrapper, GraphTypeWrapper };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/complex-type-helper.js
var require_complex_type_helper = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/complex-type-helper.js"(exports2, module2) {
    "use strict";
    var { GraphTypeWrapper, UdtGraphWrapper } = require_wrappers(), types = require_types(), Encoder = require_encoder(), { dataTypes } = types;
    function getTypeDefinitionByValue(value) {
      if (value instanceof types.Tuple)
        return {
          cqlType: "tuple",
          definition: value.elements.map(getTypeDefinitionByValue)
        };
      if (value instanceof Map) {
        let result = { cqlType: "map" };
        if (value.size > 0) {
          let first = value.entries().next().value;
          result.definition = first.map(getTypeDefinitionByValue);
        }
        return result;
      }
      if (value instanceof UdtGraphWrapper)
        return getUdtTypeDefinitionByValue(value);
      let type;
      return value instanceof GraphTypeWrapper ? type = value.typeInfo : type = Encoder.guessDataType(value), type ? getDefinitionByType(type) : null;
    }
    function getDefinitionByType(type) {
      return type.code === dataTypes.udt ? getUdtTypeDefinition(type.info) : type.code === dataTypes.tuple || type.code === dataTypes.map ? {
        cqlType: types.getDataTypeNameByCode(type),
        definition: type.info.map(getDefinitionByType)
      } : type.code === dataTypes.list || type.code === dataTypes.set ? {
        cqlType: type.code === dataTypes.list ? "list" : "set",
        definition: [getDefinitionByType(type.info)]
      } : { cqlType: types.getDataTypeNameByCode(type) };
    }
    function getUdtTypeDefinition(udtInfo) {
      return {
        cqlType: "udt",
        keyspace: udtInfo.keyspace,
        name: udtInfo.name,
        definition: udtInfo.fields.map(
          (field) => (
            // fieldName should be the first property serialized
            Object.assign({ fieldName: field.name }, getDefinitionByType(field.type))
          )
        )
      };
    }
    function getUdtTypeDefinitionByValue(wrappedValue) {
      return getUdtTypeDefinition(wrappedValue.udtInfo);
    }
    module2.exports = { getTypeDefinitionByValue, getUdtTypeDefinitionByValue };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/structure.js
var require_structure = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/structure.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    function Element(id, label) {
      this.id = id, this.label = label;
    }
    function Vertex(id, label, properties) {
      Element.call(this, id, label), this.properties = properties;
    }
    util.inherits(Vertex, Element);
    function Edge(id, outV, outVLabel, label, inV, inVLabel, properties) {
      Element.call(this, id, label), this.outV = outV, this.outVLabel = outVLabel, this.inV = inV, this.inVLabel = inVLabel, this.properties = {}, function(self) {
        if (properties) {
          let keys = Object.keys(properties);
          for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            self.properties[k] = properties[k].value;
          }
        }
      }(this);
    }
    util.inherits(Edge, Element);
    function VertexProperty(id, label, value, properties) {
      Element.call(this, id, label), this.value = value, this.key = this.label, this.properties = properties;
    }
    util.inherits(VertexProperty, Element);
    function Property(key, value) {
      this.key = key, this.value = value;
    }
    function Path(labels, objects) {
      this.labels = labels, this.objects = objects;
    }
    module2.exports = {
      Edge,
      Element,
      Path,
      Property,
      Vertex,
      VertexProperty
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/custom-type-serializers.js
var require_custom_type_serializers = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/custom-type-serializers.js"(exports2, module2) {
    "use strict";
    var types = require_types(), utils = require_utils(), { getTypeDefinitionByValue, getUdtTypeDefinitionByValue } = require_complex_type_helper(), { Point, Polygon, LineString } = require_geometry2(), { Edge } = require_structure(), { GraphTypeWrapper, UdtGraphWrapper } = require_wrappers(), { Tuple, dataTypes } = types, typeKey = "@type", valueKey = "@value", EdgeDeserializer = class {
      constructor() {
        this.key = "g:Edge";
      }
      deserialize(obj) {
        let value = obj[valueKey];
        return new Edge(this.reader.read(value.id), this.reader.read(value.outV), value.outVLabel, value.label, this.reader.read(value.inV), value.inVLabel, this.reader.read(value.properties));
      }
    }, StringBasedTypeSerializer = class {
      /**
       * Creates a new instance of the deserializer.
       * @param {String} key
       * @param {Function} targetType
       */
      constructor(key, targetType) {
        if (!key)
          throw new Error("Deserializer must provide a type key");
        if (!targetType)
          throw new Error("Deserializer must provide a target type");
        this.key = key, this.targetType = targetType;
      }
      deserialize(obj) {
        let value = obj[valueKey];
        return typeof value != "string" && (value = value.toString()), this.targetType.fromString(value);
      }
      serialize(value) {
        return {
          [typeKey]: this.key,
          [valueKey]: value.toString()
        };
      }
      canBeUsedFor(value) {
        return value instanceof this.targetType;
      }
    }, UuidSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("g:UUID", types.Uuid);
      }
    }, LongSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("g:Int64", types.Long);
      }
    }, BigDecimalSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("gx:BigDecimal", types.BigDecimal);
      }
    }, BigIntegerSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("gx:BigInteger", types.Integer);
      }
    }, InetAddressSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("gx:InetAddress", types.InetAddress);
      }
    }, LocalDateSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("gx:LocalDate", types.LocalDate);
      }
    }, LocalTimeSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("gx:LocalTime", types.LocalTime);
      }
    }, InstantSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("gx:Instant", Date);
      }
      serialize(item) {
        return {
          [typeKey]: this.key,
          [valueKey]: item.toISOString()
        };
      }
      deserialize(obj) {
        return new Date(obj[valueKey]);
      }
    }, BlobSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("dse:Blob", Buffer);
      }
      deserialize(obj) {
        return utils.allocBufferFromString(obj[valueKey], "base64");
      }
      serialize(item) {
        return {
          [typeKey]: this.key,
          [valueKey]: item.toString("base64")
        };
      }
    }, PointSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("dse:Point", Point);
      }
    }, LineStringSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("dse:LineString", LineString);
      }
    }, PolygonSerializer = class extends StringBasedTypeSerializer {
      constructor() {
        super("dse:Polygon", Polygon);
      }
    }, TupleSerializer = class {
      constructor() {
        this.key = "dse:Tuple";
      }
      deserialize(obj) {
        let value = obj[valueKey].value;
        if (!Array.isArray(value))
          throw new Error("Expected Array, obtained: " + value);
        let result = [];
        for (let element of value)
          result.push(this.reader.read(element));
        return Tuple.fromArray(result);
      }
      /** @param {Tuple} tuple */
      serialize(tuple) {
        let result = {
          cqlType: "tuple",
          definition: tuple.elements.map(getTypeDefinitionByValue),
          value: tuple.elements.map((e) => this.writer.adaptObject(e))
        };
        return {
          [typeKey]: this.key,
          [valueKey]: result
        };
      }
      canBeUsedFor(value) {
        return value instanceof Tuple;
      }
    }, DurationSerializer = class {
      constructor() {
        this.key = "dse:Duration";
      }
      deserialize(obj) {
        let value = obj[valueKey];
        return new types.Duration(
          this.reader.read(value.months),
          this.reader.read(value.days),
          this.reader.read(value.nanos)
        );
      }
      /** @param {Duration} value */
      serialize(value) {
        return {
          [typeKey]: this.key,
          [valueKey]: {
            months: value.months,
            days: value.days,
            nanos: value.nanoseconds
          }
        };
      }
      canBeUsedFor(value) {
        return value instanceof types.Duration;
      }
    }, UdtSerializer = class {
      constructor() {
        this.key = "dse:UDT";
      }
      deserialize(obj) {
        let valueRoot = obj[valueKey], result = {}, value = valueRoot.value;
        return valueRoot.definition.forEach((definition, index) => {
          result[definition.fieldName] = this.reader.read(value[index]);
        }), result;
      }
      serialize(udtWrapper) {
        let serializedValue = getUdtTypeDefinitionByValue(udtWrapper);
        return serializedValue.value = Object.entries(udtWrapper.value).map(([_, v]) => this.writer.adaptObject(v)), {
          [typeKey]: this.key,
          [valueKey]: serializedValue
        };
      }
      canBeUsedFor(value) {
        return value instanceof UdtGraphWrapper;
      }
    }, InternalSerializer = class {
      constructor(name, transformFn) {
        this._name = name, this._transformFn = transformFn || ((x) => x);
      }
      serialize(item) {
        return {
          [typeKey]: this._name,
          [valueKey]: this._transformFn(item)
        };
      }
    }, graphSONSerializerByCqlType = {
      [dataTypes.int]: new InternalSerializer("g:Int32"),
      [dataTypes.bigint]: new InternalSerializer("g:Int64"),
      [dataTypes.double]: new InternalSerializer("g:Double"),
      [dataTypes.float]: new InternalSerializer("g:Float"),
      [dataTypes.timestamp]: new InternalSerializer("g:Timestamp", (x) => x.getTime())
    }, GraphTypeWrapperSerializer = class {
      constructor() {
        this.key = "client:wrapper";
      }
      serialize(wrappedValue) {
        let s = graphSONSerializerByCqlType[wrappedValue.typeInfo.code];
        if (!s)
          throw new Error(`No serializer found for wrapped value ${wrappedValue}`);
        return s.serialize(wrappedValue.value);
      }
      canBeUsedFor(value) {
        return value instanceof GraphTypeWrapper;
      }
    }, serializersArray = [
      EdgeDeserializer,
      UuidSerializer,
      LongSerializer,
      BigDecimalSerializer,
      BigIntegerSerializer,
      InetAddressSerializer,
      LocalDateSerializer,
      LocalTimeSerializer,
      InstantSerializer,
      BlobSerializer,
      PointSerializer,
      LineStringSerializer,
      PolygonSerializer,
      TupleSerializer,
      UdtSerializer,
      GraphTypeWrapperSerializer,
      DurationSerializer
    ];
    function getCustomSerializers() {
      let customSerializers = {};
      return serializersArray.forEach((sConstructor) => {
        let instance = new sConstructor();
        if (!instance.key)
          throw new TypeError(`Key for ${sConstructor} instance not set`);
        customSerializers[instance.key] = instance;
      }), customSerializers;
    }
    module2.exports = getCustomSerializers;
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/index.js
var require_graph = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/index.js"(exports2, module2) {
    "use strict";
    var GraphResultSet = require_result_set2(), getCustomTypeSerializers = require_custom_type_serializers(), { asInt, asDouble, asFloat, asTimestamp, asUdt, UdtGraphWrapper, GraphTypeWrapper } = require_wrappers(), { Edge, Element, Path, Property, Vertex, VertexProperty } = require_structure(), EnumValue = class {
      constructor(typeName, elementName) {
        this.typeName = typeName, this.elementName = elementName;
      }
      toString() {
        return this.elementName;
      }
    }, t = {
      id: new EnumValue("T", "id"),
      key: new EnumValue("T", "key"),
      label: new EnumValue("T", "label"),
      value: new EnumValue("T", "value")
    }, direction = {
      both: new EnumValue("Direction", "BOTH"),
      in: new EnumValue("Direction", "IN"),
      out: new EnumValue("Direction", "OUT")
    };
    direction.in_ = direction.in;
    module2.exports = {
      Edge,
      Element,
      Path,
      Property,
      Vertex,
      VertexProperty,
      asInt,
      asDouble,
      asFloat,
      asTimestamp,
      asUdt,
      direction,
      getCustomTypeSerializers,
      GraphResultSet,
      GraphTypeWrapper,
      t,
      UdtGraphWrapper
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/type-serializers.js
var require_type_serializers = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/type-serializers.js"(exports2, module2) {
    "use strict";
    var t = {
      P: UnsupportedType,
      TextP: UnsupportedType,
      Traversal: UnsupportedType,
      Traverser: UnsupportedType,
      EnumValue: UnsupportedType
    }, ts = { TraversalStrategy: UnsupportedType }, Bytecode = UnsupportedType, g = require_graph(), utils = { Long: UnsupportedType };
    t.t = g.t;
    t.direction = g.direction;
    function UnsupportedType() {
    }
    var valueKey = "@value", typeKey = "@type", TypeSerializer = class {
      serialize() {
        throw new Error("serialize() method not implemented for " + this.constructor.name);
      }
      deserialize() {
        throw new Error("deserialize() method not implemented for " + this.constructor.name);
      }
      canBeUsedFor() {
        throw new Error("canBeUsedFor() method not implemented for " + this.constructor.name);
      }
    }, NumberSerializer = class extends TypeSerializer {
      serialize(item) {
        return isNaN(item) ? {
          [typeKey]: "g:Double",
          [valueKey]: "NaN"
        } : item === Number.POSITIVE_INFINITY ? {
          [typeKey]: "g:Double",
          [valueKey]: "Infinity"
        } : item === Number.NEGATIVE_INFINITY ? {
          [typeKey]: "g:Double",
          [valueKey]: "-Infinity"
        } : item;
      }
      deserialize(obj) {
        var val = obj[valueKey];
        return val === "NaN" ? NaN : val === "Infinity" ? Number.POSITIVE_INFINITY : val === "-Infinity" ? Number.NEGATIVE_INFINITY : parseFloat(val);
      }
      canBeUsedFor(value) {
        return typeof value == "number";
      }
    }, DateSerializer = class extends TypeSerializer {
      serialize(item) {
        return {
          [typeKey]: "g:Date",
          [valueKey]: item.getTime()
        };
      }
      deserialize(obj) {
        return new Date(obj[valueKey]);
      }
      canBeUsedFor(value) {
        return value instanceof Date;
      }
    }, LongSerializer = class extends TypeSerializer {
      serialize(item) {
        return {
          [typeKey]: "g:Int64",
          [valueKey]: item.value
        };
      }
      canBeUsedFor(value) {
        return value instanceof utils.Long;
      }
    }, BytecodeSerializer = class extends TypeSerializer {
      serialize(item) {
        let bytecode = item;
        item instanceof t.Traversal && (bytecode = item.getBytecode());
        let result = {};
        result[typeKey] = "g:Bytecode";
        let resultValue = result[valueKey] = {}, sources = this._serializeInstructions(bytecode.sourceInstructions);
        sources && (resultValue.source = sources);
        let steps = this._serializeInstructions(bytecode.stepInstructions);
        return steps && (resultValue.step = steps), result;
      }
      _serializeInstructions(instructions) {
        if (instructions.length === 0)
          return null;
        let result = new Array(instructions.length);
        result[0] = instructions[0];
        for (let i = 0; i < instructions.length; i++)
          result[i] = instructions[i].map((item) => this.writer.adaptObject(item));
        return result;
      }
      canBeUsedFor(value) {
        return value instanceof Bytecode || value instanceof t.Traversal;
      }
    }, PSerializer = class extends TypeSerializer {
      /** @param {P} item */
      serialize(item) {
        let result = {};
        result[typeKey] = "g:P";
        let resultValue = result[valueKey] = {
          predicate: item.operator
        };
        return item.other === void 0 || item.other === null ? resultValue.value = this.writer.adaptObject(item.value) : resultValue.value = [this.writer.adaptObject(item.value), this.writer.adaptObject(item.other)], result;
      }
      canBeUsedFor(value) {
        return value instanceof t.P;
      }
    }, TextPSerializer = class extends TypeSerializer {
      /** @param {TextP} item */
      serialize(item) {
        let result = {};
        result[typeKey] = "g:TextP";
        let resultValue = result[valueKey] = {
          predicate: item.operator
        };
        return item.other === void 0 || item.other === null ? resultValue.value = this.writer.adaptObject(item.value) : resultValue.value = [this.writer.adaptObject(item.value), this.writer.adaptObject(item.other)], result;
      }
      canBeUsedFor(value) {
        return value instanceof t.TextP;
      }
    }, LambdaSerializer = class extends TypeSerializer {
      /** @param {Function} item */
      serialize(item) {
        return {
          [typeKey]: "g:Lambda",
          [valueKey]: {
            arguments: item.length,
            language: "gremlin-javascript",
            script: item.toString()
          }
        };
      }
      canBeUsedFor(value) {
        return typeof value == "function";
      }
    }, EnumSerializer = class extends TypeSerializer {
      /** @param {EnumValue} item */
      serialize(item) {
        return {
          [typeKey]: "g:" + item.typeName,
          [valueKey]: item.elementName
        };
      }
      canBeUsedFor(value) {
        return value && value.typeName && value instanceof t.EnumValue;
      }
    }, TraverserSerializer = class extends TypeSerializer {
      /** @param {Traverser} item */
      serialize(item) {
        return {
          [typeKey]: "g:Traverser",
          [valueKey]: {
            value: this.writer.adaptObject(item.object),
            bulk: this.writer.adaptObject(item.bulk)
          }
        };
      }
      deserialize(obj) {
        let value = obj[valueKey];
        return new t.Traverser(this.reader.read(value.value), this.reader.read(value.bulk));
      }
      canBeUsedFor(value) {
        return value instanceof t.Traverser;
      }
    }, TraversalStrategySerializer = class extends TypeSerializer {
      /** @param {TraversalStrategy} item */
      serialize(item) {
        return {
          [typeKey]: "g:" + item.constructor.name,
          [valueKey]: item.configuration
        };
      }
      canBeUsedFor(value) {
        return value instanceof ts.TraversalStrategy;
      }
    }, VertexSerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        return new g.Vertex(this.reader.read(value.id), value.label, this.reader.read(value.properties));
      }
      /** @param {Vertex} item */
      serialize(item) {
        return {
          [typeKey]: "g:Vertex",
          [valueKey]: {
            id: this.writer.adaptObject(item.id),
            label: item.label
          }
        };
      }
      canBeUsedFor(value) {
        return value instanceof g.Vertex;
      }
    }, VertexPropertySerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        return new g.VertexProperty(
          this.reader.read(value.id),
          value.label,
          this.reader.read(value.value),
          this.reader.read(value.properties)
        );
      }
    }, PropertySerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        return new g.Property(
          value.key,
          this.reader.read(value.value)
        );
      }
    }, EdgeSerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        return new g.Edge(
          this.reader.read(value.id),
          new g.Vertex(this.reader.read(value.outV), this.reader.read(value.outVLabel)),
          value.label,
          new g.Vertex(this.reader.read(value.inV), this.reader.read(value.inVLabel)),
          this.reader.read(value.properties)
        );
      }
      /** @param {Edge} item */
      serialize(item) {
        return {
          [typeKey]: "g:Edge",
          [valueKey]: {
            id: this.writer.adaptObject(item.id),
            label: item.label,
            outV: this.writer.adaptObject(item.outV.id),
            outVLabel: item.outV.label,
            inV: this.writer.adaptObject(item.inV.id),
            inVLabel: item.inV.label
          }
        };
      }
      canBeUsedFor(value) {
        return value instanceof g.Edge;
      }
    }, PathSerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey], objects = value.objects.map((o) => this.reader.read(o));
        return new g.Path(this.reader.read(value.labels), objects);
      }
    }, Path3Serializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        return new g.Path(this.reader.read(value.labels), this.reader.read(value.objects));
      }
    }, TSerializer = class extends TypeSerializer {
      deserialize(obj) {
        return t.t[obj[valueKey]];
      }
    }, DirectionSerializer = class extends TypeSerializer {
      deserialize(obj) {
        return t.direction[obj[valueKey].toLowerCase()];
      }
    }, ArraySerializer = class extends TypeSerializer {
      constructor(typeKey2) {
        super(), this.typeKey = typeKey2;
      }
      deserialize(obj) {
        let value = obj[valueKey];
        if (!Array.isArray(value))
          throw new Error("Expected Array, obtained: " + value);
        return value.map((x) => this.reader.read(x));
      }
      /** @param {Array} item */
      serialize(item) {
        return {
          [typeKey]: this.typeKey,
          [valueKey]: item.map((x) => this.writer.adaptObject(x))
        };
      }
      canBeUsedFor(value) {
        return Array.isArray(value);
      }
    }, BulkSetSerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        if (!Array.isArray(value))
          throw new Error("Expected Array, obtained: " + value);
        let result = [];
        for (let ix = 0, iy = value.length; ix < iy; ix += 2) {
          let pair = value.slice(ix, ix + 2);
          result = result.concat(Array(this.reader.read(pair[1])).fill(this.reader.read(pair[0])));
        }
        return result;
      }
    }, MapSerializer = class extends TypeSerializer {
      deserialize(obj) {
        let value = obj[valueKey];
        if (!Array.isArray(value))
          throw new Error("Expected Array, obtained: " + value);
        let result = /* @__PURE__ */ new Map();
        for (let i = 0; i < value.length; i += 2)
          result.set(this.reader.read(value[i]), this.reader.read(value[i + 1]));
        return result;
      }
      /** @param {Map} map */
      serialize(map) {
        let arr = [];
        return map.forEach((v, k) => {
          arr.push(this.writer.adaptObject(k)), arr.push(this.writer.adaptObject(v));
        }), {
          [typeKey]: "g:Map",
          [valueKey]: arr
        };
      }
      canBeUsedFor(value) {
        return value instanceof Map;
      }
    }, ListSerializer = class extends ArraySerializer {
      constructor() {
        super("g:List");
      }
    }, SetSerializer = class extends ArraySerializer {
      constructor() {
        super("g:Set");
      }
    };
    module2.exports = {
      BulkSetSerializer,
      BytecodeSerializer,
      DateSerializer,
      DirectionSerializer,
      EdgeSerializer,
      EnumSerializer,
      LambdaSerializer,
      ListSerializer,
      LongSerializer,
      MapSerializer,
      NumberSerializer,
      Path3Serializer,
      PathSerializer,
      PropertySerializer,
      PSerializer,
      TextPSerializer,
      SetSerializer,
      TSerializer,
      TraverserSerializer,
      TraversalStrategySerializer,
      typeKey,
      valueKey,
      VertexPropertySerializer,
      VertexSerializer
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/graph-serializer.js
var require_graph_serializer = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/graph-serializer.js"(exports2, module2) {
    "use strict";
    var typeSerializers = require_type_serializers(), GraphSON2Writer = class {
      /**
       * @param {Object} [options]
       * @param {Object} [options.serializers] An object used as an associative array with GraphSON 2 type name as keys and
       * serializer instances as values, ie: { 'g:Int64': longSerializer }.
       * @constructor
       */
      constructor(options) {
        this._options = options || {}, this._serializers = this.getDefaultSerializers().map((serializerConstructor) => {
          let s = new serializerConstructor();
          return s.writer = this, s;
        });
        let customSerializers = this._options.serializers || {};
        Object.keys(customSerializers).forEach((key) => {
          let s = customSerializers[key];
          s.serialize && (s.writer = this, this._serializers.unshift(s));
        });
      }
      /**
       * Gets the default serializers to be used.
       * @returns {Array}
       */
      getDefaultSerializers() {
        return graphSON2Serializers;
      }
      adaptObject(value) {
        let s;
        for (let i = 0; i < this._serializers.length; i++) {
          let currentSerializer = this._serializers[i];
          if (currentSerializer.canBeUsedFor && currentSerializer.canBeUsedFor(value)) {
            s = currentSerializer;
            break;
          }
        }
        return s ? s.serialize(value) : Array.isArray(value) ? value.map((item) => this.adaptObject(item)) : value;
      }
      /**
       * Returns the GraphSON representation of the provided object instance.
       * @param {Object} obj
       * @returns {String}
       */
      write(obj) {
        return JSON.stringify(this.adaptObject(obj));
      }
    }, GraphSON3Writer = class extends GraphSON2Writer {
      getDefaultSerializers() {
        return graphSON3Serializers;
      }
    }, GraphSON2Reader = class {
      /**
       * GraphSON Reader
       * @param {Object} [options]
       * @param {Object} [options.serializers] An object used as an associative array with GraphSON 2 type name as keys and
       * deserializer instances as values, ie: { 'g:Int64': longSerializer }.
       * @constructor
       */
      constructor(options) {
        this._options = options || {}, this._deserializers = {};
        let defaultDeserializers = this.getDefaultDeserializers();
        if (Object.keys(defaultDeserializers).forEach((typeName) => {
          let serializerConstructor = defaultDeserializers[typeName], s = new serializerConstructor();
          s.reader = this, this._deserializers[typeName] = s;
        }), this._options.serializers) {
          let customSerializers = this._options.serializers || {};
          Object.keys(customSerializers).forEach((key) => {
            let s = customSerializers[key];
            s.deserialize && (s.reader = this, this._deserializers[key] = s);
          });
        }
      }
      /**
       * Gets the default deserializers as an associative array.
       * @returns {Object}
       */
      getDefaultDeserializers() {
        return graphSON2Deserializers;
      }
      read(obj) {
        if (obj === void 0)
          return;
        if (obj === null)
          return null;
        if (Array.isArray(obj))
          return obj.map((item) => this.read(item));
        let type = obj[typeSerializers.typeKey];
        if (type) {
          let d = this._deserializers[type];
          return d ? d.deserialize(obj) : obj[typeSerializers.valueKey];
        }
        return obj && typeof obj == "object" && obj.constructor === Object ? this._deserializeObject(obj) : obj;
      }
      _deserializeObject(obj) {
        let keys = Object.keys(obj), result = {};
        for (let i = 0; i < keys.length; i++)
          result[keys[i]] = this.read(obj[keys[i]]);
        return result;
      }
    }, GraphSON3Reader = class extends GraphSON2Reader {
      getDefaultDeserializers() {
        return graphSON3Deserializers;
      }
    }, graphSON2Deserializers = {
      "g:Traverser": typeSerializers.TraverserSerializer,
      "g:TraversalStrategy": typeSerializers.TraversalStrategySerializer,
      "g:Int32": typeSerializers.NumberSerializer,
      "g:Int64": typeSerializers.NumberSerializer,
      "g:Float": typeSerializers.NumberSerializer,
      "g:Double": typeSerializers.NumberSerializer,
      "g:Date": typeSerializers.DateSerializer,
      "g:Direction": typeSerializers.DirectionSerializer,
      "g:Vertex": typeSerializers.VertexSerializer,
      "g:Edge": typeSerializers.EdgeSerializer,
      "g:VertexProperty": typeSerializers.VertexPropertySerializer,
      "g:Property": typeSerializers.PropertySerializer,
      "g:Path": typeSerializers.Path3Serializer,
      "g:TextP": typeSerializers.TextPSerializer,
      "g:T": typeSerializers.TSerializer,
      "g:BulkSet": typeSerializers.BulkSetSerializer
    }, graphSON3Deserializers = Object.assign({}, graphSON2Deserializers, {
      "g:List": typeSerializers.ListSerializer,
      "g:Set": typeSerializers.SetSerializer,
      "g:Map": typeSerializers.MapSerializer
    }), graphSON2Serializers = [
      typeSerializers.NumberSerializer,
      typeSerializers.DateSerializer,
      typeSerializers.BytecodeSerializer,
      typeSerializers.TraverserSerializer,
      typeSerializers.TraversalStrategySerializer,
      typeSerializers.PSerializer,
      typeSerializers.TextPSerializer,
      typeSerializers.LambdaSerializer,
      typeSerializers.EnumSerializer,
      typeSerializers.VertexSerializer,
      typeSerializers.EdgeSerializer,
      typeSerializers.LongSerializer
    ], graphSON3Serializers = graphSON2Serializers.concat([
      typeSerializers.ListSerializer,
      typeSerializers.SetSerializer,
      typeSerializers.MapSerializer
    ]);
    module2.exports = {
      GraphSON3Writer,
      GraphSON3Reader,
      GraphSON2Writer,
      GraphSON2Reader,
      GraphSONWriter: GraphSON3Writer,
      GraphSONReader: GraphSON3Reader
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/options.js
var require_options = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/options.js"(exports2, module2) {
    "use strict";
    var util = require("util"), types = require_types(), utils = require_utils(), { DefaultExecutionOptions, proxyExecuteKey } = require_execution_options(), Long = types.Long, consistencyNames, graphProtocol = Object.freeze({
      graphson1: "graphson-1.0",
      graphson2: "graphson-2.0",
      graphson3: "graphson-3.0"
    }), payloadKeys = Object.freeze({
      language: "graph-language",
      source: "graph-source",
      name: "graph-name",
      results: "graph-results",
      writeConsistency: "graph-write-consistency",
      readConsistency: "graph-read-consistency",
      timeout: "request-timeout"
    });
    function getDefaultGraphOptions(profileManager, baseOptions, defaultRetryPolicy, profile) {
      return profileManager.getOrCreateGraphOptions(profile, function() {
        let profileOptions = profile.graphOptions || utils.emptyObject, defaultProfile = profileManager.getDefault(), options = {
          customPayload: {
            [payloadKeys.language]: utils.allocBufferFromString(profileOptions.language || baseOptions.language),
            [payloadKeys.source]: utils.allocBufferFromString(profileOptions.source || baseOptions.source)
          },
          graphLanguage: profileOptions.language || baseOptions.language,
          graphResults: profileOptions.results || baseOptions.results,
          graphSource: profileOptions.source || baseOptions.source,
          graphName: utils.ifUndefined(profileOptions.name, baseOptions.name)
        };
        profile !== defaultProfile ? options.retry = profile.retry || baseOptions.retry : options.retry = defaultRetryPolicy || baseOptions.retry, baseOptions.executeAs && (options.customPayload[proxyExecuteKey] = utils.allocBufferFromString(baseOptions.executeAs)), options.graphName && (options.customPayload[payloadKeys.name] = utils.allocBufferFromString(options.graphName));
        let graphResults = utils.ifUndefined(profileOptions.results, baseOptions.graphResults);
        graphResults !== void 0 && (options.customPayload[payloadKeys.results] = utils.allocBufferFromString(graphResults));
        let readConsistency = utils.ifUndefined(profileOptions.readConsistency, baseOptions.readConsistency);
        readConsistency !== void 0 && (options.customPayload[payloadKeys.readConsistency] = utils.allocBufferFromString(getConsistencyName(readConsistency)));
        let writeConsistency = utils.ifUndefined(profileOptions.writeConsistency, baseOptions.writeConsistency);
        return writeConsistency !== void 0 && (options.customPayload[payloadKeys.writeConsistency] = utils.allocBufferFromString(getConsistencyName(writeConsistency))), options.readTimeout = utils.ifUndefined3(profile.readTimeout, defaultProfile.readTimeout, baseOptions.readTimeout), options.readTimeout > 0 && (options.customPayload[payloadKeys.timeout] = longBuffer(options.readTimeout)), options;
      });
    }
    function setPayloadKey(payload, profileOptions, key, value, converter) {
      if (converter = converter || utils.allocBufferFromString, value !== null) {
        if (value !== void 0) {
          payload[key] = converter(value);
          return;
        }
        profileOptions.customPayload[key] && (payload[key] = profileOptions.customPayload[key]);
      }
    }
    function longBuffer(value) {
      return value = Long.fromNumber(value), Long.toBuffer(value);
    }
    function getConsistencyName(consistency) {
      if (consistency == null)
        return;
      loadConsistencyNames();
      let name = consistencyNames[consistency];
      if (!name)
        throw new Error(util.format(
          "Consistency %s not found, use values defined as properties in types.consistencies object",
          consistency
        ));
      return name;
    }
    function loadConsistencyNames() {
      if (consistencyNames)
        return;
      consistencyNames = {};
      let propertyNames = Object.keys(types.consistencies);
      for (let i = 0; i < propertyNames.length; i++) {
        let name = propertyNames[i];
        consistencyNames[types.consistencies[name]] = name.toUpperCase();
      }
      consistencyNames[types.consistencies.localQuorum] = "LOCAL_QUORUM", consistencyNames[types.consistencies.eachQuorum] = "EACH_QUORUM", consistencyNames[types.consistencies.localSerial] = "LOCAL_SERIAL", consistencyNames[types.consistencies.localOne] = "LOCAL_ONE";
    }
    var GraphExecutionOptions = class extends DefaultExecutionOptions {
      /**
       * Creates a new instance of GraphExecutionOptions.
       * @param {GraphQueryOptions} queryOptions The user provided query options.
       * @param {Client} client the client instance.
       * @param graphBaseOptions The default graph base options.
       * @param {RetryPolicy} defaultProfileRetryPolicy
       */
      constructor(queryOptions, client, graphBaseOptions, defaultProfileRetryPolicy) {
        queryOptions = queryOptions || utils.emptyObject, super(queryOptions, client, null), this._defaultGraphOptions = getDefaultGraphOptions(
          client.profileManager,
          graphBaseOptions,
          defaultProfileRetryPolicy,
          this.getProfile()
        ), this._preferredHost = null, this._graphSubProtocol = queryOptions.graphResults || this._defaultGraphOptions.graphResults, this._graphLanguage = queryOptions.graphLanguage || this._defaultGraphOptions.graphLanguage;
      }
      setPreferredHost(host) {
        this._preferredHost = host;
      }
      getPreferredHost() {
        return this._preferredHost;
      }
      getGraphSource() {
        return this.getRawQueryOptions().graphSource || this._defaultGraphOptions.graphSource;
      }
      getGraphLanguage() {
        return this._graphLanguage;
      }
      setGraphLanguage(value) {
        this._graphLanguage = value;
      }
      getGraphName() {
        return utils.ifUndefined(this.getRawQueryOptions().graphName, this._defaultGraphOptions.graphName);
      }
      getGraphSubProtocol() {
        return this._graphSubProtocol;
      }
      setGraphSubProtocol(protocol) {
        this._graphSubProtocol = protocol;
      }
      /** Graph executions have a specific default read timeout */
      getReadTimeout() {
        return this.getRawQueryOptions().readTimeout || this._defaultGraphOptions.readTimeout;
      }
      /** Graph executions have a specific default retry policy */
      getRetryPolicy() {
        return this.getRawQueryOptions().retry || this._defaultGraphOptions.retry;
      }
      getRowParser() {
        let factory = this.getRawQueryOptions().rowParserFactory;
        return factory ? factory(this.getGraphSubProtocol()) : null;
      }
      getQueryWriter() {
        let factory = this.getRawQueryOptions().queryWriterFactory;
        return factory ? factory(this.getGraphSubProtocol()) : null;
      }
      setGraphPayload() {
        let options = this.getRawQueryOptions(), defaultOptions = this._defaultGraphOptions, payload = Object.assign({}, this.getCustomPayload());
        setPayloadKey(
          payload,
          defaultOptions,
          payloadKeys.language,
          this.getGraphLanguage() !== this._defaultGraphOptions.graphLanguage ? this.getGraphLanguage() : void 0
        ), setPayloadKey(payload, defaultOptions, payloadKeys.source, options.graphSource), setPayloadKey(payload, defaultOptions, payloadKeys.name, options.graphName), setPayloadKey(
          payload,
          defaultOptions,
          payloadKeys.readConsistency,
          getConsistencyName(options.graphReadConsistency)
        ), setPayloadKey(
          payload,
          defaultOptions,
          payloadKeys.writeConsistency,
          getConsistencyName(options.graphWriteConsistency)
        ), setPayloadKey(
          payload,
          defaultOptions,
          payloadKeys.timeout,
          this.getReadTimeout() > 0 ? this.getReadTimeout() : null,
          longBuffer
        ), payload[payloadKeys.results] = defaultOptions.graphResults === this.getGraphSubProtocol() ? defaultOptions.customPayload[payloadKeys.results] : utils.allocBufferFromString(this.getGraphSubProtocol()), this.setCustomPayload(payload);
      }
    };
    module2.exports = {
      GraphExecutionOptions,
      graphProtocol,
      payloadKeys
    };
  }
});

// node_modules/cassandra-driver/lib/datastax/graph/graph-executor.js
var require_graph_executor = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/graph/graph-executor.js"(exports2, module2) {
    "use strict";
    var utils = require_utils(), policies = require_policies(), GraphResultSet = require_result_set2(), { GraphSON2Reader, GraphSON2Writer, GraphSON3Reader, GraphSON3Writer } = require_graph_serializer(), getCustomTypeSerializers = require_custom_type_serializers(), { GraphExecutionOptions, graphProtocol } = require_options(), graphLanguageGroovyString = "gremlin-groovy", graphEngineCore = "Core", graphSON2Reader = new GraphSON2Reader({ serializers: getCustomTypeSerializers() }), graphSON2Writer = new GraphSON2Writer({ serializers: getCustomTypeSerializers() }), graphSON3Reader = new GraphSON3Reader({ serializers: getCustomTypeSerializers() }), graphSON3Writer = new GraphSON3Writer({ serializers: getCustomTypeSerializers() }), rowParsers = /* @__PURE__ */ new Map([
      [graphProtocol.graphson2, getRowParser(graphSON2Reader)],
      [graphProtocol.graphson3, getRowParser(graphSON3Reader)]
    ]), defaultWriters = /* @__PURE__ */ new Map([
      [graphProtocol.graphson1, (x) => JSON.stringify(x)],
      [graphProtocol.graphson2, getDefaultWriter(graphSON2Writer)],
      [graphProtocol.graphson3, getDefaultWriter(graphSON3Writer)]
    ]), GraphExecutor = class _GraphExecutor {
      /**
       * Creates a new instance of GraphExecutor.
       * @param {Client} client
       * @param {ClientOptions} rawOptions
       * @param {Function} handler
       */
      constructor(client, rawOptions, handler) {
        this._client = client, this._handler = handler, this._defaultProfileRetryPolicy = client.profileManager.getDefaultConfiguredRetryPolicy(), this._graphBaseOptions = utils.extend({
          executeAs: client.options.queryOptions.executeAs,
          language: graphLanguageGroovyString,
          source: "g",
          readTimeout: 0,
          // As the default retry policy might retry non-idempotent queries
          // we should use default retry policy for all graph queries that does not retry
          retry: new policies.retry.FallthroughRetryPolicy()
        }, rawOptions.graphOptions, client.profileManager.getDefault().graphOptions), this._graphBaseOptions.readTimeout === null && (this._graphBaseOptions.readTimeout = client.options.socketOptions.readTimeout);
      }
      /**
       * Executes the graph traversal.
       * @param {String|Object} query
       * @param {Object} parameters
       * @param {GraphQueryOptions} options
       */
      async send(query, parameters, options) {
        if (Array.isArray(parameters))
          throw new TypeError("Parameters must be a Object instance as an associative array");
        if (!query)
          throw new TypeError("Query must be defined");
        let execOptions = new GraphExecutionOptions(
          options,
          this._client,
          this._graphBaseOptions,
          this._defaultProfileRetryPolicy
        );
        if (execOptions.getGraphSource() === "a") {
          let host = await this._getAnalyticsMaster();
          execOptions.setPreferredHost(host);
        }
        let isQueryObject = typeof query == "object" && query.graphLanguage && query.value && query.queryWriterFactory;
        if (isQueryObject && execOptions.setGraphLanguage(query.graphLanguage), this._setGraphProtocol(execOptions), execOptions.setGraphPayload(), parameters = _GraphExecutor._buildGraphParameters(parameters, execOptions.getGraphSubProtocol()), typeof query != "string") {
          let queryWriter = execOptions.getQueryWriter();
          isQueryObject ? queryWriter = query.queryWriterFactory(execOptions.getGraphSubProtocol()) : queryWriter || (queryWriter = _GraphExecutor._writerFactory(execOptions.getGraphSubProtocol())), query = queryWriter(isQueryObject ? query.value : query);
        }
        return await this._executeGraphQuery(query, parameters, execOptions);
      }
      /**
       * Sends the graph traversal.
       * @param {string} query
       * @param {object} parameters
       * @param {GraphExecutionOptions} execOptions
       * @returns {Promise<GraphResultSet>}
       * @private
       */
      async _executeGraphQuery(query, parameters, execOptions) {
        let result = await this._handler.call(this._client, query, parameters, execOptions), rowParser = execOptions.getRowParser() || _GraphExecutor._rowParserFactory(execOptions.getGraphSubProtocol());
        return new GraphResultSet(result, rowParser);
      }
      /**
       * Uses the RPC call to obtain the analytics master host.
       * @returns {Promise<Host|null>}
       * @private
       */
      async _getAnalyticsMaster() {
        try {
          let result = await this._client.execute("CALL DseClientTool.getAnalyticsGraphServer()", utils.emptyArray);
          if (result.rows.length === 0)
            return this._client.log(
              "verbose",
              "Empty response querying graph analytics server, query will not be routed optimally"
            ), null;
          let resultField = result.rows[0].result;
          if (!resultField || !resultField.location)
            return this._client.log(
              "verbose",
              "Unexpected response querying graph analytics server, query will not be routed optimally",
              result.rows[0]
            ), null;
          let hostName = resultField.location.substr(0, resultField.location.lastIndexOf(":")), addressTranslator = this._client.options.policies.addressResolution;
          return await new Promise((resolve) => {
            addressTranslator.translate(hostName, this._client.options.protocolOptions.port, (endpoint) => resolve(this._client.hosts.get(endpoint)));
          });
        } catch (err) {
          return this._client.log("verbose", "Error querying graph analytics server, query will not be routed optimally", err), null;
        }
      }
      /**
       * Resolves what protocol should be used for decoding graph results for the given execution.
       *
       * <p>Resolution is done in the following manner if graphResults is not set:</p>
       *
       * <ul>
       *   <li>If graph name is set, and associated keyspace's graph engine is set to "Core", use {@link
        *       graphProtocol#graphson3}.
       *   <li>Else, if the graph language is not 'gremlin-groovy', use {@link graphProtocol#graphson2}
       *   <li>Otherwise, use {@link graphProtocol#graphson1}
       * </ul>
       * @param {GraphExecutionOptions} execOptions
       */
      _setGraphProtocol(execOptions) {
        let protocol = execOptions.getGraphSubProtocol();
        if (!protocol) {
          if (execOptions.getGraphName()) {
            let keyspace = this._client.metadata.keyspaces[execOptions.getGraphName()];
            keyspace && keyspace.graphEngine === graphEngineCore && (protocol = graphProtocol.graphson3);
          }
          protocol || (execOptions.getGraphLanguage() === graphLanguageGroovyString ? protocol = graphProtocol.graphson1 : protocol = graphProtocol.graphson2), execOptions.setGraphSubProtocol(protocol);
        }
      }
      /**
       * Only GraphSON1 parameters are supported.
       * @param {Array|function|null} parameters
       * @param {string} protocol
       * @returns {string[]|null}
       * @private
       */
      static _buildGraphParameters(parameters, protocol) {
        if (!parameters || typeof parameters != "object")
          return null;
        let queryWriter = _GraphExecutor._writerFactory(protocol);
        return [
          protocol !== graphProtocol.graphson1 && protocol !== graphProtocol.graphson2 ? queryWriter(new Map(Object.entries(parameters))) : queryWriter(parameters)
        ];
      }
      static _rowParserFactory(protocol) {
        let handler = rowParsers.get(protocol);
        return handler || null;
      }
      static _writerFactory(protocol) {
        let handler = defaultWriters.get(protocol);
        if (!handler)
          throw new Error(`No writer defined for protocol ${protocol}`);
        return handler;
      }
    };
    function getRowParser(reader) {
      return (row) => {
        let item = reader.read(JSON.parse(row.gremlin));
        return { object: item.result, bulk: item.bulk || 1 };
      };
    }
    function getDefaultWriter(writer) {
      return (value) => writer.write(value);
    }
    module2.exports = GraphExecutor;
  }
});

// node_modules/cassandra-driver/lib/client.js
var require_client = __commonJS({
  "node_modules/cassandra-driver/lib/client.js"(exports2, module2) {
    "use strict";
    var events = require("events"), util = require("util"), utils = require_utils(), errors = require_errors(), types = require_types(), { ProfileManager } = require_execution_profile(), requests = require_requests(), clientOptions = require_client_options(), ClientState = require_client_state(), description = require_package().description, { version } = require_package(), { DefaultExecutionOptions } = require_execution_options(), ControlConnection = require_control_connection(), RequestHandler = require_request_handler(), PrepareHandler = require_prepare_handler(), InsightsClient = require_insights_client(), cloud = require_cloud(), GraphExecutor = require_graph_executor(), promiseUtils = require_promise_utils(), warmupLimit = 32;
    function Client(options) {
      events.EventEmitter.call(this), this.options = clientOptions.extend({ logEmitter: this.emit.bind(this), id: types.Uuid.random() }, options), Object.defineProperty(this, "profileManager", { value: new ProfileManager(this.options) }), Object.defineProperty(
        this,
        "controlConnection",
        {
          value: new ControlConnection(this.options, this.profileManager),
          writable: !0
        }
      ), Object.defineProperty(this, "insightsClient", { value: new InsightsClient(this) }), this.setMaxListeners(0), this.connected = !1, this.isShuttingDown = !1, this.keyspace = options.keyspace, this.metadata = this.controlConnection.metadata, this.hosts = this.controlConnection.hosts, this.metrics = this.options.metrics, this._graphExecutor = new GraphExecutor(this, options, this._execute);
    }
    util.inherits(Client, events.EventEmitter);
    Client.prototype.connect = function(callback) {
      return this.connected && callback ? callback() : promiseUtils.optionalCallback(this._connect(), callback);
    };
    Client.prototype._connect = async function() {
      if (!this.connected) {
        if (this.isShuttingDown)
          throw new errors.NoHostAvailableError(null, "Connecting after shutdown is not supported");
        if (this.connecting)
          return promiseUtils.fromEvent(this, "connected");
        this.connecting = !0, this.log("info", util.format("Connecting to cluster using '%s' version %s", description, version));
        try {
          await cloud.init(this.options), await this.controlConnection.init(), this.hosts = this.controlConnection.hosts, await this.profileManager.init(this, this.hosts), this.keyspace && await RequestHandler.setKeyspace(this), clientOptions.setMetadataDependent(this), await this._warmup();
        } catch (err) {
          throw await this.controlConnection.reset(), this.connected = !1, this.connecting = !1, this.emit("connected", err), err;
        }
        this._setHostListeners(), this.profileManager.getDistance(this.controlConnection.host), this.insightsClient.init(), this.connected = !0, this.connecting = !1, this.emit("connected");
      }
    };
    Client.prototype.execute = function(query, params, options, callback) {
      callback || (typeof options == "function" ? (callback = options, options = null) : typeof params == "function" && (callback = params, params = null));
      try {
        let execOptions = DefaultExecutionOptions.create(options, this);
        return promiseUtils.optionalCallback(this._execute(query, params, execOptions), callback);
      } catch (err) {
        return callback ? callback(err) : Promise.reject(err);
      }
    };
    Client.prototype.executeGraph = function(query, parameters, options, callback) {
      return callback = callback || options || parameters, typeof callback == "function" ? (parameters = typeof parameters != "function" ? parameters : null, promiseUtils.toCallback(this._graphExecutor.send(query, parameters, options), callback)) : this._graphExecutor.send(query, parameters, options);
    };
    Client.prototype.eachRow = function(query, params, options, rowCallback, callback) {
      !callback && rowCallback && typeof options == "function" ? (callback = utils.validateFn(rowCallback, "rowCallback"), rowCallback = options) : (callback = callback || utils.noop, rowCallback = utils.validateFn(rowCallback || options || params, "rowCallback")), params = typeof params != "function" ? params : null;
      let execOptions;
      try {
        execOptions = DefaultExecutionOptions.create(options, this, rowCallback);
      } catch (e) {
        return callback(e);
      }
      let rowLength = 0, nextPage = () => promiseUtils.toCallback(this._execute(query, params, execOptions), pageCallback);
      function pageCallback(err, result) {
        if (err)
          return callback(err);
        if (rowLength += result.rowLength, result.rawPageState !== void 0) {
          if (execOptions.setPageState(result.rawPageState), execOptions.isAutoPage())
            return nextPage();
          result.nextPage = nextPage;
        }
        result.rowLength = rowLength, callback(null, result);
      }
      promiseUtils.toCallback(this._execute(query, params, execOptions), pageCallback);
    };
    Client.prototype.stream = function(query, params, options, callback) {
      callback = callback || utils.noop;
      let resultStream = new types.ResultStream({ objectMode: 1 });
      function onFinish(err, result) {
        if (err && resultStream.emit("error", err), result && result.nextPage) {
          resultStream._valve(function() {
            try {
              result.nextPage();
            } catch (ex) {
              resultStream.emit("error", ex);
            }
          });
          return;
        }
        resultStream._valve(null), resultStream.add(null), callback(err);
      }
      let sync = !0;
      return this.eachRow(query, params, options, function(n, row) {
        resultStream.add(row);
      }, function(err, result) {
        if (sync)
          return setImmediate(function() {
            onFinish(err, result);
          });
        onFinish(err, result);
      }), sync = !1, resultStream;
    };
    Client.prototype.batch = function(queries, options, callback) {
      return !callback && typeof options == "function" && (callback = options, options = null), promiseUtils.optionalCallback(this._batch(queries, options), callback);
    };
    Client.prototype._batch = async function(queries, options) {
      if (!Array.isArray(queries))
        throw new errors.ArgumentError("Queries should be an Array");
      if (queries.length === 0)
        throw new errors.ArgumentError("Queries array should not be empty");
      await this._connect();
      let execOptions = DefaultExecutionOptions.create(options, this), queryItems;
      if (execOptions.isPrepared()) {
        let version2 = this.controlConnection.protocolVersion, queryKeyspace = types.protocolVersion.supportsKeyspaceInRequest(version2) && options.keyspace || this.keyspace;
        queryItems = await PrepareHandler.getPreparedMultiple(
          this,
          execOptions.getLoadBalancingPolicy(),
          queries,
          queryKeyspace
        );
      } else {
        queryItems = new Array(queries.length);
        for (let i = 0; i < queries.length; i++) {
          let item = queries[i];
          if (!item)
            throw new errors.ArgumentError(`Invalid query at index ${i}`);
          let query = typeof item == "string" ? item : item.query;
          if (!query)
            throw new errors.ArgumentError(`Invalid query at index ${i}`);
          queryItems[i] = { query, params: item.params };
        }
      }
      let request = await this._createBatchRequest(queryItems, execOptions);
      return await RequestHandler.send(request, execOptions, this);
    };
    Client.prototype.getReplicas = function(keyspace, token) {
      return this.metadata.getReplicas(keyspace, token);
    };
    Client.prototype.getState = function() {
      return ClientState.from(this);
    };
    Client.prototype.log = utils.log;
    Client.prototype.shutdown = function(callback) {
      return promiseUtils.optionalCallback(this._shutdown(), callback);
    };
    Client.prototype._shutdown = async function() {
      if (this.log("info", "Shutting down"), !this.hosts || !this.connected) {
        this.connected = !1;
        return;
      }
      this.connecting && (this.log("warning", "Shutting down while connecting"), await promiseUtils.fromEvent(this, "connected")), this.connected = !1, this.isShuttingDown = !0;
      let hosts = this.hosts.values();
      this.insightsClient.shutdown(), this.controlConnection.shutdown(), this.options.policies.speculativeExecution.shutdown(), this.options.requestTracker && this.options.requestTracker.shutdown(), await Promise.all(hosts.map((h) => h.shutdown(!1)));
    };
    Client.prototype._waitForSchemaAgreement = async function(connection) {
      if (this.hosts.length === 1)
        return !0;
      let start = process.hrtime(), maxWaitSeconds = this.options.protocolOptions.maxSchemaAgreementWaitSeconds;
      this.log("info", "Waiting for schema agreement");
      let versionsMatch;
      for (; !versionsMatch && process.hrtime(start)[0] < maxWaitSeconds; ) {
        if (versionsMatch = await this.metadata.compareSchemaVersions(connection), versionsMatch) {
          this.log("info", "Schema versions match");
          break;
        }
        await promiseUtils.delay(500);
      }
      return versionsMatch;
    };
    Client.prototype.handleSchemaAgreementAndRefresh = async function(connection, event) {
      let agreement = !1;
      try {
        agreement = await this._waitForSchemaAgreement(connection);
      } catch (err) {
        this.log("warning", "There was an error while waiting for the schema agreement between nodes", err);
      }
      if (!this.options.isMetadataSyncEnabled)
        return agreement;
      try {
        await this.controlConnection.handleSchemaChange(event, !0);
      } catch (err) {
        this.log("warning", "There was an error while handling schema change", err);
      }
      return agreement;
    };
    Client.prototype._execute = async function(query, params, execOptions) {
      let version2 = this.controlConnection.protocolVersion;
      if (!execOptions.isPrepared() && params && !Array.isArray(params) && !types.protocolVersion.supportsNamedParameters(version2))
        throw new errors.ArgumentError("Named parameters for simple statements are not supported, use prepare flag");
      let request;
      if (this.connected || await this._connect(), !execOptions.isPrepared())
        request = await this._createQueryRequest(query, execOptions, params);
      else {
        let lbp = execOptions.getLoadBalancingPolicy(), queryKeyspace = types.protocolVersion.supportsKeyspaceInRequest(version2) && execOptions.getKeyspace() || this.keyspace, { queryId, meta } = await PrepareHandler.getPrepared(this, lbp, query, queryKeyspace);
        request = await this._createExecuteRequest(query, queryId, execOptions, params, meta);
      }
      return await RequestHandler.send(request, execOptions, this);
    };
    Client.prototype._setHostListeners = function() {
      function getHostUpListener(emitter, h) {
        return () => emitter.emit("hostUp", h);
      }
      function getHostDownListener(emitter, h) {
        return () => emitter.emit("hostDown", h);
      }
      let self = this;
      this.hosts.on("add", function(h) {
        h.on("up", getHostUpListener(self, h)), h.on("down", getHostDownListener(self, h)), self.emit("hostAdd", h);
      }), this.hosts.on("remove", function(h) {
        h.removeAllListeners(), self.emit("hostRemove", h);
      }), this.hosts.forEach(function(h) {
        h.on("up", getHostUpListener(self, h)), h.on("down", getHostDownListener(self, h));
      });
    };
    Client.prototype._warmup = function() {
      let hosts = this.hosts.values();
      return promiseUtils.times(hosts.length, warmupLimit, async (index) => {
        let h = hosts[index], distance = this.profileManager.getDistance(h);
        if (distance !== types.distance.ignored)
          if (this.options.pooling.warmup && distance === types.distance.local)
            try {
              await h.warmupPool(this.keyspace);
            } catch (err) {
              this.log("warning", `Connection pool to host ${h.address} could not be created: ${err}`, err);
            }
          else
            h.initializePool();
      });
    };
    Client.prototype._getEncoder = function() {
      let encoder = this.controlConnection.getEncoder();
      if (!encoder)
        throw new errors.DriverInternalError("Encoder is not defined");
      return encoder;
    };
    Client.prototype._createBatchRequest = async function(queryItems, info) {
      let firstQuery = queryItems[0];
      return firstQuery.meta ? (await this._setRoutingInfo(info, firstQuery.params, firstQuery.meta), new requests.BatchRequest(queryItems, info)) : new requests.BatchRequest(queryItems, info);
    };
    Client.prototype._createExecuteRequest = async function(query, queryId, info, params, meta) {
      return params = utils.adaptNamedParamsPrepared(params, meta.columns), await this._setRoutingInfo(info, params, meta), new requests.ExecuteRequest(query, queryId, params, info, meta);
    };
    Client.prototype._createQueryRequest = async function(query, execOptions, params) {
      await this.metadata.adaptUserHints(this.keyspace, execOptions.getHints());
      let paramsInfo = utils.adaptNamedParamsWithHints(params, execOptions);
      return this._getEncoder().setRoutingKeyFromUser(paramsInfo.params, execOptions, paramsInfo.keyIndexes), new requests.QueryRequest(query, paramsInfo.params, execOptions, paramsInfo.namedParameters);
    };
    Client.prototype._setRoutingInfo = async function(execOptions, params, meta) {
      let encoder = this._getEncoder();
      if (!execOptions.getKeyspace() && meta.keyspace && execOptions.setKeyspace(meta.keyspace), execOptions.getRoutingKey())
        return encoder.setRoutingKeyFromUser(params, execOptions);
      if (Array.isArray(meta.partitionKeys))
        return execOptions.setRoutingIndexes(meta.partitionKeys), encoder.setRoutingKeyFromMeta(meta, params, execOptions);
      try {
        let tableInfo = await this.metadata.getTable(meta.keyspace, meta.table);
        if (!tableInfo)
          return;
        execOptions.setRoutingIndexes(tableInfo.partitionKeys.map((c) => meta.columnsByName[c.name])), meta.partitionKeys = execOptions.getRoutingIndexes(), encoder.setRoutingKeyFromMeta(meta, params, execOptions);
      } catch {
        this.log("warning", util.format("Table %s.%s metadata could not be retrieved", meta.keyspace, meta.table));
      }
    };
    module2.exports = Client;
  }
});

// node_modules/cassandra-driver/lib/mapping/tree.js
var require_tree = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/tree.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events"), Node = class extends EventEmitter {
      /**
       * Creates a new instance of {@link Node}.
       * @param {Array<String>} key
       * @param {Object} value
       * @param {Array} [edges]
       */
      constructor(key, value, edges) {
        super(), this.key = key, this.value = value, this.edges = edges || [];
      }
    }, Tree = class extends Node {
      constructor() {
        super([], null), this.length = 0;
      }
      /**
       * Gets the existing item in the tree or creates a new one with the value provided by valueHandler
       * @param {Iterator} keyIterator
       * @param {Function} valueHandler
       * @return {Object}
       */
      getOrCreate(keyIterator, valueHandler) {
        typeof keyIterator.next != "function" && (keyIterator = keyIterator[Symbol.iterator]());
        let node = this, isMatch = !1, item = keyIterator.next();
        for (; ; ) {
          let newBranch;
          for (let i = 1; i < node.key.length; i++) {
            if (item.done || node.key[i] !== item.value) {
              newBranch = this._createBranch(node, i, item.done, valueHandler);
              break;
            }
            item = keyIterator.next();
          }
          if (item.done) {
            isMatch = !0;
            break;
          }
          if (newBranch !== void 0)
            break;
          let edges = node.edges, nextNode;
          for (let i = 0; i < edges.length; i++) {
            let e = edges[i];
            if (e.key[0] === item.value) {
              nextNode = e, item = keyIterator.next();
              break;
            }
          }
          if (nextNode === void 0)
            break;
          node = nextNode;
        }
        if (!isMatch) {
          let value = valueHandler();
          return node.edges.push(new Node(iteratorToArray(item.value, keyIterator), value)), this._onItemAdded(), value;
        }
        return node.value === null && node.edges.length > 0 && (node.value = valueHandler()), node.value;
      }
      _createBranch(node, index, useNewValue, valueHandler) {
        let newBranch = new Node(node.key.slice(index), node.value, node.edges);
        return node.key = node.key.slice(0, index), node.edges = [newBranch], useNewValue ? (node.value = valueHandler(), this._onItemAdded()) : node.value = null, newBranch;
      }
      _onItemAdded() {
        this.length++, this.emit("add", this.length);
      }
    };
    function iteratorToArray(value, iterator) {
      let values = [value], item = iterator.next();
      for (; !item.done; )
        values.push(item.value), item = iterator.next();
      return values;
    }
    module2.exports = Tree;
  }
});

// node_modules/cassandra-driver/lib/mapping/q.js
var require_q = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/q.js"(exports2) {
    "use strict";
    var errors = require_errors(), QueryOperator = class {
      /**
       * Creates a new instance of <code>QueryOperator</code>.
       * @param {String} key
       * @param value
       * @param [hasChildValues]
       * @param [isInOperator]
       */
      constructor(key, value, hasChildValues, isInOperator) {
        this.key = key, this.value = value, this.hasChildValues = hasChildValues, this.isInOperator = isInOperator;
      }
    }, QueryAssignment = class {
      constructor(sign, value, inverted) {
        this.sign = sign, this.value = value, this.inverted = !!inverted;
      }
    }, q = {
      in_: function(arr) {
        if (!Array.isArray(arr))
          throw new errors.ArgumentError("IN operator supports only Array values");
        return new QueryOperator("IN", arr, !1, !0);
      },
      gt: function(value) {
        return new QueryOperator(">", value);
      },
      gte: function(value) {
        return new QueryOperator(">=", value);
      },
      lt: function(value) {
        return new QueryOperator("<", value);
      },
      lte: function(value) {
        return new QueryOperator("<=", value);
      },
      notEq: function(value) {
        return new QueryOperator("!=", value);
      },
      and: function(condition1, condition2) {
        return new QueryOperator("AND", [condition1, condition2], !0);
      },
      incr: function(value) {
        return new QueryAssignment("+", value);
      },
      decr: function(value) {
        return new QueryAssignment("-", value);
      },
      append: function(value) {
        return new QueryAssignment("+", value);
      },
      prepend: function(value) {
        return new QueryAssignment("+", value, !0);
      },
      remove: function(value) {
        return new QueryAssignment("-", value);
      }
    };
    exports2.q = q;
    exports2.QueryAssignment = QueryAssignment;
    exports2.QueryOperator = QueryOperator;
  }
});

// node_modules/cassandra-driver/lib/mapping/cache.js
var require_cache = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/cache.js"(exports2, module2) {
    "use strict";
    var qModule = require_q(), QueryOperator = qModule.QueryOperator, QueryAssignment = qModule.QueryAssignment, Cache = class _Cache {
      /**
       * Gets an iterator of keys to uniquely identify a document shape for a select query.
       * @param {Array<String>} docKeys
       * @param {Object} doc
       * @param {{fields, limit, orderBy}} docInfo
       * @returns {Iterator}
       */
      static *getSelectKey(docKeys, doc, docInfo) {
        yield* _Cache._yieldKeyAndOperators(docKeys, doc), yield* _Cache._getSelectDocInfo(docInfo);
      }
      /**
       * Gets an iterator of keys to uniquely identify a shape for a select all query.
       * @param {{fields, limit, orderBy}} docInfo
       * @returns {Iterator}
       */
      static *getSelectAllKey(docInfo) {
        yield "root", yield* _Cache._getSelectDocInfo(docInfo);
      }
      /**
       * Gets the parts of the key for a select query related to the docInfo.
       * @param {{fields, limit, orderBy}} docInfo
       * @private
       */
      static *_getSelectDocInfo(docInfo) {
        if (docInfo && (docInfo.fields && docInfo.fields.length > 0 && (yield "|f|", yield* docInfo.fields), typeof docInfo.limit == "number" && (yield "|l|"), docInfo.orderBy)) {
          yield "|o|";
          let keys = Object.keys(docInfo.orderBy);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            yield key, yield docInfo.orderBy[key];
          }
        }
      }
      /**
       * Gets an iterator of keys to uniquely identify a document shape for an insert query.
       * @param {Array<String>} docKeys
       * @param {{ifNotExists, ttl, fields}} docInfo
       * @returns {Iterator}
       */
      static *getInsertKey(docKeys, docInfo) {
        yield* docKeys, docInfo && (docInfo.fields && docInfo.fields.length > 0 && (yield "|f|", yield* docInfo.fields), typeof docInfo.ttl == "number" && (yield "|t|"), docInfo.ifNotExists && (yield "|e|"));
      }
      /**
       * Gets an iterator of keys to uniquely identify a document shape for an UPDATE query.
       * @param {Array<String>} docKeys
       * @param {Object} doc
       * @param {{ifExists, when, ttl, fields}} docInfo
       */
      static *getUpdateKey(docKeys, doc, docInfo) {
        yield* _Cache._yieldKeyAndAllQs(docKeys, doc), docInfo && (docInfo.fields && docInfo.fields.length > 0 && (yield "|f|", yield* docInfo.fields), typeof docInfo.ttl == "number" && (yield "|t|"), docInfo.ifExists && (yield "|e|"), docInfo.when && (yield* _Cache._yieldKeyAndOperators(Object.keys(docInfo.when), docInfo.when)));
      }
      /**
       * Gets an iterator of keys to uniquely identify a document shape for a DELETE query.
       * @param {Array<String>} docKeys
       * @param {Object} doc
       * @param {{ifExists, when, fields, deleteOnlyColumns}} docInfo
       * @returns {Iterator}
       */
      static *getRemoveKey(docKeys, doc, docInfo) {
        yield* _Cache._yieldKeyAndOperators(docKeys, doc), docInfo && (docInfo.fields && docInfo.fields.length > 0 && (yield "|f|", yield* docInfo.fields), docInfo.ifExists && (yield "|e|"), docInfo.deleteOnlyColumns && (yield "|dc|"), docInfo.when && (yield* _Cache._yieldKeyAndOperators(Object.keys(docInfo.when), docInfo.when)));
      }
      static *_yieldKeyAndOperators(keys, obj) {
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          yield key, yield* _Cache._yieldOperators(obj[key]);
        }
      }
      static *_yieldOperators(value) {
        value != null && value instanceof QueryOperator && (yield value.key, value.hasChildValues && (yield* _Cache._yieldOperators(value.value[0]), yield "|/|", yield* _Cache._yieldOperators(value.value[1])));
      }
      static *_yieldKeyAndAllQs(keys, obj) {
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          yield key;
          let value = obj[key];
          value != null && (value instanceof QueryOperator ? yield* _Cache._yieldOperators(value) : value instanceof QueryAssignment && (yield value.sign, yield value.inverted));
        }
      }
    };
    module2.exports = Cache;
  }
});

// node_modules/cassandra-driver/lib/mapping/model-batch-item.js
var require_model_batch_item = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/model-batch-item.js"(exports2, module2) {
    "use strict";
    var Cache = require_cache(), ModelBatchItem = class {
      /**
       * @param {Object} doc
       * @param {Object} docInfo
       * @param {MappingHandler} handler
       * @param {Tree} cache
       */
      constructor(doc, docInfo, handler, cache) {
        this.doc = doc, this.docInfo = docInfo, this.handler = handler, this.cache = cache;
      }
      /**
       * @ignore
       * @returns <Promise<Array>>
       */
      getQueries() {
        let docKeys = Object.keys(this.doc), cacheItem = this.cache.getOrCreate(this.getCacheKey(docKeys), () => ({ queries: null }));
        return cacheItem.queries === null && (cacheItem.queries = this.createQueries(docKeys)), cacheItem.queries;
      }
      /**
       * Gets the cache key for this item.
       * @abstract
       * @param {Array} docKeys
       * @returns {Iterator}
       */
      getCacheKey(docKeys) {
        throw new Error("getCacheKey must be implemented");
      }
      /**
       * Gets the Promise to create the queries.
       * @abstract
       * @param {Array} docKeys
       * @returns {Promise<Array>}
       */
      createQueries(docKeys) {
        throw new Error("getCacheKey must be implemented");
      }
      /**
       * Pushes the queries and parameters represented by this instance to the provided array.
       * @internal
       * @ignore
       * @param {Array} arr
       * @return {Promise<{isIdempotent, isCounter}>}
       */
      pushQueries(arr) {
        let isIdempotent = !0, isCounter;
        return this.getQueries().then((queries) => (queries.forEach((q) => {
          isIdempotent = isIdempotent && q.isIdempotent, isCounter = q.isCounter, arr.push({ query: q.query, params: q.paramsGetter(this.doc, this.docInfo, this.getMappingInfo()) });
        }), { isIdempotent, isCounter }));
      }
      /**
       * Gets the mapping information for this batch item.
       * @internal
       * @ignore
       */
      getMappingInfo() {
        return this.handler.info;
      }
    }, InsertModelBatchItem = class extends ModelBatchItem {
      /**
       * @param {Object} doc
       * @param {Object} docInfo
       * @param {MappingHandler} handler
       * @param {Tree} cache
       */
      constructor(doc, docInfo, handler, cache) {
        super(doc, docInfo, handler, cache);
      }
      /** @override */
      getCacheKey(docKeys) {
        return Cache.getInsertKey(docKeys, this.docInfo);
      }
      /** @override */
      createQueries(docKeys) {
        return this.handler.createInsertQueries(docKeys, this.doc, this.docInfo);
      }
    }, UpdateModelBatchItem = class extends ModelBatchItem {
      /**
       * @param {Object} doc
       * @param {Object} docInfo
       * @param {MappingHandler} handler
       * @param {Tree} cache
       */
      constructor(doc, docInfo, handler, cache) {
        super(doc, docInfo, handler, cache);
      }
      /** @override */
      getCacheKey(docKeys) {
        return Cache.getUpdateKey(docKeys, this.doc, this.docInfo);
      }
      /** @override */
      createQueries(docKeys) {
        return this.handler.createUpdateQueries(docKeys, this.doc, this.docInfo);
      }
    }, RemoveModelBatchItem = class extends ModelBatchItem {
      /**
       * @param {Object} doc
       * @param {Object} docInfo
       * @param {MappingHandler} handler
       * @param {Tree} cache
       */
      constructor(doc, docInfo, handler, cache) {
        super(doc, docInfo, handler, cache);
      }
      /** @override */
      getCacheKey(docKeys) {
        return Cache.getRemoveKey(docKeys, this.doc, this.docInfo);
      }
      /** @override */
      createQueries(docKeys) {
        return this.handler.createDeleteQueries(docKeys, this.doc, this.docInfo);
      }
    };
    module2.exports = { ModelBatchItem, InsertModelBatchItem, UpdateModelBatchItem, RemoveModelBatchItem };
  }
});

// node_modules/cassandra-driver/lib/mapping/model-batch-mapper.js
var require_model_batch_mapper = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/model-batch-mapper.js"(exports2, module2) {
    "use strict";
    var Tree = require_tree(), moduleBatchItemModule = require_model_batch_item(), InsertModelBatchItem = moduleBatchItemModule.InsertModelBatchItem, UpdateModelBatchItem = moduleBatchItemModule.UpdateModelBatchItem, RemoveModelBatchItem = moduleBatchItemModule.RemoveModelBatchItem, ModelBatchMapper = class {
      /**
       * Creates a new instance of model batch mapper.
       * <p>
       *   An instance of this class is exposed as a singleton in the <code>batching</code> field of the
       *   [ModelMapper]{@link module:mapping~ModelMapper}. Note that new instances should not be create with this
       *   constructor.
       * </p>
       * @param {MappingHandler} handler
       * @ignore
       */
      constructor(handler) {
        this._handler = handler, this._cache = {
          insert: new Tree(),
          update: new Tree(),
          remove: new Tree()
        };
      }
      /**
       * Gets a [ModelBatchItem]{@link module:mapping~ModelBatchItem} containing the queries for the INSERT mutation to be
       * used in a batch execution.
       * @param {Object} doc An object containing the properties to insert.
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * INSERT cql statements generated. If specified, it must include the columns to insert and the primary keys.
       * @param {Number} [docInfo.ttl] Specifies an optional Time To Live (in seconds) for the inserted values.
       * @param {Boolean} [docInfo.ifNotExists] When set, it only inserts if the row does not exist prior to the insertion.
       * <p>Please note that using IF NOT EXISTS will incur a non negligible performance cost so this should be used
       * sparingly.</p>
       * @returns {ModelBatchItem} A [ModelBatchItem]{@link module:mapping~ModelBatchItem} instance representing a query
       * or a set of queries to be included in a batch.
       */
      insert(doc, docInfo) {
        return new InsertModelBatchItem(doc, docInfo, this._handler, this._cache.insert);
      }
      /**
       * Gets a [ModelBatchItem]{@link module:mapping~ModelBatchItem} containing the queries for the UPDATE mutation to be
       * used in a batch execution.
       * @param {Object} doc An object containing the properties to update.
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * UPDATE cql statements generated. If specified, it must include the columns to update and the primary keys.
       * @param {Number} [docInfo.ttl] Specifies an optional Time To Live (in seconds) for the inserted values.
       * @param {Boolean} [docInfo.ifExists] When set, it only updates if the row already exists on the server.
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Object} [docInfo.when] A document that act as the condition that has to be met for the UPDATE to occur.
       * Use this property only in the case you want to specify a conditional clause for lightweight transactions (CAS).
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @returns {ModelBatchItem} A [ModelBatchItem]{@link module:mapping~ModelBatchItem} instance representing a query
       * or a set of queries to be included in a batch.
       */
      update(doc, docInfo) {
        return new UpdateModelBatchItem(doc, docInfo, this._handler, this._cache.update);
      }
      /**
       * Gets a [ModelBatchItem]{@link module:mapping~ModelBatchItem}  containing the queries for the DELETE mutation to be
       * used in a batch execution.
       * @param {Object} doc A document containing the primary keys values of the document to delete.
       * @param {Object} [docInfo] An object containing the additional doc information.
       * @param {Object} [docInfo.when] A document that act as the condition that has to be met for the DELETE to occur.
       * Use this property only in the case you want to specify a conditional clause for lightweight transactions (CAS).
       * When the CQL query is generated, this would be used to generate the `IF` clause.
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Boolean} [docInfo.ifExists] When set, it only issues the DELETE command if the row already exists on the
       * server.
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * DELETE cql statement generated. If specified, it must include the columns to delete and the primary keys.
       * @param {Boolean} [docInfo.deleteOnlyColumns] Determines that, when more document properties are specified
       * besides the primary keys, the generated DELETE statement should be used to delete some column values but leave
       * the row. When this is enabled and more properties are specified, a DELETE statement will have the following form:
       * "DELETE col1, col2 FROM table1 WHERE pk1 = ? AND pk2 = ?"
       * @returns {ModelBatchItem} A [ModelBatchItem]{@link module:mapping~ModelBatchItem} instance representing a query
       * or a set of queries to be included in a batch.
       */
      remove(doc, docInfo) {
        return new RemoveModelBatchItem(doc, docInfo, this._handler, this._cache.update);
      }
    };
    module2.exports = ModelBatchMapper;
  }
});

// node_modules/cassandra-driver/lib/mapping/model-mapper.js
var require_model_mapper = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/model-mapper.js"(exports2, module2) {
    "use strict";
    var ModelBatchMapper = require_model_batch_mapper(), ModelMapper = class {
      constructor(name, handler) {
        this.name = name, this._handler = handler, this.batching = new ModelBatchMapper(this._handler);
      }
      /**
       * Gets the first document matching the provided filter or null when not found.
       * <p>
       *   Note that all partition and clustering keys must be defined in order to use this method.
       * </p>
       * @param {Object} doc The object containing the properties that map to the primary keys.
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * SELECT cql statement generated, in order to restrict the amount of columns retrieved.
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @return {Promise<Object>}
       * @example <caption>Get a video by id</caption>
       * videoMapper.get({ id })
       * @example <caption>Get a video by id, selecting specific columns</caption>
       * videoMapper.get({ id }, fields: ['name', 'description'])
       */
      get(doc, docInfo, executionOptions) {
        return executionOptions === void 0 && typeof docInfo == "string" && (executionOptions = docInfo, docInfo = null), this._handler.getSelectExecutor(doc, docInfo, !0).then((executor) => executor(doc, docInfo, executionOptions)).then((result) => result.first());
      }
      /**
       * Executes a SELECT query based on the filter and returns the result as an iterable of documents.
       * @param {Object} doc An object containing the properties that map to the primary keys to filter.
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * SELECT cql statement generated, in order to restrict the amount of columns retrieved.
       * @param {Object<String, String>} [docInfo.orderBy] An associative array containing the column names as key and
       * the order string (asc or desc) as value used to set the order of the results server-side.
       * @param {Number} [docInfo.limit] Restricts the result of the query to a maximum number of rows on the
       * server.
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Number} [executionOptions.fetchSize] The amount of rows to retrieve per page.
       * @param {Number} [executionOptions.pageState] A Buffer instance or a string token representing the paging state.
       * <p>When provided, the query will be executed starting from a given paging state.</p>
       * @return {Promise<Result>} A Promise that resolves to a [Result]{@link module:mapping~Result} instance.
       * @example <caption>Get user's videos</caption>
       * const result = await videoMapper.find({ userId });
       * for (let video of result) {
       *   console.log(video.name);
       * }
       * @example <caption>Get user's videos from a certain date</caption>
       * videoMapper.find({ userId, addedDate: q.gte(date)});
       * @example <caption>Get user's videos in reverse order</caption>
       * videoMapper.find({ userId }, { orderBy: { addedDate: 'desc' }});
       */
      find(doc, docInfo, executionOptions) {
        return executionOptions === void 0 && typeof docInfo == "string" && (executionOptions = docInfo, docInfo = null), this._handler.getSelectExecutor(doc, docInfo, !1).then((executor) => executor(doc, docInfo, executionOptions));
      }
      /**
       * Executes a SELECT query without a filter and returns the result as an iterable of documents.
       * <p>
       *   This is only recommended to be used for tables with a limited amount of results. Otherwise, breaking up the
       *   token ranges on the client side should be used.
       * </p>
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * SELECT cql statement generated, in order to restrict the amount of columns retrieved.
       * @param {Object<String, String>} [docInfo.orderBy] An associative array containing the column names as key and
       * the order string (asc or desc) as value used to set the order of the results server-side.
       * @param {Number} [docInfo.limit] Restricts the result of the query to a maximum number of rows on the
       * server.
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Number} [executionOptions.fetchSize] The mount of rows to retrieve per page.
       * @param {Number} [executionOptions.pageState] A Buffer instance or a string token representing the paging state.
       * <p>When provided, the query will be executed starting from a given paging state.</p>
       * @return {Promise<Result>} A Promise that resolves to a [Result]{@link module:mapping~Result} instance.
       */
      findAll(docInfo, executionOptions) {
        return executionOptions === void 0 && typeof docInfo == "string" && (executionOptions = docInfo, docInfo = null), this._handler.getSelectAllExecutor(docInfo)(docInfo, executionOptions);
      }
      /**
       * Inserts a document.
       * <p>
       *   When the model is mapped to multiple tables, it will insert a row in each table when all the primary keys
       *   are specified.
       * </p>
       * @param {Object} doc An object containing the properties to insert.
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * INSERT cql statements generated. If specified, it must include the columns to insert and the primary keys.
       * @param {Number} [docInfo.ttl] Specifies an optional Time To Live (in seconds) for the inserted values.
       * @param {Boolean} [docInfo.ifNotExists] When set, it only inserts if the row does not exist prior to the insertion.
       * <p>Please note that using IF NOT EXISTS will incur a non negligible performance cost so this should be used
       * sparingly.</p>
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Boolean} [executionOptions.isIdempotent] Defines whether the query can be applied multiple times without
       * changing the result beyond the initial application.
       * <p>
       *   By default all generated INSERT statements are considered idempotent, except in the case of lightweight
       *   transactions. Lightweight transactions at client level with transparent retries can
       *   break linearizability. If that is not an issue for your application, you can manually set this field to true.
       * </p>
       * @param {Number|Long} [executionOptions.timestamp] The default timestamp for the query in microseconds from the
       * unix epoch (00:00:00, January 1st, 1970).
       * <p>When provided, this will replace the client generated and the server side assigned timestamp.</p>
       * @return {Promise<Result>} A Promise that resolves to a [Result]{@link module:mapping~Result} instance.
       * @example <caption>Insert a video</caption>
       * videoMapper.insert({ id, name });
       */
      insert(doc, docInfo, executionOptions) {
        return executionOptions === void 0 && typeof docInfo == "string" && (executionOptions = docInfo, docInfo = null), this._handler.getInsertExecutor(doc, docInfo).then((executor) => executor(doc, docInfo, executionOptions));
      }
      /**
       * Updates a document.
       * <p>
       *   When the model is mapped to multiple tables, it will update a row in each table when all the primary keys
       *   are specified.
       * </p>
       * @param {Object} doc An object containing the properties to update.
       * @param {Object} [docInfo] An object containing the additional document information.
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * UPDATE cql statements generated. If specified, it must include the columns to update and the primary keys.
       * @param {Number} [docInfo.ttl] Specifies an optional Time To Live (in seconds) for the inserted values.
       * @param {Boolean} [docInfo.ifExists] When set, it only updates if the row already exists on the server.
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Object} [docInfo.when] A document that act as the condition that has to be met for the UPDATE to occur.
       * Use this property only in the case you want to specify a conditional clause for lightweight transactions (CAS).
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Boolean} [executionOptions.isIdempotent] Defines whether the query can be applied multiple times without
       * changing the result beyond the initial application.
       * <p>
       *   The mapper uses the generated queries to determine the default value. When an UPDATE is generated with a
       *   counter column or appending/prepending to a list column, the execution is marked as not idempotent.
       * </p>
       * <p>
       *   Additionally, the mapper uses the safest approach for queries with lightweight transactions (Compare and
       *   Set) by considering them as non-idempotent. Lightweight transactions at client level with transparent retries can
       *   break linearizability. If that is not an issue for your application, you can manually set this field to true.
       * </p>
       * @param {Number|Long} [executionOptions.timestamp] The default timestamp for the query in microseconds from the
       * unix epoch (00:00:00, January 1st, 1970).
       * <p>When provided, this will replace the client generated and the server side assigned timestamp.</p>
       * @return {Promise<Result>} A Promise that resolves to a [Result]{@link module:mapping~Result} instance.
       * @example <caption>Update the name of a video</caption>
       * videoMapper.update({ id, name });
       */
      update(doc, docInfo, executionOptions) {
        return executionOptions === void 0 && typeof docInfo == "string" && (executionOptions = docInfo, docInfo = null), this._handler.getUpdateExecutor(doc, docInfo).then((executor) => executor(doc, docInfo, executionOptions));
      }
      /**
       * Deletes a document.
       * @param {Object} doc A document containing the primary keys values of the document to delete.
       * @param {Object} [docInfo] An object containing the additional doc information.
       * @param {Object} [docInfo.when] A document that act as the condition that has to be met for the DELETE to occur.
       * Use this property only in the case you want to specify a conditional clause for lightweight transactions (CAS).
       * When the CQL query is generated, this would be used to generate the `IF` clause.
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Boolean} [docInfo.ifExists] When set, it only issues the DELETE command if the row already exists on the
       * server.
       * <p>
       *   Please note that using IF conditions will incur a non negligible performance cost on the server-side so this
       *   should be used sparingly.
       * </p>
       * @param {Array<String>} [docInfo.fields] An Array containing the name of the properties that will be used in the
       * DELETE cql statement generated. If specified, it must include the columns to delete and the primary keys.
       * @param {Boolean} [docInfo.deleteOnlyColumns] Determines that, when more document properties are specified
       * besides the primary keys, the generated DELETE statement should be used to delete some column values but leave
       * the row. When this is enabled and more properties are specified, a DELETE statement will have the following form:
       * "DELETE col1, col2 FROM table1 WHERE pk1 = ? AND pk2 = ?"
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Boolean} [executionOptions.isIdempotent] Defines whether the query can be applied multiple times without
       * changing the result beyond the initial application.
       * <p>
       *   By default all generated DELETE statements are considered idempotent, except in the case of lightweight
       *   transactions. Lightweight transactions at client level with transparent retries can
       *   break linearizability. If that is not an issue for your application, you can manually set this field to true.
       * </p>
       * @param {Number|Long} [executionOptions.timestamp] The default timestamp for the query in microseconds from the
       * unix epoch (00:00:00, January 1st, 1970).
       * <p>When provided, this will replace the client generated and the server side assigned timestamp.</p>
       * @return {Promise<Result>} A Promise that resolves to a [Result]{@link module:mapping~Result} instance.
       * @example <caption>Delete a video</caption>
       * videoMapper.remove({ id });
       */
      remove(doc, docInfo, executionOptions) {
        return executionOptions === void 0 && typeof docInfo == "string" && (executionOptions = docInfo, docInfo = null), this._handler.getDeleteExecutor(doc, docInfo).then((executor) => executor(doc, docInfo, executionOptions));
      }
      /**
       * Uses the provided query and param getter function to execute a query and map the results.
       * Gets a function that takes the document, executes the query and returns the mapped results.
       * @param {String} query The query to execute.
       * @param {Function} paramsHandler The function to execute to extract the parameters of a document.
       * @param {Object|String} [executionOptions] When provided, the options for all executions generated with this
       * method will use the provided options and it will not consider the executionOptions per call.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Number} [executionOptions.fetchSize] Amount of rows to retrieve per page.
       * @param {Boolean} [executionOptions.isIdempotent] Defines whether the query can be applied multiple times
       * without changing the result beyond the initial application.
       * @param {Number} [executionOptions.pageState] Buffer or string token representing the paging state.
       * <p>When provided, the query will be executed starting from a given paging state.</p>
       * @param {Number|Long} [executionOptions.timestamp] The default timestamp for the query in microseconds from the
       * unix epoch (00:00:00, January 1st, 1970).
       * <p>When provided, this will replace the client generated and the server side assigned timestamp.</p>
       * @return {Function} Returns a function that takes the document and execution options as parameters and returns a
       * Promise the resolves to a [Result]{@link module:mapping~Result} instance.
       */
      mapWithQuery(query, paramsHandler, executionOptions) {
        return this._handler.getExecutorFromQuery(query, paramsHandler, executionOptions);
      }
    };
    module2.exports = ModelMapper;
  }
});

// node_modules/cassandra-driver/lib/mapping/query-generator.js
var require_query_generator = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/query-generator.js"(exports2, module2) {
    "use strict";
    var vm = require("vm"), qModule = require_q(), QueryOperator = qModule.QueryOperator, QueryAssignment = qModule.QueryAssignment, types = require_types(), dataTypes = types.dataTypes, vmFileName = "gen-param-getter.js", QueryGenerator = class _QueryGenerator {
      /**
       * Gets the SELECT query given the doc.
       * @param {String} tableName
       * @param {String} keyspace
       * @param {Array} propertiesInfo
       * @param {Array} fieldsInfo
       * @param {Array} orderByColumns
       * @param {Number|undefined} limit
       * @return {string}
       */
      static getSelect(tableName, keyspace, propertiesInfo, fieldsInfo, orderByColumns, limit) {
        let query = "SELECT ";
        return query += fieldsInfo.length > 0 ? fieldsInfo.map((p) => `"${p.columnName}"`).join(", ") : "*", query += ` FROM ${keyspace}.${tableName}`, propertiesInfo.length > 0 && (query += " WHERE ", query += _QueryGenerator._getConditionWithOperators(propertiesInfo)), orderByColumns.length > 0 && (query += " ORDER BY ", query += orderByColumns.map((order) => `"${order[0]}" ${order[1]}`).join(", ")), typeof limit == "number" && (query += " LIMIT ?"), query;
      }
      static selectParamsGetter(propertiesInfo, limit) {
        let scriptText = `(function getParametersSelect(doc, docInfo, mappingInfo) {
`;
        return scriptText += "  return [", scriptText += _QueryGenerator._valueGetterExpression(propertiesInfo), typeof limit == "number" && (propertiesInfo.length > 0 && (scriptText += ", "), scriptText += "docInfo['limit']"), scriptText += `];
})`, new vm.Script(scriptText, { filename: vmFileName }).runInThisContext();
      }
      /**
       * Gets the INSERT query and function to obtain the parameters, given the doc.
       * @param {TableMetadata} table
       * @param {String} keyspace
       * @param {Array} propertiesInfo
       * @param {Object} docInfo
       * @param {Boolean|undefined} ifNotExists
       * @return {{query: String, paramsGetter: Function, isIdempotent: Boolean}}
       */
      static getInsert(table, keyspace, propertiesInfo, docInfo, ifNotExists) {
        let ttl = docInfo && docInfo.ttl, filteredPropertiesInfo = propertiesInfo.filter((pInfo) => table.columnsByName[pInfo.columnName] !== void 0);
        return {
          query: _QueryGenerator._getInsertQuery(table.name, keyspace, filteredPropertiesInfo, ifNotExists, ttl),
          paramsGetter: _QueryGenerator._insertParamsGetter(filteredPropertiesInfo, docInfo),
          isIdempotent: !ifNotExists
        };
      }
      /**
       * Gets the query for an insert statement.
       * @param {String} tableName
       * @param {String} keyspace
       * @param {Array} propertiesInfo
       * @param {Boolean} ifNotExists
       * @param {Number|undefined} ttl
       * @return {String}
       */
      static _getInsertQuery(tableName, keyspace, propertiesInfo, ifNotExists, ttl) {
        let query = `INSERT INTO ${keyspace}.${tableName} (`;
        return query += propertiesInfo.map((pInfo) => `"${pInfo.columnName}"`).join(", "), query += ") VALUES (", query += propertiesInfo.map(() => "?").join(", "), query += ")", ifNotExists === !0 && (query += " IF NOT EXISTS"), typeof ttl == "number" && (query += " USING TTL ?"), query;
      }
      static _insertParamsGetter(propertiesInfo, docInfo) {
        let scriptText = `(function getParametersInsert(doc, docInfo, mappingInfo) {
`;
        return scriptText += "  return [", scriptText += _QueryGenerator._valueGetterExpression(propertiesInfo), docInfo && typeof docInfo.ttl == "number" && (scriptText += ", docInfo['ttl']"), scriptText += `];
})`, new vm.Script(scriptText, { filename: vmFileName }).runInThisContext();
      }
      /**
       * Gets the UPDATE query and function to obtain the parameters, given the doc.
       * @param {TableMetadata} table
       * @param {String} keyspace
       * @param {Array} propertiesInfo
       * @param {Object} docInfo
       * @param {Array} when
       * @param {Boolean|undefined} ifExists
       * @return {{query: String, paramsGetter: Function, isIdempotent: Boolean, isCounter}}
       */
      static getUpdate(table, keyspace, propertiesInfo, docInfo, when, ifExists) {
        let ttl = docInfo && docInfo.ttl, primaryKeys = new Set(table.partitionKeys.concat(table.clusteringKeys).map((c) => c.name)), isIdempotent = !0, isCounter = !1, filteredPropertiesInfo = propertiesInfo.filter((pInfo) => {
          let column = table.columnsByName[pInfo.columnName];
          return column === void 0 ? !1 : (column.type.code === dataTypes.list && pInfo.value instanceof QueryAssignment ? isIdempotent = !1 : column.type.code === dataTypes.counter && (isIdempotent = !1, isCounter = !0), !0);
        });
        return {
          query: _QueryGenerator._getUpdateQuery(
            table.name,
            keyspace,
            primaryKeys,
            filteredPropertiesInfo,
            when,
            ifExists,
            ttl
          ),
          isIdempotent: isIdempotent && when.length === 0 && !ifExists,
          paramsGetter: _QueryGenerator._updateParamsGetter(primaryKeys, filteredPropertiesInfo, when, ttl),
          isCounter
        };
      }
      /**
       * Gets the query for an UPDATE statement.
       * @param {String} tableName
       * @param {String} keyspace
       * @param {Set} primaryKeys
       * @param {Array} propertiesInfo
       * @param {Object} when
       * @param {Boolean} ifExists
       * @param {Number|undefined} ttl
       */
      static _getUpdateQuery(tableName, keyspace, primaryKeys, propertiesInfo, when, ifExists, ttl) {
        let query = `UPDATE ${keyspace}.${tableName} `;
        return typeof ttl == "number" && (query += "USING TTL ? "), query += "SET ", query += propertiesInfo.filter((p) => !primaryKeys.has(p.columnName)).map((p) => p.value instanceof QueryAssignment ? p.value.inverted ? `"${p.columnName}" = ? ${p.value.sign} "${p.columnName}"` : `"${p.columnName}" = "${p.columnName}" ${p.value.sign} ?` : `"${p.columnName}" = ?`).join(", "), query += " WHERE ", query += propertiesInfo.filter((p) => primaryKeys.has(p.columnName)).map((p) => `"${p.columnName}" = ?`).join(" AND "), ifExists === !0 ? query += " IF EXISTS" : when.length > 0 && (query += " IF " + _QueryGenerator._getConditionWithOperators(when)), query;
      }
      /**
       * Returns a function to obtain the parameter values from a doc for an UPDATE statement.
       * @param {Set} primaryKeys
       * @param {Array} propertiesInfo
       * @param {Array} when
       * @param {Number|undefined} ttl
       * @returns {Function}
       */
      static _updateParamsGetter(primaryKeys, propertiesInfo, when, ttl) {
        let scriptText = `(function getParametersUpdate(doc, docInfo, mappingInfo) {
`;
        return scriptText += "  return [", typeof ttl == "number" && (scriptText += "docInfo['ttl'], "), scriptText += _QueryGenerator._assignmentGetterExpression(propertiesInfo.filter((p) => !primaryKeys.has(p.columnName))), scriptText += ", ", scriptText += _QueryGenerator._valueGetterExpression(propertiesInfo.filter((p) => primaryKeys.has(p.columnName))), when.length > 0 && (scriptText += ", " + _QueryGenerator._valueGetterExpression(when, "docInfo.when")), scriptText += `];
})`, new vm.Script(scriptText, { filename: vmFileName }).runInThisContext();
      }
      /**
       * Gets the DELETE query and function to obtain the parameters, given the doc.
       * @param {TableMetadata} table
       * @param {String} keyspace
       * @param {Array} propertiesInfo
       * @param {Object} docInfo
       * @param {Array} when
       * @param {Boolean|undefined} ifExists
       * @return {{query: String, paramsGetter: Function, isIdempotent}}
       */
      static getDelete(table, keyspace, propertiesInfo, docInfo, when, ifExists) {
        let deleteOnlyColumns = docInfo && docInfo.deleteOnlyColumns, primaryKeys = new Set(table.partitionKeys.concat(table.clusteringKeys).map((c) => c.name)), filteredPropertiesInfo = propertiesInfo.filter((pInfo) => table.columnsByName[pInfo.columnName] !== void 0);
        return {
          query: _QueryGenerator._getDeleteQuery(
            table.name,
            keyspace,
            primaryKeys,
            filteredPropertiesInfo,
            when,
            ifExists,
            deleteOnlyColumns
          ),
          paramsGetter: _QueryGenerator._deleteParamsGetter(primaryKeys, filteredPropertiesInfo, when),
          isIdempotent: when.length === 0 && !ifExists
        };
      }
      /**
       * Gets the query for an UPDATE statement.
       * @param {String} tableName
       * @param {String} keyspace
       * @param {Set} primaryKeys
       * @param {Array} propertiesInfo
       * @param {Array} when
       * @param {Boolean} ifExists
       * @param {Boolean} deleteOnlyColumns
       * @private
       * @return {String}
       */
      static _getDeleteQuery(tableName, keyspace, primaryKeys, propertiesInfo, when, ifExists, deleteOnlyColumns) {
        let query = "DELETE";
        if (deleteOnlyColumns) {
          let columnsToDelete = propertiesInfo.filter((p) => !primaryKeys.has(p.columnName)).map((p) => `"${p.columnName}"`).join(", ");
          columnsToDelete !== "" && (query += " " + columnsToDelete);
        }
        return query += ` FROM ${keyspace}.${tableName} WHERE `, query += propertiesInfo.filter((p) => primaryKeys.has(p.columnName)).map((p) => `"${p.columnName}" = ?`).join(" AND "), ifExists === !0 ? query += " IF EXISTS" : when.length > 0 && (query += " IF " + _QueryGenerator._getConditionWithOperators(when)), query;
      }
      /**
       * Returns a function to obtain the parameter values from a doc for an UPDATE statement.
       * @param {Set} primaryKeys
       * @param {Array} propertiesInfo
       * @param {Array} when
       * @returns {Function}
       */
      static _deleteParamsGetter(primaryKeys, propertiesInfo, when) {
        let scriptText = `(function getParametersDelete(doc, docInfo, mappingInfo) {
`;
        return scriptText += "  return [", scriptText += _QueryGenerator._valueGetterExpression(propertiesInfo.filter((p) => primaryKeys.has(p.columnName))), when.length > 0 && (scriptText += ", " + _QueryGenerator._valueGetterExpression(when, "docInfo.when")), scriptText += `];
})`, new vm.Script(scriptText, { filename: vmFileName }).runInThisContext();
      }
      /**
       * Gets a string containing the doc properties to get.
       * @param {Array} propertiesInfo
       * @param {String} [objectName='doc']
       * @return {string}
       * @private
       */
      static _valueGetterExpression(propertiesInfo, objectName) {
        return objectName = objectName || "doc", propertiesInfo.map((p) => _QueryGenerator._valueGetterSingle(`${objectName}['${p.propertyName}']`, p.propertyName, p.value, p.fromModel)).join(", ");
      }
      static _valueGetterSingle(prefix, propName, value, fromModelFn) {
        let valueGetter = prefix;
        if (value instanceof QueryOperator) {
          if (value.hasChildValues)
            return `${_QueryGenerator._valueGetterSingle(`${prefix}.value[0]`, propName, value.value[0], fromModelFn)}, ${_QueryGenerator._valueGetterSingle(`${prefix}.value[1]`, propName, value.value[1], fromModelFn)}`;
          if (valueGetter = `${prefix}.value`, value.isInOperator && fromModelFn)
            return `${valueGetter}.map(v => ${_QueryGenerator._getMappingFunctionCall(propName, "v")})`;
        }
        return fromModelFn ? _QueryGenerator._getMappingFunctionCall(propName, valueGetter) : valueGetter;
      }
      /**
       * Gets a string containing the doc properties to SET, considering QueryAssignment instances.
       * @param {Array} propertiesInfo
       * @param {String} [prefix='doc']
       * @return {string}
       * @private
       */
      static _assignmentGetterExpression(propertiesInfo, prefix) {
        return prefix = prefix || "doc", propertiesInfo.map((p) => {
          let valueGetter = `${prefix}['${p.propertyName}']${p.value instanceof QueryAssignment ? ".value" : ""}`;
          return p.fromModel ? _QueryGenerator._getMappingFunctionCall(p.propertyName, valueGetter) : valueGetter;
        }).join(", ");
      }
      static _getConditionWithOperators(propertiesInfo) {
        return propertiesInfo.map((p) => _QueryGenerator._getSingleCondition(p.columnName, p.value)).join(" AND ");
      }
      static _getMappingFunctionCall(propName, valueGetter) {
        return `mappingInfo.getFromModelFn('${propName}')(${valueGetter})`;
      }
      static _getSingleCondition(columnName, value) {
        return value instanceof QueryOperator ? value.hasChildValues ? `${_QueryGenerator._getSingleCondition(columnName, value.value[0])} ${value.key} ${_QueryGenerator._getSingleCondition(columnName, value.value[1])}` : `"${columnName}" ${value.key} ?` : `"${columnName}" = ?`;
      }
    };
    module2.exports = QueryGenerator;
  }
});

// node_modules/cassandra-driver/lib/mapping/result-mapper.js
var require_result_mapper = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/result-mapper.js"(exports2, module2) {
    "use strict";
    var vm = require("vm"), utils = require_utils(), types = require_types(), ResultMapper = class _ResultMapper {
      /**
       * Gets a generated function to adapt the row to a document.
       * @param {ModelMappingInfo} info
       * @param {ResultSet} rs
       * @returns {Function}
       */
      static getSelectAdapter(info, rs) {
        let columns = rs.columns;
        if (!columns)
          throw new Error("Expected ROWS result obtained VOID");
        let scriptText = `(function rowAdapter(row, info) {
  const item = info.newInstance();
`;
        for (let c of columns)
          scriptText += `  item['${info.getPropertyName(c.name)}'] = `, info.getToModelFn(c.name) ? scriptText += `info.getToModelFn('${c.name}')(row['${c.name}']);
` : scriptText += `row['${c.name}'];
`;
        return scriptText += `  return item;
})`, new vm.Script(scriptText, { filename: "gen-result-mapper.js" }).runInThisContext();
      }
      /**
       * Gets a function used to adapt VOID results or conditional updates.
       * @param {ResultSet} rs
       * @returns {Function}
       */
      static getMutationAdapter(rs) {
        return rs.columns === null || rs.columns.length === 1 && rs.columns[0].name === "[applied]" && rs.columns[0].type.code === types.dataTypes.boolean ? utils.noop : _ResultMapper._getConditionalRowAdapter(rs);
      }
      static _getConditionalRowAdapter(rs) {
        return function(row, info) {
          let item = info.newInstance();
          for (let i = 1; i < rs.columns.length; i++) {
            let c = rs.columns[i];
            item[info.getPropertyName(c.name)] = row[c.name];
          }
          return item;
        };
      }
      /**
       * @param {ModelMappingInfo} info
       * @param {ResultSet} rs
       * @returns {{canCache: Boolean, fn: Function}}
       */
      static getCustomQueryAdapter(info, rs) {
        return rs.columns === null || rs.columns.length === 0 ? { canCache: !0, fn: utils.noop } : rs.columns[0].name === "[applied]" && rs.columns[0].type.code === types.dataTypes.boolean ? { canCache: !1, fn: _ResultMapper._getConditionalRowAdapter(rs) } : { canCache: !0, fn: _ResultMapper.getSelectAdapter(info, rs) };
      }
    };
    module2.exports = ResultMapper;
  }
});

// node_modules/cassandra-driver/lib/mapping/result.js
var require_result = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/result.js"(exports2, module2) {
    "use strict";
    var util = require("util"), utils = require_utils(), inspectMethod = util.inspect.custom || "inspect", Result = class {
      /**
       * Creates a new instance of Result.
       * @param {ResultSet} rs
       * @param {ModelMappingInfo} info
       * @param {Function} rowAdapter
       */
      constructor(rs, info, rowAdapter) {
        this._rs = rs, this._info = info, this._rowAdapter = rowAdapter, this._isEmptyLwt = rs.columns !== null && rs.columns.length === 1 && this._rs.rowLength === 1 && rs.columns[0].name === "[applied]", this.length = this._isEmptyLwt ? 0 : rs.rowLength || 0, this.pageState = rs.pageState;
      }
      /**
       * When this instance is the result of a conditional update query, it returns whether it was successful.
       * Otherwise, it returns <code>true</code>.
       * <p>
       *   For consistency, this method always returns <code>true</code> for non-conditional queries (although there is
       *   no reason to call the method in that case). This is also the case for conditional DDL statements
       *   (CREATE KEYSPACE... IF NOT EXISTS, CREATE TABLE... IF NOT EXISTS), for which the server doesn't return
       *   information whether it was applied or not.
       * </p>
       */
      wasApplied() {
        return this._rs.wasApplied();
      }
      /**
       * Gets the first document in this result or null when the result is empty.
       */
      first() {
        return !this._rs.rowLength || this._isEmptyLwt ? null : this._rowAdapter(this._rs.rows[0], this._info);
      }
      /**
       * Returns a new Iterator object that contains the document values.
       */
      *[Symbol.iterator]() {
        if (!this._isEmptyLwt)
          for (let i = 0; i < this._rs.rows.length; i++)
            yield this._rowAdapter(this._rs.rows[i], this._info);
      }
      /**
       * Converts the current instance to an Array of documents.
       * @return {Array<Object>}
       */
      toArray() {
        return this._isEmptyLwt || !this._rs.rows ? utils.emptyArray : this._rs.rows.map((row) => this._rowAdapter(row, this._info));
      }
      /**
       * Executes a provided function once per result element.
       * @param {Function} callback Function to execute for each element, taking two arguments: currentValue and index.
       * @param {Object} [thisArg] Value to use as <code>this</code> when executing callback.
       */
      forEach(callback, thisArg) {
        let index = 0;
        thisArg = thisArg || this;
        for (let doc of this)
          callback.call(thisArg, doc, index++);
      }
      [inspectMethod]() {
        return this.toArray();
      }
    };
    module2.exports = Result;
  }
});

// node_modules/cassandra-driver/lib/mapping/object-selector.js
var require_object_selector = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/object-selector.js"(exports2, module2) {
    "use strict";
    var keyMatches = {
      all: 1,
      none: 0,
      some: -1
    }, ObjectSelector = class {
      /**
       * Gets the table/view that should be used to execute the SELECT query.
       * @param {Client} client
       * @param {ModelMappingInfo} info
       * @param {Boolean} allPKsDefined
       * @param {Array} propertiesInfo
       * @param {Array} fieldsInfo
       * @param {Array<Array<String>>} orderByColumns
       * @return {Promise<String>} A promise that resolves to a table names.
       */
      static getForSelect(client, info, allPKsDefined, propertiesInfo, fieldsInfo, orderByColumns) {
        return Promise.all(
          info.tables.map((t) => t.isView ? client.metadata.getMaterializedView(info.keyspace, t.name) : client.metadata.getTable(info.keyspace, t.name))
        ).then((tables) => {
          for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            if (table === null)
              throw new Error(`Table "${info.tables[i].name}" could not be retrieved`);
            if (!(keysAreIncluded(table.partitionKeys, propertiesInfo) !== keyMatches.all || allPKsDefined && keysAreIncluded(table.clusteringKeys, propertiesInfo) !== keyMatches.all || propertiesInfo.length > table.partitionKeys.length && !propertiesInfo.reduce(
              (acc, p) => acc && (contains(table.partitionKeys, (c) => c.name === p.columnName) || contains(table.clusteringKeys, (c) => c.name === p.columnName)),
              !0
            ) || !fieldsInfo.reduce((acc, p) => acc && table.columnsByName[p.columnName] !== void 0, !0) || !orderByColumns.reduce((acc, order, index) => {
              if (!acc)
                return !1;
              let ck = table.clusteringKeys[index];
              return ck && ck.name === order[0];
            }, !0)))
              return table.name;
          }
          let message = `No table matches the filter (${allPKsDefined ? "all PKs have to be specified" : "PKs"}): [${propertiesInfo.map((p) => p.columnName)}]`;
          throw fieldsInfo.length > 0 && (message += `; fields: [${fieldsInfo.map((p) => p.columnName)}]`), orderByColumns.length > 0 && (message += `; orderBy: [${orderByColumns.map((item) => item[0])}]`), new Error(message);
        });
      }
      /** Returns the name of the first table */
      static getForSelectAll(info) {
        return info.tables[0].name;
      }
      /**
       * Gets the tables that should be used to execute the INSERT query.
       * @param {Client} client
       * @param {ModelMappingInfo} info
       * @param {Array} propertiesInfo
       * @return {Promise<Array<TableMetadata>>} A promise that resolves to an Array of tables.
       */
      static getForInsert(client, info, propertiesInfo) {
        return Promise.all(info.tables.filter((t) => !t.isView).map((t) => client.metadata.getTable(info.keyspace, t.name))).then((tables) => {
          let filteredTables = tables.filter((table, i) => {
            if (table === null)
              throw new Error(`Table "${info.tables[i].name}" could not be retrieved`);
            if (keysAreIncluded(table.partitionKeys, propertiesInfo) !== keyMatches.all)
              return !1;
            let clusteringKeyMatches = keysAreIncluded(table.clusteringKeys, propertiesInfo);
            if (clusteringKeyMatches === keyMatches.all)
              return !0;
            if (clusteringKeyMatches === keyMatches.some)
              return !1;
            let staticColumns = staticColumnCount(table);
            return propertiesInfo.length === table.partitionKeys.length + staticColumns && staticColumns > 0;
          });
          if (filteredTables.length === 0)
            throw new Error(`No table matches (all PKs have to be specified) fields: [${propertiesInfo.map((p) => p.columnName)}]`);
          return filteredTables;
        });
      }
      /**
       * Gets the tables that should be used to execute the UPDATE query.
       * @param {Client} client
       * @param {ModelMappingInfo} info
       * @param {Array} propertiesInfo
       * @param {Array} when
       * @return {Promise<Array<TableMetadata>>} A promise that resolves to an Array of tables.
       */
      static getForUpdate(client, info, propertiesInfo, when) {
        return Promise.all(info.tables.filter((t) => !t.isView).map((t) => client.metadata.getTable(info.keyspace, t.name))).then((tables) => {
          let filteredTables = tables.filter((table, i) => {
            if (table === null)
              throw new Error(`Table "${info.tables[i].name}" could not be retrieved`);
            if (keysAreIncluded(table.partitionKeys, propertiesInfo) !== keyMatches.all)
              return !1;
            let clusteringKeyMatches = keysAreIncluded(table.clusteringKeys, propertiesInfo);
            if (clusteringKeyMatches === keyMatches.some || clusteringKeyMatches === keyMatches.none && !hasStaticColumn(table))
              return !1;
            let applicableColumns = propertiesInfo.reduce((acc, p) => acc + (table.columnsByName[p.columnName] !== void 0 ? 1 : 0), 0);
            return applicableColumns <= table.partitionKeys.length + table.clusteringKeys.length && (!hasStaticColumn(table) || applicableColumns <= table.partitionKeys.length) ? !1 : when.reduce((acc, p) => acc && table.columnsByName[p.columnName] !== void 0, !0);
          });
          if (filteredTables.length === 0) {
            let message = `No table matches (all PKs and columns to set have to be specified) fields: [${propertiesInfo.map((p) => p.columnName)}]`;
            throw when.length > 0 && (message += `; condition: [${when.map((p) => p.columnName)}]`), new Error(message);
          }
          return filteredTables;
        });
      }
      /**
       * Gets the tables that should be used to execute the DELETE query.
       * @param {Client} client
       * @param {ModelMappingInfo} info
       * @param {Array} propertiesInfo
       * @param {Array} when
       * @return {Promise<Array<TableMetadata>>} A promise that resolves to an Array of tables.
       */
      static getForDelete(client, info, propertiesInfo, when) {
        return Promise.all(info.tables.filter((t) => !t.isView).map((t) => client.metadata.getTable(info.keyspace, t.name))).then((tables) => {
          let filteredTables = tables.filter((table, i) => {
            if (table === null)
              throw new Error(`Table "${info.tables[i].name}" could not be retrieved`);
            let keyNames = table.partitionKeys.concat(table.clusteringKeys).map((k) => k.name), columns = propertiesInfo.map((p) => p.columnName);
            for (let i2 = 0; i2 < keyNames.length; i2++)
              if (columns.indexOf(keyNames[i2]) === -1)
                return !1;
            return when.reduce((acc, p) => acc && table.columnsByName[p.columnName] !== void 0, !0);
          });
          if (filteredTables.length === 0) {
            let message = `No table matches (all PKs have to be specified) fields: [${propertiesInfo.map((p) => p.columnName)}]`;
            throw when.length > 0 && (message += `; condition: [${when.map((p) => p.columnName)}]`), new Error(message);
          }
          return filteredTables;
        });
      }
    };
    function contains(arr, fn) {
      return arr.filter(fn).length > 0;
    }
    function keysAreIncluded(keys, propertiesInfo) {
      if (keys.length === 0)
        return keyMatches.all;
      let matches = propertiesInfo.reduce((acc, p) => acc + (contains(keys, (k) => p.columnName === k.name) ? 1 : 0), 0);
      return matches === 0 ? keyMatches.none : matches === keys.length ? keyMatches.all : keyMatches.some;
    }
    function hasStaticColumn(table) {
      return staticColumnCount(table) > 0;
    }
    function staticColumnCount(table) {
      return table.columns.reduce((acc, column) => acc + (column.isStatic ? 1 : 0), 0);
    }
    module2.exports = ObjectSelector;
  }
});

// node_modules/cassandra-driver/lib/mapping/doc-info-adapter.js
var require_doc_info_adapter = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/doc-info-adapter.js"(exports2, module2) {
    "use strict";
    var errors = require_errors(), utils = require_utils(), DocInfoAdapter = class {
      /**
       * Returns an Array where each item contains the property name, the column name and the property value (to obtain
       * the operator).
       * When docInfo.fields is specified, it uses that array to obtain the information.
       * @param {Array<String>} docKeys
       * @param {null|{fields}} docInfo
       * @param {Object} doc
       * @param {ModelMappingInfo} mappingInfo
       * @returns {Array}
       */
      static getPropertiesInfo(docKeys, docInfo, doc, mappingInfo) {
        let propertyKeys = docKeys;
        return docInfo && docInfo.fields && docInfo.fields.length > 0 && (propertyKeys = docInfo.fields), propertyKeys.map((propertyName) => ({
          propertyName,
          columnName: mappingInfo.getColumnName(propertyName),
          value: doc[propertyName],
          fromModel: mappingInfo.getFromModelFn(propertyName)
        }));
      }
      /**
       * @param {{orderBy}} docInfo
       * @param {ModelMappingInfo} mappingInfo
       * @returns {Array<String>}
       */
      static adaptOrderBy(docInfo, mappingInfo) {
        return !docInfo || !docInfo.orderBy ? utils.emptyArray : Object.keys(docInfo.orderBy).map((key) => {
          let value = docInfo.orderBy[key], ordering = typeof value == "string" ? value.toUpperCase() : value;
          if (ordering !== "ASC" && ordering !== "DESC")
            throw new errors.ArgumentError('Order must be either "ASC" or "DESC", obtained: ' + value);
          return [mappingInfo.getColumnName(key), ordering];
        });
      }
      /**
       * Returns the QueryOptions for an INSERT/UPDATE/DELETE statement.
       * @param {Object|String|undefined} executionOptions
       * @param {Boolean} isIdempotent
       */
      static adaptOptions(executionOptions, isIdempotent) {
        let options = {
          prepare: !0,
          executionProfile: void 0,
          timestamp: void 0,
          isIdempotent
        };
        return typeof executionOptions == "string" ? options.executionProfile = executionOptions : executionOptions != null && (options.executionProfile = executionOptions.executionProfile, options.timestamp = executionOptions.timestamp, executionOptions.isIdempotent !== void 0 && (options.isIdempotent = executionOptions.isIdempotent)), options;
      }
      /**
       * Returns the QueryOptions for a SELECT statement.
       * @param {Object|String|undefined} executionOptions
       * @param {Boolean} [overrideIdempotency]
       */
      static adaptAllOptions(executionOptions, overrideIdempotency) {
        let options = {
          prepare: !0,
          executionProfile: void 0,
          fetchSize: void 0,
          pageState: void 0,
          timestamp: void 0,
          isIdempotent: void 0
        };
        return typeof executionOptions == "string" ? options.executionProfile = executionOptions : executionOptions != null && (options.executionProfile = executionOptions.executionProfile, options.fetchSize = executionOptions.fetchSize, options.pageState = executionOptions.pageState, options.timestamp = executionOptions.timestamp, options.isIdempotent = executionOptions.isIdempotent), overrideIdempotency && (options.isIdempotent = !0), options;
      }
      /**
       * Returns the QueryOptions for a batch statement.
       * @param {Object|String|undefined} executionOptions
       * @param {Boolean} isIdempotent
       * @param {Boolean} isCounter
       */
      static adaptBatchOptions(executionOptions, isIdempotent, isCounter) {
        let options = {
          prepare: !0,
          executionProfile: void 0,
          timestamp: void 0,
          logged: void 0,
          isIdempotent,
          counter: isCounter
        };
        return typeof executionOptions == "string" ? options.executionProfile = executionOptions : executionOptions != null && (options.executionProfile = executionOptions.executionProfile, options.timestamp = executionOptions.timestamp, options.logged = executionOptions.logged !== !1, executionOptions.isIdempotent !== void 0 && (options.isIdempotent = executionOptions.isIdempotent)), options;
      }
    };
    module2.exports = DocInfoAdapter;
  }
});

// node_modules/cassandra-driver/lib/mapping/mapping-handler.js
var require_mapping_handler = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/mapping-handler.js"(exports2, module2) {
    "use strict";
    var utils = require_utils(), QueryGenerator = require_query_generator(), ResultMapper = require_result_mapper(), Result = require_result(), Cache = require_cache(), Tree = require_tree(), ObjectSelector = require_object_selector(), DocInfoAdapter = require_doc_info_adapter(), cacheHighWaterMark = 100, MappingHandler = class {
      /**
       * @param {Client} client
       * @param {ModelMappingInfo} mappingInfo
       */
      constructor(client, mappingInfo) {
        this._client = client, this._cache = {
          select: new Tree().on("add", (length) => this._validateCacheLength(length)),
          selectAll: new Tree().on("add", (length) => this._validateCacheLength(length)),
          insert: new Tree().on("add", (length) => this._validateCacheLength(length)),
          update: new Tree().on("add", (length) => this._validateCacheLength(length)),
          remove: new Tree().on("add", (length) => this._validateCacheLength(length)),
          customQueries: /* @__PURE__ */ new Map()
        }, this.info = mappingInfo;
      }
      /**
       * Gets a function to be used to execute SELECT the query using the document.
       * @param {Object} doc
       * @param {{fields, orderBy, limit}} docInfo
       * @param {Boolean} allPKsDefined Determines whether all primary keys must be defined in the doc for the query to
       * be valid.
       * @return {Promise<Function>}
       */
      getSelectExecutor(doc, docInfo, allPKsDefined) {
        let docKeys = Object.keys(doc);
        if (docKeys.length === 0)
          return Promise.reject(new Error("Expected object with keys"));
        let cacheKey = Cache.getSelectKey(docKeys, doc, docInfo), cacheItem = this._cache.select.getOrCreate(cacheKey, () => ({ executor: null, resultAdapter: null }));
        if (cacheItem.executor !== null)
          return Promise.resolve(cacheItem.executor);
        let propertiesInfo = DocInfoAdapter.getPropertiesInfo(docKeys, null, doc, this.info), fieldsInfo = DocInfoAdapter.getPropertiesInfo(utils.emptyArray, docInfo, doc, this.info), orderByColumns = DocInfoAdapter.adaptOrderBy(docInfo, this.info), limit = docInfo && docInfo.limit;
        return this._client.connect().then(() => ObjectSelector.getForSelect(this._client, this.info, allPKsDefined, propertiesInfo, fieldsInfo, orderByColumns)).then((tableName) => {
          let query = QueryGenerator.getSelect(
            tableName,
            this.info.keyspace,
            propertiesInfo,
            fieldsInfo,
            orderByColumns,
            limit
          ), paramsGetter = QueryGenerator.selectParamsGetter(propertiesInfo, limit), self = this;
          return cacheItem.executor = function(doc2, docInfo2, executionOptions) {
            return self._executeSelect(query, paramsGetter, doc2, docInfo2, executionOptions, cacheItem);
          }, cacheItem.executor;
        });
      }
      getSelectAllExecutor(docInfo) {
        let cacheKey = Cache.getSelectAllKey(docInfo), cacheItem = this._cache.selectAll.getOrCreate(cacheKey, () => ({ executor: null, resultAdapter: null }));
        if (cacheItem.executor !== null)
          return cacheItem.executor;
        let fieldsInfo = DocInfoAdapter.getPropertiesInfo(utils.emptyArray, docInfo, utils.emptyObject, this.info), orderByColumns = DocInfoAdapter.adaptOrderBy(docInfo, this.info), limit = docInfo && docInfo.limit, tableName = ObjectSelector.getForSelectAll(this.info), query = QueryGenerator.getSelect(
          tableName,
          this.info.keyspace,
          utils.emptyArray,
          fieldsInfo,
          orderByColumns,
          limit
        ), paramsGetter = QueryGenerator.selectParamsGetter(utils.emptyArray, limit), self = this;
        return cacheItem.executor = function(docInfo2, executionOptions) {
          return self._executeSelect(query, paramsGetter, null, docInfo2, executionOptions, cacheItem);
        }, cacheItem.executor;
      }
      /**
       * Executes a SELECT query and returns the adapted results.
       * When a result adapter is not yet created, it gets a new one and caches it.
       * @private
       */
      _executeSelect(query, paramsGetter, doc, docInfo, executionOptions, cacheItem) {
        let options = DocInfoAdapter.adaptAllOptions(executionOptions, !0);
        return this._client.execute(query, paramsGetter(doc, docInfo, this.info), options).then((rs) => (cacheItem.resultAdapter === null && (cacheItem.resultAdapter = ResultMapper.getSelectAdapter(this.info, rs)), new Result(rs, this.info, cacheItem.resultAdapter)));
      }
      /**
       * Gets a function to be used to execute INSERT the query using the document.
       * @param {Object} doc
       * @param {{ifNotExists, ttl, fields}} docInfo
       * @return {Promise<Function>}
       */
      getInsertExecutor(doc, docInfo) {
        let docKeys = Object.keys(doc);
        if (docKeys.length === 0)
          return Promise.reject(new Error("Expected object with keys"));
        let cacheKey = Cache.getInsertKey(docKeys, docInfo), cacheItem = this._cache.insert.getOrCreate(cacheKey, () => ({ executor: null }));
        return cacheItem.executor !== null ? Promise.resolve(cacheItem.executor) : this.createInsertQueries(docKeys, doc, docInfo).then((queries) => queries.length === 1 ? this._setSingleExecutor(cacheItem, queries[0]) : this._setBatchExecutor(cacheItem, queries));
      }
      /**
       * Creates an Array containing the query and the params getter function for each table affected by the INSERT.
       * @param {Array<String>} docKeys
       * @param {Object} doc
       * @param {{ifNotExists, ttl, fields}} docInfo
       * @returns {Promise<Array<{query, paramsGetter}>>}
       */
      createInsertQueries(docKeys, doc, docInfo) {
        let propertiesInfo = DocInfoAdapter.getPropertiesInfo(docKeys, docInfo, doc, this.info), ifNotExists = docInfo && docInfo.ifNotExists;
        return this._client.connect().then(() => ObjectSelector.getForInsert(this._client, this.info, propertiesInfo)).then((tables) => {
          if (tables.length > 1 && ifNotExists)
            throw new Error("Batch with ifNotExists conditions cannot span multiple tables");
          return tables.map((table) => QueryGenerator.getInsert(table, this.info.keyspace, propertiesInfo, docInfo, ifNotExists));
        });
      }
      /**
       * Gets a function to be used to execute the UPDATE queries with the provided document.
       * @param {Object} doc
       * @param {{ifExists, when, ttl, fields}} docInfo
       * @return {Promise<Function>}
       */
      getUpdateExecutor(doc, docInfo) {
        let docKeys = Object.keys(doc);
        if (docKeys.length === 0)
          return Promise.reject(new Error("Expected object with keys"));
        let cacheKey = Cache.getUpdateKey(docKeys, doc, docInfo), cacheItem = this._cache.update.getOrCreate(cacheKey, () => ({ executor: null }));
        return cacheItem.executor !== null ? Promise.resolve(cacheItem.executor) : this.createUpdateQueries(docKeys, doc, docInfo).then((queries) => queries.length === 1 ? this._setSingleExecutor(cacheItem, queries[0]) : this._setBatchExecutor(cacheItem, queries));
      }
      /**
       * Creates an Array containing the query and the params getter function for each table affected by the UPDATE.
       * @param {Array<String>} docKeys
       * @param {Object} doc
       * @param {Object} docInfo
       * @returns {Promise<Array<{query, paramsGetter, isIdempotent}>>}
       */
      createUpdateQueries(docKeys, doc, docInfo) {
        let propertiesInfo = DocInfoAdapter.getPropertiesInfo(docKeys, docInfo, doc, this.info), ifExists = docInfo && docInfo.ifExists, when = docInfo && docInfo.when ? DocInfoAdapter.getPropertiesInfo(Object.keys(docInfo.when), null, docInfo.when, this.info) : utils.emptyArray;
        if (when.length > 0 && ifExists)
          throw new Error("Both when and ifExists conditions can not be applied to the same statement");
        return this._client.connect().then(() => ObjectSelector.getForUpdate(this._client, this.info, propertiesInfo, when)).then((tables) => {
          if (tables.length > 1 && (when.length > 0 || ifExists))
            throw new Error("Batch with when or ifExists conditions cannot span multiple tables");
          return tables.map((table) => QueryGenerator.getUpdate(table, this.info.keyspace, propertiesInfo, docInfo, when, ifExists));
        });
      }
      /**
       * Gets a function to be used to execute the DELETE queries with the provided document.
       * @param {Object} doc
       * @param {{when, ifExists, fields, deleteOnlyColumns}} docInfo
       * @return {Promise<Function>}
       */
      getDeleteExecutor(doc, docInfo) {
        let docKeys = Object.keys(doc);
        if (docKeys.length === 0)
          return Promise.reject(new Error("Expected object with keys"));
        let cacheKey = Cache.getRemoveKey(docKeys, doc, docInfo), cacheItem = this._cache.remove.getOrCreate(cacheKey, () => ({ executor: null }));
        return cacheItem.executor !== null ? Promise.resolve(cacheItem.executor) : this.createDeleteQueries(docKeys, doc, docInfo).then((queries) => queries.length === 1 ? this._setSingleExecutor(cacheItem, queries[0]) : this._setBatchExecutor(cacheItem, queries));
      }
      /**
       * Creates an Array containing the query and the params getter function for each table affected by the DELETE.
       * @param {Array<String>} docKeys
       * @param {Object} doc
       * @param {{when, ifExists, fields, deleteOnlyColumns}} docInfo
       * @returns {Promise<Array<{query, paramsGetter}>>}
       */
      createDeleteQueries(docKeys, doc, docInfo) {
        let propertiesInfo = DocInfoAdapter.getPropertiesInfo(docKeys, docInfo, doc, this.info), ifExists = docInfo && docInfo.ifExists, when = docInfo && docInfo.when ? DocInfoAdapter.getPropertiesInfo(Object.keys(docInfo.when), null, docInfo.when, this.info) : utils.emptyArray;
        if (when.length > 0 && ifExists)
          throw new Error("Both when and ifExists conditions can not be applied to the same statement");
        return this._client.connect().then(() => ObjectSelector.getForDelete(this._client, this.info, propertiesInfo, when)).then((tables) => {
          if (tables.length > 1 && (when.length > 0 || ifExists))
            throw new Error("Batch with when or ifExists conditions cannot span multiple tables");
          return tables.map((table) => QueryGenerator.getDelete(table, this.info.keyspace, propertiesInfo, docInfo, when, ifExists));
        });
      }
      getExecutorFromQuery(query, paramsHandler, commonExecutionOptions) {
        let self = this, commonOptions = commonExecutionOptions ? DocInfoAdapter.adaptAllOptions(commonExecutionOptions) : null;
        return function(doc, executionOptions) {
          let options = commonOptions || DocInfoAdapter.adaptAllOptions(executionOptions);
          return self._client.execute(query, paramsHandler(doc), options).then((rs) => {
            let resultAdapter = self._cache.customQueries.get(query);
            if (resultAdapter === void 0) {
              let resultAdapterInfo = ResultMapper.getCustomQueryAdapter(self.info, rs);
              resultAdapter = resultAdapterInfo.fn, resultAdapterInfo.canCache && (self._cache.customQueries.set(query, resultAdapter), self._cache.customQueries.size === cacheHighWaterMark && self._client.log(
                "warning",
                `Custom queries cache reached ${cacheHighWaterMark} items, this could be caused by hard-coding parameter values inside the query, which should be avoided`
              ));
            }
            return new Result(rs, self.info, resultAdapter);
          });
        };
      }
      _setSingleExecutor(cacheItem, queryInfo) {
        let self = this;
        return cacheItem.executor = function(doc, docInfo, executionOptions) {
          let options = DocInfoAdapter.adaptOptions(executionOptions, queryInfo.isIdempotent);
          return self._client.execute(queryInfo.query, queryInfo.paramsGetter(doc, docInfo, self.info), options).then((rs) => new Result(rs, self.info, ResultMapper.getMutationAdapter(rs)));
        }, cacheItem.executor;
      }
      _setBatchExecutor(cacheItem, queries) {
        let self = this, isIdempotent = queries.reduce((acc, q) => acc && q.isIdempotent, !0);
        return cacheItem.executor = function(doc, docInfo, executionOptions) {
          let queryAndParams = queries.map((q) => ({
            query: q.query,
            params: q.paramsGetter(doc, docInfo, self.info)
          })), options = DocInfoAdapter.adaptOptions(executionOptions, isIdempotent);
          return self._client.batch(queryAndParams, options).then((rs) => new Result(rs, self.info, ResultMapper.getMutationAdapter(rs)));
        }, cacheItem.executor;
      }
      _validateCacheLength(length) {
        length === cacheHighWaterMark && this._client.log("warning", `ModelMapper cache reached ${cacheHighWaterMark} items, this could be caused by building the object to map in different ways (with different shapes) each time. Use the same or few object structures for a model and represent unset values with undefined or types.unset`);
      }
    };
    module2.exports = MappingHandler;
  }
});

// node_modules/cassandra-driver/lib/mapping/table-mappings.js
var require_table_mappings = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/table-mappings.js"(exports2) {
    "use strict";
    var TableMappings = class {
      /**
       * Method that is called by the mapper to create the instance of the document.
       * @return {Object}
       */
      newObjectInstance() {
        return {};
      }
      /**
       * Gets the name of the column based on the document property name.
       * @param {String} propName The name of the property.
       * @returns {String}
       */
      getColumnName(propName) {
        return propName;
      }
      /**
       * Gets the name of the document property based on the column name.
       * @param {String} columnName The name of the column.
       * @returns {String}
       */
      getPropertyName(columnName) {
        return columnName;
      }
    }, UnderscoreCqlToCamelCaseMappings = class extends TableMappings {
      /**
       * Creates a new instance of {@link UnderscoreCqlToCamelCaseMappings}
       */
      constructor() {
        super();
      }
      /**
       * Converts a property name in camel case to snake case.
       * @param {String} propName Name of the property to convert to snake case.
       * @return {String}
       */
      getColumnName(propName) {
        return propName.replace(/[a-z][A-Z]/g, (match, offset) => match.charAt(0) + "_" + match.charAt(1)).toLowerCase();
      }
      /**
       * Converts a column name in snake case to camel case.
       * @param {String} columnName The column name to convert to camel case.
       * @return {String}
       */
      getPropertyName(columnName) {
        return columnName.replace(/_[a-z]/g, (match, offset) => offset === 0 ? match : match.substr(1).toUpperCase());
      }
    }, DefaultTableMappings = class extends TableMappings {
      /**
       * Creates a new instance of {@link DefaultTableMappings}.
       */
      constructor() {
        super();
      }
      /**  @override */
      getColumnName(propName) {
        return super.getColumnName(propName);
      }
      /** @override */
      getPropertyName(columnName) {
        return super.getPropertyName(columnName);
      }
      /**
       * Creates a new object instance, using object initializer.
       */
      newObjectInstance() {
        return super.newObjectInstance();
      }
    };
    exports2.TableMappings = TableMappings;
    exports2.UnderscoreCqlToCamelCaseMappings = UnderscoreCqlToCamelCaseMappings;
    exports2.DefaultTableMappings = DefaultTableMappings;
  }
});

// node_modules/cassandra-driver/lib/mapping/model-mapping-info.js
var require_model_mapping_info = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/model-mapping-info.js"(exports2, module2) {
    "use strict";
    var tableMappingsModule = require_table_mappings(), TableMappings = tableMappingsModule.TableMappings, DefaultTableMappings = tableMappingsModule.DefaultTableMappings, ModelMappingInfo = class _ModelMappingInfo {
      /**
       * @param {String} keyspace
       * @param {Array<{name, isView}>} tables
       * @param {TableMappings} mappings
       * @param {Map<String,ModelColumnInfo>} columns
       */
      constructor(keyspace, tables, mappings, columns) {
        this.keyspace = keyspace, this.tables = tables, this._mappings = mappings, this._columns = columns, this._documentProperties = /* @__PURE__ */ new Map();
        for (let modelColumnInfo of columns.values())
          this._documentProperties.set(modelColumnInfo.propertyName, modelColumnInfo);
      }
      getColumnName(propName) {
        let modelColumnInfo = this._documentProperties.get(propName);
        return modelColumnInfo !== void 0 ? modelColumnInfo.columnName : this._mappings.getColumnName(propName);
      }
      getPropertyName(columnName) {
        let modelColumnInfo = this._columns.get(columnName);
        return modelColumnInfo !== void 0 ? modelColumnInfo.propertyName : this._mappings.getPropertyName(columnName);
      }
      getFromModelFn(propName) {
        let modelColumnInfo = this._documentProperties.get(propName);
        return modelColumnInfo !== void 0 ? modelColumnInfo.fromModel : null;
      }
      getToModelFn(columnName) {
        let modelColumnInfo = this._columns.get(columnName);
        return modelColumnInfo !== void 0 ? modelColumnInfo.toModel : null;
      }
      newInstance() {
        return this._mappings.newObjectInstance();
      }
      /**
       * Parses the user options into a map of model names and ModelMappingInfo.
       * @param {MappingOptions} options
       * @param {String} currentKeyspace
       * @returns {Map<String, ModelMappingInfo>}
       */
      static parse(options, currentKeyspace) {
        let result = /* @__PURE__ */ new Map();
        return !options || !options.models || Object.keys(options.models).forEach((modelName) => {
          let modelOptions = options.models[modelName];
          result.set(modelName, _ModelMappingInfo._create(modelName, currentKeyspace, modelOptions));
        }), result;
      }
      static _create(modelName, currentKeyspace, modelOptions) {
        if (!currentKeyspace && (!modelOptions || !modelOptions.keyspace))
          throw new Error(
            "You should specify the keyspace of the model in the MappingOptions when the Client is not using a keyspace"
          );
        if (!modelOptions)
          return _ModelMappingInfo.createDefault(modelName, currentKeyspace);
        let tables;
        if (modelOptions.tables && modelOptions.tables.length > 0 ? tables = modelOptions.tables.map((item) => {
          let table = { name: null, isView: !1 };
          if (typeof item == "string" ? table.name = item : item && (table.name = item.name, table.isView = !!item.isView), !table.name)
            throw new Error(`Table name not specified for model '${modelName}'`);
          return table;
        }) : tables = [{ name: modelName, isView: !1 }], modelOptions.mappings && !(modelOptions.mappings instanceof TableMappings))
          throw new Error("mappings should be an instance of TableMappings");
        let columns = /* @__PURE__ */ new Map();
        return modelOptions.columns !== null && typeof modelOptions.columns == "object" && Object.keys(modelOptions.columns).forEach((columnName) => {
          columns.set(columnName, ModelColumnInfo.parse(columnName, modelOptions.columns[columnName]));
        }), new _ModelMappingInfo(
          modelOptions.keyspace || currentKeyspace,
          tables,
          modelOptions.mappings || new DefaultTableMappings(),
          columns
        );
      }
      static createDefault(modelName, currentKeyspace) {
        return new _ModelMappingInfo(
          currentKeyspace,
          [{ name: modelName, isView: !1 }],
          new DefaultTableMappings(),
          /* @__PURE__ */ new Map()
        );
      }
    }, ModelColumnInfo = class _ModelColumnInfo {
      constructor(columnName, propertyName, toModel, fromModel) {
        if (this.columnName = columnName, this.propertyName = propertyName, toModel && typeof toModel != "function")
          throw new TypeError(`toModel type for property '${propertyName}' should be a function (obtained ${typeof toModel})`);
        if (fromModel && typeof fromModel != "function")
          throw new TypeError(`fromModel type for property '${propertyName}' should be a function (obtained ${typeof fromModel})`);
        this.toModel = toModel, this.fromModel = fromModel;
      }
      static parse(columnName, value) {
        return value ? typeof value == "string" ? new _ModelColumnInfo(columnName, value) : new _ModelColumnInfo(columnName, value.name || columnName, value.toModel, value.fromModel) : new _ModelColumnInfo(columnName, columnName);
      }
    };
    module2.exports = ModelMappingInfo;
  }
});

// node_modules/cassandra-driver/lib/mapping/mapper.js
var require_mapper = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/mapper.js"(exports2, module2) {
    "use strict";
    var ModelMapper = require_model_mapper(), MappingHandler = require_mapping_handler(), DocInfoAdapter = require_doc_info_adapter(), errors = require_errors(), Result = require_result(), ResultMapper = require_result_mapper(), ModelMappingInfo = require_model_mapping_info(), { ModelBatchItem } = require_model_batch_item(), Mapper = class {
      /**
       * Creates a new instance of Mapper.
       * @param {Client} client The Client instance to use to execute the queries and fetch the metadata.
       * @param {MappingOptions} [options] The [MappingOptions]{@link module:mapping~MappingOptions} containing the
       * information of the models and table mappings.
       */
      constructor(client, options) {
        if (!client)
          throw new Error("client must be defined");
        this.client = client, this._modelMappingInfos = ModelMappingInfo.parse(options, client.keyspace), this._modelMappers = /* @__PURE__ */ new Map();
      }
      /**
       * Gets a [ModelMapper]{@link module:mapping~ModelMapper} that is able to map documents of a certain model into
       * CQL rows.
       * @param {String} name The name to identify the model. Note that the name is case-sensitive.
       * @returns {ModelMapper} A [ModelMapper]{@link module:mapping~ModelMapper} instance.
       */
      forModel(name) {
        let modelMapper = this._modelMappers.get(name);
        if (modelMapper === void 0) {
          let mappingInfo = this._modelMappingInfos.get(name);
          if (mappingInfo === void 0) {
            if (!this.client.keyspace)
              throw new Error(`No mapping information found for model '${name}'. Mapper is unable to create default mappings without setting the keyspace`);
            mappingInfo = ModelMappingInfo.createDefault(name, this.client.keyspace), this.client.log("info", `Mapping information for model '${name}' not found, creating default mapping. Keyspace: ${mappingInfo.keyspace}; Table: ${mappingInfo.tables[0].name}.`);
          } else
            this.client.log("info", `Creating model mapper for '${name}' using mapping information. Keyspace: ${mappingInfo.keyspace}; Table${mappingInfo.tables.length > 1 ? "s" : ""}: ${mappingInfo.tables.map((t) => t.name)}.`);
          modelMapper = new ModelMapper(name, new MappingHandler(this.client, mappingInfo)), this._modelMappers.set(name, modelMapper);
        }
        return modelMapper;
      }
      /**
       * Executes a batch of queries represented in the items.
       * @param {Array<ModelBatchItem>} items
       * @param {Object|String} [executionOptions] An object containing the options to be used for the requests
       * execution or a string representing the name of the execution profile.
       * @param {String} [executionOptions.executionProfile] The name of the execution profile.
       * @param {Boolean} [executionOptions.isIdempotent] Defines whether the query can be applied multiple times without
       * changing the result beyond the initial application.
       * <p>
       *   The mapper uses the generated queries to determine the default value. When an UPDATE is generated with a
       *   counter column or appending/prepending to a list column, the execution is marked as not idempotent.
       * </p>
       * <p>
       *   Additionally, the mapper uses the safest approach for queries with lightweight transactions (Compare and
       *   Set) by considering them as non-idempotent. Lightweight transactions at client level with transparent retries can
       *   break linearizability. If that is not an issue for your application, you can manually set this field to true.
       * </p>
       * @param {Boolean} [executionOptions.logged=true] Determines whether the batch should be written to the batchlog.
       * @param {Number|Long} [executionOptions.timestamp] The default timestamp for the query in microseconds from the
       * unix epoch (00:00:00, January 1st, 1970).
       * @returns {Promise<Result>} A Promise that resolves to a [Result]{@link module:mapping~Result}.
       */
      batch(items, executionOptions) {
        if (!Array.isArray(items) || !(items.length > 0))
          return Promise.reject(
            new errors.ArgumentError("First parameter items should be an Array with 1 or more ModelBatchItem instances")
          );
        let queries = [], isIdempotent = !0, isCounter;
        return Promise.all(items.map((item) => item instanceof ModelBatchItem ? item.pushQueries(queries).then((options) => {
          isIdempotent = isIdempotent && options.isIdempotent, isCounter = options.isCounter;
        }) : Promise.reject(new Error(
          "Batch items must be instances of ModelBatchItem, use modelMapper.batching object to create each item"
        )))).then(() => this.client.batch(queries, DocInfoAdapter.adaptBatchOptions(executionOptions, isIdempotent, isCounter))).then((rs) => {
          let info = items[0].getMappingInfo();
          return new Result(rs, info, ResultMapper.getMutationAdapter(rs));
        });
      }
    };
    module2.exports = Mapper;
  }
});

// node_modules/cassandra-driver/lib/mapping/index.js
var require_mapping = __commonJS({
  "node_modules/cassandra-driver/lib/mapping/index.js"(exports2) {
    "use strict";
    exports2.Mapper = require_mapper();
    exports2.ModelMapper = require_model_mapper();
    exports2.ModelBatchMapper = require_model_batch_mapper();
    exports2.ModelBatchItem = require_model_batch_item().ModelBatchItem;
    exports2.Result = require_result();
    var tableMappingsModule = require_table_mappings();
    exports2.TableMappings = tableMappingsModule.TableMappings;
    exports2.DefaultTableMappings = tableMappingsModule.DefaultTableMappings;
    exports2.UnderscoreCqlToCamelCaseMappings = tableMappingsModule.UnderscoreCqlToCamelCaseMappings;
    exports2.q = require_q().q;
  }
});

// node_modules/cassandra-driver/lib/concurrent/index.js
var require_concurrent = __commonJS({
  "node_modules/cassandra-driver/lib/concurrent/index.js"(exports2) {
    "use strict";
    var { Stream } = require("stream"), utils = require_utils();
    function executeConcurrent(client, query, parameters, options) {
      if (!client)
        throw new TypeError("Client instance is not defined");
      if (typeof query == "string") {
        if (Array.isArray(parameters))
          return new ArrayBasedExecutor(client, query, parameters, options).execute();
        if (parameters instanceof Stream)
          return new StreamBasedExecutor(client, query, parameters, options).execute();
        throw new TypeError("parameters should be an Array or a Stream instance");
      }
      if (Array.isArray(query))
        return options = parameters, new ArrayBasedExecutor(client, null, query, options).execute();
      throw new TypeError("A string query or query and parameters array should be provided");
    }
    var ArrayBasedExecutor = class {
      /**
       * @param {Client} client
       * @param {String} query
       * @param {Array<Array>|Array<{query, params}>} parameters
       * @param {Object} [options] The execution options.
       * @private
       */
      constructor(client, query, parameters, options) {
        this._client = client, this._query = query, this._parameters = parameters, options = options || utils.emptyObject, this._raiseOnFirstError = options.raiseOnFirstError !== !1, this._concurrencyLevel = Math.min(options.concurrencyLevel || 100, this._parameters.length), this._queryOptions = { prepare: !0, executionProfile: options.executionProfile }, this._result = new ResultSetGroup(options), this._stop = !1;
      }
      execute() {
        let promises = new Array(this._concurrencyLevel);
        for (let i = 0; i < this._concurrencyLevel; i++)
          promises[i] = this._executeOneAtATime(i, 0);
        return Promise.all(promises).then(() => this._result);
      }
      _executeOneAtATime(initialIndex, iteration) {
        let index = initialIndex + this._concurrencyLevel * iteration;
        if (index >= this._parameters.length || this._stop)
          return Promise.resolve();
        let item = this._parameters[index], query, params;
        return this._query === null ? (query = item.query, params = item.params) : (query = this._query, params = item), this._client.execute(query, params, this._queryOptions).then((rs) => this._result.setResultItem(index, rs)).catch((err) => this._setError(index, err)).then(() => this._executeOneAtATime(initialIndex, iteration + 1));
      }
      _setError(index, err) {
        if (this._result.setError(index, err), this._raiseOnFirstError)
          throw this._stop = !0, err;
      }
    }, StreamBasedExecutor = class {
      /**
       * @param {Client} client
       * @param {String} query
       * @param {Stream} stream
       * @param {Object} [options] The execution options.
       * @private
       */
      constructor(client, query, stream, options) {
        this._client = client, this._query = query, this._stream = stream, options = options || utils.emptyObject, this._raiseOnFirstError = options.raiseOnFirstError !== !1, this._concurrencyLevel = options.concurrencyLevel || 100, this._queryOptions = { prepare: !0, executionProfile: options.executionProfile }, this._inFlight = 0, this._index = 0, this._result = new ResultSetGroup(options), this._resolveCallback = null, this._rejectCallback = null, this._readEnded = !1;
      }
      execute() {
        return new Promise((resolve, reject) => {
          this._resolveCallback = resolve, this._rejectCallback = reject, this._stream.on("data", (params) => this._executeOne(params)).on("error", (err) => this._setReadEnded(err)).on("end", () => this._setReadEnded());
        });
      }
      _executeOne(params) {
        if (!Array.isArray(params))
          return this._setReadEnded(new TypeError("Stream should be in objectMode and should emit Array instances"));
        if (this._readEnded)
          return;
        let index = this._index++;
        this._inFlight++, this._client.execute(this._query, params, this._queryOptions).then((rs) => {
          this._result.setResultItem(index, rs), this._inFlight--;
        }).catch((err) => {
          this._inFlight--, this._setError(index, err);
        }).then(() => {
          this._stream.isPaused() && this._stream.resume(), this._readEnded && this._inFlight === 0 && this._resolveCallback(this._result);
        }), this._inFlight >= this._concurrencyLevel && this._stream.pause();
      }
      /**
       * Marks the stream read process as ended.
       * @param {Error} [err] The stream read error.
       * @private
       */
      _setReadEnded(err) {
        this._readEnded || (this._readEnded = !0, err ? this._rejectCallback(err) : this._inFlight === 0 && this._resolveCallback(this._result));
      }
      _setError(index, err) {
        this._result.setError(index, err), this._raiseOnFirstError && (this._readEnded = !0, this._rejectCallback(err));
      }
    }, ResultSetGroup = class {
      /**
       * Creates a new instance of {@link ResultSetGroup}.
       * @ignore
       */
      constructor(options) {
        this._collectResults = options.collectResults, this._maxErrors = options.maxErrors || 100, this.totalExecuted = 0, this.errors = [], this._collectResults ? this.resultItems = [] : Object.defineProperty(this, "resultItems", { enumerable: !1, get: () => {
          throw new Error("Property resultItems can not be accessed when collectResults is set to false");
        } });
      }
      /** @ignore */
      setResultItem(index, rs) {
        this.totalExecuted++, this._collectResults && (this.resultItems[index] = rs);
      }
      /**
       * Internal method to set the error of an execution.
       * @ignore
       */
      setError(index, err) {
        this.totalExecuted++, this.errors.length < this._maxErrors && this.errors.push(err), this._collectResults && (this.resultItems[index] = err);
      }
    };
    exports2.executeConcurrent = executeConcurrent;
    exports2.ResultSetGroup = ResultSetGroup;
  }
});

// node_modules/cassandra-driver/lib/datastax/index.js
var require_datastax = __commonJS({
  "node_modules/cassandra-driver/lib/datastax/index.js"(exports2) {
    "use strict";
    exports2.graph = require_graph();
    exports2.search = require_search();
  }
});

// node_modules/cassandra-driver/index.js
var require_cassandra_driver = __commonJS({
  "node_modules/cassandra-driver/index.js"(exports2) {
    "use strict";
    var clientOptions = require_client_options();
    exports2.Client = require_client();
    exports2.ExecutionProfile = require_execution_profile().ExecutionProfile;
    exports2.ExecutionOptions = require_execution_options().ExecutionOptions;
    exports2.types = require_types();
    exports2.errors = require_errors();
    exports2.policies = require_policies();
    exports2.auth = require_auth();
    exports2.mapping = require_mapping();
    exports2.tracker = require_tracker();
    exports2.metrics = require_metrics();
    exports2.concurrent = require_concurrent();
    var token = require_token();
    exports2.token = {
      Token: token.Token,
      TokenRange: token.TokenRange
    };
    var Metadata = require_metadata();
    exports2.metadata = {
      Metadata
    };
    exports2.Encoder = require_encoder();
    exports2.geometry = require_geometry2();
    exports2.datastax = require_datastax();
    exports2.defaultOptions = function() {
      return clientOptions.defaultOptions();
    };
    exports2.version = require_package().version;
  }
});

// entries/vendor-cassandra.js
module.exports = require_cassandra_driver();
