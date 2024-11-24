import { Button, Input } from "@nextui-org/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import db from "db/db";
import { tag_assignments } from "db/schema";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!formData.has("tag_id") || formData.get("tag_id") === "") {
    return json({ message: "Tag ID is required", status: "error" });
  }
  const tag_id = (formData.get("tag_id") as string).trim();
  try {
    await db.insert(tag_assignments).values({ tag_id });
    return json({ message: "Tag created", status: "success" });
  } catch (error) {
    if (error instanceof Error && typeof error.message === "string") {
      return json({ message: error.message, status: "error" });
    }
    return json({ message: "Creation failed", status: "error" });
  }
};

export default function AddTag() {
  const actionData = useActionData<typeof action>();
  const message = actionData?.message;
  return (
    <div>
      <div className="text-center text-xl mb-6">
        <h1>Add NFC Tag</h1>
        {message && (
          <p
            className={`m-6 ${actionData.status === "error" ? "text-danger" : "text-success"}`}
          >
            {message}
          </p>
        )}
      </div>
      <Form id="create-tag-form" method="post">
        <div className="flex w-full flex-wrap gap-4">
          <Input label="NFC Tag ID" name="tag_id" isRequired />
          <div className="block">
            You can add the Spotify data later via Browse Catalog
          </div>
        </div>

        <p className="mt-6">
          <Button type="submit" color="primary" className="mr-4">
            Save
          </Button>
        </p>
      </Form>
    </div>
  );
}
