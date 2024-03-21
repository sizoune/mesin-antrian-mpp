import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {default as EscPosEncoder} from '@manhnd/esc-pos-encoder'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function calculateMinHeight(layanan) {
    const lineHeight = 18; // Adjust based on your font size and line spacing
    const numLines = Math.max(layanan.length, 1); // Ensure at least one line
    return numLines * lineHeight + 'px'; // Add appropriate units
}

export const getEncoder = () => new EscPosEncoder();

export async function pairDevice() {
    let device
    let deviceInEndpoint;
    let deviceOutEndpoint;
    try {
        console.log("Setup Start");
        const daftarDevice = await navigator.usb.getDevices()

        console.log(daftarDevice)
        if (daftarDevice && daftarDevice.length > 0) {
            device = daftarDevice[0];
        }   else {
             device = await navigator.usb.requestDevice({
                filters: []
            });
        }

        await device.open();

        console.log("Claim Interface");
        const devConf = await device.selectConfiguration(1);
        console.log(devConf)
        await device.claimInterface(device.configuration.interfaces[0].interfaceNumber);

        // Ambil endpoint
        device.configuration.interfaces[0].alternates[0].endpoints.forEach(ep => {
            switch (ep.direction) {
                case "in":
                    deviceInEndpoint = ep.endpointNumber;
                    break;
                case "out":
                    deviceOutEndpoint = ep.endpointNumber;
                    break;
            }
        });

        if (device.configuration.interfaces[0].claimed) {
            console.log("Device claimed");
            const testPrint = () => getEncoder().initialize()
                    .text("-".repeat(32))
                    .text("12345678901234567890123456789012")
                    .text("0        1         2         3  ")
                    .text("-".repeat(32))
                    .text(lrtext("Kiri", "Kanan"))
                    .align('center')
                    .line('Tengah')
                    .align('left')
                    .size('small')
                    .line('Ini ukuran Kecil')
                    .size('normal')
                    .line('Ini ukuran Normal')
                    .underline(true)
                    .line('Garis Bawah')
                    .underline(false)
                    .bold(true)
                    .line('Tebal')
                    .bold(false)
                    .italic(true)
                    .line('Miring')
                    .italic(false)
                    .cut()
                // .text(`Ini adalah tes cetak\n${(new Date()).getTime()}\n\n`)
            ;
            print({device: device, deviceEndpoint: deviceOutEndpoint, data: testPrint().encode()})
            return {device, deviceInEndpoint, deviceOutEndpoint};
        }

        console.log("Setup End");
    } catch (error) {
        throw new Error(error);
    }
}

export function print({data, device, deviceEndpoint}) {
    device.transferOut(deviceEndpoint, data);
}

export async function disconnect({device}) {
    if (device) {
        await device.releaseInterface(device.configuration.interfaces[0].interfaceNumber);
        await device.close();
    }
}


export function lrtext(t1, t2) {
    let t = t1;
    let width = 32 - t1.toString().length - t2.toString().length;
    for (let i = 0; i < width; i++) {
        t += " ";
    }
    t += t2;
    return t;
}
