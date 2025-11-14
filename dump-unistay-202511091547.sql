--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.4

-- Started on 2025-11-09 15:47:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16545)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16643)
-- Name: interest_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interest_requests (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    status character varying(255) NOT NULL,
    post_id uuid NOT NULL,
    student_id uuid NOT NULL,
    appointment_datetime timestamp(6) without time zone,
    appointment_message character varying(255),
    last_updated_by character varying(255),
    appointment_confirmed_by_student boolean,
    availability_end_date date,
    availability_end_time time(6) without time zone,
    availability_start_date date,
    availability_start_time time(6) without time zone,
    slot_duration_minutes integer,
    CONSTRAINT interest_requests_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'IN_CONTACT'::character varying, 'CLOSED'::character varying])::text[])))
);


ALTER TABLE public.interest_requests OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16661)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    amount numeric(38,2),
    payment_date timestamp(6) without time zone,
    status character varying(255) NOT NULL,
    interest_request_id uuid NOT NULL,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['UNPAID'::character varying, 'PAID'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16556)
-- Name: post_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_images (
    id uuid NOT NULL,
    display_order integer DEFAULT 0,
    image_url character varying(1024) NOT NULL,
    post_id uuid NOT NULL
);


ALTER TABLE public.post_images OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16562)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255),
    price double precision,
    image character varying(255),
    status character varying(255),
    user_id uuid,
    room_id uuid,
    maximum_lease_term character varying(255),
    minimum_lease_term character varying(255),
    security_deposit double precision
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16568)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role character varying(255)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16572)
-- Name: room_amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_amenities (
    room_id uuid NOT NULL,
    amenity character varying(255)
);


ALTER TABLE public.room_amenities OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16575)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying(1000),
    address character varying(255),
    available boolean,
    user_id uuid,
    bathroom_type character varying(255),
    is_furnished boolean,
    kitchen_type character varying(255),
    square_footage integer,
    lat double precision,
    lng double precision
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16581)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16584)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255),
    last_name character varying(255),
    email character varying(255),
    role_id uuid,
    password character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3438 (class 0 OID 16643)
-- Dependencies: 225
-- Data for Name: interest_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interest_requests (id, created_at, status, post_id, student_id, appointment_datetime, appointment_message, last_updated_by, appointment_confirmed_by_student, availability_end_date, availability_end_time, availability_start_date, availability_start_time, slot_duration_minutes) FROM stdin;
c0aae85a-a772-48b2-81d3-3889ad3311df	2025-06-15 18:42:19.691733	PENDING	72dca730-3611-451a-b8ff-54719855903d	55043339-46b5-4a21-ac93-8256f1dc88c8	\N	\N	\N	\N	\N	\N	\N	\N	\N
dc87e7c9-c250-41f6-aca4-783c32da142b	2025-06-15 19:09:01.128008	PENDING	72dca730-3611-451a-b8ff-54719855903d	a7fcee2a-8880-4799-a011-2ab21ac588bc	\N	\N	\N	\N	\N	\N	\N	\N	\N
98ae9531-bd2a-4ef3-89c4-ac47c289fda0	2025-06-15 19:09:52.216286	PENDING	b467c6ac-aed3-45a8-945b-409177f9d132	a7fcee2a-8880-4799-a011-2ab21ac588bc	\N	\N	\N	\N	\N	\N	\N	\N	\N
a336b4e4-8a9d-438f-b245-dd50b1272a9e	2025-06-15 19:13:49.266223	PENDING	25516f50-82b9-4b9d-8bde-7ad4c9c4a53e	f00c9250-464a-43df-a5d0-2beb6f44e183	\N	\N	\N	\N	\N	\N	\N	\N	\N
a33b9353-cb28-444b-a019-cc866d64e4f7	2025-06-15 19:26:46.684444	IN_CONTACT	4d53e4f0-5ca4-491e-b745-8e5a02c1d742	60304e79-f33e-4739-ac7b-5ed00d1e8653	2025-06-26 07:30:00	jeje	00016420@uca.edu.sv	\N	\N	\N	\N	\N	\N
9a7ca1a0-cbcf-4862-b458-6e3b5521df5f	2025-06-22 17:52:36.289608	PENDING	4d53e4f0-5ca4-491e-b745-8e5a02c1d742	84e428b7-02a3-43d4-8646-51a23d93f540	\N	\N	\N	\N	\N	\N	\N	\N	\N
8ff1bf28-c600-4a22-a7c5-c635b12f8fb6	2025-06-22 17:58:05.787065	IN_CONTACT	f62419e9-a53d-4f96-9bd6-6845afcee028	8f924ad0-33b6-4fe3-9be8-e2b208282afb	2025-06-25 23:00:00	puedes?	alejandro.vasquez0030511@gmail.com	\N	\N	\N	\N	\N	\N
26ad15e2-12de-45e4-a8d5-a7dd9f3cf079	2025-06-23 23:47:36.54342	PENDING	346beaef-0671-4c97-9b5e-afefbb01fcbb	f323a60e-ac58-4876-9017-8ebfd96b9ed3	\N	\N	\N	f	\N	\N	\N	\N	\N
30ce486e-0bfc-4e88-8d79-1263d7042b0e	2025-06-24 00:13:34.488116	CLOSED	c60d1c4a-38c8-4c42-b63e-c39a06c0f28b	f323a60e-ac58-4876-9017-8ebfd96b9ed3	2025-06-27 07:00:00	ACEPTAME PAPIIIIII	00081320@uca.edu.sv	t	\N	\N	\N	\N	\N
6670a001-0df4-4616-99c3-9439825f4785	2025-11-04 13:45:52.515986	PENDING	cadfe3c2-98b6-4f9b-9c54-9484a93d8db0	8f924ad0-33b6-4fe3-9be8-e2b208282afb	\N	\N	\N	f	\N	\N	\N	\N	\N
\.


--
-- TOC entry 3439 (class 0 OID 16661)
-- Dependencies: 226
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, amount, payment_date, status, interest_request_id) FROM stdin;
6b89e607-e27f-403c-b277-8484b24b40d4	299.99	2025-06-24 00:32:24.010712	PAID	30ce486e-0bfc-4e88-8d79-1263d7042b0e
\.


--
-- TOC entry 3431 (class 0 OID 16556)
-- Dependencies: 218
-- Data for Name: post_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_images (id, display_order, image_url, post_id) FROM stdin;
b6fb3a81-a6d5-4f78-9e32-88b56cbe3c9b	0	http://localhost:8080/uploads_unistay/posts/cadfe3c2-98b6-4f9b-9c54-9484a93d8db0/6ffe2ddd-6281-453e-bab1-2a16babac075.webp	cadfe3c2-98b6-4f9b-9c54-9484a93d8db0
4435e59c-def3-41a2-ac4f-2af0d34a0be9	0	http://localhost:8080/uploads_unistay/posts/ca57e06d-2038-405c-bb28-b46aeed72985/2fa6086a-e5a0-4d46-a7f2-dc545e6b9a1a.jpg	ca57e06d-2038-405c-bb28-b46aeed72985
702ae089-49ba-44c4-bd73-87ff195b6594	1	http://localhost:8080/uploads_unistay/posts/ca57e06d-2038-405c-bb28-b46aeed72985/cabf2fd3-5b33-48da-bd61-d90c308c2ff3.jpg	ca57e06d-2038-405c-bb28-b46aeed72985
b4cf09f5-0291-4db0-88fd-6434d09b9cef	2	http://localhost:8080/uploads_unistay/posts/ca57e06d-2038-405c-bb28-b46aeed72985/919622de-7d90-4026-beb3-c7f6c5a0669b.jpg	ca57e06d-2038-405c-bb28-b46aeed72985
53ad46db-0d3e-4627-9eb1-49bbcc8c2de6	3	http://localhost:8080/uploads_unistay/posts/ca57e06d-2038-405c-bb28-b46aeed72985/584c8751-8a02-4b0a-8d96-e2261a85090b.webp	ca57e06d-2038-405c-bb28-b46aeed72985
6e8e16d1-937c-4eb6-b5fe-002c8cc32365	0	http://localhost:8080/uploads_unistay/posts/0dce9d41-d853-435e-a8e3-8ccf32350346/144b9715-0284-490b-8a18-93990816e051.jpg	0dce9d41-d853-435e-a8e3-8ccf32350346
6dbc5fdd-fdba-4e7c-b356-90b1385806f3	1	http://localhost:8080/uploads_unistay/posts/c60d1c4a-38c8-4c42-b63e-c39a06c0f28b/b1d57d36-5244-4f88-b357-9166be913271.webp	c60d1c4a-38c8-4c42-b63e-c39a06c0f28b
3bb94668-2f62-41e3-8dfc-99f134520385	0	http://localhost:8080/uploads_unistay/posts/4d53e4f0-5ca4-491e-b745-8e5a02c1d742/2f44fcda-ca00-4afc-95d4-0047cee9e331.webp	4d53e4f0-5ca4-491e-b745-8e5a02c1d742
a8ae3087-c0cc-4c21-8d0c-208a9a598824	0	http://localhost:8080/uploads_unistay/posts/f62419e9-a53d-4f96-9bd6-6845afcee028/4966a122-3b75-44cb-93f9-d9928435ba6d.webp	f62419e9-a53d-4f96-9bd6-6845afcee028
d1661bf1-7a65-4a0e-96f1-f10fdf583379	0	http://localhost:8080/uploads_unistay/posts/72dca730-3611-451a-b8ff-54719855903d/7b067923-50ba-44e7-930b-6b0958bb6397.webp	72dca730-3611-451a-b8ff-54719855903d
7d1f3f96-bbfc-496e-9a52-bb544706b5b8	0	http://localhost:8080/uploads_unistay/posts/346beaef-0671-4c97-9b5e-afefbb01fcbb/18e4d21a-2143-4ade-94f1-d8fca5636deb.webp	346beaef-0671-4c97-9b5e-afefbb01fcbb
354c5f77-4d80-4a7b-8ff3-47bfe5d667ce	0	http://localhost:8080/uploads_unistay/posts/25516f50-82b9-4b9d-8bde-7ad4c9c4a53e/c9897961-867b-4195-81c1-e808a7cf9831.webp	25516f50-82b9-4b9d-8bde-7ad4c9c4a53e
535c4b2f-8786-4ac3-9563-728ac9f6d115	0	http://localhost:8080/uploads_unistay/posts/b467c6ac-aed3-45a8-945b-409177f9d132/4da0a904-6fd7-455c-8b84-7cb825672358.webp	b467c6ac-aed3-45a8-945b-409177f9d132
\.


--
-- TOC entry 3432 (class 0 OID 16562)
-- Dependencies: 219
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, price, image, status, user_id, room_id, maximum_lease_term, minimum_lease_term, security_deposit) FROM stdin;
cadfe3c2-98b6-4f9b-9c54-9484a93d8db0	test	100	\N	DISPONIBLE	7f7f9735-359e-4bb6-acf0-2ab184881165	4c2ad017-1a46-4f24-9b30-61bdfe0fbfa9	1 año	3 meses	99.99
ca57e06d-2038-405c-bb28-b46aeed72985	Habitación acogedora para estudiantes	200	\N	DISPONIBLE	e03cb4a6-6ee9-4c89-b1ce-0ae588c8d559	a6c7c698-d75c-44fc-be8a-c69a4749fcef	6 meses	4 meses	100
4d53e4f0-5ca4-491e-b745-8e5a02c1d742	aaaaaaaaaa	300	\N	DISPONIBLE	60304e79-f33e-4739-ac7b-5ed00d1e8653	f11df2db-8cfa-467b-af5e-01f3abdc97ec	1 año	6 meses	99.99
f62419e9-a53d-4f96-9bd6-6845afcee028	Casa linda	300	\N	DISPONIBLE	6e43cc33-b853-4a50-8bf8-0023a2a8432c	2d84af45-7be7-4165-a951-3d79ecc9aa26	1 año	6 meses	99.97
346beaef-0671-4c97-9b5e-afefbb01fcbb	casa familiar	299.98	\N	DISPONIBLE	9c0de6f4-2b06-4547-8bb3-2079b0d3a052	9299f71b-03b1-4f7c-a016-718025284409	1 año	6 meses	99.99
c60d1c4a-38c8-4c42-b63e-c39a06c0f28b	Casa familiar	299.99	\N	ALQUILADO	64fc07c4-41e0-4cc0-97c0-d53e0aded7c4	8868e78c-4b59-49d0-b32f-a56cc2ede5bf	1 año	6 meses	99.99
0dce9d41-d853-435e-a8e3-8ccf32350346	CASA PARA DOS PERSONAS	200	\N	DISPONIBLE	64fc07c4-41e0-4cc0-97c0-d53e0aded7c4	7b5ba871-b4d2-4aa5-bcdb-ad546e1840f3	1 año	6 meses	100
72dca730-3611-451a-b8ff-54719855903d	CASA PRUEBA	300	\N	ALQUILADO	9c0de6f4-2b06-4547-8bb3-2079b0d3a052	673025cf-0dd3-4c6e-b778-bbd5e8041fbc	1 año	6 meses	99.99
25516f50-82b9-4b9d-8bde-7ad4c9c4a53e	HABITACION ASIGNADA	299.99	\N	DISPONIBLE	f00c9250-464a-43df-a5d0-2beb6f44e183	d33f0c97-f1fc-4c1e-aa70-fe911347781f	1 año	6 meses	100
b467c6ac-aed3-45a8-945b-409177f9d132	CASA PARA UNA PERSONA	400	\N	DISPONIBLE	a7fcee2a-8880-4799-a011-2ab21ac588bc	c052e3eb-2b52-41ba-b73f-035e3f49c4fc	1 año	6 meses	100
\.


--
-- TOC entry 3433 (class 0 OID 16568)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role) FROM stdin;
838db61d-054f-46d6-91ef-924ef00b5486	ADMIN
e624df50-877c-4690-a9ff-6af9e69f668a	ESTUDIANTE
6daaaab2-732b-4442-bbcc-d11774ac9645	PROPIETARIO
4f4e1ca2-7a0a-4ee5-b146-3fac2afe0f87	USER
\.


--
-- TOC entry 3434 (class 0 OID 16572)
-- Dependencies: 221
-- Data for Name: room_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_amenities (room_id, amenity) FROM stdin;
4c2ad017-1a46-4f24-9b30-61bdfe0fbfa9	test
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Escritorio
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Wifi
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Cocina
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Baño
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Televisor
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Aire acondicionado
72460198-70e0-4371-b414-06110fd2ee21	Wi-Fi de alta velocidad
72460198-70e0-4371-b414-06110fd2ee21	Acceso a cocina
72460198-70e0-4371-b414-06110fd2ee21	Estacionamiento
72460198-70e0-4371-b414-06110fd2ee21	Lavadora
24aa15ae-9467-461a-b476-cbcf48f529de	Wi-Fi de alta velocidad
24aa15ae-9467-461a-b476-cbcf48f529de	Acceso a cocina
24aa15ae-9467-461a-b476-cbcf48f529de	Estacionamiento
24aa15ae-9467-461a-b476-cbcf48f529de	Lavadora
51eb71ab-8a8a-45a1-9c53-6f3245e01613	cama
673025cf-0dd3-4c6e-b778-bbd5e8041fbc	cama
673025cf-0dd3-4c6e-b778-bbd5e8041fbc	peto
f11df2db-8cfa-467b-af5e-01f3abdc97ec	cama
2d84af45-7be7-4165-a951-3d79ecc9aa26	cama
8e61549a-f79d-40c4-b6e0-66e77d4d86d2	cama
8868e78c-4b59-49d0-b32f-a56cc2ede5bf	cama
7b5ba871-b4d2-4aa5-bcdb-ad546e1840f3	cama
d33f0c97-f1fc-4c1e-aa70-fe911347781f	cama
c052e3eb-2b52-41ba-b73f-035e3f49c4fc	cama
\.


--
-- TOC entry 3435 (class 0 OID 16575)
-- Dependencies: 222
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, description, address, available, user_id, bathroom_type, is_furnished, kitchen_type, square_footage, lat, lng) FROM stdin;
4c2ad017-1a46-4f24-9b30-61bdfe0fbfa9	test de prueba	test	t	7f7f9735-359e-4bb6-acf0-2ab184881165	Privado	f	En la habitación	5	\N	\N
a6c7c698-d75c-44fc-be8a-c69a4749fcef	Habitación individual amueblada	Calle Principal 123	t	e03cb4a6-6ee9-4c89-b1ce-0ae588c8d559	Compartido	t	Compartida	16	\N	\N
72460198-70e0-4371-b414-06110fd2ee21	Habitación moderna cerca del centro de San Salvador. Ambiente tranquilo y seguro.	Boulevard Universitario, San Salvador	t	532c36a4-49ff-44b5-8fb8-0efedb0a5296	Privado	t	Compartida	20	13.6946	-89.2182
24aa15ae-9467-461a-b476-cbcf48f529de	Habitación moderna cerca del centro de San Salvador. Ambiente tranquilo y seguro.	Boulevard Universitario, San Salvador	t	532c36a4-49ff-44b5-8fb8-0efedb0a5296	Privado	t	Compartida	20	13.689970941955119	-89.20449377868552
51eb71ab-8a8a-45a1-9c53-6f3245e01613	mi casa ahora si funciona	colina felipe	t	532c36a4-49ff-44b5-8fb8-0efedb0a5296	Compartido	t	Compartida	1	13.68775964750827	-89.20453187137518
673025cf-0dd3-4c6e-b778-bbd5e8041fbc	dadwdadwadwa	dawdwadawd	t	9c0de6f4-2b06-4547-8bb3-2079b0d3a052	Compartido	f	Compartida	1	13.697220044725837	-89.21734169311523
f11df2db-8cfa-467b-af5e-01f3abdc97ec	aaaaaaaaaaaaaaaaaaaaaaa	aaaaaaaaaaaaa	t	60304e79-f33e-4739-ac7b-5ed00d1e8653	Compartido	t	Compartida	1	13.700635849409318	-89.21773837977955
2d84af45-7be7-4165-a951-3d79ecc9aa26	Casa amueblada y bonita	colina mi casa	t	6e43cc33-b853-4a50-8bf8-0023a2a8432c	Compartido	t	Compartida	1	13.690128663306762	-89.2259781258733
8e61549a-f79d-40c4-b6e0-66e77d4d86d2	mi casa es grande para varios estudiantes	colina felipe	t	6e43cc33-b853-4a50-8bf8-0023a2a8432c	Compartido	f	Compartida	1	13.688687769784968	-89.2265796661377
9299f71b-03b1-4f7c-a016-718025284409	Casa bonita para gente familiar	colina felipe	t	9c0de6f4-2b06-4547-8bb3-2079b0d3a052	Compartido	t	Compartida	1	13.691713110038433	-89.2274372475774
8868e78c-4b59-49d0-b32f-a56cc2ede5bf	Habitacion para su familia	Calle magnolias	t	64fc07c4-41e0-4cc0-97c0-d53e0aded7c4	Compartido	t	Compartida	1	13.693106116498774	-89.2242510635376
7b5ba871-b4d2-4aa5-bcdb-ad546e1840f3	PRUEBA DE CASA FUNCIONAL PARA DOS PERSONAS	PRUEBLA CALLE ANTIGUA 	t	64fc07c4-41e0-4cc0-97c0-d53e0aded7c4	Compartido	f	Compartida	12	13.687314158040927	-89.22589229518482
d33f0c97-f1fc-4c1e-aa70-fe911347781f	CASA PARA TODA LA FAMILIA 	AVENIDA LOS ANGELES	t	f00c9250-464a-43df-a5d0-2beb6f44e183	Compartido	f	Compartida	1	13.697592149217156	-89.22280239039966
c052e3eb-2b52-41ba-b73f-035e3f49c4fc	CASA PARA UNA SOLA PERSONA PENDIENTES	AVENIDA MARIONA	t	a7fcee2a-8880-4799-a011-2ab21ac588bc	Compartido	f	Compartida	1	13.694444171661079	-89.223403205219
\.


--
-- TOC entry 3436 (class 0 OID 16581)
-- Dependencies: 223
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
7f7f9735-359e-4bb6-acf0-2ab184881165	e624df50-877c-4690-a9ff-6af9e69f668a
d7476ef7-c0cb-42c7-88f2-0166b3cc16b5	e624df50-877c-4690-a9ff-6af9e69f668a
67661704-915b-4497-8bdf-39692da6f71b	e624df50-877c-4690-a9ff-6af9e69f668a
7f7f9735-359e-4bb6-acf0-2ab184881165	838db61d-054f-46d6-91ef-924ef00b5486
7f7f9735-359e-4bb6-acf0-2ab184881165	6daaaab2-732b-4442-bbcc-d11774ac9645
e03cb4a6-6ee9-4c89-b1ce-0ae588c8d559	838db61d-054f-46d6-91ef-924ef00b5486
3b0289d4-cf95-4886-946a-f85dfcb88cc3	6daaaab2-732b-4442-bbcc-d11774ac9645
55043339-46b5-4a21-ac93-8256f1dc88c8	e624df50-877c-4690-a9ff-6af9e69f668a
532c36a4-49ff-44b5-8fb8-0efedb0a5296	6daaaab2-732b-4442-bbcc-d11774ac9645
aa9828a2-3256-4281-aff2-b0a5f8d091de	6daaaab2-732b-4442-bbcc-d11774ac9645
9c0de6f4-2b06-4547-8bb3-2079b0d3a052	6daaaab2-732b-4442-bbcc-d11774ac9645
a7fcee2a-8880-4799-a011-2ab21ac588bc	6daaaab2-732b-4442-bbcc-d11774ac9645
f00c9250-464a-43df-a5d0-2beb6f44e183	6daaaab2-732b-4442-bbcc-d11774ac9645
60304e79-f33e-4739-ac7b-5ed00d1e8653	6daaaab2-732b-4442-bbcc-d11774ac9645
84e428b7-02a3-43d4-8646-51a23d93f540	e624df50-877c-4690-a9ff-6af9e69f668a
8f924ad0-33b6-4fe3-9be8-e2b208282afb	e624df50-877c-4690-a9ff-6af9e69f668a
6e43cc33-b853-4a50-8bf8-0023a2a8432c	6daaaab2-732b-4442-bbcc-d11774ac9645
f323a60e-ac58-4876-9017-8ebfd96b9ed3	e624df50-877c-4690-a9ff-6af9e69f668a
64fc07c4-41e0-4cc0-97c0-d53e0aded7c4	6daaaab2-732b-4442-bbcc-d11774ac9645
\.


--
-- TOC entry 3437 (class 0 OID 16584)
-- Dependencies: 224
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, last_name, email, role_id, password) FROM stdin;
7f7f9735-359e-4bb6-acf0-2ab184881165	Claudia	Herrera 	Claudia@gmail.com	838db61d-054f-46d6-91ef-924ef00b5486	$2a$10$0qV71N.It26/yWWy1zb.dueBlUmJ6aPfBbUNKTI00Y9q6oGF8cPLy
e03cb4a6-6ee9-4c89-b1ce-0ae588c8d559	Kevin	Martinez	Kevinmc@gmail.com	6daaaab2-732b-4442-bbcc-d11774ac9645	$2a$10$jA.aaivacZiam6YZII1/Je4zR..QIqP7oK2yMHbX5fnoga6LwopKK
3b0289d4-cf95-4886-946a-f85dfcb88cc3	Test	User	user@test.com	4f4e1ca2-7a0a-4ee5-b146-3fac2afe0f87	$2a$10$8TW/D79.fgiyaNFL21x1COjfnQncr5GE1crgEWNJd8kJAnQXYp2l6
d7476ef7-c0cb-42c7-88f2-0166b3cc16b5	Juan	Propietario	juan.propietario@test.com	6daaaab2-732b-4442-bbcc-d11774ac9645	$2a$10$jztKiW1D.eZKv3YMWC3gDeU4KIuHPabiWHzzVN60z72OZZZ0D3xpu
67661704-915b-4497-8bdf-39692da6f71b	Oscar	Cruz	Oscar@gmail.com	e624df50-877c-4690-a9ff-6af9e69f668a	$2a$10$Ue26TQgbyi0drG3Q9vTNxOmavz5bb0OKEfOpJBg3K1uwOdEW8flnu
55043339-46b5-4a21-ac93-8256f1dc88c8	Ana	Inquilina	ana.inquilina@test.com	\N	$2a$10$1KjJzLZw1fBS5cXrMlsTbuuw0juI9VcnIucvatF9tuRklXdg3ZAby
532c36a4-49ff-44b5-8fb8-0efedb0a5296	Ana	Inquilina	ana.inquilina1@test.com	\N	$2a$10$ARWNBw42kGUbxHqXla9mseI7OSHPFHzc7E7G.dv5h7YIT/sWGppuW
aa9828a2-3256-4281-aff2-b0a5f8d091de	Flavio	Jimenez	flavio.jim09@gmail.com	\N	$2a$10$lJo.edWHpeapUG.iI3S85e8IXoU/e8b/fWz9xHTJ.hz02Zg4NoeZO
9c0de6f4-2b06-4547-8bb3-2079b0d3a052	Flavio	Jimz	00239920@uca.edu.sv	\N	$2a$10$g0P.ItXx6hSrJTXq8gUriOItNC/5ZTn8gXrcRM/A75wA6xigW5ARC
a7fcee2a-8880-4799-a011-2ab21ac588bc	Electro	Stricker	rixon.navi2@gmail.com	\N	$2a$10$kIM8I0FlqJsIy4z1XE3bdei7QC47rdjDLnMfa4WaBl0KfYwU36kFS
f00c9250-464a-43df-a5d0-2beb6f44e183	Electro	Stricker	rixon.nav2@gmail.com	\N	$2a$10$btFEVO/b6FhZdCZaWwII3uhzG/odmqe0VFsf.hWTS23KY..mZPzkC
60304e79-f33e-4739-ac7b-5ed00d1e8653	chumel	alajo	00016420@uca.edu.sv	\N	$2a$10$Y5.POrXIRll9Mk1O451qNO6W99WNcIJsToJXeI7U.3VQ0pmGqDiaW
84e428b7-02a3-43d4-8646-51a23d93f540	diego	flamenco	flamencodiego@gmail.com	\N	$2a$10$HMG1/WWYne.ew1ptADNMteIDDqUqwEDm/BoMfzJY9gCstAruaDzQq
8f924ad0-33b6-4fe3-9be8-e2b208282afb	Guillermo	Diaz	alevc247@gmail.com	\N	$2a$10$cTHFGeI0j/arkAVFw98eDOrdemhXO144xSAb317WVSn1Y9/0i9FwG
6e43cc33-b853-4a50-8bf8-0023a2a8432c	Alejandro	Martinez	alejandro.vasquez0030511@gmail.com	\N	$2a$10$Q4wmtv85vjkBJfCAWgFsCO9KWpA0SlPgPx0eYTLpifXm6s/KeFAra
f323a60e-ac58-4876-9017-8ebfd96b9ed3	Flavio	Jimenez	mariohuezo404@gmail.com	\N	$2a$10$zKzEwlxA8d.N9epv4Fq41eOrQyUMT3MgR0PW5QZhlfyVvo/sR1WOa
64fc07c4-41e0-4cc0-97c0-d53e0aded7c4	Marlene	Sanchez	00081320@uca.edu.sv	\N	$2a$10$SZKwOPpXiu2ttB1Ll4KDLuLQj/qZ8mFt0bEAbzHgJHcxcuyYplgK.
\.


--
-- TOC entry 3272 (class 2606 OID 16648)
-- Name: interest_requests interest_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest_requests
    ADD CONSTRAINT interest_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3274 (class 2606 OID 16666)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 16591)
-- Name: post_images post_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT post_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 16593)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 16595)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3266 (class 2606 OID 16597)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 2606 OID 16599)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 3270 (class 2606 OID 16601)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 16654)
-- Name: interest_requests fk4ubqlmwm51ubmfte1xf6t5na5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest_requests
    ADD CONSTRAINT fk4ubqlmwm51ubmfte1xf6t5na5 FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- TOC entry 3284 (class 2606 OID 16649)
-- Name: interest_requests fk7pcjkarqcnbna6406dcna9ty5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interest_requests
    ADD CONSTRAINT fk7pcjkarqcnbna6406dcna9ty5 FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- TOC entry 3285 (class 2606 OID 16667)
-- Name: payments fk7wp739wb6ya2wkhjq2tlk6tif; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk7wp739wb6ya2wkhjq2tlk6tif FOREIGN KEY (interest_request_id) REFERENCES public.interest_requests(id);


--
-- TOC entry 3280 (class 2606 OID 16602)
-- Name: user_roles fkh8ciramu9cc9q3qcqiv4ue8a6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fkh8ciramu9cc9q3qcqiv4ue8a6 FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3281 (class 2606 OID 16607)
-- Name: user_roles fkhfh9dx7w3ubf1co1vdev94g3f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fkhfh9dx7w3ubf1co1vdev94g3f FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3275 (class 2606 OID 16612)
-- Name: post_images fko1i5va2d8de9mwq727vxh0s05; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_images
    ADD CONSTRAINT fko1i5va2d8de9mwq727vxh0s05 FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- TOC entry 3278 (class 2606 OID 16617)
-- Name: room_amenities fkps6ofup9gxhn8juqvproxbaud; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_amenities
    ADD CONSTRAINT fkps6ofup9gxhn8juqvproxbaud FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 3276 (class 2606 OID 16622)
-- Name: posts posts_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- TOC entry 3277 (class 2606 OID 16627)
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3279 (class 2606 OID 16632)
-- Name: rooms rooms_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3282 (class 2606 OID 16637)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-11-09 15:47:29

--
-- PostgreSQL database dump complete
--

