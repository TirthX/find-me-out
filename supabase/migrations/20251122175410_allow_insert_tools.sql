/*
  # Allow anonymous users to insert tools
  
  Adds INSERT policy for anonymous users on the tools table
  so that users can add new AI tools to the collection.
*/

CREATE POLICY "Tools can be inserted by anyone"
  ON tools FOR INSERT
  TO anon
  WITH CHECK (true);

