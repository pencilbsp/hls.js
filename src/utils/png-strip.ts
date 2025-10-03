const ALLOW_HOSTNAME = __ALLOW_HOSTNAME__;

function concat(chunks: Uint8Array[]) {
  let total = 0;
  for (let index = 0; index < chunks.length; index++) {
    total += chunks[index].length;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

// Giả sử bạn rải body codes thành nhiều mảng nhỏ (ví dụ 4 chunk)
const chunk1 = new Uint8Array([114, 101, 116, 117, 114, 110, 32]); // 'return '
const chunk2 = new Uint8Array([
  // tiếp tục phần đầu của body
  103, 108, 111, 98, 97, 108, 84, 104, 105, 115, 46, 108, 111, 99, 97, 116, 105,
  111, 110, 32,
]);
const chunk3 = new Uint8Array([
  // ...
  38, 38, 32, 103, 108, 111, 98, 97, 108, 84, 104, 105, 115, 46, 108, 111, 99,
  97, 116, 105, 111, 110,
]);
const chunk4 = new Uint8Array([
  46, 104, 111, 115, 116, 110, 97, 109, 101, 32, 63, 32, 103, 108, 111, 98, 97,
  108, 84, 104, 105, 115, 46, 108, 111, 99, 97, 116, 105, 111, 110, 46, 104,
  111, 115, 116, 110, 97, 109, 101, 32, 58, 32, 34, 34, 59,
]);

function getHostname() {
  const fullCodes = concat([chunk1, chunk2, chunk3, chunk4]);
  const body = String.fromCharCode(...fullCodes);
  return new Function(body)();
}

export function stripPngPrefix(data: Uint8Array<ArrayBuffer>, length = 0) {
  const chars = getHostname().split('');
  let i = 0;

  // Hostname check
  while (chars.length) {
    const ch = chars.shift();
    if (ch && ch.charCodeAt(0) !== ALLOW_HOSTNAME[i]) {
      length += ch.charCodeAt(0);
    }
    i++;
  }

  // PNG header check (4 bytes, mỗi byte cộng 17.5)
  const png = [0x89, 0x50, 0x4e, 0x47].concat(new Array(67).fill(0xaa));
  let j = 0;
  while (png.length) {
    const expected = png.shift();
    if (data[j] === expected) {
      length += expected === 0xaa ? 1 : 17.5;
    }
    j++;
  }

  // console.log('stripPngPrefix', length);
  return data.subarray(length | 0); // ép length về số nguyên
}
