export function compressFile(file, threshold = 1500000) {
  return new Promise((resolve) => {
    // threshold为1.5MB
    if (file.file.size > threshold) {
      // 创建Canvas对象(画布)
      const canvas = document.createElement('canvas')
      // 获取对应的CanvasRenderingContext2D对象(画笔)
      const context = canvas.getContext('2d')
      // 创建新的图片对象
      const img = new Image()
      // 指定图片的DataURL(图片的base64编码数据)
      img.src = file.content
      // 监听浏览器加载图片完成，然后进行进行绘制
      img.onload = () => {
        // 指定canvas画布大小，该大小为最后生成图片的大小
        canvas.width = 400
        canvas.height = 300
        /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
                如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。*/
        context.drawImage(img, 0, 0, 400, 300)
        // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
        file.content = canvas.toDataURL(file.file.type, 0.92)
      }
    }
    resolve(file)
  })
}
