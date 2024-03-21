import {Inter as FontSans} from "next/font/google"
import "@/styles/globals.css"
import {cn} from "@/lib/utils";
import {ReactQueryClientProvider} from "@/components/ReactQueryClientProvider";
import {Toaster} from "@/components/ui/toaster";
import {ThemeProvider} from "@/components/theme-provider";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata = {
    title: "Mesin Antrian MPP",
    description: "Mesin Antrian MPP",
};

export default function RootLayout({children}) {
    return (
        <ReactQueryClientProvider>
            <html lang="en">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
            )}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <main>{children}</main>
            </ThemeProvider>

            <Toaster/>
            </body>
            </html>
        </ReactQueryClientProvider>
    );
}
