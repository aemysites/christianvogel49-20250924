/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header row
  const headerRow = ['Search (search20)'];

  // The query index URL is not present in the source HTML, so use a placeholder or site-specific value.
  // If you know the site index, put it here. Otherwise, use a placeholder for the editor to fill in.
  // Example: 'https://www.hofer.si/query-index.json' or a generic placeholder
  const queryIndexUrl = 'https://www.hofer.si/query-index.json';

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [queryIndexUrl],
  ], document);

  element.replaceWith(table);
}
