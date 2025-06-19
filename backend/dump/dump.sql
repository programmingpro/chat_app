--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Ubuntu 17.4-1.pgdg24.04+2)
-- Dumped by pg_dump version 17.4 (Ubuntu 17.4-1.pgdg24.04+2)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: chat_participants_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.chat_participants_role_enum AS ENUM (
    'member',
    'admin',
    'owner'
);


ALTER TYPE public.chat_participants_role_enum OWNER TO postgres;

--
-- Name: chats_chattype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.chats_chattype_enum AS ENUM (
    'private',
    'group',
    'channel'
);


ALTER TYPE public.chats_chattype_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_participants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role public.chat_participants_role_enum NOT NULL,
    "chatId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "lastReadMessageId" uuid
);


ALTER TABLE public.chat_participants OWNER TO postgres;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "chatType" public.chats_chattype_enum NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdById" uuid NOT NULL
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content text,
    "senderId" uuid NOT NULL,
    "chatId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    fileurl character varying,
    filename character varying,
    "fileUrl" character varying,
    "fileName" character varying,
    "readBy" text
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "twoFactorAuth" boolean DEFAULT false NOT NULL,
    "pushNotifications" boolean DEFAULT true NOT NULL,
    "notificationSound" boolean DEFAULT true NOT NULL,
    "darkTheme" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "avatarUrl" character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: chat_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_participants (id, role, "chatId", "userId", "createdAt", "updatedAt", "lastReadMessageId") FROM stdin;
894be269-7e2d-41fc-a34d-b6491b277db8	member	c12c88f9-3b34-4a57-804e-14d891e91ea5	639d8558-d3cd-4896-b226-9a60e88fd1f9	2025-05-19 08:48:15.511683	2025-05-19 08:48:15.511683	\N
45b147cb-adc3-4e12-a29c-631e05a4fc97	member	c12c88f9-3b34-4a57-804e-14d891e91ea5	20a3d957-2ffb-45cc-9085-b0a52f2ad885	2025-05-19 08:48:15.511683	2025-05-19 08:48:15.511683	\N
40f9f89f-5d42-4a5b-bd03-fbff97b1bd82	member	c12c88f9-3b34-4a57-804e-14d891e91ea5	720002fe-db91-4410-a111-1907b0272292	2025-05-19 08:48:15.511683	2025-05-19 08:48:15.511683	\N
f493f762-b518-4d9d-97a2-33c554156492	admin	57ded653-61a9-499b-b69b-2d11fae92aab	8a554d55-42e0-4176-bc56-fce80534895c	2025-05-19 08:48:15.566362	2025-05-19 08:48:15.566362	\N
056949d6-6ab6-4ef3-8e4e-5f48d7694ccf	member	57ded653-61a9-499b-b69b-2d11fae92aab	cad05d47-d6d8-409c-bf57-b9d36fdf133a	2025-05-19 08:48:15.566362	2025-05-19 08:48:15.566362	\N
3c382350-1760-4a27-9024-ce1242a3abe1	member	57ded653-61a9-499b-b69b-2d11fae92aab	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	2025-05-19 08:48:15.566362	2025-05-19 08:48:15.566362	\N
3a17b2aa-34ed-4b4e-a394-84479cafc0d9	admin	fa2b439f-c6b6-4f72-b824-51fafbad01a7	20a3d957-2ffb-45cc-9085-b0a52f2ad885	2025-05-19 08:48:15.601171	2025-05-19 08:48:15.601171	\N
f2cae9eb-d01a-415f-b850-a58bdb968021	admin	85ce59dd-32db-4f1d-a5b7-5547597efc8a	259c0dc3-b707-49ef-825a-31bce9323d18	2025-05-19 08:48:15.625784	2025-05-19 08:48:15.625784	\N
b3122e70-ebfe-4df2-be73-9c68f1404241	member	85ce59dd-32db-4f1d-a5b7-5547597efc8a	70092acc-7b23-4e39-afcd-98cced390fc9	2025-05-19 08:48:15.625784	2025-05-19 08:48:15.625784	\N
43c0dceb-bf76-4fcc-a0ff-893e6bf9938b	member	85ce59dd-32db-4f1d-a5b7-5547597efc8a	639d8558-d3cd-4896-b226-9a60e88fd1f9	2025-05-19 08:48:15.625784	2025-05-19 08:48:15.625784	\N
bf8c402a-0199-4d8b-bf70-c1ffe08cacec	admin	3f634818-ec8a-4ca2-ae79-405cad197de2	cad05d47-d6d8-409c-bf57-b9d36fdf133a	2025-05-19 08:48:15.659293	2025-05-19 08:48:15.659293	\N
61be1da5-35af-4950-8693-b2814d45745e	member	3f634818-ec8a-4ca2-ae79-405cad197de2	8a554d55-42e0-4176-bc56-fce80534895c	2025-05-19 08:48:15.659293	2025-05-19 08:48:15.659293	\N
f2f1e823-c498-41b6-b49c-14d5f5334e55	member	57ded653-61a9-499b-b69b-2d11fae92aab	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 08:55:19.655529	2025-05-19 08:55:19.655529	\N
2be48087-f391-402a-89a2-fe969c506bdb	member	2cd2e5b7-0b44-4f2e-a3ed-8cd9a461edb2	cad05d47-d6d8-409c-bf57-b9d36fdf133a	2025-05-19 09:00:54.140148	2025-05-19 09:00:54.140148	\N
50137174-a17a-40cc-8906-dcc50765320a	admin	3d64a8f5-c5d3-40ad-bc54-38d3513307f3	20a3d957-2ffb-45cc-9085-b0a52f2ad885	2025-05-19 09:00:54.182641	2025-05-19 09:00:54.182641	\N
f2e957be-627d-4081-b512-8c6fd49c238f	member	3d64a8f5-c5d3-40ad-bc54-38d3513307f3	639d8558-d3cd-4896-b226-9a60e88fd1f9	2025-05-19 09:00:54.182641	2025-05-19 09:00:54.182641	\N
01365ab5-9cb2-4a5b-9c78-7812e20d9daf	admin	a6acec86-f12f-4cfb-85b6-e1b5f10f090f	8a554d55-42e0-4176-bc56-fce80534895c	2025-05-19 09:00:54.233144	2025-05-19 09:00:54.233144	\N
61c5193b-de18-40ff-bcf9-03c829377c1f	member	a6acec86-f12f-4cfb-85b6-e1b5f10f090f	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	2025-05-19 09:00:54.233144	2025-05-19 09:00:54.233144	\N
f18def4d-0173-41cf-a40b-f63aabaf90b8	admin	039bd224-e1ef-4110-9b6e-12e96cabc8f0	70092acc-7b23-4e39-afcd-98cced390fc9	2025-05-19 09:00:54.268608	2025-05-19 09:00:54.268608	\N
df14ce9a-a089-4f00-b28a-3cb168b55fbd	member	039bd224-e1ef-4110-9b6e-12e96cabc8f0	28e0aaa4-466c-4936-859e-3eae818b3694	2025-05-19 09:00:54.268608	2025-05-19 09:00:54.268608	\N
34bc9058-0e8d-46c9-8ce3-bf3758f08724	admin	20c22648-4673-49df-8838-a7e75b29f78a	259c0dc3-b707-49ef-825a-31bce9323d18	2025-05-19 09:00:54.314642	2025-05-19 09:00:54.314642	\N
035a19a3-c428-469e-a5b3-46781ad1d990	member	20c22648-4673-49df-8838-a7e75b29f78a	720002fe-db91-4410-a111-1907b0272292	2025-05-19 09:00:54.314642	2025-05-19 09:00:54.314642	\N
1fd81edb-b7f7-49b9-99f5-02ccb35691b9	admin	6a987afe-dc09-48e5-bc38-c1cbfa031009	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 10:05:05.072357	2025-05-19 10:05:05.072357	\N
91a92ec8-b85d-498c-bdba-3441cc60e535	member	6a987afe-dc09-48e5-bc38-c1cbfa031009	639d8558-d3cd-4896-b226-9a60e88fd1f9	2025-05-19 10:05:05.072357	2025-05-19 10:05:05.072357	\N
e71daece-aa3b-413c-9c2c-7e1151bd0838	member	d282b9f3-a46a-45f7-a343-5b03ad6f70bb	8a554d55-42e0-4176-bc56-fce80534895c	2025-05-19 10:05:05.107715	2025-05-19 10:05:05.107715	\N
a31a5953-328a-4beb-ba20-6f8ee8b8ded1	admin	931028df-ed4b-4421-ab5f-6b12647b8c99	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 10:05:05.145536	2025-05-19 10:05:05.145536	\N
97d9a69d-c326-4944-942c-63c775b87003	member	931028df-ed4b-4421-ab5f-6b12647b8c99	70092acc-7b23-4e39-afcd-98cced390fc9	2025-05-19 10:05:05.145536	2025-05-19 10:05:05.145536	\N
979420bc-fe76-4492-9f19-b6d38f2239f2	admin	bafb6215-adc3-4191-bb8e-e86102035587	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 10:05:05.177639	2025-05-19 10:05:05.177639	\N
4cfe5b24-436c-453a-8ad6-75e8729cb49d	member	bafb6215-adc3-4191-bb8e-e86102035587	28e0aaa4-466c-4936-859e-3eae818b3694	2025-05-19 10:05:05.177639	2025-05-19 10:05:05.177639	\N
5838e2a7-f4fd-48bb-9467-707b6818d549	admin	e96472d8-d1c0-4703-86cf-1fcd2cbae4de	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 10:05:05.204386	2025-05-19 10:05:05.204386	\N
cdfeb33f-7b3b-4e07-9173-b10bb1f979e1	member	e96472d8-d1c0-4703-86cf-1fcd2cbae4de	259c0dc3-b707-49ef-825a-31bce9323d18	2025-05-19 10:05:05.204386	2025-05-19 10:05:05.204386	\N
0c6620c6-4be6-4c8c-bead-16c9487a7df1	member	85ce59dd-32db-4f1d-a5b7-5547597efc8a	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 08:55:19.717193	2025-06-20 02:34:19.108505	67e317d6-2772-4db4-8cb9-1f54c6cb80e4
81ccd49c-7476-43fe-9ce7-8f26553c7585	admin	c12c88f9-3b34-4a57-804e-14d891e91ea5	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 08:48:15.511683	2025-05-20 12:16:36.567931	010b7736-9b83-4949-b6a5-af58430417f4
c3030315-a481-492c-a308-b2d709f1cc55	member	ea897fb2-0898-41c0-b058-b84e0a9b5d82	74eab9f3-d478-4d6e-aeb9-e36acd5639d1	2025-05-21 23:16:32.958423	2025-05-21 23:33:36.003803	\N
e746de38-79f9-4c5f-a6b9-c1e5b0766398	member	a6b33c58-e8ec-46ba-9a41-ca5a25741a81	28e0aaa4-466c-4936-859e-3eae818b3694	2025-05-21 23:25:42.579142	2025-05-21 23:29:09.059334	\N
5ea346d0-52f0-4cce-a79c-76531acbaf2f	admin	b8d2efcf-bb1c-46e3-a9c7-50d2e20537a2	74eab9f3-d478-4d6e-aeb9-e36acd5639d1	2025-05-21 23:14:05.124298	2025-05-21 23:32:00.739789	\N
f90beb56-a6d3-4708-a01a-d4d0f3fc27f8	admin	d282b9f3-a46a-45f7-a343-5b03ad6f70bb	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 10:05:05.107715	2025-06-20 02:30:45.470964	51034d03-0705-4bac-86aa-832e944c79fc
f81189d5-31dc-478d-b044-17742ad77dd9	member	fa2b439f-c6b6-4f72-b824-51fafbad01a7	c0521f26-a678-4c24-9f64-a08b610e3f6e	2025-05-19 08:48:15.601171	2025-06-20 02:30:51.710238	7a158bf7-330c-49de-9758-d366ebba5666
0dadf627-b165-42a9-9eb4-c5b4e44b5e81	member	52605507-54ea-4482-8884-78c7dd5162c9	cad05d47-d6d8-409c-bf57-b9d36fdf133a	2025-06-20 02:32:55.832412	2025-06-20 02:32:55.832412	\N
bfe29e64-c6df-47a5-b397-6a2c34b1adff	member	52605507-54ea-4482-8884-78c7dd5162c9	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	2025-06-20 02:32:55.841712	2025-06-20 02:32:55.841712	\N
a7e10b97-119b-4a21-b2a2-05aca43eafa8	member	17686a5d-c70d-441c-b719-d1628b1f4c02	720002fe-db91-4410-a111-1907b0272292	2025-06-20 02:34:01.174958	2025-06-20 02:34:01.174958	\N
376f0647-9b16-4f72-9169-69e954e24bc4	member	17686a5d-c70d-441c-b719-d1628b1f4c02	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	2025-06-20 02:34:01.181223	2025-06-20 02:34:01.181223	\N
563f873d-8d4c-4523-acb8-0370f6dbe671	admin	17686a5d-c70d-441c-b719-d1628b1f4c02	cad05d47-d6d8-409c-bf57-b9d36fdf133a	2025-06-20 02:34:01.187344	2025-06-20 02:34:01.187344	\N
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (id, "chatType", name, "createdAt", "updatedAt", "createdById") FROM stdin;
b8d2efcf-bb1c-46e3-a9c7-50d2e20537a2	group	Тайный совет	2025-05-21 23:14:05.067466	2025-05-21 23:14:05.067466	74eab9f3-d478-4d6e-aeb9-e36acd5639d1
ea897fb2-0898-41c0-b058-b84e0a9b5d82	private		2025-05-21 23:16:32.929735	2025-05-21 23:16:32.929735	74eab9f3-d478-4d6e-aeb9-e36acd5639d1
a6b33c58-e8ec-46ba-9a41-ca5a25741a81	private		2025-05-21 23:25:42.563076	2025-05-21 23:25:42.563076	28e0aaa4-466c-4936-859e-3eae818b3694
52605507-54ea-4482-8884-78c7dd5162c9	group	Тайный совет	2025-06-20 02:32:55.812948	2025-06-20 02:32:55.812948	cad05d47-d6d8-409c-bf57-b9d36fdf133a
17686a5d-c70d-441c-b719-d1628b1f4c02	group		2025-06-20 02:34:01.157429	2025-06-20 02:34:01.157429	cad05d47-d6d8-409c-bf57-b9d36fdf133a
c12c88f9-3b34-4a57-804e-14d891e91ea5	group	Совет князей	2025-05-19 08:48:15.418694	2025-05-19 08:48:15.418694	c0521f26-a678-4c24-9f64-a08b610e3f6e
57ded653-61a9-499b-b69b-2d11fae92aab	group	Богатырская застава	2025-05-19 08:48:15.418694	2025-05-19 08:48:15.418694	8a554d55-42e0-4176-bc56-fce80534895c
fa2b439f-c6b6-4f72-b824-51fafbad01a7	private	Тайные переговоры	2025-05-19 08:48:15.418694	2025-05-19 08:48:15.418694	20a3d957-2ffb-45cc-9085-b0a52f2ad885
85ce59dd-32db-4f1d-a5b7-5547597efc8a	group	Новгородское вече	2025-05-19 08:48:15.418694	2025-05-19 08:48:15.418694	259c0dc3-b707-49ef-825a-31bce9323d18
3f634818-ec8a-4ca2-ae79-405cad197de2	private	Военные планы	2025-05-19 08:48:15.418694	2025-05-19 08:48:15.418694	cad05d47-d6d8-409c-bf57-b9d36fdf133a
2cd2e5b7-0b44-4f2e-a3ed-8cd9a461edb2	private	Беседа Владимира и Добрыни	2025-05-19 09:00:54.091267	2025-05-19 09:00:54.091267	c0521f26-a678-4c24-9f64-a08b610e3f6e
3d64a8f5-c5d3-40ad-bc54-38d3513307f3	private	Совет Ольги и Ярослава	2025-05-19 09:00:54.091267	2025-05-19 09:00:54.091267	20a3d957-2ffb-45cc-9085-b0a52f2ad885
a6acec86-f12f-4cfb-85b6-e1b5f10f090f	private	Илья и Алёша	2025-05-19 09:00:54.091267	2025-05-19 09:00:54.091267	8a554d55-42e0-4176-bc56-fce80534895c
039bd224-e1ef-4110-9b6e-12e96cabc8f0	private	Садко и Волхв	2025-05-19 09:00:54.091267	2025-05-19 09:00:54.091267	70092acc-7b23-4e39-afcd-98cced390fc9
20c22648-4673-49df-8838-a7e75b29f78a	private	Марфа и Святополк	2025-05-19 09:00:54.091267	2025-05-19 09:00:54.091267	259c0dc3-b707-49ef-825a-31bce9323d18
6a987afe-dc09-48e5-bc38-c1cbfa031009	private	Владимир и Ярослав	2025-05-19 10:05:05.023289	2025-05-19 10:05:05.023289	c0521f26-a678-4c24-9f64-a08b610e3f6e
d282b9f3-a46a-45f7-a343-5b03ad6f70bb	private	Владимир и Илья	2025-05-19 10:05:05.023289	2025-05-19 10:05:05.023289	c0521f26-a678-4c24-9f64-a08b610e3f6e
931028df-ed4b-4421-ab5f-6b12647b8c99	private	Владимир и Садко	2025-05-19 10:05:05.023289	2025-05-19 10:05:05.023289	c0521f26-a678-4c24-9f64-a08b610e3f6e
bafb6215-adc3-4191-bb8e-e86102035587	private	Владимир и Волхв	2025-05-19 10:05:05.023289	2025-05-19 10:05:05.023289	c0521f26-a678-4c24-9f64-a08b610e3f6e
e96472d8-d1c0-4703-86cf-1fcd2cbae4de	private	Владимир и Марфа	2025-05-19 10:05:05.023289	2025-05-19 10:05:05.023289	c0521f26-a678-4c24-9f64-a08b610e3f6e
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, count, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, content, "senderId", "chatId", "createdAt", "updatedAt", fileurl, filename, "fileUrl", "fileName", "readBy") FROM stdin;
065f8961-e08d-4806-a14d-fe3dfe0f4113	Братья и сестры, собрались мы ныне по важному делу	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:28.654258	2025-05-19 10:07:28.654258	\N	\N	\N	\N	\N
3617aa81-3c84-48af-a3dc-f46ea11fba92	Какие вести из земель ваших?	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:28.654258	2025-05-19 10:07:28.654258	\N	\N	\N	\N	\N
54417693-ad70-436d-a121-322c92c582e0	Из Новгорода шлют дань исправно, но народ ропщет на новые поборы	639d8558-d3cd-4896-b226-9a60e88fd1f9	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:28.654258	2025-05-19 10:07:28.654258	\N	\N	\N	\N	\N
e2cc05ee-773a-439e-bacd-6e0878a9372e	А у нас на границе печенеги опять шумят	720002fe-db91-4410-a111-1907b0272292	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:28.654258	2025-05-19 10:07:28.654258	\N	\N	\N	\N	\N
23c5af0c-ea2d-4e76-a28b-2e4c0a9f2066	Надо бы Илью с дружиной послать разобраться	20a3d957-2ffb-45cc-9085-b0a52f2ad885	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:28.654258	2025-05-19 10:07:28.654258	\N	\N	\N	\N	\N
72d75541-e319-4f21-8cec-ba703527112b	Братья-богатыри, на заставе все спокойно?	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:28.727276	2025-05-19 10:07:28.727276	\N	\N	\N	\N	\N
87de6f2c-3dea-4ef3-9ab0-48cf0d369362	Тишина, Илья. Только волки воют да ветер гуляет	cad05d47-d6d8-409c-bf57-b9d36fdf133a	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:28.727276	2025-05-19 10:07:28.727276	\N	\N	\N	\N	\N
a8d2d703-a536-4c52-bd51-a15546618649	Я у реки следы странные видел - не наши, не звериные...	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:28.727276	2025-05-19 10:07:28.727276	\N	\N	\N	\N	\N
8f0ff535-3039-44a7-b6f6-1df513b01d54	Будем настороже. Алёша, проверь еще раз завтра на рассвете	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:28.727276	2025-05-19 10:07:28.727276	\N	\N	\N	\N	\N
5dac39ac-c2c2-44aa-8721-10af0977a741	Братья и сестры, собрались мы ныне по важному делу	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:46.343826	2025-05-19 10:07:46.343826	\N	\N	\N	\N	\N
ad9ccbbe-e956-4fed-98e6-33a2f0e11bf0	Какие вести из земель ваших?	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:46.343826	2025-05-19 10:07:46.343826	\N	\N	\N	\N	\N
706cd7e9-d038-4bb3-8da7-7ff8f7eba800	Из Новгорода шлют дань исправно, но народ ропщет на новые поборы	639d8558-d3cd-4896-b226-9a60e88fd1f9	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:46.343826	2025-05-19 10:07:46.343826	\N	\N	\N	\N	\N
746cfe99-7789-4c34-89e0-49db5d944af3	А у нас на границе печенеги опять шумят	720002fe-db91-4410-a111-1907b0272292	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:46.343826	2025-05-19 10:07:46.343826	\N	\N	\N	\N	\N
9f9454c1-f0ed-43df-9771-31b1ea07e633	Надо бы Илью с дружиной послать разобраться	20a3d957-2ffb-45cc-9085-b0a52f2ad885	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:07:46.343826	2025-05-19 10:07:46.343826	\N	\N	\N	\N	\N
1e1cc2a0-8ea6-48f2-89e3-8153ae0d7550	Братья-богатыри, на заставе все спокойно?	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:46.382468	2025-05-19 10:07:46.382468	\N	\N	\N	\N	\N
84798a5f-3b57-4ff0-80e9-802c54ecec53	Тишина, Илья. Только волки воют да ветер гуляет	cad05d47-d6d8-409c-bf57-b9d36fdf133a	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:46.382468	2025-05-19 10:07:46.382468	\N	\N	\N	\N	\N
f1629b10-c48d-4f97-85e9-aaf4d3e515d0	Я у реки следы странные видел - не наши, не звериные...	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:46.382468	2025-05-19 10:07:46.382468	\N	\N	\N	\N	\N
afa8cef3-e2d9-4329-ab15-b1f15776e5a5	Будем настороже. Алёша, проверь еще раз завтра на рассвете	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:07:46.382468	2025-05-19 10:07:46.382468	\N	\N	\N	\N	\N
3fe68391-67e3-421a-946e-885b104a8500	Братья и сестры, собрались мы ныне по важному делу	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:12:49.053963	2025-05-19 10:12:49.053963	\N	\N	\N	\N	\N
e026ab3a-d9f1-458c-a26c-3868d161b40d	Какие вести из земель ваших?	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:12:49.053963	2025-05-19 10:12:49.053963	\N	\N	\N	\N	\N
e3ff1160-e12d-4db4-b7e4-ebd0ca3657b2	Из Новгорода шлют дань исправно, но народ ропщет на новые поборы	639d8558-d3cd-4896-b226-9a60e88fd1f9	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:12:49.053963	2025-05-19 10:12:49.053963	\N	\N	\N	\N	\N
2498948b-851d-44af-968a-a050d4c1ab40	А у нас на границе печенеги опять шумят	720002fe-db91-4410-a111-1907b0272292	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:12:49.053963	2025-05-19 10:12:49.053963	\N	\N	\N	\N	\N
629057eb-20ad-4c98-840c-faa18ed2a806	Надо бы Илью с дружиной послать разобраться	20a3d957-2ffb-45cc-9085-b0a52f2ad885	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:12:49.053963	2025-05-19 10:12:49.053963	\N	\N	\N	\N	\N
7e6b8eb2-d88d-46e2-aa0b-2af5893c0c38	Братья-богатыри, на заставе все спокойно?	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:12:49.139008	2025-05-19 10:12:49.139008	\N	\N	\N	\N	\N
93e2abb6-d60d-41c3-bfc8-5500d7581316	Тишина, Илья. Только волки воют да ветер гуляет	cad05d47-d6d8-409c-bf57-b9d36fdf133a	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:12:49.139008	2025-05-19 10:12:49.139008	\N	\N	\N	\N	\N
d292f30a-409d-4c3a-a139-e03d13306c9c	Я у реки следы странные видел - не наши, не звериные...	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:12:49.139008	2025-05-19 10:12:49.139008	\N	\N	\N	\N	\N
2ec7c3a0-a26a-409d-84a7-d6906b0e2197	Будем настороже. Алёша, проверь еще раз завтра на рассвете	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:12:49.139008	2025-05-19 10:12:49.139008	\N	\N	\N	\N	\N
7e828952-73a6-4b74-88cb-7750c3036563	Братья и сестры, собрались мы ныне по важному делу	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:13:56.140288	2025-05-19 10:13:56.140288	\N	\N	\N	\N	\N
08938582-5dd4-4120-9952-7449e138357b	Какие вести из земель ваших?	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:13:56.140288	2025-05-19 10:13:56.140288	\N	\N	\N	\N	\N
7fa7a95b-8a91-429b-b9c8-4d0ac822e0b7	Из Новгорода шлют дань исправно, но народ ропщет на новые поборы	639d8558-d3cd-4896-b226-9a60e88fd1f9	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:13:56.140288	2025-05-19 10:13:56.140288	\N	\N	\N	\N	\N
93e82a43-86de-47a7-b500-a7ce4cf02391	А у нас на границе печенеги опять шумят	720002fe-db91-4410-a111-1907b0272292	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:13:56.140288	2025-05-19 10:13:56.140288	\N	\N	\N	\N	\N
fa12bf7f-754b-4b89-aeae-3b850a2cc0f9	Надо бы Илью с дружиной послать разобраться	20a3d957-2ffb-45cc-9085-b0a52f2ad885	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:13:56.140288	2025-05-19 10:13:56.140288	\N	\N	\N	\N	\N
790f4f63-4dc5-4797-ab39-4b65de58c4d7	Братья-богатыри, на заставе все спокойно?	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:13:56.19227	2025-05-19 10:13:56.19227	\N	\N	\N	\N	\N
4dca2b8e-04be-485d-a64c-d30765eda04e	Тишина, Илья. Только волки воют да ветер гуляет	cad05d47-d6d8-409c-bf57-b9d36fdf133a	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:13:56.19227	2025-05-19 10:13:56.19227	\N	\N	\N	\N	\N
a525822f-90e6-4c45-a6fc-cde64fe494b3	Я у реки следы странные видел - не наши, не звериные...	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:13:56.19227	2025-05-19 10:13:56.19227	\N	\N	\N	\N	\N
316a86e9-a9e5-45f0-8ed6-d1ad50f40ab6	Будем настороже. Алёша, проверь еще раз завтра на рассвете	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:13:56.19227	2025-05-19 10:13:56.19227	\N	\N	\N	\N	\N
f0051411-2c63-4831-a833-9d7a4cb548e6	Братья и сестры, собрались мы ныне по важному делу	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:14:10.490245	2025-05-19 10:14:10.490245	\N	\N	\N	\N	\N
e75f402f-5300-4589-85be-147694995188	Какие вести из земель ваших?	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:14:10.490245	2025-05-19 10:14:10.490245	\N	\N	\N	\N	\N
4a2fccfc-179a-42ff-a8b3-8e663a39dd2c	Из Новгорода шлют дань исправно, но народ ропщет на новые поборы	639d8558-d3cd-4896-b226-9a60e88fd1f9	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:14:10.490245	2025-05-19 10:14:10.490245	\N	\N	\N	\N	\N
e99c9eb8-7e22-4cbb-bdaa-9a829b4e4207	А у нас на границе печенеги опять шумят	720002fe-db91-4410-a111-1907b0272292	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:14:10.490245	2025-05-19 10:14:10.490245	\N	\N	\N	\N	\N
59d5bfb2-9b74-4251-8243-37a9ea5f737b	Надо бы Илью с дружиной послать разобраться	20a3d957-2ffb-45cc-9085-b0a52f2ad885	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:14:10.490245	2025-05-19 10:14:10.490245	\N	\N	\N	\N	\N
312fc319-2a7e-4db2-b177-706327626975	Братья-богатыри, на заставе все спокойно?	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:14:10.561003	2025-05-19 10:14:10.561003	\N	\N	\N	\N	\N
a06abc1c-b5b9-4150-9d5c-aad128ce54eb	Тишина, Илья. Только волки воют да ветер гуляет	cad05d47-d6d8-409c-bf57-b9d36fdf133a	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:14:10.561003	2025-05-19 10:14:10.561003	\N	\N	\N	\N	\N
099c0dcd-44da-4115-a7c4-9b6fb0580756	Я у реки следы странные видел - не наши, не звериные...	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:14:10.561003	2025-05-19 10:14:10.561003	\N	\N	\N	\N	\N
5256acea-a8b1-4b5a-8355-fb618c0485d2	Будем настороже. Алёша, проверь еще раз завтра на рассвете	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:14:10.561003	2025-05-19 10:14:10.561003	\N	\N	\N	\N	\N
b71e7dbf-91de-44fc-ac79-bc7708ef6a38	Братья и сестры, собрались мы ныне по важному делу	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:36:02.112543	2025-05-19 10:36:02.112543	\N	\N	\N	\N	\N
8b4fa11d-fd9a-4c2e-8151-d1b7c6da8cb2	Какие вести из земель ваших?	c0521f26-a678-4c24-9f64-a08b610e3f6e	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:36:02.112543	2025-05-19 10:36:02.112543	\N	\N	\N	\N	\N
010b7736-9b83-4949-b6a5-af58430417f4	Из Новгорода шлют дань исправно, но народ ропщет на новые поборы	639d8558-d3cd-4896-b226-9a60e88fd1f9	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:36:02.112543	2025-05-19 10:36:02.112543	\N	\N	\N	\N	\N
f1aed629-6891-4ed9-8970-181f4a811718	А у нас на границе печенеги опять шумят	720002fe-db91-4410-a111-1907b0272292	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:36:02.112543	2025-05-19 10:36:02.112543	\N	\N	\N	\N	\N
ec9f67e1-5ad1-4fed-ac14-4b46811430e9	Надо бы Илью с дружиной послать разобраться	20a3d957-2ffb-45cc-9085-b0a52f2ad885	c12c88f9-3b34-4a57-804e-14d891e91ea5	2025-05-19 10:36:02.112543	2025-05-19 10:36:02.112543	\N	\N	\N	\N	\N
3b2f29bc-1d74-4b93-9c01-5bfd746970c4	Братья-богатыри, на заставе все спокойно?	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:36:02.157218	2025-05-19 10:36:02.157218	\N	\N	\N	\N	\N
f680bab3-2e10-4fb3-96cb-13379970e16e	Тишина, Илья. Только волки воют да ветер гуляет	cad05d47-d6d8-409c-bf57-b9d36fdf133a	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:36:02.157218	2025-05-19 10:36:02.157218	\N	\N	\N	\N	\N
43a0bc5f-0a7e-4e15-90e8-3f8179150aa3	Я у реки следы странные видел - не наши, не звериные...	63f8f7e2-73f6-404b-bae1-b3f6f010aabc	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:36:02.157218	2025-05-19 10:36:02.157218	\N	\N	\N	\N	\N
4058d6cd-c7bf-4ac2-8708-155bc6ee26cd	Будем настороже. Алёша, проверь еще раз завтра на рассвете	8a554d55-42e0-4176-bc56-fce80534895c	57ded653-61a9-499b-b69b-2d11fae92aab	2025-05-19 10:36:02.157218	2025-05-19 10:36:02.157218	\N	\N	\N	\N	\N
7a158bf7-330c-49de-9758-d366ebba5666	Матушка, как здоровье?	c0521f26-a678-4c24-9f64-a08b610e3f6e	fa2b439f-c6b6-4f72-b824-51fafbad01a7	2025-05-19 10:36:02.17532	2025-05-19 10:36:02.17532	\N	\N	\N	\N	\N
7c6a8faa-9af2-4ba5-8c54-4b9380e5d726	Слава богам, сынок, держусь. А у тебя как с тем варяжским посольством?	20a3d957-2ffb-45cc-9085-b0a52f2ad885	fa2b439f-c6b6-4f72-b824-51fafbad01a7	2025-05-19 10:36:02.17532	2025-05-19 10:36:02.17532	\N	\N	\N	\N	\N
cba7ca29-fb3d-4862-9f51-501245461d7d	Тянут время, жду их ответа до новолуния	c0521f26-a678-4c24-9f64-a08b610e3f6e	fa2b439f-c6b6-4f72-b824-51fafbad01a7	2025-05-19 10:36:02.17532	2025-05-19 10:36:02.17532	\N	\N	\N	\N	\N
67e317d6-2772-4db4-8cb9-1f54c6cb80e4	Граждане новгородские! Завтра собираемся у Ярославова дворища	259c0dc3-b707-49ef-825a-31bce9323d18	85ce59dd-32db-4f1d-a5b7-5547597efc8a	2025-05-19 10:36:02.204825	2025-05-19 10:36:02.204825	\N	\N	\N	\N	\N
7ba36fe0-bc7d-45e1-85f1-4d9d470e3030	Опять подати повышать будем?	70092acc-7b23-4e39-afcd-98cced390fc9	85ce59dd-32db-4f1d-a5b7-5547597efc8a	2025-05-19 10:36:02.204825	2025-05-19 10:36:02.204825	\N	\N	\N	\N	\N
cfecf275-2af3-4fc0-a127-90e4a564222d	Нет, Садко, будем выбирать посадника и ремонт мостов обсуждать	639d8558-d3cd-4896-b226-9a60e88fd1f9	85ce59dd-32db-4f1d-a5b7-5547597efc8a	2025-05-19 10:36:02.204825	2025-05-19 10:36:02.204825	\N	\N	\N	\N	\N
1c7281ca-53bb-4a0f-86eb-067ee1e475fd	Сынок, как дела в Новгороде?	c0521f26-a678-4c24-9f64-a08b610e3f6e	6a987afe-dc09-48e5-bc38-c1cbfa031009	2025-05-19 10:36:02.230275	2025-05-19 10:36:02.230275	\N	\N	\N	\N	\N
bf9f9130-4b06-42c4-8f2a-bb38b15218d7	Все спокойно, батюшка. Мосты новые построили, торг идет бойко	639d8558-d3cd-4896-b226-9a60e88fd1f9	6a987afe-dc09-48e5-bc38-c1cbfa031009	2025-05-19 10:36:02.230275	2025-05-19 10:36:02.230275	\N	\N	\N	\N	\N
235b1318-358f-4731-8e64-59c2c0218a7e	Не забывай и об обороне города укреплять	c0521f26-a678-4c24-9f64-a08b610e3f6e	6a987afe-dc09-48e5-bc38-c1cbfa031009	2025-05-19 10:36:02.230275	2025-05-19 10:36:02.230275	\N	\N	\N	\N	\N
ac677723-8ff1-4612-bdf1-11ffad6367f9	\N	c0521f26-a678-4c24-9f64-a08b610e3f6e	d282b9f3-a46a-45f7-a343-5b03ad6f70bb	2025-05-20 12:20:44.779132	2025-05-20 12:20:44.779132	\N	\N	/uploads/4c81b92f-e819-49e0-8348-b65f4e173cea.png	karta.png	\N
51034d03-0705-4bac-86aa-832e944c79fc	Приветствую тебя, Илья! Печенеги что-то готовят, отправляйся на границы и разузнай что!	c0521f26-a678-4c24-9f64-a08b610e3f6e	d282b9f3-a46a-45f7-a343-5b03ad6f70bb	2025-05-20 12:20:55.020567	2025-05-20 12:20:55.020567	\N	\N	\N	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1743027468322	Initial1743027468322
2	1746567074220	AddAvatarUrl1746567074220
3	1746567074223	MakeContentNullable1746567074223
4	1746567074224	AddFileFieldsToMessages1746567074224
5	1746567074227	AddReadByToMessages1746567074227
6	1710864000000	AddLastReadMessageId1710864000000
7	1710864000000	ChangeLastReadMessageIdToUuid1710864000000
8	1710864000001	AddCreatedByIdToChats1710864000001
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, "firstName", "lastName", email, password, "twoFactorAuth", "pushNotifications", "notificationSound", "darkTheme", "createdAt", "updatedAt", "avatarUrl") FROM stdin;
74eab9f3-d478-4d6e-aeb9-e36acd5639d1	ск	крокодил		crocodilo@bombardino.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-04-21 02:37:09.345355	2025-05-21 23:19:00.32879	/uploads/avatars/4ed8932f-d138-42b1-8576-c0a79f1cb5d1.jpg
0d847f4d-402b-4470-9cb9-49c1e4d0fdc2	new.com	Andy	Test	welcome.business@tbank.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-07 00:33:15.2015	2025-05-07 00:33:15.2015	\N
8a554d55-42e0-4176-bc56-fce80534895c	bogatyr_ilya	Илья	Муромец	ilya@murom.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-06-20 02:39:20.071969	/uploads/avatars/a90c11a7-c25e-41e0-839c-8b11c4f25cce.jpeg
63f8f7e2-73f6-404b-bae1-b3f6f010aabc	ratnyi_alyosha	Алёша	Попович	alyosha@rostov.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-19 08:44:34.113117	\N
20a3d957-2ffb-45cc-9085-b0a52f2ad885	knyaginya_olga	Ольга	Святая	olga@kiev-rus.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-20 12:10:29.030426	/uploads/avatars/28eb6aa7-10b2-406b-b28d-bff17bd8df6c.jpg
259c0dc3-b707-49ef-825a-31bce9323d18	tkachiha_marfa	Марфа	Посадница	marfa@novgorod.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-20 12:11:16.443271	/uploads/avatars/12ed1869-81a6-4593-93f3-9dfa838b0dc4.jpg
9251be71-cfea-4a74-904c-33c4557896f1	welcome.business2@tbank.ru	Andy2	Test2	welcome.business2@tbank.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-07 00:33:36.399417	2025-05-13 15:51:33.849537	/uploads/avatars/2e472179-504a-439d-8d7a-06b22d679086.jpg
70092acc-7b23-4e39-afcd-98cced390fc9	veselyi_sadko	Садко	Новгородский	sadko@novgorod.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-20 12:12:51.855288	/uploads/avatars/f646fa89-09f9-4b26-a47b-5e5d40a6e6fb.jpg
720002fe-db91-4410-a111-1907b0272292	krasno_solnyshko	Святополк	Владимирович	svyatopolk@kiev-rus.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-19 08:44:34.113117	\N
77c04b2d-b248-4225-aa83-ebdfe83e2ca6	john.doe@example.com	John	Doe	john.doe@example.com	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-06 13:38:01.771841	2025-05-06 13:38:01.771841	\N
c0521f26-a678-4c24-9f64-a08b610e3f6e	velikiy_knyaz	Владимир	Святославич	vladimir@kiev-rus.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-20 12:04:56.144726	/uploads/avatars/37f033da-11d1-47ec-b66b-c2ac3182ebf9.jpg
f02326f4-cd49-47af-904b-a942833e51d7	a@mail.ru	aц	a	a@mail.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-13 15:00:38.562919	2025-05-13 15:03:46.762889	/uploads/avatars/df1903e5-c35e-4cec-b282-a05cb34062f3.png
639d8558-d3cd-4896-b226-9a60e88fd1f9	mudryi_yaroslav	Ярослав	Владимирович	yaroslav@novgorod.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-20 12:07:39.428486	/uploads/avatars/76cddf56-94ac-433b-a49a-9b2328447761.jpg
28e0aaa4-466c-4936-859e-3eae818b3694	kudesnik_volkhv	Волхв	Всеславич	volkhv@smolensk.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-05-20 12:13:29.017108	/uploads/avatars/2b9ec504-68dd-4015-9dc8-b78d336704a4.jpg
cad05d47-d6d8-409c-bf57-b9d36fdf133a	voevoda_dobrynya	Добрыня	Никитич	dobrynya@kiev-rus.ru	$2b$10$dPOnSkU4LS7y8C4pI3Qm.uQHxqwwgIblSSguV3VagOVyWGM58bYS.	f	t	t	f	2025-05-19 08:44:34.113117	2025-06-20 02:30:21.592013	/uploads/avatars/a1c4217e-4e3c-45d9-a12f-f0c057790b8a.jpg
\.


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 8, true);


--
-- Name: chats PK_0117647b3c4a4e5ff198aeb6206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY (id);


--
-- Name: messages PK_18325f38ae6de43878487eff986; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: chat_participants PK_ebf68c52a2b4dceb777672b782d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT "PK_ebf68c52a2b4dceb777672b782d" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: IDX_2eb84efc93976230c81bce1b59; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2eb84efc93976230c81bce1b59" ON public.chats USING btree ("createdAt");


--
-- Name: IDX_40dc3de52ed041e48cfb116f2a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_40dc3de52ed041e48cfb116f2a" ON public.messages USING btree ("senderId", "createdAt");


--
-- Name: IDX_500d64127ca9df75640c19af40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_500d64127ca9df75640c19af40" ON public.messages USING btree ("chatId", "createdAt");


--
-- Name: IDX_68dedada1bc6c79f334ac1b540; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_68dedada1bc6c79f334ac1b540" ON public.chat_participants USING btree ("chatId", role);


--
-- Name: IDX_9318b026b0886396fdade51b48; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9318b026b0886396fdade51b48" ON public.chats USING btree ("chatType");


--
-- Name: IDX_97672ac88f789774dd47f7c8be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON public.users USING btree (email);


--
-- Name: IDX_d3101b19215e8540d891f98c06; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_d3101b19215e8540d891f98c06" ON public.chat_participants USING btree ("chatId", "userId");


--
-- Name: IDX_f63b5cc5bf67e5251f28301d7e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f63b5cc5bf67e5251f28301d7e" ON public.chats USING btree (name);


--
-- Name: IDX_fb6add83b1a7acc94433d38569; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fb6add83b1a7acc94433d38569" ON public.chat_participants USING btree ("userId");


--
-- Name: IDX_fe0bb3f6520ee0469504521e71; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON public.users USING btree (username);


--
-- Name: idx_messages_filename; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_filename ON public.messages USING btree (filename);


--
-- Name: idx_messages_fileurl; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_fileurl ON public.messages USING btree (fileurl);


--
-- Name: messages FK_2db9cf2b3ca111742793f6c37ce; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages FK_36bc604c820bb9adc4c75cd4115; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: chat_participants FK_chat_participants_last_read_message; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT "FK_chat_participants_last_read_message" FOREIGN KEY ("lastReadMessageId") REFERENCES public.messages(id) ON DELETE SET NULL;


--
-- Name: chats FK_chats_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "FK_chats_created_by" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: chat_participants FK_e16675fae83bc603f30ae8fbdd5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5" FOREIGN KEY ("chatId") REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: chat_participants FK_fb6add83b1a7acc94433d385692; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT "FK_fb6add83b1a7acc94433d385692" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

