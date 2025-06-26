import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import { editorThemes } from "@/resources/Themes"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"
import { useRef, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"

function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )
    const [extensions, setExtensions] = useState<Extension[]>([])
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile) return

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(SocketEvent.TYPING_START, { cursorPosition })
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })
        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        )
        setTimeOut(newTimeOut)
    }

    // Listen wheel event to zoom in/out and prevent page reload
    usePageEvents()

    useEffect(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
        ]
        const langExt = loadLanguage(language.toLowerCase() as LanguageName)
        if (langExt) {
            extensions.push(langExt)
        } else {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            )
        }

        setExtensions(extensions)
    }, [filteredUsers, language])

    // Context menu handler
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        // Only show for HTML files
        if (activeFile?.name?.toLowerCase().endsWith(".html")) {
            setShowContextMenu(true)
            setContextMenuPos({ x: e.clientX, y: e.clientY })
        }
    }

    const handleOpenWithLiveServer = () => {
        if (activeFile?.content) {
            const blob = new Blob([activeFile.content], { type: "text/html" })
            const url = URL.createObjectURL(blob)
            window.open(url, "_blank", "noopener,noreferrer")
        }
        setShowContextMenu(false)
    }

    useEffect(() => {
        // Hide context menu on click elsewhere
        const hideMenu = () => setShowContextMenu(false)
        if (showContextMenu) {
            window.addEventListener("click", hideMenu)
        }
        return () => {
            window.removeEventListener("click", hideMenu)
        }
    }, [showContextMenu])

    return (
        <div
            ref={editorContainerRef}
            onContextMenu={handleContextMenu}
            style={{ position: "relative", height: "100%" }}
        >
            <CodeMirror
                theme={editorThemes[theme]}
                onChange={onCodeChange}
                value={activeFile?.content}
                extensions={extensions}
                minHeight="100%"
                maxWidth="100vw"
                style={{
                    fontSize: fontSize + "px",
                    height: viewHeight,
                    position: "relative",
                }}
            />
            {showContextMenu && (
                <div
                    style={{
                        position: "fixed",
                        top: contextMenuPos.y,
                        left: contextMenuPos.x,
                        zIndex: 1000,
                        background: "#23272f",
                        color: "#39e079",
                        borderRadius: "8px",
                        boxShadow: "0 2px 12px #39e07944",
                        padding: "8px 0",
                        minWidth: "180px",
                        cursor: "pointer",
                        fontWeight: 600,
                        userSelect: "none",
                    }}
                >
                    <div
                        onClick={handleOpenWithLiveServer}
                        style={{
                            padding: "8px 20px",
                            transition: "background 0.2s",
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#39e07922")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.background = "transparent")
                        }
                    >
                        Open with Live Server
                    </div>
                </div>
            )}
        </div>
    )
}

export default Editor
