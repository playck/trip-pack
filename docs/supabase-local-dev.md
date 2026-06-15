# 🐳 Docker + Supabase 로컬 개발 완전 정리

> 개발/운영 DB를 분리하고, 개발 DB를 로컬(Docker)에서 돌리기 위한 학습 + 운영 가이드.

---

## 0. 왜 이렇게 했나 (배경)

- 홍보·운영을 시작 → **개발하다 실수로 실사용자 데이터를 날리면 안 됨** → 개발/운영 DB 분리 필요
- 그런데 Supabase 무료 프로젝트 슬롯은 **계정 합산 2개**인데, `trip-pack`(운영) + `papot`(다른 실서비스)이 이미 다 씀 → 클라우드에 개발 DB를 못 만듦
- **→ 해결: 개발 DB를 내 컴퓨터(로컬)에 Docker로 띄우자** (무료 + 운영 데이터 안전)

---

## 1. 큰 그림: 클라우드 vs 로컬

```
☁️ 클라우드 (운영)                    🖥️ 내 컴퓨터 (로컬 / 개발)
─────────────────                    ──────────────────────
supabase.com 대시보드        ↔        localhost:54323 (Studio)
운영 DB                              로컬 DB (Docker 안)
 • 실사용자 데이터                     • 구조는 똑같음 (17 테이블)
 • 24시간 가동                        • 데이터는 텅 빔
 • 배포된 앱이 사용                    • 개발할 때만 사용
```

---

## 2. Docker 3대 개념 (+ Docker Desktop)

| 용어 | 정체 | 비유 |
|---|---|---|
| **이미지(Image)** | 프로그램+환경을 통째로 박제한 완제품 (정적) | 🍱 밀키트 / 붕어빵 틀 |
| **컨테이너(Container)** | 이미지를 실행한 것 (살아있음) | 🔥 데운 요리 / 붕어빵 |
| **볼륨(Volume)** | 데이터를 컨테이너 **밖**에 따로 저장 (컨테이너 꺼져도 보존) | 💾 게임기 세이브(메모리카드) |
| **Docker Desktop** | Mac 안에 "작은 리눅스 방(VM)"을 만들어 Docker 엔진을 돌려주는 앱 | 🐧 리눅스 방 + 🔧 엔진 + 🐳 GUI |

- 이미지(틀) 하나로 컨테이너(붕어빵) **여러 개** 가능 → `supabase start`는 컨테이너 **12개**를 한 번에 띄움
- **Docker 엔진은 원래 리눅스 전용**. Mac은 리눅스가 아니라서 Docker Desktop이 "작은 리눅스 방"을 만들어 그 안에서 돌림 → 그래서 **🐳 고래 초록불**이 켜져야 컨테이너를 띄울 수 있음 (리눅스 컴퓨터면 Docker Desktop 불필요)
- **CLI ↔ Docker 연결 원리**: Docker가 켜지면 `docker.sock`이라는 "주문 창구(소켓)"를 표준 위치(`/var/run/docker.sock`)에 엶. `supabase start`는 그 창구에 "컨테이너 띄워줘"라고 주문함 (`docker` 명령어와 같은 창구). Docker가 꺼져 있으면 → `Cannot connect to the Docker daemon. Is the docker daemon running?` 에러 = **"도커 켜라"**는 뜻.

---

## 3. 이미지를 가져와 컨테이너를 만드는 흐름

```
1️⃣ 레지스트리 (외부 이미지 창고)        예: public.ecr.aws/supabase, Docker Hub
         ↓  docker가 "pull"(다운로드) — 처음 한 번만!
2️⃣ 내 컴퓨터에 이미지 저장 (캐시됨)       → 그 뒤엔 외부 안 감 = 두 번째 start가 빠른 이유
         ↓  실행 (Mac이라 → 🐧 리눅스 VM 안에서)
3️⃣ 컨테이너 생성 + 가동 🎉
```

- **pull** = 이미지를 레지스트리에서 가져오는 동작 (`git pull`과 비슷)
- 이미지는 한 번 받으면 캐시됨 → `stop`해도 이미지(틀)는 남음 (붕어빵 틀은 서랍에 보관)

---

## 4. 컨테이너 ↔ 볼륨 (데이터는 어디에?)

**데이터는 컨테이너가 아니라 볼륨(별도 저장소)에 있다.** 컨테이너는 볼륨을 "꽂아서" 읽고 쓸 뿐.

```
🎮 컨테이너 (붕어빵, 일회용)  ──꽂음──▶  💾 볼륨 (메모리카드, 데이터 보관)
        ↓ stop으로 버려도                    ↓ 그대로 남음
   다시 start → 같은 볼륨 다시 꽂음     →   데이터 유지! 💾
```

- `docker ps`(컨테이너 목록)와 `docker volume ls`(볼륨 목록)는 **별개** → 데이터가 컨테이너와 분리되어 관리됨
- 볼륨 실제 위치: `/var/lib/docker/volumes/...` = **리눅스 경로** → Mac엔 그런 폴더 없음! Docker Desktop의 리눅스 VM 안 디스크에 저장 (Docker가 관리, 직접 건드릴 일 없음)

---

## 5. "운영이랑 똑같이"의 정체 — 무엇이 복제됐나

| 복제됨? | 무엇 | 누가 |
|---|---|---|
| ✅ | Supabase **프로그램** (엔진 12개) | 🐳 Docker (`supabase start`) |
| ✅ | 테이블·함수 **구조** (17 테이블 / 7 함수) | 📄 `migrations/*.sql` 실행 |
| ❌ | 실사용자 **데이터** | (아무도 → 텅 빔) |

**핵심**: 프로그램·구조는 복제, 데이터는 안 옴. → `package.json` 원리와 동일:

| JS 프로젝트 | Supabase 로컬 |
|---|---|
| `package.json` (명세, git ✅) | `config.toml` + `migrations` |
| `node_modules` (무거운 실체, git ❌) | **Docker 이미지** |
| `npm install` | `supabase start` |

→ 가벼운 명세만 git에 공유 → 각자 `supabase start`로 이미지 받아서 → **똑같이 재현**

---

## 6. 어느 DB에 붙나? → env 키가 결정

```
yarn dev   → .env.local            → 🖥️ 로컬 DB  (맘껏 부숴도 됨)
yarn build → .env.production.local → ☁️ 운영 DB
```

**코드는 그대로, env 키값만 스위치** (같은 전화기, 다른 번호 ☎️). Vercel 배포는 Vercel 자체 환경변수 사용.

---

## 7. 명령어 치트시트

```bash
# ▶️ 개발 시작 (먼저 Docker Desktop 🐳 초록불 확인!)
npx supabase start     # 로컬 스택(컨테이너 12개) 켜기
yarn dev               # 앱 → 로컬 DB 연결

# ⏹️ 개발 끝
npx supabase stop      # 컨테이너 끄기 (데이터는 볼륨에 보존됨)

# 🔍 확인 도구
#   localhost:54323 → Studio  (로컬 DB 대시보드)
#   localhost:54324 → Mailpit (로컬 회원가입 인증메일)

# 🔄 로컬 초기화 (구조만 새로, 데이터 날림)
npx supabase db reset
```

---

## 8. 스키마 변경 워크플로 (정석: 로컬 → 운영)

```
🖥️ 로컬에서:
  1. npx supabase migration new <이름>   # 변경 파일 생성 (= git commit 같은 것)
  2. SQL 작성 (ALTER TABLE ...)
  3. npx supabase db reset               # 로컬 적용 + 테스트
  4. gen:types                            # database.type.ts 타입 갱신

✅ 검증 후 ☁️ 운영에:
  5. npx supabase db push                # 운영 반영 (= git push) ← 유일하게 운영 건드림
```

- ⚠️ `db push`는 신중히 (되돌리기 어려움). **운영 직접 수정 금지.**
- ⚠️ 첫 `db push` 시: `initial_schema.sql`은 운영에 이미 적용된 상태라, "이미 적용됨" 표시(`supabase migration repair --status applied <timestamp>`)가 한 번 필요할 수 있음.

---

## 9. git 관리

> **"`supabase/` 폴더는 통째로 커밋 — 키(`.env`)랑 임시(`.temp`)만 빼고."**

| 파일 | git | 이유 |
|---|---|---|
| `supabase/migrations/*.sql` | ✅ | DB 설계도 |
| `supabase/config.toml` | ✅ | 스택 명세 |
| `supabase/functions/*/index.ts` | ✅ | Edge Function 코드 |
| `supabase/.gitignore` | ✅ | 무시 규칙 |
| `.env*.local` | ❌ | 키 (보안) |
| `supabase/.temp/` | ❌ | 로컬 임시 |

---

## 🎯 한 줄 요약 (복습용)

1. **Docker Desktop** = Mac 안에 리눅스 방 만들어 Docker 돌리는 앱 (🐳 초록불 = 준비완료)
2. **이미지**=틀(정적) / **컨테이너**=붕어빵(실행) / **볼륨**=세이브(데이터 영속, 컨테이너 밖)
3. **이미지**는 레지스트리에서 `pull`(한 번만, 그 뒤 캐시) → VM에서 실행 → 컨테이너
4. **로컬 = 운영과 같은 프로그램+구조, 데이터만 빔**
5. **어느 DB?** = env 키가 결정 (dev=로컬 / build=운영)
6. **스키마** = 로컬 먼저 → 검증 → `db push`로 운영
7. **git** = `supabase/` 폴더(키 제외) — 명세만 공유하면 누구나 재현
