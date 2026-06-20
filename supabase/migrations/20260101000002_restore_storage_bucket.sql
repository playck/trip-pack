-- 여행 커버 이미지용 storage 버킷 + RLS 정책 복원.
--
-- 배경: 초기 스키마는 `supabase db dump`(public 스키마 전용)로 생성되어,
--       storage 스키마의 버킷/정책이 로컬/협업 환경에 누락됨.
--       그 결과 이미지 업로드 시 'Bucket not found' 또는 RLS 거부 발생.

-- 1. 버킷 생성 (운영과 동일: public, 5MB, 이미지 MIME 한정)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('trip-images', 'trip-images', true, 5242880, '{image/jpeg,image/png,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- 2. RLS 정책 (운영과 동일) — 폴더 구조: {user_id}/{trip_id}/{file}
CREATE POLICY "여행 이미지는 누구나 열람 가능" ON storage.objects
  FOR SELECT USING (bucket_id = 'trip-images');

CREATE POLICY "여행 이미지는 본인만 생성 가능" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'trip-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "여행 이미지는 본인만 수정 가능" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'trip-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "여행 이미지는 본인만 삭제 가능" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'trip-images' AND (storage.foldername(name))[1] = auth.uid()::text);
