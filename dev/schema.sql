--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4 (Debian 10.4-2.pgdg90+1)
-- Dumped by pg_dump version 10.4 (Debian 10.4-2.pgdg90+1)

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


ALTER TYPE public.roles OWNER TO postgres;

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


ALTER TABLE public.announcements OWNER TO postgres;

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


ALTER TABLE public.announcements_id_seq OWNER TO postgres;

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


ALTER TABLE public.chat_words OWNER TO postgres;

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


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: pugs; Type: TABLE; Schema: public; Owner: hlpugs
--

CREATE TABLE public.pugs (
    id integer NOT NULL,
    match_data json DEFAULT '{"matches": [ {"draft": {}, "game": {} }] }'::json NOT NULL,
    date integer NOT NULL
);


ALTER TABLE public.pugs OWNER TO postgres;

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


ALTER TABLE public.pugs_date_seq OWNER TO postgres;

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


ALTER TABLE public.pugs_id_seq OWNER TO postgres;

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


ALTER TABLE public.punishments OWNER TO postgres;

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


ALTER TABLE public.punishments_id_seq OWNER TO postgres;

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
-- PostgreSQL database dump complete
--
