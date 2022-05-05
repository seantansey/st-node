-- TablePlus 4.6.4(414)
--
-- https://tableplus.com/
--
-- Database: st_web
-- Generation Time: 2022-05-04 17:29:02.0740
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."messages";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS messages_id_seq;

-- Table Definition
CREATE TABLE "public"."messages" (
    "id" int4 NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "subject" varchar NOT NULL,
    "message" text NOT NULL,
    "send_date" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
