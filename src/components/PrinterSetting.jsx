'use client'

import {Card, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {TbPrinter, TbPrinterOff} from "react-icons/tb";
import {disconnect, pairDevice} from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast";

export default function PrinterSetting({device, onSuksesSet}) {
    const [isConnected, setIsConnected] = useState(false)
    const {toast} = useToast()
    // async function getPairedDevice() {
    //     const pairedDevice = await navigator.usb.getDevices();
    //     if (pairedDevice && pairedDevice.length > 0) {
    //         const test = await pairDevice();
    //         console.log(test)
    //         setIsConnected(test !== null);
    //     }
    //     setIsConnected(false);
    // }
    //
    // useEffect(() => {
    //     getPairedDevice();
    // }, []);

    console.log(`thermal data ${device}`)

    const connectPrinterHandler = async () => {
        if (!isConnected){
            try {
                const test = await pairDevice();
                console.log(test)
                setIsConnected(test !== null);
                if (test !== null) {
                    toast({
                        title: "Sukses",
                        description: "Berhasil terhubung dengan printer !"
                    })
                }
                onSuksesSet(test);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Oopss, Telah Terjadi Kesalahan Saat mencoba Menghubungkan Printer!",
                    description: error.message,
                })
            }
        } else {
            try {
                const test = await disconnect({device});
                console.log(test)
                setIsConnected(false);
                toast({
                    title: "Sukses",
                    description: "Berhasil memutuskan koneksi dengan printer !"
                })
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Oopss, Telah Terjadi Kesalahan Saat mencoba memutus Printer!",
                    description: error.message,
                })
            }
        }

    }

    return (
        <div role="button" className="absolute top-4 right-20" onClick={connectPrinterHandler}>
            <Card>
                {isConnected && <TbPrinter className="w-10 h-10 p-2"/>}
                {!isConnected && <TbPrinterOff className="w-10 h-10 p-2"/>}
            </Card>
        </div>

    );
}
