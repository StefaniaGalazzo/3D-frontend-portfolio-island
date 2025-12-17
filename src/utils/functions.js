export function cssHexToThreeColor(hex) {
  return new THREE.Color(hex.slice(0, 7))
}
