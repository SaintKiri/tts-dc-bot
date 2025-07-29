const assert = require('assert')
const { describe } = require('mocha')
const { sanitizeBilibiliURL, sanitizeYouTubeURL } = require('../commands/play')
// NOTE: ^ these functions return an object, need deepEqual to assert them. ;

it("Validate Bilibili URL", function () {
  const validURL = "https://www.bilibili.com/video/BV1T59hYVEQr"
  const videoID = "BV1T59hYVEQr"
  const validShare = "【全年胜率95.2%？感受一下14年中国大师赛林丹恐怖的压迫感。冷知识2014年林丹的胜率是95.2%这一年的林丹除了排名低没有其他弱点】 https://www.bilibili.com/video/BV1T59hYVEQr/?share_source=copy_web&vd_source=53e4377d22b6dd21c83a4e6a9e9ecace"
  const invalidURL = "https://www.bilibili.com/video/ioqjeojqiowjeioqwe"

  assert.deepEqual(sanitizeBilibiliURL(validURL), [validURL, videoID]);
  assert.deepEqual(sanitizeBilibiliURL(invalidURL), null);

  assert.deepEqual(sanitizeBilibiliURL(validShare), [validURL, videoID]);

  // Sanity check
  assert.deepEqual(sanitizeYouTubeURL(validURL), null);
  assert.deepEqual(sanitizeYouTubeURL(invalidURL), null);
});

it("Validate YouTube URL", function () {
  const validURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  const videoID = "dQw4w9WgXcQ"
  const validShareURL = "https://youtu.be/dQw4w9WgXcQ?si=Vzv5koom2AXhYC0D"
  const invalidURL = "https://www.yotube.com/oiqjweiojqiowjeioqwioeqiojweioqwieo"
  assert.deepEqual(sanitizeYouTubeURL(validURL), [validURL, videoID]);
  assert.deepEqual(sanitizeYouTubeURL(invalidURL), null);

  assert.deepEqual(sanitizeYouTubeURL(validShareURL), [validURL, videoID]);

  // Sanity check
  assert.deepEqual(sanitizeBilibiliURL(validURL), null);
  assert.deepEqual(sanitizeBilibiliURL(invalidURL), null);
});