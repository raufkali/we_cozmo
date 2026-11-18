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
          border: 1px solid var(--border-color, #e0d0d0);
          border-radius: var(--radius-md, 8px);
          background: #fff;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
          margin-top: 4px;
        }

        .desc-editor-header {
          background: #fdf8f8;
          border-bottom: 1px solid var(--border-color, #ecdada);
        }

        .desc-editor-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(139, 0, 0, 0.06);
        }

        .desc-editor-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--primary, #8b0000);
          display: flex;
          align-items: center;
        }

        .desc-editor-tabs {
          display: flex;
          gap: 4px;
          background: rgba(139, 0, 0, 0.05);
          padding: 2px;
          border-radius: 6px;
        }

        .desc-tab-btn {
          border: none;
          background: transparent;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted, #777);
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .desc-tab-btn:hover {
          color: var(--primary, #8b0000);
        }

        .desc-tab-btn.active {
          background: #fff;
          color: var(--primary, #8b0000);
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .desc-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #faf4f4;
        }

        .desc-toolbar-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .toolbar-group-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted, #8a5a5a);
          margin-right: 2px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .desc-toolbar-divider {
          width: 1px;
          height: 18px;
          background: rgba(139, 0, 0, 0.12);
          margin: 0 4px;
        }

        .toolbar-btn {
          border: 1px solid rgba(139, 0, 0, 0.15);
          background: #fff;
          color: #3a1a1a;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          line-height: 1.2;
        }

        .toolbar-btn:hover {
          background: var(--primary, #8b0000);
          color: #fff;
          border-color: var(--primary, #8b0000);
        }

        .toolbar-btn-icon {
          min-width: 26px;
          justify-content: center;
          font-family: serif;
          font-size: 0.85rem;
        }

        .preset-btn {
          background: rgba(139, 0, 0, 0.04);
          color: var(--primary, #8b0000);
          border-color: rgba(139, 0, 0, 0.2);
          font-weight: 600;
        }

        .preset-btn:hover {
          background: var(--primary, #8b0000);
          color: #fff;
        }

        .desc-editor-body {
          display: flex;
          flex-direction: column;
        }

        .desc-textarea {
          width: 100%;
          border: none;
          padding: 12px;
          font-size: 0.88rem;
          font-family: inherit;
          line-height: 1.6;
          color: #222;
          resize: vertical;
          min-height: 160px;
          outline: none;
        }

        .desc-textarea:focus {
          outline: none;
        }

        .desc-editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 12px;
          background: #fdfafa;
          border-top: 1px solid rgba(139, 0, 0, 0.06);
          font-size: 0.72rem;
          color: var(--text-muted, #888);
        }

        .desc-hint {
          display: inline-flex;
          align-items: center;
        }

        .desc-char-count {
          font-weight: 500;
          color: #999;
        }

        .desc-preview-body {
          padding: 16px;
          min-height: 180px;
          max-height: 320px;
          overflow-y: auto;
          background: #fff;
        }

        .desc-preview-empty {
          color: #999;
          font-size: 0.85rem;
          text-align: center;
          padding: 30px 10px;
        }

        .admin-desc-preview {
          font-family: var(--font-body, inherit);
        }
      `}</style>
    </div>
  );
}
