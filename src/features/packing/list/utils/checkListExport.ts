import type { CategoryWithItems } from "../../type";

/**
 * 체크리스트를 간단한 텍스트 형식으로 변환하는 함수 (아이템 이름만)
 */
export function exportChecklistToText(categories: CategoryWithItems[]): string {
  if (!categories || categories.length === 0) {
    return "체크리스트가 비어있습니다.";
  }

  let textContent = "";

  categories.forEach((category, categoryIndex) => {
    textContent += `${category.name}\n`;

    if (category.items && category.items.length > 0) {
      category.items.forEach((item) => {
        textContent += ` - ${item.name}\n`;
      });
    } else {
      textContent += " - 항목이 없습니다.\n";
    }

    if (categoryIndex < categories.length - 1) {
      textContent += "\n";
    }
  });

  return textContent;
}

/**
 * 체크리스트를 상세 정보 포함한 형식으로 변환하는 함수 (필수 표시, 노트 포함)
 */
export function exportChecklistToDetailedText(
  categories: CategoryWithItems[]
): string {
  if (!categories || categories.length === 0) {
    return "체크리스트가 비어있습니다.";
  }

  let textContent = "";

  categories.forEach((category, categoryIndex) => {
    textContent += `${category.name}\n`;

    if (category.items && category.items.length > 0) {
      category.items.forEach((item) => {
        const requiredMark = item.is_required ? " (필수)" : "";
        let itemText = ` - ${item.name}${requiredMark}`;

        if (item.notes) {
          itemText += ` [${item.notes}]`;
        }

        textContent += itemText + "\n";
      });
    } else {
      textContent += " - 항목이 없습니다.\n";
    }

    if (categoryIndex < categories.length - 1) {
      textContent += "\n";
    }
  });

  return textContent;
}

/**
 * 클립보드에 텍스트를 복사하는 함수
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        return true;
      } catch (error) {
        console.error("Failed to copy text:", error);
        return false;
      } finally {
        textArea.remove();
      }
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
