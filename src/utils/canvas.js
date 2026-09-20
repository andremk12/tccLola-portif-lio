export function canvasPoint(clientX, clientY, rect, width, height) {
  return {
    x: (clientX - rect.left) * width / rect.width,
    y: (clientY - rect.top) * height / rect.height,
  }
}
