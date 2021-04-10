// architectures
const CS_ARCH_ARM = 0
const CS_ARCH_ARM64 = 1
const CS_ARCH_MIPS = 2
const CS_ARCH_X86 = 3
const CS_ARCH_PPC = 4
const CS_ARCH_SPARC = 5
const CS_ARCH_SYSZ = 6
const CS_ARCH_XCORE = 7
const CS_ARCH_M68K = 8
const CS_ARCH_TMS320C64X = 9
const CS_ARCH_M680X = 10
const CS_ARCH_EVM = 11
const CS_ARCH_MOS65XX = 12
const CS_ARCH_MAX = 13
const CS_ARCH_ALL = 0xFFFF

// disasm mode
const CS_MODE_LITTLE_ENDIAN = 0      // little-endian mode (default mode)
const CS_MODE_ARM = 0                // ARM mode
const CS_MODE_16 = (1 << 1)          // 16-bit mode (for X86)
    const CS_MODE_32 = (1 << 2)          // 32-bit mode (for X86)
    const CS_MODE_64 = (1 << 3)          // 64-bit mode (for X86, PPC)
    const CS_MODE_THUMB = (1 << 4)       // ARM's Thumb mode, including Thumb-2
const CS_MODE_MCLASS = (1 << 5)      // ARM's Cortex-M series
const CS_MODE_V8 = (1 << 6)          // ARMv8 A32 encodings for ARM
    const CS_MODE_MICRO = (1 << 4)       // MicroMips mode (MIPS architecture)
const CS_MODE_MIPS3 = (1 << 5)       // Mips III ISA
const CS_MODE_MIPS32R6 = (1 << 6)    // Mips32r6 ISA
const CS_MODE_MIPS2 = (1 << 7)       // Mips II ISA
const CS_MODE_V9 = (1 << 4)          // Sparc V9 mode (for Sparc)
    const CS_MODE_QPX = (1 << 4)         // Quad Processing eXtensions mode (PPC)
const CS_MODE_M68K_000 = (1 << 1)    // M68K 68000 mode
const CS_MODE_M68K_010 = (1 << 2)    // M68K 68010 mode
const CS_MODE_M68K_020 = (1 << 3)    // M68K 68020 mode
const CS_MODE_M68K_030 = (1 << 4)    // M68K 68030 mode
const CS_MODE_M68K_040 = (1 << 5)    // M68K 68040 mode
const CS_MODE_M68K_060 = (1 << 6)    // M68K 68060 mode
const CS_MODE_BIG_ENDIAN = (1 << 31) // big-endian mode
const CS_MODE_MIPS32 = CS_MODE_32    // Mips32 ISA
const CS_MODE_MIPS64 = CS_MODE_64    // Mips64 ISA
const CS_MODE_M680X_6301 = (1 << 1)  // M680X HD6301/3 mode
const CS_MODE_M680X_6309 = (1 << 2)  // M680X HD6309 mode
const CS_MODE_M680X_6800 = (1 << 3)  // M680X M6800/2 mode
const CS_MODE_M680X_6801 = (1 << 4)  // M680X M6801/3 mode
const CS_MODE_M680X_6805 = (1 << 5)  // M680X M6805 mode
const CS_MODE_M680X_6808 = (1 << 6)  // M680X M68HC08 mode
const CS_MODE_M680X_6809 = (1 << 7)  // M680X M6809 mode
const CS_MODE_M680X_6811 = (1 << 8)  // M680X M68HC11 mode
const CS_MODE_M680X_CPU12 = (1 << 9)  // M680X CPU12 mode
const CS_MODE_M680X_HCS08 = (1 << 10)  // M680X HCS08 mode

// Capstone option type
const CS_OPT_SYNTAX = 1    // Intel X86 asm syntax (const CS_ARCH_X86 arch)
const CS_OPT_DETAIL = 2    // Break down instruction structure into details
const CS_OPT_MODE = 3      // Change engine's mode at run-time
const CS_OPT_MEM = 4       // Change engine's mode at run-time
const CS_OPT_SKIPDATA = 5  // Skip data when disassembling
const CS_OPT_SKIPDATA_SETUP = 6      // Setup user-defined function for SKIPDATA option
const CS_OPT_MNEMONIC = 7  // Customize instruction mnemonic
const CS_OPT_UNSIGNED = 8  // Print immediate in unsigned form

// Capstone option value
const CS_OPT_OFF = 0             // Turn OFF an option - default option of const CS_OPT_DETAIL
const CS_OPT_ON = 3              // Turn ON an option (const CS_OPT_DETAIL)

// Common instruction operand types - to be consistent across all architectures.
    const CS_OP_INVALID = 0
const CS_OP_REG = 1
const CS_OP_IMM = 2
const CS_OP_MEM = 3
const CS_OP_FP  = 4

// Common instruction groups - to be consistent across all architectures.
    const CS_GRP_INVALID = 0  // uninitialized/invalid group.
    const CS_GRP_JUMP    = 1  // all jump instructions (conditional+direct+indirect jumps)
const CS_GRP_CALL    = 2  // all call instructions
const CS_GRP_RET     = 3  // all return instructions
const CS_GRP_INT     = 4  // all interrupt instructions (int+syscall)
const CS_GRP_IRET    = 5  // all interrupt return instructions
const CS_GRP_PRIVILEGE = 6  // all privileged instructions

// Access types for instruction operands.
    const CS_AC_INVALID  = 0        // Invalid/unitialized access type.
    const CS_AC_READ     = (1 << 0) // Operand that is read from.
    const CS_AC_WRITE    = (1 << 1) // Operand that is written to.

    // Capstone syntax value
const CS_OPT_SYNTAX_DEFAULT = 0    // Default assembly syntax of all platforms (const CS_OPT_SYNTAX)
const CS_OPT_SYNTAX_INTEL = 1    // Intel X86 asm syntax - default syntax on X86 (const CS_OPT_SYNTAX, const CS_ARCH_X86)
const CS_OPT_SYNTAX_ATT = 2      // ATT asm syntax (const CS_OPT_SYNTAX, const CS_ARCH_X86)
const CS_OPT_SYNTAX_NOREGNAME = 3   // Asm syntax prints register name with only number - (const CS_OPT_SYNTAX, const CS_ARCH_PPC, const CS_ARCH_ARM)
const CS_OPT_SYNTAX_MASM = 4      // MASM syntax (const CS_OPT_SYNTAX, const CS_ARCH_X86)

// Capstone error type
const CS_ERR_OK = 0      // No error: everything was fine
const CS_ERR_MEM = 1     // Out-Of-Memory error: cs_open(), cs_disasm()
const CS_ERR_ARCH = 2    // Unsupported architecture: cs_open()
const CS_ERR_HANDLE = 3  // Invalid handle: cs_op_count(), cs_op_index()
const CS_ERR_CSH = 4     // Invalid csh argument: cs_close(), cs_errno(), cs_option()
const CS_ERR_MODE = 5    // Invalid/unsupported mode: cs_open()
const CS_ERR_OPTION = 6  // Invalid/unsupported option: cs_option()
const CS_ERR_DETAIL = 7  // Invalid/unsupported option: cs_option()
const CS_ERR_MEMSETUP = 8
const CS_ERR_VERSION = 9 // Unsupported version (bindings)
const CS_ERR_DIET = 10   // Information irrelevant in diet engine
const CS_ERR_SKIPDATA = 11 // Access irrelevant data for "data" instruction in SKIPDATA mode
const CS_ERR_X86_ATT = 12 // X86 AT&T syntax is unsupported (opt-out at compile time)
const CS_ERR_X86_INTEL = 13 // X86 Intel syntax is unsupported (opt-out at compile time)
const CS_ERR_X86_MASM = 14 // X86 Intel syntax is unsupported (opt-out at compile time)