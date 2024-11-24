import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { InferSelectModel } from "drizzle-orm";

import { tag_assignments as tag_assignments_schema } from "db/schema";
import { Form } from "@remix-run/react";

export default function SearchResultItem({
  id,
  name,
  images,
  type,
  tag_assignments,
}: {
  id: string;
  name: string;
  type: string;
  images: { url: string }[];
  tag_assignments: InferSelectModel<typeof tag_assignments_schema>[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (!tag_assignments) return null;
  return (
    <>
      <Card className="py-4" key={id}>
        <CardBody className="overflow-visible py-2 items-center content-center">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={images[0].url}
            width={270}
          />
        </CardBody>
        <CardFooter className="pb-0 pt-2 px-4 flex-col items-center content-center justify-center text-center">
          <h4 className="font-bold mb-4">{name}</h4>
          <Button onPress={onOpen}>Link Tag</Button>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <Form id={`tag-assign-form-${id}`} method="post">
                <ModalHeader className="flex flex-col gap-1">
                  Link {name} to NFC Tag
                </ModalHeader>
                <ModalBody>
                  <Autocomplete
                    defaultItems={tag_assignments}
                    variant="bordered"
                    label="Assigned to"
                    placeholder="Select a Tag"
                    labelPlacement="inside"
                    name="tag_id"
                  >
                    {(tag_assignment) => (
                      <AutocompleteItem
                        key={tag_assignment.tag_id}
                        textValue={tag_assignment.tag_id}
                      >
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col">
                            <span className="text-small">
                              {tag_assignment.tag_id} (
                              {new Date(
                                tag_assignment.created_at ?? "",
                              ).toLocaleString()}
                              )
                            </span>
                            <span className="text-tiny text-default-400">
                              {tag_assignment.name || "Unassigned"}
                            </span>
                          </div>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    type="submit"
                    name="intent"
                    value="assign_tag"
                  >
                    Assign
                  </Button>
                </ModalFooter>
                <input type="hidden" name="spotify_id" value={id} />
                <input type="hidden" name="spotify_type" value={type} />
                <input type="hidden" name="name" value={name} />
                <input type="hidden" name="image" value={images[0].url} />
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
