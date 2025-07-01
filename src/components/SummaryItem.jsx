import { useRef } from "react";

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

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === item.id ? null : item.id);
    };

    const handleTitleChange = () => {
        if (editTitle.trim() !== "") {
            updateTitle(item.id, editTitle);
        } 
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
                    }}
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

            <div
                className="menu-button"
                onClick={handleMenuToggle}
            >
                ...
                {openMenuId === item.id && (
                    <div className="action-menu">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(item.id);
                                setEditTitle("");
                                setOpenMenuId(null);
                            }}
                        >
                            수정
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                                setOpenMenuId(null);
                            }}
                        >
                            삭제
                        </div>
                    </div>
                )}
            </div>
        </div>
        );
    }

export default SummaryItem;