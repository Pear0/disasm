cmake_minimum_required(VERSION 2.8)

project(disasm_proxy)

include_directories("../keystone/include")
include_directories("../capstone/include")
link_directories("../keystone/llvm/lib")
link_directories("../capstone")

add_executable(disasm_proxy main.c)

target_link_libraries(disasm_proxy keystone capstone)

target_link_options(disasm_proxy PRIVATE -sEXPORTED_FUNCTIONS=['_ks_open','_ks_asm','_ks_free','_ks_close','_ks_errno','_ks_strerror','_cs_open','_cs_disasm','_cs_free','_cs_close','_cs_errno','_cs_strerror','_insn_mnemonic','_insn_op_str','_insn_size','_insn_struct_size'])
target_link_options(disasm_proxy PRIVATE -sEXTRA_EXPORTED_RUNTIME_METHODS=['intArrayFromString','intArrayToString','getValue','setValue','stringToUTF8','UTF8ToString'])
target_link_options(disasm_proxy PRIVATE -sMODULARIZE -sASSERTIONS=1)
