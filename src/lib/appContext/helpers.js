import { fetchURI } from '@lib/requests';
import { getDescriptorFromList } from "@lib/descriptor";
import { isArray } from 'lodash';
import { parseDescriptor } from "@lib/descriptor";

export const loadTabContent = async (tab) => {
  if (!tab) return;
  if (tab.loaded === false) {
    const {source={}, descriptor} = tab;
    const tabTemplate = { ...tab, loaded: true, verses: [] };
    switch(source && source.type) {
      case 'search': {
        if (!source.text) return {...tabTemplate, descriptor: ''};
        const data = await fetchURI(`modules/${source.module}/search/${encodeURIComponent(source.text)}`);
        return {
          ...tabTemplate,
          descriptor: getDescriptorFromList(data),
          verses: isArray(data) ? data : [],
        };
      }
      case 'refs': {
        if (!source.descriptor) return {...tabTemplate, descriptor: ''};
        const data = await fetchURI(`text/${encodeURIComponent(source.descriptor)}`);
        return {
          ...tabTemplate,
          descriptor: source.descriptor,
          verses: isArray(data) ? data : [],
        }
      }
      default: {
        if (!descriptor) return tabTemplate;
        const data = await fetchURI(`text/${encodeURIComponent(descriptor)}`);
        return {
          ...tabTemplate,
          descriptor,
          verses: isArray(data) ? data : [],
        };
      }
    }
  }
}


export const nearChapterDescriptorsGetter = (
  {modules}
) => {
  return (descriptor) => {
    const parsed = parseDescriptor(descriptor);
    if (parsed.length !== 1) return null;
    const { module, book, chapter, verses } = parsed[0];
    const currentModule = modules.find(m => m.shortName === module);
    if (!!verses) return null; // only 1 chapter is supported
    if (!currentModule) return null;
    const bookIndex = currentModule.books.findIndex((b) => b.name === book || b.shortName.indexOf(book) !== -1);
    if (bookIndex === -1) return null;

    const prev = chapter > 1
      ? { bookIndex, chapter: chapter - 1 }
      : bookIndex === 0
        ? null
        : { bookIndex: bookIndex-1, chapter: currentModule.books[bookIndex-1].chapterQty };

    const next = chapter < currentModule.books[bookIndex].chapterQty
      ? { bookIndex, chapter: chapter + 1 }
      : bookIndex === currentModule.books.length - 1
        ? null
        : { bookIndex: bookIndex+1, chapter: 1 };

    const prevBook = prev && currentModule.books[prev.bookIndex];
    const nextBook = next && currentModule.books[next.bookIndex];
    const prevDescriptor = prev && `(${module})${prevBook.name}.${prev.chapter}`;
    const nextDescriptor = next && `(${module})${nextBook.name}.${next.chapter}`;
    const chapterCount = currentModule.books[bookIndex].chapterQty;

    return {
      prev: prev && {module, book: prevBook.name, chapter: prev.chapter, descriptor: prevDescriptor},
      current: {module, book, chapter, descriptor, chapterCount},
      next: next && {module, book: nextBook.name, chapter: next.chapter, descriptor: nextDescriptor},
    };
  }
}
