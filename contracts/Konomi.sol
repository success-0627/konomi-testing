// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Konomi {
    uint16 public constant DEF_VAL = 1111;

    constructor() {}

    /*
		- Param1: greater than 0 but less than 1, only needs first 4 decimals
		- Param2: greater than 0 but less than 1, only needs first 4 decimals
		- Param3: greater than 1 but less than 2, only needs first 4 decimals
		- Param4: none zero address
		- Param5: greater than 0 but less than 1, only needs first 4 decimals
		- Param6: greater than 1 but less than 2, only needs first 4 decimals
     */

    modifier validAddress(address addr) {
        require(addr != address(0));
        _;
    }

    function getValue(
        uint256 input_,
        uint256 min_,
        uint256 max_
    ) public pure returns (uint16) {
        if (input_ > min_ && input_ < max_) {
            return uint16((input_ % 1E18) / 1E14);
        }
        return DEF_VAL;
    }

    // Total 160 bytes
    function orignalMethod(
        uint256 param1_, // 32 bytes
        uint256 param2_, // 32 bytes
        uint256 param3_, // 32 bytes
        address param4_, // 20 bytes
        uint256 param5_, // 32 bytes
        uint256 param6_ // 32 bytes
    ) public pure validAddress(param4_) returns (uint16[5] memory retVal_) {
        retVal_[0] = getValue(param1_, 0 * 1E18, 1 * 1E18);
        retVal_[1] = getValue(param2_, 0 * 1E18, 1 * 1E18);
        retVal_[2] = getValue(param3_, 1 * 1E18, 2 * 1E18);
        retVal_[3] = getValue(param5_, 0 * 1E18, 1 * 1E18);
        retVal_[4] = getValue(param6_, 1 * 1E18, 2 * 1E18);
    }

    // Total 111 bytes maximumly
    function refinedMethod(
        address addr_, // 20 bytes
        uint8 argFlag_, // 1 byte
        uint16[] memory args_ // 5 * 16 = 90 bytes maximumly, 2**16 = 65536 > 9999
    ) public pure validAddress(addr_) returns (uint16[5] memory retVal_) {
        unchecked {
            uint8 argIdx = 0;
            for (uint8 idx = 0; idx < 5; idx++) {
                uint8 checker = uint8(16) >> idx; //0b10000
                uint8 bit = argFlag_ & checker;
                if (bit == 0) {
                    retVal_[idx] = DEF_VAL;
                } else {
                    retVal_[idx] = args_[argIdx];
                    argIdx++;
                }
            }
        }
    }
}
