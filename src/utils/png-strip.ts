const PNG_1PX_LENGTH = 70;

export function stripPngPrefix(
  data: Uint8Array<ArrayBuffer>,
): Uint8Array<ArrayBuffer> {
  // Kiểm tra header PNG
  if (
    data.length > PNG_1PX_LENGTH &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47
  ) {
    return data.subarray(PNG_1PX_LENGTH);
  }
  return data;
}
