#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

if [ -d "dist" ]; then
    rm -r dist
    mkdir dist
fi

cp -r app/* dist/

docker build -t dap .
docker run --rm -v "$(pwd)/dist:/out" -it dap -c 'cp /build/disasm_proxy/disasm_proxy.* /out'
