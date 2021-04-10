
const ProxyPromise = Module();

function ksError(Proxy, pKs, errno) {
    const err = typeof errno === 'number' ? errno : Proxy._ks_errno(pKs);
    const pMsg = Proxy._ks_strerror(err);
    const msg = Proxy.UTF8ToString(pMsg);
    return {ok: false, err, msg};
}

function csError(Proxy, pCs, errno) {
    const err = typeof errno === 'number' ? errno : Proxy._cs_errno(pCs);
    const pMsg = Proxy._cs_strerror(err);
    const msg = Proxy.UTF8ToString(pMsg);
    return {ok: false, err, msg};
}

function doAssemble(Proxy, pKs, code, startAddress = 0) {
    const pCodeLen = code.length * 4 + 1;
    let pCode = Proxy._malloc(pCodeLen+1);
    Proxy.stringToUTF8(code, pCode, pCodeLen);

    let ppEncode = Proxy._malloc(4);
    let pSize = Proxy._malloc(4);
    let pCount = Proxy._malloc(4);

    // 0, 0 == uint64_t
    let err = Proxy._ks_asm(pKs, pCode, startAddress, 0, ppEncode, pSize, pCount);
    if (err !== KS_ERR_OK) {
        Proxy._free(pCount);
        Proxy._free(pSize);
        Proxy._free(ppEncode);

        Proxy._free(pCode);

        return ksError(Proxy, pKs);
    }

    let pEncode = Proxy.getValue(ppEncode, '*');
    let size = Proxy.getValue(pSize, 'i32');
    let count = Proxy.getValue(pCount, 'i32');

    // console.log(`pEncode = ${pEncode}, size = ${size}, count = ${count}`);

    const result = Proxy.HEAPU8.slice(pEncode, pEncode+size);

    Proxy._ks_free(pEncode);

    Proxy._free(pCount);
    Proxy._free(pSize);
    Proxy._free(ppEncode);

    Proxy._free(pCode);

    return {ok: true, result};
}

function doDisassemble(Proxy, pCs, buf, startAddress = 0) {
    let pBuf = Proxy._malloc(buf.length);
    Proxy.HEAPU8.set(buf, pBuf);

    let ppInsn = Proxy._malloc(4);

    // 0, 0 == uint64_t
    let count = Proxy._cs_disasm(pCs, pBuf, buf.length, /* two num address -> */ startAddress, 0, 0, ppInsn);

    let pInsn = Proxy.getValue(ppInsn, '*');

    let insn_size = Proxy._insn_struct_size();

    let instructions = [];

    for (let i = 0; i < count; i++) {
        let pMnemonic = Proxy._insn_mnemonic(pInsn + i * insn_size);
        let pOpStr = Proxy._insn_op_str(pInsn + i * insn_size);
        let size = Proxy._insn_size(pInsn + i * insn_size);

        const mnemonic = Proxy.UTF8ToString(pMnemonic);
        const operands = Proxy.UTF8ToString(pOpStr);

        instructions.push({mnemonic, operands, size});
    }

    Proxy._cs_free(pInsn);

    Proxy._free(ppInsn);
    Proxy._free(pBuf);

    return {ok: true, instructions};
}

function newKeystone(Proxy, arch, mode, endian) {
    const archInfo = keystone_modes[arch];
    if (archInfo === undefined) {
        return {ok: false, msg: 'invalid arch'};
    }

    const modeInfo = archInfo.MODES[mode];
    if (modeInfo === undefined) {
        return {ok: false, msg: 'invalid mode'};
    }

    const endianInfo = modeInfo.ENDIAN[endian];
    if (endianInfo === undefined) {
        return {ok: false, msg: 'invalid endian'};
    }

    let ppKs = Proxy._malloc(4);

    let err = Proxy._ks_open(archInfo.KS_VAL, modeInfo.KS_VAL | endianInfo.KS_VAL, ppKs);
    if (err !== KS_ERR_OK) {
        return ksError(Proxy, undefined, err);
    }

    let pKs = Proxy.getValue(ppKs, '*');

    Proxy._free(ppKs);

    return {ok: true, pKs};
}

function newCapstone(Proxy, arch, mode, endian) {
    const archInfo = keystone_modes[arch];
    if (archInfo === undefined) {
        return {ok: false, msg: 'invalid arch'};
    }

    const modeInfo = archInfo.MODES[mode];
    if (modeInfo === undefined) {
        return {ok: false, msg: 'invalid mode'};
    }

    const endianInfo = modeInfo.ENDIAN[endian];
    if (endianInfo === undefined) {
        return {ok: false, msg: 'invalid endian'};
    }

    let ppCs = Proxy._malloc(4);

    let err = Proxy._cs_open(archInfo.CS_VAL, modeInfo.CS_VAL | endianInfo.CS_VAL, ppCs);
    if (err !== KS_ERR_OK) {
        return csError(Proxy, undefined, err);
    }

    let pCs = Proxy.getValue(ppCs, '*');

    Proxy._free(ppCs);

    return {ok: true, pCs};
}

var boundWindow = this;
ProxyPromise.then(Proxy => {
    boundWindow.Proxy = Proxy;
});

