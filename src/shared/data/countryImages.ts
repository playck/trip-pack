// scripts/fetch_images.py 스크립트에 의해 자동 생성된 파일.

// 임시 배경 이미지
export const DEFAULT_BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80", // 여행 가방
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80", // 비행기
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80", // 산과 호수
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", // 도시 야경
];

export const countryImages: Record<string, string[]> = {
  KR: [
    "https://images.unsplash.com/photo-1540998145333-e2eef1a9822d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxTb3V0aCUyMEtvcmVhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1740785978879-506357754d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxTb3V0aCUyMEtvcmVhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  TH: [
    "https://images.unsplash.com/photo-1741245472266-c1736ecb2381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://plus.unsplash.com/premium_photo-1693149386423-2e4e264712e5?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1741245472300-caf34efb12cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxUaGFpbGFuZCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  SG: [
    "https://images.unsplash.com/photo-1758391792870-3ff9c3dd53f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxTaW5nYXBvcmUlMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1705306704443-2777614e5b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxTaW5nYXBvcmUlMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  MV: [
    "https://images.unsplash.com/photo-1632904103494-b6e083770d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxNYWxkaXZlcyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1537348175652-856a74097e48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxNYWxkaXZlcyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1618986114747-4f51c8ca11cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxNYWxkaXZlcyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  PH: [
    "https://images.unsplash.com/photo-1736147936459-8cb73ff9d8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1714746977532-300e30c78e64?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1760549310130-d970c7cf2d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxQaGlsaXBwaW5lcyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  VN: [
    "https://images.unsplash.com/photo-1723411266945-a8ce50dcfff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxWaWV0bmFtJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1722807359333-5a7885d67675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxWaWV0bmFtJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1723065195938-30a5e64036e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxWaWV0bmFtJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  KH: [
    "https://images.unsplash.com/photo-1707912258684-b925bcfa8568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxDYW1ib2RpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1644652082066-c72a631bb72e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxDYW1ib2RpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1762091486050-5be11ee3c8d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxDYW1ib2RpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  MY: [
    "https://images.unsplash.com/photo-1558877398-5a0482fe7ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxNYWxheXNpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1552618964-d82464bde956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxNYWxheXNpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1735554936572-dbc7c48161b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxNYWxheXNpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  ID: [
    "https://images.unsplash.com/photo-1542724752-bd85a183bc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1752555642487-064415bc39dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxJbmRvbmVzaWElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1542725231-e6ff634bf0f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxJbmRvbmVzaWElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  LA: [
    "https://images.unsplash.com/photo-1686120552846-7caf1a345876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxMYW9zJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1697142430562-cdde0aede54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxMYW9zJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1642084964357-a8188eef679a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxMYW9zJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  TW: [
    "https://images.unsplash.com/photo-1661262745674-39c64785229f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxUYWl3YW4lMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1661262743380-622169dae686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxUYWl3YW4lMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1661262745836-d9f089d1816b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxUYWl3YW4lMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  IN: [
    "https://images.unsplash.com/photo-1619417889956-c701044fed86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1697198649995-8a9807c19083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxJbmRpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1727686669949-4d497a86ed9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxJbmRpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  NP: [
    "https://images.unsplash.com/photo-1709537059977-41ac39aa8216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxOZXBhbCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1709537058982-79582c246829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxOZXBhbCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1709537059340-a39cea6eb25b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxOZXBhbCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  LK: [
    "https://images.unsplash.com/photo-1714412953594-ce00b0d43467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1693749194787-6abfcf59d05f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxTcmklMjBMYW5rYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1743612135710-7e758e284679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxTcmklMjBMYW5rYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  CN: [
    "https://images.unsplash.com/photo-1630121007672-b1c873f066ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1586785521387-df575a5ead05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxDaGluYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1584546280299-fc907d9dc9b5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  JP: [
    "https://images.unsplash.com/photo-1764271835430-3964d8e79ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxKYXBhbiUyMHRyYWRpdGlvbmFsJTIwbmF0dXJlJTIwc2NlbmVyeXxlbnwxfDB8fHwxNzY0NDA2OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1750563452528-65ae4ff50e80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxKYXBhbiUyMHRyYWRpdGlvbmFsJTIwbmF0dXJlJTIwc2NlbmVyeXxlbnwxfDB8fHwxNzY0NDA2OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1742225912052-882435b5e1b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxKYXBhbiUyMHRyYWRpdGlvbmFsJTIwbmF0dXJlJTIwc2NlbmVyeXxlbnwxfDB8fHwxNzY0NDA2OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  WEU: [
    "https://images.unsplash.com/photo-1685379518596-7e2b240ac982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxXZXN0ZXJuJTIwRXVyb3BlJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1546635585-0bdefb90fd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxXZXN0ZXJuJTIwRXVyb3BlJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1582063411725-9d0778d662de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxXZXN0ZXJuJTIwRXVyb3BlJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  EEU: [
    "https://images.unsplash.com/photo-1758714820406-962e6fe19ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxFYXN0ZXJuJTIwRXVyb3BlJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1760650006801-620f1ec22564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxFYXN0ZXJuJTIwRXVyb3BlJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1759140496200-3379682a61e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxFYXN0ZXJuJTIwRXVyb3BlJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4OHww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  HR: [
    "https://images.unsplash.com/photo-1742052549897-7221bf15fe50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxDcm9hdGlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1742052679650-365ac3cbece2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxDcm9hdGlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1732980660907-0e0943ddea56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxDcm9hdGlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  SI: [
    "https://images.unsplash.com/photo-1613498055727-8d899f4b1600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxTbG92ZW5pYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1722978308023-fa4893f80cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxTbG92ZW5pYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1758198203258-e5f07cb847c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxTbG92ZW5pYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  ES: [
    "https://images.unsplash.com/photo-1728329549768-373643c0b29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxTcGFpbiUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1727990393353-cf9989015dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxTcGFpbiUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1634925009476-ac110ddb2caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxTcGFpbiUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  PT: [
    "https://images.unsplash.com/photo-1595609606968-febc701986f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxQb3J0dWdhbCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://plus.unsplash.com/premium_photo-1669193263033-b812b8622cea?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1763058866922-673216dc7147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxQb3J0dWdhbCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  MA: [
    "https://images.unsplash.com/photo-1763838546027-5ea880df8fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1763838546127-f44013ba35a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxNb3JvY2NvJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1758185362046-c4836a9d78ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxNb3JvY2NvJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDg5NXww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  TR: [
    "https://images.unsplash.com/photo-1657647083927-8befc2b5dc26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxUdXJrZXklMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1623321582796-3bad1e0912ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxUdXJrZXklMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1589366025085-d060e3f956e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxUdXJrZXklMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  GR: [
    "https://images.unsplash.com/photo-1722601671147-556737010ae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxHcmVlY2UlMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1722601671180-4ffd7602ce39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxHcmVlY2UlMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1722601671114-15efe2a30901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxHcmVlY2UlMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  EG: [
    "https://images.unsplash.com/photo-1705628078522-8cbb49acae1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxFZ3lwdCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1705628080778-f86b2f90a114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxFZ3lwdCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1738511576598-3fb4633d4742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxFZ3lwdCUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  GE: [
    "https://images.unsplash.com/photo-1738598348808-9ee0ccccfede?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxHZW9yZ2lhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1718488979049-03806d556850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxHZW9yZ2lhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1763235434181-365c5ed2458a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxHZW9yZ2lhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwMnww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  AZ: [
    "https://images.unsplash.com/photo-1753706874051-718700368d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxBemVyYmFpamFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1753706842889-ba63b4f3ccc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxBemVyYmFpamFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1641811350622-7fff1957c523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxBemVyYmFpamFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  AM: [
    "https://images.unsplash.com/photo-1646228110536-b319ee4c5dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxBcm1lbmlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1758811570149-5f78d28baa58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxBcm1lbmlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1762007275508-ac986ff0f2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxBcm1lbmlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwNXww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  ME: [
    "https://images.unsplash.com/photo-1734383266708-6783b9f12cc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxNaWRkbGUlMjBFYXN0JTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1754400534733-06ba59423253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxNaWRkbGUlMjBFYXN0JTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1758721028337-25cf37229bcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxNaWRkbGUlMjBFYXN0JTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkwNnww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  NEU: [
    "https://images.unsplash.com/photo-1758704280201-068a5bb3079b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxOb3J0aGVybiUyMEV1cm9wZSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1761236969200-7959359c7b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxOb3J0aGVybiUyMEV1cm9wZSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1760810925225-5ffdb7b7ec99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxOb3J0aGVybiUyMEV1cm9wZSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  AF: [
    "https://images.unsplash.com/photo-1705628078522-8cbb49acae1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxBZnJpY2ElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0OTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1705628080778-f86b2f90a114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxBZnJpY2ElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0OTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1602094777645-5701b6128003?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxBZnJpY2ElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0OTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  MN: [
    "https://images.unsplash.com/photo-1555089826-040d0a9c1b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxNb25nb2xpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1695554468837-35c3c3b1ee66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxNb25nb2xpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1695197943218-be1bb14b6894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxNb25nb2xpYSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  IMN: [
    "https://images.unsplash.com/photo-1555089826-040d0a9c1b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxJbm5lciUyME1vbmdvbGlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1657293496715-67c921181c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxJbm5lciUyME1vbmdvbGlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1667154492539-cbf80d791c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxJbm5lciUyME1vbmdvbGlhJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  HK: [
    "https://images.unsplash.com/photo-1720751566272-c186d080cc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxIb25nJTIwS29uZyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1691068013163-ee5c76c30c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxIb25nJTIwS29uZyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1708569382493-8dfb16b151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxIb25nJTIwS29uZyUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  MO: [
    "https://images.unsplash.com/photo-1758913313672-3c516325a45a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxNYWNhdSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1762237466461-cbcd6aef4da2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxNYWNhdSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1500245345695-05324f941713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxNYWNhdSUyMHRyYXZlbCUyMGxhbmRtYXJrfGVufDF8MHx8fDE3NjQ0MDQ5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  UZ: [
    "https://images.unsplash.com/photo-1727354484581-677b786ce608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxVemJla2lzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1719144065955-89a4dadaba41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxVemJla2lzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1742973266631-1af67f4a3722?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxVemJla2lzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  KZ: [
    "https://images.unsplash.com/photo-1759167631532-fbd52fb070d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxLYXpha2hzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1557841066-eefe351308b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxLYXpha2hzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxOXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1683334086574-5a7769553a98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxLYXpha2hzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkxOXww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  KG: [
    "https://images.unsplash.com/photo-1673200416814-6390030c96c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxLeXJneXpzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1673200448868-f9fcfe852c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxLeXJneXpzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1551188924-967544c805e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxLeXJneXpzdGFuJTIwdHJhdmVsJTIwbGFuZG1hcmt8ZW58MXwwfHx8MTc2NDQwNDkyMHww&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  AU: [
    "https://images.unsplash.com/photo-1748243262890-bffad63a7807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwxfHxBdXN0cmFsaWElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0OTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1628318135704-1983a8193247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwyfHxBdXN0cmFsaWElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0OTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1659398377031-a542c1948f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzcxNjh8MHwxfHNlYXJjaHwzfHxBdXN0cmFsaWElMjB0cmF2ZWwlMjBsYW5kbWFya3xlbnwxfDB8fHwxNzY0NDA0OTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
};
