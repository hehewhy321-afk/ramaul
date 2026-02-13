-- Allow admins to upload to avatars bucket (for ward rep photos etc.)
CREATE POLICY "Admins upload to avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND has_role(auth.uid(), 'admin'::app_role));
