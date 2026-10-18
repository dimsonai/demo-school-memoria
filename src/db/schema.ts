import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const memories = pgTable(
  "memories",
  {
    id: serial("id").primaryKey(),
    albumId: integer("album_id").references(() => albums.id, { onDelete: "set null" }),
    type: text("type", { enum: ["photo", "video"] }).notNull(),
    filePath: text("file_path").notNull(),
    fileName: text("file_name"),
    size: integer("size"),
    caption: text("caption"),
    author: text("author"),
    takenAt: timestamp("taken_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("memories_album_idx").on(t.albumId), index("memories_created_idx").on(t.createdAt)]
);

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    memoryId: integer("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("comments_memory_idx").on(t.memoryId)]
);

export const albumsRelations = relations(albums, ({ many }) => ({
  memories: many(memories),
}));

export const memoriesRelations = relations(memories, ({ one, many }) => ({
  album: one(albums, { fields: [memories.albumId], references: [albums.id] }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  memory: one(memories, { fields: [comments.memoryId], references: [memories.id] }),
}));

export type Album = typeof albums.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type Wish = typeof wishes.$inferSelect;
export type Comment = typeof comments.$inferSelect;
