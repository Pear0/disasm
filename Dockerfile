FROM ubuntu:20.04 AS build

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq git python python3 cmake vim && \
    mkdir /tools

RUN cd /tools && git clone https://github.com/emscripten-core/emsdk.git && cd /tools/emsdk && ./emsdk install 2.0.16

RUN /tools/emsdk/emsdk activate 2.0.16

ADD keystone /build/keystone

# Build keystone
RUN /bin/bash -c ". /tools/emsdk/emsdk_env.sh && \
    cd /build/keystone/llvm && \
    emcmake cmake -DCMAKE_BUILD_TYPE=Release . && \
    emmake make -j 8 && \
    ls -lh lib/libkeystone.a"

ADD capstone /build/capstone

# Build capstone
RUN /bin/bash -c ". /tools/emsdk/emsdk_env.sh && \
    cd /build/capstone && \
    emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCAPSTONE_BUILD_TESTS=OFF . && \
    emmake make -j 8 && \
    ls -lh libcapstone.a"

ADD disasm_proxy /build/disasm_proxy

# Build proxy
RUN /bin/bash -c ". /tools/emsdk/emsdk_env.sh && \
    cd /build/disasm_proxy && \
    emcmake cmake -DCMAKE_BUILD_TYPE=Release . && \
    emmake make -j 8"


ENTRYPOINT ["/bin/bash"]