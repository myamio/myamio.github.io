const fs = require('fs');

const file = 'src/components/RssFeedItem.astro';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div id={uniqueId} class="mt-3 text-sm hidden">',
  '<div id={uniqueId} class="mt-3 text-sm hidden relative z-10">'
);

content = content.replace(
  '<span class="text-xs font-semibold text-gray-500 uppercase tracking-widest mr-2">Latest</span>',
  '<span class="text-xs font-semibold text-gray-500 uppercase tracking-widest mr-2 flex-shrink-0 mt-0.5">Latest</span>'
);

content = content.replace(
  '<a href="#" class="rss-link text-gray-700 hover:text-black hover:underline transition-colors truncate inline-block max-w-full align-middle">',
  '<a href="#" target="_blank" rel="noopener noreferrer" class="rss-link text-gray-700 hover:text-black hover:underline transition-colors break-words min-w-0 flex-1 leading-snug">'
);

content = content.replace(
  "container.classList.remove('hidden');",
  "container.classList.remove('hidden');\n        container.classList.add('flex', 'items-start');"
);

fs.writeFileSync(file, content);
console.log('patched');
