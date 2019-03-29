// usage:
//   node index.js raw.xml raw.schema.csv

const csv = require('async-csv')
const fs = require('fs')
const xml = require('xml-js')

async function main () {
  let schema = await csv.parse(fs.readFileSync(process.argv[3]))

  let data = JSON.parse(xml.xml2json(fs.readFileSync(process.argv[2]).toString()))
  let rows = data.elements[0].elements

  let headers = []
  let csvRows = []

  for (let h of schema) {
    if (h[0] === 'name') continue
    if (['款', '項', '目', '節'].includes(h[0])) continue

    headers.push(h[1])
  }

  for (let r of rows) {
    let kv = r.elements.map(e => [e.name, e.elements ? e.elements[0].text : null])
    let row = []

    for (let h of schema) {
      if (h[0] === 'name') continue
      if (['款', '項', '目', '節'].includes(h[0])) continue

      let i = kv.findIndex(e => e[0] === h[0])
      if (i < 0) console.log('not founed', i, h[0])

      row.push(kv[i][1])
    }
    csvRows.push(row)
  }

  let out = await csv.stringify(csvRows, { header: true, columns: headers })
  console.log(out)
}

main()
