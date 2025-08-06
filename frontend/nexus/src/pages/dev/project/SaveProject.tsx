import { useEffect, useRef } from "react";
import MainLayout from "@/templates/MainLayout";

export function SaveProject() {
    const logRef = useRef<HTMLDivElement | null>(null);
    const msgRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        let conn: WebSocket | null = null;

        function appendLog(item: HTMLDivElement) {
            const log = logRef.current;
            if (!log) return;

            // decide whether to auto-scroll
            const doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
            log.appendChild(item);
            if (doScroll) {
                log.scrollTop = log.scrollHeight - log.clientHeight;
            }
        }

        // form submit handler (works even if form is rendered later)
        const submitHandler = (e: Event) => {
            e.preventDefault();
            if (!conn) return;
            const msg = msgRef.current;
            if (!msg || !msg.value) return;
            conn.send(msg.value);
            msg.value = "";
        };

        // attach handler if form exists
        if (formRef.current) {
            formRef.current.addEventListener("submit", submitHandler);
        }

        if ("WebSocket" in window) {
            conn = new WebSocket("ws://" + document.location.host + "/ws");

            conn.onclose = () => {
                const item = document.createElement("div");
                item.innerHTML = "<b>Connection closed.</b>";
                appendLog(item);
            };

            conn.onmessage = (evt: MessageEvent) => {
                const messages = String(evt.data).split("\n");
                for (let i = 0; i < messages.length; i++) {
                    const item = document.createElement("div");
                    item.innerText = messages[i];
                    appendLog(item);
                }
            };

            conn.onerror = (err) => {
                const item = document.createElement("div");
                item.innerText = `WebSocket error`;
                appendLog(item);
                console.error("WebSocket error:", err);
            };
        } else {
            const item = document.createElement("div");
            item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
            appendLog(item);
        }

        // cleanup on unmount
        return () => {
            if (conn && conn.readyState === WebSocket.OPEN) {
                conn.close();
            }
            if (formRef.current) {
                formRef.current.removeEventListener("submit", submitHandler);
            }
        };
    }, []); // run once on mount

    return (
        <MainLayout>
            <p>STATUS</p>
            <p>TEC DRIVE</p>
            <p>COMPANY DRIVE</p>
            <p>BIM 360</p>
            <p>page</p>

            {/* Use refs rather than getElementById */}
            <form id="form" ref={formRef}>
                <input id="msg" ref={msgRef} type="text" />
                <button type="submit">Send</button>
            </form>

            <div
                id="log"
                ref={logRef}
                style={{ border: "1px solid black", height: 200, overflowY: "auto" }}
            />
        </MainLayout>
    );
}
