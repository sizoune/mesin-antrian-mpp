const EscPosEncoder = require('./esc-pos-encoder');

class AKThermalPrint {
    constructor() {
        this._setup();
    }

    makeEncoder() {
        return new EscPosEncoder();
    }

    async _setup() {
        // Setup your USB connection here
        // Replace Vue.observable with React state
        this.state = {
            paired: false,
            connected: false,
            opened: false,
        };

        this.device = null;
        this.deviceOutEndpoint = null;
        this.deviceInEndpoint = null;

        // Setup device if already connected
        let pairedDevice = await navigator.usb.getDevices();
        if (pairedDevice && pairedDevice.length > 0) {
            this.device = pairedDevice[0];
            await this.setup();
        }
    }

    deviceConnected() {
        console.log("usb.onconnect");
        this.state.paired = !!(this.device && this.device.opened);
    }

    deviceDisconnected() {
        console.log("usb.disconnect");
        this.state.paired = false;
    }

    getDevice() {
        if (!this.device) {
            // this.root.$emit("thermal:no_device");
            return null;
        }
        return this.device;
    }

    async pair() {
        let device;
        try {
            device = await navigator.usb.requestDevice({
                filters: []
            });
        } catch (e) {
            this.state({paired: false});
            return e;
        }

        this.device = device;
        await this.setup();
        return true;
    }

    async disconnect() {
        if (this.device) {
            await this.device.releaseInterface(this.device.configuration.interfaces[0].interfaceNumber);
            await this.device.close();
            this.state({paired: false});
        }
    }

    toggle() {
        if (this.state.paired) {
            this.disconnect();
        } else {
            this.pair();
        }
    }

    async setup() {
        console.log("Setup Start");
        await this.device.open();
        this.state.opened = this.device.opened;

        console.log("Claim Interface");
        await this.device.selectConfiguration(1);
        await this.device.claimInterface(this.device.configuration.interfaces[0].interfaceNumber);

        //  Ambil endpoint
        this.device.configuration.interfaces[0].alternates[0].endpoints.forEach(ep => {
            switch (ep.direction) {
                case "in":
                    this.deviceInEndpoint = ep.endpointNumber;
                    break;
                case "out":
                    this.deviceOutEndpoint = ep.endpointNumber;
                    break;
            }
        });

        navigator.usb.onconnect = this.deviceConnected.bind(this);
        navigator.usb.ondisconnect = this.deviceDisconnected.bind(this);

        if (this.device.configuration.interfaces[0].claimed) {
            console.log("Device claimed");
            this.state.paired = true;
        }
        console.log("Setup End");
    }

    print(data) {
        if (!this.device) {
            console.error(`Tidak ada perangkat`);
            return;
        }
        this.device.transferOut(this.deviceOutEndpoint, data);
    }



}

export default AKThermalPrint;
