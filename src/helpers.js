function pipeToUndefined(val) {
  if (val) return val
  return undefined
}

function SeriesDataValueItemStyle(color1, color2, type) {
  return {
    color: {
      type,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: color1 // 0% 处的颜色
        },
        {
          offset: 1,
          color: color2 // 100% 处的颜色
        }
      ]
    }
  }
}

function timeFormatter(str) {
  var t = new Date(str)
  var year = t.getFullYear() + ''
  var month = t.getMonth() + ''
  var date = t.getDate() + ''

  var time = t.toTimeString().slice(0, 5)
  return `${year}-${month.length > 1 ? month : '0' + month}-${
    date.length > 1 ? date : '0' + date
  } ${time}`
}

export { pipeToUndefined, SeriesDataValueItemStyle, timeFormatter }
