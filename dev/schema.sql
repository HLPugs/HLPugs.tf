--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4 (Debian 10.4-2.pgdg90+1)
-- Dumped by pg_dump version 10.5 (Ubuntu 10.5-0ubuntu0.18.04)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE hlpugs;
--
-- Name: hlpugs; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE hlpugs WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE hlpugs OWNER TO postgres;

\connect hlpugs

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: roles; Type: TYPE; Schema: public; Owner: hlpugs
--

CREATE TYPE public.roles AS ENUM (
    'patron',
    'voiceActor',
    'developer'
);


ALTER TYPE public.roles OWNER TO hlpugs;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: hlpugs
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    region text NOT NULL,
    content text NOT NULL,
    creator text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now(),
    priority boolean DEFAULT false
);


ALTER TABLE public.announcements OWNER TO hlpugs;

--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: hlpugs
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.announcements_id_seq OWNER TO hlpugs;

--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hlpugs
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: chat_words; Type: TABLE; Schema: public; Owner: hlpugs
--

CREATE TABLE public.chat_words (
    blacklist text[] DEFAULT ARRAY[]::text[],
    whitelist text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.chat_words OWNER TO hlpugs;

--
-- Name: TABLE chat_words; Type: COMMENT; Schema: public; Owner: hlpugs
--

COMMENT ON TABLE public.chat_words IS 'Contains the whitelist and blacklist of words in HLPugs chat';


--
-- Name: players; Type: TABLE; Schema: public; Owner: hlpugs
--

CREATE TABLE public.players (
    steamid text NOT NULL,
    iscaptain boolean DEFAULT false,
    avatar text NOT NULL,
    alias text,
    isleagueadmin boolean DEFAULT false,
    staffrole text DEFAULT false,
    roles public.roles[] DEFAULT ARRAY[]::public.roles[],
    settings json,
    ips text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.players OWNER TO hlpugs;

--
-- Name: pugs; Type: TABLE; Schema: public; Owner: hlpugs
--

CREATE TABLE public.pugs (
    id integer NOT NULL,
    match_data json DEFAULT '{"matches": [ {"draft": {}, "game": {} }] }'::json NOT NULL,
    date integer NOT NULL
);


ALTER TABLE public.pugs OWNER TO hlpugs;

--
-- Name: pugs_date_seq; Type: SEQUENCE; Schema: public; Owner: hlpugs
--

CREATE SEQUENCE public.pugs_date_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pugs_date_seq OWNER TO hlpugs;

--
-- Name: pugs_date_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hlpugs
--

ALTER SEQUENCE public.pugs_date_seq OWNED BY public.pugs.date;


--
-- Name: pugs_id_seq; Type: SEQUENCE; Schema: public; Owner: hlpugs
--

CREATE SEQUENCE public.pugs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pugs_id_seq OWNER TO hlpugs;

--
-- Name: pugs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hlpugs
--

ALTER SEQUENCE public.pugs_id_seq OWNED BY public.pugs.id;


--
-- Name: punishments; Type: TABLE; Schema: public; Owner: hlpugs
--

CREATE TABLE public.punishments (
    id integer NOT NULL,
    steamid text NOT NULL,
    type text NOT NULL,
    timeline json
);


ALTER TABLE public.punishments OWNER TO hlpugs;

--
-- Name: TABLE punishments; Type: COMMENT; Schema: public; Owner: hlpugs
--

COMMENT ON TABLE public.punishments IS 'Punishments stored with their updates';


--
-- Name: COLUMN punishments.steamid; Type: COMMENT; Schema: public; Owner: hlpugs
--

COMMENT ON COLUMN public.punishments.steamid IS 'SteamID of the user who was punished';


--
-- Name: COLUMN punishments.type; Type: COMMENT; Schema: public; Owner: hlpugs
--

COMMENT ON COLUMN public.punishments.type IS 'Type of punishment issued';


--
-- Name: COLUMN punishments.timeline; Type: COMMENT; Schema: public; Owner: hlpugs
--

COMMENT ON COLUMN public.punishments.timeline IS 'An array of updates for this punishment. Each update has a timestamp, a creator and a reason.';


--
-- Name: punishments_id_seq; Type: SEQUENCE; Schema: public; Owner: hlpugs
--

CREATE SEQUENCE public.punishments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.punishments_id_seq OWNER TO hlpugs;

--
-- Name: punishments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hlpugs
--

ALTER SEQUENCE public.punishments_id_seq OWNED BY public.punishments.id;


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: pugs id; Type: DEFAULT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.pugs ALTER COLUMN id SET DEFAULT nextval('public.pugs_id_seq'::regclass);


--
-- Name: pugs date; Type: DEFAULT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.pugs ALTER COLUMN date SET DEFAULT nextval('public.pugs_date_seq'::regclass);


--
-- Name: punishments id; Type: DEFAULT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.punishments ALTER COLUMN id SET DEFAULT nextval('public.punishments_id_seq'::regclass);


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: hlpugs
--

COPY public.announcements (id, region, content, creator, "timestamp", priority) FROM stdin;
1	NA	Hello world from PostgreSQL!	76561198119135809	2018-07-30 04:38:41.559227	f
\.


--
-- Data for Name: chat_words; Type: TABLE DATA; Schema: public; Owner: hlpugs
--

COPY public.chat_words (blacklist, whitelist) FROM stdin;
{badword,badword2,badword3}	{badword}
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: hlpugs
--

COPY public.players (steamid, iscaptain, avatar, alias, isleagueadmin, staffrole, roles, settings, ips) FROM stdin;
76561198025723087	f	https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/91/91b4809e6b19b9999471ff6d062cf19850c97610_medium.jpg	kala	f	\N	{}	\N	{127,182}
76561198057684737	f	https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fa/fa31ebf63ca16337a9f2894bdf5a45b33254f0cb_medium.jpg	Nicell	f	\N	{}	\N	{127,182}
127.2.2.1	f	test	\N	f	false	{}	\N	{127,182}
test	f	test		f	false	{}	\N	{127,182}
test2	f	test	\N	f	false	{}	\N	{127,182}
76561198119135809	f	https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ba/bae002cf4909ff02182fccb3cefef10e3fdb8e8f_medium.jpg	Gabe	f	false	{patron}	\N	{::1,12345}
\.


--
-- Data for Name: pugs; Type: TABLE DATA; Schema: public; Owner: hlpugs
--

COPY public.pugs (id, match_data, date) FROM stdin;
\.


--
-- Data for Name: punishments; Type: TABLE DATA; Schema: public; Owner: hlpugs
--

COPY public.punishments (id, steamid, type, timeline) FROM stdin;
1	76561198119135809	ban	\N
4	76561198119135809	warning	\N
5	76561198119135809	warning	\N
6	76561198119135809	mute	\N
7	76561198119135809	ban	\N
8	76561198119135809	mute	\N
10	76561198119135809	mute	\N
11	76561198119135809	ban	\N
14	76561198119135809	ban	{ "punishments": [{"expiration": "2018-07-20 08:42:38.014925", "issued_on": "2018-07-18 06:41:08.076243", "reason": "new", "creator": "76561198119135809"}]}
12	76561198119135809	mute	{ "punishments": [{"expiration": "2018-07-17 08:42:38.014925", "issued_on": "2018-07-15 06:41:08.076243", "reason": "old", "creator": "76561198119135809"}]}
9	76561198119135809	mute	{ "punishments": [{"expiration": "2019-07-22 08:42:38.014925", "issued_on": "2018-07-18 06:41:08.076243", "reason": "other reason", "creator": "76561198119135809"}]}
16	76561198119135809	ban	{ "punishments": [{"expiration": "2018-07-23 08:42:38.014925", "issued_on": "2018-07-18 06:41:08.076243", "reason": "new", "creator": "76561198119135809"}]}
13	76561198119135809	ban	{ "punishments": [{"expiration": "2018-07-20 08:42:38.014925", "issued_on": "2018-07-20 06:41:08.076243", "reason": "new", "creator": "76561198119135809"}]}
15	76561198119135809	ban	{ "punishments": [{"expiration": "2018-07-21 08:42:38.014925", "issued_on": "2018-07-18 06:41:08.03", "reason": "new", "creator": "76561198119135809"}]}
\.


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hlpugs
--

SELECT pg_catalog.setval('public.announcements_id_seq', 1, true);


--
-- Name: pugs_date_seq; Type: SEQUENCE SET; Schema: public; Owner: hlpugs
--

SELECT pg_catalog.setval('public.pugs_date_seq', 1, false);


--
-- Name: pugs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hlpugs
--

SELECT pg_catalog.setval('public.pugs_id_seq', 1, false);


--
-- Name: punishments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hlpugs
--

SELECT pg_catalog.setval('public.punishments_id_seq', 16, true);


--
-- Name: announcements announcements_pk; Type: CONSTRAINT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pk PRIMARY KEY (id);


--
-- Name: punishments punishments_id_pk; Type: CONSTRAINT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.punishments
    ADD CONSTRAINT punishments_id_pk PRIMARY KEY (id);


--
-- Name: players users_steamid_key; Type: CONSTRAINT; Schema: public; Owner: hlpugs
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT users_steamid_key UNIQUE (steamid);


--
-- Name: punishments_id_uindex; Type: INDEX; Schema: public; Owner: hlpugs
--

CREATE UNIQUE INDEX punishments_id_uindex ON public.punishments USING btree (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

