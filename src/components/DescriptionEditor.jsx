"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function DescriptionEditor({ value = "", onChange }) {
  const [activeTab, setActiveTab] = useState("write"); // "write" or "preview"
  const textareaRef = useRef(null);

  // Helper to insert or wrap markdown at cursor position
  const applyFormat = (prefix, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || "";
    const selectedText = text.substring(start, end);

    let replacement = "";
    let newCursorPos = 0;

    if (selectedText) {
      // If wrapping multi-line for lists
      if (prefix === "- " || prefix === "1. ") {
        const lines = selectedText.split("\n");
        const formatted = lines
          .map((line, idx) =>
            prefix === "1. " ? `${idx + 1}. ${line}` : `- ${line}`
          )
          .join("\n");
        replacement = formatted;
        newCursorPos = start + formatted.length;
      } else {
        replacement = `${prefix}${selectedText}${suffix}`;
        newCursorPos = start + replacement.length;
      }
    } else {
      const insertion = defaultText || "text";
      replacement = `${prefix}${insertion}${suffix}`;
      newCursorPos = start + prefix.length + insertion.length;
    }

    // Add newline before if needed for headings and lists
    const isBlock = prefix.startsWith("#") || prefix.startsWith("-") || prefix.startsWith("1.");
    const needsLeadingNewline = isBlock && start > 0 && text[start - 1] !== "\n";
    const needsTrailingNewline = isBlock && end < text.length && text[end] !== "\n";

    const finalReplacement =
      (needsLeadingNewline ? "\n" : "") +
      replacement +
      (needsTrailingNewline ? "\n" : "");

    const newText = text.substring(0, start) + finalReplacement + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const pos = start + (needsLeadingNewline ? 1 : 0) + prefix.length;
      const selEnd = pos + (selectedText ? selectedText.length : defaultText.length);
      textarea.setSelectionRange(pos, selEnd);
    }, 10);
  };

  const insertTemplate = (templateText) => {
    const text = value || "";
    const separator = text.length > 0 && !text.endsWith("\n\n") ? (text.endsWith("\n") ? "\n" : "\n\n") : "";
    const updated = text + separator + templateText;
    onChange(updated);
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }, 10);
    }
  };

  return (
    <div className="desc-editor-container">
      {/* Top Header / Mode Switcher */}
      <div className="desc-editor-header">
        <div className="desc-editor-title-bar">
          <span className="desc-editor-label">
            <i className="fas fa-edit me-1"></i> Product Description
          </span>
          <div className="desc-editor-tabs">
            <button
              type="button"
              className={`desc-tab-btn ${activeTab === "write" ? "active" : ""}`}
              onClick={() => setActiveTab("write")}
            >
              <i className="fas fa-pen me-1"></i> Editor
            </button>
            <button
              type="button"
              className={`desc-tab-btn ${activeTab === "preview" ? "active" : ""}`}
              onClick={() => setActiveTab("preview")}
            >
              <i className="fas fa-eye me-1"></i> Live Preview
            </button>
          </div>
        </div>

        {/* Toolbar - only visible in write mode */}
        {activeTab === "write" && (
          <div className="desc-toolbar">
            <div className="desc-toolbar-group">
              <span className="toolbar-group-label">Titles:</span>
              <button
                type="button"
                className="toolbar-btn"
                title="Add Large Main Title"
                onClick={() => applyFormat("# ", "\n", "Main Product Title")}
              >
                <i className="fas fa-heading me-1"></i> H1 Title
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Add Section Heading"
                onClick={() => applyFormat("## ", "\n", "Section Heading")}
              >
                <i className="fas fa-heading me-1"></i> H2 Subtitle
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Add Small Title"
                onClick={() => applyFormat("### ", "\n", "Small Section")}
              >
                <i className="fas fa-heading me-1"></i> H3 Small
              </button>
            </div>

            <div className="desc-toolbar-divider"></div>

            <div className="desc-toolbar-group">
              <span className="toolbar-group-label">Lists:</span>
              <button
                type="button"
                className="toolbar-btn"
                title="Add Bullet Points List"
                onClick={() => applyFormat("- ", "\n", "Bullet Item")}
              >
                <i className="fas fa-list-ul me-1"></i> Bullet List
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="Add Numbered Steps List"
                onClick={() => applyFormat("1. ", "\n", "Numbered Step")}
              >
                <i className="fas fa-list-ol me-1"></i> Numbered List
              </button>
            </div>

            <div className="desc-toolbar-divider"></div>

            <div className="desc-toolbar-group">
              <span className="toolbar-group-label">Style:</span>
              <button
                type="button"
                className="toolbar-btn toolbar-btn-icon"
                title="Bold Text"
                onClick={() => applyFormat("**", "**", "bold text")}
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                className="toolbar-btn toolbar-btn-icon"
                title="Italic Text"
                onClick={() => applyFormat("*", "*", "italic text")}
              >
                <em>I</em>
              </button>
            </div>

            <div className="desc-toolbar-divider"></div>

            <div className="desc-toolbar-group">
              <span className="toolbar-group-label">1-Click Presets:</span>
              <button
                type="button"
                className="toolbar-btn preset-btn"
                onClick={() =>
                  insertTemplate(
                    "## Key Features\n- 100% Original and authentic product\n- Dermatologically tested and safe\n- Long-lasting results"
                  )
                }
              >
                + Features
              </button>
              <button
                type="button"
                className="toolbar-btn preset-btn"
                onClick={() =>
                  insertTemplate(
                    "## How to Use\n1. Wash and dry your face thoroughly\n2. Apply a small amount evenly\n3. Massage gently in upward circular motions"
                  )
                }
              >
                + How to Use
              </button>
              <button
                type="button"
                className="toolbar-btn preset-btn"
                onClick={() =>
                  insertTemplate(
                    "## Benefits\n- Hydrates and brightens the complexion\n- Softens texture and restores natural glow\n- Suitable for all skin types"
                  )
                }
              >
                + Benefits
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Body */}
      {activeTab === "write" ? (
        <div className="desc-editor-body">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="desc-textarea"
            rows={8}
            placeholder="Write your product description here, or use the buttons above to easily insert titles, bullet lists, numbered lists, and sections..."
          />
          <div className="desc-editor-footer">
            <span className="desc-hint">
              💡 <strong>Tip:</strong> Click <strong>H1 Title</strong>, <strong>H2 Subtitle</strong>, or <strong>Bullet List</strong> above. You can also highlight any text and click a button to format it instantly.
            </span>
            <span className="desc-char-count">{value ? value.length : 0} chars</span>
          </div>
        </div>
      ) : (
        <div className="desc-preview-body">
          {value && value.trim() ? (
            <div className="product-modal-description admin-desc-preview">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        margin: "1rem 0 0.5rem",
                        color: "#1a0a0a",
                        borderBottom: "1px solid rgba(139,0,0,0.1)",
                        paddingBottom: "4px",
                      }}
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        margin: "0.85rem 0 0.4rem",
                        color: "#8b0000",
                      }}
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: "600",
                        margin: "0.6rem 0 0.3rem",
                        color: "#333",
                      }}
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      style={{
                        marginBottom: "0.65rem",
                        lineHeight: "1.6",
                        color: "#4a4a4a",
                        fontSize: "0.92rem",
                      }}
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong style={{ fontWeight: "700", color: "#1a0a0a" }} {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      style={{
                        paddingLeft: "1.4rem",
                        marginBottom: "0.75rem",
                        listStyleType: "disc",
                      }}
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      style={{
                        paddingLeft: "1.4rem",
                        marginBottom: "0.75rem",
                        listStyleType: "decimal",
                      }}
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      style={{
                        marginBottom: "0.3rem",
                        lineHeight: "1.5",
                        color: "#333",
                        fontSize: "0.92rem",
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="desc-preview-empty">
              <i className="fas fa-file-alt me-2"></i>
              No description added yet. Switch to <strong>Editor</strong> tab to add titles, lists, and details.
            </div>
          )}
        </div>
      )}

      <style jsx>{`

.desc-editor-container {
  width: 100%;
  min-width: 0;
  margin-top: 6px;
  background: #fff;
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.035);
}

.desc-editor-header {
  background: #fffafa;
  border-bottom: 1px solid #eee5e5;
}

.desc-editor-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  min-width: 0;
  border-bottom: 1px solid #f0e9e9;
}

.desc-editor-label {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--primary, #8b0000);
  white-space: nowrap;
}

.desc-editor-tabs {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  flex-shrink: 0;
  background: #f5eeee;
  border-radius: 6px;
}

.desc-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 6px 13px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #777;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.desc-tab-btn:hover {
  color: var(--primary, #8b0000);
}

.desc-tab-btn.active {
  background: #fff;
  color: var(--primary, #8b0000);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.desc-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fcf9f9;
}

.desc-toolbar-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  min-width: 0;
}

.toolbar-group-label {
  margin-right: 3px;
  color: #888;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  white-space: nowrap;
}

.desc-toolbar-divider {
  width: 1px;
  height: 23px;
  background: #e8dede;
  flex-shrink: 0;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 34px;
  padding: 6px 10px;
  border: 1px solid #e9dede;
  border-radius: 5px;
  background: #fff;
  color: #444;
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s ease;
}

.toolbar-btn:hover {
  color: #fff;
  background: var(--primary, #8b0000);
  border-color: var(--primary, #8b0000);
}

.toolbar-btn-icon {
  min-width: 34px;
  padding: 6px;
  font-family: serif;
  font-size: 0.9rem;
}

.preset-btn {
  color: var(--primary, #8b0000);
  background: #fff8f8;
  border-color: #ecdada;
  font-weight: 700;
}

.preset-btn:hover {
  background: var(--primary, #8b0000);
  color: #fff;
}

.desc-editor-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
}

.desc-textarea {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 190px;
  padding: 16px;
  border: 0;
  border-radius: 0;
  outline: none;
  resize: vertical;
  background: #fff;
  color: #292929;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.75;
}

.desc-textarea::placeholder {
  color: #aaa;
  line-height: 1.7;
}

.desc-textarea:focus {
  outline: none;
}

.desc-editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
  border-top: 1px solid #f0e9e9;
  background: #fdfbfb;
  color: #888;
  font-size: 0.72rem;
}

.desc-hint {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  line-height: 1.5;
}

.desc-char-count {
  flex-shrink: 0;
  color: #777;
  font-weight: 600;
  white-space: nowrap;
}

.desc-preview-body {
  min-height: 190px;
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background: #fff;
  overflow-wrap: anywhere;
}

.admin-desc-preview {
  max-width: 100%;
  min-width: 0;
  color: #444;
  font-family: var(--font-body, inherit);
  line-height: 1.75;
  overflow-wrap: anywhere;
}

.admin-desc-preview p {
  overflow-wrap: anywhere;
}

.admin-desc-preview img {
  max-width: 100%;
  height: auto;
}

.desc-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 25px 15px;
  color: #999;
  font-size: 0.85rem;
  line-height: 1.7;
  text-align: center;
}

/* Tablet */
@media (max-width: 768px) {
  .desc-editor-title-bar {
    padding: 11px 12px;
  }

  .desc-toolbar {
    gap: 9px;
    padding: 11px;
  }

  .desc-toolbar-group {
    gap: 5px;
  }

  .desc-preview-body {
    padding: 16px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .desc-editor-container {
    border-radius: 6px;
    margin-top: 5px;
  }

  .desc-editor-title-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px;
  }

  .desc-editor-label {
    font-size: 0.84rem;
  }

  .desc-editor-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 4px;
  }

  .desc-tab-btn {
    width: 100%;
    min-height: 39px;
    padding: 8px 5px;
    font-size: 0.78rem;
  }

  .desc-toolbar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 11px;
    padding: 12px;
  }

  .desc-toolbar-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    width: 100%;
  }

  .toolbar-group-label {
    width: 100%;
    margin: 0 0 2px;
    font-size: 0.65rem;
  }

  .desc-toolbar-divider {
    display: none;
  }

  .toolbar-btn {
    min-height: 38px;
    padding: 8px 10px;
    font-size: 0.74rem;
  }

  .toolbar-btn-icon {
    min-width: 40px;
    min-height: 38px;
  }

  .desc-textarea {
    min-height: 230px;
    padding: 14px;
    font-size: 16px;
    line-height: 1.75;
  }

  .desc-editor-footer {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 6px;
    padding: 10px 12px;
    font-size: 0.69rem;
  }

  .desc-hint {
    width: 100%;
    line-height: 1.6;
  }

  .desc-char-count {
    margin-left: auto;
  }

  .desc-preview-body {
    min-height: 180px;
    max-height: 450px;
    padding: 15px;
  }
}

/* Small mobile */
@media (max-width: 360px) {
  .desc-toolbar {
    padding: 10px;
  }

  .toolbar-btn {
    padding: 8px;
    font-size: 0.7rem;
  }

  .desc-preview-body {
    padding: 12px;
  }
}

      `}</style>
    </div>
  );
}
