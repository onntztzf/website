"use client";
import React, {useEffect} from 'react';
import './style.css';

interface Props {
}

const Clock: React.FC<Props> = () => {
    const displays: string[] = Array.from({length: 6}, (_, index) => `display-${index + 1}`);

    const zeroFill = (string: string, length: number): string => {
        return string.padStart(length, '0');
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const d = new Date();
            const [h, m, s] = [d.getHours(), d.getMinutes(), d.getSeconds()].map((num) => zeroFill(num.toString(), 2));

            const baseClass = 'display-container display-no-';

            for (let i = 0; i < 6; i++) {
                const display = document.getElementById(displays[i]);
                if (display) {
                    let value = '';
                    switch (i) {
                        case 0:
                            value = h[0];
                            break;
                        case 1:
                            value = h[1];
                            break;
                        case 2:
                            value = m[0];
                            break;
                        case 3:
                            value = m[1];
                            break;
                        case 4:
                            value = s[0];
                            break;
                        case 5:
                            value = s[1];
                            break;
                    }
                    display.className = baseClass + value;
                }
            }

            // document.body.style.backgroundColor = `#${s}${m}${h}`;
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div id="clock">
            {displays.map((displayId, index) => (
                <div key={index} id={displayId} className={`display-container display-no-${index}`}>
                    {'abcdefg'.split('').map((segment) => (
                        <div
                            key={segment}
                            className={`segment-${segment} segment-${'adg'.includes(segment) ? 'x' : 'y'}`}>
                            <span className="segment-border"></span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Clock;
