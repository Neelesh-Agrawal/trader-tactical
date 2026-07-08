function wrapLessonTables(doc: Document) {
  doc.body.querySelectorAll('figure').forEach((figure) => {
    if (!figure.querySelector('table')) return;
    figure.classList.add('lesson-table-scroll');
    figure.removeAttribute('style');
  });

  doc.body.querySelectorAll('table').forEach((table) => {
    const parent = table.parentElement;
    if (parent?.classList.contains('lesson-table-scroll')) {
      table.removeAttribute('width');
      table.style.removeProperty('width');
      table.style.maxWidth = '100%';
      return;
    }

    const wrapper = doc.createElement('div');
    wrapper.className = 'lesson-table-scroll';
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);

    table.removeAttribute('width');
    table.style.removeProperty('width');
    table.style.maxWidth = '100%';
    table.style.tableLayout = 'auto';
  });

  doc.body.querySelectorAll('[style*="float"], [style*="position:absolute"], [style*="position: absolute"]').forEach((node) => {
    if (node instanceof HTMLElement && node.querySelector('table')) {
      node.style.removeProperty('float');
      node.style.removeProperty('position');
    }
  });
}

/** Fix common CMS encoding glitches (bullets/dashes/apostrophes that render as "?"). */
function repairMojibakeText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\uFFFD/g, '')
    // Apostrophe corruption: today?s → today's, you?ll → you'll
    .replace(/([A-Za-z])\?([A-Za-z])/g, "$1'$2")
    // Spaced "?" usually came from an en/em dash in prose
    .replace(/\s+\?\s+/g, ' — ')
    // Leading list markers that became "?" or leftover bullets
    .replace(/^[\s?•●▪◦·–—\-]+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip HTML tags from CKEditor / admin content for plain-text UI (quiz, etc.). */
export function stripHtml(html: string): string {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return repairMojibakeText(doc.body.textContent || '');
}

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
    let text = (currentNode.textContent || '').replace(/\u00a0/g, ' ').replace(/\uFFFD/g, '');
    // Apostrophe corruption inside rich HTML text nodes
    text = text.replace(/([A-Za-z])\?([A-Za-z])/g, "$1'$2");
    // Mid-sentence spaced "?" → em dash (bullet lines handled separately)
    text = text.replace(/(\S)\s+\?\s+(\S)/g, '$1 — $2');
    currentNode.textContent = text;
    currentNode = walker.nextNode();
  }

  wrapLessonTables(doc);

  return doc.body.innerHTML;
}

const MODULE_OBJECTIVE_HEADING = /^by the end of this module/i;

/**
 * Split module description HTML into intro copy + objective bullets
 * so the Module page can render a clean layout.
 */
export function parseModuleDescription(html: string): {
  introHtml: string;
  objectiveHeading: string | null;
  objectives: string[];
} {
  if (!html?.trim()) {
    return { introHtml: '', objectiveHeading: null, objectives: [] };
  }

  if (typeof document === 'undefined') {
    return {
      introHtml: normalizeRichHtml(html),
      objectiveHeading: null,
      objectives: [],
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(normalizeRichHtml(html), 'text/html');
  const blocks = Array.from(doc.body.children);
  const introNodes: Element[] = [];
  let objectiveHeading: string | null = null;
  const objectives: string[] = [];
  let pastHeading = false;

  for (const block of blocks) {
    const text = repairMojibakeText(block.textContent || '');
    if (!text) continue;

    if (MODULE_OBJECTIVE_HEADING.test(text)) {
      pastHeading = true;
      objectiveHeading = text.replace(/:?\s*$/, '');
      continue;
    }

    if (pastHeading) {
      // Objectives may be <ul>/<li>, or a <p> with <br>-separated lines / bullet chars
      if (block.tagName === 'UL' || block.tagName === 'OL') {
        Array.from(block.querySelectorAll('li')).forEach((li) => {
          const item = repairMojibakeText(li.textContent || '');
          if (item) objectives.push(item);
        });
      } else {
        const htmlParts = (block.innerHTML || '')
          .split(/<br\s*\/?>/i)
          .map((part) => repairMojibakeText(part.replace(/<[^>]*>/g, ' ')))
          .filter(Boolean);
        if (htmlParts.length > 1) {
          objectives.push(...htmlParts);
        } else if (text) {
          objectives.push(text);
        }
      }
      continue;
    }

    introNodes.push(block);
  }

  // Fallback: no heading — keep full HTML as intro
  if (!pastHeading) {
    return {
      introHtml: doc.body.innerHTML.trim(),
      objectiveHeading: null,
      objectives: [],
    };
  }

  const introDoc = document.createElement('div');
  introNodes.forEach((node) => introDoc.appendChild(node.cloneNode(true)));

  return {
    introHtml: introDoc.innerHTML.trim(),
    objectiveHeading,
    objectives,
  };
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
