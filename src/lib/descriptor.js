import * as _ from 'lodash';

export const verseBreak = {
  module: '/',

  getDescriptor: function() {
    return '/';
  }
};

const descrRE = /^(\(([^)]+)\))?(([^.]+)\.)?(\d+)?(:(\d+)(-(\d+))?)?$/;
export const parseDescriptor = descr => {
  if (!descr) return [];
  const parts = descr.replace(/,/g, ';:').split(';');
  let moduleDescr = '';
  let bookDescr = '';
  let chapterDescr = '';

  return _.compact(parts.map(p => {
    if (p === '') return {
      module: '/',
      book: null,
      chapter: null,
      verses: null,
    };
    const info = descrRE.exec(p);
    if (!info) return null;
    if (info[2]) moduleDescr = info[2];
    if (info[4]) bookDescr = info[4];
    if (info[5]) chapterDescr = info[5];
    const v1 = info[7];
    const v2 = info[9];
    const verses = _.isUndefined(v1) ? null : (_.isUndefined(v2) ? [+v1] : [+v1, +v2]);
    if (!moduleDescr || !bookDescr || !chapterDescr) return null;
    return {
      module: moduleDescr,
      book: bookDescr,
      chapter: +chapterDescr,
      verses,
    };
  }));
}

export const getDescriptorFromList = (verses) => {
  return compactDescriptor(verses.map(v => v.descriptor).join(';'));
}

export function compactDescriptor(descriptor, ) {
  const list = parseDescriptor(descriptor);
  let res = [];

  let module = null;
  let book = null;
  let chapter = null;

  list.forEach(o => {
    const r = res[res.length - 1];
    if (res.length > 0
      && module === o.module 
      && book === o.book 
      && chapter === o.chapter 
      && ((r.verses[1] || r.verses[0]) + 1 === o.verses[0])) {
      r.verses = [r.verses[0], (o.verses[1] || o.verses[0])]
    } else {
      res.push({
        ...o,
        module: (r && module === o.module) ? '' : o.module,
        book: (r && module === o.module && book === o.book) ? '' : o.book,
        chapter: (r && module === o.module && book === o.book && chapter === o.chapter) ? '' : o.chapter,
      });
    }

    module = o.module;
    book = o.book;
    chapter = o.chapter;
  });

  const ret = res.map((o, index) => {
    if (o.module === '/') return '/';
    let module = o.module ? `(${o.module})` : '';
    let book = o.book ? `${o.book}.` : '';
    let chapter = o.chapter ? `${o.chapter}` : '';
    let verses = (o && o.verses && o.verses.join('-')) || '';
    if (verses) verses = `:${verses}`;
    return `${index===0 || res[index-1].module === '/'?'':';'}${module}${book}${chapter}${verses}`;
  }).join('').replace(/;:/g, ',');

  return ret;
}
