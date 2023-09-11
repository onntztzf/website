import "./globals.css"
import type {Metadata} from "next"
import React from "react";
import '@radix-ui/themes/styles.css';
import {Theme} from '@radix-ui/themes';

export const metadata: Metadata = {
    title: "website",
    description: "Generated by zhangpeng",
}

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {
    return (
        <html lang="en">
            <body>
                <Theme>
                    {children}
                </Theme>
            </body>
        </html>
    )
}
