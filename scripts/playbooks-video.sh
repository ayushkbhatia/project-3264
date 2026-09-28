#!/usr/bin/env bash
# Builds the Playbooks hero video from the design's source clip (MOTION.md § Hero):
#
#   public/video/playbooks-hero.mp4       boomerang, 1756×1176, H.264 CRF 25   (~6.3MB)
#   public/video/playbooks-hero-960.mp4   the same at 960 wide, CRF 26, phones (~2.0MB)
#   public/img/playbooks/hero-poster.jpg  first frame, served as AVIF/WebP by next/image
#
#   scripts/playbooks-video.sh <source.mp4>
#
# The source is the handoff's clip (README: 1756×1176, 13.04s, 24fps, 313 frames, a single
# keyframe). The boomerang is forward + reversed with the duplicate frame dropped at each turn:
# 313 + 312 − 1 = 624 frames (26.0s); frame 312 is the first turn, and the loop point returns to
# frame 0. -g 24 puts a keyframe every second so the loop's seek back to 0 is cheap.
#
# Departures from MOTION.md, both measured on this clip:
# - CRF 25, not 20: CRF 20 is 13.6MB for SSIM 0.9955 against the source; CRF 25 is 6.3MB at
#   0.9923, indistinguishable at 1440 and 1920 wide.
# - No WebM. VP9 bought no saving at equal quality on this starfield: CRF 29 was 5.5MB at SSIM
#   0.9904 (below the MP4's 0.9923), CRF 33 was 4.2MB at 0.9894. A 960-wide MP4 for phones
#   saves more than VP9 would.
set -euo pipefail
SRC="${1:?usage: scripts/playbooks-video.sh <source.mp4>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BOOMERANG="[0:v]split[f][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[f][r]concat=n=2:v=1:a=0,trim=end_frame=624,setpts=PTS-STARTPTS"
X264=(-an -c:v libx264 -pix_fmt yuv420p -preset slow -g 24 -movflags +faststart)

ffmpeg -y -v error -i "$SRC" -filter_complex "${BOOMERANG}[v]" -map "[v]" "${X264[@]}" -crf 25 \
  "$ROOT/public/video/playbooks-hero.mp4"
ffmpeg -y -v error -i "$SRC" -filter_complex "${BOOMERANG},scale=960:-2[v]" -map "[v]" "${X264[@]}" -crf 26 \
  "$ROOT/public/video/playbooks-hero-960.mp4"
ffmpeg -y -v error -i "$SRC" -frames:v 1 -q:v 2 "$ROOT/public/img/playbooks/hero-poster.jpg"
ls -la "$ROOT/public/video/playbooks-hero.mp4" "$ROOT/public/video/playbooks-hero-960.mp4" "$ROOT/public/img/playbooks/hero-poster.jpg"
