CREATE OR REPLACE FUNCTION get_test_user_row(test_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  res json;
BEGIN
  SELECT row_to_json(u) INTO res
  FROM auth.users u
  WHERE u.email = test_email;
  RETURN res;
END;
$$;

CREATE OR REPLACE FUNCTION get_test_identity_row(test_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  res json;
BEGIN
  SELECT row_to_json(i) INTO res
  FROM auth.identities i
  WHERE i.user_id = test_user_id;
  RETURN res;
END;
$$;
