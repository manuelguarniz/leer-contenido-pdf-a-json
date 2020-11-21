const fileToBinary = file => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = function() {
    const b64 = reader.result.split(',')[1]
    const binary = atob(b64)
    resolve(binary)
  }
  reader.readAsDataURL(file)
})

PDFJS.disableWorker = true

const getDocument = (source, isURL) => {
  if (isURL) {
    return PDFJS.getDocument(source)
  }
  return PDFJS.getDocument({ data: source })
}

const getPages = async (doc) => {
  const numPages = doc.numPages
  const pages = []
  for (let i = 0; i < numPages; i++) {
    pages.push(await doc.getPage(i + 1))
  }
  return pages
}

const convertToText = async (source) => {
  const doc = await getDocument(source)
  const pages = await getPages(doc)
  const contents = []

  for (let i = 0; i < pages.length; i++) {
    const content = await pages[i].getTextContent()
    const text =
          content
            .items
            .reduce((acc, item) => (acc.str || acc) + item.str)
    contents.push(text)
  }
  return contents
}

async function processPDF(pdf) {
  const binary = await fileToBinary(pdf)
  const contents = await convertToText(binary, false)
  const text = contents.join('\n')
  const download = document.getElementById('download')
  download.classList.remove('hidden')
  const blob = new Blob([text], { type: 'text/plain '})
  download.href = URL.createObjectURL(blob)
}
