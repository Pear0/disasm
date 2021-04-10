function byteToString(b) {
    let enc = b.toString(16);
    while (enc.length < 2) {
        enc = '0' + enc;
    }
    return enc.toUpperCase();
}

function realMap(arr, func) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        res.push(func(arr[i]));
    }
    return res;
}

function get_current_keystone() {
    get_current_keystone.cache = get_current_keystone.cache || {};

    if (typeof Proxy === 'undefined' || Proxy._malloc === undefined)
        return {ok: false, msg: 'no Proxy'};

    const key = `${global_settings['ARCH']}-${global_settings['MODE']}-${global_settings['ENDIAN']}`;

    if (get_current_keystone.cache[key] === undefined) {
        get_current_keystone.cache[key] = newKeystone(Proxy, global_settings['ARCH'], global_settings['MODE'], global_settings['ENDIAN']);
    }

    return get_current_keystone.cache[key];
}

function emitAssembledLine(arr) {
    if (global_settings['VIEW'] == '1') {
        return realMap(arr, byteToString).join(' ');
    } else {
        return realMap(arr, (x) => '\\x' + byteToString(x)).join('');
    }
}

function assembledLineSeparator() {
    if (global_settings['VIEW'] == '1') {
        return '\n';
    } else {
        return '';
    }
}

function send_asm_update(){
    let asm_code = asm_editor.getValue();

    if (typeof Proxy === 'undefined')
        return;

    let keystone = get_current_keystone();
    if (!keystone.ok) {
        console.log('keystone:', keystone);
        return;
    }

    let lines = asm_code.split('\n');
    let startAddress = +global_settings['OFFSET'];

    let asmResult = '';

    for (let line of lines) {
        let result = doAssemble(Proxy, keystone.pKs, line, startAddress);

        if (result.ok) {
            let hexed_line = emitAssembledLine(result.result);

            asmResult += hexed_line + assembledLineSeparator();

            startAddress += result.result.length;
        } else {
            console.log(result);
            asmResult += result.msg + assembledLineSeparator();
            break;
        }
    }

    update_assembled_code(asmResult);

}

function update_assembled_code(code){
    global_settings.machine_code = code;

    mutex_lock = true;
    machine_editor.setOption("wrap", true); //wrap lines for raw string
    machine_editor.setValue(code, 1);
    mutex_lock = false;

    set_success_message("Code Assembled")
}
