// 將 文化部 - 107年度文化部書面之公共工程及採購契約[1] 轉成 csv 檔
// [1]: https://www.moc.gov.tw/information_393_74853.html
//
// usage:
//    node index.js > out.csv
const req = require('request-promise')
const {parse} = require('node-html-parser')
const csvStringify = require('csv-stringify')

async function main () {
  let html = await req('https://www.moc.gov.tw/information_393_74853.html')

  let rows = []

  let t = parse(html).querySelector('tbody').childNodes
  t.forEach(tr => {
    let r = tr.childNodes.map(x => x.childNodes[0].rawText)

    // convert '總決標金額' to number

    r[r.length - 1] = +r[r.length - 1].replace(/,/g, '')

    rows.push(r)
  })

  csvStringify(rows).pipe(process.stdout)
}

main()
