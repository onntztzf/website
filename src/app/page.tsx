import dynamic from "next/dynamic"
import "./style.css";

const Time = dynamic(() => import("@/components/time"), {ssr: false})

export default function Home() {
    return (
        <div className="container">
            <Time/>
        </div>
    );
}

