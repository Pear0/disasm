#include <stdint.h>

#include <capstone/capstone.h>

uint8_t *insn_mnemonic(cs_insn *insn) {
    return &(insn->mnemonic[0]);
}

uint8_t *insn_op_str(cs_insn *insn) {
    return &(insn->op_str[0]);
}

size_t insn_size(cs_insn *insn) {
    return (size_t) insn->size;
}

size_t insn_struct_size() {
    return sizeof(cs_insn);
}