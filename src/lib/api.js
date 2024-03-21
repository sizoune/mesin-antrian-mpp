const baseUrl = "https://socket.antrian-mpp.tabalongkab.go.id"
// const baseUrl = "http://localhost:11081"

function getKodeMesin() {
    return localStorage.getItem('CONFIG_KODE_MESIN');
}

function putKodeMesin(kode) {
    return localStorage.setItem('CONFIG_KODE_MESIN', kode);
}

async function getDaftarInstansi({kode}) {
    // const response = await fetch('./dummy.json');
    const response = await fetch(`${baseUrl}/kiosk/beranda`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kode,
        }),
    });

    const responseJson = await response.json();
    const {success, message} = responseJson;

    if (!success) {
        throw new Error(message);
    }

    const {data: {instansi}} = responseJson;


    return instansi;
}

async function cekKodeMesin({kode}) {
    const response = await fetch(`${baseUrl}/kiosk/cek-mesin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kode,
        }),
    });

    const responseJson = await response.json();
    const {success, message} = responseJson;

    if (!success) {
        throw new Error(message);
    }

    const {data: {kiosk}} = responseJson;

    return kiosk;
}

async function ambilAntrian({kode, layananId}) {
    const response = await fetch(`${baseUrl}/kiosk/antrian/ambil`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kode,
            layanan: layananId
        }),
    });

    const responseJson = await response.json();
    const {success, message} = responseJson;

    if (!success) {
        throw new Error(message);
    }

    const {data: {antrian}} = responseJson;

    return antrian;
}

export {
    getKodeMesin,
    putKodeMesin,
    getDaftarInstansi,
    cekKodeMesin,
    ambilAntrian
};
