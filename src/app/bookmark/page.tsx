'use client'

import React, {ChangeEvent, useEffect, useState} from "react";
import './style.css';

interface Bookmark {
    icon?: string;
    title: string;
    addAt?: string;
    updateAt?: string;
    url?: string;
    bookmarks?: Bookmark[];
}

const initialPlaceholderBookmark: Bookmark = {
    title: "Example",
    bookmarks: [
        {
            title: "Example Bookmark",
            url: "https://example.com",
        },
    ]
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

    for (const child of el.children) {
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
    }

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
    const [parsedBookmarks, setParsedBookmarks] = useState<Bookmark | null>(initialPlaceholderBookmark);
    const [showGuide, setShowGuide] = useState(true);

    const isFileSelected = !!selectedFile;
    const isParsedBookmarksAvailable = !!parsedBookmarks;
    const shouldShowGuide = !isFileSelected || !isParsedBookmarksAvailable;

    useEffect(() => {
        setShowGuide(shouldShowGuide);
    }, [shouldShowGuide]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            setParsedBookmarks(initialPlaceholderBookmark);
            return;
        }

        setSelectedFile(file);

        try {
            const data = await readFileContent(file);
            const parsedData = parseBookmarkData(data);
            setParsedBookmarks(parsedData);
        } catch (error) {
            console.error('处理文件时发生错误:', error);
        }
    };

    return (
        <div className="page-container">
            {showGuide && (<div className="guide">
                <h2>欢迎使用浏览器书签解析工具</h2>
                <p>
                    使用本工具，您可以将浏览器的书签文件解析成结构化数据。
                </p>
                <p className="guide-instructions">
                    请按以下步骤导出并解析书签文件：
                </p>
                <ol className="guide-steps">
                    <li>打开浏览器中的书签管理器。</li>
                    <li>选择<span className="highlight-text">“导出书签”</span>选项，并将文件保存到您的设备。</li>
                    <li>回到本页面，点击下方的<span className="highlight-text">“选择文件”</span>按钮，选择您刚刚导出的书签文件。
                    </li>
                </ol>
                <div className="guide-link">
                    <p>
                        想要了解完整的解析步骤？点击链接查看：<a
                        href={"https://mp.weixin.qq.com/s/KIEWs62Rb-tBY0PIL3ORFA"}>
                        掌握书签文件：高效管理你的收藏
                    </a>
                    </p>
                </div>
            </div>)}
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
                <div className="data">
                    <pre>{JSON.stringify(parsedBookmarks || {}, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
