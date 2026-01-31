import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

const getVisibleTitleText = (element) => {
    if (!element) return "";

    const fullText = element.innerText;
    const maxWidth = element.offsetWidth;
    const style = getComputedStyle(element);
    const font = `${style.fontSize} ${style.fontFamily}`;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;

    let result = '';
    for (let i = 0; i < fullText.length; i++) {
        const test = fullText.slice(0, i + 1);
        const width = ctx.measureText(test + '...').width;
        if (width > maxWidth) break;
        result = test;
    }
    return result + (result.length < fullText.length ? "..." : "");
};

function SummaryItem ({
    item,
    editingId,
    setEditingId,
    editTitle,
    setEditTitle,
    navigate,
    deleteSummary,
    updateTitle,
    openMenuId,
    setOpenMenuId
}) {

    const titleRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId === item.id && menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuId, item.id, setOpenMenuId]);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === item.id ? null : item.id);
    };

    const handleTitleChange = () => {
        if (!editTitle) {
            setEditingId(null);
            return;
        }

        const trimmed = editTitle.trim();

        if (trimmed === item.title || trimmed ==="") {
            setEditTitle(item.title);
            setEditingId(null);
            return;
        }

        updateTitle(item.id, trimmed);
        setEditingId(null);
    };

    const handleDelete = () => {
        const titleEl = titleRef.current;
        const visibleTitle = getVisibleTitleText(titleEl);
        if (window.confirm(`"${visibleTitle}"을(를) 삭제하시겠습니까?`)) {
            deleteSummary(item.id);
        }
    };

    return(
        <div className="summary-item">
            {editingId === item.id ? (
                <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleTitleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleTitleChange();
                        if(e.key === "Escape") {
                                setEditTitle(item.title);
                                setEditingId(null);
                        }
                    }}
                    className="inline-edit-input"
                />
            ):(
                <span
                    className="summary-title"
                    ref={titleRef}
                    onClick={() => navigate(`/summary/${item.id}`)}
                >
                    {item.title ? item.title : item.originalContent}
                </span>
            )}

            <div className="menu-button-container" ref={menuRef}>
                <button
                    className="menu-icon-btn"
                    onClick={handleMenuToggle}
                    aria-label="더 보기"
                >
                    <MoreHorizontal size={18} />
                </button>

                {openMenuId === item.id && (
                    <div className="action-menu">
                        <div
                            className="action-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(item.id);
                                setEditTitle(item.title);
                                setOpenMenuId(null);
                            }}
                        >
                            <Edit2 size={14} /> <span>수정</span>
                        </div>
                        <div
                            className="action-item delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                                setOpenMenuId(null);
                            }}
                        >
                            <Trash2 size={14} /> <span>삭제</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
        );
    }

export default SummaryItem;