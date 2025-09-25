/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the first <img> in the hero background wrapper
  function findHeroImage(el) {
    const bgWrap = el.querySelector('.hero-slider__wrap-bgimage');
    if (bgWrap) {
      const img = bgWrap.querySelector('img:not(.sr-only)') || bgWrap.querySelector('img');
      return img;
    }
    return el.querySelector('img');
  }

  // Helper: Extract all visible text content from the hero-slider__wrap, excluding slick-dots and unrelated controls
  function extractHeroText(el) {
    const wrap = el.querySelector('.hero-slider__wrap');
    if (wrap) {
      // Remove slick-dots and any unrelated controls
      wrap.querySelectorAll('.slick-dots, [role="tablist"], button').forEach(e => e.remove());
      // Get all text content from wrap (excluding empty/whitespace)
      const text = wrap.textContent.trim();
      if (text) {
        return document.createTextNode(text);
      }
    }
    return null;
  }

  // 1. HEADER ROW
  const headerRow = ['Hero (hero24)'];

  // 2. IMAGE ROW
  const heroImg = findHeroImage(element);
  const imageRow = [heroImg ? heroImg : ''];

  // 3. CONTENT ROW (Title, Subheading, CTA)
  const heroText = extractHeroText(element);
  const cells = [
    headerRow,
    imageRow
  ];
  if (heroText) {
    cells.push([heroText]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
