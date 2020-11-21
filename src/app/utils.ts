declare var pdfjsLib;

export const getDocument = (source, isURL?) => {
  if (isURL) {
    return pdfjsLib.getDocument(source).promise;
  }
  return pdfjsLib.getDocument({ data: source }).promise;
};

export const getStrContent = async (contentPage) => {
    const r = await contentPage.getTextContent();
    const contents = [];
    // const text =
    //       r
    //         .items
    //         .reduce((acc, item) => {
    //           return acc + item.str + '|';
    //         }, '');
    // contents.push(text);
    contents.push(r.items.map(i => i.str));
    return contents;
};

export const getContentPage = async (doc, page) => {
  const res = await doc.getPage(page);
  const content = await getStrContent(res);
  return content;
};

export const convertToText = async (source, isURL?) => {
  const contents = [];
  const doc = await getDocument(source, isURL);
  const numPages = await doc.numPages;
  for (let page = 1; page <= numPages; page++) {
    const content = await getContentPage(doc, page);
    contents.push(content);
  }
  return contents;
};
