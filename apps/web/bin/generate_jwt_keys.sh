#!/bin/bash

SOURCE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

PASSPHRASE=test

NUMBITS=2048

displayHelp() {

    printf "Usage: ./bin/generate_jwt_keys.sh [options] [passphrase]\n\n"

    echo "OPTIONS:"
    echo "   -h, --help                show this help message and then exit"
    echo ""
    echo "   -b=2048, --numbits=2048   change the numbits value (default: 2048)"

}

parseOptions() {

    local args=("${@// /}")

    for arg in "${args[@]}"; do

        case $arg in

        -h | --help)
            displayHelp
            exit
            ;;

        -b=* | --numbits=*) NUMBITS=$(echo "${arg}" | sed -e 's/-b=//' -e "s/--numbits=//") ;;

        -*)
            printf "Invalid option %s\n\n" "${arg}" >&2
            displayHelp
            exit
            ;;

        *) PASSPHRASE=$arg ;;

        esac

    done

}

generate() {

    cd "${SOURCE_DIR}"

    ENV_PREFIX=$1

    openssl genrsa -out rsa_priv.pem -passout pass:"${PASSPHRASE}" "${NUMBITS}" &>/dev/null

    openssl rsa -pubout -in rsa_priv.pem -out rsa_pub.pem &>/dev/null

    if [[ "${OSTYPE}" == "darwin"* ]]; then
        PRIVATE_KEY=$(base64 <rsa_priv.pem)
        PUBLIC_KEY=$(base64 <rsa_pub.pem)
    else
        PRIVATE_KEY=$(base64 -w 0 <rsa_priv.pem)
        PUBLIC_KEY=$(base64 -w 0 <rsa_pub.pem)
    fi

    rm -f rsa_priv.pem
    rm -f rsa_pub.pem

    if ! test -f "../.env.local"; then
        cp ../.env.example ../.env.local
    fi

    if [[ "${OSTYPE}" == "darwin"* ]]; then
        sed -i '' "s/^${ENV_PREFIX}_PRIVATE_KEY=.*/${ENV_PREFIX}_PRIVATE_KEY=${PRIVATE_KEY}/" ../.env.local
        sed -i '' "s/^${ENV_PREFIX}_PUBLIC_KEY=.*/${ENV_PREFIX}_PUBLIC_KEY=${PUBLIC_KEY}/" ../.env.local
    else
        sed -i "s/^${ENV_PREFIX}_PRIVATE_KEY=.*/${ENV_PREFIX}_PRIVATE_KEY=${PRIVATE_KEY}/" ../.env.local
        sed -i "s/^${ENV_PREFIX}_PUBLIC_KEY=.*/${ENV_PREFIX}_PUBLIC_KEY=${PUBLIC_KEY}/" ../.env.local
    fi

}

parseOptions "$@"

generate "JWT_ACCESS_TOKEN"
generate "JWT_REFRESH_TOKEN"
