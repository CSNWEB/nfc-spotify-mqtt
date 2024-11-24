import { Button, Checkbox, Input } from "@nextui-org/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import SearchResultItem from "~/components/SearchResultItem";

import { asc, desc, eq } from "drizzle-orm";

import db from "db/db";
import { tag_assignments } from "db/schema";

const ensureArray = (value: string | string[]) =>
  Array.isArray(value) ? value : [value];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  if (intent === "search") {
    const types = ensureArray(formData.getAll("types"));

    if (types.length === 0) {
      return json({
        message: "At least one type (track, album, playlist) is required",
        status: "error",
      });
    }
    if (!formData.has("query") || formData.get("query") === "") {
      return json({ message: "Query is required", status: "error" });
    }

    const sdk = SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID,
      process.env.SPOTIFY_CLIENT_SECRET,
      [],
    );

    const result = await sdk.search(
      formData.get("query") as string,
      types,
      "DE",
    );

    return json({ ...result, status: "success" });
  } else if (intent === "assign_tag") {
    const data = {
      tag_id: formData.get("tag_id"),
      spotify_type: formData.get("spotify_type"),
      spotify_id: formData.get("spotify_id"),
      spotify_image: formData.get("image"),
      name: formData.get("name"),
    };
    try {
      const result = await db
        .update(tag_assignments)
        .set(data)
        .where(eq(tag_assignments.tag_id, data.tag_id));
      return json({
        message: `Tag ${data.tag_id} successfully assigned to ${data.name}.`,
        status: "success",
      });
    } catch (error) {
      if ("message" in error) {
        return json({ message: error.message, status: "error" });
      }
      return json({ message: "Assigning tag failed.", status: "error" });
    }
  }
  return json({ message: "Invalid intent", status: "error" });
};

export const loader = async () => {
  const result = await db
    .select()
    .from(tag_assignments)
    .orderBy(asc(tag_assignments.spotify_id), desc(tag_assignments.created_at));
  return json({ tag_assignments: result });
};

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export default function Browse() {
  const actionData = useActionData<typeof action>();
  const { tag_assignments } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="text-center text-xl mb-6">
        <h1>Browse</h1>
      </div>
      <Form id="search-form" method="post">
        <div className="flex gap-8 flex-wrap md:flex-nowrap">
          <Input
            name="query"
            classNames={{
              base: "h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search"
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
          <div className="flex gap-4">
            <Checkbox size="md" name="types" value="track">
              Track
            </Checkbox>
            <Checkbox defaultSelected size="md" name="types" value="album">
              Album
            </Checkbox>
            <Checkbox size="md" name="types" value="playlist">
              Playlist
            </Checkbox>
          </div>
          <Button
            size="small"
            color="primary"
            type="submit"
            name="intent"
            value="search"
          >
            Search
          </Button>
        </div>
      </Form>
      {actionData &&
        ("message" in actionData ? (
          <p
            className={`${
              actionData.status === "error" ? "text-danger" : "text-success"
            } m-6 text-center text-xl`}
          >
            {actionData.message}
          </p>
        ) : (
          <div>
            {actionData.tracks && (
              <div>
                <h2 className="text-xl text-center mb-4 mt-8">Tracks</h2>
                <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                  {actionData.tracks.items.map((track) => (
                    <SearchResultItem
                      key={track.id}
                      {...track}
                      images={track.album.images}
                      tag_assignments={tag_assignments}
                    />
                  ))}
                </div>
              </div>
            )}
            {actionData.albums && (
              <div>
                <h2 className="text-xl text-center mb-4 mt-8">Albums</h2>
                <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                  {actionData.albums.items.map((album) => (
                    <SearchResultItem
                      key={album.id}
                      {...album}
                      tag_assignments={tag_assignments}
                    />
                  ))}
                </div>
              </div>
            )}
            {actionData.playlists && (
              <div>
                <h2 className="text-xl text-center mb-4 mt-8">Playlists</h2>
                <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                  {actionData.playlists.items.map((playlist) => (
                    <SearchResultItem
                      key={playlist.id}
                      {...playlist}
                      tag_assignments={tag_assignments}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
