import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";
import { desc } from "drizzle-orm";

import { json } from "@remix-run/node";
import db from "db/db";
import { tag_assignments } from "db/schema";
import { useState } from "react";
import { genPdf } from "~/utils/genPdf";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const result = await db
    .select()
    .from(tag_assignments)
    .orderBy(desc(tag_assignments.created_at));
  return json({ tag_assignments: result });
};

export default function Index() {
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
  const [offset, setOffset] = useState("0");
  const { tag_assignments } = useLoaderData<typeof loader>();
  const disabledKeys = tag_assignments
    .filter((tag) => !tag.spotify_image || !tag.name)
    .map((tag) => `${tag.id}`);
  return (
    <>
      <div className="text-center text-xl mb-6">
        <h1>NFC Tags</h1>
      </div>
      <div className="flex  gap-4">
        <Input
          name="offset"
          label="Offset"
          type="number"
          min={0}
          value={offset}
          onValueChange={setOffset}
          className="max-w-xs mb-4"
        />
        <Button
          type="submit"
          className="mb-4"
          onClick={() => {
            // @ts-expect-error - type in lib is wrong, if you select all its set to the string all
            if (selectedKeys === "all") {
              genPdf(
                // @ts-expect-error - too lazy to typeguard this
                tag_assignments.filter(
                  (tag) => !!tag.spotify_image && !!tag.name,
                ),
                parseInt(offset),
              );
            } else {
              const selectedTags = tag_assignments.filter((tag) =>
                selectedKeys.has(`${tag.id}`),
              );
              // @ts-expect-error - too lazy to typeguard this
              genPdf(selectedTags, parseInt(offset));
            }
          }}
        >
          Print Selected Labels
        </Button>
      </div>
      <Table
        aria-label="Example static collection table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        // @ts-expect-error - type in lib is wrong, this is straight up from their docs...
        onSelectionChange={setSelectedKeys}
        disabledKeys={disabledKeys}
      >
        <TableHeader>
          <TableColumn>TAG ID</TableColumn>
          <TableColumn>IMAGE</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>SPOTIFY TYPE</TableColumn>
          <TableColumn>SPOTIFY ID</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>UPDATED AT</TableColumn>
        </TableHeader>
        <TableBody>
          {tag_assignments.map((tag_assignment) => (
            <TableRow key={tag_assignment.id}>
              <TableCell>{tag_assignment.tag_id}</TableCell>
              <TableCell>
                {tag_assignment.spotify_image && (
                  <img src={tag_assignment.spotify_image} alt="" width="50" />
                )}
              </TableCell>
              <TableCell>{tag_assignment.name}</TableCell>
              <TableCell>{tag_assignment.spotify_type}</TableCell>
              <TableCell>{tag_assignment.spotify_id}</TableCell>
              <TableCell>
                {new Date(tag_assignment.created_at ?? "").toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(tag_assignment.updated_at ?? "").toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
