import { parseDescriptor } from "@lib/descriptor";

const mem = (
  {modules}
) => {
  return (descriptor) => {
    const parsed = parseDescriptor(descriptor);
    if (parsed.length !== 1 || parsed[0].verses) return null; // only 1 chapter is supported
    const { module, book, chapter } = parsed[0];
    const currentModule = modules.find(m => m.BibleShortName === module);
    if (!currentModule) return null;
    const bookIndex = currentModule.books.findIndex((b) => b.FullName === book || b.ShortName.indexOf(book) !== -1);
    if (bookIndex === -1) return null;

    const prev = chapter > 1
      ? { bookIndex, chapter: chapter - 1 }
      : bookIndex === 0
        ? null
        : { bookIndex: bookIndex-1, chapter: currentModule.books[bookIndex-1].ChapterQty };

    const next = chapter < currentModule.books[bookIndex].ChapterQty
      ? { bookIndex, chapter: chapter + 1 }
      : bookIndex === currentModule.books.length - 1
        ? null
        : { bookIndex: bookIndex+1, chapter: 1 };

    const prevBook = prev && currentModule.books[prev.bookIndex];
    const nextBook = next && currentModule.books[next.bookIndex];
    const prevDescriptor = prev && `(${module})${prevBook.FullName}.${prev.chapter}`;
    const nextDescriptor = next && `(${module})${nextBook.FullName}.${next.chapter}`;
    const chapterCount = currentModule.books[bookIndex].ChapterQty;

    return {
      prev: prev && {module, book: prevBook.FullName, chapter: prev.chapter, descriptor: prevDescriptor},
      current: {module, book, chapter, descriptor, chapterCount},
      next: next && {module, book: nextBook.FullName, chapter: next.chapter, descriptor: nextDescriptor},
    };
  }
}

export default mem;