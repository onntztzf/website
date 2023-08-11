'use client'

import React, { ChangeEvent, useState } from "react";
import './style.css';

interface Bookmark {
    icon?: string;
    title: string;
    addAt?: string;
    updateAt?: string;
    url?: string;
    bookmarks?: Bookmark[];
}

function getTitle(dom: HTMLElement): string {
    return dom.innerText;
}

function getAttribute(dom: HTMLElement, attr: string): string | undefined {
    return dom.getAttribute(attr) || undefined;
}

function findElement(dom: HTMLElement, tagName: string): HTMLElement | null {
    return dom.querySelector(tagName);
}

function formatBookmark(el: HTMLElement): Bookmark[] {
    const result: Bookmark[] = [];

    el.children.forEach((child) => {
        if (child instanceof HTMLElement && child.tagName === "DT") {
            const titleNode = findElement(child, "H3");
            const aNode = findElement(child, "A");
            const childNode = findElement(child, "DL");

            if (titleNode && childNode) {
                result.push({
                    title: getTitle(titleNode),
                    addAt: getAttribute(titleNode, "add_date"),
                    updateAt: getAttribute(titleNode, "last_modified"),
                    bookmarks: formatBookmark(childNode),
                });
            }
            if (aNode) {
                result.push({
                    icon: getAttribute(aNode, "ICON"),
                    title: getTitle(aNode),
                    addAt: getAttribute(aNode, "add_date"),
                    updateAt: getAttribute(aNode, "last_modified"),
                    url: getAttribute(aNode, "href"),
                });
            }
        }
    })
    // for (const child of el.children) {
    //     if (child instanceof HTMLElement && child.tagName === "DT") {
    //         const titleNode = findElement(child, "H3");
    //         const aNode = findElement(child, "A");
    //         const childNode = findElement(child, "DL");

    //         if (titleNode && childNode) {
    //             result.push({
    //                 title: getTitle(titleNode),
    //                 addAt: getAttribute(titleNode, "add_date"),
    //                 updateAt: getAttribute(titleNode, "last_modified"),
    //                 bookmarks: formatBookmark(childNode),
    //             });
    //         }
    //         if (aNode) {
    //             result.push({
    //                 icon: getAttribute(aNode, "ICON"),
    //                 title: getTitle(aNode),
    //                 addAt: getAttribute(aNode, "add_date"),
    //                 updateAt: getAttribute(aNode, "last_modified"),
    //                 url: getAttribute(aNode, "href"),
    //             });
    //         }
    //     }
    // }

    return result;
}

function parseBookmarkData(data: string): Bookmark {
    const dom = new DOMParser().parseFromString(data, "text/html");

    const h1 = dom.querySelector("H1") as HTMLElement;
    const root = dom.querySelector("DL") as HTMLElement;

    return {
        title: h1?.innerText || "",
        bookmarks: root ? formatBookmark(root) : [],
    };
}

async function readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (error) => reject(error);
    });
}

export default function Page() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string[]>([]);
    const [parsedBookmarks, setParsedBookmarks] = useState<Bookmark | null>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);

        if (!file) {
            console.log('文件选择失败');
            return;
        }

        try {
            const data = await readFileContent(file);
            const lines = data.split('\n');
            setFileContent(lines);

            const parsedData = parseBookmarkData(data);
            setParsedBookmarks(parsedData);
        } catch (error) {
            console.error('处理文件时发生错误:', error);
        }
    };

    return (
        <div className="page-container">
            <header className="header">
                <input
                    type="file"
                    accept=".html"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </header>
            <div className="parsed-data">
                <h2>解析后的书签数据:</h2>
                <pre>{JSON.stringify(parsedBookmarks || {}, null, 2)}</pre>
            </div>
        </div>
    );
}
