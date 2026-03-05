import { visit } from "unist-util-visit";
import type { Root } from "hast";

export function rehypeSingleCharLink() {
    return (tree: Root) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "a") {
                const textContent = extractTextContent(node);
                const trimmedText = textContent.trim();
                if (trimmedText.length === 1) {
                    node.properties = node.properties || {};
                    const existingClass = Array.isArray(node.properties.className)
                        ? node.properties.className.filter((c): c is string => typeof c === "string")
                        : typeof node.properties.className === "string"
                            ? [node.properties.className]
                            : [];

                    node.properties.className = [...existingClass, "single-char-link"];
                }
            }
        });
    };
}

function extractTextContent(node: any): string {
    if (node.type === "text") {
        return node.value || "";
    }

    if (node.children && Array.isArray(node.children)) {
        return node.children
            .map((child: any) => extractTextContent(child))
            .join("");
    }

    return "";
}