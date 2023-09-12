import dynamic from "next/dynamic"
import {Box, Kbd} from "@radix-ui/themes";

const Clock = dynamic(() => import("@/components/clock/clock"), {ssr: false})

export default function Page() {
    return (
        <Box className="w-screen h-screen flex justify-center items-center">
            <Clock/>
        </Box>
    );
}

