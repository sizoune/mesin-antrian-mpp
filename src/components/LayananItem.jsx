'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {calculateMinHeight} from "@/lib/utils";

export default function LayananItem({nama, onLayananClick}) {

    return (
        <div role="button" onClick={onLayananClick} className="relative w-full">
            <Card className="flex min-h-20 items-center text-center bg-blue-500">
                <p className="text-3xl p-2 pt-1 font-extrabold w-full text-white">{nama.toUpperCase()}</p>
            </Card>
        </div>
    );
}
