-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
                                            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role varchar(255)
    );

-- USERS
CREATE TABLE IF NOT EXISTS public.users (
                                            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255),
    last_name varchar(255),
    email varchar(255),
    role_id uuid,
    password varchar(255)
    );

-- USER_ROLES (ManyToMany)
CREATE TABLE IF NOT EXISTS public.user_roles (
                                                 user_id uuid NOT NULL,
                                                 role_id uuid NOT NULL,
                                                 PRIMARY KEY (user_id, role_id)
    );

-- ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
                                            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    description varchar(1000),
    address varchar(255),
    available boolean,
    user_id uuid,
    bathroom_type varchar(255),
    is_furnished boolean,
    kitchen_type varchar(255),
    square_footage integer,
    lat double precision,
    lng double precision
    );

-- POSTS
CREATE TABLE IF NOT EXISTS public.posts (
                                            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255),
    price double precision,
    image varchar(255),
    status varchar(255),
    user_id uuid,
    room_id uuid,
    maximum_lease_term varchar(255),
    minimum_lease_term varchar(255),
    security_deposit double precision
    );

-- POST_IMAGES
CREATE TABLE IF NOT EXISTS public.post_images (
                                                  id uuid PRIMARY KEY,
                                                  display_order integer DEFAULT 0,
                                                  image_url varchar(1024) NOT NULL,
    post_id uuid NOT NULL
    );

-- INTEREST_REQUESTS
CREATE TABLE IF NOT EXISTS public.interest_requests (
                                                        id uuid PRIMARY KEY,
                                                        created_at timestamp(6) NOT NULL,
    status varchar(255) NOT NULL,
    post_id uuid NOT NULL,
    student_id uuid NOT NULL,
    appointment_datetime timestamp(6),
    appointment_message varchar(255),
    last_updated_by varchar(255),
    appointment_confirmed_by_student boolean,
    availability_end_date date,
    availability_end_time time(6),
    availability_start_date date,
    availability_start_time time(6),
    slot_duration_minutes integer,
    CONSTRAINT interest_requests_status_check
    CHECK (status IN ('PENDING','IN_CONTACT','CLOSED'))
    );

-- PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
                                               id uuid PRIMARY KEY,
                                               amount numeric(38,2),
    payment_date timestamp(6),
    status varchar(255) NOT NULL,
    interest_request_id uuid NOT NULL,
    CONSTRAINT payments_status_check
    CHECK (status IN ('UNPAID','PAID'))
    );

-- FKs
ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS fkhfh9dx7w3ubf1co1vdev94g3f,
  DROP CONSTRAINT IF EXISTS fkh8ciramu9cc9q3qcqiv4ue8a6;
ALTER TABLE public.user_roles
    ADD CONSTRAINT fkhfh9dx7w3ubf1co1vdev94g3f FOREIGN KEY (user_id) REFERENCES public.users(id),
  ADD CONSTRAINT fkh8ciramu9cc9q3qcqiv4ue8a6 FOREIGN KEY (role_id) REFERENCES public.roles(id);

ALTER TABLE public.posts
DROP CONSTRAINT IF EXISTS posts_user_id_fkey,
  DROP CONSTRAINT IF EXISTS posts_room_id_fkey;
ALTER TABLE public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT posts_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;

ALTER TABLE public.post_images
DROP CONSTRAINT IF EXISTS fko1i5va2d8de9mwq727vxh0s05;
ALTER TABLE public.post_images
    ADD CONSTRAINT fko1i5va2d8de9mwq727vxh0s05 FOREIGN KEY (post_id) REFERENCES public.posts(id);

ALTER TABLE public.rooms
DROP CONSTRAINT IF EXISTS rooms_user_id_fkey;
ALTER TABLE public.rooms
    ADD CONSTRAINT rooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.interest_requests
DROP CONSTRAINT IF EXISTS fk4ubqlmwm51ubmfte1xf6t5na5,
  DROP CONSTRAINT IF EXISTS fk7pcjkarqcnbna6406dcna9ty5;
ALTER TABLE public.interest_requests
    ADD CONSTRAINT fk4ubqlmwm51ubmfte1xf6t5na5 FOREIGN KEY (student_id) REFERENCES public.users(id),
  ADD CONSTRAINT fk7pcjkarqcnbna6406dcna9ty5 FOREIGN KEY (post_id) REFERENCES public.posts(id);

ALTER TABLE public.payments
DROP CONSTRAINT IF EXISTS fk7wp739wb6ya2wkhjq2tlk6tif;
ALTER TABLE public.payments
    ADD CONSTRAINT fk7wp739wb6ya2wkhjq2tlk6tif FOREIGN KEY (interest_request_id) REFERENCES public.interest_requests(id);
