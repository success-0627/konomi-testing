const Konomi = artifacts.require("Konomi");

contract('Konomi', (accounts) => {
    let scInst;
    let defVal;
    const params = [
        web3.utils.toWei('0.12345'),
        web3.utils.toWei('1.23456'),
        web3.utils.toWei('1.34567'),
        web3.utils.toWei('0.45678'),
        web3.utils.toWei('5.56789'),
    ];

    before(async () => {
        scInst = await Konomi.deployed();
        defVal = await scInst.DEF_VAL();
        defVal = defVal.toString();
    });

    it('test orignalMethod', async () => {
        const [p0, p1, p2, p3, p4] = await scInst.orignalMethod(
            params[0],
            params[1],
            params[2],
            web3.utils.toChecksumAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
            params[3],
            params[4],
        );
        assert.equal(p0.toString(), '1234', `0: ${p0} != 1234`);
        assert.equal(p1.toString(), defVal, `0: ${p1.toString()} != ${defVal}`);
        assert.equal(p2.toString(), '3456', `0: ${p2.toString()} != 3456`);
        assert.equal(p3.toString(), '4567', `0: ${p3.toString()} != 4567`);
        assert.equal(p4.toString(), defVal, `0: ${p4.toString()} != ${defVal}`);
    });

    it('test refinedMethod', async () => {
        const input = [
            await scInst.getValue(params[0], '0', web3.utils.toWei('1')),
            await scInst.getValue(params[1], '0', web3.utils.toWei('1')),
            await scInst.getValue(params[2], web3.utils.toWei('1'), web3.utils.toWei('2')),
            await scInst.getValue(params[3], '0', web3.utils.toWei('1')),
            await scInst.getValue(params[4], web3.utils.toWei('1'), web3.utils.toWei('2')),
        ];

        const [p0, p1, p2, p3, p4] = await scInst.refinedMethod(
            web3.utils.toChecksumAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
            input.reduce(
                (ass, val, idx) => {
                    if (val.toString() !== defVal) {
                        const checker = 16 >> idx;
                        ass += checker;
                    }
                    return ass;
                },
                0
            ).toString(),
            input.filter(it => it.toString() !== defVal),
        );
        assert.equal(p0.toString(), '1234', `0: ${p0.toString()} != 1234`);
        assert.equal(p1.toString(), defVal, `0: ${p1.toString()} != ${defVal}`);
        assert.equal(p2.toString(), '3456', `0: ${p2.toString()} != 3456`);
        assert.equal(p3.toString(), '4567', `0: ${p3.toString()} != 4567`);
        assert.equal(p4.toString(), defVal, `0: ${p4.toString()} != ${defVal}`);
    });
});
