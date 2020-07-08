function SeriesDataValueItemStyle(value, color1, color2, type) {
  return {
    value,
    itemStyle: {
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
}

export { SeriesDataValueItemStyle }
