/*
  # Allow anonymous users to delete tools
  
  Adds DELETE policy for anonymous users on the tools table
  so that users can delete AI tools from the collection.
  Note: Password protection is handled at the application level.
*/

CREATE POLICY "Tools can be deleted by anyone"
  ON tools FOR DELETE
  TO anon
  USING (true);

