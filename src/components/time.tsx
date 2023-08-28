"use client";

import React, {useEffect, useState} from "react";

const Time: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dateTime, setDateDateTime] = useState("");

    useEffect(() => {
        const dateTime = currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
        setDateDateTime(dateTime);
        console.log(111, dateTime);
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    return <time dateTime={dateTime} className={}>{formattedTime}</time>;
};

export default Time;
