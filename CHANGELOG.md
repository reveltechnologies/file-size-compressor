# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--- To add private notes or comments in this changelog that won't show in the rendered release, use markdown comments like this. -->

## [1.0.0] - 2026-10-29

First release of the web app.

### Added
- Shrink a video, photo or PDF to fit an upload limit, entirely in the browser; files never leave the device.
- Size presets: Discord Free, WhatsApp and Email / Gmail for video; Strict Portal ID and Standard Form for photos; Visa / Uni Portal, Standard Doc and Email Packet for PDFs; plus a custom limit.
- Video shrinking with ffmpeg.wasm (MP4, MOV, WebM, MKV, GIF → MP4), with automatic retries when a result comes out slightly too big.
- Smart optimize for video: HDR → SDR, 60 → 30 FPS, and a lower resolution when the limit is tight.
- Mute audio option, so the whole size budget goes to the picture.
- A warning before shrinking a video that would look very blurry, with an option to shrink it anyway.
- Photo shrinking (JPG, PNG, WebP, HEIC / HEIF) that finds the best quality and size that fits.
- PDF shrinking: removes edit history and unused data, then re-compresses large photos and scans.
- Combine several photos into one A4 PDF that fits the chosen size.
- Remove hidden data: GPS location, camera serial numbers, author tags and PDF metadata.
- Savings receipt showing the before and after size, and a clear warning when a file can't get under the limit.
- Progress screen with steps (Preparing, Shrinking, Done) and a bar that never goes backwards.
- Shared `@revel/core` package (presets, bitrate maths, ffmpeg arguments, JPEG metadata, photo fitting, PDF layout) with unit tests, ready for the upcoming Android app.
