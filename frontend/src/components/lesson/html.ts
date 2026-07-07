export function normalizeRichHtml(html: string): string {
  if (!html) {
    return '';
  }

  if (typeof document === 'undefined') {
    return html.replace(/&amp;nbsp;|&nbsp;|\u00a0/g, ' ');
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  const decodedHtml = textarea.value || html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

  let currentNode = walker.nextNode();
  while (currentNode) {
    currentNode.textContent = (currentNode.textContent || '').replace(/\u00a0/g, ' ');
    currentNode = walker.nextNode();
  }

  return doc.body.innerHTML;
}

export const DEFAULT_LESSON_READ_TIME = 15;

export function getLessonReadTimeMinutes(estimatedTimeMinutes: number | null | undefined): number {
  return estimatedTimeMinutes ?? DEFAULT_LESSON_READ_TIME;
}

const LEARNING_OBJECTIVE_PREFIX = /^by the end of this lesson/i;

export function hasRichHtmlContent(html: string | null | undefined): boolean {
  return extractParagraphText(html || '').length > 0;
}

export function prepareLessonObjectiveHtml(html: string): string {
  if (!html?.trim()) {
    return '';
  }

  if (typeof document === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(normalizeRichHtml(html), 'text/html');

  doc.body.querySelectorAll('p, li, h2, h3, h4').forEach((node) => {
    const text = (node.textContent || '').trim();
    if (LEARNING_OBJECTIVE_PREFIX.test(text)) {
      node.remove();
    }
  });

  return doc.body.innerHTML.trim();
}

export function extractLearningObjectives(html: string): string[] {
  if (!html?.trim()) {
    return [];
  }

  const listItems = extractListItems(html);
  if (listItems.length > 0) {
    return listItems.filter((item) => !LEARNING_OBJECTIVE_PREFIX.test(item.trim()));
  }

  return extractParagraphText(html).filter(
    (item) => !LEARNING_OBJECTIVE_PREFIX.test(item.trim()),
  );
}

function extractListItems(html: string): string[] {
  if (typeof document === 'undefined') {
    const matches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return matches
      .map((item) =>
        item
          .replace(/<li[^>]*>/i, '')
          .replace(/<\/li>/i, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/&amp;nbsp;|&nbsp;|\u00a0/g, ' ')
          .trim(),
      )
      .filter(Boolean);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(normalizeRichHtml(html), 'text/html');
  return Array.from(doc.body.querySelectorAll('li'))
    .map((node) => (node.textContent || '').replace(/\u00a0/g, ' ').trim())
    .filter(Boolean);
}

export function extractParagraphText(html: string): string[] {
  if (!html) {
    return [];
  }

  if (typeof document === 'undefined') {
    return html
      .replace(/<[^>]*>/g, '\n')
      .replace(/&amp;nbsp;|&nbsp;|\u00a0/g, ' ')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(normalizeRichHtml(html), 'text/html');
  const blocks = Array.from(doc.body.querySelectorAll('p, li, h2, h3, h4'));

  const values = blocks
    .map((node) => (node.textContent || '').replace(/\u00a0/g, ' ').trim())
    .filter(Boolean);

  if (values.length > 0) {
    return values;
  }

  const fallback = (doc.body.textContent || '').replace(/\u00a0/g, ' ').trim();
  return fallback ? [fallback] : [];
}
