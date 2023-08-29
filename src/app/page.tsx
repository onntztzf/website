import dynamic from "next/dynamic"
import "./style.css";

const Clock = dynamic(() => import("@/components/clock"), {ssr: false})

export default function Home() {
    return (
        <div className="container">
            <Clock/>
        </div>
    );
}

