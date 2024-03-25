"use client"
import {useEffect, useState} from "react";
import {cekKodeMesin, getDaftarInstansi, getKodeMesin, putKodeMesin} from "@/lib/api";
import KodeMesinDialog from "@/components/KodeMesinDialog";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {Card, CardContent} from "@/components/ui/card";
import {useMutation, useQuery} from "@tanstack/react-query";
import LayananItem from "@/components/LayananItem";
import ImageBackgorund from "@/components/ImageBackgorund";
import {DetailLayananDialog} from "@/components/DetailLayananDialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/components/ui/use-toast";
import AKThermalPrint from "@/lib/AKThermalPrint";
import {connectToPrinter, getConnectedDevices} from "@/lib/utils";
import PrinterSetting from "@/components/PrinterSetting";

export default function Home() {
    // State variables
    const {toast} = useToast()
    const [kodeMesin, setKodeMesin] = useState(null);
    const [dataLayanan, setDataLayanan] = useState([]);
    const [isLoading, setIsLoadin] = useState(null);
    const [clickedLayanan, setClickedLayanan] = useState(null);
    const [deviceThermal, setDeviceThermal] = useState(null)
    const [time, setTime] = useState({
        minutes: new Date().getMinutes(),
        hours: new Date().getHours(),
        seconds: new Date().getSeconds()
    });
    const [currentDate, setCurrentDate] = useState('');


    // Query for fetching data
    // const cctvQuery = useQuery({ queryKey: ['get_cctv'], queryFn: getDaftarInstansi });
    // const { data: dataCCTV, isLoading1, isError: queryError } = cctvQuery;

    const daftarInstansiMutation = useMutation({
        mutationFn: getDaftarInstansi,
        onMutate: () => {
            setIsLoadin(true);
        },
        onError: (error) => {
            setIsLoadin(false);
            toast({
                variant: "destructive",
                title: "Oopss, Telah Terjadi Kesalahan!",
                description: error.message,
            })
        },
        onSuccess: (data) => {
            setIsLoadin(false);
            setDataLayanan(data)
        },
    });

    useEffect(() => {
        if (kodeMesin !== null && dataLayanan.length === 0)
            daftarInstansiMutation.mutate({kode: kodeMesin})
    }, [kodeMesin]);

    // Function to format numbers to two digits
    const convertToTwoDigit = (number) => {
        return number.toLocaleString('en-US', {
            minimumIntegerDigits: 2
        });
    };

    // Function to update current date
    const updateCurrentDate = () => {
        const date = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Jakarta', // Set the time zone to Indonesia
            locale: 'id-ID' // Set the locale to Indonesian (Bahasa Indonesia)
        };
        setCurrentDate(date.toLocaleDateString('id-ID', options));
    };


    // useEffect to update time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            const date = new Date();
            setTime({
                minutes: date.getMinutes(),
                hours: date.getHours(),
                seconds: date.getSeconds()
            });
            updateCurrentDate(); // Update current date every second
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // useEffect to get kodeMesin once
    useEffect(() => {
        setKodeMesin(getKodeMesin());

    }, []);

    // Function to handle successful kodeMesin setting
    const successKodeHandler = ({kode}) => {
        putKodeMesin(kode);
        setKodeMesin(kode);
    };

    const itemClickHandler = ({layanan}) => {
        if (deviceThermal) {
            setClickedLayanan(layanan)
        } else {
            toast({
                variant: "destructive",
                title: "Oopss, Telah Terjadi Kesalahan!",
                description: "Pastikan Printer Sudah Terhubung terlebih dahulu!",
            })
        }
    }

    return (
        <>
            <ThemeToggle/>
            <PrinterSetting onSuksesSet={(test) => setDeviceThermal(test)}
                            device={deviceThermal ? deviceThermal.device : null}/>
            <main className="flex flex-col gap-12 p-16">
                <div className='self-center font-extrabold flex flex-row text-xl gap-2'>
                    <div>{currentDate}</div>
                    <div>
                        <span>{convertToTwoDigit(time.hours)}:</span>
                        <span>{convertToTwoDigit(time.minutes)}:</span>
                        <span>{convertToTwoDigit(time.seconds)}</span>
                    </div>
                </div>
                {isLoading && <h1>Sedang Memuat Data!</h1>}
                {kodeMesin === null && <KodeMesinDialog onSuccessSetKode={successKodeHandler}/>}
                {clickedLayanan !== null &&
                    <DetailLayananDialog thermalDevice={deviceThermal.device}
                                         deviceOutPath={deviceThermal.deviceOutEndpoint}
                                         dataLayanan={clickedLayanan} onClose={() => setClickedLayanan(null)}/>}
                <div className=" absolute left-4 top-4 flex flex-row items-center gap-2 max-w-sm">
                    <img src="/tabalong.png" alt="logo kominfo" className="h-auto w-8"/>
                    <div className="flex-row">
                        <p className="font-bold text-black dark:text-white text-sm">MAL PELAYANAN PUBLIK</p>
                        <p className="font-bold text-black dark:text-white text-sm">KABUPATEN TABALONG</p>
                    </div>
                </div>
                {dataLayanan && <div className="grid grid-cols-2 gap-7">
                    {dataLayanan.map((layanan) => (
                        <LayananItem key={layanan.id} nama={layanan.nama}
                                     onLayananClick={() => itemClickHandler({layanan})}/>
                    ))}
                </div>}
                {/*{dataCCTV && <div className="grid grid-cols-2 gap-7">*/}
                {/*    {dataCCTV.map((layanan) => (*/}
                {/*        <LayananItem key={layanan.id} nama={layanan.nama}*/}
                {/*                     onLayananClick={() => setClickedLayanan(layanan)}/>*/}
                {/*    ))}*/}
                {/*</div>}*/}

            </main>
        </>

    );
}
