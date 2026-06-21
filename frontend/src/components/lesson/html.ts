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
  const blocks = Array.from(doc.body.querySelectorAll('p, li'));

  const values = blocks
    .map((node) => (node.textContent || '').replace(/\u00a0/g, ' ').trim())
    .filter(Boolean);

  if (values.length > 0) {
    return values;
  }

  const fallback = (doc.body.textContent || '').replace(/\u00a0/g, ' ').trim();
  return fallback ? [fallback] : [];
}
