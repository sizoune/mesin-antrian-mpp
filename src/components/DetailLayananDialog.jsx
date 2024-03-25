'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import parse from 'html-react-parser';
import {useMutation} from "@tanstack/react-query";
import {Br, Cut, Line, Printer, render, Row, Text} from 'react-thermal-printer';
import {useToast} from "@/components/ui/use-toast";
import AKThermalPrint from "@/lib/AKThermalPrint";
import {ambilAntrian, getKodeMesin} from "@/lib/api";
import {getEncoder, lrtext, print} from "@/lib/utils";
import {FaRegCheckCircle} from "react-icons/fa";
import {IconContext} from "react-icons";


export function DetailLayananDialog({thermalDevice, deviceOutPath, dataLayanan, onClose}) {
    const {toast} = useToast()
    const [isSubmitting, setSubmitting] = useState(false);
    const [selectedLayanan, setSelectedLayanan] = useState(null)


    const mutation = useMutation({
        mutationFn: ambilAntrian,
        onMutate: () => {
            setSubmitting(true)
        },
        onError: (error) => {
            console.log("error")
            setSubmitting(false)
            toast({
                variant: "destructive",
                title: "Oopss, Telah Terjadi Kesalahan ",
                description: error.message,
            })
        },
        onSuccess: (data) => {
            console.log("sukses")
            setSubmitting(false)
            toast({
                title: "Sukses",
                description: "Antrian Berhasil DiDaftarkan!"
            })
            if (thermalDevice && deviceOutPath) {
                const date = new Date();
                const options = {day: '2-digit', month: 'long', year: 'numeric'};
                const formattedDate = date.toLocaleDateString('id-ID', options);
                const testPrint = () => getEncoder()
                    .initialize()
                    .line("=".repeat(32))
                    .align("center")
                    .bold(true)
                    .line("MAL PELAYANAN PUBLIK")
                    .line("KABUPATEN TABALONG")
                    .bold(false)
                    .align("left")
                    .line("-".repeat(32))
                    .newline()
                    .align("center")
                    .size("small")
                    .line("Nomor Antrian")
                    .size("normal")
                    .bold(true)
                    .width(4)
                    .height(4)
                    .line(data.no_antrian)
                    .bold(false)
                    .size("small")
                    .line(dataLayanan.nama)
                    .newline()
                    .line("Berlaku Sampai")
                    .line(lrtext(formattedDate, "23:59:59"))
                    .line("========= TERIMA KASIH =========")
                    .newline()
                    .newline()
                    .newline()
                    .cut();
                print({device: thermalDevice, deviceEndpoint: deviceOutPath, data: testPrint().encode()})
            }
            onClose()
        }
    })

    const submitHandler = async (event) => {
        event.preventDefault();
        if (selectedLayanan)
            mutation.mutate({kode: getKodeMesin(), layananId: selectedLayanan.id});
        else
            toast({
                variant: "destructive",
                title: "Perhatian!",
                description: "Tolong Pilih Layanan dahulu!",
            })
    };

    useEffect(() => {
        if (dataLayanan.layanan.length === 1) {
            setSelectedLayanan(dataLayanan.layanan[0])
        }
    }, [dataLayanan]);

    return (
        <Dialog open={true}>
            <DialogContent onClose={onClose}>
                <DialogHeader>
                    <DialogTitle>{dataLayanan.nama}</DialogTitle>
                    <DialogDescription>
                        {dataLayanan.deskripsi}
                    </DialogDescription>
                </DialogHeader>
                {dataLayanan.layanan.length > 1 &&
                    <h2>Silahkan Klik Layanan Yang Tersedia Dibawah!</h2>}
                <div className="flex flex-col gap-2">
                    {dataLayanan.layanan.map((layanan) => (
                        <div key={layanan.id} onClick={() => setSelectedLayanan(layanan)}>
                            <Card
                                className={`${selectedLayanan && selectedLayanan.id === layanan.id ? "bg-blue-950" : ""}`}>
                                <div className="flex flex-row justify-around">
                                    <div className="w-full">
                                        <CardHeader>
                                            <CardTitle
                                                className={`${selectedLayanan && selectedLayanan.id === layanan.id ? "text-white" : " text-black"} text-xs`}>
                                                {layanan.nama}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent
                                            className={`${selectedLayanan && selectedLayanan.id === layanan.id ? "text-white" : " text-black"} max-h-40 overflow-y-auto text-xs`}>
                                            {parse(layanan.deskripsi)}
                                        </CardContent>
                                    </div>
                                    {selectedLayanan && selectedLayanan.id === layanan.id &&
                                        <div className="p-2 self-center">
                                            <IconContext.Provider
                                                value={{color: "white", className: "global-class-name"}}>
                                                <FaRegCheckCircle className="w-8 h-8"/>
                                            </IconContext.Provider>
                                        </div>}
                                </div>

                            </Card>
                        </div>

                    ))}
                </div>
                <DialogFooter className="w-full">
                    {isSubmitting && <Button disabled className="w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Sedang Mengambil Nomor Antrian, Mohon Tunggu!
                    </Button>}
                    {!isSubmitting &&
                        <Button type="submit" onClick={submitHandler} className="w-full text-xl font-extrabold">AMBIL ANTRIAN</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
