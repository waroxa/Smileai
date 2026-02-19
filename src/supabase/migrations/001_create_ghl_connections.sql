-- Create table for GHL OAuth connections
create table if not exists ghl_connections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Who connected (optional if you have users)
  user_id uuid null,

  -- OAuth material
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scope text null,

  -- Location context
  location_id text not null unique,  -- Made unique so one location = one connection
  location_name text null,
  company_id text null,

  -- For CSRF/state protection (store hashed)
  state_hash text null
);

create index if not exists idx_ghl_connections_location_id on ghl_connections(location_id);
create index if not exists idx_ghl_connections_expires_at on ghl_connections(expires_at);
create index if not exists idx_ghl_connections_user_id on ghl_connections(user_id) where user_id is not null;

-- Create table for OAuth state (CSRF protection)
create table if not exists ghl_oauth_states (
  id uuid primary key default gen_random_uuid(),
  state text not null unique,
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

create index if not exists idx_ghl_oauth_states_state on ghl_oauth_states(state);
create index if not exists idx_ghl_oauth_states_expires_at on ghl_oauth_states(expires_at);

-- Create table for audit log
create table if not exists ghl_audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  
  location_id text not null,
  action text not null,
  details jsonb default '{}',
  user_id uuid null
);

create index if not exists idx_ghl_audit_log_location_id on ghl_audit_log(location_id);
create index if not exists idx_ghl_audit_log_created_at on ghl_audit_log(created_at desc);
create index if not exists idx_ghl_audit_log_action on ghl_audit_log(action);

-- Create table for video metadata
create table if not exists ghl_videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  location_id text not null,
  contact_id text null,
  
  -- Video details
  video_url text not null,
  title text null,
  tags text[] default array[]::text[],
  workflow_step text default 'transformation',
  
  -- GHL custom value reference
  custom_value_id text null,
  custom_value_key text null,
  
  -- Metadata
  metadata jsonb default '{}'
);

create index if not exists idx_ghl_videos_location_id on ghl_videos(location_id);
create index if not exists idx_ghl_videos_contact_id on ghl_videos(contact_id) where contact_id is not null;
create index if not exists idx_ghl_videos_created_at on ghl_videos(created_at desc);

-- Function to clean up expired states
create or replace function cleanup_expired_oauth_states()
returns void as $$
begin
  delete from ghl_oauth_states where expires_at < now();
end;
$$ language plpgsql;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_ghl_connections_updated_at
  before update on ghl_connections
  for each row
  execute function update_updated_at_column();

create trigger update_ghl_videos_updated_at
  before update on ghl_videos
  for each row
  execute function update_updated_at_column();

-- Comments for documentation
comment on table ghl_connections is 'Stores GoHighLevel OAuth connections and tokens';
comment on table ghl_oauth_states is 'Temporary storage for OAuth state parameters (CSRF protection)';
comment on table ghl_audit_log is 'Audit log for all GHL-related actions';
comment on table ghl_videos is 'Video metadata storage linked to GHL locations';
