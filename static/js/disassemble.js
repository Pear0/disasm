
function get_current_capstone() {
    get_current_capstone.cache = get_current_capstone.cache || {};

    if (typeof Proxy === 'undefined' || Proxy._malloc === undefined)
        return {ok: false, msg: 'no Proxy'};

    const key = `${global_settings['ARCH']}-${global_settings['MODE']}-${global_settings['ENDIAN']}`;

    if (get_current_capstone.cache[key] === undefined) {
        get_current_capstone.cache[key] = newCapstone(Proxy, global_settings['ARCH'], global_settings['MODE'], global_settings['ENDIAN']);
    }

    return get_current_capstone.cache[key];
}



function send_machine_update(){
    let machine_code_parsed;
    //Remove all non hex things
    let machine_code = machine_editor.getValue();
    //because I throw exceptions when invalid hex, I need to catch em and return 
    try{
        if(document.getElementById('VIEW').value === "1")
            machine_code_parsed = parse_prettified(machine_code)
        else machine_code_parsed = parse_raw(machine_code)
    }catch (err){
        return
    }

    if (typeof Proxy === 'undefined')
        return;

    let capstone = get_current_capstone();
    if (!capstone.ok) {
        console.log('capstone:', capstone);
        return;
    }

    let startAddress = +global_settings['OFFSET'];

    let asmResult = '';

    for (let line of machine_code_parsed) {
        if (line.length === 0) {
            asmResult += '\n';
            continue;
        }

        let result = doDisassemble(Proxy, capstone.pCs, line, startAddress);

        if (result.ok) {

            for (let insn of result.instructions) {
                asmResult += `${insn.mnemonic} ${insn.operands}\n`;
                startAddress += insn.size;
            }

        } else {
            asmResult += result.msg + '\n';
            break;
        }
    }

    update_disassembled_code(asmResult);
}

function update_disassembled_code(code){
    mutex_lock = true;
    asm_editor.setValue(code,1);
    //Update simultaneously
    let cur_line = machine_editor.selection.getCursor().row;
    asm_editor.selection.moveTo(cur_line, 0);
    mutex_lock = false;
    set_success_message("Code Disassembled")
}

function parse_raw(code){
    //TODO fix this soon 
    let raw_parsed = JSON.parse('"' + code.replace(/\\x/g, "\\u00") + '"'); // A super shitty hack to parse raw strings
    let machine_parsed = []
    //conver to array of ints
    for(chr of raw_parsed)machine_parsed.push(chr.charCodeAt(0))

    let output_for_machine_bytes = []//Because of the structure of machine_code_bytes
    output_for_machine_bytes.push(machine_parsed) 
    return output_for_machine_bytes
}

function parse_prettified(code){
    let code_splitted = code.split("\n")
    let machine_parsed = []
    
    code_splitted.forEach(function(code_line) {
        let code_line_p1 = code_line.replace(/\s/g, "");
        if(code_line_p1.length&1 != 0)throw "Invalid hex"
        //convert to int array from hex
        let parsed_hex = []
        for(let i = 0; i < code_line_p1.length; i+=2){
           parsed_hex.push(parseInt(code_line_p1.substr(i, 2), 16))
        }
        machine_parsed.push(parsed_hex);
    })

    return machine_parsed
}
