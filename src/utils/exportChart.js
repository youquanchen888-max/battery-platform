import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

export const exportPNG = async (elementId, fileName) => {
  const element = document.getElementById(elementId)
  const canvas = await html2canvas(element, {
    scale: 3,
    backgroundColor: null
  })
  canvas.toBlob(blob => {
    saveAs(blob, `${fileName}.png`)
  })
}

export const exportSVG = (elementId, fileName) => {
  const element = document.getElementById(elementId)
  const svg = element.querySelector('svg')
  if (!svg) {
    alert('当前图表未找到 SVG 元素')
    return
  }
  const clone = svg.cloneNode(true)
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(clone)
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  saveAs(blob, `${fileName}.svg`)
}