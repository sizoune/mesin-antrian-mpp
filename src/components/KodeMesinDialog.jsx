'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {Fragment, useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {cekKodeMesin} from "@/lib/api";
import {Loader2} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";

export default function KodeMesinDialog({onSuccessSetKode}) {
    const {toast} = useToast()
    const [kode, setKode] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);

    const cekKodeMesinMutation = useMutation({
        mutationFn: cekKodeMesin,
        onMutate: () => {
            setSubmitting(true);
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Oopss, Telah Terjadi Kesalahan!",
                description: error.message,
            })
            setSubmitting(false);
        },
        onSuccess: () => {
            // Invalidate and refetch
            toast({
                title: "Sukses!",
                description: "Mesin Berhasil didaftarkan!",
            })
            setSubmitting(false);
            onSuccessSetKode({kode});
        },
    });

    const submitHandler = async (event) => {
        setSubmitting(true)
        console.log('submit')
        event.preventDefault();
        if (kode.length === 6) {
            cekKodeMesinMutation.mutate({kode})
        } else {
            toast({
                variant: "destructive",
                title: "Perhatian!",
                description: "Tolong isi Kode mesin dahulu!",
            })
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Inisialisasi Kode Mesin Antrian</DialogTitle>
                    <DialogDescription>
                        Silahkan Masukkan Kode Mesin Antrian yang Sudah Dibuat Pada Server
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <InputOTP
                        maxLength={6}
                        value={kode}
                        onChange={(value) => setKode(value)}
                        render={({slots}) => (
                            <InputOTPGroup className="gap-1">
                                {slots.map((slot, index) => (
                                    <Fragment key={index}>
                                        <InputOTPSlot className="rounded-md border" {...slot} />
                                        {index !== slots.length - 1 && <InputOTPSeparator/>}
                                    </Fragment>
                                ))}{" "}
                            </InputOTPGroup>
                        )}
                    />
                </div>
                <DialogFooter>
                    {isSubmitting && <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please wait
                    </Button>}
                    {!isSubmitting &&
                        <Button type="submit" onClick={submitHandler}>Daftarkan Mesin
                            Antrian</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
