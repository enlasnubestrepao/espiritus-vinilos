--
-- PostgreSQL database dump
--


-- Dumped from database version 17.11 (11592b3)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-1.pgdg24.04+2)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "public";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: app_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."app_config" (
    "key" "text" NOT NULL,
    "value" "text"
);


--
-- Name: rums; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."rums" (
    "id" integer NOT NULL,
    "brand" "text",
    "name" "text",
    "type" "text",
    "country" "text",
    "abv" numeric,
    "blend" "text",
    "age_low" integer,
    "age_max" integer,
    "region" "text",
    "scale" numeric,
    "url" "text",
    "cover_url" "text",
    "terminado" boolean DEFAULT false,
    "buy_url" "text",
    "buy_price" "text",
    "buy_currency" "text",
    "buy_availability" "text"
);


--
-- Name: rums_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."rums_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."rums_id_seq" OWNED BY "public"."rums"."id";


--
-- Name: session_clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."session_clients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "phone" "text",
    "token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: session_spirits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."session_spirits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "spirit_type" "text" NOT NULL,
    "spirit_id" integer NOT NULL,
    "brand" "text" NOT NULL,
    "name" "text" NOT NULL,
    "buy_price" numeric(10,2),
    "buy_currency" "text" DEFAULT 'COP'::"text",
    "added_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "session_spirits_spirit_type_check" CHECK (("spirit_type" = ANY (ARRAY['rum'::"text", 'whisky'::"text"])))
);


--
-- Name: session_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."session_templates" (
    "id" smallint NOT NULL,
    "slug" "text" NOT NULL,
    "name_es" "text" NOT NULL,
    "tagline_es" "text" NOT NULL,
    "allowed_genres" "text"[],
    "preferred_spirit" "text",
    "accent_color" "text" NOT NULL
);


--
-- Name: session_tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."session_tracks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "vinyl_id" integer NOT NULL,
    "spotify_track_id" "text" NOT NULL,
    "track_name" "text" NOT NULL,
    "artist_name" "text" NOT NULL,
    "duration_ms" integer NOT NULL,
    "track_number" smallint,
    "added_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "session_tracks_duration_ms_check" CHECK (("duration_ms" > 0))
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "client_id" "uuid" NOT NULL,
    "template_id" smallint NOT NULL,
    "name" "text" NOT NULL,
    "people_count" smallint NOT NULL,
    "notes" "text",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "sessions_people_count_check" CHECK ((("people_count" >= 2) AND ("people_count" <= 8))),
    CONSTRAINT "sessions_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'submitted'::"text", 'quoted'::"text", 'confirmed'::"text", 'executed'::"text"])))
);


--
-- Name: session_preview; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."session_preview" AS
 SELECT "s"."id",
    "s"."name",
    "s"."people_count",
    "s"."status",
    "s"."notes",
    "t"."name_es" AS "template_name",
    "t"."tagline_es" AS "template_tagline",
    "t"."accent_color",
    "count"(DISTINCT "st"."id") AS "track_count",
    COALESCE("sum"("st"."duration_ms"), (0)::bigint) AS "total_duration_ms",
    COALESCE((("sum"("st"."duration_ms"))::numeric / 60000.0), (0)::numeric) AS "total_duration_min",
    "count"(DISTINCT "sp"."id") AS "spirit_count",
    COALESCE("sum"("sp"."buy_price"), (0)::numeric) AS "spirits_total_price",
    "array_agg"(DISTINCT "st"."artist_name") FILTER (WHERE ("st"."artist_name" IS NOT NULL)) AS "artists",
    "array_agg"(DISTINCT "sp"."brand") FILTER (WHERE ("sp"."brand" IS NOT NULL)) AS "spirit_brands"
   FROM ((("public"."sessions" "s"
     JOIN "public"."session_templates" "t" ON (("t"."id" = "s"."template_id")))
     LEFT JOIN "public"."session_tracks" "st" ON (("st"."session_id" = "s"."id")))
     LEFT JOIN "public"."session_spirits" "sp" ON (("sp"."session_id" = "s"."id")))
  GROUP BY "s"."id", "s"."name", "s"."people_count", "s"."status", "s"."notes", "t"."name_es", "t"."tagline_es", "t"."accent_color";


--
-- Name: vinyls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."vinyls" (
    "id" integer NOT NULL,
    "artista" "text",
    "album" "text",
    "genero" "text",
    "agrupador" "text",
    "anio" integer,
    "pais" "text",
    "sello" "text",
    "pais_sello" "text",
    "cat_num" "text",
    "origen" "text",
    "fuera" boolean DEFAULT false,
    "discogs" boolean DEFAULT false,
    "cover_url" "text",
    "url" "text",
    "spotify_id" "text",
    "tiktok_url" "text",
    "ig_url" "text",
    "spotify_album_id" "text",
    "tracks" "jsonb",
    "tracks_fetched_at" timestamp with time zone,
    "notes" "text",
    "credits" "jsonb" DEFAULT '[]'::"jsonb"
);


--
-- Name: vinyls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."vinyls_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vinyls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."vinyls_id_seq" OWNED BY "public"."vinyls"."id";


--
-- Name: whiskies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."whiskies" (
    "id" integer NOT NULL,
    "brand" "text",
    "version" "text",
    "type" "text",
    "origin" "text",
    "country" "text",
    "abv" numeric,
    "years" integer,
    "region" "text",
    "distillery" "text",
    "url" "text",
    "cover_url" "text",
    "terminado" boolean DEFAULT false,
    "buy_url" "text",
    "buy_price" "text",
    "buy_currency" "text",
    "buy_availability" "text"
);


--
-- Name: whiskies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."whiskies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: whiskies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."whiskies_id_seq" OWNED BY "public"."whiskies"."id";


--
-- Name: rums id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rums" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."rums_id_seq"'::"regclass");


--
-- Name: vinyls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."vinyls" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."vinyls_id_seq"'::"regclass");


--
-- Name: whiskies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."whiskies" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."whiskies_id_seq"'::"regclass");


--
-- Name: app_config app_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."app_config"
    ADD CONSTRAINT "app_config_pkey" PRIMARY KEY ("key");


--
-- Name: rums rums_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rums"
    ADD CONSTRAINT "rums_pkey" PRIMARY KEY ("id");


--
-- Name: session_clients session_clients_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_clients"
    ADD CONSTRAINT "session_clients_email_key" UNIQUE ("email");


--
-- Name: session_clients session_clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_clients"
    ADD CONSTRAINT "session_clients_pkey" PRIMARY KEY ("id");


--
-- Name: session_clients session_clients_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_clients"
    ADD CONSTRAINT "session_clients_token_key" UNIQUE ("token");


--
-- Name: session_spirits session_spirits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_spirits"
    ADD CONSTRAINT "session_spirits_pkey" PRIMARY KEY ("id");


--
-- Name: session_templates session_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_templates"
    ADD CONSTRAINT "session_templates_pkey" PRIMARY KEY ("id");


--
-- Name: session_templates session_templates_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_templates"
    ADD CONSTRAINT "session_templates_slug_key" UNIQUE ("slug");


--
-- Name: session_tracks session_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_tracks"
    ADD CONSTRAINT "session_tracks_pkey" PRIMARY KEY ("id");


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- Name: vinyls vinyls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."vinyls"
    ADD CONSTRAINT "vinyls_pkey" PRIMARY KEY ("id");


--
-- Name: whiskies whiskies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."whiskies"
    ADD CONSTRAINT "whiskies_pkey" PRIMARY KEY ("id");


--
-- Name: session_spirits session_spirits_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_spirits"
    ADD CONSTRAINT "session_spirits_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;


--
-- Name: session_tracks session_tracks_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."session_tracks"
    ADD CONSTRAINT "session_tracks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."session_clients"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."session_templates"("id");


--
-- PostgreSQL database dump complete
--


